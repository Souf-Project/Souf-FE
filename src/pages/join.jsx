import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/input";
import ButtonInput from "../components/buttonInput";
import Button from "../components/button";
import Step1 from "../components/join/step1";
import Step2 from "../components/join/step2";

export default function Join({}) {
  const navigate = useNavigate();
  //const [step, setStep] = useState(1);
  return (
    <div className="flex items-center justify-center my-20 ">
      <div className="w-[1000px]">
        <div className="font-semibold text-[60px]">회원 가입</div>
        <Step1 />
      </div>
    </div>
  );
}
