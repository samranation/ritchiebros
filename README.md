# Ritchie Bros. Test Automation

Playwright + TypeScript tests (e2e and API) 

## Requirements

- Node.js 22.22.1 or newer

## Install

```bash
npm install
npx playwright install chromium
```

## Run the tests

```bash
npm test              # all tests (e2e + api)
npm run test:e2e      # UI tests only
npm run test:api      # API tests only
```

## Static checks

```bash
npm run typecheck 
npm run lint      
npm run format    
npm run check     
```

## Important: tests run in a visible browser

The site blocks headless browsers and plain HTTP clients with a `403 Access Forbidden`.
The tests need to run headed (`headless: false` in `playwright.config.ts`)