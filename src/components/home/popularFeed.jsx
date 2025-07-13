import React from "react";
import { useNavigate } from "react-router-dom";

const BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

const PopularFeed = ({ url, context, username, memberId, feedId }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    
    if (memberId && feedId) {
      navigate(`/profileDetail/${memberId}/post/${feedId}`);
    } else {
      console.error("memberId 또는 feedId가 없습니다:", { memberId, feedId });
    }
  };
  
  return (
    <div className="w-[180px] h-[200px] lg:w-64 lg:h-64 cursor-pointer" onClick={handleClick}>
      <img
        src={`${BUCKET_URL}${url}`}
        alt={`${username} 이미지`}
        className="md:w-full h-auto object-cover rounded-md w-[180px] h-[200px] lg:w-64 lg:h-64"
      />
      <div className="flex justify-between mt-2 px-1">
        <span className="text-gray-400 text-sm">{context}</span>
        <span className="font-semibold text-sm">{username}</span>
      </div>
    </div>
  );
};

export default PopularFeed;
