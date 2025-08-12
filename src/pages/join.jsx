import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../components/input";
import ButtonInput from "../components/buttonInput";
import Button from "../components/button";
import Step1 from "../components/join/step1";
import Step2 from "../components/join/step2";
import SEO from "../components/seo";

export default function Join({}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  
  // 소셜 로그인 정보 가져오기
  const socialLoginInfo = location.state?.socialLogin ? {
    socialLogin: location.state.socialLogin,
    provider: location.state.provider,
    socialUserInfo: location.state.socialUserInfo
  } : null;
  
  const handleNextStep = (socialLoginInfo, agreementData) => {
    setStep(2);
    setSocialLoginData(socialLoginInfo);
    setAgreementData(agreementData);
  };
  
  const handlePrevStep = () => {
    setStep(1);
  };
  
  // 소셜 로그인 정보를 위한 상태 추가
  const [socialLoginData, setSocialLoginData] = useState(null);
  // 약관 동의 상태를 위한 상태 추가
  const [agreementData, setAgreementData] = useState(null);
  
  return (
    <>
    <SEO title="회원가입" description="스프 SouF 회원가입" subTitle="스프"/>
    <div className="flex items-center justify-center my-20 w-full">
      <div className="w-full max-w-[1000px] px-4 bg-white ">
        <div className="font-semibold text-3xl sm:text-[48px] md:text-[60px] max-sm:pl-4">회원 가입</div>
        {step === 1 ? (
          <Step1 onNextStep={handleNextStep} socialLoginInfo={socialLoginInfo} />
        ) : (
          <Step2 onPrevStep={handlePrevStep} socialLoginInfo={socialLoginData} agreementData={agreementData} />
        )}
      </div>
    </div>
    </>
  );
}
