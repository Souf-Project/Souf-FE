import { useState } from "react";
import Input from "../input";
import Button from "../button";
import FilterDropdown from "../filterDropdown";
import DaumPostcode from "react-daum-postcode";
import ButtonInput from "../buttonInput";
import infoIcon from "../../assets/images/infoIcon.svg";

export default function AuthForm({ selectedType = "MEMBER" }) {
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

    // 대학생 인증용 상태 (STUDENT일 때 사용)
    const [studentFormData, setStudentFormData] = useState({
        accountEmail: "",
        schoolEmail: "",
        verificationCode: "",
    });
    const [isStudentVerificationRequested, setIsStudentVerificationRequested] = useState(false);
    const [studentVerificationCheck, setStudentVerificationCheck] = useState(undefined);

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
        console.log(data);
        
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
        setStudentFormData({ ...studentFormData, [name]: e.target.value });
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
    
    // selectedType에 따라 다른 폼 렌더링
    if (selectedType === "STUDENT") {
        // 대학생 인증 폼
        return (
            <div className="w-full">
                <Input
                    title="계정 이메일"
                    type="email"
                    placeholder="your.email@example.com"
                    essentialText="계정 이메일을 입력해주세요."
                    value={studentFormData.accountEmail}
                    onChange={(e) => handleStudentInputChange("accountEmail", e)}
                />
                <ButtonInput
                    title="학교 이메일"
                    value={studentFormData.schoolEmail}
                    onChange={(e) => handleStudentInputChange("schoolEmail", e)}
                    btnText="인증요청"
                    onClick={handleStudentEmailRequest}
                    placeholder="student@souf.ac.kr"
                    essentialText="학교 이메일을 입력해주세요."
                />
                {isStudentVerificationRequested && (
                    <ButtonInput
                        title="인증번호 확인"
                        value={studentFormData.verificationCode}
                        onChange={(e) => handleStudentInputChange("verificationCode", e)}
                        btnText="인증하기"
                        onClick={handleStudentVerification}
                        placeholder="인증 코드를 입력하세요"
                        isConfirmed={studentVerificationCheck}
                        essentialText="인증번호를 입력해주세요"
                        approveText="인증이 완료되었습니다."
                        disapproveText="인증번호가 올바르지 않습니다."
                    />
                )}
            </div>
        );
    }

    if (selectedType === "CLUB") {
        // 동아리 인증 폼
        return (
            <div className="w-full">
                <Input
                    title="동아리명"
                    type="text"
                    essentialText="동아리명을 입력해주세요."
                    value={clubFormData.clubName}
                    onChange={(e) => handleClubInputChange("clubName", e)}
                />
                <Input
                    title="소속 학교"
                    type="text"
                    essentialText="소속 학교를 입력해주세요."
                    value={clubFormData.school}
                    onChange={(e) => handleClubInputChange("school", e)}
                />
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <p className="text-black text-lg md:text-xl font-regular">동아리 인증서류</p>
                        <p className="text-gray-500 text-sm md:text-base font-regular">PDF 또는 이미지 형식으로 업로드해주세요.</p>
                    </div>
                    <div className="relative">
                        <input
                            type="file"
                            name="clubCertificateFile"
                            accept="application/pdf,image/*"
                            onChange={handleClubFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            id="club-certificate-upload"
                        />
                        {(clubFormData.clubCertificateUrl || clubFormData.clubCertificateFile) ? (
                            <div className="w-1/3 h-64 border border-gray-300 rounded-lg relative">
                                <button
                                    onClick={handleClubFileDelete}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {clubFormData.clubCertificateFile && (
                                    <div className="w-full h-full p-4">
                                        <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-500 mb-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                            <p className="text-gray-600 text-sm font-medium">{clubFormData.clubCertificateFile.name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <label
                                htmlFor="club-certificate-upload"
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
        </div>
    )
}