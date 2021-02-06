import React from 'react';
import dynamic from 'next/dynamic';
import Head from '../generic/Head';

const Header = dynamic(() => import('../header/Header'), {
    ssr: false,
});

const MainLayout = ({title, description, url, children}) => (
    <>
        <Head 
            title={title} 
            description={description}
            url={url}
        />
        
        <div className="min-h-screen bg-gray-200">
            <Header />
            <div className="container mx-auto bg-gray-200 py-4">
                {children}
            </div>
        </div>
    </>
);
 
export default MainLayout;