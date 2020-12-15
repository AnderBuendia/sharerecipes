import React, { useState, useEffect, useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import dynamic from 'next/dynamic';
import resolutionContext from '../../context/resolution/resolutionContext';
import HeaderDesktop from './headerDesktop';
import { initializeApollo } from '../../config/apollo';

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
    const ResolutionContext = useContext(resolutionContext);
    const { screenWidth } = ResolutionContext;

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

export const getServerSideProps = async ctx => {
    const apolloClient = initializeApollo(null, ctx);

    await apolloClient.query({
        query: GET_USER
    });

    return {
        props: {
            initialApolloState: apolloClient.cache.extract(),
        }
    };
}
 
export default Header;