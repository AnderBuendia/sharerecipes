import { RecipeEntityDoc } from '@Shared/infrastructure/http/mongodb/interfaces/documents/recipe-document.interface';

export type PublicRecipeDTO = RecipeEntityDoc;

export interface DefaultRecipeDTO {
  url_query: string;
}

export interface CreateRecipeDTO {
  name: string;
  serves: number;
  prep_time: number;
  ingredients: string[];
  difficulty: string;
  style: string;
  description: string;
  image_url: string;
  image_name: string;
}

export interface VoteRecipeDTO extends DefaultRecipeDTO {
  votes: number;
}
