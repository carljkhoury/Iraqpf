# Product Requirements & Decisions Log

This is the single source of truth for product decisions. Every decision has an ID so we can reference it in code reviews, issues and later discussions.

**Status legend**
- ✅ **Decided**: agreed, build to this.
- 🔁 **Assumed**: our working assumption; build so it is easy to change, revisit later.
- ❓ **Open**: needs an answer before the related work starts.

Last updated: 2026-10-30 (end of Discovery round 1)

---

## A. Business & team

| ID | Topic | Decision | Status |
|----|-------|----------|--------|
| A-01 | Brand name & domain | No name yet. Shortlist proposed in `04-brand-name-options.md`. | ❓ |
| A-02 | Ownership | Founder + partner/investor. Strong local relationships, so initial listings can be sourced quickly. | ✅ |
| A-03 | Ambition | Large, scalable, national platform. Success = listings, users, paying offices and revenue. | ✅ |
| A-04 | Team | Founder + Claude for now. More developers later, so code must be conventional and well documented so new developers can pick it up. | ✅ |
| A-05 | Budget | Open, but **use free tools/tiers wherever possible; introduce paid services only when needed.** Every paid dependency must sit behind an abstraction so it can be swapped. | ✅ |
| A-06 | Timeline | No fixed date. We work phase by phase without time estimates. | ✅ |

## B. Users & geography

| ID | Topic | Decision | Status |
|----|-------|----------|--------|
| B-01 | Launch geography | Launch focus: **Baghdad**, then **Erbil** and **Basra**. All 18 governorates exist in the database from day one; only launch cities are promoted on the homepage. | ✅ |
| B-02 | Kurdistan Region & Kurdish | KRI is in scope later. **Kurdish (Sorani) is a later language.** The i18n system must support adding a third locale without code changes to data models. | ✅ |
| B-03 | Diaspora & foreign businesses | In scope, so English quality and USD display matter. | ✅ |
| B-04 | User priority | 1. Buyers, 2. Tenants, 3. Land investors, 4. Businesses seeking commercial space, 5. Diaspora buyers. | ✅ |

## C. Advertisers & accounts

| ID | Topic | Decision | Status |
|----|-------|----------|--------|
| C-01 | Account types | Four separate advertiser types: **Individual owner**, **Independent broker**, **Agency** (with multiple agents), **Developer**. Plus regular **user** (seeker) and **staff** (admin) roles. | ✅ |
| C-02 | Verification | Phone OTP for everyone now. Data model includes a verification-request system (document upload + admin review) to be switched on later. Many Iraqi businesses are undocumented, so verification must never be mandatory to post. | ✅ |
| C-03 | Agency hierarchy | Agency roles: Owner, Manager, Agent. Managers control agents' listings, see performance, reassign leads. | ✅ |
| C-04 | Duplicate listings | Allowed. System detects likely duplicates (same location + type + similar size/price + image similarity later) and flags them for moderators. | ✅ |
| C-05 | Individual owner limits | Max **3 free active listings** per individual owner (admin-configurable). | 🔁 |

## D. Monetization

| ID | Topic | Decision | Status |
|----|-------|----------|--------|
| D-01 | Revenue streams (future) | 1. Agency subscriptions/packages, 3. Paid boosts (Featured/Premium/Refresh), 4. Developer project pages, 5. Display advertising. | ✅ |
| D-02 | Launch pricing | **Everything free at launch.** The credits/packages/boost data model is built early but disabled by a feature flag. | ✅ |
| D-03 | Payment methods | Likely **ZainCash** and **Visa/Mastercard** (via a local acquirer/aggregator). To be confirmed with the Iraq team. Payment integration sits behind a provider interface. Before online payments: manual payment recorded by admin. | 🔁 |
| D-04 | Sales CRM | Contracts, invoices, renewals in admin: planned, **not Phase 1**. | ✅ |

## E. Listings & Iraqi property specifics

| ID | Topic | Decision | Status |
|----|-------|----------|--------|
| E-01 | Currency | Advertiser picks **USD or IQD** per listing. Original price stored as entered. A normalized USD value is computed from an admin-set exchange rate for cross-currency filtering/sorting. Display shows the original currency, optionally with an approximate conversion. | ✅ |
| E-02 | Land pricing & units | Support **both total price and price per unit** (per m², per dunam, per olk). Area entered in m² or dunam/olk, always stored normalized in m². ⚠️ Olk conversion and local usage to be confirmed by the Iraq team (1 Iraqi dunam = 2,500 m²). | 🔁 |
| E-03 | Title deed type | **Required for sale listings.** Initial list (admin-editable): طابو صرف (Freehold), زراعي (Agricultural), مشاع (Shared ownership), استثمار (Investment), حجة / عقد (Informal deed/contract), أخرى (Other). | 🔁 |
| E-04 | Iraqi property attributes | Founder unsure. **Property attributes are fully admin-configurable per category** (no code change needed to add/remove fields). Claude proposes the initial set; the Iraq team reviews. | 🔁 |
| E-05 | Rent terms | Rent period: **monthly or yearly** (both supported). Optional "advance payment" (e.g. 6 months). Optional **tenant preference** (families / singles / companies / any). | 🔁 |
| E-06 | Key money (سرقفلية) | Supported as a commercial transaction type. | 🔁 |
| E-07 | Developer projects / off-plan | **Later release.** Developer account type exists from day one; project pages come later. | ✅ |
| E-08 | Listing expiry | Listings expire after **60 days** unless renewed (admin-configurable). Owners get a reminder before expiry. (On Property Finder and Bayut, UAE listings are tied to permits and paid package periods, so they expire in practice.) | 🔁 |
| E-09 | Location privacy | **Exact map pin is mandatory** on submission. Advertiser chooses public visibility: exact pin or approximate area. Approximate locations are fuzzed **on the server** so the exact pin never reaches the browser. | ✅ |

