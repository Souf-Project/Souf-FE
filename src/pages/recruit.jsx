import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import RecruitBlock from "../components/recruitBlock";
import StudentProfileList from "./studentProfileList";
import SearchBar from "../components/SearchBar";
import SearchDropdown from "../components/SearchDropdown";
import { getRecruit } from "../api/recruit";
import Feed from "../components/feed";
import CategoryMenu from "../components/categoryMenu";
import SecondCategory from "../assets/categoryIndex/second_category.json";
import ThirdCategory from "../assets/categoryIndex/third_category.json";
import {
  getFirstCategoryId,
  getSecondCategoriesByFirstId,
} from "../utils/getCategoryById";
import Pagination from "../components/pagination";


export default function Recruit() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState([1, 1, 1]);

  const [activeTab, setActiveTab] = useState("recruit");
  const [filteredRecruits, setFilteredRecruits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [firstId, setFirstId] = useState("");
  const [secondCategories, setSecondCategories] = useState([]);

  // 피드 데이터 (실제로는 API에서 가져와야 함)
  const feedData = [
    {
      id: "1",
      topic: "봄 프로젝트 1회차",
      content:
        "오늘은 봄날의 벚꽃길을 그려보았습니다. 부드러운 색감과 따뜻한 햇살을 표현하기 위해 수채화 기법을 사용했습니다. 특히 벚꽃의 섬세한 질감과 바람에 흩날리는 꽃잎의 움직임을 중점적으로 표현했습니다.",
      tags: ["봄", "벚꽃", "수채화", "자연"],
      originalFileNames: [
        "https://placehold.co/600x400?text=Work1",
        "https://placehold.co/600x400?text=Work1",
      ],
    },
    {
      id: "2",
      topic: "도시의 밤 프로젝트",
      content:
        "비 내리는 도시의 밤을 네온사인과 함께 표현한 디지털 아트입니다. 반사되는 빛과 물의 효과를 중점적으로 표현했으며, 특히 빗물에 비친 네온사인의 반사 효과를 디테일하게 작업했습니다.",
      tags: ["도시", "밤", "비", "네온사인", "디지털아트"],
      originalFileNames: [
        "https://placehold.co/600x400?text=Work2",
        "https://placehold.co/600x400?text=Work2",
      ],
    },
    {
      id: "3",
      topic: "미래 도시 컨셉아트",
      content:
        "미래의 도시를 상상하며 그린 디지털 아트입니다. 하이테크 건물들과 공중 자동차들이 특징이며, 특히 빛나는 건물 외벽과 반투명한 구조물들을 통해 미래지향적인 분위기를 표현했습니다.",
      tags: ["미래", "도시", "디지털아트", "컨셉아트"],
      originalFileNames: [
        "https://placehold.co/600x400?text=Work3",
        "https://placehold.co/600x400?text=Work3",
      ],
    },
    {
      id: "4",
      topic: "바다 일몰 스케치",
      content:
        "바다 위로 지는 해를 그린 유화입니다. 오렌지색과 퍼플 계열의 색감이 조화롭게 어우러지도록 작업했으며, 특히 바다의 반사광과 하늘의 그라데이션을 자연스럽게 표현했습니다.",
      tags: ["바다", "일몰", "유화", "자연"],
      originalFileNames: [
        "https://placehold.co/600x400?text=Work4",
        "https://placehold.co/600x400?text=Work4",
      ],
    },
    {
      id: "5",
      topic: "가을 풍경 프로젝트",
      content:
        "가을과 강아지와 주인과 풍경과 도로와 차에 대한 일러스트입니다. 따뜻한 색감을 살린 느낌으로 작업했으며, 특히 낙엽이 떨어지는 모습과 강아지의 털 질감을 섬세하게 표현했습니다.",
      tags: ["가을", "강아지", "일러스트", "풍경"],
      originalFileNames: [
        "https://placehold.co/600x400?text=Work5",
        "https://placehold.co/600x400?text=Work5",
      ],
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;


  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");

  const fetchRecruits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);


      const [firstCategory, secondCategory, thirdCategory] = selectedCategory;

      let searchParams = {};

      // searchType, searchQuery를 보고 조건 분기
      if (searchType === "title" && searchQuery.trim() !== "") {
        searchParams.title = searchQuery;
      } else if (searchType === "content" && searchQuery.trim() !== "") {
        searchParams.content = searchQuery;
      }
      

      const response = await getRecruit({
        firstCategory,
        secondCategory,
        thirdCategory,
        recruitSearchReqDto: searchParams,
        pageable: {
          page: currentPage,
          size: pageSize,
          sort: ["createdAt,desc"]
        }
      });

      if (response.data) {
        const recruits = response.data.result?.content || [];
        setFilteredRecruits(recruits);
        console.log(recruits);
      
        const totalElements = response.data.result?.page?.totalElements || recruits.length;
        setTotalPages(Math.ceil(totalElements / pageSize));
      }
       else {
        setFilteredRecruits([]);
        setError("데이터를 불러오는데 실패했습니다.");
      }
    } catch (err) {

      console.error("Error fetching recruits:", err);
      setError("서버 연결에 실패했습니다.");

    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, searchType, currentPage, pageSize]);

  useEffect(() => {
    if (categoryParam) {

      const categoryArr = categoryParam.split(",").map(Number);
      setSelectedCategory([
        categoryArr[0] || 0,
        categoryArr[1] || 0,
        categoryArr[2] || 0
      ]);
    } else {
      setSelectedCategory([0, 0, 0]);
    }
  }, [categoryParam]);

  useEffect(() => {
    fetchRecruits();
  }, [fetchRecruits]);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    if (searchQuery.trim()) {
      setCurrentPage(0);
      fetchRecruits();
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-point"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (

    <div className="pt-12 px-6 w-4/5">
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center gap-4">
          {activeTab === "recruit" ? (
            <button
              onClick={() => navigate("/recruit/upload")}
              className="bg-yellow-point text-white w-40 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors duration-200"
            >
              공고문 작성하기
            </button>
          ) : activeTab === "profile" ? (
            <button
              onClick={() => navigate("/profile/upload")}
              className="bg-yellow-point text-white w-40 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors duration-200"
            >
              피드 작성하기
            </button>
          ) : null}
          <div className="flex">

            {["recruit", "profile", "feed"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 rounded-lg font-extrabold transition-colors duration-200 relative group ${
                  activeTab === tab ? "text-yellow-point" : "text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >

                <span>
                  {tab === "recruit"
                    ? "기업 공고문"
                    : tab === "profile"
                    ? "대학생 프로필"
                    : "대학생 피드"}
                </span>

                <span
                  className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
                    activeTab === tab ? "w-3/4" : "w-0 group-hover:w-3/4"
                  }`}
                ></span>
              </button>
            ))}
          </div>


          <div className="flex items-center gap-4">
            <SearchDropdown onSelect={handleSearchTypeChange} />
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSubmit={handleSearch}
              placeholder="검색어를 입력하세요"
            />
          </div>

      {activeTab === "recruit" ? (
        <div className="w-5xl mx-auto">
          {filteredRecruits.length > 0 ? (
            <>
              {filteredRecruits.map((recruit) => (
                <RecruitBlock 
                  key={recruit.recruitId} 
                  id={recruit.recruitId}
                  title={recruit.title}
                  content={recruit.content}
                  deadLine={recruit.deadLine}
                  payment={recruit.payment}
                  recruitCount={recruit.recruitCount}
                  region={recruit.region}
                  secondCategory={recruit.secondCategory}
                />
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">선택한 카테고리의 공고가 없습니다.</p>
            </div>
          )}
        </div>
      ) : activeTab === "profile" ? (
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-6xl mx-auto">
          <StudentProfileList />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <Feed />

        </div>
      </div>
      <div className="flex flex-row">
        <CategoryMenu
          secondCategories={getSecondCategoriesByFirstId(firstId)}
          thirdCategories={ThirdCategory}
        />
        {activeTab === "recruit" ? (
          <div className="w-5xl mx-auto">
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
        ) : activeTab === "profile" ? (
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-6xl mx-auto">
            <StudentProfileList />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {feedData.map((post) => (
              <div key={post.id} className="mb-8">
                <Feed worksData={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
