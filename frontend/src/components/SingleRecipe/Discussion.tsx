import { FC, useState, useRef, MutableRefObject } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useSendRecipeComment } from '@Application/use-case/comment/send-recipe-comment.use-case';
import { useUserStorage } from '@Services/storageAdapter';
import { useClickOutside } from '@Lib/hooks/useClickOutside';
import ModalSignUp from '@Components/SingleRecipe/ModalSignUp';
import Comment from '@Components/SingleRecipe/Comment';
import { UserIcon } from '@Components/Icons/user.icon';
import type { IRecipe } from '@Interfaces/domain/recipe.interface';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import type { FetchMoreFindRecipeArgs } from '@Types/apollo/query/fetch-more.type';
import type { FormValuesDiscussion } from '@Types/forms/discussion.type';

const DEFAULT_MESSAGE_DISCUSSION = '';
const USER_ICON_DIMENSION = 45;

export type DiscussionProps = {
  recipe: IRecipe;
  fetchMore: (variables: FetchMoreFindRecipeArgs) => void;
};

const Discussion: FC<DiscussionProps> = ({ recipe, fetchMore }) => {
  const { url_query } = recipe;
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const componentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const { authState } = useUserStorage();
  const { sendRecipeComment } = useSendRecipeComment({
    recipeUrlQuery: url_query,
  });

  const { handleSubmit, register, reset } = useForm<FormValuesDiscussion>({
    defaultValues: { message: DEFAULT_MESSAGE_DISCUSSION },
  });

  useClickOutside(componentRef, setShowModal);

  const handleSignUp = () => {
    router.push(MainPaths.SIGNUP);
  };

  const onSubmit = handleSubmit(async (data) => {
    const { message } = data;

    if (!authState?.user) return setShowModal(true);

    const response = await sendRecipeComment({
      message,
      recipeUrlQuery: url_query,
    });

    if (response?.data) reset();
  });

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md px-5 py-4">
      {showModal && (
        <div ref={componentRef}>
          <ModalSignUp onSignUp={handleSignUp} />
        </div>
      )}
      <h1 className="text-lg font-body font-bold mb-4">Discussion</h1>
      <div className="flex flex-row w-full">
        <div>
          <UserIcon
            imageUrl={authState?.user?.image_url}
            imageName={authState?.user?.image_name}
            w={USER_ICON_DIMENSION}
            h={USER_ICON_DIMENSION}
          />
        </div>

        <div className="relative xssm:w-8/12 w-10/12 ml-2">
          <form onSubmit={onSubmit}>
            <textarea
              className="bg-white font-body shadow appearance-none border rounded w-full h-32 mb-3 py-2 px-3 
                  text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Write your comment here..."
              {...register('message')}
            />

            <button className="absolute ml-1 px-2 py-2 rounded-lg bg-black text-white font-roboto font-bold hover:bg-gray-800 cursor-pointer">
              <span>SEND</span>
            </button>
          </form>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="border-t border-gray-400 mb-4">
          {recipe?.comments?.map((comment, index) => (
            <Comment
              key={comment._id}
              comment={comment}
              index={index}
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
