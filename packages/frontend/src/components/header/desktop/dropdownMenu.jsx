import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import onClickOutside from 'react-onclickoutside';
import Image from 'next/image';
import { useToasts } from 'react-toast-notifications';
import { MainPaths } from '../../../enums/paths/main-paths';
import { RestEndPoints } from '../../../enums/paths/rest-endpoints';
import { UserRoles } from '../../../enums/user/user-roles';

const DropdownMenu = ({user, setAuth}) => {
    /* Routing */
    const router = useRouter();
    
    /* Set Toast Notification */
    const { addToast } = useToasts();

    /* Dropdown user menu*/
    const [open, setOpen] = useState(false);

    DropdownMenu.handleClickOutside = () => setOpen(false);

    const onClickSignOut = async (router, setAuth) => {
        try {
            await fetch(RestEndPoints.LOGOUT, {
                method: 'POST',
            });
    
            await router.push(MainPaths.INDEX);
    
            setAuth({
                user: null,
                jwt: null,
            });
    
            
            addToast('You have been disconnected', { appearance: 'info' });
        } catch (error) {
            console.log(error);
        }
    };

    return (  
        <div className="relative inline-block text-left mr-4">
            <div
                className="flex items-center justify-center rounded-full cursor-pointer 
                    hover:shadow-xl hover:p-4 hover:opacity-80" aria-expanded="true"
                onClick={ () => setOpen(!open) }
            >
                <Image 
                    className="rounded-full"
                    key={user?.image_url ? user.image_url : '/usericon.jpeg'}
                    src={user?.image_url ? user.image_url : '/usericon.jpeg'}
                    alt={'UserIcon Image'}
                    width={46}
                    height={46}
                />
            </div>      
            { open && 
                <div className="origin-top-right absolute z-20 right-0 mt-2 w-56 rounded-md shadow-lg font-roboto">
                    <div className="rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <div className="py-1">
                            <p className="block px-4 py-2 text-sm font-bold leading-5 text-gray-700" role="menuitem">Hi, {user?.name}</p>
                            <div className="border-t border-gray-200"></div>
                            { user?.role?.includes(UserRoles.ADMIN) &&
                                <Link href="/admin/users">
                                    <a className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-200 
                                        hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem"
                                    >
                                        Admin Menu
                                    </a>
                                </Link>
                            }
                            <Link href='/profile'>
                                <a className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 
                                    focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem"
                                    >
                                    Profile
                                </a>
                            </Link>
                        </div>
                        <div className="border-t border-gray-200"></div>
                        <div className="py-1">
                            <button
                                onClick={ () => onClickSignOut(router, setAuth) }
                                className="w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 font-bold 
                                    hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

const clickOutsideConfig = {
    handleClickOutside: () => DropdownMenu.handleClickOutside
};

export default onClickOutside(DropdownMenu, clickOutsideConfig);