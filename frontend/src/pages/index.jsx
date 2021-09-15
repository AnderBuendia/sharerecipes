import Link from 'next/link';
import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '@Lib/utils/ssr.utils';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import MainLayout from '@Components/Layouts/MainLayout';
import RecipesList from '@Components/Recipes/RecipesList';
import RecipeCard from '@Components/Recipes/RecipeCard';
import Spinner from '@Components/generic/Spinner';
import { MainPaths } from '@Enums/paths/main-paths';
import useRecipes from '@Lib/hooks/recipe/useRecipes';

const Index = () => {
  const { getRecipes } = useRecipes();
  const { data, loading, fetchMore } = getRecipes({
    offset: 0,
    limit: 20,
  });

  if (loading) return <Spinner />;
  const recipes = data ? data.getRecipes : null;

  const recipesRendered =
    recipes && recipes.length > 0 ? (
      recipes.map((recipe, index) => (
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
    <MainLayout
      title="Home"
      description="Share your own recipes"
      url={MainPaths.INDEX}
    >
      <div className="container mx-auto w-11/12">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-lg">New Recipes</h1>

          <Link href={MainPaths.POPULAR}>
            <a
              className="ml-auto w-30 bg-purple-500 px-2 rounded-full shadow-lg cursor-pointer hover:bg-purple-600 
                transition duration-200 ease-in-out transform hover:scale-105 text-center text-gray-200 uppercase font-roboto text-xs hover:font-bold"
            >
              Popular Recipes
            </a>
          </Link>
        </div>

        <RecipesList>{recipesRendered}</RecipesList>
      </div>
    </MainLayout>
  );
};

export const getServerSideProps = async (ctx) => {
  const props = { lostAuth: false };
  const isSSR = isRequestSSR(ctx.req.url);

  const jwt = getJwtFromCookie(ctx.req.headers.cookie);

  if (jwt) {
    if (isSSR) {
      const apolloClient = createApolloClient();

      const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);

      if (authProps) props.authProps = authProps;
    } else if (!decode(jwt)) props.lostAuth = true;
  }

  return { props: props || null };
};

export default Index;
