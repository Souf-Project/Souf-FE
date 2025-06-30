import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ButtonInput from "../components/buttonInput";
import Input from "../components/input";
import AlertModal from "../components/alertModal";
import VerrifyImg from "../assets/images/verifyImg.svg";
import { postStudentVerify, postEmailVerify } from "../api/member"; // API 함수 임포트

export default function VerifyStudent() {
  const navigate = useNavigate();

  // 이메일 입력 상태
  const [originalEmail, setOriginalEmail] = useState("");
  const [acKrEmail, setAcKrEmail] = useState("");
  // 인증 코드 입력 상태
  const [code, setCode] = useState("");

  // 인증 상태
  const [isConfirmed, setIsConfirmed] = useState(undefined);
  const [isValidateTrigger, setIsValidateTrigger] = useState(false);

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  // 1) 대학생 이메일 인증 요청 mutation
  const studentVerifyMutation = useMutation({
    mutationFn: () => postStudentVerify(originalEmail, acKrEmail),
    onSuccess: () => {
      setModalTitle("인증번호 발송");
      setModalDescription(
        "입력하신 이메일로 인증번호가 발송되었습니다. 이메일을 확인해주세요."
      );
      setModalOpen(true);
    },
    onError: (error) => {
      setModalTitle("인증요청 실패");
      if (error.response?.data?.message) {
        setModalDescription(error.response.data.message);
      } else {
        setModalDescription("인증번호 발송 중 오류가 발생했습니다.");
      }
      setModalOpen(true);
    },
  });

  // 2) 인증번호 확인 mutation
  const emailVerifyMutation = useMutation({
    mutationFn: () => postEmailVerify(acKrEmail, code, "MODIFY"),
    onSuccess: (response) => {
      // 서버에서 result가 true일 경우 인증 완료 처리
      if (response.data.result === true) {
        setModalOpen(true);
      }
      setIsValidateTrigger(true);
    },
    onError: () => {
      setIsConfirmed(false);
      setIsValidateTrigger(true);
    },
  });

  // input change 핸들러
  const handleOriginalEmailChange = (e) => setOriginalEmail(e.target.value);
  const handleAcKrEmailChange = (e) => setAcKrEmail(e.target.value);
  const handleCodeChange = (e) => {
    setCode(e.target.value);
    setIsConfirmed(undefined); // 입력시 인증 초기화
  };

  // 인증 요청 버튼 클릭
  const handleRequestVerification = () => {
    if (!originalEmail || !acKrEmail) {
      setModalTitle("입력 오류");
      setModalDescription("이메일을 모두 입력해주세요.");
      setModalOpen(true);
      return;
    }
    studentVerifyMutation.mutate();
  };

  // 인증번호 확인 버튼 클릭
  const handleCheckVerification = () => {
    if (!code) {
      setModalTitle("입력 오류");
      setModalDescription("인증번호를 입력해주세요.");
      setModalOpen(true);
      return;
    }
    emailVerifyMutation.mutate();
  };

  // 인증 완료 후 이동 버튼 클릭
  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <div className="w-screen h-screen flex">
      {/* 왼쪽 설명 영역 */}
      <div className="w-1/2 bg-[#FFE681] flex flex-col justify-center px-16 ">
        <div className="my-auto">
          <h1 className="text-6xl font-bold mb-6 mt-20">대학생 인증이란?</h1>
          <p className="text-xl font-regular leading-relaxed text-gray-800 mb-10">
            SouF는 대학생 인증 과정을 거칠 시
            <br />
            포트폴리오를 올리고, 기업에게서 제안을 받아보실 수 있습니다.
            <br />
            <br />
            대학생 인증 시 공고문은 올릴 수 없습니다.
          </p>
          <div className="mt-20">
            <img src={VerrifyImg} alt="Verify" className="ml-auto" />
          </div>
        </div>
      </div>

      {/* 오른쪽 입력 영역 */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center px-36">
        <h2 className="text-6xl font-bold mb-10 mr-auto">대학생 인증하기</h2>
        <div className="w-full space-y-6 bg-white p-8 border rounded-xl shadow">
          {/* 원래 이메일 */}
          <Input
            title="계정 이메일"
            value={originalEmail}
            onChange={handleOriginalEmailChange}
            placeholder="your.email@example.com"
            essentialText="이메일을 입력해주세요"
          />
          {/* 대학생 이메일 + 인증 요청 버튼 */}
          <ButtonInput
            title="학교 이메일"
            value={acKrEmail}
            onChange={handleAcKrEmailChange}
            btnText={studentVerifyMutation.isLoading ? "요청 중..." : "인증요청"}
            onClick={handleRequestVerification}
            placeholder="Souf@souf.ac.kr"
            essentialText="학교 이메일을 입력해주세요"
            disabled={studentVerifyMutation.isLoading}
          />
          {/* 인증번호 입력 + 확인 버튼 */}
          <ButtonInput
            title="인증번호 확인"
            value={code}
            onChange={handleCodeChange}
            btnText={emailVerifyMutation.isLoading ? "확인 중..." : "인증하기"}
            onClick={handleCheckVerification}
            placeholder="인증 코드를 입력하세요"
            isValidateTrigger={isValidateTrigger}
            isConfirmed={isConfirmed}
            essentialText="인증번호를 입력해주세요"
            approveText="인증이 완료되었습니다."
            disapproveText="인증번호가 올바르지 않습니다."
            disabled={emailVerifyMutation.isLoading}
          />
        </div>
      </div>

      {/* 모달 */}
      {modalOpen && (
        <AlertModal
          type="simple"
          title={modalTitle}
          description={modalDescription}
          TrueBtnText="확인"
          onClickTrue={() => {setModalOpen(false); navigate("/");}}
        />
      )}
    </div>
  );
}
