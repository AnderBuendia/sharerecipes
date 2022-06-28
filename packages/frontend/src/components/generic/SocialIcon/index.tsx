import type { FC } from 'react';
import { TwitterIcon } from '@Components/Icons/twitter.icon';
import type { SocialLink } from '@Interfaces/social.interface'

export type SocialIconProps = {
  socialLink: SocialLink;
}

const SOCIAL_BUTTON_COLOR: {
  [key: string]: string;
} = {
  twitter: 'bg-blue-400 hover:bg-blue-600',
  facebook: 'bg-blue-500',
}

const SocialIcon: FC<SocialIconProps> = ({ socialLink }) => {
  const { iconName, ...moreProps } = socialLink;

  const buttonCustomProps = {
    className: `${SOCIAL_BUTTON_COLOR[iconName]} rounded-full py-1 px-2 hover:opacity-50`,
    title: `Navigate to ${iconName}`,
    name: `Navigate to ${iconName}`,
    target: '_blank',
    rel: 'noopener noreferrer',
    ...moreProps
  };

  return <>
    <a { ...buttonCustomProps }>
      <TwitterIcon className='w-6 fill-current' />
    </a>
  </>
 
}

export default SocialIcon;