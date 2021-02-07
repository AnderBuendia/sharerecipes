// @ts-nocheck
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import onClickOutside from 'react-onclickoutside';
import { useToasts } from 'react-toast-notifications';
import CloseIcon from '../../icons/closeicon';
import DocumentIcon from '../../icons/documenticon';
import { MainPaths } from '../../../enums/paths/main-paths';
import { RestEndPoints } from '../../../enums/paths/rest-endpoints';

const MenuMobile = ({open, setOpen, user, setAuth}) => {
    MenuMobile.handleClickOutside = () => setOpen(false);

    const router = useRouter();
    const { addToast } = useToasts();
    
    const onClickSignOut = async (router, setAuth, setOpen) => {
        try {
            setOpen(false);

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
        <aside className={`${open ? 'translate-x-0' : 'translate-x-full'} transform top-0 right-0 w-64
        bg-white fixed h-full shadow-lg overflow-auto ease-in-out transition-all duration-300 z-30`}>
            <CloseIcon 
                className="ml-1 mt-1 p-2 w-10 left-0 cursor-pointer hover:bg-gray-100"
                onClick={ () => setOpen(false) }
            />
            <div className="flex flex-col items-center w-full px-6">
                { user ? (
                    <>
                        <Image 
                            className="rounded-full"
                            key={user?.image_url ? user.image_url : '/usericon.jpeg'}
                            src={user?.image_url ? user.image_url : '/usericon.jpeg'}
                            alt={'UserIcon Image'}
                            width={80}
                            height={80}
                        />
                        <p className="mt-1 font-bold font-roboto">{user?.email}</p>
                        <p className="mb-4 font-roboto">{user?.name}</p>
                        <Link href={MainPaths.PROFILE}>
                            <a className="w-8/12 text-center py-1 px-3 rounded-full border border-black 
                                cursor-pointer bg-gray-700 text-white hover:bg-blue-100 hover:text-black">
                                My Account
                            </a>
                        </Link>

                        <div className="w-full bg-gray-700 border border-black my-5 rounded-full" />
                        
                        <Link href={MainPaths.NEW_RECIPE}>
                            <a className="flex flex-row self-start">
                                <DocumentIcon className="w-5 mr-1" /> <span>New Recipe</span>
                            </a>
                        </Link>
                    </>
                ) : (
                    <>
                        {/* Add principal logo */}
                        <Link href={MainPaths.LOGIN}>
                            <a className="w-1/2 p-1 mb-3 rounded-full border border-black text-center
                                cursor-pointer bg-gray-700 text-white hover:bg-blue-200 hover:text-black">
                                Login
                            </a>
                        </Link>
                        <Link href={MainPaths.SIGNUP}>
                            <a className="w-1/2 p-1 rounded-full border border-black text-center
                                cursor-pointer bg-gray-700 text-white  hover:bg-blue-200 hover:text-black">
                                Sign Up
                            </a>
                        </Link>
                    </>
                )}
                <div className="w-full bg-gray-700 border border-black my-5 rounded-full" />
            
                <div className='flex flex-col w-full mb-5'>
					<Link href="#">
						<a className='px-1 pb-1'>Privacy Policy</a>
					</Link>
					<Link href="#">
						<a className='p-1'>Cookies Policy</a>
					</Link>
					<Link href="#">
						<a className='p-1'>Legal Notice</a>
					</Link>
				</div>

                { user &&
                    <Link href={MainPaths.PROFILE}>
                        <button 
                            className="w-8/12 text-center py-1 px-3 rounded-full border border-black 
                                cursor-pointer bg-gray-700 text-white hover:bg-blue-100 hover:text-black"
                            onClick={ () => onClickSignOut(router, setAuth, setOpen) }
                        >
                            Sign Out
                        </button>
                    </Link>
                }
            </div>

            <div className="w-full bg-black fixed bottom-0 p-4">
                <p className="text-center text-white">anderb - 2021</p>
            </div>
        </aside>
    );
};

const clickOutsideConfig = {
    handleClickOutside: () => MenuMobile.handleClickOutside
};
 
export default onClickOutside(MenuMobile, clickOutsideConfig);
