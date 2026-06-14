# drivemind-chatbot — Assistant Runtime + Widget (DriveMind APP 3)

Powers Otto: validates sessions, retrieves cars from the KB, asks Claude for a structured answer,
verifies every recommended id exists, and streams the reply over SSE. Also builds the embeddable
Preact widget.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in values (CHATBOT DB project + keys)
npm run widget:build         # builds widget/dist/otto.js → public/otto.js (<15KB gzip)
npm run dev                  # http://localhost:3001 (use: next dev -p 3001)
```

The chatbot DB schema is owned/migrated by `drivemind-admin`; this app only reads it.

## Environment (server-only)

| Var | Purpose |
|-----|---------|
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Chatbot KB Supabase project (read) |
| `GEMINI_API_KEY` | Embeds the short user query (RETRIEVAL_QUERY) |
| `ANTHROPIC_API_KEY` | Default answer model (Claude) |
| `JWT_SECRET` | Signs short-lived session JWTs |
| `ANSWER_MODEL` | `claude` (default) \| `gemini` \| `openai` |

## API

- `POST /session { dealerId }` — validates Origin/Referer vs the dealer's registered domain (CORS
  locked, rate-limited per IP) → short-lived JWT.
- `POST /query { message, history? }` — JWT-gated, rate-limited per token. Embeds the query → ONE
  pgvector filter+cosine query (`LIMIT 5`) → Claude (structured output) → verify ids → **SSE** stream
  (`delta` tokens, then a `result` event with trusted car display data).

## Widget

Single-file IIFE (Vite lib mode, Preact) mounted in a **shadow DOM** (or `data-mode="iframe"`) so it
never clashes with the host page. Embed:

```html
<script src="https://<chatbot-host>/otto.js"
        data-dealer-id="nextgear" data-api="https://<chatbot-host>/api" async></script>
```

`npm run widget:build` then `npm run widget:size` (enforces the <15KB gzip budget).

## Commands

`npm run dev | build | start | lint | typecheck | test | widget:build | widget:size`

## Deploy

Own Vercel project. Build the widget so `public/otto.js` is served at `/otto.js`. Set env vars in the
dashboard; ensure the dealer's `registered_domain` (in the KB `dealers` row) matches the site origin.
