import { useState, useEffect, useRef, useCallback } from "react";
import Avatar3D from "./Avatar3D";
import { getSignForWord, type AvatarPose } from "@/lib/signLanguageData";

interface SignAnimatorProps {
  words: string[];
  currentWordIndex: number;
  isActive: boolean;
}

export default function SignAnimator({ words, currentWordIndex, isActive }: SignAnimatorProps) {
  const [currentPose, setCurrentPose] = useState<AvatarPose | null>(null);
  const [currentLabel, setCurrentLabel] = useState<string>("");
  const [signDescription, setSignDescription] = useState<string>("");
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
      const totalPoses = sign.poses.length;
      if (sign.type === "fingerspell") {
        sign.poses.forEach((pose, i) => {
          const t = setTimeout(() => {
            setCurrentPose(pose);
            setCurrentLabel(word[i]?.toUpperCase() || sign.label);
          }, i * 600);
          timeoutRefs.current.push(t);
        });
        // Return to rest after last letter
        const restT = setTimeout(() => {
          setCurrentPose(null);
        }, totalPoses * 600 + 400);
        timeoutRefs.current.push(restT);
      } else {
        sign.poses.forEach((pose, i) => {
          const t = setTimeout(() => {
            setCurrentPose(pose);
          }, i * 500);
          timeoutRefs.current.push(t);
        });
        // Return to rest after last pose
        const restT = setTimeout(() => {
          setCurrentPose(null);
        }, totalPoses * 500 + 400);
        timeoutRefs.current.push(restT);
      }
    }

    return () => clearTimeouts();
  }, [words, currentWordIndex, isActive, clearTimeouts]);

  return (
    <div className="flex flex-col items-center gap-3 w-full h-full">
      <div className="w-full flex-1 min-h-[350px] glass-card glow-border overflow-hidden relative">
        <Avatar3D pose={currentPose} label={currentLabel} />
        {!isActive && !currentPose && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground text-sm font-display">Speak or type to see signs</p>
              <p className="text-muted-foreground/50 text-xs">Drag to rotate the avatar</p>
            </div>
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
