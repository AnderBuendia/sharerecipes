import { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import RecipeCard from '@Components/Recipes/RecipeCard';
import { IRecipe } from '@Interfaces/domain/recipe.interface';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { FetchMoreGetRecipesArgs } from '@Types/apollo/query/fetch-more.type';

export type RecipesListProps = {
  recipes: IRecipe[] | null;
  fetchMore: (variables: FetchMoreGetRecipesArgs) => void;
  title: string;
};

const RecipesList: FC<RecipesListProps> = ({ recipes, fetchMore, title }) => {
  const router = useRouter();

  const recipesRendered =
    recipes && recipes.length > 0 ? (
      recipes.map((recipe: IRecipe, index: number) => (
        <RecipeCard
          key={recipe._id}
          recipe={recipe}
          numberOfRecipes={recipes.length}
          index={index}
          fetchMore={fetchMore}
        />
      ))
    ) : (
      <h3 className="text-4xl font-body font-bold text-center mt-10">
        No recipes
      </h3>
    );

  return (
    <div className="container mx-auto w-11/12">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg">{title}</h1>

        {router.pathname === MainPaths.INDEX && (
          <Link href={MainPaths.POPULAR}>
            <a
              className="ml-auto w-30 bg-purple-500 px-2 rounded-full shadow-lg cursor-pointer hover:bg-purple-600 
            transition duration-200 ease-in-out transform hover:scale-105 text-center text-gray-200 uppercase font-roboto text-xs hover:font-bold"
            >
              Popular Recipes
            </a>
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 cursor-pointer mt-2">
        {recipesRendered}
      </div>
    </div>
  );
};

export default RecipesList;
