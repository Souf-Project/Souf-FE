import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import searchIco from "../assets/images/searchIco.svg";
import loginImg from "../assets/images/loginImg.svg";
import secondCategoryData from "../assets/categoryIndex/second_category.json";
import { usePopularRecruit } from "../hooks/usePopularRecruit";
import { 
  BestRecruit, 
  FeedGrid, 
  ReviewBox, 
  InfoBox, 
  MatchingPrice, 
  StatisticsSection, 
  ContestSection, 
  SmallContestSection ,
  EstimateBanner
} from "../components/home";
import { getContests } from "../api/contest";
import { getMainViewCount } from "../api/home";
import { UserStore } from "../store/userStore";
import useCountUp from "../hooks/useCountUp";
import SEO from "../components/seo";
import Loading from "../components/loading";
import AlertModal from "../components/alertModal";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import mobileGif1 from "../assets/images/mobileGif1.gif";
import mobileGif2 from "../assets/images/mobileGif2.gif";

import cateIcon11 from "../assets/images/categoryIcons/cateIcon11.png";
import cateIcon12 from "../assets/images/categoryIcons/cateIcon12.png";
import cateIcon13 from "../assets/images/categoryIcons/cateIcon13.png";
import cateIcon24 from "../assets/images/categoryIcons/cateIcon24.png";
import cateIcon25 from "../assets/images/categoryIcons/cateIcon25.png";
import cateIcon26 from "../assets/images/categoryIcons/cateIcon26.png";
import cateIcon27 from "../assets/images/categoryIcons/cateIcon27.png";
import cateIcon38 from "../assets/images/categoryIcons/cateIcon38.png";
import cateIcon49 from "../assets/images/categoryIcons/cateIcon49.png";
import cateIcon410 from "../assets/images/categoryIcons/cateIcon410.png";
import cateIcon411 from "../assets/images/categoryIcons/cateIcon411.png";
import cateIcon512 from "../assets/images/categoryIcons/cateIcon512.png";
import cateIcon513 from "../assets/images/categoryIcons/cateIcon513.png";
import cateIcon514 from "../assets/images/categoryIcons/cateIcon514.png";
import cateIcon515 from "../assets/images/categoryIcons/cateIcon515.png";
import cateIcon516 from "../assets/images/categoryIcons/cateIcon516.png";
import cateIcon517 from "../assets/images/categoryIcons/cateIcon517.png";
import cateIcon518 from "../assets/images/categoryIcons/cateIcon518.png";
import cateIcon619 from "../assets/images/categoryIcons/cateIcon619.png";
import cateIcon620 from "../assets/images/categoryIcons/cateIcon620.png";
import cateIcon621 from "../assets/images/categoryIcons/cateIcon621.png";
import cateIcon622 from "../assets/images/categoryIcons/cateIcon622.png";
import part1_1 from "../assets/images/mainGuide/part1_1.png";
import part1_2 from "../assets/images/mainGuide/part1_2.png";
import part1_3 from "../assets/images/mainGuide/part1_3.png";
import part2 from "../assets/images/mainGuide/part2.png";
import spoonMark from "../assets/images/spoonMark.svg";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [competitions, setCompetitions] = useState([]);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [statsData, setStatsData] = useState({
    todayVisitor: 0,
    studentCount: 0,
    recruitCount: 0
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const { memberId, roleType } = UserStore();

  // 캐러셀 데이터
  const carouselData = [
    {
      title: "클라이언트 리뷰",
      description: "프로젝트를 진행한 클라이언트의 생생한 후기를 통해 검증된 전문가를 만나보세요.",
      icon: part1_2
    },
    {
      title: "대학생 인증 제도",
      description: "회원가입 시 대학교 신분 인증을 받습니다.(대학생, 석사,박사, 동아리  등)",
      icon: part1_1
    },
    {
      title: "포트폴리오 검증",
      description: "검증된 포트폴리오를 통해 전문가의 역량과 경험을 한눈에 확인해보세요.",
      icon: part1_3
    }
  ];

  // 무한 반복을 위한 확장된 데이터 (앞뒤로 복제)
  const extendedCarouselData = [
    ...carouselData,
    ...carouselData,
    ...carouselData
  ];

  // 세로 스와이퍼 데이터
  const verticalSwiperData = [
    {
      title: "안전한 계약 시스템",
    },
    {
      title: "외주 계약서 중개",
    },
    {
      title: "금액 제안 받아보기 ",
    }
  ];

  // 세로 스와이퍼 확장 데이터
  const extendedVerticalData = [
    ...verticalSwiperData,
    ...verticalSwiperData,
    ...verticalSwiperData
  ];

  const checkRecruitUploadAccess = () => {
    if (!memberId) {
      setShowAlertModal(true);
      return false;
    }
    if (roleType !== "MEMBER" && roleType !== "ADMIN") {
      setShowAlertModal(true);
      return false;
    }
    return true;
  };

  const handleRecruitUploadClick = () => {
    if (checkRecruitUploadAccess()) {
      navigate("/recruitUpload");
    }
  };

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (category) => {
    // 해당 중분류가 선택된 상태로 외주 페이지로 이동
    navigate(`/recruit?firstCategory=${category.first_category_id}&secondCategory=${category.second_category_id}`);
  };

  const titletext = [
    "패션 브랜드 팝업 조형물",
    "애니메이션 영상 제작",
    "브랜드 로고 디자인",
    "반응형 웹·앱 디자인",
    "SNS·썸네일 디자인",
  ]
  const AnimatedTitle = () => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        setIsExiting(true);
        setTimeout(() => {
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % titletext.length);
          setIsExiting(false);
        }, 700);
        
      }, 3000);

      return () => clearInterval(interval);
    }, []);

    return (
      <h1 
        className={`text-2xl lg:text-5xl font-bold text-blue-500 text-center lg:text-left transition-transform duration-700 ease-in-out
          ${isExiting ? 'animate-slide-up' : 'animate-slide-down'}`}
      >
        {titletext[currentTextIndex]}
      </h1>
    );
  };

  const getCategoryIcon = (categoryId) => {
    const iconMap = {
      1: cateIcon11,
      2: cateIcon12,
      3: cateIcon13,
      4: cateIcon24,
      5: cateIcon25,
      6: cateIcon26,
      7: cateIcon27,
      8: cateIcon38,
      9: cateIcon49,
      10: cateIcon410,
      11: cateIcon411,
      12: cateIcon512,
      13: cateIcon513,
      14: cateIcon514,
      15: cateIcon515,
      16: cateIcon516,
      17: cateIcon517,
      18: cateIcon518,
      19: cateIcon619,
      20: cateIcon620,
      21: cateIcon621,
      22: cateIcon622,
    };
    return iconMap[categoryId] || "/src/assets/images/categoryIcons/cateIcon11.png";
  };


  const categoryItems = secondCategoryData.second_category;

  // 이미지 URL 생성 함수
  const getImageUrl = (imagePath) => {

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


  const showLoginModalHandler = () => {
    setShowLoginModal(true);
  };

  const closeLoginModalHandler = () => {
    setShowLoginModal(false);
  };

  const handleGuideClick = () => {
    setShowGuideModal(true);
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
      <div className="w-full max-w-[60rem] h-[680px] bg-red-500 mx-auto"></div>
        <div className="relative bg-[#FBFBFB] w-screen mx-auto">
        <div className="flex justify-center items-start max-w-[30rem] lg:max-w-[60rem] mx-auto">
          {/* 왼쪽: 타이틀과 검색, 카테고리 */}
          <div className="max-w-2xl lg:max-w-4xl lg:mt-24 lg:mr-20">
          <AnimatedTitle />
            <h2 className="text-2xl lg:text-5xl font-bold text-black mb-8 text-center lg:text-left whitespace-nowrap">
              여기! 인재 매칭해드려요.
            </h2>
            <h3 className="text-lg font-semibold text-gray-700 mb-12 text-center lg:text-left">우리나라 인재발굴 프로젝트!<br/>
            스프에서 성공적인 외주 매칭을  경험해보세요.</h3>
            <div className="flex justify-center lg:justify-start gap-4">
              <button className="text-white bg-[#1E77D1] px-6 py-4 font-semibold rounded-3xl whitespace-nowrap shadow-md text-xl hover:shadow-lg"
              onClick={handleRecruitUploadClick}>무료 외주 등록하기</button>
              {/* <button 
                className="text-black bg-white border-[3px] border-blue-main px-6 py-4 font-semibold rounded-3xl whitespace-nowrap shadow-md text-xl hover:shadow-lg"
                onClick={handleGuideClick}
              >
                이용 가이드
              </button> */}
            </div>
            {/* <form onSubmit={handleSearch} className="w-full lg:mt-20">
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
            </form> */}
            
          </div>
          {/* 오른쪽: 팝업 가이드 박스 */}
          <InfoBox />
          </div>
        </div>
        {/* <StatisticsSection 
          viewCount={viewCount}
          userCount={userCount}
          recruitCount={recruitCount}
        /> */}

     {/* 카테고리 섹션 */}
     <div className="flex flex-wrap gap-4 lg:gap-6 justify-center items-center mx-auto lg:w-full bg-blue-bright py-4 md:py-8 lg:h-68 shadow-md px-0 md:px-4 lg:px-0 max-w-screen">
       <div className="flex flex-col justify-center gap-2 items-center w-screen md:px-8 lg:px-0 lg:max-w-[60rem] mx-auto">
       <span className="text-black text-xl lg:text-2xl font-bold mr-auto ml-4 md:ml-0">어떤 아이디어/프로젝트가 필요하세요?</span>
       <div className="flex items-center justify-between w-full">
        {/* 좌측 화살표 */}
        <div className="flex items-center justify-center w-8 h-8 pointer-events-none">
             <svg 
               className="w-5 h-5 text-gray-400" 
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24"
               style={{
                 animation: 'bounceLeft 1.5s ease-in-out infinite'
               }}
             >
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
             </svg>
           </div>

      <div className="w-full overflow-x-auto py-4 scrollbar-hide mt-4">
        
        <div className="grid grid-rows-2 md:flex md:flex-nowrap gap-1 items-start md:items-center" style={{ width: 'max-content', gridAutoFlow: 'column', gridAutoColumns: 'max-content' }}>
          
           
           {Array.isArray(categoryItems) && categoryItems.map((category) => (
             <div 
               key={category.second_category_id} 
               className="flex flex-col justify-start gap-2 items-center cursor-pointer flex-shrink-0 md:w-28 w-20 md:h-32 h-24 hover:scale-105 transition-transform duration-200"
               onClick={() => handleCategoryClick(category)}
             >
               <div className="md:w-16 md:h-16 w-10 h-10 bg-white md:rounded-2xl rounded-lg shadow-sm flex items-center justify-center p-2 hover:shadow-md transition-shadow duration-200">
                 <img 
                   src={getCategoryIcon(category.second_category_id)} 
                   alt={category.name}
                   className="w-full h-full object-contain"
                 />
              </div>
               <div className="text-zinc-600 text-xs md:text-sm lg:text-md font-semibold text-center max-w-16 md:max-w-none" style={{ wordBreak: 'keep-all', whiteSpace: 'normal', lineHeight: '1.3' }}>{category.name}</div>
              </div>
           ))}
              </div>
            </div>
            {/* 우측 화살표 */}
 <div className="flex items-center justify-center w-8 h-8 pointer-events-none">
             <svg 
               className="w-5 h-5 text-gray-400" 
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24"
               style={{
                 animation: 'bounceRight 1.5s ease-in-out infinite'
               }}
             >
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
             </svg>
           </div>
            </div>
 
           </div>
            </div>
     
<div className="flex flex-col lg:flex-row mt-32 max-w-[60rem] mx-auto  w-screen px-8 lg:px-0 ">
{/* 실시간 대학생 피드 섹션 */}
  <div className="relative w-full lg:w-2/3">
  <div className="flex items-center mb-8 gap-4">
  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
        실시간 대학생 피드
          </h2>
    <span className="font-NanumGothicCoding text-sm sm:text-base lg:text-lg font-bold text-white bg-blue-500/70 py-0.5 px-3 rounded-lg">NEW</span>
  </div>
       
          <FeedGrid />
        </div>
    
{/* 진행 중인 외주 의뢰 섹션 */}
      {/* 진행 중인 외주 의뢰 섹션 */}
          <div className="relative w-full lg:w-1/3 lg:ml-4">
            <div className="flex items-center mb-6 sm:mb-8 gap-3 sm:gap-4 flex-wrap">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                진행 중인 외주 의뢰
              </h2>
              <span className="font-NanumGothicCoding text-sm sm:text-base lg:text-lg font-bold text-white bg-orange-300 py-0.5 px-2 sm:px-3 rounded-lg">
                BEST
              </span>
            </div>
            <BestRecruit />
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-4">
              <button 
                className="bg-[#2582E0] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 sm:py-3 rounded-xl w-full hover:shadow-md whitespace-nowrap transition-shadow"
                onClick={handleRecruitUploadClick}
              >
                무료 외주 등록하기
              </button>
              <button 
                className="bg-zinc-300 text-zinc-700 text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 sm:py-3 rounded-xl w-full hover:shadow-md whitespace-nowrap transition-shadow"
                onClick={() => navigate("/recruit")}
              >
                더 많은 외주 찾아보기
              </button>
            </div>
          </div>
        </div>

    
{/* 스프 소개란 */}
<div className="relative px-8 lg:px-24 mt-32 bg-[#2582E0BF] mx-auto">
<div className=" md:max-w-[60rem] mx-auto flex flex-col lg:flex-row justify-center items-center py-16">
  <div className="flex flex-col items-start">
    <h2 className="my-8 text-white text-2xl md:text-4xl font-extrabold [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">
      왜 스프일까요?<br/>
    왜 대학생 인재를 발굴할까요?</h2>
    <p className="my-2 text-stone-50 text-md md:text-lg font-bold">기업 외주비용 “너무 비싸요..”</p>
    <p className="my-2 text-stone-50 text-md md:text-lg font-bold">“트렌디하고, 캐주얼한 아이디어를 모아보고 싶어요!”</p>
    <p className="text-stone-50 text-md md:text-lg font-bold">“팝업스토어 조형물.. 교수님 커미션은 그만!!”</p>
  </div>
  
<img src={loginImg} alt="왜 대학생 인재를 발굴할까요?" className="md:w-[24rem] w-36 md:ml-12 mt-4 md:mt-0"/>
</div>

</div>
  
      {/* <div className="text-xl lg:text-3xl font-bold mb-8 mt-32 text-center">
        <span className="text-blue-500">스프</span>
        에서 이렇게 
        <span className="text-blue-500"> 작업</span>했어요!</div> */}

{/* 후기 섹션 */}

        {/* <ReviewBox /> */}

      {/* 실시간 매칭 금액 섹션 */}
  {/* <div className="flex mt-32 max-w-[60rem] mx-auto flex-col gap-4"> */}
    {/* <div className="flex items-center mb-8 gap-4">
      <h2 className="text-2xl font-semibold">
        실시간 매칭 금액
          </h2>
      <span className="font-NanumGothicCoding text-md font-semibold text-white bg-blue-500/70 py-0.5 px-3 rounded-lg">추천</span>
   
              </div>
  <div className="flex items-center justify-around">
  <MatchingPrice price={300} category="웹사이트 제작" project="연계 IT 중앙동아리 프로젝트" />
  <MatchingPrice price={3} category="로고/브랜딩" project="연계 디자이너 프로젝트" />
  <MatchingPrice price={90} category="조형물 기획/제작" project="전공 연구실 견적" />
  <MatchingPrice price={30} category="브랜드 로고 디자인" type="satisfaction" />
              </div>
              */}
      {/* <div className="flex flex-col gap-4 px-6 lg:px-24">
        {competitions.length === 0 ? (
          <Loading text="공모전 정보를 불러오는 중..." />
        ) : (
          <> */}
            {/* <ContestSection 
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
            <button
                  onClick={() => navigate("/contests")}
                  className="w-48 mt-8 mx-auto px-8 py-3 text-lg font-bold bg-yellow-point text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  공모전 더보기
                </button>
          </>
        )}
      </div> */}
      {/* </div> */}

      {/* 무료 외주 등록 섹션 */}
      {/* <div className="flex mt-32  w-screen px-8 lg:px-0 lg:max-w-[60rem] mx-auto">
        <EstimateBanner color="black" />
      </div> */}
   {/* 믿을 수 있는 전문가 매칭 섹션 */}
   <div className="flex flex-col gap-6 sm:gap-8 justify-between mt-12 sm:mt-20 lg:mt-32 max-w-[90%] sm:max-w-[60rem] mx-auto px-4 sm:px-0">
          <div className="flex flex-col lg:flex-row w-full justify-between items-center lg:items-end gap-6 lg:gap-8">
            <div className="text-center lg:text-left w-full lg:w-auto">
              <p className="text-sm sm:text-base lg:text-lg font-bold">믿을 수 있는 전문가 매칭</p>
              <p className="text-xl sm:text-2xl lg:text-4xl font-bold mt-2 sm:mt-3 lg:mt-4">포트폴리오를 기반한</p>
              <p className="text-xl sm:text-2xl lg:text-4xl font-bold">검증된 학생들로 이루어진 전문가</p>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-[#7393BA] mt-2">
                대학생, 석사, 박사, 동아리, 연구실 등 인증된
              </p>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-[#7393BA]">전문가를 만나보세요.</p>
            </div>
            <img src={mobileGif1} alt="믿을 수 있는 전문가 매칭" className="block md:hidden w-full h-40 sm:h-48 lg:h-52 object-contain mt-4" />
            <div className="hidden md:block h-40 sm:h-48 lg:h-52 w-full lg:max-w-[28rem]">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={1.5}
                centeredSlides={true}
                loop={true}
                loopAdditionalSlides={2}
                initialSlide={3}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                  reverseDirection: false,
                }}
                speed={500}
                navigation={false}
                pagination={{
                  clickable: true,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 0,
                  },
                }}
                className="carousel-swiper"
              >
                {extendedCarouselData.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="carousel-box w-32 sm:w-36 lg:w-40 h-36 sm:h-44 lg:h-48 bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 sm:p-5 lg:p-6 flex flex-col justify-center items-center text-center transition-all duration-300 hover:shadow-xl mx-auto">
                      <h3 className="text-xs sm:text-sm lg:text-md font-semibold mb-1 sm:mb-2">{item.title}</h3>
                      <img 
                        src={item.icon} 
                        alt={item.title} 
                        className="w-10 sm:w-14 lg:w-16 h-10 sm:h-14 lg:h-16 object-contain my-1 sm:my-2" 
                      />
                      <p className="text-[0.45rem] sm:text-[0.5rem] lg:text-[0.56rem] text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        {/* 안전하고 빠른 금액 중개 섹션 */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 justify-between mt-12 sm:mt-20 sm:w-[60%] lg:mt-32 max-w-[90%] sm:max-w-[60rem] mx-auto px-4 sm:px-0">
          
          <div className="hidden sm:block w-full lg:w-[30rem] h-48 sm:h-56 lg:h-60 order-2 lg:order-1">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              direction="vertical"
              spaceBetween={0}
              slidesPerView={3}
              centeredSlides={true}
              loop={true}
              loopAdditionalSlides={2}
              initialSlide={3}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                reverseDirection: false,
              }}
              speed={500}
              navigation={false}
              pagination={{
                clickable: true,
              }}
              className="vertical-swiper"
            >
              {extendedVerticalData.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="vertical-box w-full h-24 lg:h-32 bg-white rounded-lg shadow-lg border-2 border-gray-200 p-2 flex pl-3 sm:pl-4 justify-start items-center text-stone-800 transition-all duration-300 hover:shadow-xl">
                    <img 
                      src={spoonMark} 
                      alt="spoonMark" 
                      className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 object-contain mr-2" 
                    />
                    <h3 className="text-xs sm:text-sm font-bold text-stone-800">
                      {item.title}
                    </h3>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          
          <div className="text-center lg:text-left order-1 lg:order-2"> 
            <p className="text-sm sm:text-base lg:text-lg font-bold">안전하고 빠른 금액 중개</p>
            <p className="text-xl sm:text-2xl lg:text-4xl font-bold mt-2 sm:mt-3 lg:mt-4">국내 최초 외주 계약서 적용,</p>
            <p className="text-xl sm:text-2xl lg:text-4xl font-bold">금액 제시 및 추천 받기!</p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-[#7393BA] mt-2">
              금액을 정해놓지 않으셨다면, 금액도 추천받을 수
            </p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-[#7393BA]">
              있습니다. 지금 당장 공고를 등록해보세요!
            </p>
          </div>
        </div>
        <img src={mobileGif2} alt="안전하고 빠른 금액 중개" className="block sm:hidden w-full h-40 sm:h-48 lg:h-52 object-contain mt-4" />

        {/* 국내 최초 대학생 외주 매칭 플랫폼 섹션 */}
        <div className="flex flex-col gap-6 sm:gap-8 justify-between max-w-[90%] sm:max-w-[60rem] mx-auto mt-12 sm:mt-16 lg:mt-24 px-4 sm:px-0">
          <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-6 lg:gap-8">
            <div className="text-center lg:text-left w-full lg:w-auto">
              <p className="text-sm sm:text-base lg:text-lg font-bold">국내 최초 대학생 외주 매칭 플랫폼</p>
              <p className="text-xl sm:text-2xl lg:text-4xl font-bold mt-2 sm:mt-3 lg:mt-4">합리적이고, 퀄리티 높은</p>
              <p className="text-xl sm:text-2xl lg:text-4xl font-bold">작업이 필요하시다면?</p>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-[#7393BA] mt-2">더욱 자세한 이용가이드는</p>
              <p className="text-sm sm:text-base lg:text-lg font-bold text-[#7393BA]">
                스프 플랫폼 가이드라인을 확인해보세요!
              </p>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <img 
                src={part2} 
                alt="국내 최초 대학생 외주 매칭 플랫폼" 
                className="w-40 sm:w-48 lg:w-64 h-40 sm:h-48 lg:h-64 object-contain" 
              />
              <button 
                className="text-[#7393BA] text-xs sm:text-sm mt-4 sm:mt-6 lg:mt-8 hover:underline transition-all"
                onClick={() => navigate("/guide")}
              >
                가이드라인 보러가기!
              </button>
            </div>
          </div>
        </div>

        {/* 무료 외주 등록 배너 */}
        <div className="flex justify-center my-12 sm:my-20 lg:my-32 w-full px-4 sm:px-8 lg:px-0 max-w-[90%] sm:max-w-[60rem] mx-auto">
          <EstimateBanner color="blue" />
        </div>

        {/* Alert Modal */}
        {showAlertModal && (
          <AlertModal
            type="simple"
            title="로그인 후 이용해주세요."
            description="외주 등록은 일반 회원만 이용할 수 있습니다."
            TrueBtnText="로그인하러 가기"
            FalseBtnText="취소"
            onClickTrue={() => {
              setShowAlertModal(false);
              navigate("/login");
            }}
            onClickFalse={() => setShowAlertModal(false)}
          />
        )}
      </div>

      <style>{`
        @keyframes bounceLeft {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-5px); }
        }
        
        @keyframes bounceRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        
        @keyframes slide-up {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-20px); opacity: 0; }
        }
        
        @keyframes slide-down {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-slide-up {
          animation: slide-up 0.7s ease-in-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.7s ease-in-out;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .swiper-pagination-bullet {
          background: #2582E0;
        }

        .swiper-pagination-bullet-active {
          background: #1E77D1;
        }

        /* 모바일에서 스와이퍼 슬라이드 중앙 정렬 */
        @media (max-width: 640px) {
          .carousel-swiper .swiper-slide {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

        /* 터치 디바이스에서 호버 효과 비활성화 */
        @media (hover: none) {
          .hover\\:scale-105:hover {
            transform: none;
          }
          .hover\\:shadow-md:hover,
          .hover\\:shadow-lg:hover,
          .hover\\:shadow-xl:hover {
            box-shadow: inherit;
          }
        }
      `}</style>
    </>
  );
}
