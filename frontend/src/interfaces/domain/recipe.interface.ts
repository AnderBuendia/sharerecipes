import { UserCompleteProfile } from '@Interfaces/domain/user.interface';
import { IComment } from '@Interfaces/domain/comment.interface';

export interface RecipeImage {
  image_url?: string;
  image_name?: string;
}

export interface NewRecipeData {
  name: string;
  prep_time: number;
  serves: number;
  ingredients: string[];
  description: string;
  difficulty: string;
  style: string;
  other_style?: string;
}

export interface IRecipe extends NewRecipeData, RecipeImage {
  _id: string;
  votes: number;
  voted: string[];
  average_vote: number;
  url_query: string;
  author: UserCompleteProfile;
  comments: IComment[];
  createdAt: number;
  updatedAt: number;
}
