import React, { useState } from 'react';
import Router from 'next/router';
import SearchIcon from '../icons/searchicon';

const SearchBar = (props) => {

    const [search, setSearch] = useState('');

    const searchRecipes = e => {
        e.preventDefault();

        if (search.trim() === '') return;

        /* Redirect to the search page */
        Router.push({
            pathname: '/search',
            query: { q: search }
        })
    };

    return (  
        <div className="relative text-black">
            <form onSubmit={searchRecipes}>
                <input 
                    type="search" 
                    placeholder="Search..." 
                    onChange={e => setSearch(e.target.value)}
                    {...props} />
                <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
                    <SearchIcon className="h-4 w-4" />
                </button>
            </form>
        </div>
    );
}
 
export default SearchBar;