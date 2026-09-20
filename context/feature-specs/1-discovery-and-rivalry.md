# 1 — Discovery and Rivalry

## Outcome

A LeagueZero user can find another user by username, send a rivalry request, and the recipient can accept or reject it.

## User Stories

- As a user, I can search for another LeagueZero profile by username.
- As a user, I can send an available profile a rivalry request.
- As a recipient, I can see and decide a pending request.
- As either participant, I can open an active rivalry page after acceptance.

## Requirements

- Define the Rivalry model, canonical pair identity, indexes, and lifecycle.
- Search normalized usernames with bounded results and no sensitive fields.
- Exclude the current user from actionable results and show existing pair status.
- Infer `requestedBy` from the authenticated LeagueZero user.
- Prevent self-requests and duplicate pair documents at the database boundary.
- Create a recipient notification with the request transition.
- Only the recipient may accept or reject; only the requester may cancel.
- Use conditional state updates so competing decisions cannot both succeed.
- Build pending, active, rejected, empty, loading, error, and stale-state UI.
- Build the initial rivalry page with competitor identity, zero-state record, and a disabled/empty match history area ready for the next spec.

## Out of Scope

- Match submission, public rivalry pages, suggested users, contact import, blocking, and realtime notification delivery.

## Acceptance Criteria

1. Exact and prefix username search returns safe, useful results.
2. A user cannot request themselves or create a second rivalry for the same pair.
3. The recipient receives a deep-linked in-app notification.
4. Only the intended recipient can accept or reject the pending request.
5. Acceptance creates an active rivalry visible to both participants.
6. Rejection does not create an active relationship and remains auditable.
7. Unauthorized and stale concurrent decisions fail without corrupting state.
8. Domain/integration tests, lint, build, and a two-account responsive flow pass.

## Decision Required Before Coding

- Resolve rejected/cancelled request cooldown behavior from the progress tracker.
