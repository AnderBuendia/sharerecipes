import { RecipeEntityDoc } from '@Shared/infrastructure/http/mongodb/interfaces/documents/recipe-document.interface';

export type PublicRecipeDTO = RecipeEntityDoc;

export interface DefaultRecipeDTO {
  urlQuery: string;
}

export interface CreateRecipeDTO {
  name: string;
  serves: number;
  prepTime: number;
  ingredients: string[];
  difficulty: string;
  style: string;
  imageUrl: string;
  imageName: string;
  description: string;
}

export interface VoteRecipeDTO extends DefaultRecipeDTO {
  votes: number;
}
