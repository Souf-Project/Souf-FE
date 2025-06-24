import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySelectBox from '../components/categorySelectBox';
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import secondCategoryData from '../assets/categoryIndex/second_category.json';
import thirdCategoryData from '../assets/categoryIndex/third_category.json';
import { uploadRecruit } from '../api/recruit';

export default function RecruitUpload() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    region: '',
    city: '',
    deadline: '',
    deadlineTime: '00:00',
    companyName: '',
    minPayment: '',
    maxPayment: '',
    isregionIrrelevant: false,
    preferentialTreatment: '',
    hasPreference: false,
    categoryDtos: [
      {
        "firstCategory": null,
        "secondCategory": null,
        "thirdCategory": null
      },
      {
        "firstCategory": null,
        "secondCategory": null,
        "thirdCategory": null
      },
      {
        "firstCategory": null,
        "secondCategory": null,
        "thirdCategory": null
      }
    ],
    selectedCategories: [],
    files: [],
    workType: 'online',
  });

  const cityDetailData = [
    { city_detail_id: 1, name: "강남구", city_id: 1 },
    { city_detail_id: 2, name: "강동구", city_id: 1 },
    { city_detail_id: 3, name: "강북구", city_id: 1 },
    { city_detail_id: 4, name: "강서구", city_id: 1 },
    { city_detail_id: 5, name: "관악구", city_id: 1 },
    { city_detail_id: 6, name: "광진구", city_id: 1 },
    { city_detail_id: 7, name: "구로구", city_id: 1 },
    { city_detail_id: 8, name: "금천구", city_id: 1 },
    { city_detail_id: 9, name: "노원구", city_id: 1 },
    { city_detail_id: 10, name: "도봉구", city_id: 1 },
    { city_detail_id: 11, name: "동대문구", city_id: 1 },
    { city_detail_id: 12, name: "동작구", city_id: 1 },
    { city_detail_id: 13, name: "마포구", city_id: 1 },
    { city_detail_id: 14, name: "서대문구", city_id: 1 },
    { city_detail_id: 15, name: "서초구", city_id: 1 },
    { city_detail_id: 16, name: "성동구", city_id: 1 },
    { city_detail_id: 17, name: "성북구", city_id: 1 },
    { city_detail_id: 18, name: "송파구", city_id: 1 },
    { city_detail_id: 19, name: "양천구", city_id: 1 },
    { city_detail_id: 20, name: "영등포구", city_id: 1 },
    { city_detail_id: 21, name: "용산구", city_id: 1 },
    { city_detail_id: 22, name: "은평구", city_id: 1 },
    { city_detail_id: 23, name: "종로구", city_id: 1 },
    { city_detail_id: 24, name: "중구", city_id: 1 },
    { city_detail_id: 25, name: "중랑구", city_id: 1 },
    { city_detail_id: 26, name: "지역 무관", city_id: 1 },
    { city_detail_id: 27, name: "고양", city_id: 2 },
    { city_detail_id: 28, name: "수원역", city_id: 2 },
    { city_detail_id: 29, name: "동수원", city_id: 2 },
    { city_detail_id: 30, name: "성남", city_id: 2 },
    { city_detail_id: 31, name: "부천", city_id: 2 },
    { city_detail_id: 32, name: "용인", city_id: 2 },
    { city_detail_id: 33, name: "김포", city_id: 2 },
    { city_detail_id: 34, name: "파주", city_id: 2 },
    { city_detail_id: 35, name: "안산", city_id: 2 },
    { city_detail_id: 36, name: "안양", city_id: 2 },
    { city_detail_id: 37, name: "화성", city_id: 2 },
    { city_detail_id: 38, name: "남양주", city_id: 2 },
    { city_detail_id: 39, name: "의정부", city_id: 2 },
    { city_detail_id: 40, name: "하남", city_id: 2 },
    { city_detail_id: 41, name: "여주", city_id: 2 },
    { city_detail_id: 42, name: "포천", city_id: 2 },
    { city_detail_id: 43, name: "지역 무관", city_id: 2 },
  ];

  const cityData = [
    { city_id: 1, name: "서울"},
    { city_id: 2, name: "경기"}
  ];
  

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      const fileArray = Array.from(files);
      
      const validateImageSize = async (file) => {
        if (!file.type.startsWith('image/')) {
          return true;
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
      // selectedCategories 배열에서 유효한 카테고리만 필터링
      const categoryDtos = formData.selectedCategories
        .filter(category => 
          category && 
          category.firstCategory && 
          category.secondCategory && 
          category.thirdCategory
        )
        .map(category => ({
          firstCategory: category.firstCategory,
          secondCategory: category.secondCategory,
          thirdCategory: category.thirdCategory
        }));
      
      // 카테고리 검증
      if (categoryDtos.length === 0) {
        alert('카테고리를 선택해주세요.');
        return;
      }

      console.log('Selected categories:', categoryDtos);

      let cityId = null;
      let cityDetailId = null;
  
      if (formData.isregionIrrelevant) {
        // 지역무관 선택 시
        cityId = 3;
        cityDetailId = 43;
      } else {
        if (formData.city === '서울') {
          cityId = 1;
        } else if (formData.city === '경기') {
          cityId = 2;
        }
  
        const cityDetail = cityDetailData.find((detail) => detail.name === formData.region);
        cityDetailId = cityDetail ? cityDetail.city_detail_id : null;
      }
  
      const deadlineDateTime = `${formData.deadline}T${formData.deadlineTime}`;
  
      const formDataToSend = {
        title: formData.title,
        content: formData.content,
        cityId: cityId,
        cityDetailId: cityDetailId,
        deadline: deadlineDateTime,
        minPayment: `${formData.minPayment}만원`,
        maxPayment: `${formData.maxPayment}만원`,
        preferentialTreatment: formData.hasPreference ? formData.preferentialTreatment : '',
        categoryDtos: categoryDtos,
        originalFileNames: formData.files.map((file) => file.name),
        workType: formData.workType.toUpperCase(),
      };
  
      console.log('Sending data:', formDataToSend);
      await uploadRecruit(formDataToSend);
      alert('공고가 성공적으로 등록되었습니다.');
      navigate('/recruit?category=1');
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

  // 첫 번째 카테고리 선택 핸들러
  const handleFirstCategory = (categoryData) => {
    console.log('첫 번째 카테고리 선택:', categoryData);
    if (categoryData && categoryData.firstCategory && categoryData.secondCategory && categoryData.thirdCategory) {
      const newCategory = {
        firstCategory: parseInt(categoryData.firstCategory),
        secondCategory: parseInt(categoryData.secondCategory),
        thirdCategory: parseInt(categoryData.thirdCategory)
      };
      
      // NaN 체크
      if (isNaN(newCategory.firstCategory) || isNaN(newCategory.secondCategory) || isNaN(newCategory.thirdCategory)) {
        console.error('카테고리 값이 유효하지 않습니다:', newCategory);
        alert('카테고리 선택에 문제가 있습니다. 다시 선택해주세요.');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        selectedCategories: [newCategory, ...prev.selectedCategories.slice(1, 3)]
      }));
    }
  };

  // 두 번째 카테고리 선택 핸들러
  const handleSecondCategory = (categoryData) => {
    console.log('두 번째 카테고리 선택:', categoryData);
    if (categoryData && categoryData.firstCategory && categoryData.secondCategory && categoryData.thirdCategory) {
      const newCategory = {
        firstCategory: parseInt(categoryData.firstCategory),
        secondCategory: parseInt(categoryData.secondCategory),
        thirdCategory: parseInt(categoryData.thirdCategory)
      };
      
      // NaN 체크
      if (isNaN(newCategory.firstCategory) || isNaN(newCategory.secondCategory) || isNaN(newCategory.thirdCategory)) {
        console.error('카테고리 값이 유효하지 않습니다:', newCategory);
        alert('카테고리 선택에 문제가 있습니다. 다시 선택해주세요.');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        selectedCategories: [prev.selectedCategories[0], newCategory, prev.selectedCategories[2]]
      }));
    }
  };

  // 세 번째 카테고리 선택 핸들러
  const handleThirdCategory = (categoryData) => {
    console.log('세 번째 카테고리 선택:', categoryData);
    if (categoryData && categoryData.firstCategory && categoryData.secondCategory && categoryData.thirdCategory) {
      const newCategory = {
        firstCategory: parseInt(categoryData.firstCategory),
        secondCategory: parseInt(categoryData.secondCategory),
        thirdCategory: parseInt(categoryData.thirdCategory)
      };
      
      // NaN 체크
      if (isNaN(newCategory.firstCategory) || isNaN(newCategory.secondCategory) || isNaN(newCategory.thirdCategory)) {
        console.error('카테고리 값이 유효하지 않습니다:', newCategory);
        alert('카테고리 선택에 문제가 있습니다. 다시 선택해주세요.');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        selectedCategories: [prev.selectedCategories[0], prev.selectedCategories[1], newCategory]
      }));
    }
  };

  // 카테고리 데이터 배열 추출
  const firstCategories = firstCategoryData.first_category || [];
  const secondCategories = secondCategoryData.second_category || [];
  const thirdCategories = thirdCategoryData.third_category || [];

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
                name="minPayment"
                value={formData.minPayment}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
                required
              />
            </div>
            <span className="text-gray-500">~</span>
            <div className="flex-1">
              <input
                type="number"
                name="maxPayment"
                value={formData.maxPayment}
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
            <div className="flex gap-2">
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={formData.isregionIrrelevant}
                className={`w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent bg-white ${
                  formData.isregionIrrelevant ? 'bg-gray-100' : ''
                }`}
                required={!formData.isregionIrrelevant}
              >
                <option value="">시/도 선택</option>
                {cityData.map(city => (
                  <option key={city.city_id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                disabled={formData.isregionIrrelevant}
                className={`w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent bg-white ${
                  formData.isregionIrrelevant ? 'bg-gray-100' : ''
                }`}
                required={!formData.isregionIrrelevant}
              >
                <option value="">지역 선택</option>
                {cityDetailData
                  .filter(detail => detail.city_id === cityData.find(city => city.name === formData.city)?.city_id)
                  .map(detail => (
                    <option key={detail.city_detail_id} value={detail.name}>
                      {detail.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
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
            <label className="block text-xl font-semibold text-gray-700 mb-2">
              모집 시간
            </label>
            <input
              type="time"
              name="deadlineTime"
              value={formData.deadlineTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
              required
            />
          </div>
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
          <div className="grid grid-cols-3 gap-4 mb-4">
          <CategorySelectBox 
            title="카테고리 선택"
            content=""
            defaultValue={formData.categoryDtos}
            type="join"
            onChange={handleFirstCategory}
            isEditing={true}
          />
          <CategorySelectBox 
            title="카테고리 선택"
            content=""
            defaultValue={formData.categoryDtos}
            type="join"
            onChange={handleSecondCategory}
            isEditing={true}
          />
          <CategorySelectBox 
            title="카테고리 선택"
            content=""
            defaultValue={formData.categoryDtos}
            type="join"
            onChange={handleThirdCategory}
            isEditing={true}
          />
            </div>
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
            onClick={() => navigate('/recruit?category=1')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors duration-200"
          >
            취소
          </button>
          
        </div>
      </form>
    </div>
  );
} 