import type { FC } from 'react';
import Image from 'next/image';
import creatorPic from '../../../public/creator.png';

const CREATOR_PIC_DIMENSIONS = 28;

export const CreatorIcon: FC = () => {
  return (
    <Image
      src={creatorPic}
      width={CREATOR_PIC_DIMENSIONS}
      height={CREATOR_PIC_DIMENSIONS}
      className="rounded-full"
    />
  );
};
