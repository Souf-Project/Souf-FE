import { useState } from "react";
import Accordian from "./accordian";

export default function FAQcontent({ onInquiryClick }) {
    const [activeTab, setActiveTab] = useState(0);
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    // 탭 마다 다른 데이터 연결하도록
    const faqData1 = [
        {
            question: "채팅",
            answer: "채팅 FAQ 답변"
        },
        {
            question: "채팅2",
            answer: "채팅2 FAQ 답변"
        }
    ];
    const faqData2 = [
        {
            question: "계정/인증",
            answer: "계정/인증 FAQ 답변"
        },
        
    ];
    const faqData3 = [
        {
            question: "후기",
            answer: "후기 FAQ 답변"
        },
    ];
    const faqData4 = [
        {
            question: "기타",
            answer: "기타 FAQ 답변"
        },
    ];
    return (
        <div>
            <div className="flex items-center gap-2">
                <button
                        className={`pr-8 py-2 text-sm font-semibold transition-colors duration-200 relative group ${
                            activeTab === 0 ? "text-black" : "text-gray-500"
                        }`}
                        onClick={() => handleTabChange(0)}
                    >
                        <span>채팅</span>
                      
                    </button>
                    <button
                        className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 relative group ${
                            activeTab === 1 ? "text-black" : "text-gray-500"
                        }`}
                        onClick={() => handleTabChange(1)}
                    >
                        <span>계정/인증</span>
                    </button>
                    <button
                        className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 relative group ${
                            activeTab === 2 ? "text-black" : "text-gray-500"
                        }`}
                        onClick={() => handleTabChange(2)}
                    >
                        <span>후기</span>
                    </button>
                    <button
                        className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 relative group ${
                            activeTab === 3 ? "text-black" : "text-gray-500"
                        }`}
                        onClick={() => handleTabChange(3)}
                    >
                        <span>기타</span>
                    </button>
            </div>
            <div className="flex flex-col gap-4 mt-8">
                {activeTab === 0 && faqData1.map((item, index) => (
                    <Accordian key={index} question={item.question} answer={item.answer} />
                ))}
                {activeTab === 1 && faqData2.map((item, index) => (
                    <Accordian key={index} question={item.question} answer={item.answer} />
                ))}
                {activeTab === 2 && faqData3.map((item, index) => (
                    <Accordian key={index} question={item.question} answer={item.answer} />
                ))}
                {activeTab === 3 && faqData4.map((item, index) => (
                    <Accordian key={index} question={item.question} answer={item.answer} />
                ))}
            </div>
            <div className="flex items-center  gap-8 mt-8">
                <p className="text-2xl font-semibold">궁금한 점이 해결되지 않으셨나요?</p>
                <button className="px-10 py-4 bg-blue-500 text-white text-2xl font-bold rounded-lg"
                onClick={onInquiryClick}>문의하기</button>
            </div>
        </div>
    );
}