import { useState } from "react";
import arrow from "../../assets/images/backArrow.svg";

export default function Accordian({ question, answer, ulList, olList, quotation }) {
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
        <p className="text-blue-500 text-md md:text-xl font-semibold">Q. {question}</p>
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
       
          <p className="text-sm md:text-base font-medium text-black">A. {answer}</p>
          {ulList ? (
            <ul className="list-disc list-inside space-y-2 mt-4">
              {ulList.map((item, index) => (
                <li key={index} className="text-sm md:text-base text-gray-700 font-medium">{item}</li>
              ))}
            </ul>
          ) : null}
          {olList ? (
            <ol className="list-decimal list-inside space-y-2 mt-4">
              {olList.map((item, index) => (
                <li key={index} className="text-sm md:text-base text-gray-700 font-medium">{item}</li>
              ))}
            </ol>
          ) : null}
          {quotation ? (
            <p className="text-sm md:text-base font-light text-gray-700 mt-4 border-l-2 border-gray-300 pl-4 py-2">{quotation}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}