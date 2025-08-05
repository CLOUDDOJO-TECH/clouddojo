import React, { createContext, useContext, useState } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  resetChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

/**
 * ChatbotProvider persists chat state across dialog open/close.
 * Use in dashboard layout to wrap children.
 */
export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const resetChat = () => setMessages([]);
  return (
    <ChatbotContext.Provider value={{ messages, setMessages, resetChat }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error("useChatbot must be used within a ChatbotProvider");
  return ctx;
} 