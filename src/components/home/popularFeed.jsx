import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../../store/userStore";
import AlertModal from "../alertModal";

const BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

const PopularFeed = ({ url, context, username, feedId, memberId: profileMemberId }) => {
  const navigate = useNavigate();
  const { memberId } = UserStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleClick = () => {
    if (!memberId) {
      setShowLoginModal(true);
    } else {
      navigate(`/profileDetail/${profileMemberId}/post/${feedId}`);
    }
  };

  return (
    <div className="w-[180px] h-[200px] lg:w-64 lg:h-64" onClick={() => navigate(`/profileDetail/1/post/2`)}>
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
