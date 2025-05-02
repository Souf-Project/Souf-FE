import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect} from 'react';
import ButtonInput from '../components/buttonInput';
import Input from '../components/input';
import VerrifyImg from '../assets/images/verifyImg.svg'; 


export default function VerifyStudent() {
    const navigate = useNavigate();

    const handleCheckClick = () => {
        navigate("/");
    };

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
        <div className="w-screen h-screen flex">
            <div className="w-1/2 bg-[#FFE681] flex flex-col justify-center px-16 ">
            <div className='my-auto'>
            <h1 className="text-6xl font-bold mb-6 mt-20">대학생 인증이란?</h1>
                <p className="text-xl font-regular leading-relaxed text-gray-800 mb-10">
                SouF는 대학생 인증 과정을 거칠 시<br />
                포트폴리오를 올리고, 기업에게서 제안을 받아보실 수 있습니다.<br /><br />
                대학생 인증 시 공고문은 올릴 수 없습니다.
                </p>
                <div className="mt-20">
                    <img src={VerrifyImg} className='ml-auto'/>
                </div>
            </div>
                
            </div>

            <div className="w-1/2 bg-white flex flex-col justify-center items-center px-36">
                <h2 className="text-6xl font-bold mb-10 mr-auto">대학생 인증하기</h2>
                <div className="w-full space-y-6 bg-white p-8 border rounded-xl shadow">
                    <ButtonInput 
                    title="학교 이메일"
                    btnText="인증요청"
                    // isValidateTrigger={isValidateTrigger}
                    // isConfirmed={isConfirmed}
                    placeholder="Souf@souf.ac.kr"
                    // onChange={onChange}
                    essentialText="이메일을 입력해주세요"
                    disapproveText="이메일을 입력해주세요"
                    // onValidChange={onValidChange}
                    />
                     <ButtonInput
title={"인증번호 확인"}
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
                    
                    <div className='flex justify-center'>
                    <button onClick={() => handleCheckClick()} className='bg-yellow-main mx-auto w-36 h-12 rounded-xl text-2xl font-bold'>인증하기</button>

                    </div>
                </div>
            </div>
        </div>
    );
}
