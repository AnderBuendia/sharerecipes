import { FC } from 'react';
import Image from 'next/image';

export type RamenIconProps = {
  w: number;
  h: number;
};

export const RamenIcon: FC<RamenIconProps> = ({ w, h }) => {
  return <Image src="/ramen.svg" width={w} height={h} />;
};
