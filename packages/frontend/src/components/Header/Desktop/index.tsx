import type { FC } from 'react';
import Link from 'next/link';
import { useUserStorage } from '@Services/storage.service';
import SearchBarDesktop from '@Components/Header/Desktop/SearchBarDesktop';
import DarkModeButton from '@Components/generic/DarkModeButton';
import DropdownMenu from '@Components/Header/Desktop/DropdownMenu';
import { RamenIcon } from '@Components/Icons/ramen.icon';
import { MainPaths } from '@Enums/paths/main-paths.enum';

const HeaderDesktop: FC = () => {
  const { authState } = useUserStorage();

  return (
    <div className="flex flex-row items-center justify-between">
      <Link href={MainPaths.INDEX}>
        <a>
          <RamenIcon />
        </a>
      </Link>

      <SearchBarDesktop />

      <div className="flex flex-row justify-between items-center cursor-pointer">
        <DarkModeButton />

        {authState?.user ? (
          <>
            <Link href={MainPaths.NEW_RECIPE}>
              <a
                className="bg-green-800 px-3 py-2 mr-5 rounded-lg text-white font-bold uppercase border-b-2 border-r-2 
                            border-green-600 shadow-md hover:bg-green-700 transition duration-500 ease-out transform hover:scale-95"
              >
                New Recipe
              </a>
            </Link>

            <DropdownMenu user={authState?.user} />
          </>
        ) : (
          <>
            <Link href={MainPaths.LOGIN}>
              <a className="bg-red-500 border-red-700 text-white dark:bg-black dark:border-gray-900 px-4 py-2 rounded-lg font-bold border-b-2 border-r-2 uppercase mr-2 hover:opacity-60">
                <span>Login</span>
              </a>
            </Link>
            <Link href={MainPaths.SIGNUP}>
              <a className="bg-black border-gray-600 dark:bg-black dark:border-gray-900 px-4 py-2 rounded-lg text-white font-bold uppercase border-b-2 border-r-2 hover:opacity-60">
                <span>Sign Up</span>
              </a>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderDesktop;
