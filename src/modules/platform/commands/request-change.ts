import { eq, and } from 'drizzle-orm';
import { 
  configurationChangeRequests,
  capabilityAuditLogs
} from '../schema';
import { CommandContext, CommandResult } from './types';
import { withIdempotency } from './idempotency';
import crypto from 'crypto';

export interface RequestConfigurationChangePayload {
  baseVersion: number;
  changePayload: Record<string, unknown>;
  riskClass: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  validitySeconds: number; // e.g. 86400 for 24 hours
  reason: string;
}

export async function requestConfigurationChange(
  ctx: CommandContext,
  payload: RequestConfigurationChangePayload
): Promise<CommandResult<{ requestId: string }>> {
  
  return withIdempotency(ctx, 'REQUEST_CHANGE', payload, async (tx) => {
    
    const changePayloadHash = crypto.createHash('sha256').update(JSON.stringify(payload.changePayload)).digest('hex');
    const expiresAt = new Date(Date.now() + payload.validitySeconds * 1000);
    
    // 1. Insert Request
    const [inserted] = await tx.insert(configurationChangeRequests).values({
      environment: ctx.environment,
      baseVersion: payload.baseVersion,
      requestedBy: ctx.actorId,
      status: 'REQUESTED',
      changePayload: payload.changePayload,
      changePayloadHash,
      riskClass: payload.riskClass,
      expiresAt,
    }).returning({ id: configurationChangeRequests.id });
    
    // 2. Audit Event
    const lastAudit = await tx.select().from(capabilityAuditLogs)
      .where(eq(capabilityAuditLogs.environment, ctx.environment))
      .orderBy(capabilityAuditLogs.createdAt)
      .limit(1);
      
    const previousEventHash = lastAudit.length > 0 ? lastAudit[0].eventHash : null;
    const auditPayload = {
      action: 'REQUEST_CONFIGURATION_CHANGE',
      environment: ctx.environment,
      actor: ctx.actorId,
      requestId: inserted.id,
      previousHash: previousEventHash
    };
    
    const eventHash = crypto.createHash('sha256').update(JSON.stringify(auditPayload)).digest('hex');
    
    await tx.insert(capabilityAuditLogs).values({
      environment: ctx.environment,
      actorId: ctx.actorId,
      action: 'REQUEST_CONFIGURATION_CHANGE',
      reason: payload.reason,
      requestId: inserted.id,
      previousEventHash,
      eventHash,
    });
    
    return {
      success: true,
      data: { requestId: inserted.id }
    };
  });
}

export interface ApproveConfigurationChangePayload {
  requestId: string;
  expectedPayloadHash: string; // Binding to the exact requested change
  reason: string;
}

export async function approveConfigurationChange(
  ctx: CommandContext,
  payload: ApproveConfigurationChangePayload
): Promise<CommandResult<void>> {
  
  return withIdempotency(ctx, 'APPROVE_CHANGE', payload, async (tx) => {
    
    // 1. Lock and Verify Request
    const requests = await tx.select().from(configurationChangeRequests)
      .where(
        and(
          eq(configurationChangeRequests.id, payload.requestId),
          eq(configurationChangeRequests.environment, ctx.environment)
        )
      )
      .forUpdate(); // Lock the row
      
    if (requests.length === 0) {
      return { success: false, errorCode: 'REQUEST_NOT_FOUND' };
    }
    
    const request = requests[0];
    
    if (request.status !== 'REQUESTED') {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: `Cannot approve in status ${request.status}` };
    }
    
    if (request.requestedBy === ctx.actorId) {
      return { success: false, errorCode: 'SELF_APPROVAL_PROHIBITED' };
    }
    
    if (new Date() > request.expiresAt) {
      // Auto-expire it now
      await tx.update(configurationChangeRequests)
        .set({ status: 'EXPIRED' })
        .where(eq(configurationChangeRequests.id, payload.requestId));
        
      return { success: false, errorCode: 'REQUEST_EXPIRED' };
    }
    
    // 2. Validate Payload Hash Binding
    if (request.changePayloadHash !== payload.expectedPayloadHash) {
      return { 
        success: false, 
        errorCode: 'PAYLOAD_HASH_MISMATCH', 
        errorMessage: 'The requested change payload has been modified since it was reviewed.' 
      };
    }
    
    // 3. Approve
    await tx.update(configurationChangeRequests)
      .set({ 
        status: 'APPROVED', 
        approvedBy: ctx.actorId,
        approvedAt: new Date()
      })
      .where(eq(configurationChangeRequests.id, payload.requestId));
      
    // 4. Audit
    const lastAudit = await tx.select().from(capabilityAuditLogs)
      .where(eq(capabilityAuditLogs.environment, ctx.environment))
      .orderBy(capabilityAuditLogs.createdAt)
      .limit(1);
      
    const previousEventHash = lastAudit.length > 0 ? lastAudit[0].eventHash : null;
    const auditPayload = {
      action: 'APPROVE_CONFIGURATION_CHANGE',
      environment: ctx.environment,
      actor: ctx.actorId,
      requestId: payload.requestId,
      previousHash: previousEventHash
    };
    
    const eventHash = crypto.createHash('sha256').update(JSON.stringify(auditPayload)).digest('hex');
    
    await tx.insert(capabilityAuditLogs).values({
      environment: ctx.environment,
      actorId: ctx.actorId,
      action: 'APPROVE_CONFIGURATION_CHANGE',
      reason: payload.reason,
      requestId: payload.requestId,
      previousEventHash,
      eventHash,
    });
    
    return { success: true };
  });
}
