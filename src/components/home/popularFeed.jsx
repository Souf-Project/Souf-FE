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
    <>
      <div
        onClick={handleClick}
        className="cursor-pointer w-full max-w-[180px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-lg xl:max-w-[380px] 2xl:max-w-[600px] flex flex-col items-center"
      >
        <div className="w-full aspect-[1/1] rounded-md overflow-hidden">
          <img
            src={`${BUCKET_URL}${url}`}
            alt={`${username} 이미지`}
            className="w-full h-full object-cover border-2 border-gray-200"
          />
        </div>
        <div className="flex justify-between items-center w-full mt-2 text-sm">
          <span className="text-gray-400 truncate max-w-[70%]">{context}</span>
          <span className="font-semibold truncate max-w-[30%] text-right">{username}</span>
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
};

export default PopularFeed;
