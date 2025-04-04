import React, { useState } from 'react';

export default function Header({  }) {

    return (
<header className="flex items-center justify-between px-10 py-4 bg-white shadow-md">
    <div>
<div className="text-3xl font-bold text-black">SouF</div>
                <div>
                <nav>
        <ul className="flex items-center gap-x-10 list-none font-bold text-2xl text-black">
            <li> 
                <a href="/">순수미술 & 일러스트</a>
            </li>
            <li>
                <a href="/">공예 & 제작</a>
            </li>
            <li>
                <a href="/">음악 & 음향</a>
            </li>
            <li>
                <a href="/">사진 & 영상 & 영화</a>
            </li>
            <li>
                <a href="/">디지털 콘텐츠 & 그래픽 디자인</a>
            </li>
        </ul>
    </nav>
</div>

                <div>
                    <button className='text-black'>대학생 인증</button>
                    <div>
                        <button>로그인</button>
                        <button>회원가입</button>
                    </div>
                </div>
            </div>
        </header>
    );
}
