import React, { useState } from 'react';
import Router from 'next/router';
import onClickOutside from 'react-onclickoutside';
import SearchIcon from '../icons/searchicon';
import CloseIcon from '../icons/closeicon';
import { MainPaths } from '../../enums/paths/main-paths';


const SearchBar = ({openSearchBar, setOpenSearchBar}) => {
    const [search, setSearch] = useState('');

    const searchRecipes = e => {
        e.preventDefault();

        if (search.trim() === '') return;

        /* Redirect to the search page */
        Router.push({
            pathname: MainPaths.SEARCH,
            query: { q: search }
        })
    };

    SearchBar.handleClickOutside = () => {
        if (openSearchBar) setOpenSearchBar(false);
    };

    return (
        <>
            { openSearchBar ? (
                <div className="mdxl:hidden bg-white w-full">
                    <form
                        onSubmit={searchRecipes}
                        className="w-full flex flex-row items-center"
                    >
                        <button type="submit" className="p-2 cursor-pointerfocus:outline-none">
                            <SearchIcon
                                className="w-8"
                            />
                        </button>

                        <input
                            type="search"
                            placeholder="Search..."
                            onChange={e => setSearch(e.target.value)}
                            className="placeholder-gray-600 py-4 px-2 w-full focus:outline-none"
                        />
                        <CloseIcon
                            className="p-2 w-12 cursor-pointer"
                            onClick={ () => setOpenSearchBar(!openSearchBar) }
                        />
                    </form>
                </div>
            ) : (
                <div className="xssm:hidden w-2/6 relative text-black">
                    <form onSubmit={searchRecipes}>
                        <input
                            type="search"
                            placeholder="Search..."
                            onChange={e => setSearch(e.target.value)}
                            className="w-full p-3 bg-white placeholder-gray-600 rounded-full text-sm focus:outline-none"
                        />
                        <button type="submit" className="absolute right-0 top-0 p-2 mt-1 mr-1 rounded-full bg-white focus:outline-none">
                            <SearchIcon className="w-5" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

const clickOutsideConfig = {
    handleClickOutside: () => SearchBar.handleClickOutside
};

export default onClickOutside(SearchBar, clickOutsideConfig);