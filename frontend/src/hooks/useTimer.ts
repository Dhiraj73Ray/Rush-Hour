import { useState, useEffect, useCallback } from "react";

export const useTimer = (running: boolean) => {
  const [seconds, setSeconds] = useState(0);
  const reset = useCallback(() => setSeconds(0), []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  return { seconds, reset };
};