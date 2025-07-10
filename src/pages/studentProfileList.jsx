import { useState } from "react";
import Profile from "../components/studentProfile/profile";
import Pagination from "../components/pagination";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/profile";
import Loading from "../components/loading";

export default function StudentProfileList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");

  const pageable = {
    page: currentPage,
    size: pageSize,
  };

  const {
    data: feedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", categoryParam, currentPage], // currentPage가 변경될 때마다 refetch
    queryFn: async () => {
      const data = await getProfile(categoryParam, pageable);
      setTotalPages(data.result.page.totalPages); // 페이지 수 갱신
      return data;
    },
    keepPreviousData: true,
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const userData = feedData?.result?.content || [];

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[20px] w-full">
            {userData.map((data) => (
              <Profile
                key={data.id}
                memberId={data.memberId}
                profileImg={data.profileImgUrl}
                temperature={data.temperature}
                userName={data.nickname}
                userDetail={data.userDetail}
                userWorks={data.userWorks}
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
