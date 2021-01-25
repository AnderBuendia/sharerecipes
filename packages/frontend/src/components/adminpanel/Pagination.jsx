import React from 'react';
import { LeftArrowIcon, RightArrowIcon } from '../icons/arrowicons';

const Pagination = ({current, totalPages, onPageChange}) => {
    return (
        <div className="flex flex-row justify-center my-1">  
            <button
                disabled={current === 0}
                className='h-8 w-8 mx-0_5 flex-c-c rounded-full'
                onClick={() =>
                    onPageChange && current > 0 && onPageChange(current - 1)
            }><LeftArrowIcon className="w-8 h-8" />
            </button>
            <div className='flex-row px-2 py-1 font-medium bg-black text-white rounded-full'>
                <p>{current + 1} / {totalPages}</p>
            </div>
            <button
                disabled={current === totalPages - 1}
                className='h-8 w-8 mx-0_5 flex-c-c rounded-full'
                onClick={() =>
                    onPageChange && current < totalPages - 1 && onPageChange(current + 1)
            }>
                <RightArrowIcon className="w-8 h-8" />
            </button>      
        </div>
    );
}
 
export default Pagination;