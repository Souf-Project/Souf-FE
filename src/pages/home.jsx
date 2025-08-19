import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import searchIco from "../assets/images/searchIco.svg";
import cate1Img from "../assets/images/cate1Img.png";
import cate2Img from "../assets/images/cate2Img.png";
import cate3Img from "../assets/images/cate3Img.png";
import cate4Img from "../assets/images/cate4Img.png";
import cate5Img from "../assets/images/cate5Img.png";
import cate6Img from "../assets/images/cate6Img.png";
import Background from "../assets/images/background.png";

import { usePopularRecruit } from "../hooks/usePopularRecruit";
import MobileSwiper from "../components/home/mobileSwiper";
import FeedSwiper from "../components/home/feedSwiper";
import InfoBox from "../components/home/infoBox";
import StatisticsSection from "../components/home/StatisticsSection";
import ContestSection from "../components/home/ContestSection";
import SmallContestSection from "../components/home/smallContestSection";
import { getContests } from "../api/contest";
import { getMainViewCount } from "../api/home";
import { UserStore } from "../store/userStore";
import useCountUp from "../hooks/useCountUp";
import SEO from "../components/seo";
import Loading from "../components/loading";


export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [competitions, setCompetitions] = useState([]);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [statsData, setStatsData] = useState({
    todayVisitor: 0,
    studentCount: 0,
    recruitCount: 0
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const { memberId, roleType } = UserStore();

  const categories = [
    "순수미술",
    "공예",
    "음악",
    "촬영 및 편집",
    "디지털 콘텐츠",
    "IT · 개발"
  ]
  // 이미지 URL 생성 함수
  const getImageUrl = (imagePath) => {
    // console.log('getImageUrl called with:', imagePath);
    
    if (!imagePath) return null;
    
    // 이미 전체 URL인 경우 (상세내용_이미지)
    if (imagePath.startsWith('http')) {
      // console.log('Returning full URL:', imagePath);
      return imagePath;
    }
    
    // 썸네일 이미지 처리 (예: "20250626/thumbnails\\594792.jpg")
    if (imagePath.includes('thumbnails')) {
      // 파일명만 추출 (594792.jpg)
      const parts = imagePath.split('\\');
      const fileName = parts[parts.length - 1];
      // console.log('Extracted fileName from thumbnails:', fileName);
      
      if (!fileName) return null;
      
      // 확장자 제거 (594792)
      const imageId = fileName.replace(/\.(jpg|png|jpeg)$/i, '');
      
      // 여러 URL 형식 시도
      const urlFormats = [
        `https://media-cdn.linkareer.com//se2editor/image/${imageId}`,
        `https://media-cdn.linkareer.com/se2editor/image/${imageId}`,
        `https://api.linkareer.com/attachments/${imageId}`,
        `https://linkareer.com/attachments/${imageId}`
      ];
      
      // console.log('Trying URL formats:', urlFormats);
      return urlFormats[0]; // 첫 번째 형식 반환
    }
    
    // 기타 경우
    const fileName = imagePath.split('\\').pop() || imagePath.split('/').pop();
    if (!fileName) return null;
    
    const imageId = fileName.replace(/\.(jpg|png|jpeg)$/i, '');
    const finalUrl = `https://media-cdn.linkareer.com//se2editor/image/${imageId}`;
    // console.log('Generated other URL:', finalUrl);
    
    return finalUrl;
  };

  // 여러 대체 URL 생성 함수
  const getFallbackUrls = (imagePath) => {
    if (!imagePath) return [];
    
    // 썸네일 이미지 처리 (예: "20250626/thumbnails\\594792.jpg")
    if (imagePath.includes('thumbnails')) {
      // 파일명만 추출 (594792.jpg)
      const parts = imagePath.split('\\');
      const fileName = parts[parts.length - 1];
      
      if (!fileName) return [];
      
      // 확장자 제거 (594792)
      const imageId = fileName.replace(/\.(jpg|png|jpeg)$/i, '');
      
      // 여러 URL 형식 반환
      return [
        `https://media-cdn.linkareer.com//se2editor/image/${imageId}`,
        `https://media-cdn.linkareer.com/se2editor/image/${imageId}`,
        `https://api.linkareer.com/attachments/${imageId}`,
        `https://linkareer.com/attachments/${imageId}`
      ];
    }
    
    // 기타 경우
    const fileName = imagePath.split('\\').pop() || imagePath.split('/').pop();
    if (!fileName) return [];
    
    const imageId = fileName.replace(/\.(jpg|png|jpeg)$/i, '');
    
    return [
      `https://media-cdn.linkareer.com//se2editor/image/${imageId}`,
      `https://media-cdn.linkareer.com/se2editor/image/${imageId}`,
      `https://api.linkareer.com/attachments/${imageId}`,
      `https://linkareer.com/attachments/${imageId}`
    ];
  };


  const pageable = {
    page: 0,
    size: 18, // 총 18개를 한번에 가져옴
    sort: ["createdAt,desc"]
  };

  const { data: recruitData } = usePopularRecruit(pageable);
 
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleCategoryClick = (category) => {
    //const encoded = encodeURIComponent(category);
    navigate(`/recruit?category=${category}`);
  };

  const showLoginModalHandler = () => {
    setShowLoginModal(true);
  };

  const closeLoginModalHandler = () => {
    setShowLoginModal(false);
  };


   useEffect(() => {
    const fetchContests = async () => {
      try {
        // 모든 페이지의 공모전을 수집하는 함수
        const fetchAllContests = async () => {
          let allContests = [];
          let page = 0;
          let hasMore = true;
          
          while (hasMore) {
            try {
              const response = await getContests({ 
                page: page, 
                size: 24,
              });
              
              const contests = response?.data || [];
              
              if (contests.length === 0) {
                hasMore = false;
              } else {
                allContests = [...allContests, ...contests];
                page++;
              }
            } catch (error) {
              console.error(`페이지 ${page} 가져오기 실패:`, error);
              hasMore = false;
            }
          }
          
          return allContests;
        };

        const all = await fetchAllContests();

        // 모든 공모전 데이터 사용
        setCompetitions(all);

        // 이미지 로딩 상태 초기화
        const loadingStates = {};
        all.forEach((_, index) => {
          loadingStates[index] = true;
        });
        setImageLoadingStates(loadingStates);

        // 1초 후 로딩 상태 제거
        setTimeout(() => {
          setImageLoadingStates({});
        }, 1000);

      } catch (err) {
        console.error("공모전 불러오기 실패:", err);
      }
    };

    fetchContests();
  }, []);

  // 통계 데이터 조회
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getMainViewCount();
        if (response.result) {
          setStatsData({
            todayVisitor: response.result.todayVisitor || 0,
            studentCount: response.result.studentCount || 0,
            recruitCount: response.result.recruitCount || 0
          });
        }
      } catch (error) {
        console.error("통계 데이터 조회 실패:", error);
      }
    };

    fetchStats();
  }, []);


  const viewCount = useCountUp(statsData.todayVisitor, 2000);
  const userCount = useCountUp(statsData.studentCount, 2000);
  const recruitCount = useCountUp(statsData.recruitCount, 2000);

  return (
    <>
    <SEO  title="SouF 스프" description="대학생 프리랜서와 창의적이고 유연한 인재를 필요로 하는 기업을 연결하는 AI 기반 프리랜서 매칭 플랫폼 SouF입니다. " subTitle='대학생 외주 & 공모전' />
    <div className="relative overflow-x-hidden">
        <div className="relative flex justify-center items-start pt-20 px-8 gap-8 max-w-[100rem] mx-auto">
          <img src={Background} alt="background" className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"></img>
          {/* 왼쪽: 타이틀과 검색, 카테고리 */}
          <div className="flex-1 max-w-2xl lg:max-w-3xl lg:mt-52 lg:ml-20">
            <h1 className="hidden lg:block text-4xl lg:text-5xl font-semibold mb-4 text-black text-center lg:text-left">
              필요한 일을, 필요한 사람에게
            </h1>
            <h1 className="block lg:hidden text-4xl lg:text-5xl font-semibold mb-4 text-black text-center lg:text-left">
              필요한 일을,<br/> 필요한 사람에게
            </h1>
            <h2 className="text-6xl lg:text-8xl font-bold text-black mb-12 text-center lg:text-left">
              지금 바로 SouF!
            </h2>

            <form onSubmit={handleSearch} className="w-full lg:mt-20">
              <div className="relative w-full max-w-2xl lg:max-w-3xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="원하는 일을 검색해보세요"
                  className="w-full px-6 pr-12 py-3 lg:py-5 text-md lg:text-2xl rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-blend-overlay bg-gradient-to-br from-white/50 to-white/5 rounded-full shadow-[0px_1.1966018676757812px_29.91504669189453px_0px_rgba(69,42,124,0.10)] outline outline-[3px] outline-offset-[-3px] outline-white/50 backdrop-blur-[47.86px] overflow-hidden"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <img src={searchIco} alt="search" className="w-4 h-4 lg:w-6 lg:h-6" />
                </button>
              </div>
            </form>
            

           
          </div>
          {/* 오른쪽: Glass 효과 박스 */}
          <InfoBox />

        </div>
        <StatisticsSection 
          viewCount={viewCount}
          userCount={userCount}
          recruitCount={recruitCount}
        />

{/* 인기 공고문  */}
      <div className="relative mt-16 px-6 lg:px-24">
        <div className="relative flex flex-col  mx-auto lg:px-6 py-16 overflow-x-hidden">
        <h2 className="text-2xl lg:text-3xl font-bold mb-8 px-6 lg:px-24">
            <span className="relative inline-block ">
              <span className="relative z-10 ">인기있는 공고문</span>
              <div className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 opacity-60 -z-10"></div>
            </span>
            <span className="ml-2">모집 보러가기</span>
          </h2>
          <MobileSwiper />
        </div>
      </div>

      {/* 인기 피드 섹션 */}
      <div className="relative lg:mt-16 px-6 lg:px-24">
        <div className="relative flex flex-col  mx-auto lg:px-6 py-16 overflow-x-hidden">
        <h2 className="text-2xl lg:text-3xl font-bold mb-8 px-6 lg:px-24">
            <span className="relative inline-block ">
              <span className="relative z-10 ">인기있는 피드</span>
              <div className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 opacity-60 -z-10"></div>
            </span>
            <span className="ml-2">구경하러 가기</span>
          </h2>
          <FeedSwiper />
        </div>
      </div>

       {/* 카테고리 섹션 */}
       <div className="relative px-6 lg:px-24 ">
       <div className="relative items-center  mx-auto px-4 sm:px-6 py-16">
       <h2 className="text-2xl lg:text-3xl font-bold mb-8 px-6 lg:px-24">
            <span className="relative inline-block">
              <span className="relative z-10">관심있는 주제 피드</span>
              <div className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 opacity-60 -z-10"></div>
            </span>
            <span className="ml-2">더보기</span>
          </h2>
            <div className="flex flex-col md:flex-row md:flex-nowrap md:justify-between w-full lg:px-24 mt-20">
              <div className="flex justify-center md:hidden mb-4">
                {categories.slice(0, 3).map((category, index) => {
                  const categoryImages = [
                    cate1Img,
                    cate2Img,
                    cate3Img,
                    cate4Img,
                    cate5Img,
                    cate6Img,
                  ];
                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(index + 1)}
                      className="glass flex flex-col items-center justify-center gap-1 sm:gap-2 w-24 h-24 sm:w-28 sm:h-28 mx-2 transform transition-transform duration-300 hover:-translate-y-2 rounded-xl hover:shadow-[0_8px_25px_rgba(255,193,7,0.3)]"
                    >
                      <img
                        src={categoryImages[index]}
                        alt={category}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover mb-1"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center break-words">
                        {category}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-center md:hidden">
                {categories.slice(3, 6).map((category, index) => {
                  const categoryImages = [
                    cate1Img,
                    cate2Img,
                    cate3Img,
                    cate4Img,
                    cate5Img,
                    cate6Img,
                  ];
                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(index + 4)}
                      className="glass flex flex-col items-center justify-center gap-1 sm:gap-2 w-24 h-24 sm:w-28 sm:h-28 mx-2 transform transition-transform duration-300 hover:-translate-y-2 rounded-xl hover:shadow-[0_8px_25px_rgba(255,193,7,0.3)]"
                    >
                      <img
                        src={categoryImages[index + 3]}
                        alt={category}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover mb-1"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center break-words">
                        {category}
                      </span>
                    </button>
                  );
                })}
              </div>
              {/* 데스크톱 버전 */}
              <div className="hidden md:flex md:flex-nowrap md:justify-between w-full max-w-7xl mx-auto">
                {categories.map((category, index) => {
                  const categoryImages = [
                    cate1Img,
                    cate2Img,
                    cate3Img,
                    cate4Img,
                    cate5Img,
                    cate6Img,
                  ];
                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(index + 1)}
                      className="glass flex flex-col items-center justify-center gap-1 sm:gap-2 flex-1 sm:flex-none sm:w-auto lg:w-48 lg:h-48 px-1 sm:px-2 transform transition-transform duration-300 hover:-translate-y-2 rounded-xl hover:shadow-[0_8px_25px_rgba(255,193,7,0.3)]"
                    >
                      <img
                        src={categoryImages[index]}
                        alt={category}
                        className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover mb-1 sm:mb-2"
                      />
                      <span className="text-sm sm:text-sm lg:text-2xl font-semibold text-gray-700 text-center break-words">
                        {category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            </div>
            </div>
{/* 광고 배너 div */}
{/* <div className="relative px-6 lg:px-24 ">
  광고 배너
</div> */}

{/* 추천 공고 (광고) */}
{/* <div className="relative px-6 lg:px-24 ">
       <div className="relative items-center  mx-auto px-4 sm:px-6 py-16">
       <h2 className="text-2xl lg:text-3xl font-bold mb-8">
            <span className="relative inline-block">
              <span className="relative z-10">스프 추천 공고</span>
              <div className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 opacity-60 -z-10"></div>
            </span>
          </h2>
            <div className="flex w-full justify-around">
              <div className="flex flex-col gap-4"> 
              <h3 className="text-2xl lg:text-3xl font-bold">외주 공고</h3>
              <div>내용</div>
              </div>

              <div className="flex flex-col gap-4"> 
              <h3 className="text-2xl lg:text-3xl font-bold">외주 공고</h3>
              <div>내용</div>
              </div>

              <div className="flex flex-col gap-4"> 
              <h3 className="text-2xl lg:text-3xl font-bold">외주 공고</h3>
              <div>내용</div>
              </div>
             
            </div>
            </div>
            </div> */}
{/* 공모전 정보 스키마 */}
      {/* {competitions.map((competition, index) => {
        const schema = {
          "@context": "https://schema.org",
          "@type": "Event",
          "name": competition.제목,
          "startDate": competition.접수기간.시작일,
          "endDate": competition.접수기간.마감일,
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
          "location": {
            "@type": "Place",
            "name": competition.온라인가능 ? "온라인" : "오프라인",
            "address": competition.온라인가능
              ? { "@type": "PostalAddress", "addressCountry": "KR" }
              : {
                  "@type": "PostalAddress",
                  "streetAddress": competition.장소?.주소,
                  "addressLocality": competition.장소?.시,
                  "addressCountry": "KR"
                }
          },
          "image": getImageUrl(competition.썸네일),
          "description": `주최: ${competition.주최}, 대상: ${competition.참여대상}, 분야: ${competition.공모분야?.join(', ')}`,
          "organizer": {
            "@type": "Organization",
            "name": competition.주최
          },
          "offers": {
            "@type": "Offer",
            "url": `${window.location.origin}/contests/${competition.categoryID[0]}/${competition.contestID}`,
            "price": competition.유료여부 ? competition.참가비 : "0",
            "priceCurrency": "KRW",
            "availability": "https://schema.org/InStock",
            "validFrom": competition.접수기간.시작일
          },
          "eventCategory": competition.공모분야,
          "audience": {
            "@type": "EducationalAudience",
            "educationalRole": competition.참여대상
          }
        };

        return (
          <script
            key={`schema-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        );
      })}' */}
      {/* 공모전 정보 섹션 */}
      <div className="relative px-6 lg:px-24  mx-auto py-16">
      <div className="flex justify-between items-center px-4 sm:px-6 ">
        <h2 className="text-2xl lg:text-3xl font-bold mb-8 px-6 lg:px-24">
          <span className="relative inline-block">
            <span className="relative z-10">금주 인기 공모전</span>
            <div className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 opacity-60 -z-10"></div>
          </span>
          <span className="ml-2">모아보기</span>
        </h2>
       
      </div>
      <div className="flex flex-col gap-4 px-6 lg:px-24">
        {competitions.length === 0 ? (
          <Loading text="공모전 정보를 불러오는 중..." />
        ) : (
          <>
            <ContestSection 
              competitions={competitions}
              imageLoadingStates={imageLoadingStates}
              getImageUrl={getImageUrl}
              getFallbackUrls={getFallbackUrls}
            />
            <SmallContestSection 
                competitions={competitions}
                imageLoadingStates={imageLoadingStates}
                getImageUrl={getImageUrl}
                getFallbackUrls={getFallbackUrls}
              />
            {/* SmallContestSection과 블러 처리 */}
            <div className="relative pt-20">
              <SmallContestSection 
                competitions={competitions}
                imageLoadingStates={imageLoadingStates}
                getImageUrl={getImageUrl}
                getFallbackUrls={getFallbackUrls}
              />
              <div className="absolute inset-0 bg-white/50 backdrop-blur-lg z-20"></div>
              
              {/* 공모전 더보기 버튼 */}
              <div className="absolute top-36 left-1/2 transform -translate-x-1/2 z-30">
                <button
                  onClick={() => navigate("/contests")}
                  className="px-8 py-3 text-lg font-bold bg-yellow-point text-white rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  공모전 더보기
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
    </>
  );
}
