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
import Pagination from "../components/pagination";
import StudentFeedList from "./studentFeedList";

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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;



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

  const fetchRecruits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [firstCategory, secondCategory, thirdCategory] = selectedCategory;

      const response = await getRecruit({
        firstCategory,
        secondCategory,
        thirdCategory,
        recruitSearchReqDto: searchParams,
        pageable: {
          page: currentPage,
          size: pageSize,
          sort: ["createdAt,desc"],
        },
      });

      if (response.data) {
        const recruits = response.data.result?.content || [];
        console.log('API Response recruits:', recruits);
        setFilteredRecruits(recruits);

        const totalElements =
          response.data.result?.page?.totalElements || recruits.length;
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
  }, [selectedCategory, currentPage, pageSize]);

  const performSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [firstCategory, secondCategory, thirdCategory] = selectedCategory;

      const response = await getRecruit({
        firstCategory,
        secondCategory,
        thirdCategory,
        pageable: {
          page: currentPage,
          size: pageSize,
          sort: ["createdAt,desc"],
        },
      });

      if (response.data) {
        let recruits = response.data.result?.content || [];

        // 프론트엔드에서 검색 필터링 적용
        if (searchQuery.trim() !== "") {
          recruits = recruits.filter((recruit) => {
            if (searchType === "title") {
              return recruit.title
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());
            } else if (searchType === "titleContent") {
              return (
                recruit.title
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                recruit.content
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase())
              );
            } else if (searchType === "category") {
              // 카테고리 이름으로 검색
              const categoryNames =
                recruit.secondCategory?.map((catId) => {
                  const category = allSecondCategories.find(
                    (cat) => cat.second_category_id === catId
                  );
                  return category?.name || "";
                }) || [];

              return categoryNames.some((name) =>
                name.toLowerCase().includes(searchQuery.toLowerCase())
              );
            }
            return true;
          });
        }

        setFilteredRecruits(recruits);

        const totalElements =
          response.data.result?.page?.totalElements || recruits.length;
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
    allSecondCategories,
  ]);

  useEffect(() => {
    if (categoryParam) {
      const categoryArr = categoryParam.split(",").map(Number);
      setSelectedCategory([
        categoryArr[0] || 0,
        categoryArr[1] || 0,
        categoryArr[2] || 0,
      ]);
    } else {
      setSelectedCategory([0, 0, 0]);
    }
  }, [categoryParam]);

  // 카테고리나 페이지 변경 시에만 실행
  useEffect(() => {
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
    setSelectedCategory([firstCategoryId, secondCategoryId, thirdCategoryId]);
    setCurrentPage(0); // 카테고리 변경 시 첫 페이지로 이동
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
    <div className="pt-12 md:px-6 md:w-4/5 px-2 w-full">
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center gap-4">
          <div className="flex">
            {["recruit", "profile", "feed"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 rounded-lg md:font-extrabold font-bold transition-colors duration-200 relative group ${
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

      <div className="flex flex-row">
        <CategoryMenu
          secondCategories={filteredSecondCategories}
          thirdCategories={thirdCategories}
          onSelect={handleCategorySelect}
        />
        {activeTab === "recruit" ? (
          <div className="w-3/4 mx-auto">
            {filteredRecruits.length > 0 ? (
              <>
                {filteredRecruits.map((recruit) => {
                  const paymentString =
                    recruit.minPayment && recruit.maxPayment
                      ? recruit.minPayment === recruit.maxPayment
                        ? recruit.minPayment
                        : `${recruit.minPayment} ~ ${recruit.maxPayment}`
                      : recruit.minPayment || recruit.maxPayment || "금액 협의";

                  const secondCategories = recruit.categoryDtoList 
                    ? recruit.categoryDtoList.map((cat) => cat.secondCategory) 
                    : [];

                  return (
                    <RecruitBlock
                      key={recruit.recruitId}
                      id={recruit.recruitId}
                      title={recruit.title}
                      content={recruit.content}
                      deadLine={recruit.deadline}
                      payment={paymentString}
                      minPayment={recruit.minPayment}
                      maxPayment={recruit.maxPayment}
                      cityName={recruit.cityName}
                      cityDetailName={recruit.cityDetailName}
                      secondCategory={secondCategories}
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
        ) : activeTab === "profile" ? (
          <div className="bg-white rounded-lg shadow-sm p-6 w-3/4 mx-auto">
            <StudentProfileList />
          </div>
        ) : (
          <div className="w-3/4 mx-auto">
            <StudentFeedList />
          </div>
        )}
      </div>
    </div>
  );
}
