import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useState, useCallback } from "react";
import SignAnimator from "@/components/SignAnimator";
import { COMMON_WORDS } from "@/lib/signLanguageData";
import { Search } from "lucide-react";

const categories: Record<string, string[]> = {
  "Greetings": ["hello", "namaste", "hi", "goodbye", "bye"],
  "Courtesy": ["thank", "thanks", "please", "sorry"],
  "Responses": ["yes", "no", "ok", "good", "bad"],
  "Pronouns": ["i", "me", "you", "my", "your", "we", "they"],
  "Questions": ["what", "where", "how", "who", "when", "why"],
  "Emotions": ["happy", "sad", "angry", "love", "scared", "tired", "hungry", "beautiful"],
  "Numbers": ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
  "Colors": ["red", "blue", "green", "yellow", "white", "black", "orange", "pink", "purple", "brown"],
  "Family": ["mother", "father", "friend", "family"],
  "Actions": ["help", "stop", "eat", "drink", "sleep", "walk", "work", "learn", "know", "want", "need", "come", "go", "see", "hear"],
};

export default function LearnSign() {
  const { user, loading } = useAuth();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectWord = useCallback((word: string) => {
    setSelectedWord(null);
    setTimeout(() => setSelectedWord(word), 50);
  }, []);

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

  const filteredCategories = Object.entries(categories).map(([cat, words]) => ({
    cat,
    words: words.filter((w) => w.includes(searchQuery.toLowerCase())),
  })).filter(({ words }) => words.length > 0);

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-57px)]">
      {/* Left Panel - Word List */}
      <div className="lg:w-80 xl:w-96 border-r border-border/40 p-5 overflow-y-auto">
        <h2 className="font-display font-bold text-lg text-foreground mb-4">Learn ISL Signs</h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search signs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-4">
          {filteredCategories.map(({ cat, words }) => (
            <div key={cat}>
              <h3 className="font-display font-semibold text-xs text-primary uppercase tracking-wider mb-2">{cat}</h3>
              <div className="flex flex-wrap gap-1.5">
                {words.map((word) => {
                  const sign = COMMON_WORDS[word];
                  return (
                    <button
                      key={word}
                      onClick={() => handleSelectWord(word)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                        selectedWord === word
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {sign?.label || word}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center - 3D Avatar */}
      <div className="flex-1 min-h-[500px] lg:min-h-0 bg-[hsl(220,14%,8%)]">
        <SignAnimator
          words={selectedWord ? [selectedWord] : []}
          currentWordIndex={selectedWord ? 0 : -1}
          isActive={!!selectedWord}
        />
      </div>

      {/* Right Panel - Sign Info */}
      <div className="lg:w-72 xl:w-80 border-l border-border/40 p-5">
        <h3 className="font-display font-bold text-lg text-foreground mb-4 text-center">Sign Details</h3>
        {selectedWord && COMMON_WORDS[selectedWord] ? (
          <div className="space-y-4">
            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Word</p>
              <p className="font-display font-bold text-xl text-primary">
                {COMMON_WORDS[selectedWord].label}
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Description</p>
              <p className="text-sm text-foreground">
                {COMMON_WORDS[selectedWord].description}
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Type</p>
              <p className="text-sm text-foreground capitalize">
                {COMMON_WORDS[selectedWord].type}
              </p>
            </div>
            <button
              onClick={() => handleSelectWord(selectedWord)}
              className="w-full py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              Replay Sign
            </button>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center mt-8">
            Select a word from the list to see its ISL sign demonstration.
          </p>
        )}
      </div>
    </div>
  );
}
