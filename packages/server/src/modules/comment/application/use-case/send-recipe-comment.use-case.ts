import { ApolloError } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';
import { CommentModel } from '@Modules/comment/domain/models/comment.model';
import { VOUuid } from '@Shared/domain/value-objects/uuid.vo';
import { VODate } from '@Shared/domain/value-objects/date.vo';
import { VOPositiveNumber } from '@Shared/domain/value-objects/positive-number.vo';
import { DEFAULT_NUMBER_OF_VOTES } from '@Shared/utils/constants';
import type { RecipeRepositoryInterface } from '@Modules/recipe/infrastructure/repository/recipe-mongo.repository.interface';
import type { CommentRepositoryInterface } from '@Modules/comment/infrastructure/repository/comment-mongo.repository.interface';
import type { SendRecipeCommentDTO } from '@Modules/comment/infrastructure/graphql/dto/comment.dto';
import {
  CommentErrors,
  UserErrors,
  RecipeErrors,
} from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export class SendRecipeCommentUseCase {
  constructor(
    private recipeRepository: RecipeRepositoryInterface,
    private commentRepository: CommentRepositoryInterface
  ) {}

  async execute(
    recipeUrlQuery: string,
    input: SendRecipeCommentDTO,
    ctxUserId?: string
  ) {
    const { message } = input;

    try {
      if (!ctxUserId)
        throw new ApolloError(
          UserErrors.NOT_LOGGED_IN,
          HTTPStatusCodes.NOT_AUTHORIZED
        );

      const existingRecipe = await this.recipeRepository.findRecipeByUrl(
        recipeUrlQuery
      );

      if (!existingRecipe) {
        throw new ApolloError(
          RecipeErrors.RECIPE_NOT_FOUND,
          HTTPStatusCodes.NOT_FOUND
        );
      } else if (!message) {
        throw new ApolloError(
          CommentErrors.NO_MESSAGE,
          HTTPStatusCodes.NO_CONTENT
        );
      }

      const currentDate = new Date();

      const normalizeComment = {
        _id: new VOUuid(uuidv4()),
        message,
        author: new VOUuid(ctxUserId),
        recipe: existingRecipe._id,
        votes: new VOPositiveNumber(DEFAULT_NUMBER_OF_VOTES),
        voted: [],
        createdAt: new VODate(currentDate),
      };

      const domainComment = CommentModel.create(normalizeComment);

      await this.commentRepository.createComment(domainComment);

      const comment = this.commentRepository.toDTO(domainComment);

      return comment;
    } catch (error) {
      throw error;
    }
  }
}
