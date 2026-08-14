import { CommandResult, CommandContext } from '../../../contracts/base';
import { 
  SessionContext, 
  AuthenticateUserCommand, 
  SwitchRoleCommand, 
  SignOutCommand,
  GetSessionContextQuery,
  AuthenticateUserInput,
  SwitchRoleInput
} from './AuthContract';

export class SupabaseAuthAdapter implements AuthenticateUserCommand {
  async execute(input: AuthenticateUserInput, context: CommandContext): Promise<CommandResult<SessionContext>> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      const result = await response.json();
      
      if (!response.ok) {
        return { status: 'ERROR', error: { code: 'UNAUTHORIZED', message: result.error || 'Authentication failed' } };
      }
      return { status: 'SUCCESS', data: result.session };
    } catch (e: any) {
      return { status: 'ERROR', error: { code: 'INTERNAL_ERROR', message: e.message } };
    }
  }
}

export class SupabaseSwitchRoleAdapter implements SwitchRoleCommand {
  async execute(input: SwitchRoleInput, context: CommandContext): Promise<CommandResult<SessionContext>> {
    try {
      const response = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      const result = await response.json();
      
      if (!response.ok) {
        return { status: 'ERROR', error: { code: 'UNAUTHORIZED', message: result.error || 'Role switch failed' } };
      }
      return { status: 'SUCCESS', data: result.session };
    } catch (e: any) {
      return { status: 'ERROR', error: { code: 'INTERNAL_ERROR', message: e.message } };
    }
  }
}

export class SupabaseSignOutAdapter implements SignOutCommand {
  async execute(input: void, context: CommandContext): Promise<CommandResult<void>> {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      return { status: 'SUCCESS' };
    } catch (e: any) {
      return { status: 'ERROR', error: { code: 'INTERNAL_ERROR', message: e.message } };
    }
  }
}

export class SupabaseGetSessionContextAdapter implements GetSessionContextQuery {
  async execute(input: void): Promise<SessionContext> {
    const response = await fetch('/api/auth/session');
    if (!response.ok) {
      throw new Error('Not authenticated');
    }
    const result = await response.json();
    return result.session;
  }
}
