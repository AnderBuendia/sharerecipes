import { UserProfile } from '@Interfaces/domain/user.interface';

export type QueryDataGetUsers = {
  getUsers: {
    users: UserProfile[];
    total: number;
  };
};
