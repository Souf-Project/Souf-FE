import { useState } from 'react';

export default function PopUpView({ 
  title = "팝업 제목",
  content = null,
  imageUrl = null,
  closePopUp
}) {
  const [selCheck, setSelCheck] = useState(false);

  const onClosePopUp = () => {
    if (closePopUp) {
      closePopUp(selCheck);
    }
  };

  const onCheck = () => {
    setSelCheck(!selCheck);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* 닫기 버튼 */}
        <button
          onClick={onClosePopUp}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="닫기"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>

        {/* 내용 */}
        <div className="">
          {imageUrl && (
             <img 
             src={imageUrl} 
             alt={title}
             className="w-full h-auto object-cover"
           />
          )}
          {content && (
            <article className="text-gray-600 whitespace-pre-line">
              {content}
            </article>
          )}
        </div>

        {/* 하단 버튼 영역 */}
        <div className="p-4 border-t border-gray-200 flex flex-col gap-3">
          {/* 오늘 하루 열지 않기 체크박스 */}
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selCheck}
              onChange={onCheck}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              오늘 하루 보지 않기
            </span>
          </label>
 {/* 닫기 버튼 */}
 <button
            onClick={onClosePopUp}
            className="py-2 px-4 font-medium"
          >
            닫기
          </button>
         
        </div>
      </div>
    </div>
  );
}