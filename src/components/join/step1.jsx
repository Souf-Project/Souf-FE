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
import dayjs from "dayjs";
import noneCheckBox from "../../assets/images/noneCheckBox.png";
import fillCheckBox from "../../assets/images/fillCheckBox.png";
import backArrow from "../../assets/images/backArrow.svg";
export default function JoinForm({ socialLoginInfo }) {
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

  // 약관 동의 상태
  const [privacyAgreement, setPrivacyAgreement] = useState(false);
  const [serviceAgreement, setServiceAgreement] = useState(false);
  const [thirdPartyAgreement, setThirdPartyAgreement] = useState(false);
  const [marketingAgreement, setMarketingAgreement] = useState(false);
  
  // 약관 내용 보기/숨기기 상태
  const [showPrivacyContent, setShowPrivacyContent] = useState(false);
  const [showServiceContent, setShowServiceContent] = useState(false);

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

    // 소셜 로그인 회원가입인 경우
    if (socialLoginInfo?.socialLogin) {
      const isPersonalInfoAgreed = privacyAgreement && serviceAgreement && thirdPartyAgreement;
      const isMarketingAgreed = marketingAgreement;

      const socialSignupData = {
        registrationToken: socialLoginInfo.registrationToken,
        nickname: formData.nickname,
        categoryDtos: cleanedCategories,
        isPersonalInfoAgreed,
        isMarketingAgreed
      };

      socialSignUp.mutate(socialSignupData);
      return;
    }

    // 일반 회원가입인 경우
    // 약관 동의 상태 처리
    const isPersonalInfoAgreed = privacyAgreement && serviceAgreement && thirdPartyAgreement;
    const isMarketingAgreed = marketingAgreement;

    const finalData = {
      ...formData,
      categoryDtos: cleanedCategories,
      isPersonalInfoAgreed,
      isMarketingAgreed
    };

    signUp.mutate(finalData);
  }

  return (
    <div className="mx-auto w-full sm:mt-[5%] rounded-[30px] sm:border-[1px] py-8 md:py-16 px-4 sm:px-12 md:px-16 lg:px-48 flex flex-col items-center justify-center">
      {/* STEP 2: 회원가입 폼 */}
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

      {/* STEP 1: 약관 동의 */}
      <div className="w-full flex flex-col gap-4 mb-8">
        <h3 className="text-2xl font-bold text-left">약관 동의</h3>
        
        {/* 전체 선택 버튼 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const allChecked = privacyAgreement && serviceAgreement && thirdPartyAgreement && marketingAgreement;
              const newState = !allChecked;
              setPrivacyAgreement(newState);
              setServiceAgreement(newState);
              setThirdPartyAgreement(newState);
              setMarketingAgreement(newState);
            }}
            className="flex items-center gap-3"
          >
            <img 
              src={privacyAgreement && serviceAgreement && thirdPartyAgreement && marketingAgreement ? fillCheckBox : noneCheckBox} 
              alt="전체 선택" 
              className="w-5 h-5"
            />
            <span className="text-xl font-bold">
              전체 선택
            </span>
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPrivacyAgreement(!privacyAgreement)}
              className="flex items-center gap-3"
            >
              <img 
                src={privacyAgreement ? fillCheckBox : noneCheckBox} 
                alt="개인정보 동의" 
                className="w-5 h-5"
              />
              <span className="text-lg">
                개인정보 수집 및 이용 동의 (필수)
                <span className="text-sm text-red-500 ml-1">*</span>
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setThirdPartyAgreement(!thirdPartyAgreement)}
              className="flex items-center gap-3"
            >
              <img 
                src={thirdPartyAgreement ? fillCheckBox : noneCheckBox} 
                alt="제3자 제공 동의" 
                className="w-5 h-5"
              />
              <span className="text-lg">
                제3자 제공 동의 (필수)
                <span className="text-sm text-red-500 ml-1">*</span>
              </span>
            </button>
          </div>
            {/* 개인정보 수집 및 이용 동의 내용 */}
            <div className="ml-4 flex items-center gap-3 cursor-pointer" onClick={() => setShowPrivacyContent(!showPrivacyContent)}>
            <img 
              src={backArrow} 
              alt="뒤로가기" 
              className={`w-5 h-5 transition-transform duration-200 ${
                showPrivacyContent ? 'rotate-90' : 'rotate-[270deg]'
              }`} 
            />
            <span className="text-lg text-gray-600">개인정보 수집 및 제3자 제공 동의 내용 보기</span>
          </div>
          {showPrivacyContent && (
            <div className="w-full max-h-96 overflow-y-auto border border-gray-300 rounded-lg p-4 mt-2">
              <div className="w-full flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-left">1. 수집 항목 및 이용 목적</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="text-left">
                    <tr className="border-b border-gray-300 text-left bg-gray-100">
                      <th className="w-2/5">수집 항목</th>
                      <th className="w-2/5">수집 목적</th>
                      <th className="w-1/5">보유 및 이용 기간</th>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td>이름, 이메일</td>
                      <td>회원 식별 및 본인 인증, 고지사항 전달</td>
                      <td>회원 탈퇴 시까지</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td>비밀번호</td>
                      <td>로그인 및 계정 보호</td>
                      <td>회원 탈퇴 시까지</td>
                    </tr>
                    {/* <tr className="border-b border-gray-100">
                      <td>소속 학교, 학과</td>
                      <td>기업 매칭 및 포트폴리오 정보 제공</td>
                      <td>회원 탈퇴 시까지</td>
                    </tr> */}
                    <tr className="border-b border-gray-100">
                      <td>IP 주소, 서비스 시용 기록</td>
                      <td>서비스 개선, 보안 및 로그 기록</td>
                      <td>3년</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td>(선택) 프로필 사진, 자기소개, SNS 연동 정보</td>
                      <td>개인화된 포트폴리오 제공</td>
                      <td>회원 탈퇴 시까지</td>
                    </tr>
                    <tr>
                      <td>(선택) 마케팅 수신 동의(이메일, SMS)</td>
                      <td>이벤트, 혜택 안내 등 마케팅 정보 전달</td>
                      <td>동의 철회 시까지</td>
                    </tr>
                  </thead>
                </table>
                <p>※ 귀하는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있으며, 필수 항목 동의 거부 시 회원가입 및 서비스 이용이 제한될 수 있습니다.</p>
              </div>
              <div className="w-full flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-left mt-4">2. 제3자 제공에 관한 사항</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="text-left">
                    <tr className="border-b border-gray-300 text-left bg-gray-100">
                      <th className="">제공받는 자</th>
                      <th className="">제공 항목</th>
                      <th className="">제공 목적</th>
                      <th className="">보유 및 이용 기간</th>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td>매칭 기업 회원사</td>
                      <td>이름, 소속, 포트폴리오 정보</td>
                      <td>채용 및 인재 매칭</td>
                      <td>매칭 후 1년 또는 동의 철회 시까지</td>
                    </tr>
                  </thead>
                </table>
                <p>※ 제3자 제공에 대한 동의는 선택 사항이나, 동의하지 않을 경우 일부 매칭 서비스 이용에 제한이 있을 수 있습니다.</p>
              </div>
              <div className="w-full flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-left mt-4">3. 민감 정보 및 아동 정보</h3>
                <div className="flex">
                  <span>회사는 민감정보(사상·신념, 건강 등)을 수집하지 않으며, 만 14세 미만 아동의 경우 법정대리인의 동의를 받아야 합니다.</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setServiceAgreement(!serviceAgreement)}
              className="flex items-center gap-3"
            >
              <img 
                src={serviceAgreement ? fillCheckBox : noneCheckBox} 
                alt="서비스 이용 약관 동의" 
                className="w-5 h-5"
              />
              <span className="text-lg">
                서비스 이용 약관 동의 (필수)
                <span className="text-sm text-red-500 ml-1">*</span>
              </span>
            </button>
            
          </div>
           {/* 서비스 이용 약관 내용 */}
           <div className="ml-4 flex items-center gap-3 cursor-pointer" onClick={() => setShowServiceContent(!showServiceContent)}>
            <img 
              src={backArrow} 
              alt="뒤로가기" 
              className={`w-5 h-5 transition-transform duration-200 ${
                showServiceContent ? 'rotate-90' : 'rotate-[270deg]'
              }`} 
            />
            <span className="text-lg text-gray-600">서비스 이용 약관 보기</span>
          </div>
          {showServiceContent && (
            <div className="w-full max-h-96 overflow-y-auto border border-gray-300 rounded-lg p-4 mt-2">
              <h3 className="text-2xl font-bold text-left my-2">제1조 (목적)</h3>
              <p>이 약관은 대학생이 자신의 포트폴리오 및 작업물을 게시하고, 기업이 채용 공고를 등록하며, 양측이 상호 소통하는 온라인 플랫폼 서비스의 이용에 관한 회사와 회원 간의 권리·의무 및 책임사항을 규정합니다.</p>
              <h3 className="text-2xl font-bold text-left my-2">제2조 (용어의 정의)</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>"서비스"란 회사가 제공하는 SOUF 웹사이트 및 관련 서비스를 말합니다.</li>
                <li>"회원"이란 본 약관에 따라 회사와 이용계약을 체결하고, 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
                <li>"학생 회원"은 대학에 재학 중이거나 졸업 예정인 개인회원으로, 본인의 작업물, 이력 등을 등록할 수 있는 자를 말합니다.</li>
                <li>"기업 회원"은 채용 공고를 등록하고 학생회원의 정보를 조회할 수 있는 기업/단체를 말합니다.</li>
                <li>"콘텐츠"는 회원이 서비스에 업로드하는 모든 이미지, 텍스트, 포트폴리오, 댓글 등의 정보를 의미합니다.</li>
              </ol>
              <h3 className="text-2xl font-bold text-left my-2">제3조 (약관의 효력 및 변경)</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>본 약관은 회사가 서비스 화면에 게시하거나 기타 방법으로 회원에게 공지함으로써 효력을 발생합니다.</li>
                <li>회사는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 개정 시 개정사유와 시행일자를 명시하여 최소 7일 전 공지합니다.</li>
                <li>회원이 개정된 약관에 대해 명시적으로 거부 의사를 표시하지 않고 계속 서비스를 이용하는 경우, 개정 약관에 동의한 것으로 간주합니다.</li>
              </ol>
              <h3 className="text-2xl font-bold text-left my-2">제4조 (서비스 이용 계약의 체결)</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>회원가입은 이용자가 본 약관 및 개인정보처리방침에 동의하고, 회사가 정한 절차에 따라 회원가입 신청을 완료한 후 회사가 이를 승인함으로써 체결됩니다.</li>
                <li>회사는 다음 각 호에 해당하는 경우 이용 신청을 승낙하지 않을 수 있습니다.
                  <ul className="list-disc list-inside space-y-1">
                    <li>실명이 아니거나 타인의 명의를 도용한 경우</li>
                    <li>허위 정보를 입력한 경우</li>
                    <li>기타 회사의 운영정책에 위배되는 행위</li>
                  </ul>
                </li>
              </ol>
              <h3 className="text-2xl font-bold text-left my-2">제5조 (서비스의 내용)</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>회사는 다음과 같은 서비스를 제공합니다.
                  <ul className="list-disc list-inside space-y-1">
                    <li>학생회원의 포트폴리오 등록, 관리 및 공개</li>
                    <li>기업회원의 공고문 작성 및 노출</li>
                    <li>포트폴리오 및 공고에 대한 상호 피드백, 댓글, 스크랩 등 SNS 기능</li>
                    <li>광고 콘텐츠의 제공 및 노출</li>
                    <li>향후 결제 시스템을 통한 유료 콘텐츠, 유료 채용 홍보 등 기능</li>
                  </ul>
                </li>
                <li>회사는 서비스 일부를 광고 기반으로 운영할 수 있으며, 회원은 광고 노출에 동의하는 것으로 간주됩니다.</li>
              </ol>
              <h3 className="text-2xl font-bold text-left my-2">제6조 (회원의 의무)</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>회원은 서비스 이용 시 다음 각 호의 행위를 하여서는 안 됩니다.
                  <ul className="list-disc list-inside space-y-1">
                    <li>허위 정보 등록 또는 타인 정보 도용</li>
                    <li>타인의 지식재산권, 초상권 등 권리를 침해하는 행위</li>
                    <li>불쾌감 또는 혐오감을 주는 게시물 등록</li>
                    <li>광고, 스팸 등 상업적 목적의 콘텐츠 무단 게시</li>
                    <li>서비스의 정상적 운영을 방해하는 행위</li>
                  </ul>
                </li>
              </ol>
              <h3 className="text-2xl font-bold text-left my-2">제7조 (회사의 권리와 의무)</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>회사는 안정적인 서비스 제공을 위해 노력하며, 시스템 유지·보수 등의 사유로 일시적 중단이 있을 수 있습니다.</li>
                <li>회사는 회원이 등록한 콘텐츠를 사전 승인 없이 내부 홍보, 추천, 큐레이션 목적으로 활용할 수 있습니다.</li>
                <li>회사는 회원이 약관 위반 시, 사전 고지 없이 콘텐츠 삭제, 서비스 이용 제한, 회원 자격 박탈 등의 조치를 취할 수 있습니다.</li>
              </ol>
              <h3 className="text-2xl font-bold text-left my-2">제8조 (지적재산권)</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>회원이 서비스에 등록한 콘텐츠에 대한 저작권은 해당 회원에게 있으며, 회사는 해당 콘텐츠를 서비스 운영 및 홍보 목적으로 사용할 수 있습니다.</li>
                <li>회원은 콘텐츠를 등록함으로써, 회사에 비독점적·무상·재사용 가능한 이용 권한을 부여한 것으로 간주됩니다.</li>
              </ol>
              <h3 className="text-2xl font-bold text-left my-2">제9조 (광고 및 유료서비스)</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>회사는 서비스 내에 제3자의 광고를 게재할 수 있으며, 회원은 이에 대해 동의합니다.</li>
                <li>유료 서비스 도입 시, 가격, 결제 수단, 환불 정책 등은 별도의 고지 및 동의 절차를 거쳐 운영됩니다.</li>
              </ol>
              <h3 className="text-2xl font-bold text-left my-2">제10조 (서비스의 해지 및 탈퇴)</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>회원은 언제든지 서비스 내 제공되는 메뉴를 통해 이용계약을 해지할 수 있습니다.</li>
                <li>회사는 다음 각 호에 해당하는 경우 사전 통보 없이 이용계약을 해지할 수 있습니다.
                  <ul className="list-disc list-inside space-y-1">
                    <li>본 약관 또는 관련 법령을 위반한 경우</li>
                    <li>타인의 권리를 침해하거나 공공질서를 해친 경우</li>
                  </ul>
                </li>
              </ol>
              <h3 className="text-2xl font-bold text-left my-2">제11조 (면책조항)</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>회사는 천재지변, 시스템 장애 등 불가항력 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
                <li>회사는 회원 간 거래, 커뮤니케이션에 개입하지 않으며, 그 분쟁에 대해서는 책임을 지지 않습니다.</li>
              </ol>
              <h3 className="text-2xl font-bold text-left my-2">제12조 (준거법 및 관할)</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>회사와 회원 간 분쟁이 발생할 경우, 양 당사자는 분쟁 해결을 위해 협의할 수 있습니다.</li>
                <li>분쟁 조정이 어려울 경우, 본 약관은 대한민국 법령에 따라 해석되며, 회사와 회원 간 분쟁 발생 시 회사의 본사 소재지를 관할하는 법원을 제1심 관할 법원으로 합니다.</li>
              </ol>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMarketingAgreement(!marketingAgreement)}
              className="flex items-center gap-3"
            >
              <img 
                src={marketingAgreement ? fillCheckBox : noneCheckBox} 
                alt="마케팅 수신 동의" 
                className="w-5 h-5"
              />
              <span className="text-lg">
                마케팅 수신 동의 (선택)
              </span>
            </button>
          </div>
        </div>
      </div>

      <Button btnText="회원가입" onClick={handleSignup} />
      
      {/* 모달들 */}
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