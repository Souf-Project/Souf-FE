import { useNavigate, useParams } from "react-router-dom";
import backArrow from "../../assets/images/backArrow.svg";

export default function PostDetail() {
  const navigate = useNavigate();
  const { id, worksId } = useParams();

  const worksData = {
    id: "1",
    url: "https://placehold.co/600x400?text=Work1",
    title: "가을과 강아지와 주인과 풍경과 도로와 차",
    postedAt: "2025-03-09",
    views: 1000,
    description: `이 그림은 가을과 강아지와 주인과 풍경과 도로와 차에 대한 일러스트이며 따뜻한 색감을 살린 느낌입니다.`,
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col py-24 px-4 max-w-4xl w-full mx-auto">
      <button
        className="flex items-center text-gray-600 mb-4 hover:text-black transition-colors"
        onClick={handleGoBack}
      >
        <img src={backArrow} alt="뒤로가기" className="w-6 h-6 mr-1" />
        <span>프로필로 돌아가기</span>
      </button>

      <div className="rounded-2xl border border-gray-200 p-6 w-full shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold leading-snug text-black">
            {worksData.title}
          </h2>
          <p className="text-sm text-gray-500">
            누적 조회 수 {worksData.views}회
          </p>
        </div>

        <div className="w-full overflow-hidden rounded-md mb-4">
          <img
            src={worksData.url}
            alt={worksData.title}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <p>{worksData.postedAt}</p>
        </div>

        <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {worksData.description}
        </p>
      </div>
    </div>
  );
}
