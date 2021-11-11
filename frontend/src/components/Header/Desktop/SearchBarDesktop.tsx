import { useState, FC, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { SearchIcon } from '@Components/Icons/search.icon';
import { MainPaths } from '@Enums/paths/main-paths.enum';

const SearchBarDesktop: FC = () => {
  const [search, setSearch] = useState<string>('');
  const router = useRouter();

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
      <form onSubmit={handleSubmit}>
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
