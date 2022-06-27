import type { FC } from 'react';
import Link from 'next/link';
import type { SocialLink } from '@Interfaces/social.interface'

export type SocialIconProps = {
  socialLink: SocialLink;
}

const SOCIAL_BUTTON_COLOR: {
  [key: string]: string;
} = {
  twitter: 'bg-blue-200',
  facebook: 'bg-blue-500',
}

const SocialIcon: FC<SocialIconProps> = ({ socialLink }) => {
  const { iconName, ...moreProps } = socialLink;

  const buttonCustomProps = {
    className: `${SOCIAL_BUTTON_COLOR[iconName]}`,
    title: `Navigate to ${iconName}`,
    name: `Navigate to ${iconName}`,
    target: '_blank',
    rel: 'noopener noreferrer',
    ...moreProps
  };

  return <>
    <a { ...buttonCustomProps }>
      <i className={`fab fa-${iconName}`} />
    </a>
  </>
 
}

export default SocialIcon;