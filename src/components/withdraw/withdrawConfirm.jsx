// src/components/WithdrawalConfirmForm.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { deleteMemberWithdraw } from "../../api/member";
import AlertModal from "../alertModal";
import { UserStore } from "../../store/userStore";

export default function WithdrawalConfirm() {
  const [password, setPassword] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const navigate = useNavigate();

  const withdrawMutation = useMutation({
    mutationFn: () => deleteMemberWithdraw(password),
    onSuccess: () => {
      setModalTitle("탈퇴가 완료되었습니다");
      setModalDescription("");
      setIsModal(true);
    },
    onError: (error) => {
      console.error(error);
      if (error.response?.status === 400) {
        setModalTitle("회원 탈퇴 실패");
        setModalDescription("비밀번호가 일치하지 않습니다.");
      } else {
        setModalTitle("회원탈퇴에 실패했습니다.");
        
      }
      setIsModal(true);
    },
  });

  const handleSubmit = () => {
    if (password.trim() === "") {
      setModalTitle("비밀번호를 입력해주세요.");
      setIsModal(true);
      return;
    }

    withdrawMutation.mutate();
  };

  return (
    <div className="w-[450px] px-10 flex flex-col">
      <div className="flex flex-col gap-3 mb-6">
        <div className="text-black text-2xl font-regular mb-2">비밀번호</div>
        <input
          type="password"
          className="w-full py-2 px-2 font-medium bg-[#F6F6F6] text-black placeholder-[#81818a] text-lg border-0 border-b-[3px] outline-none transition-colors duration-200"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          disabled={withdrawMutation.isPending}
          className="px-6 py-3 rounded-md bg-red-500 text-white font-bold hover:bg-red-600 disabled:opacity-50"
        >
          {withdrawMutation.isPending ? "처리 중..." : "탈퇴"}
        </button>
      </div>

      {isModal && (
        <AlertModal
          type="simple"
          title={modalTitle}
          description={modalDescription}
          TrueBtnText="확인"
          onClickTrue={() => {
            setIsModal(false);
            if (modalTitle === "탈퇴가 완료되었습니다") {
                UserStore.getState().clearUser();
                // 로컬 스토리지 초기화
                localStorage.removeItem("isLogin");
                localStorage.removeItem("userType");
                localStorage.removeItem("userName");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user-storage");
                navigate("/"); // 탈퇴 완료 시 콜백 (ex. navigate("/"))
            }
          }}
        />
      )}
    </div>
  );
}
