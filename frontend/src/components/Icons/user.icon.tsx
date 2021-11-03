import { FC } from 'react';
import Image from 'next/image';

export type UserIconProps = {
  imageUrl?: string;
  imageName?: string;
  w: number;
  h: number;
};

export const UserIcon: FC<UserIconProps> = ({ imageUrl, imageName, w, h }) => {
  const image = imageUrl ? imageUrl : '/usericon.jpeg';
  const name = imageName ? imageName : 'UserIcon Image';

  return (
    <Image
      className="block rounded-full"
      src={image}
      alt={name}
      width={w}
      height={h}
    />
  );
};
