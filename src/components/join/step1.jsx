import React from "react";
import { useNavigate } from "react-router-dom";
import SouFLogo from "../../assets/images/SouFLogo.png";
import kakaoLogo from "../../assets/images/kakaoLogo.png";
import googleLogo from "../../assets/images/googleLogo.png";

export default function Step1({ setStep }) {
    const navigate = useNavigate();
    const handleKakaoLogin = () => {
        console.log("카카오 로그인");
    }
    const handleGoogleLogin = () => {
        console.log("구글 로그인");
    }
    return (
        <div className="flex flex-col items-center justify-center gap-10">
            <img src={SouFLogo} alt="SouFLogo" className="w-32 brightness-0" />
            <h1 className="text-5xl font-bold text-center">
                <span className="text-blue-500">스프 회원가입</span><span>을</span>
                <br/> 
                <span>환영합니다</span>
            </h1>
            <div className="flex flex-col items-center justify-center gap-4 w-[24rem]">
                  <button
                    type="button"
                    onClick={handleKakaoLogin}
                    className="w-full text-2xl bg-[#FEE500] rounded-xl p-4 shadow-sm hover:shadow-md duration-200 flex items-center pl-8 gap-10"
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
                    className="w-full text-2xl bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md duration-200 flex items-center pl-8 gap-16"
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
                        className="w-full text-2xl bg-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md duration-200 flex items-center justify-center pl-8 gap-10">
                        이메일로 회원가입
                    </button>
                </div>
                <div className="h-[1px] bg-gray-600 w-96"></div>
                <div className="flex items-center justify-center gap-4">
                    <p className="text-black text-2xl font-semibold">이미 사용하는 계정이 있다면?</p>
                    <button className="text-neutral-400 text-2xl font-semibold"
                    onClick={() => navigate("/login")}>로그인하기→</button>
                </div>
        </div>
    )
}