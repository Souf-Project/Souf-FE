import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertModal from "../alertModal";
import { useSignupMutations } from "../../hooks/join/join";
import { isValidPassword, isPasswordMatch } from "../../utils/passwordCheck";
import JoinStepIndicator from "./joinStepIndicator";
import backArrow from "../../assets/images/backArrow.svg";
import { EMAIL_ERRORS, SIGNUP_ERRORS } from "../../constants/join";
import AccountForm from "./accountForm";
import UserForm from "./userForm";
import AuthForm from "./authForm";
import Button from "../button";

export default function Step3({ socialLoginInfo, selectedType }) {
  const [subStep, setSubStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verification, setVerification] = useState("");
  const [verificationApproveText, setVerificationApproveText] = useState("");
  const [verificationCheck, setVerificationCheck] = useState(undefined);

  const [emailVerification, setEmailVerification] = useState(undefined);

  const [checkResult, setCheckResult] = useState(undefined);
  const [nicknameModal, setNicknameModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [description, setDescription] = useState("");
  const [nickname, setNickname] = useState("");
  const [passwordValidation, setPasswordValidation] = useState(undefined);
  const [passwordCheckValidation, setpasswordCheckValidation] =
    useState(undefined);
  const [userType, setUserType] = useState("STUDENT");
  const stepList = {
    normal: [
      { title: "계정 정보", step: 1 },
      { title: "사용자 정보", step: 2 },
      { title: "사업자 인증(선택)", step: 3 }
    ],
    student: [
      { title: "계정 정보", step: 1 },
      { title: "학생 정보", step: 2 },
      { title: "대학생 인증", step: 3 }
    ],
    club: [
      { title: "계정 정보", step: 1 },
      { title: "동아리 정보", step: 2 },
    ]
  };

  const getCurrentStepList = () => {
    switch (selectedType) {
      case 'MEMBER':
        return stepList.normal;
      case 'STUDENT':
        return stepList.student;
      case 'CLUB':
        return stepList.club;
      default:
        return stepList.normal;
    }
  };

  const [errors, setErrors] = useState({
    username: false,
    nickname: false,
    email: false,
    password: false,
    passwordCheck: false,
  });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roleType: "",
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

  // 약관 동의 상태
  const [isPersonalInfoAgreed, setIsPersonalInfoAgreed] = useState(false);
  const [isServiceUtilizationAgreed, setIsServiceUtilizationAgreed] = useState(false);
  const [isMarketingAgreed, setIsMarketingAgreed] = useState(false);

  // 약관 내용 보기/숨기기 상태
  const [showPrivacyContent, setShowPrivacyContent] = useState(false);
  const [showServiceContent, setShowServiceContent] = useState(false);

  // 소셜 로그인 -> 이메일&닉네임 자동 설정
  useEffect(() => {
    if (socialLoginInfo?.socialLogin) {
      if (socialLoginInfo?.email) {
        setEmail(socialLoginInfo.email);
        setFormData((prev) => ({
          ...prev,
          email: socialLoginInfo.email,
        }));
        // 소셜 로그인이면 이메일 인증X
        setEmailVerification(true);
        setVerificationCheck(true);
      }
      if (socialLoginInfo?.username) {
        setFormData((prev) => ({
          ...prev,
          username: socialLoginInfo.username,
        }));
      }
    }
  }, [socialLoginInfo]);

  // userType이 변경될 때 formData.roleType도 업데이트
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      roleType: userType
    }));
  }, [userType]);

  const validateForm = () => {
    // 소셜 로그인이면 비밀번호 검증 X
    if (socialLoginInfo?.socialLogin) {
      const newErrors = {
        roleType: !formData.roleType,
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
    const isPasswordMatchValid = isPasswordMatch(
      formData.password,
      formData.passwordCheck
    );

    const newErrors = {
      roleType: !formData.roleType,
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
      const errorCode = error.response.data.errorKey;
      const errorMsg = errorCode
        ? EMAIL_ERRORS[errorCode]
        : "올바른 형식의 이메일 주소여야 합니다";
      setModalTitle("인증번호 전송 실패");
      setDescription(errorMsg);
      setEmailModal(true);
    },
    onNicknameChecked: (data) => {
      // console.log("닉네임 중복확인 응답:", data);
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
      //"올바른 형식의 이메일 주소여야 합니다"
      const errorCode = error.response.data.errorKey;
      const errorMsg = errorCode
        ? SIGNUP_ERRORS[errorCode]
        : "올바른 형식의 이메일 주소여야 합니다";
      setModalTitle("회원가입 실패");
      setDescription(errorMsg);
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

  const handleInputChange = (name, e) => {
    const { value } = e.target;

    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };

      const newErrors = { ...errors };

      if (name === "password") {
        const isPasswordValid = isValidPassword(value);
        newErrors.password = !isPasswordValid;
        // password가 바뀌면 passwordCheck도 다시 비교해야 함
        newErrors.passwordCheck = !isPasswordMatch(
          value,
          updatedForm.passwordCheck
        );

        // 비밀번호 유효성 검사 결과 저장
        if (value.trim() !== "") {
          setPasswordValidation(isPasswordValid);
        } else {
          setPasswordValidation(undefined);
        }
      } else if (name === "passwordCheck") {
        newErrors.passwordCheck = !isPasswordMatch(updatedForm.password, value);
        if (value.trim() !== "") {
          setpasswordCheckValidation(
            isPasswordMatch(updatedForm.password, value)
          );
        } else {
          setpasswordCheckValidation(undefined);
        }
      }

      setErrors(newErrors);
      return updatedForm;
    });
  };

  const handleSignup = () => {

    const isValid = validateForm();
   
    if (!isValid) {
 
      return;
    }
    
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

    // 소셜 로그인 회원가입인 경우
    if (socialLoginInfo?.socialLogin) {
      const isPersonalInfoAgreed =
        isPersonalInfoAgreed && isServiceUtilizationAgreed && isMarketingAgreed;

      // registrationToken 처리
      let registrationToken = socialLoginInfo.registrationToken;
      // console.log("원본 registrationToken:", registrationToken, "타입:", typeof registrationToken);
      
      // registrationToken이 없거나 유효하지 않은 경우
      if (!registrationToken || registrationToken === null || registrationToken === undefined) {
        console.error("registrationToken이 없습니다:", registrationToken);
        alert("소셜 로그인 토큰을 가져올 수 없습니다. 다시 로그인해주세요.");
        return;
      }
      
      if (Array.isArray(registrationToken)) {
        registrationToken = registrationToken[0];
        // console.log("배열에서 추출한 registrationToken:", registrationToken);
      } else if (typeof registrationToken === 'object') {
        // 객체인 경우 token 필드가 있는지 확인
        const tokenValue = registrationToken.token || registrationToken.registrationToken;
        if (tokenValue) {
          registrationToken = tokenValue;
        } else {
          // 빈 객체인 경우 에러 처리
          console.error("registrationToken이 빈 객체입니다:", registrationToken);
          alert("소셜 로그인 토큰을 가져올 수 없습니다. 다시 로그인해주세요.");
          return;
        }
        // console.log("객체에서 추출한 registrationToken:", registrationToken);
      }
      
      // console.log("최종 registrationToken:", registrationToken);

      const socialSignupData = {
        registrationToken: registrationToken,
        nickname: formData.nickname,
        categoryDtos: cleanedCategories,
        isPersonalInfoAgreed,
        isMarketingAgreed,
      };

      socialSignUp.mutate(socialSignupData);
      return;
    }

    // 일반 회원가입인 경우
    // 약관 동의 상태 처리
    const isPersonalInfoAgreed =
      isPersonalInfoAgreed && isServiceUtilizationAgreed && isMarketingAgreed;

    const finalData = {
      ...formData,
      categoryDtos: cleanedCategories,
      isPersonalInfoAgreed,
      isMarketingAgreed,
    };

    signUp.mutate(finalData);
  };

  const handleBack = () => {
    if (subStep > 1) {
      setSubStep(subStep - 1);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        
        <p className=" text-black text-3xl font-bold">
          {selectedType === 'MEMBER' ? '일반' : 
           selectedType === 'STUDENT' ? '대학생' : 
           selectedType === 'CLUB' ? '동아리' : '일반'} 회원가입
        </p>
      </div>
      
    <div className="mx-auto mt-4 w-full rounded-md sm:border-[1px] py-8 md:py-16 px-4 sm:px-12 md:px-16 lg:px-48 flex flex-col items-center justify-center">
    {(subStep === 2 || subStep === 3) && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center h-10 text-lg font-light text-gray-500 rounded-full mr-auto"
            aria-label="이전 단계로 이동"
          >
            <img src={backArrow} alt="뒤로가기" className="w-6 h-6" />뒤로가기
          </button>
        )}
    <JoinStepIndicator 
      currentStep={subStep} 
      totalSteps={getCurrentStepList().length} 
      stepTitles={getCurrentStepList()}
    />
   
      {subStep === 1 ? (
        <AccountForm
          socialLoginInfo={socialLoginInfo}
          formData={formData}
          email={email}
          setEmail={setEmail}
          verification={verification}
          setVerification={setVerification}
          verificationCheck={verificationCheck}
          verificationApproveText={verificationApproveText}
          passwordValidation={passwordValidation}
          passwordCheckValidation={passwordCheckValidation}
          errors={errors}
          setErrors={setErrors}
          handleInputChange={handleInputChange}
          emailVerificationMutation={emailVerificationMutation}
          emailVerify={emailVerify}
          setSubStep={setSubStep}
          isPersonalInfoAgreed={isPersonalInfoAgreed}
          setIsPersonalInfoAgreed={setIsPersonalInfoAgreed}
          isServiceUtilizationAgreed={isServiceUtilizationAgreed}
          setIsServiceUtilizationAgreed={setIsServiceUtilizationAgreed}
          isMarketingAgreed={isMarketingAgreed}
          setIsMarketingAgreed={setIsMarketingAgreed}
          selectedType={selectedType}
          setFormData={setFormData}
        />
      ) : subStep === 2 ? (
        <UserForm
          socialLoginInfo={socialLoginInfo}
          formData={formData}
          userType={userType}
          setUserType={setUserType}
          errors={errors}
          checkResult={checkResult}
          nickname={nickname}
          setNickname={setNickname}
          handleInputChange={handleInputChange}
          handleCategoryChange={handleCategoryChange}
          passwordValidation={passwordValidation}
          passwordCheckValidation={passwordCheckValidation}
          isPersonalInfoAgreed={isPersonalInfoAgreed}
          setIsPersonalInfoAgreed={setIsPersonalInfoAgreed}
          isServiceUtilizationAgreed={isServiceUtilizationAgreed}
          setIsServiceUtilizationAgreed={setIsServiceUtilizationAgreed}
          isMarketingAgreed={isMarketingAgreed}
          setIsMarketingAgreed={setIsMarketingAgreed}
          checkNickname={checkNickname}
          handleSignup={handleSignup}
          signUp={signUp}
          socialSignUp={socialSignUp}
          setSubStep={setSubStep}
          selectedType={selectedType}
          setFormData={setFormData}
        />
       ) : (
        <AuthForm 
          selectedType={selectedType}
          formData={formData}
          handleSignup={handleSignup}
          signUp={signUp}
          socialSignUp={socialSignUp}
          socialLoginInfo={socialLoginInfo}
        />
      )}

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
    </div>
  );
}
