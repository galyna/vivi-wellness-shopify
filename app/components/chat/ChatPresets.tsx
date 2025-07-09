import React from "react";

interface ChatPresetsProps {
  onPreset: (q: string) => void;
  disabled?: boolean;
  visible?: boolean;
}

const PRESETS = [
  "How to improve sleep?",
  "Suggest a light dinner",
  "Give me energy advice",
];

const ChatPresets: React.FC<ChatPresetsProps> = ({ onPreset, disabled, visible }) => {
  if (!visible) return null;
  return (
    <div className="flex gap-2 mb-2">
      {PRESETS.map((q) => (
        <button
          key={q}
          type="button"
          className="bg-mint text-charcoal px-3 py-1 rounded-full text-sm border border-mint hover:bg-lemon transition"
          onClick={() => onPreset(q)}
          disabled={disabled}
        >
          {q}
        </button>
      ))}
    </div>
  );
};

export default ChatPresets; 