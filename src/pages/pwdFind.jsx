import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/input";
import ButtonInput from "../components/buttonInput";
import Button from "../components/button";
import { useMutation } from "@tanstack/react-query";
import {
  patchResetPassword,
  postEmailVerify,
  postResetEmailVerification,
} from "../api/member";
import AlertModal from "../components/alertModal";
import SEO from "../components/seo";
import { isPasswordMatch, isValidPassword } from "../utils/passwordCheck";

const MODAL_TITLE = {
  400: { title: "입력 오류", description: "올바른 값을 입력해주세요." },
  "M404-1": { title: "인증번호 발송 오류" },
};

export default function PwdFind({}) {
  const navigate = useNavigate();

  // 입력값 상태
  const [email, setEmail] = useState("");
  const [verification, setVerification] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  // API 및 인증 관련 상태
  const [isConfirmed, setIsConfirmed] = useState(null); // null, true, false
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // UI 피드백 및 모달 상태
  const [approveText, setApproveText] = useState("");
  const [disapproveText, setDisapproveText] = useState(""); // API용 불일치 메시지
  const [emailModal, setEmailModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [modalTitle2, setModalTitle2] = useState("");
  const [description2, setDescription2] = useState("");

  // 유효성 검사 에러 상태
  const [emailError, setEmailError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const emailVerificationMutation = useMutation({
    mutationFn: (email) => postResetEmailVerification(email),
    onSuccess: () => {
      setIsEmailSent(true);
      setModalTitle("인증번호 발송");
      setDescription(`입력하신 이메일로 \n인증번호가 발송되었습니다.`);
      setEmailModal(true);
    },
    onError: (error) => {
      const { code, errorKey, message } = error.response.data;
      const title =
        MODAL_TITLE[code]?.title || MODAL_TITLE[errorKey]?.title || "오류";
      const desc =
        MODAL_TITLE[code]?.description ||
        message ||
        "알 수 없는 오류가 발생했습니다.";
      setModalTitle(title);
      setDescription(desc);
      setEmailModal(true);
    },
  });

  const emailNumberVerificationMutation = useMutation({
    mutationFn: ({ email, verification }) =>
      postEmailVerify(email, verification, "RESET"),
    onSuccess: (response) => {
      if (response.result === true) {
        setApproveText("인증번호가 확인되었습니다.");
        setIsEmailVerified(true);
        setIsConfirmed(true);
        setVerificationError(""); // 성공 시 에러 초기화
      } else {
        setDisapproveText("인증번호가 일치하지 않습니다.");
        setIsConfirmed(false);
      }
    },
    onError: () => {
      setDisapproveText("서버 오류로 인증에 실패했습니다.");
      setIsConfirmed(false);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: () => patchResetPassword(email, newPassword, ConfirmPassword),
    onSuccess: (response) => {
      if (response.data.status === 200) {
        setModalTitle2("비밀번호 재설정 성공");
        setDescription2("비밀번호가 성공적으로 변경되었습니다.");
        setSuccessModal(true);
      } else {
        setModalTitle2("비밀번호 재설정 실패");
        setDescription2("새로고침 후 재시도해주시길 바랍니다.");
        setSuccessModal(true); // 실패해도 모달은 보여줌
      }
    },
    onError: () => {
      setModalTitle2("비밀번호 재설정 실패");
      setDescription2("서버 오류로 비밀번호 변경에 실패했습니다.");
      setSuccessModal(true);
    },
  });

  const handleSubmit = () => {
    // 유효성 검사 전 에러 상태 초기화
    setEmailError("");
    setVerificationError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    let isFormValid = true;

    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      isFormValid = false;
    }

    if (!isConfirmed) {
      setVerificationError("이메일 인증을 완료해주세요.");
      isFormValid = false;
    }

    if (isConfirmed) {
      if (!newPassword) {
        setNewPasswordError("비밀번호를 입력해주세요.");
        isFormValid = false;
      } else if (!isValidPassword(newPassword)) {
        setNewPasswordError(
          "비밀번호는 8~20자의 영문, 숫자, 특수문자를 모두 포함해야 합니다."
        );
        isFormValid = false;
      }
      if (!ConfirmPassword) {
        setConfirmPasswordError("비밀번호 확인을 입력해주세요.");
        isFormValid = false;
      } else if (
        newPassword &&
        !isPasswordMatch(newPassword, ConfirmPassword)
      ) {
        setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
        isFormValid = false;
      }
    }
    //비밀번호는 영문자·숫자·특수문자를 모두 포함해야 합니다.

    // 모든 검사를 통과했을 때만 API 호출
    if (isFormValid) {
      resetPasswordMutation.mutate();
    }
  };

  return (
    <>
      <SEO
        title="비밀번호 찾기"
        description="스프 SouF 비밀번호 찾기"
        subTitle="스프"
      />
      <div className="flex items-center justify-center my-20 w-full">
        <div className="w-full max-w-[1000px] px-4">
          <div className="max-sm:pl-4 font-semibold text-3xl sm:text-[48px] md:text-[60px] mt-12 sm:mb-6">
            비밀번호 재설정
          </div>
          <div className="w-full sm:mt-[5%] rounded-[30px] sm:border-[1px] py-8 md:py-16 px-4 sm:px-12 md:px-16 lg:px-48 flex flex-col items-center justify-center">
            <ButtonInput
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              title="이메일"
              btnText="인증요청"
              onClick={() => emailVerificationMutation.mutate(email)}
              essentialText="이메일을 입력해주세요"
              isConfirmed={emailError ? false : undefined}
              disapproveText={emailError}
              btnDisabled={email === ""}
            />
            <ButtonInput
              value={verification}
              onChange={(e) => {
                setVerification(e.target.value);
                if (verificationError) setVerificationError("");
              }}
              title="이메일 인증"
              btnText="인증확인"
              essentialText="이메일 인증을 완료해주세요"
              approveText={approveText}
              disapproveText={verificationError || disapproveText}
              isConfirmed={verificationError ? false : isConfirmed}
              onClick={() =>
                emailNumberVerificationMutation.mutate({ email, verification })
              }
              disabled={isEmailVerified}
              btnDisabled={!isEmailSent || isEmailVerified}
            />
            {isConfirmed && (
              <div className="w-full">
                <Input
                  title="비밀번호"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (newPasswordError) setNewPasswordError("");
                    if (confirmPasswordError) setConfirmPasswordError("");
                  }}
                  essentialText="비밀번호를 입력해주세요"
                  isConfirmed={newPasswordError ? false : undefined}
                  disapproveText={newPasswordError}
                />
                <Input
                  title="비밀번호 확인"
                  type="password"
                  value={ConfirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) setConfirmPasswordError("");
                  }}
                  essentialText="비밀번호 확인을 입력해주세요"
                  isConfirmed={confirmPasswordError ? false : undefined}
                  disapproveText={confirmPasswordError}
                />
              </div>
            )}
            {emailModal && (
              <AlertModal
                type="simple"
                title={modalTitle}
                description={description}
                TrueBtnText="확인"
                onClickTrue={() => setEmailModal(false)}
              />
            )}
            {successModal && (
              <AlertModal
                type="simple"
                title={modalTitle2}
                description={description2}
                TrueBtnText="확인"
                onClickTrue={() => navigate("/login")}
              />
            )}
            <Button btnText="완료" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </>
  );
}
