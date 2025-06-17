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

export default function PwdFind({}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verification, setVerification] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(null); // undefined, true, false
  const [approveText, setApproveText] = useState("");
  const [disapproveText, setDisapproveText] = useState("");
  const [emailModal, setEmailModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [description, setDescription] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [modalTitle2, setModalTitle2] = useState("");
  const [description2, setDescription2] = useState("");

  const emailVerificationMutation = useMutation({
    mutationFn: (email) => postResetEmailVerification(email),
    onSuccess: (response) => {
      setModalTitle("인증번호 발송");
      setDescription(`입력하신 이메일로 \n인증번호가 발송되었습니다.`);
      setEmailModal(true);
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        setModalTitle("중복된 이메일");
        setDescription("이미 회원가입된 이메일입니다.");
      } else {
        setModalTitle("인증번호 발송 오류");
        setDescription("올바르지 않은 이메일 형식입니다.");
      }
      setIsEmailModal(true);
    },
  });
  const emailNumberVerificationMutation = useMutation({
    mutationFn: ({ email, verification }) =>
      postEmailVerify(email, verification),
    onSuccess: (response) => {
      console.log(response);
      if (response.data.result === true) {
        setApproveText("인증번호가 확인되었습니다.");
        setIsConfirmed(true);
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
      console.log(response);
      if (response.data.status === 200) {
        setModalTitle2("비밀번호 재설정 성공");
        setDescription2("비밀번호가 성공적으로 변경되었습니다.");
        setSuccessModal(true);
      } else {
        setModalTitle2("비밀번호 재설정 실패");
        setDescription2("새로고침 후 재시도해주시길 바랍니다.");
        setSuccessModal(false);
      }
    },
    onError: () => {
      setModalTitle2("비밀번호 재설정 실패");
      setDescription2("서버 오류로 비밀번호 변경에 실패했습니다.");
      setSuccessModal(false);
    },
  });

  return (
    <div className="flex items-center justify-center my-20 ">
      <div className="w-[1000px]">
        <div className="font-semibold text-[60px] mt-12 mb-6">
          비밀번호 재설정
        </div>
        <div className="w-full rounded-[30px] border-[1px] py-20 px-52 flex flex-col items-center justify-center">
          <ButtonInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            title="이메일"
            btnText="인증요청"
            onClick={() => emailVerificationMutation.mutate(email)}
          />
          <ButtonInput
            value={verification}
            onChange={(e) => setVerification(e.target.value)}
            title="이메일 인증"
            btnText="인증확인"
            approveText={approveText}
            disapproveText="인증번호가 일치하지 않습니다."
            isConfirmed={isConfirmed}
            onClick={() =>
              emailNumberVerificationMutation.mutate({ email, verification })
            }
          />
          {isConfirmed && (
            <div className="w-full mb-8">
              <Input
                title="비밀번호"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                title="비밀번호 확인"
                type="password"
                value={ConfirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              onClickTrue={() => setEmailModal(false)}
            />
          )}

          <Button
            btnText="완료"
            onClick={() => resetPasswordMutation.mutate()}
          />
        </div>
      </div>
    </div>
  );
}
