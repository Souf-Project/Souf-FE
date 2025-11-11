import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getInquiryList, deleteInquiry, patchInquiry } from '../../api/inquiry';
import { UserStore } from '../../store/userStore';
import Loading from '../loading';
import EditIcon from '../../assets/images/editIco.svg';
import DeleteIcon from '../../assets/images/trashIco.svg';
import AlertModal from '../alertModal';
import FilterDropdown from '../filterDropdown';

export default function InquiryContent() {
    const { memberId } = UserStore();
    const queryClient = useQueryClient();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [expandedInquiry, setExpandedInquiry] = useState(null);
    const [selectedInquiryId, setSelectedInquiryId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: "",
        content: "",
        type: ""
    });
    const { data, isLoading, error } = useQuery({
        queryKey: ['inquiryList', memberId],
        queryFn: () => getInquiryList({ memberId }),
    });

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>문의 내역을 조회할 수 없습니다.</div>;
    }

    if (!data) {
        return <div>No data available</div>;
    }

    console.log('API Response:', data);
    
    const inquiryList = data?.data?.result?.content || [];
    // console.log('Inquiry List:', inquiryList);

    const typeOptions = [
        { value: "1", label: "피드" },
        { value: "2", label: "외주" },
        { value: "3", label: "후기" },
        { value: "4", label: "채팅" },
        { value: "5", label: "계정/인증" },
        { value: "6", label: "기타" }
    ];

    // inquiryType을 라벨로 변환
    const getInquiryTypeLabel = (inquiryType) => {
        const type = typeOptions.find(option => option.value === String(inquiryType));
        return type ? type.label : "기타";
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    const toggleInquiry = (inquiryId) => {
        setExpandedInquiry(expandedInquiry === inquiryId ? null : inquiryId);
    };

    const handleDeleteClick = (inquiryId) => {
        setSelectedInquiryId(inquiryId);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        console.log('문의 삭제 시작:', selectedInquiryId);
        try {
            await deleteInquiry(selectedInquiryId);
            queryClient.invalidateQueries(['inquiryList', memberId]);
            setShowDeleteModal(false);
            setSelectedInquiryId(null);
        } catch (error) {
            console.error('문의 삭제 실패:', error);
            // 에러 처리 필요
        }
    };

    const handleEditConfirm = async () => {
        if (!editFormData.title || !editFormData.content) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }
        if (!editFormData.type) {
            alert("문의 유형을 선택해주세요.");
            return;
        }
        if (editFormData.content.length < 20) {
            alert("내용은 최소 20글자 이상 입력해주세요.");
            return;
        }
        if (editFormData.content.length > 1000) {
            alert("내용은 최대 1000자까지 입력 가능합니다.");
            return;
        }

        try {
            const typeMapping = {
                "1": "RELATED_FEED",
                "2": "RELATED_RECRUIT", 
                "3": "RELATED_REVIEW",
                "4": "RELATED_CHAT",
                "5": "RELATED_AUTHENTICATION",
                "6": "ETC"
            };

            const requestBody = {
                title: editFormData.title,
                content: editFormData.content,
                type: typeMapping[editFormData.type] || "RELATED_CHAT",
                existingImageUrls: [],// 이미지 받아와야함
                originalFileNames: []
            };

            await patchInquiry(selectedInquiryId, requestBody);
            queryClient.invalidateQueries(['inquiryList', memberId]);
            setShowEditModal(false);
            setSelectedInquiryId(null);
            setEditFormData({
                title: "",
                content: "",
                type: ""
            });
        } catch (error) {
            console.error('문의 수정 실패:', error);
            alert("문의 수정 중 오류가 발생했습니다.");
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setSelectedInquiryId(null);
    };

    const handleEditClick = (inquiry) => {
        setSelectedInquiryId(inquiry.inquiryId);
        setEditFormData({
            title: inquiry.title,
            content: inquiry.content,
            type: "1"
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleEditCancel = () => {
        setShowEditModal(false);
        setSelectedInquiryId(null);
        setEditFormData({
            title: "",
            content: "",
            type: ""
        });
    };

    return (
        <div>
            <h1 className='text-2xl font-bold'>내 문의 내역</h1>
            <div className='flex flex-col gap-4 mt-4'>
                {inquiryList.map((inquiry) => (
                    <div key={inquiry.inquiryId} className='border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md'>
                        <div 
                            className='flex gap-4 items-center justify-between p-4 cursor-pointer'
                            onClick={() => toggleInquiry(inquiry.inquiryId)}
                        >
                       
                        <div className="flex flex-col gap-2 ">
                            <div className='flex gap-2'>
                                <div className='bg-blue-200 text-gray-500 px-2 py-1 rounded-md'>
                                    {getInquiryTypeLabel(inquiry.inquiryType)}
                                </div>
                                {inquiry.status === 'RESOLVED' ? (
                                    <div className='bg-blue-main text-white px-2 py-1 rounded-md'>답변 완료</div>
                                ) : inquiry.status === 'REJECTED' ? (
                                    <div className='bg-red-400 text-white px-2 py-1 rounded-md'>답변 거절</div>
                                ) : (
                                    <div className='bg-gray-400 text-white px-2 py-1 rounded-md'>미답변</div>
                                )}
                            </div>
                            <h2 className='text-lg font-medium'>{inquiry.title}</h2>

                        </div>
                        <div className='flex flex-col gap-2 justify-between'>
                            <p>{formatDate(inquiry.createdTime)}</p>
                            <div className='flex gap-2 items-center justify-end'>
                                <img src={EditIcon} alt="EditIcon" className='w-6 h-6 cursor-pointer grayscale opacity-50' 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(inquiry);
                                }}
                                />
                                <img src={DeleteIcon} alt="DeleteIcon" className='w-6 h-6 cursor-pointer grayscale' 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(inquiry.inquiryId);
                                }}
                                />
                            </div>

                        </div>
                        </div>
                        
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            expandedInquiry === inquiry.inquiryId 
                                ? 'max-h-96 opacity-100' 
                                : 'max-h-0 opacity-0'
                        }`}>
                            <div className='px-4 pb-4'>
                                <p className='text-gray-600 whitespace-pre-wrap'>{inquiry.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showDeleteModal && (
                <AlertModal
                    type="warning"
                    title="문의를 삭제하시겠습니까?"
                    description="삭제 후 되돌릴 수 없습니다."
                    TrueBtnText="확인"
                    FalseBtnText="취소"
                    onClickTrue={handleDeleteConfirm}
                    onClickFalse={handleDeleteCancel}
                />
            )}

            {/* 문의 수정 모달 */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">문의 수정</h2>
                        
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <p className="text-lg font-semibold">문의 유형</p>
                                <FilterDropdown
                                    options={typeOptions}
                                    placeholder="문의 유형"
                                    selectedValue={editFormData.type}
                                    onSelect={(value) => setEditFormData(prev => ({ ...prev, type: value }))}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-lg font-semibold">문의 제목</p>
                                <input 
                                    type="text" 
                                    name="title"
                                    value={editFormData.title}
                                    onChange={handleEditChange}
                                    className="w-full p-3 rounded-md border border-gray-300" 
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-semibold">내용</p>
                                    <p className={`text-sm ${editFormData.content.length > 1000 ? 'text-red-500' : 'text-gray-500'}`}>
                                        {editFormData.content.length}/1000
                                    </p>
                                </div>
                                <textarea 
                                    name="content"
                                    value={editFormData.content}
                                    onChange={handleEditChange}
                                    maxLength={1000}
                                    className="w-full p-3 rounded-md border border-gray-300 min-h-32"
                                    placeholder="최소 20글자, 최대 1000자 이내" 
                                />
                                {editFormData.content.length > 0 && editFormData.content.length < 20 && (
                                    <p className="text-red-500 text-sm">최소 20글자 이상 입력해주세요.</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8 justify-end">
                            <button 
                                onClick={handleEditCancel}
                                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md font-semibold hover:shadow-md transition-all"
                            >
                                취소
                            </button>
                            <button 
                                onClick={handleEditConfirm}
                                className="px-6 py-3 bg-blue-500 text-white rounded-md font-semibold hover:shadow-md transition-all"
                            >
                                수정 완료
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}