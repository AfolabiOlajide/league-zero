# UI Context

## Visual Thesis

LeagueZero is a clean sports record book: bright mint energy, deep evergreen authority, sky-blue informational accents, large score typography, and calm neutral surfaces. It should feel competitive and premium without borrowing the visual language of betting products or filling every screen with cards.

## Experience Principles

- Make the competitors, score, status, and next action the fastest things to scan.
- Use familiar sports conventions for scorelines, form, records, and history.
- Prefer composition, typography, dividers, and whitespace to nested cards.
- Keep routine application copy direct: “Pending results”, “Confirm score”, and “Recent meetings”, not marketing slogans.
- Public sports viewing and future administration are separate visual modes. V1 implements only the personal rivalry experience.
- Design mobile-first. Logging and confirming a match must feel excellent with one hand on a phone, not like a compressed desktop dashboard.

## Existing Token System

`app/globals.css` is the source of truth. Components use its semantic Tailwind tokens (`bg-background`, `text-foreground`, `bg-primary`, `border-border`, and so on), never copied color literals. Any new semantic token must be added to `globals.css` in both themes before use.

The reference palette maps to the current system:

| Role | Token | Current direction |
| --- | --- | --- |
| Canvas | `--background` | Near-white / near-black |
| Primary text | `--foreground` | Ink / soft white |
| Surface | `--card`, `--popover` | Quiet neutral layers |
| Primary action | `--primary` | Mint green (`#5FE1A8` reference) |
| Action contrast | `--primary-foreground` | Deep evergreen |
| Quiet UI | `--muted`, `--accent` | Neutral gray surfaces |
| Borders and fields | `--border`, `--input`, `--ring` | Low-contrast structure with mint focus |
| Destructive state | `--destructive` | Reserved red |
| Data accents | `--chart-1` … `--chart-5` | Mint, blue, violet, amber, green |

The original visual reference also uses deep evergreen (`#1D3B2F`) and sky blue (`#38BDF8`). Use existing semantic/chart tokens that carry those roles; do not introduce ad-hoc utility colors.

Both light and dark themes are supported. The default follows the system setting.

## Typography

| Role | Family/token | Guidance |
| --- | --- | --- |
| UI, display, and scores | Outfit / `--font-sans` | Existing product typeface; use weight and scale for hierarchy |
| Data with alignment needs | `--font-mono` sparingly | Scores/timestamps only when alignment materially improves scanning |

- The LeagueZero wordmark or screen identity is the loudest text on branded surfaces; on product screens, the score or opponent pairing may dominate.
- Use tabular numerals for score columns and statistics.
- Keep supporting copy short; labels should scan without rereading.

## Shape, Depth, and Density

- The base radius is `0.5rem`; use the existing `sm` through `xl` radius scale.
- Buttons and compact controls use `rounded-md` or `rounded-lg`; sheets and major panels may use `rounded-xl`. Avoid novelty pill shapes except for status chips.
- Use subtle borders and the existing shadow tokens. Hierarchy should survive with shadows removed.
- Default to cardless section layouts. Use a card only when the whole surface is a selectable/interactive object, such as one rivalry or one pending result.
- Keep information dense but breathable; do not create a dashboard mosaic of isolated statistic cards.

## Core Layout Patterns

### Application shell

- Mobile: compact top bar plus bottom navigation for Home, Rivalries, Search, Notifications, and Profile. Primary task actions may use a sticky bottom area.
- Desktop: restrained left navigation and a centered working column with an optional contextual rail. Avoid wide empty canvases and oversized headers.
- Navigation labels remain visible where space allows; icons alone require an accessible name and tooltip on desktop.

### Rivalry page

- Treat the player-versus-player header as a sports poster: identities on either side, a clear `VS`, and the official record beneath.
- Use one summary band for matches, wins, draws, and scores; do not make every number a separate floating card.
- Follow with pending action, current form, recent meetings, and records in that priority order.
- Keep “Log match” prominent but secondary to an awaiting confirmation that requires the current user's action.

### Match and request flows

- Use a full page on small screens and a dialog or sheet on larger screens when context should remain visible.
- Re-state both participants and the score before a destructive or official decision. Confirmation should never depend on remembering the previous page.
- Place reject and confirm actions apart, label them explicitly, and show the consequence of making a result official.

### Lists and history

- Group matches by recency and use a strong scoreline row rather than a table on narrow screens.
- Filters use `All`, `Confirmed`, `Pending`, and `Rejected`; confirmed is the default official view on a rivalry page.
- Rejected content is visually quiet and separate, but remains accessible for auditability.

## Status Language

| State | Presentation |
| --- | --- |
| Pending | Neutral/amber treatment plus clock icon and text |
| Active / confirmed | Primary or success treatment plus explicit label |
| Rejected / error | Destructive treatment plus explicit label |
| Cancelled | Muted treatment plus explicit label |

Never communicate state with color alone. Pair color with text and, where useful, an icon. Do not use betting-style odds, flashing live indicators, or red/green alone to imply win/loss.

## Component Conventions

- Use shadcn/ui/Base UI primitives from `components/ui/` and compose domain components outside that directory.
- Initial composed components may include `AppShell`, `UserSearchResult`, `RivalryRow`, `RivalryHeader`, `ScoreDisplay`, `MatchRow`, `FormIndicator`, `NotificationItem`, `StatusBadge`, and `EmptyState`.
- Do not build the full future component catalog before its feature exists.
- Lucide icons are stroke-based: typically 16px inline and 20px for primary controls. Icons supplement labels; they do not replace unfamiliar actions.
- Use `next/image` for product imagery. Avatars require meaningful fallbacks.

## Interaction Thesis

Motion should make state changes legible, not decorate routine screens.

1. Rivalry and score content enter with a short, ordered fade/translate sequence.
2. Accepting a rivalry or result uses a restrained shared-state transition from pending to official, followed by refreshed statistics.
3. Sheets, dialogs, filters, and list insertions use fast, consistent layout transitions with no bouncing or looping effects.

Respect `prefers-reduced-motion`. Prefer existing CSS/Tailwind transitions; add a motion dependency only when a specific interaction cannot be expressed well without it.

## Accessibility and Responsive Rules

- Target WCAG AA contrast, visible focus rings, keyboard-complete flows, and minimum 44px touch targets for primary mobile actions.
- Associate every field with a label and place validation next to the field.
- Announce async submission outcomes and status changes to assistive technology.
- Do not rely on hover for essential information or actions.
- Validate at 320px, 768px, and a common desktop width. Recompose content at breakpoints; do not merely shrink it.
- Use skeletons shaped like the destination content. Avoid generic full-screen spinners when part of a page can stream independently.

## Content and State Guidelines

- Empty states explain the situation and offer the next logical action, for example: “No rivalries yet” with “Find a rival”.
- Errors say what failed, what remains safe, and what the user can do next.
- Dates should show an understandable local display while persisting canonical server values.
- Internal IDs, database state, and implementation language never dominate the UI.
