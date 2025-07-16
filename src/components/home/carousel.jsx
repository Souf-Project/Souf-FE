import { useEffect, useState } from "react";
import { usePopularRecruit } from "../../hooks/usePopularRecruit";
import { getFirstCategoryId, getSecondCategoryNameById } from "../../utils/getCategoryById";
import { calculateDday } from "../../utils/getDate";
import { useNavigate } from "react-router-dom";

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recruitData, setRecruitData] = useState([]);
  const navigate = useNavigate();

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

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-point"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 메인 캐러셀 컨테이너 */}
      <div className="h-64 relative overflow-hidden rounded-2xl from-gray-50 to-gray-100">
      <div
          className="flex transition-transform duration-700 ease-out h-full px-10"
        style={{
          transform: `translateX(-${(100 / visibleCount) * currentIndex}%)`,
        }}
      >
          {recruitData?.map((recruit, index) => (
          <div
            key={recruit.recruitId}
              className="md:w-1/3 w-32 h-60 px-3 flex-shrink-0 box-border"
            onClick={() => navigate(`/recruitDetails/${recruit?.recruitId}`)}
          >
              <div className="h-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100">
                

                {/* 제목 */}
                <div className="px-6 pt-6 pb-3">
                  <h3 className="text-2xl font-bold text-gray-800 line-clamp-2 transition-colors duration-200">
                    {recruit.title}
                  </h3>
                </div>
                               {/* 카테고리 태그 */}
                <div className="px-6 pb-4">
                  <span className="inline-block px-3 py-1 bg-yellow-point/10 text-yellow-point text-xs font-semibold rounded-full">
                    {getSecondCategoryNameById(recruit.secondCategory)}
                  </span>
                </div>

                {/* 내용 */}
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {recruit.content}
                  </p>
                </div>

                {/* 하단 정보 */}
                <div className="mt-4 px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-red-500">
                        {calculateDday(recruit?.deadLine, recruit?.recruitable)}
                      </span>
              </div>
                    <div className="text-xs text-gray-400 transition-colors duration-200">
                      자세히 보기 →
                    </div>
                  </div>
                </div>

               
            </div>
          </div>
        ))}
      </div>

        {/* 네비게이션 버튼 */}
      <button
        onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        disabled={currentIndex === 0}
      >
          <svg className="w-5 h-5 text-gray-600 group-hover:text-yellow-point transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
      </button>

      <button
        onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        disabled={currentIndex >= totalCount - visibleCount}
      >
          <svg className="w-5 h-5 text-gray-600 group-hover:text-yellow-point transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
      </button>
      </div>

    </div>
  );
}
