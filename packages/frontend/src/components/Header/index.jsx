import React, { useContext } from 'react';
import AuthContext from '../../lib/context/auth/authContext';
import useResolution from '../../lib/hooks/useResolution';
import HeaderDesktop from './Desktop';
import HeaderMobile from './Mobile';
import { ResolutionBreakPoints } from '../../enums/config/resolution-breakpoints';

const Header = () => {
  /* authContext */
  const { authState, setAuth } = useContext(AuthContext);
  const width = useResolution();

  console.log(width);
  return (
    <>
      {width > ResolutionBreakPoints.SM ? (
        <HeaderDesktop user={authState.user} setAuth={setAuth} />
      ) : (
        <HeaderMobile user={authState.user} setAuth={setAuth} />
      )}
    </>
  );
};

export default Header;
