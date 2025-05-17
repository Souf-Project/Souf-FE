import EditIco from "../../assets/images/editIco.svg";
import CheckIco from "../../assets/images/checkIco.svg";
import React from "react";

export default function EditText({
  label,
  value,
  isEditing,
  onChange,
  onEditClick,
  onConfirmClick,
}) {
  return (
    <div className="mb-4">
      <label className="font-semibold block mb-1">{label}</label>
      {isEditing ? (
        <div className="flex border px-4 py-2 rounded">
          <input className="w-full" value={value} onChange={onChange} />
          <button
            className="bg-yellow-400 text-white px-4 py-2 ml-2 w-[95px] flex items-center justify-center gap-x-1 rounded-[10px]"
            onClick={onConfirmClick}
          >
            <img src={CheckIco} className="w-4 h-4" />
            확인
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center border px-4 py-2 rounded">
          <input className="w-full " value={value} readOnly />
          <button
            className="ml-2 border px-4 py-2 w-[95px] flex items-center justify-center gap-x-1 rounded-[10px]"
            onClick={onEditClick}
          >
            <img src={EditIco} alt="edit" className="w-4 h-4" />
            수정
          </button>
        </div>
      )}
    </div>
  );
}
