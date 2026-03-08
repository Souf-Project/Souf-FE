import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SEO from "../components/seo";
import basiclogoimg from "../assets/images/basiclogoimg.png";
import heartOn from "../assets/images/heartOn.svg";
import PageHeader from "../components/pageHeader";
import { getFeedTop5List } from "../api/feed";
import { trackEvent } from "../analytics";
import Loading from "../components/loading";
import contestResultImage from "../assets/images/souf_contest_result_poster.png";
import SOUF_contest_banner from "../assets/images/SOUF_contest_banner.jpeg";
import coffeeImg from "../assets/images/coffeeImg.png"

const BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

// 기프티콘 당첨자 5명
const giftCardWinners = [
  { nickname: "이서연" , email: "jenn********@gmail.com"},
  { nickname: "너구리의코" , email: "yunz********@naver.com"},
  { nickname: "소소" , email: "bebe******@gmail.com"},
  { nickname: "하콩" , email: "kimh*********@gmail.com"},
  { nickname: "Liora" , email: "lior*******@gmail.com"}
];

const getOrdinalSuffix = (rank) => {
  if (rank === 1) return 'st';
  if (rank === 2) return 'nd';
  if (rank === 3) return 'rd';
  return 'th';
};

export default function ContestResult() {
  trackEvent("contest_result_view");

  const navigate = useNavigate();

  // API로 수상자 데이터 가져오기
  const {
    data: feedTop5Data,
    isLoading: feedTop5Loading,
    error: feedTop5Error,
  } = useQuery({
    queryKey: ["feedTop5"],
    queryFn: async () => {
      const data = await getFeedTop5List();
      return data;
    },
    keepPreviousData: true,
  });

  // 순위 데이터 가져오기 (상위 3명만)
  const top5Data = feedTop5Data?.result || [];

const winnersData = [0, 1, 3]
  .map((i, index) => {
    const item = top5Data[i];
    if (!item) return null;

    return {
      rank: index + 1,
      nickname: item.nickname || "익명",
      totalLikes: item.totalLikes || 0,
      memberId: item.memberId,
      feeds: item.competitionPopularFeedResDto || []
    };
  })
  .filter(Boolean);

  const handleFeedClick = (memberId, feedId) => {
    navigate(`/profileDetail/${memberId}/post/${feedId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="스프 경진대회 수상 결과" description="스프 souf 피드 경진대회 결과" subTitle="스프"/>
      <PageHeader title="수상작 결과" />
     
     
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 수상자 섹션 */}
        <div className="mb-16">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-8 text-gray-800">
            🏆 SOUF 대학생 피드 경진대회 결과 🏆
          </h2>
          <div >
      <img src={contestResultImage} className="mx-auto"/>
      </div>
          <p className="hidden md:block text-center text-gray-600 text-2xl my-40">
            대회에 참여해주신 모든 여러분께 진심으로 감사드립니다. 
            <br />
            많은 작품 중에서 선정된 수상작을 확인해보세요!
          </p>
          <p className="block md:hidden text-center text-gray-600 text-xl my-40">
            대회에 참여해주신 모든 여러분께 
            <br />
            진심으로 감사드립니다. 
            <br />
            많은 작품 중에서 선정된 수상작을 확인해보세요!
          </p>
          
          {/* 수상자 피드 및 정보 */}
          {feedTop5Loading ? (
            <div className="flex justify-center items-center py-20">
              <Loading />
            </div>
          ) : feedTop5Error ? (
            <div className="text-center text-red-500 py-20">
              수상자 데이터를 불러오는 중 오류가 발생했습니다.
            </div>
          ) : winnersData.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              수상자 데이터가 없습니다.
            </div>
          ) : (
          <div className="space-y-12 mt-12">
            {winnersData.map((winner, index) => {
              const feeds = winner.feeds || [];
              const isFirst = winner.rank === 1;
              const isSecond = winner.rank === 2;
              const isThird = winner.rank === 3;

              return (
                <div key={winner.memberId} className="relative my-40">
                  {/* 순위 배지 */}
                  <div className={`transform z-30 w-72 mx-auto mb-12 md:mb-20 ${
                    isFirst ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    isSecond ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                    'bg-gradient-to-r from-amber-600 to-amber-800'
                  } text-white px-8 py-8 rounded-full shadow-lg`}>
                    <span className="text-2xl font-bold text-center">
                    🏆 {winner.rank}{getOrdinalSuffix(winner.rank)} 🏆
                    </span>
                  </div>

                  {/* 피드 이미지 영역 */}
                  <div className={`relative md:w-[80%] mx-auto flex items-center justify-center md:mt-16 h-[300px] md:h-[450px]`}>
                    {feeds.length === 3 ? (
                      <>
                        {/* 두 번째 이미지 (왼쪽) */}
                        <div 
                          className={`absolute left-0 aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg shadow-lg cursor-pointer hover:opacity-80 transition-all ${
                            isFirst ? 'w-[32%] opacity-50 z-10 mt-12' :
                            isSecond ? 'w-[32%] opacity-50 z-10 mt-12' :
                            'w-[32%] opacity-50 z-10 mt-12'
                          }`}
                          onClick={() => handleFeedClick(winner.memberId, feeds[1].feedId)}
                        >
                          {feeds[1].mediaResDto?.fileUrl ? (
                            <img 
                              src={`${BUCKET_URL}${feeds[1].mediaResDto.fileUrl}`}
                              alt={feeds[1].feedTitle || "피드 이미지"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = basiclogoimg;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                              이미지 없음
                            </div>
                          )}
                        </div>

                        {/* 첫 번째 이미지 (가운데, z-index 높게) */}
                        <div 
                          className={`relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg shadow-xl cursor-pointer z-20 w-[40%] mb-8`}
                          onClick={() => handleFeedClick(winner.memberId, feeds[0].feedId)}
                        >
                          {feeds[0].mediaResDto?.fileUrl ? (
                            <img 
                              src={`${BUCKET_URL}${feeds[0].mediaResDto.fileUrl}`}
                              alt={feeds[0].feedTitle || "피드 이미지"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = basiclogoimg;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                              이미지 없음
                            </div>
                          )}
                        </div>

                        {/* 세 번째 이미지 (오른쪽) */}
                        <div 
                          className={`absolute right-0 aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg shadow-lg cursor-pointer hover:opacity-80 transition-all ${
                            isFirst ? 'w-[32%] opacity-50 z-10 mt-12' :
                            isSecond ? 'w-[32%] opacity-50 z-10 mt-12' :
                            'w-[32%] opacity-50 z-10 mt-12'
                          }`}
                          onClick={() => handleFeedClick(winner.memberId, feeds[2].feedId)}
                        >
                          {feeds[2].mediaResDto?.fileUrl ? (
                            <img 
                              src={`${BUCKET_URL}${feeds[2].mediaResDto.fileUrl}`}
                              alt={feeds[2].feedTitle || "피드 이미지"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = basiclogoimg;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                              이미지 없음
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-400">
                        피드 이미지가 없습니다.
                      </div>
                    )}
                  </div>

                  {/* 수상자 정보 */}
                  <div className={`md:mt-24 text-center bg-white rounded-lg shadow-md w-80 py-6 mx-auto`}>
                    <div className="flex flex-col items-center gap-3">
                      <div className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent ${
                    isFirst ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    isSecond ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                    'bg-gradient-to-r from-amber-600 to-amber-800'
                  }`}>
                        {winner.nickname || "익명"}
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={heartOn} alt="좋아요" className="w-6 h-6" />
                        <span className="text-md md:text-xl font-semibold text-gray-700">
                          {winner.totalLikes || 0}개
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>

        {/* 기프티콘 당첨자 섹션 */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            참여자 대상 기프티콘 당첨자
          </h2>
          <div>
            <img src={coffeeImg} className="relatuve mx-auto w-72 my-4" />
            <p className="text-center text-xl font-bold my-8">스타벅스 아메리카노 기프티콘 증정</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {giftCardWinners.map((winner, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 py-6 text-center shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="text-2xl font-bold text-blue-700 mb-2">
                    {winner.nickname}
                  </div>
                  <div className="text-md font-semibold text-gray-600">
                    {winner.email}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="md:text-lg text-center mt-4 text-gray-500">수상자, 당첨자분들에게는 이메일로 연락드릴 예정입니다.</p>
          <p className="md:text-lg text-center mb-20 text-gray-500">이메일 발송 후 영업일과 관계 없이 7일 내에 회신이 없을 시, 수상 및 당첨이 취소될 수 있습니다.</p>
        </div>
        <img src={SOUF_contest_banner} alt="SOUF_contest_banner" className="w-full h-full object-cover cursor-pointer mb-20" onClick={() => {navigate("/contest");
      }} />
      </div>
    </div>
  );
}
