import React, { useContext } from 'react';
import AuthContext from '../../lib/context/auth/authContext';
import { useBrowserPreferences } from '../../lib/context/resolution/resolutionState';
import HeaderDesktop from './desktop/headerDesktop';
import HeaderMobile from './mobile/headerMobile';
import { ResolutionBreakPoints } from '../../enums/config/resolution-breakpoints';


const Header = () => {
    /* authContext */
    const { authState, setAuth } = useContext(AuthContext);
    const { width } = useBrowserPreferences();

    return (
        <>
            { width > ResolutionBreakPoints.SM ? (
                <HeaderDesktop user={authState.user} setAuth={setAuth} />
            ) : (
                <HeaderMobile user={authState.user} setAuth={setAuth} />
            )}
        </>
    );
};

export default Header;