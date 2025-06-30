import React, { useState, useEffect } from 'react';

export default function FavoritesContent() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 즐겨찾기 데이터를 가져오는 API 호출
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      // TODO: 실제 API 호출로 대체
      // const response = await getFavorites();
      // setFavorites(response.data);
      
      // 임시 데이터
      setTimeout(() => {
        setFavorites([
          {
            id: 1,
            title: "웹 개발자 모집",
            company: "테크스타트업",
            deadline: "2024-12-31",
            type: "recruit"
          },
          {
            id: 2,
            title: "UI/UX 디자이너 구인",
            company: "디자인 에이전시",
            deadline: "2024-12-25",
            type: "recruit"
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('즐겨찾기 조회 중 에러:', error);
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      // TODO: 즐겨찾기 삭제 API 호출
      // await removeFavoriteAPI(favoriteId);
      
      // 임시 로직
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      alert('즐겨찾기가 삭제되었습니다.');
    } catch (error) {
      console.error('즐겨찾기 삭제 중 에러:', error);
      alert('즐겨찾기 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-point"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-500 text-lg mb-4">
          아직 즐겨찾기한 공고가 없습니다.
        </div>
        <p className="text-gray-400">
          관심 있는 공고를 즐겨찾기에 추가해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">내 즐겨찾기</h2>
        <span className="text-gray-500">총 {favorites.length}개</span>
      </div>
      
      <div className="grid gap-4">
        {favorites.map((favorite) => (
          <div 
            key={favorite.id} 
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {favorite.title}
                </h3>
                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                    {favorite.company}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    마감: {new Date(favorite.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                    {favorite.type === 'recruit' ? '채용공고' : '피드'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => window.open(`/recruitDetails/${favorite.id}`, '_blank')}
                  className="px-4 py-2 bg-yellow-main text-black rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  상세보기
                </button>
                <button
                  onClick={() => removeFavorite(favorite.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="즐겨찾기 삭제"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 