import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import RecruitBlock from "../components/recruitBlock";
import SearchBar from "../components/SearchBar";
import SearchDropdown from "../components/SearchDropdown";
import { getRecruit } from "../api/recruit";
import CategoryMenu from "../components/categoryMenu";
import SecondCategory from "../assets/categoryIndex/second_category.json";
import ThirdCategory from "../assets/categoryIndex/third_category.json";
import Pagination from "../components/pagination";
import Loading from "../components/loading";
import SEO from "../components/seo";
import { getFirstCategoryNameById } from "../utils/getCategoryById";

export default function Recruit() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState([1, 1, 1]);
  const [filteredRecruits, setFilteredRecruits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileCategoryMenu, setShowMobileCategoryMenu] = useState(false);
  const pageSize = 12;

//공고문

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

  const fetchRecruits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [firstCategory, secondCategory, thirdCategory] = selectedCategory;
      const response = await getRecruit({
        firstCategory,
        secondCategory,
        thirdCategory,
        recruitSearchReqDto: {},
          page: currentPage,
          size: pageSize,
          sort: ["createdAt,desc"],
       
      });

      // console.log("API 응답:", response);

      if (response.data) {
        const recruits = response.data.result?.content || [];
        // console.log("공고문 데이터:", recruits);
       
        setFilteredRecruits(recruits);

        const totalElements =
          response.data.result?.page?.totalElements || recruits.length;
        const totalPagesData = response.data.result?.page?.totalPages;
        setTotalPages(totalPagesData);
      } else {
        console.log('검색 실패: 응답 데이터 없음');
        setFilteredRecruits([]);
        setError("데이터를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("Error fetching recruits:", err);
      setError("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, currentPage, pageSize]);

  const performSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [firstCategory, secondCategory, thirdCategory] = selectedCategory;

       const recruitSearchReqDto = {};
      if (searchQuery.trim() !== "") {
        if (searchType === "title") {
          recruitSearchReqDto.title = searchQuery.trim();

        } else if (searchType === "titleContent") {

          //recruitSearchReqDto.title = searchQuery.trim();
          recruitSearchReqDto.content = searchQuery.trim();
        }
      }

      const response = await getRecruit({
        firstCategory,
        secondCategory,
        thirdCategory,
        recruitSearchReqDto, // 구성된 recruitSearchReqDto 객체를 getRecruit 함수에 전달
          page: currentPage,
          size: pageSize,
          sort: ["createdAt,desc"],
      });

      console.log("검색 API 응답:", response);

      if (response.data) {
        // 백엔드에서 필터링된 데이터
        const recruits = response.data.result?.content || [];
        console.log("검색된 공고문 데이터:", recruits);
        setFilteredRecruits(recruits);

        const totalElements = response.data.result?.page?.totalElements || 0;
        setTotalPages(Math.ceil(totalElements / pageSize));
      } else {
        setFilteredRecruits([]);
        setError("데이터를 불러오는데 실패했습니다.");
      }
     
    } catch (err) {
      console.error("Error fetching recruits:", err);
      setError("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [
    selectedCategory,
    searchQuery,
    searchType,
    currentPage,
    pageSize,
    allSecondCategories
  ]);
  // selectedCategory나 currentPage가 변경될 때 실행
  useEffect(() => {
    // console.log("useEffect 실행 - selectedCategory:", selectedCategory, "currentPage:", currentPage);
    fetchRecruits();
  }, [selectedCategory, currentPage, fetchRecruits]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
    performSearch();
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setCurrentPage(0); // 검색 타입 변경 시 첫 페이지로 이동
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCategorySelect = (firstCategoryId, secondCategoryId, thirdCategoryId) => {
    // console.log("카테고리 선택:", firstCategoryId, secondCategoryId, thirdCategoryId);
    setSelectedCategory([firstCategoryId, secondCategoryId, thirdCategoryId]);
    setCurrentPage(0); // 카테고리 변경 시 첫 페이지로 이동
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
    <SEO  title={getFirstCategoryNameById(selectedCategory[0]) +" - 기업 공고문"} description={`스프 SouF - ${getFirstCategoryNameById(selectedCategory[0])} 기업 공고문`} subTitle='스프' />
    <div className="pt-12 md:px-6 md:w-4/5 px-2 w-full ">
      {/* 모바일 카테고리 메뉴 */}
      <div className={`lg:hidden w-full mb-6 sticky top-0 z-10 ${
        showMobileCategoryMenu 
          ? "bg-white" 
          : "bg-gradient-to-b from-white to-transparent"
      }`}>
        <div className="pt-20">
          <div className="flex justify-center items-center gap-3">

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

      {/* 데스크톱 헤더와 검색창 */}
      <div className="hidden lg:flex justify-between items-center mb-8 w-full border-b border-gray-200 pb-4">
       <div className="flex items-center gap-4 text-md font-bold">
        <button className="hover:text-blue-main transition-colors duration-200">외주 조회</button>
        <button className="hover:text-blue-main transition-colors duration-200">이 가격에 해주세요</button>
        <button className="hover:text-blue-main transition-colors duration-200">견적 내어주세요</button>
       </div>
        <div className="flex items-center gap-4">
          <SearchDropdown onSelect={handleSearchTypeChange} />
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSubmit={handleSearch}
            placeholder="어떤 외주를 찾는지 알려주세요!"
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
        
        {/* 공고문 목록 */}
        <div className="w-full lg:w-3/4 mx-auto">
          {filteredRecruits.length > 0 ? (
            <>
              {filteredRecruits.map((recruit) => {
                const paymentString =
                  recruit.minPayment && recruit.maxPayment
                    ? recruit.minPayment === recruit.maxPayment
                      ? recruit.minPayment
                      : `${recruit.minPayment} ~ ${recruit.maxPayment}`
                    : recruit.minPayment || recruit.maxPayment || "금액 협의";

                return (
                  <RecruitBlock
                    key={recruit.recruitId}
                    id={recruit.recruitId}
                    title={recruit.title}
                    content={recruit.content}
                    deadLine={recruit.deadLine}
                    recruitable = {recruit.recruitable}
                    payment={paymentString}
                    minPayment={recruit.minPayment}
                    maxPayment={recruit.maxPayment}
                    cityName={recruit.cityName}
                    cityDetailName={recruit.cityDetailName}
                    secondCategory={recruit.secondCategory}
                    categoryDtoList={recruit.categoryDtoList}
                  />
                );
              })}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                선택한 카테고리의 공고가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
