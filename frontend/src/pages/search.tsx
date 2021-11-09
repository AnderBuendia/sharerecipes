import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { useRouter } from 'next/router';
import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '@Lib/utils/ssr.utils';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { useRecipe } from '@Services/recipeAdapter';
import { searchFilterRecipes } from '@Lib/utils/search-filter.utils';
import Spinner from '@Components/generic/Spinner';
import MainLayout from '@Components/Layouts/MainLayout';
import RecipeCard from '@Components/Recipes/RecipeCard';
import RecipesList from '@Components/Recipes/RecipesList';
import { GSSProps } from '@Interfaces/props/gss-props.interface';
import { IRecipe } from '@Interfaces/domain/recipe.interface';
import { MainPaths } from '@Enums/paths/main-paths.enum';

const SearchPage: NextPage = () => {
  const { getRecipes } = useRecipe();
  const { data, loading, fetchMore } = getRecipes({
    offset: 0,
    limit: 20,
  });
  const router = useRouter();
  const { q } = router.query as Record<string, string>;
  const search = q.toLowerCase();

  if (loading) return <Spinner />;

  const recipes = data ? data.getRecipes : null;
  const filterRecipes = searchFilterRecipes(recipes, search);

  const recipesRendered = filterRecipes ? (
    filterRecipes.map((recipe: IRecipe, index: number) => (
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

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const props: GSSProps = { lostAuth: false };
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

export default SearchPage;
