import { FC, useState, createContext, useContext } from 'react';

const AppStoreContext = createContext<any>({});

export const useAppStore = () => useContext(AppStoreContext);

export const AppProviderStore: FC = ({ children }) => {
  const [search, setSearch] = useState<string>('');

  const value = {
    search,
    setSearch,
  };

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
};

export default AppStoreContext;
