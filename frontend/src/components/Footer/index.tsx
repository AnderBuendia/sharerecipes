import { FC } from 'react';
import { CreatorIcon } from '@Components/Icons/creator.icon';
import { SocialPaths } from '@Enums/paths/social-paths.enum';

const Footer: FC = () => {
  return (
    <footer className="flex place-content-center bg-gray-100 dark:bg-gray-500">
      <div className="container p-4 flex flex-col justify-center items-center">
        <div className="flex flex-row items-center">
          <p>Developed by</p>

          <a
            href={SocialPaths.URL_CREATOR}
            target="_blank"
            className="ml-2 py-1 px-2 rounded-3xl flex items-center bg-black text-white dark:bg-white dark:text-black"
          >
            <CreatorIcon w={28} h={28} style="rounded-full" />
            <span className="ml-1">anderb</span>
          </a>
        </div>
        <div className="mt-3">
          <a href={SocialPaths.GITHUB} target="_blank">
            <span>Github</span>
          </a>
          <span className="px-2">•</span>
          <a href={SocialPaths.LINKEDIN} target="_blank">
            <span>Linked In</span>
          </a>
          <span className="px-2">•</span>
          <a href={SocialPaths.TWITTER} target="_blank">
            <span>Twitter</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
