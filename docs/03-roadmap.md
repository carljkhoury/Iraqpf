# Development Roadmap & Progress Tracker

No time estimates. Each phase ends with a review and testing gate before the next one starts.

Legend: ✅ done · 🔄 in progress · ⏳ waiting for founder input · ⬜ not started

---

## Phase 1: Discovery & planning ✅

- ✅ Discovery round 1: business, users, advertisers, monetization, market questions
- ✅ Decisions log (`01-decisions-log.md`)
- ✅ Technology stack & architecture approved (`02-architecture.md`)
- ✅ Brand name: **Mahalla (محلّة)**
- ✅ Database design approved (`05-database.md`)
- ✅ Initial catalog drafted (`06-catalog.md`): Iraq-team review pending
- ✅ Location dataset (`packages/db/seed/locations.iq.json`): 19 governorates, 37 cities, 98 neighbourhoods, 5 compounds, all marked unreviewed
- ✅ Design system v0.1 approved (`07-design-system.md`)
- ⬜ Sitemap, user flows and permission matrix (moved into Phase 2/3 as each area is built)

**Gate:** founder approves stack, schema, design system.

## Phase 2: UI/UX 🔄

Designed as **real, reusable components in code** (not throwaway mockups), shown with sample data in both Arabic RTL and English LTR, on mobile and desktop. These become the production pages in Phase 3.

- ✅ Project scaffolding: pnpm/Turborepo monorepo, TypeScript, ESLint, Prettier, GitHub Actions CI, next-intl (Arabic at `/`, English at `/en`), RTL foundation, self-hosted IBM Plex fonts
- 🔄 Design system component library: tokens, Button, Badge, Chip, SegmentedControl, Field/Input/PhoneInput/Select, Logo, DisplayValue done; review page at `/design`. Dialogs, tabs, pagination and range inputs come with the pages that need them
- ✅ Homepage: hero search (Arabic-aware location autocomplete, purpose tabs, property type), featured and recent listings, property types, popular areas, agencies, advertiser call to action, header with language switcher, mobile menu, footer
- ✅ Search results: grid and list views, filter panel that adapts to the property type (residential / commercial / land), price filter in IQD or USD (compared using the exchange rate), bedrooms, bathrooms, area, furnishing, title deed, sorting, pagination, breadcrumbs, empty state, mobile filter sheet with live result count. Every search state is a shareable URL (`/rent/apartments/baghdad/karrada?beds=2`)
- ✅ Map view for search results: price pins (featured in gold), numbered clusters that zoom in on click, preview card linking to the listing, filters keep working in map view, frames the selected area; approximate-area map (shaded circle, no exact pin) on property pages
  - Free OpenStreetMap tiles via OpenFreeMap (no API key); provider set in `lib/map-config.ts`. Map labels follow the page language
  - "Search as I move the map" comes with the PostGIS search API in Phase 3
- ✅ Property card: grid, featured and list variants
- ✅ Property details page: photo grid + swipeable phone gallery + full-screen viewer (keyboard, swipe, reading-direction aware), price, key facts, description, details table (incl. price per m², deed, reference), amenities, location, contact card (show number, call, WhatsApp with a ready-made message), sticky call/WhatsApp bar on phones, share (native share sheet or copy link), report form, similar properties, structured data for Google, permanent ID-based URLs with redirects for old titles
  - While on sample data, call/WhatsApp show a "sample listing" notice instead of contacting anyone (`lib/demo.ts`); reports are not stored until Phase 3
- ⬜ Agency and agent profile pages
- ⬜ User dashboard: favourites, recently viewed, settings
- ⬜ Advertiser dashboard: listings, add/edit listing wizard, stats
- ⬜ Admin dashboard layout & key screens
- ⬜ Arabic and English review pass on every screen

**Gate:** founder approves designs on real devices.

Also done in Phase 2 so far:
- ✅ Shared formatters with unit tests: prices (IQD/USD, compact "250 مليون د.ع"), areas (m²/dunam/olk), Iraqi phone numbers (all common input formats, including Arabic-Indic digits), relative dates with correct Arabic plurals, Arabic search normalization
- ✅ Bidi-safe display: only digits are isolated left-to-right, so Arabic units like `د.ع` and `م²` render correctly
- ✅ Favourites saved in the browser (moves to user accounts in Phase 3)
- ✅ 58 browser tests and 24 unit tests in Arabic and English, desktop and mobile
- ✅ 72 realistic sample listings across Baghdad, Erbil and Basra with real photos (Unsplash, free licence) and illustration fallback
- ✅ Site hidden from search engines until launch (robots.txt, meta tag and HTTP header)
- ✅ Pages not built yet show a localized "being built" page (not indexed)

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
- ✅ Homepage: hero search (Arabic-aware location autocomplete, purpose tabs, property type), featured and recent listings, property types, popular areas, agencies, advertiser call to action, header with language switcher, mobile menu, footer content, featured listings/agencies, banners (AR/EN independent)
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
