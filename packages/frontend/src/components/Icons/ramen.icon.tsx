import type { FC } from 'react';
import Image from 'next/image';
import ramenPic from '../../../public/ramen.svg';

const RAMEN_PIC_DIMENSIONS = 42;

export const RamenIcon: FC = () => {
  return (
    <Image
      src={ramenPic}
      width={RAMEN_PIC_DIMENSIONS}
      height={RAMEN_PIC_DIMENSIONS}
    />
  );
};
