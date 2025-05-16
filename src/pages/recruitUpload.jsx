import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecruitUpload() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    minSalary: '',
    maxSalary: '',
    workType: 'online', // 'online' 또는 'offline'
    location: '',
    isLocationIrrelevant: false,
    deadline: '',
    hasPreferences: false,
    preferences: '',
    category: '',
    content: '',
    files: []
  });

  const locations = [
    '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
    '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
    '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
  ];

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        files: Array.from(files)
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        // 지역 무관 체크 시 지역 선택 초기화
        ...(name === 'isLocationIrrelevant' && checked ? { location: '' } : {})
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 API 연동
    console.log('Form submitted:', formData);
    navigate('/recruit');
  };

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">공고문 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              공고문 제목
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기업명
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최소 급여
            </label>
            <input
              type="number"
              name="minSalary"
              value={formData.minSalary}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최대 급여
            </label>
            <input
              type="number"
              name="maxSalary"
              value={formData.maxSalary}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              근무 형태
            </label>
            <select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
            >
              <option value="online">온라인</option>
              <option value="offline">오프라인</option>
              <option value="hybrid">하이브리드</option>
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                지역
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isLocationIrrelevant"
                  checked={formData.isLocationIrrelevant}
                  onChange={handleChange}
                  className="w-4 h-4 text-yellow-point focus:ring-yellow-point border-gray-300 rounded"
                />
                <label className="text-sm text-gray-600">지역 무관</label>
              </div>
            </div>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={formData.isLocationIrrelevant}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent ${
                formData.isLocationIrrelevant ? 'bg-gray-100' : ''
              }`}
              required={!formData.isLocationIrrelevant}
            >
              <option value="">지역 선택</option>
              {locations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            모집 기한
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
            required
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              name="hasPreferences"
              checked={formData.hasPreferences}
              onChange={handleChange}
              className="w-4 h-4 text-yellow-point focus:ring-yellow-point border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              우대사항 유무
            </label>
          </div>
          {formData.hasPreferences && (
            <textarea
              name="preferences"
              value={formData.preferences}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
              required
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
            required
          >
            <option value="">카테고리 선택</option>
            <option value="디지털 콘텐츠 & 그래픽 디자인">디지털 콘텐츠 & 그래픽 디자인</option>
            <option value="순수미술 & 일러스트">순수미술 & 일러스트</option>
            <option value="사진 & 영상 & 영화">사진 & 영상 & 영화</option>
            <option value="공예 & 제작">공예 & 제작</option>
            <option value="음악 & 음향">음악 & 음향</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            공고문 내용
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            파일 첨부
          </label>
          <input
            type="file"
            name="files"
            onChange={handleChange}
            multiple
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/recruit')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors duration-200"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-yellow-point text-white rounded-lg font-bold hover:bg-yellow-600 transition-colors duration-200"
          >
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
} 