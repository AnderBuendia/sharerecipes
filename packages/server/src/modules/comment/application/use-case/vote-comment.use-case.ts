import { ApolloError } from 'apollo-server-express';
import { CommentModel } from '@Modules/comment/domain/models/comment.model';
import type { CommentRepositoryInterface } from '@Modules/comment/infrastructure/repository/comment-mongo.repository.interface';
import type { VoteCommentDTO } from '@Modules/comment/infrastructure/graphql/dto/comment.dto';
import {
  UserErrors,
  RecipeErrors,
} from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';
import { VOPositiveNumber } from '@Shared/domain/value-objects/positive-number.vo';

export class VoteCommentUseCase {
  constructor(private commentRepository: CommentRepositoryInterface) {}

  async execute(commentId: string, input: VoteCommentDTO, ctxUserId?: string) {
    const { votes } = input;

    try {
      if (!ctxUserId)
        throw new ApolloError(
          UserErrors.NOT_LOGGED_IN,
          HTTPStatusCodes.NOT_AUTHORIZED
        );

      const existingComment = await this.commentRepository.findCommentById(
        commentId
      );

      if (!existingComment) {
        throw new ApolloError(
          RecipeErrors.COMMENT_NOT_FOUND,
          HTTPStatusCodes.NOT_FOUND
        );
      } else if (existingComment.voted.includes(ctxUserId)) {
        throw new ApolloError(
          RecipeErrors.COMMENT_VOTED,
          HTTPStatusCodes.NOT_ACCEPTABLE
        );
      }

      const sumVotes = votes
        ? existingComment.votes.value + votes
        : existingComment.votes.value;
      const updatedVoted = [...existingComment.voted, ctxUserId];

      const normalizeComment = {
        ...existingComment,
        votes: new VOPositiveNumber(sumVotes),
        voted: updatedVoted,
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
