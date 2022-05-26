import { ApolloError } from 'apollo-server-express';
import { RecipeModel } from '@Modules/recipe/domain/models/recipe.model';
import { VOPositiveNumber } from '@Shared/domain/value-objects/positive-number.vo';
import { calculateAverageVotes } from '@Shared/utils/recipe.utils';
import type { RecipeRepositoryInterface } from '@Modules/recipe/infrastructure/repository/recipe-mongo.repository.interface';
import type { VoteRecipeDTO } from '@Modules/recipe/infrastructure/graphql/dto/recipe.dto';
import {
  UserErrors,
  RecipeErrors,
} from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export class VoteRecipeUseCase {
  constructor(private recipeRepository: RecipeRepositoryInterface) {}

  async execute(
    recipeUrlQuery: string,
    input: VoteRecipeDTO,
    ctxUserId?: string
  ) {
    const { votes } = input;

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
      } else if (existingRecipe.voted.includes(ctxUserId)) {
        throw new ApolloError(
          RecipeErrors.RECIPE_VOTED,
          HTTPStatusCodes.NOT_ACCEPTABLE
        );
      }

      const sumVotes = votes
        ? votes + existingRecipe.votes.value
        : existingRecipe.votes.value;

      const updatedVoted = [...existingRecipe.voted, ctxUserId];
      const averageVotes = calculateAverageVotes({
        votes: sumVotes,
        numberOfVotes: updatedVoted.length,
      });

      const normalizeRecipe = {
        ...existingRecipe,
        voted: updatedVoted,
        votes: new VOPositiveNumber(sumVotes),
        averageVote: new VOPositiveNumber(averageVotes),
      };

      const domainRecipe = RecipeModel.update(normalizeRecipe);

      await this.recipeRepository.updateRecipe(domainRecipe);

      const recipe = this.recipeRepository.toDTO(domainRecipe);

      return recipe;
    } catch (error) {
      throw error;
    }
  }
}
