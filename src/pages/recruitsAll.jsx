import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RecruitBlock from "../components/recruit/recruitBlock";
import { getRecruit } from "../api/recruit";
import Pagination from "../components/pagination";
import Loading from "../components/loading";
import SEO from "../components/seo";
import SearchBar from "../components/SearchBar";
import adImg from "../assets/images/adImg.png";
import { getProfile } from "../api/profile";
import basicProfileImg from "../assets/images/BasicProfileImg1.png";

export default function RecruitsAll() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filteredRecruits, setFilteredRecruits] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [studentProfiles, setStudentProfiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // 실제 검색에 사용할 용어
  
    const fetchRecruits = useCallback(async () => {
        try {
          setLoading(true);
          setError(null);
    
          const requestParams = {
            firstCategory: null, 
              page: currentPage,
              size: pageSize,
              sort: ["createdAt,desc"],
          };

          const trimmedQuery = String(searchTerm || '').trim();
          if (trimmedQuery) {
            requestParams.recruitSearchReqDto = {
              title: trimmedQuery,
              content: trimmedQuery
            };
          }

          const response = await getRecruit(requestParams);
    
          if (response.data) {
            const recruits = response.data.result?.content || [];
           
            setFilteredRecruits(recruits);
            // console.log(recruits);
    
            const totalPagesData = response.data.result?.page?.totalPages;
            setTotalPages(totalPagesData);
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
      }, [currentPage, pageSize, searchTerm]);

    const fetchStudentProfiles = useCallback(async () => {
      try {
        // 1~5 중 랜덤 값 생성
        const randomCategory = Math.floor(Math.random() * 5) + 1;
        const response = await getProfile(randomCategory, null, null, null, {
          page: 0,
          size: 10,
        });

        if (response) {
          const allProfiles = response.result?.content || [];
          const uniqueProfiles = allProfiles.filter((profile, index, self) => {
            // 피드가 있는 학생만 선택
            const hasFeed = profile.popularFeeds && profile.popularFeeds.length > 0;
            // memberId 기준으로 중복 제거
            const isFirstOccurrence = self.findIndex(p => p.memberId === profile.memberId) === index;
            
            return hasFeed && isFirstOccurrence;
          });

          const selectedProfiles = uniqueProfiles.slice(0, 3);
          
          setStudentProfiles(selectedProfiles);
        } else {
          setStudentProfiles([]);
        }
      } catch (err) {
        console.error("Error fetching student profiles:", err);
        console.error("에러 상세:", err.response?.data);
        setStudentProfiles([]);
      }
    }, []);

    useEffect(() => {
      fetchRecruits();
      fetchStudentProfiles();
    }, [fetchRecruits, fetchStudentProfiles]);

    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };

    const handleSearch = (query) => {
      setSearchTerm(query);
      setCurrentPage(0); 
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
      <SEO title="모든 공고문" description="스프 SouF - 모든 공고문 조회" subTitle="스프" />
            <div className="pt-12 md:px-6 px-24 w-full bg-[#FFFBE5] shadow-md py-10">
        <div className="">
          <SearchBar 
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            onSubmit={handleSearch} 
            placeholder={"검색어를 입력해주세요"}
            width="w-96 w-[800px]"
            height="py-4"/>
        </div>
      </div>
              <div className="flex gap-6 pt-6 md:px-6 px-24 w-full">
          <div className="w-full lg:w-3/4 mx-auto">
          {filteredRecruits.length > 0 && (() => {
            const today = new Date();
            const validRecruits = filteredRecruits.filter(recruit => {
              const deadlineDate = new Date(recruit.deadLine);
              const diffTime = deadlineDate - today;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays > 0;
            });
            
            if (validRecruits.length === 0) return null;
            
            const sortedByDeadline = validRecruits.sort((a, b) => {
              const dateA = new Date(a.deadLine);
              const dateB = new Date(b.deadLine);
              return dateA - dateB;
            });
            
            const nearestDeadline = sortedByDeadline[0];
            const deadlineDate = new Date(nearestDeadline.deadLine);
            const diffTime = deadlineDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return (
              <div 
                className="py-4 px-6 w-full text-gray-500 text-xl bg-white rounded-[30px] border border-red-200 mb-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => navigate(`/recruitDetails/${nearestDeadline.recruitId}`)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">

                    <span className="text-red-500 font-bold">
                      D-{diffDays > 0 ? diffDays : 0}
                    </span>
                    
                  </div>
                  <span className="text-gray-800 font-medium">
                      {nearestDeadline.title}
                    </span>
                
                </div>
              </div>
            );
          })()}
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
                    recruitable={recruit.recruitable}
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
                등록된 공고가 없습니다.
              </p>
            </div>
          )}
        </div>
        <div className="w-1/4 flex flex-col gap-6">
            <button 
            onClick={() => navigate("/recruitUpload")}
            className="w-full bg-yellow-main font-bold text-2xl text-gray-800 px-4 py-4 rounded-lg shadow-md">의뢰 등록하기</button>
                         <div className="flex flex-col gap-4 ">
                <div className="w-full aspect-[7/4] rounded-lg flex items-center justify-center text-white shadow-md">
                  <img src={adImg} alt="광고 이미지" className="w-full h-full object-cover" />
                </div>
                         <div className="bg-[#FFFDF5] rounded-lg p-6 shadow-md">
               <h2 className="text-gray-800 text-2xl font-bold mb-4">의뢰와 딱 맞는<br/>학생을 찾고있다면</h2>
               <div className="space-y-3">
                 {studentProfiles.map((profile, index) => (
                   <div key={index} className="flex bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => navigate(`/profileDetail/${profile.memberId}`)}>
                     <div className="flex flex-col items-center gap-3 mb-3 w-1/3 mr-2">
                       {profile.profileImageUrl ? (
                         <img
                           src={profile.profileImageUrl}
                           alt="프로필 이미지"
                           className="w-20 h-20 rounded-full object-cover border border-gray-300"
                           onError={(e) => {
                             e.target.src = basicProfileImg;
                           }}
                         />
                       ) : (
                         <img
                           src={basicProfileImg}
                           alt="기본 프로필 이미지"
                           className="w-20 h-20 rounded-full object-cover border-[0.8px] border-gray-300"
                         />
                       )}
                       <div className="flex-1">
                         <p className="font-semibold text-gray-800 text-sm">{profile.nickname || '익명'}</p>
                       </div>
                     </div>
                     
                     {/* 프로필 사진과 최신 피드 2개 */}
                     <div className="flex gap-2 w-2/3">
                      
                       {/* 최신 피드 이미지들 */}
                       <div className="flex gap-2 flex-1 h-full w-full">
                         {profile.popularFeeds && profile.popularFeeds.length > 0 && (
                           <>
                                                            {/* 첫 번째 피드 이미지 */}
                               <div className="w-1/2">
                                 <img 
                                   src={`${import.meta.env.VITE_S3_BUCKET_URL}${profile.popularFeeds[0].imageUrl}`}
                                   alt="피드 이미지 1" 
                                   className="w-full h-full max-h-28 object-cover rounded-lg border-[0.8px] border-gray-300"
                                   onError={(e) => {
                                     e.target.style.display = 'none';
                                   }}
                                 />
                               </div>
                               
                               {/* 두 번째 피드 이미지 (있는 경우) */}
                               {profile.popularFeeds.length > 1 && (
                                 <div className="w-1/2">
                                   <img 
                                     src={`${import.meta.env.VITE_S3_BUCKET_URL}${profile.popularFeeds[1].imageUrl}`}
                                     alt="피드 이미지 2" 
                                     className="w-full h-full max-h-28 object-cover rounded-lg border-[0.8px] border-gray-300"
                                     onError={(e) => {
                                       e.target.style.display = 'none';
                                     }}
                                   />
                                 </div>
                               )}
                           </>
                         )}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
            </div>
        </div>
      </div>
    </>
  );
}

