import React, { useState } from 'react';
import DeclareModal from './declareModal';
import DeclareIcon from '../assets/images/warningIco.svg';

export default function DeclareButton({ 
  contentType = "게시물", 
  onDeclare, 
  iconClassName = "w-4 h-4 cursor-pointer ml-auto"
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeclareClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitDeclare = (declareData) => {
    if (onDeclare) {
      onDeclare(declareData);
    }
    // 모달은 자동으로 닫힙니다 (DeclareModal에서 처리)
  };

  return (
    <>
      <img 
        src={DeclareIcon} 
        alt="신고" 
        className={iconClassName} 
        onClick={handleDeclareClick}
      />
      
      <DeclareModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitDeclare}
        contentType={contentType}
      />
    </>
  );
} 