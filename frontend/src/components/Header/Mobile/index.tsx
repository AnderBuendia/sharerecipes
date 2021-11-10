import { FC } from 'react';
import Link from 'next/link';
import SearchBarMobile from '@Components/Header/Mobile/SearchBarMobile';
import DarkModeButton from '@Components/generic/DarkModeButton';
import MenuMobile from '@Components/Header/Mobile/MenuMobile';
import { RamenIcon } from '@Components/Icons/ramen.icon';
import { MainPaths } from '@Enums/paths/main-paths.enum';

const HeaderMobile: FC = () => {
  return (
    <header className="mdxl:hidden w-full py-2 px-4 flex flex-row items-center justify-between bg-gray-400 dark:bg-gray-800">
      <Link href={MainPaths.INDEX}>
        <a>
          <RamenIcon w={33} h={33} />
        </a>
      </Link>

      <div className="flex items-center cursor-pointer">
        <DarkModeButton />
        <SearchBarMobile />
        <MenuMobile />
      </div>
    </header>
  );
};

export default HeaderMobile;
