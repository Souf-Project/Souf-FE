import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { postSocialLogin, postSocialLoginLink } from "../api/social";
import { UserStore } from "../store/userStore";

export default function Redirect() {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);
  
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
        .then((response) => {
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
              localStorage.removeItem('socialProvider');
              
              navigate("/");
            }
             else {
            // console.log(result)
              navigate("/join", { 
                state: { 
                  socialLogin: true,
                  provider: detectedProvider || {},
                  email: result.prefill.email || {},
                  username: result.prefill.name || {},
                  registrationToken: result.message,
                },
                
              });
            }
          } else {
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("소셜 로그인 에러:", error);
          
          // 409 에러 (이미 가입된 이메일) 처리
          if (error.response?.status === 409) {
            const errorMessage = error.response?.data?.message || "이미 가입된 이메일입니다. 마이페이지에서 소셜 계정을 연결해주세요.";
            alert(errorMessage);
          }
          
          navigate("/login");
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-point mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">{getProviderDisplayName(currentProvider)} 로그인 처리 중...</p>
      </div>
    </div>
  );
}