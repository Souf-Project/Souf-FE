import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import RecruitBlock from "../components/recruit/recruitBlock";
import { getRecruit } from "../api/recruit";
import CategoryMenu from "../components/categoryMenu";
import SecondCategory from "../assets/categoryIndex/second_category.json";
import ThirdCategory from "../assets/categoryIndex/third_category.json";
import Pagination from "../components/pagination";
import Loading from "../components/loading";
import SEO from "../components/seo";
import { getFirstCategoryNameById } from "../utils/getCategoryById";
import EstimateBanner from "../components/home/EstimateBanner";
import FilterDropdown from "../components/filterDropdown";
import PageHeader from "../components/pageHeader";
import RecommendRecruit from "../components/recruit/recommendRecruit";
import AlertModal from "../components/alertModal";
import { UserStore } from "../store/userStore";

export default function Recruit() {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialCategory = () => {
    const searchParams = new URLSearchParams(location.search);
    const firstCategory = searchParams.get('firstCategory');
    const secondCategory = searchParams.get('secondCategory');
    const thirdCategory = searchParams.get('thirdCategory');
    
    return [
      firstCategory ? parseInt(firstCategory) : null,
      secondCategory ? parseInt(secondCategory) : null,
      thirdCategory ? parseInt(thirdCategory) : null
    ];
  };

  const [selectedCategory, setSelectedCategory] = useState(getInitialCategory());
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredRecruits, setFilteredRecruits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileCategoryMenu, setShowMobileCategoryMenu] = useState(false);
  const [sortBy, setSortBy] = useState('RECENT_DESC');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const pageSize = 12;
  const { memberId, roleType } = UserStore();


  const filterOptions = [
    { value: 'RECENT_DESC', label: '최신순' },
    { value: 'RECENT_ASC', label: '오래된순' },
    { value: 'VIEWS_DESC', label: '조회 높은 순' },
    { value: 'VIEWS_ASC', label: '조회 낮은 순' },
    { value: 'PAYMENT_DESC', label: '금액 높은 순' },
    { value: 'PAYMENT_ASC', label: '금액 낮은 순' }
  ];


  const allSecondCategories = SecondCategory.second_category;
  const allThirdCategories = ThirdCategory;

  const getFilteredCategories = () => {
    const selectedFirstCategory = selectedCategory[0];

    const filteredSecondCategories = selectedFirstCategory 
      ? allSecondCategories.filter((second) => second.first_category_id === selectedFirstCategory)
      : allSecondCategories;
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
      
      // 카테고리가 모두 선택되지 않았을 때는 모든 공고문 조회
      const hasSelectedCategory = firstCategory || secondCategory || thirdCategory;
      
      const response = await getRecruit({
        firstCategory: selectedCategories.length > 0 ? null : (hasSelectedCategory ? firstCategory : null),
        secondCategory: selectedCategories.length > 0 ? null : (hasSelectedCategory ? secondCategory : null),
        thirdCategory: selectedCategories.length > 0 ? null : (hasSelectedCategory ? thirdCategory : null),
        selectedCategories: selectedCategories.length > 0 ? selectedCategories : null,
        recruitSearchReqDto: {},
        page: currentPage,
        size: pageSize,
        sort: [sortBy],
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
  }, [selectedCategory, selectedCategories, currentPage, pageSize, sortBy]);

  const performSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [firstCategory, secondCategory, thirdCategory] = selectedCategory;
      
      const hasSelectedCategory = firstCategory || secondCategory || thirdCategory;

       const recruitSearchReqDto = {};
      if (searchQuery.trim() !== "") {
        if (searchType === "title") {
          recruitSearchReqDto.title = searchQuery.trim();
        } else if (searchType === "content") {
          recruitSearchReqDto.content = searchQuery.trim();
        }
      }

      const response = await getRecruit({
        firstCategory: selectedCategories.length > 0 ? null : (hasSelectedCategory ? firstCategory : null),
        secondCategory: selectedCategories.length > 0 ? null : (hasSelectedCategory ? secondCategory : null),
        thirdCategory: selectedCategories.length > 0 ? null : (hasSelectedCategory ? thirdCategory : null),
        selectedCategories: selectedCategories.length > 0 ? selectedCategories : null,
        recruitSearchReqDto,
        page: currentPage,
        size: pageSize,
        sort: [sortBy],
      });

      if (response.data) {
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
    selectedCategories,
    searchQuery,
    searchType,
    currentPage,
    pageSize,
    sortBy,
    allSecondCategories
  ]);
  
  useEffect(() => {
    const newCategory = getInitialCategory();
    setSelectedCategory(newCategory);
  }, [location.search]);
  
  useEffect(() => {
    fetchRecruits();
  }, [selectedCategory, selectedCategories, currentPage, sortBy, fetchRecruits]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    performSearch();
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setCurrentPage(0); 
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCategorySelect = (firstCategoryId, secondCategoryId, thirdCategoryId) => {
    setSelectedCategory([firstCategoryId, secondCategoryId, thirdCategoryId]);
    setCurrentPage(0); 
  };

  const handleCategoryApply = (categories) => {
    setSelectedCategories(categories);
    setSelectedCategory([null, null, null]);
    setCurrentPage(0); 
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(0); 
  };

  const checkRecruitUploadAccess = () => {
    if (!memberId) {
      setShowAlertModal(true);
      return false;
    }
    if (roleType !== "MEMBER" && roleType !== "ADMIN") {
      setShowAlertModal(true);
      return false;
    }
    return true;
  };

  const handleRecruitUploadClick = () => {
    if (checkRecruitUploadAccess()) {
      navigate("/recruitUpload");
    }
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
    <div className="">
    <SEO  title="기업 외주" description={`스프 SouF - 기업 외주`} subTitle='스프' />
    <div className="w-full">
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
                onApply={handleCategoryApply}
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
      <PageHeader
        leftButtons={[
          { text: "외주 조회", onClick: () => {} },
          { text: "이 가격에 해주세요", onClick: () => {} },
          { text: "견적 내어주세요", onClick: () => {} }
        ]}
        showDropdown={true}
        showSearchBar={true}
        onSearchTypeChange={handleSearchTypeChange}
        searchQuery={searchQuery}
        onSearchQueryChange={(e) => setSearchQuery(e.target.value)}
        onSearch={handleSearch}
        searchPlaceholder="어떤 외주를 찾는지 알려주세요!"
      />

      <div className="max-w-[60rem] w-full mx-auto">
        <div className="flex flex-col lg:flex-row max-w-[60rem] w-full">
        {/* 데스크톱 카테고리 메뉴 */}
        <div className="hidden lg:block">
          <CategoryMenu
            secondCategories={filteredSecondCategories}
            thirdCategories={thirdCategories}
            onSelect={handleCategorySelect}
            onApply={handleCategoryApply}
            selectedCategories={{
              firstCategoryId: selectedCategory[0],
              secondCategoryId: selectedCategory[1],
              thirdCategoryId: selectedCategory[2]
            }}
          />
        </div>
        
        {/* 공고문 목록 */}
        <div className="w-full ml-4">
          <div className="mb-4 flex justify-between items-center ">
            <div className="flex items-center gap-4">
            <FilterDropdown
              options={filterOptions}
              selectedValue={sortBy}
              onSelect={handleSortChange}
              placeholder="정렬 기준"
            />
            {/* <button className="text-sm bg-gray-200 text-gray-500 font-bold px-6 py-2 rounded-full hover:shadow-md">종료된 외주</button> */}
            </div>

            <button className="text-sm bg-blue-main text-white font-bold px-6 py-2 rounded-lg hover:shadow-md" onClick={handleRecruitUploadClick}>외주 등록하기</button>
            
          </div>
          
          {filteredRecruits.length > 0 ? (
            <>
              {filteredRecruits.map((recruit, index) => {
                // 4번째부터 랜덤으로 EstimateBanner 또는 RecommendRecruit 표시
                const shouldShowRandomComponent = index >= 3 && Math.random() < 0.3; // 30% 확률
                const showEstimateBanner = shouldShowRandomComponent && Math.random() < 0.5; // 50% 확률로 EstimateBanner
                const showRecommendRecruit = shouldShowRandomComponent && !showEstimateBanner; // 나머지 50% 확률로 RecommendRecruit

                return (
                  <div key={recruit.recruitId}>
                    <RecruitBlock
                      id={recruit.recruitId}
                      title={recruit.title}
                      content={recruit.content}
                      deadLine={recruit.deadLine}
                      startDate={recruit.startDate}
                      recruitable = {recruit.recruitable}
                      price={recruit.price || "견적 희망"}
                      cityName={recruit.cityName}
                      cityDetailName={recruit.cityDetailName}
                      secondCategory={recruit.secondCategory}
                      categoryDtoList={recruit.categoryDtoList}
                    />
                    
                    {/* 4번째부터 랜덤으로 EstimateBanner 또는 RecommendRecruit 표시 */}
                    {showEstimateBanner && (
                      <div className="my-8">
                        <EstimateBanner color="black" />
                      </div>
                    )}
                    {showRecommendRecruit && (
                      <div className="my-8">
                        <RecommendRecruit />
                      </div>
                    )}
                  </div>
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

      {/* Alert Modal */}
      {showAlertModal && (
        <AlertModal
          type="simple"
          title="로그인 후 이용해주세요."
          description="외주 등록은 일반 회원만 이용할 수 있습니다."
          TrueBtnText="로그인하러 가기"
          FalseBtnText="취소"
          onClickTrue={() => {
            setShowAlertModal(false);
            navigate("/login");
          }}
          onClickFalse={() => setShowAlertModal(false)}
        />
      )}
    </div>
    </div>
  );
}
