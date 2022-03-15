import type { FC } from 'react';
import dynamic from 'next/dynamic';
import { useResolution } from '@Lib/hooks/useResolution';
import HeaderDesktop from '@Components/Header/Desktop';

const HeaderMobileDynamic = dynamic(() => import('@Components/Header/Mobile'));

const Header: FC = () => {
  const isNarrowScreen = useResolution();

  return (
    <header className="place-content-center px-6 py-3 bg-gray-300 dark:bg-gray-700">
      {isNarrowScreen ? <HeaderMobileDynamic /> : <HeaderDesktop />}
    </header>
  );
};

export default Header;
