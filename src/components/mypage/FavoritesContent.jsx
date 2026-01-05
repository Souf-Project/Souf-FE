import React, { useState, useEffect } from 'react';
import { getFavorite } from '../../api/favorite';
import { UserStore } from '../../store/userStore';
import StudentInfoBlock from '../studentInfoBlock';
import Loading from '../loading';
import AlertModal from '../alertModal';
import { handleApiError } from '../../utils/apiErrorHandler';
import { FAVORITE_ERRORS } from '../../constants/user';
import { useNavigate } from 'react-router-dom';

export default function FavoritesContent() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { memberId } = UserStore();
  const [errorModal, setErrorModal] = useState(false);
  const [errorDescription, setErrorDescription] = useState("잘못된 접근");
  const [errorAction, setErrorAction] = useState("redirect");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
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
      // console.log('즐겨찾기 조회 성공:', response);
      
      if (response.result && response.result.content) {
        setFavorites(response.result.content);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('즐겨찾기 조회 중 에러:', error);
      handleApiError(error, { setShowLoginModal, setErrorModal, setErrorDescription, setErrorAction }, FAVORITE_ERRORS);
      setError('즐겨찾기 목록을 불러오는데 실패했습니다.');
      if (error.response?.status === 403) {
        setError('로그인이 필요합니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  
  if (loading) {
    return <Loading text="즐겨찾기를 불러오는 중..." />;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-lg mb-4">
          {error}
        </div>
        {showLoginModal && (
        <AlertModal
        type="simple"
        title="로그인이 필요합니다"
        description="로그인 후 즐겨찾기 등록이 가능합니다!"
        TrueBtnText="로그인하러 가기"
        FalseBtnText="취소"
        onClickTrue={() => {
          setShowLoginModal(false);
          navigate("/");
        }}
        onClickFalse={() => setShowLoginModal(false)}
          />
        )}
        {errorModal && (
          <AlertModal
          type="simple"
          title="즐겨찾기 오류"
          description={errorDescription}
          TrueBtnText="확인"
          onClickTrue={() => {
            if (errorAction === "redirect") {
                navigate("/");
            }else if(errorAction === "login"){
              localStorage.clear();
              navigate("/login");
            }else{
              window.location.reload();
            }
          }}
            />
        )}
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
          관심있는 학생 계정을 즐겨찾기에 추가해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="hidden md:flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">내 즐겨찾기</h2>
        <span className="text-gray-500">총 {favorites.length}명</span>
      </div>

      <span className="block md:hidden text-gray-500">총 {favorites.length}명</span>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {favorites.map((favorite) => (
          <StudentInfoBlock key={favorite.id} studentInfo={favorite} type="favorite" />
        ))}
      </div>
    </div>
  );
} 