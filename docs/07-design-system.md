# Mahalla Design System (v0.1)

> Status: **Proposed, awaiting founder approval.** Built in code as `packages/ui` in Phase 2; the values here become Tailwind design tokens.

## 1. Brand idea

**Mahalla (محلّة)**: the neighbourhood. In Iraq the *mahalla* is where you belong, how you give directions, and the first thing anyone asks about a property. The brand should feel **trustworthy, warm, local and premium**: an Iraqi product, not a Gulf template.

**Visual inspiration: the Ishtar Gate of Babylon.** Its deep lapis-blue glazed bricks with golden figures are one of the best-known Iraqi images worldwide. That gives us:
- **Lapis blue** as the primary colour: trust, calm, professionalism.
- **Babylon gold** as a sparing accent: premium, featured, highlights.
- **Warm sand neutrals** instead of cold greys: the colour of Iraqi brick and stone.

This is clearly distinct from Property Finder (coral red / dark navy) and Bayut (green) (H-03).

**Tagline:** لكل بيت محلّة — *Every home has a mahalla.*

**Logo direction (designed in Phase 2):** a simple mark combining a map pin with the outline of a **shanasheel** (شناشيل), the carved wooden bay windows of old Baghdad and Basra houses. Wordmark: "محلّة" in Arabic and "mahalla" in lowercase Latin, both in lapis. The two wordmarks are designed as equals, so neither looks like a translation of the other. The mark must work at 16 px (favicon) and in one colour.

## 2. Colour tokens

### Primary: Lapis
| Token | Hex | Use |
|-------|-----|-----|
| lapis-50 | `#EEF3FB` | Selected backgrounds, subtle highlights |
| lapis-100 | `#D9E3F5` | Hover backgrounds, chips |
| lapis-200 | `#B3C7EB` | Borders on focus areas |
| lapis-300 | `#85A3DC` | |
| lapis-400 | `#557BC9` | |
| lapis-500 | `#3360B5` | Links on dark backgrounds |
| **lapis-600** | `#22489A` | **Primary buttons, links, active states** |
| lapis-700 | `#1C3A7D` | Primary hover |
| lapis-800 | `#172F63` | Headers, footer background |
| lapis-900 | `#12244B` | Deep backgrounds, hero overlays |

### Accent: Babylon gold (use sparingly)
| Token | Hex | Use |
|-------|-----|-----|
| gold-50 | `#FDF8EB` | Featured listing card tint |
| gold-100 | `#FAEDC8` | Featured badge background |
| gold-300 | `#EDC56A` | Decorative lines, stars |
| **gold-500** | `#D4A12A` | **Featured / premium markers, logo accent** |
| gold-700 | `#8F6814` | Gold text on light backgrounds (accessible contrast) |

### Neutrals: Sand (warm grey)
| Token | Hex | Use |
|-------|-----|-----|
| white | `#FFFFFF` | Cards, inputs |
| sand-25 | `#FCFBF9` | Page background |
| sand-50 | `#F7F5F2` | Section backgrounds |
| sand-100 | `#EFECE7` | Dividers on tinted backgrounds, skeletons |
| sand-200 | `#E2DED7` | Borders |
| sand-300 | `#CBC5BC` | Disabled borders |
| sand-500 | `#7C766C` | Secondary text, icons |
| sand-700 | `#45413B` | Body text |
| sand-900 | `#1C1A17` | Headings, primary text |

### Semantic
| Token | Hex | Use |
|-------|-----|-----|
| success-600 | `#1E8E5A` | Approved, live, verified |
| warning-600 | `#B7791F` | Pending review, expiring soon |
| danger-600 | `#C2362B` | Errors, rejected, delete |
| info-600 | lapis-600 | Information |

**Rules**
- One primary action per screen area, in lapis-600. Gold never carries text-heavy UI.
- All text meets **WCAG AA contrast** (4.5:1 body, 3:1 large text). Sand-500 is the lightest colour allowed for readable text on white.
- Light theme at launch. Tokens are semantic (`--color-surface`, `--color-text`), so a dark theme can be added later without touching components.

## 3. Typography

**Family: IBM Plex Sans Arabic + IBM Plex Sans** (free, open licence).
Why: the Arabic and Latin versions were designed together as one family, with matching weights and proportions. A page that mixes Arabic text with English names, prices and phone numbers (very common in Iraq) looks consistent instead of patched together. It is clear and modern without being cold, and renders well on low-end Android screens.

Alternative if we want a softer look: *Readex Pro* (also bilingual). Avoid decorative Kufi or Naskh fonts for UI text, because they hurt readability at small sizes.

| Token | Size / line-height (EN) | Size / line-height (AR) | Weight | Use |
|-------|------------------------|-------------------------|--------|-----|
| display | 48 / 56 | 48 / 68 | 700 | Homepage hero (desktop) |
| h1 | 32 / 40 | 32 / 48 | 700 | Page titles |
| h2 | 24 / 32 | 24 / 38 | 600 | Section titles |
| h3 | 20 / 28 | 20 / 32 | 600 | Card groups, panels |
| body-lg | 18 / 28 | 18 / 30 | 400 | Listing descriptions |
| body | 16 / 24 | 16 / 28 | 400 | Default text |
| body-sm | 14 / 20 | 14 / 24 | 400 | Meta info, labels |
| caption | 12 / 16 | 13 / 20 | 500 | Badges, timestamps |
| price | 20–28 | 20–28 | 700 | Prices, with **tabular figures** so digits align |

**Arabic-specific rules**
- Arabic gets **more line height** (≈1.6–1.75) than English (≈1.4–1.55), because Arabic letters extend further above and below the line. Without this, Arabic text looks cramped.
- Arabic captions are 1 px larger than English captions; Arabic at 12 px is hard to read.
- **Never use letter-spacing or uppercase transforms on Arabic**: they break the joined letters. Uppercase/tracking styles apply to Latin only.
- No italics in Arabic (there is no true Arabic italic). Emphasis uses weight.
- Western digits (Q-04) in both languages.

## 4. Layout, spacing & shape

| Token group | Values |
|-------------|--------|
| Spacing (4 px grid) | 0, 1 (4), 2 (8), 3 (12), 4 (16), 5 (20), 6 (24), 8 (32), 10 (40), 12 (48), 16 (64), 20 (80) |
| Radius | sm 6 px (inputs, chips) · md 10 px (buttons) · lg 14 px (cards) · xl 20 px (search panel, dialogs) · full (pills, avatars) |
| Shadow | sm: cards at rest (very subtle) · md: hover / dropdowns · lg: dialogs, sticky search |
| Borders | 1 px sand-200 |
| Breakpoints | base 360 · sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1440 |
| Container | max 1280 px content width, 16 px side padding on mobile, 24 px tablet, 32 px desktop |
| Grid | 4 columns (mobile) · 8 (tablet) · 12 (desktop), 16–24 px gutters |
| Touch targets | Minimum 44 × 44 px |

## 5. Iconography & imagery

- **Icons: Lucide** (free, open source), 1.75 px stroke, 20/24 px sizes. Consistent outline style.
- **Photography:** real Iraqi properties, natural light, no heavy filters. Cards use a **4:3** ratio; the detail gallery uses 3:2 with full-screen view.
- Images load with a tiny blurred placeholder (blurhash), then fade in. No layout jump.
- No generic stock "happy family" imagery; neighbourhood photos of Baghdad, Erbil and Basra for location tiles.
- Illustrations (empty states, onboarding) are simple line drawings in lapis and gold. Phase 2.

## 6. Arabic RTL & English LTR rules

The layout mirrors by default, but **every screen is reviewed in Arabic on its own merits**.

