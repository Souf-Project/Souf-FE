import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserStore } from '../../store/userStore';
import { getApplicantsByRecruitId } from '../../api/application';
import { getMyRecruits } from '../../api/recruit';
import firstCategoryData from '../../assets/categoryIndex/first_category.json';
import secondCategoryData from '../../assets/categoryIndex/second_category.json';
import thirdCategoryData from '../../assets/categoryIndex/third_category.json';
import StudentInfoBlock from '../studentInfoBlock';

export default function CompanyApplicants({ recruitId }) {
  const params = useParams();
  const navigate = useNavigate();
  const { roleType } = UserStore();
  const [applicants, setApplicants] = useState([]);
  const [recruits, setRecruits] = useState([]);
  const [selectedRecruitId, setSelectedRecruitId] = useState(recruitId || params.recruitId);
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day}<br>${hours}:${minutes}`;
  };

  // 작성한 공고문 리스트 조회
  useEffect(() => {
    const fetchRecruits = async () => {
      if (roleType !== 'MEMBER') return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getMyRecruits();
        console.log('내 공고문 조회 성공:', response.data);
        setRecruits(response.data.result?.content || []);
        
        // recruitId가 props로 전달된 경우 해당 공고문을 기본 선택
        if (recruitId && !selectedRecruitId) {
          setSelectedRecruitId(recruitId);
        }
      } catch (error) {
        console.error('내 공고문 조회 실패:', error);
        setError('내 공고문을 불러오는데 실패했습니다.');
        if (error.response?.status === 403) {
          setError('로그인이 필요합니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecruits();
  }, [roleType, recruitId]);

  // 선택된 공고문의 지원자 리스트 조회
  useEffect(() => {
    const fetchApplicants = async () => {
      if (roleType !== 'MEMBER' || !selectedRecruitId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getApplicantsByRecruitId(selectedRecruitId);
        console.log('지원자 리스트 조회 성공:', response.data);
        setApplicants(response.data.result?.content || []);
      } catch (error) {
        console.error('지원자 리스트 조회 실패:', error);
        setError('지원자 리스트를 불러오는데 실패했습니다.');
        if (error.response?.status === 403) {
          setError('권한이 없습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [roleType, selectedRecruitId]);

  // MEMBER가 아닌 경우 빈 div 반환
  if (roleType !== 'MEMBER') {
    return <div></div>;
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">데이터를 불러오는 중...</p>
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

  const selectedRecruit = recruits.find(recruit => recruit.recruitId === selectedRecruitId);

  return (
    <div>
      {!selectedRecruitId ? (
        // 공고문 리스트 보기
        <div>
          <h2 className="text-2xl font-bold mb-6">지원자 리스트를 확인할 공고문을 선택하세요</h2>
          {recruits.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공고문 제목</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">진행상태</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지원자 수</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마감 기한</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recruits.map((recruit) => {
                    const categoryNames = getCategoryNames(recruit.categoryDtos);
                    return (
                      <tr key={recruit.recruitId} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedRecruitId(recruit.recruitId)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{recruit.title}</div>
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
                            ${recruit.status === '모집 중' ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {recruit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{recruit.recruitCount || 0}명</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: formatDate(recruit.deadline) }}></div>
                        </td>
                       
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">아직 작성한 공고문이 없습니다.</p>
            </div>
          )}
        </div>
      ) : (
        // 선택된 공고문의 지원자 리스트 보기
        <div>
         
          <button 
              className="text-gray-600 hover:text-gray-900 transition-colors mb-4"
              onClick={() => setSelectedRecruitId(null)}
            >
              ← 공고문 목록으로 돌아가기
            </button>
            <h2 className="text-2xl font-bold mb-4">지원자 리스트</h2>
           
          
          {selectedRecruit && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 flex justify-between items-center">
              <span className="text-lg font-semibold mb-2">{selectedRecruit.title}</span>
              <span className="text-gray-600"></span>
              <span className="text-gray-600">지원자 수: {applicants.length}명</span>
            </div>
          )}

          {applicants.length > 0 ? (
            <div className="grid grid-cols-2 gap-6">
              {applicants.map((applicant) => (
                <StudentInfoBlock key={applicant.applicationId} applicant={applicant} type="applicant" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">아직 지원자가 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
