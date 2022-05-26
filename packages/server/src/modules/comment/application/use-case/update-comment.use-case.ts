import { ApolloError } from 'apollo-server-express';
import { CommentModel } from '@Modules/comment/domain/models/comment.model';
import { VOBoolean } from '@Shared/domain/value-objects/boolean.vo';
import type { CommentRepositoryInterface } from '@Modules/comment/infrastructure/repository/comment-mongo.repository.interface';
import type { UpdateCommentDTO } from '@Modules/comment/infrastructure/graphql/dto/comment.dto';
import {
  UserErrors,
  RecipeErrors,
} from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export class UpdateCommentUseCase {
  constructor(private commentRepository: CommentRepositoryInterface) {}

  async execute(
    commentId: string,
    input: UpdateCommentDTO,
    ctxUserId?: string
  ) {
    const { message } = input;

    try {
      if (!ctxUserId)
        throw new ApolloError(
          UserErrors.NOT_LOGGED_IN,
          HTTPStatusCodes.NOT_AUTHORIZED
        );

      const existingComment = await this.commentRepository.findCommentById(
        commentId
      );

      if (!existingComment)
        throw new ApolloError(
          RecipeErrors.COMMENT_NOT_FOUND,
          HTTPStatusCodes.NOT_FOUND
        );

      const normalizeComment = {
        ...existingComment,
        message,
        edited: new VOBoolean(true),
      };

      const domainComment = CommentModel.update(normalizeComment);

      await this.commentRepository.updateComment(domainComment);

      const comment = this.commentRepository.toDTO(domainComment);

      return comment;
    } catch (error) {
      throw error;
    }
  }
}
