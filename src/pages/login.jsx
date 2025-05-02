import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect} from 'react';
import ButtonInput from '../components/buttonInput';
import Input from '../components/input';
import loginImg from '../assets/images/loginImg.svg';


export default function Login() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/");
    };

    return (
        <div className="w-screen h-screen flex">
            <div className="w-1/2 bg-[#FFE681] flex flex-col justify-center px-16 ">
            <div className='my-auto'>
            <h1 className="text-8xl font-bold mb-6">SouF</h1>
                <p className="text-4xl font-bold leading-relaxed text-gray-800 mb-10">
                    합리적인 비용으로<br />
                    필요한 인재를 만나보세요!<br />
                    지금 바로 스프에서!
                </p>
                <div className="mt-20 w-1/2 h-auto ml-auto">
                    <img src={loginImg} className=' w-full'/>
                </div>
            </div>
                
            </div>

            <div className="w-1/2 bg-white flex flex-col justify-center items-center px-36">
                <h2 className="text-6xl font-bold mb-10 mr-auto">로그인</h2>
                <div className="w-full space-y-6 bg-white p-8 border rounded-xl shadow">
                    <Input 
                    title="이메일"
                    // isValidateTrigger={isValidateTrigger}
                    // isConfirmed={isConfirmed}
                    placeholder="Souf@souf.com"
                    // onChange={onChange}
                    essentialText="이메일을 입력해주세요"
                    disapproveText="이메일을 입력해주세요"
                    // onValidChange={onValidChange}
                    />
                     <Input 
                    title="비밀번호"
                    // isValidateTrigger={isValidateTrigger}
                    // isConfirmed={isConfirmed}
                    placeholder=""
                    // onChange={onChange}
                    essentialText="비밀번호를 입력해주세요"
                    disapproveText="비밀번호를 입력해주세요"
                    // onValidChange={onValidChange}
                    />
                    <div className='flex justify-between text-[#767676] text-xl font-reagular'>
                        <button>회원가입</button>
                        <button>비밀번호 재설정</button>
                    </div>
                    <div className='flex justify-center'>
                    <button onClick={() => handleLoginClick()} className='bg-yellow-main mx-auto w-36 h-12 rounded-xl text-2xl font-bold'>로그인</button>

                    </div>
                </div>
            </div>
        </div>
    );
}
