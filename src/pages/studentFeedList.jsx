import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/pageHeader";
import { getFeed, getFeedTop5List } from "../api/feed";
import { useQuery } from "@tanstack/react-query";
import { trackEvent } from "../analytics";
import Pagination from "../components/pagination";

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
import SOUF_contest_banner from "../assets/images/SOUF_contest_banner.jpeg";
import heartOn from "../assets/images/heartOn.svg";

const BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

const getOrdinalSuffix = (rank) => {
  if (rank === 1) return 'st';
  if (rank === 2) return 'nd';
  return 'th';
};

export default function StudentFeedList({ }) {
  trackEvent("feed_list_view");
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedFirstCategory, setSelectedFirstCategory] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showMobileCategoryMenu, setShowMobileCategoryMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [clickedTabs, setClickedTabs] = useState(new Set());
  const { memberId: currentMemberId } = UserStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;
  const pageable = {
    page: currentPage,
    size: pageSize,
  };

  const handleTabChange = (tabIndex) => {
    if (activeTab === tabIndex) {
      // 같은 탭을 다시 클릭하면 토글
      const newClickedTabs = new Set(clickedTabs);
      if (newClickedTabs.has(tabIndex)) {
        newClickedTabs.delete(tabIndex);
      } else {
        newClickedTabs.add(tabIndex);
      }
      setClickedTabs(newClickedTabs);
    } else {
      // 다른 탭을 클릭하면 활성화하고 이전 탭의 클릭 상태는 초기화 (새 탭만 활성화)
      setActiveTab(tabIndex);
      const newClickedTabs = new Set();
      newClickedTabs.add(tabIndex);
      setClickedTabs(newClickedTabs);
    }
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

  // sortBy 값을 sortKey와 sortDir로 변환
  const getSortParams = (sortValue) => {
    switch (sortValue) {
      case 'RECENT_DESC':
        return { sortKey: 'RECENT', sortDir: 'DESC' };
      case 'RECENT_ASC':
        return { sortKey: 'RECENT', sortDir: 'ASC' };
      case 'VIEWS_DESC':
        return { sortKey: 'VIEWS', sortDir: 'DESC' };
      case 'VIEWS_ASC':
        return { sortKey: 'VIEWS', sortDir: 'ASC' };
      default:
        return { sortKey: 'RECENT', sortDir: 'DESC' };
    }
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
    setSelectedFirstCategory(null);
    setSelectedCategories([]);
  };

  // '전체' 카테고리인지 확인 (selectedCategories가 비어있거나 selectedFirstCategory가 null인 경우)
  const isAllCategory = selectedCategories.length === 0 || selectedFirstCategory === null;

  // sortBy 값을 sortKey와 sortDir로 변환
  const sortParams = getSortParams(sortBy);

const {
    data: feedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feed", selectedFirstCategory, sortBy, currentPage],
          queryFn: async () => {
            const pageable = {
              page: currentPage,
              size: pageSize,
            };
        // '전체' 카테고리면 firstCategory를 파라미터로 추가하지 않음
        const firstCategoryParam = isAllCategory ? null : selectedFirstCategory;
        const data = await getFeed(firstCategoryParam, pageable, sortParams.sortKey, sortParams.sortDir);
        return data;
      },
    keepPreviousData: true, 
  });
// console.log("feedData", feedData);
  useEffect(() => {
    setTotalPages(feedData?.result?.totalPages || 1);
  }, [feedData?.result?.totalPages]);

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

  // 순위 데이터 가져오기
  const top5Data = feedTop5Data?.result || [];
  
  // 현재 선택된 탭의 순위 데이터
  const currentRankData = top5Data[activeTab];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

  };

  return (
    <>
    <style>{`
      .flip-button {
        position: relative;
        overflow: hidden;
        perspective: 1000px;
      }
      .flip-button-hover-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background: rgb(94, 172, 255);
        color: #fff;
        transition: 0.5s;
        transform-origin: bottom;
        transform: translateY(-100%) rotateX(90deg);
        z-index: 2;
        opacity: 0;
      }
      .flip-button.active .flip-button-hover-content {
        transform: translateY(0) rotateX(0deg);
        opacity: 1;
      }
      .flip-button:hover:not(.active) .flip-button-hover-content {
        transform: translateY(0) rotateX(0deg);
        opacity: 1;
      }
      .flip-button-content {
        position: relative;
        z-index: 3;
        transition: opacity 0.3s;
      }
      .flip-button.active .flip-button-content {
        opacity: 0;
      }
      .flip-button:hover:not(.active) .flip-button-content {
        opacity: 0;
      }
    `}</style>
    <SEO title="카테고리별 피드" description="스프 SouF 카테고리별 피드" subTitle="스프"/>
    <PageHeader leftText="카테고리별 피드" />

    <div className="w-screen max-w-[60rem] mx-auto flex flex-col mb-40">
   
      <div className="w-full flex items-center justify-center mb-4">
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
    </>
  );
}
