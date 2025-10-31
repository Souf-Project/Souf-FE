import React, { useState } from "react";
import Input from "../input";
import ButtonInput from "../buttonInput";
import Button from "../button";
import CategorySelectBox from "../categorySelectBox";
import FilterDropdown from "../filterDropdown";
import univList from "../../assets/univList.json";

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
}) {
  // 전공 필드들을 배열로 관리 (최대 2개)
  const [majorFields, setMajorFields] = useState([
    { major: formData.major || "", majorType: formData.majorType || "" }
  ]);

  // univList를 FilterDropdown이 기대하는 형식으로 변환
  const schoolOptions = univList.univList.map(univ => ({
    value: univ.code,
    label: univ.name
  }));

  const handleSchoolChange = (value) => {
    handleInputChange("school", { target: { value } });
  };

  const majorOptions = [
    {value: "1", label: "주전공"},
    {value: "2", label: "부전공"},
    {value: "3", label: "복수전공"},
  ];

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
 {userType === "STUDENT" && (
        <div className="w-full relative mb-8 flex flex-col gap-3">
          <div className="text-black text-lg md:text-2xl font-regular mb-2">
            학교 정보
          </div>
          <FilterDropdown
            options={schoolOptions}
            selectedValue={formData.school}
            onSelect={handleSchoolChange}
            placeholder="학교를 선택해주세요."
            height="h-10"
          />
          <div className="text-black text-lg md:text-2xl font-regular mb-2">
            전공
          </div>
          {majorFields.map((field, index) => (
            <div key={index} className="flex items-center gap-2 w-full mb-3">
              <div className="flex items-center flex-1">
                <Input
                  value={field.major}
                  onChange={(e) => handleMajorInputChange(index, e.target.value)}
                  placeholder="전공을 입력해주세요."
                  disapproveText="전공을 입력해주세요."
                  essentialText="전공을 입력해주세요."
                  isValidateTrigger={errors.major && index === 0}
                />
              </div>
              <div className="flex items-center mb-8">
                <FilterDropdown
                  placeholder="전공 선택"
                  options={majorOptions}
                  selectedValue={field.majorType}
                  onSelect={(value) => handleMajorTypeChange(index, value)}
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
          btnText="다음으로" 
          onClick={() => setSubStep(3)} 
        />
     
    </>
  );
}

