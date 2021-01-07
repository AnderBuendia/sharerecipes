import React, { useState } from 'react';
import Link from 'next/link';
import onClickOutside from 'react-onclickoutside';
import MuffinImg from '../images/MuffinImg';
import MenuMobileIcon from '../icons/menuMobileicon';
import SearchBar from './SearchBar';
import DropdownMenu from './dropdownMenu';

const HeaderMobile = ({userData}) => {
    const [open, setOpen] = useState(false);

    HeaderMobile.handleClickOutside = () => setOpen(false);

    return(
        <div className="w-full text-black bg-gray-400 dark-mode:text-gray-200 dark-mode:bg-gray-800">
            <div className="flex flex-col max-w-screen-xl py-2 mx-auto">
                <div className="flex flex-row px-4 items-center justify-between">
                    <MuffinImg />
                    
                    <div className={`${userData ? 'flex ' : ''}`}>
                        <button
                            className={`"text-black rounded-lg focus:outline-none focus:shadow-outline cursor-pointer ${userData ? 'flex-1 mr-2' : ''}`}
                            onClick={ () => setOpen(!open) }
                        >
                            <MenuMobileIcon className="h-10 w-10 text-gray-800 hover:text-black" />
                        </button>

                        { userData !== null ? (
                            <>
                                <DropdownMenu 
                                        className="flex-1"
                                        userData={userData} 
                                />
                            </> 
                        ) : '' 
                        }
                    </div>
                    
                </div>
                
                { open &&
                
                    <div className="w-full bg-gray-400 top-0 absolute mt-20 z-10 p-2 pb-3 rounded-lg">
                         <div className="w-11/12 m-auto border-gray border-t block text-center mb-2"></div>
                        { userData === null ? (
                            <>
                                <Link href="/login">
                                    <a className="flex flex-row px-4 py-2 text-md font-semibold font-roboto bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 
                                        dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                                        Login
                                    </a>
                                </Link>
                                <Link href="/signup">
                                    <a className="flex flex-row px-4 py-2 mt-2 mb-2 text-md font-semibold font-roboto bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 
                                        dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                                        Sign Up
                                    </a>
                                </Link>
                            </> 
                        ) : (
                            <>
                                <Link href="/newrecipe">
                                    <a className="flex flex-row px-4 py-2 mb-2 text-md font-semibold font-roboto bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 
                                        dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                                        Create a Recipe
                                    </a>
                                </Link>
                            </>
                        ) 
                        }
                        <SearchBar className="w-full bg-white text-black placeholder-black h-10 px-4 py-4 rounded-full text-sm focus:outline-none" />
                    </div>  
                } 
            </div>
        </div>
    );
}
 
const clickOutsideConfig = {
    handleClickOutside: () => HeaderMobile.handleClickOutside
};

export default onClickOutside(HeaderMobile, clickOutsideConfig);
