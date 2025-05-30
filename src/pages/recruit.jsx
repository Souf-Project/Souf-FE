import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import RecruitBlock from "../components/recruitBlock";
import StudentProfileList from "./studentProfileList";
import SearchBar from "../components/SearchBar";
import SearchDropdown from "../components/SearchDropdown";
import { getRecruit } from "../api/recruit";
import Feed from "../components/feed";

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

  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category");

  // fetchRecruits 함수를 useCallback으로 메모이제이션
  const fetchRecruits = useCallback(async (categoryParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRecruit({
        ...categoryParams,
        page: 0,
        size: 10,
        sort: "createdAt,desc"
      });
      
      if (response.data && response.data.result) {
        setAllRecruits(response.data.result);
        setFilteredRecruits(response.data.result);
      } else if (response.data && Array.isArray(response.data)) {
        setAllRecruits(response.data);
        setFilteredRecruits(response.data);
      } else {
  
        console.error('Unexpected response structure:', response.data);
      }
    } catch (err) {

      console.error('Error fetching recruits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecruits();
  }, [fetchRecruits]);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
      // 카테고리 파라미터에 따라 API 호출
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

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const [firstCategory, secondCategory, thirdCategory] = selectedCategory.split(',').map(Number);
      const recruits = await getRecruit({
        firstCategory: firstCategory || 0,
        secondCategory: secondCategory || 0,
        thirdCategory: thirdCategory || 0,
        page: 0,
        size: 10,
        sort: "createdAt,desc"
      });

      // 검색어로 필터링
      let filtered = recruits;
      if (searchQuery.trim()) {
        filtered = filtered.filter(recruit => {
          if (searchType === "title") {
            return recruit.title.toLowerCase().includes(searchQuery.toLowerCase());
          } else if (searchType === "content") {
            return recruit.content.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return true;
        });
      }

      setFilteredRecruits(filtered);
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.');
      console.error('Error searching recruits:', err);
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
    <div className="pt-12 px-6">
      <div className="flex justify-between items-center mb-8">
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
