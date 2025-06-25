import { useState, useEffect } from "react";
import Profile from "../components/studentProfile/profile";
import Pagination from "../components/pagination";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/profile";

export default function StudentProfileList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [displayedProfiles, setDisplayedProfiles] = useState([]);
  const [userData,setUserData] = useState([]); 
  const pageSize = 6;

  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");

  

  //여기나중에 currentPage로 바꾸기
  const pageable = {
    page: 0,
    size: 12,
  };
  const {
    data: feedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", pageable],
    queryFn: async () => {
      const data = await getProfile(categoryParam, pageable);
      console.log("getProfile 결과:", data);
      setUserData(data.result.content);
      return data;
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    setTotalPages(Math.ceil(userData.length / pageSize));

    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedProfiles(userData.slice(startIndex, endIndex));
  }, [currentPage, userData.length]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[20px] w-full">
        {displayedProfiles && displayedProfiles.map((data) => (
          <Profile
            key={data.id}
            profileId={data.id}
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
    </div>
  );
}
