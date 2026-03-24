import { useEffect, useRef, useState } from "react";

const easeOutCubic = (value: number) => {
  return 1 - (1 - value) ** 3;
};

export const useAnimatedNumber = (target: number, durationMs = 420) => {
  const [animatedValue, setAnimatedValue] = useState(target);
  const animatedValueRef = useRef(target);

  useEffect(() => {
    const startValue = animatedValueRef.current;
    const difference = target - startValue;

    if (Math.abs(difference) < 0.01) {
      animatedValueRef.current = target;
      setAnimatedValue(target);
      return undefined;
    }

    const startTime = window.performance.now();
    let frameId = 0;

    const animate = (currentTime: number) => {
      const elapsedRatio = Math.min((currentTime - startTime) / durationMs, 1);
      const nextValue = startValue + difference * easeOutCubic(elapsedRatio);

      animatedValueRef.current = nextValue;
      setAnimatedValue(nextValue);

      if (elapsedRatio < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [durationMs, target]);

  return animatedValue;
};
