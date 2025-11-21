# CloudDojo Documentation

Welcome to the CloudDojo documentation. This folder contains all technical documentation, implementation plans, and guides for the platform.

## 📁 Directory Structure

### `/architecture`
System architecture, backend patterns, and codebase structure documentation.
- `BACKEND_PATTERNS.md` - tRPC, Prisma, and backend design patterns
- `CODEBASE_STRUCTURE.md` - Overall codebase organization
- `FEATURE_ARCHITECTURE_PLAN.md` - Feature-based architecture planning
- `rules.md` - Development rules and conventions

### `/ai-analysis`
AI-powered quiz analysis system documentation.
- `AI_ANALYSIS_BACKEND_README.md` - Backend implementation details
- `AI_ANALYSIS_FRONTEND_PLAN.md` - Frontend UI/UX plans
- `AI_ANALYSIS_IMPLEMENTATION_PLAN.md` - Full implementation roadmap
- `AI_ANALYSIS_IMPLEMENTATION_SUMMARY.md` - Summary of completed work
- `AI_ANALYSIS_REDESIGN_PROPOSAL.md` - Redesign proposals
- `AI_DASHBOARD_CONVERSION_STRATEGY.md` - Dashboard conversion strategy
- `ai-chatbot.md` - AI chatbot integration

### `/email-service`
Email service documentation including templates, campaigns, and audiences.
- `EMAIL_SERVICE.md` - Email service architecture and implementation
- `TEMPLATE_MANAGER.md` - Template management system (Phase 1)
- `AUDIENCE_SEGMENTATION.md` - Audience segmentation system (Phase 2)
- `CAMPAIGN_MANAGER.md` - Campaign management system (Phase 3 - planned)

### `/gamification`
Gamification system including streaks, points, badges, and leaderboards.
- `GAMIFICATION_PLAN.md` - Complete gamification implementation plan

### `/activation`
User activation and onboarding flow documentation.
- `ACTIVATION_CLERK_SETUP.md` - Clerk authentication setup
- `UNIFIED_ACTIVATION_FLOW_DESIGN.md` - Activation flow design document

### `/testing`
Testing strategies, guides, and monitoring setup.
- `TESTING_GUIDE.md` - Comprehensive testing guide
- `TESTING_AND_MONITORING_SETUP.md` - Testing infrastructure setup
- `DEMO_EMAIL_CAPTURE_TESTING.md` - Demo email capture testing

### `/features`
Individual feature documentation.
- `admin-project-creation.md` - Admin project creation feature
- `blog-implementation.md` - Blog system implementation
- `hands-on-labs-architecture.md` - Hands-on labs architecture
- `mdx-blog-system.md` - MDX blog system details

### `/progress`
Development progress tracking and session summaries.
- `SESSION_SUMMARY_PHASE1.md` - Phase 1 session summary
- `TRPC_MIGRATION_PLAN.md` - tRPC migration plan
- `schema-onboarding-fix.md` - Schema onboarding fixes

### `/guides`
User and developer guides.
- Various user-facing and developer guides

## 🔍 Quick Links

### For Developers
- [Backend Patterns](./architecture/BACKEND_PATTERNS.md)
- [Codebase Structure](./architecture/CODEBASE_STRUCTURE.md)
- [Testing Guide](./testing/TESTING_GUIDE.md)

### For Features
- [Email Service](./email-service/EMAIL_SERVICE.md)
- [AI Analysis](./ai-analysis/AI_ANALYSIS_BACKEND_README.md)
- [Gamification](./gamification/GAMIFICATION_PLAN.md)
- [Activation Flow](./activation/UNIFIED_ACTIVATION_FLOW_DESIGN.md)

### For Architecture
- [Feature Architecture](./architecture/FEATURE_ARCHITECTURE_PLAN.md)
- [Development Rules](./architecture/rules.md)

## 📝 Documentation Standards

When adding new documentation:
1. Place it in the appropriate subdirectory based on topic
2. Use descriptive, uppercase filenames with underscores
3. Include a clear title and table of contents
4. Add the file to this README's directory structure
5. Keep documentation up-to-date as features evolve

## 🚀 Recent Additions

- **Email Service (Phase 2)**: Audience Segmentation System - Complete auto-segmentation with 13 system segments and custom segment builder
- **Template Manager (Phase 1)**: Email template management system (in progress)

---

**Last Updated:** November 20, 2025
