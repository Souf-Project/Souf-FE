import React from 'react';

export default function ProfileEditContent() {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">프로필 수정</h3>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center space-x-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-400">사진</span>
          </div>
          <div>
            <button className="bg-yellow-point text-white px-4 py-2 rounded-md">사진 변경</button>
            <p className="text-sm text-gray-500 mt-2">JPG, PNG 파일 (최대 5MB)</p>
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">닉네임</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded-md"
            defaultValue="김시은"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">소개</label>
          <textarea 
            className="w-full p-2 border border-gray-300 rounded-md h-32"
            placeholder="자기소개를 입력하세요"
          ></textarea>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">포트폴리오 URL</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="https://"
          />
        </div>
        
        <div className="flex justify-end">
          <button className="bg-yellow-point text-white px-6 py-2 rounded-md">저장하기</button>
        </div>
      </div>
    </div>
  );
};