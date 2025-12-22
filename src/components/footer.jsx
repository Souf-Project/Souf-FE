import React from 'react';
import { useNavigate } from 'react-router-dom';
import SouFLogo from '../assets/images/SouFLogo.svg';
import backArrow from '../assets/images/backArrow.svg';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="w-full z-30 bg-[#FCFEFF] border-t border-gray-200 py-8">
      <div className="flex flex-col gap-6 md:w-full md:max-w-[60rem] w-screen px-4 mx-auto">
     
        <div>
        <img src={SouFLogo} alt="SouFLogo" className="w-16 md:w-24 brightness-0" />
        <h3 className='text-neutral-700 text-base md:text-xl font-bold mt-2'>No 1. 대학생 프리랜서 플랫폼</h3>
        </div>
        <div className="hidden md:block">
        <div className='flex gap-2 text-neutral-400 text-md '>
          <p>사업자 대표 : 한규탁</p>
          <p>|</p>
          <p>대표자 연락처 : 010-9335-8400 </p>
          <p>|</p>
          <p>사업자 등록 번호 : 508-24-95706</p>
          <p>|</p>
          <p>이메일 : souf-official@souf.co.kr</p>

        
        </div>
        <div className='flex gap-2 text-neutral-400 text-md '>

          <p>상호명 : 스프 | 통신판매업</p>
          <p>|</p>
          <p>주소 : 서울특별시 광진구 광나루로19길 23, 103호</p>
          <p>|</p>
          <p>개인정보 관리자 : 박정곤</p>
       
        </div>
        {/* <p className="text-neutral-400 text-md">해당 사이트에서 판매되는 모든 상품에 대한 환불 및 모든 민원의 책임은 스프에 있습니다.</p> */}

       </div>


       <div className='flex flex-col md:block hidden'>
       <p className="font-bold text-md mb-2">스프 기본 약관</p>
        <div className="flex gap-10 font-semibold text-md w-full text-gray-500">
          <div 
            className='flex items-center gap-2 cursor-pointer hover:text-gray-700 transition-all duration-200 hover:brightness-0'
            onClick={() => navigate('/policy/terms')}
          >
            이용약관
          </div>
          
          <div 
            className='flex items-center gap-2 cursor-pointer hover:text-gray-700 transition-all duration-200 hover:brightness-0'
            onClick={() => navigate('/policy/privacy')}
          >
            개인정보처리방침
          </div>
          
          {/* <div 
            className='flex items-center gap-2 cursor-pointer hover:text-gray-700 transition-all duration-200 hover:brightness-0'
            onClick={() => window.open('https://www.notion.so/SouF-293adbfeb08580eda58dec894c1c9463?source=copy_link', '_blank')}
          >
          결제·정산·환불(에스크로) 정책
          </div> */}
          
          <div 
            className='flex items-center gap-2 cursor-pointer hover:text-gray-700 transition-all duration-200 hover:brightness-0'
            onClick={() => navigate('/policy/complaintDispute')}
          >
          분쟁처리방침
            </div>
           
        </div> 
        </div>
        
        {/* 모바일 */}
        <div className="block md:hidden">
        <div className='flex flex-col text-neutral-400 text-sm'>
          <p>사업자 대표 : 한규탁</p>
          <p>대표자 연락처 : 010-9335-8400 </p>
          <p>이메일 : souf-official@souf.co.kr</p>
         <p>사업자 등록 번호 : 508-24-95706</p>
          <p>상호명 : 스프 | 통신판매업</p>
          <p>주소 : 서울특별시 광진구 광나루로19길 23, 103호</p>
          <p>개인정보 관리자 : 박정곤</p>
        </div>
        {/* <p className="text-neutral-400 text-md">해당 사이트에서 판매되는 모든 상품에 대한 환불 및 모든 민원의 책임은 스프에 있습니다.</p> */}

       </div>
       <div className="block md:hidden">
        <p className="font-bold text-md mb-2">스프 기본 약관</p>
        <div className="flex flex-col gap-1 font-semibold text-sm w-full text-gray-500">
          <div 
            className='flex items-center gap-2 cursor-pointer hover:text-gray-700 transition-all duration-200 hover:brightness-0'
            onClick={() => navigate('/policy/terms')}
          >
            이용약관
            <img src={backArrow} alt="backArrow" className="w-6 h-6 rotate-180 brightness-10" />
          </div>
          
          <div 
            className='flex items-center gap-2 cursor-pointer hover:text-gray-700 transition-all duration-200 hover:brightness-0'
            onClick={() => navigate('/policy/privacy')}
          >
            개인정보처리방침
            <img src={backArrow} alt="backArrow" className="w-6 h-6 rotate-180 brightness-10" />
          </div>
          
          {/* <div 
            className='flex items-center gap-2 cursor-pointer hover:text-gray-700 transition-all duration-200 hover:brightness-0'
            onClick={() => window.open('https://www.notion.so/SouF-293adbfeb08580eda58dec894c1c9463?source=copy_link', '_blank')}
          >
          결제·정산·환불(에스크로) 정책
            <img src={backArrow} alt="backArrow" className="w-6 h-6 rotate-180 brightness-10" />
          </div> */}
          
          <div 
            className='flex items-center gap-2 cursor-pointer hover:text-gray-700 transition-all duration-200 hover:brightness-0'
            onClick={() => navigate('/policy/complaintDispute')}
          >
          분쟁처리방침
            <img src={backArrow} alt="backArrow" className="w-6 h-6 rotate-180 brightness-10" />
            </div>
            
            <p>이메일 : souf-official@souf.co.kr</p>
         
           
        </div> 
       </div>
      </div>
     
    </footer>
  );
}
