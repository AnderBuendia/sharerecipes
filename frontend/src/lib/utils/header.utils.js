import Router from 'next/router';
import { MainPaths } from '../../enums/paths/main-paths';

export const searchRecipes = (e, search) => {
  e.preventDefault();

  if (search.trim() === '') return;

  /* Redirect to the search page */
  Router.push({
    pathname: MainPaths.SEARCH,
    query: { q: search },
  });
};
