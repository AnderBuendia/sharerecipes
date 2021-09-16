import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useUser from '@Lib/hooks/user/useUser';
import useClickOutside from '@Lib/hooks/useClickOutside';
import useCommentRecipe from '@Lib/hooks/recipe/useCommentRecipe';
import ModalSignUp from '@Components/SingleRecipe/ModalSignUp';
import Comment from '@Components/SingleRecipe/Comment';
import UserIcon from '@Components/Icons/usericon';
import { MainPaths } from '@Enums/paths/main-paths';

const Discussion = ({ recipe, fetchMore }) => {
  const [showModal, setShowModal] = useState(false);
  const componentRef = useRef();
  const router = useRouter();
  const {
    authState: { user },
  } = useUser();
  const { setEditCommentRecipe, setVoteCommentRecipe, setSendCommentRecipe } =
    useCommentRecipe({ url: recipe.url });

  useClickOutside(componentRef, setShowModal);

  const handleSignUp = () => {
    router.push(MainPaths.SIGNUP);
  };

  const { handleSubmit, register, reset } = useForm({
    defaultValues: { message: '' },
  });

  const onSubmit = async (submitData) => {
    if (!user) return setShowModal(true);

    const response = setSendCommentRecipe({ submitData, url: recipe.url });

    if (response) reset();
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md px-5 py-4">
      {showModal && (
        <div ref={componentRef}>
          <ModalSignUp onSignUp={handleSignUp} />
        </div>
      )}
      <h1 className="text-lg font-body font-bold mb-4">Discussion</h1>
      <div className="flex w-full">
        <div className="w-10 mr-2">
          <UserIcon
            imageUrl={user?.image_user}
            imageName={user?.image_name}
            w={256}
            h={256}
          />
        </div>

        <div className="w-8/12 relative">
          <form onSubmit={handleSubmit(onSubmit)}>
            <textarea
              className="bg-white font-body shadow appearance-none border rounded w-full h-32 mb-3 py-2 px-3 
                  text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              name="message"
              placeholder="Write your comment here..."
              {...register('message')}
            />

            <input
              className="ml-1 px-2 py-2 rounded-lg bg-black text-white font-roboto font-bold absolute top-0 hover:bg-gray-800 cursor-pointer"
              type="submit"
              value="SEND"
            />
          </form>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="border-t border-gray-400 mb-4">
          {recipe.comments.map((comment, i) => (
            <Comment
              key={comment._id}
              comment={comment}
              i={i}
              fetchMore={fetchMore}
              recipe={recipe}
              setEditCommentRecipe={setEditCommentRecipe}
              setVoteCommentRecipe={setVoteCommentRecipe}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discussion;
