# Development Roadmap & Progress Tracker

No time estimates. Each phase ends with a review and testing gate before the next one starts.

Legend: ✅ done · 🔄 in progress · ⏳ waiting for founder input · ⬜ not started

---

## Phase 1: Discovery & planning 🔄

- ✅ Discovery round 1: business, users, advertisers, monetization, market questions
- ✅ Decisions log (`01-decisions-log.md`)
- ✅ Technology stack & architecture approved (`02-architecture.md`)
- ✅ Brand name: **Mahalla (محلّة)**
- ⏳ Database design: full schema, relationships, indexes (`05-database.md`): awaiting approval
- ✅ Initial catalog drafted (`06-catalog.md`): Iraq-team review pending
- ✅ Location dataset (`packages/db/seed/locations.iq.json`): 19 governorates, 37 cities, 98 neighbourhoods, 5 compounds, all marked unreviewed
- ⏳ Design system v0.1 (`07-design-system.md`): awaiting approval
- ⬜ Sitemap, user flows and permission matrix

**Gate:** founder approves stack, schema, design system.

## Phase 2: UI/UX

Designed as **real, reusable components in code** (not throwaway mockups), shown with sample data in both Arabic RTL and English LTR, on mobile and desktop. These become the production pages in Phase 3.

- ⬜ Project scaffolding (monorepo, linting, CI, i18n, RTL foundation)
- ⬜ Design system component library (buttons, inputs, selects, cards, badges, dialogs, tabs, pagination…)
- ⬜ Homepage
- ⬜ Search results: grid/list, filter panel (dynamic per category), sorting, map view
- ⬜ Property card variants (standard, featured, compact)
- ⬜ Property details page
- ⬜ Agency and agent profile pages
- ⬜ User dashboard: favourites, recently viewed, settings
- ⬜ Advertiser dashboard: listings, add/edit listing wizard, stats
- ⬜ Admin dashboard layout & key screens
- ⬜ Arabic and English review pass on every screen

**Gate:** founder approves designs on real devices.

## Phase 3: Core development

- ⬜ Database migrations + seed data (locations, catalog)
- ⬜ Authentication (phone OTP, sessions, staff 2FA)
- ⬜ User & advertiser accounts (4 types), agency membership & roles
- ⬜ Listing creation wizard, drafts, images upload & processing, quotas
- ⬜ Listing lifecycle (draft → pending → live → expired/rejected/archived)
- ⬜ Search & filtering (Postgres + PostGIS), sorting, map search, pagination
- ⬜ Property detail pages with SEO metadata, structured data, hreflang
- ⬜ SEO landing pages (purpose × category × location) + sitemaps
- ⬜ Favourites, recently viewed, number reveal & WhatsApp lead tracking
- ⬜ Advertiser statistics (views, reveals, WhatsApp clicks)
- ⬜ Reporting a listing

**Gate:** end-to-end tests pass in AR and EN, on mobile and desktop.

## Phase 4: Administration

- ⬜ Staff accounts, roles & permissions, audit log
- ⬜ Moderation queue (approve/reject with reasons), trust levels, duplicate flags
- ⬜ Reports management
- ⬜ User, advertiser and agency management
- ⬜ Location management (tree editor, translations, map boundaries)
- ⬜ Category & attribute management
- ⬜ Homepage content, featured listings/agencies, banners (AR/EN independent)
- ⬜ Platform settings (exchange rate, quotas, expiry, feature flags)
- ⬜ Platform statistics dashboard

## Phase 5: Testing & launch

- ⬜ Full functional regression (automated + manual)
- ⬜ Arabic/English layout audit on real devices (low-end Android included)
- ⬜ Performance budget (Core Web Vitals on mobile 4G)
- ⬜ Security review & penetration-style testing
- ⬜ Terms of Use, Privacy Policy (AR/EN)
- ⬜ Production deployment, backups, monitoring, error alerts
- ⬜ Soft launch with partner agencies → public launch

## Later phases (post-launch backlog)

- Paid packages, boosts and credits (ZainCash, Visa/Mastercard)
- Sales CRM: contracts, invoices, renewals
- Developer project pages / off-plan with instalment plans
- Document verification & verified badges
- In-app chat
- Saved-search alerts (email/WhatsApp), blog/guides
- Kurdish (Sorani) language
- Display advertising management
- Mobile apps (iOS/Android)
- Google Maps, dedicated search engine
- Image-based duplicate detection
