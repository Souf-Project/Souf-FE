import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Login({  }) {
const navigate = useNavigate();

const handleClick = () => {
    navigate("/");
}

    return (
        <div>
           로그인 화면 
           <button onClick={handleClick}>홈으로</button>
        </div>
    );
}
