import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    
   

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">홈 화면</h1>
           
        </div>
    );
} 