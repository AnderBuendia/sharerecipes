import { UserComment } from '@Interfaces/auth/user.interface';

export interface IComment {
  _id: string;
  message: string;
  edited: boolean;
  votes: number;
  author: UserComment;
  createdAt: number;
}
