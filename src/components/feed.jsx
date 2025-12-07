import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { deleteFeed, getPopularFeed } from "../api/feed";
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
import BasicProfileImg from "../assets/images/BasicProfileImg1.png";
import DeclareButton from "./declare/declareButton";
import { FEED_ERRORS } from "../constants/post";


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

  const {memberId} = UserStore();
  const swiperRef = useRef(null);
  const maxLength = 100;
  const goToDetail = () => navigate(`/profileDetail/${feedData?.memberId}/post/${feedData?.feedId}`);
  const [pageable, setPageable] = useState({
    page: 1,
    size: 10,
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-point"></div>
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
  }, []);
  
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
  return (
    <div
      key={feedData?.memberId}
      className="flex flex-col justify-center rounded-2xl border border-gray-200 p-6 w-full shadow-sm relative"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 
          className="text-base lg:text-xl font-semibold leading-snug text-black cursor-pointer hover:text-yellow-point transition-colors mr-2"
          onClick={() => navigate(`/profileDetail/${feedData?.memberId}/post/${feedData?.feedId}`)}
        >
          {feedData?.topic || "제목 없음"}
        </h2>
        <p className="text-xs lg:text-sm text-gray-500">
          {getFormattedDate(feedData.lastModifiedTime)}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div className="w-full max-w-[500px] flex justify-start items-center mb-2 gap-2 cursor-pointer"
          onClick={() => clickHandler(feedData?.memberId)}>
          <img
            src={feedData?.profileImageUrl ? `${feedData?.profileImageUrl}` : BasicProfileImg}
            alt={feedData?.topic || "이미지"}
            className="w-[40px] h-[40px] object-cover rounded-[50%]"
          />
          <h2 className="text-base lg:text-xl font-semibold leading-snug text-black"
          onClick={() => navigate(`/profileDetail/${feedData?.memberId}`)}>
            {feedData?.nickname || "학생" }
          </h2>
        </div>
        <div className="flex items-center gap-2">
        
          <UpdateOption id={feedData.memberId} memberId={memberId}
            worksData={worksData} mediaData={mediaData} onDelete={handleDeleteClick}/>
        </div>
      </div>
      <div 
        className="flex justify-center w-full overflow-hidden rounded-md mb-4 relative"
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
                          className="w-full h-auto max-h-[500px] object-cover rounded-lg cursor-pointer"
                          onClick={goToDetail}
                        />
                      ) : (
                        <img
                          src={`${BUCKET_URL}${data.fileUrl}`}
                          alt={data.fileName}
                          className="w-full h-auto max-h-[500px] object-cover rounded-lg aspect-[3/4] cursor-pointer"
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
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); swiperRef.current?.slideNext(); }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <p className="whitespace-pre-wrap text-gray-800 leading-relaxed mb-4 cursor-pointer"
       onClick={() => navigate(`/profileDetail/${feedData?.memberId}/post/${feedData?.feedId}`)}>
        {handlerFeedContent(maxLength,feedData?.content) || "내용 없음"}
        <span
          onClick={toggleExpand}
          className="ml-2 text-gray-500 cursor-pointer font-light text-sm"
        >
          {feedData?.content.length <= maxLength ? "" : isExpanded ? "접기" : "더보기"}
        </span>
        
      </p>
      <DeclareButton 
        postType="FEED"
        postId={feedData?.feedId}
        title={feedData?.topic || "제목 없음"}
        reporterId={memberId}
        reportedMemberId={feedData?.memberId}
        onDeclare={handleDeclareClick} 
      />
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
      {/* {showLoginModal && (
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
      )} */}
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
    </div>
  );
}