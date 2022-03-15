import { UserOrId } from '@Shared/infrastructure/http/mongodb/types/user-or-id.type';

export interface RecipeEntity<U extends UserOrId = string> {
  _id: string;
  name: string;
  ingredients: string[];
  prep_time: number;
  serves: number;
  difficulty: string;
  image_url: string;
  image_name: string;
  description: string;
  style: string;
  votes: number;
  voted: string[];
  average_vote: number;
  url_query: string;
  author: U;
}

export interface RecipeEntityDoc<U extends UserOrId = string>
  extends RecipeEntity<U> {}
