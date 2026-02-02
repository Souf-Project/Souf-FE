import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postSocialLogin, postSocialLoginLink } from "../api/social";
import { UserStore } from "../store/userStore";
import { LOGIN_ERRORS } from "../constants/user";
import AlertModal from "../components/alertModal";
import { setCookie, getCookie } from "../api/client";
import { trackEvent } from "../analytics";

export default function Redirect() {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorDescription, setErrorDescription] = useState("");
  const [errorAction, setErrorAction] = useState("");
  
  // URL 경로를 통해 provider 감지
  const getProviderFromPath = () => {
    if (window.location.pathname.includes('/oauth/kakao/callback')) {
      return 'KAKAO';
    } else if (window.location.pathname.includes('/oauth/google/callback')) {
      return 'GOOGLE';
    }
    return 'SOCIAL';
  };
  
  const currentProvider = getProviderFromPath();
  const getProviderDisplayName = (provider) => {
    switch (provider) {
      case 'KAKAO': return '카카오';
      case 'GOOGLE': return '구글';
      default: return '소셜';
    }
  };

  useEffect(() => {
    // 이미 처리되었으면 중복 실행 방지 -> 카카오 로그인시 400 토큰 에러 뜨는거 방지!!
    if (hasProcessed.current) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const provider = localStorage.getItem('socialProvider');
    
    // URL 경로에서 provider 확인
    let detectedProvider = provider;
    if (!detectedProvider) {
      if (window.location.pathname.includes('/oauth/kakao/callback')) {
        detectedProvider = 'KAKAO';
      } else if (window.location.pathname.includes('/oauth/google/callback')) {
        detectedProvider = 'GOOGLE';
      }
    }
    
    if (code && detectedProvider) {
      hasProcessed.current = true;
      
      // 연동 모드인지 확인
      const isLinking = localStorage.getItem('isLinking') === 'true';
      
      if (isLinking) {
        // 마이페이지에서 연동하는 경우
        postSocialLoginLink({
          code: code,
          provider: detectedProvider
        })
          .then((response) => {
            // console.log("소셜 계정 연동 성공:", response);
            localStorage.removeItem('socialProvider');
            localStorage.removeItem('isLinking');
            alert("소셜 계정이 성공적으로 연동되었습니다.");
            navigate("/mypage");
          })
          .catch((error) => {
            console.error("소셜 계정 연동 에러:", error);
            localStorage.removeItem('socialProvider');
            localStorage.removeItem('isLinking');
            
            if (error.response?.status === 409) {
              alert("이미 연동된 계정입니다.");
            } else {
              alert("소셜 계정 연동에 실패했습니다.");
            }
            navigate("/mypage");
          });
      } else {
        // 일반 소셜 로그인
        postSocialLogin({ 
          code: code,
          provider: detectedProvider
        })
        .then(async (response) => {
          const result = response?.result;
          // console.log("소셜 로그인 응답 전체:", response);
          // console.log("result 객체:", result);
          
          if (result) {
            // console.log(result)
            if (result.token?.memberId && result.token?.accessToken) {
              UserStore.getState().setUser({
                memberId: result.token.memberId,
                nickname: result.token.nickname,
                roleType: result.token.roleType,
              });
              UserStore.getState().setAccessToken(result.token.accessToken);
              localStorage.setItem("accessToken", result.token.accessToken);
              
              // 쿠키에서 refreshToken 읽기 (서버에서 쿠키로 보내줌)
              setTimeout(() => {
                const refreshTokenFromCookie = getCookie("refreshToken") || 
                                               getCookie("RefreshToken") || 
                                               getCookie("refresh_token");
                
                if (refreshTokenFromCookie) {
                  localStorage.setItem("refreshToken", refreshTokenFromCookie);
                  console.log("🔐 [소셜 로그인] 쿠키에서 리프레시 토큰 읽기 성공:", "✅ 저장됨");
                  console.log("🔐 [소셜 로그인] 쿠키 값:", `${refreshTokenFromCookie.substring(0, 20)}...`);
                } else {
                  // 응답 데이터에 refreshToken이 있는 경우 (fallback)
                  const refreshToken = result.token?.refreshToken || result.refreshToken;
                  if (refreshToken) {
                    localStorage.setItem("refreshToken", refreshToken);
                    setCookie("refreshToken", refreshToken, 30);
                    console.log("🔐 [소셜 로그인] 응답에서 리프레시 토큰 저장:", "✅ 저장됨");
                  } else {
                    console.log("⚠️ [소셜 로그인] 리프레시 토큰을 찾을 수 없음 (쿠키 및 응답 모두 확인)");
                  }
                }
              }, 100);
              
              localStorage.removeItem('socialProvider');
              
              trackEvent("login_success", {
                login_type: "social",
                social_provider: detectedProvider || "UNKNOWN",
                user_type: result.token.roleType || "UNKNOWN",
              });
            
              navigate("/");
            }
             else {
            // console.log(result)
              // 신규 회원가입 사용자: step2부터 시작
              navigate("/join", { 
                state: { 
                  step: 2,
                  socialLogin: true,
                  provider: detectedProvider || {},
                  email: result.prefill.email || {},
                  username: result.prefill.name || {},
                  registrationToken: result.registrationToken,
                },
              });
            }
          } else {
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("소셜 로그인 에러:", error);
          
          // 에러 키 추출 및 LOGIN_ERRORS에서 해당 에러 정보 가져오기
          const errorKey = error.response?.data?.errorKey;
          const errorInfo = errorKey ? LOGIN_ERRORS[errorKey] : null;
          
          if (errorInfo) {
            // LOGIN_ERRORS에 정의된 에러인 경우 모달로 표시
            setErrorDescription(errorInfo.message);
            setErrorAction(errorInfo.action || "redirect");
            setErrorModal(true);
          } else if (error.response?.status === 400 || error.response?.status === 409) {
            // 에러 키가 없거나 LOGIN_ERRORS에 없지만 400/409 에러인 경우
            const errorMessage = error.response?.data?.message || "소셜 로그인에 실패했습니다.";
            setErrorDescription(errorMessage);
            setErrorAction("redirect");
            setErrorModal(true);
          } else {
            // 기타 에러는 로그인 페이지로 이동
            navigate("/login");
          }
          
          localStorage.removeItem('socialProvider');
        });
      }
    } else {
      console.error("인가코드가 없습니다.");
      navigate("/login");
    }

    // Cleanup 함수
    return () => {
    };
  }, [navigate]);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-point mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">{getProviderDisplayName(currentProvider)} 로그인 처리 중...</p>
        </div>
      </div>
      {errorModal && (
        <AlertModal
          type="simple"
          title="로그인 오류"
          description={errorDescription}
          TrueBtnText="확인"
          onClickTrue={() => {
            setErrorModal(false);
            if (errorAction === "redirect") {
              navigate("/login");
            } else if (errorAction === "login") {
              UserStore.getState().logout();
              localStorage.clear();
              navigate("/login");
            } else {
              window.location.reload();
            }
          }}
        />
      )}
    </>
  );
}