import { UserCompleteProfile } from '@Interfaces/domain/user.interface';

export interface AuthState {
  user?: UserCompleteProfile;
  jwt?: string;
}
