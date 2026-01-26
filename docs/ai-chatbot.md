# CloudDojo AI Chatbot Feature

## Overview
The CloudDojo AI Chatbot is an authenticated, interactive assistant that helps users prepare for cloud certification exams (AWS, GCP, Azure, etc.) directly from the dashboard. It uses OpenAI's GPT-4o-mini via the Vercel AI SDK and assistant-ui for the frontend.

---

## Architecture

### Backend
- **API route:** `/api/chat` (see `app/api/chat/route.ts`)
- Uses Clerk for authentication; only logged-in users can access the chatbot
- Uses Vercel AI SDK v5 with `@ai-sdk/openai` for streaming responses
- System prompt configures the AI as "CloudDojo," an expert cloud certification coach

### Frontend
- **Runtime:** `@assistant-ui/react-ai-sdk` with `useChatRuntime` hook
- **Components:** Custom Thread, Composer, and Message components in `components/assistant-ui/`
- **Markdown rendering:** `@assistant-ui/react-markdown` for formatted AI responses

---

## Key Files
- `app/api/chat/route.ts` — Backend API route
- `app/assistant.tsx` — Assistant runtime provider and layout
- `components/assistant-ui/thread.tsx` — Chat thread UI
- `components/assistant-ui/markdown-text.tsx` — Markdown rendering

---

## Streaming Fix (January 2025)

### Problem
The AI chatbot was returning a 200 response from the backend, but the frontend was not displaying the streamed response. The user would send a message, but no assistant response would appear.

### Root Cause: Version Mismatch
The issue was a **version incompatibility** between the AI SDK packages:

| Package | Installed Version | Required Version |
|---------|------------------|------------------|
| `ai` | 4.3.19 (v4) | 5.x (v5) |
| `@ai-sdk/openai` | 1.3.24 (v1) | 2.x (v2) |
| `@assistant-ui/react-ai-sdk` | 1.2.0 | - |

The `@assistant-ui/react-ai-sdk` v1.2.0 internally depends on AI SDK v5, which uses a different message format and streaming protocol than v4:

**AI SDK v4:**
- Message format: `{ role: "user", content: "Hello" }`
- Streaming method: `toDataStreamResponse()`

**AI SDK v5:**
- Message format: `{ role: "user", parts: [{ type: "text", text: "Hello" }] }`
- Streaming method: `toUIMessageStreamResponse()`

The frontend was sending v5 format messages and expecting v5 streaming responses, but the backend was using v4 APIs.

### Debugging Process
1. Added console logs to trace the request/response flow
2. Confirmed backend was receiving messages and returning 200 OK
3. Inspected the message format being sent (found `parts` array instead of `content` string)
4. Checked the nested `node_modules/@ai-sdk/react/node_modules/ai` package - found it was v5.0.86
5. Identified the version mismatch as the root cause

### Solution
Upgraded both packages to v5-compatible versions:

```json
// package.json changes
{
  "ai": "^5.0.0",           // was "^4.3.19"
  "@ai-sdk/openai": "^2.0.0" // was "^1.3.24"
}
```

Updated the API route to use v5 APIs:

```typescript
// app/api/chat/route.ts
import { streamText, convertToModelMessages, type UIMessage } from "ai";

// Convert UI messages to model messages (v5 format)
const modelMessages = convertToModelMessages(messages as UIMessage[]);

const result = streamText({
  model: openai("gpt-4o-mini"),
  system: SYSTEM_PROMPT,
  messages: modelMessages,
});

// Use v5 streaming response
return result.toUIMessageStreamResponse();
```

### Key Learnings
1. **Check nested dependencies:** The `@assistant-ui/react-ai-sdk` package bundles its own version of the AI SDK internally
2. **Version compatibility matters:** AI SDK v4 and v5 have incompatible message formats and streaming protocols
3. **Provider packages must match:** When upgrading `ai` to v5, you must also upgrade `@ai-sdk/openai` to v2

---

## Configuration

### Environment Variables
```env
OPENAI_API_KEY=your-openai-api-key
```

### Package Dependencies
```json
{
  "ai": "^5.0.0",
  "@ai-sdk/openai": "^2.0.0",
  "@assistant-ui/react": "^0.11.58",
  "@assistant-ui/react-ai-sdk": "^1.2.0",
  "@assistant-ui/react-markdown": "^0.10.9"
}
```

---

## Extending This Feature
- To customize the AI's behavior, edit the `SYSTEM_PROMPT` in `app/api/chat/route.ts`
- To change the UI, update components in `components/assistant-ui/`
- To add tools, use the AI SDK's tool calling features with `@assistant-ui/react-ai-sdk`'s frontend tools support
