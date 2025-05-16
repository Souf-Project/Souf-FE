import React from 'react';
import EditBox from '../components/editBox';
import EditSelectBox from '../components/editSelectBox';

export default function ProfileEditContent() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center space-x-6 m-5">
          <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-400">사진</span>
          </div>
          <div>
            <div className="text-4xl font-bold mb-3">멋있는 개발자</div>
            <button className="bg-white text-black border border-grey-border px-4 py-2 rounded-md">프로필 사진 변경하기</button>
            <p className="text-sm text-gray-500 mt-2">800*800 크기의<br/>
            PNG, JPG 사진만 업로드 가능합니다.</p>
          </div>
        </div>
        <EditBox title="자기소개" content="안녕하세요 어쩌구저쩌구" defaultValue="안녕하세요 어쩌구저쩌구" type="text" />
        <EditBox title="개인 웹사이트 URL" content="" defaultValue="안녕하세요 어쩌구저쩌구" type="text" />
        <EditSelectBox title="관심 분야" content="" defaultValue="안녕하세요 어쩌구저쩌구" type="text" />
      </div>
    </div>
  );
};