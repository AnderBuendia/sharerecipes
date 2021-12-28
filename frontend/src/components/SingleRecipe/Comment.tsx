import { FC, useState } from 'react';
import { Waypoint } from 'react-waypoint';
import { useUserStorage } from '@Services/storageAdapter';
import { useEditCommentRecipe } from '@Application/comment/editCommentRecipe';
import { useVoteCommentRecipe } from '@Application/comment/voteCommentRecipe';
import { useTimeAgo } from '@Lib/hooks/useTimeAgo';
import { UserIcon } from '@Components/Icons/user.icon';
import { ChevronUpIcon } from '@Components/Icons/chevron-up.icon';
import { IRecipe } from '@Interfaces/domain/recipe.interface';
import { IComment } from '@Interfaces/domain/comment.interface';
import { FetchMoreGetRecipeArgs } from '@Types/apollo/query/fetch-more.type';

export type CommentProps = {
  comment: IComment;
  recipe: IRecipe;
  index: number;
  fetchMore: (variables: FetchMoreGetRecipeArgs) => void;
};

const Comment: FC<CommentProps> = ({ comment, recipe, index, fetchMore }) => {
  const { _id, message, votes, author, createdAt, edited } = comment;
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(message);
  const { authState } = useUserStorage();
  const { editCommentRecipe } = useEditCommentRecipe();
  const { voteCommentRecipe } = useVoteCommentRecipe();
  const timeago = useTimeAgo(createdAt);

  const handleEdit = (editComment: string) => {
    editCommentRecipe({ commentId: _id, message: editComment });

    setIsEditing(false);
  };

  const handleVoteComment = () => {
    voteCommentRecipe({ commentId: _id });
  };

  return (
    <div>
      <div className="flex w-full items-center mt-4">
        <UserIcon
          imageUrl={author.image_url}
          imageName={author.image_name}
          w={28}
          h={28}
        />
        <p className="ml-2 font-roboto text-sm font-bold">
          {author.name}
          {author.email === recipe.author?.email && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-900 text-xs uppercase">
              Chef
            </span>
          )}
        </p>
        <p className="text-sm text-gray-400 mx-2">
          {timeago && timeago}
          {edited && <span> - edited</span>}
        </p>
      </div>

      <div className="px-10">
        {isEditing ? (
          <input
            type="text"
            className="py-1 px-2 bg-white border border-black rounded-md hover:bg-gray-50 hover:border-blue-400 leading-tight focus:shadow-outline"
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
          />
        ) : (
          <p className="break-all font-roboto text-sm font-medium">{message}</p>
        )}

        <div className="flex mt-1 items-center">
          <button
            className="flex font-bold items-center content-center text-xs text-gray-400"
            onClick={handleVoteComment}
          >
            <ChevronUpIcon className="w-5 h-5" />
            <span>Upvote {votes > 0 && `(${votes})`}</span>
          </button>

          {authState?.user && authState.user.email === author.email && (
            <button
              className="ml-3 text-xs font-bold text-gray-400"
              onClick={
                isEditing
                  ? () => handleEdit(editComment)
                  : () => setIsEditing(true)
              }
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          )}
        </div>
      </div>
      {index === recipe.comments.length - 1 && (
        <Waypoint
          onEnter={() =>
            fetchMore({
              variables: {
                recipeUrl: recipe.url,
                offset: 0,
                limit: index + 11,
              },
            })
          }
        />
      )}
    </div>
  );
};

export default Comment;
