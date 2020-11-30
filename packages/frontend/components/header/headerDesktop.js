import React from 'react';
import Link from 'next/link';
import Search from './Search';
import IndexIcon from '../form/Img';
import DropdownMenu from './dropdownMenu';

const HeaderDesktop = ({dataUser, client}) => {
    return (
        <div className="w-full text-black bg-gray-400 dark-mode:text-gray-200 dark-mode:bg-gray-800">
            <div className="flex flex-col px-4 mx-auto md:items-center md:justify-between md:flex-row">
                <div className="py-2 flex flex-row items-center justify-between">
                    <IndexIcon />
                </div>
                <Search className="bg-white placeholder-gray-700 h-10 px-4 md:pr-40 py-4 rounded-full text-sm focus:outline-none" />
                <div className="text-black flex rounded-lg focus:outline-none focus:shadow-outline cursor-pointer">
                { dataUser !== null ?
                    <>
                        <Link href="/newrecipe">
                            <a className="flex-1 bg-green-800 px-3 py-2 mr-5 rounded-lg text-white font-bold uppercase border-b-2 border-r-2 border-green-700 shadow-md hover:bg-green-700">New Recipe</a>
                        </Link>
                        <DropdownMenu 
                            className="flex-1"
                            dataUser={dataUser} 
                            client={client}
                        />
                    </> :
                    <div>
                        <Link href="/login">
                            <a className="bg-red-500 px-4 py-3 rounded-lg text-white font-bold border-b-2 border-r-2 border-red-700 uppercase mr-2 hover:bg-red-600">Login</a>
                        </Link>
                        <Link href="/signup">
                            <a className="bg-black px-4 py-3 rounded-lg text-white font-bold uppercase border-b-2 border-r-2 border-gray-600 hover:bg-gray-900">Sign Up</a>
                        </Link>  
                    </div> 
                }  
                </div>   
            </div>
        </div>
    );
}
export default HeaderDesktop;