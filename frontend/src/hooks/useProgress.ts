import { useState, useEffect, useCallback } from "react";
import { type LevelProgress } from "../types/game";

const PROGRESS_KEY = "rushhour.progress";



export type ProgressMap = Record<number, LevelProgress>;

const read = (): ProgressMap => {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressMap>(() => read());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === PROGRESS_KEY) setProgress(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const recordSolve = useCallback(
    (level: number, moves: number, seconds: number) => {
      const next = { ...read() };
      const existing = next[level];
      next[level] = {
        level,
        solved: true,
        bestMoves: existing ? Math.min(existing.bestMoves, moves) : moves,
        bestSeconds: existing
          ? Math.min(existing.bestSeconds, seconds)
          : seconds,
        solvedAt: Date.now(),
      };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      setProgress(next);
    },
    []
  );

  const clearAll = useCallback(() => {
    localStorage.removeItem(PROGRESS_KEY);
    setProgress({});
  }, []);

  const history = Object.values(progress).sort(
    (a, b) => b.solvedAt - a.solvedAt
  );

  return { progress, history, recordSolve, clearAll };
};