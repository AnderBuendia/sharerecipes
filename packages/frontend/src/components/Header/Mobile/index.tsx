import type { FC } from 'react';
import Link from 'next/link';
import SearchBarMobile from '@Components/Header/Mobile/SearchBarMobile';
import DarkModeButton from '@Components/generic/DarkModeButton';
import MenuMobile from '@Components/Header/Mobile/MenuMobile';
import { RamenIcon } from '@Components/Icons/ramen.icon';
import { MainPaths } from '@Enums/paths/main-paths.enum';

const HeaderMobile: FC = () => {
  return (
    <div className="flex flex-row items-center justify-between">
      <Link href={MainPaths.INDEX}>
        <a>
          <RamenIcon />
        </a>
      </Link>

      <div className="flex items-center cursor-pointer">
        <DarkModeButton />
        <SearchBarMobile />
        <MenuMobile />
      </div>
    </div>
  );
};

export default HeaderMobile;
