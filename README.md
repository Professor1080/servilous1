# Servilus Workforce Management Platform

A responsive Next.js dashboard prototype for a workforce management and staffing platform.

## What is included

- Four portal previews: Owner, Worker, Individual Customer, Corporate.
- Owner overview with workforce metrics and status chart.
- Worker directory with search and status/verification filters.
- Demo verification action (client-side state only).
- CSV export of currently filtered demo worker data.
- Worker discovery cards for customer and worker portals.
- Salary/payroll demo table, rating UI, organizational hierarchy.
- Responsive sidebar and mobile layout.

## Important: demo vs production

This starter is a **frontend demo**. The worker data is fictional and stored in React state. It resets when the page is refreshed. There is no real authentication, database, file upload, payroll processing, payment gateway, or server-side authorization.

Do not enter real personal data, identity documents, bank details, or passwords. Do not use this demo to make real employment or payroll decisions.

For production, integrate a trusted authentication provider and PostgreSQL database (for example Supabase), implement server-side role/resource authorization, private document storage, audit logs, and tests for booking/payroll/verification rules.

## Run locally

Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build:

```bash
npm run build
npm start
```

## Deploy to GitHub + Vercel

1. Create a new GitHub repository named `servilus`.
2. Upload the contents of this folder to the repository root (do not upload the outer zip as your only file).
3. In Vercel, choose **Add New → Project**, import the GitHub repository.
4. Framework preset should be detected as **Next.js**. Keep the default build settings.
5. Select **Deploy**.
6. Every push to the connected production branch can trigger a new deployment.

No environment variables are required for this demo.

## Suggested next production phase

1. Add Supabase project and database migrations.
2. Add secure authentication and role mapping.
3. Create database tables for users, worker profiles, companies, assignments, shifts, attendance, wage agreements, payroll, ratings, disputes, and audit logs.
4. Implement authorization checks on every server action/API route.
5. Store verification files in private object storage with short-lived signed URLs.
6. Add automated tests and review wage/privacy obligations for each operating jurisdiction.
