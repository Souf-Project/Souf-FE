import React, { useState, useEffect } from 'react';
import { getFavorite } from '../api/favorite';
import { UserStore } from '../store/userStore';
import StudentInfoBlock from './studentInfoBlock';

export default function FavoritesContent() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { memberId } = UserStore();

  useEffect(() => {
    if (memberId) {
      fetchFavorites();
    } else {
      setLoading(false);
      setError('로그인이 필요합니다.');
    }
  }, [memberId]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getFavorite(memberId);
      console.log('즐겨찾기 조회 성공:', response);
      
      if (response.result && response.result.content) {
        setFavorites(response.result.content);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('즐겨찾기 조회 중 에러:', error);
      setError('즐겨찾기 목록을 불러오는데 실패했습니다.');
      if (error.response?.status === 403) {
        setError('로그인이 필요합니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-point"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-lg mb-4">
          {error}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-500 text-lg mb-4">
          아직 즐겨찾기한 학생 사용자가 없습니다.
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
        <span className="text-gray-500">총 {favorites.length}명</span>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {favorites.map((favorite) => (
          <StudentInfoBlock key={favorite.id} studentInfo={favorite} type="favorite" />
        ))}
      </div>
    </div>
  );
} 