import { useState, useEffect } from "react";
import BasicProfileImg4 from "../../assets/images/BasicProfileImg4.png";
import editIco from "../../assets/images/editIco.svg";
import trashIco from "../../assets/images/trashIco.svg";
import { UserStore } from "../../store/userStore";
import { deleteComment, postAdditionalComment } from "../../api/additionalFeed";
import { useParams } from "react-router-dom";
import AlertModal from "../../components/alertModal";

export default function Comment({ comment, onReplyClick, onToggleReplies, showReplies, hasReplies, checkHasReplies, commentsWithReplies }) {
    // const [editContent, setEditContent] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [hasRepliesState, setHasRepliesState] = useState(false);
    const { id, worksId } = useParams();
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

    // 컴포넌트 마운트 시 대댓글 존재 여부 확인
    useEffect(() => {
        const checkReplies = async () => {
            if (checkHasReplies) {
                const hasReplies = await checkHasReplies();
                setHasRepliesState(hasReplies);
            }
        };
        checkReplies();
    }, [checkHasReplies]);
    
    // console.log(comment);
    // console.log("worksId from URL:", worksId);
    
    const handleDeleteComment = async () => {
       
        try {
            const response = await deleteComment(worksId, comment.commentId);
            console.log("삭제 API 응답:", response);
            // 삭제 성공 후 페이지 새로고침 또는 댓글 목록 업데이트
            window.location.reload();
        } catch (error) {
            console.error("댓글 삭제 에러:", error);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        handleDeleteComment();
        setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleReplyClick = () => {
        if (onReplyClick) {
            onReplyClick(comment);
        }
    };

    const handleToggleRepliesClick = () => {
        if (onToggleReplies) {
            onToggleReplies();
        }
    };

    return (
        <div>
           <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-[0.5px] border-gray-200">
                {comment.profileUrl ? (
                    <img src={comment.profileUrl} alt="profile" className="w-full h-full rounded-full" />
                ) : (
                    <img src={BasicProfileImg4} alt="profile" className="w-full h-full rounded-full" />
                )}
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{comment.nickname}</p>
                <p className="text-sm text-gray-400">{formatDate(comment.lastModifiedTime)}</p>
                </div>
                <p className="text-medium text-gray-800 font-medium">{comment.content}</p>
                
                {!comment.parentId && (
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                        <button onClick={handleReplyClick}>답글 달기</button>
                        {commentsWithReplies[comment.commentId] && (
                            <button onClick={handleToggleRepliesClick}>
                                {showReplies ? "답글 닫기" : "답글 열기"}
                            </button>
                        )}
                    </div>
                )}
            </div>
            </div>
            {memberId === comment.writerId? ( 
                <div className="flex gap-2 opacity-50">
                <button 
                onClick={handleDeleteClick}
                className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <img src={trashIco} alt="trashIco" className="w-4 h-4" />
                </button>
            </div>) : (
                <></>
            )}
           
           </div>
           
           {showDeleteModal && (
               <AlertModal
                   type="warning"
                   title="댓글을 삭제하시겠습니까?"
                   TrueBtnText="확인"
                   FalseBtnText="취소"
                   onClickTrue={handleConfirmDelete}
                   onClickFalse={handleCancelDelete}
               />
           )}
        </div>
    )
}