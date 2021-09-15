import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '@Lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '@Lib/utils/ssr.utils';
import { createApolloClient } from '@Lib/apollo/apollo-client';
import useRecipes from '@Lib/hooks/recipe/useRecipes';
import useDeleteRecipe from '@Lib/hooks/recipe/useDeleteRecipe';
import MainLayout from '@Components/Layouts/MainLayout';
import RecipeData from '@Components/SingleRecipe/RecipeData';
import Discussion from '@Components/SingleRecipe/Discussion';
import Spinner from '@Components/generic/Spinner';
import { MainPaths } from '@Enums/paths/main-paths';
import { GET_RECIPE } from '@Lib/graphql/recipe/query';

const Recipe = () => {
  const router = useRouter();
  const {
    query: { recipe: url, _id },
  } = router;
  const { getRecipe, setVoteRecipe } = useRecipes();
  const { setDeleteRecipe } = useDeleteRecipe({ _id });

  const { data, loading, fetchMore } = getRecipe({
    recipeUrl: url,
    offset: 0,
    limit: 20,
  });
  const recipe = data ? data.getRecipe : null;

  const handleVoteRecipe = async (votes) => {
    setVoteRecipe({ url, votes });
  };

  const confirmDeleteRecipe = (_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        const response = setDeleteRecipe({ _id });

        if (response) {
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
        url={url}
        confirmDeleteRecipe={confirmDeleteRecipe}
        handleVoteRecipe={handleVoteRecipe}
      />

      <Discussion recipe={recipe} fetchMore={fetchMore} />
    </MainLayout>
  );
};

export const getServerSideProps = async (ctx) => {
  const props = { lostAuth: false };
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
    query: GET_RECIPE,
    variables: {
      recipeUrl: ctx.params?.recipe,
      offset: 0,
      limit: 10,
    },
  });

  props.apolloCache = apolloClient.cache.extract();

  return { props };
};

export default Recipe;
