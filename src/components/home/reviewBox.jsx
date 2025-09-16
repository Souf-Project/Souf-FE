import backArrow from "../../assets/images/backArrow.svg";
import { useState } from "react";

export default function ReviewBox() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 샘플 후기 데이터
  const reviews = [
    {
      id: 1,
      category: "브랜딩",
      title: "패션 브랜드 로고 디자인",
      client: "패션 브랜드",
      rating: 5,
      content: "스프 플랫폼에서 좋은 인연으로 브랜딩에 적합한 로고를 제작했어요. 저렴하고, 트렌디한 아이디어로 제작해주셔서 너무 좋았어요. 대학교 패션디자인 연구팀이라는데, 납기랑 퀄리티도 너무 만족했습니다!"
    },
    {
      id: 2,
      category: "웹 디자인",
      title: "반응형 웹사이트 제작",
      client: "스타트업",
      rating: 5,
      content: "반응형 웹사이트를 제작해주셨는데 정말 만족스러워요. 모바일에서도 완벽하게 작동하고 디자인도 세련되었습니다."
    },
    {
      id: 3,
      category: "영상 제작",
      title: "홍보 영상 제작",
      client: "마케팅 회사",
      rating: 5,
      content: "홍보 영상을 제작해주셨는데 정말 퀄리티가 높았어요. 창의적인 아이디어와 전문적인 편집으로 완성도가 높았습니다."
    },
    {
      id: 4,
      category: "그래픽 디자인",
      title: "SNS 콘텐츠 디자인",
      client: "인플루언서",
      rating: 5,
      content: "SNS용 콘텐츠를 디자인해주셨는데 정말 트렌디하고 예쁘게 나왔어요. 팔로워들도 많이 좋아해주고 있습니다."
    },
    {
      id: 5,
      category: "제품 디자인",
      title: "패키지 디자인",
      client: "제품 회사",
      rating: 5,
      content: "제품 패키지 디자인을 맡겨드렸는데 정말 만족스러워요. 브랜드 아이덴티티를 잘 살린 디자인이었습니다."
    },
    {
      id: 6,
      category: "UI/UX 디자인",
      title: "모바일 앱 디자인",
      client: "IT 스타트업",
      rating: 5,
      content: "모바일 앱 UI/UX를 디자인해주셨는데 사용자 경험이 정말 좋아졌어요. 직관적이고 아름다운 디자인이었습니다."
    },
    {
      id: 7,
      category: "일러스트",
      title: "캐릭터 디자인",
      client: "게임 회사",
      rating: 5,
      content: "게임 캐릭터를 디자인해주셨는데 정말 귀엽고 매력적이에요. 플레이어들도 많이 좋아해주고 있습니다."
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // 현재 표시할 3개 후기 계산
  const getCurrentReviews = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % reviews.length;
      result.push(reviews[index]);
    }
    return result;
  };

  // 이전/이후 후기 계산
  const getPrevReview = () => {
    const prevIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    return reviews[prevIndex];
  };

  const getNextReview = () => {
    const nextIndex = (currentIndex + 3) % reviews.length;
    return reviews[nextIndex];
  };

  const currentReviews = getCurrentReviews();
  const prevReview = getPrevReview();
  const nextReview = getNextReview();

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-center gap-6 relative">
        {/* 왼쪽 이전 후기 (작고 투명) */}
        <div className="flex flex-col gap-1 w-60 opacity-50 scale-95">
          <div className="w-60 h-60 bg-gray-300 rounded-xl"></div>
          <p className="text-neutral-500 text-sm font-bold">{prevReview.category}</p>
          <p className="text-zinc-800 text-md font-bold line-clamp-1">{prevReview.title}</p>
          <p className="text-stone-500 text-sm font-semibold">{prevReview.client}</p>
          <div className="text-yellow-300 text-lg font-bold">★★★★★</div>
          <p className="text-neutral-700 text-xs font-semibold line-clamp-2 leading-4">{prevReview.content}</p>
        </div>

        {/* 왼쪽 화살표 */}
        <button
          onClick={prevSlide}
          className="absolute left-16 z-10 w-12 h-12 flex items-center justify-center"
        >
         <img src={backArrow} alt="이전 후기" className="w-12 h-12 text-gray-600 hover:scale-105" />
        </button>

        {/* 중간 3개 캐러셀 */}
        <div className="flex items-center gap-6">
          {currentReviews.map((review, index) => (
            <div key={`${review.id}-${currentIndex}`} className="flex flex-col gap-1 w-60">
              <div className="w-60 h-60 bg-gray-300 rounded-xl"></div>
              <p className="text-neutral-500 text-md font-bold">{review.category}</p>
              <p className="text-zinc-800 text-xl font-bold line-clamp-1">{review.title}</p>
              <p className="text-stone-500 text-md font-semibold">{review.client}</p>
              <div className="text-yellow-300 text-2xl font-bold">★★★★★</div>
              <p className="text-neutral-700 text-md font-semibold line-clamp-3 leading-5">{review.content}</p>
            </div>
          ))}
        </div>

        {/* 오른쪽 화살표 */}
        <button
          onClick={nextSlide}
          className="absolute right-16 z-10 w-12 h-12 flex items-center justify-center"
        >
          <img src={backArrow} alt="다음 후기" className="w-12 h-12 text-gray-600 hover:scale-105 rotate-180" />
        </button>

        {/* 오른쪽 다음 후기 (작고 투명) */}
        <div className="flex flex-col gap-1 w-60 opacity-50 scale-95">
          <div className="w-60 h-60 bg-gray-300 rounded-xl"></div>
          <p className="text-neutral-500 text-sm font-bold">{nextReview.category}</p>
          <p className="text-zinc-800 text-md font-bold line-clamp-1">{nextReview.title}</p>
          <p className="text-stone-500 text-sm font-bold">{nextReview.client}</p>
          <div className="text-yellow-300 text-lg font-bold">★★★★★</div>
          <p className="text-neutral-700 text-xs font-bold line-clamp-2 leading-4">{nextReview.content}</p>
        </div>
      </div>
    </div>
  );
}