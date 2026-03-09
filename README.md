# CodeBattle ⚔️

An interactive competitive programming platform where users solve problems by querying the system. Inspired by [Codeforces](https://codeforces.com) interactive problems.

## 🎯 Overview

CodeBattle brings interactive competitive programming challenges to your browser. Instead of traditional input/output problems, users engage in a query-response dialogue with the system to deduce hidden answers.

### How It Works

1. **Read the Problem** — Each problem describes a hidden value and the query format
2. **Query the System** — Send queries like `? 50` and get responses like `TOO_HIGH`
3. **Submit Answer** — Once confident, submit with `! 42` within the attempt limit

## 🏗️ Architecture

```
codebattle/
├── src/
│   ├── main.js                  # SPA router & entry point
│   ├── styles/
│   │   └── index.css            # Global design system
│   ├── pages/
│   │   ├── home.js              # Landing page
│   │   ├── problems.js          # Problem listing
│   │   └── problem.js           # Interactive solving page
│   └── engine/
│       ├── problems.js          # Problem definitions
│       ├── judge.js             # Query processing & validation
│       └── __tests__/           # Unit tests
├── tests/
│   ├── integration/             # Integration tests
│   └── e2e/                     # Playwright E2E tests
├── scripts/
│   ├── setup.sh                 # Idempotent setup script
│   └── deploy.sh                # Idempotent deploy script
├── .github/
│   ├── workflows/
│   │   ├── ci.yml               # CI pipeline (test, lint, build)
│   │   ├── lint-pr.yml          # PR lint checks
│   │   └── deploy.yml           # EC2 deployment
│   └── dependabot.yml           # Dependency updates
├── eslint.config.js             # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── vite.config.js               # Vite build configuration
└── playwright.config.js         # E2E test configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x

### Setup

```bash
# Clone the repository
git clone https://github.com/Amod-24/Codebattle.git
cd Codebattle

# Run the idempotent setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Or manually install
npm install
```

### Development

```bash
# Start dev server (opens at http://localhost:3000)
npm run dev

# Run tests
npm test                    # Unit tests
npm run test:integration    # Integration tests
npm run test:e2e            # E2E tests (Playwright)

# Lint & format
npm run lint                # Check for lint errors
npm run lint:fix            # Auto-fix lint errors
npm run format              # Format code with Prettier
npm run format:check        # Check formatting

# Build for production
npm run build
```

## 🔧 Design Decisions

### Frontend Architecture

- **Vanilla JS + Vite**: Chosen for simplicity, fast dev experience, and zero framework overhead. The app is lightweight enough that a framework like React would be overkill.
- **Hash-based SPA Router**: Simple client-side routing using `window.location.hash` — no server config needed.
- **Engine Pattern**: The `judge.js` and `problems.js` modules form a clean separation between problem data and game logic, making it easy to add new problem types.

### Interactive Console Design

- **Terminal-style UI**: Mimics a real competitive programming judge system with `?` for queries and `!` for answers.
- **Attempt System**: Users get 2 attempts with query counters resetting between attempts, encouraging strategic use of queries.
- **Real-time Feedback**: Color-coded responses (green for correct, red for errors, yellow for warnings).

### DevOps Pipeline

- **CI/CD**: GitHub Actions runs lint, test, and build on every push and PR.
- **PR Gate**: PRs must pass ESLint and Prettier checks before merge.
- **Dependabot**: Automated weekly checks for outdated npm and GitHub Actions dependencies.
- **Idempotent Scripts**: Both `setup.sh` and `deploy.sh` use `mkdir -p`, conditional checks, and safe defaults to be safely re-runnable.

## 🧪 Testing Strategy

| Level | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Judge engine logic, problem data validation |
| Integration | Vitest | Judge + Problems interaction, full game flows |
| E2E | Playwright | Complete user flows in browser |

## ⚡ Tech Stack

- **Build Tool**: [Vite](https://vitejs.dev/) 5.x
- **Testing**: [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)
- **Linting**: ESLint 10 + Prettier
- **CI/CD**: GitHub Actions
- **Deployment**: AWS EC2 (via SSH deploy action)

## 🎨 UI/UX

- Dark glassmorphic theme with mesh gradient backgrounds
- Google Fonts: Inter (sans-serif) + JetBrains Mono (monospace)
- Smooth animations and micro-interactions
- Responsive split-panel layout for problem solving
- Terminal-style interactive console with color-coded output

## 📋 Challenges Faced

1. **Interactive Problem Design**: Designing a system where problems are driven by queries rather than standard I/O required a different mental model. The session-based judge engine keeps state safely isolated.
2. **Frontend-only Architecture**: Running the "judge" entirely client-side meant the secret number exists in memory. For a production system, this would need a backend, but for demonstration purposes, it works well.
3. **Testing Interactive Flows**: E2E testing interactive query-response flows with Playwright required careful timing with `waitForTimeout` and dynamic content assertions.
4. **Idempotent Scripts**: Ensuring scripts work correctly whether run for the first time or the hundredth time required careful use of conditional checks and safe flags.

## 📄 License

MIT License © 2026 Amod
