/**
 * ChatbotWindow.tsx
 *
 * Modal chat UI for the CloudDojo AI Coach, integrated into the dashboard.
 *
 * - Uses shadcn/ui Dialog for modal presentation and consistent styling.
 * - Uses framer-motion for animated message bubbles and micro-interactions.
 * - Only accessible to authenticated users (via Clerk).
 * - Handles message history, loading/typing state, and error display.
 * - Connects to the /api/ai-chatbot server action for AI responses.
 * - Designed to be opened from a floating ChatbotButton, but can be used anywhere.
 *
 * Usage:
 *   <ChatbotWindow open={open} onOpenChange={setOpen} />
 *
 * See also: ChatbotButton.tsx, /api/ai-chatbot, and the Agent OS spec for this feature.
 */
"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { useChatbot } from "@/components/ui/ChatbotProvider";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotWindowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal-style chat window for the AI chatbot.
 * Uses shadcn/ui Dialog, framer-motion, and Clerk for user info.
 * Handles message history, loading state, and errors.
 */
export function ChatbotWindow({ open, onOpenChange }: ChatbotWindowProps) {
  const { user } = useUser();
  const { messages, setMessages, resetChat } = useChatbot();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message or streaming update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage, open]);

  // Handle sending a message
  async function sendMessage() {
    if (!input.trim()) return;
    setError(null);
    setLoading(true);
    setStreamingMessage("");

    const newMessages = [
      ...messages,
      { role: "user" as const, content: input },
    ];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/ai-chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: newMessages.map((m) => ({
            role: m.role,
            parts: [{ text: m.content }],
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Unknown error");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      while (true) {
        const { done, value } = await reader?.read()!;
        if (done) break;
        const chunk = decoder.decode(value);
        aiResponse += chunk;
        setStreamingMessage((prevMsg) => prevMsg + chunk);
      }

      // Only add the final AI response if it's not empty
      if (aiResponse.trim()) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant" as const, content: aiResponse },
        ]);
      }
      setStreamingMessage(""); // Clear streaming message after finalizing
    } catch (err: any) {
      toast.error("An error occured, please try again later", {
        description: "If error persists, please contack support",
        action: {
          label: "Support",
          onClick: () => window.open("mailto:support@clouddojo.tech"),
        },
      });
      setError(err.message || "Failed to get response");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  // Handle Enter key
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  }

  // Reset on close
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setMessages([]);
        setInput("");
        setError(null);
        setLoading(false);
      }, 300);
    }
  }, [open]);

  // Typewriter effect for streaming message
  const [typewriter, setTypewriter] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Animate typewriter effect as streamingMessage updates
  useEffect(() => {
    if (!loading || !streamingMessage) {
      setTypewriter("");
      return;
    }
    let i = 0;
    setTypewriter("");
    const interval = setInterval(() => {
      setTypewriter(streamingMessage.slice(0, i + 1));
      i++;
      if (i >= streamingMessage.length) clearInterval(interval);
    }, 12); // Fast, but smooth
    return () => clearInterval(interval);
  }, [streamingMessage, loading]);

  // Blinking cursor effect
  useEffect(() => {
    if (!loading) {
      setShowCursor(false);
      return;
    }
    const cursorInterval = setInterval(() => {
      setShowCursor((c) => !c);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, [loading]);

  // Render messages, using typewriter for the last assistant message if streaming
  const displayMessages = [...messages];
  if (loading && (typewriter || streamingMessage)) {
    displayMessages.push({
      role: "assistant" as const,
      content: typewriter + (showCursor ? "|" : ""),
    });
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open} modal>
      <DialogContent>
        <div className="flex flex-col h-[500px]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">CloudDojo AI Coach</span>
              <span className="text-xs text-muted-foreground">(Beta)</span>
            </div>
            <div className="flex items-center gap-2">
              {/* New Chat button clears the chat history */}
              <Button
                variant="outline"
                size="sm"
                onClick={resetChat}
                aria-label="Start new chat"
              >
                New Chat
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                aria-label="Close chatbot"
              >
                ×
              </Button>
            </div>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-2 bg-muted">
            <AnimatePresence initial={false}>
              {displayMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale:
                      loading && i === displayMessages.length - 1
                        ? [1, 1.03, 1]
                        : 1,
                  }}
                  transition={{ duration: 0.18 }}
                  className={`mb-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-xl px-4 py-2 max-w-[80%] text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-emerald-500 to-blue-600 text-white"
                        : "bg-white border text-gray-900"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <MarkdownRenderer content={msg.content} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-2 flex justify-start"
                >
                  <div className="rounded-xl px-4 py-2 max-w-[80%] text-sm bg-white border text-gray-900 flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>CloudDojo is thinking…</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>
          {/* Error */}
          {error && (
            <div className="px-6 py-2 text-xs text-red-500 bg-red-50 border-t border-red-200">
              {error}
            </div>
          )}
          {/* Input */}
          <form
            className="flex items-center gap-2 px-4 py-3 border-t bg-white"
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading) sendMessage();
            }}
            autoComplete="off"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about AWS, GCP, Azure…"
              disabled={loading}
              className="flex-1"
              autoFocus
              aria-label="Type your message"
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
