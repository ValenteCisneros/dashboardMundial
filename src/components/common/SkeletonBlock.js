import React from 'react';

export const SkeletonBlock = ({ lines = 3 }) => {
  return (
    <div className="skeleton-block">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="skeleton-line"
          style={{ width: `${80 - index * 10}%` }}
        />
      ))}
    </div>
  );
};

