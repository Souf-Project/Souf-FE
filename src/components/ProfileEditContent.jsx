import React from 'react';
import EditBox from '../components/editBox';

export default function ProfileEditContent() {
  return (
    <div>
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
        <EditBox title="자기소개" content="안녕하세요 어쩌구저쩌구" defaultValue="안녕하세요 어쩌구저쩌구" type="text" />
        <EditBox title="개인 웹사이트 URL" content="" defaultValue="안녕하세요 어쩌구저쩌구" type="text" />
        
      </div>
    </div>
  );
};