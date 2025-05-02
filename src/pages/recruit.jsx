import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Recruit() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [activeTab, setActiveTab] = useState('recruit'); // 'recruit' 또는 'profile'

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  return (
    <div className="p-6">
      <div className="flex justify-center gap-4 mb-8">
        <button
          className={`px-6 py-3 rounded-lg font-extrabold transition-colors duration-200 relative group ${
            activeTab === 'recruit'
              ? 'text-yellow-point'
              : 'text-gray-700'
          }`}
          onClick={() => setActiveTab('recruit')}
        >
          <span>기업 공고문</span>
          <span 
            className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
              activeTab === 'recruit' 
                ? 'w-3/4' 
                : 'w-0 group-hover:w-3/4'
            }`}
          ></span>
        </button>
        <button
          className={`px-6 py-3 rounded-lg font-extrabold transition-colors duration-200 relative group ${
            activeTab === 'profile'
              ? 'text-yellow-point'
              : 'text-gray-700'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          <span>대학생 프로필</span>
          <span 
            className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-[3px] bg-yellow-point transition-all duration-300 ease-out ${
              activeTab === 'profile' 
                ? 'w-3/4' 
                : 'w-0 group-hover:w-3/4'
            }`}
          ></span>
        </button>
      </div>
      {activeTab === 'recruit' ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          기업 공고문 내용
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          대학생 프로필 내용
        </div>
      )}
    </div>
  );
}
