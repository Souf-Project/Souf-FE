import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/pageHeader";
import { getFeed } from "../api/feed";
import { useQuery } from "@tanstack/react-query";
import Feed from "../components/feed";
import Loading from "../components/loading";
import { UserStore } from "../store/userStore";
import AlertModal from "../components/alertModal";
import FeedCategoryMenu from "../components/feedCategoryMenu";
import { MEMBER_ERRORS } from "../constants/user";
import SEO from "../components/seo";
import secondCategoryData from '../assets/categoryIndex/second_category.json';
import thirdCategoryData from '../assets/categoryIndex/third_category.json';

export default function StudentFeedList({ }) {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedFirstCategory, setSelectedFirstCategory] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showMobileCategoryMenu, setShowMobileCategoryMenu] = useState(false);
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

  // 카테고리 초기화 핸들러
  const handleCategoryReset = () => {
    setSelectedFirstCategory(1);
    setSelectedCategories([]);
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
    
    {/* 모바일 카테고리 메뉴 */}
    <div className={`lg:hidden w-full mb-6 sticky top-0 z-10 ${
        showMobileCategoryMenu 
          ? "bg-white" 
          : "bg-gradient-to-b from-white to-transparent"
      }`}>
        <div className="lg:pt-20">
          <div className="flex justify-center items-center gap-3">
            {/* 카테고리 메뉴 버튼 */}
            <button
              onClick={() => setShowMobileCategoryMenu(!showMobileCategoryMenu)}
              className="flex items-center gap-2 p-4 bg-gray-100/80 rounded-lg"
            >
              <span className="text-gray-600 text-sm">카테고리 선택하기</span>
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                  showMobileCategoryMenu ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* 모바일 카테고리 메뉴 */}
          {showMobileCategoryMenu && (
            <div className="mt-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              <FeedCategoryMenu
                mode="simple"
                secondCategories={secondCategoryData.second_category}
                thirdCategories={thirdCategoryData}
                onApply={handleCategoryApply}
                onReset={handleCategoryReset}
                selectedCategories={{ firstCategoryId: selectedFirstCategory }}
              />
            </div>
          )}
        </div>
      </div>

    <div className="w-screen max-w-[60rem] mx-auto flex flex-col mb-40">
      {/* 데스크톱 카테고리 메뉴 */}
      <div className="hidden lg:block">
        <FeedCategoryMenu 
          mode="simple"
          secondCategories={secondCategoryData.second_category}
          thirdCategories={thirdCategoryData}
          onApply={handleCategoryApply}
          onReset={handleCategoryReset}
          selectedCategories={{ firstCategoryId: selectedFirstCategory }}
        />
      </div>

      <div className="flex flex-col items-center justify-center mx-auto w-full">
        {isLoading ? (
          <Loading />
        ) : feedData?.result?.content && feedData.result.content.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
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
