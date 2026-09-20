# LeagueZero

LeagueZero is a trusted competition record for friends who play one another
offline. V1 focuses on the complete 1v1 loop: create a profile, establish a
rivalry, submit a result, let the opponent confirm it, and build a shared
head-to-head history.

## Stack

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- shadcn/ui and Base UI
- Clerk authentication
- MongoDB with Mongoose
- Vitest

## Local Setup

1. Ensure Node.js 20.9 or newer and Corepack are available.
2. Install dependencies:

   ```bash
   corepack yarn install
   ```

3. Copy `.env.example` to `.env` and replace the placeholder values with Clerk
   development keys and a MongoDB connection string.
4. Start the development server:

   ```bash
   corepack yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

Real `.env*` files are ignored. Never commit Clerk secrets or MongoDB
credentials.

## Verification

```bash
corepack yarn test
corepack yarn lint
corepack yarn build
```

The repository's product, architecture, design, and workflow decisions live in
[`context/`](./context). Read those files in the order specified by `AGENTS.md`
before implementation work.
