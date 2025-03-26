import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({  }) {

    const navigate = useNavigate();
    
    const handleLoginClick = () => {
        navigate("/login");
    }
    

    return (
<div>
    홈 화면
    {/* 일단 홈 화면 대신 하위 페이지부터 작업 */}
    {/* 작업에 용이하도록 페이지 이동 버튼만 둠 */}
    <ul>
        <li>
        <button onClick={handleLoginClick}>로그인</button>

        </li>
    </ul>
</div>
    );
}
