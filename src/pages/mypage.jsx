import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import profileIcon from '../assets/images/profileIcon.svg'
import starIcon from '../assets/images/starIcon.svg'
import applyIcon from '../assets/images/applyIcon.svg'
import feedIcon from '../assets/images/feedIcon.svg'
import inquiryIcon from '../assets/images/inquiryIcon.svg'

import ProfileEditContent from '../components/mypage/ProfileEditContent';
import ApplicationsContent from '../components/mypage/ApplicationsContent';
import FavoritesContent from '../components/mypage/FavoritesContent';
import InquiryContent from '../components/mypage/inquiryContent';
import CompanyApplicants from '../components/companyMyPage/companyApplicants';
import { UserStore } from '../store/userStore';
import MyFeed from '../components/mypage/myFeed';

export default function MyPage() {
  // const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState('profileEdit');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const { roleType } = UserStore();

  // 서브메뉴 변경 핸들러
  const handleSubmenuChange = (submenu) => {
    setActiveSubmenu(submenu);
    // 모바일에서 메뉴 클릭 시 사이드바 닫기
    setIsSidebarOpen(false);
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
        return <MyFeed/>;
      case 'inquiry':
        return <InquiryContent/>;
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
        icon: profileIcon
      },
      {
        id: 'favorites',
        label: '내 즐겨찾기',
        icon: starIcon
      },
      {
        id: 'inquiry',
        label: '문의 내역',
        icon: inquiryIcon
      }
    ];

    const roleSpecificMenus = [];

    // STUDENT: 내 지원 내역과 내 피드 보여줌
    if (roleType === 'STUDENT') {
      roleSpecificMenus.push({
        id: 'studentApplications',
        label: '지원 내역',
        icon: applyIcon
      });
      roleSpecificMenus.push({
        id: 'myFeed',
        label: '내 피드',
        icon: feedIcon
      });
    }
    
    // MEMBER: 기업 지원 내역 보여줌
    if (roleType === 'MEMBER') {
      roleSpecificMenus.push({
        id: 'companyApplications',
        label: '지원 내역',
        icon: applyIcon
      });
     
    }
    
    // ADMIN: 모든 메뉴 보여줌
    if (roleType === 'ADMIN') {
      roleSpecificMenus.push({
        id: 'studentApplications',
        label: '학생 지원 내역',
        icon: applyIcon
      });
      roleSpecificMenus.push({
        id: 'companyApplications',
        label: '기업 지원 내역',
        icon: applyIcon
      });
      roleSpecificMenus.push({
        id: 'myFeed',
        label: '내 피드',
        icon: feedIcon
      });
      
    }

    return [...baseMenus, ...roleSpecificMenus];
  };

  const menuItems = renderMenuItems();

  return (
    <div className="min-h-screen w-screen bg-white pb-24">
      {/* 모바일 메뉴 버튼 */}
      <button
        className="lg:hidden fixed top-20 left-4 z-30 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 모바일 오버레이 */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[35]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 모바일 사이드바 */}
      <div className={`lg:hidden fixed w-60 z-40 left-0 top-0 bottom-0 bg-white p-6 overflow-y-auto transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="mt-20">
          <ul className="ml-2 space-y-2">
            {menuItems.map((item) => (
              <li key={item.id} className='mb-4'>
              <button 
                className={`w-full text-left py-3 px-3 rounded-lg transition-all flex items-center ${
                    activeSubmenu === item.id 
                    ? 'shadow-[0px_0px_5px_3px_rgba(92,161,232,1.00)] text-blue-main font-medium' 
                    : 'text-black hover:bg-gray-50'
                }`}
                  onClick={() => handleSubmenuChange(item.id)}
              >
                <img 
                    src={item.icon} 
                    alt={item.label} 
                    className={`w-5 h-5 mr-2 ${
                      activeSubmenu === item.id 
                        ? '' 
                        : 'brightness-0'
                    }`}
                />
                  {item.label}
              </button>
            </li>
            ))}
          </ul>
        </div>
      </div>

      {/* PC 레이아웃 */}
      <div className="hidden lg:flex w-full max-w-[60rem] mx-auto pt-12">
        {/* PC 사이드바 */}
        <div className="min-w-52 bg-white p-6 mr-6 rounded-2xl shadow-md h-fit">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id} className='mb-4'>
              <button 
                className={`w-full text-left py-3 px-3 rounded-lg transition-all flex items-center ${
                    activeSubmenu === item.id 
                    ? 'shadow-[0px_0px_5px_3px_rgba(92,161,232,1.00)] text-blue-main font-medium' 
                    : 'text-black hover:bg-gray-50'
                }`}
                  onClick={() => handleSubmenuChange(item.id)}
              >
                <img 
                    src={item.icon} 
                    alt={item.label} 
                    className={`w-5 h-5 mr-2 ${
                      activeSubmenu === item.id 
                        ? '' 
                        : 'brightness-0'
                    }`}
                />
                  {item.label}
              </button>
            </li>
            ))}
          </ul>
        </div>
        
        {/* PC 컨텐츠 영역 */}
        <div className="flex-1">

          <div className="bg-white rounded-2xl shadow-md p-8">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* 모바일 컨텐츠 영역 */}
      <div className="lg:hidden w-full px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          {activeSubmenu === 'profileEdit' && <h3 className="text-4xl font-medium mb-4">프로필 수정</h3>}
          {activeSubmenu === 'personalEdit' && <h3 className="text-4xl font-medium mb-4">개인정보 수정</h3>}
          {activeSubmenu === 'studentApplications' && <h3 className="text-4xl font-medium mb-4">학생 지원 내역</h3>}
          {activeSubmenu === 'companyApplications' && <h3 className="text-4xl font-medium mb-4">기업 지원 내역</h3>}
          {activeSubmenu === 'favorites' && <h3 className="text-4xl font-medium mb-4">즐겨찾기</h3>}
          {activeSubmenu === 'myFeed' && <h3 className="text-4xl font-medium mb-4">내 피드</h3>}
          {activeSubmenu === 'inquiry' && <h3 className="text-4xl font-medium mb-4">문의 내역</h3>}
          <div className="bg-white rounded-2xl shadow-md p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 