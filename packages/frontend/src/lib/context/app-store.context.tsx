import type { FC, ReactNode, Dispatch, SetStateAction } from 'react';
import { useState, createContext, useContext } from 'react';
import { SortRecipesEnum } from '@Enums/sort-recipes.enum';

interface IAppStoreContext {
  search: string;
  sortRecipes: string;
  setSearch: Dispatch<SetStateAction<string>>;
  setSortRecipes: Dispatch<SetStateAction<string>>;
}

type AppStoreProviderProps = {
  children: ReactNode;
};

const AppStoreContext = createContext<IAppStoreContext>({} as any);

export const useAppStore = () => {
  const context = useContext(AppStoreContext);

  if (context === undefined || !Object.keys(context).length) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }

  return context;
};

export const AppProviderStore: FC<AppStoreProviderProps> = ({ children }) => {
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
