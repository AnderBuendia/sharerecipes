import type { FC } from 'react';
import { getTwitter } from '@Lib/utils/social.utils';
import SocialIcon from '@Components/generic/SocialIcon';
import type { SocialLink } from '@Interfaces/social.interface'

export type ShareBarProps = {
  sharedUrl: string;
  sharedText: string;
}

const ShareBar: FC<ShareBarProps> = ({ sharedUrl, sharedText,}) => {
  const encodedSharedUrl = encodeURIComponent(sharedUrl);
  const encodedSharedText = encodeURIComponent(sharedText);
  const socialLinks: SocialLink[] = [];

  const addSocialLinks = () => {
    socialLinks.push(getTwitter({ encodedSharedUrl, encodedSharedText, sharedUrl, sharedText }));
  }

  addSocialLinks();

  if (!socialLinks.length) return null;

  return <>
    {socialLinks.map((socialLink) => { 
      <SocialIcon socialLink={socialLink} />
    })}  
  </>
  
}
 
export default ShareBar;