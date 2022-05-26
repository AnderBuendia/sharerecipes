import { FC, useRef, MutableRefObject } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthenticate } from '@Application/authenticate';
import { useClickOutside } from '@Lib/hooks/useClickOutside';
import { UserIcon } from '@Components/Icons/user.icon';
import { UserRoles } from '@Enums/user/user-roles.enum';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import type { UserCompleteProfile } from '@Interfaces/domain/user.interface';

export type DropdownMenuProps = {
  user: UserCompleteProfile;
};

const DropdownMenu: FC<DropdownMenuProps> = ({ user }) => {
  const { name, imageUrl, imageName, role } = user;
  const { openDropdown, setOpenDropdown, signOut } = useAuthenticate();
  const router = useRouter();
  const componentRef = useRef() as MutableRefObject<HTMLDivElement>;

  useClickOutside(componentRef, setOpenDropdown);

  const handleSignOut = async () => {
    setOpenDropdown(false);

    const response = await signOut();

    if (response) router.push(MainPaths.INDEX);
  };

  if (!user) return null;

  return (
    <div ref={componentRef} className="relative inline-block">
      <div
        className="flex items-center rounded-full cursor-pointer 
            hover:shadow-xl hover:shadow-gray-800/50 hover:opacity-60 transition duration-500 ease-in-out"
        aria-expanded="true"
        onClick={() => setOpenDropdown(!openDropdown)}
      >
        <UserIcon imageUrl={imageUrl} imageName={imageName} w={46} h={46} />
      </div>

      {openDropdown && (
        <div className="origin-top-right absolute z-20 right-0 mt-2 w-56 rounded-md shadow-lg font-roboto">
          <div
            className="rounded-md bg-white dark:bg-gray-700 shadow-xs"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="dark:text-white">
              <p
                className="block px-4 py-3 text-sm font-bold leading-5 border-b border-gray-200"
                role="menuitem"
              >
                <span>Hi, {name}</span>
              </p>
              {role === UserRoles.ADMIN && (
                <Link href={MainPaths.ADMIN}>
                  <a
                    className="block px-4 py-2 text-sm leading-5 hover:bg-gray-200 
                    hover:text-gray-900 focus:outline-none"
                    role="menuitem"
                    onClick={() => setOpenDropdown(false)}
                  >
                    Admin Menu
                  </a>
                </Link>
              )}
              <Link href={MainPaths.PROFILE}>
                <a
                  className="block px-4 py-2 text-sm leading-5 hover:bg-gray-200 hover:text-gray-900 
                        focus:outline-none"
                  role="menuitem"
                  onClick={() => setOpenDropdown(false)}
                >
                  Profile
                </a>
              </Link>
            </div>
            <div className="dark:text-white border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full text-left block px-4 py-3 text-sm leading-5 font-bold 
                    hover:bg-gray-200 hover:text-gray-900 focus:outline-none"
                role="menuitem"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
