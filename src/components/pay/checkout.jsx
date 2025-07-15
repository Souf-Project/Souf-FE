import React, { useEffect, useState } from 'react';

export default function Checkout() {
  const [tossPayments, setTossPayments] = useState(null);
  const clientKey = import.meta.env.VITE_TOSS_PAYMENTS_CLIENT_KEY || 'test_ck_5OWRapdA8dYxy1lKoRoR3o1zEqZK';
  const amount = 1;

  useEffect(() => {
    console.log("Checkout 컴포넌트 마운트됨");
    console.log("Client Key:", clientKey);
    
    // SDK 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.async = true;
    script.onload = () => {
      console.log("TossPayments 스크립트 로드 완료");
      if (window.TossPayments) {
        console.log("TossPayments 객체 생성");
        setTossPayments(window.TossPayments(clientKey));
      } else {
        console.error("TossPayments 객체를 찾을 수 없습니다");
      }
    };
    script.onerror = () => {
      console.error("TossPayments 스크립트 로드 실패");
    };
    document.head.appendChild(script);
  }, [clientKey]);

  const handlePayment = () => {
    console.log("handlePayment 함수 호출됨");
    console.log("tossPayments 상태:", tossPayments);
    
    if (!tossPayments) {
      console.error("TossPayments가 초기화되지 않았습니다");
      return;
    }
    
    console.log("결제 요청 시작");
    try {
      tossPayments.requestPayment('CARD', {
        amount: amount,
        orderId: 'bec1d544-2a34-4f44-ada0-c5213d8fd8dd', // 고유 주문번호
        orderName: '포인트 충전',
        customerName: '첫번째',
        customerEmail: 'test1@gmail.com',
        successUrl: 'http://localhost:5173/chat',
        failUrl: 'http://localhost:5173/chat',
      });
      console.log("결제 요청 완료");
    } catch (error) {
      console.error("결제 요청 중 오류 발생:", error);
    }
  };

  return (
    <section>
      <span>총 결제 금액: </span>
      <span>{amount.toLocaleString()}원</span>
      <br />
      <button onClick={handlePayment} className='bg-yellow-point text-white px-6 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors duration-200'>{amount.toLocaleString()}원 결제하기</button>
    </section>
  );
}
