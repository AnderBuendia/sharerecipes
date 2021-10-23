import { model, Schema, Model } from 'mongoose';
import { IComment } from '@Interfaces/models/comment.interface';

const commentSchema: Schema = new Schema(
  {
    message: {
      type: String,
    },
    votes: {
      type: Number,
      default: 0,
    },
    voted: {
      type: Array,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    recipe: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      default: null,
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment: Model<IComment> = model('Comment', commentSchema);
