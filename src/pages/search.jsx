import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { getSearchDetail } from '../api/search';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../components/SearchBar';
import Loading from '../components/loading';
import SearchBlock from "../components/search/searchBlock";
import Pagination from "../components/pagination"; // 페이징 컴포넌트 경로 맞게 조정
import SEO from '../components/seo';

const useQueryParam = () => new URLSearchParams(useLocation().search);

export default function Search() {
  const query = useQueryParam();
  const keyword = query.get('q') || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [activeTab, setActiveTab] = useState('recruit');
  const [currentPage, setCurrentPage] = useState(0); // 페이지 번호 0부터 시작
  const navigate = useNavigate();

  // 페이지 당 아이템 수 설정
  const itemsPerPageMap = {
    recruit: 10,
    profile: 27,
    feed: 10,
  };

  // API 호출
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['searchDetail', submittedQuery],
    queryFn: () => getSearchDetail(submittedQuery),
    enabled: !!submittedQuery,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setSubmittedQuery(trimmed);
    setCurrentPage(0); // 검색 시 페이지 초기화
  };

  useEffect(() => {
    setSearchQuery(keyword);
    setSubmittedQuery(keyword);
    setCurrentPage(0); // URL로 바로 접근 시에도 페이지 초기화
  }, [keyword]);

  // activeTab 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(0);
  }, [activeTab]);

  // 필터링 + JSON 파싱
  const filteredResults = useMemo(() => {
    if (!searchResults?.data) return [];

    return searchResults.data
      .filter((item) => item.indexName === (activeTab === 'profile' ? 'member' : activeTab))
      .map((item) => {
        try {
          return JSON.parse(item.result);
        } catch (e) {
          console.error('파싱 오류:', e, item.result);
          return null;
        }
      })
      .filter(Boolean);
  }, [searchResults, activeTab]);

  // 페이지네이션을 적용한 현재 페이지 아이템들
  const itemsPerPage = itemsPerPageMap[activeTab] || 10;
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const pagedResults = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return filteredResults.slice(start, start + itemsPerPage);
  }, [filteredResults, currentPage, itemsPerPage]);

  const onPageChange = (page) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
  };


 return (
  <>
    <SEO title={keyword} description="스프 SouF 검색" subTitle=" 스프 검색" />
    <div className="flex flex-col justify-center items-center py-12 px-6 w-4/5">
      <div className="flex justify-between items-center mx-auto py-8 gap-4 w-full">
        <div className="flex">
          {['recruit', 'profile', 'feed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-extrabold transition-colors duration-200 relative group ${
                activeTab === tab ? 'text-yellow-point' : 'text-gray-700'
              }`}
            >
              <span>
                {tab === 'recruit'
                  ? '기업 공고문'
                  : tab === 'profile'
                  ? '대학생 프로필'
                  : '대학생 피드'}
              </span>
              <span
                className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
                  activeTab === tab ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                }`}
              ></span>
            </button>
          ))}
        </div>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
          width="w-[60%]"
          onSubmit={handleSearch}
        />
      </div>

      {isLoading ? (
        <div className="w-full">
          <Loading />
        </div>
      ) : isError ? (
        <p className="text-red-500">검색 중 오류가 발생했습니다.</p>
      ) : (
        <>
          {activeTab === 'recruit' && (
            <>
              {pagedResults.length > 0 ? (
                <ul className="space-y-4 w-full">
                  {pagedResults.map((recruit, idx) => (
                    <SearchBlock
                      key={idx}
                      title={recruit.title}
                      description={recruit.content}
                    />
                  ))}
                </ul>
              ) : (
                <p>검색 결과가 없습니다.</p>
              )}
            </>
          )}

          {activeTab === 'profile' && (
            <>
              {pagedResults.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full max-w-7xl">
                  {pagedResults.map((data, idx) => (
                    <SearchBlock key={idx} title={data.nickname} />
                  ))}
                </div>
              ) : (
                <p>검색 결과가 없습니다.</p>
              )}
            </>
          )}

          {activeTab === 'feed' && (
            <>
              {pagedResults.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-7xl">
                  {pagedResults.map((data, idx) => (
                    <SearchBlock
                      key={idx}
                      title={data.topic}
                      description={data.content}
                    />
                  ))}
                </div>
              ) : (
                <p>검색 결과가 없습니다.</p>
              )}
            </>
          )}

          {pagedResults.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
      </div>
      </>
  );
}

