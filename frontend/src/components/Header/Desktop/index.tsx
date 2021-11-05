import { FC } from 'react';
import Link from 'next/link';
import useUser from '@Lib/hooks/user/useUser';
import SearchBarDesktop from '@Components/Header/Desktop/SearchBarDesktop';
import DarkModeButton from '@Components/generic/DarkModeButton';
import DropdownMenu from './DropdownMenu';
import { RamenIcon } from '@Components/Icons/ramen.icon';
import { MainPaths } from '@Enums/paths/main-paths.enum';

const HeaderDesktop: FC = () => {
  const { authState, signOut, open, setOpen } = useUser();

  return (
    <div className="xssm:hidden w-full py-2 px-4 flex flex-row items-center justify-between text-black bg-gray-400 dark:bg-gray-800">
      <Link href={MainPaths.INDEX}>
        <a>
          <RamenIcon w={44} h={44} />
        </a>
      </Link>

      <SearchBarDesktop />

      <div className="flex text-black items-center cursor-pointer">
        <DarkModeButton />

        {authState.user ? (
          <>
            <Link href={MainPaths.NEW_RECIPE}>
              <a
                className="bg-green-800 px-3 py-2 mr-5 rounded-lg text-white font-bold uppercase border-b-2 border-r-2 
                            border-green-700 shadow-md hover:bg-green-700 transition duration-500 ease-out transform hover:scale-95"
              >
                New Recipe
              </a>
            </Link>

            <DropdownMenu
              user={authState.user}
              signOut={signOut}
              open={open}
              setOpen={setOpen}
            />
          </>
        ) : (
          <>
            <Link href={MainPaths.LOGIN}>
              <a className="bg-red-500 border-red-700 text-white dark:bg-gray-500 dark:border-gray-700 px-4 py-2 rounded-lg font-bold border-b-2 border-r-2 uppercase mr-2">
                Login
              </a>
            </Link>
            <Link href={MainPaths.SIGNUP}>
              <a className="bg-black border-gray-600 hover:bg-gray-800 dark:bg-gray-500 dark:border-gray-700 px-4 py-2 rounded-lg text-white font-bold uppercase border-b-2 border-r-2">
                Sign Up
              </a>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderDesktop;