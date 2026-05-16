# Build & Host Plan

Mac-first since this is your first time on macOS. Treat this as a checklist — tick items as you go.

---

## Decisions (2026-05-14)
- **Stack:** React + Vite + TypeScript + Tailwind + Recharts.
- **Code host:** GitHub (still the default; best deploy integrations, best docs).
- **Hosting:** Cloudflare Pages (or Vercel — equivalent), free tier, GitHub-based auto-deploy.
- **Tests:** Vitest for the financial formulas — non-negotiable; the math is the product.
- **Public-ready from day one** → mobile-friendly layout, shareable URLs encoding inputs, no jargon, accessibility from the start.
- **VS Code already installed** → skip editor install step.

---

## 1. Mac dev environment (one-time setup)

### 1.1 Xcode Command Line Tools
Provides `git`, compilers, etc. Run in Terminal:
```
xcode-select --install
```
A GUI prompt appears. Accept and wait for it to finish (~5–10 min).

### 1.2 Homebrew (the macOS package manager)
From [brew.sh](https://brew.sh/). Run:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
At the end it'll print **two `eval` lines to add to your shell profile** — copy and run them, otherwise `brew` won't be on your `PATH`. Verify with:
```
brew --version
```

### 1.3 Node.js (the JavaScript runtime — needed even for a frontend-only site, because the build tools run on Node)
Option A (simpler, what I'd recommend for now):
```
brew install node
```
Option B (better if you'll juggle Node versions across projects later):
```
brew install nvm
```
…then follow the post-install instructions to add lines to `~/.zshrc`. Use `nvm install --lts` to install Node.

Verify:
```
node --version
npm --version
```

### 1.4 Editor — VS Code (already installed)
Just enable the `code` CLI: in VS Code press **Cmd+Shift+P → "Shell Command: Install 'code' command in PATH"**. Then `code .` opens the current folder from Terminal.

Worth installing extensions later: **ESLint**, **Prettier**, **Tailwind CSS IntelliSense**.

### 1.5 GitHub account + git config
If you don't already have a GitHub account, make one — it's the path to free hosting and to keeping the project backed up.

Set git identity (only first time):
```
git config --global user.name "Joe Hunt"
git config --global user.email "your-email@example.com"
```

Authenticate with GitHub via the GitHub CLI (easiest):
```
brew install gh
gh auth login
```

### 1.6 Terminal
The built-in `Terminal.app` is fine. iTerm2 is a popular upgrade (`brew install --cask iterm2`) but unnecessary to start.

---

## 2. Tech stack recommendation

For a calculator with charts, multiple inputs, scenario comparison, and shareable links, here's what I'd reach for:

| Layer | Choice | Why |
|---|---|---|
| Build tool | **Vite** | Fast, modern, near-zero config |
| Framework | **React** + **TypeScript** | TS catches calculation bugs early — important when the math matters |
| Styling | **Tailwind CSS** | Fast to iterate, no CSS file sprawl |
| Charts | **Recharts** or **Chart.js** | Recharts integrates naturally with React |
| Forms / state | Plain React state to start | Add Zustand or React Hook Form later if needed |
| Hosting | **Cloudflare Pages** or **Vercel** | Free tier, deploys on `git push`, custom domain easy |

**Why not Next.js?** It's a great framework but designed for sites that need server-rendered pages, APIs, auth, etc. Your calculator is entirely client-side — Next adds complexity you don't need.

**Why not plain HTML/JS?** You *could*, and for a single-page form it's almost viable. But once you want charts, scenarios, shareable URLs and TypeScript-checked formulas, the React route saves you more time than it costs.

---

## 3. Project bootstrap (when ready to start building)
From inside `/Users/joehunt/Claude Area/House Helper`:
```
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install recharts
npm run dev
```
That starts a dev server at **http://localhost:5173** — open it in your browser, edit files, see changes instantly.

`git init`, first commit, push to a new GitHub repo via `gh repo create`.

---

## 4. Testing on Mac
- **In-browser** during dev: `npm run dev` → open localhost in Safari + Chrome. Test both — Safari catches things Chrome forgives.
- **Cross-device**: Vite's dev server can expose a network URL (`npm run dev -- --host`) so you can open it on your phone on the same Wi-Fi.
- **Unit tests for the math**: install **Vitest** (`npm install -D vitest`) and write tests for each formula (mortgage payment, future-value of investment, total-cost-of-ownership). The financial maths is exactly the part you don't want silent bugs in — test it.
- **Manual scenarios checklist** — a section in this file with concrete inputs + expected outputs, e.g. "£500k house, 10% deposit, 5% rate, 25y, vs £1,800 rent — break-even ≈ year 7". Run these by hand after big changes.

---

## 5. Hosting (when ready)
Recommended path: **Cloudflare Pages**, free tier, deploys from GitHub.
1. Push project to GitHub.
2. Sign in to [Cloudflare](https://pages.cloudflare.com/) → Create application → Pages → Connect to Git.
3. Pick the repo. Build command: `npm run build`. Output dir: `dist`.
4. Every push to `main` redeploys automatically.
5. Custom domain (optional): add it in the Pages dashboard, follow DNS instructions.

Vercel is equivalent in convenience if you prefer their UI. Both: free for personal projects, fast, no credit card.

---

## 6. Roadmap
- [x] Scope decisions (UK only, full break-even, React/Vite/TS, public-ready)
- [ ] Mac dev environment (section 1) — Xcode CLT, Homebrew, Node, `code` CLI, GitHub account, git config, GitHub CLI auth
- [ ] Scaffold project (section 3) — Vite + React + TS + Tailwind + Recharts, first commit, push to GitHub
- [ ] Write pure TS functions: mortgage payment, amortisation schedule, FV of investment, total cost of buy path, total cost of rent path, SDLT calculator
- [ ] Vitest tests for each formula above
- [ ] Build the input form (mobile-first layout, sensible UK defaults)
- [ ] Build the results view (headline numbers + break-even chart)
- [ ] Add scenarios / sensitivity (rate-reset bands, flat-prices, low-equity-returns)
- [ ] Add intangibles weighting section
- [ ] Add shareable URL (encode inputs in query string)
- [ ] Deploy to Cloudflare Pages, custom domain (optional)
- [ ] (Stretch) Save scenarios locally so users can compare a few side by side

---

## 7. Open questions for Joe
Initial scope/stack questions are answered (see Decisions at top). Next batch will appear here as build choices come up — e.g. preferred sign-in method for GitHub, custom domain or not, whether to add basic analytics on the public site.
