import React, { useState } from "react";
import Img1 from "../../assets/images/mainPopup/main1.png";
import Img2 from "../../assets/images/mainPopup/main2.png";
import Img3 from "../../assets/images/mainPopup/main3.png";
import Img4 from "../../assets/images/mainPopup/main4.png";
import Img5 from "../../assets/images/mainPopup/main5.png";
import popupArrow from "../../assets/images/backArrow.svg";

export default function InfoBox() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [Img1, Img2, Img3, Img4, Img5];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 hidden lg:block">
      {/* 이미지들 */}
      <div className="relative w-full aspect-[8/7]">
        {images.map((image, index) => {
          const isActive = index === currentIndex;
          const isNext = index === (currentIndex + 1) % images.length;
          const isPrev = index === (currentIndex - 1 + images.length) % images.length;
          
          let zIndex, opacity, transform;
          
          if (isActive) {
            zIndex = "z-30";
            opacity = "opacity-100";
            transform = "translate-x-0 translate-y-0 scale-100";
          } else if (isNext) {
            zIndex = "z-20";
            opacity = "opacity-70";
            transform = "translate-x-4 sm:translate-x-6 md:translate-x-8 translate-y-4 sm:translate-y-6 md:translate-y-8 scale-95";
          }  else if (isPrev) {
            zIndex = "z-0";
            opacity = "opacity-40";
            transform = "translate-x-12 sm:translate-x-16 md:translate-x-24 translate-y-12 sm:translate-y-16 md:translate-y-24 scale-90";
          } else  {
            zIndex = "z-10";
            opacity = "opacity-70";
            transform = "translate-x-8 sm:translate-x-12 md:translate-x-16 translate-y-8 sm:translate-y-12 md:translate-y-16 scale-95";
          }

          return (
            <div
              key={index}
              className={`absolute inset-0 sm:p-6 md:p-8 flex flex-col rounded-xl justify-center items-center text-center transition-all duration-500 ease-in-out ${zIndex} ${opacity} ${transform}`}
            >
              <img 
                src={image} 
                alt={`Main ${index + 1}`} 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          );
        })}
      </div>

            {/* 네비게이션 버튼들 */}
      <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 flex gap-4 z-40">
        <button
          onClick={handlePrev}
          className="w-36 h-36 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center transition-transform duration-150 active:scale-90 hover:scale-110"
          aria-label="이전 이미지">
          <img src={popupArrow} alt="이전 이미지" className="sm:w-12 sm:h-12 brightness-0 saturate-100 invert-[0.8] sepia-[0.5] saturate-[2.5] hue-rotate-[15deg]" />
         </button>
        <button
          onClick={handleNext}
          className="w-36 h-36 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center transition-transform duration-150 active:scale-90 hover:scale-110"
          aria-label="다음 이미지">
          <img src={popupArrow} alt="다음 이미지" className="sm:w-12 sm:h-12 rotate-180 brightness-0 saturate-100 invert-[0.8] sepia-[0.5] saturate-[2.5] hue-rotate-[15deg]" />
          </button>
      </div>

      {/* 인디케이터 */}
      <div className="absolute bottom-16 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex gap-1 z-40">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
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