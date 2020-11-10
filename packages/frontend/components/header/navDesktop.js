import React from 'react';
import Link from 'next/link';

const Nav = () => {
    return ( 
        <div className="pl-2">
            <Link href="/"><a className="font-roboto text-2xl">Featured Recipes</a></Link>
        </div>
    );
}
 
export default Nav;