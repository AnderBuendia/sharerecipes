import Link from 'next/link';
import SearchBarMobile from '@Components/Header/Mobile/searchBarMobile';
import DarkModeButton from '@Components/generic/DarkModeButton';
import MenuMobile from '@Components/Header/Mobile/menuMobile';
import RamenIcon from '@Components/Icons/ramenicon';
import { MainPaths } from '@Enums/paths/main-paths';

const HeaderMobile = () => {
  return (
    <div className="mdxl:hidden w-full py-2 px-4 flex flex-row items-center justify-between bg-gray-400 dark:bg-gray-800">
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
    </div>
  );
};

export default HeaderMobile;
