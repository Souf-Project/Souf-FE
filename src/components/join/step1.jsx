import React from "react";
import { useNavigate } from "react-router-dom";
import SouFLogo from "../../assets/images/SouFLogo.png";
import kakaoLogo from "../../assets/images/kakaoLogo.png";
import googleLogo from "../../assets/images/googleLogo.png";

export default function Step1({ setStep }) {
    const navigate = useNavigate();
   
  // 카카오 로그인
  const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile_nickname,account_email,profile_image`;

  const handleKakaoLogin = () => {
    localStorage.setItem("socialProvider", "KAKAO");
    localStorage.setItem("isSignup", "true"); // 회원가입 플로우 표시
    window.location.href = KAKAO_AUTH_URL;
  };

  // 구글 로그인
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;

  const handleGoogleLogin = () => {
    localStorage.setItem("socialProvider", "GOOGLE");
    localStorage.setItem("isSignup", "true"); // 회원가입 플로우 표시
    window.location.href = GOOGLE_AUTH_URL;
  };

    return (
        <div className="flex flex-col items-center justify-center gap-10">
            <img src={SouFLogo} alt="SouFLogo" className="w-32 brightness-0" />
            <h1 className="text-3xl md:text-5xl font-bold text-center">
                <span className="text-blue-500">스프 회원가입</span><span>을</span>
                <br/> 
                <span>환영합니다</span>
            </h1>
            <p className="text-sm text-gray-600 text-center">
                  스프는 크롬 브라우저 사용을 권장합니다
                </p>
            <div className="flex flex-col items-center justify-center gap-4 w-80 md:w-[24rem]">
                  <button
                    type="button"
                    onClick={handleKakaoLogin}
                    className="w-full text-md md:text-2xl bg-[#FEE500] rounded-xl p-4 shadow-sm hover:shadow-md duration-200 flex items-center pl-8 gap-10"
                  >
                    <img
                      src={kakaoLogo}
                      alt="카카오 로그인"
                      className="w-8 object-contain"
                    />
                    <p>카카오 계정으로 회원가입</p>
                  </button>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full text-md md:text-2xl bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md duration-200 flex items-center pl-8 gap-16"
                  >
                    <img
                      src={googleLogo}
                      alt="구글 로그인"
                      className="w-8 object-contain"
                    />
                    구글로 회원가입
                  </button>
                    <button 
                        onClick={() => setStep(2)}
                        className="w-full text-md md:text-2xl bg-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md duration-200 flex items-center justify-center pl-8 gap-10">
                        이메일로 회원가입
                    </button>
                </div>
                <div className="h-[1px] bg-gray-600 w-96"></div>
                <div className="flex items-center justify-center gap-4">
                    <p className="text-black text-md md:text-2xl font-semibold">이미 사용하는 계정이 있다면?</p>
                    <button className="text-neutral-400 text-md md:text-2xl font-semibold"
                    onClick={() => navigate("/login")}>로그인하기→</button>
                </div>
        </div>
    )
}