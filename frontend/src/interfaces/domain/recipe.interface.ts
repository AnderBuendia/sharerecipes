import { UserCompleteProfile } from '@Interfaces/domain/user.interface';
import { IComment } from '@Interfaces/domain/comment.interface';

export interface CreateRecipeFormData {
  name: string;
  prepTime: string;
  serves: string;
  ingredients: string[];
  description: string;
  difficulty: string;
  style: string;
  otherStyle?: string;
}

export interface RecipeImage {
  imageUrl?: string;
  imageName?: string;
}

export interface CreateRecipe extends RecipeImage {
  name: string;
  prepTime: number;
  serves: number;
  ingredients: string[];
  description: string;
  difficulty: string;
  style: string;
}

export interface IRecipe extends CreateRecipe {
  _id: string;
  votes: number;
  voted: string[];
  averageVote: number;
  urlQuery: string;
  author: UserCompleteProfile;
  comments: IComment[];
  createdAt: number;
  updatedAt: number;
}
