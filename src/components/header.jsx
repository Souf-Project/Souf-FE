import React from 'react';

export default function Header() {
  return (
    <header className="w-screen flex items-center justify-between px-10 py-4 bg-white shadow-sm">
      <div className="flex items-center gap-x-10">
        <div className="text-4xl font-bold text-black">SouF</div>
        <ul className="flex items-center gap-x-8 font-bold text-2xl text-black">
  <li className='hover:text-yellow-point transition-colors duration-200'>
    <a href="/">순수미술 & 일러스트</a>
  </li>
  <li className='hover:text-yellow-point transition-colors duration-200'>
    <a href="/">공예 & 제작</a>
  </li>
  <li className='hover:text-yellow-point transition-colors duration-200'>
    <a href="/">음악 & 음향</a>
  </li>
  <li className='hover:text-yellow-point transition-colors duration-200'>
    <a href="/">사진 & 영상 & 영화</a>
  </li>
  <li className='hover:text-yellow-point transition-colors duration-200'>
    <a href="/">디지털 콘텐츠 & 그래픽 디자인</a>
  </li>
</ul>

      </div>

      <div className="flex items-center gap-x-4">
        <button className="text-black bg-yellow-main px-5 py-3 font-semibold rounded-lg">대학생 인증</button>
        <div className="flex items-center text-xl font-semibold">
          <button className="bg-white">로그인</button>
          <span className="mx-2 font-thin">|</span>
          <button className="bg-white">회원가입</button>
        </div>
      </div>
    </header>
  );
}
