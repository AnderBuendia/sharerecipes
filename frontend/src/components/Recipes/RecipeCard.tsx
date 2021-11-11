import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Waypoint } from 'react-waypoint';
import { ChatIcon } from '@Components/Icons/chat.icon';
import { StarIcon } from '@Components/Icons/star.icon';
import { IRecipe } from '@Interfaces/domain/recipe.interface';
import { FetchMoreGetRecipesArgs } from '@Types/apollo/query/fetch-more.type';

export type RecipeCardProps = {
  recipe: IRecipe;
  numberOfRecipes: number;
  index: number;
  fetchMore: (variables: FetchMoreGetRecipesArgs) => void;
};

const RecipeCard: FC<RecipeCardProps> = ({
  recipe,
  numberOfRecipes,
  index,
  fetchMore,
}) => {
  const {
    _id,
    name,
    prep_time,
    serves,
    difficulty,
    style,
    image_url,
    average_vote,
    url,
    comments,
  } = recipe;

  return (
    <>
      <Link
        href={{
          pathname: `recipe/${url}`,
          query: { _id },
        }}
      >
        <div className="w-full rounded overflow-hidden shadow-2xl transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-md cursor-pointer">
          <div
            className="px-3 py-3 bg-auto bg-center h-56 relative"
            style={{
              backgroundImage: `linear-gradient(180deg,transparent 0,rgba(0,0,0,.9) 150%)`,
            }}
          >
            {image_url && (
              <Image
                src={image_url}
                alt={name}
                objectFit="cover"
                layout="fill"
                priority
              />
            )}
            <div className="grid absolute bottom-0 mb-2">
              <div className="font-bold text-xl text-white">{name}</div>
              <div className="bg-white dark:bg-gray-700 flex items-center mr-auto px-2 rounded-full">
                <ChatIcon className="w-4 h-4 mr-0.5" />
                <span className="text-sm mr-1">
                  {comments ? comments.length : 0}
                </span>
                <StarIcon className="w-4 h-4 text-yellow-400 mr-0.5" />
                <span className="text-sm">{average_vote}</span>
              </div>
            </div>
          </div>
          <div className="dark:bg-gray-700 flex flex-wrap overflow-hidden text-center p-1">
            <div className="w-1/2 overflow-hidden p-1 border-r border-b border-gray-300">
              <p className="font-light text-xs uppercase">Prep time</p>
              <span className="font-bold">{prep_time} mins</span>
            </div>
            <div className="w-1/2 overflow-hidden p-1 border-b border-gray-300">
              <p className="font-light text-xs uppercase">Serves</p>
              <span className="font-bold">{serves}</span>
            </div>
            <div className="w-1/2 overflow-hidden p-1 border-r border-gray-300">
              <p className="font-light text-xs uppercase">Difficulty</p>
              <span className="font-bold uppercase">{difficulty}</span>
            </div>
            <div className="w-1/2 overflow-hidden p-1">
              <p className="font-light text-xs uppercase">Style</p>
              <span className="font-bold uppercase">{style}</span>
            </div>
          </div>
        </div>
      </Link>
      {index > 12 && index === numberOfRecipes - 1 && (
        <Waypoint
          onEnter={() => {
            fetchMore({
              variables: {
                offset: 0,
                limit: index + 20,
              },
            });
          }}
        />
      )}
    </>
  );
};

export default RecipeCard;
