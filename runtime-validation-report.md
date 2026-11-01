# HireNest Runtime Validation Report

**Generated:** 2026-11-01  
**Target:** `D:\New folder (2)\job-portal`

## Summary

| Step | Status | Exit Code | Details |
|---|---|---:|---|
| Backend startup | PASS | 0 | `npm start`; API listened on `http://localhost:5000/api` |
| API end-to-end tests | PASS | 0 | 7 tests passed; real HTTP requests and MySQL persistence |
| Browser end-to-end test | PASS | 0 | 1 Playwright workflow passed |
| Frontend production build | PASS | 0 | Vite production build completed |
| Backend syntax checks | PASS | 0 | `node --check` passed for `app.js` and `server.js` |
| Existing unit tests | NOT CONFIGURED | 1 | No prior test framework or test script existed |

**Overall:** PASS for the tested API and browser workflows.

## Environment and capability evidence

```text
Docker: NOT INSTALLED
Node.js: v22.22.0
npm: 10.9.4
MySQL: 8.0.45
Playwright: 1.64.1
Chromium: installed at the local Playwright browser cache
```

- **Infra tier:** FALLBACK(local MySQL), because Docker is not installed.
- **Browser tier:** PRIMARY(Playwright), because Node.js and Chromium were available.
- Test data used unique generated `@example.test` emails and was removed from the database after each suite/test.
- Existing seeded job data was read; no real user credentials were used.

## Test case results

| # | Case | Status | Evidence |
|---:|---|---|---|
| 1 | Register a new user with valid information | PASS | API test and browser workflow returned successful registration |
| 2 | Reject duplicate registration | PASS | API returned HTTP 409 |
| 3 | Log in using valid credentials | PASS | API returned HTTP 200 and JWT |
| 4 | Reject incorrect credentials | PASS | API returned HTTP 401 |
| 5 | Access dashboard after login | PASS | Playwright reached dashboard and loaded real jobs |
| 6 | Reject dashboard access when unauthenticated | PASS | Playwright logout then `/dashboard` redirected to `/login` |
| 7 | Reject protected API requests with missing/invalid JWT | PASS | Missing and malformed JWT returned HTTP 401 |
| 8 | Reject expired JWT | PASS | Expired JWT returned HTTP 401 |
| 9 | Retrieve job listings | PASS | Real API returned seeded jobs with HTTP 200 |
| 10 | Apply for a valid job while authenticated | PASS | Real POST persisted application and browser displayed `Applied` |
| 11 | Reject duplicate applications | PASS | API returned HTTP 409 |
| 12 | Reject invalid job IDs | PASS | API returned HTTP 404 |
| 13 | Prevent cross-user application access | PASS | Second generated user received an empty private application list |
| 14 | Logout and subsequent protected-route behavior | PASS | Logout reached home; subsequent dashboard access redirected to login |
| 15 | Empty responses, server errors, and network failures | PASS/PARTIAL | Empty job search returned `[]`; unknown route returned 404; unavailable port produced fetch failure. A forced HTTP 500 was not run because it would require corrupting or disabling the live database. |

## Runnable test assets

- [`backend/test/e2e/test-support.js`](<D:/New folder (2)/job-portal/backend/test/e2e/test-support.js>)
- [`backend/test/e2e/auth.test.js`](<D:/New folder (2)/job-portal/backend/test/e2e/auth.test.js>)
- [`backend/test/e2e/jobs-applications.test.js`](<D:/New folder (2)/job-portal/backend/test/e2e/jobs-applications.test.js>)
- [`backend/test/e2e/security.test.js`](<D:/New folder (2)/job-portal/backend/test/e2e/security.test.js>)
- [`e2e/hirenest.spec.js`](<D:/New folder (2)/job-portal/e2e/hirenest.spec.js>)
- [`e2e/playwright.config.js`](<D:/New folder (2)/job-portal/e2e/playwright.config.js>)

## Commands

From the project root:

```powershell
npm test
npx playwright test e2e/hirenest.spec.js --config=e2e/playwright.config.js
npm run build
```

From `backend`:

```powershell
npm run check
npm test
```

## Fixes found through browser testing

- Registration now redirects authenticated users to `/dashboard/profile` without the public-route guard winning a navigation race.
- Logout now performs a full navigation to `/` after clearing authentication, preventing the protected-route guard from redirecting to `/login` during the same transition.

## Remaining limitations

- No HTTP 500 scenario was forced because doing so safely would require taking the live database offline or altering production configuration.
- Docker-based database isolation was unavailable because Docker is not installed. Local MySQL was used with generated test fixtures and cleanup.
- `npm install` reported two high-severity audit findings after adding `@playwright/test`; dependency remediation was not part of this test execution task.
