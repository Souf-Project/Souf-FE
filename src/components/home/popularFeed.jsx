import React from "react";

const PopularFeed = ({ url, context, username }) => {
  return (
    <div className="w-[180px]">
      <img
        src={url}
        alt={`${username} 이미지`}
        className="w-full h-auto object-cover rounded-md"
      />
      <div className="flex justify-between mt-2 px-1">
        <span className="text-gray-400 text-sm">{context}</span>
        <span className="font-semibold text-sm">{username}</span>
      </div>
    </div>
  );
};

export default PopularFeed;
