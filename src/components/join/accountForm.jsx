import React, { useState } from "react";
import Input from "../input";
import ButtonInput from "../buttonInput";
import AlertModal from "../alertModal";
import { SIGNUP_ERRORS } from "../../constants/join";
import checkBoxIcon from "../../assets/images/checkBoxIcon.svg";
import notCheckBoxIcon from "../../assets/images/notCheckBoxIcon.svg";
import backArrow from "../../assets/images/backArrow.svg";

export default function AccountForm({
  setSubStep,
  socialLoginInfo,
  formData,
  email,
  setEmail,
  verification,
  setVerification,
  verificationCheck,
  verificationApproveText,
  passwordValidation,
  passwordCheckValidation,
  errors,
  setErrors,
  handleInputChange,
  emailVerificationMutation,
  emailVerify,
  isPersonalInfoAgreed,
  setIsPersonalInfoAgreed,
  isServiceUtilizationAgreed,
  setIsServiceUtilizationAgreed,
  isMarketingAgreed,
  setIsMarketingAgreed,
  selectedType,
  setFormData,
})
 {
    const [isSuitableAged, setIsSuitableAged] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorModalTitle, setErrorModalTitle] = useState("");
    const [errorModalDescription, setErrorModalDescription] = useState("");
    const [showPrivacyContent, setShowPrivacyContent] = useState(false);
    const [showServiceContent, setShowServiceContent] = useState(false);

    // 소셜 로그인 정보가 있으면 이메일자동으로 설정
    React.useEffect(() => {
      if (socialLoginInfo?.socialLogin && socialLoginInfo?.email) {
        // 이메일이 아직 설정되지 않았을 때만 설정
        if (!formData.email || !email) {
          setEmail(socialLoginInfo.email);
          handleInputChange("email", { target: { value: socialLoginInfo.email } });
        }
      }
    }, [socialLoginInfo]);

    // 전화번호 포맷팅 함수 (하이픈 포함)
    const formatPhoneNumber = (value) => {
      const onlyNums = value.replace(/[^0-9]/g, "").slice(0, 11);
      if (onlyNums.length <= 3) {
        return onlyNums;
      } else if (onlyNums.length <= 7) {
        return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
      } else {
        return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7)}`;
      }
    };

    // 통합 검증 함수
    const validateForm = () => {
      const newErrors = {};
      let errorKey = null;
      let errorMessage = "";

      // 소셜 로그인이 아닌 경우만 이메일, 비밀번호 검증
      if (!socialLoginInfo?.socialLogin) {
        // 이메일 검증
        if (!formData.email || !formData.email.trim()) {
          newErrors.email = true;
          errorKey = "M400-3";
          errorMessage = SIGNUP_ERRORS["M400-3"] || "이메일을 입력해주세요.";
        } else if (!verificationCheck) {
          newErrors.email = true;
          errorKey = "M400-3";
          errorMessage = SIGNUP_ERRORS["M400-3"] || "이메일 인증이 완료되지 않았습니다.";
        }

        // 비밀번호 검증
        if (!passwordValidation) {
          newErrors.password = true;
          if (!errorKey) {
            errorMessage = "비밀번호 형식이 올바르지 않습니다.";
          }
        }

        // 비밀번호 확인 검증
        if (!passwordCheckValidation) {
          newErrors.passwordCheck = true;
          if (!errorKey) {
            errorMessage = "비밀번호 확인이 올바르지 않습니다.";
          }
        }
      }

      // 전화번호 검증 (소셜 로그인 포함 모든 경우)
      if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
        newErrors.phoneNumber = true;
        if (!errorKey) {
          errorMessage = "전화번호를 입력해주세요.";
        }
      } else {
        // 010-0000-0000 형식 검증 (010으로 시작, 하이픈 포함)
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        if (!phoneRegex.test(formData.phoneNumber.trim())) {
          newErrors.phoneNumber = true;
          if (!errorKey) {
            errorMessage = `올바른 전화번호 형식을 입력해주세요.\n(010-0000-0000)`;
          }
        }
      }

      // 약관 동의 검증 (마케팅 수신 동의는 선택 사항이므로 제외)
      if (!isSuitableAged || !isPersonalInfoAgreed || !isServiceUtilizationAgreed) {
        newErrors.agreement = true;
        if (!errorKey) {
          errorKey = "M400-5";
          errorMessage = SIGNUP_ERRORS["M400-5"] || "개인정보 동의서에 동의해야 합니다.";
        }
      }

      setValidationErrors(newErrors);
      if (setErrors) {
        setErrors((prev) => ({ ...prev, ...newErrors }));
      }

      // 에러가 있으면 모달 표시
      if (errorKey || Object.keys(newErrors).length > 0) {
        setErrorModalTitle("입력 오류");
        setErrorModalDescription(errorMessage || "필수 항목을 모두 입력해주세요.");
        setShowErrorModal(true);
        return false;
      }

      return true;
    };

    // 다음 단계로 이동
    const handleNextStep = () => {
      if (validateForm() && setSubStep && setFormData) {
        // 계정 타입별로 데이터 구분해서 저장
        const accountFormData = {
          email: formData.email || email,
          password: formData.password || "",
          phoneNumber: formData.phoneNumber || "",
          passwordCheck: formData.passwordCheck || "",
          verificationCheck: verificationCheck || false,
          isSuitableAged: isSuitableAged,
          isPersonalInfoAgreed: isPersonalInfoAgreed,
          isServiceUtilizationAgreed: isServiceUtilizationAgreed,
          isMarketingAgreed: isMarketingAgreed,
        };

        // selectedType에 따라 roleType 설정 및 모든 데이터를 formData 최상위 레벨에 병합
        const updatedFormData = {
          ...formData,
          roleType: selectedType === "CLUB" ? "CLUB" : selectedType === "STUDENT" ? "STUDENT" : "MEMBER",
          // accountForm의 모든 데이터를 최상위 레벨에 직접 병합
          ...accountFormData,
        };

        setFormData(updatedFormData);
        // console.log(updatedFormData);
        setSubStep(2);
      }
    };
  return (
    <>
    
      <ButtonInput
        name="email"
        value={formData.email}
        onChange={(e) => {
          setEmail(e.target.value);
          handleInputChange("email", e);
          if (validationErrors.email) {
            setValidationErrors((prev) => ({ ...prev, email: false }));
          }
        }}
        title="이메일"
        btnText="인증요청"
        essentialText="이메일을 입력해주세요."
        subtitle="자주 쓰는 이메일로 등록해주세요."
        disapproveText={SIGNUP_ERRORS["M400-3"] || "이메일 인증이 완료되지 않았습니다."}
        onClick={() => emailVerificationMutation.mutate(email)}
        isValidateTrigger={validationErrors.email || errors.email}
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
            isLoading={emailVerify.isPending}
            disabled={verificationCheck}
            btnDisabled={verificationCheck}
          />
          <Input
            title="비밀번호"
            type="password"
            name="password"
            essentialText="비밀번호를 입력해주세요."
            disapproveText="비밀번호 형식이 올바르지 않습니다."
            subtitle="영문자, 숫자, 특수문자(@,$,!,%,*,#,?,&) 포함 / 8자~20자"
            value={formData.password}
            onChange={(e) => {
              handleInputChange("password", e);
              if (validationErrors.password) {
                setValidationErrors((prev) => ({ ...prev, password: false }));
              }
            }}
            isValidateTrigger={validationErrors.password || errors.password}
            isConfirmed={passwordValidation}
            approveText="올바른 비밀번호 형식입니다."
          />
          <Input
            title="비밀번호 확인"
            type="password"
            name="passwordCheck"
            essentialText="비밀번호 확인을 입력해주세요."
            disapproveText="비밀번호 확인이 올바르지 않습니다."
            value={formData.passwordCheck}
            isConfirmed={passwordCheckValidation}
            onChange={(e) => {
              handleInputChange("passwordCheck", e);
              if (validationErrors.passwordCheck) {
                setValidationErrors((prev) => ({ ...prev, passwordCheck: false }));
              }
            }}
            isValidateTrigger={validationErrors.passwordCheck || errors.passwordCheck}
            approveText="비밀번호 확인이 완료되었습니다."
          />
        </>
      )}
      {/* 전화번호 입력 (소셜 로그인 포함 모든 경우) */}
      <Input
        title="전화번호"
        type="text"
        name="phoneNumber"
        placeholder="010-0000-0000"
        value={formData.phoneNumber || ""}
        essentialText="전화번호를 입력해주세요."
        disapproveText="올바른 전화번호를 입력해주세요. (010-0000-0000)"
        isValidateTrigger={validationErrors.phoneNumber || errors.phoneNumber}
        maxLength={13}
        onChange={(e) => {
          const formatted = formatPhoneNumber(e.target.value);
          // 13자리 초과 시 자르기
          const limitedValue = formatted.length > 13 ? formatted.slice(0, 13) : formatted;
          handleInputChange("phoneNumber", { target: { value: limitedValue } });
          if (validationErrors.phoneNumber) {
            setValidationErrors((prev) => ({ ...prev, phoneNumber: false }));
          }
        }}
        onKeyDown={(e) => {
          const allowedKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
          ];
          // 13자리 도달 시 숫자 입력 차단
          const currentValue = formData.phoneNumber || "";
          if (currentValue.length >= 13 && /^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault();
            return;
          }
          if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault();
          }
        }}
        onPaste={(e) => {
          e.preventDefault();
          const pasted = e.clipboardData.getData("text");
          const formatted = formatPhoneNumber(pasted);
          // 13자리 초과 시 자르기
          const limitedValue = formatted.length > 13 ? formatted.slice(0, 13) : formatted;
          handleInputChange("phoneNumber", { target: { value: limitedValue } });
        }}
      />
      {/* STEP 1: 약관 동의 */}
      <div className="w-full flex flex-col gap-4 mb-8 bg-stone-50 p-4 rounded-lg">
        <h3 className="text-2xl font-bold text-left">약관 동의</h3>
        <p className="text-black text-base font-normal border-t border-gray-200 pt-4">회원 가입 시에 기입된 정보는 회원 관리 및 서비스 이용 등의 목적으로 수집 및 관리하고 있습니다.</p>
        {validationErrors.agreement && (
          <p className="text-xs font-medium text-red-500">
            {SIGNUP_ERRORS["M400-5"] || "개인정보 동의서에 동의해야 합니다."}
          </p>
        )}
        {/* 전체 선택 버튼 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const allChecked =
                isSuitableAged &&
                isPersonalInfoAgreed &&
                isServiceUtilizationAgreed &&
                isMarketingAgreed;
              const newState = !allChecked;
              setIsSuitableAged(newState);
              setIsPersonalInfoAgreed(newState);
              setIsServiceUtilizationAgreed(newState);
              setIsMarketingAgreed(newState);
              if (validationErrors.agreement) {
                setValidationErrors((prev) => ({ ...prev, agreement: false }));
              }
            }}
            className="flex items-center gap-3"
          >
            <img
              src={
                isSuitableAged &&
                isPersonalInfoAgreed &&
                isServiceUtilizationAgreed &&
                isMarketingAgreed
                  ? checkBoxIcon
                  : notCheckBoxIcon
              }
              alt="전체 선택"
              className="w-5 h-5"
            />
            <span className="text-xl font-bold">전체 선택</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
              type="button"
              onClick={() => {
                setIsSuitableAged(!isSuitableAged);
                if (validationErrors.agreement) {
                  setValidationErrors((prev) => ({ ...prev, agreement: false }));
                }
              }}
              className="flex items-center gap-3"
            >
              <img
                src={isSuitableAged ? checkBoxIcon : notCheckBoxIcon}
                alt="만 18세 이상 동의"
                className="w-5 h-5"
              />
              <span className="text-zinc-700 text-lg font-normal">
                만 18세 이상입니다.
                <span className="text-sm text-red-500 ml-1">*</span>
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3">
          <button
              type="button"
              onClick={() => {
                setIsPersonalInfoAgreed(!isPersonalInfoAgreed);
                if (validationErrors.agreement) {
                  setValidationErrors((prev) => ({ ...prev, agreement: false }));
                }
              }}
              className="flex items-center gap-3"
            >
              <img
                src={isPersonalInfoAgreed ? checkBoxIcon : notCheckBoxIcon}
                alt="개인정보 동의"
                className="w-5 h-5"
              />
              <p>
              <span 
                className="text-zinc-700 text-lg font-normal underline cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('https://www.notion.so/293adbfeb0858054beecca8fe3d2e5cf?source=copy_link', '_blank');
                }}
              >
                개인정보 수집 및 이용 동의
               
              </span>
              <span className="text-sm text-red-500 ml-1">*</span>
              </p>
            </button>
          </div>
         
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsServiceUtilizationAgreed(!isServiceUtilizationAgreed);
                if (validationErrors.agreement) {
                  setValidationErrors((prev) => ({ ...prev, agreement: false }));
                }
              }}
              className="flex items-center gap-3"
            >
              <img
                src={isServiceUtilizationAgreed ? checkBoxIcon : notCheckBoxIcon}
                alt="서비스 이용 약관 동의"
                className="w-5 h-5"
              />
              <p>
              <span 
                className="text-zinc-700 text-lg font-normal underline cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('https://www.notion.so/SouF-293adbfeb08580c9a7e0e27d42c77ae5?source=copy_link', '_blank');
                }}
              >
                서비스 이용 약관 동의
                </span>
              <span className="text-sm text-red-500 ml-1">*</span>
              </p>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMarketingAgreed(!isMarketingAgreed)}
              className="flex items-center gap-3"
            >
              <img
                src={isMarketingAgreed ? checkBoxIcon : notCheckBoxIcon}
                alt="마케팅 수신 동의"
                className="w-5 h-5"
              />
              <p>
              <span className="text-zinc-700 text-lg font-normal underline">마케팅 수신 동의</span>
              <span className="text-zinc-700 text-lg font-normal"> (선택)</span>
              </p>
            </button>
          </div>
        </div>
      </div>
      
      {setSubStep && (
        <button
          onClick={handleNextStep}
          className="w-full mt-4 bg-blue-main text-white py-3 rounded-lg font-semibold hover:shadow-md transition-colors duration-200"
        >
          다음으로
        </button>
      )}

      {showErrorModal && (
        <AlertModal
          type="simple"
          title={errorModalTitle}
          description={errorModalDescription}
          TrueBtnText="확인"
          onClickTrue={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
}
