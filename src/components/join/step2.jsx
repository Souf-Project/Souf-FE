import React, { useState } from 'react';
import Input from "../input";
import ButtonInput from '../buttonInput';
import Button from '../button';

export default function Step2() {
    return (
    <div className='w-full rounded-[30px] border-[1px] py-20 px-52 flex flex-col items-center justify-center'>
        <div className="w-full relative mb-8">
            <div className="text-black text-2xl font-regular mb-4">
                관심분야<span className='text-gray-500 text-sm'>(선택)</span>
            </div>
            <div className='w-full rounded-[10px] border-[1px] border-[#FFC400] py-[12px] flex justify-center text-lg'>추가하기</div>
        </div>
        <Button btnText="회원가입" />
    </div>
       );
}