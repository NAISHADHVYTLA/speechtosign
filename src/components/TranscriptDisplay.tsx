import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";

interface TranscriptDisplayProps {
  transcript: string;
  interimTranscript: string;
  words: string[];
  currentWordIndex: number;
}

export default function TranscriptDisplay({ transcript, interimTranscript, words, currentWordIndex }: TranscriptDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <h3 className="text-sm font-display font-semibold text-foreground">Live Transcript</h3>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 min-h-[80px] max-h-[200px]">
        {words.length === 0 && !interimTranscript && (
          <p className="text-muted-foreground text-sm italic">Waiting for speech...</p>
        )}
        <div className="flex flex-wrap gap-1">
          <AnimatePresence mode="popLayout">
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  color: i === currentWordIndex ? "hsl(174, 72%, 50%)" : "hsl(210, 20%, 85%)",
                }}
                transition={{ duration: 0.2 }}
                className={`inline-block text-sm font-medium px-1 py-0.5 rounded ${
                  i === currentWordIndex ? "bg-primary/10" : ""
                }`}
              >
                {word}
              </motion.span>
            ))}
          </AnimatePresence>
          {interimTranscript && (
            <span className="text-sm text-muted-foreground/60 italic">{interimTranscript}</span>
          )}
        </div>
      </div>
    </div>
  );
}
