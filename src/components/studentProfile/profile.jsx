import { useNavigate } from "react-router-dom";
import { useState } from "react";
import sendIco from "../../assets/images/sendIco.svg";
import BasicImg4 from "../../assets/images/BasicProfileImg4.png";
import { postChatrooms } from "../../api/chat";
import { UserStore } from "../../store/userStore";
import AlertModal from "../alertModal";

export default function Profile({
  memberId,
  profileImageUrl,
  temperature,
  userName,
  userDetail,
  userWorks,
}) {
  // console.log("profileImageUrl", profileImageUrl);
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { memberId: currentMemberId } = UserStore();

  const handleChat = async (memberId) => {
    if (!currentMemberId) {
      setShowLoginModal(true);
      return;
    }
    
    try {
      const response = await postChatrooms(memberId);

      // 채팅방 생성 후 해당 채팅방으로 이동
      if (response.roomId) {
        navigate(`/chat`);
      } else {
      }
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
    }
  };
  
  // 기본 이미지
  const getDefaultImage = () => {
    return BasicImg4;
  };

  const clickHandler = (memberId) => {
    if (!currentMemberId) {
      setShowLoginModal(true);
      return;
    }
    navigate(`/profileDetail/${memberId}`);
  };

  return (
    <div
      className="flex relative flex-col items-center justify-center w-full border border-[#D4D4D4] rounded-[30px] p-8 gap-2 cursor-pointer hover:shadow-md transition-all"
    >
      <img className="absolute top-4 right-4 w-11 z-10" src={sendIco} onClick={() => handleChat(memberId)} />
      <div onClick={() => clickHandler(memberId)}>
      <img 
        src={profileImageUrl || getDefaultImage()} 
        className="rounded-full" 
        alt={userName || "프로필 이미지"}
        onError={(e) => {
          e.target.src = getDefaultImage();
        }}
      />
      {/* <div className="font-semibold text-[15px]">스프 온도 {temperature}도</div> */}
      <div className="font-semibold text-[15px] mt-4">스프 온도 36.5도</div>
      <div className="flex flex-col justify-center">
        <div className="font-semibold text-2xl">{userName}</div>
        <div className="text-[#5B5B5B]">{userDetail}</div>
      </div>
      <div className="grid grid-cols-3 justify-center gap-2">
        {userWorks?.map((data) => (
          <img key={i} src={data} />
        ))}
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
    </div>
  );
}
