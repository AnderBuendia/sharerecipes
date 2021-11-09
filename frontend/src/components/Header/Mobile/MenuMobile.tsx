import { FC, useRef, MutableRefObject } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthenticate } from '@Application/authenticate';
import { useClickOutside } from '@Lib/hooks/useClickOutside';
import { useUserStorage } from '@Services/storageAdapter';
import { CloseIcon } from '@Components/Icons/close.icon';
import { DocumentIcon } from '@Components/Icons/document.icon';
import { AdminIcon } from '@Components/Icons/admin.icon';
import { MenuMobileIcon } from '@Components/Icons/menu-mobile.icon';
import { UserIcon } from '@Components/Icons/user.icon';
import { MainPaths } from '@Enums/paths/main-paths.enum';
import { UserRoles } from '@Enums/user/user-roles.enum';

const MenuMobile: FC = () => {
  const { authState } = useUserStorage();
  const { openDropdown, setOpenDropdown, signOut } = useAuthenticate();
  const componentRef = useRef() as MutableRefObject<HTMLDivElement>;
  const router = useRouter();

  useClickOutside(componentRef, setOpenDropdown);

  const handleSignOut = async () => {
    setOpenDropdown(false);

    const response = await signOut();

    if (response) router.push(MainPaths.INDEX);
  };

  return (
    <div ref={componentRef}>
      <div onClick={() => setOpenDropdown(!openDropdown)}>
        <MenuMobileIcon className="w-10 h-10 mr-2" />
      </div>
      <div
        className={`${
          openDropdown ? 'translate-x-0' : 'translate-x-full'
        } transform top-0 right-0 w-64
        bg-white dark:bg-gray-700 fixed h-full shadow-lg overflow-auto ease-in-out transition-all duration-300 z-30`}
      >
        {openDropdown && (
          <aside>
            <CloseIcon
              className="ml-1 mt-1 p-2 w-10 left-0 cursor-pointer hover:bg-gray-100"
              onClick={() => setOpenDropdown(false)}
            />
            <div className="flex flex-col items-center w-full px-6">
              {authState?.user ? (
                <>
                  <UserIcon
                    imageUrl={authState.user.image_url}
                    imageName={authState.user.image_name}
                    w={80}
                    h={80}
                  />

                  <p className="mt-1 font-bold font-roboto">
                    {authState.user.email}
                  </p>
                  <p className="mb-4 font-roboto">{authState.user.name}</p>
                  <Link href={MainPaths.PROFILE}>
                    <a
                      className="w-8/12 text-center py-1 px-3 rounded-full cursor-pointer border border-black 
                      text-white bg-gray-400 hover:bg-gray-200 hover:text-black"
                    >
                      My Account
                    </a>
                  </Link>

                  <div className="w-full bg-gray-700 border border-black my-5 rounded-full" />

                  <Link href={MainPaths.NEW_RECIPE}>
                    <a className="flex flex-row self-start">
                      <DocumentIcon className="w-5 mr-1" />{' '}
                      <span>New Recipe</span>
                    </a>
                  </Link>
                  {authState?.user?.role.includes(UserRoles.ADMIN) && (
                    <Link href={MainPaths.ADMIN}>
                      <a className="flex flex-row self-start mt-3">
                        <AdminIcon className="w-5 mr-1" />{' '}
                        <span>Admin Menu</span>
                      </a>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link href={MainPaths.LOGIN}>
                    <a
                      className="w-1/2 p-1 mb-3 rounded-full text-center cursor-pointer border border-black 
                      text-white bg-gray-400 hover:bg-gray-200 hover:text-black"
                    >
                      Login
                    </a>
                  </Link>
                  <Link href={MainPaths.SIGNUP}>
                    <a
                      className="w-1/2 p-1 rounded-full text-center border border-black
                      text-white bg-gray-400 hover:bg-gray-200 hover:text-black"
                    >
                      Sign Up
                    </a>
                  </Link>
                </>
              )}
              <div className="w-full bg-gray-700 border border-black my-5 rounded-full" />

              <div className="flex flex-col w-full mb-5">
                <Link href="#">
                  <a className="px-1 pb-1">Privacy Policy</a>
                </Link>
                <Link href="#">
                  <a className="p-1">Cookies Policy</a>
                </Link>
                <Link href="#">
                  <a className="p-1">Legal Notice</a>
                </Link>
              </div>

              {authState?.user && (
                <Link href={MainPaths.PROFILE}>
                  <button
                    className="w-8/12 text-center py-1 px-3 rounded-full cursor-pointer border border-black 
                  text-white bg-gray-400 hover:bg-gray-200 hover:text-black"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </Link>
              )}
            </div>

            <div className="w-full bg-black fixed bottom-0 p-4">
              <p className="text-center text-white">anderb - 2021</p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default MenuMobile;
