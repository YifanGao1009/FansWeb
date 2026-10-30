# AIR KIN — Inherited Air

A speculative design website: what if we bred everyday objects like pets?

Choose the personalities of parent fans A and B, feel their differences through animated airflow, then ask AI to combine their behavioral genes into fan C.

## Included

- English-only, responsive website with separate Home, Parents, Breed, Archive, and About pages.
- Independently rotating fan blades, pulsing speed, and head sweep.
- Six selectable personalities and optional habit descriptions for each parent.
- Server-side OpenAI analysis with validated inheritance, gene provenance, and error handling.
- Browser-local family archive, replay, and JSON export.
- Original source, image assets, dependency lockfile, and tests.

This is a browser prototype. Physical fans are not connected. “Genes” are software parameters, not biological DNA.

## Run locally

Use Node.js 22.13 or newer and npm.

```sh
npm ci
cp .env.example .env.local
```

Open `.env.local` in your editor and set `OPENAI_API_KEY` to your own key. Keep this file local. It is excluded by `.gitignore`.

```sh
npm run dev
```

Open http://localhost:5173. To use a different port:

```sh
npm run dev -- --port 5175
```

You can view the website and choose parent personalities without a key. Generating C requires a valid server-side key, API credit, and access to the configured model.

## AI configuration

The server calls the OpenAI Responses API. The model is configured by `MODEL` in `lib/breeding.ts` (currently `gpt-6-luna`). If your API project cannot access this model, select an available model that supports the structured-output schema used by this project.

Only the selected fictional traits and optional habit descriptions are sent when Analyze is clicked. C is created only after the server validates the result. Failed requests preserve the visitor's choices and do not create a fake result.

Strength and sweep remain within parental bounds. Traits attributed to A or B must match that parent. AI explanations are fictional interpretations of these programmed rules.

## Upload to GitHub

Unzip this download. Upload the **contents of `air-kin/`** to the root of your repository, so `package.json` is at the top level. Include hidden project files and folders such as `.gitignore`, `.npmrc`, `.env.example`, and `.openai/`.

Do not upload `.env.local`, API keys, `node_modules/`, or generated build output. These are excluded from this download. Git history and local runtime data are also excluded.

## Hosting

Uploading this repository saves the source; it does not deploy the application. GitHub Pages serves static files and cannot run this project's AI endpoint.

This project uses Vinext, React, Vite, and a Cloudflare Worker. Preserve the Vite/Worker configuration when deploying it to a compatible server runtime. Set `OPENAI_API_KEY` as a server secret on the deployment platform.

The `.openai/hosting.json` file has an empty project ID in this export so it is not attached to the original hosted Site. A new Sites deployment needs its own Site registration and project ID.

The original deployment was owner-private. Its hosting access controls are not included in a GitHub repository. Before exposing the AI endpoint publicly, configure authentication and durable usage limits; the existing same-origin checks and per-worker cooldown are not a public access-control system.

## Check and build

```sh
npm test
npx tsc --noEmit
npm run build
```

## Main files

| File | Purpose |
| --- | --- |
| `app/studio.tsx` | Website interface, parent selection, fan animation, and local archive |
| `app/globals.css` | Visual design and responsive layout |
| `lib/fan-model.ts` | Personalities, genes, and validation rules |
| `lib/breeding.ts` | Server-side AI request and result validation |
| `app/api/breed/route.ts` | Breeding endpoint |
| `public/assets/fan.webp` | AI-generated concept image |
| `tests/breeding.test.mjs` | Inheritance and provider-error tests |

Archive records are stored only in the current browser; they are not synchronized between devices. The concept image is AI-generated. The moving fans are separate HTML/CSS elements.
