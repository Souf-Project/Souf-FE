import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NAprofileIco from '../assets/images/NAprofileIco.svg'
import NAeditInfoIco from '../assets/images/NAeditInfoIco.svg'
import NAappliIco from '../assets/images/NAappliIco.svg'

import AprofileIco from '../assets/images/AprofileIco.svg'
import AeditInfoIco from '../assets/images/AeditInfoIco.svg'
import AappliIco from '../assets/images/AappliIco.svg'

// 분리된 컴포넌트 import
import ProfileEditContent from '../components/ProfileEditContent';
import PersonalEditContent from '../components/PersonalEditContent';
import ApplicationsContent from '../components/ApplicationsContent';

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
      case 'personalEdit':
        return <PersonalEditContent />;
      case 'applications':
        return <ApplicationsContent />;
      default:
        return <ProfileEditContent />;
    }
  };

  return (
    <div className="min-h-screen flex pt-24 bg-yellow-main">
      <div className="w-64 fixed z-10 left-0 top-16 bottom-0 bg-white p-6 z-10 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">마이페이지</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-700">프로필</h3>
          <ul className="ml-2 space-y-2">
            <li>
              <button 
                className={`w-full text-left py-3 px-3 rounded-lg transition-all flex items-center ${
                  activeSubmenu === 'profileEdit' 
                    ? 'shadow-[0px_0px_5px_3px_rgba(255,229,143)] text-yellow-point font-medium' 
                    : 'text-black hover:bg-gray-50'
                }`}
                onClick={() => handleSubmenuChange('profileEdit')}
              >
                <img 
                  src={activeSubmenu === 'profileEdit' ? AprofileIco : NAprofileIco} 
                  alt="프로필 아이콘" 
                  className="w-5 h-5 mr-2"
                />
                프로필 수정
              </button>
            </li>
          </ul>
        </div>
        
        {/* 개인정보 섹션 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-700">개인정보</h3>
          <ul className="ml-2 space-y-2">
            <li>
              <button 
                className={`w-full text-left py-3 px-3 rounded-lg transition-all flex items-center ${
                  activeSubmenu === 'personalEdit' 
                    ? 'shadow-[0px_0px_5px_3px_rgba(255,229,143)] text-yellow-point font-medium' 
                    : 'text-black hover:bg-gray-50'
                }`}
                onClick={() => handleSubmenuChange('personalEdit')}
              >
                <img 
                  src={activeSubmenu === 'personalEdit' ? AeditInfoIco : NAeditInfoIco} 
                  alt="개인정보 아이콘" 
                  className="w-5 h-5 mr-2"
                />
                개인정보 수정
              </button>
            </li>
            <li>
              <button 
                className={`w-full text-left py-3 px-3 rounded-lg transition-all flex items-center ${
                  activeSubmenu === 'applications' 
                    ? 'shadow-[0px_0px_5px_3px_rgba(255,229,143)] text-yellow-point font-medium' 
                    : 'text-black hover:bg-gray-50'
                }`}
                onClick={() => handleSubmenuChange('applications')}
              >
                <img 
                  src={activeSubmenu === 'applications' ? AappliIco : NAappliIco} 
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
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 