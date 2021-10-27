import { MainPaths } from '@Enums/paths/main-paths';

export const searchRecipes = (e, search, router) => {
  e.preventDefault();

  if (search.trim() === '') return;

  /* Redirect to the search page */
  router.push({
    pathname: MainPaths.SEARCH,
    query: { q: search },
  });
};
