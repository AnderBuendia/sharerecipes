import { UserCompleteProfile } from '@Interfaces/domain/user.interface';

export interface EndpointAuth {
  user: UserCompleteProfile;
  token: string;
}
