import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/pageHeader";
import { getFeed } from "../api/feed";
import { useQuery } from "@tanstack/react-query";
import Feed from "../components/feed";
import Loading from "../components/loading";
import { UserStore } from "../store/userStore";
import AlertModal from "../components/alertModal";
import CategoryMenu from "../components/categoryMenu";
import { MEMBER_ERRORS } from "../constants/user";
import SEO from "../components/seo";
import secondCategoryData from '../assets/categoryIndex/second_category.json';
import thirdCategoryData from '../assets/categoryIndex/third_category.json';

export default function StudentFeedList({ }) {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedFirstCategory, setSelectedFirstCategory] = useState(1); // 초기값 1로 설정
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { memberId: currentMemberId } = UserStore();

  const onFeedClick = (worksId, memberId) => {
    if (!currentMemberId) {
      setShowLoginModal(true);
      return;
    }
    navigate(`/profileDetail/${memberId}`);
  };

  // 카테고리 선택 핸들러
  const handleCategoryApply = (categories) => {
    setSelectedCategories(categories);
    if (categories.length > 0) {
      setSelectedFirstCategory(categories[0].firstCategory);
    }
  };

const {
    data: feedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feed", selectedFirstCategory],
          queryFn: async () => {
            const pageable = {
              page: 0,
              size: 12,
            };
        const data = await getFeed(selectedFirstCategory, pageable);
        return data;
      },
    keepPreviousData: true, 
  });

  return (
    <>
    <SEO title="카테고리별 피드" description="스프 SouF 카테고리별 피드" subTitle="스프"/>
    <PageHeader leftText="카테고리별 피드" />
    <div className="w-screen max-w-[60rem] mx-auto flex flex-col mb-40">
      <div className="w-full mb-4">
        <CategoryMenu 
          secondCategories={secondCategoryData.second_category}
          thirdCategories={thirdCategoryData}
          onApply={handleCategoryApply}
          selectedCategories={{ firstCategoryId: selectedFirstCategory }}
        />
      </div>


      <div className="flex flex-col items-center justify-center">
        {isLoading ? (
          <Loading />
        ) : feedData?.result?.content && feedData.result.content.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-7xl">
            {feedData.result.content.map((data, index) => (
              <Feed key={`${data.memberId}-${data.worksId || index}`} feedData={data} onFeedClick={onFeedClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              선택한 카테고리의 피드가 없습니다.
            </p>
          </div>
        )}
        
      
      </div>
    </div>
    </>
  );
}
