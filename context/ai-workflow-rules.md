# AI Workflow Rules

## Purpose

Use a spec-driven, teaching-oriented workflow. The context files define the product, architecture, design system, standards, and current state. Feature specs define the next buildable behavior. Do not infer a larger product from the long-term vision or implement future league infrastructure while building V1.

LeagueZero is partly a learning project for its owner. Explain consequential tradeoffs, expose the reasoning behind unfamiliar patterns, and keep the code small enough to study. Do not replace understanding with needless abstraction.

## Required Reading Before Work

Read in this order:

1. `context/project-overview.md`
2. `context/architecture.md`
3. `context/ui-context.md`
4. `context/code-standards.md`
5. `context/ai-workflow-rules.md`
6. `context/progress-tracker.md`
7. The active file in `context/feature-specs/`

Before changing Next.js behavior, read the relevant installed guide under `node_modules/next/dist/docs/`; this repository uses Next.js 16 and remembered framework conventions may be stale.

## Operating Approach

- Work on one end-to-end feature unit at a time in numbered spec order.
- Begin by restating the user-visible outcome and identifying the smallest vertical slice that proves it.
- Prefer a working thin path over broad scaffolding.
- Make architecture, scope, or standards changes in the relevant context file before implementation.
- Reuse current tokens and primitives; do not invent a parallel design system.
- Preserve unrelated user work and inspect the worktree before editing.
- Update `progress-tracker.md` after every meaningful implementation change.

## Scoping Rules

- Do not build V2 concepts—leagues, teams, fixtures, standings, realtime, cached aggregates, or a separate backend—unless the context is explicitly revised.
- Do not add a dependency when platform capabilities or an existing dependency solve the current requirement clearly.
- Do not create unused folders, interfaces, repositories, or generic frameworks for hypothetical future work.
- Split a unit when it combines unrelated domain transitions, cannot be tested end to end quickly, or would require multiple unresolved product decisions.
- A UI unit includes its loading, empty, error, forbidden, responsive, and accessible behavior—not only its ideal state.

## Decision Protocol

When a requirement is missing or ambiguous:

1. Check the product overview, architecture invariants, active feature spec, and prior decisions in the progress tracker.
2. If one option is a small, reversible implementation detail, choose the simplest option and record the assumption.
3. If the choice changes user-visible behavior, trust, privacy, data lifecycle, cost, or architecture, add it to `Open Questions` and ask before implementing.
4. Once resolved, update the authoritative context/spec and remove the open question rather than leaving the decision only in chat.

## Implementation Sequence Per Unit

1. Confirm acceptance criteria and relevant invariants.
2. Design or adjust the domain rule and validation schema.
3. Add persistence/index changes.
4. Implement the server-side query or mutation with authorization.
5. Build the smallest responsive UI around it.
6. Add loading, empty, error, and forbidden behavior.
7. Add tests at the lowest useful layer, then cover the integrated path.
8. Run targeted tests, `yarn lint`, and `yarn build`.
9. Manually inspect the affected route at mobile and desktop sizes.
10. Update the progress tracker with what changed, verification, and next step.

## Verification and Evidence

- Never mark work complete based only on code inspection.
- Report the exact commands run and whether they passed.
- For UI work, verify rendered behavior rather than relying only on a build.
- Exercise authorization with at least the allowed actor, the wrong participant, and an unauthenticated request where relevant.
- Exercise lifecycle conflicts, duplicate submissions, and stale decisions where relevant.
- If a required check cannot run, record why and what remains unverified.

## Protected and Sensitive Areas

- Do not hand-edit `components/ui/` unless explicitly fixing a shared primitive.
- Do not edit generated Next.js files or third-party code in `node_modules/`.
- Do not manually edit `yarn.lock`; let Yarn manage it.
- Never commit `.env*`, Clerk secrets, MongoDB credentials, Cloudinary secrets, tokens, or production data.
- Do not perform destructive database migrations or erase data without explicit approval and a recovery plan.

## Documentation Discipline

- `project-overview.md` owns product intent and scope.
- `architecture.md` owns boundaries, data model, and invariants.
- `ui-context.md` owns visual and interaction rules.
- `code-standards.md` owns implementation conventions.
- `feature-specs/` owns ordered, testable behavior.
- `progress-tracker.md` owns current status, decisions, and resume context.

Avoid duplicating volatile implementation details across files. Link to the authoritative file when possible, and update every affected context document when a decision genuinely crosses boundaries.

## Definition of Done

A unit is done only when its acceptance criteria work end to end, no architecture invariant is violated, relevant automated and manual checks pass, and the progress tracker accurately identifies the next unit.
