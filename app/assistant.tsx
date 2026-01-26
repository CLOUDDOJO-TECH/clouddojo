"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { toast } from "sonner";
import { useEffect } from "react";

export const Assistant = () => {
  const runtime = useChatRuntime({
    api: "/api/chat",
    onError: (error) => {
      console.error("🔴 Chat error:", error);
      console.error("🔴 Error details:", JSON.stringify(error, null, 2));
      toast.error("Something went wrong. Please try again later.", {
        description: "The AI service is currently unavailable.",
      });
    },
  });

  // Debug runtime state changes
  useEffect(() => {
    console.log("🟢 Runtime state changed:", {
      status: runtime.status,
      messages: runtime.messages,
      isRunning: runtime.isRunning,
    });
  }, [runtime.status, runtime.messages, runtime.isRunning]);

  console.log("🟡 Initial Runtime state:", runtime);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="grid h-dvh grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
        <ThreadList />
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
};
