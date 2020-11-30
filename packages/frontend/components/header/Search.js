import React, { useState } from 'react';
import Router from 'next/router';
import SearchIcon from '../icons/searchicon';

const Search = (props) => {

    const [search, setSearch] = useState('');

    return (  
        <div className="relative text-black">
            <input type="search" placeholder="Search..." {...props} />
            <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
                <SearchIcon className="h-4 w-4" />
            </button>
        </div>
    );
}
 
export default Search;