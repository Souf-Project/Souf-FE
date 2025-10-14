import { useState } from "react";
import arrow from "../../assets/images/backArrow.svg";

export default function Accordian({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-gray-100 rounded-lg mb-4 overflow-hidden px-6">
      <button
        onClick={toggleAccordion}
        className="w-full py-4 text-left bg-white transition-colors duration-200 flex items-center justify-between"
      >
        <p className="text-blue-500 text-xl font-semibold">Q. {question}</p>
        <img
          src={arrow}
          alt="화살표"
          className={`w-6 h-6 transition-transform duration-500 ease-in-out ${
            isOpen ? "rotate-90" : "rotate-[270deg]"
          }`}
        />
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="h-[1px] bg-gray-200 my-2"></div>
        <div className="py-4">
       
          <p className="text-base font-medium text-gray-700">A. {answer}</p>
        </div>
      </div>
    </div>
  );
}