# Time Tracker Desktop

A small desktop time-tracking app (React + Vite + Electron). Create tasks, log hours per task and view simple analysis charts.

## Requirements
- Node.js and npm (latest LTS recommended)
- Windows (packaging scripts target Windows NSIS by default)

## Quick start (development)
1. Install dependencies:
   - npm install

2. Run the web dev server:
   - npm run dev
   This starts Vite and serves the app in the browser for fast iteration.

3. Run the Electron app (build then launch):
   - npm run start
   This runs `vite build` then launches Electron.

If you prefer to run a separate dev Electron workflow, install electron globally or as a dependency and run Electron pointing at the built files.

## Build & package
- Build production assets and compile TypeScript:
  - npm run build

- Create a packaged installer (uses electron-builder):
  - npm run package
