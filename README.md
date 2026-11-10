<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d5d246e3-d9cb-4a85-ab71-f53556e471f6

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Gemini API key used for AI features |
| `JWT_SECRET` | Secret for signing auth tokens (set a strong value in production) |

## Tech Stack

React 19, Vite, Tailwind CSS, Express, JWT auth (bcryptjs), Google Gemini (`@google/genai`).

## Scripts

- `npm run dev` – start the Express + Vite dev server on port 3000
- `npm run build` – production build into `dist/`
- `npm run lint` – type-check with `tsc --noEmit`

## API

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | – | Health check |
| POST | `/api/auth/register` | – | Create account (`email`, `password` ≥ 6 chars, `name`) |
| POST | `/api/auth/login` | – | Log in, returns JWT |
| GET | `/api/user/profile` | Bearer | Get current profile |
| PUT | `/api/user/profile` | Bearer | Update `name`, `skills`, `education`, `interests`, `assessments` |
| GET | `/api/jobs` | – | List jobs |
| GET | `/api/courses` | – | List courses |

Data is stored in the local `db.json` file.
