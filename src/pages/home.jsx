import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/input';
import ButtonInput from '../components/buttonInput';
export default function Home({  }) {

    const navigate = useNavigate();
    
    const handleLoginClick = () => {
        navigate("/login");
    }
    
    const [code, setCode] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(undefined);
    const [isValidateTrigger, setIsValidateTrigger] = useState(false);

    const handleInputChange = (e) => {
        setCode(e.target.value);
        setIsConfirmed(undefined); // 입력값 바뀌면 인증 초기화
    };

    const handleValidation = () => {
        // 인증 번호 예시
        const isCorrect = code.trim() === '1234';
        setIsConfirmed(isCorrect);
        setIsValidateTrigger(true);
    };

    return (
<div>
    홈 화면
    {/* 일단 홈 화면 대신 하위 페이지부터 작업 */}
    {/* 작업에 용이하도록 페이지 이동 버튼만 둠 */}
    <ul>
        <li>
        <button onClick={handleLoginClick}>로그인</button>
{/* <Input 

placeholder="이메일을 입력해주세요"
onChange={handleInputChange}
isValidateTrigger={isValidateTrigger}
isConfirmed={isConfirmed}
essentialText="이메일을 입력해주세요"/>  */}

<ButtonInput
title="인증번호 확인"
                btnText="인증하기"
                onClick={handleValidation}
                placeholder="인증 코드를 입력하세요"
                onChange={handleInputChange}
                isValidateTrigger={isValidateTrigger}
                isConfirmed={isConfirmed}
                essentialText="인증번호를 입력해주세요"
                approveText="인증이 완료되었습니다"
                disapproveText="인증번호가 올바르지 않습니다"
            />
        </li>
    </ul>
</div>
    );
}
