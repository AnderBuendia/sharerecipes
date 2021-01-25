import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import AuthContext from '../../lib/context/auth/authContext';
import HeaderDesktop from './desktop/headerDesktop';

const HeaderMobile = dynamic(() => import('./mobile/headerMobile'), {
    ssr: false,
});
   
const Header = () => {
    /* authContext */
    const { authState, setAuth } = useContext(AuthContext);

    return (
        <>
            <HeaderDesktop user={authState.user} setAuth={setAuth} />

            <HeaderMobile user={authState.user} setAuth={setAuth} />
        </>
    );
};

export default Header;