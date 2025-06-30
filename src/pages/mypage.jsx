import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImgOff from '../assets/images/profileImgOff.svg'
import applyImgOff from '../assets/images/applyImgOff.svg'
import starImgOn from "../assets/images/starImgOn.png"
import feedImgOn from "../assets/images/feedImgOn.png"
import recruitImgOn from "../assets/images/recruitImgOn.png"

import profileImgOn from '../assets/images/profileImgOn.svg'
import applyImgOn from '../assets/images/applyImgOn.svg'
import starImgOff from "../assets/images/starImgOff.png"
import feedImgOff from "../assets/images/feedImgOff.png"
import recruitImgOff from "../assets/images/recruitImgOff.png"

// 분리된 컴포넌트 import
import ProfileEditContent from '../components/ProfileEditContent';
import ApplicationsContent from '../components/ApplicationsContent';
import FavoritesContent from '../components/FavoritesContent';
import RecruitPostList from '../components/companyMyPage/recruitPostList';
import CompanyApplicants from '../components/companyMyPage/companyApplicants';
import { UserStore } from '../store/userStore';

export default function MyPage() {
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState('profileEdit'); // 기본 서브메뉴
  const { roleType } = UserStore();

  // 서브메뉴 변경 핸들러
  const handleSubmenuChange = (submenu) => {
    setActiveSubmenu(submenu);
  };

  // 서브메뉴에 따른 컴포넌트 렌더링
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'profileEdit':
        return <ProfileEditContent />;
      case 'studentApplications':
        return <ApplicationsContent />;
      case 'companyApplications':
        return <CompanyApplicants />;
      case 'favorites':
        return <FavoritesContent />;
      case 'myFeed':
        return <div>내 피드 내용이 여기에 표시됩니다.</div>;
      case 'myRecruits':
        return <RecruitPostList />;
      default:
        return <ProfileEditContent />;
    }
  };

  // roleType에 따른 메뉴 렌더링
  const renderMenuItems = () => {
    const baseMenus = [
      {
        id: 'profileEdit',
        label: '프로필 수정',
        iconOn: profileImgOn,
        iconOff: profileImgOff
      },
      {
        id: 'favorites',
        label: '내 즐겨찾기',
        iconOn: starImgOn,
        iconOff: starImgOff
      }
    ];

    const roleSpecificMenus = [];

    // STUDENT: 내 지원 내역과 내 피드 보여줌
    if (roleType === 'STUDENT') {
      roleSpecificMenus.push({
        id: 'studentApplications',
        label: '지원 내역',
        iconOn: applyImgOn,
        iconOff: applyImgOff
      });
      roleSpecificMenus.push({
        id: 'myFeed',
        label: '내 피드',
        iconOn: feedImgOn,
        iconOff: feedImgOff
      });
    }
    
    // MEMBER: 기업 지원 내역과 작성한 공고문 보여줌
    if (roleType === 'MEMBER') {
      roleSpecificMenus.push({
        id: 'companyApplications',
        label: '지원 내역',
        iconOn: applyImgOn,
        iconOff: applyImgOff
      });
      roleSpecificMenus.push({
        id: 'myRecruits',
        label: '작성한 공고문',
        iconOn: recruitImgOn,
        iconOff: recruitImgOff
      });
    }
    
    // ADMIN: 모든 메뉴 보여줌
    if (roleType === 'ADMIN') {
      roleSpecificMenus.push({
        id: 'studentApplications',
        label: '학생 지원 내역',
        iconOn: applyImgOn,
        iconOff: applyImgOff
      });
      roleSpecificMenus.push({
        id: 'companyApplications',
        label: '기업 지원 내역',
        iconOn: applyImgOn,
        iconOff: applyImgOff
      });
      roleSpecificMenus.push({
        id: 'myFeed',
        label: '내 피드',
        iconOn: feedImgOn,
        iconOff: feedImgOff
      });
      roleSpecificMenus.push({
        id: 'myRecruits',
        label: '작성한 공고문',
        iconOn: recruitImgOn,
        iconOff: recruitImgOff
      });
    }

    return [...baseMenus, ...roleSpecificMenus];
  };

  const menuItems = renderMenuItems();

  return (
    <div className="min-h-screen flex pt-24 bg-yellow-main">
      <div className="w-64 fixed z-10 left-0 top-16 bottom-0 bg-white p-6 z-10 overflow-y-auto">
        
        <div className="mt-4">
          <ul className="ml-2 space-y-2">
            {menuItems.map((item) => (
              <li key={item.id} className='mb-4'>
                <button 
                  className={`w-full text-left py-3 px-3 rounded-lg transition-all flex items-center ${
                    activeSubmenu === item.id 
                      ? 'shadow-[0px_0px_5px_3px_rgba(255,229,143)] text-yellow-point font-medium' 
                      : 'text-black hover:bg-gray-50'
                  }`}
                  onClick={() => handleSubmenuChange(item.id)}
                >
                  <img 
                    src={activeSubmenu === item.id ? item.iconOn : item.iconOff} 
                    alt={item.label} 
                    className="w-5 h-5 mr-2"
                  />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* 컨텐츠 영역 (메인 컨텐츠) */}
      <div className="ml-64 flex-1 p-10 w-screen">
        <div className="max-w-4xl mx-auto">
          {activeSubmenu === 'profileEdit' && <h3 className="text-4xl font-medium  mb-4">프로필 수정</h3>}
          {activeSubmenu === 'personalEdit' && <h3 className="text-4xl font-medium  mb-4">개인정보 수정</h3>}
          {activeSubmenu === 'studentApplications' && <h3 className="text-4xl font-medium  mb-4">학생 지원 내역</h3>}
          {activeSubmenu === 'companyApplications' && <h3 className="text-4xl font-medium  mb-4">기업 지원 내역</h3>}
          {activeSubmenu === 'favorites' && <h3 className="text-4xl font-medium  mb-4">즐겨찾기</h3>}
          {activeSubmenu === 'myFeed' && <h3 className="text-4xl font-medium  mb-4">내 피드</h3>}
          {activeSubmenu === 'myRecruits' && <h3 className="text-4xl font-medium  mb-4">작성한 공고문</h3>}
          <div className="bg-white rounded-2xl shadow-md p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 