import { useState, useEffect, useRef, useCallback } from "react";
import Avatar3D, { type AvatarHandle } from "./Avatar3D";
import { getSignForWord, type AvatarPose } from "@/lib/signLanguageData";
import { useAnimationLoader } from "@/hooks/useAnimationLoader";

interface SignAnimatorProps {
  words: string[];
  currentWordIndex: number;
  isActive: boolean;
}

export default function SignAnimator({ words, currentWordIndex, isActive }: SignAnimatorProps) {
  const [currentPose, setCurrentPose] = useState<AvatarPose | null>(null);
  const [currentLabel, setCurrentLabel] = useState<string>("");
  const [signDescription, setSignDescription] = useState<string>("");
  const [useProceduralPose, setUseProceduralPose] = useState(true);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const avatarHandleRef = useRef<AvatarHandle | null>(null);
  const { loadAnimationsForWords } = useAnimationLoader();

  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  }, []);

  const handleAvatarReady = useCallback((handle: AvatarHandle) => {
    avatarHandleRef.current = handle;
  }, []);

  useEffect(() => {
    if (!isActive || words.length === 0 || currentWordIndex < 0) {
      if (!isActive) {
        setCurrentPose(null);
        setCurrentLabel("");
        setSignDescription("");
        setUseProceduralPose(true);
      }
      return;
    }

    clearTimeouts();

    const word = words[currentWordIndex];
    if (!word) return;

    // Try to load GLB animation for this word
    loadAnimationsForWords([word]).then((items) => {
      const item = items[0];
      if (item?.clip && avatarHandleRef.current) {
        // Use GLB animation clip via mixer
        setUseProceduralPose(false);
        setCurrentLabel(word.toUpperCase());
        setSignDescription(`Playing animation: ${word}`);
        
        avatarHandleRef.current.playClip(item.clip, 0.3, 0.3).then(() => {
          // Return to idle after clip finishes
          setUseProceduralPose(true);
          setCurrentPose(null);
          setCurrentLabel("");
          setSignDescription("");
        });
      } else {
        // Fallback to procedural pose system
        setUseProceduralPose(true);
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
              }, i * 700);
              timeoutRefs.current.push(t);
            });
            const restT = setTimeout(() => {
              setCurrentPose(null);
              setCurrentLabel("");
              setSignDescription("");
            }, totalPoses * 700 + 500);
            timeoutRefs.current.push(restT);
          } else {
            sign.poses.forEach((pose, i) => {
              const t = setTimeout(() => {
                setCurrentPose(pose);
              }, i * 600);
              timeoutRefs.current.push(t);
            });
            const restT = setTimeout(() => {
              setCurrentPose(null);
              setCurrentLabel("");
              setSignDescription("");
            }, totalPoses * 600 + 500);
            timeoutRefs.current.push(restT);
          }
        }
      }
    });

    return () => clearTimeouts();
  }, [words, currentWordIndex, isActive, clearTimeouts, loadAnimationsForWords]);

  return (
    <div className="flex flex-col items-center gap-3 w-full h-full">
      <div className="w-full flex-1 min-h-[350px] glass-card glow-border overflow-hidden relative">
        <Avatar3D
          pose={currentPose}
          label={currentLabel}
          useProceduralPose={useProceduralPose}
          onAvatarReady={handleAvatarReady}
        />
        {!isActive && !currentPose && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground text-sm font-display">Speak or type to see signs</p>
              <p className="text-muted-foreground/50 text-xs">Avatar will animate ASL signs</p>
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
