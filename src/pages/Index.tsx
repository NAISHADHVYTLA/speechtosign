import { useAuth } from "@/hooks/useAuth";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import SignAnimator from "@/components/SignAnimator";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import MicButton from "@/components/MicButton";
import TextInput from "@/components/TextInput";
import { Navigate } from "react-router-dom";
import { LogOut, Hand, Info, Accessibility } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";

export default function Index() {
  const { user, loading, signOut } = useAuth();
  const {
    isListening, transcript, interimTranscript,
    words: speechWords, currentWordIndex: speechWordIndex,
    startListening, stopListening, resetTranscript, isSupported,
  } = useSpeechRecognition();
  const [showInfo, setShowInfo] = useState(false);

  // Combined word system: speech words + typed words
  const [allWords, setAllWords] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const playbackRef = useRef<NodeJS.Timeout[]>([]);

  // Sync speech words
  useEffect(() => {
    if (speechWords.length > 0) {
      setAllWords(speechWords);
      setCurrentIdx(speechWordIndex);
    }
  }, [speechWords, speechWordIndex]);

  // Handle text input: plays words one by one
  const handleTextSubmit = useCallback((words: string[]) => {
    // Stop speech if active
    if (isListening) stopListening();
    resetTranscript();

    // Clear old playback
    playbackRef.current.forEach(clearTimeout);
    playbackRef.current = [];

    setAllWords(words);
    setCurrentIdx(0);

    // Advance through words automatically
    words.forEach((_, i) => {
      if (i === 0) return;
      const t = setTimeout(() => {
        setCurrentIdx(i);
      }, i * 1200); // 1.2s per word for readability
      playbackRef.current.push(t);
    });

    return () => {
      playbackRef.current.forEach(clearTimeout);
    };
  }, [isListening, stopListening, resetTranscript]);

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
          <Accessibility className="w-5 h-5 text-primary" />
          <h1 className="font-display font-bold text-foreground text-lg">SignSpeak</h1>
          <span className="text-xs text-muted-foreground hidden sm:inline">Speech & Text → Sign Language</span>
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
          <div className="text-xs text-muted-foreground leading-relaxed max-w-2xl space-y-2">
            <p>
              <strong className="text-foreground">🎤 For hearing users:</strong> Tap the mic to speak — your speech converts to sign language in real-time.
            </p>
            <p>
              <strong className="text-foreground">⌨️ For deaf & mute users:</strong> Type words or sentences in the text box — the 3D avatar will show each sign.
            </p>
            <p>
              <strong className="text-foreground">📚 40+ words supported:</strong> hello, thank you, yes, no, please, help, love, happy, sad, want, need, think, know, understand, family, morning, tomorrow, and more. Other words are finger-spelled.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-7xl mx-auto w-full">
        {/* 3D Avatar Display */}
        <div className="flex-1 min-h-[450px] lg:min-h-0">
          <SignAnimator words={allWords} currentWordIndex={currentIdx} isActive={isListening || allWords.length > 0} />
        </div>

        {/* Controls Panel */}
        <div className="lg:w-96 flex flex-col gap-3">
          {/* Speech Controls */}
          <MicButton
            isListening={isListening}
            onToggle={isListening ? stopListening : startListening}
            onReset={() => {
              resetTranscript();
              setAllWords([]);
              setCurrentIdx(-1);
            }}
            isSupported={isSupported}
          />

          {/* Text Input for deaf/mute users */}
          <TextInput onSubmit={handleTextSubmit} />

          {/* Transcript */}
          <TranscriptDisplay
            transcript={transcript}
            interimTranscript={interimTranscript}
            words={allWords}
            currentWordIndex={currentIdx}
          />

          {/* Sign Queue */}
          {allWords.length > 0 && (
            <div className="glass-card p-3">
              <p className="text-xs text-muted-foreground mb-2 font-display font-semibold">Sign Queue</p>
              <div className="flex flex-wrap gap-1.5">
                {allWords.map((w, i) => (
                  <span
                    key={`${w}-${i}`}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all duration-300 ${
                      i === currentIdx
                        ? "bg-primary/20 text-primary scale-110"
                        : i < currentIdx
                        ? "text-muted-foreground/40 line-through"
                        : "text-muted-foreground bg-secondary/50"
                    }`}
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
