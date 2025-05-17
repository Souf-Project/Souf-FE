import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIco from '../assets/images/searchIco.svg';
import cate1Img from '../assets/images/cate1Img.svg'; 
import cate2Img from '../assets/images/cate2Img.svg';
import cate3Img from '../assets/images/cate3Img.svg';
import cate4Img from '../assets/images/cate4Img.svg';
import cate5Img from '../assets/images/cate5Img.svg';
import Background from '../assets/images/background.png';

export default function Home() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    
    const categories = [
        "순수미술 & 일러스트",
        "공예 & 제작",
        "음악 & 음향",
        "사진 & 영상 & 영화",
        "디지털 콘텐츠 & 그래픽 디자인"
    ];

    // 실제 공고문 데이터
    const sampleRecruits = [
        {
            id: 1,
            title: "로고 디자인 프로젝트",
            categoryMain: "디지털 콘텐츠 & 그래픽 디자인",
            categoryMiddle: "브랜드 디자인",
            categorySmall: "로고 디자인",
            content: "신규 사업을 위한 로고 디자인을 의뢰합니다. 미니멀하고 현대적인 디자인을 선호하며, 기업의 가치를 잘 표현할 수 있는 디자인을 찾고 있습니다.",
            applicants: 12,
            minPrice: 300000,
            maxPrice: 500000,
            preferMajor: true,
            location: "서울",
            deadline: "2025-05-30"
        },
        {
            id: 2,
            title: "웹사이트 일러스트레이션 작업",
            categoryMain: "순수미술 & 일러스트",
            categoryMiddle: "일러스트·캐릭터 디자인",
            categorySmall: "2D 캐릭터",
            content: "회사 웹사이트 리뉴얼을 위한 일러스트레이션 작업을 의뢰합니다. 약 5-7개의 일러스트가 필요하며, 각 페이지의 콘셉트에 맞는 작업물이 필요합니다.",
            applicants: 8,
            minPrice: 500000,
            maxPrice: 1000000,
            preferMajor: false,
            location: "지역무관",
            deadline: "2023-12-15"
        },
        {
            id: 3,
            title: "제품 소개 영상 제작",
            categoryMain: "사진 & 영상 & 영화",
            categoryMiddle: "영상",
            categorySmall: "광고·홍보 영상",
            content: "신제품 출시에 맞춰 30초 분량의 소개 영상이 필요합니다. 제품의 주요 기능과 특징을 효과적으로 보여줄 수 있는 영상을 원합니다.",
            applicants: 5,
            minPrice: 1000000,
            maxPrice: 2000000,
            preferMajor: true,
            location: "원격",
            deadline: "2025-11-30"
        }
    ];

    

    const handleSearch = (e) => {
        e.preventDefault();
        // 검색 기능 구현
        console.log('Search query:', searchQuery);
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
                    <h2 className="text-7xl font-bold text-black mb-12">지금 바로 SouF!</h2>
                    
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
                                const categoryImages = [cate1Img, cate2Img, cate3Img, cate4Img, cate5Img];
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
            <div className="relative">
                
                <div className="relative max-w-6xl mx-auto px-6 py-16">
                    <h2 className="text-2xl font-bold mb-8">인기있는 공고문 모집 보러가기</h2>
                    <div className="grid grid-cols-3 gap-6">
                        {sampleRecruits.map((recruit) => (
                            <div
                                key={recruit.id}
                                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-yellow-point transition-colors duration-200 cursor-pointer"
                                onClick={() => navigate(`/recruitDetails/${recruit.id}`)}
                            >
                                <h3 className="text-xl font-bold">{recruit.title}</h3>
                                <p className="text-gray-600 mb-4">{recruit.categoryMain}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>{recruit.minPrice/10000}~{recruit.maxPrice/10000}만원</span>
                                    <span>•</span>
                                    <span>{recruit.location}</span>
                                    <span>•</span>
                                    <span>{recruit.applicants}명 지원</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* 인기 피드 섹션 */}
            <div className="relative">
                
                <div className="relative max-w-6xl mx-auto px-6 py-16">
                    <h2 className="text-2xl font-bold mb-8">인기있는 피드 구경하러 가기</h2>
                    {/* <div className="grid grid-cols-3 gap-6">
                        {userData.map((recruit) => (
                            <div
                                key={recruit.id}
                                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-yellow-point transition-colors duration-200 cursor-pointer"
                                onClick={() => navigate(`/recruitDetails/${recruit.id}`)}
                            >
                                <h3 className="text-xl font-bold">{recruit.title}</h3>
                                <p className="text-gray-600 mb-4">{recruit.categoryMain}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  
                                
                                </div>
                            </div>
                        ))}
                    </div> */}
                </div>
            </div>
        </div>
    );
} 