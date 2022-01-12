import { FC } from 'react';
import dynamic from 'next/dynamic';
import { useResolution } from '@Lib/hooks/useResolution';
import HeaderDesktop from '@Components/Header/Desktop';

const HeaderMobileDynamic = dynamic(() => import('@Components/Header/Mobile'));

const Header: FC = () => {
  const isNarrowScreen = useResolution();

  return (
    <>
      {isNarrowScreen ? <HeaderMobileDynamic /> : <HeaderDesktop />}
      <span className="mx-16 border border-black"></span>
    </>
  );
};

export default Header;
