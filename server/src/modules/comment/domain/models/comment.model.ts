import { CommentEntity } from '@Shared/infrastructure/http/mongodb/interfaces/documents/comment-document.interface';
import { VOUuid } from '@Shared/domain/value-objects/uuid.vo';
import { VOBoolean } from '@Shared/domain/value-objects/boolean.vo';
import { VOPositiveNumber } from '@Shared/domain/value-objects/positive-number.vo';
import { VODate } from '@Shared/domain/value-objects/date.vo';

export class CommentModel {
  public constructor(
    public _id: VOUuid,
    public message: string,
    public author: VOUuid,
    public recipe: VOUuid,
    public votes: VOPositiveNumber,
    public voted: string[],
    public edited?: VOBoolean,
    public createdAt?: VODate
  ) {}

  static create(commentData: CommentModel) {
    const { _id, message, author, recipe, votes, voted, edited, createdAt } =
      commentData;

    const comment = new CommentModel(
      _id,
      message,
      author,
      recipe,
      votes,
      voted,
      edited,
      createdAt
    );

    return comment;
  }

  static update(commentData: CommentModel) {
    const { _id, message, author, recipe, votes, voted, edited, createdAt } =
      commentData;

    const comment = new CommentModel(
      _id,
      message,
      author,
      recipe,
      votes,
      voted,
      edited,
      createdAt
    );

    return comment;
  }

  static build(commentData: CommentEntity) {
    const { _id, message, author, recipe, votes, voted, edited, createdAt } =
      commentData;

    const comment = new CommentModel(
      new VOUuid(_id),
      message,
      new VOUuid(author),
      new VOUuid(recipe),
      new VOPositiveNumber(votes),
      voted,
      new VOBoolean(edited),
      new VODate(createdAt)
    );

    return comment;
  }
}
