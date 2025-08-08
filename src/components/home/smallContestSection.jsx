import React from "react";
import { useNavigate } from "react-router-dom";

export default function SmallContestSection({ competitions, imageLoadingStates, getImageUrl, getFallbackUrls, contestIds = [] }) {
  const navigate = useNavigate();

  // 지정된 ID의 공모전만 필터링
  const filteredCompetitions = contestIds.length > 0 
    ? competitions.filter(comp => contestIds.includes(comp.contestID))
    : competitions.slice(3, 7); // 3번째부터 7번째까지 (4개)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-0">
      {filteredCompetitions.map((competition, index) => {
        return (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-lg duration-200 ease-out cursor-pointer shadow-sm hover:shadow-md"
            onClick={() => navigate(`/contests/${competition.categoryID[0]}/${competition.contestID}`)}
          >
            {/* 썸네일 이미지 */}
            {competition.썸네일 && (
              <div className="relative h-32 lg:h-80 w-auto rounded-t-lg overflow-hidden">
                {/* 로딩 스켈레톤 */}
                {imageLoadingStates[index] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                  </div>
                )}
                
                <img
                  src={getImageUrl(competition.썸네일)}
                  alt={competition.제목}
                  className="w-full h-full object-cover relative z-10"
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
                    <svg className="w-8 h-8 mx-auto mb-1 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-yellow-700 text-xs font-medium">이미지 준비 중</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-3">
              <h1 className="text-sm lg:text-base font-bold mb-1 line-clamp-2">{competition.제목}</h1>
              <h2 className="text-gray-600 mb-2 text-xs lg:text-sm">주최: {competition.주최}</h2>
              
              {/* 공모분야 태그 */}
              {competition.공모분야 && competition.공모분야.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {competition.공모분야.slice(0, 1).map((field, fieldIndex) => (
                    <h2
                      key={fieldIndex}
                      className="px-2 py-1 bg-yellow-point text-white text-xs rounded-full"
                    >
                      {field}
                    </h2>
                  ))}
                </div>
              )}
              
              <div className="text-xs text-gray-500 mb-2">
                <h3>시상금: {competition.시상규모}</h3>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-600 font-medium">
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