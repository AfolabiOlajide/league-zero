# 0 — Foundation and Profile

## Outcome

An authenticated person can enter LeagueZero, claim a unique username, and land in a responsive application shell as a fully resolved LeagueZero user.

## User Stories

- As a new user, I can sign up or sign in through Clerk.
- As an authenticated user without a LeagueZero profile, I am directed to onboarding.
- As a new user, I can choose a display name and available username.
- As a returning user, I skip onboarding and enter the app.
- As a signed-out visitor, I cannot access private application routes.

## Requirements

- Add typed environment validation for Clerk and MongoDB configuration.
- Add a cached Mongoose connection compatible with Next.js development reloads.
- Define the User model with unique indexes for `clerkId` and normalized `username`.
- Resolve the authenticated LeagueZero user on the server.
- Create the application user atomically when valid onboarding succeeds; do not create partial User records and do not trust client-provided Clerk IDs.
- Normalize and validate usernames in one shared function.
- Handle duplicate username races through the database unique constraint and a friendly field-level error.
- Build the mobile-first application shell using the existing token system.
- Add route-appropriate loading, error, signed-out, and onboarding states.
- Keep the starter page only until the first real route replaces it.

## Out of Scope

- User search, rivalries, matches, custom avatar uploads, profile editing, and Clerk webhook lifecycle synchronization.

## Acceptance Criteria

1. A signed-out visitor is directed to the authentication flow from a private route.
2. A signed-in user without a completed profile always lands on onboarding.
3. A valid username is stored normalized and displayed with `@` in the UI.
4. Username lookup is case-insensitively unique, including under concurrent submissions.
5. Validation feedback is accessible and tied to the relevant field.
6. A completed user reaches a responsive shell with Home, Rivalries, Search, Notifications, and Profile destinations.
7. Identity/normalization tests, lint, build, and a two-account manual smoke test pass.

## Decisions Required Before Coding

- Resolve the exact username character and length policy from the progress tracker.
- Select the unit/integration and E2E test tooling.
