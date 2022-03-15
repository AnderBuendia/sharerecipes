import { asClass, AwilixContainer } from 'awilix';
import { CommentRepository } from '@Modules/comment/infrastructure/repository/comment-mongo.repository';
import { UpdateCommentUseCase } from '@Modules/comment/application/use-case/update-comment.use-case';
import { VoteCommentUseCase } from '@Modules/comment/application/use-case/vote-comment.use-case';
import { SendRecipeCommentUseCase } from '@Modules/comment/application/use-case/send-recipe-comment.use-case';
import { FindCommentsByRecipeIdQuery } from '@Modules/comment/application/queries/find-comments-by-recipe-id.query';
import type { ICradle } from '@Shared/rest/interfaces/cradle.interface';

export interface ICommentProvider {
  findCommentsByRecipeIdQuery: FindCommentsByRecipeIdQuery;
  sendRecipeCommentUseCase: SendRecipeCommentUseCase;
  updateCommentUseCase: UpdateCommentUseCase;
  voteCommentUseCase: VoteCommentUseCase;
  commentRepository: CommentRepository;
}

const commentProvider = (container: AwilixContainer<ICradle>): void => {
  // Register the classes
  container.register({
    findCommentsByRecipeIdQuery: asClass(FindCommentsByRecipeIdQuery),
    sendRecipeCommentUseCase: asClass(SendRecipeCommentUseCase),
    voteCommentUseCase: asClass(VoteCommentUseCase),
    updateCommentUseCase: asClass(UpdateCommentUseCase),
    commentRepository: asClass(CommentRepository),
  });
};

export default commentProvider;
