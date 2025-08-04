import { useNavigate, useParams } from "react-router-dom";
import backArrow from "../../assets/images/backArrow.svg";
import { deleteFeed, getFeedDetail } from "../../api/feed";
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
import BasicProfileImg1 from "../../assets/images/BasicProfileImg1.png";
import Loading from "../loading";
import SEO from "../seo";

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

    const {
    data: feedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feedDetail"],
    queryFn: async () => {
      const data = await getFeedDetail(id,worksId);
      
      console.log("피드 디테일응답:", data.result);

      data.result.mediaResDtos?.forEach((media, index) => {
        console.log(`미디어 ${index + 1}:`, {
          fileUrl: media.fileUrl,
          fileName: media.fileName,
          fileType: media.fileType,
          isVideo: media.fileType?.toLowerCase() === "mp4" || media.fileUrl?.toLowerCase().endsWith(".mp4")
        });
      });
    
      setWorksData(data.result);
      setMediaData(data.result.mediaResDtos);
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

  if (isLoading) {
    return <Loading text="게시글을 불러오는 중..." />;
  }

  return (
    <>
    <SEO  title={worksData.topic} description={`스프 SouF - ${worksData.topic} 피드`} subTitle='스프'
    content={worksData.content} />
    <div className="flex flex-col py-16 px-4 max-w-4xl w-full mx-auto">
      <div className="flex justify-between">
      <button
        className="flex items-center text-gray-600 mb-4 hover:text-black transition-colors"
        onClick={handleGoBack}
      >
        <img src={backArrow} alt="뒤로가기" className="w-6 h-6 mr-1" />
        <span>뒤로가기</span>
      </button>

      <p className="text-sm text-gray-500 pr-6">
              누적 조회 수 {worksData.view}회
            </p>
            </div>


      <div className="flex flex-col rounded-2xl border border-gray-200 p-6 w-full shadow-sm">
        
        
        <div className="flex w-full">
         <div className="flex w-[65%] h-full relative">
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
          
          <div className="w-full max-w-[35%] pl-6 relative ">
            {/* 사용자 프로필 정보 */}
        <div className="flex items-center justify-between mb-4 w-full">
          {/* 프로필 사진과 닉네임 (왼쪽) */}
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate(`/profileDetail/${id}`)}
          >
            {worksData.profileImageUrl ? (
              <img
                src={worksData.profileImageUrl}
                alt="프로필 이미지"
                className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200"
                onError={(e) => {
                  e.target.src = BasicProfileImg1;
                }}
              />
            ) : showProfileSkeleton ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 animate-pulse"></div>
            ) : (
              <img
                src={BasicProfileImg1}
                alt="기본 프로필 이미지"
                className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200"
              />
            )}
            <div className="flex flex-col">
              {worksData.nickname ? (
                <>
                  <span className="font-semibold text-md text-gray-800">{worksData.nickname}</span>
                  <span className="text-sm text-gray-500">{worksData.categoryName}</span>
                </>
              ) : (
                <>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-1 w-24"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                </>
              )}
            </div>
          </div>
          
          {/* 수정 버튼 (오른쪽) - 본인일 경우에만 */}
          {Number(id) === memberId && (
            <div ref={optionsRef}>
              <button
                onClick={() => setShowOptions((prev) => !prev)}
                className="text-xl px-2 py-1 rounded hover:bg-gray-100"
              >
                ⋯
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-lg z-10">
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
            
            
          <div className="flex flex-col justify-end items-start mb-4 h-[90%] w-full ">
            <div className="w-full h-full flex justify-between flex-col">
              <div className="w-full">
              <div className="w-full text-xl font-semibold leading-snug text-black py-3 ">
              {worksData.topic}
              </div>
              <div className="w-full text-sm text-gray-600 border-t border-gray-300">
                <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-md">
                {worksData.content}
                </p>
              </div>
              </div>
              <p className="text-right">{getFormattedDate(worksData.lastModifiedTime)}</p>
            </div>
            
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
    </div>
  </>
  );
}