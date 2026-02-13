import { useState, useCallback } from "react";
import { Send, Type } from "lucide-react";
import { motion } from "framer-motion";

interface TextInputProps {
  onSubmit: (words: string[]) => void;
}

export default function TextInput({ onSubmit }: TextInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    onSubmit(words);
    setText("");
  }, [text, onSubmit]);

  return (
    <div className="glass-card p-3">
      <div className="flex items-center gap-2 mb-2">
        <Type className="w-4 h-4 text-primary" />
        <span className="text-xs font-display font-semibold text-foreground">Type to Sign</span>
        <span className="text-xs text-muted-foreground ml-auto">For deaf & mute users</span>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a word or sentence..."
          className="flex-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Type text to convert to sign language"
        />
        <motion.button
          whileTap={{ scale: 0.92 }}
          type="submit"
          disabled={!text.trim()}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 transition-opacity"
          aria-label="Convert to sign"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </form>
    </div>
  );
}
