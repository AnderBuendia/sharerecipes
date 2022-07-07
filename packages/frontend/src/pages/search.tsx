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
import { useRecipe } from '@Services/recipe.service';
import MainLayout from '@Components/Layouts/MainLayout';
import RecipesList from '@Components/Recipes/RecipesList';
import SkeletonRecipeCard from '@Components/Recipes/SkeletonRecipeCard';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { RecipeQueryProperties } from '@Enums/graphql/query.enum';
import { FIND_RECIPES } from '@Lib/graphql/recipe/query.gql';
import type { GSSProps } from '@Interfaces/props/gss-props.interface';

const SORT_RECIPES_BY = '-createdAt';

const SearchPage: NextPage = () => {
  const router = useRouter();
  const { q } = router.query as Record<string, string>;
  const search = q.toLowerCase();
  const { findRecipes } = useRecipe();
  const { data, loading, fetchMore } = findRecipes({
    sort: SORT_RECIPES_BY,
    query: search,
    offset: RecipeQueryProperties.OFFSET_NUMBER,
    limit: RecipeQueryProperties.LIMIT_NUMBER,
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
      title="Search"
      description="Search in ShareYourRecipes"
      url={MainPaths.SEARCH}
    >
      <>
        <h2 className="font-bold text-lg my-5">
          Results by <span className="underline">{search}</span> (
          {recipes?.length})
        </h2>
        <RecipesList recipes={recipes} fetchMore={fetchMore} />
      </>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const props: GSSProps = { lostAuth: false };
  const isSSR = isRequestSSR(ctx.req.url);
  const jwt = getJwtFromCookie(ctx.req.headers.cookie);
  const apolloClient = createApolloClient();
  const { q } = ctx.query as Record<string, string>;

  if (jwt) {
    if (isSSR) {
      const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);

      if (authProps) props.authProps = authProps;
    } else if (!decode(jwt)) props.lostAuth = true;
  }

  await apolloClient.query({
    query: FIND_RECIPES,
    variables: {
      sort: SORT_RECIPES_BY,
      query: q.toLowerCase(),
      offset: RecipeQueryProperties.OFFSET_NUMBER,
      limit: RecipeQueryProperties.LIMIT_NUMBER,
    },
  });

  props.apolloCache = apolloClient.cache.extract();

  return { props: props || null };
};

export default SearchPage;
