import { CommentEntityDoc } from '@Shared/infrastructure/http/mongodb/interfaces/documents/comment-document.interface';

export type PublicCommentDTO = CommentEntityDoc;

export interface UpdateCommentDTO {
  message: string;
}

export interface VoteCommentDTO {
  votes: number;
}

export interface SendRecipeCommentDTO {
  url_query: string;
  message: string;
}
