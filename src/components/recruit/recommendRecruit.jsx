import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPopularRecruit } from "../../api/recruit";
import soufMockup from "../../assets/images/soufMockup.png";
import Loading from "../loading";

export default function RecommendRecruit() {
  const [recruitData, setRecruitData] = useState([]);
  const [displayCount, setDisplayCount] = useState(4);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["popularRecruit"],
    queryFn: () => getPopularRecruit({ page: 0 }),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data?.result) {
      setRecruitData(data.result.slice(0, 4));
      // console.log(data.result);
    }
  }, [data]);

  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setDisplayCount(width <= 720 ? 3 : 4);
      }
    };

    checkWidth();

    window.addEventListener('resize', checkWidth);

    let resizeObserver;
    if (containerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(checkWidth);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkWidth);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 text-sm">인기 외주를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full" ref={containerRef}>
      {recruitData && recruitData.length > 0 ? (
        <>
          <h1 className="text-sm font-semibold mb-4">비슷한 외주를 찾아봤어요</h1>
          <div className="flex flex-col gap-2 bg-blue-50 rounded-md p-4 mb-4">
            <p className="text-blue-600 text-sm font-bold">스프에서 찾아봤어요! (AI 탐색)</p>
            <div className="flex gap-4 items-center justify-center">
              {recruitData.slice(0, displayCount).map((recruit) => (
                <img 
                  key={recruit.recruitId}
                  src={recruit.imageUrl? recruit.imageUrl : soufMockup} 
                  alt={recruit.title} 
                  className="max-w-40 h-40 rounded-md cursor-pointer hover:shadow-lg transition-shadow duration-200" 
                  onClick={() => navigate(`/recruitDetails/${recruit.recruitId}`)}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}