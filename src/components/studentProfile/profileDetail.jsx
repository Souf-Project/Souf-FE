import { useNavigate, useParams } from "react-router-dom";
import backArrow from "../../assets/images/backArrow.svg";
import starOn from "../../assets/images/starOn.svg";
import starOff from "../../assets/images/starOff.svg";

import BasicImg4 from "../../assets/images/BasicprofileImg4.png";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfileDetail } from "../../api/profile";
import { getFavorite, postFavorite, deleteFavorite } from "../../api/favorite";
import { UserStore } from "../../store/userStore";
import AlertModal from "../alertModal";

export default function ProfileDetail({}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [star, setStar] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userData, setUserData] = useState([]);
  const [userWorks, setUserWorks] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const fromMemberId = UserStore.getState().memberId;

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
      onError: (error) => {
        // 403 에러인 경우 로그인 모달 표시
        if (error.response?.status === 403) {
          setShowLoginModal(true);
        }
      },
    });

    const handleFavorite = async () => {

      if (!fromMemberId || !userData.id) {
        console.error("ID가 없습니다. fromMemberId:", fromMemberId, "userData.id:", userData.id);
        return;
      }
      
      try {
        if (!star) {
          const data = await postFavorite(fromMemberId, userData.id);
          console.log("즐겨찾기 생성:", data);
        } else {
          const data = await deleteFavorite(fromMemberId, userData.id);
          console.log("즐겨찾기 삭제:", data);
        }
        
        // API 호출 성공 후 UI 상태 변경
        handleStarClick();
      } catch (error) {
        console.error("즐겨찾기 처리 에러:", error);
        // 에러 발생 시 UI 상태 변경하지 않음
      }
    }

    useEffect(() => {
      const fetchFavoriteStatus = async () => {
        if (fromMemberId && userData.id && fromMemberId !== userData.id) {
          try {
            const response = await getFavorite(fromMemberId, 0, 100);
            console.log("즐겨찾기 목록:", response);
            
            // 응답에서 해당 사용자가 즐겨찾기 목록에 있는지 확인
            const favoriteList = response.result?.content || [];
            
            
            const favoriteIds = favoriteList.map(favorite => favorite.id);
           
            const isFavorited = favoriteIds.includes(userData.id);
            console.log("즐겨찾기 상태:", isFavorited);
            setStar(isFavorited);
          } catch (error) {
            console.error("즐겨찾기 상태 확인 에러:", error);
            setStar(false);
          }
        }
      };
  
      fetchFavoriteStatus();
    }, [userData.id, fromMemberId]);

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
            {UserStore.getState().memberId !== userData?.id && (
              <button
                className={`flex items-center justify-center ml-auto transition-all duration-300 ease-in-out ${
                  isAnimating ? 'scale-125 rotate-12' : 'scale-100 rotate-0'
                } hover:scale-110 `}
                onClick={handleFavorite}
              >
                <img 
                  src={star ? starOn : starOff} 
                  alt={star ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                  className="w-8 h-8"
                />
              </button>
            )}
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
