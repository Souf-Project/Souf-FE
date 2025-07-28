import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContests } from '../api/contest';
import Pagination from '../components/pagination';

export default function Contests() {
    const [activeTab, setActiveTab] = useState("rendering");
    const [contests, setContests] = useState([]);
    const [imageLoadingStates, setImageLoadingStates] = useState({});
    //const [type, setType] = useState("rendering");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 12;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchContests = async () => {
          try {
            const data = await getContests({
              page: currentPage,
              size: pageSize,
              type: activeTab
            });
    
            setContests(data.data); 
            setTotalPages(Math.ceil(data.total / data.pageSize)); // 총 페이지 수 계산
          } catch (err) {
            console.error("❌ 공모전 불러오기 실패:", err);
            setContests([]);
            setTotalPages(1);
          }
        };
    
        fetchContests();
      }, [activeTab, currentPage]);
    


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


    const handleContestClick = (contest) => {
        navigate(`/contests/${contest.categoryID?.[0]}/${contest.contestID}`);
    };


    // 이미지 URL 생성 함수
    const getImageUrl = (imagePath) => {
        //console.log('getImageUrl called with:', imagePath);
        
        if (!imagePath) return null;
        
        // 이미 전체 URL인 경우 (상세내용_이미지)
        if (imagePath.startsWith('http')) {
           
            return imagePath;
        }
        
        // 썸네일 이미지 처리 (예: "20250626/thumbnails\\594792.jpg")
        if (imagePath.includes('thumbnails')) {
            // 파일명만 추출 (594792.jpg)
            const parts = imagePath.split('\\');
            const fileName = parts[parts.length - 1];
            
            if (!fileName) return null;
            
            // 확장자 제거 (594792)
            const imageId = fileName.replace(/\.(jpg|png|jpeg)$/i, '');
            
            // 여러 URL 형식 시도
            const urlFormats = [
                `https://media-cdn.linkareer.com//se2editor/image/${imageId}`,
                `https://media-cdn.linkareer.com/se2editor/image/${imageId}`,
                `https://api.linkareer.com/attachments/${imageId}`,
                `https://linkareer.com/attachments/${imageId}`
            ];
            
            return urlFormats[0]; // 첫 번째 형식 반환
        }
        
        // 기타 경우
        const fileName = imagePath.split('\\').pop() || imagePath.split('/').pop();
        if (!fileName) return null;
        
        const imageId = fileName.replace(/\.(jpg|png|jpeg)$/i, '');
        const finalUrl = `https://media-cdn.linkareer.com//se2editor/image/${imageId}`;
       
        return finalUrl;
    };

    // 대체 이미지 URL 생성 함수
    const getFallbackImageUrl = (imagePath) => {
        
        if (!imagePath) return null;
        
        // 썸네일 이미지 처리 (예: "20250626/thumbnails\\594792.jpg")
        if (imagePath.includes('thumbnails')) {
            // 파일명만 추출 (594792.jpg)
            const parts = imagePath.split('\\');
            const fileName = parts[parts.length - 1];
            //console.log('Extracted fileName from thumbnails:', fileName);
            
            if (!fileName) return null;
            
            // 확장자 제거 (594792)
            const imageId = fileName.replace(/\.(jpg|png|jpeg)$/i, '');
            const fallbackUrl = `https://media-cdn.linkareer.com//se2editor/image/${imageId}`;
            //console.log('Generated fallback URL:', fallbackUrl);
            
            return fallbackUrl;
        }
        
        // 기타 경우
        const fileName = imagePath.split('\\').pop() || imagePath.split('/').pop();
        if (!fileName) return null;
        
        const imageId = fileName.replace(/\.(jpg|png|jpeg)$/i, '');
        const fallbackUrl = `https://media-cdn.linkareer.com//se2editor/image/${imageId}`;
        //console.log('Generated fallback URL:', fallbackUrl);
        
        return fallbackUrl;
    };

    // 여러 대체 URL 생성 함수
    const getFallbackUrls = (imagePath) => {
        if (!imagePath) return [];
        
        // 썸네일 이미지 처리 (예: "20250626/thumbnails\\594792.jpg")
        if (imagePath.includes('thumbnails')) {
            // 파일명만 추출 (594792.jpg)
            const parts = imagePath.split('\\');
            const fileName = parts[parts.length - 1];
            
            if (!fileName) return [];
            
            // 확장자 제거 (594792)
            const imageId = fileName.replace(/\.(jpg|png|jpeg)$/i, '');
            
            // 여러 URL 형식 반환
            return [
                `https://media-cdn.linkareer.com//se2editor/image/${imageId}`,
                `https://media-cdn.linkareer.com/se2editor/image/${imageId}`,
                `https://api.linkareer.com/attachments/${imageId}`,
                `https://linkareer.com/attachments/${imageId}`
            ];
        }
        
        // 기타 경우
        const fileName = imagePath.split('\\').pop() || imagePath.split('/').pop();
        if (!fileName) return [];
        
        const imageId = fileName.replace(/\.(jpg|png|jpeg)$/i, '');
        
        return [
            `https://media-cdn.linkareer.com//se2editor/image/${imageId}`,
            `https://media-cdn.linkareer.com/se2editor/image/${imageId}`,
            `https://api.linkareer.com/attachments/${imageId}`,
            `https://linkareer.com/attachments/${imageId}`
        ];
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-16 w-full">
            <h1 className="text-3xl font-bold mb-8">공모전 정보</h1>
            
            {/* 탭 메뉴 */}
            <div className="flex space-x-4 mb-8">
                <button
                    onClick={() => setActiveTab('rendering')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        activeTab === 'rendering'
                            ? 'bg-yellow-point text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    모집중
                </button>
               
                <button
                    onClick={() => setActiveTab('closed')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        activeTab === 'closed'
                            ? 'bg-yellow-point text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    모집 마감
                </button>
            </div>

            {/* 공모전 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests?.map((contest, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl border border-gray-200 hover:border-yellow-point transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md"
                        onClick={() => handleContestClick(contest)}
                    >
                        {/* 썸네일 이미지 */}
                        {contest.썸네일 && (
                            <div className="relative h-[440px] rounded-t-xl overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100">
                                {/* 로딩 스켈레톤 */}
                                {imageLoadingStates[index] && (
                                    <div className="absolute inset-0 bg-gray-200 animate-pulse z-50">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                                    </div>
                                )}
                                
                                <img
                                    src={getImageUrl(contest.썸네일)}
                                    alt={contest.제목}
                                    className="w-full h-auto object-contain relative z-10"
                                    onError={(e) => {
                                        console.log('Image load failed:', contest.썸네일);
                                
                                        // 대체 URL 시도
                                        const fallbackUrls = getFallbackUrls(contest.썸네일);
                                        const currentIndex = fallbackUrls.indexOf(e.target.src);
                                        const nextIndex = currentIndex + 1;
                                        
                                        if (nextIndex < fallbackUrls.length) {
                                            console.log('Trying fallback URL:', fallbackUrls[nextIndex]);
                                            e.target.src = fallbackUrls[nextIndex];
                                        } else {
                                            // 모든 URL 시도 실패 시 플레이스홀더 표시
                                            console.log('All URLs failed, showing placeholder');
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
                        
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 line-clamp-2">{contest.제목}</h3>
                            <p className="text-gray-600 mb-2">주최: {contest.주최}</p>
                            
                            {/* 공모분야 태그 */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {contest.공모분야 && contest.공모분야.map((field, fieldIndex) => (
                                    <span
                                        key={fieldIndex}
                                        className="px-2 py-1 bg-yellow-point text-white text-xs rounded-full"
                                    >
                                        {field}
                                    </span>
                                ))}
                            </div>
                            
                            
                            
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-xs text-gray-400">
                                    {contest.기업형태}
                                </span>
                                <span className="text-xs text-blue-600 font-medium">
                                    자세히 보기 →
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                
            </div>
            {contests.length !== 0 && (
                            <div className="w-full mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
            )}
          {contests.length === 0 && (
            <div className="w-full text-center text-gray-500 text-lg my-16">
                {activeTab === 'closed' ? '모집 마감된 공모전이 없습니다.' : '모집중인 공모전이 없습니다.'}
            </div>
            )}
        </div>
    );
} 