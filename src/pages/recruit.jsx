import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import RecruitBlock from "../components/recruitBlock";
import StudentProfileList from "./studentProfileList";
import SearchBar from "../components/SearchBar";
import SearchDropdown from "../components/SearchDropdown";
import { getRecruit } from "../api/recruit";
import Feed from "../components/feed";
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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchRecruits();
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
    <div className="pt-12 px-6 w-5/6">
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
                <span>{tab === "recruit" ? "기업 공고문" : tab === "profile" ? "대학생 프로필" : "대학생 피드"}</span>
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
      )}
    </div>
  );
}
