import { useAuth } from "@/hooks/useAuth";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import SignAnimator from "@/components/SignAnimator";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import MicButton from "@/components/MicButton";
import { Navigate } from "react-router-dom";
import { LogOut, Hand, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Index() {
  const { user, loading, signOut } = useAuth();
  const { isListening, transcript, interimTranscript, words, currentWordIndex, startListening, stopListening, resetTranscript, isSupported } = useSpeechRecognition();
  const [showInfo, setShowInfo] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Hand className="w-5 h-5 text-primary" />
          <h1 className="font-display font-bold text-foreground text-lg">SignSpeak</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Info"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            onClick={signOut}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Info Panel */}
      {showInfo && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 py-3 bg-primary/5 border-b border-border/50"
        >
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            <strong className="text-foreground">How it works:</strong> Tap the mic to start speaking. Your speech is converted to text in real-time, and each word is displayed as a 3D ASL sign. Common words like "hello", "thank you", "yes", "no", "please", "help", "love", "happy", "sad" and 20+ more show full gestures. All other words are finger-spelled.
          </p>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-6xl mx-auto w-full">
        {/* 3D Sign Display */}
        <div className="flex-1 min-h-[400px] lg:min-h-0">
          <SignAnimator words={words} currentWordIndex={currentWordIndex} isActive={isListening || words.length > 0} />
        </div>

        {/* Controls & Transcript */}
        <div className="lg:w-80 flex flex-col gap-4">
          <MicButton
            isListening={isListening}
            onToggle={isListening ? stopListening : startListening}
            onReset={resetTranscript}
            isSupported={isSupported}
          />
          <TranscriptDisplay
            transcript={transcript}
            interimTranscript={interimTranscript}
            words={words}
            currentWordIndex={currentWordIndex}
          />
          {/* Word queue */}
          {words.length > 0 && (
            <div className="glass-card p-3">
              <p className="text-xs text-muted-foreground mb-2 font-display font-semibold">Sign Queue</p>
              <div className="flex flex-wrap gap-1">
                {words.slice(Math.max(0, currentWordIndex - 3), currentWordIndex + 5).map((w, i) => {
                  const actualIndex = Math.max(0, currentWordIndex - 3) + i;
                  return (
                    <span
                      key={`${w}-${actualIndex}`}
                      className={`text-xs px-2 py-1 rounded-md font-medium transition-all ${
                        actualIndex === currentWordIndex
                          ? "bg-primary/20 text-primary"
                          : actualIndex < currentWordIndex
                          ? "text-muted-foreground/50"
                          : "text-muted-foreground"
                      }`}
                    >
                      {w}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
