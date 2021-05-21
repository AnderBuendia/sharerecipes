import { MockedProvider } from '@apollo/client/testing';
import { GET_RECIPES } from '../lib/graphql/recipe/query';
import { ToastProvider } from 'react-toast-notifications';

const getRecipesMock = {
  request: {
    query: GET_RECIPES,
    variables: {
      offset: 0,
      limit: 1,
    },
  },
  result: {
    data: {
      getRecipes: [
        {
          id: '1',
          name: 'Recipe',
          serves: 3,
          ingredients: '200g of water',
          prep_time: 32,
          difficulty: 'EASY',
          image_url: null,
          style: 'MEDITERRANEAN',
          description: 'test description',
          average_vote: 3,
          url: null,
        },
      ],
    },
  },
};

export default function IndexPageMock({ children }) {
  return (
    <MockedProvider mocks={[getRecipesMock]} addTypename={false}>
      <ToastProvider>{children}</ToastProvider>
    </MockedProvider>
  );
}
