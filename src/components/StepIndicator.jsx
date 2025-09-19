export default function StepIndicator({ currentStep, totalSteps = 3, onStepClick }) {
  const handleStepClick = (stepNumber) => {
    if (onStepClick) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="w-80 h-80 bg-stone-50 sticky top-32 p-4 pl-8">
      <div className="flex flex-col gap-6">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          
          return (
              <div 
                key={stepNumber} 
                className={`relative flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-500 ease-in-out h-16 ${
                  isActive ? 'bg-blue-bright' : 'bg-gray-200'
                }`}
                onClick={() => handleStepClick(stepNumber)}

              >
                {/* 단계 번호 원 */}
                <div className={`absolute top-0 left-[-1rem] nanum-myeongjo-extrabold text-white rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ease-in-out ${
                  isActive 
                    ? 'bg-blue-main top-[-0.4rem] left-[-2.4rem] w-[4.8rem] h-[4.8rem]' 
                    : 'bg-neutral-400 w-16 h-16'
                }`}>
                  STEP {stepNumber}.
                </div>
                
                {/* 단계 텍스트 */}
                <div className="flex-1">
                  <div className={`text-base font-bold text-black transition-all duration-500 ease-in-out ${
                    isActive ? 'ml-10' : 'ml-12'
                  }`}>
                    {stepNumber === 1 && '개인 및 회사 정보 작성'}
                    {stepNumber === 2 && '프로젝트 [외주] 공고 작성'}
                    {stepNumber === 3 && '계약/견적 방식'}
                    {stepNumber === 4 && '카테고리 선택'}
                  </div>
                
                </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
