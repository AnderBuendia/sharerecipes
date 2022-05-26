import { FC } from 'react';
import Image from 'next/image';

export type UsersGroupIcon = {
  w: number;
  h: number;
};

export const UsersGroupIcon: FC<UsersGroupIcon> = ({ w, h }) => {
  return <Image src="/usersgroup.svg" width={w} height={h} />;
};
