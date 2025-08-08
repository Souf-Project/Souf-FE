import { useState, useEffect } from 'react';

const easeOutExpo = (t) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

const useCountUp = (num, duration = 2000) => {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60;
  const totalFrame = Math.round(duration / frameRate);

  // useEffect로 mount되는 순간 한 번 실행
  useEffect(() => {
    let currentNumber = 0;
    
    // setInterval로 setCount
    const counter = setInterval(() => {
      const progressRate = easeOutExpo(++currentNumber / totalFrame);
      setCount(Math.round(num * progressRate));

      // 진행 완료시 interval 해제
      if (progressRate === 1) {
        clearInterval(counter);
      }
    }, frameRate);

    // cleanup function
    return () => clearInterval(counter);
  }, [num, duration, totalFrame]); 

  // setInterval함수에서 세팅한 count return
  return count;
};

export default useCountUp; 