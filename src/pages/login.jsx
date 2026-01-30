import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Input from "../components/input";
import loginImg from "../assets/images/loginImg.svg";
import { postLogin } from "../api/member";
import { useMutation } from "@tanstack/react-query";
import { UserStore } from "../store/userStore";
import kakaoLogo from "../assets/images/kakaoLogo.png";
import googleLogo from "../assets/images/googleLogo.png";
import { LOGIN_ERRORS } from "../constants/user";
import SEO from "../components/seo";
import AlertModal from "../components/alertModal";
import { setCookie, getCookie } from "../api/client";
import { trackEvent } from "../analytics";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [errorAction, setErrorAction] = useState("");

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => postLogin(email, password),
    onSuccess: async (response) => {
      const result = response.data?.result;
      const phoneNumber = result.phoneNumber;

      // 먼저 로그인 상태 설정 (UserStore에 정보 저장 및 토큰 저장)
      UserStore.getState().setUser({
        memberId: result.memberId,
        nickname: result.nickname,
        roleType: result.roleType,
        approvedStatus: result.approvedStatus,
        phoneNumber: phoneNumber || null, // 전화번호가 없어도 null로 저장
      });
      // console.log("UserStore:", UserStore.getState());

      UserStore.getState().setAccessToken(result.accessToken);
      localStorage.setItem("accessToken", result.accessToken);
      
      // 쿠키에서 refreshToken 읽기 (서버에서 쿠키로 보내줌)
      setTimeout(() => {
        const refreshTokenFromCookie = getCookie("refreshToken") || 
                                       getCookie("RefreshToken") || 
                                       getCookie("refresh_token");
        
        if (refreshTokenFromCookie) {
          localStorage.setItem("refreshToken", refreshTokenFromCookie);
       
        } else {
          // 응답 데이터에 refreshToken이 있는 경우 (fallback)
          if (result.refreshToken) {
            localStorage.setItem("refreshToken", result.refreshToken);
            setCookie("refreshToken", result.refreshToken, 30);
           
          } 
        }
      }, 100);

      trackEvent("login_success", {
        login_type: "normal",
        user_type: result.roleType || "UNKNOWN",
      });

      // 전화번호가 없으면 추가 인증 안내 모달 표시
      if(!phoneNumber) {
        setErrorDescription("신뢰도 높은 서비스 이용을 위하여 \n 회원가입 절차가 수정되었습니다. \n 추가 인증 정보 입력 페이지로 이동합니다.");
        setErrorTitle("추가 인증 정보 필요");
        setErrorAction("/additionalInfo");
        // roleType을 localStorage에 임시 저장 (additionalInfo 페이지에서 사용)
        if (result?.roleType) {
          localStorage.setItem("pendingRoleType", result.roleType);
        }
        setErrorModal(true);
        return;
      }

      // 전화번호가 있으면 메인 페이지로 이동
      navigate("/");
    },

    onError: (error) => {
      const errorKey = error.response.data.errorKey;
      const errorInfo = LOGIN_ERRORS[errorKey];
      setErrorDescription(errorInfo?.message || "알 수 없는 오류가 발생했습니다.");
      setErrorAction(errorInfo?.action || "refresh");
      setErrorModal(true);
    },
  });

  // 카카오 로그인
  const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile_nickname,account_email,profile_image`;

  const handleKakaoLogin = () => {
    localStorage.setItem("socialProvider", "KAKAO");
    window.location.href = KAKAO_AUTH_URL;
  };

  // 구글 로그인
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;

  const handleGoogleLogin = () => {
    localStorage.setItem("socialProvider", "GOOGLE");
    window.location.href = GOOGLE_AUTH_URL;
  };

  const clearAllErrors = () => {
    if (emailError) setEmailError("");
    if (passwordError) setPasswordError("");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearAllErrors();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearAllErrors();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isFormValid = true;
    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      isFormValid = false;
    }
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      isFormValid = false;
    }

    if (isFormValid) {
      loginMutation.mutate({ email, password });
    }
  };

  return (
    <>
      <SEO title="로그인" description="스프 SouF 로그인" subTitle="스프" />
      <div className="w-screen lg:h-screen h-full flex flex-col lg:flex-row bg-[#D2E4FF]">
        {/* PC 버전 스프 설명 */}
        <div className="hidden lg:block lg:w-1/2 my-auto flex flex-col justify-center">
          <div className="my-auto max-w-[30rem] ml-auto mr-8">
            <h1 className="text-7xl font-bold mb-6 text-black">SouF</h1>
            <p className="text-3xl font-bold leading-relaxed text-black mb-10">
              합리적인 비용으로
              <br />
              필요한 인재를 만나보세요!
              <br />
              지금 바로 스프에서!
            </p>
            <div className="mt-20 w-1/2 h-auto ml-auto">
              <img src={loginImg} className=" w-full" />
            </div>
          </div>
        </div>
        {/* 모바일 버전 스프 설명 */}
        <div className="lg:hidden flex justify-center items-center mt-24 mb-8 ">
          <h1 className="text-xl font-bold text-blue-main">SouF</h1>
          <span className="w-[2px] h-20 bg-blue-main mx-4"></span>

          <p className="text-xl font-bold leading-relaxed text-blue-main">
            합리적인 비용으로
            <br />
            필요한 인재를 만나보세요!
            <br />
            지금 바로 스프에서!
          </p>
        </div>
        <div className="w-full lg:w-1/2 lg:bg-white flex flex-col justify-center items-center px-4 h-full">
          <div className="max-w-[20rem] lg:ml-20 lg:mr-auto mx-auto w-full">
            <h2 className="text-xl lg:text-3xl font-bold mx-auto w-fit">
              로그인
            </h2>
            <p className="text-xs text-gray-600 text-center mb-4 mt-2">
            스프는 크롬 브라우저 사용을 권장합니다
                </p>
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-sm bg-white p-6 lg:p-8 border rounded-xl shadow-md"
            >
              <Input
                title="이메일"
                // isValidateTrigger={isValidateTrigger}
                value={email}
                isConfirmed={emailError ? false : undefined}
                onChange={handleEmailChange}
                placeholder="Souf@souf.com"
                essentialText="이메일을 입력해주세요"
                disapproveText={
                  emailError === "이메일을 입력해주세요." ? emailError : ""
                }
                // onValidChange={onValidChange}
              />
              <Input
                title="비밀번호"
                // isValidateTrigger={isValidateTrigger}
                type="password"
                placeholder=""
                value={password}
                isConfirmed={passwordError ? false : undefined}
                onChange={handlePasswordChange}
                essentialText="비밀번호를 입력해주세요"
                disapproveText={passwordError}
                // onValidChange={onValidChange}
              />

              <div className="flex justify-between text-[#767676] text-xl font-reagular">
                <button type="button" onClick={() => navigate("/join")}>
                  회원가입
                </button>
                <button type="button" onClick={() => navigate("/pwdFind")}>
                  비밀번호 재설정
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-main text-white mx-auto w-36 py-2 rounded-xl text-xl font-semibold mt-4"
                >
                  로그인
                </button>
              </div>
              <div className="flex flex-col items-center justify-center mt-4">
                <div className="flex items-center justify-center w-full mb-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <p className="text-lg font-light mx-4">
                    SNS 계정으로 시작하기
                  </p>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleKakaoLogin}
                    className="w-60 bg-[#FEE500] rounded-xl p-4 shadow-sm hover:shadow-md duration-200 flex items-center justify-center gap-4"
                  >
                    <img
                      src={kakaoLogo}
                      alt="카카오 로그인"
                      className="w-[1.4rem] object-contain"
                    />
                    <p>카카오 계정으로 로그인</p>
                  </button>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-60 bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md duration-200 flex items-center justify-center gap-7"
                  >
                    <img
                      src={googleLogo}
                      alt="구글 로그인"
                      className="w-[1.4rem] object-contain"
                    />
                    구글 계정으로 로그인
                  </button>
                </div>
               
              </div>
            </form>
          </div>
        </div>
        <div className="mt-10  lg:hidden flex justify-center">
          <img src={loginImg} className=" w-1/2" />
        </div>
      </div>
      {errorModal && (
        <AlertModal
        type="simple"
        title={errorTitle || "잘못된 접근"}
        description={errorDescription}
        TrueBtnText="확인"
        onClickTrue={() => {
          setErrorModal(false);
          // console.log("errorAction:", errorAction);
          if (errorAction === "redirect") {
              navigate("/feed");
          }else if(errorAction === "login"){
            localStorage.clear();
            navigate("/login");
          } else if(errorAction === "/additionalInfo"){
            // console.log("Navigating to /additionalInfo");
            // window.location.href를 사용하여 강제로 페이지 이동
            window.location.href = "/additionalInfo";
          }
          else{
            window.location.reload();
          }
        }}
          />
      )}
    </>
  );
}
