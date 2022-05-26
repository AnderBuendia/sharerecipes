import type { FC } from 'react';
import { LeftArrowIcon } from '@Components/Icons/left-arrow.icon';
import { RightArrowIcon } from '@Components/Icons/right-arrow.icon';

const CURSOR_PAGE = 1;

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
  const handlePrevPageChange = (current: number) => {
    if (onPageChange && current > 0) onPageChange(current - CURSOR_PAGE);
  };

  const handleNextPageChange = (current: number) => {
    if (onPageChange && current < totalPages - CURSOR_PAGE)
      onPageChange(current + CURSOR_PAGE);
  };

  return (
    <div className="flex flex-row justify-center my-1">
      <button
        disabled={current === 0}
        className="h-8 w-8 mx-0_5 flex-c-c rounded-full"
        onClick={() => handlePrevPageChange(current)}
      >
        <LeftArrowIcon className="w-8 h-8" />
      </button>
      <div className="flex-row px-2 py-1 font-medium bg-black text-white rounded-full">
        <p>
          {current + CURSOR_PAGE} / {totalPages}
        </p>
      </div>
      <button
        disabled={current === totalPages - CURSOR_PAGE}
        className="h-8 w-8 mx-0_5 flex-c-c rounded-full"
        onClick={() => handleNextPageChange(current)}
      >
        <RightArrowIcon className="w-8 h-8" />
      </button>
    </div>
  );
};

export default Pagination;
