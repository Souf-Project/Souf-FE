import { useEffect, useState } from "react";
import { usePopularRecruit } from "../../hooks/usePopularRecruit";
import { getFirstCategoryId, getSecondCategoryNameById } from "../../utils/getCategoryById";
import { calculateDday } from "../../utils/getDate";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../../store/userStore";
import AlertModal from "../alertModal";

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recruitData, setRecruitData] = useState([]);
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { memberId } = UserStore();

  const visibleCount = 3;
  const totalCount = 6;

  const pageable = {
    page: 0,
    size: 12,
  };

  const { data, isLoading } = usePopularRecruit(pageable);
  useEffect(() => {
    setRecruitData(data?.result?.content);
    console.log(recruitData);
  }, [data]);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < recruitData ? recruitData.length : 100 - visibleCount)
      setCurrentIndex(currentIndex + 1);
  };

  const handleClick = (recruitId) => {
    if (!memberId) {
      setShowLoginModal(true);
    } else {
      navigate(`/recruitDetails/${recruit?.recruitId}`);
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
    <div className="relative w-full px-4 lg:px-24 mt-4">
  <div className="flex items-center justify-between w-full relative">
    
    {/* 왼쪽 버튼 */}
    <button
      onClick={handlePrev}
      className="w-10 h-10 mr-2 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
      disabled={currentIndex === 0}
    >
      <svg className="w-5 h-5 text-gray-600 group-hover:text-yellow-point" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    {/* 캐러셀 내용 */}
    <div className="flex-1 overflow-hidden px-4 ">
      <div
        className="flex transition-transform duration-700 ease-out h-full"
        style={{
          transform: `translateX(-${(100 / visibleCount) * currentIndex}%)`,
        }}
      >
        {recruitData?.map((recruit) => (
          <div
            key={recruit.recruitId}
            className="lg:w-1/3 w-1/2  px-3 flex-shrink-0 box-border h-full"
            onClick={() => handleClick(recruit?.recruitId)}
          >
            <div className="h-full min-h-60 glass rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100">
              {/* 카드 내용 */}
              <div className="px-6 pt-6 pb-3">
                <h3 className="text-2xl font-bold text-gray-800 line-clamp-2">{recruit.title}</h3>
              </div>
              <div className="px-6 pb-4">
                <span className="inline-block px-3 py-1 bg-yellow-point/10 text-yellow-point text-xs font-semibold rounded-full">
                  {getSecondCategoryNameById(recruit.secondCategory)}
                </span>
              </div>
              <div className="px-6 pb-4">
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{recruit.content}</p>
              </div>
              <div className="mt-4 px-6 hidden lg:block">
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
        ))}
      </div>
    </div>

    {/* 오른쪽 버튼 */}
    <button
      onClick={handleNext}
      className="w-10 h-10 ml-2 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
      disabled={currentIndex >= totalCount - visibleCount}
    >
      <svg className="w-5 h-5 text-gray-600 group-hover:text-yellow-point" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
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