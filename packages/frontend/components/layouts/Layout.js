import React from 'react';
import Head from 'next/head';
import Header from '../header/Header';
import { useRouter } from 'next/router';

const Layout = ({children}) => {
    /* Routing */
    const router = useRouter();

    return ( 
        <>
            <Head>
                <title>ShareRecipes - Share Your Recipes</title>
            </Head>
            { router.pathname === '/login' || router.pathname === '/signup' ? (
                <div className="bg-gray-300 min-h-screen flex flex-col justify-center">
                    <div>
                        {children}
                    </div>
                </div>
            ) : (
                <div className="bg-gray-100 min-h-screen">
                <Header />
                <div className="container mx-auto">
                    <main className="mt-10">
                        {children}
                    </main>
                </div>
                </div>

            ) }
        </>
    );
}
 
export default Layout;