"use client";
import { useChatStore } from "@/app/store/chatStore";
import ShowMoreButton from "./ShowMoreButton";

interface AskViviButtonProps {
  className?: string;
  children?: React.ReactNode;
  showArrow?: boolean;
}

export default function AskViviButton({ 
  className = "",
  children = "Ask Vivi",
  showArrow = true
}: AskViviButtonProps) {
  const { openChat } = useChatStore();

  return (
    <ShowMoreButton
      onClick={openChat}
      className={`bg-coral hover:bg-neon ${className}`}
      showArrow={showArrow}
    >
      {children}
    </ShowMoreButton>
  );
} 