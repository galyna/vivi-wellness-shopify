import React from "react";

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1 h-6 pl-1">
    <span className="sr-only">Vivi печатает...</span>
    <span className="w-2 h-2 bg-coral rounded-full inline-block animate-vivi-bounce" style={{ animationDelay: '0ms' }}></span>
    <span className="w-2 h-2 bg-coral rounded-full inline-block animate-vivi-bounce" style={{ animationDelay: '150ms' }}></span>
    <span className="w-2 h-2 bg-coral rounded-full inline-block animate-vivi-bounce" style={{ animationDelay: '300ms' }}></span>
  </div>
);

export default TypingIndicator; 