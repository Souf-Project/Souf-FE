import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Step1 from "../components/join/step1";
import Step2 from "../components/join/step2";
import Step3 from "../components/join/step3";
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

  // location.state에서 step이 있으면 그것을 초기값으로 사용 (소셜 로그인 신규 사용자)
  const [step, setStep] = useState(location.state?.step || 1);
  const [selectedType, setSelectedType] = useState(null);

  return (
    <>
    <SEO title="회원가입" description="스프 SouF 회원가입" subTitle="스프"/>
    <div className="flex items-center justify-center my-20 w-full">
      <div className="w-full max-w-[60rem] px-4 bg-white ">
        {step === 1 && <Step1 setStep={setStep} />}
        {step === 2 && <Step2 setStep={setStep} setSelectedType={setSelectedType} />}
        {step === 3 && <Step3 socialLoginInfo={socialLoginInfo} selectedType={selectedType} />}
        
      </div>
    </div>
    </>
  );
}
