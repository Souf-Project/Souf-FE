import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImgOff from '../assets/images/profileImgOff.svg'
import applyImgOff from '../assets/images/applyImgOff.svg'
import starImgOn from "../assets/images/starImgOn.png"
import feedImgOn from "../assets/images/feedImgOn.png"

import profileImgOn from '../assets/images/profileImgOn.svg'
import applyImgOn from '../assets/images/applyImgOn.svg'
import starImgOff from "../assets/images/starImgOff.png"
import feedImgOff from "../assets/images/feedImgOff.png"

// 분리된 컴포넌트 import
import ProfileEditContent from '../components/ProfileEditContent';
import ApplicationsContent from '../components/ApplicationsContent';
import FavoritesContent from '../components/FavoritesContent';

export default function MyPage() {
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState('profileEdit'); // 기본 서브메뉴

  // 서브메뉴 변경 핸들러
  const handleSubmenuChange = (submenu) => {
    setActiveSubmenu(submenu);
  };

  // 서브메뉴에 따른 컴포넌트 렌더링
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'profileEdit':
        return <ProfileEditContent />;
      case 'applications':
        return <ApplicationsContent />;
      case 'favorites':
        return <FavoritesContent />;
      default:
        return <ProfileEditContent />;
    }
  };

  return (
    <div className="min-h-screen flex pt-24 bg-yellow-main">
      <div className="w-64 fixed z-10 left-0 top-16 bottom-0 bg-white p-6 z-10 overflow-y-auto">
        
        <div className="mt-4">
          <ul className="ml-2 space-y-2">
            <li className='mb-4'>
              <button 
                className={`w-full text-left py-3 px-3 rounded-lg transition-all flex items-center ${
                  activeSubmenu === 'profileEdit' 
                    ? 'shadow-[0px_0px_5px_3px_rgba(255,229,143)] text-yellow-point font-medium' 
                    : 'text-black hover:bg-gray-50'
                }`}
                onClick={() => handleSubmenuChange('profileEdit')}
              >
                <img 
                  src={activeSubmenu === 'profileEdit' ? profileImgOn : profileImgOff} 
                  alt="프로필 아이콘" 
                  className="w-5 h-5 mr-2"
                />
                프로필 수정
              </button>
            </li>
            <li className='mb-4'>
              <button 
                className={`w-full text-left py-3 px-3 rounded-lg transition-all flex items-center ${
                  activeSubmenu === 'favorites' 
                    ? 'shadow-[0px_0px_5px_3px_rgba(255,229,143)] text-yellow-point font-medium' 
                    : 'text-black hover:bg-gray-50'
                }`}
                onClick={() => handleSubmenuChange('favorites')}
              >
                <img 
                  src={activeSubmenu === 'favorites' ? starImgOn : starImgOff} 
                  alt="즐겨찾기 아이콘" 
                  className="w-5 h-5 mr-2"
                />
                내 즐겨찾기
              </button>
            </li>
            
            <li className='mb-4'>
              <button 
                className={`w-full text-left py-3 px-3 rounded-lg transition-all flex items-center ${
                  activeSubmenu === 'applications' 
                    ? 'shadow-[0px_0px_5px_3px_rgba(255,229,143)] text-yellow-point font-medium' 
                    : 'text-black hover:bg-gray-50'
                }`}
                onClick={() => handleSubmenuChange('applications')}
              >
                <img 
                  src={activeSubmenu === 'applications' ? applyImgOn : applyImgOff} 
                  alt="지원내역 아이콘" 
                  className="w-5 h-5 mr-2"
                />
                지원 내역
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      {/* 컨텐츠 영역 (메인 컨텐츠) */}
      <div className="ml-64 flex-1 p-10 w-screen">
        <div className="max-w-4xl mx-auto">
          {activeSubmenu === 'profileEdit' && <h3 className="text-4xl font-medium  mb-4">프로필 수정</h3>}
          {activeSubmenu === 'personalEdit' && <h3 className="text-4xl font-medium  mb-4">개인정보 수정</h3>}
          {activeSubmenu === 'applications' && <h3 className="text-4xl font-medium  mb-4">지원 내역</h3>}
          {activeSubmenu === 'favorites' && <h3 className="text-4xl font-medium  mb-4">즐겨찾기</h3>}
          <div className="bg-white rounded-2xl shadow-md p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 