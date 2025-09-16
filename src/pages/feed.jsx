import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import StudentProfileList from "./studentProfileList";
import SearchBar from "../components/SearchBar";
import SearchDropdown from "../components/SearchDropdown";
import CategoryMenu from "../components/categoryMenu";
import SecondCategory from "../assets/categoryIndex/second_category.json";
import ThirdCategory from "../assets/categoryIndex/third_category.json";
import StudentFeedList from "./studentFeedList";
import Loading from "../components/loading";
import SEO from "../components/seo";
import { getFirstCategoryNameById, getNowPageByActiveTab } from "../utils/getCategoryById";

export default function Feed() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState([1, 1, 1]);
  const [activeTab, setActiveTab] = useState("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMobileCategoryMenu, setShowMobileCategoryMenu] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");

  // CategoryMenu에 전달할 데이터 준비
  const allSecondCategories = SecondCategory.second_category;
  const allThirdCategories = ThirdCategory;

  // 선택된 대분류에 따라 중분류와 소분류 필터링
  const getFilteredCategories = () => {
    const selectedFirstCategory = selectedCategory[0];

    // 선택된 대분류에 해당하는 중분류만 필터링
    const filteredSecondCategories = allSecondCategories.filter(
      (second) => second.first_category_id === selectedFirstCategory
    );
    return {
      filteredSecondCategories,
      thirdCategories: allThirdCategories,
    };
  };

  const { filteredSecondCategories, thirdCategories } = getFilteredCategories();

  useEffect(() => {
    if (categoryParam) {
      const categoryArr = categoryParam.split(",").map(Number);
      setSelectedCategory([
        categoryArr[0] || 1,
        categoryArr[1] || 1,
        categoryArr[2] || 1,
      ]);
    } else {
      setSelectedCategory([1, 1, 1]);
    }
  }, [categoryParam]);

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 로직은 필요에 따라 추가
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
  };

  const handleCategorySelect = (firstCategoryId, secondCategoryId, thirdCategoryId) => {
    setSelectedCategory([firstCategoryId, secondCategoryId, thirdCategoryId]);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={getFirstCategoryNameById(selectedCategory[0]) + " - " + getNowPageByActiveTab(activeTab)} 
        description={`스프 SouF - ${getFirstCategoryNameById(selectedCategory[0])} 대학생 피드`} 
        subTitle='스프' 
      />
      <div className="pt-6 md:px-6 md:w-4/5 px-2 w-full">
        {/* 모바일 탭 */}
        <div className={`lg:hidden w-full mb-6 sticky top-0 z-10 ${
          showMobileCategoryMenu 
            ? "bg-white" 
            : "bg-gradient-to-b from-white to-transparent"
        }`}>
          <div className="pt-20">
            {/* 헤더 높이만큼 padding 줌 */}
            <div className="flex justify-center items-center gap-3">
              <div className="flex bg-gray-100/80 rounded-lg p-1">
                {["feed", "profile"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-white text-yellow-point shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => {
                      setActiveTab(tab);
                      setSearchQuery("");
                    }}
                  >
                    {tab === "profile" ? "대학생 프로필" : "대학생 피드"}
                  </button>
                ))}
              </div>

              {/* 카테고리 메뉴 버튼 */}
              <button
                onClick={() => setShowMobileCategoryMenu(!showMobileCategoryMenu)}
                className="p-2 bg-gray-100/80 rounded-lg hover:bg-gray-200/80 transition-colors duration-200"
              >
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                    showMobileCategoryMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* 모바일 카테고리 메뉴 */}
            {showMobileCategoryMenu && (
              <div className="mt-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                <CategoryMenu
                  secondCategories={filteredSecondCategories}
                  thirdCategories={thirdCategories}
                  onSelect={handleCategorySelect}
                  selectedCategories={{
                    firstCategoryId: selectedCategory[0],
                    secondCategoryId: selectedCategory[1],
                    thirdCategoryId: selectedCategory[2]
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 데스크톱 탭과 검색창 */}
        <div className="hidden lg:flex justify-between items-center mb-8 w-full">
          <div className="flex items-center gap-4">
            <div className="flex">
              {["feed", "profile"].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-3 rounded-lg text-base md:text-2xl md:font-extrabold font-bold transition-colors duration-200 relative group ${
                    activeTab === tab ? "text-yellow-point" : "text-gray-700"
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearchQuery("");
                    setSelectedCategory(prev => [prev[0], 0, 0]);
                  }}
                >
                  <span>
                    {tab === "profile" ? "대학생 프로필" : "대학생 피드"}
                  </span>
                  <span
                    className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
                      activeTab === tab ? "w-3/4" : "w-0 group-hover:w-3/4"
                    }`}
                  ></span>
                </button>
              ))}
            </div>
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
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* 데스크톱 카테고리 메뉴 */}
          <div className="hidden lg:block">
            <CategoryMenu
              secondCategories={filteredSecondCategories}
              thirdCategories={thirdCategories}
              onSelect={handleCategorySelect}
              selectedCategories={{
                firstCategoryId: selectedCategory[0],
                secondCategoryId: selectedCategory[1],
                thirdCategoryId: selectedCategory[2]
              }}
            />
          </div>
          
          {activeTab === "feed" ? (
            <div className="w-full lg:w-3/4 mx-auto">
              <StudentFeedList 
                firstCategoryId={selectedCategory[0]}
                secondCategoryId={selectedCategory[1]} 
                thirdCategoryId={selectedCategory[2]} 
                keyword={searchQuery} 
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm w-full lg:w-3/4 mx-auto mb-20">
              <StudentProfileList 
                secondCategoryId={selectedCategory[1]} 
                thirdCategoryId={selectedCategory[2]} 
                keyword={searchQuery}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
