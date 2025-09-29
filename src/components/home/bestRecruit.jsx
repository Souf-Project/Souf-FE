import { useEffect, useState } from "react";
import { usePopularRecruit } from "../../hooks/usePopularRecruit";
import { getSecondCategoryNameById } from "../../utils/getCategoryById";
import { calculateDday } from "../../utils/getDate";
import { useNavigate } from "react-router-dom";

export default function BestRecruit() {
  const [recruitData, setRecruitData] = useState([]);
  const navigate = useNavigate();
  const pageable = { page: 0, size: 5};

  const { data, isLoading } = usePopularRecruit(pageable);
  console.log(data.result)
  useEffect(() => {
    setRecruitData(data?.result || []);
  }, [data]);


  const handleClick = (recruitId) => {
    navigate(`/recruitDetails/${recruitId}`);
  };

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-point"></div>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <div className="grid grid-cols-1 gap-2">
        {recruitData.map((recruit) => (
          <div
            key={recruit.recruitId}
            className="w-full h-28 cursor-pointer"
            onClick={() => handleClick(recruit?.recruitId)}
          >
            <div className="h-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 p-4">
              {/* 카드 내용 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-NanumGothicCoding text-blue-500 text-md font-normal bg-stone-50 rounded-[30px] px-2 text-center">
                      {calculateDday(recruit?.deadLine, recruit?.recruitable)}
                  </span>
                  <span className="text-neutral-500 text-sm font-medium">
                    {getSecondCategoryNameById(recruit.secondCategory)}
                  </span>
                </div>
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-1">
                    {recruit.title}
                  </h3>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-neutral-500 text-sm font-semibold">
                    {recruit.nickname}
                  </p>
                  <p className="text-neutral-500 text-sm font-semibold">{recruit.maxPayment}</p>
                  </div>
                </div>
                
             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}