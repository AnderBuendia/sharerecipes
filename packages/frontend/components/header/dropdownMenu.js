import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';
import Link from 'next/link';
import onClickOutside from 'react-onclickoutside';
import { setAccessToken } from '../../lib/accessToken';
import Image from 'next/image';

const SIGNOUT_USER = gql`
    mutation signOutUser {
        signOutUser
    }
`;

const DropdownMenu = ({userData}) => {
    /* Routing */
    const router = useRouter();

    /* User data */
    const { id, name, role, image_name, image_url } = userData;

    /* Dropdown user menu*/
    const [open, setOpen] = useState(false);

    DropdownMenu.handleClickOutside = () => setOpen(false);

    /* Apollo mutation to logout */
    const [ signOutUser, { client } ] = useMutation(SIGNOUT_USER);

    const signOut = async () => {
        await signOutUser();
        setAccessToken('');
        client.resetStore();
        router.push('/');
    };

    return (  
        <div className="relative inline-block text-left mr-4">
            <div
                className="flex items-center justify-center rounded-full cursor-pointer hover:shadow-xl hover:p-4 hover:opacity-80" aria-expanded="true"
                onClick={ () => setOpen(!open) }
            >
                <Image 
                    className="rounded-full"
                    key={image_url ? image_url : '/usericon.jpeg'}
                    src={image_url ? image_url : '/usericon.jpeg'}
                    alt={image_name ? image_name : 'UserIcon Image'}
                    width={44}
                    height={44}
                />
            </div>      
            { open && 
                <div className="origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-md shadow-lg font-roboto">
                    <div className="rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <div className="py-1">
                            <p className="block px-4 py-2 text-sm font-bold leading-5 text-gray-700" role="menuitem">Hi, {name}</p>
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

