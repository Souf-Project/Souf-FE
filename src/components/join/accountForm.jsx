import React, { useState } from "react";
import Input from "../input";
import ButtonInput from "../buttonInput";
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
  handleInputChange,
  emailVerificationMutation,
  emailVerify,
})
 {
    const [privacyAgreement, setPrivacyAgreement] = useState(false);
    const [serviceAgreement, setServiceAgreement] = useState(false);
    const [thirdPartyAgreement, setThirdPartyAgreement] = useState(false);
    const [marketingAgreement, setMarketingAgreement] = useState(false);
    const [showPrivacyContent, setShowPrivacyContent] = useState(false);
    const [showServiceContent, setShowServiceContent] = useState(false);
  return (
    <>
    
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
              <div className="w-full relative mb-8">
                <div className="text-black text-lg md:text-xl font-regular mb-2">
                  전화번호
                  <span className="text-gray-500 text-xs sm:text-sm"> (긴급시에 사용하기 위함입니다.)</span>
                </div>
                <div className="flex items-center">
                <input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  maxLength={11}
  className="flex-1 py-2 px-2 font-medium bg-[#F6F6F6] text-black placeholder-[#81818a] text-md border-0 border-b-[3px] outline-none transition-colors duration-200 border-[#898989] focus:border-blue-main"
  placeholder="000-0000-0000"
  value={formData.phoneNumber}
  onBeforeInput={(e) => {
    // 입력 직전에 숫자가 아닌 입력은 막음
    if (!/^[0-9]*$/.test(e.data)) {
      e.preventDefault();
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
    if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  }}
  onChange={(e) => {
    // 혹시 몰라서 한 번 더 숫자만 남김 (IME 대비)
    const onlyNums = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    handleInputChange("phoneNumber", onlyNums);
  }}
  onPaste={(e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 11);
    handleInputChange("phoneNumber", pasted);
  }}
/>


                </div>
              
            </div>
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
      {/* STEP 1: 약관 동의 */}
      <div className="w-full flex flex-col gap-4 mb-8 bg-stone-50 p-4 rounded-lg">
        <h3 className="text-2xl font-bold text-left">약관 동의</h3>
        <p className="text-black text-base font-normal border-t border-gray-200 pt-4">회원 가입 시에 기입된 정보는 회원 관리 및 서비스 이용 등의 목적으로 수집 및 관리하고 있습니다.</p>
        {/* 전체 선택 버튼 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const allChecked =
                privacyAgreement &&
                serviceAgreement &&
                thirdPartyAgreement &&
                marketingAgreement;
              const newState = !allChecked;
              setPrivacyAgreement(newState);
              setServiceAgreement(newState);
              setThirdPartyAgreement(newState);
              setMarketingAgreement(newState);
            }}
            className="flex items-center gap-3"
          >
            <img
              src={
                privacyAgreement &&
                serviceAgreement &&
                thirdPartyAgreement &&
                marketingAgreement
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
             
              className="flex items-center gap-3"
            >
              <img
                src={privacyAgreement ? checkBoxIcon : notCheckBoxIcon}
                alt="개인정보 동의"
                className="w-5 h-5"
                onClick={() => setPrivacyAgreement(!privacyAgreement)}
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
              
              className="flex items-center gap-3"
            >
              <img
                src={privacyAgreement ? checkBoxIcon : notCheckBoxIcon}
                alt="개인정보 동의"
                className="w-5 h-5"
                onClick={() => setPrivacyAgreement(!privacyAgreement)}
              />
              <span className="text-zinc-700 text-lg font-normal underline"
              onClick={() => window.open('https://www.notion.so/293adbfeb0858054beecca8fe3d2e5cf?source=copy_link', '_blank')}>
                개인정보 수집 및 이용 동의
                <span className="text-sm text-red-500 ml-1">*</span>
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
             
              className="flex items-center gap-3"
            >
              <img
                src={thirdPartyAgreement ? checkBoxIcon : notCheckBoxIcon}
                alt="제3자 제공 동의"
                className="w-5 h-5"
                onClick={() => setThirdPartyAgreement(!thirdPartyAgreement)}
              />
              <span className="text-zinc-700 text-lg font-normal underline">
                제3자 제공 동의
                <span className="text-sm text-red-500 ml-1">*</span>
              </span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setServiceAgreement(!serviceAgreement)}
              className="flex items-center gap-3"
            >
              <img
                src={serviceAgreement ? checkBoxIcon : notCheckBoxIcon}
                alt="서비스 이용 약관 동의"
                className="w-5 h-5"
              />
              <span className="text-zinc-700 text-lg font-normal underline"
              onClick={() => window.open('https://www.notion.so/SouF-293adbfeb08580c9a7e0e27d42c77ae5?source=copy_link', '_blank')}>
                서비스 이용 약관 동의
                <span className="text-sm text-red-500 ml-1">*</span>
              </span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMarketingAgreement(!marketingAgreement)}
              className="flex items-center gap-3"
            >
              <img
                src={marketingAgreement ? checkBoxIcon : notCheckBoxIcon}
                alt="마케팅 수신 동의"
                className="w-5 h-5"
              />
              <span className="text-zinc-700 text-lg font-normal underline">마케팅 수신 동의 (선택)</span>
            </button>
          </div>
        </div>
      </div>
      
      {setSubStep && (
        <button
          onClick={() => setSubStep(2)}
          className="w-full mt-4 bg-blue-main text-white py-3 rounded-lg font-semibold hover:shadow-md transition-colors duration-200"
        >
          다음으로
        </button>
      )}
    </>
  );
}
