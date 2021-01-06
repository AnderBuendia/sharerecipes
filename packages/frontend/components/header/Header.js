import React, { useState, useEffect, useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import dynamic from 'next/dynamic';
import appContext from '../../context/app/appContext';
import HeaderDesktop from './headerDesktop';

const GET_USER = gql`
    query getUser {
        getUser {
            id
            name
            role
            image_name
            image_url
        }
    }
`;

const HeaderMobile = dynamic(() => import('./headerMobile'), {
    ssr: false,
});
   
const Header = () => {
    const AppContext = useContext(appContext);
    const { screenWidth } = AppContext;

    const [width, setWidth] = useState(window.innerWidth);
    const handleWindowResize = () => {
        setWidth(window.innerWidth);
    };

    useEffect(() => {
        screenWidth(width);
        window.addEventListener("resize", handleWindowResize);
    
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    /* Apollo query */
    const { client, data, loading, error } = useQuery(GET_USER, { 
        fetchPolicy: "network-only" 
    });

    /* Don't access data before get results */
    if (loading) return null;
    const { getUser } = data;

    return ( 
        <>
            { width <= 768 ? 
                <HeaderMobile userData={getUser} client={client}/>
                :
                <HeaderDesktop userData={getUser} client={client} />
            }  
        </>
    );
}
 
export default Header;