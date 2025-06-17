import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySelectBox from '../components/categorySelectBox';
// import { uploadRecruit } from '../api/recruit';

export default function RecruitUpload() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    region: '',
    deadline: '',
    companyName: '',
    minpayment: '',
    maxpayment: '',
    workType: 'online',
    isregionIrrelevant: false,
    preferentialTreatment: '',
    categoryDtos: {
      firstCategory: null,
      secondCategory: null,
      thirdCategory: null
    },
    
    originalFileNames: []
  });

  const regions = [
    '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
    '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
    '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
  ];

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      const fileArray = Array.from(files);
      
      const validateImageSize = async (file) => {
        if (!file.type.startsWith('image/')) {
          return true; // 이미지가 아닌 파일은 그대로 허용
        }

        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const isValid = img.width <= 1080 && img.height <= 1080;
            if (!isValid) {
              alert(`${file.name}의 크기가 1080x1080px를 초과합니다.`);
            }
            resolve(isValid);
          };
          img.onerror = () => {
            alert(`${file.name} 파일을 읽을 수 없습니다.`);
            resolve(false);
          };
          img.src = URL.createObjectURL(file);
        });
      };


      Promise.all(fileArray.map(validateImageSize))
        .then(results => {
          const validFiles = fileArray.filter((_, index) => results[index]);
          setFormData(prev => ({
            ...prev,
            files: validFiles
          }));
        });
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        // 지역 무관 체크 시 지역 선택 초기화
        ...(name === 'isregionIrrelevant' && checked ? { region: '' } : {})
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = {
        title: formData.title,
        content: formData.content,
        region: formData.isregionIrrelevant ? "지역 무관" : formData.region,
        deadline: new Date(formData.deadline).toISOString(),
        payment: `${formData.minpayment}~${formData.maxpayment}만원`,
        preferentialTreatment: formData.hasPreference ? formData.preferentialTreatment : "",
        categoryDtos: [formData.category],
        originalFileNames: formData.files.map(file => file.name)
      };

      // await uploadRecruit(formDataToSend);
      alert('공고가 성공적으로 등록되었습니다.');
      navigate('/recruit');
    } catch (error) {
      console.error('공고 등록 중 오류 발생:', error);
      alert('공고 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCategoryChange = (categoryData) => {
    setFormData(prev => ({
      ...prev,
      category: categoryData
    }));
  };

  return (
    <div className="pt-24 px-6 w-1/2 max-w-5xl mx-auto mb-12">
      <h1 className="text-3xl font-bold w-1/4 mx-auto">공고문 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">
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
          <label className="block text-xl font-semibold text-gray-700 mb-2">
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

        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">
            급여
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <input
                type="number"
                name="minpayment"
                value={formData.minpayment}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
                required
              />
            </div>
            <span className="text-gray-500">~</span>
            <div className="flex-1">
              <input
                type="number"
                name="maxpayment"
                value={formData.maxpayment}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
                required
              />
            </div>
            <span className="text-gray-500 whitespace-nowrap">만원</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-2">
              근무 형태
            </label>
            <select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent bg-white"
            >
              <option value="online">온라인</option>
              <option value="offline">오프라인</option>
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xl font-semibold text-gray-700">
                지역
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isregionIrrelevant"
                  checked={formData.isregionIrrelevant}
                  onChange={handleChange}
                  className="w-4 h-4 text-yellow-point focus:ring-yellow-point border-gray-300 rounded "
                />
                <label className="text-xl text-gray-600">지역 무관</label>
              </div>
            </div>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              disabled={formData.isregionIrrelevant}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent bg-white ${
                formData.isregionIrrelevant ? 'bg-gray-100' : ''
              }`}
              required={!formData.isregionIrrelevant}
            >
              <option value="">지역 선택</option>
              {regions.map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">
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
              name="hasPreference"
              checked={formData.hasPreference}
              onChange={handleChange}
              className="w-4 h-4 text-yellow-point focus:ring-yellow-point border-gray-300 rounded"
            />
            <label className="text-xl font-semibold text-gray-700">
              우대사항 유무
            </label>
          </div>
          {formData.hasPreference && (
            <textarea
              name="preferentialTreatment"
              value={formData.preferentialTreatment}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
              required
            />
          )}
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">
            카테고리
          </label>
          <CategorySelectBox 
            title="카테고리 선택"
            content=""
            defaultValue={formData.categoryDtos}
            type="join"
            onChange={handleCategoryChange}
            isEditing={true}
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">
            공고문 내용
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">
            파일 첨부
          </label>
          <input
            type="file"
            name="files"
            onChange={handleChange}
            multiple
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            이미지 파일은 1080x1080px 이하로 업로드해주세요.
          </p>
        </div>

        <div className="flex gap-4 items-center justify-center">
        <button
            type="submit"
            className="px-6 py-3 bg-yellow-main text-black rounded-lg font-bold hover:bg-yellow-600 transition-colors duration-200"
          >
            업로드
          </button>
          <button
            type="button"
            onClick={() => navigate('/recruit')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors duration-200"
          >
            취소
          </button>
          
        </div>
      </form>
    </div>
  );
} 