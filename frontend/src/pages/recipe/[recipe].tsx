import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '@Lib/utils/ssr.utils';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import { useRecipe } from '@Services/recipeAdapter';
import { useVoteRecipe } from '@Application/use-case/recipe/vote-recipe.use-case';
import { useDeleteRecipe } from '@Application/use-case/recipe/delete-recipe.use-case';
import MainLayout from '@Components/Layouts/MainLayout';
import RecipeData from '@Components/SingleRecipe/RecipeData';
import Discussion from '@Components/SingleRecipe/Discussion';
import Spinner from '@Components/generic/Spinner';
import type { GSSProps } from '@Interfaces/props/gss-props.interface';
import type { IRecipe } from '@Interfaces/domain/recipe.interface';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { FIND_RECIPE } from '@Lib/graphql/recipe/query.gql';

const RecipePage: NextPage = () => {
  const router = useRouter();
  const { recipe: url_query, _id } = router.query as Record<string, string>;
  const { voteRecipe } = useVoteRecipe();
  const { findRecipe } = useRecipe();
  const { deleteRecipe } = useDeleteRecipe({ recipeId: _id });

  const { data, loading, fetchMore } = findRecipe({
    recipeUrlQuery: url_query,
    offset: 0,
    limit: 20,
  });

  const recipe = data ? data.find_recipe : null;

  const handleVoteRecipe = async (votes: number) => {
    await voteRecipe({ recipeUrlQuery: url_query, votes });
  };

  const confirmDeleteRecipe = (recipeId: IRecipe['_id']) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteRecipe({ recipeId });

        if (response?.data) {
          Swal.fire('Deleted!', 'Recipe has been deleted', 'success');
          router.push(MainPaths.INDEX);
        }
      }
    });
  };

  if (loading) return <Spinner />;

  return (
    <MainLayout
      title={recipe.name}
      description={`Recipe ${recipe.name}`}
      url={MainPaths.RECIPE}
    >
      <RecipeData
        recipe={recipe}
        url_query={url_query}
        confirmDeleteRecipe={confirmDeleteRecipe}
        handleVoteRecipe={handleVoteRecipe}
      />

      <Discussion recipe={recipe} fetchMore={fetchMore} />
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

  if (jwt) {
    if (isSSR) {
      const authProps = await loadAuthProps(ctx.res, jwt, apolloClient);

      if (authProps) props.authProps = authProps;
    } else if (!decode(jwt)) props.lostAuth = true;
  }

  await apolloClient.query({
    query: FIND_RECIPE,
    variables: {
      recipeUrlQuery: ctx.params?.recipe,
      offset: 0,
      limit: 10,
    },
  });

  props.apolloCache = apolloClient.cache.extract();

  return { props };
};

export default RecipePage;
