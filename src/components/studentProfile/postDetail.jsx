import { useNavigate, useParams } from "react-router-dom";
import backArrow from "../../assets/images/backArrow.svg";
import { getFeedDetail } from "../../api/feed";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFormattedDate } from "../../utils/getDate";

export default function PostDetail() {
  const navigate = useNavigate();
  const { id, worksId } = useParams();
  const [worksData, setWorksData] = useState([]);
  const [mediaData, setMediaData] = useState([]);

    const {
    data: feedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["feedDetail"],
    queryFn: async () => {
      const data = await getFeedDetail(id,worksId);
      console.log("feedDetail 결과:", data.result.mediaResDtos);
      setWorksData(data.result);
      setMediaData(data.result.mediaResDtos);
      return data;
    },
    keepPreviousData: true,
  });

  // const worksData = {
  //   id: "1",
  //   url: "https://placehold.co/600x400?text=Work1",
  //   title: "가을과 강아지와 주인과 풍경과 도로와 차",
  //   postedAt: "2025-03-09",
  //   views: 1000,
  //   description: `이 그림은 가을과 강아지와 주인과 풍경과 도로와 차에 대한 일러스트이며 따뜻한 색감을 살린 느낌입니다.`,
  // };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col py-24 px-4 max-w-4xl w-full mx-auto">
      <div className="flex justify-between">
      <button
        className="flex items-center text-gray-600 mb-4 hover:text-black transition-colors"
        onClick={handleGoBack}
      >
        <img src={backArrow} alt="뒤로가기" className="w-6 h-6 mr-1" />
        <span>프로필로 돌아가기</span>
      </button>

      <p className="text-sm text-gray-500 pr-6">
              누적 조회 수 {worksData.view}회
            </p>
            </div>


      <div className="flex flex-row rounded-2xl border border-gray-200 p-6 w-full shadow-sm">
        {mediaData?.map((data,i) => (
          <img
             key={i}
            src={data.fileUrl}
            alt={data.fileName}
            className="w-[65%] h-auto object-cover"
            />
          ))}
          <div className="w-[30%] h-full pl-6">
          <div className="flex flex-col justify-between items-start mb-4 h-full">
            <div className=" flex flex-col justify-between items-center text-xl font-semibold leading-snug text-black py-3">
            {worksData.topic}
            </div>
            <div className="flex flex-col justify-between text-sm text-gray-600 mb-2 min-h-40 h-full border-t border-gray-300 pt-6 ">
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-md">
                {worksData.content}
              </p>
              <p className="flex">{getFormattedDate(worksData.lastModifiedTime)}</p>
            </div>
          </div>




        </div>
      </div>
    </div>
  );
}
