# db — data tier

PostgreSQL, the only place content is stored. **Only the backend connects to it**; the website (frontend) never does.

| What | Where |
|---|---|
| Local development server | `start.mjs` — a private PostgreSQL (no install needed), data in `db/.postgres-data` |
| Docker alternative | `docker-compose.yml` |
| Production | Any hosted Postgres (e.g. Neon on Vercel). Nothing in this folder is deployed. |
| Schema & migrations | Owned by the backend (`backend/src/migrations`, run with `npm run migrate`) |

```bash
npm run db          # from the project root: start the local server and keep it running
```

`db/.env` holds `DATABASE_URI`; keep it identical to `DATABASE_URI` in `backend/.env`.
`npm run dev` (project root) starts this automatically before the backend.
