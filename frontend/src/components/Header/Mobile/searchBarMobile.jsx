import { useState, useRef } from 'react';
import { searchRecipes } from '../../../lib/utils/header.utils';
import SearchIcon from '../../icons/searchicon';
import CloseIcon from '../../icons/closeicon';
import useClickOutside from '../../../lib/hooks/useClickOutside';

const SearchBarMobile = () => {
  const componentRef = useRef();
  const [search, setSearch] = useState('');
  const [openSearchBar, setOpenSearchBar] = useState(false);
  useClickOutside(componentRef, setOpenSearchBar);

  return (
    <div ref={componentRef}>
      <div onClick={() => setOpenSearchBar(!openSearchBar)}>
        <SearchIcon className="w-8 h-8 mr-2" />
      </div>

      {openSearchBar && (
        <div className="mdxl:hidden bg-white w-full absolute top-0 left-0 center">
          <form
            onSubmit={(e) => searchRecipes(e, search)}
            className="w-full flex flex-row items-center"
          >
            <button
              type="submit"
              className="p-2 cursor-pointerfocus:outline-none"
            >
              <SearchIcon className="w-8" />
            </button>

            <input
              type="search"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              className="placeholder-gray-600 py-4 px-2 w-full focus:outline-none"
            />
            <CloseIcon
              className="p-2 w-12 cursor-pointer"
              onClick={() => setOpenSearchBar(false)}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default SearchBarMobile;
