import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import buildingData from '../assets/competitionData/건축_건설_인테리어.json';
import marketingData from '../assets/competitionData/광고_마케팅.json';
import { getContests } from '../api/contest';

export default function Contests() {
    const [activeTab, setActiveTab] = useState('building');
    const [contests, setContests] = useState([]);
    const [imageLoadingStates, setImageLoadingStates] = useState({});
    const navigate = useNavigate();

      useEffect(() => {
    const fetchContests = async () => {
      try {
        const data = await getContests(); // type은 기본 "rendering"
        console.log("데이터 확인용 :", data);
        setContests(data.data);
      } catch (err) {
        console.error("❌ 에러 발생:", err);
       
      }
    };

    fetchContests();
  }, []);
    useEffect(() => {
        // 탭이 변경될 때마다 해당하는 데이터를 로드
        let data;
        switch(activeTab) {
            case 'building':
                data = buildingData;
                break;
           
            case 'marketing':
                data = marketingData;
                break;
            default:
                data = buildingData;
        }
        //setContests(data);
        
        // 새로운 이미지들에 대해 로딩 상태 초기화
        const newLoadingStates = {};
        data.forEach((contest, index) => {
            if (contest.썸네일) {
                newLoadingStates[index] = true;
            }
        });
        setImageLoadingStates(newLoadingStates);
        
        // 1초 후에 모든 스켈레톤 숨기기
        setTimeout(() => {
            setImageLoadingStates({});
        }, 1000);
    }, [activeTab]);

    const handleContestClick = (index) => {
        navigate(`/contests/${activeTab}/${index}`);
    };

    const getTabTitle = (tab) => {
        switch(tab) {
            case 'building':
                return '건축·건설·인테리어';
           
            case 'marketing':
                return '광고·마케팅';
            default:
                return '건축·건설·인테리어';
        }
    };

    // 이미지 URL 생성 함수
    const getImageUrl = (imagePath) => {
        //console.log('getImageUrl called with:', imagePath);
        
        if (!imagePath) return null;
        
        // 이미 전체 URL인 경우 (상세내용_이미지)
        if (imagePath.startsWith('http')) {
            console.log('Returning full URL:', imagePath);
            return imagePath;
        }
        
        // 썸네일 이미지 처리 (예: "20250626/thumbnails\\594792.jpg")
        if (imagePath.includes('thumbnails')) {
            // 파일명만 추출 (594792.jpg)
            const parts = imagePath.split('\\');
            const fileName = parts[parts.length - 1];
            console.log('Extracted fileName from thumbnails:', fileName);
            
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
            
            console.log('Trying URL formats:', urlFormats);
            return urlFormats[0]; // 첫 번째 형식 반환
        }
        
        // 기타 경우
        const fileName = imagePath.split('\\').pop() || imagePath.split('/').pop();
        if (!fileName) return null;
        
        const imageId = fileName.replace(/\.(jpg|png|jpeg)$/i, '');
        const finalUrl = `https://media-cdn.linkareer.com//se2editor/image/${imageId}`;
        console.log('Generated other URL:', finalUrl);
        
        return finalUrl;
    };

    // 대체 이미지 URL 생성 함수
    const getFallbackImageUrl = (imagePath) => {
        console.log('getFallbackImageUrl called with:', imagePath);
        
        if (!imagePath) return null;
        
        // 썸네일 이미지 처리 (예: "20250626/thumbnails\\594792.jpg")
        if (imagePath.includes('thumbnails')) {
            // 파일명만 추출 (594792.jpg)
            const parts = imagePath.split('\\');
            const fileName = parts[parts.length - 1];
            console.log('Extracted fileName from thumbnails:', fileName);
            
            if (!fileName) return null;
            
            // 확장자 제거 (594792)
            const imageId = fileName.replace(/\.(jpg|png|jpeg)$/i, '');
            const fallbackUrl = `https://media-cdn.linkareer.com//se2editor/image/${imageId}`;
            console.log('Generated fallback URL:', fallbackUrl);
            
            return fallbackUrl;
        }
        
        // 기타 경우
        const fileName = imagePath.split('\\').pop() || imagePath.split('/').pop();
        if (!fileName) return null;
        
        const imageId = fileName.replace(/\.(jpg|png|jpeg)$/i, '');
        const fallbackUrl = `https://media-cdn.linkareer.com//se2editor/image/${imageId}`;
        console.log('Generated fallback URL:', fallbackUrl);
        
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
        <div className="max-w-6xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-8">공모전 정보</h1>
            
            {/* 탭 메뉴 */}
            <div className="flex space-x-4 mb-8">
                <button
                    onClick={() => setActiveTab('building')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        activeTab === 'building'
                            ? 'bg-yellow-point text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    건축·건설·인테리어
                </button>
               
                <button
                    onClick={() => setActiveTab('marketing')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        activeTab === 'marketing'
                            ? 'bg-yellow-point text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    광고·마케팅
                </button>
            </div>

            {/* 공모전 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests?.map((contest, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl border border-gray-200 hover:border-yellow-point transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md"
                        onClick={() => handleContestClick(index)}
                    >
                        {/* 썸네일 이미지 */}
                        {contest.썸네일 && (
                            <div className="relative h-64 rounded-t-xl overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100">
                                {/* 로딩 스켈레톤 */}
                                {imageLoadingStates[index] && (
                                    <div className="absolute inset-0 bg-gray-200 animate-pulse z-50">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                                    </div>
                                )}
                                
                                <img
                                    src={getImageUrl(contest.썸네일)}
                                    alt={contest.제목}
                                    className="w-full h-full object-cover relative z-10"
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
        </div>
    );
} 