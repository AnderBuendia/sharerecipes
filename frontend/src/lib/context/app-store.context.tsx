import { FC, useState, createContext, useContext } from 'react';

const AppStoreContext = createContext<any>({});

export const useAppStore = () => useContext(AppStoreContext);

export const AppProviderStore: FC = ({ children }) => {
  const [recipes, setRecipes] = useState();
  const [comment, setComment] = useState();

  const value = {
    recipes,
    comment,
    setRecipes,
    setComment,
  };
  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
};

export default AppStoreContext;
