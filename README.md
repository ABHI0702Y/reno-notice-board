# Reno Notice Board

A full-stack notice board with complete CRUD operations, built with Next.js 14 (Pages Router), Prisma, PostgreSQL, and Tailwind CSS.

## Live Demo

- **Vercel**: _Add your deployed URL here_
- **GitHub**: _Add your repo URL here_

## Features

- Create, read, update, and delete notices
- Fields: title, body, category (Exam / Event / General), priority (Normal / Urgent), publish date, optional image URL
- **Urgent notices always sort to the top** — ordered at the database level via Prisma `orderBy`
- Visible red **Urgent** badge on urgent notices
- Delete confirmation dialog before any record is removed
- Server-side input validation (required fields, valid date, enum values)
- Responsive card grid — works on phones and desktops
- Error feedback per field on both create and edit forms

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14, Pages Router (`pages/`) |
| Database ORM | Prisma 5 |
| Database | PostgreSQL — Neon / Supabase (free tier) |
| Styling | Tailwind CSS 3 |
| Hosting | Vercel (Hobby tier) |

## Running Locally

**Prerequisites**: Node.js 18+, a free hosted PostgreSQL database.  
Recommended free options: [Neon](https://neon.tech) · [Supabase](https://supabase.com) · [TiDB Cloud](https://tidbcloud.com)

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd reno-notice-board

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Open .env and set DATABASE_URL to your connection string

# 4. Push the schema to your database
npx prisma db push

# 5. Start the dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

> **TiDB / MySQL users**: change `provider = "postgresql"` to `provider = "mysql"` in `prisma/schema.prisma` before running `prisma db push`.

## Deployment to Vercel

1. Push the repo to GitHub (make sure it is public).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. In **Settings → Environment Variables**, add `DATABASE_URL` with your connection string.
4. Click **Deploy**. The `postinstall` script (`prisma generate`) runs automatically during the build.

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/notices` | List all notices, Urgent first |
| `POST` | `/api/notices` | Create a notice |
| `GET` | `/api/notices/:id` | Get a single notice |
| `PUT` | `/api/notices/:id` | Update a notice |
| `DELETE` | `/api/notices/:id` | Delete a notice |

All mutating routes validate on the server and return `400` with field-level errors on invalid input.

## One Thing I Would Improve With More Time

**Direct image uploads.** Currently the image field accepts an external URL. Given more time, I would integrate Cloudinary's free tier for actual file uploads: parse the multipart form with `formidable`, upload the file to Cloudinary, and store the returned `secure_url`. This removes the dependency on the user hosting images elsewhere and gives a much better editing experience.

## AI Usage

**Claude Code (claude-sonnet-4-6)** was used to scaffold the entire project — directory structure, Prisma schema, API route handlers, React components, and Tailwind layouts. Every generated file was reviewed for correctness. Specific things verified manually:

- The `orderBy: [{ priority: 'desc' }]` ordering logic (PostgreSQL enum ordering by declaration index, MySQL/TiDB alphabetical — both produce Urgent-first with `desc`).
- The Prisma singleton pattern in `lib/prisma.js` to prevent connection pool exhaustion in Next.js dev hot-reload.
- Server-side validation covering all required fields, valid ISO date parsing, and enum membership checks.
- `P2025` Prisma error code handling on update/delete for clean 404 responses.
