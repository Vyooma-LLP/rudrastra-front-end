import { eq, and } from 'drizzle-orm';
import { consumerHealthHeartbeats } from '../schema';
import { CAPABILITIES } from '@/features/registry/capabilities';
import { FeatureKey } from '@/features/registry/keys';
import { PlatformDatabase } from '../ports/PlatformDatabase';

export interface FencingContext {
  environment: string;
  instanceId: string;
  instanceGeneration: number;
}

/**
 * Ensures a consumer is healthy, not a zombie, and running an acceptable config version.
 */
export class ConsumerFencing {
  
  /**
   * Evaluates if the current instance is allowed to perform a mutation on the given feature.
   * If it is a zombie (offline/older generation), it is fenced out.
   * If it is stale beyond the feature's max_staleness_seconds, it is fenced out.
   */
  public static async validateMutation(
    db: PlatformDatabase,
    ctx: FencingContext, 
    featureKey: FeatureKey, 
    activeConfigVersion: number
  ): Promise<{ allowed: boolean; reason?: string }> {
    
    // 1. Fetch exact instance & generation
    const heartbeats = await db.select().from(consumerHealthHeartbeats)
      .where(
        and(
          eq(consumerHealthHeartbeats.instanceId, ctx.instanceId),
          eq(consumerHealthHeartbeats.environment, ctx.environment),
          eq(consumerHealthHeartbeats.instanceGeneration, ctx.instanceGeneration)
        )
      );
      
    if (heartbeats.length === 0) {
      return { allowed: false, reason: 'INSTANCE_OR_GENERATION_NOT_FOUND' };
    }
    
    const hb = heartbeats[0];
    
    // 2. Prevent Zombies
    // If another generation of this instanceId is running (and newer), this one is a zombie
    const allGenerations = await db.select().from(consumerHealthHeartbeats)
      .where(
        and(
          eq(consumerHealthHeartbeats.instanceId, ctx.instanceId),
          eq(consumerHealthHeartbeats.environment, ctx.environment)
        )
      );
      
    const maxGen = Math.max(...allGenerations.map((g: { instanceGeneration: number }) => g.instanceGeneration));
    if (ctx.instanceGeneration < maxGen) {
      return { allowed: false, reason: 'ZOMBIE_INSTANCE_GENERATION' };
    }
    
    // 3. Staleness Check
    if (hb.currentConfigVersion < activeConfigVersion) {
      const capability = CAPABILITIES.find(c => c.key === featureKey);
      if (!capability) {
        return { allowed: false, reason: 'CAPABILITY_NOT_FOUND' };
      }
      
      const timeSinceLastSeen = (Date.now() - new Date(hb.lastSeenAt).getTime()) / 1000;
      
      // CRITICAL = 0 tolerance
      if (capability.riskClass === 'CRITICAL') {
        return { allowed: false, reason: 'STALE_CONFIG_FOR_CRITICAL_MUTATION' };
      }
      
      // For STANDARD/HIGH, there's a configurable max staleness (e.g., 300s)
      const maxStaleness = capability.riskClass === 'HIGH' ? 60 : 300; 
      if (timeSinceLastSeen > maxStaleness) {
        return { allowed: false, reason: 'MAX_STALENESS_EXCEEDED' };
      }
    }
    
    return { allowed: true };
  }
  
  /**
   * Evaluates whether a new configuration version can be marked as ACTIVE.
   * Requires a certain percentage of ELIGIBLE healthy consumers to have synced it.
   */
  public static async evaluateActivationBarrier(
    db: PlatformDatabase,
    environment: string,
    targetVersion: number,
    requiredPercentage: number = 100
  ): Promise<{ activated: boolean; status: string }> {
    
    // An instance is eligible if it has checked in within the last 5 minutes.
    // Permanently offline/dead instances do not count towards the barrier.
    const ELIGIBILITY_TIMEOUT_MS = 5 * 60 * 1000; 
    const now = Date.now();
    
    const allHeartbeats = await db.select().from(consumerHealthHeartbeats)
      .where(eq(consumerHealthHeartbeats.environment, environment));
      
    // Group by instanceId to find the latest generation of each instance
    const latestGenMap = new Map<string, { instanceGeneration: number; lastSeenAt: Date | string; status: string; currentConfigVersion: number }>();
    for (const hb of allHeartbeats) {
      const existing = latestGenMap.get(hb.instanceId);
      if (!existing || hb.instanceGeneration > existing.instanceGeneration) {
        latestGenMap.set(hb.instanceId, hb);
      }
    }
    
    const activeInstances = Array.from(latestGenMap.values());
    
    const eligibleInstances = activeInstances.filter(hb => {
      const msSinceLastSeen = now - new Date(hb.lastSeenAt).getTime();
      return msSinceLastSeen <= ELIGIBILITY_TIMEOUT_MS;
    });
    
    if (eligibleInstances.length === 0) {
      return { activated: false, status: 'NO_ELIGIBLE_CONSUMERS' };
    }
    
    // Check for incompatible consumers
    const incompatible = eligibleInstances.filter(hb => hb.status === 'INCOMPATIBLE');
    if (incompatible.length > 0) {
      return { activated: false, status: 'INCOMPATIBLE_CONSUMERS_DETECTED' };
    }
    
    const syncedInstances = eligibleInstances.filter(hb => hb.currentConfigVersion >= targetVersion);
    
    const percentage = (syncedInstances.length / eligibleInstances.length) * 100;
    
    if (percentage >= requiredPercentage) {
      return { activated: true, status: 'BARRIER_MET' };
    }
    
    return { 
      activated: false, 
      status: `PROPAGATING: ${syncedInstances.length}/${eligibleInstances.length} synced (${percentage.toFixed(1)}%)`
    };
  }
}
