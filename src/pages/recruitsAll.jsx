import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RecruitBlock from "../components/recruitBlock";
import { getRecruit } from "../api/recruit";
import Pagination from "../components/pagination";
import Loading from "../components/loading";
import SEO from "../components/seo";
import SearchBar from "../components/SearchBar";
import { getFeed } from "../api/feed";
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
  
    const fetchRecruits = useCallback(async () => {
        try {
          setLoading(true);
          setError(null);
    
          const response = await getRecruit({
            firstCategory: null, 
            page: currentPage,
            size: pageSize,
            sort: ["createdAt,desc"],
          });
    
          if (response.data) {
            const recruits = response.data.result?.content || [];
            console.log("공고문 데이터:", recruits);
           
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
      }, [currentPage, pageSize]);

    const fetchStudentProfiles = useCallback(async () => {
      console.log("fetchStudentProfiles 함수 시작");
      try {
        // 1~5 중 랜덤 값 생성
        const randomCategory = Math.floor(Math.random() * 5) + 1;
        const response = await getFeed(randomCategory, null, null, null, {
          page: 0,
          size: 3,
        });

        if (response) {
          const profiles = response.result?.content || [];
          setStudentProfiles(profiles);
        } else {
          console.log('학생 프로필 조회 실패: 응답 데이터 없음');
          setStudentProfiles([]);
        }
      } catch (err) {
        console.error("Error fetching student profiles:", err);
        console.error("에러 상세:", err.response?.data);
        setStudentProfiles([]);
      }
    }, []);

    useEffect(() => {
      console.log("useEffect 실행");
      fetchRecruits();
      fetchStudentProfiles();
    }, [fetchRecruits, fetchStudentProfiles]);

    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
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
            <div className="pt-12 md:px-6 px-24 w-full bg-[#FFFEF5] shadow-md py-10">
        <div className="">
          <SearchBar 
            value={""}
            onChange={""}
            onSubmit={""} 
            placeholder={"검색어를 입력해주세요"}
            width="w-96 w-[800px]"
            height="py-4"/>
        </div>
      </div>
              <div className="flex gap-6 pt-6 md:px-6 px-24 w-full">
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
            <button className="w-full bg-yellow-main text-gray-800 px-4 py-4 rounded-lg shadow-md">의뢰 등록하기</button>
                         <div className="flex flex-col gap-4 ">
                <div className="w-full aspect-[7/4] bg-black rounded-lg flex items-center justify-center text-white  shadow-md">
                  AD
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
                           className="w-20 h-20 rounded-full object-cover"
                           onError={(e) => {
                             e.target.src = basicProfileImg;
                           }}
                         />
                       ) : (
                         <img
                           src={basicProfileImg}
                           alt="기본 프로필 이미지"
                           className="w-20 h-20 rounded-full object-cover"
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
                         {profile.mediaResDtos && profile.mediaResDtos.length > 0 && (
                           <>
                             {/* 첫 번째 피드 이미지 */}
                             <div className="w-1/2">
                               <img 
                                 src={`${import.meta.env.VITE_S3_BUCKET_URL}${profile.mediaResDtos[0].fileUrl}`}
                                 alt="피드 이미지 1" 
                                 className="w-full h-full max-h-28 object-cover rounded-lg"
                                 onError={(e) => {
                                   e.target.style.display = 'none';
                                 }}
                               />
                             </div>
                             
                             {/* 두 번째 피드 이미지 (있는 경우) */}
                             {profile.mediaResDtos.length > 1 && (
                               <div className="w-1/2">
                                 <img 
                                   src={`${import.meta.env.VITE_S3_BUCKET_URL}${profile.mediaResDtos[1].fileUrl}`}
                                   alt="피드 이미지 2" 
                                   className="w-full h-full max-h-28 object-cover rounded-lg"
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

