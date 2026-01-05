import { useState } from "react";
import basiclogoimg from "../../assets/images/basiclogoimg.png";
import trashIco from "../../assets/images/trashIco.svg";
import { UserStore } from "../../store/userStore";
import { deleteComment } from "../../api/additionalFeed";
import { useNavigate, useParams } from "react-router-dom";
import AlertModal from "../../components/alertModal";
import { COMMENT_ERRORS } from "../../constants/post";

export default function ReplyComment({ reply }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    const [errorDescription, setErrorDescription] = useState("잘못된 접근");
    const [errorAction, setErrorAction] = useState("redirect");
    const { id, worksId } = useParams();
    const { memberId } = UserStore();

    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear().toString().slice(-2); // 마지막 2자리
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    const handleDeleteReply = async () => {
        try {
            const response = await deleteComment(worksId, reply.commentId);
            // 삭제 성공 후 페이지 새로고침 
            window.location.reload();
        } catch (error) {
            console.error("답글 삭제 에러:", error);
            const errorKey = error?.response?.data?.errorKey;
            if (error.response.status === 403) {
                setShowLoginModal(true);
            }else{
                const errorInfo = COMMENT_ERRORS[errorKey];
                setErrorModal(true);
                setErrorDescription(errorInfo?.message || "알 수 없는 오류가 발생했습니다.");
                setErrorAction(errorInfo?.action || "redirect");
            }
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        handleDeleteReply();
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
                    <img src={basiclogoimg} alt="profile" className="w-full h-full rounded-full" />
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
            {showLoginModal && (
                  <AlertModal
                  type="simple"
                  title="로그인이 필요합니다"
                  description="SouF 회원만 댓글을 작성할 수 있습니다!"
                  TrueBtnText="로그인하러 가기"
                  FalseBtnText="취소"
                  onClickTrue={() => {
                    setShowLoginModal(false);
                    navigate("/login");
                  }}
                  onClickFalse={() => setShowLoginModal(false)}
                   />
                 )}
            {errorModal && (
                <AlertModal
                  type="simple"
                  title="잘못된 접근"
                  description={errorDescription}
                  TrueBtnText="확인"
                  onClickTrue={() => {
                    if (errorAction === "redirect") {
                        navigate("/feed");
                    } else if (errorAction === "refresh") {
                        window.location.reload();
                    }
                }}
                   />
                 )}
        </div>
    );
} 