import React from 'react';
import iconInsta from '../assets/images/iconInsta.svg';
import iconMail from '../assets/images/iconMail.svg';

export default function Footer() {
  return (
    <footer className="w-full z-30 bg-[#FBFBFB] border-t border-gray-200 mt-auto">
      <div className="containerx py-6 flex px-4 lg:px-24 lg:justify-between items-start">
        <div className="text-gray-500 font-medium self-start mt-1 ">
        SouF는 실무 경험이 부족한 대학생 프리랜서와 창의적이고 유연한 인재를 필요로 하는 기업을 연결하는 AI 기반 프리랜서 매칭 플랫폼입니다.<br/>
         <span className='hidden lg:block'>대학생들이 자유롭게 포트폴리오를 업로드하고, 기업은 이를 기반으로 원하는 인재와 프로젝트를 진행할 수 있도록 지원합니다.</span>
        </div>
        <div className="hidden lg:block flex flex-col gap-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-opacity"
          >
            <img src={iconInsta} alt="Instagram" className="w-6 h-6" />
            <span className="text-gray-500">Instagram | @Souf.platform</span>
          </a>

          <a
            href="mailto:Souf@gmail.com"
            className="flex items-center gap-2 transition-opacity"
          >
            <img src={iconMail} alt="Email" className="w-6 h-6" />
            <span className="text-gray-500">Mail | souf-official@souf.co.kr</span>
          </a>
        </div>
        
      </div>
      <div className="block lg:hidden flex flex-col gap-3 px-4 pb-4 ">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-opacity"
          >
            <img src={iconInsta} alt="Instagram" className="w-6 h-6" />
            <span className="text-gray-500">Instagram | @souf.co.kr</span>
          </a>

          <a
            href="mailto:Souf@gmail.com"
            className="flex items-center gap-2 transition-opacity"
          >
            <img src={iconMail} alt="Email" className="w-6 h-6" />
            <span className="text-gray-500">Mail | souf-official@souf.co.kr</span>
          </a>
        </div>

      <div className="w-full bg-[#EEEEEE] py-2 text-center">
        <p className="text-gray-500 text-sm">
          ⓒ 2025. SouF Co. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
