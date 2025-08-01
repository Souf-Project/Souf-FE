import React from "react";

export default function AnimatedCount({ value, prevValue }) {
  return (
    <span className="relative inline-block w-40 h-10 overflow-hidden align-middle">
      <span
        key={prevValue}
        className="absolute pb-1 pt-3 left-0 top-0 w-full h-full flex items-center justify-center text-inherit animate-countup-out"
      >
        {prevValue.toLocaleString()}
      </span>
      <span
        key={value}
        className="absolute pb-1 pt-3 left-0 top-0 w-full h-full flex items-center justify-center text-inherit animate-countup-in"
      >
        {value.toLocaleString()}
      </span>
    </span>
  );
} 
