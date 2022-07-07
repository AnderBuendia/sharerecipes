import type { UserLoginDTO } from '@Application/dto/user.dto';
import type { UserCompleteProfile } from '@Interfaces/domain/user.interface';

export interface AuthenticationService {
  loginRequest: (data: UserLoginDTO) => Promise<{
    user: UserCompleteProfile;
    jwt: string;
  }>;
  logoutRequest: () => Promise<Response>;
}
