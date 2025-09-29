import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import StudentProfileList from "./studentProfileList";
import CategoryMenu from "../components/categoryMenu";
import FirstCategory from "../assets/categoryIndex/first_category.json";
import SecondCategory from "../assets/categoryIndex/second_category.json";
import ThirdCategory from "../assets/categoryIndex/third_category.json";
import StudentFeedList from "./studentFeedList";
import Loading from "../components/loading";
import SEO from "../components/seo";
import { getFirstCategoryNameById, getNowPageByActiveTab } from "../utils/getCategoryById";
import PageHeader from "../components/pageHeader";
import FilterDropdown from "../components/filterDropdown";
import Carousel from "../components/home/carousel";

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
  const [selectedFirstCategory, setSelectedFirstCategory] = useState(null);
  const [selectedSecondCategory, setSelectedSecondCategory] = useState(null);
  const firstCategoryOptions = FirstCategory.first_category;
  
  const filteredSecondCategoryOptions = selectedFirstCategory 
    ? SecondCategory.second_category.filter(category => category.first_category_id === selectedFirstCategory)
    : [];
  
  const allSecondCategories = SecondCategory.second_category;
  const allThirdCategories = ThirdCategory;

  const getFilteredCategories = () => {
    const selectedFirstCategory = selectedCategory[0];

    const filteredSecondCategories = allSecondCategories.filter(
      (second) => second.first_category_id === selectedFirstCategory
    );
    return {
      filteredSecondCategories,
      thirdCategories: allThirdCategories,
    };
  };

  const { filteredSecondCategories, thirdCategories } = getFilteredCategories();

  const handleCategorySelect = (firstCategoryId, secondCategoryId, thirdCategoryId) => {
    setSelectedCategory([firstCategoryId, secondCategoryId, thirdCategoryId]);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFirstCategoryChange = (categoryId) => {
    setSelectedFirstCategory(categoryId);
    setSelectedSecondCategory(null);
    setSelectedCategory([categoryId, null, null]);
  };

  const handleSecondCategoryChange = (categoryId) => {
    setSelectedSecondCategory(categoryId);
    setSelectedCategory([selectedFirstCategory, categoryId, null]);
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
      
      {/* 데스크톱 탭과 검색창 */}
      <PageHeader
          leftText="대학생 피드"
          showDropdown={true}
          showSearchBar={true}
          onSearchTypeChange={handleSearchTypeChange}
          searchQuery={searchQuery}
          onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
          searchPlaceholder="검색어를 입력하세요"
          activeButtonIndex={activeTab === "feed" ? 0 : 1}
          isTabMode={true}
        />
        <div className="w-screen ">
        <Carousel />
        </div>
         
      <div className="pt-6 md:px-6 md:w-4/5 px-2 w-full">
        {/* 모바일 탭 */}
        <div className={`lg:hidden w-full mb-6 sticky top-0 z-10 ${
          showMobileCategoryMenu 
            ? "bg-white" 
            : "bg-gradient-to-b from-white to-transparent"
        }`}>
          <div className="pt-20">
            

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

        <div className="w-full mx-auto">
          <p className="text-base font-bold border-b border-gray-500 pb-4">카테고리 별</p>
          <div className="flex justify-between items-center mt-6">
                     <div className="flex items-center gap-4">
                         <FilterDropdown
                             options={firstCategoryOptions}
                             selectedValue={selectedFirstCategory}
                             onSelect={handleFirstCategoryChange}
                             placeholder="대분류 선택"
                         />
                         <FilterDropdown
                             options={filteredSecondCategoryOptions}
                             selectedValue={selectedSecondCategory}
                             onSelect={handleSecondCategoryChange}
                             placeholder="중분류 선택"
                             width="w-52"
                         />
                     </div>
                 </div>
        <StudentProfileList 
                secondCategoryId={selectedCategory[1]} 
                thirdCategoryId={selectedCategory[2]} 
                keyword={searchQuery}
              />
              </div>
        {/* <div className="max-w-[60rem] mx-auto flex flex-col lg:flex-row">
        
          <div className="w-full mx-auto">
              <StudentFeedList 
                firstCategoryId={selectedCategory[0]}
                secondCategoryId={selectedCategory[1]} 
                thirdCategoryId={selectedCategory[2]} 
                keyword={searchQuery} 
              />
               <div className="bg-white rounded-lg shadow-sm w-full mx-auto mb-20">
             
            </div>
            </div>
         
        </div> */}
      </div>
    </>
  );
}
