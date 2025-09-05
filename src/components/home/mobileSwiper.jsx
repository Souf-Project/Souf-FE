import { useEffect, useState } from "react";
import { usePopularRecruit } from "../../hooks/usePopularRecruit";
import { getSecondCategoryNameById } from "../../utils/getCategoryById";
import { calculateDday } from "../../utils/getDate";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../../store/userStore";
import { getRecruitDetail } from "../../api/recruit";

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

export default function MobileSwiper() {
  const [recruitData, setRecruitData] = useState([]);
  const navigate = useNavigate();
  const { memberId } = UserStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pageable = { page: 0, size: 12, sort: ["createdAt,desc"] };

  const { data, isLoading } = usePopularRecruit(pageable);
  // console.log(data)
  useEffect(() => {
    setRecruitData(data?.result || []);
  }, [data]);

  const parsePayment = (paymentString) => {
    if (!paymentString || typeof paymentString !== 'string') return 0;
    let numStr = paymentString.replace(/[^0-9.]/g, '');
    let num = parseFloat(numStr);
    if (paymentString.includes('만')) {
      num *= 10000;
    }
    return isNaN(num) ? 0 : num;
  };

  const handleClick = async (recruitId) => {
      try {
        const selectedRecruit = recruitData.find(recruit => recruit.recruitId === recruitId);
        const minPrice = parsePayment(selectedRecruit?.minPayment);
        const maxPrice = parsePayment(selectedRecruit?.maxPayment);
        
        const response = await getRecruitDetail(recruitId);
        console.log('Recruit detail response:', response);
        
        const recruitDetail = response.data.result;
        
        navigate(`/recruitDetails/${recruitId}`, {
          state: {
            title: selectedRecruit?.title,
            content: selectedRecruit?.content,
            cityName: selectedRecruit?.cityName,
            cityDetailName: selectedRecruit?.cityDetailName,
            minPrice,
            maxPrice,
            deadline: selectedRecruit?.deadLine,
            location: selectedRecruit?.cityName,
            preferMajor: false, 
            id: recruitId,
            recruitDetail,
            categoryDtoList: selectedRecruit?.categoryDtoList,
          }
        });
      } catch (error) {
        console.error('Error fetching recruit detail:', error);
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
      <div className="relative  w-screen lg:px-24  mt-4">
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
        slidesPerView={2}
        spaceBetween={0}
        loop={recruitData.length > 2}
        speed={700}
        autoplay={recruitData.length > 2 ? {
          delay:4000,
          disableOnInteraction: false,
        } : false}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        modules={[Autoplay, Navigation]}
      >
        {recruitData.map((recruit) => (
          <SwiperSlide key={recruit.recruitId} className="box-border min-w-0 ">
            <div
              className="w-84 box-border h-64 mb-4 px-6 cursor-pointer"
              onClick={() => handleClick(recruit?.recruitId)}>
              <div className="h-64 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                {/* 카드 내용 */}
                <div className="px-6 pt-6 pb-3">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-800 line-clamp-2">
                    {recruit.title}
                  </h3>
                </div>
                <div className="hidden lg:block px-6 pb-4">
                  <span className="inline-block px-3 py-1 bg-yellow-point text-white text-md font-semibold rounded-full">
                    {getSecondCategoryNameById(recruit.secondCategory)}
                  </span>
                </div>
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 line-clamp-5 lg:line-clamp-3 leading-relaxed">
                    {recruit.content}
                  </p>
                </div>
                <div className="mt-4 px-6 hidden lg:block pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-red-500">
                      {calculateDday(recruit?.deadLine, recruit?.recruitable)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">자세히 보기 →</div>
                </div>
              </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
    </>
  );
}