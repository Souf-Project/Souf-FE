import { useNavigate } from "react-router-dom";
import sendIco from "../../assets/images/sendIco.svg";

export default function Profile({
  profileId,
  profileImg,
  temperature,
  userName,
  userDetail,
  userWorks,
}) {
  const navigate = useNavigate();
  const clickHandler = (profileId) => {
    navigate(`/profileDetail/${profileId}`);
  };

  return (
    <div
      className="flex relative flex-col items-center justify-center w-full border border-[#D4D4D4] rounded-[30px] p-8 gap-2 cursor-pointer hover:shadow-md transition-all"
      onClick={() => clickHandler(profileId)}
    >
      <img className="absolute top-4 right-4 w-11" src={sendIco} />
      <img src={profileImg} className="rounded-full" />
      <div className="font-semibold text-[15px]">스프 온도 {temperature}도</div>
      <div className="flex flex-col justify-center">
        <div className="font-semibold text-2xl">{userName}</div>
        <div className="text-[#5B5B5B]">{userDetail}</div>
      </div>
      <div className="grid grid-cols-3 justify-center gap-2">
        {userWorks.map((data) => (
          <img src={data} />
        ))}
      </div>
    </div>
  );
}
