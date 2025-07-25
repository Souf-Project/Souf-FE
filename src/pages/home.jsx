import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import searchIco from "../assets/images/searchIco.svg";
import cate1Img from "../assets/images/cate1Img.png";
import cate2Img from "../assets/images/cate2Img.png";
import cate3Img from "../assets/images/cate3Img.png";
import cate4Img from "../assets/images/cate4Img.png";
import cate5Img from "../assets/images/cate5Img.png";
import Background from "../assets/images/background.png";
import PopularFeed from "../components/home/popularFeed";
import { usePopularFeed } from "../hooks/usePopularFeed";
import { usePopularRecruit } from "../hooks/usePopularRecruit";
import { getFirstCategoryNameById } from "../utils/getCategoryById";
import { calculateDday } from "../utils/getDate";
import MobileSwiper from "../components/home/mobileSwiper";
import { getContests } from "../api/contest";
import { UserStore } from "../store/userStore";
import AlertModal from "../components/alertModal";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [competitions, setCompetitions] = useState([]);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [currentFeedPage, setCurrentFeedPage] = useState(1); // 현재 피드 페이지
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 더보기 로딩 상태
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { memberId, roleType } = UserStore();

  /*
  useEffect(() => {
    // 여러 카테고리에서 상위 공모전들을 가져와서 섞기
    const allCompetitions = [
      ...buildingData.slice(0, 1),
      ...marketingData.slice(0, 1)
    ];
    //setCompetitions(allCompetitions);
    
    // 이미지 로딩 상태 초기화
    const newLoadingStates = {};
    allCompetitions.forEach((competition, index) => {
      if (competition.썸네일) {
        newLoadingStates[index] = true;
      }
    });
    setImageLoadingStates(newLoadingStates);
    
    // 0.2초 후에 모든 스켈레톤 숨기기
    setTimeout(() => {
      setImageLoadingStates({});
    }, 1000);
  }, []);*/


  const categories = [
    "순수미술",
    "공예",
    "음악",
    "촬영 및 편집",
    "디지털 콘텐츠",
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
  const { data: feedData, isLoading: feedLoading } = usePopularFeed(pageable);
  
  console.log("🔍 home.jsx에서 feedData:", feedData);
  console.log("🔍 home.jsx에서 feedLoading:", feedLoading);
  
  // 현재 페이지에 해당하는 피드 데이터 계산
  const getCurrentFeedData = () => {
    console.log("🔍 getCurrentFeedData에서 feedData:", feedData?.result);
    if (!feedData?.result) return [];
    const endIndex = currentFeedPage * 6;
    return feedData.result.slice(0, endIndex);
  };

  // 더보기 버튼 클릭 핸들러
  const handleLoadMoreFeeds = () => {
    if (currentFeedPage < 3) {
      setIsLoadingMore(true);
      // 약간의 지연을 주어 로딩 효과를 보여줌
      setTimeout(() => {
        setCurrentFeedPage(prev => prev + 1);
        setIsLoadingMore(false);
      }, 300);
    }
  };
 
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
    const pageable = {
        page: 0,
        size: 12,
    };
    const fetchContests = async () => {
      try {
        const res = await getContests(pageable); // API에서 전체 데이터 가져옴
        const all = res?.data || [];

        // 무작위 4개 추출 (grid 컬럼 수에 맞춤)
        const shuffled = all.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);

        setCompetitions(selected);

        // 이미지 로딩 상태 초기화
        const loadingStates = {};
        selected.forEach((_, index) => {
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

  
  return (
    <div className="relative overflow-x-hidden">
      {/* 플로팅 액션 버튼 */}
      {memberId && (
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={() => navigate(roleType === "MEMBER" ? "/recruitUpload" : "/postUpload")}
            className="bg-yellow-point text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 font-bold text-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {roleType === "MEMBER" ? "공고문 작성" : "피드 작성"}
          </button>
        </div>
      )}
      
      {/* 배경 이미지 섹션 */}
      <div className="relative h-[600px] w-full  lg:-mx-8">
        <img
          src={Background}
          alt="background"
          className="absolute z-[-1] inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white"></div>
      
        <div className="relative text-center pt-36">
        <h1 className="text-2xl lg:text-3xl font-semibold mb-4 text-black">
            필요한 일을, 필요한 사람에게
          </h1>
          <h2 className="text-4xl lg:text-7xl font-bold text-black mb-12">
            지금 바로 SouF!
          </h2>

          <form onSubmit={handleSearch} className="w-full flex justify-center">
  <div className="relative w-2/3">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="원하는 일을 검색해보세요"
      className="w-full px-6 pr-12 py-3 text-sm lg:text-lg rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.25)]  mx-auto"
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

        {/* 카테고리 섹션 */}
        <div className="absolute bottom-[-30px] lg:bottom-[-100px] left-0 right-0 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-4 mt-4 flex-wrap">
              {categories.map((category, index) => {
                const categoryImages = [
                  cate1Img,
                  cate2Img,
                  cate3Img,
                  cate4Img,
                  cate5Img,
                ];
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(index + 1)}
                    className="flex flex-col items-center gap-1 sm:gap-2 min-w-0 flex-1 sm:flex-none sm:w-auto lg:w-40 px-1 sm:px-2"
                  >
                    <img
                      src={categoryImages[index]}
                      alt={category}
                      className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 object-cover mb-1 sm:mb-2 transform transition-transform duration-300 hover:-translate-y-2"
                    />
                    <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 hover:text-yellow-point transition-colors duration-200 text-center break-words">
                      {category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
       
      </div>

{/* 인기 공고문  */}
      <div className="relative mt-16 px-">
        <div className="relative flex flex-col  mx-auto lg:px-6 py-16 overflow-x-hidden">
        <h2 className="text-3xl font-bold mb-8 px-6 lg:px-24">
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
      <div className="relative px-6 lg:px-24 ">
        <div className="relative items-center  mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl lg:text-3xl font-bold mb-8">
            <span className="relative inline-block">
              <span className="relative z-10">인기있는 피드</span>
              <div className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 opacity-60 -z-10"></div>
            </span>
            <span className="ml-2">구경하러 가기</span>
          </h2>
          {feedLoading ? (
            <div className="text-center py-8">로딩중...</div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-6 justify-items-center transition-all duration-300 ease-in-out">
                {getCurrentFeedData().map((profile, index) => (
                  <PopularFeed
                    key={`${profile.feedId}-${currentFeedPage}-${index}`}
                    url={profile.mediaResDto?.fileUrl}
                    context={profile.categoryName}
                    username={profile.nickname}
                    feedId={profile.feedId}
                    memberId={profile.memberId}
                  />
                ))}
              </div>
              
              {/* 더보기 버튼 */}
              {currentFeedPage < 3 && feedData?.result?.length > currentFeedPage * 6 && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleLoadMoreFeeds}
                    disabled={isLoadingMore}
                    className={`px-6 py-3 bg-yellow-point text-white rounded-lg transition-colors duration-200 font-semibold ${
                      isLoadingMore 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-yellow-600'
                    }`}
                  >
                    {isLoadingMore ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        로딩중...
                      </div>
                    ) : (
                      `더보기`
                    )}
                  </button>
                </div>
              )}
              
              {/* 모든 피드를 로드했을 때 표시 */}
              {currentFeedPage >= 3 && (
                <div className="text-center mt-8">
                  <p className="text-gray-500 text-sm">모든 인기 피드를 확인했습니다!</p>
                </div>
              )}
            </>

          )}
        </div>
      </div>
'{/* 📌 공모전 정보 스키마 마크업 */}
      {competitions.map((competition, index) => {
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
      })}'
      {/* 공모전 정보 섹션 */}
      <div className="relative px-6 lg:px-24  mx-auto py-16">
        <div className="flex justify-between items-center px-4 sm:px-6 ">
          <h2 className="text-2xl lg:text-3xl font-bold mb-8">
            <span className="relative inline-block">
              <span className="relative z-10">공모전 정보</span>
              <div className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 opacity-60 -z-10"></div>
            </span>
            <span className="ml-2">모아보기</span>
          </h2>
          <button
            onClick={() => navigate("/contests")}
            className="px-4 py-2 bg-yellow-point text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
          >
            더보기
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 lg:px-0">
          {competitions.map((competition, index) => {
            // console.log("competition", competition);
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg duration-200 ease-out cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => navigate(`/contests/${competition.categoryID[0]}/${competition.contestID}`)}
              >
                {/* 썸네일 이미지 */}
                {competition.썸네일 && (
                  <div className="relative lg:h-[400px] w-auto rounded-t-xl overflow-hidden ">
                    {/* 로딩 스켈레톤 */}
                    {imageLoadingStates[index] && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                      </div>
                    )}
                    
                    <img
                      src={getImageUrl(competition.썸네일)}
                      alt={competition.제목}
                      className="w-full h-auto object-contain relative z-10"
                      onError={(e) => {
                        // console.log('Image load failed:', competition.썸네일);
                        
                        // 대체 URL 시도
                        const fallbackUrls = getFallbackUrls(competition.썸네일);
                        const currentIndex = fallbackUrls.indexOf(e.target.src);
                        const nextIndex = currentIndex + 1;
                        
                        if (nextIndex < fallbackUrls.length) {
                          // console.log('Trying fallback URL:', fallbackUrls[nextIndex]);
                          e.target.src = fallbackUrls[nextIndex];
                        } else {
                          // 모든 URL 시도 실패 시 플레이스홀더 표시
                          // console.log('All URLs failed, showing placeholder');
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center hidden z-20">
                      <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-yellow-700 text-sm font-medium">이미지 준비 중</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-2 lg:p-6">
                  <h1 className="text-md lg:text-xl font-bold mb-2 line-clamp-2">{competition.제목}</h1>
                  <h2 className="text-gray-600 mb-2 text-[12px] lg:text-base">주최: {competition.주최}</h2>
                  
                  {/* 공모분야 태그 */}
                  {competition.공모분야 && competition.공모분야.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {competition.공모분야.slice(0, 2).map((field, fieldIndex) => (
                        <h2
                          key={fieldIndex}
                          className="px-2 py-1 bg-yellow-point text-white text-[12px] lg:text-xs rounded-full"
                        >
                          {field}
                        </h2>
                      ))}
                    </div>
                  )}
                  
                  <div className="hidden lg:block flex flex-col gap-1 text-sm text-gray-500">
                    <h3>시상금: {competition.시상규모}</h3>
                    <h3>
                      접수기간: {competition.접수기간.시작일} ~ {competition.접수기간.마감일}
                    </h3>
                    <h3>참여대상: {competition.참여대상}</h3>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="hidden lg:block text-xs text-gray-400">
                      {competition.기업형태}
                    </span>
                    <span className="text-xs text-blue-600 font-medium ml-auto">
                      자세히 보기 →
                    </span>
                   
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
