import { useQuery } from '@tanstack/react-query';
import { getInquiryList } from '../../api/mypage';
import { UserStore } from '../../store/userStore';
import Loading from '../loading';

export default function InquiryContent() {
    const { memberId } = UserStore();
    const { data, isLoading, error } = useQuery({
        queryKey: ['inquiryList', memberId],
        queryFn: () => getInquiryList({ memberId }),
    });

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <div>No data available</div>;
    }

    // console.log('API Response:', data);
    
    const inquiryList = data?.data?.result?.content || [];
    // console.log('Inquiry List:', inquiryList);
    return (
        <div>
            <h1 className='text-2xl font-bold'>내 문의 내역</h1>
            <div className='flex flex-col gap-4 mt-4'>
                {inquiryList.map((inquiry) => (
                    <div key={inquiry.inquiryId} className='flex gap-4 items-center justify-start border rounded-lg p-4'>
                        {/* 문의 날짜랑 답변 상태 추가되면 수정하기 */}
                        {inquiry.status === 'FALSE' && (
                            <div className='bg-gray-400 text-white px-2 py-1 rounded-sm'>미답변</div>
                        )}
                        {inquiry.status === 'TRUE' && (
                            <div className='bg-gray-300 text-gray-500 px-2 py-1 rounded-sm'>답변 완료</div>
                        )}
                        <div className='bg-red-400 text-white px-2 py-1 rounded-sm'>미답변</div>
                        <div className="flex flex-col gap-2 ">
                        <h2 className='text-lg font-bold'>{inquiry.title}</h2>
                        <p className='text-sm text-gray-500'>{inquiry.content}</p>
                        </div>
                      
                    </div>
                ))}
            </div>
        </div>
    )
}