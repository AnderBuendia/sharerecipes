import { RecipeEntityDoc } from '../interfaces/documents/recipe-document.interface';

/**
 * Type to represent populated / unpopulated recipe
 */
export type RecipeOrId = RecipeEntityDoc | string;
