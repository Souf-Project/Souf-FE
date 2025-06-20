import { useEffect, useState } from "react";
import { usePopularRecruit } from "../../hooks/usePopularRecruit";
import { getFirstCategoryId } from "../../utils/getCategoryById";
import { calculateDday } from "../../utils/getDate";

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recruitData, setRecruitData] = useState([]);

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
    return <div>로딩중</div>;
  }
  return (
    <div className="h-40 relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out w-full "
        style={{
          transform: `translateX(-${(100 / visibleCount) * currentIndex}%)`,
        }}
      >
        {recruitData?.map((recruit) => (
          <div
            key={recruit.recruitId}
            className="w-1/3 h-40 px-1 flex-shrink-0 box-border"
          >
            <div
              className="h-full bg-white p-6 rounded-xl border border-gray-200 hover:border-yellow-point transition-colors duration-200 cursor-pointer"
              onClick={() => navigate(`/recruitDetails/${recruit.recruitId}`)}
            >
              <h3 className="text-xl font-bold">{recruit.title}</h3>
              <p className="text-gray-500 mb-2">
                {getFirstCategoryId(recruit.firstCategory)}
              </p>
              <p className="mb-4 text-md">{recruit.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{calculateDday(recruit.deadLine)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 mr-6"
        disabled={currentIndex === 0}
      >
        ◀
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2"
        disabled={currentIndex >= totalCount - visibleCount}
      >
        ▶
      </button>
    </div>
  );
}
