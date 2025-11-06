import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CategorySelectBox from '../components/categorySelectBox';
import { uploadRecruit, uploadToS3, postRecruitMedia, updateRecruit } from '../api/recruit';
import { UserStore } from '../store/userStore';
import { filterEmptyCategories } from '../utils/filterEmptyCategories';
import Loading from '../components/loading';
import StepIndicator from '../components/StepIndicator';
import infoIcon from '../assets/images/infoIcon.svg';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import AlertModal from '../components/alertModal';

export default function RecruitUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nickname } = UserStore();
  
  const isEditMode = location.state?.isEditMode || false;
  const editData = location.state?.recruitDetail || location.state?.recruitData;
  const initialEstimateType = location.state?.estimateType || (isEditMode && editData?.price ? 'fixed' : 'estimate');
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [estimateType, setEstimateType] = useState(initialEstimateType);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [validationModal, setValidationModal] = useState(null);
  const contentTextareaRef = useRef(null);
  const imageInputRef = useRef(null);

  const wrapSelection = (wrapStart, wrapEnd = wrapStart) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const selected = value.substring(selectionStart, selectionEnd) || '';
    const before = value.substring(0, selectionStart);
    const after = value.substring(selectionEnd);
    const newValue = `${before}${wrapStart}${selected}${wrapEnd}${after}`;
    setFormData(prev => ({ ...prev, content: newValue }));
    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = selectionStart + wrapStart.length + selected.length + wrapEnd.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const handleBold = () => wrapSelection('**');
  const handleItalic = () => wrapSelection('*');
  const handleUnderline = () => wrapSelection('<u>', '</u>');
  const handleToolbarImageClick = () => {
    if (imageInputRef.current) imageInputRef.current.click();
  };
  const handleToolbarImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const textarea = contentTextareaRef.current;
    const altText = 'image';
    const md = `![${altText}](${objectUrl})`;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const before = value.substring(0, selectionStart);
    const after = value.substring(selectionEnd);
    const newValue = `${before}${md}${after}`;
    setFormData(prev => ({ ...prev, content: newValue }));
    requestAnimationFrame(() => {
      textarea.focus();
      const pos = before.length + md.length;
      textarea.setSelectionRange(pos, pos);
    });
    e.target.value = '';
  };
  
  const parsePrice = (priceString) => {
    if (!priceString || typeof priceString !== 'string') return '';
    let numStr = priceString.replace(/[^0-9.]/g, '');
    return numStr;
  };

  const parseDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: '' };
    
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const dateStr = `${year}-${month}-${day}`;
    
    return { date: dateStr };
  };
  
  const [formData, setFormData] = useState(() => {
    if (isEditMode && editData) {
      // console.log("📦 editData:", editData);
      const startDateTime = parseDateTime(editData.startDate);
      const deadlineDateTime = parseDateTime(editData.deadline);
      return {
        title: editData.title || '',
        logoOriginalFileName: editData.logoOriginalFileName || '',
        writerName: editData.writerName || '',
        content: editData.content || '',
        region: editData.cityDetailName || '',
        city: editData.cityName || '',
        startDate: startDateTime.date,
        deadline: deadlineDateTime.date,
        companyName: editData.companyName || nickname || '',
        price: parsePrice(editData.price),
        estimatePayment: parsePrice(editData.price) || '',
        isregionIrrelevant: !editData.cityName || editData.cityName === '지역 무관',
        preferentialTreatment: editData.preferentialTreatment || '',
        preferentialTreatmentTags: editData.preferentialTreatmentTags || [],
        logoUrl: editData.logoUrl || '',
        logoFile: null,
        companyDescription: '',
        briefIntroduction: editData.briefIntroduction || editData.introduction || '',
        estimatePayment: editData.estimatePayment || '',
        contractMethod: editData.contractMethod || '',
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
        existingImages: editData.mediaResDtos || [],
        newFiles: [],
        workType: editData.workType?.toLowerCase() || 'online',
      };
    } else {
      return {
    title: '',
        content: '',
        region: '',
        city: '',
        startDate: '',
    deadline: '',
        companyName: nickname || '',
        price: '',
        isregionIrrelevant: false,
        preferentialTreatment: '',
        preferentialTreatmentTags: [],
        logoUrl: '',
        logoFile: null,
        companyDescription: '',
        briefIntroduction: '',
        estimatePayment: '',
        contractMethod: '',
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
        existingImages: [],
        newFiles: [],
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
      if (name === 'logoFile') {
        const file = files[0];
        if (file) {
       
          if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드할 수 있습니다.');
            return;
          }
          
          setFormData(prev => ({
            ...prev,
            logoFile: file
          }));
        }
      } else {
        const file = files[0];
        if (file) {
        // const maxSize = 10 * 1024 * 1024;
        //   if (file.size > maxSize) {
        //   alert(`${file.name}의 크기가 10MB를 초과합니다.`);
        //     return;
        //   }
          
          const currentFiles = [...formData.newFiles];
          const emptySlotIndex = currentFiles.findIndex(f => f === null || f === undefined);
          
          if (emptySlotIndex !== -1) {
            currentFiles[emptySlotIndex] = file;
          } else if (currentFiles.length < 3) {
            currentFiles.push(file);
          } else {
            alert('최대 3개의 파일만 업로드할 수 있습니다.');
            return;
          }
          
          setFormData(prev => ({
            ...prev,
            newFiles: currentFiles
          }));
        }
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        ...(name === 'isregionIrrelevant' && checked ? { region: '' } : {})
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }

      // if (file.size > 5 * 1024 * 1024) {
      //   alert('파일 크기는 5MB를 초과할 수 없습니다.');
      //   return;
      // }

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

  useEffect(() => {
    const handleScroll = () => {
      const steps = [1, 2, 3, 4];
      const headerHeight = 80;
      const viewportHeight = window.innerHeight;
      
      for (let i = steps.length - 1; i >= 0; i--) {
        const stepElement = document.querySelector(`[data-step="${steps[i]}"]`);
        if (stepElement) {
          const elementTop = stepElement.offsetTop - headerHeight;
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          // 이전 스텝의 50% 지점에서 다음 스텝으로 전환
          const triggerPoint = elementTop - (viewportHeight * 0.2);
          
          if (scrollTop >= triggerPoint) {
            setCurrentStep(steps[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const validateRequiredFields = () => {
    const requiredFields = [
      { field: 'companyName', label: '기업 또는 개인명', value: formData.companyName?.trim() },
      { field: 'briefIntroduction', label: '기업 또는 간략 소개', value: formData.briefIntroduction?.trim() },
      { field: 'title', label: '공고문 제목', value: formData.title?.trim() },
      { field: 'content', label: '공고문 내용', value: formData.content?.trim() },
      { field: 'startDate', label: '채용 기간 (시작일)', value: formData.startDate },
      { field: 'deadline', label: '채용 기간 (마감일)', value: formData.deadline },
      { field: 'workType', label: '근무 형태', value: formData.workType },
    ];

    // 지역 검증 (지역 무관이 아닐 때만)
    if (!formData.isregionIrrelevant) {
      if (!formData.city?.trim()) {
        return { field: 'city', label: '지역 (시/도)' };
      }
      if (!formData.region?.trim()) {
        return { field: 'region', label: '지역 (상세 지역)' };
      }
    }

    // 카테고리 검증
    const cleanedCategories = filterEmptyCategories(formData.categoryDtos);
    if (cleanedCategories.length === 0) {
      return { field: 'categoryDtos', label: '공고에 맞는 카테고리 선택' };
    }

    // 나머지 필수 필드 검증
    for (const { field, label, value } of requiredFields) {
      if (!value) {
        return { field, label };
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 로딩 중이면 중복 실행 방지
    if (isLoading) {
      return;
    }

    // 필수 필드 검증
    const validationError = validateRequiredFields();
    if (validationError) {
      setValidationModal({
        type: 'simple',
        title: '입력 필수',
        description: `${validationError.label}을(를) 입력해주세요.`,
        TrueBtnText: '확인',
        onClickTrue: () => setValidationModal(null),
      });
      return;
    }

    setIsLoading(true);

    try {
      // 카테고리 필터링 (검증은 이미 완료됨)
      const cleanedCategories = filterEmptyCategories(formData.categoryDtos);

      let cityId = null;
      let cityDetailId = null;
  
      if (formData.isregionIrrelevant) {
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
  
      // yyyy-MM-ddTHH:mm 형식으로 변환
      const startDateTime = new Date(formData.startDate).toISOString().slice(0, 16);
      const deadlineDateTime = new Date(formData.deadline).toISOString().slice(0, 16);
  
      // 우대사항 키워드 처리 - 빈 문자열 제거
      const preferentialTreatmentTags = (formData.preferentialTreatmentTags || [])
        .filter(tag => tag && tag.trim() !== '');

      const formDataToSend = {
        writerName: formData.companyName,
        logoOriginalFileName: formData.logoFile ? formData.logoFile.name : '',
        introduction: formData.briefIntroduction,
        title: formData.title,
        content: formData.content,
        cityId: cityId,
        cityDetailId: cityDetailId,
        startDate: startDateTime,
        deadline: deadlineDateTime,
        price: estimateType === 'fixed' && formData.estimatePayment ? `${formData.estimatePayment}만원` : '',
        preferentialTreatment: formData.preferentialTreatment || '',
        preferentialTreatmentTags: preferentialTreatmentTags,
        categoryDtos: cleanedCategories,
        workType: formData.workType.toUpperCase(),
        originalFileNames: formData.newFiles.map((file) => file.name),
        existingImageUrls: formData.existingImages.map((file) => file.fileUrl),
      };
      console.log("formDataToSend:", formDataToSend);
  
      
      let response;
      
      if (isEditMode) {
        const recruitId = editData.recruitId || editData.id;
        response = await updateRecruit(recruitId, formDataToSend);

        if ((formData.newFiles.length > 0 || formData.logoFile) && response.data?.result) {
          try {
            const { recruitId: updatedRecruitId, dtoList, logoPresignedUrlResDto } = response.data.result;
            
            // 로고 파일이 있는 경우 처리
            if (formData.logoFile && logoPresignedUrlResDto) {
              await uploadToS3(logoPresignedUrlResDto.presignedUrl, formData.logoFile);
              
              await postRecruitMedia({
                recruitId: updatedRecruitId,
                fileUrl: [logoPresignedUrlResDto.fileUrl],
                fileName: [formData.logoFile.name],
                fileType: [formData.logoFile.type.split("/")[1].toUpperCase()],
                purpose: ["LOGO"]
              });
              
            }
            
            // 일반 파일 처리
            if (formData.newFiles.length > 0 && dtoList) {
              // S3에 모든 파일 업로드
              await Promise.all(
                dtoList.map(({ presignedUrl }, i) =>
                  uploadToS3(presignedUrl, formData.newFiles[i])
                )
              );

              // 파일 정보 추출 - 모든 파일을 배열로 구성
              const fileUrls = dtoList.map(({ fileUrl }) => fileUrl);
              const fileNames = formData.newFiles.map((file) => file.name);
              const fileTypes = formData.newFiles.map((file) =>
                file.type.split("/")[1].toUpperCase()
              );
              const filePurposes = new Array(formData.newFiles.length).fill("RECRUIT");


              // S3 업로드 성공 후 미디어 정보 저장 - 한 번에 모든 파일 처리
              await postRecruitMedia({
                recruitId: updatedRecruitId,
                fileUrl: fileUrls,
                fileName: fileNames,
                fileType: fileTypes,
                purpose: filePurposes
              });
            }
            
            alert('공고가 성공적으로 수정되었습니다.');
          } catch (error) {
            console.error('파일 업로드 또는 미디어 등록 중 에러:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
          }
        }
      } else {
        response = await uploadRecruit(formDataToSend);
        const { recruitId, dtoList, logoPresignedUrlResDto } = response.data.result;
        

        // 2. 파일이 있는 경우 S3 업로드 및 미디어 정보 저장
        if ((formData.newFiles.length > 0 || formData.logoFile) && response.data?.result) {
          try {
            // 로고 파일이 있는 경우 처리
            if (formData.logoFile && logoPresignedUrlResDto) {
              await uploadToS3(logoPresignedUrlResDto.presignedUrl, formData.logoFile);
              
              const logoMediaData = {
                recruitId,
                fileUrl: [logoPresignedUrlResDto.fileUrl],
                fileName: [formData.logoFile.name],
                fileType: [formData.logoFile.type.split("/")[1].toUpperCase()],
                purpose: ["LOGO"]
              };
              
              
              await postRecruitMedia(logoMediaData);
            }
            
            // 일반 파일이 있는 경우 처리
            if (formData.newFiles.length > 0 && dtoList) {
              // S3에 모든 파일 업로드
              await Promise.all(
                dtoList.map(({ presignedUrl }, i) =>
                  uploadToS3(presignedUrl, formData.newFiles[i])
                )
              );

              // 파일 정보 추출 - 모든 파일을 배열로 구성
              const fileUrls = dtoList.map(({ fileUrl }) => fileUrl);
              const fileNames = formData.newFiles.map((file) => file.name);
              const fileTypes = formData.newFiles.map((file) =>
                file.type.split("/")[1].toUpperCase()
              );
              const filePurposes = new Array(formData.newFiles.length).fill("RECRUIT");


              // S3 업로드 성공 후 미디어 정보 저장 - 한 번에 모든 파일 처리
              await postRecruitMedia({
                recruitId,
                fileUrl: fileUrls,
                fileName: fileNames,
                fileType: fileTypes,
                purpose: filePurposes
              });
            }
            
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
          <div data-step="1" className="flex items-center justify-between gap-2 text-xl nanum-myeongjo-extrabold text-[#2969E0] w-full text-left border-b-2 border-black pb-2 mb-4">
          STEP 1. 
            {/* <img src={infoIcon} alt="infoIcon" className="w-4 h-4 cursor-pointer" /> */}
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-2">
              기업 또는 개인명 <span className="text-red-500">*</span>
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
              로고 및 아이콘 등록
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  name="logoFile"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-yellow-point hover:bg-yellow-50 transition-colors duration-200"
                >
                  {formData.logoUrl || (formData.logoFile && URL.createObjectURL(formData.logoFile)) ? (
                    <img 
                      src={formData.logoFile ? URL.createObjectURL(formData.logoFile) : `${import.meta.env.VITE_S3_BUCKET_URL}${formData.logoUrl}`} 
                      alt="로고 미리보기" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-sm text-gray-500">로고 업로드</span>
                    </>
                  )}
                </label>
              </div>
              <div className="flex-1">
                {formData.logoFile && (
                  <p className="text-xs text-green-600 mt-1">✓ {formData.logoFile.name}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-2">
              기업 또는 간략 소개 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="briefIntroduction"
              value={formData.briefIntroduction || ''} 
              onChange={handleChange}
              className="w-full h-36 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent resize-none"
              placeholder="기업에 대한 간략한 소개를 입력하세요 (1000자 이내)"
              rows="4"
              maxLength="1000"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.briefIntroduction?.length || 0}/1000
            </div>
          </div>

          <div data-step="2" className="flex items-center justify-between gap-2 text-xl nanum-myeongjo-extrabold text-[#2969E0] w-full text-left border-b-2 border-black pb-2 mb-4 mt-16">
            STEP 2. 
            {/* <img src={infoIcon} alt="infoIcon" className="w-4 h-4 cursor-pointer" /> */}
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-2">
              공고문 제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
              name="title"
              value={formData.title}
            onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
              placeholder="공고문 제목을 입력하세요"
            required
          />
        </div>

          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-2">
              공고문 내용 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={handleBold}
                className="px-2 py-1 text-sm border rounded hover:bg-gray-50 font-bold"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={handleItalic}
                className="px-2 py-1 text-sm border rounded hover:bg-gray-50 italic"
                title="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={handleUnderline}
                className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                title="Underline"
              >
                <span className="underline">U</span>
              </button>
              {/* <button
                type="button"
                onClick={handleToolbarImageClick}
                className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                title="Insert image"
              >
                🖼️
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleToolbarImageChange}
              /> */}
            </div>
            <textarea
              name="content"
              value={formData.content}
                onChange={handleChange}
              ref={contentTextareaRef}
              className="w-full h-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent resize-none"
              placeholder="공고문의 상세 내용을 입력하세요 (1500자 이내)"
              rows="8"
              maxLength="1500"
                required
              />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.content?.length || 0}/1500
            </div>
            
            {/* 미리보기 토글 버튼 */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className={`w-4 h-4 transition-transform duration-200 ${showPreview ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {showPreview ? '닫기' : '미리보기'}
              </button>
            </div>
            
            {/* 마크다운 미리보기 */}
            {showPreview && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {formData.content || '*내용이 없습니다.*'}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-2">
              동영상 및 참고 파일 첨부 (최대 3개)
            </label>
            <div className="flex items-start gap-4 w-full">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }, (_, index) => {
                  const allFiles = [...formData.existingImages, ...formData.newFiles];
                  const file = allFiles[index];
                  const isExistingFile = index < formData.existingImages.length;
                  
                  return (
                  <div key={index} className="relative">
              <input
                      type="file"
                      name="files"
                onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id={`file-upload-${index}`}
                      disabled={allFiles.length > index}
                    />
                    <label
                      htmlFor={`file-upload-${index}`}
                      className={`w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
                        file 
                          ? 'bg-green-50' 
                          : 'border-gray-300 hover:border-yellow-point hover:bg-yellow-50'
                      }`}
                    >
                      {file ? (
                        <div className="w-full h-full relative">
                          {isExistingFile ? (
                            <img 
                              src={`${import.meta.env.VITE_S3_BUCKET_URL}${file.fileUrl}`} 
                              alt="기존 파일" 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : file.type && file.type.startsWith('image/') ? (
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt="새 파일 미리보기" 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg">
                              <svg className="w-8 h-8 text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-xs text-gray-600 font-medium truncate px-1">
                                {file.fileName ? file.fileName.split('.')[0] : file.name.split('.')[0]}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="text-xs text-gray-500">파일 추가</span>
                        </div>
                      )}
                    </label>
                    {file && (
                      <button
                        type="button"
                        onClick={() => {
                          if (isExistingFile) {
                            // 기존 파일 삭제
                            const newExistingImages = formData.existingImages.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, existingImages: newExistingImages }));
                          } else {
                            // 새 파일 삭제
                            const newFileIndex = index - formData.existingImages.length;
                            const newFiles = formData.newFiles.filter((_, i) => i !== newFileIndex);
                            setFormData(prev => ({ ...prev, newFiles }));
                          }
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  );
                })}
        </div>

            </div>
            {(formData.existingImages.length > 0 || formData.newFiles.length > 0) && (
                  <div className="space-y-2 mt-2">
                    <p className="text-sm font-medium text-gray-700">첨부된 파일:</p>
                    <ul className="space-y-1">
                      {formData.existingImages.map((file, index) => (
                        <li key={`existing-${index}`} className="text-sm text-gray-600 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="flex-1 truncate">{file.fileName}</span>
                          <span className="text-xs text-gray-500">기존 파일</span>
                        </li>
                      ))}
                      {formData.newFiles.map((file, index) => (
                        <li key={`new-${index}`} className="text-sm text-gray-600 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="flex-1 truncate">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(1)}MB
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
          </div>

          <div className="flex flex-col gap-6">
            <label className="block text-xl font-semibold text-gray-700">
              채용 기간 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
                required
              />
              <p>~</p>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-2">
              근무 형태 <span className="text-red-500">*</span>
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
              <label className="block text-xl font-semibold text-black">
                지역 <span className="text-red-500">*</span>
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

        <div>
            <div className="flex items-center gap-2 mb-4">
              <label className="text-xl font-semibold text-black">
                우대사항 키워드 (2개)
          </label>
              <span className="text-sm text-gray-500">(10글자 이내 단어 2개)</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
          <input
                type="text"
                name="preferentialKeyword1"
                value={formData.preferentialTreatmentTags[0] || ''}
            onChange={(e) => {
              const newTags = [...(formData.preferentialTreatmentTags || [])];
              newTags[0] = e.target.value;
              setFormData(prev => ({ ...prev, preferentialTreatmentTags: newTags }));
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
                placeholder="우대사항 키워드 1"
                maxLength="10"
              />
              <input
                type="text"
                name="preferentialKeyword2"
                value={formData.preferentialTreatmentTags[1] || ''}
                onChange={(e) => {
                  const newTags = [...(formData.preferentialTreatmentTags || [])];
                  newTags[1] = e.target.value;
                  setFormData(prev => ({ ...prev, preferentialTreatmentTags: newTags }));
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent"
                placeholder="우대사항 키워드 2"
                maxLength="10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-2">
              우대사항 설명
            </label>
            <textarea
              name="preferentialTreatment"
              value={formData.preferentialTreatment}
                onChange={handleChange}
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-point focus:border-transparent resize-none"
              placeholder="우대사항에 대한 상세 설명을 입력하세요"
              rows="4"
            />
          </div>
          
          <div data-step="3" className="flex items-center justify-between gap-2 text-xl nanum-myeongjo-extrabold text-[#2969E0] w-full text-left border-b-2 border-black pb-2 mb-4 mt-16">
            STEP 3. 
            {/* <img src={infoIcon} alt="infoIcon" className="w-4 h-4 cursor-pointer" /> */}
          </div>
           <div>
             <label className="block text-xl font-semibold text-gray-700 mb-2">견적 방식</label>
             <div className="flex gap-4">
               <button 
                 type="button"
                 onClick={() => setEstimateType('fixed')}
                 className={`rounded-md px-8 py-3 font-semibold text-md transition-all duration-200 ${
                   estimateType === 'fixed' 
                     ? 'bg-[#3E78E3] text-white shadow-md' 
                     : 'bg-neutral-100 hover:shadow-md'
                 }`}
               >
                 생각한 금액이 있어요.
               </button>
               <button 
                 type="button"
                 onClick={() => setEstimateType('estimate')}
                 className={`rounded-md px-8 py-3 font-semibold text-md transition-all duration-200 ${
                   estimateType === 'estimate' 
                     ? 'bg-[#3E78E3] text-white shadow-md' 
                     : 'bg-neutral-100 hover:shadow-md'
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
              value={formData.estimatePayment || ''}
              onChange={(e) => {
                // 숫자만 입력 허용
                const value = e.target.value.replace(/[^0-9]/g, '');
                setFormData(prev => ({
                  ...prev,
                  estimatePayment: value
                }));
              }}
              disabled={estimateType === 'estimate'}
              min="0"
              step="1"
              className={`w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent ${
                estimateType === 'estimate' ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              placeholder={estimateType === 'estimate' ? '견적 금액을 제시 받습니다.' : '견적 금액을 입력하세요'}
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
            {/* <img src={infoIcon} alt="infoIcon" className="w-4 h-4 cursor-pointer" /> */}
        </div>

        <div>
            <label className="block text-xl font-semibold text-black mb-2">
              공고에 맞는 카테고리 선택 <span className="text-red-500">*</span>
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

          <div className="flex items-center justify-between gap-2 text-xl nanum-myeongjo-extrabold text-[#2969E0] w-full text-left border-b-2 border-black pb-2 mt-16">
            LAST STEP . 
            {/* <img src={infoIcon} alt="infoIcon" className="w-4 h-4 cursor-pointer" /> */}
        </div>
        <p className="text-sm text-neutral-500 mb-8">서비스 상품 교환 및 환불 규정 등은 결제·정산·환불(에스크로) 정책을 참고해주세요.</p>

        <div className="flex gap-4 items-center justify-center">
        <button
            type="submit"
            disabled={isLoading}
              className={`px-16 py-4 rounded-lg font-bold text-xl transition-all duration-200 hover:shadow-md ${
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
              className={`px-8 py-4 bg-zinc-300 text-black/70 rounded-lg font-bold text-xl transition-all duration-200 hover:shadow-md ${
              isLoading 
                ? 'bg-gray-100 cursor-not-allowed text-gray-400' 
                  : ''
            }`}
          >
              작성 초기화/취소
          </button>
        </div>
       
      </form>
      
        <StepIndicator currentStep={currentStep} totalSteps={4} onStepClick={handleStepClick} />
      </div>
      
      {/* 검증 모달 */}
      {validationModal && (
        <AlertModal
          type={validationModal.type}
          title={validationModal.title}
          description={validationModal.description}
          TrueBtnText={validationModal.TrueBtnText}
          onClickTrue={validationModal.onClickTrue}
        />
      )}
    </div>
  );
} 