import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPopularFeed } from "../api/feed";
import { getFormattedDate } from "../utils/getDate";

export default function Feed({ feedData }) {
  const navigate = useNavigate();
  const { id, worksId } = useParams();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageable, setPageable] = useState({
    page: 1,
    size: 10,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-point"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  useEffect(() => {
    console.log("피드데이터");
    console.log(feedData);
  }, []);

  // if (feeds.length === 0) {
  //   return (
  //     <div className="text-center py-10">
  //       <p className="text-gray-500">표시할 피드가 없습니다.</p>
  //     </div>
  //   );
  // }

  return (
    <div
      key={feedData?.memberId}
      className="rounded-2xl border border-gray-200 p-6 w-full shadow-sm mb-6"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold leading-snug text-black">
          {feedData?.topic || "제목 없음"}
        </h2>
        <p className="text-sm text-gray-500">
          {getFormattedDate(feedData.lastModifiedTime)}
        </p>
      </div>

      <div className="w-full overflow-hidden rounded-md mb-4">
        {feedData?.mediaResDtos ? (
          <img
            src={feedData?.mediaResDto?.fileUrl[0]}
            alt={feedData?.topic || "이미지"}
            className="w-full h-auto object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-400">이미지가 없습니다</p>
          </div>
        )}
      </div>

      <p className="whitespace-pre-wrap text-gray-800 leading-relaxed mb-4">
        {feedData?.content || "내용 없음"}
      </p>
    </div>
  );
}
