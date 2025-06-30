import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserStore } from '../store/userStore';
import { getMyApplications } from '../api/application';
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import secondCategoryData from '../assets/categoryIndex/second_category.json';
import thirdCategoryData from '../assets/categoryIndex/third_category.json';

export default function ApplicationsContent() {
  const navigate = useNavigate();
  const { roleType } = UserStore();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCategoryNames = (categoryDtos) => {
    if (!categoryDtos || categoryDtos.length === 0) {
      return [];
    }

    // 대분류와 중분류가 같은 것들을 그룹화
    const groupedCategories = {};
    
    categoryDtos.forEach(dto => {
      const firstCatId = dto.firstCategory;
      const secondCatId = dto.secondCategory;
      const thirdCatId = dto.thirdCategory;

      const firstName = firstCategoryData.first_category.find(
        cat => cat.first_category_id === firstCatId
      )?.name || '';

      const secondName = secondCategoryData.second_category.find(
        cat => cat.second_category_id === secondCatId
      )?.name || '';

      const thirdName = thirdCategoryData.third_category.find(
        cat => cat.third_category_id === thirdCatId
      )?.name || '';

      const key = `${firstCatId}-${secondCatId}`;
      
      if (!groupedCategories[key]) {
        groupedCategories[key] = {
          first: firstName,
          second: secondName,
          thirds: []
        };
      }
      
      groupedCategories[key].thirds.push(thirdName);
    });

    return Object.values(groupedCategories);
  };

  const handleDetailView = (recruitId) => {
    // 여기 디테일 데이터 어떻게 불러올지 수정해야함
    navigate(`/recruitDetails/${recruitId}`);
  };

  useEffect(() => {
    const fetchApplications = async () => {
      if (roleType !== 'STUDENT') return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getMyApplications();
        console.log('지원 내역 조회 성공:', response.data);
        setApplications(response.data.result?.content || []);
      } catch (error) {
        console.error('지원 내역 조회 실패:', error);
        setError('지원 내역을 불러오는데 실패했습니다.');
        if (error.response?.status === 403) {
          setError('로그인이 필요합니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [roleType]);

  // STUDENT가 아닌 경우 빈 div 반환
  if (roleType !== 'STUDENT') {
    return <div></div>;
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">지원 내역을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {applications.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공고문 제목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">진행상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지원일</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">상세보기</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => {
                const categoryNames = getCategoryNames(app.categoryDtos);
                return (
                  <tr key={app.recruitId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{app.title}</div>
                      <div className="text-sm text-gray-500">{app.nickname}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {categoryNames.map((category, index) => (
                          <div key={index}>
                            {category.first} 
                            <br/>{'>'} {category.second} 
                            <br/>{'>'} {category.thirds.join(', ')}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${app.status === '모집 중' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{app.appliedAt}</div>
                    </td>
                    <td className="text-center text-sm font-medium">
                      <button 
                        className="hover:opacity-70 transition-opacity"
                        onClick={() => handleDetailView(app.recruitId)}
                      >
                        🔍
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">아직 지원한 프로젝트가 없습니다.</p>
        </div>
      )}
    </div>
  );
}; 