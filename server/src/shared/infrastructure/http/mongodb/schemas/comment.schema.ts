import { model, Schema, Model } from 'mongoose';
import { CommentEntity } from '@Shared/infrastructure/http/mongodb/interfaces/documents/comment-document.interface';
import { DEFAULT_NUMBER_OF_VOTES } from '@Shared/utils/constants';
import { Schemas } from '@Shared/infrastructure/http/mongodb/enums/schemas.enum';

const commentSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      _id: false,
    },
    message: {
      type: String,
    },
    votes: {
      type: Number,
      default: DEFAULT_NUMBER_OF_VOTES,
    },
    voted: {
      type: Array,
    },
    author: {
      type: String,
      ref: Schemas.USER,
      _id: false,
    },
    recipe: {
      type: String,
      ref: Schemas.COMMENT,
      _id: false,
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

export const Comment: Model<CommentEntity> = model(
  Schemas.COMMENT,
  commentSchema
);
