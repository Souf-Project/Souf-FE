import { useEffect, useState } from "react";
import { usePopularRecruit } from "../../hooks/usePopularRecruit";
import { getSecondCategoryNameById } from "../../utils/getCategoryById";
import { calculateDday } from "../../utils/getDate";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../../store/userStore";
import AlertModal from "../alertModal";
import { getRecruitDetail } from "../../api/recruit";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

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
    if (!memberId) {
      setShowLoginModal(true);
    } else {
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
        
        // 403 에러인 경우 로그인 모달 표시
        if (error.response?.status === 403) {
          setShowLoginModal(true);
        }
      }
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
    <div className="relative w-screen mt-4 lg:px-24">
      <Swiper
        slidesPerView={2}
        spaceBetween={0}
        loop={true}
        speed={700}
        autoplay={{
          delay:1000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
      >
        {recruitData?.map((recruit) => (
          <SwiperSlide key={recruit.recruitId} className="box-border min-w-0">
            <div
              className="w-84 box-border h-80 px-6 cursor-pointer"
              onClick={() => handleClick(recruit?.recruitId)}>
              <div className="h-64 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                {/* 카드 내용 */}
                <div className="px-6 pt-6 pb-3">
                  <h3 className="text-2xl font-bold text-gray-800 line-clamp-2">
                    {recruit.title}
                  </h3>
                </div>
                <div className="px-6 pb-4">
                  <span className="inline-block px-3 py-1 bg-yellow-point/10 text-yellow-point text-md font-semibold rounded-full">
                    {getSecondCategoryNameById(recruit.secondCategory)}
                  </span>
                </div>
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
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
