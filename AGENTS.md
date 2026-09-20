<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Application Building Context

Read the following files in order before implementing or making any architectural decision:

1. `context/project-overview.md` — product definition, goals, features, and scope
2. `context/architecture.md` — system structure, boundaries, storage model, and invariants
3. `context/ui-context.md` — theme, colors, typography, and component conventions
4. `context/code-standards.md` — implementation rules and conventions
5. `context/ai-workflow-rules.md` — development workflow, scoping rules, and delivery approach
6. `context/progress-tracker.md` — current phase, completed work, open questions, and next steps

Update `context/progress-tracker.md` after each meaningful implementation change.

`yarn` is the package manager to be used for the development process.

`/context/feature-specs` - houses the feature specifications to be implemented in order and should be prefixed with `0-`, `1-`, `2-`, etc.

For Frontend designs and generation, please use the `frontend-skill` where applicable, stay true to the styles setup in `globals.css` and `ui-context.md`. Also, the `next-best-practices` skill should be utilized where applicable.

If implementation changes the architecture, scope, or standards documented in the context files, update the relevant file before continuing.

Always remember to utilize your frontend skills when designing interfaces.