| Element | Rule |
|---------|------|
| Layout direction | Logical CSS only (`start`/`end`, `ms`/`me`). Never `left`/`right` in components |
| Directional icons | Flip: back/forward arrows, chevrons, "next" steps, carousel arrows |
| Non-directional icons | Never flip: phone, WhatsApp, map pin, search, heart, logos, checkmarks, media play |
| Numbers, prices, phone numbers, emails, URLs | Always rendered left-to-right inside an isolated span, so `0770 123 4567` and `$250,000` never get scrambled in Arabic sentences |
| Price format | AR: `250,000 $` / `250 مليون د.ع`; EN: `$250,000` / `IQD 250M` |
| Carousels & galleries | Start at the right in Arabic; swipe direction follows reading direction |
| Progress steps (listing wizard) | Flow right → left in Arabic |
| Forms | Labels and help text follow the locale; phone/number inputs are always LTR with an LTR caret |
| Charts (advertiser stats) | Time axis stays left → right in both languages (the common convention in Arabic business dashboards); labels translated |
| Mixed content | Arabic listing titles shown in the English UI (and vice versa) get the correct `dir` attribute per text block |
| Fonts | Locale switch changes font stack and line heights, not just direction |

## 7. Core components (built in Phase 2)

| Component | Notes |
|-----------|-------|
| Button | primary, secondary (outline), ghost, danger, plus a WhatsApp variant (green WhatsApp brand colour for that button only). Sizes sm/md/lg |
| Input, Textarea, Select, Combobox | Combobox powers location search with Arabic normalization |
| Range input | Price and area min/max with presets (e.g. 100M, 200M IQD) |
| Chips / segmented control | Bedrooms (Studio, 1, 2, 3, 4, 5+), purpose (Buy/Rent) |
| Checkbox, Radio, Switch | |
| Badge | Featured (gold), Verified (lapis + check), New, Pending, Expired |
| Property card | Grid, list and compact variants (see below) |
| Agency card | Logo, name, listing count, verified badge |
| Location tile | Photo + name + listing count |
| Search bar | Hero version (homepage) + compact sticky version (results) |
| Filter panel | Desktop sidebar / top bar; mobile full-screen sheet with sticky "Show 1,240 results" |
| Gallery | Swipeable, full-screen, image counter |
| Map | MapLibre wrapper with price-pin markers and clustering |
| Dialog, Sheet, Dropdown, Tooltip, Toast | Radix-based, accessible, RTL-aware |
| Tabs, Pagination, Breadcrumbs | Breadcrumbs follow locale direction |
| Empty states, skeleton loaders | For every list |
| Dashboard shell | Sidebar navigation for advertiser and admin areas |
| Data table | Admin lists: sorting, filters, bulk actions |
| Language switcher | Always visible in the header: "English" in the Arabic UI, "العربية" in the English UI (each language written in its own script) |

### Property card anatomy (grid variant)
1. Photo (4:3) with image count, favourite heart, Featured/Verified badge
2. **Price** (largest text) + rent period ("/ شهرياً")
3. Category · purpose (e.g. "شقة للإيجار")
4. Key facts row with icons: bedrooms · bathrooms · area m²
5. Location: neighbourhood, city
6. Footer: agency logo or advertiser name · "posted 3 days ago" · Call and WhatsApp buttons (list variant)

## 8. Content & tone of voice

- **Arabic:** clear Modern Standard Arabic, friendly and direct, not overly formal. Familiar Iraqi property terms are used as-is because they're what people search for: مشتمل، سرقفلية، طابو، ركن، نزال.
- **English:** plain **British English** (neighbourhood, favourites), consistent with the brief.
- Buttons are verbs: "أضف عقارك" / "List your property", "اعرض الرقم" / "Show number".
- Error messages say what happened and what to do next, in both languages.

## 9. Accessibility & performance budget

- WCAG 2.2 AA: contrast, keyboard navigation, focus rings (2 px lapis-500), screen-reader labels in both languages.
- Mobile performance targets (mid-range Android, 4G): Largest Contentful Paint < 2.5 s, layout shift < 0.1, interaction < 200 ms.
- Fonts self-hosted and subset (Arabic + Latin only), `font-display: swap`.
- No decorative animation. Motion limited to 150–200 ms transitions for feedback, and disabled for users with "reduce motion" set.
