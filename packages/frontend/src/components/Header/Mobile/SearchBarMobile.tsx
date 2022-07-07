import type { FC, FormEvent, MutableRefObject } from 'react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useClickOutside } from '@Lib/hooks/useClickOutside';
import { useSearchStorage } from '@Services/storage.service';
import { SearchIcon } from '@Components/Icons/search.icon';
import { CloseIcon } from '@Components/Icons/close.icon';
import { MainPaths } from '@Enums/paths/main-paths.enum';

const SearchBarMobile: FC = () => {
  const router = useRouter();
  const componentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [openSearchBar, setOpenSearchBar] = useState<boolean>(false);
  const { search, setSearch } = useSearchStorage();

  useClickOutside(componentRef, setOpenSearchBar);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (search.trim() === '') return;

    setOpenSearchBar(false);

    router.push({
      pathname: MainPaths.SEARCH,
      query: { q: search },
    });
  };

  return (
    <div ref={componentRef}>
      <div
        className="p-1 px-2 rounded-lg hover:bg-gray-500 hover:text-white"
        onClick={() => setOpenSearchBar(!openSearchBar)}
      >
        <SearchIcon className="w-8 h-8 " />
      </div>

      {openSearchBar && (
        <div className="px-3 py-1 mdxl:hidden bg-gray-100 dark:bg-gray-700 w-full absolute top-0 left-0 center">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-row items-center"
          >
            <button
              type="submit"
              className="p-2 rounded-lg cursor-pointer focus:outline-none hover:text-white hover:bg-gray-500"
            >
              <SearchIcon className="w-8" />
            </button>

            <input
              type="search"
              placeholder="Search..."
              className="bg-gray-100 placeholder-gray-900 py-4 px-2 w-full focus:outline-none dark:bg-gray-700 dark:placeholder-white"
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
            />
            <CloseIcon
              className="p-2 w-12 cursor-pointer rounded-lg hover:text-white hover:bg-gray-500"
              onClick={() => setOpenSearchBar(false)}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default SearchBarMobile;
