import { Mic, MicOff, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface MicButtonProps {
  isListening: boolean;
  onToggle: () => void;
  onReset: () => void;
  isSupported: boolean;
}

export default function MicButton({ isListening, onToggle, onReset, isSupported }: MicButtonProps) {
  if (!isSupported) {
    return (
      <div className="glass-card p-4 text-center">
        <p className="text-destructive text-sm font-medium">
          Speech recognition is not supported in this browser. Please use Chrome or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onToggle}
        className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
          isListening
            ? "bg-primary text-primary-foreground pulse-ring shadow-lg shadow-primary/30"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onReset}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        aria-label="Reset transcript"
      >
        <RotateCcw className="w-4 h-4" />
      </motion.button>
      <span className="text-sm text-muted-foreground">
        {isListening ? "Listening..." : "Tap to speak"}
      </span>
    </div>
  );
}
