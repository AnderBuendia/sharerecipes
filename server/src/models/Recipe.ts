import { model, Schema, Model } from 'mongoose';
import { IRecipe } from '@Interfaces/models/recipe.interface';

const recipeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      default: undefined,
    },
    prep_time: {
      type: Number,
      trim: true,
    },
    serves: {
      type: Number,
      trim: true,
    },
    difficulty: {
      type: String,
      default: 'MEDIUM',
    },
    image_url: {
      type: String,
    },
    image_name: {
      type: String,
    },
    description: {
      type: String,
    },
    style: {
      type: String,
      default: 'NONE',
    },
    votes: {
      type: Number,
      default: 0,
    },
    voted: {
      type: Array,
    },
    average_vote: {
      type: Number,
      default: 0,
    },
    url: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Recipe: Model<IRecipe> = model('Recipe', recipeSchema);
