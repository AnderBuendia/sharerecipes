import { useState } from 'react';
import { searchRecipes } from '../../../lib/utils/header.utils';

import SearchIcon from '../../icons/searchicon';

const SearchBarDesktop = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="xssm:hidden w-2/6 relative text-black">
      <form onSubmit={(e) => searchRecipes(e, search)}>
        <input
          type="search"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-md text-sm focus:outline-none bg-white placeholder-gray-700 dark:bg-gray-200"
        />
        <button
          type="submit"
          className="search-button-desktop hover:opacity-50 focus:outline-none"
        >
          <SearchIcon className="w-5 text-white" />
        </button>
      </form>
    </div>
  );
};

export default SearchBarDesktop;
