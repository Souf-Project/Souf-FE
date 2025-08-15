import { useState, useEffect } from "react";
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
import { postSocialSignUp } from "../../api/social";
import CategorySelectBox from "../categorySelectBox";
import AlertModal from "../alertModal";
import { filterEmptyCategories } from "../../utils/filterEmptyCategories";
import { useSignupMutations } from "../../hooks/join/join";
import { isValidPassword, isPasswordMatch } from "../../utils/passwordCheck";

export default function Step1({ onPrevStep, socialLoginInfo, agreementData }) {
  const [email, setEmail] = useState("");
  const [verification, setVerification] = useState("");
  const [verificationApproveText, setVerificationApproveText] = useState("");
  const [verificationCheck, setVerificationCheck] = useState(undefined);
  
  const [emailVerification, setEmailVerification] = useState(undefined);
  const [approveText,setApproveText] = useState("");
  

  const [checkResult, setCheckResult] = useState(undefined);
  const [nicknameModal, setNicknameModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [successModal,setSuccessModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [nickname, setNickname] = useState("");
  const [isNameConfirm, setIsNameConfirm] = useState(undefined);
  const [passwordValidation, setPasswordValidation] = useState(undefined);
  const [passwordCheckValidation, setpasswordCheckValidation] = useState(undefined);

  const [errors, setErrors] = useState({
    username: false,
    nickname: false,
    email: false,
    password: false,
    passwordCheck: false,
  });
  const navigate = useNavigate();

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

  // 소셜 로그인 -> 이메일&닉네임 자동 설정
  useEffect(() => {
    if (socialLoginInfo?.socialLogin) {
      if (socialLoginInfo?.email) {
       
        setEmail(socialLoginInfo.email);
        setFormData(prev => ({ 
          ...prev, 
          email: socialLoginInfo.email 
        }));
        // 소셜 로그인이면 이메일 인증X
        setEmailVerification(true);
        setVerificationCheck(true);
      }
      if (socialLoginInfo?.username) {
        setFormData(prev => ({ 
          ...prev, 
          username: socialLoginInfo.username 
        }));
      }
    }
  }, [socialLoginInfo]);

  const validateForm = () => {
    // 소셜 로그인이면 비밀번호 검증 X
    if (socialLoginInfo?.socialLogin) {
      const newErrors = {
        username: !formData.username.trim(),
        nickname: !formData.nickname.trim() || !checkResult,
        email: !formData.email.trim(),
        password: false, 
        passwordCheck: false, 
      };
      
      setErrors(newErrors);
      return !newErrors.username && !newErrors.nickname && !newErrors.email;
    }

    // 일반 회원가입이면 검증 다 수행
    const isPasswordValid = isValidPassword(formData.password);
    const isPasswordMatchValid = isPasswordMatch(formData.password, formData.passwordCheck);
  
    const newErrors = {
      username: !formData.username.trim(),
      nickname: !formData.nickname.trim() || !checkResult,
      email: !formData.email.trim(),
      password: !isPasswordValid,
      passwordCheck: !isPasswordMatchValid,
    };
  
    setErrors(newErrors);
    setPasswordValidation(isPasswordValid);
  
    const hasError = Object.values(newErrors).some(Boolean);
    return !hasError;
  };

  //따로 뺀 부분
  const {
    emailVerificationMutation,
    checkNickname,
    emailVerify,
    signUp,
    socialSignUp,
  } = useSignupMutations({
    onEmailSuccess: (data) => {
      setEmailVerification(true);
      setModalTitle("인증번호가 전송되었습니다.");
      setDescription("이메일로 전송된 인증번호를 입력해주세요.");
      setEmailModal(true);
    },
    onEmailError: (error) => {
      setModalTitle("인증번호 전송 실패");
      setDescription("인증번호 전송에 실패했습니다. 다시 시도해주세요.");
      setEmailModal(true);
    },
    onNicknameChecked: (data) => {
      console.log("닉네임 중복확인 응답:", data);
      if (data?.data?.result === true) {
        setCheckResult(true);
        setModalTitle("사용 가능한 닉네임입니다.");
        setDescription("해당 닉네임을 사용할 수 있습니다.");
        setNicknameModal(true);
      } else {
        setCheckResult(false);
        setModalTitle("이미 가입된 닉네임입니다.");
        setDescription("다른 닉네임을 사용해주세요.");
        setNicknameModal(true);
      }
    },
    onEmailVerifySuccess: (data) => {
      setVerificationCheck(true);
      setVerificationApproveText("이메일 인증이 완료되었습니다.");
    },
    onEmailVerifyError: (error) => {
      setVerificationCheck(false);
      setVerificationApproveText("인증번호가 올바르지 않습니다.");
    },
    onSignUpSuccess: (data) => {
      setModalTitle("회원가입이 완료되었습니다.");
      setDescription("로그인 페이지로 이동합니다.");
      setSuccessModal(true);
    },
    onSignUpError: (error) => {
      setModalTitle("회원가입 실패");
      setDescription("회원가입에 실패했습니다. 다시 시도해주세요.");
      setEmailModal(true);
    },
    onSocialSignUpSuccess: (data) => {
      setModalTitle("소셜 회원가입이 완료되었습니다.");
      setDescription("로그인 페이지로 이동합니다.");
      setSuccessModal(true);
    },
    onSocialSignUpError: (error) => {
      setModalTitle("소셜 회원가입 실패");
      setDescription("소셜 회원가입에 실패했습니다. 다시 시도해주세요.");
      setEmailModal(true);
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

  // const handleInputChange = (name, e) => {
  //   const { value } = e.target;
  //   if (value === "") {
  //     setIsNameConfirm(true);
  //   }
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  //   console.log(formData);
  // };

  const handleInputChange = (name, e) => {
    const { value } = e.target;

    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };

      const newErrors = { ...errors };

      if (name === "password") {
        const isPasswordValid = isValidPassword(value);
        newErrors.password = !isPasswordValid;
        // password가 바뀌면 passwordCheck도 다시 비교해야 함
        newErrors.passwordCheck = !isPasswordMatch(value, updatedForm.passwordCheck);
        
        // 비밀번호 유효성 검사 결과 저장
        if (value.trim() !== "") {
          setPasswordValidation(isPasswordValid);
        } else {
          setPasswordValidation(undefined);
        }
      } else if (name === "passwordCheck") {
        newErrors.passwordCheck = !isPasswordMatch(updatedForm.password, value);
        if(value.trim() !== ""){
          setpasswordCheckValidation(isPasswordMatch(updatedForm.password, value));
        }else{
          setpasswordCheckValidation(undefined);
        }

      }

      setErrors(newErrors);
      return updatedForm;
    });
  };

  //  const nickNameVerification = useMutation({})

  const handleSignup = () => {
     
    const isValid = validateForm();
    if (!isValid) return;
    
    // 카테고리 데이터 정리 및 검증
    const cleanedCategories = formData.categoryDtos
      .map((category) => {
        const cleaned = {};
        if (category.firstCategory !== null) {
          cleaned.firstCategory = Number(category.firstCategory);
        }
        if (category.secondCategory !== null) {
          cleaned.secondCategory = Number(category.secondCategory);
        }
        if (category.thirdCategory !== null) {
          cleaned.thirdCategory = Number(category.thirdCategory);
        }
        return Object.keys(cleaned).length > 0 ? cleaned : null;
      })
      .filter(Boolean); // null 제거

    if (cleanedCategories.length === 0) {
      alert("최소 1개 이상의 카테고리를 선택해주세요.");
      return;
    }

    console.log("원본 카테고리:", formData.categoryDtos);
    console.log("정리된 카테고리:", cleanedCategories);

    // 소셜 로그인 회원가입인 경우
    if (socialLoginInfo?.socialLogin) {
      const isPersonalInfoAgreed = agreementData?.privacyAgreement && 
                                   agreementData?.serviceAgreement && 
                                   agreementData?.thirdPartyAgreement;
      const isMarketingAgreed = agreementData?.marketingAgreement;

      const socialSignupData = {
        registrationToken: socialLoginInfo.registrationToken,
        nickname: formData.nickname,
        categoryDtos: cleanedCategories,
        isPersonalInfoAgreed,
        isMarketingAgreed
      };

      console.log("소셜 회원가입 요청 데이터:", socialSignupData);
      
      // postSocialSignUp API
      socialSignUp.mutate(socialSignupData);
      return;
    }

    // 일반 회원가입인 경우
    // 약관 동의 상태 처리
    const isPersonalInfoAgreed = agreementData?.privacyAgreement && 
                                 agreementData?.serviceAgreement && 
                                 agreementData?.thirdPartyAgreement;
    const isMarketingAgreed = agreementData?.marketingAgreement;

    const finalData = {
      ...formData,
      categoryDtos: cleanedCategories,
      isPersonalInfoAgreed,
      isMarketingAgreed
    };

    console.log("일반 회원가입 요청 데이터:", finalData);
    signUp.mutate(finalData);
  }
//border-t-[1px] md:
  return (
    <div className="mx-auto w-full sm:mt-[5%] rounded-[30px] sm:border-[1px] py-8 md:py-16 px-4 sm:px-12 md:px-16 lg:px-48 flex flex-col items-center justify-center">
      <Input
        title="이름"
        name="username"
        value={formData.username}
        onChange={(e) => handleInputChange("username", e)}
        disapproveText="이름을 입력해주세요."
        essentialText="이름을 입력해주세요."
        isValidateTrigger={errors.username}
        disabled={socialLoginInfo?.socialLogin}
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
        onClick={() => checkNickname.mutate(nickname)}
        isValidateTrigger={errors.nickname}
        isConfirmed={checkResult}
        approveText="사용 가능한 닉네임입니다."
        disapproveText="이미 가입된 닉네임입니다."
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
        isValidateTrigger={errors.email}
        isLoading={emailVerificationMutation.isPending}
        disabled={socialLoginInfo?.socialLogin}
        btnDisabled={socialLoginInfo?.socialLogin}
      />

      {!socialLoginInfo?.socialLogin && (
        <>
          <ButtonInput
            value={verification}
            onChange={(e) => setVerification(e.target.value)}
            title="인증번호 입력"
            btnText="인증확인"
            onClick={() => {
              emailVerify.mutate({
                email: formData.email,
                verification,
              });
            }}
            isConfirmed={verificationCheck}
            approveText={verificationApproveText}
            disapproveText={verificationApproveText}
          />
          <Input
            title="비밀번호"
            type="password"
            name="password"
            essentialText="비밀번호를 입력해주세요."
            subtitle="영문자, 숫자, 특수문자(@,$,!,%,*,#,?,&) 포함 / 8자~20자"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e)}
            isValidateTrigger={errors.password}
            isConfirmed={passwordValidation}
            approveText="올바른 비밀번호 형식입니다."
            disapproveText="비밀번호 형식이 올바르지 않습니다."
          />
          <Input
            title="비밀번호 확인"
            type="password"
            name="passwordCheck"
            essentialText="비밀번호 확인이 올바르지 않습니다."
            value={formData.passwordCheck}
            isConfirmed={passwordCheckValidation}
            onChange={(e) => handleInputChange("passwordCheck", e)}
            isValidateTrigger={errors.passwordCheck}
            approveText="비밀번호 확인이 완료되었습니다."
            disapproveText="비밀번호 확인이 올바르지 않습니다."
          />
        </>
      )}

      <div className="w-full relative mb-8 flex flex-col gap-3">
        <div className="text-black text-lg md:text-2xl font-regular mb-2">
          관심분야 <span className="text-gray-500 text-sm">(최소 1개 이상 선택)</span>
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

      <Button btnText="회원가입" onClick={handleSignup} />
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
      {successModal && (
        <AlertModal
          type="success"
          title={modalTitle}
          description={description}
          TrueBtnText="확인"
          onClickTrue={() => navigate("/login")}
        />
      )}
    </div>
  );
}
