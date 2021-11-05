import { FC, useRef, MutableRefObject } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useClickOutside from '@Lib/hooks/useClickOutside';
import { UserIcon } from '@Components/Icons/user.icon';
import { UserRoles } from '@Enums/user/user-roles.enum';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { UserCompleteProfile } from '@Interfaces/auth/user.interface';
import { useAuthentication } from '@Lib/service/authAdapter';

export type DropdownMenuProps = {
  user: UserCompleteProfile;
};

const DropdownMenu: FC<DropdownMenuProps> = ({ user }) => {
  const { openDropdown, setOpenDropdown, signOut } = useAuthentication();
  const { name, image_url, image_name, role } = user;
  const router = useRouter();
  const componentRef = useRef() as MutableRefObject<HTMLDivElement>;

  useClickOutside(componentRef, setOpenDropdown);

  const handleSignOut = async () => {
    const response = await signOut();

    if (response) router.push(MainPaths.INDEX);
  };

  if (!user) return null;

  return (
    <div ref={componentRef} className="relative inline-block text-left mr-4">
      <div
        className="flex items-center justify-center rounded-full cursor-pointer 
            hover:shadow-xl hover:p-4 hover:opacity-80"
        aria-expanded="true"
        onClick={() => setOpenDropdown(!openDropdown)}
      >
        <UserIcon imageUrl={image_url} imageName={image_name} w={46} h={46} />
      </div>

      {openDropdown && (
        <div className="origin-top-right absolute z-20 right-0 mt-2 w-56 rounded-md shadow-lg font-roboto">
          <div
            className="rounded-md bg-white dark:bg-gray-700 shadow-xs"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1 dark:text-white">
              <p
                className="block px-4 py-2 text-sm font-bold leading-5"
                role="menuitem"
              >
                Hi, {name}
              </p>
              <div className="border-t border-gray-200"></div>
              {role.includes(UserRoles.ADMIN) && (
                <Link href={MainPaths.ADMIN}>
                  <a
                    className="block px-4 py-2 text-sm leading-5 hover:bg-gray-200 
                    hover:text-gray-900 focus:outline-none"
                    role="menuitem"
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
                >
                  Profile
                </a>
              </Link>
            </div>
            <div className="border-t border-gray-200"></div>
            <div className="py-1 dark:text-white">
              <button
                onClick={handleSignOut}
                className="w-full text-left block px-4 py-2 text-sm leading-5 font-bold 
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
