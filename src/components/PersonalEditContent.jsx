import React from 'react';
import EditBox from '../components/editBox';


export default function PersonalEditContent() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">이메일</label>
          <input 
            type="email" 
            className="w-full p-2 border border-gray-300 rounded-md"
            defaultValue="example@university.ac.kr"
            disabled
          />
          <p className="text-sm text-gray-500 mt-1">이메일은 변경할 수 없습니다</p>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">이름</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded-md"
            defaultValue="김시은"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">전화번호</label>
          <input 
            type="tel" 
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="010-0000-0000"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">학교</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded-md"
            defaultValue="서울대학교"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">전공</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded-md"
            defaultValue="시각디자인학과"
          />
        </div>
        
        <div className="pt-4 border-t">
          <label className="block text-gray-700 font-medium mb-2">비밀번호 변경</label>
          <input 
            type="password" 
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="현재 비밀번호"
          />
          <input 
            type="password" 
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="새 비밀번호"
          />
          <input 
            type="password" 
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="새 비밀번호 확인"
          />
        </div>
        
        <div className="flex justify-end">
          <button className="bg-yellow-point text-white px-6 py-2 rounded-md">저장하기</button>
        </div>
      </div>
    </div>
  );
};