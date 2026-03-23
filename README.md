# Wisp

Privacy-first eco companion with AI verification, game rewards, and Hedera-ready infrastructure.

Wisp lets users prove daily sustainable actions using screenshots/photos, then awards XP and WISP based on impact.
Raw personal data is not persisted as user identity data in the reward pipeline.

## What Is Implemented

### User app (Next.js)
- Onboarding flow (splash, slides, login, spirit naming, mood check).
- Authenticated app pages:
  - Home
  - Adventures
  - Profile
- Automatic redirect to onboarding for unauthenticated users on private pages.
- Upload-first verification UX with collapsible cards.

### AI verification flows currently available
- Public transit ticket screenshot/photo.
- Monthly electricity bill screenshot/photo.
- Daily screen-time screenshot.
- Plant-based meal photo.
- Recycling proof photo.
- Google Maps Timeline screenshot:
  - extracts date + movement stats + steps
  - validates screenshot date against server date (today/yesterday)
  - computes carbon intensity score
  - returns reward `0` when emissions are too high

### Backend (Express + PostgreSQL)
- JWT-based auth.
- Actions pipeline with duplicate guards, streak updates, quest progress updates, XP/WISP crediting.
- Quest retrieval and claiming.
- Profile retrieval + spirit rename.

### Agents layer (optional runtime)
- MCP-like ingestion framework for transport/energy/receipts.
- LLM client abstraction (Ollama/OpenAI/OpenRouter).

### Contracts layer (optional runtime)
- Hardhat project with Wisp smart contracts and deploy scripts.

## Repository Layout

```text
hedera/
  app/                  Next.js frontend (PWA-oriented UI)
  backend/              Express API + PostgreSQL integration
  agents/               Off-chain AI/MCP style agents
  contracts/            Hardhat + Solidity contracts
```

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind, lucide-react, Web3Auth, HashConnect
- Backend: Node.js, Express, PostgreSQL, express-validator, JWT
- AI access: OpenRouter (plus optional OpenAI/Ollama paths in agents)
- Blockchain tooling: Hedera SDK + Hardhat

## Quick Start

## 1) Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL database (Neon or compatible)
- OpenRouter API key (for screenshot/photo verification)

## 2) Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill required values in `backend/.env`:
- `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `PGSSLMODE`, `PGCHANNELBINDING`
- `JWT_SECRET`
- `OPENROUTER_API_KEY`

Then initialize database and run:

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Backend default URL: `http://localhost:3001`

## 3) Frontend setup

```bash
cd app
npm install
cp .env.example .env
npm run dev
```

Frontend default URL: `http://localhost:3000`

Required in `app/.env`:
- `NEXT_PUBLIC_API_URL=http://localhost:3001`
- `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=...`
- `NEXT_PUBLIC_WEB3AUTH_NETWORK=...`

## 4) Optional: Agents

```bash
cd agents
npm install
cp .env.example .env
npm run dev
```

## 5) Optional: Contracts

```bash
cd contracts
npm install
cp .env.example .env
npm run compile
```

Deploy (optional):

```bash
npm run deploy
```

## Current Frontend Routes

- `/onboarding`
- `/home`
- `/adventures`
- `/profile`

Private routes (`/home`, `/adventures`, `/profile`) auto-redirect to onboarding if token is missing.

## Backend API Overview

Base URL: `http://localhost:3001/api`

### Auth
- `POST /auth/social-login`
- `GET /auth/challenge`
- `POST /auth/login`

### Game
- `GET /game/profile`
- `GET /game/leaderboard`
- `POST /game/spirit/rename`

### Quests
- `GET /quests`
- `POST /quests/:id/claim`

### Actions
- `GET /actions`
- `GET /actions/:id`
- `POST /actions` (generic)
- `POST /actions/manual`
- `POST /actions/ticket-photo`
- `POST /actions/electricity-bill`
- `POST /actions/screen-time`
- `POST /actions/meal-photo`
- `POST /actions/recycling-photo`
- `POST /actions/timeline-screenshot`

