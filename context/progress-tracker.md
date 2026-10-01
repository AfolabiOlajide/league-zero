# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- **Phase 4 — History and statistics implementation in verification.**

## Current Goal

- Run the complete two-account V1 journey against configured Clerk and MongoDB:
  onboarding, rivalry, result verification, and official history.

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
- Implemented match persistence, canonical participant-score alignment,
  idempotent pending submission, submitter-only pending edits, opponent-only
  decisions, and transaction-coupled result notifications.
- Replaced the rivalry match zero state with result logging, pending review,
  confirmed/rejected history sections, and private result-review pages.
- Implemented a pure, deterministic head-to-head statistics calculator from
  accepted matches only, including records, form, streaks, and score totals.
- Added server-paginated, URL-linkable history filters and rebuilt the rivalry
  record as an official sports composition with separate pending/rejected views.
- Added one-click bulk accept ("Accept all") for pending match results awaiting opponent
  confirmation, with transactional atomic updates, submitter notifications, and
  responsive rivalry detail controls.
- Added profile update functionality: implemented `updateProfile` Server Action
  with username uniqueness enforcement (preventing users from updating to another
  user's existing username while allowing them to keep their own handle when updating
  display name), MongoDB duplicate-key race safety (`E11000`), client-safe action
  state, an accessible Base UI `EditProfileDialog` on the `/profile` page, and
  instant multi-route cache revalidation.

## In Progress

- Automated verification and rendered responsive review of the completed V1
  feature set. The end-to-end two-account credentialed smoke test still
  requires user-controlled accounts.

## Next Up

1. Run the two-account authenticated smoke test for onboarding, discovery,
   request, acceptance, rejection, cancellation, and unauthorized access.
2. Run the complete two-account V1 smoke test, including idempotent retry,
   forbidden decisions, all history filters, and mobile/desktop rendering.
3. Resolve any findings from that credentialed end-to-end test before calling
   V1 complete.

## Open Questions


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
- **2026-09-22 — Match inputs use 0–30 scores and dates from 2000-01-01
  through today.** These broad V1 bounds reject malformed or accidental data
  while preserving sport flexibility until product evidence supports tighter
  rules.
- **2026-09-20 — Accepted match ordering is played date, then creation time,
  then ID.** This deterministic oldest-to-newest order drives form, streaks,
  record ties, and participant-aligned statistics identically for both rivals.

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
- Match-confirmation verification on 2026-09-20: 19 Vitest tests passed across
  6 files; ESLint and the production build passed, including the match review
  and logging routes. The signed-out route boundary is covered by the existing
  app layout; rendered two-account submission, edit, and decision flows remain
  outstanding because they require user-controlled Clerk/MongoDB access.
- History/statistics verification on 2026-09-20: 22 Vitest tests passed across
  7 files; ESLint and the production build passed. Pure calculation tests cover
  accepted-only input, participant alignment, deterministic ties, empty state,
  and draw cases. The rendered authenticated rivalry view and full two-account
  journey remain outstanding because they require user-controlled accounts and
  the configured MongoDB deployment.
- Authentication redirect fix on 2026-09-20: Clerk sign-in and sign-up now
  force the first post-auth destination to `/onboarding`. Onboarding remains
  the single profile gate and forwards an existing LeagueZero profile to
  `/home`, avoiding the prior bounce through the root auth router.
- Onboarding Server Function fix on 2026-09-21: moved the initial client-side
  action state out of the file-level `"use server"` module. The action module
  now exports only its async Server Function, as required by Next.js 16.
- Dashboard design refresh on 2026-09-21: rebuilt the authenticated shell,
  home dashboard, and rivalry detail around the supplied sports-record visual
  direction. The shared shell now uses the supplied logo and deep evergreen
  navigation; home and rivalry views render existing private rivalry and match
  data in score-led summaries, records, and activity lists.
- Dashboard refresh verification on 2026-09-21: 22 Vitest tests passed across
  7 files; ESLint and the Next.js production build passed. The local preview
  confirmed the signed-out private-route redirect; authenticated visual QA is
  still a user-controlled Clerk-session check.
