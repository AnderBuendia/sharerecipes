import { FC, useState, createContext, useContext } from 'react';
import { SortRecipesEnum } from '@Enums/sort-recipes.enum';

const AppStoreContext = createContext<any>({});

export const useAppStore = () => useContext(AppStoreContext);

export const AppProviderStore: FC = ({ children }) => {
  const [search, setSearch] = useState<string>('');
  const [sortRecipes, setSortRecipes] = useState<string>(
    SortRecipesEnum.CREATED_AT
  );

  const value = {
    search,
    sortRecipes,
    setSearch,
    setSortRecipes,
  };

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
};

export default AppStoreContext;
