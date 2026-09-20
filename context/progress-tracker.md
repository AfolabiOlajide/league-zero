# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- **Phase 2 — Discovery and rivalry implementation in verification.**

## Current Goal

- Verify the discovery and rivalry flow with configured Clerk and MongoDB
  accounts, then begin match submission and opponent confirmation.

## Completed

- Initialized a Next.js 16 application with TypeScript, Tailwind CSS, shadcn/ui,
  Clerk, Mongoose, Zustand, and the initial theme tokens.
- Defined the V1 product as a trusted 1v1 rivalry and opponent-confirmed match
  loop.
- Chosen a Next.js modular monolith for V1; a separate API is deferred.
- Defined the initial User, Rivalry, Match, and Notification domain boundaries.
- Defined server-authoritative lifecycle, authorization, and statistics rules.
- Defined the sports-focused visual direction from the supplied palette and
  existing `globals.css` tokens.
- Split V1 into ordered implementation specifications.
- Added typed environment validation and a cached Mongoose connection.
- Added the LeagueZero User model with unique `clerkId` and normalized username
  indexes.
- Integrated Clerk 7 with branded sign-in/sign-up routes and resource-level
  authorization in layouts and Server Actions.
- Implemented atomic profile onboarding, trusted Clerk identity resolution,
  duplicate-username race handling, and accessible field errors.
- Replaced the starter UI with a responsive application shell, mobile bottom
  navigation, desktop sidebar, home/profile foundations, theme controls, and
  purpose-built loading, error, empty, and not-found states.
- Added Vitest coverage for username normalization and profile validation.
- Added `.env.example` without committing real credentials.
- Verified the branded sign-in page at desktop and 320px widths and confirmed a
  signed-out private-route request returns to the local `/sign-in` flow.
- Implemented username discovery with bounded exact/prefix search results,
  safe player fields, self exclusion, and existing-rivalry status.
- Implemented canonical rivalry pair persistence, conditional lifecycle
  transitions, database uniqueness guards, and transaction-coupled rivalry
  notifications.
- Added private rivalry and notification surfaces with pending, active,
  rejected, cancelled, empty, loading, error, and unavailable states. The
  rivalry detail provides the zero-state record and intentionally disabled
  match-history area required before match logging is built.

## In Progress

- Automated verification and rendered responsive review of the discovery and
  rivalry feature. A two-account, credentialed Clerk/MongoDB smoke test still
  requires user-controlled accounts.

## Next Up

1. Run the two-account authenticated smoke test for onboarding, discovery,
   request, acceptance, rejection, cancellation, and unauthorized access.
2. Implement match submission and opponent confirmation.
3. Implement official history and derived head-to-head statistics.

## Open Questions

- What maximum score and earliest/future `playedAt` bounds should V1 accept?
  Resolve before the match schema is coded.

## Architecture Decisions

- **2026-09-20 — Start with 1v1 only.** It creates a complete useful loop while
  avoiding speculative league infrastructure.
- **2026-09-20 — Use a Next.js modular monolith.** Direct server reads and Server
  Actions reduce moving parts; boundaries preserve a future extraction path.
- **2026-09-20 — Keep LeagueZero users separate from Clerk users.** Clerk owns
  authentication, while MongoDB owns username and domain relationships.
- **2026-09-20 — Model a rivalry request as rivalry lifecycle state.** A separate
  request collection is unnecessary for V1.
- **2026-09-20 — Accepted matches are the statistics source of truth.** Derived
  stats avoid synchronization bugs until measured scale requires projections.
- **2026-09-20 — Server identity is authoritative.** Acting user IDs never come
  from trusted client input, and every mutation performs its own authorization.
- **2026-09-20 — Limit Zustand to ephemeral UI state.** MongoDB/server-rendered
  data is not duplicated into a global client store.
- **2026-09-20 — Defer Cloudinary.** Image bytes will live there when custom
  uploads become a scoped feature; V1 does not need upload infrastructure.
- **2026-09-20 — Use a 3–20 character username policy.** Usernames allow
  lowercase letters, numbers, and underscores after normalization; this is
  simple to explain, index, search, and share.
- **2026-09-20 — Expose both light and dark themes.** The system preference is
  the default and users can switch explicitly from authentication and app
  surfaces.
- **2026-09-20 — Use Vitest for domain tests.** Playwright is deferred until a
  two-account integrated flow exists, avoiding premature E2E scaffolding.
- **2026-09-20 — Authorize at resource boundaries.** Clerk middleware attaches
  session context, while layouts, pages, Server Actions, and future handlers
  enforce access without deprecated path-matcher authorization.
- **2026-09-20 — Rejected and cancelled rivalries can be requested again
  immediately.** The existing pair document is returned to `pending`, keeping
  the audit trail while avoiding a cooldown policy before product evidence
  justifies one.

## Session Notes

- Product source: the referenced ChatGPT discussion titled “Leaguezero”. Its
  most recent decision—to keep the V1 backend inside Next.js—supersedes the
  earlier suggestion of separate web and API applications.
- Visual source: the supplied palette sheet and current `app/globals.css` agree
  on Outfit, mint primary, deep green support, sky-blue data accent, neutral
  surfaces, an 8px base radius, and light/dark themes.
- Next.js 16 installed documentation was consulted for App Router structure,
  Server/Client boundaries, async request APIs, Route Handlers, caching, and
  authentication boundaries.
- Foundation verification on 2026-09-20: 11 tests passed across 2 files, ESLint
  passed, and the Next.js production build completed with TypeScript and all 10
  routes generated successfully.
- Rendered QA covered the Clerk sign-in experience at desktop and 320px mobile
  widths plus signed-out private-route redirection. Authenticated onboarding and
  duplicate testing remain manual because the agent did not create or access
  user accounts.
- Discovery/rivalry verification on 2026-09-20: 15 Vitest tests passed across
  4 files; ESLint and the production build passed. Rendered QA reconfirmed the
  signed-out `/search` boundary redirects to sign-in and the responsive sign-in
  surface at 320px. The authenticated two-account discovery and lifecycle
  smoke test remains outstanding because it requires user-controlled accounts
  and the configured MongoDB deployment.
