
export default function ReviewBox() {
    return (
        <div className="flex flex-col gap-1 w-72">
          <div className="w-72 h-72 bg-gray-300 rounded-xl"></div>
          {/* <div className=""> */}
          <p className="text-neutral-500 text-xl font-bold">카테고리</p>
          <p className="text-zinc-800 text-3xl font-extrabold">제목</p>
          <p className="text-stone-500 text-2xl font-bold">카테고리</p>
          <div className="text-yellow-300 text-2xl font-bold">★★★★★</div>
          <p className="text-neutral-700 text-lg font-bold line-clamp-3 leading-5">스프 플랫폼에서 좋은 인연으로 브랜딩에 적합한 마네킹 제작했어요.
저렴하고, 트렌디한 아이디어로 제작해주셔서 너무 좋았어요.
@@대학교 패션디자인 연구팀이라는데, 납기랑 퀄리티도 
너무 만족했습니다!</p>
        </div>
    );
}