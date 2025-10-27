import React from "react";
import { useNavigate } from "react-router-dom";
import joinNormal from "../../assets/images/joinNormal.png";
import joinStudent from "../../assets/images/joinStudent.png";
import joinClub from "../../assets/images/joinClub.png";
import rightArrow from "../../assets/images/rightArrow.svg";

export default function Step2({ setStep, setSelectedType }) {
    return (
        <div className="flex flex-col items-center justify-center gap-10 max-w-[60rem]">
            <div className="flex items-center justify-center gap-10 ">
                <button className="group w-1/2 h-full gap-6 flex flex-col bg-white rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border-2 border-blue-main p-8 cursor-pointer"
                 onClick={() => {
                   setSelectedType('MEMBER');
                   setStep(3);
                 }}>
                    <div className="flex items-start justify-between w-full">
                    <p className="text-black group-hover:text-blue-500 text-3xl font-semibold transition-colors duration-200">일반</p>
                    <img src={joinNormal} alt="joinNormal" 
                   />
                    </div>
                    <p className="text-left text-black text-md font-semibold">일반 계정은 외주를 등록하고,  
                        <br/>대학생 프리랜서들과 계약을 진행할 수 있습니다.
                        <br/>저렴한 가격으로 효율적인 외주 작업을 시작해 보세요.</p>
                        <div className="ml-auto bg-gray-200 group-hover:bg-blue-500 rounded-full p-2 flex items-center justify-center transition-colors duration-200">
                            <img src={rightArrow} alt="rightArrow" className="w-5 h-5 brightness-0 group-hover:brightness-200 transition-all duration-200"/>
                        </div>
                </button>
                <button className="group w-1/2 h-full gap-6 flex flex-col bg-white rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border-2 border-blue-main p-8 cursor-pointer"
                 onClick={() => {
                   setSelectedType('STUDENT');
                   setStep(3);
                 }}>
                    <div className="flex items-start justify-between w-full">
                    <p className="text-black group-hover:text-blue-500 text-3xl font-semibold transition-colors duration-200">대학생</p>
                    <img src={joinStudent} alt="joinStudent" />
                    </div>
                    <p className="text-left text-black text-md font-semibold">대학생 계정은 외주를 맡아 진행할 수 있습니다.
                        <br/>작업물 피드를 업로드하고 기업과 외주 계약을 맺어보세요.
                        <p className="text-left text-gray-500 text-md font-light">대학생 계정은 회원가입 후 학생 인증까지 최대 5일의 시간이
                        소요될 수 있습니다.</p></p>
                        <div className="ml-auto bg-gray-200 group-hover:bg-blue-500 rounded-full p-2 flex items-center justify-center transition-colors duration-200">
                            <img src={rightArrow} alt="rightArrow" className="w-5 h-5 brightness-0 group-hover:brightness-200 transition-all duration-200"/>
                        </div>
                   
                </button>
            </div>
            <button className="group w-full h-full gap-6 flex flex-col bg-white rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border-2 border-blue-main p-8 cursor-pointer"
             onClick={() => {
               setSelectedType('CLUB');
               setStep(3);
             }}>
                    <div className="flex items-start justify-between w-full h-full">
                        <div className="flex flex-col text-left items-start gap-16 h-full">
                            <p className="text-black group-hover:text-blue-500 text-3xl font-semibold transition-colors duration-200">동아리</p>
                            <p className="text-left text-black text-md font-semibold">동아리 계정을 생성하여 그룹 단위로 계약을 맺어보세요.
                            <br/>동아리에 소속된 스프 회원들을 동아리원으로 추가하여
                            <br/>다양한 활동들을 기업에 소개해 보세요.
                        <p className="text-left text-gray-500 text-md font-light">동아리 계정은 회원가입 후 학생 인증까지 최대 5일의 시간이
                        소요될 수 있습니다.</p></p>
                        
                        </div>
                   <div className="flex flex-col items-center justify-between">
                   <img src={joinClub} alt="joinClub" />
                   <div className="ml-auto bg-gray-200 group-hover:bg-blue-500 rounded-full p-2 flex items-center justify-center transition-colors duration-200">
                            <img src={rightArrow} alt="rightArrow" className="w-5 h-5 brightness-0 group-hover:brightness-200 transition-all duration-200"/>
                        </div>
                   </div>
                    
                    </div>
                   
                </button>
        </div>
    )
}