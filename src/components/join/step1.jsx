import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Input from "../input";
import ButtonInput from '../buttonInput';
import Button from '../button';

export default function Step1() {
    return (
    <div className='w-full rounded-[30px] border-[1px] py-20 px-52 flex flex-col items-center justify-center'>
        <Input title="이름" />
        <ButtonInput title="닉네임" btnText="중복확인"/>
        <ButtonInput title="이메일" btnText="인증요청"/>
        <ButtonInput title="이메일 인증" btnText="인증확인"/>
        <Input title="비밀번호" />
        <Input title="비밀번호 확인" />
        <Button btnText="다음" />
    </div>
       );
}