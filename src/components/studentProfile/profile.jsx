import { useNavigate } from "react-router-dom";
import sendIco from "../../assets/images/sendIco.svg";
import BasicImg1 from "../../assets/images/BasicprofileImg1.png";
import BasicImg2 from "../../assets/images/BasicprofileImg2.png";
import BasicImg3 from "../../assets/images/BasicprofileImg3.png";
import BasicImg4 from "../../assets/images/BasicprofileImg4.png";

export default function Profile({
  profileId,
  profileImg,
  temperature,
  userName,
  userDetail,
  userWorks,
}) {
  const navigate = useNavigate();
  
  // 기본 이미지를 랜덤으로 선택하는 함수
  const getRandomDefaultImage = () => {
    const defaultImages = [BasicImg1, BasicImg2, BasicImg3, BasicImg4];
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    return defaultImages[randomIndex];
  };

  const clickHandler = (profileId) => {
    navigate(`/profileDetail/${profileId}`);
  };

  return (
    <div
      className="flex relative flex-col items-center justify-center w-full border border-[#D4D4D4] rounded-[30px] p-8 gap-2 cursor-pointer hover:shadow-md transition-all"
      onClick={() => clickHandler(profileId)}
    >
      <img className="absolute top-4 right-4 w-11" src={sendIco} />
      <img 
        src={profileImg || getRandomDefaultImage()} 
        className="rounded-full" 
        alt={userName || "프로필 이미지"}
        onError={(e) => {
          e.target.src = getRandomDefaultImage();
        }}
      />
      <div className="font-semibold text-[15px]">스프 온도 {temperature}도</div>
      <div className="flex flex-col justify-center">
        <div className="font-semibold text-2xl">{userName}</div>
        <div className="text-[#5B5B5B]">{userDetail}</div>
      </div>
      <div className="grid grid-cols-3 justify-center gap-2">
        {userWorks?.map((data) => (
          <img src={data} />
        ))}
      </div>
    </div>
  );
}