## AI Features In Depth

Wisp uses image-first verification. The frontend sends an image as a data URL, backend normalizes and validates it, and an OpenRouter multimodal model returns strict JSON.

Common behavior across all AI flows:
- Input validation: only image data URLs are accepted.
- Safety parsing: model output is parsed as JSON with fenced-JSON fallback extraction.
- Confidence gating: low-confidence results are rejected (`422`) rather than rewarded.
- Anti-abuse checks: duplicate checks are applied per feature (same-day or same-period depending on use case).
- Reward pipeline: accepted actions write into `actions` table and then update user XP/WISP + streak + quest progress.

### 1) Public Transit Ticket AI (`POST /api/actions/ticket-photo`)

Purpose:
- Verify that uploaded proof is a real public transit ticket/pass-like artifact.

Model extraction fields:
- `isValidTransitTicket`
- `confidence`
- `transportType` (`bus|metro|train|tram|ferry|unknown`)
- `oneWayDistanceKm`
- `ticketId`, `issueDate`, `operator`, `reasoning`

Backend logic:
- Reject if not valid or confidence below `0.45`.
- Build `imageHash` and `ticketFingerprint` to block duplicate submissions.
- Estimate CO2 savings by comparing transit factor against car baseline.

Reward logic:
- Category: `public_transit`
- `wispEarned = baseWisp * (1 + min(1, estimatedCo2SavedKg / 2))`
- `xpEarned = baseXp + min(20, round(estimatedCo2SavedKg * 10))`

### 2) Electricity Bill AI (`POST /api/actions/electricity-bill`)

Purpose:
- Parse monthly electricity units from a utility bill screenshot.

Model extraction fields:
- `isElectricityBill`
- `unitsConsumed`
- `billingMonth`, `billingYear`
- `confidence`, `reasoning`

Backend logic:
- Reject if not bill or confidence below `0.4`.
- Reject if month/year missing.
- Duplicate key per month: `bill:{year}:{month}`.

Score mapping (lower usage = better score):
- `<=120 => 100`
- `<=180 => 85`
- `<=240 => 70`
- `<=320 => 55`
- `<=450 => 40`
- `>450 => 20`

Reward logic:
- Category: `energy_reduction`
- `wispEarned = baseWisp * (0.5 + score/100)`
- `xpEarned = baseXp + round(score/10)`

### 3) Screen-Time AI (`POST /api/actions/screen-time`)

Purpose:
- Verify daily mobile screen-time screenshot and reward lower usage.

Model extraction fields:
- `isScreenTimeScreenshot`
- `totalMinutes`
- `screenshotDate`
- `confidence`, `reasoning`

Backend logic:
- Reject if not valid screenshot or confidence below `0.4`.
- Duplicate guard: one `screen_time_reduction` submission per day.

Computed metrics:
- Estimated device energy: `estimatedEnergyWh = (minutes/60) * 4W`
- Score bands:
  - `<=120 => 100`
  - `<=180 => 90`
  - `<=240 => 80`
  - `<=300 => 65`
  - `<=360 => 50`
  - `<=480 => 35`
  - `>480 => 20`

Reward logic:
- Category: `screen_time_reduction`
- `wispEarned = baseWisp * (0.5 + score/100)`
- `xpEarned = baseXp + round(score/10)`

### 4) Plant-Based Meal AI (`POST /api/actions/meal-photo`)

Purpose:
- Verify meal photo as plant-based (vegan/clearly vegetarian signal).

Model extraction fields:
- `isPlantBasedMeal`
- `dishName`
- `estimatedCo2SavedKg`
- `confidence`, `reasoning`

Backend logic:
- Reject if not plant-based or confidence below `0.4`.
- Duplicate guard: one `plant_based_food` submission per day.

Reward logic:
- Category: `plant_based_food`
- `wispEarned = baseWisp * (1 + min(0.8, estimatedCo2SavedKg / 2))`
- `xpEarned = baseXp + min(15, round(estimatedCo2SavedKg * 10))`

