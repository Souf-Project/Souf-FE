import { useQuery } from "@tanstack/react-query";
import { getChatRooms, postChatImage, postChatImageUpload, deleteChatRoom } from "../../api/chat";
import { postChatVideo, postVideoSignedUrl, postVideoUpload, uploadToS3Video } from "../../api/video";
import ReceiverMessage from "./ReceiverMessage";
import SenderMessage from "./senderMessage";
import { UserStore } from "../../store/userStore";
import { useRef, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  connectChatSocket,
  disconnectChatSocket,
  sendChatMessage,
} from "../../api/chatSocket";
import plusIco from "../../assets/images/plusIco.svg"
import AlertModal from "../alertModal";
import DegreeModal from "../degreeModal";
import Checkout from "../pay/checkout";
import chatImgIcon from "../../assets/images/chatImgIcon.png"
import chatVideoIcon from "../../assets/images/chatVideoIcon.png"
import { uploadToS3 } from "../../api/feed";
import ImageModal from "./ImageModal";
import SouFLogo from "../../assets/images/SouFLogo.svg";
import outIcon from "../../assets/images/outIcon.svg";


export default function ChatMessage({ chatNickname, roomId, opponentProfileImageUrl, opponentId, opponentRole }) {
    const { nickname } = UserStore();
    const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [realtimeMessages, setRealtimeMessages] = useState([]);
  const [showButtonList, setShowButtonList] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const scrollRef = useRef(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showDegreeModal, setShowDegreeModal] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [pendingImageUpload, setPendingImageUpload] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

      const {
    data: chatMessages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chatRoom", roomId],
    queryFn: async () => {
      const data = await getChatRooms(roomId);
      
      
      return data;
    },
    keepPreviousData: true,
  });

   // 기존 메시지와 실시간 메시지를 합쳐서 표시
  const allMessages = [...(chatMessages || []), ...realtimeMessages];

  // console.log("모든 메시지:", allMessages);

  useEffect(() => {
    if (!roomId || !nickname) return;
  
        connectChatSocket(roomId, (incomingMessage) => {
    
      setRealtimeMessages((prev) => [...prev, incomingMessage]);
  
      const isFileOrImage = ["IMAGE", "FILE"].includes(incomingMessage.type);
      
      if (isFileOrImage && pendingImageUpload) {
      
        handleFileUploadComplete(incomingMessage.chatId, pendingImageUpload);
      } else {
      
      }
    });

    return () => {
      console.log("채팅 소켓 연결 해제");
      disconnectChatSocket();
    };
  }, [roomId, nickname, pendingImageUpload]);
  

  // 스크롤 자동 내리기
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const messageObj = {
      roomId,
      sender: nickname,
      type: "TALK",
      content: newMessage,
    };

   
    
    const success = sendChatMessage(messageObj);
    if (success) {
    setNewMessage("");
      console.log("메시지 전송 완료");
    } else {
      console.error("메시지 전송 실패");
      
    }
  };

  const handlePlusClick = () => {
    setShowButtonList(!showButtonList);
  };

  const handleButton1Click = () => {
    console.log("버튼 1 클릭");
    setShowCheckout(true);
    setShowButtonList(false);
  };

  const handleDegreeModalClick = () => {
    setShowAlertModal(false);
    setShowDegreeModal(true);
    setShowButtonList(false);
  };
  

  const handleFileUpload = async (file) => {
    try {
     
     
      const uploadResponse = await postChatImage([file.name]);
      if (!uploadResponse || uploadResponse.length === 0) {
        throw new Error("업로드 URL을 받지 못했습니다.");
      }
  
      const uploadInfo = uploadResponse[0];

      // let contentType = file.type;
    
    
      await uploadToS3(uploadInfo.presignedUrl, file);
     
      let fileType = file.type;
      // const fileType = file.type;

      const isImage = fileType.startsWith("image/");
      const isVideo = fileType.startsWith("video/");
      const messageType = isImage ? "IMAGE" : isVideo ? "VIDEO" : "FILE";
      const fileMessage = {
        roomId,
        sender: nickname,
        type: messageType,
        content: uploadInfo.fileUrl,
      };
     
      const success = sendChatMessage(fileMessage);
      if (success) {
       
        setPendingImageUpload({
          fileUrl: uploadInfo.fileUrl,
          fileName: file.name,
          fileType: file.type.split("/")[1].toUpperCase(),
        });
      } else {
        console.error("파일 메시지 전송 실패");
      }
    } catch (error) {
      console.error("파일 업로드 에러:", error);
      alert("파일 업로드에 실패했습니다.");
    }
  };
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
    event.target.value = '';
  };

  const handleVideoSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // 동영상 파일 크기 제한 (100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        alert("동영상 파일 크기는 100MB 이하여야 합니다.");
        return;
      }
      
      try {
       
        // 1. /api/v1/chat/video-upload 호출
        const videoUploadResponse = await postChatVideo([file.name]);
        
        // videoUploadResponse에서 uploadId 추출
        const uploadId = videoUploadResponse.uploadId;
        const responseFileName = videoUploadResponse.fileName;
       
        if (!uploadId) {
          throw new Error("uploadId를 받지 못했습니다.");
        }
        
        // 2. 멀티파트 업로드 로직 (postUpload와 동일)
        const chunkSize = 10 * 1024 * 1024; // 10MB 청크
        const chunkCount = Math.ceil(file.size / chunkSize);
        let getSignedUrlRes = "";
        let multiUploadArray = [];
        
        for (let uploadCount = 1; uploadCount <= chunkCount; uploadCount++) {
        
          const start = (uploadCount - 1) * chunkSize;
          const end = uploadCount * chunkSize;
          const fileBlob =
            uploadCount < chunkCount
              ? file.slice(start, end)
              : file.slice(start);

          const signedUrlRes = await postVideoSignedUrl({
            uploadId: uploadId,
            partNumber: uploadCount,
            fileName: responseFileName,
          });

          const presignedUrl = signedUrlRes?.result?.presignedUrl;
          const uploadChunk = await uploadToS3Video(presignedUrl, fileBlob);

          const etag = uploadChunk.headers.get("ETag")?.replace(/"/g, "");
          multiUploadArray.push({
            awsETag: etag,
            partNumber: uploadCount,
          });

          // 마지막 part만 URL 저장
          if (uploadCount === chunkCount) {
            getSignedUrlRes = signedUrlRes;
          }
        }
        
        // 3. /api/v1/upload/complete-video-upload로 완료하기
        try {
          const completeVideoData = {
            uploadId: uploadId,
            fileName: responseFileName,
            parts: multiUploadArray
          };
        
          await postVideoUpload(completeVideoData);
          
          // 4. 동영상 업로드 완료 후 실제 동영상 URL을 받아서 채팅 메시지로 전송
          const videoMessage = {
            roomId,
            sender: nickname,
            type: "VIDEO",
            content: getSignedUrlRes?.result?.fileUrl, // presigned URL이 아닌 실제 동영상 URL 사용
          };
          
          const success = sendChatMessage(videoMessage);
          if (success) {
            console.log("동영상 메시지 전송 완료");
          } else {
            console.error("동영상 메시지 전송 실패");
          }
        
        } catch (completeError) {
          console.error("complete-video-upload 에러:", completeError);
        }
        
      } catch (error) {
        console.error("동영상 업로드 에러:", error);
        alert("동영상 업로드에 실패했습니다.");
      }
    }
    event.target.value = '';
  };
  
  const handleImgButtonClick = () => {
    setShowButtonList(false);
    fileInputRef.current?.click();
  };

  const handleVideoButtonClick = () => {
    setShowButtonList(false);
    videoInputRef.current?.click();
  };

  const handleFileButtonClick = () => {
    setShowButtonList(false);
  };

  // 이미지 업로드 완료 처리
  const handleFileUploadComplete = async (chatId, uploadInfo) => {
    try {
     
      
      await postChatImageUpload({
        chatId: chatId,
        fileUrl: [uploadInfo.fileUrl],
        fileName: [uploadInfo.fileName],
        fileType: [uploadInfo.fileType],
      });
     
      setPendingImageUpload(null); // 대기 상태 해제
    } catch (error) {
      console.error("postChatImageUpload 에러:", error);
    }
  };

  const handleButton3Click = () => {
    console.log("버튼 3 클릭");
    setShowAlertModal(true);
    setShowButtonList(false);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleFileClick = (fileUrl) => {
    // 파일 다운로드
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteChatRoom = async (roomId) => {
    try {
      // 사용자 확인
      const isConfirmed = window.confirm("정말로 이 채팅방을 나가시겠습니까?");
      if (!isConfirmed) return;

      console.log("채팅방 삭제 시작:", roomId);
      await deleteChatRoom(roomId);
      console.log("채팅방 삭제 완료");
      
      // 채팅 목록 페이지로 이동
      navigate("/chat");
    } catch (error) {
      console.error("채팅방 삭제 실패:", error);
      alert("채팅방 나가기에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
   <div className="h-full flex flex-col">
  {/* 채팅 헤더 - 데스크톱에서만 표시 */}
  <div className="hidden lg:flex h-20 mt-4 p-4 border-b border-gray-200 items-center justify-between">
    <div className="flex items-center gap-4">
    <img 
      src={opponentProfileImageUrl || SouFLogo} 
      alt={chatNickname}
      className="w-10 h-10 rounded-[100%] object-cover" 
      onError={(e) => {
        e.target.src = SouFLogo;
      }}
    />
    <h2 className="font-semibold text-2xl">{chatNickname}</h2>
    </div>
   
   
      <button className="bg-red-600 rounded-md p-2 text-white flex items-center gap-2" onClick={() => handleDeleteChatRoom(roomId)}>
      <img src={outIcon} alt="outIcon" className="w-4 h-4" />
       나가기
      </button>
    </div>

  {/* 모바일에서만 표시되는 나가기 버튼 */}
  <div className="lg:hidden flex justify-end p-2">
    <button 
      className="bg-red-600 rounded-md p-2 text-white flex items-center gap-2 text-sm" 
      onClick={() => handleDeleteChatRoom(roomId)}
    >
      <img src={outIcon} alt="outIcon" className="w-3 h-3" />
      나가기
    </button>
  </div>


  {/* 숨겨진 파일 입력 */}
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileSelect}
    accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.hwp,.zip"
    style={{ display: 'none' }}
  />

  {/* 숨겨진 동영상 입력 */}
  <input
    type="file"
    ref={videoInputRef}
    onChange={handleVideoSelect}
    accept="video/*"
    style={{ display: 'none' }}
  />

  {/* Checkout 모달 */}
  {showCheckout && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">결제</h2>
          <button 
            onClick={() => setShowCheckout(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        <Checkout />
      </div>
    </div>
  )}

  {/* 이미지 모달 */}
  {selectedImage && (
    <ImageModal 
      imageUrl={selectedImage} 
      onClose={() => setSelectedImage(null)} 
    />
  )}

  {/* 채팅 메시지 영역 */}
  <div className="flex-1 p-4 overflow-y-auto">
    {allMessages?.map((chat, idx) => {
      const isMyMessage = chat.sender === nickname;

      // 현재 메시지의 날짜
      const currentMessageDate = chat.createdTime 
        ? new Date(chat.createdTime).toLocaleDateString()
        : new Date().toLocaleDateString();
      
      // 이전 메시지의 날짜 (첫 번째 메시지가 아닌 경우)
      const previousMessageDate = idx > 0 && allMessages[idx - 1]?.createdTime
        ? new Date(allMessages[idx - 1].createdTime).toLocaleDateString()
        : null;
      
      // 날짜가 바뀌었는지 확인
      const shouldShowDate = idx === 0 || currentMessageDate !== previousMessageDate;

      return (
        <div key={`${chat.sender}-${idx}-${chat.timestamp || idx}`}>
          {/* 날짜 표시 */}
          {shouldShowDate && (
            <div className="text-center text-gray-500 text-sm mb-4 mt-4">
              {currentMessageDate}
            </div>
          )}
          
          {/* 메시지 */}
          {isMyMessage ? (
        <SenderMessage 
          content={chat.content} 
          createdTime={chat.createdTime}
              type={chat.type}
              onImageClick={handleImageClick}
              onFileClick={handleFileClick}
        />
      ) : (
        <ReceiverMessage 
          content={chat.content} 
          createdTime={chat.createdTime}
          opponentProfileImageUrl={opponentProfileImageUrl}
          type={chat.type}
          onImageClick={handleImageClick}
          onFileClick={handleFileClick}
          opponentId={opponentId}
          opponentRole={opponentRole}
        />
          )}
        </div>
      );
    })}
    <div ref={scrollRef} />
  </div>

  {/* 메시지 입력 영역 */}
  <div className="p-4 border-t border-gray-200">
    <div className="flex gap-2 lg:gap-4">
      <button 
        className="bg-gray-200 px-2 lg:px-4 py-2 rounded-lg font-bold"
        onClick={handlePlusClick}
      >
        <img 
          src={plusIco} 
          alt="plus" 
          className={`w-4 h-4 transition-transform duration-200 ${showButtonList ? 'rotate-45' : 'rotate-0'}`} 
        />
      </button>
      <input
        type="text"
        placeholder="메시지를 입력하세요"
        className="flex-grow px-3 lg:px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-main text-sm lg:text-base"
        value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button 
        className="bg-blue-main text-white px-4 lg:px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors duration-200 text-sm lg:text-base"
        onClick={handleSend}
      >
        전송
      </button>
    </div>
    
    {/* 버튼 리스트 */}
    {showButtonList && (
      <div className="mt-6 lg:mt-10 mb-6 lg:mb-8 flex gap-2 lg:gap-4 flex-wrap">
        {/* <Checkout />
        <button 
          className="bg-blue-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
          onClick={handleButton1Click}
        >
          토스
        </button> */}
        <button 
          className="bg-green-500 text-white px-4 lg:px-6 py-3 lg:py-4 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 text-sm lg:text-base"
          onClick={handleImgButtonClick}
        >
          <img src={chatImgIcon} alt="파일 첨부" className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
        <button 
          className="bg-blue-500 text-white px-4 lg:px-6 py-3 lg:py-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 text-sm lg:text-base"
          onClick={handleVideoButtonClick}
        >
          <img src={chatVideoIcon} alt="동영상" className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
        {/* <button 
          className="bg-blue-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200"
          onClick={handleFileButtonClick}
        >
          <img src={chatImgIcon} alt="chatImgIcon" className="w-6 h-6" />
        </button> */}
        <button 
          className="bg-blue-300 text-white px-4 lg:px-6 py-3 lg:py-4 rounded-lg font-medium hover:bg-blue-400 transition-colors duration-200 text-sm lg:text-base"
          onClick={handleButton3Click}
        >
          SouF 온도 남기기 
        </button>
      </div>
    )}
    {showAlertModal && (
      <AlertModal
        type="simple"
        title="SouF 온도 남기기"
        description={`SouF 온도를 남기시겠습니까?\n온도를 남기시면 거래가 자동으로 완료 처리됩니다.`}
        onClickTrue={() => handleDegreeModalClick()}
        onClickFalse={() => setShowAlertModal(false)}
        FalseBtnText="취소"
        TrueBtnText="확인"
      />
    )}
    {showDegreeModal && (
      <DegreeModal
        title="SouF 온도 평가"
        description="이번 거래에 대한 만족도를 평가해주세요"
        bottomText="별점을 선택해주세요"
        FalseBtnText="취소"
        TrueBtnText="확인"
        onClickFalse={() => setShowDegreeModal(false)}
        onClickTrue={() => {
          console.log("온도 평가 확인");
          setShowDegreeModal(false);
        }}
      />
    )}
  </div>
</div>

  );
}
