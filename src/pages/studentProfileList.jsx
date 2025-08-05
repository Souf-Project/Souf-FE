import { useState } from "react";
import Profile from "../components/studentProfile/profile";
import Pagination from "../components/pagination";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/profile";
import Loading from "../components/loading";

export default function StudentProfileList({secondCategoryId, thirdCategoryId ,keyword }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");

  const pageable = {
    page: currentPage,
    size: pageSize,
  };

  const firstCategory = categoryParam ? Number(categoryParam.split(",")[0]) : null;

  const {
    data: feedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", firstCategory, secondCategoryId, thirdCategoryId, keyword, currentPage],
    queryFn: async () => {
      const data = await getProfile(firstCategory, secondCategoryId, thirdCategoryId, keyword, pageable);
      setTotalPages(data.result.page.totalPages); // 페이지 수 갱신
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
    <div className="w-full flex flex-col items-center justify-center">
      {userData && userData.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[20px] w-full">
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
            선택한 카테고리의 대학생 프로필이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
