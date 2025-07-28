import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/input";
import ButtonInput from "../components/buttonInput";
import Button from "../components/button";
import Step1 from "../components/join/step1";
import Step2 from "../components/join/step2";
import SEO from "../components/seo";

export default function Join({}) {
  const navigate = useNavigate();
  //const [step, setStep] = useState(1);
  return (
    <>
    <SEO title="회원가입" description="스프 SouF 회원가입" subTitle="스프"/>
    <div className="flex items-center justify-center my-20 w-full">
      <div className="w-full max-w-[1000px] px-4 bg-white ">
        <div className="font-semibold text-3xl sm:text-[48px] md:text-[60px] max-sm:pl-4">회원 가입</div>
        <Step1 />
      </div>
    </div>
    </>
  );
}
