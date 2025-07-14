import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContests } from '../api/contest';

import fullIcon from '../assets/images/fullIcon.svg';


export default function ContestDetail() {
    const { id, category } = useParams();
    const navigate = useNavigate();
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageLoadingStates, setImageLoadingStates] = useState({
        thumbnail: true,
        detailImages: {}
    });
    const [showFullImage, setShowFullImage] = useState(false);
    const [fullImageUrl, setFullImageUrl] = useState('');


    useEffect(() => {
    const loadContest = async () => {
        try {
            const data = await getContests();
            console.log(data);
            // category와 id에 맞는 contest 찾기
            //item.category === category
            const found = data?.data?.[parseInt(id)];


            if (!found) throw new Error('해당 공모전 없음');

            setContest(found);

            // 이미지 로딩 초기화
            const detailImageStates = {};
            if (found.상세내용_이미지) {
                found.상세내용_이미지.forEach((_, index) => {
                    detailImageStates[index] = true;
                });
            }

            setImageLoadingStates({
                thumbnail: true,
                detailImages: detailImageStates
            });

            setTimeout(() => {
                setImageLoadingStates({
                    thumbnail: false,
                    detailImages: {}
                });
            }, 1000);
        } catch (err) {
            console.error('공모전 상세 불러오기 실패:', err);
            setContest(null);
        } finally {
            setLoading(false);
        }
    };

    loadContest();
}, [id, category]);

    const handleBack = () => {
        navigate(-1);
    };

    // 전체화면 이미지 모달 열기
    const openFullImage = (imageUrl) => {
        setFullImageUrl(imageUrl);
        setShowFullImage(true);
        document.body.style.overflow = 'hidden'; // 스크롤 방지
    };

    // 전체화면 이미지 모달 닫기
    const closeFullImage = () => {
        setShowFullImage(false);
        setFullImageUrl('');
        document.body.style.overflow = 'auto'; // 스크롤 복원
    };

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                closeFullImage();
            }
        };

        if (showFullImage) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [showFullImage]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        
        // 이미 전체 URL인 경우 (상세내용_이미지)
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // 썸네일 이미지 처리 (예: "20250626/thumbnails\\594792.jpg")
        if (imagePath.includes('thumbnails')) {
            // 파일명만 추출 (594792.jpg)
            const fileName = imagePath.split('\\').pop();
            if (!fileName) return null;
            
            // 확장자 제거 (594792)
            const imageId = fileName.replace('.jpg', '').replace('.png', '').replace('.jpeg', '');
            
            // 여러 URL 형식 시도
            const urlFormats = [
                `https://media-cdn.linkareer.com//se2editor/image/${imageId}`,
                `https://media-cdn.linkareer.com/se2editor/image/${imageId}`,
                `https://api.linkareer.com/attachments/${imageId}`,
                `https://linkareer.com/attachments/${imageId}`
            ];
            
            console.log('Trying URL formats for detail page:', urlFormats);
            return urlFormats[0];
        }
        
        // 기타 경우
        const fileName = imagePath.split('\\').pop() || imagePath.split('/').pop();
        if (!fileName) return null;
        
        const imageId = fileName.replace('.jpg', '').replace('.png', '').replace('.jpeg', '');
        
        return `https://media-cdn.linkareer.com//se2editor/image/${imageId}`;
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

    if (loading) {
        return <Loading />;
    }

    if (!contest) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">공모전을 찾을 수 없습니다</h1>
                    <p className="text-gray-600 mb-6">요청하신 공모전 정보가 존재하지 않습니다.</p>
                    <button
                        onClick={handleBack}
                        className="px-6 py-2 bg-yellow-point text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                    >
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            {/* 뒤로가기 버튼 */}
            <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                뒤로가기
            </button>

            {/* 썸네일 이미지와 기본 정보 섹션 */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                <div className="grid gap-8 lg:grid-cols-[40%_60%] grid-cols-1">
                    {/* 썸네일 이미지 */}
                    {contest.썸네일 && (
                        <div>
                            <div className="relative lg:h-full rounded-xl overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100">
                                {/* 로딩 스켈레톤 */}
                                {imageLoadingStates.thumbnail && (
                                    <div className="absolute inset-0 bg-gray-200 animate-pulse">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                                    </div>
                                )}
                                
                                <img
                                    src={getImageUrl(contest.썸네일)}
                                    alt={contest.제목}
                                    className="w-full h-full object-cover relative z-10"
                                    onError={(e) => {
                                        console.log('Thumbnail image load failed:', contest.썸네일);
                                        
                                        // 대체 URL 시도
                                        const fallbackUrls = getFallbackUrls(contest.썸네일);
                                        const currentIndex = fallbackUrls.indexOf(e.target.src);
                                        const nextIndex = currentIndex + 1;
                                        
                                        if (nextIndex < fallbackUrls.length) {
                                            console.log('Trying fallback URL for thumbnail:', fallbackUrls[nextIndex]);
                                            e.target.src = fallbackUrls[nextIndex];
                                        } else {
                                            // 모든 URL 시도 실패 시 플레이스홀더 표시
                                            console.log('All URLs failed for thumbnail, showing placeholder');
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }
                                    }}
                                />
                                <div 
                                    className="absolute top-2 right-2 z-10 bg-white/50 rounded-md w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-white/70 transition-colors duration-200"
                                    onClick={() => openFullImage(getImageUrl(contest.썸네일))}
                                >
                                    <img src={fullIcon} alt="fullIcon" className="w-8 h-8" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center hidden z-20">
                                    <div className="text-center">
                                        <svg className="w-16 h-16 mx-auto mb-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-yellow-700 text-lg font-medium">이미지 준비 중</span>
                                    </div>
                                </div>
                            </div>
                          
                        </div>
                    )}

                    {/* 기본 정보 섹션 */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">{contest.제목}</h1>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">주최</h3>
                                <p className="text-gray-600">{contest.주최}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">참여대상</h3>
                                <p className="text-gray-600">{contest.참여대상}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">시상규모</h3>
                                <p className="text-gray-600">{contest.시상규모}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">접수기간</h3>
                                <p className="text-gray-600">
                                    {contest.접수기간.시작일} ~ {contest.접수기간.마감일}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">활동혜택</h3>
                                <p className="text-gray-600">{contest.활동혜택}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">기업형태</h3>
                                <p className="text-gray-600">{contest.기업형태}</p>
                            </div>
                        </div>

                        {/* 공모분야 태그 */}
                        {contest.공모분야 && contest.공모분야.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">공모분야</h3>
                                <div className="flex flex-wrap gap-2">
                                    {contest.공모분야.map((field, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-yellow-point text-white text-sm rounded-full"
                                        >
                                            {field}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 공식 홈페이지 링크 - 전체 너비 */}
                {contest.홈페이지 && contest.홈페이지 !== '-' && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">공식 홈페이지</h3>
                        <a
                            href={contest.홈페이지}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 break-all"
                        >
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span className="text-sm">{contest.홈페이지}</span>
                        </a>
                    </div>
                )}
            </div>

            {/* 상세 내용 섹션 */}
            <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">상세 내용</h2>
                
                {/* HTML 내용이 있는 경우 */}
                {contest.상세내용 && (
                    <div 
                        className="prose max-w-none mb-8"
                        style={{
                            whiteSpace: 'pre-line',
                            lineHeight: '1.8',
                            fontSize: '16px',
                            color: '#374151',
                            wordBreak: 'keep-all',
                            overflowWrap: 'break-word'
                        }}
                        dangerouslySetInnerHTML={{ __html: contest.상세내용 }}
                    />
                )}

                {/* 상세내용_이미지가 있는 경우 */}
                {contest.상세내용_이미지 && contest.상세내용_이미지.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contest.상세내용_이미지.map((image, index) => (
                            <div key={index} className="relative rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100 group">
                                {/* 로딩 스켈레톤 */}
                                {imageLoadingStates.detailImages[index] && (
                                    <div className="absolute inset-0 bg-gray-200 animate-pulse">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                                    </div>
                                )}
                                
                                <img
                                    src={getImageUrl(image)}
                                    alt={`상세 이미지 ${index + 1}`}
                                    className="w-full h-auto object-cover relative z-10"
                                    onError={(e) => {
                                        console.log('Detail image load failed:', image);
                                        
                                        // 대체 URL 시도
                                        const fallbackUrls = getFallbackUrls(image);
                                        const currentIndex = fallbackUrls.indexOf(e.target.src);
                                        const nextIndex = currentIndex + 1;
                                        
                                        if (nextIndex < fallbackUrls.length) {
                                            console.log('Trying fallback URL for detail image:', fallbackUrls[nextIndex]);
                                            e.target.src = fallbackUrls[nextIndex];
                                        } else {
                                            // 모든 URL 시도 실패 시 플레이스홀더 표시
                                            console.log('All URLs failed for detail image, showing placeholder');
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }
                                    }}
                                />
                                <div 
                                    className="absolute top-2 right-2 z-10 bg-white/50 rounded-md w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-white/70 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                    onClick={() => openFullImage(getImageUrl(image))}
                                >
                                    <img src={fullIcon} alt="fullIcon" className="w-6 h-6" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center hidden z-20">
                                    <div className="text-center">
                                        <svg className="w-8 h-8 mx-auto mb-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-yellow-700 text-xs font-medium">이미지 준비 중</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 전체화면 이미지 모달 */}
            {showFullImage && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-full max-h-full">
                        {/* 닫기 버튼 */}
                        <button
                            onClick={closeFullImage}
                            className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        {/* 이미지 */}
                        <img
                            src={fullImageUrl}
                            alt="전체화면 이미지"
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                                console.log('Full image load failed:', fullImageUrl);
                                e.target.style.display = 'none';
                                // 에러 메시지 표시
                                const errorDiv = document.createElement('div');
                                errorDiv.className = 'text-white text-center p-8';
                                errorDiv.innerHTML = `
                                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p class="text-lg">이미지를 불러올 수 없습니다</p>
                                `;
                                e.target.parentNode.appendChild(errorDiv);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
} 