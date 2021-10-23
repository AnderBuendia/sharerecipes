import { Document, PopulatedDoc } from 'mongoose';
import { IUser } from '@Interfaces/models/user.interface';

export interface IRecipe extends Document {
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
  url: StringConstructor;
  author: PopulatedDoc<IUser>;
}
