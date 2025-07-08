import { useState } from "react";
import starOn from "../assets/images/starOn.svg";
import starOff from "../assets/images/starOff.svg";

export default function DegreeModal({
  title,
  description,
  bottomText,
  FalseBtnText,
  TrueBtnText,
  onClickFalse,
  onClickTrue,

}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50"
      
    >
      <div
        className="flex flex-col justify-center items-center bg-white rounded-[25px] p-6 max-w-[600px]  px-24 py-8 min-h-[250px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-2xl font-semibold text-black mb-0.5 text-center">
          {title}
        </div>
        <div className="text-lg font-medium mb-6 text-black text-center whitespace-pre-line">
          {description}
        </div>
       <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex justify-center items-center gap-2">
        <img src={starOn} alt="starOn" className="w-6 h-6" />
        <img src={starOff} alt="starOff" className="w-6 h-6" />
        <img src={starOff} alt="starOff" className="w-6 h-6" />
        <img src={starOff} alt="starOff" className="w-6 h-6" />
        <img src={starOff} alt="starOff" className="w-6 h-6" />
        </div>
        <div className="text-[15px] font-medium mb-2 text-black text-center whitespace-pre-line">
          {bottomText}
        </div>
        <div className=" w-full px-4 flex justify-center gap-8"> 
          {FalseBtnText && (
            <button
              className="w-full py-3 px-5 bg-[#C9C9C9] rounded-[10px] font-semibold text-base"
              onClick={onClickFalse}
            >
              {FalseBtnText}
            </button>
          )}
          <button
            className="w-full py-3 px-5 bg-yellow-main rounded-[10px] font-semibold text-base"
            onClick={onClickTrue}
          >
            {TrueBtnText}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
