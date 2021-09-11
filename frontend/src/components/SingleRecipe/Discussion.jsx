import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import useUser from '@Lib/hooks/useUser';
import useClickOutside from '@Lib/hooks/useClickOutside';
import Image from 'next/image';
import ModalSignUp from '@Components/SingleRecipe/ModalSignUp';
import Comment from '@Components/SingleRecipe/Comment';
import { SEND_COMMENTS_RECIPE } from '@Lib/graphql/comments/mutation';
import { MainPaths } from '@Enums/paths/main-paths';

const Discussion = ({ recipe, query, fetchMore }) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { addToast } = useToasts();
  const { authState } = useUser();
  const componentRef = useRef();
  useClickOutside(componentRef, setShowModal);

  const image_user = authState.user?.image_url
    ? authState.user.image_url
    : '/usericon.jpeg';
  const image_name = authState.user?.image_name
    ? authState.user.image_name
    : 'UserIcon Image';

  const handleSignUp = () => {
    router.push(MainPaths.SIGNUP);
  };

  const [sendCommentsRecipe] = useMutation(SEND_COMMENTS_RECIPE, {
    update(cache, { data: { sendCommentsRecipe } }) {
      const data = cache.readQuery({
        query,
        variables: {
          recipeUrl: recipe.url,
          offset: 0,
          limit: 10,
        },
      });

      cache.writeQuery({
        query,
        variables: {
          recipeUrl: recipe.url,
          offset: 0,
          limit: 10,
        },
        data: {
          ...data,
          getRecipe: {
            comments: [...data.getRecipe.comments, sendCommentsRecipe],
          },
        },
      });
    },
  });

  const { handleSubmit, register, reset } = useForm({
    defaultValues: { description: '' },
  });

  const onSubmit = async (data) => {
    const { message } = data;

    if (!authState.user) return setShowModal(true);

    try {
      await sendCommentsRecipe({
        variables: {
          recipeUrl: recipe.url,
          input: {
            message,
          },
        },
      });

      reset();
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
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
          <Image
            className="block rounded-full"
            key={image_user}
            src={image_user}
            alt={image_name}
            width={256}
            height={256}
          />
        </div>

        <div className="w-8/12 relative">
          <form onSubmit={handleSubmit(onSubmit)}>
            <textarea
              className="bg-white font-body shadow appearance-none border rounded w-full h-32 mb-3 py-2 px-3 
                  text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              name="description"
              placeholder="Write your comment here..."
              {...register('description')}
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discussion;
