# Code Standards

## General

- Keep modules cohesive and name them in domain language.
- Fix root causes; do not layer workarounds or duplicate sources of truth.
- Prefer the smallest implementation that satisfies the current feature spec.
- Keep domain rules independent of React, HTTP, Clerk, and Mongoose where practical so they can be tested directly.
- Comments explain non-obvious constraints or tradeoffs, not line-by-line code.
- Use Yarn for every package and project command.

## TypeScript

- Strict mode is required. Do not add `any`; validate `unknown` at boundaries.
- Prefer discriminated unions for lifecycle states and exhaustive `switch` handling for state-dependent behavior.
- Keep database documents, domain objects, and client view models distinct.
- Serialize `Date`, `ObjectId`, and Mongoose documents into plain values before crossing a Server Component boundary.
- Use `type` for unions/data shapes and interfaces where extension is intended; consistency within a feature matters more than dogma.
- Do not use non-null assertions to bypass unproven state.

## Validation

- Define schemas for every mutation and parse before domain logic runs. Use the project's chosen validation library consistently once selected.
- Normalize usernames in one shared function: trim, remove an optional leading `@`, lowercase, and validate allowed characters/length.
- Validate scores as bounded, non-negative integers and `playedAt` as a valid, allowed date.
- Client validation improves feedback; server validation remains authoritative.
- Return field-level errors in a stable, serializable shape and avoid leaking stack traces or database details.

## Next.js 16 and React 19

- Default to Server Components. Add `"use client"` at the narrowest boundary that needs state, effects, event handlers, or browser APIs.
- Client Components must not be async. Fetch initial server data in Server Components and pass serializable props.
- Await `params`, `searchParams`, `cookies()`, and `headers()`.
- Use Server Actions for first-party UI mutations and direct server-only query functions for Server Component reads.
- Do not fetch an internal Route Handler from a Server Component.
- Use Route Handlers for webhooks, external consumers, or required HTTP semantics. Authenticate and authorize each handler independently.
- Use `proxy.ts`, not `middleware.ts`, if Next.js request proxy behavior becomes necessary. Proxy checks never replace data-layer authorization.
- Keep navigation functions such as `redirect()` and `notFound()` outside broad `try/catch` blocks, or rethrow Next.js control-flow errors.
- Add route-level `loading.tsx`, `error.tsx`, `not-found.tsx`, and authorization states where the feature requires them.
- Use the default Node.js runtime for Mongoose-backed code.

## Server Actions and Use Cases

Each mutation follows this order:

1. Resolve the authenticated Clerk identity.
2. Resolve the LeagueZero user.
3. Parse and normalize untrusted input.
4. Load the relevant domain records.
5. Authorize the actor and validate the current lifecycle state.
6. Perform a conditional/atomic write and related notification work.
7. Revalidate the smallest affected path or tag.
8. Return a typed result or redirect outside error-catching code.

Do not accept acting-user fields from a form. Use idempotency protection for create operations that users may retry.

## MongoDB and Mongoose

- Create one cached connection helper that is safe during development reloads.
- Define indexes alongside schemas and document every unique or compound index.
- Use `lean()` for read-only queries that do not need document methods.
- Select only fields needed by the caller; never send an entire user or document to a Client Component by default.
- Use canonical participant ordering wherever pair identity matters.
- Use conditional filters for state transitions so stale or concurrent writes fail safely.
- Use transactions when a domain state change and its notification must succeed or fail together; keep transactions short.
- Never persist derived rivalry statistics in V1.

## Authentication and Authorization

- Centralize Clerk-session-to-User resolution in `lib/auth/`.
- Authorization belongs close to the data operation, not only in layouts, buttons, proxy rules, or client state.
- Verify both membership and role-in-transition: participant, requester, recipient, submitter, or opponent as appropriate.
- Return `401` for missing authentication, `403` for an authenticated actor without permission, and `404` when resource concealment is intentional.
- Never log tokens, secret keys, full webhook payloads with personal data, or sensitive Clerk objects.

## State Management

- Server data remains server data. Do not mirror users, rivalries, matches, or notifications into a long-lived Zustand store.
- Zustand is limited to cross-component UI state that cannot remain local or in the URL, such as an open match sheet or temporary draft filter.
- Put shareable filters and pagination in URL search parameters.
- Prefer React transition/form primitives for mutation pending state.

## Styling and Components

- Use semantic tokens from `app/globals.css`; no hardcoded hex/rgb/oklch values in components.
- Follow the radius, density, status, and responsive rules in `ui-context.md`.
- Compose existing primitives before creating a new base component.
- Treat `components/ui/` as generated/shared primitive code. Avoid hand-editing it unless a project-wide primitive fix is explicitly required.
- Use `cn()` for conditional classes and a variant utility for components with stable visual variants.
- Use `next/image` instead of raw `<img>` and provide an accurate `sizes` value for responsive images.

## Accessibility

- Use semantic HTML before ARIA and preserve the behavior of Base UI primitives.
- Every interactive element must be reachable and usable by keyboard.
- Use visible focus styles, programmatic labels, descriptive button text, and live announcements for meaningful async results.
- Do not use color as the only status signal.

## Testing

- Unit test normalization, authorization decisions, state-transition guards, and statistic calculations as pure logic.
- Integration test Server Actions/use cases against realistic persistence behavior, including duplicate and concurrent transitions.
- Cover the critical two-account rivalry/result flow with E2E tests when the vertical slice is assembled.
- Test failure states and forbidden actions, not only successful paths.
- A bug fix should include a regression test when practical.

## File Organization

```text
app/                       Routes, layouts, and route states
components/ui/             Shared shadcn/Base UI primitives
components/                Cross-feature composed UI
features/<feature>/         Feature UI, queries, actions, schemas, and tests
lib/auth/                   Identity and authorization helpers
lib/db/                     MongoDB connection/infrastructure
lib/domain/                 Cross-feature pure domain logic
models/                     Mongoose schemas and indexes
context/feature-specs/      Ordered implementation specifications
```

Colocate a feature's tests and private components until reuse is demonstrated. Do not add catch-all `utils`, `services`, or `types` modules with unrelated code.

## Quality Gate

Before a feature unit is complete:

1. Acceptance criteria in its feature spec are met.
2. Relevant tests pass.
3. `yarn lint` passes.
4. `yarn build` passes.
5. Responsive and keyboard behavior is manually checked.
6. `context/progress-tracker.md` is updated.
