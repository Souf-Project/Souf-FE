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
    const [commentsWithReplies, setCommentsWithReplies] = useState({}); // { commentId: boolean }
    const [commentContent, setCommentContent] = useState("");
    const [replyMode, setReplyMode] = useState(false);
    const [replyToComment, setReplyToComment] = useState(null);
    const [replyPages, setReplyPages] = useState({}); // { commentId: currentPage }
    const [hasMoreReplies, setHasMoreReplies] = useState({}); // { commentId: boolean }
    const { id, worksId } = useParams();
    const { memberId } = UserStore();

    const fetchComments = async () => {
        try {
            const response = await getComment(worksId);
            if (response?.result?.content) {
                setCommentList(response.result.content);
                
                const commentsWithReplies = {};
                for (const comment of response.result.content) {
                    try {
                        const replyResponse = await getAdditionalComment(worksId, comment.commentId, { page: 0, size: 10 });
                        
                        // 첫번째 대댓글은 댓글 내용이라 지움
                        if (replyResponse?.result?.content && replyResponse.result.content.length > 1) {
                            commentsWithReplies[comment.commentId] = true;
                        }
                    } catch (error) {
                        console.error(`댓글 ${comment.commentId}의 대댓글 확인 에러:`, error);
                    }
                }
                
                setCommentsWithReplies(commentsWithReplies);
            }
        } catch (error) {
            console.error("댓글 조회 에러:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [worksId]);

    const fetchAdditionalComments = async (commentId, page = 0, isLoadMore = false) => {
        try {
            const response = await getAdditionalComment(worksId, commentId, { page: page, size: 5 });
            
            console.log(`대댓글 조회 - 댓글ID: ${commentId}, 페이지: ${page}`, response);
            
            if (response?.result?.content && response.result.content.length > 0) {
                // 첫 번째 대댓글은 댓글이라 지움
                const actualReplies = response.result.content.slice(1);
                
                console.log(`실제 대댓글 개수: ${actualReplies.length}`, actualReplies);
                
                if (actualReplies.length > 0) {
                    if (isLoadMore) {
                        // 더보기: 기존 대댓글에 추가
                        setReplyComments(prev => ({
                            ...prev,
                            [commentId]: [...(prev[commentId] || []), ...actualReplies]
                        }));
                    } else {
                        // 처음 로드: 기존 대댓글 교체
                        setReplyComments(prev => ({
                            ...prev,
                            [commentId]: actualReplies
                        }));
                    }
                    
                    let hasMore = false;
                    
                    if (response.result.last !== undefined) {
                        // last가 false이면 다음 페이지가 있음
                        hasMore = !response.result.last;
                    } else if (response.result.totalElements !== undefined && response.result.totalElements > 0) {
                        // totalElements를 사용하여 계산
                        // 첫 번째 항목(댓글 내용)을 제외한 실제 대댓글 수 계산
                        const actualTotalReplies = response.result.totalElements - 1; // 첫 번째 항목 제외
                        
                        if (page === 0) {
                            // 첫 페이지: (첫번째 대댓글을 제외한)4개 로드 + 현재 로드된 개수
                            const currentTotal = 4 + actualReplies.length;
                            hasMore = currentTotal < actualTotalReplies;
                        } else {
                            // 두 번째 페이지부터: 대댓글 5개씩 + 현재 로드된 개수
                            const currentTotal = 4 + ((page - 1) * 5) + actualReplies.length;
                            hasMore = currentTotal < actualTotalReplies;
                        }
                    } else if (response.result.numberOfElements !== undefined) {
                        // numberOfElements를 사용하여 계산
                        if (page === 0) {
                            // 첫 페이지: 4개가 모두 로드되었다면 다음 페이지가 있을 가능성이 높음
                            hasMore = response.result.numberOfElements > 4;
                        } else {
                            // 두 번째 페이지부터: 5개가 모두 로드되었다면 다음 페이지가 있을 가능성이 높음
                            hasMore = response.result.numberOfElements === 5;
                        }
                    } else {
                        // fallback: 현재 로드된 개수로 판단
                        if (page === 0) {
                            hasMore = actualReplies.length === 4;
                        } else {
                            hasMore = actualReplies.length === 5;
                        }
                    }
                    
                    setHasMoreReplies(prev => ({
                        ...prev,
                        [commentId]: hasMore
                    }));
                }
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

                const response = await postAdditionalComment(worksId, requestBody);
                
                // 답글 작성 후 해당 댓글의 대댓글을 다시 가져오기
                setTimeout(async () => {
                    await fetchAdditionalComments(replyToComment.commentId, 0, false);
                    
                    setCommentsWithReplies(prev => ({
                        ...prev,
                        [replyToComment.commentId]: true
                    }));
                    
                    // 답글 모드가 활성화된 댓글의 답글 표시 상태를 true로 설정
                    setShowReplies(prev => ({
                        ...prev,
                        [replyToComment.commentId]: true
                    }));
                    
                    // 페이지 상태 초기화
                    setReplyPages(prev => ({
                        ...prev,
                        [replyToComment.commentId]: 0
                    }));
                }, 1000);
            } else {
               
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

            if (!replyMode) {
                fetchComments();
            }
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

    const handleToggleReplies = async (commentId) => {
        const isCurrentlyShown = showReplies[commentId];
        
        if (!isCurrentlyShown) {
            // 답글을 처음 열 때는 페이지 0부터 시작
            setReplyPages(prev => ({
                ...prev,
                [commentId]: 0
            }));
            await fetchAdditionalComments(commentId, 0, false);
        }
        
        setShowReplies(prev => ({
            ...prev,
            [commentId]: !isCurrentlyShown
        }));
    };

    const handleLoadMoreReplies = async (commentId) => {
        const currentPage = replyPages[commentId] || 0;
        const nextPage = currentPage + 1;
        
        // 다음 페이지 로드
        await fetchAdditionalComments(commentId, nextPage, true);
        
        // 페이지 상태 업데이트
        setReplyPages(prev => ({
            ...prev,
            [commentId]: nextPage
        }));
    };

    const checkHasReplies = async (commentId) => {
        try {
            const response = await getAdditionalComment(worksId, commentId, { page: 0, size: 1 });
            // 첫 번째 항목은 댓글 내용이므로 제거하고 실제 대댓글이 있는지 확인
            return response?.result?.content && response.result.content.length > 1;
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
                                commentsWithReplies={commentsWithReplies}
                            />
                            {/* 대댓글 표시 */}
                            {showReplies[comment.commentId] && replyComments[comment.commentId] && (
                                <div className="ml-8 mt-2 space-y-2">
                                    {replyComments[comment.commentId].map((reply) => (
                                        <ReplyComment 
                                            key={reply.commentId} 
                                            reply={reply} 
                                        />
                                    ))}
                                    {/* 더보기 버튼 */}
                                    {hasMoreReplies[comment.commentId] && (
                                        <button
                                            onClick={() => handleLoadMoreReplies(comment.commentId)}
                                            className="text-sm text-gray-400 py-2 px-3 "
                                        >
                                            답글 더보기
                                        </button>
                                    )}
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