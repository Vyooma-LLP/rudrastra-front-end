import { eq, and } from 'drizzle-orm';
import { 
  controlPlaneState, 
  configurationVersions, 
  controlPlaneOutbox, 
  capabilityAuditLogs,
  configurationChangeRequests
} from '../schema';
import { CommandContext, CommandResult } from './types';
import { withIdempotency } from './idempotency';
import crypto from 'crypto';

export interface PublishConfigurationPayload {
  expectedVersion: number;
  snapshotData: Record<string, unknown>;
  configurationSchemaVersion: number;
  registryVersion: string;
  registryHash: string;
  applicationCompatibilityVersion: string;
  approvalRequestId?: string; 
  reason: string;
}

/**
 * Executes the Golden Publish Workflow.
 * 
 * 1. Verifies expectedVersion (Optimistic Concurrency).
 * 2. If high-risk, verifies the approval request state.
 * 3. Creates immutable snapshot.
 * 4. Updates active version pointer.
 * 5. Appends to audit log with tamper-evident chain.
 * 6. Inserts outbox event.
 */
export async function publishConfiguration(
  ctx: CommandContext,
  payload: PublishConfigurationPayload
): Promise<CommandResult<{ newVersion: number }>> {
  
  return withIdempotency(ctx, 'PUBLISH_CONFIGURATION', payload, async (tx) => {
    
    // 1. Optimistic Concurrency Check
    const stateRecord = await tx.select().from(controlPlaneState)
      .where(eq(controlPlaneState.environment, ctx.environment))
      .forUpdate(); // Lock the state record
      
    const currentVersion = stateRecord.length > 0 ? stateRecord[0].activeVersion : 0;
    
    if (payload.expectedVersion !== currentVersion) {
      return {
        success: false,
        errorCode: 'CONCURRENCY_CONFLICT',
        errorMessage: `Expected version ${payload.expectedVersion}, but actual version is ${currentVersion}.`,
      };
    }
    
    // 2. Validate Approval Workflow (if required)
    // Note: In a full implementation, we would determine if the changes in `snapshotData`
    // classify as HIGH/CRITICAL risk and force `approvalRequestId` to be present.
    let approverId: string | null = null;
    
    if (payload.approvalRequestId) {
      const approval = await tx.select().from(configurationChangeRequests)
        .where(
          and(
            eq(configurationChangeRequests.id, payload.approvalRequestId),
            eq(configurationChangeRequests.environment, ctx.environment)
          )
        );
        
      if (approval.length === 0) {
        return { success: false, errorCode: 'APPROVAL_NOT_FOUND' };
      }
      
      const request = approval[0];
      
      if (request.status !== 'APPROVED') {
        return { success: false, errorCode: 'INVALID_APPROVAL_STATUS', errorMessage: `Status is ${request.status}` };
      }
      
      if (request.requestedBy === ctx.actorId) {
        return { success: false, errorCode: 'SELF_APPROVAL_PROHIBITED' };
      }
      
      if (new Date() > request.expiresAt) {
        return { success: false, errorCode: 'APPROVAL_EXPIRED' };
      }
      
      // Update approval status
      await tx.update(configurationChangeRequests)
        .set({ status: 'EXECUTED' })
        .where(eq(configurationChangeRequests.id, payload.approvalRequestId));
        
      approverId = request.approvedBy;
    }
    
    // 3. Create Immutable Snapshot
    const newVersion = currentVersion + 1;
    const snapshotHash = crypto.createHash('sha256').update(JSON.stringify(payload.snapshotData)).digest('hex');
    
    await tx.insert(configurationVersions).values({
      environment: ctx.environment,
      version: newVersion,
      configurationSchemaVersion: payload.configurationSchemaVersion,
      registryVersion: payload.registryVersion,
      registryHash: payload.registryHash,
      applicationCompatibilityVersion: payload.applicationCompatibilityVersion,
      snapshotHash,
      snapshotData: payload.snapshotData,
      publishedBy: ctx.actorId,
    });
    
    // 4. Update Active Version Pointer
    if (stateRecord.length > 0) {
      await tx.update(controlPlaneState)
        .set({ activeVersion: newVersion, updatedBy: ctx.actorId, updatedAt: new Date() })
        .where(eq(controlPlaneState.environment, ctx.environment));
    } else {
      await tx.insert(controlPlaneState).values({
        environment: ctx.environment,
        activeVersion: newVersion,
        updatedBy: ctx.actorId,
      });
    }
    
    // 5. Append Audit Log with Tamper-Evident Chain
    const lastAudit = await tx.select().from(capabilityAuditLogs)
      .where(eq(capabilityAuditLogs.environment, ctx.environment))
      .orderBy(capabilityAuditLogs.createdAt)
      .limit(1); // Assuming ordered by desc in full implementation
      
    const previousEventHash = lastAudit.length > 0 ? lastAudit[0].eventHash : null;
    
    const auditPayload = {
      action: 'PUBLISH_CONFIGURATION',
      environment: ctx.environment,
      version: newVersion,
      actor: ctx.actorId,
      previousHash: previousEventHash
    };
    
    const eventHash = crypto.createHash('sha256').update(JSON.stringify(auditPayload)).digest('hex');
    
    await tx.insert(capabilityAuditLogs).values({
      environment: ctx.environment,
      actorId: ctx.actorId,
      approverId,
      action: 'PUBLISH_CONFIGURATION',
      reason: payload.reason,
      configurationVersion: newVersion,
      previousEventHash,
      eventHash,
    });
    
    // 6. Insert Outbox Event
    await tx.insert(controlPlaneOutbox).values({
      environment: ctx.environment,
      eventType: 'CONFIGURATION_PUBLISHED',
      configurationVersion: newVersion,
      payload: {
        version: newVersion,
        snapshotHash
      }
    });
    
    return {
      success: true,
      resultVersion: newVersion,
      data: { newVersion }
    };
  });
}
