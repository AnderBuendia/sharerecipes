import { FC } from 'react';
import dynamic from 'next/dynamic';
import { useResolution } from '@Lib/hooks/useResolution';
import HeaderDesktop from '@Components/Header/Desktop';

const HeaderMobileDynamic = dynamic(() => import('@Components/Header/Mobile'));

const Header: FC = () => {
  const isNarrowScreen = useResolution();

  return (
    <header className="flex place-content-center p-3 bg-gray-300 dark:bg-gray-700">
      {isNarrowScreen ? <HeaderMobileDynamic /> : <HeaderDesktop />}
    </header>
  );
};

export default Header;
