// src/pages/withdraw.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WithdrawalConfirm from "../components/withdraw/withdrawConfirm";
import WithdrawDescription from "../components/withdraw/withdrawDescription";

export default function Withdraw() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleWithdraw = () => {
    // 실제 탈퇴 API 호출 (예시로는 confirm만 사용)
    //const confirmWithdraw = window.confirm("정말 탈퇴하시겠습니까?");


    if (confirmWithdraw) {
      alert("회원탈퇴가 완료되었습니다.");
      navigate("/"); // 홈으로 이동
    }
  };

  //bg-yellow-main 
  return (
    <div className="min-h-screen py-24 px-52 flex flex-col items-center justify-center w-full">
      <div className=" flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-20 w-full  text-center border border-yellow-400">
        {step === 1  && <WithdrawDescription
        onWithdraw={() => setStep(2)}/>}
        {step === 2  && <WithdrawalConfirm/>}
      </div>
    </div>
  );
}
