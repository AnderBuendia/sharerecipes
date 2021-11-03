import { FC } from 'react';
import Image from 'next/image';
import { Rating } from 'react-simple-star-rating';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';
import useUser from '@Lib/hooks/user/useUser';
import { IRecipe } from '@Interfaces/recipe/recipe.interface';

export type RecipeDataProps = {
  recipe: IRecipe;
  url: string;
  confirmDeleteRecipe: (_id: string) => void;
  handleVoteRecipe: (votes: number) => Promise<void>;
};

const RecipeData: FC<RecipeDataProps> = ({
  recipe,
  url,
  confirmDeleteRecipe,
  handleVoteRecipe,
}) => {
  const { authState } = useUser();
  const {
    _id,
    name,
    image_url,
    image_name,
    prep_time,
    serves,
    difficulty,
    style,
    ingredients,
    average_vote,
    voted,
    author,
    description,
  } = recipe;

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-5 mb-4">
      <h1 className="break-all text-2xl font-body font-bold mb-2">{name}</h1>
      <div className="w-full flex flex-col lgxl:flex-row lgxl:justify-between">
        <div className="lgxl:w-2/4 text-center ">
          {image_url && image_name && (
            <Image
              className="rounded-md mb-3"
              src={image_url}
              alt={image_name}
              layout="fixed"
              width={300}
              height={300}
            />
          )}
        </div>

        <div className="w-full lgxl:flex-col lgxl:ml-3 lgxl:mt-1 lgxl:w-2/4">
          <div className="w-full flex flex-row border-gray-400 border-t p-3 lgxl:p-0 lgxl:flex-col">
            <div className="w-full text-center lgxl:w-full lgxl:my-3">
              <p className="font-light text-xs uppercase">Preparation time</p>
              <span className="font-bold">{prep_time} mins</span>
            </div>
            <div className="w-full text-center border-l border-gray-400 lgxl:border-l-0 lg:p-2 lgxl:border-t lgxl:py-3">
              <p className="font-light text-xs uppercase">Serves</p>
              <span className="font-bold">{serves}</span>
            </div>
          </div>

          <div className="w-full flex flex-row border-gray-400 border-t border-b p-3 lgxl:p-0 lgxl:flex-col">
            <div className="w-full text-center lgxl:w-full lgxl:my-3">
              <p className="font-light text-xs uppercase">Difficulty</p>
              <span className="font-bold ">{difficulty}</span>
            </div>
            <div className="w-full text-center border-l border-gray-400 lgxl:border-l-0 lgxl:p-3 lgxl:border-t lgxl:py-3">
              <p className="font-light text-xs uppercase">Style</p>
              <span className="font-bold uppercase">{style}</span>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row">
              <FacebookShareButton
                url={process.env.NEXT_PUBLIC_SITE_URL + `/recipe/${url}`}
                quote="Visit my new recipe"
                className="cursor-pointer mr-3"
              >
                <FacebookIcon size={28} className="rounded-full" />
              </FacebookShareButton>
              <TwitterShareButton
                url={process.env.NEXT_PUBLIC_SITE_URL + `/recipe/${url}`}
                title="Visit my new recipe"
                className="cursor-pointer"
              >
                <TwitterIcon size={28} className="rounded-full" />
              </TwitterShareButton>
            </div>
            <div className="flex flex-col float-right items-end mt-4 ">
              <Rating
                ratingValue={Math.floor(average_vote)}
                onClick={handleVoteRecipe}
              />
              <p className="ml-1 text-lg">
                ({average_vote} from {voted.length} votes)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-2 flex flex-wrap lgxl:flex-nowrap lgxl:justify-between">
        <div className="w-full lgxl:w-2/5 lgxl:border-r-2 lgxl:border-gray-800">
          <h1 className="text-lg font-body font-bold">Ingredients</h1>
          {ingredients ? (
            <ul>
              {ingredients.map((ingredient) => (
                <li key={ingredient} className="px-2 py-1 font-body">
                  <span>- {ingredient}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-2 py-1 font-body">- There are no ingredients</p>
          )}
        </div>
        <div className="w-full mt-2 lgxl:w-3/5 lgxl:ml-2 lgxl:mt-0">
          <h2 className="text-lg font-body font-bold">Steps</h2>
          {description.split('\n').map((step) => (
            <p key={step} className="px-2 py-1 font-body">
              {step}
            </p>
          ))}
        </div>
      </div>
      {authState.user && author?.email === authState.user.email && (
        <div className="flex w-full mt-6">
          <button
            type="button"
            className="flex-1 mr-2 justify-center items-center bg-red-800 py-2 px-4 w-full
                  text-white rounded text-xs uppercase font-roboto font-bold hover:bg-red-600"
            onClick={() => confirmDeleteRecipe(_id)}
          >
            Delete Recipe
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeData;
