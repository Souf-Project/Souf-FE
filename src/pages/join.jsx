import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import JoinForm from "../components/join/step1";
import SEO from "../components/seo";

export default function Join({}) {
  const navigate = useNavigate();
  const location = useLocation();
  // 소셜 로그인 정보 가져오기
  const socialLoginInfo = location.state?.socialLogin ? {
    socialLogin: location.state.socialLogin,
    provider: location.state.provider,
    email: location.state.email,
    username: location.state.username,
    registrationToken: location.state.registrationToken
  } : null;
  
  return (
    <>
    <SEO title="회원가입" description="스프 SouF 회원가입" subTitle="스프"/>
    <div className="flex items-center justify-center my-20 w-full">
      <div className="w-full max-w-[1000px] px-4 bg-white ">
        <div className="font-semibold text-3xl sm:text-[48px] md:text-[60px] max-sm:pl-4">회원 가입</div>
        <JoinForm socialLoginInfo={socialLoginInfo} />
      </div>
    </div>
    </>
  );
}
