export interface CommandContext {
  actorId: string;
  environment: string;
  idempotencyKey: string;
}

export interface CommandResult<T = unknown> {
  success: boolean;
  data?: T;
  errorCode?: string;
  errorMessage?: string;
  resultVersion?: number;
}