- Server Function export audit on 2026-09-21: moved rivalry and match action
  state constants out of their file-level `"use server"` modules, matching the
  onboarding fix. All three Server Function modules now export runtime async
  functions only, preventing the same error in rivalry and match mutations.
  Verification: 22 Vitest tests, ESLint, and production build passed.
- Rivalry pending match quick actions on 2026-09-21: added inline accept and reject
  icon buttons beside the score for pending matches decidable by the opponent on the
  rivalry detail page (`MatchQuickDecisionControls`), eliminating the need to click
  into the match detail page to confirm or reject scores. Left side and score remain
  clickable links to match review. Submitter pending rows and non-pending rows preserve
  their read-only score view. Verification: 22 Vitest tests, ESLint, and Next.js production
  build passed.
- Profile design refresh on 2026-09-22: rebuilt the private profile as a player-led
  record page with an editorial identity header, resilient avatar initials, membership
  context, and a divider-led identity ledger. This removes the previous generic
  boxed profile treatment while preserving the existing LeagueZero palette, responsive
  behavior, and server-rendered identity data.
- Player search refresh on 2026-09-22: redesigned player discovery as a focused
  registry-style search surface with borderless result rows and clear private-record
  context. Search now runs through an authenticated Server Function from a client
  transition and shallowly syncs `?q=` in browser history, so results update without
  a full-document navigation while shared search URLs continue to work on refresh.
- Rivalries index refresh on 2026-09-22: rebuilt the rivalry list as a player-record
  overview with a deep evergreen context header, active-record count, and spacious
  state-aware rivalry rows. Removed the repeated list and section borders in favor of
  subtle tonal grouping, preserving all request, decision, and record navigation behavior.
- Match logging refresh on 2026-09-22: redesigned match entry around a score-led
  sports composition with the supplied wheel picker, selectable game tags, and the
  project calendar popover. Reduced the maximum valid score from 99 to 30 across
  validation and tests. Successful new submissions now rotate the idempotency key
  and reset score controls so another match can be logged without manually refreshing.
- Wheel picker viewport fix on 2026-09-22: expanded each score wheel from a
  four-item ring to the component's full 20-item viewport with compact rows, making
  adjacent score values visible around the selected score instead of rendering only
  the selection rail.
- Recent encounters refresh on 2026-09-22: rebuilt rivalry match rows as a compact
  encounter ledger with outcome markers, both player identities, scorelines, and
  quiet game/date metadata. History and pending-result containers now use tonal
  surfaces rather than repeated structural borders.
- Pending encounter refinement on 2026-09-22: replaced the wide pending-verification
  badge with a soft amber row treatment, preserving more space for both player names
  and the scoreline while retaining the pending state for assistive technology.
- Rejected encounter refinement on 2026-09-22: applied the same compact status
  treatment to rejected matches with a soft red row surface, removing the visible
  status badge while retaining its accessible label.
- Encounter ledger spacing on 2026-09-22: added a restrained six-pixel gutter
  between logged results in both pending and history lists, so individual matches
  remain visually distinct without introducing dividing borders.
- Mobile encounter readability on 2026-09-22: compact rows now show player
  avatars and a non-wrapping scoreline below the small-screen breakpoint; names
  return at larger widths and remain available to assistive technology on mobile.
- Mobile encounter alignment on 2026-09-22: centered the avatar-score-avatar
  group in a symmetrical three-column lane and positioned pending decision controls
  independently, so every mobile row has a consistent scoreline alignment.
- One-click pending match bulk acceptance on 2026-10-01: added `acceptAllPendingMatches`
  Server Function and `AcceptAllMatchesButton` component for pending results where
  the opponent needs to confirm. Only matches submitted by the opponent are accepted,
  preserving Invariant #4. The button displays the exact count of decidable matches
  and updates official history and rivalry statistics in one click. Verification: 23
  Vitest tests, ESLint, and Next.js production build passed.
- Profile display name and username update on 2026-10-01: added `updateProfile`
  Server Action with username uniqueness enforcement (`UserModel.exists` lookup
  excluding the acting user's `_id` and atomic `UserModel.updateOne` with `E11000`
  race handling), client-safe `initialProfileActionState`, accessible Base UI
  `EditProfileDialog` with inline error validation and pending states on `/profile`,
  and `features/users/profile-update.test.ts`. Verification: 28 Vitest tests,
  ESLint, and Next.js production build passed.

