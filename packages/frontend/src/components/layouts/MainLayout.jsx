import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { MainPaths } from '../../enums/paths/main-paths';

const Header = dynamic(() => import('../header/Header'), {
    ssr: false,
});

const MainLayout = ({children}) => {
    /* Routing */
    const router = useRouter();

    return ( 
        <>
            <Head>
                <title>ShareRecipes - Share Your Recipes</title>
            </Head>
            { router.pathname === MainPaths.LOGIN || router.pathname === MainPaths.SIGNUP || router.pathname === MainPaths.FORGOT_PASS 
              || router.pathname === MainPaths.FORGOT_PASS_CONFIRM || router.pathname === MainPaths.CONFIRMATION ? 
                (
                    <div className="bg-gray-200 min-h-screen flex flex-col justify-center">
                        <div>
                            {children}
                        </div>
                    </div>
                ) : (
                    <div className="min-h-screen bg-gray-200">
                        <Header />
                        <div className="container mx-auto bg-gray-200 py-4">
                            {children}
                        </div>
                    </div>
                )
            }
        </>
    );
}
 
export default MainLayout;