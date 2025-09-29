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

  const getCategoryName = (categoryId) => {
    const category = firstCategoryData.first_category.find(cat => cat.first_category_id === categoryId);
    return category ? category.name : `카테고리 ${categoryId}`;
  };

  useEffect(() => {
    console.log("Feed data from API:", data);
    console.log("Feed result:", data?.result);
    setFeedData(data?.result || []);
  }, [data]);

  useEffect(() => {
    console.log("Current feedData state:", feedData);
  }, [feedData]);

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
      <div className="relative mx-auto mt-4">
          

      <Swiper
        slidesPerView={2}
        spaceBetween={10}
        loop={feedData.length > 2}
        speed={700}
        autoplay={feedData.length > 2 ? {
          delay: 3000,
          disableOnInteraction: false,
        } : false}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 15,
            loop: feedData.length > 2,
            autoplay: feedData.length > 2 ? {
              delay: 3000,
              disableOnInteraction: false,
            } : false,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 0,
            loop: feedData.length > 3,
            autoplay: feedData.length > 3 ? {
              delay: 3000,
              disableOnInteraction: false,
            } : false,
          },
        }}
        modules={[Autoplay, Navigation]}
      >

        {feedData.map((feed) => (
          <SwiperSlide key={feed.feedId} className="">
                          <div
                className="w-full mb-2 px-2 cursor-pointer mx-auto"
                onClick={() => handleClick(feed?.feedId, feed?.memberId)}>
                <div className="h-full bg-white hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                {/* 피드 이미지 */}
                {feed.mediaResDto?.fileUrl && (
                  <div className="w-full bg-gray-100 overflow-hidden">
                    <img 
                      src={`${BUCKET_URL}${feed.mediaResDto.fileUrl}`} 
                      alt="피드 이미지"
                      className="w-full h-full object-cover aspect-[4/3]"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {/* 카드 내용 */}
                {/* <div className="px-2 lg:px-6 pt-4">
                  <span className="inline-block px-2 lg:px-3 py-1 bg-yellow-point/10 text-yellow-point text-sm lg:text-md font-semibold rounded-full">
                    {feed.firstCategories?.map(categoryId => getCategoryName(categoryId)).join(', ')}
                  </span>
                </div>
                <div className="px-2 lg:px-6 pb-3 text-right">
                  <h3 className="text-lg lg:text-xl lg:text-2xl font-bold text-gray-800 line-clamp-2">
                    {feed.nickname}
                  </h3>
                </div> */}
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