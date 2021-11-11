import { FC, useState, useRef, FormEvent, MutableRefObject } from 'react';
import { useRouter } from 'next/router';
import { useClickOutside } from '@Lib/hooks/useClickOutside';
import { SearchIcon } from '@Components/Icons/search.icon';
import { CloseIcon } from '@Components/Icons/close.icon';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { useSearchStorage } from '@Services/storageAdapter';

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
      <div onClick={() => setOpenSearchBar(!openSearchBar)}>
        <SearchIcon className="w-8 h-8 mr-2" />
      </div>

      {openSearchBar && (
        <div className="mdxl:hidden bg-white dark:bg-gray-800 w-full absolute top-0 left-0 center">
          <form
            onSubmit={handleSubmit}
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
              className="placeholder-gray-600 py-4 px-2 w-full focus:outline-none dark:bg-gray-800"
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
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
