import { Recipe } from '@Shared/infrastructure/http/mongodb/schemas/recipe.schema';
import { unlinkSync } from 'fs';
import { RecipeModel } from '@Modules/recipe/domain/models/recipe.model';
import { IMAGES_PATH } from '@Shared/utils/constants';
import type { RecipeRepositoryInterface } from '@Modules/recipe/infrastructure/repository/recipe-mongo.repository.interface';
import type { RecipeEntity } from '@Shared/infrastructure/http/mongodb/interfaces/documents/recipe-document.interface';
import type { PublicRecipeDTO } from '@Modules/recipe/infrastructure/graphql/dto/recipe.dto';

export class RecipeRepository implements RecipeRepositoryInterface {
  /**
   * Creates a domain entity from database entity
   * @param persistentEntity Database entity
   */
  toDomain(persistentEntity: RecipeEntity): RecipeModel {
    return RecipeModel.build(persistentEntity);
  }

  /**
   * Creates a Data Transfer Object from domain entity
   * @param domainEntity
   */
  toDTO(domainEntity: RecipeModel): PublicRecipeDTO {
    return {
      _id: domainEntity._id.value,
      name: domainEntity.name.value,
      ingredients: domainEntity.ingredients,
      prepTime: domainEntity.prepTime.value,
      serves: domainEntity.serves.value,
      difficulty: domainEntity.difficulty,
      description: domainEntity.description,
      style: domainEntity.style,
      urlQuery: domainEntity.urlQuery,
      imageUrl: domainEntity.imageUrl,
      imageName: domainEntity.imageName,
      author: domainEntity.author.value,
      votes: domainEntity.votes.value,
      voted: domainEntity.voted,
      averageVote: domainEntity.averageVote.value,
    };
  }

  /**
   * Creates a database entity from domain entity
   * @param domainEntity Domain entity
   */
  toPersistence(domainEntity: RecipeModel): RecipeEntity {
    return {
      _id: domainEntity._id.value,
      name: domainEntity.name.value,
      ingredients: domainEntity.ingredients,
      prep_time: domainEntity.prepTime.value,
      serves: domainEntity.serves.value,
      difficulty: domainEntity.difficulty,
      description: domainEntity.description,
      style: domainEntity.style,
      image_url: domainEntity.imageUrl,
      image_name: domainEntity.imageName,
      author: domainEntity.author.value,
      votes: domainEntity.votes?.value,
      voted: domainEntity.voted,
      average_vote: domainEntity.averageVote?.value,
      url_query: domainEntity.urlQuery,
    };
  }

  async findRecipeById(recipeId: string) {
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) return null;

    return this.toDomain(recipe);
  }

  async findRecipeByUrl(recipeUrlQuery: string) {
    const recipe = await Recipe.findOne({ url_query: recipeUrlQuery });

    if (!recipe) return null;

    return this.toDomain(recipe);
  }

  async findRecipes(
    sort: string,
    query: string,
    offset: number,
    limit: number
  ) {
    const recipes = await Recipe.find({
      $and: [
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { style: { $regex: query, $options: 'i' } },
          ],
        },
      ],
    })
      .sort(sort)
      .skip(offset)
      .limit(limit)
      .exec();

    if (!recipes) return null;

    return recipes.map((recipe) => this.toDomain(recipe));
  }

  async findRecipesByUserId(userId: string) {
    const recipes = await Recipe.find({ author: userId }).exec();

    if (!recipes) return null;

    return recipes.map((recipe) => this.toDomain(recipe));
  }

  async findSameRecipes(name: string) {
    const sameRecipes = await Recipe.countDocuments({
      name,
    }).collation({ locale: 'en', strength: 2 });

    if (!sameRecipes) return null;

    return sameRecipes;
  }

  async createRecipe(recipe: RecipeModel) {
    const persistentRecipe = this.toPersistence(recipe);

    await Recipe.create(persistentRecipe);
  }

  async updateRecipe(recipe: RecipeModel) {
    const persistentRecipe = this.toPersistence(recipe);

    await Recipe.findByIdAndUpdate({ _id: recipe._id.value }, persistentRecipe);
  }

  async deleteRecipe(recipe: RecipeModel) {
    const recipeImagePath = `${IMAGES_PATH}/${recipe.imageName}`;

    unlinkSync(recipeImagePath);

    await Recipe.findOneAndDelete({ _id: recipe._id.value });
  }
}
