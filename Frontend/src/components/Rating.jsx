import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 0, size = 'md', showEmpty = true }) => {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  };

  const starSize = sizeClasses[size] || sizeClasses.md;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      // Full star
      stars.push(
        <Star
          key={i}
          className={`${starSize} fill-current text-yellow-400`}
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      // Half star
      stars.push(
        <div key={i} className="relative">
          <Star className={`${starSize} text-gray-300`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${starSize} fill-current text-yellow-400`} />
          </div>
        </div>
      );
    } else {
      // Empty star
      stars.push(
        <Star
          key={i}
          className={`${starSize} ${showEmpty ? 'text-gray-300' : 'text-transparent'}`}
        />
      );
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
    </div>
  );
};

export default Rating;