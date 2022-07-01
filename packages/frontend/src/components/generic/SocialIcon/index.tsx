import type { FC } from 'react';
import { TwitterIcon } from '@Components/Icons/twitter.icon';
import { FacebookIcon } from '@Components/Icons/facebook.icon';
import type { SocialLink } from '@Interfaces/social.interface';

export type SocialIconProps = {
  socialLink: SocialLink;
};

const SOCIAL_BUTTON_COLOR: {
  [key: string]: string;
} = {
  twitter: 'bg-blue-400 hover:bg-blue-600 mr-2',
  facebook: 'bg-blue-500 hover:bg-blue-600',
};

// TODO: style icons
const SocialIcon: FC<SocialIconProps> = ({ socialLink }) => {
  const { iconName, ...moreProps } = socialLink;

  const buttonCustomProps = {
    className: `${SOCIAL_BUTTON_COLOR[iconName]} rounded-full hover:opacity-50 p-2`,
    title: `Navigate to ${iconName}`,
    name: `Navigate to ${iconName}`,
    target: '_blank',
    rel: 'noopener noreferrer',
    ...moreProps,
  };

  return (
    <>
      <a {...buttonCustomProps}>
        {iconName === 'twitter' ? (
          <TwitterIcon className="w-7 h-7 fill-current" />
        ) : (
          <FacebookIcon className="w-7 h-7 fill-current" />
        )}
      </a>
    </>
  );
};

export default SocialIcon;
