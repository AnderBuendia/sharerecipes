import type { FC } from 'react';
import { getTwitter, getFacebook } from '@Lib/utils/social.utils';
import SocialIcon from '@Components/generic/SocialIcon';

export type ShareBarProps = {
  sharedUrl: string;
  sharedText: string;
};

const ShareBar: FC<ShareBarProps> = ({ sharedUrl, sharedText }) => {
  const encodedSharedUrl = encodeURIComponent(sharedUrl);
  const encodedSharedText = encodeURIComponent(sharedText);

  const addSocialLinks = () => {
    const links = [];

    links.push(
      getTwitter({
        encodedSharedUrl,
        encodedSharedText,
        sharedUrl,
        sharedText,
      }),
      getFacebook({
        encodedSharedUrl,
        encodedSharedText,
        sharedUrl,
        sharedText,
      })
    );

    return links;
  };

  const socialLinks = addSocialLinks();

  if (!socialLinks.length) return null;

  return (
    <div className="flex">
      {socialLinks.map((socialLink) => (
        <SocialIcon socialLink={socialLink} />
      ))}
    </div>
  );
};

export default ShareBar;
