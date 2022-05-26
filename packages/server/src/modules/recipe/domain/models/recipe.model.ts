import { RecipeEntity } from '@Shared/infrastructure/http/mongodb/interfaces/documents/recipe-document.interface';
import { VOUuid } from '@Shared/domain/value-objects/uuid.vo';
import { VORecipeName } from '@Shared/domain/value-objects/name.vo';
import { VOPositiveNumber } from '@Shared/domain/value-objects/positive-number.vo';

export class RecipeModel {
  public constructor(
    public _id: VOUuid,
    public name: VORecipeName,
    public ingredients: string[],
    public prepTime: VOPositiveNumber,
    public serves: VOPositiveNumber,
    public difficulty: string,
    public description: string,
    public style: string,
    public imageUrl: string,
    public imageName: string,
    public votes: VOPositiveNumber,
    public voted: string[],
    public averageVote: VOPositiveNumber,
    public author: VOUuid,
    public urlQuery: string
  ) {}

  static create(recipeData: RecipeModel) {
    const {
      _id,
      name,
      ingredients,
      prepTime,
      serves,
      difficulty,
      description,
      style,
      imageUrl,
      imageName,
      votes,
      voted,
      averageVote,
      author,
      urlQuery,
    } = recipeData;

    const recipe = new RecipeModel(
      _id,
      name,
      ingredients,
      prepTime,
      serves,
      difficulty,
      description,
      style,
      imageUrl,
      imageName,
      votes,
      voted,
      averageVote,
      author,
      urlQuery
    );

    return recipe;
  }

  static update(recipeData: RecipeModel) {
    const {
      _id,
      name,
      ingredients,
      prepTime,
      serves,
      difficulty,
      description,
      style,
      imageUrl,
      imageName,
      votes,
      voted,
      averageVote,
      author,
      urlQuery,
    } = recipeData;

    const recipe = new RecipeModel(
      _id,
      name,
      ingredients,
      prepTime,
      serves,
      difficulty,
      description,
      style,
      imageUrl,
      imageName,
      votes,
      voted,
      averageVote,
      author,
      urlQuery
    );

    return recipe;
  }

  static build(recipeData: RecipeEntity) {
    const {
      _id,
      name,
      ingredients,
      prep_time,
      serves,
      difficulty,
      description,
      style,
      image_url,
      image_name,
      votes,
      voted,
      average_vote,
      author,
      url_query,
    } = recipeData;

    const recipe = new RecipeModel(
      new VOUuid(_id),
      new VORecipeName(name),
      ingredients,
      new VOPositiveNumber(prep_time),
      new VOPositiveNumber(serves),
      difficulty,
      description,
      style,
      image_url,
      image_name,
      new VOPositiveNumber(votes),
      voted,
      new VOPositiveNumber(average_vote),
      new VOUuid(author),
      url_query
    );

    return recipe;
  }
}
