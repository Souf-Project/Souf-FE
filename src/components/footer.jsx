import React from 'react';
import iconInsta from '../assets/images/iconInsta.svg';
import iconMail from '../assets/images/iconMail.svg';

export default function Footer() {
  return (
    <footer className="w-full z-50 bg-[#FBFBFB] border-t border-gray-200 mt-auto">
      <div className="container mx-auto py-6 flex justify-between items-start">
        {/* 스프 소개 텍스트 더 추가 */}
        <div className="text-gray-500 font-medium self-start mt-1">
          스프 기업 소개
        </div>
        <div className="flex flex-col gap-3">
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
            <span className="text-gray-500">Mail | Souf@gmail.com</span>
          </a>
        </div>
      </div>

      <div className="w-full bg-[#EEEEEE] py-2 text-center">
        <p className="text-gray-500 text-sm">
          ⓒ 2025. SouF Co. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
