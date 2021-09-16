import { useState } from 'react';
import Image from 'next/image';
import { Waypoint } from 'react-waypoint';
import useUser from '@Lib/hooks/user/useUser';
import useTimeAgo from '@Lib/hooks/useTimeAgo';
import UserIcon from '@Components/Icons/usericon';
import ChevronUp from '@Components/Icons/chevronUp';

const Comment = ({
  comment,
  recipe,
  i,
  fetchMore,
  setEditCommentRecipe,
  setVoteCommentRecipe,
}) => {
  const { _id, message, votes, author, createdAt, edited } = comment;
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(message);

  const timeago = useTimeAgo(createdAt);
  const { authState } = useUser();

  const handleEdit = (editComment) => {
    setEditCommentRecipe({ _id, editComment });

    setIsEditing(false);
  };

  const handleVoteComment = () => {
    setVoteCommentRecipe({ _id });
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
            <span className="ml-1 px-2 rounded-full bg-green-100 text-green-900 font-light text-xs uppercase">
              Chef
            </span>
          )}
        </p>
        <p className="text-sm text-gray-400 mx-2">
          {timeago}
          <span>{edited && ' - edited'}</span>
        </p>
      </div>
      <div className="ml-10 mb-5">
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
            <ChevronUp className="w-5 h-5" />
            <span>Upvote {votes > 0 && `(${votes})`}</span>
          </button>
          {authState.user && authState.user.email === author.email && (
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
      {i === recipe.comments.length - 1 && (
        <Waypoint
          onEnter={() =>
            fetchMore({
              variables: {
                _id: recipe._id,
                offset: 0,
                limit: i + 11,
              },
            })
          }
        />
      )}
    </div>
  );
};

export default Comment;
