import { FC } from 'react';
import { LeftArrowIcon } from '@Components/Icons/left-arrow.icon';
import { RightArrowIcon } from '@Components/Icons/right-arrow.icon';

export type PaginationProps = {
  current: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: FC<PaginationProps> = ({
  current,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex flex-row justify-center my-1">
      <button
        disabled={current === 0}
        className="h-8 w-8 mx-0_5 flex-c-c rounded-full"
        onClick={() => onPageChange && current > 0 && onPageChange(current - 1)}
      >
        <LeftArrowIcon className="w-8 h-8" />
      </button>
      <div className="flex-row px-2 py-1 font-medium bg-black text-white rounded-full">
        <p>
          {current + 1} / {totalPages}
        </p>
      </div>
      <button
        disabled={current === totalPages - 1}
        className="h-8 w-8 mx-0_5 flex-c-c rounded-full"
        onClick={() =>
          onPageChange && current < totalPages - 1 && onPageChange(current + 1)
        }
      >
        <RightArrowIcon className="w-8 h-8" />
      </button>
    </div>
  );
};

export default Pagination;
