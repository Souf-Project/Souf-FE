import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CategorySelectBox from '../components/categorySelectBox';
import firstCategoryData from '../assets/categoryIndex/first_category.json';
import secondCategoryData from '../assets/categoryIndex/second_category.json';
import thirdCategoryData from '../assets/categoryIndex/third_category.json';
import { uploadRecruit, uploadToS3, postRecruitMedia, updateRecruit } from '../api/recruit';
import { UserStore } from '../store/userStore';
import { filterEmptyCategories } from '../utils/filterEmptyCategories';
import Loading from '../components/loading';
import infoIcon from '../assets/images/infoIcon.svg';

export default function RecruitUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  // 나중에 닉네임으로 바꾸기
  const { nickname } = UserStore();
  
  // 수정 모드 확인
  const isEditMode = location.state?.isEditMode || false;
  const editData = location.state?.recruitDetail || location.state?.recruitData;
  
  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState(false);
  
  // 견적 방식 상태 추가
  const [estimateType, setEstimateType] = useState('fixed'); // 'fixed' 또는 'estimate'
  
  // 급여 파싱 함수
  const parsePayment = (paymentString) => {
    if (!paymentString || typeof paymentString !== 'string') return '';
    let numStr = paymentString.replace(/[^0-9.]/g, '');
    return numStr;
  };

  // 날짜와 시간 파싱 함수
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
      const dateTime = parseDateTime(editData.deadline);
      return {
        title: editData.title || '',
        content: editData.content || '',
        region: editData.cityDetailName || '',
        city: editData.cityName || '',
        deadline: dateTime.date,
        deadlineTime: '00:00',
        deadlineHour: dateTime.hour,
        deadlineMinute: dateTime.minute,
        deadlinePeriod: dateTime.period,
        companyName: editData.nickname || nickname || '',
        minPayment: parsePayment(editData.minPayment),
        maxPayment: parsePayment(editData.maxPayment),
        isregionIrrelevant: !editData.cityName || editData.cityName === '지역 무관',
        preferentialTreatment: editData.preferentialTreatment || '',
        hasPreference: !!editData.preferentialTreatment,
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
    deadline: '',
        deadlineTime: '00:00',
        deadlineHour: '01',
        deadlineMinute: '00',
        deadlinePeriod: 'AM',
        companyName: nickname || '',
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

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      const fileArray = Array.from(files);
      
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
            files: validFiles
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

  // 견적 방식 버튼 클릭 핸들러
  const handleEstimateTypeChange = (type) => {
    setEstimateType(type);
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
  
      const deadlineDateTime = `${formData.deadline}T${convertTo24HourFormat(formData.deadlineHour, formData.deadlineMinute, formData.deadlinePeriod)}`;
  
      const formDataToSend = {
        title: formData.title,
        content: formData.content,
        cityId: cityId,
        cityDetailId: cityDetailId,
        deadline: deadlineDateTime,
        minPayment: `${formData.minPayment}만원`,
        maxPayment: `${formData.maxPayment}만원`,
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
    <div className="pt-24 px-6 w-full lg:w-1/2  lg:max-w-5xl mx-auto mb-12">
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
      <h1 className="text-3xl font-bold w-1/4 mx-auto whitespace-nowrap">
        {isEditMode ? '공고문 수정' :   '공고문 작성'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="text-xl nanum-myeongjo-extrabold text-[#2969E0] my-8 w-full text-left border-b-2 border-black pb-2">
          STEP 1. 
        </div>
        <div>
          <label className="block text-xl font-semibold text-black mb-2">
            기업 및 개인 명 작성
          </label>
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
        <div>
          <label className="block text-xl font-semibold text-black mb-2">
            로고 및 아이콘 등록
          </label>
          <input
            type="text"
            name="icon"
            // 여기 밑에 함수 수정 필요
            value={formData.title} 
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-xl font-semibold text-black mb-2">
            기업 및 개인 간략 소개
          </label>
           <textarea
             name="icon"
             // 여기 밑에 함수 수정 필요
             value={formData.title} 
             onChange={handleChange}
             className="w-full h-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent resize-none"
             required
             placeholder="1000자 이내, 이미지 첨부 가능"
             rows="8"
           />
        </div>

        <div className="text-xl nanum-myeongjo-extrabold text-[#2969E0] my-8 w-full text-left border-b-2 border-black pb-2">
          STEP 2. 
        </div>
        <div>
          <label className="block text-xl font-semibold text-black mb-2">
            공고문 제목 작성
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-xl font-semibold text-black mb-2">
          공고 간략 소개(리스트 아래 들어갈 내용, 1~2줄)
          </label>
          <textarea
             name="briefIntroduction"
             // 여기 밑에 함수 수정 필요
             value={formData.title} 
             onChange={handleChange}
             className="w-full h-36 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent resize-none"
             required
             rows="2"
           />
        </div>
        <div>
          <label className="block text-xl font-semibold text-black mb-2">
            공고문 내용 작성
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white"
             placeholder="1500자 이내, 이미지 첨부 가능"
            required
          />
        </div>
       
        <div>
          <label className="block text-xl font-semibold text-black mb-2">
            동영상 및 참고 파일 첨부
          </label>
          <input
            type="file"
            name="files"
            onChange={handleChange}
            multiple
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xl font-semibold text-black mb-2">
              작업 기간
          </label>
          <div className="flex items-center gap-2">
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            required
          />
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            required
          />
          </div>
          <div>
            <label className="block text-xl font-semibold text-black mb-2">
              마감 시간
            </label>
            <div className="flex items-center gap-2">
            <select
                name="deadlinePeriod"
                value={formData.deadlinePeriod}
                onChange={handleChange}
                className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              >
                <option value="AM">오전</option>
                <option value="PM">오후</option>
              </select>
              <select
                name="deadlineHour"
                value={formData.deadlineHour}
                onChange={handleChange}
                className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
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
                className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              >
                <option value="00">00</option>
                <option value="30">30</option>
              </select>
              
            </div>
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
        <div>
          <div className="flex items-center gap-2 mb-4">
            <label className="text-xl font-semibold text-black">
              우대사항 유무
            </label>
          </div>
            <textarea
              name="preferentialTreatment"
              value={formData.preferentialTreatment}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            />
        </div>

        <div className="text-xl nanum-myeongjo-extrabold text-[#2969E0] my-8 w-full text-left border-b-2 border-black pb-2">
          STEP 3. 
        </div>
        <div>
          <label className="block text-xl font-semibold text-black mb-2">
            견적 방식
          </label>
           <div className="flex gap-2">
           <button 
             type="button"
             onClick={() => handleEstimateTypeChange('fixed')}
             className={`w-1/2 py-4 text-lg font-semibold rounded-md focus:ring-2 focus:border-transparent transition-colors ${
               estimateType === 'fixed' 
                 ? 'bg-blue-500 text-white' 
                 : 'bg-neutral-100 text-black'
             }`}
           >
             생각한 금액이 있어요.
           </button>
           <button 
             type="button"
             onClick={() => handleEstimateTypeChange('estimate')}
             className={`w-1/2 py-4 text-lg font-semibold rounded-md focus:ring-2 focus:border-transparent transition-colors ${
               estimateType === 'estimate' 
                 ? 'bg-blue-500 text-white' 
                 : 'bg-neutral-100 text-black'
             }`}
           >
             견적 받아보고 싶어요.
           </button>
           </div>
        </div>
        <div>
          <label className="block text-xl font-semibold text-black mb-2">견적 금액</label>
          <input
            type="number"
            name="estimatePayment"
            value={formData.estimatePayment}
            onChange={handleChange}
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
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
              name="preferentialTreatment"
              value={formData.preferentialTreatment}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              placeholder="Ex) 1. 매칭 성공 시, 계약서를 쓸게요. 
     2. 추가로 얘기 후에 결정할게요.
     3. 1차 선입금, 마무리 후 잔금 입금할게요.  "
            />
        </div>

        <div className="text-xl nanum-myeongjo-extrabold text-[#2969E0] my-8 w-full text-left border-b-2 border-black pb-2">
          STEP 4. 
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
        <div className="text-xl nanum-myeongjo-extrabold text-[#2969E0] my-8 w-full text-left border-b-2 border-black pb-2">
          LAST STEP. 
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
    </div>
  );
} 