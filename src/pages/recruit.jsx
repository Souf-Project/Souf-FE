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
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [activeTab, setActiveTab] = useState("recruit");
  const [filteredRecruits, setFilteredRecruits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [allRecruits, setAllRecruits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");


  const fetchRecruits = useCallback(async (categoryParams = {}, searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getRecruit({
        ...categoryParams,
        recruitSearchReqDto: searchParams,  // title, content 들어감
        pageable: {
          page: currentPage,
          size: pageSize,
          sort: ["createdAt,desc"]
        }
      });

      if (response.data) {
        const recruits = response.data.content || response.data;
        setAllRecruits(recruits);
        setFilteredRecruits(recruits);
        setTotalPages(Math.ceil((response.data.totalElements || recruits.length) / pageSize));
      } else {
        console.error('Unexpected response structure:', response.data);
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Error fetching recruits:', err);
      setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
      const [firstCategory, secondCategory, thirdCategory] = categoryParam.split(',').map(Number);
      fetchRecruits({
        firstCategory: firstCategory || 0,
        secondCategory: secondCategory || 0,
        thirdCategory: thirdCategory || 0
      });
    } else {
      setSelectedCategory("전체");
      fetchRecruits();
    }
  }, [categoryParam, fetchRecruits]);

  useEffect(() => {
    fetchRecruits();
  }, [fetchRecruits, currentPage]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const [firstCategory, secondCategory, thirdCategory] = selectedCategory.split(',').map(Number);
      
      // 검색어를 recruitSearchReqDto에 담아 서버로 요청
      const searchParams = {
        title: searchType === "title" ? searchQuery : "",
        content: searchType === "content" ? searchQuery : ""
      };

      const response = await getRecruit({
        firstCategory: firstCategory || 0,
        secondCategory: secondCategory || 0,
        thirdCategory: thirdCategory || 0,
        recruitSearchReqDto: searchParams,
        pageable: {
          page: 0,
          size: 10,
          sort: ["createdAt,desc"]
        }
      });

      if (response.data) {
        const recruits = response.data.content || response.data;
        setFilteredRecruits(recruits);
      } else {
        setFilteredRecruits([]);
        console.error('Unexpected response structure:', response.data);
      }
    } catch (err) {
      console.error('Error searching recruits:', err);
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };


  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    if (searchQuery.trim()) {
      handleSearch({ preventDefault: () => {} });
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
              onClick={() => navigate('/recruit/upload')}
              className="bg-yellow-point text-white w-40 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors duration-200"
            >
              공고문 작성하기
            </button>
          ) : activeTab === "profile" ? (
            <button
              onClick={() => navigate('/profile/upload')}
              className="bg-yellow-point text-white w-40 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors duration-200"
            >
              피드 작성하기
            </button>
          ) : null}
          <div className="flex">
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
              ></span>
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-extrabold transition-colors duration-200 relative group ${
                activeTab === "feed" ? "text-yellow-point" : "text-gray-700"
              }`}
              onClick={() => setActiveTab("feed")}
            >
              <span>대학생 피드</span>
              <span
                className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
                  activeTab === "feed" ? "w-3/4" : "w-0 group-hover:w-3/4"
                }`}
              ></span>
            </button>
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
