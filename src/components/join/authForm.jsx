import { useState } from "react";
import Input from "../input";
import Button from "../button";
import FilterDropdown from "../filterDropdown";

export default function AuthForm() {
    const [formData, setFormData] = useState({
        companyName: "",
        businessNumber: "",
        postalCode: "",
        address: "",
        detailAddress: "",
        industry: "",
        businessType: "",
    });
    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };
    const industryOptions = [
        { value: "1", label: "IT" },
        { value: "2", label: "미디어" },
        { value: "3", label: "광고" },
        { value: "4", label: "마케팅" },
        { value: "5", label: "디자인" },
        { value: "6", label: "소프트웨어" },
    ];
    const businessTypeOptions = [
        { value: "1", label: "법인" },
        { value: "2", label: "개인" },
    ];
    return (
        <div className="w-full">
            <Input
                title="회사명"
                type="text"
                name="companyName"
                essentialText="회사명을 입력해주세요."
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e)}
            />
            <Input 
                title="사업자 번호"
                type="text"
                name="businessNumber"
                essentialText="사업자 번호를 입력해주세요."
                value={formData.businessNumber}
                onChange={(e) => handleInputChange("businessNumber", e)}
            />
           <div>
            <p className="text-black text-lg md:text-xl font-regular mb-2">회사 주소</p>
            <Input
                placeholder="우편번호"
                type="text"
                name="postalCode"
                essentialText="우편번호를 입력해주세요."
                value={formData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e)}
                width="w-1/3"
            />
            <Input
                placeholder="주소"
                type="text"
                name="address"
                essentialText="주소를 입력해주세요."
                value={formData.address}
                onChange={(e) => handleInputChange("address", e)}
            />
            <Input
                placeholder="상세주소"
                type="text"
                name="detailAddress"
                essentialText="상세주소를 입력해주세요."
                value={formData.detailAddress}
                onChange={(e) => handleInputChange("detailAddress", e)}
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
            />
           </div>
           <div>
            <div className="flex items-center gap-2 mb-2">
            <p className="text-black text-lg md:text-xl font-regular">사업자 등록증</p>
            <p className="text-gray-500 text-sm md:text-base font-regular">PDF 형식으로 업로드해주세요.</p>
            </div>
           
           <button className="w-1/3 bg-white border border-gray-300 rounded-lg p-2 h-64 flex flex-col items-center justify-center gap-8">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
           </svg>
            <p className="text-gray-500 text-lg md:text-xl font-regular">업로드하기</p>
           </button>
           </div>
        </div>
    )
}