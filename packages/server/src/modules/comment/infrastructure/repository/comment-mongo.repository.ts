import { Comment } from '@Shared/infrastructure/http/mongodb/schemas/comment.schema';
import { CommentModel } from '@Modules/comment/domain/models/comment.model';
import { RecipeModel } from '@Modules/recipe/domain/models/recipe.model';
import type { CommentEntity } from '@Shared/infrastructure/http/mongodb/interfaces/documents/comment-document.interface';
import type { CommentRepositoryInterface } from '@Modules/comment/infrastructure/repository/comment-mongo.repository.interface';
import type { PublicCommentDTO } from '@Modules/comment/infrastructure/graphql/dto/comment.dto';

export class CommentRepository implements CommentRepositoryInterface {
  /**
   * Creates a domain entity from database entity
   * @param persistentEntity Database entity
   */
  toDomain(persistentEntity: CommentEntity): CommentModel {
    return CommentModel.build(persistentEntity);
  }

  /**
   * Creates a Data Transfer Object from domain entity
   * @param domainEntity
   */
  toDTO(domainEntity: CommentModel): PublicCommentDTO {
    return {
      _id: domainEntity._id.value,
      message: domainEntity.message,
      author: domainEntity.author.value,
      recipe: domainEntity.recipe.value,
      votes: domainEntity.votes.value,
      voted: domainEntity.voted,
      edited: domainEntity.edited?.value,
      createdAt: domainEntity.createdAt?.value,
    };
  }

  /**
   * Creates a database entity from domain entity
   * @param domainEntity Domain entity
   */
  toPersistence(domainEntity: CommentModel): CommentEntity {
    return {
      _id: domainEntity._id.value,
      message: domainEntity.message,
      author: domainEntity.author.value,
      recipe: domainEntity.recipe.value,
      votes: domainEntity.votes.value,
      voted: domainEntity.voted,
      edited: domainEntity.edited?.value,
      createdAt: domainEntity.createdAt?.value,
    };
  }

  async findCommentById(commentId: string) {
    const comment = await Comment.findById(commentId);

    return this.toDomain(comment);
  }

  async findCommentsByRecipeId(
    recipeId: string,
    offset: number,
    limit: number
  ) {
    const recipeComments = await Comment.find({ recipe: recipeId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    if (!recipeComments) return null;

    return recipeComments.map((recipeComment) => this.toDomain(recipeComment));
  }

  async createComment(comment: CommentModel) {
    const persistentComment = this.toPersistence(comment);

    await Comment.create(persistentComment);
  }

  async updateComment(comment: CommentModel) {
    const persistentComment = this.toPersistence(comment);

    await Comment.findOneAndUpdate(
      { _id: comment._id.value },
      persistentComment
    );
  }

  async deleteRecipeComments(recipe: RecipeModel) {
    await Comment.deleteMany({ recipe: recipe._id.value });
  }
}
