import { useEffect, useState } from "react";
import { usePopularRecruit } from "../../hooks/usePopularRecruit";
import { getSecondCategoryNameById } from "../../utils/getCategoryById";
import { calculateDday } from "../../utils/getDate";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../../store/userStore";
import AlertModal from "../alertModal";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function MobileSwiper() {
  const [recruitData, setRecruitData] = useState([]);
  const navigate = useNavigate();
  const { memberId } = UserStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pageable = { page: 0, size: 12 };
  const { data, isLoading } = usePopularRecruit(pageable);

  
  useEffect(() => {
    setRecruitData(data?.result?.content || []);
  }, [data]);


  const handleClick = (recruitId) => {
    if (!memberId) {
      setShowLoginModal(true);
    } else {
      navigate(`/recruitDetails/${recruitId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-point"></div>
      </div>
    );
  }

  return (
    <div className="relative w-screen mt-4 lg:hidden">
      <Swiper
        slidesPerView={2} // 모바일 한 번에 1개 슬라이드
        spaceBetween={0}  // 슬라이드 간격
        // navigation, pagination 등 모바일에서는 뺄 거면 제외
        loop={true} // 무한루프 필요하면 활성화
        // speed={500} // 슬라이드 전환 속도(ms)
      >
        {recruitData.map((recruit) => (
          <SwiperSlide key={recruit.recruitId} className="box-border min-w-0">
            <div
              className="w-84 box-border h-64 px-6 cursor-pointer"
              onClick={() => handleClick(recruit?.recruitId)}>
              <div className="h-60 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                {/* 카드 내용 */}
                <div className="px-6 pt-6 pb-3">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                    {recruit.title}
                  </h3>
                </div>
                <div className="px-6 pb-4">
                  <span className="inline-block px-3 py-1 bg-yellow-point/10 text-yellow-point text-xs font-semibold rounded-full">
                    {getSecondCategoryNameById(recruit.secondCategory)}
                  </span>
                </div>
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {recruit.content}
                  </p>
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
