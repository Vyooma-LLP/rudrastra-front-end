/**
 * Core Command & Query Contracts for Rudrastra
 *
 * This file defines the explicit boundaries between the UI and the backend.
 * The UI must NEVER know whether it is communicating with a MockAdapter or a RealAdapter.
 *
 * Every mutation must be executed through a Command.
 * Every read must be executed through a Query.
 */

/**
 * Canonical representation of monetary values.
 * The frontend NEVER calculates or submits an authoritative order total.
 * It strictly uses string-based minor units (e.g. "149900" for 1499.00 INR) to avoid floating point issues.
 */
export type Money = {
  amountMinor: string;
  currency: string;
};

export type CommandErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_ENTITLED'
  | 'CAPABILITY_UNAVAILABLE'
  | 'DEPENDENCY_DISABLED'
  | 'ROLLOUT_EXCLUDED'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'IDEMPOTENCY_CONFLICT'
  | 'STALE_CONFIGURATION'
  | 'RATE_LIMITED'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';

export type CommandStatus = 'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR' | 'CONFLICT' | 'CANCELLED';

export interface CommandError {
  code: CommandErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export type CapabilityDecisionReason = 
  | 'GRANTED' 
  | 'NOT_ENTITLED' 
  | 'DEPENDENCY_DISABLED' 
  | 'ROLLOUT_EXCLUDED'
  | 'PERMISSION_DENIED'
  | 'UNAVAILABLE'
  | 'NOT_FOUND';

export interface CapabilityDecision {
  allowed: boolean;
  capability: string;
  reason: CapabilityDecisionReason;
  metadata?: Record<string, unknown>;
}

export interface CommandMetadata {
  requestId: string;
  commandId: string;
  idempotencyKey: string;
}

export interface CommandContext {
  metadata: CommandMetadata;
  organizationId?: string; // UX context hint only, backend derives authoritative identity
  userId?: string;         // Optional if unauthenticated
  channel: 'web' | 'api' | 'mobile';
  apiVersion?: string;     // Explicit versioning to catch deployment drift
  schemaVersion?: string;
  signal?: AbortSignal;    // For cancellation
}

export interface CommandResult<T> {
  status: CommandStatus;
  data?: T;
  error?: CommandError;
}

export interface Command<TInput, TOutput> {
  execute(input: TInput, context: CommandContext): Promise<CommandResult<TOutput>>;
}

export type Sort = { field: string; direction: 'asc' | 'desc' };
export type Filters = Record<string, unknown>;

export type PageRequest = {
  cursor?: string;
  limit: number;
  sort?: Sort;
  filters?: Filters;
};

export type PageResponse<T> = {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
};

export interface QueryContext {
  organizationId?: string; // UX context hint
  userId?: string;
  signal?: AbortSignal; // For cancellation
}

export interface Query<TInput, TOutput> {
  execute(input: TInput, context?: QueryContext): Promise<TOutput>;
}
