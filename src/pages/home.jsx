import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import searchIco from "../assets/images/searchIco.svg";
import cate1Img from "../assets/images/cate1Img.svg";
import cate2Img from "../assets/images/cate2Img.svg";
import cate3Img from "../assets/images/cate3Img.svg";
import cate4Img from "../assets/images/cate4Img.svg";
import cate5Img from "../assets/images/cate5Img.svg";
import Background from "../assets/images/background.png";
import PopularFeed from "../components/home/popularFeed";
import { usePopularFeed } from "../hooks/usePopularFeed";
import { usePopularRecruit } from "../hooks/usePopularRecruit";
import { getFirstCategoryNameById } from "../utils/getCategoryById";
import buildingData from "../assets/competitionData/건축_건설_인테리어.json";
import marketingData from "../assets/competitionData/광고_마케팅.json";
import { calculateDday } from "../utils/getDate";
import Carousel from "../components/home/carousel";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [competitions, setCompetitions] = useState([]);
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  useEffect(() => {
    // 여러 카테고리에서 상위 공모전들을 가져와서 섞기
    const allCompetitions = [
      ...buildingData.slice(0, 1),
      ...marketingData.slice(0, 1)
    ];
    setCompetitions(allCompetitions);
    
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
  }, []);

  const categories = [
    "순수미술",
    "공예",
    "음악",
    "사진",
    "디지털 콘텐츠",
  ]

  // 이미지 URL 생성 함수
  const getImageUrl = (imagePath) => {
    console.log('getImageUrl called with:', imagePath);
    
    if (!imagePath) return null;
    
    // 이미 전체 URL인 경우 (상세내용_이미지)
    if (imagePath.startsWith('http')) {
      console.log('Returning full URL:', imagePath);
      return imagePath;
    }
    
    // 썸네일 이미지 처리 (예: "20250626/thumbnails\\594792.jpg")
    if (imagePath.includes('thumbnails')) {
      // 파일명만 추출 (594792.jpg)
      const parts = imagePath.split('\\');
      const fileName = parts[parts.length - 1];
      console.log('Extracted fileName from thumbnails:', fileName);
      
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
      
      console.log('Trying URL formats:', urlFormats);
      return urlFormats[0]; // 첫 번째 형식 반환
    }
    
    // 기타 경우
    const fileName = imagePath.split('\\').pop() || imagePath.split('/').pop();
    if (!fileName) return null;
    
    const imageId = fileName.replace(/\.(jpg|png|jpeg)$/i, '');
    const finalUrl = `https://media-cdn.linkareer.com//se2editor/image/${imageId}`;
    console.log('Generated other URL:', finalUrl);
    
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
    size: 12,
  };

  const { data: recruitData } = usePopularRecruit(pageable);
  const { data: feedData, isLoading: feedLoading } = usePopularFeed(pageable);
  console.log(feedData);
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

  return (
    <div className="relative">
      {/* 배경 이미지 섹션 */}
      <div className="relative h-[600px] w-screen">
        <img
          src={Background}
          alt="background"
          className="absolute z-[-1] inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white"></div>

        <div className="relative text-center pt-48">
          <h1 className="text-3xl font-semibold mb-4 text-black">
            필요한 일을, 필요한 사람에게
          </h1>
          <h2 className="text-7xl font-bold text-black mb-12">
            지금 바로 SouF!
          </h2>

          {/* 검색창 */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="원하는 일을 검색해보세요"
                className="w-full px-6 py-3 text-lg rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <img src={searchIco} alt="search" className="w-6 h-6" />
              </button>
            </div>
          </form>
        </div>

        {/* 카테고리 섹션 */}
        <div className="absolute bottom-[-100px] left-0 right-0 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center gap-8">
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
                    className="flex flex-col items-center gap-2 w-40"
                  >
                    <img
                      src={categoryImages[index]}
                      alt={category}
                      className="w-20 h-20 mb-2"
                    />
                    <span className="text-lg font-semibold text-gray-700 hover:text-yellow-point transition-colors duration-200 text-center">
                      {category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 인기 공고문 섹션 */}
      <div className="relative mt-16">
        <div className="relative flex flex-col max-w-6xl mx-auto px-6 py-16 overflow-x-hidden">
          <h2 className="text-2xl font-bold mb-8">
            인기있는 공고문 모집 보러가기
          </h2>
          <Carousel />
        </div>
      </div>

      {/* 인기 피드 섹션 */}
      <div className="relative">
        <div className="relative items-center max-w-full md:max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold mb-8">
            인기있는 피드 구경하러 가기
          </h2>
          {feedLoading ? (
            <div className="text-center py-8">로딩중...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-6">
              {feedData?.result?.content?.map((profile, index) => (
                <PopularFeed
                  key={index}
                  url={profile.mediaResDto?.fileUrl}
                  context={profile.categoryName}
                  username={profile.nickname}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 공모전 정보 섹션 */}
      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">공모전 정보 모아보기</h2>
          <button
            onClick={() => navigate("/contests")}
            className="px-4 py-2 bg-yellow-point text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
          >
            더보기
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {competitions.map((competition, index) => {
            // 카테고리 결정 (building, marketing 중 하나)
            let category = 'building';
            if (buildingData.includes(competition)) {
              category = 'building';
            } else if (marketingData.includes(competition)) {
              category = 'marketing';
            }
            
            // 해당 카테고리에서의 인덱스 찾기
            const categoryData = category === 'building' ? buildingData : marketingData;
            const contestIndex = categoryData.indexOf(competition);
            
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 hover:border-yellow-point transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => navigate(`/contests/${category}/${contestIndex}`)}
              >
                {/* 썸네일 이미지 */}
                {competition.썸네일 && (
                  <div className="relative h-48 rounded-t-xl overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100">
                    {/* 로딩 스켈레톤 */}
                    {imageLoadingStates[index] && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                      </div>
                    )}
                    
                    <img
                      src={getImageUrl(competition.썸네일)}
                      alt={competition.제목}
                      className="w-full h-full object-cover relative z-10"
                      onError={(e) => {
                        console.log('Image load failed:', competition.썸네일);
                        
                        // 대체 URL 시도
                        const fallbackUrls = getFallbackUrls(competition.썸네일);
                        const currentIndex = fallbackUrls.indexOf(e.target.src);
                        const nextIndex = currentIndex + 1;
                        
                        if (nextIndex < fallbackUrls.length) {
                          console.log('Trying fallback URL:', fallbackUrls[nextIndex]);
                          e.target.src = fallbackUrls[nextIndex];
                        } else {
                          // 모든 URL 시도 실패 시 플레이스홀더 표시
                          console.log('All URLs failed, showing placeholder');
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
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{competition.제목}</h3>
                  <p className="text-gray-600 mb-2">주최: {competition.주최}</p>
                  
                  {/* 공모분야 태그 */}
                  {competition.공모분야 && competition.공모분야.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {competition.공모분야.slice(0, 2).map((field, fieldIndex) => (
                        <span
                          key={fieldIndex}
                          className="px-2 py-1 bg-yellow-point text-white text-xs rounded-full"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-1 text-sm text-gray-500">
                    <span>시상금: {competition.시상규모}</span>
                    <span>
                      접수기간: {competition.접수기간.시작일} ~ {competition.접수기간.마감일}
                    </span>
                    <span>참여대상: {competition.참여대상}</span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {competition.기업형태}
                    </span>
                    <span className="text-xs text-blue-600 font-medium">
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
