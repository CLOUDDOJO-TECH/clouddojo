# Spec: AI Chatbot (Cloud Computing Coach)

## User Story
As an authenticated user preparing for cloud certification exams, I want access to an AI-powered chatbot that can answer my questions about AWS, GCP, Azure, and other cloud providers, so I can get instant, reliable guidance during my study sessions.

## Goals
- Provide a floating chatbot button at the bottom right of the screen.
- On click, open a chat window with a clean, modern UI.
- The chatbot should answer questions about cloud computing using Google Gemini 2.0 Flash.
- Only authenticated users can access the chatbot.
- Ensure smooth micro-interactions and transitions using framer motion.
- Use shadcn/ui components for consistency with the rest of the app.

## Technical Requirements
- **AI Provider**: Google Gemini 2.0 Flash (API key already in env file)
- **API Integration**: Use Next.js server actions to securely call Gemini API
- **Authentication**: Restrict chatbot access to logged-in users (integrate with existing auth system)
- **UI**: 
  - Floating button (bottom right, always visible for authenticated users)
  - Chat window with:
    - Message history
    - User input box
    - Loading/typing indicator
    - Clean, modern design (shadcn/ui)
    - Micro-interactions (framer motion)
- **Security**: Never expose API key to client; all AI calls via server actions
- **Rate Limiting**: (Optional) Prevent abuse by limiting requests per user

## Task Breakdown
### 1. Backend
- [ ] Create server action for Gemini 2.0 Flash API call (using env API key)
- [ ] Add authentication check to server action
- [ ] (Optional) Implement per-user rate limiting

### 2. Frontend
- [ ] Add floating chatbot button (visible only to authenticated users)
- [ ] Build chat window UI using shadcn/ui components
- [ ] Integrate framer motion for open/close and message animations
- [ ] Connect chat UI to server action for AI responses
- [ ] Show loading/typing indicator while waiting for response
- [ ] Display error messages for failed requests

### 3. Integration & Testing
- [ ] End-to-end test: Authenticated user can chat with AI
- [ ] Ensure unauthenticated users cannot access chatbot
- [ ] Test UI/UX on desktop and mobile
- [ ] Validate micro-interactions and accessibility

### 4. Documentation
- [ ] Update product docs and onboarding to mention AI chatbot feature

---

**Owner:** [Assign developer]
**Status:** Planned
**Related files:** `.env`, server actions, shadcn/ui components, framer motion 