## F. Trust, moderation & contact

| ID | Topic | Decision | Status |
|----|-------|----------|--------|
| F-01 | Moderation | First-time and unverified advertisers: **pre-moderated** (reviewed before going live). Trusted/verified agencies: **publish instantly, reviewed after.** Trust level is per account and admin-controlled. | ✅ |
| F-02 | Contact methods | **Phone call + WhatsApp** at launch, both tracked as leads. In-app chat in a later phase. | ✅ |
| F-03 | Number reveal | Phone number hidden until "Show number" is tapped (anti-scraping and lead tracking). | ✅ |
| F-04 | Registration | Browse and contact without an account. Favourites, saved searches and posting require login. | ✅ |
| F-05 | Login | **Phone number + OTP** for users/advertisers. OTP delivery provider pluggable (SMS and/or WhatsApp). Staff/admin accounts use email + password + authenticator-app 2FA. | ✅ |
| F-06 | Reports & watermarks | Users can report listings (reason codes). Images get a subtle platform watermark. | ✅ |

## G. Content, SEO & growth

| ID | Topic | Decision | Status |
|----|-------|----------|--------|
| G-01 | Neighbourhood data | Claude compiles governorates → cities/districts → neighbourhoods, starting with the launch cities. Data is marked "unreviewed" until a team member reviews it. | ✅ |
| G-02 | SEO landing pages | Yes, e.g. "Apartments for rent in Karrada" pages generated from the location × category × purpose tree. | ✅ |
| G-03 | Blog, saved-search alerts | Not now. Later. | ✅ |
| G-04 | Mobile apps | Planned later. Backend is API-first from day one. | ✅ |

## H. Brand & design

| ID | Topic | Decision | Status |
|----|-------|----------|--------|
| H-01 | Brand identity | Claude proposes the name, logo direction, colours and typography. | ✅ |
| H-02 | Fonts | No preference. Claude recommends (free fonts only). | ✅ |
| H-03 | References | **Bayut and Property Finder** are the primary UX references. Dubizzle/OLX are explicitly *not* the look we want. Original identity; no copying of branding or exact UI. | ✅ |

## I. Technical & operations

| ID | Topic | Decision | Status |
|----|-------|----------|--------|
| I-01 | Hosting | Major cloud/VPS provider close to Iraq + CDN. No data-residency requirement. Free/cheap first. | ✅ |
| I-02 | Maps | **Free (OpenStreetMap-based) for now**, swap to Google Maps later. Map layer sits behind an abstraction. | ✅ |
| I-03 | Data import | None for now. | ✅ |
| I-04 | Legal | No known constraints. Standard Terms of Use + Privacy Policy will be drafted before launch. | ✅ |

---

## Open questions (round 2)

| ID | Question | Why it matters | Claude's recommendation |
|----|----------|----------------|-------------------------|
| Q-01 | Pick a brand name (see `04-brand-name-options.md`). | Needed for the design system, logo and domain. | See shortlist. |
| Q-02 | Approve the technology stack (`02-architecture.md`). | Blocks Phase 1 → database design. | Approve as proposed. |
| Q-03 | URL style: Latin slugs for both languages (`/ar/rent/apartments/baghdad/karrada`) or Arabic slugs on Arabic pages (`/للإيجار/شقق/بغداد/الكرادة`)? | Hard to change after launch (SEO). | Latin slugs, Arabic-first titles/metadata. See architecture §5. |
| Q-04 | Digits in the Arabic interface: Western (1,250,000) or Eastern Arabic (١٬٢٥٠٬٠٠٠)? | Affects every number on the site. | Western digits by default (what Iraqis type into phones/WhatsApp and what Bayut/PF use), with a setting to switch later. |
| Q-05 | First paid service: OTP delivery. SMS/WhatsApp OTP has no truly free option at production scale. OK to pay for it at launch? | Phone login depends on it. | Yes. During development OTPs are logged to the console (free). |
| Q-06 | Hosting for the first public deployment: a small VPS (~US$5–15/month) behind Cloudflare's free CDN, or free tiers only (slower, sleeps when idle)? | Reliability vs zero cost. | Free tiers for staging; the small VPS for production. |
| Q-07 | Confirm local land units (olk) and the title-deed list with the Iraq team. | Data correctness. | Can be done in parallel; doesn't block development. |
