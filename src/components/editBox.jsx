import React, { useState } from 'react';
import editIco from '../assets/images/editIco.svg';
import checkBtnIco from '../assets/images/checkBtnIco.svg';

export default function EditBox({title, content, defaultValue, type}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(defaultValue || '');

  const handleEdit = () => {
    if (isEditing) {
      // 수정 완료 시 저장
      setIsEditing(false);
    } else {
      // 수정 시작
      setIsEditing(true);
    }
  };

  return (
    <div className="m-4">
      <label className="block text-black font-semibold text-3xl mb-2">{title}</label>
      {isEditing ? (
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <input 
            type="text" 
            className="flex-1 p-5 pl-7 border-0 outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button 
            className="flex items-center gap-2 bg-yellow-point text-white px-4 py-3 whitespace-nowrap rounded-lg mr-2"
            onClick={handleEdit}
          >
            <img src={checkBtnIco} alt="check" />
            저장
          </button>
        </div>
      ) : (
        <div className="flex items-center rounded-md bg-[#F7F7F7] overflow-hidden">
          <div className="flex-1 p-5 pl-7">
            {value}
          </div>
          <button 
            className="flex items-center gap-2 bg-white text-black px-4 py-3 whitespace-nowrap rounded-lg mr-2"
            onClick={handleEdit}
          >
            <img src={editIco} alt="edit" />
            수정
          </button>
        </div>
      )}
    </div>
  );
}