import { useNavigate, useParams } from "react-router-dom";
import backArrow from "../../assets/images/backArrow.svg";
import heartOn from "../../assets/images/heartOn.svg";
import heartOff from "../../assets/images/heartOff.svg";
import commentIco from "../../assets/images/commentIco.svg";
import shareIco from "../../assets/images/shareIco.svg";
import temperatureIcon from "../../assets/images/temperatureIcon.svg";
import starOn from "../../assets/images/starOn.svg";
import starOff from "../../assets/images/starOff.svg";
import { deleteFeed, getFeedDetail } from "../../api/feed";
import { patchLike} from "../../api/additionalFeed";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFormattedDate } from "../../utils/getDate";
import {UserStore} from "../../store/userStore";
import { useRef, useEffect } from "react"; 
import AlertModal from "../../components/alertModal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import CommentList from "../post/commentList";
import Loading from "../loading";
import SEO from "../seo";
import useSNSShare from "../../hooks/useSNSshare";
import DeclareButton from "../declare/declareButton";
import PageHeader from "../pageHeader";
// import RecommendRecruit from "../recruit/recommendRecruit";
import basicLogoImg from "../../assets/images/basiclogoimg.png";
import { FEED_ERRORS } from "../../constants/post";
import { getCategoryNames } from "../../utils/categoryUtils";
import { getFavorite, postFavorite, deleteFavorite } from "../../api/favorite";
import { handleApiError } from "../../utils/apiErrorHandler";
import { FAVORITE_ERRORS } from "../../constants/user";

const BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

export default function PostDetail() {
  const navigate = useNavigate();
  const { id, worksId } = useParams();
  const [worksData, setWorksData] = useState([]);
  const [mediaData, setMediaData] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const { memberId } = UserStore();
  const optionsRef = useRef(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileSkeleton, setShowProfileSkeleton] = useState(true);
  const swiperRef = useRef(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLiked, setIsLiked] = useState();
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [isHeartDisabled, setIsHeartDisabled] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorDescription, setErrorDescription] = useState("잘못된 접근");
  const [errorAction, setErrorAction] = useState("redirect");
  const fromMemberId = UserStore.getState().memberId;
  const [isAnimating, setIsAnimating] = useState(false);
  const [star, setStar] = useState(false);


    const {
    data: feedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feedDetail"],
    queryFn: async () => {
      try {
        const data = await getFeedDetail(id,worksId);

        data.result.mediaResDtos?.forEach((media, index) => {
        });
      
        setWorksData(data.result);
        // console.log("worksData", data.result);
        // console.log("mediaData", data.result.mediaResDtos);
        setMediaData(data.result.mediaResDtos);
        
        // 좋아요 상태 초기화
        if (data.result.liked !== undefined) {
          setIsLiked(data.result.liked);
        }
        
        return data;
      } catch (error) {
        const errorKey = error?.response?.data?.errorKey;
        if (error.response?.status === 403) {
          setShowLoginModal(true);
        } else {
          const errorInfo = FEED_ERRORS[errorKey];
          setErrorModal(true);
          setErrorDescription(errorInfo?.message || "알 수 없는 오류가 발생했습니다.");
          setErrorAction(errorInfo?.action || "redirect");
        }
        throw error;
        }
    },
    keepPreviousData: true,
  });


  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
  function handleClickOutside(event) {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  // 1초 후 스켈레톤 애니메이션 숨기기
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProfileSkeleton(false);
    }, 1000);

    return () => clearTimeout(timer);
}, []);

