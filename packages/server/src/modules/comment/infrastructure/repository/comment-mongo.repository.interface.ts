import { CommentModel } from '@Modules/comment/domain/models/comment.model';
import { RecipeModel } from '@Modules/recipe/domain/models/recipe.model';
import type { CommentEntity } from '@Shared/infrastructure/http/mongodb/interfaces/documents/comment-document.interface';
import type { PublicCommentDTO } from '@Modules/comment/infrastructure/graphql/dto/comment.dto';

export interface CommentRepositoryInterface {
  toDomain(persistentEntity: CommentEntity): CommentModel;

  toDTO(domainEntity: CommentModel): PublicCommentDTO;

  toPersistence(domainEntity: CommentModel): CommentEntity;

  findCommentById(commentId: string): Promise<CommentModel>;

  findCommentsByRecipeId(
    recipeId: string,
    offset: number,
    limit: number
  ): Promise<CommentModel[] | undefined>;

  createComment(comment: CommentModel): Promise<void>;

  updateComment(comment: CommentModel): Promise<void>;

  deleteRecipeComments(recipe: RecipeModel): Promise<void>;
}
