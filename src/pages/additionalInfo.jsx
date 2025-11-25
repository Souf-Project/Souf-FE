import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterDropdown from "../components/filterDropdown";
import Input from "../components/input";
import Button from "../components/button";
import DaumPostcode from "react-daum-postcode";
import univList from "../assets/univList.json";
import { UserStore } from "../store/userStore";
import infoIcon from "../assets/images/infoIcon.svg";
import { patchAdditionalStudentInfo, patchAdditionalMemberInfo } from "../api/member";
import { uploadToS3, postSignupFileUpload } from "../api/member";

export default function AdditionalInfo() {
  const navigate = useNavigate();
  const [roleType, setRoleType] = useState(null);
  
  // 전화번호
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // 학교 정보
  const [educationType, setEducationType] = useState("");
  const [schoolName, setSchoolName] = useState("");
  
  // 전공 정보
  const [majorFields, setMajorFields] = useState([
    { major: "", majorType: "" }
  ]);
  
  // 학교 인증 파일
  const [schoolAuthenticatedImageFileName, setSchoolAuthenticatedImageFileName] = useState(null);
  
  // 대학교 웹메일
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolEmailValidation, setSchoolEmailValidation] = useState(undefined);
  
  // 검증 에러
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 일반 회원용 상태 (사업자 정보)
  const [selectedMemberType, setSelectedMemberType] = useState("일반");
  const [memberFormData, setMemberFormData] = useState({
    companyName: "",
    businessRegistrationNumber: "",
    zipCode: "",
    address: "",
    detailedAddress: "",
    businessStatus: "",
    businessClassification: "",
    businessRegistrationFile: null,
  });
  const [showDaumAddress, setShowDaumAddress] = useState(false);
  const [businessValidationErrors, setBusinessValidationErrors] = useState({
    businessClassification: false,
    businessRegistrationNumber: false,
    businessStatus: false,
  });
  const [businessFileError, setBusinessFileError] = useState(false);

  const educationTypeOptions = [
    {value: "UNIV", label: "대학교"},
    {value: "GRADUATE", label: "대학원"},
  ];

  const majorOptions = [
    {value: "1", label: "주전공"},
    {value: "2", label: "부전공"},
    {value: "3", label: "복수전공"},
  ];

  const schoolOptions = univList.univList.map(univ => ({
    value: univ.code,
    label: univ.name
  }));

  // 사업자 정보 옵션
  const businessStatusOptions = [
    { value: "1", label: "제조업" },
    { value: "2", label: "도소매업" },
    { value: "3", label: "서비스업" },
    { value: "4", label: "건설업" },
    { value: "5", label: "부동산업" },
    { value: "6", label: "농업/축산업/임업" },
    { value: "7", label: "통신판매업" },
    { value: "8", label: "기타 업종" },
  ];
  const businessClassificationOptions = [
    { value: "1", label: "법인 사업자" },
    { value: "2", label: "개인 사업자" },
  ];

  const isDisabled = selectedMemberType === "일반";

  // 전화번호 포맷팅 함수
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

  // 사업자 번호 포맷팅 함수
  const formatbusinessRegistrationNumber = (input) => {
    const numbers = input.replace(/[^0-9]/g, '').slice(0, 10);
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

  // 사업자 정보 입력 변경 핸들러
  const handleMemberInputChange = (name, value) => {
    if (name === 'businessRegistrationNumber') {
      const numbers = value.replace(/[^0-9]/g, '');
      if (numbers.length <= 10) {
        const formatted = formatbusinessRegistrationNumber(value);
        setMemberFormData({ ...memberFormData, [name]: formatted });
        if (businessValidationErrors.businessRegistrationNumber) {
          setBusinessValidationErrors(prev => ({ ...prev, businessRegistrationNumber: false }));
        }
      }
    } else {
      setMemberFormData({ ...memberFormData, [name]: value });
      if (name === 'businessStatus' && businessValidationErrors.businessStatus) {
        setBusinessValidationErrors(prev => ({ ...prev, businessStatus: false }));
      }
      if (name === 'businessClassification' && businessValidationErrors.businessClassification) {
        setBusinessValidationErrors(prev => ({ ...prev, businessClassification: false }));
      }
    }
  };

  // 사업자 등록증 파일 변경 핸들러
  const handleBusinessFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setMemberFormData({ ...memberFormData, businessRegistrationFile: file });
        setBusinessFileError(false);
      } else {
        alert('PDF 파일만 업로드 가능합니다.');
      }
    }
  };

  // 사업자 등록증 파일 삭제 핸들러
  const handleBusinessFileDelete = () => {
    setMemberFormData({ 
      ...memberFormData, 
      businessRegistrationFile: null,
    });
  };

  // 주소 찾기 토글
  const toggleDaumAddressOpen = () => {
    setShowDaumAddress(true);
  };

  // 주소 선택 완료 핸들러
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
    
    setMemberFormData({ 
      ...memberFormData, 
      zipCode: data.zonecode,
      address: fullAddress
    });
    
    setShowDaumAddress(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const pendingRoleType = localStorage.getItem("pendingRoleType") || UserStore.getState().roleType;
      if (pendingRoleType) {
        setRoleType(pendingRoleType);
      } else {
        navigate("/login");
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleEducationTypeChange = (value) => {
    setEducationType(value);
    if (validationErrors.educationType) {
      setValidationErrors((prev) => ({ ...prev, educationType: false }));
    }
  };

  const handleSchoolChange = (value) => {
    const selectedSchool = schoolOptions.find(option => option.value === value);
    const schoolNameValue = selectedSchool ? selectedSchool.label : value;
    setSchoolName(schoolNameValue);
    if (validationErrors.schoolName) {
      setValidationErrors((prev) => ({ ...prev, schoolName: false }));
    }
  };

  // 전공 추가하기
  const handleAddMajor = () => {
    if (majorFields.length < 2) {
      setMajorFields([...majorFields, { major: "", majorType: "" }]);
    }
  };

  // 전공 필드 제거
  const handleRemoveMajor = (index) => {
    if (index > 0 && majorFields.length > 1) {
      const updatedFields = majorFields.filter((_, i) => i !== index);
      setMajorFields(updatedFields);
    }
  };

  // 전공 입력 값 변경
  const handleMajorInputChange = (index, value) => {
    const updatedFields = [...majorFields];
    updatedFields[index].major = value;
    setMajorFields(updatedFields);
    if (validationErrors.major) {
      setValidationErrors((prev) => ({ ...prev, major: false }));
    }
  };

  // 전공 타입 변경
  const handleMajorTypeChange = (index, value) => {
    const updatedFields = [...majorFields];
    updatedFields[index].majorType = value;
    setMajorFields(updatedFields);
    if (validationErrors.major) {
      setValidationErrors((prev) => ({ ...prev, major: false }));
    }
  };

  // 학교 이메일 입력 변경
  const handleSchoolEmailChange = (e) => {
    const value = e.target.value;
    setSchoolEmail(value);
    
    if (!value || value.trim() === "") {
      setSchoolEmailValidation(undefined);
    } else {
      const trimmedValue = value.trim();
      const isValidFormat = trimmedValue.endsWith(".ac.kr");
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const hasValidEmailStructure = emailRegex.test(trimmedValue);
      
      if (isValidFormat && hasValidEmailStructure) {
        setSchoolEmailValidation(true);
      } else if (hasValidEmailStructure && !isValidFormat) {
        setSchoolEmailValidation(false);
      } else if (!hasValidEmailStructure) {
        setSchoolEmailValidation(false);
      }
    }
    
    if (validationErrors.schoolEmail) {
      setValidationErrors((prev) => ({ ...prev, schoolEmail: false }));
    }
  };

  // 폼 검증
  const validateForm = () => {
    const newErrors = {};
    let errorMessage = "";

    // 전화번호 검증
    if (!phoneNumber || !phoneNumber.trim()) {
      newErrors.phoneNumber = true;
      errorMessage = "전화번호를 입력해주세요.";
    } else if (phoneNumber.replace(/[^0-9]/g, "").length !== 11) {
      newErrors.phoneNumber = true;
      errorMessage = "올바른 전화번호를 입력해주세요. (010-0000-0000)";
    }

    // 학교 검증
    if (!schoolName || !schoolName.trim()) {
      newErrors.schoolName = true;
      if (!errorMessage) errorMessage = "학교를 선택해주세요.";
    }
    if (!educationType || !educationType.trim()) {
      newErrors.educationType = true;
      if (!errorMessage) errorMessage = "학력을 선택해주세요.";
    }

    // 전공 검증
    majorFields.forEach((field, index) => {
      if (!field.major || !field.major.trim()) {
        newErrors.major = true;
        if (!errorMessage) errorMessage = "전공을 입력해주세요.";
      }
      if (!field.majorType || !field.majorType.trim()) {
        newErrors.major = true;
        if (!errorMessage) errorMessage = "전공 타입을 선택해주세요.";
      }
    });

    // 주전공(MAJOR)이 최소 하나 있는지 검증
    const hasMajor = majorFields.some(field => {
      const specialtyMap = {
        "1": "MAJOR",
        "2": "MINOR",
        "3": "DOUBLE_MAJOR"
      };
      return field.majorType && specialtyMap[field.majorType] === "MAJOR";
    });
    
    if (majorFields.length > 0 && !hasMajor) {
      newErrors.major = true;
      if (!errorMessage) errorMessage = "주전공을 입력해주세요.";
    }

    // 학교 인증 파일 검증
    if (!schoolAuthenticatedImageFileName) {
      newErrors.schoolAuthenticatedImageFileName = true;
      if (!errorMessage) errorMessage = "학교 인증 파일을 업로드해주세요.";
    }

    // 학교 이메일 검증
    if (!schoolEmail || !schoolEmail.trim()) {
      newErrors.schoolEmail = true;
      if (!errorMessage) errorMessage = "학교 이메일을 입력해주세요.";
    } else if (!schoolEmail.endsWith(".ac.kr")) {
      newErrors.schoolEmail = true;
      if (!errorMessage) errorMessage = "ac.kr 형식의 학교 이메일만 가능합니다.";
    }

    setValidationErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert(errorMessage || "필수 항목을 모두 입력해주세요.");
      return false;
    }

    return true;
  };

  // 일반 회원 폼 검증
  const validateMemberForm = () => {
    const newErrors = {};
    let errorMessage = "";

    // 전화번호 검증 (필수)
    if (!phoneNumber || !phoneNumber.trim()) {
      newErrors.phoneNumber = true;
      errorMessage = "전화번호를 입력해주세요.";
    } else if (phoneNumber.replace(/[^0-9]/g, "").length !== 11) {
      newErrors.phoneNumber = true;
      errorMessage = "올바른 전화번호를 입력해주세요. (010-0000-0000)";
    }

    // 사업자 정보 검증 (사업자 선택 시에만 필수)
    if (selectedMemberType === "사업자") {
      const businessErrors = {
        businessClassification: !memberFormData.businessClassification || memberFormData.businessClassification.trim() === "",
        businessRegistrationNumber: !memberFormData.businessRegistrationNumber || memberFormData.businessRegistrationNumber.replace(/[^0-9]/g, '').length !== 10,
        businessStatus: !memberFormData.businessStatus || memberFormData.businessStatus.trim() === "",
      };
      
      if (businessErrors.businessClassification || businessErrors.businessRegistrationNumber || businessErrors.businessStatus) {
        setBusinessValidationErrors(businessErrors);
        if (!errorMessage) {
          if (businessErrors.businessClassification) errorMessage = "사업자 구분을 선택해주세요.";
          else if (businessErrors.businessRegistrationNumber) errorMessage = "사업자 번호를 입력해주세요.";
          else if (businessErrors.businessStatus) errorMessage = "업태를 선택해주세요.";
        }
      }

      // 사업자 등록증 파일 검증
      if (!memberFormData.businessRegistrationFile) {
        setBusinessFileError(true);
        if (!errorMessage) errorMessage = "사업자 등록증을 업로드해주세요.";
      }
    }

    setValidationErrors(newErrors);

    if (Object.keys(newErrors).length > 0 || (selectedMemberType === "사업자" && (businessFileError || Object.values(businessValidationErrors).some(err => err)))) {
      alert(errorMessage || "필수 항목을 모두 입력해주세요.");
      return false;
    }

    return true;
  };

  // 제출 핸들러
  const handleSubmit = async () => {
    const isStudent = roleType === "STUDENT";
    const isValid = isStudent ? validateForm() : validateMemberForm();
    if (!isValid) return;
        
    setIsSubmitting(true);
    try {
      let response;
      if (isStudent) {
        const majorReqDtos = majorFields
          .filter(field => field.major && field.major.trim() && field.majorType)
          .map(field => {
            const specialtyMap = {
              "1": "MAJOR",
              "2": "MINOR",
              "3": "DOUBLE_MAJOR"
            };
            return {
              specialtyName: field.major.trim(),
              specialty: specialtyMap[field.majorType] || "MAJOR"
            };
          });

        const payload = {
          phoneNumber,
          schoolName,
          educationType,
          majorReqDtos,
          schoolEmail,
          schoolAuthenticatedImageFileName: schoolAuthenticatedImageFileName?.name || ""
        };
        // console.log("학생 추가 인증 제출", payload);

        response = await patchAdditionalStudentInfo(payload);
        
        // 학생 인증 파일 업로드
        if (schoolAuthenticatedImageFileName && response?.data?.result) {
          const result = response.data.result;
          const presignedUrl = result.presignedUrl;
          const fileUrl = result.fileUrl;
          const memberId = UserStore.getState().memberId;

          if (presignedUrl) {
            // 1. presignedUrl로 S3에 파일 업로드
            await uploadToS3(presignedUrl, schoolAuthenticatedImageFileName);
            
            // 2. S3 업로드 성공 후 서버에 파일 정보 전송
            const fileUrlArray = [fileUrl];
            const fileNameArray = [schoolAuthenticatedImageFileName.name];
            const fileTypeArray = [schoolAuthenticatedImageFileName.type.split('/')[1]?.toUpperCase() || 'PDF'];
            const purposeArray = [];
            
            await postSignupFileUpload(
              memberId,
              fileUrlArray,
              fileNameArray,
              fileTypeArray,
              purposeArray
            );
          }
        }
      } else {
        const isCompany = selectedMemberType === "사업자";
        const selectedBusinessStatus = businessStatusOptions.find(option => option.value === memberFormData.businessStatus);
        const selectedBusinessClassification = businessClassificationOptions.find(option => option.value === memberFormData.businessClassification);

        const payload = {
          phoneNumber,
          isCompany,
        };

        if (isCompany) {
          payload.companyName = memberFormData.companyName;
          payload.businessRegistrationNumber = memberFormData.businessRegistrationNumber;
          payload.addressReqDto = {
            zipCode: memberFormData.zipCode,
            roadNameAddress: memberFormData.address,
            detailedAddress: memberFormData.detailedAddress,
          };
          payload.businessStatus = selectedBusinessStatus ? selectedBusinessStatus.label : memberFormData.businessStatus;
          payload.businessClassification = selectedBusinessClassification ? selectedBusinessClassification.label : memberFormData.businessClassification;
          payload.businessRegistrationFile = memberFormData.businessRegistrationFile?.name || "";
        }

        // console.log("일반 회원 추가 인증 제출", payload);
        response = await patchAdditionalMemberInfo(payload);
        // console.log("일반 회원 추가 인증 제출 응답", response);
        // 일반 회원(전화번호만)인 경우 바로 성공 처리
        if (!isCompany) {
          const isSuccess =
            response?.status === 200 ||
            response?.data?.code === 200 ||
            response?.data?.status === 200;

          if (isSuccess) {
            alert("추가 인증 정보가 성공적으로 등록되었습니다.");
            navigate("/");
            return;
          } else {
            throw new Error(response?.data?.message || "추가 인증 정보 등록에 실패했습니다.");
          }
        }
        
        // 사업자등록증 파일 업로드 (사업자 선택 시)
        if (isCompany && memberFormData.businessRegistrationFile && response?.data?.result) {
          const result = response.data.result;
          const presignedUrl = result.presignedUrl;
          const fileUrl = result.fileUrl;
          const memberId = UserStore.getState().memberId;

        //   console.log("사업자 등록증 파일 업로드", {
        //     result,
        //     presignedUrl,
        //     fileUrl,
        //     memberId
        //   });
          if (presignedUrl) {
            // 1. presignedUrl로 S3에 파일 업로드
            await uploadToS3(presignedUrl, memberFormData.businessRegistrationFile);
            
            // 2. S3 업로드 성공 후 서버에 파일 정보 전송
            const fileUrlArray = [fileUrl];
            const fileNameArray = [memberFormData.businessRegistrationFile.name];
            const fileTypeArray = [memberFormData.businessRegistrationFile.type.split('/')[1]?.toUpperCase() || 'PDF'];
            const purposeArray = [];
            // console.log("사업자 등록증 파일 업로드 전송", {
            //   fileUrlArray,
            //   fileNameArray,
            //   fileTypeArray,
            //   purposeArray
            // });
            await postSignupFileUpload(
              memberId,
              fileUrlArray,
              fileNameArray,
              fileTypeArray,
              purposeArray
            );
          } else {
            throw new Error("파일 업로드 URL을 받지 못했습니다.");
          }
        } else if (isCompany && !memberFormData.businessRegistrationFile) {
          throw new Error("사업자 등록증 파일을 업로드해주세요.");
        }
      }

      // 학생 또는 사업자 회원의 경우 파일 업로드까지 완료된 후 성공 처리
      const isSuccess =
        response?.status === 200 ||
        response?.data?.code === 200 ||
        response?.data?.status === 200;

      if (isSuccess) {
        alert("추가 인증 정보가 성공적으로 등록되었습니다.");
        navigate("/");
      } else {
        throw new Error(response?.data?.message || "추가 인증 정보 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("추가 인증 정보 등록 실패:", error);
      alert("추가 인증 정보 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 flex flex-col max-w-[60rem] w-full mx-auto px-4">
        {roleType === "STUDENT" ? (
          <>
            <h1 className="text-black text-3xl font-bold mb-8 text-left">학생 회원 정보 입력</h1>

            <div className="flex flex-col items-center justify-center w-full bg-white p-6 lg:px-20 rounded-lg border border-gray-200 space-y-6 mb-40">
              {/* 전화번호 입력 */}
              <Input
                title="전화번호"
                type="text"
                placeholder="010-0000-0000"
                value={phoneNumber}
                essentialText="전화번호를 입력해주세요."
                disapproveText="올바른 전화번호를 입력해주세요. (010-0000-0000)"
                isValidateTrigger={validationErrors.phoneNumber}
                maxLength={13}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  const limitedValue = formatted.length > 13 ? formatted.slice(0, 13) : formatted;
                  setPhoneNumber(limitedValue);
                  if (validationErrors.phoneNumber) {
                    setValidationErrors((prev) => ({ ...prev, phoneNumber: false }));
                  }
                }}
                onKeyDown={(e) => {
                  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                  const currentValue = phoneNumber || "";
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
                  const limitedValue = formatted.length > 13 ? formatted.slice(0, 13) : formatted;
                  setPhoneNumber(limitedValue);
                }}
              />

              {/* 학교 정보 */}
              <div className="w-full relative mb-8 flex flex-col gap-3">
                <div className="text-black text-lg md:text-2xl font-regular mb-2">
                  학교 정보
                </div>
                <div className="w-full relative flex items-center gap-2">
                  <FilterDropdown
                    options={educationTypeOptions}
                    selectedValue={educationType}
                    onSelect={handleEducationTypeChange}
                    placeholder="학력"
                    height="h-10"
                    width="w-32"
                  />
                  <FilterDropdown
                    options={schoolOptions}
                    selectedValue={schoolOptions.find(opt => opt.label === schoolName)?.value || ""}
                    onSelect={(value) => {
                      handleSchoolChange(value);
                    }}
                    placeholder="학교를 선택해주세요."
                    height="h-10"
                    width="w-72"
                  />
                  {validationErrors.schoolName && (
                    <p className="absolute left-0 top-full mt-1 text-xs font-medium text-red-500">
                      학교를 선택해주세요.
                    </p>
                  )}
                  {validationErrors.educationType && (
                    <p className="absolute left-0 top-full mt-1 text-xs font-medium text-red-500">
                      학력을 선택해주세요.
                    </p>
                  )}
                </div>

                {/* 전공 */}
                <div className="text-black text-lg md:text-2xl font-regular mt-4">
                  전공
                </div>
                {majorFields.map((field, index) => (
                  <div key={index} className="flex items-center gap-2 w-full mb-3">
                    <div className="flex items-center flex-1">
                      <Input
                        value={field.major}
                        onChange={(e) => {
                          handleMajorInputChange(index, e.target.value);
                        }}
                        placeholder="전공을 입력해주세요."
                        disapproveText="전공을 입력해주세요."
                        essentialText="전공을 입력해주세요."
                        isValidateTrigger={validationErrors.major}
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-8">
                      <FilterDropdown
                        placeholder="전공 선택"
                        options={majorOptions}
                        selectedValue={field.majorType}
                        onSelect={(value) => {
                          handleMajorTypeChange(index, value);
                        }}
                        width="w-32"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMajor(index)}
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white hover:shadow-md"
                          title="전공 입력칸 제거"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {majorFields.length < 2 && (
                  <button 
                    onClick={handleAddMajor}
                    className="text-gray-500 text-sm font-light flex items-center justify-center border border-gray-300 rounded-lg p-2 w-1/3 hover:bg-gray-50 transition-colors"
                  >
                    추가하기 +
                  </button>
                )}
                {validationErrors.major && (
                  <p className="text-red-500 text-sm font-medium mt-1">
                    전공을 모두 입력해주세요.
                  </p>
                )}
              </div>

              {/* 학교 인증 파일 */}
              <div className="w-full mb-8">
                <div className="flex flex-col items-start gap-2 mb-4">
                  <p className="text-black text-lg md:text-xl font-regular">
                    학교 인증 <span className="text-red-500">*</span>
                  </p>
                  <p className="text-black text-sm md:text-base font-regular">
                    학교 인증을 위한 학생증이나 재학증명서를 업로드해주세요.
                  </p>
                  <p className="text-gray-500 text-sm md:text-base font-regular">
                    (PNG, JPG, JPEG, PDF 업로드 가능)
                  </p>
                </div>
                <div className="relative">
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
                          if (validationErrors.schoolAuthenticatedImageFileName) {
                            setValidationErrors((prev) => ({ ...prev, schoolAuthenticatedImageFileName: false }));
                          }
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
                      className={`w-64 h-64 mx-auto border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors duration-200 ${
                        validationErrors.schoolAuthenticatedImageFileName
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 hover:border-blue-main hover:bg-blue-50"
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <p className="text-gray-500 text-lg font-regular">업로드하기</p>
                    </label>
                  )}
                </div>
                {validationErrors.schoolAuthenticatedImageFileName && (
                  <p className="text-red-500 text-sm font-medium mt-2">학교 인증 파일을 업로드해주세요.</p>
                )}
              </div>

              {/* 대학교 웹메일 */}
              <Input  
                title="대학교 웹메일"
                placeholder="souf@univ.ac.kr"
                type="text"
                name="schoolEmail"
                essentialText="학교 이메일을 입력해주세요."
                disapproveText={schoolEmailValidation === false ? "ac.kr 형식의 학교 이메일을 입력해주세요." : ""}
                approveText={schoolEmailValidation === true ? "올바른 학교 이메일 형식입니다." : ""}
                isConfirmed={schoolEmailValidation}
                value={schoolEmail}
                onChange={handleSchoolEmailChange}
                isValidateTrigger={validationErrors.schoolEmail}
              />

              {/* 제출 버튼 */}
              <Button 
                btnText={isSubmitting ? "처리 중..." : "가입 신청하기"} 
                onClick={handleSubmit}
                disabled={isSubmitting}
              />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-black text-3xl font-bold mb-8 text-left">일반 회원 정보 입력</h1>
            <div className="flex flex-col items-center justify-center w-full bg-white p-6 lg:px-20 rounded-lg border border-gray-200 space-y-6 mb-40">
              {/* 전화번호 입력 */}
              <Input
                title="전화번호"
                type="text"
                placeholder="010-0000-0000"
                value={phoneNumber}
                essentialText="전화번호를 입력해주세요."
                disapproveText="올바른 전화번호를 입력해주세요. (010-0000-0000)"
                isValidateTrigger={validationErrors.phoneNumber}
                maxLength={13}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  const limitedValue = formatted.length > 13 ? formatted.slice(0, 13) : formatted;
                  setPhoneNumber(limitedValue);
                  if (validationErrors.phoneNumber) {
                    setValidationErrors((prev) => ({ ...prev, phoneNumber: false }));
                  }
                }}
                onKeyDown={(e) => {
                  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                  const currentValue = phoneNumber || "";
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
                  const limitedValue = formatted.length > 13 ? formatted.slice(0, 13) : formatted;
                  setPhoneNumber(limitedValue);
                }}
              />

              {/* 일반/사업자 선택 */}
              <div className="flex items-center justify-center gap-4 mt-4 mb-8 w-full">
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

              {/* 사업자 정보 입력 (사업자 선택 시) */}
              {selectedMemberType === "사업자" && (
                <>
                  <Input
                    title="회사명"
                    type="text"
                    name="companyName"
                    essentialText="회사명을 입력해주세요."
                    value={memberFormData.companyName}
                    onChange={(e) => handleMemberInputChange("companyName", e.target.value)}
                    disabled={isDisabled}
                  />
                  
                  <div className="w-full relative mb-8">
                    <div className="text-black text-lg md:text-xl font-regular mb-2">사업자 번호</div>
                    <input
                      type="text"
                      className={`w-full py-2 px-2 font-medium text-black placeholder-[#81818a] text-md border-0 border-b-[3px] outline-none transition-colors duration-200 ${
                        businessValidationErrors.businessRegistrationNumber
                          ? "border-red-500"
                          : "border-[#898989]"
                      } ${
                        isDisabled ? "bg-gray-200 cursor-not-allowed" : "bg-[#F6F6F6] focus:border-blue-main"
                      }`}
                      placeholder="000-00-00000"
                      value={memberFormData.businessRegistrationNumber}
                      onChange={(e) => handleMemberInputChange("businessRegistrationNumber", e.target.value)}
                      onKeyDown={(e) => {
                        const numbers = memberFormData.businessRegistrationNumber.replace(/[^0-9]/g, '');
                        if (numbers.length >= 10 && e.key.match(/[0-9]/)) {
                          e.preventDefault();
                        }
                      }}
                      disabled={isDisabled}
                    />
                    {businessValidationErrors.businessRegistrationNumber && (
                      <p className="text-red-500 text-sm font-medium mt-1">사업자 번호를 입력해주세요.</p>
                    )}
                  </div>

                  {/* 회사 주소 */}
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
                        name="zipCode"
                        readOnly
                        value={memberFormData.zipCode}
                        disabled={isDisabled}
                        className={`py-2 px-2 w-32 font-medium text-black placeholder-[#81818a] text-md border-0 border-b-[3px] outline-none transition-colors duration-200 border-[#898989] ${
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
                      value={memberFormData.address}
                    />
                    <Input
                      placeholder="상세주소"
                      type="text"
                      name="detailedAddress"
                      essentialText="상세주소를 입력해주세요."
                      value={memberFormData.detailedAddress}
                      onChange={(e) => handleMemberInputChange("detailedAddress", e.target.value)}
                      disabled={isDisabled}
                    />
                  </div>

                  {/* 업태 */}
                  <div className="mb-8">
                    <p className="text-black text-lg md:text-xl font-regular mb-2">업태</p>
                    <FilterDropdown
                      options={businessStatusOptions}
                      placeholder="업태를 선택해주세요."
                      selectedValue={memberFormData.businessStatus}
                      onSelect={(value) => handleMemberInputChange("businessStatus", value)}
                      width="w-full"
                      disabled={isDisabled}
                    />
                    {businessValidationErrors.businessStatus && (
                      <p className="text-red-500 text-sm font-medium mt-1">업태를 선택해주세요.</p>
                    )}
                  </div>

                  {/* 사업자 구분 */}
                  <div className="mb-8">
                    <p className="text-black text-lg md:text-xl font-regular mb-2">사업자 구분</p>
                    <FilterDropdown
                      options={businessClassificationOptions}
                      placeholder="구분을 선택해주세요."
                      selectedValue={memberFormData.businessClassification}
                      onSelect={(value) => handleMemberInputChange("businessClassification", value)}
                      width="w-1/2"
                      disabled={isDisabled}
                    />
                    {businessValidationErrors.businessClassification && (
                      <p className="text-red-500 text-sm font-medium mt-1">사업자 구분을 선택해주세요.</p>
                    )}
                  </div>

                  {/* 사업자 등록증 */}
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
                        onChange={handleBusinessFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="business-registration-upload"
                        disabled={isDisabled}
                      />
                      {memberFormData.businessRegistrationFile ? (
                        <div className="w-1/3 h-64 border border-gray-300 rounded-lg relative">
                          <button
                            onClick={handleBusinessFileDelete}
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
                              <p className="text-gray-600 text-sm font-medium">{memberFormData.businessRegistrationFile.name}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="business-registration-upload"
                          className={`w-1/3 h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors duration-200 ${
                            businessFileError 
                              ? "border-red-500 bg-red-50" 
                              : "border-gray-300 hover:border-blue-main hover:bg-blue-50"
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-12 h-12">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          <p className="text-gray-500 text-lg font-regular">업로드하기</p>
                        </label>
                      )}
                    </div>
                    {businessFileError && (
                      <p className="text-red-500 text-sm font-medium mt-2">사업자 등록증을 업로드해주세요.</p>
                    )}
                  </div>
                </>
              )}

              {/* 제출 버튼 */}
              <Button 
                btnText={isSubmitting ? "처리 중..." : "가입 신청하기"} 
                onClick={handleSubmit}
                disabled={isSubmitting}
              />
            </div>
          </>
        )}
      </div>
  );
}
