import { useRouter } from 'next/router';
import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '@Lib/utils/ssr.utils';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import useRecipes from '@Lib/hooks/recipe/useRecipes';
import Spinner from '@Components/generic/Spinner';
import MainLayout from '@Components/Layouts/MainLayout';
import RecipeCard from '@Components/Recipes/RecipeCard';
import RecipesList from '@Components/Recipes/RecipesList';
import { MainPaths } from '@Enums/paths/main-paths';

const Search = () => {
  const { getRecipes } = useRecipes();
  const { data, loading, fetchMore } = getRecipes({
    offset: 0,
    limit: 20,
  });
  const router = useRouter();
  const {
    query: { q },
  } = router;
  const search = `${q}`.toLowerCase();

  if (loading) return <Spinner />;

  const recipes = data ? data.getRecipes : null;

  const filterRecipes = recipes.filter((recipe) => {
    return (
      recipe.name.toLowerCase().includes(search) ||
      recipe.description.toLowerCase().includes(search) ||
      recipe.style.toLowerCase().includes(search)
    );
  });

  const recipesRendered = filterRecipes ? (
    filterRecipes.map((recipe, index) => (
      <RecipeCard
        key={recipe._id}
        index={index}
        recipe={recipe}
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
      url={MainPaths.SEARCH}
    >
      <div className="container mx-auto w-11/12">
        <h1 className="font-bold text-lg">Results by {q}</h1>
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

export default Search;
