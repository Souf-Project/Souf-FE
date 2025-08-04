import warningIco from '../assets/images/warningIco.svg'
import SEO from '../components/seo';
import { useEffect } from 'react';
import { UserStore } from '../store/userStore';

export default function Forbidden() {
  useEffect(() => {
    // 403 에러 발생 시 모든 로그인 정보 정리
    const userStore = UserStore.getState();
    
    // userStore 초기화
    userStore.clearUser();
    
    // 로컬 스토리지 초기화
    localStorage.removeItem("isLogin");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user-storage");
  }, []);

  return (
    <>
    <SEO title="오류" description="스프 SouF 오류" subTitle="스프"/>
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <img src={warningIco} alt="warning" className="w-40 h-40 mb-4" />
      <h1 className="text-4xl font-bold text-red-500 mb-4">접근이 거부되었습니다</h1>
      <p className="mb-6 text-gray-700">인증이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.</p>
      <a
        href="/login"
        className="px-4 py-2 bg-yellow-main text-gray-700 rounded-lg"
      >
        로그인 페이지로 이동
      </a>
    </div>
    </>
    
  );
}
  