import { UserProfile } from '@Interfaces/domain/user.interface';

export type QueryDataFindUsers = {
  find_users: {
    users: UserProfile[];
    total: number;
  };
};
