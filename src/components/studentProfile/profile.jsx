import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BasicImg4 from "../../assets/images/BasicProfileImg4.png";
import { UserStore } from "../../store/userStore";
import SoufLogoBlack from "../../assets/images/SouFLogoBlack.png"
import AlertModal from "../alertModal";

export default function Profile({
  memberId,
  profileImageUrl,
  temperature,
  userName,
  userDetail,
  popularFeeds,
}) {

  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { memberId: currentMemberId } = UserStore();
  
  // 기본 이미지
  const getDefaultImage = () => {
    return BasicImg4;
  };

  const clickHandler = (memberId) => {
    navigate(`/profileDetail/${memberId}`);
  };

  return (
    <div
      className="flex relative items-center justify-start lg:w-[70%] w-full bg-white border-4 border-blue-200 rounded-[20px] p-2 pl-8 gap-2 cursor-pointer hover:shadow-md transition-all"
    >
   
      
      <div className="w-full flex items-center justify-start gap-8"
      onClick={() => clickHandler(memberId)}>
        <div className="flex flex-col items-center justify-center border-r border-gray-200 pr-8 ">
        <img 
          src={profileImageUrl || getDefaultImage()} 
          className="rounded-full min-w-24 h-24 border border-gray-200 " 
          alt={userName || "프로필 이미지"}
          onError={(e) => {
            e.target.src = getDefaultImage();
          }}
        />
        {/* <div className="font-semibold text-[15px]">스프 온도 {temperature}도</div> */}
        <div className="text-base font-semibold">{userName}</div>
        <div className="text-blue-500 text-[10px]">스프 온도 36.5도</div>
       
        </div>
        {popularFeeds && popularFeeds.length > 0 ? (
          <div className="grid grid-cols-3 justify-center gap-2">
            {popularFeeds.map((feed, index) => (
              <img 
                key={index} 
                src={`${import.meta.env.VITE_S3_BUCKET_URL}${feed.imageUrl}`}
                alt={`피드 이미지 ${index + 1}`}
                className="w-32 h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center mx-auto">
            <span className="text-gray-500 text-sm">작성된 피드가 없습니다.</span>
          </div>
        )}
      </div>
{/*       
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
      )} */}
    </div>
  );
}
