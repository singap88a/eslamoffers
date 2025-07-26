import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function CategorySkeletonLoader({ category }) {
  const skeletonCount = 6;

  const getCategoryStyle = () => {
    switch (category) {
      case 'fashion':
        return 'bg-pink-200';
      case 'electronics':
        return 'bg-blue-200';
      case 'groceries':
        return 'bg-green-200';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <div
          key={index}
          className={`rounded-xl shadow-md p-4 animate-pulse ${getCategoryStyle()}`}
        >
          <Skeleton height={180} className="mb-4 rounded-lg" />
          <Skeleton height={20} width="80%" />
          <Skeleton height={20} width="60%" />
          <Skeleton height={30} width="50%" className="mt-4" />
        </div>
      ))}
    </div>
  );
}
