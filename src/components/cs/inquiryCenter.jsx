import { useState } from "react";
import FilterDropdown from "../FilterDropdown";
import SEO from "../seo";
import { postInquiry, uploadInquiryFile } from "../../api/inquiry";

export default function InquiryCenter({ onInquiryComplete }) {
    const [selectedValue, setSelectedValue] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        files: []
    });
    const options = [
        {
            value: "1",
            label: "피드"
        },
        {
            value: "2",
            label: "외주"
        },
        {
            value: "3",
            label: "후기"
        },
        {
            value: "4",
            label: "채팅"
        },
        {
            value: "5",
            label: "계정/인증"
        },
        {
            value: "6",
            label: "기타"
        }
    ]
    const handleSelect = (value) => {
        setSelectedValue(value);
    };
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === 'file') {
            if (name === 'inquiryFiles') {
                const newFiles = Array.from(files);
                if (formData.files.length + newFiles.length > 3) {
                    alert('최대 3개의 파일만 업로드할 수 있습니다.');
                    return;
                }
                setFormData(prev => ({
                    ...prev,
                    files: [...prev.files, ...newFiles]
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const removeFile = (index) => {
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.content) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }
        if (!selectedValue) {
            alert("문의 유형을 선택해주세요.");
            return;
        }
        
        // 내용 길이 검증
        if (formData.content.length < 20) {
            alert("내용은 최소 20자 이상 입력해주세요.");
            return;
        }
        if (formData.content.length > 1000) {
            alert("내용은 최대 1000자까지 입력 가능합니다.");
            return;
        }
        
        try {
            // 1. 문의 등록 API
            const inquiryData = {
                title: formData.title,
                content: formData.content,
                type: selectedValue === "1" ? "RELATED_FEED" : 
                      selectedValue === "2" ? "RELATED_RECRUIT" :
                      selectedValue === "3" ? "RELATED_REVIEW" :
                      selectedValue === "4" ? "RELATED_CHAT" :
                      selectedValue === "5" ? "RELATED_AUTHENTICATION" :
                      selectedValue === "6" ? "ETC" : "",
                originalFileNames: formData.files.map((file) => file.name)
            };
            
            const inquiryResponse = await postInquiry(inquiryData);
            
            // 2. 이미지 파일 존재 - presignedUrl 업로드
            if (formData.files.length > 0 && inquiryResponse.data?.result?.dtoList) {
                const dtoList = inquiryResponse.data.result.dtoList;
                
                for (let i = 0; i < formData.files.length && i < dtoList.length; i++) {
                    const file = formData.files[i];
                    const dto = dtoList[i];
                    
                    try {
                        const uploadData = {
                            postId: inquiryResponse.data.result.inquiryId,
                            fileUrl: dto.fileUrl,
                            fileName: file.name,
                            fileType: file.type.split('/')[1]
                        };

                        const uploadResponse = await uploadInquiryFile(uploadData);
                    } catch (error) {
                        console.error(`이미지 ${i + 1} 업로드 에러:`, error);
                    }
                }
            }
            
            // 폼 초기화
            setFormData({
                title: "",
                content: "",
                files: []
            });
            setSelectedValue("");
            
            // 완료 콜백 호출
            if (onInquiryComplete) {
                onInquiryComplete();
            }
            
        } catch (error) {
            console.error("문의 등록 에러:", error);
            alert("문의 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="w-full max-w-[60rem] mx-auto flex flex-col gap-8">
            <SEO title="문의 센터" description={`스프 SouF - 문의 센터`} subTitle='스프' />
            <FilterDropdown
            options={options}
            placeholder="문의 유형"
            selectedValue={selectedValue}
            onSelect={handleSelect}
            />

            <div className="flex flex-col gap-4">
                <p className="text-lg font-semibold">문의 제목</p>
                <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md border border-gray-300" 
                />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">내용</p>
                    <p className={`text-sm ${formData.content.length > 1000 ? 'text-red-500' : 'text-gray-500'}`}>
                        {formData.content.length}/1000
                    </p>
                </div>
                <textarea 
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    maxLength={1000}
                    className="w-full p-2 rounded-md border border-gray-300 min-h-32"
                    placeholder="최소 20자, 최대 1000자 이내" 
                />
                {formData.content.length > 0 && formData.content.length < 20 && (
                    <p className="text-red-500 text-sm">최소 20글자 이상 입력해주세요.</p>
                )}
            </div>
            <div className="flex flex-col gap-4">
                <p className="text-lg font-semibold">이미지 첨부 (최대 3개)</p>
                <div className="flex gap-4">
                    {formData.files.length < 3 && (
                        <div className="relative">
                            <input
                                type="file"
                                name="inquiryFiles"
                                accept="image/*"
                                onChange={handleChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                id="file-upload"
                                multiple
                            />
                            <label
                                htmlFor="file-upload"
                                className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
                            >
                                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span className="text-sm text-gray-500">사진 업로드</span>
                            </label>
                        </div>
                    )}
                    
                    {formData.files.map((file, index) => (
                        <div key={index} className="relative">
                            <img 
                                src={URL.createObjectURL(file)} 
                                alt={`파일 ${index + 1}`} 
                                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <button 
                onClick={handleSubmit}
                className="w-36 py-4 rounded-md bg-blue-500 text-white font-semibold mx-auto hover:bg-blue-600 transition-colors duration-200"
            >
                문의 등록하기
            </button>
        </div>
    );
}