### 5) Recycling Photo AI (`POST /api/actions/recycling-photo`)

Purpose:
- Verify image likely shows recyclable materials prepared/sorted for recycling.

Model extraction fields:
- `isRecyclingProof`
- `recyclableItemCount`
- `estimatedWasteDivertedKg`
- `confidence`, `reasoning`

Backend logic:
- Reject if not recycling proof or confidence below `0.4`.
- Duplicate guard: one `recycling` submission per day.

Reward logic:
- Category: `recycling`
- `wispEarned = baseWisp * (1 + min(0.8, estimatedWasteDivertedKg / 3))`
- `xpEarned = baseXp + min(15, round(estimatedWasteDivertedKg * 5))`

### 6) Google Timeline AI (`POST /api/actions/timeline-screenshot`)

Purpose:
- Parse Google Maps Timeline day screenshot and reward low-carbon commute behavior.

Model extraction fields:
- `isGoogleTimeline`
- `screenshotDate` (`YYYY-MM-DD`)
- `totalSteps`
- `walkingKm`, `transitKm`, `drivingKm`
- `confidence`, `reasoning`

Date validation policy:
- Backend derives current server-local `today` and `yesterday`.
- Accept only screenshots whose resolved date is exactly one of those two.
- Any other date is rejected with `422`.

Carbon/behavior metrics:
- Emission estimate: `actualEmissionKg = drivingKm * 0.192 + transitKm * 0.041`
- Low-carbon ratio: `(walkingKm + transitKm) / totalKm`
- Steps score: `min(1, totalSteps / 12000)`
- Final score: `round((0.65 * lowCarbonRatio + 0.35 * stepsScore) * 100)`

Critical redemption rule:
- If emission is too high (`actualEmissionKg > 6` or `drivingKm > 20`), reward is forced to zero:
  - `wispEarned = 0`
  - `xpEarned = 0`

Otherwise:
- Category: `low_carbon_commute`
- `wispEarned = baseWisp * (0.6 + score/100)`
- `xpEarned = baseXp + round(score/8)`

Duplicate policy:
- One submission per user per timeline date (`timeline:{YYYY-MM-DD}`).

### Model and provider configuration

- Default AI endpoint: OpenRouter chat completions.
- Default model fallback used in verifiers: `google/gemma-3-4b-it:free`.
- Environment keys:
  - `OPENROUTER_API_KEY`
  - `OPENROUTER_MODEL`
  - `SITE_URL`
  - `SITE_NAME`

### Why this design is privacy-first

- The app only submits the required screenshot/photo for action proof.
- Reward decisions are based on extracted features and impact scores.
- Backend stores action proof records and reward outcomes, not full personal location histories as user profile identity fields.

## Development Scripts

## Frontend (`app/package.json`)
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`

## Backend (`backend/package.json`)
- `npm run dev`
- `npm start`
- `npm run db:migrate`
- `npm run db:seed`

## Agents (`agents/package.json`)
- `npm run dev`
- `npm start`

## Contracts (`contracts/package.json`)
- `npm run compile`
- `npm run test`
- `npm run deploy`

## Troubleshooting

### Build error: duplicate variable name (`isLoading`)
- Cause: local state collides with auth context variable name.
- Fix: alias one side (example: `isLoading: isAuthLoading`) and rename local state.

### Onboarding step does not continue
- Check each onboarding component callback (`onDone`) wiring.
- Confirm async handlers always clear loading and call `onDone` on success.

### API calls fail from frontend
- Verify `NEXT_PUBLIC_API_URL` matches backend origin.
- Ensure backend is running and token is present.

### AI verification fails
- Verify `OPENROUTER_API_KEY` is set in backend.
- Check backend logs for model/provider errors.
- Ensure uploaded screenshot is clear and contains expected fields.

## Security Notes

- Do not commit real private keys, JWT secrets, or API keys.
- Rotate any secrets that were ever shared in plain text.
- Keep `.env` files local and excluded from version control.

## License

GPL-3.0 (see `LICENSE`).
