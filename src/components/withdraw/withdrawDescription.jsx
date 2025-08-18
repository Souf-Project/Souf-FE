// src/components/WithdrawDescription.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

export default function WithdrawDescription({ onWithdraw }) {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="text-3xl font-bold mb-2 text-gray-800">지금 떠나시면 ...</h1>
      <h1 className="text-3xl font-bold mb-6 text-[#FFC105]">데이터가 영영 사라져요 🥹</h1>
      <p className="mb-6 text-gray-600">
        탈퇴 시 모든 데이터는 복구할 수 없습니다.<br/>
        또한, 탈퇴 시 해당 이메일은 7일간 재가입이 불가능합니다.<br/>
        정말로 Souf 플랫폼을 탈퇴하시겠습니까?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-md bg-gray-200 font-bold hover:bg-gray-300"
        >
          취소
        </button>
        <button
          onClick={onWithdraw}
          className="px-6 py-3 rounded-md bg-[#FFE58F] font-bold hover:bg-[#FFC105]"
        >
          탈퇴하기
        </button>
      </div>
    </>
  );
}
