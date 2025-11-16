import { useNavigate, useParams } from "react-router-dom";
import backArrow from "../../assets/images/backArrow.svg";
import starOn from "../../assets/images/starOn.svg";
import starOff from "../../assets/images/starOff.svg";
import basicLogoImg from "../../assets/images/basiclogoimg.png";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfileDetail } from "../../api/profile";
import { getFavorite, postFavorite, deleteFavorite } from "../../api/favorite";
import { UserStore } from "../../store/userStore";
import AlertModal from "../alertModal";
import SEO from "../seo";
import DeclareButton from "../declare/declareButton";
import { FAVORITE_ERRORS } from "../../constants/user";
import { handleApiError } from "../../utils/apiErrorHandler";

// 학생 계정 프로필 UI 컴포넌트
const StudentProfileUI = ({
  userData,
  userWorks,
  star,
  isAnimating,
  showIntroSkeleton,
  handleFavorite,
  handleDeclareClick,
  onWorkClick,
  S3_BUCKET_URL,
  basicLogoImg
}) => {
  return (
    <div className="rounded-2xl border border-gray p-6 md:p-8 mb-8 mt-4 w-full">
      <div className="flex gap-12 mb-4 md:mb-6 pl-6">
        {/* 프로필 이미지 */}
        <img 
          src={userData?.profileImageUrl || basicLogoImg} 
          className="rounded-full w-[15%] md:w-1/4 object-cover" 
          alt="프로필 이미지"
          onError={(e) => {
            e.target.src = basicLogoImg;
          }}
        />
        
        <div className="flex flex-col gap-1 md:gap-2 max-sm:text-[14px] md:mt-4 w-full overflow-hidden">
          <div className="flex justify-between">
            {/* 닉네임 */}
            {userData?.nickname ? (
              <div className="font-semibold text-[20px] md:text-[23px]">{userData.nickname}</div>
            ) : (
              <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
            )}
            
            <div className="flex items-center gap-2">
              {/* 즐겨찾기 버튼 - 로그인한 사용자이고 본인이 아닐 때만 */}
              {UserStore.getState().memberId && UserStore.getState().memberId !== userData?.id && (
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
              <DeclareButton 
                contentType="프로필" 
                onDeclare={handleDeclareClick}
                iconClassName="w-7 h-7 cursor-pointer ml-auto"
              />
            </div>
          </div>
        
          {/* 자기소개 */}
          {userData?.intro ? (
            <div className="text-[#5B5B5B] break-words w-full">{userData.intro}</div>
          ) : showIntroSkeleton ? (
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
          ) : (
            <div className="text-[#5B5B5B] opacity-50"></div>
          )}
          
          {/* 개인 URL */}
          {userData?.personalUrl ? (
            <div className="text-[#5B5B5B] break-words w-full">{userData.personalUrl}</div>
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
              key={data.feedId}
              src={data.mediaResDto?.fileUrl ? S3_BUCKET_URL + data.mediaResDto.fileUrl : basicLogoImg}
              className="w-full h-44 sm:h-64 object-cover rounded-lg"
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
  );
};

// 동아리 계정 프로필 UI 컴포넌트
const ClubProfileUI = ({
  userData,
  userWorks,
  star,
  isAnimating,
  showIntroSkeleton,
  handleFavorite,
  handleDeclareClick,
  onWorkClick,
  S3_BUCKET_URL,
  basicLogoImg
}) => {
  return (
    <div className="flex max-w-[60rem] w-full justify-center gap-4">
      <div className="mb-8 mt-4 w-full">
      <div className="flex gap-12 mb-4 md:mb-6">
        {/* 프로필 이미지 */}
        <img 
          src={userData?.profileImageUrl || basicLogoImg} 
          className="rounded-lg md:w-1/3 object-cover" 
          alt="프로필 이미지"
          onError={(e) => {
            e.target.src = basicLogoImg;
          }}
        />
        
        <div className="flex flex-col gap-1 md:gap-2 max-sm:text-[14px] md:mt-4 w-full overflow-hidden">
          <div className="flex justify-between">
            {/* 닉네임 */}
            {userData?.nickname ? (
              <div className="font-semibold text-[20px] md:text-3xl">{userData.nickname}</div>
            ) : (
              <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
            )}
            
            <div className="flex items-center gap-2">
              {/* 즐겨찾기 버튼 - 로그인한 사용자이고 본인이 아닐 때만 */}
              {UserStore.getState().memberId && UserStore.getState().memberId !== userData?.id && (
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
              <DeclareButton 
                contentType="프로필" 
                onDeclare={handleDeclareClick}
                iconClassName="w-7 h-7 cursor-pointer ml-auto"
              />
            </div>
          </div>
        
          {/* 자기소개 */}
          {userData?.intro ? (
            <div className="border-t border-gray-200 pt-4 text-[#5B5B5B] break-words w-full text-xl">{userData.intro}</div>
          ) : showIntroSkeleton ? (
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
          ) : (
            <div className="text-[#5B5B5B] opacity-50"></div>
          )}
          
          {/* 개인 URL */}
          {userData?.personalUrl ? (
            <div className="text-[#5B5B5B] break-words w-full">{userData.personalUrl}</div>
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
              key={data.feedId}
              src={data.mediaResDto?.fileUrl ? S3_BUCKET_URL + data.mediaResDto.fileUrl : basicLogoImg}
              className="w-full h-44 sm:h-64 object-cover rounded-lg"
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
{/* 동아리원 파트 */}
      {/* <div className="bg-[#FFFDFD] rounded-xl border border-gray p-6 md:p-4 mb-8 w-1/3">
      <h3 className="text-2xl font-semibold">동아리 멤버</h3>
      <div className="flex gap-2 bg-white items-center p-2 rounded-lg shadow-md">
        <img src={basicLogoImg} alt="동아리원 프로필 이미지" className="w-10 h-10 rounded-full" />
        <div className="flex flex-col">
          <p>동아리원 1</p>
          <p>동아리원 1 소개</p>
        </div>
      </div>
      </div> */}
    </div>
  );
};

export default function ProfileDetail({}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [star, setStar] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userData, setUserData] = useState([]);
  const [userWorks, setUserWorks] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showIntroSkeleton, setShowIntroSkeleton] = useState(true);
  const [errorModal, setErrorModal] = useState(false);
  const [errorDescription, setErrorDescription] = useState("잘못된 접근");
  const [errorAction, setErrorAction] = useState("redirect");
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
        console.log('프로필 상세 API 응답:', data);
        console.log('memberResDto:', data.result.memberResDto);
       
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
      }, 1000);

      return () => clearTimeout(timer);
    }, []);

    const handleFavorite = async () => {
      // 로그인 체크
      if (!UserStore.getState().memberId) {
        setShowLoginModal(true);
        return;
      }

      // if (!fromMemberId || !userData.id) {
      //   console.error("ID가 없습니다. fromMemberId:", fromMemberId, "userData.id:", userData.id);
      //   return;
      // }
      
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
        handleApiError(error, { setShowLoginModal, setErrorModal, setErrorDescription, setErrorAction }, FAVORITE_ERRORS);
      }
    }

    useEffect(() => {
      const fetchFavoriteStatus = async () => {
        // 로그인한 사용자이고 본인이 아닐 때만 즐겨찾기 상태 확인
        if (!UserStore.getState().memberId || UserStore.getState().memberId === userData?.id) {
          setStar(false);
          return;
        }

         try {
            const response = await getFavorite(fromMemberId, 0, 100);
         
            const favoriteList = response.result?.content || [];
            
            
            const favoriteIds = favoriteList.map(favorite => favorite.id);
           
            const isFavorited = favoriteIds.includes(userData.id);
         
            setStar(isFavorited);
          } catch (error) {
            console.error("즐겨찾기 상태 확인 에러:", error);
            setStar(false);
            handleApiError(error, { setShowLoginModal, setErrorModal, setErrorDescription, setErrorAction }, FAVORITE_ERRORS);
          }
        // if (fromMemberId && userData.id && fromMemberId !== userData.id) {
         
        // }
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
    }, 200);
  };

  const onWorkClick = (worksId) => {
    navigate(`/profileDetail/${userData.id}/post/${worksId}`);
  };

  // 신고 처리 함수
  const handleDeclareClick = (declareData) => {
    console.log('프로필 신고 데이터:', declareData);
    // 여기에 신고 API 호출 
  };

  // 계정 타입 확인 - 여러 가능한 필드명 확인
  // console.log('userData 전체:', userData);

  // 여러 가능한 필드명에서 계정 타입 찾기
  const accountType = userData?.roleType || 
                      userData?.role || 
                      userData?.userType || 
                      userData?.accountType || 
                      userData?.memberType || 
                      "STUDENT"; // 기본값은 STUDENT
  const isStudentAccount = accountType === "STUDENT";
  const isClubAccount = accountType === "CLUB";
  console.log('최종 계정 타입:', accountType, 'isStudentAccount:', isStudentAccount, 'isClubAccount:', isClubAccount);

  return (
    <>
      {userData?.nickname && (
        <SEO
          title={userData.nickname}
          description={`스프 SouF ${userData.nickname} 대학생 프로필`}
          subTitle="스프"
        />
      )}
      <div className="flex flex-col pt-12 max-w-[60rem] w-full ">
        <button
          className="flex items-center text-gray-600 mb-4 hover:text-black transition-colors"
          onClick={handleGoBack}
        >
          <img src={backArrow} alt="뒤로가기" className="w-6 h-6 mr-1" />
          <span>목록으로 돌아가기</span>
        </button>
        
        {/* 계정 타입에 따라 다른 UI 렌더링 */}
        {isStudentAccount && (
          <StudentProfileUI 
            userData={userData}
            userWorks={userWorks}
            star={star}
            isAnimating={isAnimating}
            showIntroSkeleton={showIntroSkeleton}
            handleFavorite={handleFavorite}
            handleDeclareClick={handleDeclareClick}
            onWorkClick={onWorkClick}
            S3_BUCKET_URL={S3_BUCKET_URL}
            basicLogoImg={basicLogoImg}
          />
        )}
        
        {isClubAccount && (
          <ClubProfileUI 
            userData={userData}
            userWorks={userWorks}
            star={star}
            isAnimating={isAnimating}
            showIntroSkeleton={showIntroSkeleton}
            handleFavorite={handleFavorite}
            handleDeclareClick={handleDeclareClick}
            onWorkClick={onWorkClick}
            S3_BUCKET_URL={S3_BUCKET_URL}
            basicLogoImg={basicLogoImg}
          />
        )}
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
        onClickFalse={() => {
          setShowLoginModal(false);
          navigate("/");
        }}
      />
        )}
        {errorModal && (
          <AlertModal
          type="simple"
          title="오류 발생"
          description={errorDescription}
          TrueBtnText="확인"
          onClickTrue={() => {
            if (errorAction === "redirect") {
                navigate("/");
            }else if(errorAction === "login"){
              localStorage.clear();
              navigate("/login");
            }else{
              window.location.reload();
            }
          }}
            />
        )}
      </div>
    </>
  );
}
