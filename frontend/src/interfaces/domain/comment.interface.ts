import { UserComment } from '@Interfaces/domain/user.interface';

export interface IComment {
  _id: string;
  message: string;
  edited: boolean;
  votes: number;
  author: UserComment;
  createdAt: number;
}
