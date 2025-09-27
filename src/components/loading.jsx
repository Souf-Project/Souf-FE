import React from 'react';
import PropTypes from 'prop-types';

const sizeMap = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

export default function Loading({ size = 'lg', full = true, text, color = 'blue-main' }) {
  return (
    <div className={`flex flex-col justify-center items-center ${full ? 'h-screen' : 'py-6'}`}>
      <div
        className={`animate-spin rounded-full border-t-4 border-b-4 ${sizeMap[size]} border-${color}`}
      ></div>
      {text && <p className="mt-4 text-gray-600 text-lg">{text}</p>}
    </div>
  );
}

Loading.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  full: PropTypes.bool,
  text: PropTypes.string,
  color: PropTypes.string,
};

/*

import React from 'react';
import PropTypes from 'prop-types';

const sizeMap = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

export default function Loading({ size = 'lg', full = true, text, color = 'yellow-point' }) {
  return (
    <div className={`flex flex-col items-center justify-center ${full ? 'h-screen' : 'py-6'} gap-4`}>
      <div
        className={`
          animate-spin 
          rounded-full 
          border-4 
          border-${color} 
          border-t-transparent
          ${sizeMap[size]} 
          shadow-md
        `}
      />
      {text && (
        <p className="text-gray-700 text-base font-medium tracking-wide text-center">
          {text}
        </p>
      )}
    </div>
  );
}

Loading.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  full: PropTypes.bool,
  text: PropTypes.string,
  color: PropTypes.string,
};



*/