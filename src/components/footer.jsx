import React from 'react';
import SouFLogo from '../assets/images/SouFLogo.svg';
import backArrow from '../assets/images/backArrow.svg';

export default function Footer() {
  return (
    <footer className="w-full z-30 bg-[#FCFEFF] border-t border-gray-200 py-8">
      <div className="flex gap-8 justify-between items-center w-full max-w-[60rem] mx-auto">
       <div className='flex flex-col gap-10 justify-between items-start w-[30%]'>
        <div>
        <img src={SouFLogo} alt="SouFLogo" className="w-24 brightness-0" />
        <h3 className='text-neutral-700 text-xl font-bold mt-2'>No 1. 대학생 프리랜서 플랫폼</h3>
        </div>
        <div className='text-neutral-400 text-md font-semibold '>
          <p>한규탁</p>
          <p>사업자 번호 : 508-24-95706</p>
          <p>(주) 스프 | 통신판매업</p>
          <p>서울특별시 광진구 자양로 585 2층</p>
        </div>
       
       </div>

       <div className='flex'>
       <p className="mb-auto font-bold text-md w-36">이용안내</p>
        <div className="flex flex-col gap-2 font-semibold text-md w-full">
          <div 
            className='flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity'
            onClick={() => window.open('https://www.notion.so/SouF-293adbfeb08580c9a7e0e27d42c77ae5?source=copy_link', '_blank')}
          >
            이용약관
            <img src={backArrow} alt="backArrow" className="w-6 h-6 rotate-180 brightness-0" />          
          </div>
          <div 
            className='flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity'
            onClick={() => window.open('https://www.notion.so/293adbfeb0858054beecca8fe3d2e5cf?source=copy_link', '_blank')}
          >
            개인정보처리방침
            <img src={backArrow} alt="backArrow" className="w-6 h-6 rotate-180 brightness-0" />          
          </div>
          <div 
            className='flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity'
            onClick={() => window.open('https://www.notion.so/SouF-293adbfeb08580eda58dec894c1c9463?source=copy_link', '_blank')}
          >
          결제·정산·환불(에스크로) 정책
            <img src={backArrow} alt="backArrow" className="w-6 h-6 rotate-180 brightness-0" />          
          </div>
          <div 
            className='flex items-center gap-2 mb-2 cursor-pointer hover:opacity-70 transition-opacity'
            onClick={() => window.open('https://www.notion.so/SouF-293adbfeb08580b59ce9c871ba2f2fb3?source=copy_link', '_blank')}
          >
          분쟁처리방침
            <img src={backArrow} alt="backArrow" className="w-6 h-6 rotate-180 brightness-0" />          
          </div>
          <div className='w-full border-b border-gray-300'/>
          <div className="mt-2">
              <p>이메일</p>
            <p className='font-medium text-sm '>souf-official@souf.co.kr</p>
            </div>
          {/* <div className='flex gap-8 text-md'>
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
            
          </div> */}
        </div> 
        </div>
        
      </div>
     
    </footer>
  );
}
