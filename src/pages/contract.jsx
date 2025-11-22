import ContractInput from "../components/contractInput";
import FilterDropdown from "../components/filterDropdown";
import { useState, useEffect } from "react";
import calendarIcon from "../assets/images/calendarIcon.svg";
import { UserStore } from "../store/userStore";
import { getOrdererInfo, getBeneficiaryInfo, postContractOrderer, postContractBeneficiary } from "../api/contract";
import AlertModal from "../components/alertModal";
import LoadingModal from "../components/loadingModal";
import { handleApiError } from "../utils/apiErrorHandler";
import { 
  CONTRACT_ORDERER_PREVIEW_ERRORS, 
  CONTRACT_ORDERER_ERRORS, 
  CONTRACT_BENEFICIARY_PREVIEW_ERRORS,
  CONTRACT_BENEFICIARY_PREVIEW_CONTRACT_ERRORS,
  CONTRACT_BENEFICIARY_ERRORS,
  CONTRACT_VIEW_ERRORS,
  CONTRACT_ORDERER_UPLOAD_ERRORS
} from "../constants/contract";

export default function Contract({ roomId, opponentId, opponentRole, contractData, onContractCreated, onContractCompleted }) {
  const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;
  const roleType = UserStore.getState().roleType;
  const currentMemberId = UserStore.getState().memberId;
  const isMember = roleType === "MEMBER";
  const isStudent = roleType === "STUDENT";

  const [selectedType, setSelectedType] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedBrokerage, setSelectedBrokerage] = useState("");
  const [totalContractAmount, setContractAmount] = useState("");
  const [downPaymentPercentage, setAdvancePaymentRatio] = useState("");
  const [inspectionDays, setInspectionPeriod] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [warrantyUnit, setWarrantyUnit] = useState(0);
  const [projectStartDate, setStartDate] = useState("");
  const [projectEndDate, setEndDate] = useState("");
  const [confidentialityPeriod, setMaintenanceDate] = useState("");
  const [projectProgressingDays, setDaysDifference] = useState(0);
  const [copyrightApproved, setCopyrightApproved] = useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
  const [companyPhoneNumber, setPhoneNumber1] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ceoName, setRepresentativeName] = useState("");
  const [roadNameAddress, setAddress] = useState("");
  const [contactEmail, setEmail] = useState("souf@souf.com");
  const [managerName, setManagerName] = useState("");
  const [managerPosition, setManagerPosition] = useState("");
  const [projectName, setProjectName] = useState("");
  const [downPaymentAmount, setDownPaymentAmount] = useState("");
  const [competentCourt, setCompetentCourt] = useState("");
  const [ordererId, setOrdererId] = useState("");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  
  // 수급자 정보 state
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [beneficiaryBirth, setBeneficiaryBirth] = useState("");
  const [beneficiarySchool, setBeneficiarySchool] = useState("");
  const [beneficiaryEmail, setBeneficiaryEmail] = useState("");
  const [beneficiaryPhone, setBeneficiaryPhone] = useState("");
  const [beneficiaryBankAccount, setBeneficiaryBankAccount] = useState("");
  const [beneficiaryAccountHolder, setBeneficiaryAccountHolder] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDescription, setErrorDescription] = useState("");
  const [errorAction, setErrorAction] = useState("redirect");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isOrdererLoading, setIsOrdererLoading] = useState(false);
  const [isBeneficiaryLoading, setIsBeneficiaryLoading] = useState(false);

  const typeOptions = [
    { value: 0, label: "은행" },
    { value: 1, label: "증권" },
  ]
  const bankOptions = [
    { value: 0, label: "한국은행" },
  
    { value: 1, label: "KB국민은행" },
    { value: 2, label: "우리은행" },
    { value: 3, label: "SC제일은행" },
    { value: 4, label: "한국씨티은행" },
    { value: 5, label: "iM뱅크" },
    { value: 6, label: "하나은행" },
    { value: 7, label: "신한은행" },
  
    { value: 8, label: "케이뱅크" },
    { value: 9, label: "카카오뱅크" },
    { value: 10, label: "토스뱅크" },
  
    { value: 11, label: "한국산업은행" },
    { value: 12, label: "중소기업은행" },
    { value: 13, label: "한국수출입은행" },
  
    { value: 14, label: "수협은행" },
    { value: 15, label: "NH농협은행" },
  
    { value: 16, label: "부산은행" },
    { value: 17, label: "경남은행" },
    { value: 18, label: "광주은행" },
    { value: 19, label: "전북은행" },
    { value: 20, label: "제주은행" },
  ];

  const periodUnitOptions = [
    { value: 0, label: "일" },
    { value: 1, label: "개월" },
    { value: 2, label: "년" },
  ];

  const brokerageOptions = [
    { value: 0, label: "교보증권" },
    { value: 1, label: "다올투자증권" },
    { value: 2, label: "대신증권" },
    { value: 3, label: "메리츠증권" },
    { value: 4, label: "미래에셋증권" },
    { value: 5, label: "부국증권" },
    { value: 6, label: "삼성증권" },
    { value: 7, label: "상상인증권" },
    { value: 8, label: "신영증권" },
    { value: 9, label: "신한금융투자증권" },
    { value: 10, label: "아이엠증권" },
    { value: 11, label: "우리투자증권" },
    { value: 12, label: "유안타증권" },
    { value: 13, label: "유진증권" },
    { value: 14, label: "카카오페이증권" },
    { value: 15, label: "케이프증권" },
    { value: 16, label: "키움증권" },
    { value: 17, label: "토스증권" },
    { value: 18, label: "하나증권" },
    { value: 19, label: "한국투자" },
    { value: 20, label: "한화투자증권" },
    { value: 21, label: "현대차증증권" },
    { value: 22, label: "BMK투자증권" },
    { value: 23, label: "DB증권" },
    { value: 24, label: "IBK투자증권" },
    { value: 25, label: "KB증권" },
    { value: 26, label: "LS증권" },
    { value: 27, label: "NH증권" },
    { value: 28, label: "SK증권" },

  ]
  const copyrightOptions = [
    { value: "허용", label: "허용" },
    { value: "불허", label: "불허" },
  ]
  
  const handleTypeSelect = (value) => {
    setSelectedType(value);
  }
  const handleBankSelect = (value) => {
    setSelectedBank(value);
  }
  const handleBrokerageSelect = (value) => {
    setSelectedBrokerage(value);
  }
  const handleCopyrightSelect = (value) => {
    // value는 이미 "허용" 또는 "불허" 문자열
    setCopyrightApproved(value);
  }

  // 숫자 포맷팅 함수 (천 단위 쉼표 추가)
  const formatNumber = (value) => {
    // 숫자가 아닌 문자 제거
    const numericValue = value.replace(/[^0-9]/g, '');
    // 천 단위 쉼표 추가
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (value) => {
    const formatted = formatNumber(value);
    setContractAmount(formatted);
  };

  // 숫자만 입력되도록 필터링하는 함수
  const handleNumberOnlyChange = (setter) => (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setter(value);
  };

  // 시작일과 종료일 차이 계산
  useEffect(() => {
    if (projectStartDate && projectEndDate) {
      const start = new Date(projectStartDate);
      const end = new Date(projectEndDate);
      
      // 종료일이 시작일보다 앞서면 alert 표시하고 날짜 리셋
      if (end < start) {
        alert("종료일은 시작일보다 이후여야 합니다.");
        setStartDate("");
        setEndDate("");
        setDaysDifference(0);
        return;
      }
      
      // 날짜 차이 계산 (밀리초를 일수로 변환, 시작일과 종료일 포함)
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // 시작일과 종료일 모두 포함
      setDaysDifference(diffDays);
    } else {
      setDaysDifference(0);
    }
  }, [projectStartDate, projectEndDate]);

  useEffect(() => {
    const amount = totalContractAmount
      ? parseInt(totalContractAmount.replace(/,/g, ""), 10)
      : 0;
    const ratio = downPaymentPercentage ? parseFloat(downPaymentPercentage) : 0;
    if (amount > 0 && ratio > 0) {
      const calculated = Math.floor((amount * ratio) / 100).toString();
      if (calculated !== downPaymentAmount) {
        setDownPaymentAmount(calculated);
      }
    } else if (downPaymentAmount !== "") {
      setDownPaymentAmount("");
    }
  }, [totalContractAmount, downPaymentPercentage]);

  // ordererId와 beneficiaryId 설정
  useEffect(() => {
    console.log(currentMemberId, opponentId, opponentRole, isMember, isStudent);
    if (currentMemberId && opponentId) {
      if (isMember) {
        // 현재 사용자가 기업(MEMBER)이면 발주자, 상대방이 수급자
        setOrdererId(currentMemberId);
        setBeneficiaryId(opponentId);
      } else if (isStudent && opponentRole === "MEMBER") {
        // 현재 사용자가 학생(STUDENT)이고 상대방이 기업이면, 상대방이 발주자, 현재 사용자가 수급자
        setOrdererId(opponentId);
        setBeneficiaryId(currentMemberId);
      }
    }
  }, [currentMemberId, opponentId, opponentRole, isMember, isStudent]);

  // contractData가 있을 때 발주자 정보 채우기 (읽기 전용)
  useEffect(() => {
    if (contractData) {
      if (contractData.companyName) setCompanyName(contractData.companyName);
      if (contractData.ordererName) {
        setRepresentativeName(contractData.ordererName);
        const managerParts = contractData.managerWithPosition?.split('/') || [];
        if (managerParts.length === 2) {
          setManagerName(managerParts[0]);
          setManagerPosition(managerParts[1]);
        } else if (managerParts.length === 1) {
          setManagerName(managerParts[0]);
        }
      }
      if (contractData.contactPhone) setPhoneNumber1(contractData.contactPhone);
      if (contractData.contactEmail) setEmail(contractData.contactEmail);
      if (contractData.projectName) setProjectName(contractData.projectName);
      if (contractData.projectStartDate) setStartDate(contractData.projectStartDate);
      if (contractData.projectEndDate) setEndDate(contractData.projectEndDate);
      if (contractData.totalContractAmount) {
        setContractAmount(contractData.totalContractAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }
      if (contractData.downPaymentPercentage) setAdvancePaymentRatio(contractData.downPaymentPercentage.toString());
      if (contractData.downPaymentAmount) setDownPaymentAmount(contractData.downPaymentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      if (contractData.inspectionDays) setInspectionPeriod(contractData.inspectionDays.toString());
      if (contractData.copyrightApproved !== undefined) {
        setCopyrightApproved(contractData.copyrightApproved ? "허용" : "불허");
      }
      if (contractData.confidentialityPeriod) setMaintenanceDate(contractData.confidentialityPeriod);
      if (contractData.warrantyPeriod) setWarrantyPeriod(contractData.warrantyPeriod);
      if (contractData.competentCourt) setCompetentCourt(contractData.competentCourt);
    }
  }, [contractData]);


  const handleGetOrdererInfo = async (roomId) => {
    try {
      const response = await getOrdererInfo(roomId);
      console.log(response);
      
      if (response && response.code === 200 && response.result) {
        const data = response.result;
        
        if (data.companyName) setCompanyName(data.companyName);
        if (data.ordererName) {
          setRepresentativeName(data.ordererName);
          setManagerName(data.ordererName);
        }
        if (data.businessRegistrationNumber) setBusinessRegistrationNumber(data.businessRegistrationNumber);
        if (data.roadAddress) setAddress(data.roadAddress);
        if (data.contactPhone) setPhoneNumber1(data.contactPhone);
        if (data.contactEmail) setEmail(data.contactEmail);

      }
    } catch (error) {
      console.error("발주자 정보 불러오기 실패:", error);
      handleApiError(error, {
        setShowLoginModal,
        setErrorModal: setShowErrorModal,
        setErrorDescription,
        setErrorAction,
      }, CONTRACT_ORDERER_PREVIEW_ERRORS);
    }
  }

  const handleGetBeneficiaryInfo = async (roomId) => {
    try {
      // contractData에서 inviteToken 가져오기 (contractUuid가 inviteToken일 수 있음)
      // const inviteToken = contractData?.contractUuid || "";
      const inviteToken = "znd2OoS93HapSLQguUReIP6XxnQP_X1Rmjjh8ZF9_ZE4vGhilKeafJIQlGj1zBS7";
      const response = await getBeneficiaryInfo(roomId, inviteToken);
      console.log("수급자 정보 응답:", response);
      
      if (response && response.code === 200 && response.result) {
        const data = response.result;
        
        if (data.beneficiaryName) setBeneficiaryName(data.beneficiaryName);
        if (data.schoolName) setBeneficiarySchool(data.schoolName);
        if (data.email) setBeneficiaryEmail(data.email);
        if (data.phoneNumber) setBeneficiaryPhone(data.phoneNumber);
      }
    } catch (error) {
      console.error("수급자 정보 불러오기 실패:", error);
      handleApiError(error, {
        setShowLoginModal,
        setErrorModal: setShowErrorModal,
        setErrorDescription,
        setErrorAction,
      }, CONTRACT_BENEFICIARY_PREVIEW_ERRORS);
    }
  }

  const handlePostContractOrderer = async () => {
    const managerWithPosition =
      managerName && managerPosition
        ? `${managerName}/${managerPosition}`
        : managerName || managerPosition || "";


          // 필수 입력 항목 체크
          const missingFields = [];
          if (!projectName) missingFields.push("수행 작업명");
          if (!projectStartDate) missingFields.push("시작일");
          if (!projectEndDate) missingFields.push("종료일");
          if (!totalContractAmount) missingFields.push("총 계약 금액");
          if (!downPaymentPercentage) missingFields.push("선금 지급 비율");
          if (!downPaymentAmount) missingFields.push("선금 지급 금액");
          if (!inspectionDays) missingFields.push("검수 기한");
          if (!copyrightApproved) missingFields.push("저작권 허용/불허");
          if (!confidentialityPeriod) missingFields.push("비밀 유지 기간");
          if (!warrantyPeriod) missingFields.push("보증 기간");
          if (!competentCourt) missingFields.push("관할 법원");
          
          if (missingFields.length > 0) {
            alert(`다음 항목을 입력해주세요:\n${missingFields.join(", ")}`);
            return;
          }
    const payload = {
      ordererPersonalInfoReqDto: {
        companyName,
        ceoName,
        businessRegistrationNumber,
        roadNameAddress,
        companyPhoneNumber,
        contactEmail,
        managerWithPosition,
      },
      projectName,
      projectStartDate,
      projectEndDate,
      projectProgressingDays: projectProgressingDays ? parseInt(projectProgressingDays) : 0,
      totalContractAmount: totalContractAmount ? parseInt(totalContractAmount.replace(/,/g, "")) : 0,
      downPaymentPercentage: downPaymentPercentage ? parseInt(downPaymentPercentage) : 0,
      downPaymentAmount: downPaymentAmount ? parseInt(downPaymentAmount) : 0,
      inspectionDays: inspectionDays ? parseInt(inspectionDays) : 0,
      copyrightApproved: copyrightApproved === "허용" ? true : copyrightApproved === "불허" ? false : null,
      confidentialityPeriod,
      warrantyPeriod,
      competentCourt,
     
    };
    console.log(payload);
    setIsOrdererLoading(true);
    try {
      const response = await postContractOrderer(roomId, payload);
      // console.log(response);
      alert("계약서가 생성되었습니다.");
      
      if (onContractCreated) {
        onContractCreated();
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("계약서 작성하기 실패:", error);
      
      // 400 에러인 경우 서버에서 보낸 메시지를 그대로 표시
      if (error?.response?.status === 400 || error?.response?.data?.code === 400) {
        const errorMessage = error?.response?.data?.message || "요청이 올바르지 않습니다.";
        setErrorDescription(errorMessage);
        setErrorAction("reload");
        setShowErrorModal(true);
      } else {
        handleApiError(error, {
          setShowLoginModal,
          setErrorModal: setShowErrorModal,
          setErrorDescription,
          setErrorAction,
        }, CONTRACT_ORDERER_ERRORS);
      }
    } finally {
      setIsOrdererLoading(false);
    }
  };

  const handlePostContractBeneficiary = async () => {
    // 필수 입력 항목 체크
    const missingFields = [];
    if (!beneficiaryName) missingFields.push("이름");
    if (!beneficiaryBirth) missingFields.push("생년월일");
    if (!beneficiarySchool) missingFields.push("소속 학교");
    if (!beneficiaryEmail) missingFields.push("이메일");
    if (!beneficiaryPhone) missingFields.push("전화번호");
    if (!selectedType && selectedType !== 0) missingFields.push("은행/증권명");
    if (selectedType === 0 && !selectedBank && selectedBank !== 0) missingFields.push("은행명");
    if (selectedType === 1 && !selectedBrokerage && selectedBrokerage !== 0) missingFields.push("증권명");
    if (!beneficiaryBankAccount) missingFields.push("계좌번호");
    if (!beneficiaryAccountHolder) missingFields.push("예금주");
    
    if (missingFields.length > 0) {
      alert(`다음 항목을 입력해주세요:\n${missingFields.join(", ")}`);
      return;
    }

    //이메일 형식 검증
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(beneficiaryEmail)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    //전화번호 형식 검증
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(beneficiaryPhone)) {
      alert("전화번호 형식이 올바르지 않습니다.");
      return;
    }

    // 계좌번호 형식 검증
    const accountRegex = /^\d+$/;
    if (!accountRegex.test(beneficiaryBankAccount)) {
      alert("계좌번호는 숫자만 입력 가능합니다.");
      return;
    }

    // 생년월일 YYYY-MM-DD 형식 검증
    const birthRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthRegex.test(beneficiaryBirth)) {
      alert("생년월일은 YYYY-MM-DD 형식으로 입력해주세요.");
      return;
    }

    // 유효한 날짜인지 검증
    const birthDate = new Date(beneficiaryBirth);
    const [year, month, day] = beneficiaryBirth.split('-').map(Number);
    
    if (birthDate.getFullYear() !== year || 
        birthDate.getMonth() + 1 !== month || 
        birthDate.getDate() !== day) {
      alert("올바른 날짜를 입력해주세요.");
      return;
    }

    // 2025년 이하 출생인지 검증
    if (year > 2025) {
      alert("생년월일 년도를 올바르게 입력해주세요.");
      return;
    }

    // 1900년 이상 출생인지 검증
    if (year < 1900) {
      alert("생년월일 년도를 올바르게 입력해주세요.");
      return;
    }

    // 은행/증권 정보 구성
    let bankInfo = "";
    if (selectedType === 0) {
      const bankOption = bankOptions.find(opt => opt.value === selectedBank);
      bankInfo = bankOption ? bankOption.label : "";
    } else if (selectedType === 1) {
      const brokerageOption = brokerageOptions.find(opt => opt.value === selectedBrokerage);
      bankInfo = brokerageOption ? brokerageOption.label : "";
    }

    const payload = {
        inviteToken: "oO45FZGPaSjJCijR0jT35doKEzwY40uuz9NiW5ER_9u4ywFDfKmAgsEmF2xNRM_H" || "",
        username: beneficiaryName,
        birth: beneficiaryBirth, 
        schoolName: beneficiarySchool, 
        email: beneficiaryEmail,
        phoneNumber: beneficiaryPhone,
        bank: bankInfo, 
        bankAccount: beneficiaryBankAccount,
    };
    console.log(payload);
    setIsBeneficiaryLoading(true);
    try {
      const response = await postContractBeneficiary(roomId, payload);
      console.log(response);

      if (response && response.code === 200) {
        alert("계약서가 완성되었습니다.");
        
        // 계약서 완성 성공 시 채팅 메시지 전송
        // contractId와 pdfUrl을 포함하여 전송
        const result = response.result || {};
        const contractId = result.contractId || "";
        const pdfUrl = result.pdfUrl || "";
        
        // contractId와 pdfUrl을 구분 가능한 형식으로 전달
        const contractData = `contractId:${contractId}\npdfUrl:${pdfUrl}`;
        
        if (onContractCompleted) {
          onContractCompleted(contractData);
        }
        
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        alert("계약서가 완성되었습니다.");
        window.location.reload();
      }
    } catch (error) {
      console.error("계약서 작성하기 실패:", error);
      handleApiError(error, {
        setShowLoginModal,
        setErrorModal: setShowErrorModal,
        setErrorDescription,
        setErrorAction,
      }, CONTRACT_BENEFICIARY_ERRORS);
    } finally {
      setIsBeneficiaryLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center max-w-[30rem] lg:max-w-[60rem] mx-auto">
      <h1 className="text-3xl font-bold mt-12">스프(SouF) 외주 거래 계약서</h1>

      <div className="flex flex-col gap-8 mt-10 mb-12">
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold mt-6">1. 계약 당사자</h3>
            {isMember && !contractData && (
              <button className="bg-blue-main text-white px-4 py-2 rounded-md"
               onClick={() => handleGetOrdererInfo(roomId)}>내 정보 불러오기</button>
            )}
            {isStudent && contractData && (
              <button className="bg-blue-main text-white px-4 py-2 rounded-md"
               onClick={() => handleGetBeneficiaryInfo(roomId)}>내 정보 불러오기</button>
            )}
          </div>
           
              <>
                <p className="text-xl font-semibold">발주자</p>
                <ContractInput title="회사명" value={companyName} onChange={(value) => setCompanyName(value)} readOnly={!!contractData} />
                <ContractInput title="대표자" placeholder="대표자명을 입력하세요" value={ceoName} onChange={(value) => setRepresentativeName(value)} readOnly={!!contractData} />
                <ContractInput title="사업자 등록 번호" placeholder="000-00-00000" businessNumber={true} value={businessRegistrationNumber} onChange={(value) => setBusinessRegistrationNumber(value)} readOnly={!!contractData} />
                <ContractInput title="주소" placeholder="주소를 입력하세요" value={roadNameAddress} onChange={(value) => setAddress(value)} readOnly={!!contractData} />
                <ContractInput title="전화번호" placeholder="010-0000-0000" phoneNumber={true} value={companyPhoneNumber} onChange={(value) => setPhoneNumber1(value)} readOnly={!!contractData} />
                <ContractInput title="이메일" placeholder="souf@souf.com" value={contactEmail} onChange={(value) => setEmail(value)} readOnly={!!contractData} />
                <div className="flex gap-2">
                  <ContractInput title="담당자 성명" placeholder="담당자 성명을 입력하세요" value={managerName} onChange={(value) => setManagerName(value)} readOnly={!!contractData} />
                  <ContractInput title="담당자 직책" placeholder="직책을 입력해주세요" value={managerPosition} onChange={(value) => setManagerPosition(value)} readOnly={!!contractData} />
                </div>
              </>
           

            {/* 수급자 - 학생 계정일 때만 표시 */}
            {isStudent && (
              <>
                <p className="text-xl font-semibold mt-8">수급자</p>
                <ContractInput title="이름" placeholder="이름을 입력하세요" value={beneficiaryName} required={true} onChange={(value) => setBeneficiaryName(value)} />
                <ContractInput title="생년월일" placeholder="YYYY-MM-DD" value={beneficiaryBirth} required={true} onChange={(value) => setBeneficiaryBirth(value)} birthDate={true} />
                <ContractInput title="소속 학교" placeholder="스프대학교 / 전공(선택)" value={beneficiarySchool} required={true} onChange={(value) => setBeneficiarySchool(value)} />
                <ContractInput title="이메일" placeholder="souf@souf.com" value={beneficiaryEmail} required={true} onChange={(value) => setBeneficiaryEmail(value)} email={true} />
                <ContractInput title="전화번호" placeholder="010-0000-0000" phoneNumber={true} value={beneficiaryPhone} required={true} onChange={(value) => setBeneficiaryPhone(value)} />
                <div>
                  <div className="flex items-center gap-1">
                  <label className="text-lg font-medium z-10">은행/증권명</label>
                  <span className="text-red-500">*</span>
                  </div>
                 
                  <div className="flex gap-2">
                    <FilterDropdown options={typeOptions} placeholder="은행/증권명을 선택하세요" selectedValue={selectedType} onSelect={handleTypeSelect} zIndex="z-10"/>
                    {selectedType === 0 && <FilterDropdown options={bankOptions} placeholder="은행명을 선택하세요" selectedValue={selectedBank} onSelect={handleBankSelect} width="w-48" zIndex="z-10"/>}
                    {selectedType === 1 && <FilterDropdown options={brokerageOptions} placeholder="증권명을 선택하세요" selectedValue={selectedBrokerage} onSelect={handleBrokerageSelect} width="w-48" zIndex="z-10"/>}
                  </div>
                </div>
                <ContractInput title="계좌번호" placeholder="계좌번호를 입력하세요" value={beneficiaryBankAccount} required={true} onChange={(value) => setBeneficiaryBankAccount(value)} />
                <ContractInput title="예금주" placeholder="예금주를 입력하세요" value={beneficiaryAccountHolder} required={true} onChange={(value) => setBeneficiaryAccountHolder(value)} />
              </>
            )}

<span className="w-full h-[2px] bg-gray-300 mt-8"></span>

            <h3 className="text-2xl font-bold mt-6">2. 계약 목적 및 작업 범위</h3>
            <ContractInput title="수행 작업명" placeholder="iOS/Android 앱 프로토타입 제작 및 백엔드 연동" required={true} value={projectName} onChange={(value) => setProjectName(value)} readOnly={!!contractData} />


            <h3 className="text-2xl font-bold mt-6">3. 기간 및 일정</h3>
            <div className="flex gap-6 w-full">
            <ContractInput title="시작일" placeholder="2025.01.01" icon={calendarIcon} width="w-64" datePicker={true} required={true} value={projectStartDate} onChange={(value) => setStartDate(value)} readOnly={!!contractData} />
            <ContractInput title="종료일" placeholder="2025.01.01" icon={calendarIcon} width="w-64" datePicker={true} required={true} value={projectEndDate} onChange={(value) => setEndDate(value)} readOnly={!!contractData} />
            </div>
            <div className="flex flex-col gap-2">
            <label className="text-lg font-medium">일수</label>
            <p>{projectProgressingDays > 0 ? `${projectProgressingDays}일` : "-"}</p>
            </div>


            <h3 className="text-2xl font-bold mt-6">4. 대금</h3>
            <ContractInput title="총 계약 금액" placeholder="계약 금액을 입력하세요" unit="원" type="text" width="w-1/2" required={true} value={totalContractAmount} onChange={handleAmountChange} readOnly={!!contractData} />
            <ContractInput title="선금 지급 비율" placeholder="선금 지급 비율을 입력하세요" unit="%" type="text" width="w-1/2" required={true} value={downPaymentPercentage} onChange={(value) => setAdvancePaymentRatio(value)} numbersOnly={true} readOnly={!!contractData}/>
            <div className="flex flex-col gap-2">
            <label className="text-lg font-medium">선금 지급 금액</label>
            <p>
              {downPaymentAmount
                ? `${Number(downPaymentAmount).toLocaleString()}원`
                : "-"}
            </p>
            </div>

            <h3 className="text-2xl font-bold mt-6">5. 검수</h3>
            <ContractInput title="검수 기한" placeholder="검수 기한을 입력하세요" unit="일" type="text" width="w-1/2" required={true} value={inspectionDays} onChange={(value) => setInspectionPeriod(value)} numbersOnly={true} readOnly={!!contractData}/>
           

            <span className="w-full h-[2px] bg-gray-300 mt-8"></span>


            <h3 className="text-2xl font-bold mt-6">6. 저작권·지식재산권</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <label className="text-lg font-medium">허용/불허</label>
                <span className="text-red-500">*</span>
              </div>
            <FilterDropdown options={copyrightOptions} placeholder="허용/불허를 선택하세요" selectedValue={copyrightApproved} onSelect={handleCopyrightSelect} width="w-1/2" disabled={!!contractData} />


            <h3 className="text-2xl font-bold mt-6">7. 비밀 유지</h3>
                <ContractInput title="유지 기간" placeholder="유지 기간을 입력하세요" icon={calendarIcon} width="w-1/2" datePicker={true} required={true} value={confidentialityPeriod} onChange={(value) => setMaintenanceDate(value)} readOnly={!!contractData} />


            <h3 className="text-2xl font-bold mt-6">8. 보증·유지보수</h3>
            <div>
              <div  className="flex items-center gap-1">
                <label className="text-lg font-medium">보증 기간</label>
                <span className="text-red-500">*</span>
              </div>
                <div className="flex items-center gap-1">
                    <input type="text" placeholder="보증 기간을 입력하세요" 
                    className={`p-2 border border-gray-300 rounded-md ${contractData ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    value={warrantyPeriod}
                    onChange={handleNumberOnlyChange(setWarrantyPeriod)}
                    readOnly={!!contractData} />
                    <FilterDropdown 
                      options={periodUnitOptions} 
                      selectedValue={warrantyUnit} 
                      onSelect={setWarrantyUnit}
                      width="w-24"
                      disabled={!!contractData}
                    />
                </div>
            </div>
            </div>


            <h3 className="text-2xl font-bold mt-6">9. 분쟁 해결·증빙·관할</h3>
            <ContractInput title="관할 법원" placeholder="서울중앙지방법원" required={true} value={competentCourt} onChange={(value) => setCompetentCourt(value)} readOnly={!!contractData} />
        </div>

        {/* 에러 모달 */}
        {showErrorModal && (
          <AlertModal
            type="simple"
            title="계약서 작성 오류"
            description={errorDescription}
            TrueBtnText="확인"
            onClickTrue={() => {
              setShowErrorModal(false);
              if (errorAction === "redirect") {
                window.location.href = "/chat";
              } else if (errorAction === "reload") {
                window.location.reload();
              }
            }}
          />
        )}

        {/* 로그인 모달 */}
        {showLoginModal && (
          <AlertModal
            type="simple"
            title="로그인이 필요합니다"
            description="계약서 작성을 위해 로그인이 필요합니다."
            TrueBtnText="로그인하러 가기"
            FalseBtnText="취소"
            onClickTrue={() => {
              setShowLoginModal(false);
              window.location.href = "/login";
            }}
            onClickFalse={() => setShowLoginModal(false)}
          />
        )}

        {/* 로딩 모달 */}
        {(isOrdererLoading || isBeneficiaryLoading) && (
          <LoadingModal text="처리 중입니다..." />
        )}
        
        {isMember && !contractData && (
          <button 
            className="px-4 py-2 rounded-md bg-blue-main text-white"
            onClick={handlePostContractOrderer}
            disabled={isOrdererLoading}
          >
            계약서 작성하기
          </button>
        )}
        {isStudent && contractData && (
          <button 
            className="px-4 py-2 rounded-md bg-blue-main text-white"
            onClick={handlePostContractBeneficiary}
            disabled={isBeneficiaryLoading}
          >
            계약서 완성하기
          </button>
        )}

        
      </div>
    </div>
  );
}