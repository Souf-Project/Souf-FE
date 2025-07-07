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
import competitionData from "../assets/competitionData/건축_건설_인테리어.json";
import { calculateDday } from "../utils/getDate";
import Carousel from "../components/home/carousel";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    // JSON 데이터에서 상위 3개만 가져오기
    setCompetitions(competitionData.slice(0, 3));
  }, []);

  const categories = [
    "순수미술",
    "공예",
    "음악",
    "사진",
    "디지털 콘텐츠",
  ];

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
    const encoded = encodeURIComponent(category);
    navigate(`/recruit?category=${encoded}`);
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
                    onClick={() => handleCategoryClick(category)}
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
            onClick={() => navigate("/competitions")}
            className="px-4 py-2 bg-yellow-point text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
          >
            더보기
          </button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {competitions.map((competition, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:border-yellow-point transition-colors duration-200"
            >
              <h3 className="text-xl font-bold mb-2">{competition.제목}</h3>
              <p className="text-gray-600 mb-2">주최: {competition.주최}</p>
              <div className="flex flex-col gap-1 text-sm text-gray-500">
                <span>시상금: {competition.시상규모}</span>
                <span>
                  접수기간: {competition.접수기간.시작일} ~{" "}
                  {competition.접수기간.마감일}
                </span>
                <span>참여대상: {competition.참여대상}</span>
              </div>
              <a
                href={competition.홈페이지}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                자세히 보기
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
