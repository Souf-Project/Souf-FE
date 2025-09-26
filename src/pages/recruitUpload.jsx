import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CategorySelectBox from '../components/categorySelectBox';
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import secondCategoryData from '../assets/categoryIndex/second_category.json';
import thirdCategoryData from '../assets/categoryIndex/third_category.json';
import { uploadRecruit, uploadToS3, postRecruitMedia, updateRecruit } from '../api/recruit';
import { UserStore } from '../store/userStore';
import { filterEmptyCategories } from '../utils/filterEmptyCategories';
import Loading from '../components/loading';
import StepIndicator from '../components/StepIndicator';
import infoIcon from '../assets/images/infoIcon.svg';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export default function RecruitUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nickname } = UserStore();
  
  const isEditMode = location.state?.isEditMode || false;
  const editData = location.state?.recruitDetail || location.state?.recruitData;
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [estimateType, setEstimateType] = useState('fixed');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // 급여 파싱 함수
  const parsePrice = (priceString) => {
    if (!priceString || typeof priceString !== 'string') return '';
    let numStr = priceString.replace(/[^0-9.]/g, '');
    return numStr;
  };

  // 12시간 형식을 24시간 형식으로 변환하는 함수
  const convertTo24HourFormat = (hour, minute, period) => {
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    return `${hour24.toString().padStart(2, '0')}:${minute}`;
  };

  const parseDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: '', hour: '01', minute: '00', period: 'AM' };
    
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    const dateStr = `${year}-${month}-${day}`;
    const hourStr = hours === 0 ? '12' : hours > 12 ? String(hours - 12).padStart(2, '0') : String(hours).padStart(2, '0');
    const minuteStr = String(Math.floor(minutes / 5) * 5).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    
    return { date: dateStr, hour: hourStr, minute: minuteStr, period };
  };
  
  const [formData, setFormData] = useState(() => {
    if (isEditMode && editData) {
      const startDateTime = parseDateTime(editData.startDate);
      const deadlineDateTime = parseDateTime(editData.deadline);
      return {
        title: editData.title || '',
        content: editData.content || '',
        region: editData.cityDetailName || '',
        city: editData.cityName || '',
        startDate: startDateTime.date,
        startDateHour: startDateTime.hour,
        startDateMinute: startDateTime.minute,
        startDatePeriod: startDateTime.period,
        deadline: deadlineDateTime.date,
        deadlineHour: deadlineDateTime.hour,
        deadlineMinute: deadlineDateTime.minute,
        deadlinePeriod: deadlineDateTime.period,
        companyName: editData.nickname || nickname || '',
        price: parsePrice(editData.price),
        isregionIrrelevant: !editData.cityName || editData.cityName === '지역 무관',
        preferentialTreatment: editData.preferentialTreatment || '',
        preferentialKeyword1: editData.preferentialKeyword1 || '',
        preferentialKeyword2: editData.preferentialKeyword2 || '',
        hasPreference: !!editData.preferentialTreatment,
        logoUrl: editData.logoUrl || '',
        logoFile: null,
        companyDescription: editData.companyDescription || '',
        briefIntroduction: editData.briefIntroduction || '',
        estimatePayment: editData.estimatePayment || '',
        contractMethod: editData.contractMethod || '',
        startDate: editData.startDate || '',
        categoryDtos: editData.categoryDtoList?.map(cat => ({
          firstCategory: cat.firstCategory,
          secondCategory: cat.secondCategory,
          thirdCategory: cat.thirdCategory
        })) || [
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
        files: [],
        workType: editData.workType?.toLowerCase() || 'online',
      };
    } else {
      return {
        title: '',
        content: '',
        region: '',
        city: '',
        startDate: '',
        startDateHour: '01',
        startDateMinute: '00',
        startDatePeriod: 'AM',
        deadline: '',
        deadlineHour: '01',
        deadlineMinute: '00',
        deadlinePeriod: 'AM',
        companyName: nickname || '',
        price: '',
        isregionIrrelevant: false,
        preferentialTreatment: '',
        preferentialKeyword1: '',
        preferentialKeyword2: '',
        hasPreference: false,
        logoUrl: '',
        logoFile: null,
        companyDescription: '',
        briefIntroduction: '',
        estimatePayment: '',
        contractMethod: '',
        startDate: '',
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
        files: [],
        workType: 'online',
      };
    }
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
      
      // 최대 3개 파일 제한
      if (formData.files.length + fileArray.length > 3) {
        alert('최대 3개의 파일만 업로드할 수 있습니다.');
        return;
      }
      
      const validateFileSize = (file) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const isValid = file.size <= maxSize;
        if (!isValid) {
          alert(`${file.name}의 크기가 10MB를 초과합니다.`);
        }
        return isValid;
      };

      const validFiles = fileArray.filter(validateFileSize);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...validFiles]
      }));
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

  const handleEstimateTypeChange = (type) => {
    setEstimateType(type);
  };

  // 공고문 내용에 사진 추가 -> API 변경 후 연동
  const handleImageUpload = async () => {
    // 파일 입력 요소 생성
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // 이미지 파일 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }

      // 파일 크기 검증 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB를 초과할 수 없습니다.');
        return;
      }

      setIsUploadingImage(true);
    };

    input.click();
  };

  const handleStepClick = (stepNumber) => {
    const stepElement = document.querySelector(`[data-step="${stepNumber}"]`);
    if (stepElement) {
      const headerHeight = 80; 
      const elementPosition = stepElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });

      setTimeout(() => {
        setCurrentStep(stepNumber);
      }, 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 로딩 시작
    setIsLoading(true);

    try {
      // 카테고리 검증
      const cleanedCategories = filterEmptyCategories(formData.categoryDtos);
      if (cleanedCategories.length === 0) {
        alert("최소 1개 이상의 카테고리를 선택해주세요.");
        setIsLoading(false);
        return;
      }

      console.log('Selected categories:', cleanedCategories);

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
  
      const startDateTime = `${formData.startDate}T${convertTo24HourFormat(formData.startDateHour, formData.startDateMinute, formData.startDatePeriod)}`;
      const deadlineDateTime = `${formData.deadline}T${convertTo24HourFormat(formData.deadlineHour, formData.deadlineMinute, formData.deadlinePeriod)}`;
  
      const formDataToSend = {
        title: formData.title,
        content: formData.content,
        cityId: cityId,
        cityDetailId: cityDetailId,
        startDate: startDateTime,
        deadline: deadlineDateTime,
        price: `${formData.price}만원`,
        preferentialTreatment: formData.hasPreference ? formData.preferentialTreatment : '',
        categoryDtos: cleanedCategories,
        originalFileNames: formData.files.map((file) => file.name),
        workType: formData.workType.toUpperCase(),
      };
  
      console.log('Sending data:', formDataToSend);
      
      let response;
      
      if (isEditMode) {
        const recruitId = editData.recruitId || editData.id;
        response = await updateRecruit(recruitId, formDataToSend);

        if (formData.files.length > 0 && response.data?.result?.dtoList) {
          try {
            const { recruitId: updatedRecruitId, dtoList } = response.data.result;
            
            // S3에 모든 파일 업로드
            await Promise.all(
              dtoList.map(({ presignedUrl }, i) =>
                uploadToS3(presignedUrl, formData.files[i])
              )
            );

            // 파일 정보 추출
            const fileUrls = dtoList.map(({ fileUrl }) => fileUrl);
            const fileNames = formData.files.map((file) => file.name);
            const fileTypes = formData.files.map((file) =>
              file.type.split("/")[1].toUpperCase()
            );

            // S3 업로드 성공 후 미디어 정보 저장
            await Promise.all(
              dtoList.map(({ presignedUrl }, i) =>
                postRecruitMedia({
                  recruitId: updatedRecruitId,
                  fileUrl: fileUrls,
                  fileName: fileNames,
                  fileType: fileTypes,
                })
              )
            );
            alert('공고가 성공적으로 수정되었습니다.');
          } catch (error) {
            console.error('파일 업로드 또는 미디어 등록 중 에러:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
          }
        }
      } else {
        // 새 공고 작성 모드: uploadRecruit API 사용
        response = await uploadRecruit(formDataToSend);
        const { recruitId, dtoList } = response.data.result;
        
        console.log("📦 dtoList:", dtoList);
        dtoList.forEach((dto, i) => {
          console.log(`🧾 파일 ${i + 1} presignedUrl:`, dto.presignedUrl);
        });

        // 2. 파일이 있는 경우 S3 업로드 및 미디어 정보 저장
        if (formData.files.length > 0 && dtoList) {
          try {
            // S3에 모든 파일 업로드
            await Promise.all(
              dtoList.map(({ presignedUrl }, i) =>
                uploadToS3(presignedUrl, formData.files[i])
              )
            );

            // 파일 정보 추출
            const fileUrls = dtoList.map(({ fileUrl }) => fileUrl);
            const fileNames = formData.files.map((file) => file.name);
            const fileTypes = formData.files.map((file) =>
              file.type.split("/")[1].toUpperCase()
            );

            // 3. S3 업로드 성공 후 미디어 정보 저장
            await Promise.all(
              dtoList.map(({ presignedUrl }, i) =>
                postRecruitMedia({
                  recruitId,
                  fileUrl: fileUrls,
                  fileName: fileNames,
                  fileType: fileTypes,
                })
              )
            );
            alert('공고가 성공적으로 등록되었습니다.');
          } catch (error) {
            console.error('파일 업로드 또는 미디어 등록 중 에러:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
          }
        }
      }
      
      navigate('/recruit?category=1');
    } catch (error) {
      console.error('공고 등록/수정 중 오류 발생:', error);
      alert(isEditMode ? '공고 수정에 실패했습니다. 다시 시도해주세요.' : '공고 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      // 로딩 종료
      setIsLoading(false);
    }
  };
  
  const handleCategoryChange = (index) => (categoryData) => {
    setFormData((prev) => {
      const updatedCategories = prev.categoryDtos.map((cat, i) =>
        i === index ? categoryData : cat
      );
      return {
        ...prev,
        categoryDtos: updatedCategories,
      };
    });
  };

  // 카테고리 데이터 배열 추출
  const firstCategories = firstCategoryData.first_category || [];
  const secondCategories = secondCategoryData.second_category || [];
  const thirdCategories = thirdCategoryData.third_category || [];

  return (
    <div className="pt-10 px-6 w-full lg:max-w-5xl mx-auto mb-12">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 px-12 shadow-2xl">
            <Loading 
              size="xl" 
              full={false} 
              text={isEditMode ? "공고 수정 중..." : "공고 업로드 중..."} 
              color="yellow-point"
            />
          </div>
        </div>
      )}

      <div className="flex gap-8 max-w-[60rem] w-full mx-auto">
        <form onSubmit={handleSubmit} className="w-[38rem] flex flex-col gap-6 mb-20">
          <div data-step="1" className="text-xl nanum-myeongjo-extrabold text-[#2969E0] w-full text-left border-b-2 border-black pb-2 mb-4">
            STEP 1. 
          </div>
          
          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-2">
              제목
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
            <textarea
              name="briefIntroduction"
              value={formData.briefIntroduction || ''} 
              onChange={handleChange}
              className="w-full h-36 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent resize-none"
              placeholder="공고의 간략한 소개를 입력하세요"
              rows="2"
            />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <label className="text-xl font-semibold text-black">
                우대사항 키워드
              </label>
              <span className="text-sm text-gray-500">(10글자 이내 단어 2개)</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                required
                readOnly
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-2">
              급여
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent ${
                    isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  required
                  disabled={isEditMode}
                  readOnly={isEditMode}
                />
              </div>
              <span className="text-gray-500 whitespace-nowrap">만원</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xl font-semibold text-black mb-2">
                근무 형태
              </label>
              <select
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white"
              >
                <option value="online">온라인</option>
                <option value="offline">오프라인</option>
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xl font-semibold text-black">
                  지역
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isregionIrrelevant"
                    checked={formData.isregionIrrelevant}
                    onChange={handleChange}
                    className="w-4 h-4 text-yellow-point border-gray-300 rounded "
                  />
                  <label className="text-xl text-gray-600">지역 무관</label>
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={formData.isregionIrrelevant || isEditMode}
                  className={`w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white ${
                    formData.isregionIrrelevant || isEditMode ? 'bg-gray-100' : ''
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
                  className={`w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white ${
                    formData.isregionIrrelevant || isEditMode ? 'bg-gray-100' : ''
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
                시작일
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-xl font-semibold text-gray-700 mb-2">
                시작 시간
              </label>
              <div className="flex items-center gap-2">
                <select
                  name="startDatePeriod"
                  value={formData.startDatePeriod}
                  onChange={handleChange}
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
                >
                  <option value="AM">오전</option>
                  <option value="PM">오후</option>
                </select>
                <select
                  name="startDateHour"
                  value={formData.startDateHour}
                  onChange={handleChange}
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <span className="text-gray-500">:</span>
                <select
                  name="startDateMinute"
                  value={formData.startDateMinute}
                  onChange={handleChange}
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
                >
                  <option value="00">00</option>
                  <option value="30">30</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xl font-semibold text-gray-700 mb-2">
                마감일
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
              <label className="block text-xl font-semibold text-black mb-2">
                견적 방식
              </label>
              <div className="flex items-center gap-2">
                <select
                  name="deadlinePeriod"
                  value={formData.deadlinePeriod}
                  onChange={handleChange}
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
                >
                  <option value="AM">오전</option>
                  <option value="PM">오후</option>
                </select>
                <select
                  name="deadlineHour"
                  value={formData.deadlineHour}
                  onChange={handleChange}
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <span className="text-gray-500">:</span>
                <select
                  name="deadlineMinute"
                  value={formData.deadlineMinute}
                  onChange={handleChange}
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
                >
                  <option value="00">00</option>
                  <option value="30">30</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xl font-semibold text-black mb-2">견적 금액</label>
            <input
              type="number"
              name="estimatePayment"
              value={formData.estimatePayment || ''}
              onChange={handleChange}
              disabled={estimateType === 'estimate'}
              className={`w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent ${
                estimateType === 'estimate' ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              placeholder={estimateType === 'estimate' ? '견적 금액을 받습니다.' : '견적 금액을 입력하세요'}
            />
            <span className="ml-4 text-gray-500 whitespace-nowrap">만원</span>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <label className="text-xl font-semibold text-black">
                계약 방식
              </label>
            </div>
            <textarea
              name="contractMethod"
              value={formData.contractMethod || ''}
              onChange={handleChange}
              rows="3"
              className="w-full h-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              placeholder="Ex) 1. 매칭 성공 시, 계약서를 쓸게요. 
2. 추가로 얘기 후에 결정할게요.
3. 1차 선입금, 마무리 후 잔금 입금할게요.  "
            />
          </div>

          <div data-step="4" className="flex items-center justify-between gap-2 text-xl nanum-myeongjo-extrabold text-[#2969E0] w-full text-left border-b-2 border-black pb-2 mb-4 mt-16">
            STEP 4. 
            <img src={infoIcon} alt="infoIcon" className="w-4 h-4 cursor-pointer" />
          </div>
          
          <div>
            <label className="block text-xl font-semibold text-black mb-2">
              공고에 맞는 카테고리 선택
            </label>
            <p className="flex items-center gap-2 mb-2 text-base">
              <img src={infoIcon} alt="infoIcon" className="w-4 h-4" />
              전공자들에게 AI 추천 방식 적용 및 공고 지원률 상승에 도움이 돼요!
            </p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {formData?.categoryDtos?.map((category, index) => (
                <CategorySelectBox 
                  key={index}
                  title="카테고리 선택"
                  content=""
                  defaultValue={category}
                  type="text"
                  isEditing={!isEditMode}
                  onChange={handleCategoryChange(index)}
                  width="w-full"
                />
              ))}
            </div>
          </div>
          
          <div className="text-xl nanum-myeongjo-extrabold text-[#2969E0] w-full text-left border-b-2 border-black pb-2 mb-4 mt-16">
            LAST STEP . 
          </div>
          
          <div className="flex gap-4 items-center justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-4 rounded-lg font-bold text-2xl transition-colors duration-200 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                  : 'bg-[#3E78E3] text-white'
              }`}
            >
              {isLoading ? '처리 중...' : (isEditMode ? '수정완료' : '업로드')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/recruit?category=1')}
              disabled={isLoading}
              className={`px-8 py-4 bg-zinc-300 rounded-lg font-bold text-2xl transition-colors duration-200 ${
                isLoading 
                  ? 'bg-gray-100 cursor-not-allowed text-gray-400' 
                  : 'hover:bg-gray-50'
              }`}
            >
              취소
            </button>
          </div>
        </form>
        <StepIndicator currentStep={currentStep} totalSteps={4} onStepClick={handleStepClick} />
      </div>
    </div>
  );
}