import Comment from "./comment";
import ReplyComment from "./replyComment";
import sendIco from "../../assets/images/sendIco.svg";
import { useState, useEffect } from "react";
import { getComment, postComment, deleteComment, postAdditionalComment, getAdditionalComment } from "../../api/additionalFeed";
import { UserStore } from "../../store/userStore";
import { useParams } from "react-router-dom";
import BasicProfileImg4 from "../../assets/images/BasicProfileImg4.png";

export default function commentList() {
    const [commentList, setCommentList] = useState([]);
    const [replyComments, setReplyComments] = useState({}); // { commentId: [replies] }
    const [showReplies, setShowReplies] = useState({}); // { commentId: boolean }
    const [commentContent, setCommentContent] = useState("");
    const [replyMode, setReplyMode] = useState(false);
    const [replyToComment, setReplyToComment] = useState(null);
    const { id, worksId } = useParams();
    const { memberId } = UserStore();

    const fetchComments = async () => {
        try {
            const response = await getComment(worksId);
            // console.log("댓글 리스트 조회 결과:", response);
            if (response?.result?.content) {
                // 대댓글이 아닌 일반 댓글만 필터링
                const parentComments = response.result.content.filter(comment => !comment.parentId);
                setCommentList(parentComments);
                console.log("댓글 리스트:", parentComments);
                // console.log("댓글 리스트:", response.result.content);
            }
        } catch (error) {
            console.error("댓글 조회 에러:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [worksId]);

    const fetchAdditionalComments = async (commentId) => {
        try {
            const response = await getAdditionalComment(worksId, commentId, { page: 0, size: 10 });
            console.log(`댓글 ID ${commentId}의 대댓글 리스트:`, response);
            
            if (response?.result?.content && response.result.content.length > 0) {
                setReplyComments(prev => ({
                    ...prev,
                    [commentId]: response.result.content
                }));
            }
        } catch (error) {
            console.error("대댓글 조회 에러:", error);
        }
    };

    const handleCommentSubmit = async () => {
        if (!commentContent.trim()) return;

        try {
            if (replyMode) {
                // 답글 작성
                const requestBody = {
                    writerId: memberId,
                    content: commentContent,
                    authorId: Number(id),
                    parentId: replyToComment.commentId
                };

                await postAdditionalComment(worksId, requestBody);
            } else {
                // 일반 댓글 작성
                const requestBody = {
                    writerId: memberId,
                    content: commentContent,
                    authorId: Number(id)
                };

                await postComment(worksId, requestBody);
            }

            setCommentContent("");
            setReplyMode(false);
            setReplyToComment(null);

            fetchComments();
        } catch (error) {
            console.error("댓글 작성 에러:", error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCommentSubmit();
        }
    };

    const handleReplyClick = (comment) => {
        setReplyMode(true);
        setReplyToComment(comment);
    };

    const handleCancelReply = () => {
        setReplyMode(false);
        setReplyToComment(null);
        setCommentContent("");
    };

    const handleReplyDelete = async (replyComment) => {
        try {
            const requestBody = {
                commentId: replyComment.commentId,
                writerId: memberId,
                content: replyComment.content
            };
            
            await deleteComment(worksId, requestBody);
            fetchComments(); // 댓글 목록 새로고침
        } catch (error) {
            console.error("대댓글 삭제 에러:", error);
        }
    };

    const handleToggleReplies = async (commentId) => {
        const isCurrentlyShown = showReplies[commentId];
        
        if (!isCurrentlyShown) {
            // 답글 열기: API 호출 후 표시
            await fetchAdditionalComments(commentId);
        }
        
        setShowReplies(prev => ({
            ...prev,
            [commentId]: !isCurrentlyShown
        }));
    };

    const checkHasReplies = async (commentId) => {
        try {
            const response = await getAdditionalComment(worksId, commentId, { page: 0, size: 1 });
            return response?.result?.content && response.result.content.length > 0;
        } catch (error) {
            console.error("대댓글 확인 에러:", error);
            return false;
        }
    };

    return (
        <div className="flex flex-col rounded-2xl border border-gray-200 px-6 py-6 w-full shadow-sm max-w-4xl mx-auto mt-4 mb-24">
            {/* 댓글 목록 */}
            <div className="flex flex-col gap-4">
                {commentList?.length > 0 ? (
                    commentList?.map((comment) => (
                        <div key={comment.commentId}>
                            <Comment 
                                comment={comment} 
                                onReplyClick={handleReplyClick}
                                onToggleReplies={() => handleToggleReplies(comment.commentId)}
                                showReplies={showReplies[comment.commentId]}
                                hasReplies={replyComments[comment.commentId]?.length > 0}
                                checkHasReplies={() => checkHasReplies(comment.commentId)}
                            />
                            {/* 대댓글 표시 */}
                            {showReplies[comment.commentId] && replyComments[comment.commentId] && (
                                <div className="ml-8 mt-2 space-y-2">
                                    {replyComments[comment.commentId].map((reply) => (
                                        <ReplyComment 
                                            key={reply.commentId} 
                                            reply={reply} 
                                            onDelete={handleReplyDelete}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-4" />
                )}
            </div>

            {/* 답글 모드 표시 */}
            {replyMode && replyToComment && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                        {replyToComment.nickname} 님께 답글 작성...
                    </span>
                    <button 
                        onClick={handleCancelReply}
                        className="text-sm text-gray-400 hover:text-gray-600"
                    >
                        취소
                    </button>
                </div>
            )}

            {/* 댓글 입력칸 */}
            <div className="flex items-center gap-2 mt-4">
                <input 
                    className="w-full h-10 rounded-full border border-gray-200 px-4 py-2 transition-all duration-200 focus:outline-none focus:shadow-sm focus:ring-2 focus:ring-yellow-point focus:border-transparent" 
                    placeholder={replyMode ? "답글을 입력해주세요." : "댓글을 입력해주세요."}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button 
                    className="w-16 h-10 rounded-full bg-yellow-point flex items-center justify-center"
                    onClick={handleCommentSubmit}
                >
                    <img src={sendIco} alt="sendIco" className="w-10 h-10" />
                </button>
            </div>
        </div>
    )
}