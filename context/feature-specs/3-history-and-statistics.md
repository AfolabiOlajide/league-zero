# 3 — History and Head-to-Head Statistics

## Outcome

An active rivalry has a trustworthy, emotionally engaging record derived from its accepted results.

## User Stories

- As a rival, I can scan our official record and recent meetings.
- As a rival, I can see pending work without it affecting the official record.
- As a rival, I can inspect rejected submissions separately.
- As a rival, I can understand form, streaks, and notable records.

## Requirements

- Implement a pure statistic calculator or aggregation based only on accepted matches for one rivalry.
- Derive matches, each participant's wins/losses, draws, scores for/against, win rate, recent form, current streak, largest win, and highest-scoring match.
- Define deterministic tie and ordering behavior in tests.
- Present the rivalry header as the dominant sports composition, followed by a single record band, actionable pending results, form, recent meetings, and records.
- Default history to confirmed results; provide All, Confirmed, Pending, and Rejected filters without mixing disputes into the official view.
- Put shareable filters in the URL and paginate/history-limit on the server.
- Stream independent sections where it improves perceived speed and use destination-shaped skeletons.
- Ensure empty, one-match, all-draw, tied-record, and rejected-only cases remain understandable.

## Out of Scope

- Persisted aggregate counters, global leaderboards, public sharing, cross-rival player statistics, seasons, and league tables.

## Acceptance Criteria

1. Pending and rejected matches never change any official statistic.
2. The same accepted input always produces the same participant-aligned record.
3. Both participants see the same official numbers from their respective views.
4. History filters are linkable and do not expose another rivalry's data.
5. The rivalry hierarchy remains clear at 320px and desktop widths without a mosaic of stat cards.
6. Statistic edge-case tests, query/authorization tests, lint, build, and visual responsive checks pass.

## V1 Exit Check

When this unit is complete, run the entire two-account journey from onboarding through confirmed history. V1 is not complete until all four feature specs pass their acceptance criteria together.
