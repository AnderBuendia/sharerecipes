import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { useToasts } from 'react-toast-notifications';
import { decode } from 'jsonwebtoken';
import { getJwtFromCookie } from '../../lib/utils/jwt-cookie.utils';
import { isRequestSSR, loadAuthProps } from '../../lib/utils/ssr.utils';
import { createApolloClient } from '../../lib/apollo/apollo-client';
import MainLayout from '../../components/layouts/MainLayout';
import Discussion from '../../components/SingleRecipe/Discussion';
import Spinner from '../../components/generic/Spinner';
import { GET_RECIPES } from '../../lib/graphql/recipe/query';
import { VOTE_RECIPE } from '../../lib/graphql/recipe/mutation';
import { DELETE_RECIPE } from '../../lib/graphql/recipe/mutation';
import { GET_RECIPE } from '../../lib/graphql/recipe/query';
import { MainPaths } from '../../enums/paths/main-paths';
import RecipeData from '../../components/SingleRecipe/RecipeData';

const Recipe = () => {
  const router = useRouter();
  const {
    query: { recipe: url },
  } = router;

  const { addToast } = useToasts();

  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    update(cache) {
      const data = cache.readQuery({
        query: GET_RECIPES,
        variables: {
          offset: 0,
          limit: 20,
        },
      });

      cache.writeQuery({
        query: GET_RECIPES,
        variables: {
          offset: 0,
          limit: 20,
        },
        data: {
          ...data,
          getRecipes: data.getRecipes.filter(
            (currentRecipe) => currentRecipe._id !== recipe._id
          ),
        },
      });
    },
  });

  const [voteRecipe] = useMutation(VOTE_RECIPE);

  const handleVoteRecipe = async (votes) => {
    try {
      await voteRecipe({
        variables: {
          recipeUrl: url,
          input: {
            votes,
          },
        },
      });
    } catch (error) {
      addToast(error.message.replace('GraphQL error: ', ''), {
        appearance: 'error',
      });
    }
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          /* Delete recipe by recipe url */
          await deleteRecipe({
            variables: {
              _id,
            },
          });

          Swal.fire('Deleted!', 'Recipe has been deleted', 'success');

          /* Redirect to Home Page */
          router.push('/');
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  /* Apollo queries */
  const { data, loading, fetchMore } = useQuery(GET_RECIPE, {
    variables: {
      recipeUrl: url,
      offset: 0,
      limit: 10,
    },
  });

  /* Apollo query data */
  const recipe = data ? data.getRecipe : null;

  return loading ? (
    <Spinner />
  ) : (
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

      <Discussion recipe={recipe} query={GET_RECIPE} fetchMore={fetchMore} />
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
