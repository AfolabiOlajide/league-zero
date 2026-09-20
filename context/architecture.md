# Architecture Context

## Architectural Stance

V1 is a modular monolith in the Next.js App Router. UI, application use cases, and server-side data access live in one deployable application, while domain boundaries remain explicit enough to extract later if a real need appears.

This supersedes the earlier idea of starting with a separate Node.js backend. The extraction path remains open, but V1 should not pay that operational and coordination cost.

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| Framework | Next.js 16 App Router + React 19 + TypeScript | UI, server rendering, application entry points |
| Styling | Tailwind CSS 4 + shadcn/ui/Base UI | Tokens, accessible primitives, responsive presentation |
| Authentication | Clerk | Sign-up, sign-in, sessions, and authenticated Clerk identity |
| Database | MongoDB + Mongoose | LeagueZero users, rivalries, matches, and notifications |
| Client state | Zustand | Ephemeral cross-component UI state only |
| Dates | date-fns | Display and form-level date handling |
| Icons | Lucide React | Consistent stroke iconography |
| Media (deferred) | Cloudinary | Future user/team/competition image assets; not required for V1 |
| Package manager | Yarn 1.x | Dependency and script execution |
| Runtime | Node.js | Default runtime for database-backed server code |

## Application Boundaries

- `app/` — route tree, layouts, pages, loading/error/not-found states, Server Actions colocated with their feature when appropriate, and external HTTP entry points under `app/api/`.
- `components/ui/` — generated or library-style shadcn primitives; do not place domain behavior here.
- `components/` — shared composed UI with no database access.
- `features/<feature>/` — feature-specific UI, schemas, actions, queries, mappers, and tests. Initial features are `users`, `rivalries`, `matches`, and `notifications`.
- `lib/auth/` — Clerk-to-LeagueZero identity resolution and reusable authorization guards.
- `lib/db/` — cached Mongoose connection and infrastructure-only helpers.
- `lib/domain/` — truly cross-feature domain primitives and pure calculations, including rivalry statistics.
- `models/` — Mongoose schemas/models and index definitions; no request or UI behavior.

Folders may be introduced as their first feature needs them; do not create an empty architecture in advance.

## Next.js Data Boundaries

- Default to Server Components. Read MongoDB directly through server-only query functions rather than calling the application's own Route Handlers.
- Use Client Components only for browser interaction, local transitions, and components that require hooks or browser APIs. Pass only serializable values across the server/client boundary.
- Use Server Actions for mutations initiated by the LeagueZero web UI. Every action authenticates, authorizes, validates, executes a use case, and then revalidates or redirects.
- Use Route Handlers for Clerk/Cloudinary webhooks, future external clients, or endpoints that genuinely need HTTP semantics. Treat them as public endpoints.
- In Next.js 16, `params`, `searchParams`, `cookies()`, and `headers()` are async. Use `proxy.ts` rather than the removed `middleware.ts` convention if a request boundary is needed, but never treat proxy checks as the only authorization.
- Use the default Node.js runtime for all MongoDB-backed routes and actions.
- Make cache behavior explicit. User-specific and rapidly changing rivalry data must not be shared across users; begin uncached and add scoped revalidation only after correctness is established.

## Domain Model

### User

LeagueZero owns an application user distinct from the Clerk user.

```ts
type User = {
  id: string
  clerkId: string
  username: string // normalized lowercase, stored without @
  displayName: string
  avatarUrl?: string
  onboardingCompletedAt: string
  createdAt: string
  updatedAt: string
}
```

`clerkId` and `username` each have a unique database index. The record is created atomically when onboarding succeeds; an authenticated Clerk user without this record is still awaiting LeagueZero onboarding. Authentication says who has a session; the User record says who that person is in LeagueZero.

### Rivalry

The rivalry represents both the request and the established relationship; V1 does not need a separate request collection.

```ts
type RivalryStatus = "pending" | "active" | "rejected" | "cancelled"

type Rivalry = {
  id: string
  participantIds: [string, string] // stored in canonical order
  pairKey: string                  // unique canonical pair identity
  requestedBy: string
  status: RivalryStatus
  acceptedAt?: string
  rejectedAt?: string
  cancelledAt?: string
  createdAt: string
  updatedAt: string
}
```

One rivalry document exists per unordered user pair. A rejected or cancelled relationship may later return to `pending`; an active rivalry is not duplicated. State transitions are conditional writes so concurrent decisions cannot both succeed.

