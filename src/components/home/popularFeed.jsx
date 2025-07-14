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

    
    if (memberId && feedId) {
      navigate(`/profileDetail/${memberId}/post/${feedId}`);
    } else {
      console.error("memberId 또는 feedId가 없습니다:", { memberId, feedId });
    }
  };
  

  return (
    <>
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
      
      {showLoginModal && (
        <AlertModal
          type="simple"
          title="로그인이 필요합니다"
          description="SouF 회원만 상세 글을 조회할 수 있습니다!"
          TrueBtnText="로그인하러 가기"
          FalseBtnText="취소"
          onClickTrue={() => {
            setShowLoginModal(false);
            navigate("/login");
          }}
          onClickFalse={() => setShowLoginModal(false)}
        />
      )}
    </>
  );

export default PopularFeed;
