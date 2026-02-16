import { useAuth } from "@/hooks/useAuth";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import SignAnimator from "@/components/SignAnimator";
import { Navigate } from "react-router-dom";
import { Mic, MicOff, Trash2, Send } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";

export default function Convert() {
  const { user, loading } = useAuth();
  const {
    isListening, transcript, interimTranscript,
    words: speechWords, currentWordIndex: speechWordIndex,
    startListening, stopListening, resetTranscript, isSupported,
  } = useSpeechRecognition();

  const [allWords, setAllWords] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [textInput, setTextInput] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [animSpeed, setAnimSpeed] = useState(1.0);
  const playbackRef = useRef<NodeJS.Timeout[]>([]);

  // Sync speech words
  useEffect(() => {
    if (speechWords.length > 0) {
      setAllWords(speechWords);
      setCurrentIdx(speechWordIndex);
      setProcessedText(speechWords.join(" "));
    }
  }, [speechWords, speechWordIndex]);

  const handleTextSubmit = useCallback(() => {
    const trimmed = textInput.trim();
    if (!trimmed) return;
    if (isListening) stopListening();
    resetTranscript();
    playbackRef.current.forEach(clearTimeout);
    playbackRef.current = [];

    const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    setAllWords(words);
    setProcessedText(trimmed);
    setCurrentIdx(0);

    const interval = Math.max(800, 1500 / animSpeed);
    words.forEach((_, i) => {
      if (i === 0) return;
      const t = setTimeout(() => setCurrentIdx(i), i * interval);
      playbackRef.current.push(t);
    });
    setTextInput("");
  }, [textInput, isListening, stopListening, resetTranscript, animSpeed]);

  const handleSpeechSubmit = useCallback(() => {
    if (!transcript.trim()) return;
    const words = transcript.toLowerCase().split(/\s+/).filter(Boolean);
    playbackRef.current.forEach(clearTimeout);
    playbackRef.current = [];
    setAllWords(words);
    setProcessedText(transcript);
    setCurrentIdx(0);

    const interval = Math.max(800, 1500 / animSpeed);
    words.forEach((_, i) => {
      if (i === 0) return;
      const t = setTimeout(() => setCurrentIdx(i), i * interval);
      playbackRef.current.push(t);
    });
  }, [transcript, animSpeed]);

  const handleClear = useCallback(() => {
    resetTranscript();
    setAllWords([]);
    setCurrentIdx(-1);
    setProcessedText("");
    setTextInput("");
    playbackRef.current.forEach(clearTimeout);
    playbackRef.current = [];
  }, [resetTranscript]);

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
    <div className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-57px)]">
      {/* Left Panel - Controls */}
      <div className="lg:w-80 xl:w-96 border-r border-border/40 p-5 flex flex-col gap-5 overflow-y-auto">
        {/* Processed Text */}
        <div>
          <h3 className="font-display font-bold text-sm text-foreground mb-2">Processed Text</h3>
          <div className="w-full min-h-[80px] p-3 bg-secondary rounded-lg border border-border text-sm text-foreground">
            {processedText || <span className="text-muted-foreground italic">No text processed yet...</span>}
          </div>
        </div>

        {/* Speech Recognition */}
        <div>
          <h3 className="font-display font-bold text-sm text-foreground mb-1">
            Speech Recognition: <span className={isListening ? "text-green-400" : "text-muted-foreground"}>{isListening ? "on" : "off"}</span>
          </h3>
          <div className="flex gap-2 mt-2">
            <button
              onClick={startListening}
              disabled={!isSupported || isListening}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg disabled:opacity-40 transition-colors"
            >
              Mic On <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={stopListening}
              disabled={!isListening}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg disabled:opacity-40 transition-colors"
            >
              Mic Off <MicOff className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
          {/* Speech textarea */}
          <textarea
            value={transcript + (interimTranscript ? " " + interimTranscript : "")}
            readOnly
            placeholder="Speech input ..."
            className="w-full mt-3 min-h-[80px] p-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground resize-none"
          />
          <button
            onClick={handleSpeechSubmit}
            disabled={!transcript.trim()}
            className="w-full mt-2 py-2.5 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm rounded-lg disabled:opacity-40 transition-colors"
          >
            Start Animations
          </button>
        </div>

        {/* Text Input */}
        <div>
          <h3 className="font-display font-bold text-sm text-foreground mb-2">Text Input</h3>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Text input ..."
            className="w-full min-h-[80px] p-3 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleTextSubmit();
              }
            }}
          />
          <button
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            className="w-full mt-2 py-2.5 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm rounded-lg disabled:opacity-40 transition-colors"
          >
            Start Animations
          </button>
        </div>

        {/* Word Queue */}
        {allWords.length > 0 && (
          <div>
            <h3 className="font-display font-bold text-sm text-foreground mb-2">Word Queue</h3>
            <div className="flex flex-wrap gap-1.5">
              {allWords.map((w, i) => (
                <span
                  key={`${w}-${i}`}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all duration-300 ${
                    i === currentIdx
                      ? "bg-primary/20 text-primary scale-110 font-bold"
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

      {/* Center - 3D Avatar */}
      <div className="flex-1 min-h-[500px] lg:min-h-0 bg-[hsl(220,14%,8%)]">
        <SignAnimator words={allWords} currentWordIndex={currentIdx} isActive={isListening || allWords.length > 0} />
      </div>

      {/* Right Panel - Settings */}
      <div className="lg:w-72 xl:w-80 border-l border-border/40 p-5 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h3 className="font-display font-bold text-lg text-foreground mb-4 text-center">Settings</h3>
        </div>

        {/* Animation Speed */}
        <div>
          <label className="text-sm font-medium text-foreground">
            Animation Speed: {animSpeed.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={animSpeed}
            onChange={(e) => setAnimSpeed(parseFloat(e.target.value))}
            className="w-full mt-2 accent-primary"
          />
        </div>

        {/* Pause Time */}
        <div>
          <label className="text-sm font-medium text-foreground">
            Pause time: {Math.round(1500 / animSpeed)} ms
          </label>
          <input
            type="range"
            min="300"
            max="3000"
            step="100"
            value={Math.round(1500 / animSpeed)}
            readOnly
            className="w-full mt-2 accent-primary"
          />
        </div>

        {/* Supported Words Info */}
        <div className="mt-auto glass-card p-4">
          <h4 className="font-display font-semibold text-sm text-foreground mb-2">Supported ISL Words</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            80+ ISL words including: namaste, dhanyavaad, haan, nahin, kripya, madad, pyaar, khush, dukhi, numbers 1-10, colors, emotions, family terms, and more. Unknown words are finger-spelled.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm z-40">
        Indian Sign Language (ISL) Converter — 80+ words supported
      </div>
    </div>
  );
}
