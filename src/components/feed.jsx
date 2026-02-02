import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { deleteFeed, getPopularFeed, getFeedDetail } from "../api/feed";
import { getFeed } from "../api/feed";
import { getFormattedDate } from "../utils/getDate";
import UpdateOption from "./updateOption";
import { Swiper,SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { UserStore } from "../store/userStore";
import AlertModal from "./alertModal";
import basiclogoimg from "../assets/images/basiclogoimg.png";
import { FEED_ERRORS } from "../constants/post";
import heartOn from "../assets/images/heartOn.svg";
import heartOff from "../assets/images/heartOff.svg";
import { patchLike } from "../api/additionalFeed";


const BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;


export default function Feed({ feedData, onFeedClick }) {
  const navigate = useNavigate();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [worksData, setWorksData] = useState([]);
  const [mediaData, setMediaData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorDescription, setErrorDescription] = useState("잘못된 접근");
  const [errorAction, setErrorAction] = useState("redirect");
  const [isLiked, setIsLiked] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const [isHeartDisabled, setIsHeartDisabled] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const {memberId} = UserStore();
  const swiperRef = useRef(null);
  const maxLength = 30;
  const goToDetail = () => navigate(`/profileDetail/${feedData?.memberId}/post/${feedData?.feedId}`);
  const [pageable, setPageable] = useState({
    page: 1,
    size: 10,
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-main"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  useEffect(() => {
     setWorksData(feedData);
     setMediaData(feedData?.mediaResDtos);
     setIsLiked(feedData?.liked || false);
     setLikedCount(feedData?.likedCount || 0);
  }, [feedData]);
  
  const clickHandler = (profileId) => {
    if (onFeedClick) {
      onFeedClick(null, profileId);
    } else {
    navigate(`/profileDetail/${profileId}`);
    }
  };

  //삭제하기
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
      try {
        await deleteFeed(Number(feedData?.feedId));
        setShowDeleteModal(false);
        setShowCompleteModal(true);
      } catch (err) {
        console.log("실패함" , err);
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


    // 더보기쪽 함수
    const handlerFeedContent = (length, data) => {
      if(isExpanded){
        return data;
      }
      if(data.length > length){
        return data.slice(0, length) + "...";
      }
      return data;
    }

     const toggleExpand = () => setIsExpanded((prev) => !prev);
          const handleDeclareClick = (declareData) => {
       console.log('신고 데이터:', declareData);
     }

  const handleHeartClick = async () => {
    setIsHeartDisabled(true); 
    setIsHeartAnimating(true);
    
    try {
      const currentMemberId = UserStore.getState().memberId;
      const requestBody = {
        memberId: currentMemberId,
        isLiked: !isLiked // 현재 상태의 반대값을 전송
      };
      
      await patchLike(feedData?.feedId, requestBody);

      const updatedData = await getFeedDetail(feedData?.memberId, feedData?.feedId);
      setWorksData(updatedData.result);
      setIsLiked(updatedData.result.liked);
      setLikedCount(updatedData.result.likedCount || 0);
      setMediaData(updatedData.result.mediaResDtos);
     
    } catch (error) {
      console.error("피드 관련 에러:", error);
      const errorKey = error?.response?.data?.errorKey;
      if (error.response?.status === 401 || error.response?.status === 403) {
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
  return (
    <div
      key={feedData?.memberId}
      className="flex flex-col justify-start rounded-md border border-gray-200 w-full shadow-sm relative"
    >
      
       <div className="flex justify-between items-center mx-2 pt-1">
        <div className="w-full flex justify-between items-center gap-2 cursor-pointer"
          onClick={() => clickHandler(feedData?.memberId)}>
            <div className="flex items-center gap-2"> 
            <img
            src={feedData?.profileImageUrl ? `${feedData?.profileImageUrl}` : basiclogoimg}
            alt={feedData?.topic || "이미지"}
            className="w-6 h-6 object-cover rounded-[50%]"
          />
          <h2 className="text-sm font-medium leading-snug text-black"
          onClick={() => navigate(`/profileDetail/${feedData?.memberId}`)}>
            {feedData?.nickname || "학생" }
          </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleHeartClick();
                }}
                disabled={isHeartDisabled}
                className={`transition-all duration-200 ${
                  isHeartAnimating ? 'scale-125' : 'scale-100'
                } ${isHeartDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
              >
                <img 
                  src={isLiked ? heartOn : heartOff} 
                  alt={isLiked ? "heartOn" : "heartOff"} 
                  className="w-4 h-4" 
                />
              </button>
              <span className="text-xs text-gray-600">{likedCount}</span>
            </div>
        </div>

        <div className="flex items-center gap-2">
        
          <UpdateOption id={feedData.memberId} memberId={memberId}
            worksData={worksData} mediaData={mediaData} onDelete={handleDeleteClick}/>
        </div>
      </div>
      <div className="flex flex-col justify-start mx-2 mb-1">
        <h2 
          className="text-base lg:text-lg font-semibold leading-snug text-black cursor-pointer hover:text-blue-main transition-colors mr-2 overflow-hidden text-ellipsis whitespace-nowrap"
          onClick={() => navigate(`/profileDetail/${feedData?.memberId}/post/${feedData?.feedId}`)}
        >
          {feedData?.topic || "제목 없음"}
        </h2>
        <div 
        className="flex justify-center w-full overflow-hidden rounded-md mb-2 relative"
      >
        {feedData?.mediaResDtos && feedData.mediaResDtos.length > 0 ? (
          <>
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              pagination={{
                dynamicBullets: true,
              }}
              modules={[Pagination]}
              className="rounded-lg w-full max-w-[800px]"
            >
              {feedData?.mediaResDtos?.map((data, i) => {
                const isVideo = data.fileType?.toLowerCase().startsWith("video") || data.fileUrl?.toLowerCase().endsWith(".mp4");
                return (
                  <SwiperSlide key={i}>
                    <div className="flex justify-center items-center">
                      {isVideo ? (
                        <video
                          src={`${BUCKET_URL}${data.fileUrl}`}
                          controls
                          className="w-full h-auto max-h-[500px] object-cover cursor-pointer"
                          onClick={goToDetail}
                        />
                      ) : (
                        <img
                          src={`${BUCKET_URL}${data.fileUrl}`}
                          alt={data.fileName}
                          className="w-full h-auto max-h-[500px] object-cover aspect-[1/1] cursor-pointer"
                          onClick={goToDetail}
                        />
                      )}
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
            {/* 화살표 버튼 */}
            {feedData?.mediaResDtos && feedData.mediaResDtos.length > 1 && (
              <div className="hidden lg:block">
                <button 
                  onClick={(e) => { e.stopPropagation(); swiperRef.current?.slidePrev(); }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-5 h-5 bg-white/80 rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-3 h-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); swiperRef.current?.slideNext(); }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-5 h-5 bg-white/80 rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-3 h-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-400">이미지가 없습니다</p>
          </div>
        )}
      </div>
      </div>
     
      
      <p className="whitespace-pre-wrap break-words text-gray-800 leading-relaxed mx-2 cursor-pointer overflow-hidden"
       onClick={() => navigate(`/profileDetail/${feedData?.memberId}/post/${feedData?.feedId}`)}>
        {handlerFeedContent(maxLength,feedData?.content) || "내용 없음"}
        <span
          onClick={toggleExpand}
          className="ml-2 text-gray-500 cursor-pointer font-light text-sm"
        >
          {feedData?.content.length <= maxLength ? "" : isExpanded ? "접기" : "더보기"}
        </span>
      
      </p>
      <p className="text-xs lg:text-sm text-gray-500 mt-auto p-2">
          {getFormattedDate(feedData.lastModifiedTime)}
        </p>
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
          title="로그인 후 이용해주세요"
          description="SouF 회원만 피드를 좋아요할 수 있습니다"
          TrueBtnText="확인"
          onClickTrue={() => {
            setShowLoginModal(false);
            navigate("/login");
          }}
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
              navigate("/studentFeedList");
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
  );
}