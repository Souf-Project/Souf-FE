import React from 'react';
import SouFLogo from '../assets/images/SouFLogo.svg';
import backArrow from '../assets/images/backArrow.svg';

export default function Footer() {
  return (
    <footer className="w-full z-30 bg-[#FCFEFF] border-t border-gray-200 mt-auto py-8">
      <div className="flex gap-8 justify-center items-center w-full max-w-[70rem] mx-auto">
       <div className='flex flex-col gap-10 justify-between items-start w-1/2'>
        <div>
        <img src={SouFLogo} alt="SouFLogo" className="w-24 brightness-0" />
        <h3 className='text-neutral-700 text-xl font-bold mt-2'>No 1. 대학생 프리랜서 플랫폼</h3>
        </div>
        <div className='text-neutral-400 text-md font-semibold '>
          <p>한규탁</p>
          <p>사업자 번호 : 123-456-789</p>
          <p>(주) 스프 | 통신판매업</p>
          <p>서울특별시 광진구 자양로 585 2층</p>
        </div>
       
       </div>
        <div className="flex flex-col gap-2 font-semibold text-md w-1/2">
          <div className='flex items-center gap-2 cursor-pointer'>
            스프 서비스 소개
            <img src={backArrow} alt="backArrow" className="w-6 h-6 rotate-180 brightness-0" />          
          </div>
          <div className='flex items-center gap-2 cursor-pointer'>
            제휴 & 광고 문의
            <img src={backArrow} alt="backArrow" className="w-6 h-6 rotate-180 brightness-0" />          
          </div>
          <div className='flex items-center gap-2 cursor-pointer'>
            FAQ
            <img src={backArrow} alt="backArrow" className="w-6 h-6 rotate-180 brightness-0" />          
          </div>
          <div className='flex items-center gap-2 cursor-pointer'>
            고객센터
            <img src={backArrow} alt="backArrow" className="w-6 h-6 rotate-180 brightness-0" />          
          </div>
          <div className='flex gap-8 text-md'>
            <div>
              <p>상담 시간</p>
              <p className='font-medium text-sm'>평일 11:00 ~ 20:00
                <br/>
                점심 12:30 ~ 13:30
                <br/>
                (주말,공휴일은 제외)</p>
            </div>
            <div>
              <p>이메일</p>
            <p className='font-medium text-sm'>souf-official@souf.co.kr</p>
            </div>
            
          </div>
        </div>
        
      </div>
     
    </footer>
  );
}
