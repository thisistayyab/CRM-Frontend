# Taylance CRM (Frontend)

Client and order management app for sellers. **Owned and maintained by [Taylance Tech](https://taylancetech.com).**

> Marketing and SEO live on [taylancetech.com](https://taylancetech.com). This app is deployed on a subdomain and is not indexed for search.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development (Vite) |
| `npm run build` | Production build → `dist/` |
| `npm run start` | Serve production build (run `build` first) |
| `npm run preview` | Preview production build locally |

## Setup

```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to your backend URL (no trailing slash).

## Production

1. `npm run build`
2. Deploy `dist/` to your CRM subdomain (e.g. `crm.taylancetech.com`)
3. Ensure backend `CORS_ORIGIN` includes your frontend URL

## Stack

React 19 · Vite · MUI · React Router
