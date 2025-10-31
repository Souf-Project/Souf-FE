import { useState } from "react";
import Input from "../input";
import Button from "../button";
import FilterDropdown from "../filterDropdown";
import DaumPostcode from "react-daum-postcode";
import ButtonInput from "../buttonInput";
import infoIcon from "../../assets/images/infoIcon.svg";
import { postSignUp } from "../../api/member";

export default function AuthForm({ 
    selectedType = "MEMBER",
    formData: parentFormData,
    handleSignup: parentHandleSignup,
    signUp,
    socialSignUp,
    socialLoginInfo
}) {
    // 사업자 정보용 상태 (MEMBER일 때만 사용)
    const [formData, setFormData] = useState({
        companyName: "",
        businessNumber: "",
        postalCode: "",
        address: "",
        detailAddress: "",
        industry: "",
        businessType: "",
        businessRegistrationFile: null,
        businessRegistrationUrl: null,
    });
    const [showDaumAddress, setShowDaumAddress] = useState(false);
    const [address, setAddress] = useState("");
    const [zonecode, setZonecode] = useState("");
    const [selectedMemberType, setSelectedMemberType] = useState("일반");
    const [schoolAuthenticatedImageFileName, setSchoolAuthenticatedImageFileName] = useState(null);

    // 대학생 인증용 상태 (STUDENT일 때 사용)
    const [studentFormData, setStudentFormData] = useState({
        accountEmail: "",
        schoolEmail: "",
        verificationCode: "",
    });
    const [isStudentVerificationRequested, setIsStudentVerificationRequested] = useState(false);
    const [studentVerificationCheck, setStudentVerificationCheck] = useState(undefined);
    const [schoolEmailValidation, setSchoolEmailValidation] = useState(undefined);

    // 동아리 인증용 상태 (CLUB일 때 사용)
    const [clubFormData, setClubFormData] = useState({
        clubName: "",
        school: "",
        clubCertificateFile: null,
        clubCertificateUrl: null,
    });

    const toggleDaumAddressOpen = () => {
        setShowDaumAddress(true);
      };
      const handleComplete = (data) => {

        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        
        setFormData({ 
            ...formData, 
            postalCode: data.zonecode,
            address: fullAddress
        });
        
        setAddress(fullAddress);
        setZonecode(data.zonecode);
        setShowDaumAddress(false);
      };
    const formatBusinessNumber = (input) => {
        // 숫자만 추출하고 최대 10자리까지 제한
        const numbers = input.replace(/[^0-9]/g, '').slice(0, 10);
        
        // 하이픈 추가
        if (numbers.length === 0) {
            return '';
        } else if (numbers.length <= 3) {
            return numbers;
        } else if (numbers.length <= 5) {
            return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        } else {
            return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5)}`;
        }
    };
    
    const handleInputChange = (name, value) => {
        if (name === 'businessNumber') {
            // 숫자만 추출하여 10자리 제한
            const numbers = value.replace(/[^0-9]/g, '');
            
            // 10자리를 넘으면 더 이상 입력 받지 않음
            if (numbers.length <= 10) {
                const formatted = formatBusinessNumber(value);
                setFormData({ ...formData, [name]: formatted });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // PDF 파일만 허용
            if (file.type === 'application/pdf') {
                setFormData({ ...formData, businessRegistrationFile: file });
            } else {
                alert('PDF 파일만 업로드 가능합니다.');
            }
        }
    };
    
    const handleFileDelete = () => {
        setFormData({ 
            ...formData, 
            businessRegistrationFile: null,
            businessRegistrationUrl: null 
        });
    };
    const industryOptions = [
        { value: "1", label: "제조업" },
        { value: "2", label: "도소매업" },
        { value: "3", label: "서비스업" },
        { value: "4", label: "건설업" },
        { value: "5", label: "부동산업" },
        { value: "6", label: "농업/축산업/임업" },
        { value: "7", label: "통신판매업" },
        { value: "8", label: "기타 업종" },
    ];
    const businessTypeOptions = [
        { value: "1", label: "법인 사업자" },
        { value: "2", label: "개인 사업자" },
    ];
    
    const isDisabled = selectedMemberType === "일반";

    // 대학생 인증 핸들러
    const handleStudentEmailRequest = () => {
        if (!studentFormData.accountEmail || !studentFormData.schoolEmail) {
            alert("이메일을 모두 입력해주세요.");
            return;
        }
        // TODO: API 호출 추가
        setIsStudentVerificationRequested(true);
    };

    const handleStudentVerification = () => {
        if (!studentFormData.verificationCode) {
            alert("인증번호를 입력해주세요.");
            return;
        }
        // TODO: API 호출 추가
        setStudentVerificationCheck(true);
    };

    const handleStudentInputChange = (name, e) => {
        const value = e.target.value;
        setStudentFormData({ ...studentFormData, [name]: value });
        
        // schoolEmail인 경우 실시간 검증
        if (name === "schoolEmail") {
            if (!value || value.trim() === "") {
                setSchoolEmailValidation(undefined);
            } else {
                const trimmedValue = value.trim();
                // ac.kr 형식 검증
                const isValidFormat = trimmedValue.endsWith(".ac.kr");
                
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                const hasValidEmailStructure = emailRegex.test(trimmedValue);
                
                if (isValidFormat && hasValidEmailStructure) {
                    setSchoolEmailValidation(true);
                } else if (hasValidEmailStructure && !isValidFormat) {
                    // 이메일 형식은 맞지만 ac.kr로 끝나지 않는 경우
                    setSchoolEmailValidation(false);
                } else if (!hasValidEmailStructure) {
                    // 이메일 형식 자체가 잘못된 경우
                    setSchoolEmailValidation(false);
                }
            }
        }
    };

    // 동아리 인증 핸들러
    const handleClubInputChange = (name, e) => {
        setClubFormData({ ...clubFormData, [name]: e.target.value });
    };

    const handleClubFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
                setClubFormData({ ...clubFormData, clubCertificateFile: file });
            } else {
                alert('PDF 또는 이미지 파일만 업로드 가능합니다.');
            }
        }
    };

    const handleClubFileDelete = () => {
        setClubFormData({ 
            ...clubFormData, 
            clubCertificateFile: null,
            clubCertificateUrl: null 
        });
    };

    const handleSignup = () => {
        if (!parentFormData) {
            console.error("parentFormData가 없습니다.");
            return;
        }

        // 학생 계정의 경우 schoolEmail과 schoolAuthenticatedImageFileName 검증
        if (selectedType === "STUDENT") {
            // schoolEmail 검증 (ac.kr 형식만 가능)
            if (!studentFormData.schoolEmail || !studentFormData.schoolEmail.trim()) {
                alert("학교 이메일을 입력해주세요.");
                return;
            }
            if (!studentFormData.schoolEmail.endsWith(".ac.kr")) {
                alert("ac.kr 형식의 학교 이메일만 가능합니다.");
                return;
            }

            // schoolAuthenticatedImageFileName 검증 (필수값)
            if (!schoolAuthenticatedImageFileName) {
                alert("학교 인증 파일을 업로드해주세요.");
                return;
            }
        }

        // 카테고리 데이터 정리 (null 값 제거)
        const cleanedCategories = (parentFormData.categoryDtos || [])
            .map((category) => {
                if (!category) return null;
                const cleaned = {};
                if (category.firstCategory !== null && category.firstCategory !== undefined) {
                    cleaned.firstCategory = Number(category.firstCategory);
                }
                if (category.secondCategory !== null && category.secondCategory !== undefined) {
                    cleaned.secondCategory = Number(category.secondCategory);
                }
                if (category.thirdCategory !== null && category.thirdCategory !== undefined) {
                    cleaned.thirdCategory = Number(category.thirdCategory);
                }
                return Object.keys(cleaned).length > 0 ? cleaned : null;
            })
            .filter(Boolean); // null 제거

        // 최종 회원가입 데이터 생성
        let finalFormData = {
            ...parentFormData,
            categoryDtos: cleanedCategories,
        };

        // 학생 계정의 경우 추가 필드 추가
        if (selectedType === "STUDENT") {
            finalFormData = {
                ...finalFormData,
                schoolEmail: studentFormData.schoolEmail.trim(),
                schoolAuthenticatedImageFileName: schoolAuthenticatedImageFileName.name,
            };
        } else if (selectedType === "MEMBER") {
            // 일반 회원의 경우 사업자 정보 추가 (선택사항)
            if (selectedMemberType === "사업자") {
                finalFormData = {
                    ...finalFormData,
                    companyName: formData.companyName,
                    businessNumber: formData.businessNumber,
                    postalCode: formData.postalCode,
                    address: formData.address,
                    detailAddress: formData.detailAddress,
                    industry: formData.industry,
                    businessType: formData.businessType,
                    businessRegistrationFile: formData.businessRegistrationFile,
                    businessRegistrationUrl: formData.businessRegistrationUrl,
                };
            }
        }

        console.log("최종 회원가입 데이터:", finalFormData);

        // 소셜 로그인 회원가입인 경우
        if (socialLoginInfo?.socialLogin) {
            const isPersonalInfoAgreed =
                parentFormData.isPersonalInfoAgreed && 
                parentFormData.isServiceUtilizationAgreed && 
                parentFormData.isMarketingAgreed !== undefined ? parentFormData.isMarketingAgreed : false;

            let registrationToken = socialLoginInfo.registrationToken;
            
            if (!registrationToken || registrationToken === null || registrationToken === undefined) {
                console.error("registrationToken이 없습니다:", registrationToken);
                alert("소셜 로그인 토큰을 가져올 수 없습니다. 다시 로그인해주세요.");
                return;
            }
            
            if (Array.isArray(registrationToken)) {
                registrationToken = registrationToken[0];
            } else if (typeof registrationToken === 'object') {
                const tokenValue = registrationToken.token || registrationToken.registrationToken;
                if (tokenValue) {
                    registrationToken = tokenValue;
                } else {
                    console.error("registrationToken이 빈 객체입니다:", registrationToken);
                    alert("소셜 로그인 토큰을 가져올 수 없습니다. 다시 로그인해주세요.");
                    return;
                }
            }

            const socialSignupData = {
                registrationToken: registrationToken,
                nickname: finalFormData.nickname,
                categoryDtos: cleanedCategories,
                isPersonalInfoAgreed,
                isMarketingAgreed: parentFormData.isMarketingAgreed || false,
                // 학생 계정 추가 필드
                ...(selectedType === "STUDENT" ? {
                    schoolEmail: finalFormData.schoolEmail,
                    schoolAuthenticatedImageFileName: finalFormData.schoolAuthenticatedImageFileName,
                } : {}),
            };

            if (socialSignUp) {
                socialSignUp.mutate(socialSignupData);
            }
            return;
        }

        // 일반 회원가입인 경우
        const isPersonalInfoAgreed =
            parentFormData.isPersonalInfoAgreed && 
            parentFormData.isServiceUtilizationAgreed && 
            parentFormData.isMarketingAgreed !== undefined ? parentFormData.isMarketingAgreed : false;

        finalFormData = {
            ...finalFormData,
            isPersonalInfoAgreed,
            isMarketingAgreed: parentFormData.isMarketingAgreed || false,
        };

        if (signUp) {
            signUp.mutate(finalFormData);
        }
    };
    
    if (selectedType === "STUDENT") {
        // 대학생 인증 폼
        return (
            <div className="w-full">
                 <div className="flex flex-col items-start gap-2 mb-8">
              <p className="text-black text-lg md:text-xl font-regular">학교 인증</p>
              <p className="text-black text-sm md:text-base font-regular">학교 인증을 위한 학생증이나 재학증명서를 업로드해주세요.</p>
              <p className="text-gray-500 text-sm md:text-base font-regular">(PNG, JPG, JPEG, PDF 업로드 가능)</p>
                </div>
           
                <div className="relative mb-8">
              <input
                type="file"
                name="schoolCertificationFile"
                accept="image/png,image/jpeg,image/jpg,application/pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const fileType = file.type;
                    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
                    if (validTypes.includes(fileType)) {
                      setSchoolAuthenticatedImageFileName(file);
                    } else {
                      alert('PNG, JPG, JPEG, PDF 파일만 업로드 가능합니다.');
                    }
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="school-certification-upload"
              />
              {schoolAuthenticatedImageFileName ? (
                <div className="w-64 h-64 border border-gray-300 rounded-lg relative mx-auto">
                  <button
                    onClick={() => setSchoolAuthenticatedImageFileName(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="w-full h-full p-4">
                    <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-500 mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <p className="text-gray-600 text-sm font-medium">{schoolAuthenticatedImageFileName.name}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="school-certification-upload"
                  className="w-64 h-64 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-main hover:bg-blue-50 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <p className="text-gray-500 text-lg font-regular">업로드하기</p>
                </label>
              )}
            </div>
            <Input  
                title="대학교 웹메일"
                placeholder="souf@univ.ac.kr"
                type="text"
                name="schoolEmail"
                essentialText="학교 이메일을 입력해주세요."
                disapproveText={schoolEmailValidation === false ? "ac.kr 형식의 학교 이메일을 입력해주세요." : ""}
                approveText={schoolEmailValidation === true ? "올바른 학교 이메일 형식입니다." : ""}
                isConfirmed={schoolEmailValidation}
                value={studentFormData.schoolEmail}
                onChange={(e) => handleStudentInputChange("schoolEmail", e)}
            />

<button 
              className="w-full py-3 rounded-md text-xl font-semibold transition-all bg-blue-main text-white shadow-md"
              onClick={handleSignup}
            >
              가입 신청하기
            </button>
           </div>
       
        );
    }

    // MEMBER일 때: 기존 사업자 정보 입력 폼
    return (
        <div className="w-full">
            <div className="flex items-center justify-center gap-4 mt-4 mb-8">
                <button 
                    onClick={() => setSelectedMemberType("일반")}
                    className={`w-full py-3 rounded-md text-xl font-semibold transition-all ${
                        selectedMemberType === "일반" 
                            ? "bg-blue-main text-white shadow-md" 
                            : "bg-gray-100 text-gray-500 hover:shadow-md"
                    }`}
                >
                    일반 회원으로 가입할래요
                </button>
                <button 
                    onClick={() => setSelectedMemberType("사업자")}
                    className={`w-full py-3 rounded-md text-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        selectedMemberType === "사업자" 
                            ? "bg-blue-main text-white shadow-md" 
                            : "bg-gray-100 text-gray-500 hover:shadow-md"
                    }`}
                >
                   사업자 정보를 추가할게요
                   <img src={infoIcon} alt="infoIcon" className={`w-5 h-5 ${
                        selectedMemberType === "사업자" 
                            ? "brightness-0 invert" 
                            : "grayscale opacity-50"
                    }`} />
                </button>
            </div>
            <Input
                title="회사명"
                type="text"
                name="companyName"
                essentialText="회사명을 입력해주세요."
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                disabled={isDisabled}
            />
            <div className="w-full relative mb-8">
                <div className="text-black text-lg md:text-xl font-regular mb-2">사업자 번호</div>
                <input
                    type="text"
                    className={`w-full py-2 px-2 font-medium text-black placeholder-[#81818a] text-md border-0 border-b-[3px] outline-none transition-colors duration-200 border-[#898989] ${
                        isDisabled ? "bg-gray-200 cursor-not-allowed" : "bg-[#F6F6F6] focus:border-blue-main"
                    }`}
                    placeholder="000-00-00000"
                    value={formData.businessNumber}
                    onChange={(e) => handleInputChange("businessNumber", e.target.value)}
                    onKeyDown={(e) => {
                        const numbers = formData.businessNumber.replace(/[^0-9]/g, '');
                        if (numbers.length >= 10 && e.key.match(/[0-9]/)) {
                            e.preventDefault();
                        }
                    }}
                    disabled={isDisabled}
                />
            </div>
        
           <div>
            <p className="text-black text-lg md:text-xl font-regular mb-2">회사 주소</p>
            {showDaumAddress && (
               <DaumPostcode
               onComplete={handleComplete}
             />
            )}
            <div className="flex items-center gap-2 justify-start mb-8">
                <input
                placeholder="우편번호"
                type="text"
                name="postalCode"
                readOnly
                value={formData.postalCode}
                disabled={isDisabled}
                className={`py-2 px-2 w-32  font-medium text-black placeholder-[#81818a] text-md border-0 border-b-[3px] outline-none transition-colors duration-200 border-[#898989] ${
                    isDisabled ? "bg-gray-200 cursor-not-allowed" : "bg-[#F6F6F6] focus:border-blue-main"
                }`}
                />
            <button 
                className={`py-2 px-2 w-32 font-medium rounded-md ${
                    isDisabled 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                        : "bg-blue-main text-white hover:bg-blue-600"
                }`}
                onClick={toggleDaumAddressOpen}
                disabled={isDisabled}
            >
                주소찾기
            </button>
           
            </div>
           
            <input
                placeholder="주소"
                type="text"
                name="address"
                disabled={isDisabled}
                className={`w-full py-2 px-2 font-medium text-black placeholder-[#81818a] text-md border-0 border-b-[3px] outline-none transition-colors duration-200 border-[#898989] mb-8 ${
                    isDisabled ? "bg-gray-200 cursor-not-allowed" : "bg-[#F6F6F6] focus:border-blue-main"
                }`}
                readOnly
                value={formData.address}
            />
                 <Input
                     placeholder="상세주소"
                     type="text"
                     name="detailAddress"
                     essentialText="상세주소를 입력해주세요."
                     value={formData.detailAddress}
                     onChange={(e) => handleInputChange("detailAddress", e.target.value)}
                     disabled={isDisabled}
                 />
           </div>
           <div className="mb-8">
            <p className="text-black text-lg md:text-xl font-regular mb-2">업태</p>
            <FilterDropdown
                options={industryOptions}
                placeholder="업태를 선택해주세요."
                selectedValue={formData.industry}
                onSelect={(value) => handleInputChange("industry", value)}
                width="w-full"
                disabled={isDisabled}
            />
           </div>
           <div className="mb-8">
            <p className="text-black text-lg md:text-xl font-regular mb-2">사업자 구분</p>
            <FilterDropdown
                options={businessTypeOptions}
                placeholder="구분을 선택해주세요."
                selectedValue={formData.businessType}
                onSelect={(value) => handleInputChange("businessType", value)}
                width="w-1/2"
                disabled={isDisabled}
            />
           </div>
           <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-black text-lg md:text-xl font-regular">사업자 등록증</p>
              <p className="text-gray-500 text-sm md:text-base font-regular">PDF 형식으로 업로드해주세요.</p>
            </div>
           
            <div className="relative">
              <input
                type="file"
                name="businessRegistrationFile"
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="business-registration-upload"
                disabled={isDisabled}
              />
              {(formData.businessRegistrationUrl || formData.businessRegistrationFile) ? (
                <div className="w-1/3 h-64 border border-gray-300 rounded-lg relative">
                  <button
                    onClick={handleFileDelete}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {formData.businessRegistrationFile && (
                    <div className="w-full h-full p-4">
                      <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-500 mb-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <p className="text-gray-600 text-sm font-medium">{formData.businessRegistrationFile.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <label
                  htmlFor="business-registration-upload"
                  className="w-1/3 h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-main hover:bg-blue-50 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <p className="text-gray-500 text-lg font-regular">업로드하기</p>
                </label>
              )}
            </div>
           </div>
           <button className="mt-8 w-full py-3 rounded-md text-xl font-semibold transition-all bg-blue-main text-white shadow-md"
           onClick={handleSignup}
           >가입 신청하기</button>
        </div>
    )
}