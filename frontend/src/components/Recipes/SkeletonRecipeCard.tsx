import { FC } from 'react';

const SkeletonRecipeCard: FC = () => {
  return (
    <div className="border border-gray-600 shadow rounded-md w-12/12 mx-auto mb-4">
      <div className="animate-pulse p-24 bg-gray-600"></div>
      <div className="dark:bg-gray-700 flex flex-wrap overflow-hidden text-center p-1">
        <div className="w-1/2 overflow-hidden p-2 border-r border-b border-gray-300">
          <div className="mb-1 mx-12 animate-pulse h-3 bg-gray-600"></div>
          <div className="mx-8 animate-pulse h-5 bg-gray-600"></div>
        </div>
        <div className="w-1/2 p-2 border-b border-gray-300">
          <div className="mb-1 mx-12 animate-pulse h-3 bg-gray-600"></div>
          <div className="mx-8 animate-pulse h-5 bg-gray-600"></div>
        </div>
        <div className="w-1/2 p-2 border-r border-gray-300">
          <div className="mb-1 mx-12 animate-pulse h-3 bg-gray-600"></div>
          <div className="mx-8 animate-pulse h-5 bg-gray-600"></div>
        </div>
        <div className="w-1/2 p-2">
          <div className="mb-1 mx-12 animate-pulse h-3 bg-gray-600"></div>
          <div className="mx-8 animate-pulse h-5 bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonRecipeCard;
