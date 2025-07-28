import { useState, useEffect, useRef } from "react";

export default function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const [prev, setPrev] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    let start = 0;
    let frame;
    const fastPart = target * 0.8;
    const fastDuration = duration * 0.7;
    const slowDuration = duration * 0.3;
    const fastIncrement = fastPart / (fastDuration / 16);
    const slowIncrement = (target - fastPart) / (slowDuration / 32);

    function update() {
      if (start < fastPart) {
        start += fastIncrement;
        setPrev(prevRef.current);
        setCount(Math.floor(start));
        prevRef.current = Math.floor(start);
        frame = requestAnimationFrame(update);
      } else if (start < target) {
        start += slowIncrement;
        setPrev(prevRef.current);
        setCount(Math.floor(start));
        prevRef.current = Math.floor(start);
        frame = requestAnimationFrame(update);
      } else {
        setPrev(prevRef.current);
        setCount(target);
      }
    }
    update();
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return [count, prev];
} 