import { postLogout } from "../api/member";
import { UserStore } from "../store/userStore";

/**
 * 로그인 모달에서 확인 버튼 클릭 시 사용하는 공통 함수
 * 로그아웃 API 호출 후 로컬 스토리지 정리 및 로그인 페이지로 이동
 */
export const logoutAndRedirectToLogin = async () => {
  try {
    // 1. 로그아웃 API 호출
    await postLogout();
  } catch (logoutError) {
    // 로그아웃 API 실패해도 클라이언트 토큰은 정리
    console.error("로그아웃 API 호출 실패:", logoutError);
  } finally {
    // 2. 클라이언트에서 토큰 정리
    UserStore.getState().clearUser();
    localStorage.removeItem("isLogin");
    localStorage.removeItem("roleType");
    localStorage.removeItem("nickname");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user-storage");
    
    // 3. 로그인 페이지로 완전히 리로드하여 이동
    window.location.href = "/login";
  }
};
