import type { FC, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useSearchStorage } from '@Services/storage.service';
import { SearchIcon } from '@Components/Icons/search.icon';
import { MainPaths } from '@Enums/paths/main-paths.enum';

const SearchBarDesktop: FC = () => {
  const router = useRouter();
  const { search, setSearch } = useSearchStorage();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (search.trim() === '') return;

    router.push({
      pathname: MainPaths.SEARCH,
      query: { q: search },
    });
  };

  return (
    <div className="xssm:hidden w-2/6 relative text-black">
      <form className="flex flex-row items-center" onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-11/12 p-3 border-2 rounded-l-lg border-gray-800 text-sm focus:outline-none bg-white placeholder-gray-700 dark:bg-gray-300"
        />
        <button className="search-button-desktop">
          <SearchIcon className="w-6 h-8" />
        </button>
      </form>
    </div>
  );
};

export default SearchBarDesktop;
