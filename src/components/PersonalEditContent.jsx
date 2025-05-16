import React from 'react';
import EditBox from '../components/editBox';


export default function PersonalEditContent() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6">
      <EditBox title="이름" content="" defaultValue="김시은" type="text" />
      <EditBox title="닉네임" content="" defaultValue="김시은" type="text" />
      <EditBox title="이메일" content="" defaultValue="Souf@gmail.com" type="text" />
      <EditBox title="비밀번호" content="" defaultValue="******" type="text" />
       
      </div>
    </div>
  );
};