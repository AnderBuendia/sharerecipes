import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../header/Header';

const Layout = ({children}) => {
    /* Routing */
    const router = useRouter();

    return ( 
        <>
            <Head>
                <title>ShareRecipes - Share Your Recipes</title>
            </Head>
            { router.pathname === '/login' || router.pathname === '/signup' || router.pathname === '/forgot' 
              || router.pathname === '/forgot/[pid]' || router.pathname === 'confirmation/[pid]' ? 
                (
                    <div className="bg-gray-200 min-h-screen flex flex-col justify-center">
                        <div>
                            {children}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 min-h-screen">
                    <Header />
                        <div className="container mx-auto">
                            <main className="mt-4">
                                {children}
                            </main>
                        </div>
                    </div>
    
                )
            }
        </>
    );
}
 
export default Layout;