# 2 — Match Submission and Confirmation

## Outcome

Either member of an active rivalry can log an offline result, and only the opponent can make that result official or reject it.

## User Stories

- As a rival, I can log the game, both scores, and the date played.
- As a submitter, I can correct my result while it is pending.
- As the opponent, I can review the full score context and confirm or reject it.
- As either rival, I can distinguish pending, confirmed, and rejected results.

## Requirements

- Define the Match model, lifecycle, validation, indexes, and idempotency token.
- Align participant and score order with the rivalry's canonical order.
- Support EA Sports FC, eFootball/PES, football, and Other; Other requires a concise custom label.
- Accept draws and valid non-negative integer scores.
- Infer `submittedBy`; never accept it as trusted form data.
- Permit submission only inside an active rivalry.
- Create a notification for the opponent when a match is submitted.
- Permit edits only by the submitter while pending; an edit keeps it pending.
- Permit accept/reject only by the other participant while pending.
- Make an accepted result immutable.
- Show a clear review surface that repeats participants, score, game, and played date before the decision.
- Disable repeat submission in the UI and enforce server-side idempotency.

## Out of Scope

- Result deletion, accepted-result edits, correction requests, match events, media proof, comments, live games, and realtime delivery.

## Acceptance Criteria

1. A participant can submit one valid result without controlling actor identity.
2. A retry with the same idempotency key does not create a duplicate match.
3. The opponent receives a deep-linked verification notification.
4. The submitter cannot decide their own result; non-participants cannot read or mutate it.
5. Pending edits work for the submitter and fail after acceptance/rejection.
6. Concurrent or repeated decisions produce one terminal result.
7. Accepted results cannot be edited through UI or server entry points.
8. Validation/authorization/concurrency tests, lint, build, and the two-account responsive flow pass.

## Decision Required Before Coding

- Resolve score and `playedAt` bounds from the progress tracker.
