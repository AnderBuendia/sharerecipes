import { useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useClickOutside from '@Lib/hooks/useClickOutside';
import { MainPaths } from '@Enums/paths/main-paths';
import { UserRoles } from '@Enums/user/user-roles';
import UserIcon from '@Components/Icons/usericon';

const DropdownMenu = ({ user, signOut, open, setOpen }) => {
  const { name, image_url, image_name, role } = user;
  const router = useRouter();
  const componentRef = useRef();

  useClickOutside(componentRef, setOpen);

  const onClickSignOut = async () => {
    try {
      await signOut();
      router.push(MainPaths.INDEX);
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!user) return null;

  return (
    <div ref={componentRef} className="relative inline-block text-left mr-4">
      <div
        className="flex items-center justify-center rounded-full cursor-pointer 
            hover:shadow-xl hover:p-4 hover:opacity-80"
        aria-expanded="true"
        onClick={() => setOpen(!open)}
      >
        <UserIcon imageUrl={image_url} imageName={image_name} w={46} h={46} />
      </div>

      {open && (
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
                onClick={() => onClickSignOut()}
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