### Match

```ts
type MatchStatus = "pending" | "accepted" | "rejected"

type Match = {
  id: string
  rivalryId: string
  participantIds: [string, string]
  scores: [number, number] // aligned with participantIds
  game: "ea-sports-fc" | "efootball" | "football" | "other"
  customGameLabel?: string
  submittedBy: string
  status: MatchStatus
  playedAt: string
  acceptedAt?: string
  rejectedAt?: string
  createdAt: string
  updatedAt: string
}
```

`playedAt` is when the real-world match happened; `createdAt` is when LeagueZero received it. Store timestamps as BSON dates and serialize them to ISO strings at client boundaries.

### Notification

```ts
type NotificationType =
  | "rivalry_requested"
  | "rivalry_accepted"
  | "rivalry_rejected"
  | "match_submitted"
  | "match_accepted"
  | "match_rejected"

type Notification = {
  id: string
  recipientId: string
  actorId: string
  type: NotificationType
  entityType: "rivalry" | "match"
  entityId: string
  readAt?: string
  createdAt: string
}
```

Notifications are projections of domain events for navigation and awareness; they never grant access to the linked entity.

## State Transitions

```text
Rivalry: absent/rejected/cancelled → pending → active
                                         ├──→ rejected
                                         └──→ cancelled (requester only)

Match: active rivalry → pending → accepted (opponent only)
                                  └──→ rejected (opponent only)
```

- Only the rivalry recipient may accept or reject a pending request.
- Only a participant may see a private rivalry or its matches in V1.
- Either participant in an active rivalry may submit a match.
- Only the submitter may edit a pending match.
- Only the other participant may accept or reject it.
- Accepted matches are immutable and cannot return to pending in V1.

## Storage and Consistency

- **MongoDB** stores domain records, relationships, lifecycle state, and notification read state.
- **Clerk** stores authentication credentials and session identity. It is not the source of truth for usernames or LeagueZero relationships.
- **Cloudinary (future)** stores image bytes. MongoDB stores only `publicId`, secure URL, dimensions, and ownership metadata when uploads are introduced.
- **Browser/Zustand** stores only ephemeral UI concerns such as an open sheet, draft filters, and optimistic presentation state. It is not a server-data cache or source of truth.

Related state changes use conditional database updates and transactions where a domain transition and its notification must commit together. Unique indexes enforce `clerkId`, normalized username, and canonical rivalry-pair uniqueness. Duplicate-submit protection starts with disabled UI plus a server idempotency token for match creation; do not rely on the button state alone.

## Statistics

Accepted matches are the sole source of truth. Query matches by `rivalryId` and `status: "accepted"`, then derive totals and records with a pure function or MongoDB aggregation. Do not persist wins, losses, draws, score totals, streaks, or form on the rivalry document in V1.

If measured query cost later justifies cached aggregates, introduce them as a rebuildable projection with explicit consistency rules.

## Authentication and Authorization

1. Resolve the Clerk session on the server.
2. Resolve the LeagueZero User by trusted `clerkId`.
3. Read target resources from trusted route/action parameters.
4. Authorize against stored participants, submitter, recipient, and current lifecycle state.
5. Validate all untrusted input before performing the conditional write.

Never accept `senderId`, `submittedBy`, or the acting user ID from the client as authoritative. UI visibility is not authorization. Server Actions and Route Handlers repeat the relevant checks even if a parent layout is protected.

## Invariants

1. Usernames are trimmed, lowercased, stored without `@`, and unique case-insensitively.
2. A user cannot rival themselves; an unordered user pair has one rivalry.
3. Only accepted matches contribute to official history and statistics.
4. The submitter cannot decide their own match, and a non-participant cannot read or mutate it.
5. Scores are non-negative integers and the score order always aligns with the canonical participant order.
6. Every match belongs to an active rivalry and repeats the same participants.
7. Accepted matches are immutable in V1.
8. Domain timestamps are server-generated; the client supplies only `playedAt`.
9. Notifications never bypass authorization on their target entity.
10. Secrets, Mongoose documents, and non-serializable values never cross into Client Components.

## Evolution Triggers

- Extract a separate API only for a concrete external-client, team-ownership, or deployment-scaling need.
- Add real-time delivery only when refresh/polling measurably harms the result confirmation loop.
- Add cached statistics only after profiling accepted-match aggregation.
- Add queues only for work that is demonstrably too slow or unreliable inside a request lifecycle.
