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

  const titletext = [
    "패션 브랜드 팝업 조형물",
    "애니메이션 영상 제작",
    "브랜드 로고 디자인",
    "반응형 웹·앱 디자인",
    "SNS·썸네일 디자인",
  ]

  const getCategoryIcon = (categoryId) => {
    const iconMap = {
      1: "/src/assets/images/categoryIcons/cateIcon11.png", // 일러스트·캐릭터 디자인
      2: "/src/assets/images/categoryIcons/cateIcon12.png", // 글자 디자인
      3: "/src/assets/images/categoryIcons/cateIcon13.png", // 순수 미술
      4: "/src/assets/images/categoryIcons/cateIcon24.png", // 시제품 디자인
      5: "/src/assets/images/categoryIcons/cateIcon25.png", // 산업·제품 디자인
      6: "/src/assets/images/categoryIcons/cateIcon26.png", // 패션·텍스타일 디자인
      7: "/src/assets/images/categoryIcons/cateIcon27.png", // 조형 예술
      8: "/src/assets/images/categoryIcons/cateIcon38.png", // 음향
      9: "/src/assets/images/categoryIcons/cateIcon49.png", // 사진
      10: "/src/assets/images/categoryIcons/cateIcon410.png", // 영상
      11: "/src/assets/images/categoryIcons/cateIcon411.png", // 영화
      12: "/src/assets/images/categoryIcons/cateIcon512.png", // 브랜드 디자인
      13: "/src/assets/images/categoryIcons/cateIcon513.png", // 산업 디자인
      14: "/src/assets/images/categoryIcons/cateIcon514.png", // 웹·모바일 디자인
      15: "/src/assets/images/categoryIcons/cateIcon515.png", // 마케팅 디자인
      16: "/src/assets/images/categoryIcons/cateIcon516.png", // 컴퓨터 그래픽·모션 그래픽
      17: "/src/assets/images/categoryIcons/cateIcon517.png", // 게임 디자인
      18: "/src/assets/images/categoryIcons/cateIcon518.png", // 애니메이션
      19: "/src/assets/images/categoryIcons/cateIcon619.png", // 웹사이트
      20: "/src/assets/images/categoryIcons/cateIcon620.png", // 안드로이드
      21: "/src/assets/images/categoryIcons/cateIcon621.png", // IOS
      22: "/src/assets/images/categoryIcons/cateIcon622.png", // 게임 프로그래밍
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
        <div className="relative bg-[#FBFBFB] py-20">
        <div className="flex justify-center items-start max-w-[100rem] mx-auto">
          {/* 왼쪽: 타이틀과 검색, 카테고리 */}
          <div className="flex-1 max-w-2xl lg:max-w-3xl lg:mt-28 lg:ml-20">
            <h1 className="lg:block text-4xl lg:text-6xl font-bold mb-4 text-blue-main text-center lg:text-left">
            패션 브랜드 팝업 조형물
            </h1>
            <h2 className="text-6xl lg:text-6xl font-bold text-black mb-8 text-center lg:text-left">
              여기! 인재 매칭해드려요.
            </h2>
            <h3 className="text-xl font-bold text-gray-700 mb-12 text-center lg:text-left">우리나라 인재발굴 프로젝트!<br/>
            스프에서 성공적인 외주 매칭을  경험해보세요.</h3>
            <div className="flex justify-center lg:justify-start gap-4">
              <button className="text-white bg-[#1E77D1] px-10 py-6 font-bold rounded-3xl whitespace-nowrap shadow-md text-2xl hover:shadow-lg">무료 외주 등록하기</button>
              <button className="text-black bg-white border-[3px] border-blue-main px-10 py-6 font-bold rounded-3xl whitespace-nowrap shadow-md text-2xl hover:shadow-lg ">이용 가이드</button>
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
     <div className="flex flex-wrap gap-4 lg:gap-6 justify-center items-center w-full bg-[#F5F9FF] py-8 lg:h-68 shadow-md px-4 lg:px-0">
       <div className="flex flex-col justify-center gap-2 items-center max-w-[100rem] mx-auto px-24">
       <span className="text-black text-4xl font-bold mr-auto">어떤 아이디어/프로젝트가 필요하세요?</span>
       <div className="w-full overflow-x-auto py-4 scrollbar-hide mt-4">
         <div className="flex gap-12 items-center" style={{ width: 'max-content' }}>
           {Array.isArray(categoryItems) && categoryItems.map((category) => (
             <div key={category.second_category_id} className="flex flex-col justify-start gap-2 items-center cursor-pointer flex-shrink-0 w-28 h-36">
               <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center p-2">
                 <img 
                   src={getCategoryIcon(category.second_category_id)} 
                   alt={category.name}
                   className="w-full h-full object-contain"
                 />
               </div>
               <div className="text-zinc-600 text-sm lg:text-lg font-bold text-center" style={{ wordBreak: 'keep-all', whiteSpace: 'normal', lineHeight: '1.3' }}>{category.name}</div>
             </div>
           ))}
         </div>
       </div>
       </div>
     </div>
     
<div className="flex px-24 mt-32 max-w-[100rem] mx-auto">
{/* 실시간 대학생 피드 섹션 */}
  <div className="relative w-2/3">
  <div className="flex items-center mb-8 gap-4">
  <h2 className="text-2xl lg:text-4xl font-bold">
        실시간 대학생 피드
          </h2>
    <span className="font-NanumGothicCoding text-xl font-bold text-white bg-blue-500/70 py-1 px-4 rounded-xl">NEW</span>
  </div>
       
          <FeedGrid />
        </div>
    
{/* 진행 중인 외주 의뢰 섹션 */}
      <div className="relative w-1/3">
      <div className="flex items-center mb-8 gap-4">
        <h2 className="text-2xl lg:text-4xl font-bold">
        진행 중인 외주 의뢰
        </h2>
      <span className="font-NanumGothicCoding text-xl font-bold text-white bg-orange-300 py-1 px-4 rounded-xl">BEST</span>
      </div>
          <BestRecruit />
          <div className="flex justify-center items-center gap-4 mt-8">
            <button className="bg-[#2582E0] text-white text-[1.4rem] font-extrabold px-6 py-3 rounded-xl">무료 외주 등록하기</button>
            <button className="bg-zinc-300 text-zinc-700 text-[1.4rem] font-extrabold px-6 py-3 rounded-xl">더 많은 외주 찾아보기</button>
          </div>
      </div>
      </div>
    
{/* 스프 소개란 */}
<div className="relative px-6 lg:px-24 mt-32 bg-[#2582E0BF]">
<div className="max-w-[100rem] mx-auto flex justify-center items-center py-16">
  <div className="flex flex-col items-start">
    <h2 className="my-8 text-white text-6xl font-extrabold [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">
      왜 스프일까요?<br/>
    왜 대학생 인재를 발굴할까요?</h2>
    <p className="my-4 text-stone-50 text-4xl font-bold">기업 외주비용 “너무 비싸요..”</p>
    <p className="my-4 text-stone-50 text-2xl font-bold">“트렌디하고, 캐주얼한 아이디어를 모아보고 싶어요!”</p>
    <p className="text-stone-50 text-2xl font-bold">“팝업스토어 조형물.. 교수님 커미션은 그만!!”</p>
  </div>
  
<img src={loginImg} alt="왜 대학생 인재를 발굴할까요?" className="w-[28rem]"/>
</div>

</div>

      <div className="text-2xl lg:text-5xl font-bold mb-8 mt-32 text-center">
        <span className="text-blue-500">스프</span>
        에서 이렇게 
        <span className="text-blue-500"> 작업</span>했어요!</div>

{/* 후기 섹션 */}

        <ReviewBox />

      {/* 실시간 매칭 금액 섹션 */}
    <div className="flex px-24 mt-32 max-w-[100rem] mx-auto flex-col gap-4">
    <div className="flex items-center mb-8 gap-4">
      <h2 className="text-2xl lg:text-4xl font-bold">
        실시간 매칭 금액
      </h2>
      <span className="font-NanumGothicCoding text-xl font-bold text-white bg-blue-500/70 py-1 px-4 rounded-xl">추천</span>
   
  </div>
  <div className="flex items-center justify-around">
  <MatchingPrice price={300} category="웹사이트 제작" project="연계 IT 중앙동아리 프로젝트" />
  <MatchingPrice price={3} category="로고/브랜딩" project="연계 디자이너 프로젝트" />
  <MatchingPrice price={90} category="조형물 기획/제작" project="전공 연구실 견적" />
  <MatchingPrice price={30} category="브랜드 로고 디자인" type="satisfaction" />
  </div>
 
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

            <div className="relative pt-20">
              <SmallContestSection 
                competitions={competitions}
                imageLoadingStates={imageLoadingStates}
                getImageUrl={getImageUrl}
                getFallbackUrls={getFallbackUrls}
              />
              <div className="absolute inset-0 bg-white/50 backdrop-blur-lg z-20"></div>
              
              <div className="absolute top-36 left-1/2 transform -translate-x-1/2 z-30">
                <button
                  onClick={() => navigate("/contests")}
                  className="px-8 py-3 text-lg font-bold bg-yellow-point text-white rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  공모전 더보기
                </button>
              </div>
            </div> */}
          {/* </>
        )}
      </div> */}
      </div>

      {/* 무료 외주 등록 섹션 */}
      <div className="flex px-24 mt-32 max-w-[100rem] mx-auto">
        <EstimateBanner color="black" />
      </div>

      <div className="flex gap-8 justify-between px-24 mt-32 max-w-[100rem] mx-auto">
        <div className="w-full bg-blue-400/10 rounded-xl p-16">
        <p className="text-2xl font-bold">외주를 등록하러 오셨나요?</p>
        <p className="text-lg font-bold">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis luctus nisl quis ex porta, quis tristique sapien venenatis. Morbi aliquet ipsum tortor, non volutpat elit feugiat quis. Sed in magna lectus. Pellentesque quis condimentum lectus. Donec in lobortis sem, a viverra enim. In non justo eleifend, volutpat dolor eget, consequat ante. In a lorem nec mi ultrices porta id nec odio. Duis mattis ligula tellus, eu convallis ligula faucibus quis. Nam consequat tristique orci, ac laoreet nibh tempor ut. Etiam lobortis lorem ac ullamcorper interdum. Cras dolor sem, fringilla at vestibulum vitae, feugiat quis augue. Aliquam erat volutpat. Suspendisse scelerisque laoreet risus non lobortis. Proin dignissim, ex eget imperdiet blandit, urna lorem luctus nunc, nec eleifend nisi erat a sapien.

Proin facilisis, velit ut commodo interdum, velit nunc tincidunt ex, vel pharetra quam mi quis metus. Donec suscipit accumsan libero at rutrum. Maecenas sit amet tincidunt nisl. Ut luctus euismod nibh ac maximus. Nunc nisi massa, bibendum sed blandit et, interdum in sapien. Aliquam dictum venenatis risus, in imperdiet velit vehicula eget.</p>
        </div>
        <div className="w-full bg-amber-300/10 rounded-xl p-16">
        <p className="text-2xl font-bold">작업을 하러 오셨나요?</p>
        <p className="text-lg font-bold">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis luctus nisl quis ex porta, quis tristique sapien venenatis. Morbi aliquet ipsum tortor, non volutpat elit feugiat quis. Sed in magna lectus. Pellentesque quis condimentum lectus. Donec in lobortis sem, a viverra enim. In non justo eleifend, volutpat dolor eget, consequat ante. In a lorem nec mi ultrices porta id nec odio. Duis mattis ligula tellus, eu convallis ligula faucibus quis. Nam consequat tristique orci, ac laoreet nibh tempor ut. Etiam lobortis lorem ac ullamcorper interdum. Cras dolor sem, fringilla at vestibulum vitae, feugiat quis augue. Aliquam erat volutpat. Suspendisse scelerisque laoreet risus non lobortis. Proin dignissim, ex eget imperdiet blandit, urna lorem luctus nunc, nec eleifend nisi erat a sapien.

Proin facilisis, velit ut commodo interdum, velit nunc tincidunt ex, vel pharetra quam mi quis metus. Donec suscipit accumsan libero at rutrum. Maecenas sit amet tincidunt nisl. Ut luctus euismod nibh ac maximus. Nunc nisi massa, bibendum sed blandit et, interdum in sapien. Aliquam dictum venenatis risus, in imperdiet velit vehicula eget.</p>
        </div>
      </div>
      <div className="flex px-24 my-32  max-w-[100rem] mx-auto">
        <EstimateBanner color="blue" />
      </div>
    </div>
    </>
  );
}
