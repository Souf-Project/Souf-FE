import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../input";
import ButtonInput from "../buttonInput";
import Button from "../button";
import { useMutation } from "@tanstack/react-query";
import {
  getNickNameVerify,
  postEmailVerification,
  postEmailVerify,
} from "../../api/member";
import CategorySelectBox from "../categorySelectBox";
import AlertModal from "../alertModal";

export default function Step1() {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [verification, setVerification] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [checkResult, setCheckResult] = useState(null);
  const [nicknameModal, setNicknameModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [description, setDescription] = useState("");

  const emailVerificationMutation = useMutation({
    mutationFn: (email) => postEmailVerification(email),
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

  const {
    mutate: checkNickname,
    isLoading,
    isError,
    error,
    data,
  } = useMutation({
    mutationFn: () => getNickNameVerify(nickname),
    onSuccess: (data) => {
      setCheckResult(data.result); // true/false 반환한다고 가정
    },
  });

  const emailNumberVerificationMutation = useMutation({
    mutationFn: ({ email, verification }) =>
      postEmailVerify(email, verification),
    onSuccess: (response, { email }) => {
      if (response.result === true) {
        updateUserData("email", email);
        setApproveText("인증번호가 확인되었습니다.");
        setEmailVerification(true);
        // 여기도 초록색 처리
      } else {
        setApproveText("인증번호가 일치하지 않습니다.");
        setEmailVerification(false);
        // 여기도 빨간색 처리
      }
    },
    onError: (error) => {
      setApproveText("서버 오류로 인증에 실패했습니다.");
      setEmailVerification(false);
    },
  });

  //  const nickNameVerification = useMutation({})

  return (
    <div className="w-full rounded-[30px] border-[1px] py-20 px-52 flex flex-col items-center justify-center">
      <Input
        title="이름"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <ButtonInput
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        title="닉네임"
        btnText="중복확인"
        onClick={() => checkNickname(nickname)}
      />
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
        onClick={() =>
          emailNumberVerificationMutation.mutate({ email, verification })
        }
      />
      <Input
        title="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        title="비밀번호 확인"
        type="password"
        value={passwordCheck}
        onChange={(e) => setPasswordCheck(e.target.value)}
      />
      <div className="w-full relative mb-8">
        <div className="text-black text-2xl font-regular mb-4">
          관심분야 <span className="text-gray-500 text-sm">(선택)</span>
        </div>
        <CategorySelectBox defaultValue="추가하기" type="join" />
        {/* 백엔드 필드 나오는 거 보고 해당 개수 최대 3개로 해서 추가되게 하기
        store 로 저장해서 카테고리가 하나있다면 하나 더. 
        두개라면 하나더 이런식으로 ... ?
        그럼 store 에서 최대값을 지정해주고 그 최대값 만큼 해주는 걸로?
        3으로 잡아두고 -1 씩하면서 0이면 더이상 추가하기 안 보이게 하는 느낌 */}
        <CategorySelectBox defaultValue="추가하기" type="join" />
        <CategorySelectBox defaultValue="추가하기" type="join" />
      </div>

      <Button btnText="회원가입" />
      {nicknameModal && (
        <AlertModal
          type={checkResult ? "success" : "warning"}
          title={
            checkResult
              ? "사용 가능한 닉네임입니다."
              : "이미 가입된 닉네임입니다."
          }
          TrueBtnText="확인"
        />
      )}
      {emailModal && (
        <AlertModal
          title={modalTitle}
          TrueBtnText="확인"
          onClickTrue={() => setEmailModal(false)}
        />
      )}
    </div>
  );
}
