import { UserCompleteProfile } from '@Interfaces/auth/user.interface';

export interface AuthState {
  user?: UserCompleteProfile;
  jwt?: string;
}
