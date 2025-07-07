// src/components/WithdrawalConfirmForm.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../input";

export default function WithdrawalConfirm({ onCancel, onSuccess }) {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    // 여기에 실제 탈퇴 API 호출 로직 추가
    // 예시로는 단순 confirm 처리
    //const confirmWithdraw = window.confirm("정말 탈퇴하시겠습니까?");
    if (confirmWithdraw) {
      alert("회원탈퇴가 완료되었습니다.");
      onSuccess(); // 성공 후 콜백 실행
    }
  };

  /*
        <input
        type="password"
        placeholder="비밀번호를 입력하세요"
        className="w-full p-3 border border-gray-300 rounded-md mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

  */
  return (
    <div className="w-[650px] px-36 flex flex-col ">
        <div >
            <div className="text-black text-2xl font-regular mb-2">비밀번호</div>
            <input
                type="password"
                className={`w-full py-2 px-2 font-medium bg-[#F6F6F6] text-black placeholder-[#81818a] text-lg border-0 border-b-[3px] outline-none transition-colors duration-200 `}
                placeholder="비밀번호를 입력해주세요"
            />
        </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-md bg-gray-200 font-bold hover:bg-gray-300"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-md bg-red-500 text-white font-bold hover:bg-red-600"
        >
          탈퇴 완료
        </button>
      </div>
    </div>
  );
}
