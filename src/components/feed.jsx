import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPopularFeed } from "../api/feed";

export default function Feed() {
  const navigate = useNavigate();
  const { id, worksId } = useParams();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageable, setPageable] = useState({
    page: 1,
    size: 10,
    sort: ["createdAt,desc"]
  });

  useEffect(() => {
    fetchFeeds();
  }, [pageable]);

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPopularFeed(pageable);
      if (response.status === 0) {
        setFeeds(response.result.content);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('피드를 불러오는데 실패했습니다.');
      console.error('Error fetching feeds:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (feeds.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">표시할 피드가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-6 px-4 max-w-4xl w-full mx-auto">
      {feeds.map((feed) => (
        <div key={feed.feedId} className="rounded-2xl border border-gray-200 p-6 w-full shadow-sm mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold leading-snug text-black">
              {feed.topic || '제목 없음'}
            </h2>
            <p className="text-sm text-gray-500">
              {new Date(feed.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }).replace(/\. /g, '.').replace('.', '')}
            </p>
          </div>

          <div className="w-full overflow-hidden rounded-md mb-4">
            {feed.mediaResDto?.fileUrl ? (
              <img
                src={feed.mediaResDto.fileUrl}
                alt={feed.topic || '이미지'}
                className="w-full h-auto object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">이미지가 없습니다</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {feed.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          <p className="whitespace-pre-wrap text-gray-800 leading-relaxed mb-4">
            {feed.content || '내용 없음'}
          </p>
        </div>
      ))}
    </div>
  );
}
