import React from 'react';
import Link from 'next/link';
import SearchBar from '../SearchBar';
import DropdownMenu from './dropdownMenu';
import { MainPaths } from '../../../enums/paths/main-paths';
import RamenIcon from '../../icons/ramenicon';

const HeaderDesktop = ({user, setAuth}) => {
    return (
        <div className="xssm:hidden w-full py-2 px-4 flex flex-row items-center justify-between text-black bg-gray-400">
            <Link href={MainPaths.INDEX}>
                <a><RamenIcon className="w-14 h-14" /></a>
            </Link>
     
            <SearchBar />

            <div className="flex text-black items-center cursor-pointer">
            { user ? (
                <>
                    <Link href={MainPaths.NEW_RECIPE}>
                        <a className="bg-green-800 px-3 py-2 mr-5 rounded-lg text-white font-bold uppercase border-b-2 border-r-2 
                            border-green-700 shadow-md hover:bg-green-700 transition duration-500 ease-out transform hover:scale-95">
                            New Recipe
                        </a>
                    </Link>

                    <DropdownMenu user={user} setAuth={setAuth} />
                </>
            ) : (
                <>
                    <Link href={MainPaths.LOGIN}>
                        <a className="bg-red-500 px-4 py-2 rounded-lg text-white font-bold border-b-2 border-r-2 border-red-700 uppercase mr-2 hover:bg-red-600">Login</a>
                    </Link>
                    <Link href={MainPaths.SIGNUP}>
                        <a className="bg-black px-4 py-2 rounded-lg text-white font-bold uppercase border-b-2 border-r-2 border-gray-600 hover:bg-gray-800">Sign Up</a>
                    </Link>  
                </>
            )}
            </div>
        </div>
    );
};

export default HeaderDesktop;