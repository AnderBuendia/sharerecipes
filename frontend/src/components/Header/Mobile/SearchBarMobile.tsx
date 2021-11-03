import { FC, useState, useRef, MutableRefObject } from 'react';
import { useRouter } from 'next/router';
import { searchRecipes } from '@Lib/utils/header.utils';
import { SearchIcon } from '@Components/Icons/search.icon';
import { CloseIcon } from '@Components/Icons/close.icon';
import useClickOutside from '@Lib/hooks/useClickOutside';

const SearchBarMobile: FC = () => {
  const componentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const router = useRouter();
  const [search, setSearch] = useState<string>('');
  const [openSearchBar, setOpenSearchBar] = useState<boolean>(false);
  useClickOutside(componentRef, setOpenSearchBar);

  return (
    <div ref={componentRef}>
      <div onClick={() => setOpenSearchBar(!openSearchBar)}>
        <SearchIcon className="w-8 h-8 mr-2" />
      </div>

      {openSearchBar && (
        <div className="mdxl:hidden bg-white dark:bg-gray-800 w-full absolute top-0 left-0 center">
          <form
            onSubmit={(e) => searchRecipes(e, search, router)}
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
