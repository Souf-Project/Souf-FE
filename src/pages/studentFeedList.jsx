import { useState, useEffect } from "react";
import Profile from "../components/studentProfile/profile";
import Pagination from "../components/pagination";
import { getFeed } from "../api/feed";
import { useQuery } from "@tanstack/react-query";
import Feed from "../components/feed";

export default function StudentFeedList() {
  //const { data, error, isLoading, isFetching } = useFeed(firstCategory, pageable);

  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");

  //여기 나중에 무한스크롤로 바꿔야함 ..
  const pageable = {
    page: 0,
    size: 12,
  };

  const onFeedClick = (worksId) => {
    console.log(id + "안녕 " + worksId);
    navigate(`/profileDetail/${id}/post/${worksId}`);
  };

  const {
    data: feedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feed", pageable],
    queryFn: async () => {
      const data = await getFeed(categoryParam, pageable);
      console.log("getFeed 결과:", data);
      return data;
    },
    keepPreviousData: true,
  });

  //이거 나중에 제대로 추가하자
  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>{error.message || "에러"}</div>;

  return (
    <div className="w-full flex flex-col items-center justify-center w-full">
      {feedData?.result?.content.map((data) => (
        <Feed key={data.memberId} feedData={data} />
      ))}
    </div>
  );
}
