import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/pageHeader";
import { getFeed, getFeedTop5List } from "../api/feed";
import { useQuery } from "@tanstack/react-query";
import { trackEvent } from "../analytics";

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
      // 다른 탭을 클릭하면 활성화하고 이전 탭의 클릭 상태는 유지
      setActiveTab(tabIndex);
      const newClickedTabs = new Set(clickedTabs);
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

  // console.log("feedTop5Data", feedTop5Data);

  // 순위 데이터 가져오기
  const top5Data = feedTop5Data?.result || [];
  
  // 현재 선택된 탭의 순위 데이터
  const currentRankData = top5Data[activeTab];

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
    <img src={SOUF_contest_banner} alt="SOUF_contest_banner" className="w-full h-full object-cover cursor-pointer" onClick={() => {navigate("/contest");
      }} />
      {feedTop5Loading ? (
        <div className="w-full flex items-center justify-center my-4">
          <Loading />
        </div>
      ) : top5Data.length > 0 ? (
        <div className="w-full flex items-center justify-between my-4 gap-4">
          {/* 왼쪽: 피드 이미지 영역 */}
          <div className="w-1/2 h-[24rem]">
            <div className={`relative w-full h-full transition-all duration-300 ease-in-out overflow-hidden flex items-center justify-center`}>
              {currentRankData && currentRankData.competitionPopularFeedResDto && currentRankData.competitionPopularFeedResDto.length > 0 ? (
                (() => {
                  const feeds = currentRankData.competitionPopularFeedResDto;
                  const feedCount = feeds.length;

                  // 1개일 때
                  if (feedCount === 1) {
                    return (
                      <div className="w-full h-full flex items-center justify-center">
                        <div 
                          className="w-full max-w-[54%] aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg shadow-md cursor-pointer"
                          onClick={() => navigate(`/profileDetail/${currentRankData.memberId}/post/${feeds[0].feedId}`)}
                        >
                          {feeds[0].mediaResDto?.fileUrl ? (
                            <img 
                              src={`${BUCKET_URL}${feeds[0].mediaResDto.fileUrl}`}
                              alt={feeds[0].feedTitle || "피드 이미지"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/src/assets/images/basiclogoimg.png";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                              이미지 없음
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // 2개일 때
                  if (feedCount === 2) {
                    return (
                      <div className="w-full h-full flex gap-2 items-center justify-center">
                        {feeds.map((feed, index) => (
                          <div 
                            key={feed.feedId || index} 
                            className="flex-1 max-w-[48%] aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg shadow-md cursor-pointer "
                            onClick={() => navigate(`/profileDetail/${currentRankData.memberId}/post/${feed.feedId}`)}
                          >
                            {feed.mediaResDto?.fileUrl ? (
                              <img 
                                src={`${BUCKET_URL}${feed.mediaResDto.fileUrl}`}
                                alt={feed.feedTitle || "피드 이미지"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/src/assets/images/basiclogoimg.png";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                이미지 없음
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  }

                  // 3개일 때
                  if (feedCount === 3) {
                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        {/* 두 번째 이미지 (왼쪽) */}
                        <div 
                          className="absolute left-0 w-[40%] aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg shadow-md opacity-50 z-10 mt-20 cursor-pointer hover:opacity-70 transition-opacity"
                          onClick={() => navigate(`/profileDetail/${currentRankData.memberId}/post/${feeds[1].feedId}`)}
                        >
                          {feeds[1].mediaResDto?.fileUrl ? (
                            <img 
                              src={`${BUCKET_URL}${feeds[1].mediaResDto.fileUrl}`}
                              alt={feeds[1].feedTitle || "피드 이미지"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/src/assets/images/basiclogoimg.png";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                              이미지 없음
                            </div>
                          )}
                        </div>

                        {/* 첫 번째 이미지 (가운데, z-index 높게) */}
                        <div 
                          className="relative w-[54%] aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg shadow-md z-20 mb-10 cursor-pointer "
                          onClick={() => navigate(`/profileDetail/${currentRankData.memberId}/post/${feeds[0].feedId}`)}
                        >
                          {feeds[0].mediaResDto?.fileUrl ? (
                            <img 
                              src={`${BUCKET_URL}${feeds[0].mediaResDto.fileUrl}`}
                              alt={feeds[0].feedTitle || "피드 이미지"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/src/assets/images/basiclogoimg.png";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                              이미지 없음
                            </div>
                          )}
                        </div>

                        {/* 세 번째 이미지 (오른쪽) */}
                        <div 
                          className="absolute right-0 w-[40%] aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg shadow-md opacity-50 z-10 mt-20 cursor-pointer hover:opacity-70 transition-opacity"
                          onClick={() => navigate(`/profileDetail/${currentRankData.memberId}/post/${feeds[2].feedId}`)}
                        >
                          {feeds[2].mediaResDto?.fileUrl ? (
                            <img 
                              src={`${BUCKET_URL}${feeds[2].mediaResDto.fileUrl}`}
                              alt={feeds[2].feedTitle || "피드 이미지"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/src/assets/images/basiclogoimg.png";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                              이미지 없음
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // 기본 케이스 (4개 이상)
                  return (
                    <div className="w-full h-full flex gap-2 items-center justify-center">
                      {feeds.slice(0, 3).map((feed, index) => (
                        <div 
                          key={feed.feedId || index} 
                          className="flex-1 h-full overflow-hidden bg-gray-100 rounded-lg shadow-md cursor-pointer "
                          onClick={() => navigate(`/profileDetail/${currentRankData.memberId}/post/${feed.feedId}`)}
                        >
                          {feed.mediaResDto?.fileUrl ? (
                            <img 
                              src={`${BUCKET_URL}${feed.mediaResDto.fileUrl}`}
                              alt={feed.feedTitle || "피드 이미지"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/src/assets/images/basiclogoimg.png";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                              이미지 없음
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  피드가 없습니다
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 순위 탭 영역 */}
          <div className="w-1/2 flex flex-col gap-4">
            {top5Data.slice(0, 5).map((item, index) => {
              const isActive = activeTab === index;
              const isClicked = clickedTabs.has(index);
              return (
                <div 
                  key={item.memberId || index}
                  className={`flip-button p-4 rounded-[5px] cursor-pointer transition-all duration-300 ease-in-out ${
                    isActive 
                      ? "bg-blue-100 shadow-lg" 
                      : "bg-white border border-gray-200"
                  } ${isClicked ? "active" : ""}`}
                  onClick={() => handleTabChange(index)}
                >
                  <div className="flip-button-hover-content">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-white">
                        {item.rank}.
                      </div>
                      <div className="text-xl font-semibold text-white">
                        {item.nickname || "익명"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src={heartOn} alt="좋아요" className="w-5 h-5" />
                      <span className="text-white font-semibold">
                        {item.totalLikes || 0}개
                      </span>
                    </div>
                  </div>
                  
                  {/* 기본 표시 내용 */}
                  <div className="flip-button-content flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl font-bold transition-colors duration-300 ${
                        isActive ? "text-blue-600" : "text-gray-600"
                      }`}>
                        {item.rank}.
                      </div>
                      <div className="flex flex-col">
                        <div className={`text-xl font-semibold transition-colors duration-300 ${
                          isActive ? "text-blue-600" : "text-gray-900"
                        }`}>
                          {item.nickname || "익명"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4 items-center justify-center my-8 text-gray-500">
          <p className="text-lg text-blue-main font-bold">
            아직 순위가 없습니다.
          </p>
          <p className="text-sm text-gray-500">
            먼저 자신있는 피드를 업로드해볼까요?
          </p>
        </div>
      )}
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
