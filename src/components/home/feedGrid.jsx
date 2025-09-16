import { useEffect, useState } from "react";
import { usePopularFeed } from "../../hooks/usePopularFeed";
import { useNavigate } from "react-router-dom";
import { UserStore } from "../../store/userStore";
import AlertModal from "../alertModal";
import firstCategoryData from "../../assets/categoryIndex/first_category.json";


export default function FeedGrid() {
  const [feedData, setFeedData] = useState([]);
  const navigate = useNavigate();
  const { memberId } = UserStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { data, isLoading, error } = usePopularFeed({
    page: 0,
    size: 6,
    sort: ["createdAt,desc"],
  });

  const BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

  useEffect(() => {
    setFeedData(data?.result || []);
    // console.log(data?.result);
  }, [data]);

  useEffect(() => {
    if (error) console.error("Feed API error:", error);
  }, [error]);

  const handleClick = (feedId, memberId) => {
    if (!memberId) {
      setShowLoginModal(true);
    } else {
      navigate(`/profileDetail/${memberId}/post/${feedId}`);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = firstCategoryData.first_category.find(
      (cat) => cat.first_category_id === categoryId
    );
    return category ? category.name : `카테고리 ${categoryId}`;
  };

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-point"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto mt-4">
      <div className="grid grid-cols-3 grid-rows-2 gap-2 lg:gap-2">
        {feedData.map((feed) => (
          <div
            key={feed.feedId}
            className="w-64 cursor-pointer"
            onClick={() => handleClick(feed.feedId, feed.memberId)}
          >
            <div className="w-64 bg-white">
              {feed.mediaResDto?.fileUrl && (
                 <img
                 src={`${BUCKET_URL}${feed.mediaResDto.fileUrl}`}
                 alt="피드 이미지"
                 className="w-full h-full object-cover aspect-[1/1] bg-gray-100 rounded-xl"
                 onError={(e) => (e.target.style.display = "none")}
               />
              )}
              <div className="px-3 py-2 flex flex-col justify-between h-full">
                <span className="text-blue-main text-md font-semibold">
                  {feed.firstCategories
                    ?.map((id) => getCategoryName(id))
                    .join(", ")}
                </span>
                <span className="text-neutral-600 text-xl font-semibold">
                    {feed.title}
                  </span>
                  <span className="text-zinc-500 text-md font-semibold">
                    {feed.nickname}
                  </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showLoginModal && (
        <AlertModal
          type="simple"
          title="로그인이 필요합니다"
          description="SouF 회원만 상세 글을 조회할 수 있습니다!"
          TrueBtnText="로그인하러 가기"
          FalseBtnText="취소"
          onClickTrue={() => {
            setShowLoginModal(false);
            navigate("/login");
          }}
          onClickFalse={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
}
