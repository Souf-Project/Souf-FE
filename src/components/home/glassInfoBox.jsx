import React, { useState } from "react";
import talkImg from "../../assets/images/talkImg.png";
import SNSImg from "../../assets/images/SNSImg.png";
import growthImg from "../../assets/images/growthImg.png";

export default function GlassInfoBox() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const boxes = [
    {
      title: "SouF와 함께",
      description: "대학생 프리랜서와 기업을 연결하는\nAI 기반 매칭 플랫폼",
      features: [
        "순수미술 • 공예 • 음악",
        "촬영 및 편집 • 디지털 콘텐츠",
        "합리적인 비용으로 프로젝트 진행"
      ],
      image: talkImg
    },
    {
      title: "다양한 프로젝트",
      description: "다양한 분야의 프로젝트를\n한 곳에서 찾아보세요",
      features: [
        "디자인 • 개발 • 마케팅",
        "콘텐츠 제작 • 번역 • 컨설팅",
        "실무 경험 쌓기"
      ],
      image: SNSImg
    },
    {
      title: "안전한 거래",
      description: "안전하고 신뢰할 수 있는\n프리랜서 플랫폼",
      features: [
        "검증된 기업과 프리랜서",
        "안전한 결제 시스템",
        "전문적인 프로젝트 관리"
      ],
      image: growthImg
    }, {
        title: "안전한 거래",
        description: "안전하고 신뢰할 수 있는\n프리랜서 플랫폼",
        features: [
          "검증된 기업과 프리랜서",
          "안전한 결제 시스템",
          "전문적인 프로젝트 관리"
        ],
        image: growthImg
      }
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % boxes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + boxes.length) % boxes.length);
  };

  return (
    <div className="hidden lg:block relative">
      {/* 박스들 */}
      <div className="relative w-[800px] h-[500px]">
        {boxes.map((box, index) => {
          const isActive = index === currentIndex;
          const isNext = index === (currentIndex + 1) % boxes.length;
          const isPrev = index === (currentIndex - 1 + boxes.length) % boxes.length;
          
          let zIndex, opacity, transform;
          
          if (isActive) {
            zIndex = "z-30";
            opacity = "opacity-100";
            transform = "translate-x-0 translate-y-0 scale-100";
          } else if (isNext) {
            zIndex = "z-20";
            opacity = "opacity-70";
            transform = "translate-x-8 translate-y-8 scale-95";
          }  else if (isPrev) {
            zIndex = "z-0";
            opacity = "opacity-40";
            transform = "translate-x-24 translate-y-24 scale-90";
          } else  {
            zIndex = "z-10";
            opacity = "opacity-70";
            transform = "translate-x-16 translate-y-16 scale-95";
          }

          return (
            <div
              key={index}
              className={`absolute inset-0 glass p-8 flex flex-col rounded-xl justify-center items-center text-center transition-all duration-500 ease-in-out ${zIndex} ${opacity} ${transform}`}
            >
                <img 
                  src={box.image} 
                  alt={box.title} 
                  className={`w-36 h-36 opacity-80 mb-4 absolute top-0 z-0 ${
                    index % 2 === 0 ? 'right-0' : 'left-0'
                  }`} 
                />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {box.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-line">
                  {box.description}
                </p>
                <div className="space-y-3 text-sm text-gray-500">
                  {box.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center justify-center">
                      <span className="w-2 h-2 bg-yellow-point rounded-full mr-3"></span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 네비게이션 버튼들 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-40">
        <button
          onClick={handlePrev}
          className="w-3 h-3 bg-yellow-point rounded-full hover:bg-yellow-600 transition-colors duration-200"
          aria-label="이전 박스"
        />
        <button
          onClick={handleNext}
          className="w-3 h-3 bg-yellow-point rounded-full hover:bg-yellow-600 transition-colors duration-200"
          aria-label="다음 박스"
        />
      </div>

      {/* 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1 z-40">
        {boxes.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-yellow-point scale-125" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
} 