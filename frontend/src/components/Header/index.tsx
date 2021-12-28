import { FC } from 'react';
import { useResolution } from '@Lib/hooks/useResolution';
import HeaderDesktop from '@Components/Header/Desktop';
import HeaderMobile from '@Components/Header/Mobile';

const Header: FC = () => {
  const isNarrowScreen = useResolution();

  return (
    <>
      {isNarrowScreen ? <HeaderMobile /> : <HeaderDesktop />}
      <div className="mx-16 border border-black"></div>
    </>
  );
};

export default Header;
