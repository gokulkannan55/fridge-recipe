# Fridge Recipe Wizard

This repository contains a full-stack recipe generator (Node + Express server, React + Vite client).

Quick start (local):

```powershell
cd D:\Fridge-Recipe-Wizard\Fridge-Recipe-Wizard
npm install
$env:PORT=3000
$env:NODE_ENV='development'
npm run dev
```

Deploying to GitHub

1. Create a new repository on GitHub.
2. Add it as a remote and push:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

3. GitHub Actions CI will run on push and produce build artifacts. Use those artifacts to deploy to your chosen host (Vercel, Render, Netlify, Docker registry, etc.).

If you want, I can create a ready-to-use deploy workflow for a specific provider — tell me which one.
