import React, { useState } from "react";
import Input from "../input";
import ButtonInput from "../buttonInput";
import Button from "../button";
import CategorySelectBox from "../categorySelectBox";
import FilterDropdown from "../filterDropdown";
import univList from "../../assets/univList.json";
import AlertModal from "../alertModal";
import { SIGNUP_ERRORS } from "../../constants/join";

export default function UserForm({
  socialLoginInfo,
  formData,
  userType,
  setUserType,
  errors,
  checkResult,
  nickname,
  setNickname,
  handleInputChange,
  handleCategoryChange,
  checkNickname,
  handleSignup,
  signUp,
  socialSignUp,
  setSubStep,
  selectedType,
  setFormData
}) {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalTitle, setErrorModalTitle] = useState("");
  const [errorModalDescription, setErrorModalDescription] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  
  // 전공 필드들을 배열로 관리 (최대 2개)
  const [majorFields, setMajorFields] = useState([
    { major: formData.major || "", majorType: formData.majorType || "" }
  ]);

  // 통합 검증 함수
  const validateForm = () => {
    const newErrors = {};
    let errorMessage = "";

    // 일반 회원가입 (CLUB이 아닌 경우)
    if (selectedType !== "CLUB") {
      // 이름 검증
      if (!socialLoginInfo?.socialLogin) {
        if (!formData.username || !formData.username.trim()) {
          newErrors.username = true;
          if (!errorMessage) {
            errorMessage = "이름을 입력해주세요.";
          }
        }
      }

      // 닉네임 검증
      if (!formData.nickname || !formData.nickname.trim()) {
        newErrors.nickname = true;
        if (!errorMessage) {
          errorMessage = "닉네임을 입력해주세요.";
        }
      } else if (!checkResult) {
        newErrors.nickname = true;
        if (!errorMessage) {
          errorMessage = "닉네임 중복 확인을 완료해주세요.";
        }
      }
    }

    // 대학생 회원가입
    if (selectedType === "STUDENT") {
      // 학교 검증
      if (!formData.schoolName || !formData.schoolName.trim()) {
        newErrors.schoolName = true;
        if (!errorMessage) {
          errorMessage = "학교를 선택해주세요.";
        }
      }
      if (!formData.educationType || !formData.educationType.trim()) {
        newErrors.educationType = true;
        if (!errorMessage) {
          errorMessage = "학력을 선택해주세요.";
        }
      }

      // 전공 검증 (첫 번째 전공은 필수)
      if (!majorFields[0]?.major || !majorFields[0].major.trim()) {
        newErrors.major = true;
        if (!errorMessage) {
          errorMessage = "전공을 입력해주세요.";
        }
      }
      if (!majorFields[0]?.majorType || !majorFields[0].majorType.trim()) {
        newErrors.major = true;
        if (!errorMessage) {
          errorMessage = "전공 타입을 선택해주세요.";
        }
      }
    }

    // 동아리 회원가입
    if (selectedType === "CLUB") {
      // 동아리명 검증
      if (!formData.clubName || !formData.clubName.trim()) {
        newErrors.clubName = true;
        if (!errorMessage) {
          errorMessage = "동아리명을 입력해주세요.";
        }
      }

      // 대표자명 검증
      if (!formData.clubRepresentativeName || !formData.clubRepresentativeName.trim()) {
        newErrors.clubRepresentativeName = true;
        if (!errorMessage) {
          errorMessage = "대표자명을 입력해주세요.";
        }
      }
    }

    // 관심분야 검증 (모든 타입 공통)
    const hasCategory = formData?.categoryDtos?.some(category => 
      category.firstCategory !== null || 
      category.secondCategory !== null || 
      category.thirdCategory !== null
    );
    if (!hasCategory) {
      newErrors.categoryDtos = true;
      if (!errorMessage) {
        errorMessage = "최소 1개 이상의 관심분야를 선택해주세요.";
      }
    }

    setValidationErrors(newErrors);

    // 에러가 있으면 모달 표시
    if (Object.keys(newErrors).length > 0) {
      setErrorModalTitle("입력 오류");
      setErrorModalDescription(errorMessage || "필수 항목을 모두 입력해주세요.");
      setShowErrorModal(true);
      return false;
    }

    return true;
  };

  const handleSignupClick = () => {
    // 검증 전 현재 제출될 데이터 로그 출력
    const submitDataLog = {
      formData: { ...formData },
      nicknameState: nickname,
      majorFields: [...majorFields],
      selectedType: selectedType,
    };
    
    if (selectedType === "STUDENT") {

      majorFields.forEach((field, index) => {
      });
    }
  
    
    if (validateForm()) {
      // 동아리 계정일 때는 회원가입 API 호출
      if (selectedType === "CLUB") {
        handleSignup();
      } else {
        // 일반/학생 계정일 때는 데이터 합쳐서 다음 단계로 넘기기
        if (setFormData && setSubStep) {
          // setFormData를 사용하여 최신 상태를 가져옴
          setFormData((prevFormData) => {
        
            // 카테고리 데이터 정리 (null 값 제거)
            const cleanedCategories = (prevFormData.categoryDtos || [])
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

            // 업데이트된 formData 생성 - 모든 데이터를 최상위 레벨에 평평하게 저장
            const updatedFormData = {
              ...prevFormData,
              // userForm에서 입력한 데이터 추가 - 값이 있으면 사용, 없으면 nickname state 사용
              username: formData.username,
              nickname: formData.nickname,
              categoryDtos: cleanedCategories.length > 0 ? cleanedCategories : (prevFormData.categoryDtos || []),
              // 학생 계정의 경우 추가 정보
              ...(selectedType === "STUDENT" ? {
                schoolName: prevFormData.schoolName || "",
                educationType: (() => {
                  // 기존 값이 숫자면 변환, 아니면 그대로 사용
                  const eduType = prevFormData.educationType || "";
                  return educationTypeMap[eduType] || eduType || "";
                })(),
                majorReqDtos: majorFields
                  .filter(field => field.major && field.major.trim()) // 전공명이 있는 것만 필터링
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
                  })
              } : {}),
            };

            // studentFormData, memberFormData, clubFormData 같은 중첩 구조 제거
            delete updatedFormData.studentFormData;
            delete updatedFormData.memberFormData;
            delete updatedFormData.clubFormData;
            
            // 개별 전공 필드 제거 (majorReqDtos 배열로만 사용)
            delete updatedFormData.major;
            delete updatedFormData.majorType;

            return updatedFormData;
          });
          setSubStep(3);
        }
      }
    } else {
    
    }
  };

  // univList를 FilterDropdown이 기대하는 형식으로 변환
  const schoolOptions = univList.univList.map(univ => ({
    value: univ.code,
    label: univ.name
  }));

  const handleSchoolChange = (value) => {
    // value는 univ.code이므로, 해당 코드에 맞는 학교 이름을 찾아서 저장
    const selectedSchool = schoolOptions.find(option => option.value === value);
    const schoolName = selectedSchool ? selectedSchool.label : value;
    
    setFormData((prev) => ({ ...prev, schoolName: schoolName }));
    handleInputChange("school", { target: { value: schoolName } });
    if (validationErrors.schoolName) {
      setValidationErrors((prev) => ({ ...prev, schoolName: false }));
    }
  };

  const handleEducationTypeChange = (value) => {
    // value가 "UNIV" 또는 "GRADUATE"이므로 그대로 저장
    const educationType = value;
    setFormData((prev) => ({ ...prev, educationType: educationType }));
    handleInputChange("educationType", { target: { value: educationType } });
    if (validationErrors.educationType) {
      setValidationErrors((prev) => ({ ...prev, educationType: false }));
    }
  };

  const majorOptions = [
    {value: "1", label: "주전공"},
    {value: "2", label: "부전공"},
    {value: "3", label: "복수전공"},
  ];

  const educationTypeOptions = [
    {value: "UNIV", label: "대학교"},
    {value: "GRADUATE", label: "대학원"},
  ];
  
  // 숫자 값을 API 값으로 변환하는 맵
  const educationTypeMap = {
    "1": "UNIV",
    "2": "GRADUATE",
    "UNIV": "UNIV",
    "GRADUATE": "GRADUATE"
  };
  
  // API 값을 숫자로 변환하는 맵 (FilterDropdown 표시용)
  const educationTypeToValueMap = {
    "UNIV": "UNIV",
    "GRADUATE": "GRADUATE"
  };

  // 전공 추가하기 버튼 클릭
  const handleAddMajor = () => {
    if (majorFields.length < 2) {
      setMajorFields([...majorFields, { major: "", majorType: "" }]);
    }
  };

  // 전공 입력 값 변경
  const handleMajorInputChange = (index, value) => {
    const updatedFields = [...majorFields];
    updatedFields[index].major = value;
    setMajorFields(updatedFields);
    // formData에 업데이트 (임시로 첫 번째 전공만 formData에 저장)
    if (index === 0) {
      handleInputChange("major", { target: { value } });
    }
  };

  // 전공 타입 변경
  const handleMajorTypeChange = (index, value) => {
    const updatedFields = [...majorFields];
    updatedFields[index].majorType = value;
    setMajorFields(updatedFields);
    // formData에 업데이트
    if (index === 0) {
      handleInputChange("majorType", { target: { value } });
    }
  };
  return (
    <>
      {selectedType !== "CLUB" && (
        <>
          <Input
            title="이름"
            name="username"
            value={formData.username}
            onChange={(e) => {
              handleInputChange("username", e);
              if (validationErrors.username) {
                setValidationErrors((prev) => ({ ...prev, username: false }));
              }
            }}
            disapproveText="이름을 입력해주세요."
            essentialText="이름을 입력해주세요."
            isValidateTrigger={validationErrors.username || errors.username}
            disabled={socialLoginInfo?.socialLogin}
          />
          <ButtonInput
            name="nickname"
            value={formData.nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              handleInputChange("nickname", e);
              if (validationErrors.nickname) {
                setValidationErrors((prev) => ({ ...prev, nickname: false }));
              }
            }}
            title="닉네임"
            btnText="중복확인"
            essentialText="닉네임을 입력해주세요."
            disapproveText={checkResult === false ? "이미 가입된 닉네임입니다." : "닉네임 중복 확인을 완료해주세요."}
            onClick={() => checkNickname.mutate(nickname)}
            isValidateTrigger={validationErrors.nickname || errors.nickname}
            isConfirmed={checkResult}
            approveText="사용 가능한 닉네임입니다."
          />
        </>
      )}
      
      {selectedType === "STUDENT" && (
        <div className="w-full relative mb-8 flex flex-col gap-3">
          <div className="text-black text-lg md:text-2xl font-regular mb-2">
            학교 정보
          </div>
          <div className="w-full relative flex items-center gap-2">
          <FilterDropdown
              options={educationTypeOptions}
              selectedValue={(() => {
                // formData.educationType이 숫자면 변환, 아니면 그대로 사용
                const eduType = formData.educationType || "";
                return educationTypeMap[eduType] || eduType || "";
              })()}
              onSelect={handleEducationTypeChange}
              placeholder="학력"
              height="h-10"
              width="w-32"
            />
            <FilterDropdown
              options={schoolOptions}
              selectedValue={(() => {
                // formData.school이 학교 이름이므로, 학교 이름에 맞는 코드를 찾아서 반환
                const foundSchool = schoolOptions.find(option => option.label === formData.schoolName);
                return foundSchool ? foundSchool.value : formData.schoolName;
              })()}
              onSelect={(value) => {
                handleSchoolChange(value);
                if (validationErrors.schoolName) {
                  setValidationErrors((prev) => ({ ...prev, schoolName: false }));
                }
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
          </div>
          <div className="text-black text-lg md:text-2xl font-regular mb-2">
            전공
          </div>
          {majorFields.map((field, index) => (
            <div key={index} className="flex items-center gap-2 w-full mb-3">
              <div className="flex items-center flex-1">
                <Input
                  value={field.major}
                  onChange={(e) => {
                    handleMajorInputChange(index, e.target.value);
                    if (validationErrors.major && index === 0) {
                      setValidationErrors((prev) => ({ ...prev, major: false }));
                    }
                  }}
                  placeholder="전공을 입력해주세요."
                  disapproveText="전공을 입력해주세요."
                  essentialText="전공을 입력해주세요."
                  isValidateTrigger={(validationErrors.major || errors.major) && index === 0}
                />
              </div>
              <div className="flex items-center mb-8">
                <FilterDropdown
                  placeholder="전공 선택"
                  options={majorOptions}
                  selectedValue={field.majorType}
                  onSelect={(value) => {
                    handleMajorTypeChange(index, value);
                    if (validationErrors.major && index === 0) {
                      setValidationErrors((prev) => ({ ...prev, major: false }));
                    }
                  }}
                  width="w-32"
                />
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
        </div>
      )}
      
      {selectedType === "CLUB" && (
        <div className="w-full relative mb-8 flex flex-col gap-3">
         
          <ButtonInput
          title="동아리명"
          name="clubName"
          value={formData.clubName}
          onChange={(e) => {
            handleInputChange("clubName", e);
            if (validationErrors.clubName) {
              setValidationErrors((prev) => ({ ...prev, clubName: false }));
            }
          }}
          disapproveText="동아리명을 입력해주세요."
          essentialText="동아리명을 입력해주세요."
          isValidateTrigger={validationErrors.clubName || errors.clubName}
          btnText="중복확인"  
          />
          <ButtonInput  
          title="대표자명"
        name="clubRepresentativeName"
          value={formData.clubRepresentativeName}
          onChange={(e) => {
            handleInputChange("clubRepresentativeName", e);
            if (validationErrors.clubRepresentativeName) {
              setValidationErrors((prev) => ({ ...prev, clubRepresentativeName: false }));
            }
          }}
          disapproveText="대표자명을 입력해주세요."
          essentialText="대표자명을 입력해주세요."
          isValidateTrigger={validationErrors.clubRepresentativeName || errors.clubRepresentativeName}
          btnText="중복확인"
        />


        <p className="text-black text-lg md:text-xl font-regular mb-2">동아리 인증 수단</p>
        <textarea 
         name="clubCertificationType"
         placeholder="스프 측에서 동아리 소유주인지 확인할 수 있는 동아리 공식 연락 수단이 있다면 기입해주세요.
 (예: 인스타그램 아이디, 공식 계정 이메일 등)"
         className="w-full p-2 mb-8 border border-gray-300 rounded-lg min-h-[160px] resize-none align-top"
         value={formData.clubCertificationType || ""}
         onChange={(e) => handleInputChange("clubCertificationType", e)}
         />


<p className="text-black text-lg md:text-xl font-regular mb-2">동아리 정보<span className="text-gray-500 text-sm font-light ml-2">(선택)</span></p>


        <textarea 
         name="clubCertificationType"
         placeholder="동아리에 대해 여러 사용자가 알 수 있도록 다양한 정보를 기입해보세요!"
         className="w-full p-2 border border-gray-300 rounded-lg min-h-[160px] resize-none align-top"
         value={formData.clubCertificationType || ""}
         onChange={(e) => handleInputChange("clubCertificationType", e)}
         />
          </div>
      )}


     

      <div className="w-full relative mb-8 flex flex-col gap-3">
        <div className="text-black text-lg md:text-2xl font-regular mb-2">
          관심분야 {" "}
          <span className="text-gray-500 text-sm">(최소 1개 이상 선택)</span>
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
     

        <Button 
          btnText={selectedType === "CLUB" ? "가입 신청하기" : "다음으로"} 
          onClick={handleSignupClick} 
        />
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

