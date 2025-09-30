import { useState } from "react";
import Profile from "../components/studentProfile/profile";
import Pagination from "../components/pagination";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/profile";
import Loading from "../components/loading";

export default function StudentProfileList({ firstCategoryId, secondCategoryId }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  const pageable = {
    page: currentPage,
    size: pageSize,
  };

  const {
    data: feedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", firstCategoryId, secondCategoryId, currentPage],
    queryFn: async () => {
      const data = await getProfile(firstCategoryId, secondCategoryId, pageable);
      setTotalPages(data.result.page.totalPages);
      // console.log("data", data);
      return data;
    },
    keepPreviousData: true,
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const userData = feedData?.result?.content || [];
  // console.log("userData", userData);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-80">
      {userData && userData.length > 0 ? (
        <>
          <div className="w-full flex flex-col items-center justify-center gap-4 mt-4">
            {userData.map((data) => (
              <Profile
                key={data.id}
                memberId={data.memberId}
                profileImageUrl={data.profileImageUrl}
                temperature={data.temperature}
                userName={data.nickname}
                userDetail={data.userDetail}
                popularFeeds={data.popularFeeds}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            {firstCategoryId || secondCategoryId 
              ? "선택한 카테고리의 대학생 프로필이 없습니다."
              : "대학생 프로필이 없습니다."
            }
          </p>
        </div>
      )}
    </div>
  );
}
