# CloudDojo AI Chatbot Feature

## Overview
The CloudDojo AI Chatbot is an authenticated, interactive assistant that helps users prepare for cloud certification exams (AWS, GCP, Azure, etc.) directly from the dashboard. It leverages Google Gemini 2.0 Flash for AI responses and is designed for a seamless, modern user experience.

---

## Architecture
- **Backend:**
  - API route: `/api/ai-chatbot` (see `app/api/ai-chatbot/route.ts`)
  - Uses Clerk for authentication; only logged-in users can access the chatbot.
  - Calls Gemini 2.0 Flash via a shared abstraction (`callGeminiAI` in `app/(actions)/ai-analysis/call-gemini.ts`), with a system prompt that gives the AI a helpful, on-brand backstory.
  - Never exposes the API key to the client.

- **Frontend:**
  - **Floating Button:** `components/ui/ChatbotButton.tsx`
    - Visible only to authenticated users (uses Clerk's `useUser`).
    - Fixed at the bottom right of the dashboard.
    - Uses shadcn/ui Button and framer-motion for micro-interactions.
  - **Chat Window:** `components/ui/ChatbotWindow.tsx`
    - Modal dialog (shadcn/ui Dialog) with animated message bubbles (framer-motion).
    - Handles message history, loading/typing state, and error display.
    - Connects to the backend for AI responses.
    - Resets state on close.

- **Integration:**
  - Both components are integrated at the top level of the dashboard layout (`components/layout/dashboard/dashboard-layout.tsx`), ensuring the chatbot is accessible from anywhere in the dashboard.
  - State is managed in the layout to control the chat window.

---

## Key Design Decisions
- **Authentication:** Only authenticated users (via Clerk) can access the chatbot, both on the frontend and backend.
- **Prompt Layer:** Every AI call includes a system prompt that sets the AI's role as "CloudDojo," an expert, friendly cloud certification coach.
- **UI Consistency:** Uses shadcn/ui for all UI elements to match the rest of the app.
- **Micro-interactions:** Framer-motion is used for smooth, modern animations.
- **Security:** All AI calls are made server-side; the Gemini API key is never exposed to the client.

---

## Usage
- The chatbot is available on all dashboard pages for authenticated users.
- Click the floating button to open the chat window and start a conversation.
- The chat window supports multi-turn conversations and displays both user and AI messages.

---

## Related Files
- `app/api/ai-chatbot/route.ts` — Backend API route
- `app/(actions)/ai-analysis/call-gemini.ts` — Gemini API abstraction
- `components/ui/ChatbotButton.tsx` — Floating action button
- `components/ui/ChatbotWindow.tsx` — Modal chat UI
- `components/layout/dashboard/dashboard-layout.tsx` — Integration point

---

## Extending This Feature
- To customize the AI's behavior, edit the system prompt in the API route.
- To change the UI, update the shadcn/ui components or framer-motion animations.
- For analytics, onboarding, or rate limiting, extend the backend and/or UI as needed.

---

For more details, see the Agent OS spec in `.agent-os/product/spec-ai-chatbot.md`. 