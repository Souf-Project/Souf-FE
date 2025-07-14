import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import RecruitBlock from "../components/recruitBlock";
import StudentProfileList from "./studentProfileList";
import SearchBar from "../components/SearchBar";
import SearchDropdown from "../components/SearchDropdown";
import { getRecruit } from "../api/recruit";
import CategoryMenu from "../components/categoryMenu";
import SecondCategory from "../assets/categoryIndex/second_category.json";
import ThirdCategory from "../assets/categoryIndex/third_category.json";
import Pagination from "../components/pagination";
import StudentFeedList from "./studentFeedList";
import Loading from "../components/loading";

export default function Recruit() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState([1, 1, 1]);
  const [activeTab, setActiveTab] = useState("feed");
  const [filteredRecruits, setFilteredRecruits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;



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
      console.log("다시 패치되니?" , firstCategory, secondCategory, thirdCategory);
      const response = await getRecruit({
        firstCategory,
        secondCategory,
        thirdCategory,
        recruitSearchReqDto: searchParams,
        page: currentPage,
        size: pageSize,
        sort: ["createdAt,desc"],
       
      });

      if (response.data) {
        const recruits = response.data.result?.content || [];
       
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

      if (response.data) {
        // 백엔드에서 필터링된 데이터
        const recruits = response.data.result?.content || [];
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
    allSecondCategories,
    categoryParam
  ]);
useEffect(() => {
  fetchRecruits();
}, [selectedCategory, currentPage]);
  /*
  useEffect(() => {
    if (categoryParam) {
      
      const categoryArr = categoryParam.split(",").map(Number);
      const newSelectedCategory = [
        categoryArr[0] || 0,
        categoryArr[1] || 0,
        categoryArr[2] || 0,
      ];
      setSelectedCategory(newSelectedCategory);
      
      
      // URL 파라미터가 변경되면 즉시 데이터를 가져오기
      const fetchDataWithNewCategory = async () => {
        try {
          setLoading(true);
          setError(null);
          setCurrentPage(0); // 카테고리 변경 시 첫 페이지로 이동

          const [firstCategory, secondCategory, thirdCategory] = newSelectedCategory;

          const response = await getRecruit({
            firstCategory,
            secondCategory,
            thirdCategory,
            recruitSearchReqDto: searchParams,
            page: 0,
            size: pageSize,
            sort: ["createdAt,desc"],
          });

          if (response.data) {
            const recruits = response.data.result?.content || [];
            
           
            setFilteredRecruits(recruits);

            const totalElements =
              response.data.result?.page?.totalElements || recruits.length;
            const totalPagesData = response.data.result?.page?.totalPages;
            setTotalPages(totalPagesData);
          } else {
            console.log('리쿠르트 조회 실패: 응답 데이터 없음');
            setFilteredRecruits([]);
            setError("데이터를 불러오는데 실패했습니다.");
          }
        } catch (err) {
          console.error("리쿠르트 조회 중 에러 발생:", err);
          setError("서버 연결에 실패했습니다.");
        } finally {
          setLoading(false);
        }
      };

      fetchDataWithNewCategory();
       fetchRecruits();
    } else {
      
      setSelectedCategory([0, 0, 0]);
      // 기본 카테고리로 데이터 가져오기
      fetchRecruits();
    }
  }, [categoryParam]);*/

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

  // selectedCategory나 currentPage가 변경될 때만 실행 (URL 파라미터 변경 제외)
  useEffect(() => {
    // URL 파라미터로 인한 변경이 아닌 경우에만 실행
    if (!categoryParam || categoryParam === selectedCategory.join(',')) {
      fetchRecruits();
    }
  }, [selectedCategory, currentPage, fetchRecruits, categoryParam]);

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
    console.log("카테고리 변경" , selectedCategory);
        fetchRecruits();
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
    <div className="pt-12 md:px-6 md:w-4/5 px-2 w-full">
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center gap-4">
          <div className="flex">
            {["feed", "profile", "recruit"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 rounded-lg text-base md:text-2xl md:font-extrabold font-bold transition-colors duration-200 relative group ${
                  activeTab === tab ? "text-yellow-point" : "text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery("");
                }}
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

      <div className="flex flex-col lg:flex-row">
        <CategoryMenu
          secondCategories={filteredSecondCategories}
          thirdCategories={thirdCategories}
          onSelect={handleCategorySelect}
        />
        {activeTab === "feed" ? (
          <div className="w-full lg:w-3/4 mx-auto">
            <StudentFeedList />
          </div>
        ) : activeTab === "profile" ? (
          <div className="bg-white rounded-lg shadow-sm w-full lg:w-3/4 mx-auto mb-20">
            <StudentProfileList />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
