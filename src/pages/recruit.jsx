import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RecruitBlock from '../components/recruitBlock';

export default function Recruit() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [activeTab, setActiveTab] = useState('recruit'); // 'recruit' 또는 'profile'
  
  // 샘플 공고 데이터
  const sampleRecruits = [
    {
      id: 1,
      title: "로고 디자인 프로젝트",
      category: "디지털 콘텐츠 & 그래픽 디자인",
      content: "신규 사업을 위한 로고 디자인을 의뢰합니다. 미니멀하고 현대적인 디자인을 선호하며, 기업의 가치를 잘 표현할 수 있는 디자인을 찾고 있습니다. 포트폴리오와 함께 지원해주시기 바랍니다.",
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
      category: "순수미술 & 일러스트",
      content: "회사 웹사이트 리뉴얼을 위한 일러스트레이션 작업을 의뢰합니다. 약 5-7개의 일러스트가 필요하며, 각 페이지의 콘셉트에 맞는 작업물이 필요합니다. 밝고 친근한 스타일을 원합니다.",
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
      category: "사진 & 영상 & 영화",
      content: "신제품 출시에 맞춰 30초 분량의 소개 영상이 필요합니다. 제품의 주요 기능과 특징을 효과적으로 보여줄 수 있는 영상을 원합니다. 기획부터 편집까지 전 과정을 맡아주실 수 있는 분을 찾습니다.",
      applicants: 5,
      minPrice: 1000000,
      maxPrice: 2000000,
      preferMajor: true,
      location: "원격",
      deadline: "2025-11-30"
    }
  ];

  
  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  return (
    <div className="p-6">
      <div className="flex justify-center gap-4 mb-8">
        <button
          className={`px-6 py-3 rounded-lg font-extrabold transition-colors duration-200 relative group ${
            activeTab === 'recruit'
              ? 'text-yellow-point'
              : 'text-gray-700'
          }`}
          onClick={() => setActiveTab('recruit')}
        >
          <span>기업 공고문</span>
          <span 
            className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
              activeTab === 'recruit' 
                ? 'w-3/4' 
                : 'w-0 group-hover:w-3/4'
            }`}
          ></span>
        </button>
        <button
          className={`px-6 py-3 rounded-lg font-extrabold transition-colors duration-200 relative group ${
            activeTab === 'profile'
              ? 'text-yellow-point'
              : 'text-gray-700'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          <span>대학생 프로필</span>
          <span 
            className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
              activeTab === 'profile' 
                ? 'w-3/4' 
                : 'w-0 group-hover:w-3/4'
            }`}
          ></span>
        </button>
      </div>
      {activeTab === 'recruit' ? (
        <div className="space-y-6">
          {sampleRecruits.map(recruit => (
            <RecruitBlock
              key={recruit.id}
              id={recruit.id}
              title={recruit.title}
              category={recruit.category}
              content={recruit.content}
              applicants={recruit.applicants}
              minPrice={recruit.minPrice}
              maxPrice={recruit.maxPrice}
              preferMajor={recruit.preferMajor}
              location={recruit.location}
              deadline={recruit.deadline}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
        
        </div>
      )}
    </div>
  );
}
