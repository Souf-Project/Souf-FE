import { useNavigate, useParams } from "react-router-dom";
import backArrow from "../../assets/images/backArrow.svg";
import { useState } from "react";

export default function ProfileDetail({}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [star, setStar] = useState(false);

  // 추후에 백엔드에서 데이터 받아올 것 같아서 id 만 받아오고 데이터 고정해놓음
  const userData = {
    id: 1,
    profileImg: "https://placehold.co/100",
    temperature: "85",
    userName: "홍길동",
    userDetail: "사용자 중심의 UI/UX를 설계하는 프론트엔드 개발자",
    userWorks: [
      { id: 1, url: "https://placehold.co/100x100?text=Work1" },
      { id: 2, url: "https://placehold.co/100x100?text=Work2" },
      { id: 3, url: "https://placehold.co/100x100?text=Work3" },
    ],
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const onWorkClick = (worksId) => {
    console.log(id + "안녕 " + worksId);
    navigate(`/profileDetail/${id}/post/${worksId}`);
  };
  return (
    <div className="flex flex-col pt-24 px-4 max-w-4xl w-full ">
      <button
        className="flex items-center text-gray-600 mb-4 hover:text-black transition-colors"
        onClick={handleGoBack}
      >
        <img src={backArrow} alt="뒤로가기" className="w-6 h-6 mr-1" />
        <span>목록으로 돌아가기</span>
      </button>
      <div className="rounded-2xl border border-gray p-8 mb-8 mt-4 w-full relative">
        <button
          className="absolute top-8 right-8 text-[28px] text-[#FFC300] border-[3px] border-[#FFC300] pb-2 px-[10px] rounded-[20px] flex items-center justify-center"
          onClick={() => setStar(!star)}
        >
          {star ? "★" : "☆"}
        </button>

        <div className="flex gap-12 my-14 pl-6">
          <img src={userData.profileImg} className="rounded-full w-1/4" />
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-[23px]">{userData.userName}</div>
            <div className="text-[#5B5B5B]">{userData.userDetail}</div>
          </div>
        </div>
        <hr className="border-t border-gray-200 my-6" />
        <div className="grid grid-cols-3 justify-center w-full gap-1 cursor-pointer">
          {userData.userWorks.map((data) => (
            <img
              src={data.url}
              className="w-full"
              onClick={() => onWorkClick(data.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
