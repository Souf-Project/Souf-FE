import React from 'react';

export default function StudentInfoBlock({ applicant, type = 'favorite' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        {/* 프로필 사진 및 스프온도 */}
        <div className="flex-shrink-0">
          <img 
            src={applicant.member?.profileImageUrl || '/src/assets/images/BasicProfileImg1.png'} 
            alt="프로필 사진" 
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              e.target.src = '/src/assets/images/BasicProfileImg1.png';
            }}
          />
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600 mr-2">스프온도:</span>
            <div className="flex items-center">
              <span className="text-lg font-bold text-orange-500 mr-1">
                {applicant.member?.temperature || 0}
              </span>
              <span className="text-sm text-gray-500">°C</span>
            </div>
          </div>
        </div>
        
        {/* 지원자 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-semibold ">
              {applicant.member?.nickname}
            </h3>
            {type === 'applicant' && (
              <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                ${applicant.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                  applicant.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'}`}>
                {applicant.status === 'PENDING' ? '검토중' : 
                 applicant.status === 'ACCEPTED' ? '합격' : '불합격'}
              </span>
            )}
          </div>
          
          {/* 소개글 */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {applicant.member?.intro || '소개글이 없습니다.'}
          </p>
          
          {/* 피드 사진 (applicant 타입일 때만) .. api 수정 후 피드 불러오도록 해야함 */}
          {type === 'applicant' && applicant.member?.feed && applicant.member.feed.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">작품</h4>
              <div className="flex space-x-2 overflow-x-auto">
                {applicant.member.feed.slice(0, 3).map((work, index) => (
                  <img 
                    key={index}
                    src={work.workImageUrl || work.imageUrl || '/src/assets/images/BasicProfileImg1.png'} 
                    alt={`작품 ${index + 1}`}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/src/assets/images/BasicProfileImg1.png';
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* 지원일 (applicant 타입일 때만) */}
          {type === 'applicant' && (
            <div className="text-xs text-gray-500">
              지원일: {applicant.appliedAt}
            </div>
          )}
          
        
        </div>
      </div>
    </div>
  );
} 