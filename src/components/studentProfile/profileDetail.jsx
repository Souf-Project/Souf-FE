import { useNavigate, useParams } from "react-router-dom";
import backArrow from "../../assets/images/backArrow.svg";
import starOn from "../../assets/images/starOn.svg";
import starOff from "../../assets/images/starOff.svg";

import BasicImg4 from "../../assets/images/BasicprofileImg4.png";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfileDetail } from "../../api/profile";
import { getFavorite } from "../../api/favorite";

export default function ProfileDetail({}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [star, setStar] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userData, setUserData] = useState([]);
  const [userWorks, setUserWorks] = useState([]);

  const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

      const {
      data: feedData,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["profileDetail"],
      queryFn: async () => {
        const data = await getProfileDetail(id);
        console.log("사람 디테일:", data);
        setUserData(data.result.memberResDto);
        setUserWorks(data.result.feedSimpleResDtoPage.content)
        
        return data;
      },
      keepPreviousData: true,
    });

    const handleFavorite = async () => {
      const fromMemberId = userStore.getMemberId();
      const data = await getFavorite(fromMemberId, userData.id);
      console.log("즐겨찾기:", data);
    }

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleStarClick = () => {
    setIsAnimating(true);
    setStar(!star);
    
    // 애니메이션 완료 후 상태 초기화
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const onWorkClick = (worksId) => {
    navigate(`/profileDetail/${userData.id}/post/${worksId}`);
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
      <div className="rounded-2xl border border-gray p-8 mb-8 mt-4 w-full">
        

        <div className="flex gap-12 mb-6 pl-6">
          <img 
            src={userData?.profileUrl ? S3_BUCKET_URL + userData.profileUrl : BasicImg4} 
            className="rounded-full w-1/4" 
          />
          <div className="flex flex-col gap-2 mt-4 w-full">
            <div className="flex items-center ">
            <div className="font-semibold text-[23px]">{userData?.nickname}</div>
            <button
          className={`flex items-center justify-center ml-auto transition-all duration-300 ease-in-out ${
            isAnimating ? 'scale-125 rotate-12' : 'scale-100 rotate-0'
          } hover:scale-110 `}
          onClick={handleStarClick}
        >
          <img 
            src={star ? starOn : starOff} 
            alt={star ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            className="w-8 h-8"
          />
        </button>
            </div>
           
            <div className="text-[#5B5B5B]">{userData?.intro}</div>
             <div className="text-[#5B5B5B]">{userData?.personalUrl}</div>
          </div>
        </div>
        <hr className="border-t border-gray-200 my-6" />
        <div className="grid grid-cols-3 justify-center w-full gap-1 cursor-pointer">
          {userWorks?.map((data) => (
            <img
              src={S3_BUCKET_URL + data.mediaResDto?.fileUrl}
              className="w-full"
              onClick={() => onWorkClick(data.feedId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
