import React from "react";
import completeStep from "../../assets/images/completeStep.png";
import activeStep from "../../assets/images/activeStep.png";
import inactiveStep from "../../assets/images/inactiveStep.png";

export default function JoinStepIndicator({ currentStep, totalSteps, stepTitles }) {
    return (
        <div className="flex flex-col gap-4 w-full mx-auto justify-center">
            
            {/* 단계 인디케이터 */}
            <div className="flex items-start justify-center">
                {Array.from({ length: totalSteps }, (_, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isComplete = stepNumber < currentStep;
                    const isLast = stepNumber === totalSteps;
 
                    const lineColor = isComplete || isActive ? "bg-blue-main" : "bg-[#D4D4D4]";
                    const textColor = isComplete || isActive ? "text-blue-main" : "text-gray-400";
                    
                    return (
                        <div key={stepNumber} className="flex items-start mb-12">
                            <div className="relative flex-shrink-0 flex flex-col items-center">
                                <img 
                                    src={isComplete ? completeStep : isActive ? activeStep : inactiveStep} 
                                    alt="step" 
                                    className="w-10 h-10" 
                                />
                                <p className={`text-sm font-light absolute top-12 whitespace-nowrap ${textColor}`}>
                                    {stepTitles[index]?.title || `Step ${stepNumber}`}
                                </p>
                            </div>
                            {!isLast && (
                                <div className={`h-0.5 w-24 mt-5 ${lineColor}`} />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}