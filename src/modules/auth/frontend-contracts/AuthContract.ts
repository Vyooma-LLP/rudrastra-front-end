import { Command, Query } from '../../../contracts/base';

export type SessionRole = 'customer' | 'seller' | 'ops' | 'owner' | 'logged_out';

export interface SessionContext {
  role: SessionRole;
  userEmail: string;
  userName: string;
  organizationId?: string;
  userId?: string;
  isSystemAdmin?: boolean;
}

export interface AuthenticateUserInput {
  email: string;
  password?: string; // Mock will ignore
}

export interface SwitchRoleInput {
  role: SessionRole;
}

// Queries
export type GetSessionContextQuery = Query<void, SessionContext>;

// Commands
export type AuthenticateUserCommand = Command<AuthenticateUserInput, SessionContext>;
export type SwitchRoleCommand = Command<SwitchRoleInput, SessionContext>;
export type SignOutCommand = Command<void, void>;
