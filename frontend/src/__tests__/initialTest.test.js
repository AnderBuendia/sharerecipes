import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Index from '../pages/index';
import IndexPageMockTheme from '../__mocks__/indexPageMock';

describe('Initial tests', () => {
  test('Should find New Recipes Text', async () => {
    render(
      <IndexPageMockTheme>
        <Index />
      </IndexPageMockTheme>
    );

    const indexNewRecipes = await screen.findByText(/new recipes/i);
    expect(indexNewRecipes).toBeInTheDocument();
  });
});
