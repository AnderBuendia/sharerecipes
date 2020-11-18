import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import onClickOutside from 'react-onclickoutside';

const DropdownMenu = ({dataUser, client}) => {
    /* Routing */
    const router = useRouter();

    const { id, name, role, image_name, image_url } = dataUser;

    /* Dropdown user menu*/
    const [open, setOpen] = useState(false);

    DropdownMenu.handleClickOutside = () => setOpen(false);

    const signOut = () => {
        localStorage.removeItem('token');
        client.resetStore();
        router.push('/');
    };

    return (  
        <div className="relative inline-block text-left mr-4">
            <div>
                <span className="rounded-md shadow-sm">
                    <div
                        className="flex items-center justify-center rounded-full h-10 w-10 bg-gray-200 cursor-pointer border-2 hover:border-blue-800 hover:bg-gray-500" aria-expanded="true"
                        onClick={ () => setOpen(!open) }
                    >
                        { image_url ? (
                            <Image 
                                className="hover:bg-black rounded-full"
                                key={ image_url }
                                src={ image_url }
                                alt={ image_name }
                                width={90}
                                height={90}
                            />
                        ) : (
                            <img className="hover:bg-black rounded-full" src="/usericon.jpeg" />
                        )}
                    </div>
                </span>       
            </div>
            { open && 
                <div className="origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-md shadow-lg font-roboto">
                    <div className="rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <div className="py-1">
                            <Link href="#">
                                <a className="block px-4 py-2 text-sm font-bold leading-5 text-gray-700" role="menuitem">Hi, {name}</a>
                            </Link> 
                            <div className="border-t border-gray-200"></div>
                            { role === 'Admin' &&
                                <Link href="/admin/users">
                                    <a className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Admin Menu</a>
                                </Link>
                            }
                            <Link href={{
                                pathname: '/edituser/account/[pid]',
                                query: { pid: id }
                            }}>
                                <a className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Profile</a>
                            </Link>
                        </div>
                        <div className="border-t border-gray-200"></div>
                        <div className="py-1">
                            <Link href="/">
                                <a onClick={ () => signOut() } className="block px-4 py-2 text-sm leading-5 text-gray-700 font-bold hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Sign Out</a>
                            </Link>
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

