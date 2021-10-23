import { Document, PopulatedDoc } from 'mongoose';
import { IRecipe } from '@Interfaces/models/recipe.interface';
import { IUser } from '@Interfaces/models/user.interface';

export interface IComment extends Document {
  message: string;
  votes: number;
  voted: string[];
  author: PopulatedDoc<IUser>;
  recipe: PopulatedDoc<IRecipe>;
  edited: boolean;
}
