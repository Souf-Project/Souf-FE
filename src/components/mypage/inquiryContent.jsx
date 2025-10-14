import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getInquiryList, deleteInquiry } from '../../api/mypage';
import { UserStore } from '../../store/userStore';
import Loading from '../loading';
import EditIcon from '../../assets/images/editIco.svg';
import DeleteIcon from '../../assets/images/trashIco.svg';
import AlertModal from '../alertModal';

export default function InquiryContent() {
    const { memberId } = UserStore();
    const queryClient = useQueryClient();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [expandedInquiry, setExpandedInquiry] = useState(null);
    const [selectedInquiryId, setSelectedInquiryId] = useState(null);
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

    // console.log('API Response:', data);
    
    const inquiryList = data?.data?.result?.content || [];
    // console.log('Inquiry List:', inquiryList);

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

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setSelectedInquiryId(null);
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
                                <div className='bg-blue-200 text-gray-500 px-2 py-1 rounded-md'>채팅</div>
                                 {/* 문의 날짜랑 답변 상태 추가되면 수정하기 */}
                                        {inquiry.status === 'FALSE' && (
                                        <div className='bg-gray-400 text-white px-2 py-1 rounded-md'>미답변</div>
                                        )}
                                        {inquiry.status === 'TRUE' && (
                                        <div className='bg-gray-300 text-gray-500 px-2 py-1 rounded-md'>답변 완료</div>
                                        )}
                                        <div className='bg-red-400 text-white px-2 py-1 rounded-md'>미답변</div>
                                </div>
                            <h2 className='text-lg font-medium'>{inquiry.title}</h2>
                            {/* <p className='text-sm text-gray-500'>{inquiry.content}</p> */}

                        </div>
                        <div className='flex flex-col gap-2 justify-between'>
                            <p>2025.10.14 00:00</p>
                            <div className='flex gap-2 items-center justify-end'>
                                <img src={EditIcon} alt="EditIcon" className='w-6 h-6 cursor-pointer grayscale opacity-50' />
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
        </div>
    )
}