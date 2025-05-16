import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Input from '../components/input';
import ButtonInput from '../components/buttonInput';
import Button from '../components/button';
import Step1 from '../components/join/step1';
import Step2 from '../components/join/step2';

export default function PwdFind({  }) {
const navigate = useNavigate();
const [step,setStep] = useState(2);


    return (
        <div className='flex items-center justify-center my-20 '>
            <div className='w-[1000px]'>
                <div className='font-semibold text-[60px] mt-12 mb-6'>비밀번호 재설정</div>
                <div className='w-full rounded-[30px] border-[1px] py-20 px-52 flex flex-col items-center justify-center'>
                    <ButtonInput title="이메일" btnText="인증요청"/>
                    <ButtonInput title="이메일 인증" btnText="인증확인"/>
                    {step === 2 && <div className='w-full mb-8'>
                        <Input title="비밀번호"/>
                        <Input title="비밀번호 확인"/>
                    </div>}
                 <Button btnText={step === 1 ? "다음": "완료"}/>
                </div>
        </div>
        </div>
    );
}