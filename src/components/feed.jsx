import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteFeed, getPopularFeed } from "../api/feed";
import { getFeed } from "../api/feed";
import { getFormattedDate } from "../utils/getDate";
import UpdateOption from "./updateOption";
import { Swiper,SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { UserStore } from "../store/userStore";
import AlertModal from "./alertModal";
import BasicProfileImg from "../assets/images/BasicProfileImg1.png";

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
  const {memberId} = UserStore();
  const maxLength = 100;
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
    console.log("피드데이터");
    console.log(feedData);
     setWorksData(feedData);
     setMediaData(feedData?.mediaResDtos);
  }, []);
  
  const clickHandler = (profileId) => {
    if (onFeedClick) {
      // onFeedClick이 전달된 경우 부모 컴포넌트에서 로그인 체크 처리
      onFeedClick(null, profileId);
    } else {
      // 기존 로직 (직접 네비게이션)
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
        console.log("실패함");
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
  return (
    <div
      key={feedData?.memberId}
      className="flex flex-col justify-center rounded-2xl border border-gray-200 p-6 w-full max-w-[600px] shadow-sm mb-6 relative"
    >
      <UpdateOption id={feedData.memberId} memberId={memberId}
      worksData={worksData} mediaData={mediaData} onDelete={handleDeleteClick}/>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold leading-snug text-black">
          {feedData?.topic || "제목 없음"}
        </h2>
        <p className="text-sm text-gray-500">
          {getFormattedDate(feedData.lastModifiedTime)}
        </p>
      </div>

      <div className="w-full max-w-[500px] flex justify-start items-center mb-2 gap-2 cursor-pointer"
      onClick={() => clickHandler(feedData?.memberId)}>
         <img
            src={feedData?.profileImageUrl ? `${feedData?.profileImageUrl}` : BasicProfileImg}
            alt={feedData?.topic || "이미지"}
            className="w-[40px] h-[40px] object-cover rounded-[50%]"
          />
        <h2 className="text-xl font-semibold leading-snug text-black">
          {feedData?.nickname || "학생" }
        </h2>
      </div>

    <div className="flex justify-center w-full overflow-hidden rounded-md mb-4">
      {feedData?.mediaResDtos && feedData.mediaResDtos.length > 0 ? (
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination]}
          className="rounded-lg w-full max-w-[800px]"
        >
          {feedData?.mediaResDtos?.map((data, i) => {
            const isVideo = data.fileType?.toLowerCase() === "mp4" || data.fileUrl?.toLowerCase().endsWith(".mp4");
            return (
            <SwiperSlide key={i}>
              <div className="flex justify-center items-center h-[400px]">
                {isVideo ? (
                  <video
                  src={`${BUCKET_URL}${data.fileUrl}`}
                  controls
                  className="w-full h-auto max-h-[500px] object-cover rounded-lg"
                  />
                ) : (
                  <img
                src={`${BUCKET_URL}${data.fileUrl}`}
                alt={data.fileName}
                className="w-full h-auto max-h-[500px] object-cover rounded-lg"
                />
                )}
                
              </div>
            </SwiperSlide>
            )
          })}
        </Swiper>
         ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400">이미지가 없습니다</p>
        </div>
      )}
    </div>

      <p className="whitespace-pre-wrap text-gray-800 leading-relaxed mb-4">
        {handlerFeedContent(maxLength,feedData?.content) || "내용 없음"}
        <span
          onClick={toggleExpand}
          className="ml-2 text-gray-500 cursor-pointer font-light text-sm"
        >
          {feedData?.content.length <= maxLength ? "" : isExpanded ? "접기" : "더보기"}
        </span>
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