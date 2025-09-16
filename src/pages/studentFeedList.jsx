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

export default function StudentFeedList({firstCategoryId, secondCategoryId, thirdCategoryId ,keyword }) {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { memberId: currentMemberId } = UserStore();

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
    queryKey: ["feed", firstCategoryId, secondCategoryId, thirdCategoryId, keyword, pageable],
          queryFn: async () => {
        console.log("getFeed 호출 파라미터:", { firstCategoryId, secondCategoryId, thirdCategoryId, keyword, pageable });
        const data = await getFeed(firstCategoryId, secondCategoryId, thirdCategoryId, keyword, pageable);
        console.log("getFeed 결과:", data);
        
        if (data?.result?.content) {
          console.log("원본 피드 데이터:", data.result.content);
          let filteredContent = data.result.content;
          
          // 각 피드의 카테고리 정보 확인
          data.result.content.forEach((feed, index) => {
            console.log(`피드 ${index} 카테고리 정보:`, {
              feedId: feed.feedId,
              categoryDtos: feed.categoryDtos,
              firstCategory: feed.firstCategory,
              secondCategory: feed.secondCategory,
              thirdCategory: feed.thirdCategory
            });
          });
          
          // 카테고리 필터링 로직
          // 대분류가 6인 경우 중분류로 필터링
          if (firstCategoryId === 6 && secondCategoryId && secondCategoryId !== 0) {
            filteredContent = data.result.content.filter(feed => {
              const feedCategories = feed.categoryDtos || [];
              
              return feedCategories.some(category => 
                category.secondCategory === secondCategoryId
              );
            });
          }
          // 대분류가 6이 아닌경우 선택한 소분류로 필터링
          else if (thirdCategoryId && thirdCategoryId !== 0) {
            filteredContent = data.result.content.filter(feed => {
              const feedCategories = feed.categoryDtos || [];
              
              return feedCategories.some(category => 
                category.thirdCategory === thirdCategoryId
              );
            });
          }
          // 소분류가 없고 중분류만 있는 경우
          else if (secondCategoryId && secondCategoryId !== 0) {
            filteredContent = data.result.content.filter(feed => {
              const feedCategories = feed.categoryDtos || [];
              
              return feedCategories.some(category => 
                category.secondCategory === secondCategoryId
              );
            });
          }
          // 대분류만 있는 경우 (모든 데이터 표시)
          else {
            filteredContent = data.result.content;
          }
          
          console.log("필터링된 피드 데이터:", filteredContent);
          
          return {
            ...data,
            result: {
              ...data.result,
              content: filteredContent
            }
          };
        }
        
        return data;
      },
    keepPreviousData: true,
  });

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
