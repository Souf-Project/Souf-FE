import React, { useState } from 'react';
import DeclareModal from './declareModal';
import DeclareIcon from '../../assets/images/declareIcon.png'; 

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