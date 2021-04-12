import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MainPaths } from '../../enums/paths/main-paths';

const RecipesList = ({title, children}) => {
    const router = useRouter();
    const isIndex = router.pathname === MainPaths.INDEX;

    return (
        <div className="container mx-auto w-11/12"> 
            <div className="flex justify-between items-center">
                <p className="font-bold text-lg">{title}</p>
                { isIndex &&
                    <Link href={MainPaths.POPULAR}>
                        <a className="ml-auto w-30 bg-purple-500 px-2 rounded-full shadow-lg cursor-pointer hover:bg-purple-600 
                            transition duration-200 ease-in-out transform hover:scale-105 text-center text-gray-200 uppercase font-roboto text-xs hover:font-bold">
                            Popular Recipes
                        </a>
                    </Link>
                }
            </div>
            <div 
                className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 cursor-pointer mt-2"
            >
                {children}
            </div>
        </div>
    );
}
 
export default RecipesList;