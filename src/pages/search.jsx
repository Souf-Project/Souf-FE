import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRecruit } from '../api/recruit';
import StudentProfileList from './studentProfileList';
import StudentFeedList from './studentFeedList';
import RecruitBlock from '../components/recruitBlock';
import Loading from '../components/loading';

const useQuery = () => new URLSearchParams(useLocation().search);

export default function Search(){
  const query = useQuery();
  const keyword = query.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recruit");

  
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);

      
      try {
        if (activeTab === 'recruit') {
          const res = await getRecruit({
            firstCategory: 0,
            secondCategory: 0,
            thirdCategory: 0,
            pageable: {
              page: 0,
              size: 10,
              sort: ['createdAt,desc'],
            },
          });

          const raw = res.data?.result?.content || [];
          const filtered = raw.filter((item) =>
            item.title?.toLowerCase().includes(keyword.toLowerCase())
          );
          setResults(filtered);
        } else {
          // profile 또는 feed는 전체를 보여주거나 정적 렌더링
          setResults([]);
        }
      } catch (err) {
        console.error('검색 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [activeTab, keyword]);
  
  

  return (
    <div className="flex flex-col justify-center items-center pt-12 px-6 w-4/5">
        <div className="flex justify-start items-start mx-auto py-8 gap-4 w-full">
            <div>
            {["recruit", "profile", "feed"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 rounded-lg font-extrabold transition-colors duration-200 relative group ${
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

      {loading ? (
        <div className='w-full'><Loading/></div>    
      ) : activeTab === 'recruit' ? (
        results.length > 0 ? (
          <ul className="space-y-4">
            {results.map((recruit) => (
              <li key={recruit.recruitId}>
                <RecruitBlock
                  id={recruit.recruitId}
                  title={recruit.title}
                  content={recruit.content}
                  deadLine={recruit.deadline}
                  payment={recruit.minPayment}
                  cityName={recruit.cityName}
                  cityDetailName={recruit.cityDetailName}
                  secondCategory={recruit.categoryDtoList?.map((c) => c.secondCategory)}
                  categoryDtoList={recruit.categoryDtoList}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )
      ) : activeTab === 'profile' ? (
        <StudentProfileList />
      ) : (
        <StudentFeedList />
      )}
    
    
      </div>
  );
};

