import React, { useState } from "react";

import profileImgOn from "../assets/images/applyImgOn.svg";
import profileImgOff from "../assets/images/profileImgOff.svg";
import applyImgOff from "../assets/images/applyImgOff.svg";
import applyImgOn from "../assets/images/applyImgOn.svg";

import starImgOn from "../assets/images/starImgOn.png"
import starImgOff from "../assets/images/starImgOff.png"

import TrashIcon from "../assets/images/trashIco.svg";
import CompanyProfileEdit from "../components/companyMyPage/companyProfileEdit";
import RecruitPostList from "../components/companyMyPage/recruitPostList";

export default function CompanyMyPage() {
  const [activeTab, setActiveTab] = useState("profileEdit");

  const renderContent = () => {
    switch (activeTab) {
      case "profileEdit":
        return <CompanyProfileEdit />;
      case "postHistory":
        return <RecruitPostList />;
      default:
        return <CompanyProfileEdit />;
    }
  };

  return (
    <div
      className={`min-h-screen flex w-full ${
        activeTab === "profileEdit" ? "bg-gray-100" : "bg-white"
      }`}
    >
      <div className="w-64 fixed z-10 left-0 top-16 bottom-0 bg-white p-6 overflow-y-auto border-r">
        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-bold mb-3 text-[#696969]">프로필</h3>
          <button
            className={`w-full text-left py-3 px-3 rounded-lg flex items-center transition-all ${
              activeTab === "profileEdit"
                ? "shadow-[0px_0px_5px_3px_rgba(255,229,143)] text-yellow-point font-medium"
                : "text-black hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("profileEdit")}
          >
            <img
              src={activeTab === "profileEdit" ? profileImgOn : profileImgOff}
              alt="프로필 수정"
              className="w-5 h-5 mr-2"
            />
            프로필 수정
          </button>
        </div>

        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-bold mb-3 text-[#696969]">공고</h3>
          <button
            className={`w-full text-left py-3 px-3 rounded-lg flex items-center transition-all ${
              activeTab === "postHistory"
                ? "shadow-[0px_0px_5px_3px_rgba(255,229,143)] text-yellow-point font-medium"
                : "text-black hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("postHistory")}
          >
            <img
              src={activeTab === "postHistory" ? applyImgOn : applyImgOff}
              alt="공고문 내역"
              className="w-5 h-5 mr-2"
            />
            공고문 내역
          </button>
        </div>
        <div className="mb-6 pb-4">
          <button
            className={`text-red-400 w-full text-left py-3 px-3 rounded-lg flex items-center transition-all `}
            onClick={() => setActiveTab("postHistory")}
          >
            <img src={TrashIcon} alt="공고문 내역" className="w-5 h-5 mr-2 " />
            계정 삭제
          </button>
        </div>
      </div>

      <main className="ml-64 flex-1 p-10 w-[clac()]">
        <div className="w-full">
          {/*
          <h3 className="text-4xl font-medium mb-4">
            {activeTab === "profileEdit" && "프로필 수정"}
            {activeTab === "applicantHistory" && "지원자 내역"}
            {activeTab === "postHistory" && "공고문 내역"}
          </h3> */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
