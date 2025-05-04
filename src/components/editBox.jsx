import React from 'react';

export default function EditBox({title, content, defaultValue, type}) {
  return (
    <div>
          <label className="block text-black font-semibold text-3xl mb-2">{title}</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded-md"
            defaultValue={defaultValue}
          />
          <button className="bg-yellow-point text-white px-6 py-2 rounded-md">저장하기</button>
        </div>
  );
}