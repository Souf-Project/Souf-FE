import { useState, useEffect } from "react";
import BasicProfileImg4 from "../../assets/images/BasicProfileImg4.png";
import editIco from "../../assets/images/editIco.svg";
import trashIco from "../../assets/images/trashIco.svg";
import { UserStore } from "../../store/userStore";
import { deleteComment, postAdditionalComment } from "../../api/additionalFeed";
import { useNavigate, useParams } from "react-router-dom";
import AlertModal from "../../components/alertModal";
import DeclareButton from "../declare/declareButton";
import { COMMENT_ERRORS } from "../../constants/post";

export default function Comment({ comment, onReplyClick, onToggleReplies, showReplies, hasReplies, checkHasReplies, commentsWithReplies }) {
    // const [editContent, setEditContent] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [hasRepliesState, setHasRepliesState] = useState(false);
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

    useEffect(() => {
        const checkReplies = async () => {
            if (checkHasReplies) {
                const hasReplies = await checkHasReplies();
                setHasRepliesState(hasReplies);
            }
        };
        checkReplies();
    }, [checkHasReplies]);
    
    const handleDeleteComment = async () => {
        try {
            // 대댓글인지 댓글인지 확인
            if (comment.parentId) {
                // 대댓글인 경우
                const response = await deleteComment(worksId, comment.commentId);
            } else {
                // 일반 댓글인 경우
                const response = await deleteComment(worksId, Number(comment.commentId));
            }
           
            // 삭제 성공 후 페이지 새로고침 
            window.location.reload();
        } catch (error) {
            console.error("댓글 삭제 에러:", error);
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
    
    const handleDeclareClick = (declareData) => {
        console.log('댓글 신고 데이터:', declareData);
        // 여기에 신고 API 호출
      };

    return (
        <div>
           <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-[0.5px] border-gray-200 mb-auto">
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
                <DeclareButton 
                contentType="댓글" 
                onDeclare={handleDeclareClick}
                iconClassName="w-4 h-4 cursor-pointer ml-auto"
              />
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
    )
}