import { eq, and } from 'drizzle-orm';
import { controlPlaneCommands } from '../schema';
import { CommandContext, CommandResult } from './types';
import crypto from 'crypto';
import { PlatformDatabase } from '../ports/PlatformDatabase';

export class IdempotencyConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IdempotencyConflictError';
  }
}

/**
 * Generates a SHA-256 hash of the request payload to ensure
 * the same idempotency key isn't reused with different data.
 */
export function hashPayload(payload: unknown): string {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

/**
 * Wraps a command execution with strict idempotency guarantees.
 * 
 * 1. Same key + same hash = returns original result.
 * 2. Same key + different hash = throws IdempotencyConflictError.
 * 3. New key = executes the command and stores the result.
 */
export async function withIdempotency<T>(
  db: PlatformDatabase,
  ctx: CommandContext,
  commandType: string,
  payload: Record<string, unknown>,
  execute: (tx: unknown) => Promise<CommandResult<T>>
): Promise<CommandResult<T>> {
  
  const payloadHash = hashPayload(payload);
  
  // 1. Check for existing command
  const existingCommands = await db.select().from(controlPlaneCommands).where(
    and(
      eq(controlPlaneCommands.idempotencyKey, ctx.idempotencyKey),
      eq(controlPlaneCommands.environment, ctx.environment)
    )
  );
  
  if (existingCommands.length > 0) {
    const existing = existingCommands[0];
    
    // Same key, different payload -> hard error
    if (existing.payloadHash !== payloadHash) {
      throw new IdempotencyConflictError(
        `Idempotency key ${ctx.idempotencyKey} was reused with a different payload.`
      );
    }
    
    // Return original cached result
    return {
      success: existing.status === 'SUCCESS',
      data: existing.responseJson as T,
      errorCode: existing.errorCode || undefined,
      resultVersion: existing.resultVersion || undefined,
    };
  }
  
  // 2. Execute command within a transaction
  return await db.transaction(async (tx: unknown) => {
    // Record that we're starting (could be done in two steps if we want to catch crashes, 
    // but for Postgres, doing it in the same transaction ensures atomicity).
    
    const result = await execute(tx);
    
    // Store the result
    const expectedVersion = typeof payload.expectedVersion === 'number' ? payload.expectedVersion : null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (tx as any).insert(controlPlaneCommands).values({
      idempotencyKey: ctx.idempotencyKey,
      environment: ctx.environment,
      actorId: ctx.actorId,
      commandType,
      payloadHash,
      status: result.success ? 'SUCCESS' : 'FAILURE',
      expectedVersion,
      resultVersion: result.resultVersion || null,
      errorCode: result.errorCode || null,
      responseJson: result.data || null,
      completedAt: new Date(),
    });
    
    return result;
  });
}