const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteFeed(worksId);
      setShowDeleteModal(false);
      setShowCompleteModal(true);
    } catch (err) {
      //console.log("실패 넘어요", err);
      setShowDeleteModal(false);
      const errorKey = err?.response?.data?.errorKey;
      if (err.response?.status === 403) {
        setShowLoginModal(true);
      } else {
        const errorInfo = FEED_ERRORS[errorKey];
        setErrorModal(true);
        setErrorDescription(errorInfo?.message || "알 수 없는 오류가 발생했습니다.");
        setErrorAction(errorInfo?.action || "redirect");
      }
        
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleCompleteConfirm = () => {
    setShowCompleteModal(false);
    navigate("/");
  };

  // SNS 공유 훅 사용
  const { shareToTwitter, shareToFacebook, shareToKakaoTalk, shareToNavigator, isAvailNavigator } = useSNSShare({
    title: worksData.topic,
    url: window.location.href,
  });

  const handleShareClick = () => {
    setShowShareDropdown(!showShareDropdown);
  };

  const handleHeartClick = async () => {
    
    setIsHeartDisabled(true); 
    setIsHeartAnimating(true);
    
    try {
      const currentMemberId = UserStore.getState().memberId;
      const requestBody = {
        memberId: currentMemberId,
        isLiked: !isLiked // 현재 상태의 반대값을 전송
      };
      
      await patchLike(worksId, requestBody);

      const updatedData = await getFeedDetail(id, worksId);
      setWorksData(updatedData.result);
      setIsLiked(updatedData.result.liked);
      setMediaData(updatedData.result.mediaResDtos);
     
    } catch (error) {
      console.error("피드 관련 에러:", error);
      const errorKey = error?.response?.data?.errorKey;
      if (error.response?.status === 403) {
        setShowLoginModal(true);
      }else{
        const errorInfo = FEED_ERRORS[errorKey];
        setErrorModal(true);
        setErrorDescription(errorInfo?.message || "알 수 없는 오류가 발생했습니다.");
        setErrorAction(errorInfo?.action || "redirect");
      }
    }
    
    setTimeout(() => {
      setIsHeartAnimating(false);
    }, 200);
    
    // 1초 후 버튼 다시 활성화
    setTimeout(() => {
      setIsHeartDisabled(false);
    }, 1000);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('URL 복사 실패:', err);
    }
  };

  const handleDeclareClick = (declareData) => {
    // console.log('프로필 신고 데이터:', declareData);
    // 여기에 신고 API 호출
  };

  const shortenUrl = (url) => {
    if (url.length <= 40) return url;
    const start = url.substring(0, 20);
    const end = url.substring(url.length - 20);
    return `${start}...${end}`;
  };

  const handleShareToTwitter = () => {
    shareToTwitter();
    setShowShareModal(false);
  };

  const handleShareToFacebook = () => {
    shareToFacebook();
    setShowShareModal(false);
  };

  const handleShareToKakaoTalk = () => {
    shareToKakaoTalk();
    setShowShareModal(false);
  };

  const handleShareToNavigator = () => {
    shareToNavigator({
      text: worksData.topic,
      url: window.location.href,
    });
    setShowShareModal(false);
  };

  const handleStarClick = () => {
    setIsAnimating(true);
    setStar(!star);
    
    // 애니메이션 완료 후 상태 초기화
    setTimeout(() => {
      setIsAnimating(false);
    }, 200);
  };

  const handleFavorite = async () => {
    // 로그인 체크
    if (!UserStore.getState().memberId) {
      setShowLoginModal(true);
      return;
    }

    if (!fromMemberId || !worksData.memberId) {
      console.error("ID가 없습니다. fromMemberId:", fromMemberId, "worksData.memberId:", worksData.memberId);
      return;
    }
    
    try {
      if (!star) {
        await postFavorite(fromMemberId, worksData.memberId);
      } else {
        await deleteFavorite(fromMemberId, worksData.memberId);
      }
      
      // API 호출 성공 후 UI 상태 변경
      handleStarClick();
    } catch (error) {
      console.error("즐겨찾기 처리 에러:", error);
      // 에러 발생 시 UI 상태 변경하지 않음
      handleApiError(error, { setShowLoginModal, setErrorModal, setErrorDescription, setErrorAction }, FAVORITE_ERRORS);
    }
  };

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      // 로그인한 사용자이고 본인이 아닐 때만 즐겨찾기 상태 확인
      if (!fromMemberId || !worksData.memberId || fromMemberId === worksData.memberId) {
        setStar(false);
        return;
      }

      try {
        const response = await getFavorite(fromMemberId, 0, 100);
        const favoriteList = response.result?.content || [];
        const favoriteIds = favoriteList.map(favorite => favorite.id);
        const isFavorited = favoriteIds.includes(worksData.memberId);
        setStar(isFavorited);
      } catch (error) {
        console.error("즐겨찾기 상태 확인 에러:", error);
        setStar(false);
        handleApiError(error, { setShowLoginModal, setErrorModal, setErrorDescription, setErrorAction }, FAVORITE_ERRORS);
      }
    };

    if (worksData.memberId) {
      fetchFavoriteStatus();
    }
  }, [worksData.memberId, fromMemberId]);

  if (isLoading) {
    return <Loading text="게시글을 불러오는 중..." />;
  }

  return (
    <>
      <SEO  title={worksData.topic} description={`스프 SouF - ${worksData.topic} 피드`} subTitle='스프'
      content={worksData.content} />
      <div className="w-full">
      <PageHeader
        leftButtons={[
          { text: `피드 상세 조회 : ${worksData.topic}`}
        ]}
        backButton={true}
        backButtonText="뒤로가기"
        backButtonClick={handleGoBack}
      />
      
      </div>
      <div className="flex flex-col  max-w-[60rem] w-full mx-auto">
        <button
            className="flex items-center text-gray-600 hover:text-black transition-colors"
            onClick={handleGoBack}
          >
            <img src={backArrow} alt="뒤로가기" className="w-6 h-6" />
            <span>뒤로가기</span>
          </button>

        <div className="w-full flex flex-col md:flex-row">
          <div className="flex flex-col p-2 w-full md:w-2/3 md:mr-4">
          {/* 모바일: 제목과 날짜  */}
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <h2 className="text-base lg:text-xl font-semibold leading-snug text-black">
              {worksData.topic}
            </h2>
            <p className="text-xs lg:text-sm text-gray-500">
              {getFormattedDate(worksData.lastModifiedTime)}
            </p>
          </div>
          
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center">
          
          <div className="w-full text-xl font-semibold leading-snug text-black py-3 lg:block hidden">
                      {worksData.topic}
                    </div>
                    <p className="text-sm text-gray-500 whitespace-nowrap">
            조회 수 {worksData.view}회
          </p>
          {/* 수정 버튼 (오른쪽) - 본인일 경우에만 */}
            {Number(id) === memberId && (
                      <div ref={optionsRef} className="relative">
                        <button
                          onClick={() => setShowOptions((prev) => !prev)}
                          className="text-xl px-2 py-1 rounded hover:bg-gray-100"
                        >
                          ⋯
                        </button>

                        {showOptions && (
                          <div className="absolute right-0 top-full mt-1 w-28 bg-white border rounded shadow-lg z-10">
                            <button
                              onClick={() => navigate("/postEdit", {
                                        state: {
                                        worksData,
                                        mediaData
                                      }
                                    })}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                              수정하기
                            </button>
                            <button
                               onClick={handleDeleteClick}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
                            >
                              삭제하기
                            </button>
                          </div>
                        )}
                      </div>
                    )}
            </div>
         
            <div className="flex w-full h-full relative">
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                pagination={{
                  dynamicBullets: true,
                }}
                modules={[Pagination]}
                className="rounded-lg relative"
              >
                {mediaData?.map((data, i) => {
                  const isVideo = data.fileType?.toLowerCase() === "mp4" || data.fileUrl?.toLowerCase().endsWith(".mp4");
                  return (
                    <SwiperSlide key={i} className="flex justify-center items-center">
                      <div className="flex justify-center items-center h-auto w-full">
                        {isVideo ? (
                          <video
                            src={`${BUCKET_URL}${data.fileUrl}`}
                            controls
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <img
                            src={`${BUCKET_URL}${data.fileUrl}`}
                            alt={data.fileName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              
              {/* 커스텀 화살표 버튼 - 이미지가 여러 장일 때만 표시 */}
              {mediaData && mediaData.length > 1 && (
                <>
                  <button 
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => swiperRef.current?.slideNext()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            <div className="w-full relative order-1 lg:order-2 mb-6 lg:mb-0">
              <div className="flex flex-col justify-between h-full">
                {/* 상단: 프로필 + 제목 + 내용 */}
                 
                    <div className="w-full mt-6">
                      <p className="text-xs font-semibold mb-2">작품 소개</p>
                      <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed break-words overflow-hidden">
                        {worksData.content}
                      </p>
                      </div>

                <div className="flex items-center justify-between gap-2 mt-4">
                  <div className="flex items-center gap-2">
                    <button 
                      className={`flex items-center gap-2 transition-all duration-300 ease-in-out ${
                        isHeartAnimating ? 'scale-125 rotate-12' : 'scale-100 rotate-0'
                      } hover:scale-110 ${isHeartDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} 
                      onClick={handleHeartClick}
                      disabled={isHeartDisabled}
                    >
                      <img src={isLiked ? heartOn : heartOff} alt={isLiked ? "heartOn" : "heartOff"} className="w-7 h-7" />
                    </button>
                     <p className="text-sm text-gray-600">{worksData.likedCount}</p>

                    <button className="flex items-center gap-2">
                      <img src={commentIco} alt="commentIco" className="w-7 h-7"  />
                    </button>
                     <p className="text-sm text-gray-600">{worksData.commentCount}</p>
                     
                  </div>
                  <DeclareButton 
                postType="PROFILE"
                postId={worksId}
                title={worksData?.topic || worksData?.content || "작품"}
                reporterId={memberId}
                reportedMemberId={worksData?.memberId || id}
                onDeclare={handleDeclareClick}
                iconClassName="w-7 h-7 cursor-pointer ml-auto"
              />
                  <div className="relative">
                    {/* <img src={shareIco} alt="shareIco" className="w-7 h-7 cursor-pointer" onClick={handleShareClick} /> */}
                  
                  
                 
                    {/* 공유 드롭다운 */}
                    {/* {showShareDropdown && (
                      <div className="absolute bottom-full right-0 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-sm z-50">
                        <div className="p-4">
                          <h3 className="text-sm font-semibold text-gray-800 mb-3">공유하기</h3>
                          
                          <div className="flex justify-center gap-3 mb-4">
                            <button 
                              onClick={handleShareToTwitter}
                              className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                            >
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                              </svg>
                            </button>
                            
                            <button 
                              onClick={handleShareToFacebook}
                              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                            >
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                            </button>
                            
                            <button onClick={handleShareToKakaoTalk} className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors">
                              <span className="text-white text-xs font-bold">K</span>
                            </button>
                          </div>
                          
                          <div className="border-t border-gray-200 pt-3">
                            <div className="flex items-center gap-2 mb-2 bg-gray-50 border border-gray-200 rounded px-2 py-1">
                              <span className="flex-1 text-xs text-gray-600 truncate">
                                {shortenUrl(window.location.href)}
                              </span>
                              <button 
                                onClick={handleCopyUrl}
                                className="px-2 py-1 bg-white hover:bg-gray-100 rounded text-xs transition-colors border border-gray-200"
                              >
                                {copySuccess ? "복사됨!" : "복사"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CommentList />
          <div className="">
          {/* <RecommendRecruit /> */}
          </div>
        
        </div>
        <div className="w-full md:w-1/3 bg-[#FFFDFD] border border-[#ECECEC] h-full p-4 flex flex-col justify-center rounded-md gap-4 cursor-pointer mx-4 md:mx-0 mb-4 md:mb-0"
        onClick={() => navigate(`/profileDetail/${worksData.memberId}`)}>
        <div className="flex justify-between">
        {worksData.profileImageUrl ? (
          <img src={`${worksData.profileImageUrl}`} alt="profileImage" className="w-24 h-24 object-cover rounded-full" />
        ) : (
          <img src={basicLogoImg} alt="profileImage" className="w-24 h-24 object-cover rounded-full" />
        )}
        {/* 즐겨찾기 버튼 - 로그인한 사용자이고 본인이 아닐 때만 */}
        {UserStore.getState().memberId && UserStore.getState().memberId !== worksData.memberId && (
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
        <div>
          <div className="flex items-center gap-2 justify-between">
          {worksData.nickname && (
            <p className="text-lg font-bold">{worksData.nickname}</p>
          )}
           {worksData.temperature && (
            <div className="flex items-center gap-2">
              <img src={temperatureIcon} alt="temperatureIcon" className="w-4 h-4" />
            <p className="text-sm text-gray-500">{worksData.temperature}도</p>
            </div>
          )}
          </div>
          {worksData.intro && (
            <p className="text-sm text-gray-500">{worksData.intro}</p>
          )}
         
          {worksData.personalUrl && (
            <p className="text-sm text-gray-500">{worksData.personalUrl}</p>
          )}
          {worksData.studentCategories && worksData.studentCategories.length > 0 && (
            <div className="flex gap-1 mt-4">
              {getCategoryNames(worksData.studentCategories).map((categoryName, index) => (
                <p key={index} className="text-sm text-gray-500 bg-blue-bright px-2 py-1 rounded-md">#{categoryName}</p>
              ))}
            </div>
          )}
          <button className="bg-blue-main text-white px-4 py-2 rounded-md text-sm mt-4 hover:shadow-md transition-all duration-300 ease-in-out"
                  onClick={() => navigate(`/profileDetail/${worksData.memberId}`)}>프로필 보기</button>
        </div>
       
        </div>
       
       

</div>
      </div>
      
      {showDeleteModal && (
        <AlertModal
          type="warning"
          title="게시물을 삭제하시겠습니까?"
          description="삭제 후 되돌릴 수 없습니다."
          TrueBtnText="삭제"
          FalseBtnText="취소"
          onClickTrue={handleDeleteConfirm}
          onClickFalse={handleDeleteCancel}
        />
      )}
      {showCompleteModal && (
        <AlertModal
          type="simple"
          title="게시물이 삭제되었습니다."
          TrueBtnText="확인"
          onClickTrue={handleCompleteConfirm}
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
       onClickFalse={() => setShowLoginModal(false)}
        />
      )}
      {errorModal && (
        <AlertModal
        type="simple"
        title="잘못된 접근"
        description={errorDescription}
        TrueBtnText="확인"
        onClickTrue={() => {
          if (errorAction === "redirect") {
              navigate("/feed");
          }else if(errorAction === "login"){
            localStorage.clear();
            navigate("/login");
          }else{
            window.location.reload();
          }
        }}
          />
      )}

    </>
  );
}
