import { UserOrId } from '@Shared/infrastructure/http/mongodb/types/user-or-id.type';
import { RecipeOrId } from '@Shared/infrastructure/http/mongodb/types/recipe-or-id.type';

export interface CommentEntity<
  R extends RecipeOrId = string,
  U extends UserOrId = string
> {
  _id: string;
  message: string;
  votes: number;
  voted: string[];
  edited: boolean;
  recipe: R;
  author: U;
  createdAt: Date;
}

export interface CommentEntityDoc<
  R extends RecipeOrId = string,
  U extends UserOrId = string
> extends CommentEntity<R, U> {}
