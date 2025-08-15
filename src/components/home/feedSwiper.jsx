import { useEffect, useState } from "react";
import { usePopularFeed } from "../../hooks/usePopularFeed";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../../store/userStore";
import AlertModal from "../alertModal";
import firstCategoryData from "../../assets/categoryIndex/first_category.json";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Swiper 기본 navigation 스타일 오버라이드
const swiperStyles = `
  .swiper-button-prev,
  .swiper-button-next {
    display: none !important;
  }
`;

export default function FeedSwiper() {
  const [feedData, setFeedData] = useState([]);
  const navigate = useNavigate();
  const { memberId } = UserStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pageable = { page: 0, size: 12, sort: ["createdAt,desc"] };

  const { data, isLoading, error } = usePopularFeed(pageable);

  const BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

  // 카테고리 ID를 이름으로 변환하는 함수
  const getCategoryName = (categoryId) => {
    const category = firstCategoryData.first_category.find(cat => cat.first_category_id === categoryId);
    return category ? category.name : `카테고리 ${categoryId}`;
  };

  useEffect(() => {
    setFeedData(data?.result || []);
  }, [data]);

  // 에러 로그 추가
  useEffect(() => {
    if (error) {
      console.error("Feed API error:", error);
    }
  }, [error]);

  const handleClick = (feedId, memberId) => {
    if (!memberId) {
      setShowLoginModal(true);
    } else {
      navigate(`/profileDetail/${memberId}/post/${feedId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-point"></div>
      </div>
    );
  }

  return (
    <>
      <style>{swiperStyles}</style>
      <div className="relative w-screen lg:px-24 mx-auto mt-4">
            {/* 이전 버튼 */}
      <button className="custom-prev absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform duration-200">
        <svg className="w-12 h-12 text-yellow-point" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* 다음 버튼 */}
      <button className="custom-next absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform duration-200">
        <svg className="w-12 h-12 text-yellow-point" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <Swiper
        slidesPerView={4}
        spaceBetween={16}
        loop={feedData.length > 4}
        speed={700}
        autoplay={feedData.length > 4 ? {
          delay: 4000,
          disableOnInteraction: false,
        } : false}
        breakpoints={{
          640: {
            slidesPerView: 4,
            spaceBetween: 20,
            loop: feedData.length > 4,
            autoplay: feedData.length > 4 ? {
              delay: 4000,
              disableOnInteraction: false,
            } : false,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 24,
            loop: feedData.length > 4,
            autoplay: feedData.length > 4 ? {
              delay: 4000,
              disableOnInteraction: false,
            } : false,
          },
        }}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        modules={[Autoplay, Navigation]}
      >
       
        {feedData.map((feed) => (
          <SwiperSlide key={feed.feedId} className="box-border min-w-0">
            <div
              className="w-full max-w-[calc(100vw/4-2rem)] box-border h-full mb-2 cursor-pointer mx-auto"
              onClick={() => handleClick(feed?.feedId, feed?.memberId)}>
              <div className="h-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                {/* 피드 이미지 */}
                {feed.mediaResDto?.fileUrl && (
                  <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img 
                      src={`${BUCKET_URL}${feed.mediaResDto.fileUrl}`} 
                      alt="피드 이미지"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {/* 카드 내용 */}
                <div className="px-3 pt-4 pb-3 flex flex-col justify-between h-full">
                  <div>
                    <span className="inline-block px-2 py-1 bg-yellow-point/10 text-yellow-point text-sm font-semibold rounded-full">
                      {feed.firstCategories?.map(categoryId => getCategoryName(categoryId)).join(', ')}
                    </span>
                  </div>
                  <div className="text-right mt-auto">
                    <h3 className="text-base font-bold text-gray-800 line-clamp-2">
                      {feed.nickname}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
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