import { UserProfile } from '@Interfaces/auth/user.interface';

export type QueryDataGetUsers = {
  getUsers: {
    users: UserProfile[];
    total: number;
  };
};
