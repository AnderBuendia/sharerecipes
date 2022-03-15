import { ApolloError } from 'apollo-server-express';
import type { CommentRepositoryInterface } from '@Modules/comment/infrastructure/repository/comment-mongo.repository.interface';
import { CommentErrors } from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export class FindCommentsByRecipeIdQuery {
  constructor(private commentRepository: CommentRepositoryInterface) {}

  async execute(recipeId: string, offset: number, limit: number) {
    try {
      const existingComments =
        await this.commentRepository.findCommentsByRecipeId(
          recipeId,
          offset,
          limit
        );

      if (!existingComments)
        throw new ApolloError(
          CommentErrors.COMMENTS_NOT_FOUND,
          HTTPStatusCodes.NOT_FOUND
        );

      return existingComments.map((existingComment) =>
        this.commentRepository.toDTO(existingComment)
      );
    } catch (error) {
      throw error;
    }
  }
}
