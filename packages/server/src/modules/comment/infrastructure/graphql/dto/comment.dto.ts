import { CommentEntityDoc } from '@Shared/infrastructure/http/mongodb/interfaces/documents/comment-document.interface';

export type PublicCommentDTO = CommentEntityDoc;

export interface SendRecipeCommentDTO {
  message: string;
}

export interface VoteCommentDTO {
  votes: number;
}

export interface UpdateCommentDTO extends SendRecipeCommentDTO {}
