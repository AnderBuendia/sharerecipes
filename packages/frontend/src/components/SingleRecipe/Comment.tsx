import type { FC } from 'react';
import { useState } from 'react';
import { Waypoint } from 'react-waypoint';
import { useUserStorage } from '@Services/storage.service';
import { useEditComment } from '@Application/use-case/comment/edit-comment.use-case';
import { useVoteComment } from '@Application/use-case/comment/vote-comment.use-case';
import { useTimeAgo } from '@Lib/hooks/useTimeAgo';
import { UserIcon } from '@Components/Icons/user.icon';
import { ChevronUpIcon } from '@Components/Icons/chevron-up.icon';
import type { IRecipe } from '@Interfaces/domain/recipe.interface';
import type { IComment } from '@Interfaces/domain/comment.interface';
import type { FetchMoreFindRecipeArgs } from '@Types/apollo/query/fetch-more.type';

const USER_ICON_DIMENSIONS = 28;

function renderInfiniteScroll(
  index: number,
  recipe: IRecipe,
  fetchMore: (variables: FetchMoreFindRecipeArgs) => void
) {
  return (
    index === recipe.comments.length - 1 && (
      <Waypoint
        onEnter={() =>
          fetchMore({
            variables: {
              recipeUrlQuery: recipe.urlQuery,
              offset: 0,
              limit: index + 11,
            },
          })
        }
      />
    )
  );
}

export type CommentProps = {
  comment: IComment;
  recipe: IRecipe;
  index: number;
  fetchMore: (variables: FetchMoreFindRecipeArgs) => void;
};

const Comment: FC<CommentProps> = ({ comment, recipe, index, fetchMore }) => {
  const { _id, message, votes, author, createdAt, edited } = comment;
  const [isEditing, setIsEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(message);
  const { authState } = useUserStorage();
  const { editComment } = useEditComment();
  const { voteComment } = useVoteComment();
  const timeago = useTimeAgo(createdAt);

  const handleEdit = (editMessage: string) => {
    editComment({ commentId: _id, message: editMessage });

    setIsEditing(false);
  };

  const handleVoteComment = () => {
    voteComment({ commentId: _id });
  };

  const showUpvotes = votes > 0 ? `(${votes})` : ' ';

  return (
    <>
      <div className="flex w-full items-center mt-4">
        <UserIcon
          imageUrl={author.imageUrl}
          imageName={author.imageName}
          w={USER_ICON_DIMENSIONS}
          h={USER_ICON_DIMENSIONS}
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
            className="py-1 px-2 bg-white border border-black rounded-md hover:bg-gray-50 hover:border-blue-400 leading-tight focus:shadow-outline text-black"
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
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
            <span>Upvote {showUpvotes}</span>
          </button>

          {authState?.user?.email === author.email && (
            <button
              className="ml-3 text-xs font-bold text-gray-400"
              onClick={
                isEditing
                  ? () => handleEdit(editMessage)
                  : () => setIsEditing(true)
              }
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          )}
        </div>
      </div>
      {renderInfiniteScroll(index, recipe, fetchMore)}
    </>
  );
};

export default Comment;
