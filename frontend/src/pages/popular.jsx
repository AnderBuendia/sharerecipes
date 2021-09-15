import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '@Lib/utils/ssr.utils';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import useRecipes from '@Lib/hooks/recipe/useRecipes';
import MainLayout from '@Components/Layouts/MainLayout';
import RecipeCard from '@Components/Recipes/RecipeCard';
import RecipesList from '@Components/Recipes/RecipesList';
import Spinner from '@Components/generic/Spinner';
import { MainPaths } from '@Enums/paths/main-paths';

const Popular = () => {
  const { getBestRecipes } = useRecipes();
  const { data, loading, fetchMore } = getBestRecipes({
    offset: 0,
    limit: 20,
  });

  if (loading) return <Spinner />;
  const recipes = data ? data.getBestRecipes : null;

  const recipesRendered =
    recipes && recipes.length > 0 ? (
      recipes.map((recipe, index) => (
        <RecipeCard
          key={recipe._id}
          recipe={recipe}
          index={index}
          numberOfRecipes={recipes.length}
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
      title="Search"
      description="Search in ShareYourRecipes"
      url={MainPaths.POPULAR}
    >
      <div className="container mx-auto w-11/12">
        <h1 className="font-bold text-lg">Popular Recipes</h1>
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

export default Popular;
