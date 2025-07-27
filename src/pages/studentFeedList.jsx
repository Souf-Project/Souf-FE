import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../components/studentProfile/profile";
import Pagination from "../components/pagination";
import { getFeed } from "../api/feed";
import { useQuery } from "@tanstack/react-query";
import Feed from "../components/feed";
import Loading from "../components/loading";
import { UserStore } from "../store/userStore";
import AlertModal from "../components/alertModal";
import SEO from "../components/seo";

export default function StudentFeedList() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { memberId: currentMemberId } = UserStore();

  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");

  //여기 나중에 무한스크롤로 바꿔야함 ..
  const pageable = {
    page: 0,
    size: 12,
  };

  const onFeedClick = (worksId, memberId) => {
    if (!currentMemberId) {
      setShowLoginModal(true);
      return;
    }
    navigate(`/profileDetail/${memberId}`);
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
  if (isLoading) return <Loading/>;
  if (error) return <div>{error.message || "에러"}</div>;

  return (
    <>
    <div className="w-full flex flex-col items-center justify-center w-full">
      {feedData?.result?.content && feedData.result.content.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-7xl">
          {feedData.result.content.map((data) => (
            <Feed key={data.memberId} feedData={data} onFeedClick={onFeedClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            선택한 카테고리의 피드가 없습니다.
          </p>
        </div>
      )}
      
      {showLoginModal && (
        <AlertModal
          type="simple"
          title="로그인이 필요합니다"
          description="SouF 회원만 상세 글을 조회할 수 있습니다!"
          TrueBtnText="로그인하러 가기"
          FalseBtnText="취소"
          onClickTrue={() => {
            setShowLoginModal(false);
            navigate("/login");
          }}
          onClickFalse={() => setShowLoginModal(false)}
        />
      )}
    </div>
    </>
  );
}
