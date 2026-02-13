import { useState, useEffect, useRef, useCallback } from "react";
import Hand3D from "./Hand3D";
import { getSignForWord, type HandPose } from "@/lib/signLanguageData";

interface SignAnimatorProps {
  words: string[];
  currentWordIndex: number;
  isActive: boolean;
}

export default function SignAnimator({ words, currentWordIndex, isActive }: SignAnimatorProps) {
  const [currentPose, setCurrentPose] = useState<HandPose | null>(null);
  const [currentLabel, setCurrentLabel] = useState<string>("");
  const [signDescription, setSignDescription] = useState<string>("");
  const animationRef = useRef<number | null>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  }, []);

  useEffect(() => {
    if (!isActive || words.length === 0 || currentWordIndex < 0) {
      if (!isActive) {
        setCurrentPose(null);
        setCurrentLabel("");
        setSignDescription("");
      }
      return;
    }

    clearTimeouts();

    const word = words[currentWordIndex];
    if (!word) return;

    const sign = getSignForWord(word);
    setCurrentLabel(sign.label);
    setSignDescription(sign.description);

    if (sign.poses && sign.poses.length > 0) {
      if (sign.type === "fingerspell") {
        // Finger-spell: show each letter
        sign.poses.forEach((pose, i) => {
          const t = setTimeout(() => {
            setCurrentPose(pose);
            setCurrentLabel(word[i]?.toUpperCase() || sign.label);
          }, i * 500);
          timeoutRefs.current.push(t);
        });
      } else {
        // Gesture: animate through poses
        sign.poses.forEach((pose, i) => {
          const t = setTimeout(() => {
            setCurrentPose(pose);
          }, i * 400);
          timeoutRefs.current.push(t);
        });
      }
    }

    return () => clearTimeouts();
  }, [words, currentWordIndex, isActive, clearTimeouts]);

  return (
    <div className="flex flex-col items-center gap-3 w-full h-full">
      <div className="w-full flex-1 min-h-[300px] glass-card glow-border overflow-hidden relative">
        <Hand3D pose={currentPose} label={currentLabel} />
        {!isActive && !currentPose && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground text-sm font-display">Start speaking to see signs</p>
          </div>
        )}
      </div>
      {signDescription && (
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          {signDescription}
        </p>
      )}
    </div>
  );
}
