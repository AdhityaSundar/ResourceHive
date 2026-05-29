# ResourceHive

ResourceHive is a Next.js community resource directory for finding local support services. It includes searchable resource cards, detail pages, map-based discovery, saved resources, demo dashboard flows, admin editing, and spreadsheet import tooling.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Prisma schema for PostgreSQL
- JSON-backed local resource store
- Spreadsheet imports with `xlsx`

## Features

- Browse and search community resources by keyword, category, city, and need.
- View clean resource cards with available description, location, phone, email, and contact information.
- Open detailed resource pages with map previews and related resources.
- Import and merge resources from `Resource List.xlsx`.
- Upload spreadsheets through the admin page.
- Manage resources with local JSON persistence.
- Use demo saved-resource and recent-view dashboard flows.
- Switch between English and Spanish UI text.

## Routes

- `/`
- `/about`
- `/resources`
- `/resource/[id]`
- `/resources/[id]`
- `/map`
- `/contact`
- `/faq`
- `/dashboard`
- `/admin`

## Getting Started

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Spreadsheet Import

The import script reads:

```text
C:/Users/Adhit/Downloads/Resource List.xlsx
```

It uses the `Resource List` worksheet and merges rows into:

```text
src/data/resources.json
```

Run:

```bash
npm run import:sheet
```

The importer cleans blank values, normalizes state labels like `Texas` to `TX`, detects phone numbers placed in the email column, and avoids saving placeholder contact/location text.

## Validation

Run lint:

```bash
npm run lint
```

Run a production build:

```bash
npm run build
```

If OneDrive locks `.next` during local builds, use:

```bash
$env:NEXT_DIST_DIR=".next-build"; npm run build
```

## Data Notes

Resource data is stored locally in `src/data/resources.json`. The Prisma schema in `prisma/schema.prisma` is ready for moving persistence to PostgreSQL later.
