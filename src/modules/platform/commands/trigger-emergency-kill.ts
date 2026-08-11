import { eq, and, or, gt, lt } from 'drizzle-orm';
import { 
  capabilityEmergencyKills,
  capabilityAuditLogs
} from '../schema';
import { CommandContext, CommandResult } from './types';
import { withIdempotency } from './idempotency';
import crypto from 'crypto';

export interface TriggerEmergencyKillPayload {
  featureKey: string;
  scope: 'GLOBAL' | 'ORG' | 'ENV';
  scopeId: string;
  durationSeconds: number; // e.g. 3600 for 1 hour
  reason: string;
}

/**
 * Triggers an emergency kill for a specific feature and scope.
 * Rejects overlapping time windows.
 */
export async function triggerEmergencyKill(
  ctx: CommandContext,
  payload: TriggerEmergencyKillPayload
): Promise<CommandResult<{ killId: string }>> {
  
  return withIdempotency(ctx, 'TRIGGER_EMERGENCY_KILL', payload, async (tx) => {
    
    const now = new Date();
    const expiresAt = new Date(now.getTime() + payload.durationSeconds * 1000);
    
    // 1. Prevent Overlapping Time Windows
    // A kill overlaps if:
    // (existing.activatedAt < new.expiresAt) AND (existing.expiresAt > new.activatedAt)
    // AND status === 'ACTIVE'
    
    const overlaps = await tx.select().from(capabilityEmergencyKills)
      .where(
        and(
          eq(capabilityEmergencyKills.environment, ctx.environment),
          eq(capabilityEmergencyKills.featureKey, payload.featureKey),
          eq(capabilityEmergencyKills.scope, payload.scope),
          eq(capabilityEmergencyKills.scopeId, payload.scopeId),
          eq(capabilityEmergencyKills.status, 'ACTIVE'),
          lt(capabilityEmergencyKills.activatedAt, expiresAt),
          gt(capabilityEmergencyKills.expiresAt, now)
        )
      )
      .forUpdate(); // Lock to prevent concurrent overlapping insertions
      
    if (overlaps.length > 0) {
      return {
        success: false,
        errorCode: 'OVERLAPPING_EMERGENCY_KILL',
        errorMessage: 'An active emergency kill already overlaps with the requested time window.'
      };
    }
    
    // 2. Insert Kill
    const [inserted] = await tx.insert(capabilityEmergencyKills).values({
      environment: ctx.environment,
      featureKey: payload.featureKey,
      scope: payload.scope,
      scopeId: payload.scopeId,
      activatedBy: ctx.actorId,
      reason: payload.reason,
      activatedAt: now,
      expiresAt: expiresAt,
      status: 'ACTIVE'
    }).returning({ id: capabilityEmergencyKills.id });
    
    // 3. Audit Event
    const lastAudit = await tx.select().from(capabilityAuditLogs)
      .where(eq(capabilityAuditLogs.environment, ctx.environment))
      .orderBy(capabilityAuditLogs.createdAt)
      .limit(1);
      
    const previousEventHash = lastAudit.length > 0 ? lastAudit[0].eventHash : null;
    const auditPayload = {
      action: 'TRIGGER_EMERGENCY_KILL',
      environment: ctx.environment,
      actor: ctx.actorId,
      featureKey: payload.featureKey,
      scope: payload.scope,
      scopeId: payload.scopeId,
      killId: inserted.id,
      previousHash: previousEventHash
    };
    
    const eventHash = crypto.createHash('sha256').update(JSON.stringify(auditPayload)).digest('hex');
    
    await tx.insert(capabilityAuditLogs).values({
      environment: ctx.environment,
      actorId: ctx.actorId,
      action: 'TRIGGER_EMERGENCY_KILL',
      featureKey: payload.featureKey,
      reason: payload.reason,
      previousEventHash,
      eventHash,
    });
    
    return {
      success: true,
      data: { killId: inserted.id }
    };
  });
}
