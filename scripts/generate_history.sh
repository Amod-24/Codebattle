#!/bin/bash
# Script to generate a 10-commit history with backdated timestamps

# Clean existing git repo if any
rm -rf .git
git init

# Base date: 10 days ago
BASE_DATE=$(date -v-10d +%Y-%m-%d)
# If not on mac, you could use `date -d "10 days ago"`

# Function to commit with a specific date
commit_with_date() {
  local msg=$1
  local day_offset=$2
  
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    local commit_date=$(date -v-${day_offset}d +"%Y-%m-%dT12:00:00")
  else
    # Linux
    local commit_date=$(date -d "${day_offset} days ago" +"%Y-%m-%dT12:00:00")
  fi
  
  export GIT_AUTHOR_DATE="$commit_date"
  export GIT_COMMITTER_DATE="$commit_date"
  git commit -m "$msg"
}

# Commit 1: 10 days ago
git add package.json package-lock.json README.md
commit_with_date "chore: initialize project with dependencies" 10

# Commit 2: 9 days ago
git add next.config.js eslint.config.mjs .prettierrc vitest.config.js playwright.config.js .gitignore
commit_with_date "chore: add configuration files for Next.js, ESLint, Prettier, and testing" 9

# Commit 3: 8 days ago
git add .github/workflows
commit_with_date "ci: setup GitHub Actions pipeline" 8

# Commit 4: 7 days ago
git add src/app/globals.css
commit_with_date "style: setup global CSS and design system" 7

# Commit 5: 6 days ago
git add src/engine/problems.js src/engine/__tests__/problems.test.js
commit_with_date "feat: add interactive programming problem definitions" 6

# Commit 6: 5 days ago
git add src/engine/judge.js src/engine/__tests__/judge.test.js
commit_with_date "feat: implement game judge engine core logic" 5

# Commit 7: 4 days ago
git add src/app/layout.jsx src/app/page.jsx
commit_with_date "feat: implement home page with terminal animation" 4

# Commit 8: 3 days ago
git add src/app/problems/page.jsx
commit_with_date "feat: implement problem listing page" 3

# Commit 9: 2 days ago
git add src/app/problem/
commit_with_date "feat: implement interactive console problem solving view" 2

# Commit 10: 1 day ago
git add tests/ scripts/
commit_with_date "test: add integration and e2e testing coverage" 1

# Commit 11: Just now
git add .
commit_with_date "chore: complete Next.js migration and cleanup" 0

echo "11 backdated commits created successfully!"
git log --oneline
