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

// Mock Server State (isolated from UI)
let mockServerState: SessionContext = {
  role: 'customer',
  userEmail: 'praneeth@vyooma.tech',
  userName: 'Praneeth Kumar'
};

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockAuthenticateUserAdapter implements AuthenticateUserCommand {
  async execute(input: AuthenticateUserInput, context: CommandContext): Promise<CommandResult<SessionContext>> {
    await delay(600); // Network simulation
    
    // Deterministic mock logic
    if (input.email.includes('error')) {
      return {
        status: 'ERROR',
        error: { code: 'UNAUTHORIZED', message: 'Invalid credentials provided to mock adapter.' }
      };
    }

    mockServerState = {
      role: 'customer',
      userEmail: input.email,
      userName: input.email.split('@')[0],
      userId: `usr_${Math.floor(Math.random() * 10000)}`
    };

    return { status: 'SUCCESS', data: { ...mockServerState } };
  }
}

export class MockSwitchRoleAdapter implements SwitchRoleCommand {
  async execute(input: SwitchRoleInput, context: CommandContext): Promise<CommandResult<SessionContext>> {
    await delay(300); // Network simulation
    
    if (mockServerState.role === 'logged_out') {
      return {
        status: 'ERROR',
        error: { code: 'UNAUTHORIZED', message: 'Cannot switch role while logged out.' }
      };
    }

    mockServerState.role = input.role;

    return { status: 'SUCCESS', data: { ...mockServerState } };
  }
}

export class MockSignOutAdapter implements SignOutCommand {
  async execute(input: void, context: CommandContext): Promise<CommandResult<void>> {
    await delay(400); // Network simulation
    
    mockServerState = {
      role: 'logged_out',
      userEmail: '',
      userName: ''
    };

    return { status: 'SUCCESS' };
  }
}

export class MockGetSessionContextAdapter implements GetSessionContextQuery {
  async execute(input: void): Promise<SessionContext> {
    await delay(200); // Network simulation for fetching session
    return { ...mockServerState };
  }
}
