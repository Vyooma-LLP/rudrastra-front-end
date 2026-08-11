import { useState, useCallback, useRef, useEffect } from 'react';
import { Command, CommandContext, CommandResult, CommandStatus } from '../contracts/base';

/**
 * useCommand manages the strict lifecycle of a frontend mutation.
 * It enforces single-flight execution, automatic idempotency key generation,
 * and standardizes state transitions (IDLE -> SUBMITTING -> SUCCESS/ERROR).
 */
interface UseCommandOptions<TInput, TOutput> {
  command: Command<TInput, TOutput>;
  onSuccess?: (data: TOutput) => void;
  onError?: (err: Error | unknown) => void;
}

export function useCommand<TInput, TOutput>(options: UseCommandOptions<TInput, TOutput>) {
  const { command, onSuccess, onError } = options;
  const [status, setStatus] = useState<CommandStatus>('IDLE');
  const [data, setData] = useState<TOutput | null>(null);
  const [error, setError] = useState<CommandResult<TOutput>['error'] | null>(null);
  
  // Protect against race conditions (double execution before state flushes)
  const isExecutingRef = useRef(false);
  
  // Protect against unmounted state updates if the user navigates away
  const isMounted = useRef(true);
  
  // Persist idempotencyKey across retries for the same logical operation
  const generateId = useCallback(() => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36), []);
  const idempotencyKeyRef = useRef<string>(generateId());
  
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const execute = useCallback(async (input: TInput, cmdOptions?: { orgId?: string, userId?: string, idempotencyKey?: string }) => {
    // 1. Prevent double clicks & synchronous race conditions
    if (isExecutingRef.current) {
      console.warn('Command is already submitting. Ignored.');
      return { status: 'ERROR' as CommandStatus, error: { code: 'RACE_CONDITION', message: 'Command is already submitting' }};
    }
    
    isExecutingRef.current = true;
    setStatus('SUBMITTING');
    setError(null);
    setData(null);

    // 2. Generate implicit command context
    const context: CommandContext = {
      metadata: {
        requestId: generateId(), // Fresh ID per network request
        commandId: generateId(),
        idempotencyKey: cmdOptions?.idempotencyKey || idempotencyKeyRef.current,
      },
      organizationId: cmdOptions?.orgId || 'UNKNOWN_ORG',
      userId: cmdOptions?.userId || 'UNKNOWN_USER',
      channel: 'web'
    };

    try {
      // 3. Execute the contract
      const result = await command.execute(input, context);

      if (!isMounted.current) return result;

      isExecutingRef.current = false;
      setStatus(result.status);
      
      if (result.status === 'SUCCESS' && result.data) {
        idempotencyKeyRef.current = generateId(); // cycle for next potential submission
        setData(result.data);
        if (onSuccess) onSuccess(result.data);
      } else if (result.error) {
        setError(result.error);
        if (onError) onError(result.error);
      }
      
      return result;
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      isExecutingRef.current = false;
      if (!isMounted.current) return { status: 'ERROR' as CommandStatus, error: { code: 'INTERNAL_ERROR', message: errorObj.message }};
      
      const fallbackError = { code: 'INTERNAL_ERROR' as const, message: errorObj.message || 'An unexpected error occurred.' };
      setStatus('ERROR');
      setError(fallbackError);
      if (onError) onError(fallbackError);
      
      return { status: 'ERROR' as CommandStatus, error: fallbackError };
    }
  }, [command, onSuccess, onError, generateId]);

  return {
    status,
    isIdle: status === 'IDLE',
    isSubmitting: status === 'SUBMITTING',
    isLoading: status === 'SUBMITTING',
    isSuccess: status === 'SUCCESS',
    isError: status === 'ERROR',
    isConflict: status === 'CONFLICT',
    data,
    error,
    execute,
    reset: () => {
      setStatus('IDLE');
      idempotencyKeyRef.current = generateId();
    }
  };
}
