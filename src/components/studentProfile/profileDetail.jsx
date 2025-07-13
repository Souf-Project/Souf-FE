import { useNavigate, useParams } from "react-router-dom";
import backArrow from "../../assets/images/backArrow.svg";
import starOn from "../../assets/images/starOn.svg";
import starOff from "../../assets/images/starOff.svg";

import BasicImg4 from "../../assets/images/BasicProfileImg4.png";
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
  const [showIntroSkeleton, setShowIntroSkeleton] = useState(true);
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

    // 3초 후 스켈레톤 애니메이션 숨기기
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowIntroSkeleton(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    const handleFavorite = async () => {

      if (!fromMemberId || !userData.id) {
        console.error("ID가 없습니다. fromMemberId:", fromMemberId, "userData.id:", userData.id);
        return;
      }
      
      try {
        if (!star) {
          const data = await postFavorite(fromMemberId, userData.id);
        
        } else {
          const data = await deleteFavorite(fromMemberId, userData.id);
        
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
         
            const favoriteList = response.result?.content || [];
            
            
            const favoriteIds = favoriteList.map(favorite => favorite.id);
           
            const isFavorited = favoriteIds.includes(userData.id);
         
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
          {/* 프로필 이미지 */}
          <img 
            src={userData?.profileImageUrl || BasicImg4} 
            className="rounded-full w-1/4 object-cover" 
            alt="프로필 이미지"
          />
          
          <div className="flex flex-col gap-2 mt-4 w-full">
            <div className="flex items-center">
              {/* 닉네임 */}
              {userData?.nickname ? (
                <div className="font-semibold text-[23px]">{userData.nickname}</div>
              ) : (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
              )}
              
              {/* 즐겨찾기 버튼 - 본인이 아닐 때만 */}
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
           
            {/* 자기소개 */}
            {userData?.intro ? (
              <div className="text-[#5B5B5B]">{userData.intro}</div>
            ) : showIntroSkeleton ? (
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
            ) : (
              <div className="text-[#5B5B5B] opacity-50"></div>
            )}
            
            {/* 개인 URL */}
            {userData?.personalUrl ? (
              <div className="text-[#5B5B5B]">{userData.personalUrl}</div>
            ) : showIntroSkeleton ? (
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
            ) : (
              <div className="text-[#5B5B5B] opacity-50"></div>
            )}
          </div>
        </div>
        <hr className="border-t border-gray-200 my-6" />
        {userWorks && userWorks.length > 0 ? (
          <div className="grid grid-cols-3 justify-center w-full gap-1 cursor-pointer">
            {userWorks.map((data) => (
              <img
                src={data.mediaResDto?.fileUrl ? S3_BUCKET_URL + data.mediaResDto.fileUrl : BasicImg4}
                className="w-full h-64 object-cover rounded-lg"
                onClick={() => onWorkClick(data.feedId)}
                alt="작품 이미지"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">등록된 피드가 없습니다.</div>
          </div>
        )}
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
