import type { FC } from 'react';
import { useResolution } from '@Lib/hooks/useResolution';
import HeaderDesktop from '@Components/Header/Desktop';
import HeaderMobile from '@Components/Header/Mobile';

const Header: FC = () => {
  const isNarrowScreen = useResolution();

  return (
    <header className="place-content-center px-6 py-3 bg-gray-300 dark:bg-gray-700">
      {isNarrowScreen ? <HeaderMobile /> : <HeaderDesktop />}
    </header>
  );
};

export default Header;
