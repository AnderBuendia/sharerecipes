import { FC } from 'react';
import Link from 'next/link';
import { CreatorIcon } from '@Components/Icons/creator.icon';
import { SocialPaths } from '@Enums/paths/social-paths.enum';

const Footer: FC = () => {
  return (
    <div className="w-full p-4">
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row items-center">
          <p>Developed by</p>

          <Link href={SocialPaths.URL_CREATOR}>
            <a className="ml-2 py-1 px-2 rounded-3xl flex items-center bg-black text-white dark:bg-white dark:text-black">
              <CreatorIcon w={28} h={28} style="rounded-full" />
              <span className="ml-1">anderb</span>
            </a>
          </Link>
        </div>
        <div className="mt-3 flex flex-row items-center">
          <Link href={SocialPaths.GITHUB}>
            <a>Github</a>
          </Link>
          <span className="px-2">•</span>
          <Link href={SocialPaths.LINKEDIN}>
            <a>Linked In</a>
          </Link>
          <span className="px-2">•</span>
          <Link href={SocialPaths.TWITTER}>
            <a>Twitter</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
