import { getClubList, getMyClubList, getClubJoinPendingList, patchClubMemberJoinDecision, getClubMemberList, deleteClubWithdraw } from '../../api/club';
import { useState } from 'react';
import { UserStore } from '../../store/userStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import basicLogoImg from '../../assets/images/basiclogoimg.png';
import expelIcon from '../../assets/images/expelIcon.svg';
import AlertModal from '../alertModal';
import outIcon from '../../assets/images/outIcon.svg';
import { getLastCategoryName } from '../../utils/categoryUtils';


export default function ClubList() {
    const {memberId, roleType} = UserStore();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: null,
        title: "",
        description: "",
        confirmText: "확인",
        FalseBtnText: undefined,
        onConfirm: null,
        onCancel: null
    });
    const pageSize = 10;
    const pageable = {
        page: currentPage,
        size: pageSize,
    };
   

    const {data: clubMemberList, isLoading: clubMemberListLoading, error: clubMemberListError} = useQuery({
        queryKey: ['clubMemberList', memberId, currentPage],
        queryFn: () => getClubMemberList(memberId, pageable),
    });
    // console.log(clubMemberList);
    const {data: clubJoinPendingList, isLoading: clubJoinPendingListLoading, error: clubJoinPendingListError} = useQuery({
        queryKey: ['clubJoinPendingList', memberId, currentPage],
        queryFn: () => getClubJoinPendingList(memberId, pageable),
    });

    const {mutate: handleClubMemberJoinDecision} = useMutation({
        mutationFn: ({ clubId, studentId, decision }) => patchClubMemberJoinDecision(clubId, studentId, decision),
        onSuccess: (response, variables) => {
            if (response.data && response.data.code === 200) {
                const decisionText = variables.decision === 'APPROVE' ? '승인' : '거절';
                setModalState({
                    isOpen: true,
                    type: 'simple',
                    title: "처리 완료",
                    description: response.data.result || `${decisionText}이 완료되었습니다.`,
                    confirmText: "확인",
                    FalseBtnText: undefined,
                    onConfirm: () => setModalState(prev => ({ ...prev, isOpen: false })),
                    onCancel: null
                });
                // 목록 새로고침
                queryClient.invalidateQueries(['clubJoinPendingList', memberId, currentPage]);
            }
        },
        onError: (error) => {
            console.error("동아리원 승인/거절 에러:", error);
            setModalState({
                isOpen: true,
                type: 'simple',
                title: "오류 발생",
                description: error.response?.data?.message || "처리 중 오류가 발생했습니다.",
                confirmText: "확인",
                FalseBtnText: undefined,
                onConfirm: () => setModalState(prev => ({ ...prev, isOpen: false })),
                onCancel: null
            });
        }
    });
    // console.log(data);
    // console.log(clubJoinPendingList);

    const {data: myClubList, isLoading: myClubListLoading, error: myClubListError} = useQuery({
        queryKey: ['myClubList', memberId, currentPage],
        queryFn: () => getMyClubList(pageable),
    });
    // console.log(myClubList);


    const handleClubMemberDelete = (selectedMembers) => {
        console.log('선택된 멤버:', selectedMembers);
        setIsEditMode(false);
        setSelectedMembers([]);
    }

    const {mutate: handleClubWithdraw} = useMutation({
        mutationFn: (clubId) => deleteClubWithdraw(clubId),
        onSuccess: (response) => {
            if (response.data && response.data.code === 200) {
                setModalState({
                    isOpen: true,
                    type: 'simple',
                    title: "탈퇴 완료",
                    description: "탈퇴가 완료되었습니다.",
                    confirmText: "확인",
                    FalseBtnText: undefined,
                    onConfirm: () => {
                        setModalState(prev => ({ ...prev, isOpen: false }));
                        // 목록 새로고침
                        queryClient.invalidateQueries(['myClubList', memberId, currentPage]);
                    },
                    onCancel: null
                });
            }
        },
        onError: (error) => {
            console.error("동아리 탈퇴 에러:", error);
            setModalState({
                isOpen: true,
                type: 'simple',
                title: "오류 발생",
                description: error.response?.data?.message || "탈퇴 중 오류가 발생했습니다.",
                confirmText: "확인",
                FalseBtnText: undefined,
                onConfirm: () => setModalState(prev => ({ ...prev, isOpen: false })),
                onCancel: null
            });
        }
    });

    const handleClubLeave = (clubId) => {
        setModalState({
            isOpen: true,
            type: 'confirm',
            title: "탈퇴 확인",
            description: "정말 동아리를 탈퇴하시겠습니까?",
            confirmText: "탈퇴",
            FalseBtnText: "취소",
            onCancel: () => {
                setModalState(prev => ({ ...prev, isOpen: false }));
            },
            onConfirm: () => {
                setModalState(prev => ({ ...prev, isOpen: false }));
                handleClubWithdraw(clubId);
            }
        });
    }
    return (
        <div>
            {roleType === 'CLUB' && (
                <>
                    <h1 className='text-2xl font-bold'>동아리원 관리</h1>
                    <div className='flex flex-col gap-4 mt-4'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex justify-between items-center'>
                            <h2 className='text-lg font-medium'>동아리원 목록</h2>
                            {!isEditMode ? (
                                <button className='bg-blue-main text-white px-4 py-2 rounded-lg hover:shadow-md cursor-pointer' onClick={() => setIsEditMode(true)}>동아리원 편집</button>
                            ) : (
                                <div className='flex gap-2'>
                                     <button className='bg-red-400 text-white px-4 py-2 rounded-lg hover:shadow-md cursor-pointer' onClick={() => {
                                       handleClubMemberDelete(selectedMembers);

                                   }}>동아리원 삭제</button>
                                    <button className='bg-blue-main text-white px-4 py-2 rounded-lg hover:shadow-md cursor-pointer' onClick={() => {
                                        setIsEditMode(false);
                                        setSelectedMembers([]);
                                    }}>편집 취소</button>
                                   
                                </div>
                            )}
                            </div>
                          
                            <div>
                                {clubMemberListLoading ? (
                                    <div className='text-gray-500'>로딩 중...</div>
                                ) : clubMemberListError ? (
                                    <div className='text-red-500'>오류가 발생했습니다.</div>
                                ) : clubMemberList?.data?.result?.content && clubMemberList.data.result.content.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {clubMemberList.data.result.content.map((member) => {
                                            const isSelected = selectedMembers.includes(member.memberId);
                                            return (
                                                <div key={member.memberId} 
                                                    className={`flex justify-between gap-2 bg-white items-center p-6 rounded-lg border-2 transition-colors ${
                                                        isEditMode 
                                                            ? isSelected 
                                                                ? 'border-red-300 cursor-pointer shadow-[0px_0px_3px_2px_rgba(255,163,163,0.8)]' 
                                                                : 'border-gray-200 cursor-pointer'
                                                            : 'border-gray-200'
                                                    }`}
                                                    onClick={() => {
                                                        if (isEditMode) {
                                                            const memberId = member.memberId;
                                                            setSelectedMembers(prev => {
                                                                if (prev.includes(memberId)) {
                                                                    return prev.filter(id => id !== memberId);
                                                                } else {
                                                                    return [...prev, memberId];
                                                                }
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <div className='flex items-center gap-4'>
                                                        <div className='flex flex-col items-center justify-center gap-2'>
                                                        <img 
                                                        src={member.profileImageUrl || basicLogoImg} 
                                                        alt="프로필 이미지" 
                                                        className="w-20 h-20 border border-gray-200 rounded-full object-cover cursor-pointer"
                                                        onError={(e) => {
                                                            e.target.src = basicLogoImg;
                                                        }}
                                                        onClick={(e) => {
                                                            if (!isEditMode) {
                                                                e.stopPropagation();
                                                                navigate(`/profileDetail/${member.memberId}`);
                                                            }
                                                        }}
                                                        />
                                                         {member.temperature && (
                                                                <p className='text-sm text-blue-500'>스프 온도 {member.temperature}°C</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p 
                                                                className='text-2xl font-semibold cursor-pointer' 
                                                                onClick={(e) => {
                                                                    if (!isEditMode) {
                                                                        e.stopPropagation();
                                                                        navigate(`/profileDetail/${member.memberId}`);
                                                                    }
                                                                }}
                                                            >
                                                                {member.nickname || '익명'}
                                                            </p>
                                                            {member.intro && (
                                                                <p className='text-sm text-gray-600 line-clamp-2'>{member.intro}</p>
                                                            )}
                                                           {member.categoryDtoList && member.categoryDtoList.length > 0 && (
                                                            <div className='flex items-center gap-2 flex-wrap mt-2'>
                                                                {member.categoryDtoList.map((category, index) => {
                                                                    const categoryName = getLastCategoryName(category);
                                                                    return categoryName ? (
                                                                        <span key={index} className='text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded'>
                                                                            {categoryName}
                                                                        </span>
                                                                    ) : null;
                                                                })}
                                                            </div>
                                                            )}
                                                        
                                                        </div>
                                                       
                                                    </div>
                                                    {isEditMode && isSelected && (
                                                            <img src={expelIcon} alt="expel" className='w-6 h-6 mb-auto' />
                                                        )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className='text-gray-500 text-center py-4'>동아리원이 없습니다.</div>
                                )}
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <h2 className='text-lg font-medium'>동아리원 신청</h2>
                            <div className='flex flex-col gap-2'>
                                {clubJoinPendingListLoading ? (
                                    <div className='text-gray-500'>로딩 중...</div>
                                ) : clubJoinPendingListError ? (
                                    <div className='text-red-500'>오류가 발생했습니다.</div>
                                ) : clubJoinPendingList?.data?.result?.content && clubJoinPendingList.data.result.content.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4">
                                    {clubJoinPendingList.data.result.content.map((member) => (
                                        <div key={member.memberId} className='flex flex-col gap-4 bg-white p-6 rounded-lg border border-gray-200'>
                                            <div className='flex items-center gap-4'>
                                                <div className='flex flex-col items-center justify-center gap-2'>
                                                    <img 
                                                    src={member.profileImageUrl || basicLogoImg} 
                                                    alt="프로필 이미지" 
                                                    className="w-20 h-20 border border-gray-200 rounded-full object-cover cursor-pointer"
                                                    onError={(e) => {
                                                        e.target.src = basicLogoImg;
                                                    }}
                                                    onClick={() => navigate(`/profileDetail/${member.memberId}`)}
                                                    />
                                                    {member.temperature && (
                                                        <p className='text-sm text-blue-500'>스프 온도 {member.temperature}°C</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <p 
                                                        className='text-2xl font-semibold cursor-pointer' 
                                                        onClick={() => navigate(`/profileDetail/${member.memberId}`)}
                                                    >
                                                        {member.nickname || '익명'}
                                                    </p>
                                                    {member.intro && (
                                                        <p className='text-sm text-gray-600 line-clamp-2'>{member.intro}</p>
                                                    )}
                                                    {member.categoryDtoList && member.categoryDtoList.length > 0 && (
                                                        <div className='flex items-center gap-2 flex-wrap mt-2'>
                                                            {member.categoryDtoList.map((category, index) => {
                                                                const categoryName = getLastCategoryName(category);
                                                                return categoryName ? (
                                                                    <span key={index} className='text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded'>
                                                                        {categoryName}
                                                                    </span>
                                                                ) : null;
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='flex gap-2 justify-center'>
                                                <button 
                                                    className='bg-blue-main text-white px-6 py-2 rounded-lg hover:shadow-md cursor-pointer'
                                                    onClick={() => handleClubMemberJoinDecision({ clubId: memberId, studentId: member.memberId, decision: 'APPROVE' })}
                                                >
                                                    승인
                                                </button>
                                                <button 
                                                    className='bg-red-400 text-white px-6 py-2 rounded-lg hover:shadow-md cursor-pointer'
                                                    onClick={() => handleClubMemberJoinDecision({ clubId: memberId, studentId: member.memberId, decision: 'REJECT' })}
                                                >
                                                    거절
                                                </button>
                                            </div>
                                        </div>
                                    ))
}
</div>) : (
                                    <div className='text-gray-500 text-center py-4'>신청한 회원이 없습니다.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
            {roleType === 'STUDENT' && (
                <>
                    <h1 className='text-2xl font-bold'>내 동아리</h1>
                    <div className='flex flex-col gap-4 mt-4'>
                            <div className='flex flex-col gap-2'>
                                <div>
                                {myClubListLoading ? (
                                    <div className='text-gray-500'>로딩 중...</div>
                                ) : myClubListError ? (
                                    <div className='text-red-500'>오류가 발생했습니다.</div>
                                ) : myClubList?.data?.result?.content && myClubList.data.result.content.length > 0 ? (
                                    myClubList.data.result.content.map((club) => (
                                        <div key={club.clubId} className='flex justify-between gap-2 bg-white items-center p-4 rounded-lg border border-gray-200'>
                                            <div className='flex items-center gap-2'>
                                                <img src={club.profileImageUrl || basicLogoImg} alt="동아리 이미지" className="w-20 h-20 border border-gray-200 rounded-md object-cover cursor-pointer" />
                                                <div className='flex flex-col flex-1'>
                                                    <div className='flex items-center gap-2'>
                                                        <p className='text-2xl font-semibold cursor-pointer'
                                                        onClick={() => navigate(`/profileDetail/${club.clubId}`)}
                                                        >{club.clubName}</p>
                                                        <p>|</p>
                                                        <p className='text-md text-gray-600'>인원 <span className='text-blue-main font-bold'>{club.memberCount}</span>명</p>
                                                    </div>
                                                    <p className='text-sm text-gray-600'>{club.clubIntro}</p>
                                                </div>
                                            </div>
                                            <button className='p-2 border border-red-400 rounded-lg hover:shadow-md cursor-pointer' onClick={() => handleClubLeave(club.clubId)}>
                                            <img src={outIcon} alt="outIcon" className="w-6 h-6" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className='text-gray-500 text-center py-4'>내 동아리가 없습니다.</div>
                                )}
                                </div>
                            </div>
                    </div>
                </>
            )}
            {modalState.isOpen && (
                    <AlertModal
                        type={modalState.type}
                        title={modalState.title}
                        description={modalState.description}
                        TrueBtnText={modalState.confirmText}
                        FalseBtnText={modalState.FalseBtnText}
                        onClickTrue={modalState.onConfirm}
                        onClickFalse={modalState.onCancel}
                    />
            )}
        </div>
    );
}