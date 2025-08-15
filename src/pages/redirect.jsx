import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { postSocialLogin } from "../api/social";
import { UserStore } from "../store/userStore";

export default function Redirect() {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // 이미 처리되었으면 중복 실행 방지 -> 카카오 로그인시 400 토큰 에러 뜨는거 방지!!
    if (hasProcessed.current) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const provider = localStorage.getItem('socialProvider');
    
    if (code && provider) {
      // 처리 시작 표시
      hasProcessed.current = true;
      
      postSocialLogin({ 
        code: code,
        provider: provider
      })
        .then((response) => {
          const result = response?.result;
          
          if (result) {
            console.log(result)
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
            console.log(result)
              navigate("/join", { 
                state: { 
                  socialLogin: true,
                  provider: provider || {},
                  email: result.prefill.email || {},
                  username: result.prefill.name || {},
                  registrationToken: result.registrationToken || {},
                },
                
              });
            }
          } else {
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("소셜 로그인 에러:", error);
          navigate("/login");
        });
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
        <p className="text-lg text-gray-600">카카오 로그인 처리 중...</p>
      </div>
    </div>
  );
}