import { v4 as uuidv4 } from 'uuid';
import { ApolloError } from 'apollo-server-express';
import { RecipeModel } from '@Modules/recipe/domain/models/recipe.model';
import { setUrlQueryName } from '@Shared/utils/recipe.utils';
import { VOUuid } from '@Shared/domain/value-objects/uuid.vo';
import { VORecipeName } from '@Shared/domain/value-objects/name.vo';
import { VOPositiveNumber } from '@Shared/domain/value-objects/positive-number.vo';
import {
  DEFAULT_NUMBER_OF_VOTES,
  DEFAULT_AVERAGE_VOTE,
} from '@Shared/utils/constants';
import type { RecipeRepositoryInterface } from '@Modules/recipe/infrastructure/repository/recipe-mongo.repository.interface';
import type { CreateRecipeDTO } from '@Modules/recipe/infrastructure/graphql/dto/recipe.dto';
import { UserErrors } from '@Shared/infrastructure/enums/errors.enum';
import { HTTPStatusCodes } from '@Shared/infrastructure/enums/http-status-code.enum';

export class CreateRecipeUseCase {
  constructor(private recipeRepository: RecipeRepositoryInterface) {}

  async execute(input: CreateRecipeDTO, ctxUserId?: string) {
    const {
      name,
      serves,
      prepTime,
      ingredients,
      difficulty,
      style,
      description,
      imageUrl,
      imageName,
    } = input;

    try {
      if (!ctxUserId)
        throw new ApolloError(
          UserErrors.NOT_LOGGED_IN,
          HTTPStatusCodes.NOT_AUTHORIZED
        );

      const numberOfSameRecipes = await this.recipeRepository.findSameRecipes(
        name
      );

      const urlQuery = setUrlQueryName({
        name,
        numberOfRecipes: numberOfSameRecipes,
      });

      const normalizeRecipe = {
        _id: new VOUuid(uuidv4()),
        name: new VORecipeName(name),
        serves: new VOPositiveNumber(serves),
        prepTime: new VOPositiveNumber(prepTime),
        ingredients,
        difficulty,
        style,
        description,
        imageUrl,
        imageName,
        votes: new VOPositiveNumber(DEFAULT_NUMBER_OF_VOTES),
        voted: [],
        averageVote: new VOPositiveNumber(DEFAULT_AVERAGE_VOTE),
        author: new VOUuid(ctxUserId),
        urlQuery: urlQuery,
      };

      const domainRecipe = RecipeModel.create(normalizeRecipe);

      await this.recipeRepository.createRecipe(domainRecipe);

      const recipe = this.recipeRepository.toDTO(domainRecipe);

      return recipe;
    } catch (error) {
      throw error;
    }
  }
}
