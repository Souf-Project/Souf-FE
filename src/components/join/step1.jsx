import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../input";
import ButtonInput from "../buttonInput";
import Button from "../button";
import { useMutation } from "@tanstack/react-query";
import {
  getNickNameVerify,
  postEmailVerification,
  postEmailVerify,
  postSignUp,
} from "../../api/member";
import CategorySelectBox from "../categorySelectBox";
import AlertModal from "../alertModal";

export default function Step1() {
  const [email, setEmail] = useState("");
  const [verification, setVerification] = useState("");

  const [checkResult, setCheckResult] = useState(null);
  const [nicknameModal, setNicknameModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [nickname, setNickname] = useState("");
  const [isNameConfirm, setIsNameConfirm] = useState(undefined);

  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    email: "",
    password: "",
    passwordCheck: "",
    categoryDtos: [
      {
        firstCategory: null,
        secondCategory: null,
        thirdCategory: null,
      },
      {
        firstCategory: null,
        secondCategory: null,
        thirdCategory: null,
      },
      {
        firstCategory: null,
        secondCategory: null,
        thirdCategory: null,
      },
    ],
  });

  const emailVerificationMutation = useMutation({
    mutationFn: (email) => postEmailVerification(email),
    onSuccess: (response) => {
      console.log(response?.data?.message);
      setModalTitle("인증번호 발송");
      setDescription(`입력하신 이메일로 \n인증번호가 발송되었습니다.`);
      setEmailModal(true);
    },
    onError: (error) => {
      console.log("에러발생", error);
      if (error.response?.data?.code === 400) {
        setModalTitle("중복된 이메일");
        setDescription(error.response?.data?.message);
      } else {
        setModalTitle("인증번호 발송 오류");
        setDescription("올바르지 않은 이메일 형식입니다.");
      }
      setEmailModal(true);
    },
  });

  const {
    mutate: checkNickname,
    isLoading,
    isError,
    error,
    data,
  } = useMutation({
    mutationFn: (nickname) => getNickNameVerify(nickname),
    onSuccess: (response) => {
      console.log(response.data);
      setCheckResult(response.data.result);
      setNicknameModal(true);
    },
  });

  const emailNumberVerificationMutation = useMutation({
    mutationFn: ({ email, verification }) =>
      postEmailVerify(email, verification, "SIGNUP"),
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

  const postSignUpMutation = useMutation({
    mutationFn: () => {
      const cleanedCategories = formData.categoryDtos
        .map((category) => {
          const cleaned = {};
          if (category.firstCategory !== null)
            cleaned.firstCategory = category.firstCategory;
          if (category.secondCategory !== null)
            cleaned.secondCategory = category.secondCategory;
          if (category.thirdCategory !== null)
            cleaned.thirdCategory = category.thirdCategory;
          return Object.keys(cleaned).length > 0 ? cleaned : null;
        })
        .filter(Boolean); // null 제거

      // 선택된 카테고리 수 검증
      if (cleanedCategories.length === 0) {
        alert("최소 1개 이상의 카테고리를 선택해주세요.");
        return;
      }

      if (cleanedCategories.length > 3) {
        alert("최대 3개까지의 카테고리만 선택 가능합니다.");
        return;
      }

      // 최종 전송 데이터 구성
      const finalData = {
        ...formData,
        categoryDtos: cleanedCategories,
      };

      return postSignUp(finalData);
    },
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      setApproveText("서버 오류로 인증에 실패했습니다.");
      console.log(error);
      setEmailVerification(false);
    },
  });

  const handleCategoryChange = (index) => (categoryData) => {
    setFormData((prev) => {
      const updatedCategories = prev.categoryDtos.map((cat, i) =>
        i === index ? categoryData : cat
      );
      return {
        ...prev,
        categoryDtos: updatedCategories,
      };
    });
  };

  const handleInputChange = (name, e) => {
    const { value } = e.target;
    if (value === "") {
      setIsNameConfirm(true);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(formData);
  };

  //  const nickNameVerification = useMutation({})

  return (
    <div className="mx-auto w-2/3 lg:w-full rounded-[30px] border-[1px] py-20 px-16 lg:px-52 flex flex-col items-center justify-center">
      <Input
        title="이름"
        name="username"
        value={formData.username}
        onChange={(e) => handleInputChange("username", e)}
        disapproveText="이름을 입력해주세요."
        essentialText="이름을 입력해주세요."
      />
      <ButtonInput
        name="nickname"
        value={formData.nickname}
        onChange={(e) => {
          setNickname(e.target.value);
          handleInputChange("nickname", e);
        }}
        title="닉네임"
        btnText="중복확인"
        essentialText="닉네임을 입력해주세요."
        onClick={() => checkNickname(nickname)}
      />
      <ButtonInput
        name="email"
        value={formData.email}
        onChange={(e) => {
          setEmail(e.target.value);
          handleInputChange("email", e);
        }}
        title="이메일"
        btnText="인증요청"
        essentialText="이메일을 입력해주세요."
        onClick={() => emailVerificationMutation.mutate(email)}
      />

<ButtonInput
  value={verification}
  onChange={(e) => setVerification(e.target.value)}
  title="이메일 인증"
  btnText="인증확인"
  onClick={() =>
    emailNumberVerificationMutation.mutate({
      email: formData.email,
      verification,
    })
  }
/>

      <Input
        title="비밀번호"
        type="password"
        name="password"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e)}
      />
      <Input
        title="비밀번호 확인"
        type="password"
        name="passwordCheck"
        value={formData.passwordCheck}
        onChange={(e) => handleInputChange("passwordCheck", e)}
      />
      <div className="w-full relative mb-8 flex flex-col gap-3">
        <div className="text-black text-2xl font-regular mb-2">
          관심분야 <span className="text-gray-500 text-sm">(선택)</span>
        </div>
        {formData?.categoryDtos?.map((category, index) => (
          <CategorySelectBox
            key={index}
            title=""
            content=""
            defaultValue={category}
            type="text"
            isEditing={true}
            onChange={handleCategoryChange(index)}
          />
        ))}
        {formData?.categoryDtos.length < 3 && (
          <CategorySelectBox
            key={formData?.categoryDtos.length + 1}
            title=""
            content=""
            defaultValue={category}
            type="text"
            isEditing={true}
            onChange={handleCategoryChange(formData?.categoryDtos.length + 1)}
          />
        )}
      </div>

      <Button btnText="회원가입" onClick={() => postSignUpMutation.mutate()} />
      {nicknameModal && (
        <AlertModal
          type={checkResult ? "success" : "warning"}
          title={
            checkResult
              ? "사용 가능한 닉네임입니다."
              : "이미 가입된 닉네임입니다."
          }
          TrueBtnText="확인"
          onClickTrue={() => setNicknameModal(false)}
        />
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
    </div>
  );
}
