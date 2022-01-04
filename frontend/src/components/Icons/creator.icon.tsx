import { FC } from 'react';
import Image from 'next/image';

export type CreatorIcon = {
  w: number;
  h: number;
  style: string;
};

export const CreatorIcon: FC<CreatorIcon> = ({ w, h, style }) => {
  return <Image src="/creator.png" width={w} height={h} className={style} />;
};
