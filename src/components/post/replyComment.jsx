import { useState } from "react";
import BasicProfileImg4 from "../../assets/images/BasicProfileImg4.png";
import trashIco from "../../assets/images/trashIco.svg";
import { UserStore } from "../../store/userStore";
import AlertModal from "../../components/alertModal";

export default function ReplyComment({ reply, onDelete }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { memberId } = UserStore();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear().toString().slice(-2); // 마지막 2자리
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        onDelete(reply);
        setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className="flex items-start gap-3 rounded-lg py-2">
            <div className="w-8 h-8 rounded-full border-[0.5px] border-gray-200 flex-shrink-0">
                {reply.profileUrl ? (
                    <img src={reply.profileUrl} alt="profile" className="w-full h-full rounded-full" />
                ) : (
                    <img src={BasicProfileImg4} alt="profile" className="w-full h-full rounded-full" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{reply.nickname}</p>
                    <p className="text-xs text-gray-400">{formatDate(reply.lastModifiedTime)}</p>
                </div>
                <p className="text-sm text-gray-800">{reply.content}</p>
            </div>
            {memberId === reply.writerId && (
                <div className="flex opacity-50">
                    <button 
                        onClick={handleDeleteClick}
                        className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center"
                    >
                        <img src={trashIco} alt="trashIco" className="w-4 h-4" />
                    </button>
                </div>
            )}
            
            {showDeleteModal && (
                <AlertModal
                    type="warning"
                    title="답글을 삭제하시겠습니까?"
                    TrueBtnText="확인"
                    FalseBtnText="취소"
                    onClickTrue={handleConfirmDelete}
                    onClickFalse={handleCancelDelete}
                />
            )}
        </div>
    );
} 