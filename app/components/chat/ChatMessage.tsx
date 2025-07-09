import React from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => (
  <div
    className={`mb-2 ${role === "user" ? "text-right" : "text-left"}`}
  >
    <div
      className={`inline-block px-3 py-2 rounded-xl max-w-[80%] whitespace-pre-wrap break-words ${
        role === "user"
          ? "bg-mint text-charcoal"
          : "bg-lemon text-charcoal"
      }`}
    >
      <strong>{role === "user" ? "You" : "Vivi"}:</strong>{" "}
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="my-0.5">{children}</p>,
        }}
      >
        {content.trim()}
      </ReactMarkdown>
    </div>
  </div>
);

export default ChatMessage; 