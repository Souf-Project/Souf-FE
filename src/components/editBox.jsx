import React from 'react';
import editIco from '../assets/images/editIco.svg';
import checkBtnIco from '../assets/images/checkBtnIco.svg';

export default function EditBox({title, value, onChange, isEditing}) {
  return (
    <div className="m-4">
      <label className="block text-black font-semibold text-3xl mb-2">{title}</label>
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
        <input 
          type="text" 
          className="flex-1 p-5 pl-7 border-0 outline-none bg-[#F7F7F7]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing}
        />
      </div>
    </div>
  );
}