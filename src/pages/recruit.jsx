import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import RecruitBlock from "../components/recruitBlock";
import StudentProfileList from "./studentProfileList";


export default function Recruit() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [activeTab, setActiveTab] = useState("recruit"); // 'recruit' 또는 'profile'
  const [filteredRecruits, setFilteredRecruits] = useState([]);

  // URL에서 카테고리 파라미터 가져오기
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");

  const sampleRecruits = [
    {
      id: 1,
      title: "로고 디자인 프로젝트",
      categoryMain: "디지털 콘텐츠 & 그래픽 디자인",
      categoryMiddle: "브랜드 디자인",
      categorySmall: "로고 디자인",
      content:
        "신규 사업을 위한 로고 디자인을 의뢰합니다. 미니멀하고 현대적인 디자인을 선호하며, 기업의 가치를 잘 표현할 수 있는 디자인을 찾고 있습니다. 포트폴리오와 함께 지원해주시기 바랍니다.",
      applicants: 12,
      minPrice: 300000,
      maxPrice: 500000,
      preferMajor: true,
      location: "서울",
      deadline: "2025-05-30",
    },
    {
      id: 2,
      title: "웹사이트 일러스트레이션 작업",
      categoryMain: "순수미술 & 일러스트",
      categoryMiddle: "일러스트·캐릭터 디자인",
      categorySmall: "2D 캐릭터",
      content:
        "회사 웹사이트 리뉴얼을 위한 일러스트레이션 작업을 의뢰합니다. 약 5-7개의 일러스트가 필요하며, 각 페이지의 콘셉트에 맞는 작업물이 필요합니다. 밝고 친근한 스타일을 원합니다.",
      applicants: 8,
      minPrice: 500000,
      maxPrice: 1000000,
      preferMajor: false,
      location: "지역무관",
      deadline: "2023-12-15",
    },
    {
      id: 3,
      title: "제품 소개 영상 제작",
      categoryMain: "사진 & 영상 & 영화",
      categoryMiddle: "영상",
      categorySmall: "광고·홍보 영상",
      content:
        "신제품 출시에 맞춰 30초 분량의 소개 영상이 필요합니다. 제품의 주요 기능과 특징을 효과적으로 보여줄 수 있는 영상을 원합니다. 기획부터 편집까지 전 과정을 맡아주실 수 있는 분을 찾습니다.",
      applicants: 5,
      minPrice: 1000000,
      maxPrice: 2000000,
      preferMajor: true,
      location: "원격",
      deadline: "2025-11-30",
    },
    {
      id: 4,
      title: "도자기 작품 의뢰",
      categoryMain: "공예 & 제작",
      categoryMiddle: "조형 예술",
      categorySmall: "도예·도자기",
      content:
        "카페에서 사용할 독특한 디자인의 머그컵과 접시 세트를 제작해주실 분을 찾고 있습니다. 카페의 분위기에 어울리는 자연스럽고 따뜻한 느낌의 디자인을 원합니다.",
      applicants: 3,
      minPrice: 800000,
      maxPrice: 1500000,
      preferMajor: true,
      location: "부산",
      deadline: "2025-04-15",
    },
    {
      id: 5,
      title: "음악 페스티벌 테마곡 작곡",
      categoryMain: "음악 & 음향",
      categoryMiddle: "음향",
      categorySmall: "기타 음향·음악",
      content:
        "지역 음악 페스티벌의 테마곡을 작곡해주실 분을 찾습니다. 밝고 활기찬 분위기의 곡으로, 페스티벌의 정체성을 잘 표현할 수 있는 작품을 원합니다.",
      applicants: 7,
      minPrice: 700000,
      maxPrice: 1200000,
      preferMajor: false,
      location: "대전",
      deadline: "2025-03-20",
    },
  ];

  // 카테고리에 따라 공고 필터링
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
      const filtered = sampleRecruits.filter(
        (recruit) => recruit.categoryMain === decodeURIComponent(categoryParam)
      );
      setFilteredRecruits(filtered);
    } else {
      setSelectedCategory("전체");
      setFilteredRecruits(sampleRecruits);
    }
  }, [categoryParam]);

  return (
    <div className="pt-24 px-6">
      <div className="flex justify-center gap-4 mb-8">
        <button
          className={`px-6 py-3 rounded-lg font-extrabold transition-colors duration-200 relative group ${
            activeTab === "recruit" ? "text-yellow-point" : "text-gray-700"
          }`}
          onClick={() => setActiveTab("recruit")}
        >
          <span>기업 공고문</span>
          <span
            className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
              activeTab === "recruit" ? "w-3/4" : "w-0 group-hover:w-3/4"
            }`}
          ></span>
        </button>
        <button
          className={`px-6 py-3 rounded-lg font-extrabold transition-colors duration-200 relative group ${
            activeTab === "profile" ? "text-yellow-point" : "text-gray-700"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <span>대학생 프로필</span>
          <span
            className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
              activeTab === "profile" ? "w-3/4" : "w-0 group-hover:w-3/4"
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
        {activeTab === 'recruit' && (
          <button
            onClick={() => navigate('/recruit/upload')}
            className="bg-yellow-point text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors duration-200"
          >
            공고문 작성하기
          </button>
        )}
      </div>
      {activeTab === "recruit" ? (
        <div className="max-w-4xl mx-auto">
          {filteredRecruits.length > 0 ? (
            filteredRecruits.map((recruit) => (
              <RecruitBlock
                key={recruit.id}
                id={recruit.id}
                title={recruit.title}
                categoryMain={recruit.categoryMain}
                categoryMiddle={recruit.categoryMiddle}
                categorySmall={recruit.categorySmall}
                content={recruit.content}
                applicants={recruit.applicants}
                minPrice={recruit.minPrice}
                maxPrice={recruit.maxPrice}
                preferMajor={recruit.preferMajor}
                location={recruit.location}
                deadline={recruit.deadline}
              />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                선택한 카테고리의 공고가 없습니다.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-5xl mx-auto">
          <StudentProfileList />
        </div>
      )}
    </div>
  );
}
