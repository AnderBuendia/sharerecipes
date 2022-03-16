import { UserOrId } from '@Shared/infrastructure/http/mongodb/types/user-or-id.type';

/**
 * Interface for mongoose recipe's schema
 */
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
  author: U;
  url_query: string;
}

/**
 * Interface for mongoose recipe's document
 */
export interface RecipeEntityDoc<U extends UserOrId = string> {
  _id: string;
  name: string;
  ingredients: string[];
  prepTime: number;
  serves: number;
  difficulty: string;
  imageUrl: string;
  imageName: string;
  description: string;
  style: string;
  votes: number;
  voted: string[];
  averageVote: number;
  author: U;
  urlQuery: string;
}
