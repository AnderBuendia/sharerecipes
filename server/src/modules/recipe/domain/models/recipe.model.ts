import { RecipeEntity } from '@Shared/infrastructure/http/mongodb/interfaces/documents/recipe-document.interface';
import { VOUuid } from '@Shared/domain/value-objects/uuid.vo';
import { VORecipeName } from '@Shared/domain/value-objects/name.vo';
import { VOPositiveNumber } from '@Shared/domain/value-objects/positive-number.vo';

export class RecipeModel {
  public constructor(
    public _id: VOUuid,
    public name: VORecipeName,
    public ingredients: string[],
    public prep_time: VOPositiveNumber,
    public serves: VOPositiveNumber,
    public difficulty: string,
    public description: string,
    public style: string,
    public url_query: string,
    public image_url: string,
    public image_name: string,
    public author: VOUuid,
    public votes: VOPositiveNumber,
    public voted: string[],
    public average_vote: VOPositiveNumber
  ) {}

  static create(recipeData: RecipeModel) {
    const {
      _id,
      name,
      ingredients,
      prep_time,
      serves,
      difficulty,
      description,
      style,
      url_query,
      image_url,
      image_name,
      author,
      votes,
      voted,
      average_vote,
    } = recipeData;

    const recipe = new RecipeModel(
      _id,
      name,
      ingredients,
      prep_time,
      serves,
      difficulty,
      description,
      style,
      url_query,
      image_url,
      image_name,
      author,
      votes,
      voted,
      average_vote
    );

    return recipe;
  }

  static update(recipeData: RecipeModel) {
    const {
      _id,
      name,
      ingredients,
      prep_time,
      serves,
      difficulty,
      description,
      style,
      url_query,
      image_url,
      image_name,
      author,
      votes,
      voted,
      average_vote,
    } = recipeData;

    const recipe = new RecipeModel(
      _id,
      name,
      ingredients,
      prep_time,
      serves,
      difficulty,
      description,
      style,
      url_query,
      image_url,
      image_name,
      author,
      votes,
      voted,
      average_vote
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
      url_query,
      image_url,
      image_name,
      author,
      votes,
      voted,
      average_vote,
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
      url_query,
      image_url,
      image_name,
      new VOUuid(author),
      new VOPositiveNumber(votes),
      voted,
      new VOPositiveNumber(average_vote)
    );

    return recipe;
  }
}
