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
import { useRecipeStorage } from '@Services/storageAdapter';
import MainLayout from '@Components/Layouts/MainLayout';
import RecipesList from '@Components/Recipes/RecipesList';
import RecipesNav from '@Components/Recipes/RecipesNav';
import SkeletonRecipeCard from '@Components/Recipes/SkeletonRecipeCard';
import type { GSSProps } from '@Interfaces/props/gss-props.interface';
import { MainPaths } from '@Enums/paths/main-paths.enum';

const IndexPage: NextPage = () => {
  const { sortRecipes } = useRecipeStorage();
  const { findRecipes } = useRecipe();
  const { data, loading, fetchMore } = findRecipes({
    sort: sortRecipes,
    offset: 0,
    limit: 20,
  });

  if (loading) {
    return (
      <div className="container mx-auto w-11/12 mt-16">
        <SkeletonRecipeCard />
        <SkeletonRecipeCard />
      </div>
    );
  }

  const recipes = data ? data.find_recipes : null;

  return (
    <MainLayout
      title="Home"
      description="Share your own recipes"
      url={MainPaths.INDEX}
    >
      <RecipesNav />
      <RecipesList recipes={recipes} fetchMore={fetchMore} />
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

export default IndexPage;
