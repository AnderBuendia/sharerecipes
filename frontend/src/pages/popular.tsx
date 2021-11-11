import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '@Lib/utils/ssr.utils';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { useRecipe } from '@Services/recipeAdapter';
import MainLayout from '@Components/Layouts/MainLayout';
import RecipesList from '@Components/Recipes/RecipesList';
import { GSSProps } from '@Interfaces/props/gss-props.interface';
import { MainPaths } from '@Enums/paths/main-paths.enum';

const PopularPage: NextPage = () => {
  const { getBestRecipes } = useRecipe();
  const { data, loading, fetchMore } = getBestRecipes({
    offset: 0,
    limit: 20,
  });

  const recipes = data ? data.getBestRecipes : null;

  return (
    <MainLayout
      title="Search"
      description="Search in ShareYourRecipes"
      url={MainPaths.POPULAR}
    >
      <RecipesList
        recipes={recipes}
        fetchMore={fetchMore}
        loading={loading}
        title="Popular Recipes"
      />
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

export default PopularPage;
