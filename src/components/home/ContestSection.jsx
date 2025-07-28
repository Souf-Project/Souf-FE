import React from "react";
import { useNavigate } from "react-router-dom";

export default function ContestSection({ competitions, imageLoadingStates, getImageUrl, getFallbackUrls, contestIds = [] }) {
  const navigate = useNavigate();

  // 지정된 ID의 공모전만 필터링
  const filteredCompetitions = contestIds.length > 0 
    ? competitions.filter(comp => contestIds.includes(comp.contestID))
    : competitions.slice(0, 3); // 처음 3개

  return (
    
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 px-4 lg:px-0">
        {filteredCompetitions.map((competition, index) => {
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-lg duration-200 ease-out cursor-pointer shadow-sm hover:shadow-md"
              onClick={() => navigate(`/contests/${competition.categoryID[0]}/${competition.contestID}`)}
            >
              {/* 썸네일 이미지 */}
              {competition.썸네일 && (
                <div className="relative lg:h-[550px] w-auto rounded-t-xl overflow-hidden ">
                  {/* 로딩 스켈레톤 */}
                  {imageLoadingStates[index] && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                    </div>
                  )}
                  
                  <img
                    src={getImageUrl(competition.썸네일)}
                    alt={competition.제목}
                    className="w-full h-auto object-contain relative z-10"
                    onError={(e) => {
                      // 대체 URL 시도
                      const fallbackUrls = getFallbackUrls(competition.썸네일);
                      const currentIndex = fallbackUrls.indexOf(e.target.src);
                      const nextIndex = currentIndex + 1;
                      
                      if (nextIndex < fallbackUrls.length) {
                        e.target.src = fallbackUrls[nextIndex];
                      } else {
                        // 모든 URL 시도 실패 시 플레이스홀더 표시
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center hidden z-20">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto mb-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-yellow-700 text-sm font-medium">이미지 준비 중</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-2 lg:p-6">
                <h1 className="text-md lg:text-xl font-bold mb-2 line-clamp-2">{competition.제목}</h1>
                <h2 className="text-gray-600 mb-2 text-[12px] lg:text-base">주최: {competition.주최}</h2>
                
                {/* 공모분야 태그 */}
                {competition.공모분야 && competition.공모분야.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {competition.공모분야.slice(0, 2).map((field, fieldIndex) => (
                      <h2
                        key={fieldIndex}
                        className="px-2 py-1 bg-yellow-point text-white text-[12px] lg:text-xs rounded-full"
                      >
                        {field}
                      </h2>
                    ))}
                  </div>
                )}
                
                <div className="hidden lg:block flex flex-col gap-1 text-sm text-gray-500">
                  <h3>시상금: {competition.시상규모}</h3>
                  <h3>
                    접수기간: {competition.접수기간.시작일} ~ {competition.접수기간.마감일}
                  </h3>
                  <h3>참여대상: {competition.참여대상}</h3>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="hidden lg:block text-xs text-gray-400">
                    {competition.기업형태}
                  </span>
                  <span className="text-xs text-blue-600 font-medium ml-auto">
                    자세히 보기 →
                  </span>
                 
                </div>
              </div>
            </div>
          );
        })}
      </div>

  );
} 