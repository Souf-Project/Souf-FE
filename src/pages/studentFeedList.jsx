import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/pageHeader";
import { getFeed, getFeedTop5List } from "../api/feed";
import { useQuery } from "@tanstack/react-query";
import Feed from "../components/feed";
import Loading from "../components/loading";
import { UserStore } from "../store/userStore";
import AlertModal from "../components/alertModal";
import FeedCategoryMenu from "../components/feedCategoryMenu";
import { MEMBER_ERRORS } from "../constants/user";
import FilterDropdown from "../components/filterDropdown";
import SEO from "../components/seo";
import secondCategoryData from '../assets/categoryIndex/second_category.json';
import thirdCategoryData from '../assets/categoryIndex/third_category.json';

export default function StudentFeedList({ }) {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedFirstCategory, setSelectedFirstCategory] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showMobileCategoryMenu, setShowMobileCategoryMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { memberId: currentMemberId } = UserStore();

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const filterOptions = [
    { value: 'RECENT_DESC', label: '최신순' },
    { value: 'RECENT_ASC', label: '오래된순' },
    { value: 'VIEWS_DESC', label: '조회 높은 순' },
    { value: 'VIEWS_ASC', label: '조회 낮은 순' },
  ];
  const [sortBy, setSortBy] = useState('RECENT_DESC');
  const handleSortChange = (value) => {
    setSortBy(value);
  };

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

  const {
    data: feedTop5Data,
    isLoading: feedTop5Loading,
    error: feedTop5Error,
  } = useQuery({
    queryKey: ["feedTop5"],
    queryFn: async () => {
      const data = await getFeedTop5List();
      return data;
    },
    keepPreviousData: true,
  });

  console.log("feedTop5Data", feedTop5Data);

  return (
    <>
    <SEO title="카테고리별 피드" description="스프 SouF 카테고리별 피드" subTitle="스프"/>
    <PageHeader leftText="카테고리별 피드" />

    <div className="w-screen max-w-[60rem] mx-auto flex flex-col mb-40">
      <div className="w-full h-28 bg-gray-100 cursor-pointer" onClick={() => {navigate("/contest");
      }} />
      <div className="w-full flex items-center justify-between my-4 gap-4">
        <div className="w-1/2 h-72">
        
          <div className={`relative p-4 w-full h-full rounded-lg shadow-md transition-all duration-300 ease-in-out ${
            activeTab === 0 ? "bg-blue-100" :
            activeTab === 1 ? "bg-blue-200" :
            activeTab === 2 ? "bg-blue-300" :
            activeTab === 3 ? "bg-blue-400" :
            activeTab === 4 ? "bg-blue-500" :
            "bg-gray-100"
          }`}/>
          {/* <div className="absolute top-0 left-0 w-32 h-48 bg-gray-100" /> */}
        </div>
        <div className="w-1/2 flex flex-col gap-4">
          <div 
            className={`p-4 rounded-[5px] cursor-pointer transition-all duration-300 ease-in-out ${
              activeTab === 0 
                ? "bg-blue-100 shadow-lg" 
                : ""
            }`}
            onClick={() => handleTabChange(0)}
          >
            <div className={`text-2xl font-bold transition-colors duration-300 ${
              activeTab === 0 ? "text-blue-600" : "text-black"
            }`}>1.</div>
          </div>
          <div 
            className={`p-4 rounded-[5px] cursor-pointer transition-all duration-300 ease-in-out ${
              activeTab === 1 
                ? "bg-blue-100 shadow-lg" 
                : ""
            }`}
            onClick={() => handleTabChange(1)}
          >
            <div className={`text-2xl font-bold transition-colors duration-300 ${
              activeTab === 1 ? "text-blue-600" : "text-black"
            }`}>2.</div>
          </div>
          <div 
            className={`p-4 rounded-[5px] cursor-pointer transition-all duration-300 ease-in-out ${
              activeTab === 2 
                ? "bg-blue-100 shadow-lg" 
                : ""
            }`}
            onClick={() => handleTabChange(2)}
          >
            <div className={`text-2xl font-bold transition-colors duration-300 ${
              activeTab === 2 ? "text-blue-600" : "text-black"
            }`}>3.</div>
          </div>
          <div 
            className={`p-4 rounded-[5px] cursor-pointer transition-all duration-300 ease-in-out ${
              activeTab === 3 
                ? "bg-blue-100 shadow-lg" 
                : ""
            }`}
            onClick={() => handleTabChange(3)}
          >
            <div className={`text-2xl font-bold transition-colors duration-300 ${
              activeTab === 3 ? "text-blue-600" : "text-black"
            }`}>4.</div>
          </div>
          <div 
            className={`p-4 rounded-[5px] cursor-pointer transition-all duration-300 ease-in-out ${
              activeTab === 4 
                ? "bg-blue-100 shadow-lg" 
                : ""
            }`}
            onClick={() => handleTabChange(4)}
          >
            <div className={`text-2xl font-bold transition-colors duration-300 ${
              activeTab === 4 ? "text-blue-600" : "text-black"
            }`}>5.</div>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center border-t border-gray-300 py-2">
      <FeedCategoryMenu 
          mode="simple"
          secondCategories={secondCategoryData.second_category}
          thirdCategories={thirdCategoryData}
          onApply={handleCategoryApply}
          onReset={handleCategoryReset}
          selectedCategories={{ firstCategoryId: selectedFirstCategory }}
        />
         <FilterDropdown
          width="w-32"
              options={filterOptions}
              selectedValue={sortBy}
              onSelect={handleSortChange}
              placeholder="정렬 기준"
            />
      </div>
       

      <div className="flex flex-col items-center justify-center px-2 md:px-0 md:mx-auto w-full">
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
