import { FormEvent } from 'react';
import { NextRouter } from 'next/router';
import { MainPaths } from '@Enums/paths/main-paths.enum';

export const searchRecipes = (
  e: FormEvent<HTMLFormElement>,
  search: string,
  router: NextRouter
) => {
  e.preventDefault();

  if (search.trim() === '') return;

  /* Redirect to the search page */
  router.push({
    pathname: MainPaths.SEARCH,
    query: { q: search },
  });
};
