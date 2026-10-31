# LeagueZero — Project Overview

## Product Definition

LeagueZero is a competition record for people who play one another offline. Its first release helps two friends find each other, establish a rivalry, record a football or football-game result, have the opponent verify it, and build a trusted head-to-head history. It is the small, useful entry point to a future grassroots competition platform for friend groups, gaming communities, campuses, academies, and local leagues.

The product promise for V1 is:

> Find a player → become rivals → play offline → verify the result → build the record.

LeagueZero is also an intentional engineering-learning project. The first vertical slice should be understandable, well tested, and polished before the domain expands.

## Product Principles

1. **Trust before statistics.** A submitted result is unofficial until the opponent confirms it.
2. **Start with two people.** A user can get value without creating a league, team, season, or tournament.
3. **Accepted matches are history.** Official results are immutable in V1; corrections will require a future explicit workflow.
4. **Competition is the identity.** The UI should feel like a modern sports product, not a generic SaaS dashboard, spreadsheet, betting product, or social-network clone.
5. **Earn complexity.** Add services, caches, background jobs, and denormalized data only when measured product needs justify them.
6. **Remain sport-flexible.** Football is the first use case, but core terms such as rivalry, match, participant, score, and game should remain reusable.

## Primary Users

- Friends who repeatedly play EA Sports FC, eFootball/PES, football, or another competitive activity and want a trusted shared record.
- Small gaming or sports communities that may later graduate into organized leagues.
- In a later phase, organizers who run local leagues and want professional fixtures, standings, results, and leaderboards without spreadsheets.

## V1 Goals

1. Let an authenticated user create a LeagueZero profile with a unique, case-insensitive username.
2. Let a user find another user by username and establish a mutually accepted rivalry.
3. Let either rival submit a dated match result that only the opponent can confirm or reject.
4. Show official match history and head-to-head statistics calculated only from accepted matches.
5. Deliver the complete flow with strong authorization, validation, responsive UI, accessible states, and meaningful automated tests.
6. Keep the initial operating cost close to zero and the architecture simple enough for one developer to reason about end to end.

## Core User Flow

Signed-out visitors first see a public landing page at `/` explaining private
rivalries, opponent-confirmed results, and head-to-head history, with sign-up and
sign-in links. Signed-in visitors continue to `/home` or profile onboarding.

1. A person signs up or signs in through Clerk.
2. They complete a LeagueZero profile and claim a unique `@username`.
3. They search for another LeagueZero user by username.
4. They send a rivalry request.
5. The recipient receives an in-app notification and accepts or rejects it.
6. An accepted request becomes an active rivalry with its own head-to-head page.
7. After playing offline, either rival logs the game, scores, and date played.
8. The opponent receives a result-verification notification.
9. The opponent confirms or rejects the result; the submitter cannot decide their own submission.
10. A confirmed result appears in official history and updates derived rivalry statistics. A rejected result remains auditable but never affects stats.

## V1 Capabilities

### Identity and discovery

- Clerk authentication.
- A separate LeagueZero user record linked by `clerkId`.
- Profile onboarding with normalized, unique username and display name.
- Exact and prefix username search with self excluded from actionable results.

### Rivalries

- Send, receive, accept, reject, and view rivalry requests.
- Prevent self-rivalries and duplicate pending or active rivalries.
- Active rivalry page with both players, official record, pending count, recent meetings, and a clear “Log match” action.

### Matches

- Record player scores, game/activity, and `playedAt` separately from the time the result is submitted.
- Keep new submissions pending until the non-submitting participant decides.
- Allow the submitter to edit their own pending result.
- Make accepted results immutable in V1.
- Separate confirmed, pending, and rejected views so disputed submissions do not clutter official history.

### Statistics

- Derive matches played, wins, losses, draws, scores for/against, win rate, recent form, current streak, largest win, and highest-scoring match from accepted matches.
- Do not let pending or rejected matches affect any official statistic.

### Notifications and states

- In-app notifications for rivalry requests and decisions, match submissions, and match decisions.
- Deep-link each notification to the relevant rivalry or match.
- Purpose-built empty, loading, error, unauthorized, and not-found states.

## Scope

### In scope for V1

- One Next.js application containing UI and server-side domain logic.
- Clerk, MongoDB through Mongoose, Tailwind CSS, shadcn/ui, and limited Zustand.
- Responsive web experience, with the match and rivalry flows optimized for phones.
- In-app notifications; polling or refresh-based freshness is acceptable.
- Football-oriented game choices: EA Sports FC, eFootball/PES, football, and “Other” with a user-supplied label.
- Draws and non-negative integer scores.

### Explicitly out of scope for V1

- Leagues, seasons, teams, rosters, fixtures, standings, tournaments, brackets, league administration, match events, assists, cards, or live scoring.
- Public profiles, public rivalry pages, social feeds, comments, chat, sharing, or follower systems.
- Real-time transports, push/email notifications, queues, workers, Redis, or a separate Node.js API service.
- Persisted/cached rivalry aggregates; accepted matches remain the source of truth.
- Editing or deleting accepted results and formal correction/dispute workflows.
- Arbitrary video uploads. Custom image uploads and Cloudinary integration are deferred until a feature requires them.
- Native mobile apps or a public third-party API.

## Later Product Direction

After the 1v1 loop is proven and polished, likely increments are richer rivalry records, public/shareable profiles, and then organized competitions: leagues, seasons, participants, teams, generated fixtures, results, standings, match events, and leaderboards. Public competition viewing and league administration must remain connected but visually distinct experiences.

## V1 Success Criteria

1. Two separate accounts can complete the full rivalry and confirmed-result flow without direct database intervention.
2. No client-controlled user ID can impersonate another user or authorize a state transition.
3. Pending and rejected matches never change official statistics.
4. A submitter cannot confirm or reject their own result, and a non-participant cannot read private rivalry details or mutate the rivalry or match.
5. The username and rivalry uniqueness rules hold under concurrent requests.
6. The primary flow is usable at 320px width and by keyboard, with status never communicated by color alone.
7. Lint, production build, domain tests, and critical-flow integration or E2E tests pass before V1 is called complete.
