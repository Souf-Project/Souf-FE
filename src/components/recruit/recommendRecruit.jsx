import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPopularRecruit } from "../../api/recruit";
import Loading from "../loading";

export default function RecommendRecruit() {
  const [recruitData, setRecruitData] = useState([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["popularRecruit"],
    queryFn: () => getPopularRecruit({ page: 0 }),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data?.result) {
      // 5개 중 4개만 사용
      setRecruitData(data.result.slice(0, 4));
      console.log(data.result);
    }
  }, [data]);

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
    <div className="w-full mb-20">
      {recruitData && recruitData.length > 0 ? (
        <>
          <h1 className="text-sm font-semibold mb-4">비슷한 외주를 찾아봤어요</h1>
          <div className="flex flex-col gap-2 bg-blue-50 rounded-md p-4 mb-4">
            <p className="text-blue-600 text-sm font-bold">스프에서 찾아봤어요! (AI 탐색)</p>
            <div className="flex gap-2">
              {recruitData.map((recruit) => (
                <img 
                  key={recruit.recruitId}
                  src={recruit.imageUrl} 
                  alt={recruit.title} 
                  className="w-40 h-40 rounded-md" 
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}