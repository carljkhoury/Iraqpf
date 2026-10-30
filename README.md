# Mahalla (محلّة)

Iraq's real estate marketplace.

A bilingual (Arabic-first, RTL / English LTR) real estate marketplace for Iraq: buy, rent and commercial property, with individual owners, brokers, agencies and developers.

**Current phase:** Phase 2, UI/UX. The public website runs on **sample data** for design review; real data, accounts and the API arrive in Phase 3.

## Running locally

Requirements: Node 22+, pnpm 10.

```bash
pnpm install
pnpm dev            # http://localhost:3000 (Arabic) and http://localhost:3000/en (English)
```

| Command                                        | What it does                                                                     |
| ---------------------------------------------- | -------------------------------------------------------------------------------- |
| `pnpm build`                                   | Production build of all apps                                                     |
| `pnpm test`                                    | Unit tests (formatters, phone numbers, Arabic search normalization)              |
| `pnpm test:e2e`                                | Browser tests in Arabic and English, desktop and mobile (run after `pnpm build`) |
| `pnpm i18n:check`                              | Fails if any text exists in one language but not the other                       |
| `pnpm lint` / `pnpm typecheck` / `pnpm format` | Code quality                                                                     |

Internal design review page: `/design` (Arabic) and `/en/design` (English).

## Repository layout

```
apps/web/          Public website (Next.js, next-intl, Tailwind)
packages/ui/       Design system components and tokens (RTL/LTR)
packages/shared/   Locale helpers, price/area/phone/date formatting, Arabic search normalization
packages/i18n/     Arabic and English message catalogs + parity check
packages/db/       Seed data (locations); schema and migrations arrive in Phase 3
docs/              Planning and decision documents
```

## Documentation

| Doc                                                      | Purpose                                                  |
| -------------------------------------------------------- | -------------------------------------------------------- |
| [01 – Decisions log](docs/01-decisions-log.md)           | Every product decision and open question                 |
| [02 – Architecture](docs/02-architecture.md)             | Technology stack, system design, i18n, security, hosting |
| [03 – Roadmap](docs/03-roadmap.md)                       | Phases, progress tracker, backlog                        |
| [04 – Brand name options](docs/04-brand-name-options.md) | Name shortlist (Mahalla chosen)                          |
| [05 – Database](docs/05-database.md)                     | Schema, relationships, indexes, lifecycle                |
| [06 – Catalog](docs/06-catalog.md)                       | Categories, attributes, amenities, deed types            |
| [07 – Design system](docs/07-design-system.md)           | Brand, colours, typography, RTL rules, components        |
| [Location seed data](packages/db/seed/locations.iq.json) | Governorates, cities, neighbourhoods (unreviewed)        |
