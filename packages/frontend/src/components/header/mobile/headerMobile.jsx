import React, { useState } from 'react';
import Link from 'next/link';
import SearchBar from '../SearchBar';
import MenuMobile from './menuMobile';
import MuffinIcon from '../../icons/muffinicon';
import MenuMobileIcon from '../../icons/menuMobileicon';
import SearchIcon from '../../icons/searchicon';
import { MainPaths } from '../../../enums/paths/main-paths';

const HeaderMobile = ({user, setAuth}) => {
    const [open, setOpen] = useState(false);
    const [openSearchBar, setOpenSearchBar] = useState(false);

    return (
        <>
            { openSearchBar ? (
                <SearchBar 
                    openSearchBar={openSearchBar} 
                    setOpenSearchBar={setOpenSearchBar} 
                />
            ) : (
                <div className="mdxl:hidden w-full py-2 px-4 flex flex-row items-center justify-between text-black bg-gray-400">
                    <Link href={MainPaths.INDEX}>
                        <a><MuffinIcon className="w-10 h-10" /></a>
                    </Link>
    
                    <div className="flex text-black items-center cursor-pointer">
                        <SearchIcon 
                            className="w-8 h-8 mr-2" 
                            onClick={ () => setOpenSearchBar(!openSearchBar) }
                        />
                        
                        <MenuMobileIcon 
                            className="h-10 w-10 text-gray-800 hover:text-black"
                            onClick={ () => setOpen(!open) }
                        />  
                    </div>
        
                    <MenuMobile
                        open={open}
                        setOpen={setOpen}
                        user={user}
                        setAuth={setAuth}
                    />
                </div>
            )}
        </>
    )
};

export default HeaderMobile;
