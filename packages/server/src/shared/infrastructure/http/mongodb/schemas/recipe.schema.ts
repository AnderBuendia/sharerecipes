import { model, Schema } from 'mongoose';
import { Schemas } from '@Shared/infrastructure/http/mongodb/enums/schemas.enum';
import {
  DEFAULT_AVERAGE_VOTE,
  DEFAULT_NUMBER_OF_VOTES,
} from '@Shared/utils/constants';
import { RecipeDifficulty } from '@Shared/domain/enums/recipe-difficulty.enum';
import { RecipeStyle } from '@Shared/domain/enums/recipe-style.enum';
import type { RecipeEntity } from '@Shared/infrastructure/http/mongodb/interfaces/documents/recipe-document.interface';

const recipeSchema = new Schema<RecipeEntity>(
  {
    _id: {
      type: String,
      required: true,
      _id: false,
    },
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
      default: RecipeDifficulty.MEDIUM,
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
      default: RecipeStyle.NONE,
    },
    votes: {
      type: Number,
      default: DEFAULT_NUMBER_OF_VOTES,
    },
    voted: {
      type: [String],
    },
    average_vote: {
      type: Number,
      default: DEFAULT_AVERAGE_VOTE,
    },
    url_query: {
      type: String,
    },
    author: {
      type: String,
      ref: Schemas.USER,
      _id: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Recipe = model<RecipeEntity>(Schemas.RECIPE, recipeSchema);
