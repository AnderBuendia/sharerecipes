import Link from 'next/link';
import SearchBarMobile from './searchBarMobile';
import DarkModeButton from '../../generic/DarkModeButton';
import MenuMobile from './menuMobile';
import RamenIcon from '../../icons/ramenicon';
import { MainPaths } from '../../../enums/paths/main-paths';

const HeaderMobile = ({ user, setAuth }) => {
  return (
    <div className="mdxl:hidden w-full py-2 px-4 flex flex-row items-center justify-between bg-gray-400 dark:bg-gray-800">
      <Link href={MainPaths.INDEX}>
        <a>
          <RamenIcon className="w-10 h-10" />
        </a>
      </Link>

      <div className="flex items-center cursor-pointer">
        <DarkModeButton />
        <SearchBarMobile />
        <MenuMobile user={user} setAuth={setAuth} />
      </div>
    </div>
  );
};

export default HeaderMobile;
