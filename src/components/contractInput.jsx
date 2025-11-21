import { useState, useEffect, useRef } from "react";

export default function ContractInput({ title, placeholder, value, required = false, icon, width = "w-full", type = "text", unit = "", onChange, numbersOnly = false, datePicker = false, phoneNumber = false, businessNumber = false, readOnly = false, birthDate = false, email = false }) {
    const [inputValue, setInputValue] = useState(value || "");
    const inputRef = useRef(null);
    
    // props의 value가 변경되면 내부 state도 업데이트
    useEffect(() => {
        if (value !== undefined) {
            setInputValue(value);
        }
    }, [value]);
    
    const displayValue = value !== undefined ? value : inputValue;

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        return dateString.replace(/-/g, '.');
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        return dateString.replace(/\./g, '-');
    };

    // 전화번호 포맷팅 함수 (010-0000-0000)
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

    // 사업자 등록 번호 포맷팅 함수 (000-00-00000)
    const formatBusinessNumber = (value) => {
        const numbers = value.replace(/[^0-9]/g, '').slice(0, 10);
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

    // 생년월일 포맷팅 함수 (YYYY-MM-DD)
    const formatBirthDate = (value) => {
        const numbers = value.replace(/[^0-9]/g, '').slice(0, 8);
        if (numbers.length === 0) {
            return '';
        } else if (numbers.length <= 4) {
            return numbers;
        } else if (numbers.length <= 6) {
            return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
        } else {
            return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6)}`;
        }
    };

    // 이메일 검증 함수
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (e) => {
        let newValue = e.target.value;
        
        // datePicker인 경우 날짜 형식 변환
        if (datePicker) {
            newValue = newValue;
        } else if (phoneNumber) {
            // 전화번호 포맷팅
            newValue = formatPhoneNumber(newValue);
        } else if (businessNumber) {
            // 사업자 등록 번호 포맷팅
            newValue = formatBusinessNumber(newValue);
        } else if (birthDate) {
            // 생년월일 포맷팅
            newValue = formatBirthDate(newValue);
        } else if (email) {
            // 이메일은 그대로 유지 (검증은 blur 시)
            newValue = newValue;
        } else if (numbersOnly) {
            // numbersOnly가 true이면 숫자만 허용
            newValue = newValue.replace(/[^0-9]/g, '');
        }
        
        setInputValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const handleBlur = (e) => {
        if (email && e.target.value) {
            if (!validateEmail(e.target.value)) {
                // 이메일 형식이 올바르지 않으면 경고 (선택사항)
                // 여기서는 onChange를 통해 부모 컴포넌트에서 처리하도록 함
            }
        }
    };

    const handleKeyDown = (e) => {
        if (phoneNumber) {
            const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
            const currentValue = displayValue || "";
            const numbers = currentValue.replace(/[^0-9]/g, '');
            // 11자리 도달 시 숫자 입력 차단
            if (numbers.length >= 11 && /^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                e.preventDefault();
                return;
            }
            // 숫자와 허용된 키만 입력 가능
            if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
        } else if (businessNumber) {
            const numbers = displayValue.replace(/[^0-9]/g, '');
            // 10자리 도달 시 숫자 입력 차단
            if (numbers.length >= 10 && e.key.match(/[0-9]/)) {
                e.preventDefault();
            }
        } else if (birthDate) {
            const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "-"];
            const currentValue = displayValue || "";
            const numbers = currentValue.replace(/[^0-9]/g, '');
            // 8자리 도달 시 숫자 입력 차단
            if (numbers.length >= 8 && /^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                e.preventDefault();
                return;
            }
            // 숫자와 허용된 키만 입력 가능
            if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
        }
    };

    const handlePaste = (e) => {
        if (phoneNumber || businessNumber || birthDate) {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text");
            let formatted;
            if (phoneNumber) {
                formatted = formatPhoneNumber(pasted);
            } else if (businessNumber) {
                formatted = formatBusinessNumber(pasted);
            } else if (birthDate) {
                formatted = formatBirthDate(pasted);
            }
            setInputValue(formatted);
            if (onChange) {
                onChange(formatted);
            }
        }
    };

    const inputType = datePicker ? 'date' : type;
    const formattedInputValue = datePicker && displayValue ? formatDateForInput(displayValue) : displayValue;

    return (
        <div>
        <div className="flex items-center gap-1">
        <label className="text-lg font-medium">{title}</label>
        {required && <span className="text-red-500">*</span>}
        </div>
          
            <div className="flex items-center gap-1">
            <input
                ref={inputRef}
                type={inputType}
                className={`${width} p-2 border border-gray-300 rounded-md ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder={datePicker ? undefined : placeholder}
                value={formattedInputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onBlur={handleBlur}
                maxLength={phoneNumber ? 13 : businessNumber ? 12 : birthDate ? 10 : undefined}
                readOnly={readOnly}
            />
            {icon && <img src={icon} alt="icon" className="w-6 h-6 cursor-pointer" onClick={() => {
                if (datePicker && inputRef.current) {
                    inputRef.current.showPicker?.();
                }
            }} />}
            {unit && <span className="text-lg font-medium">{unit}</span>}
            </div>
           
        </div>
    );
}