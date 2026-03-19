# Component & Styling Inventory — Migration Documentation

> **Scope**: Archaeology of the old Vite app — every component's props, CSS classes, state, animation patterns, and dependency map. Read at phases A (porting utilities/shared components), E (porting page logic), F (admin port). Use to understand what exactly needs to be ported/replaced.
>
> **Does not cover**: What the new components should look like (→ `design-spec.md`), routing/data wiring (→ `routing-and-data-flow.md`), DB schema (→ `supabase-integration.md`).

> Source: `_reference/wsc-vite-app/src/components/` and `_reference/wsc-vite-app/src/pages/`

---

## Global CSS Variables

**File**: `wsc-vite-app/src/index.css`

```css
:root {
  --wsc-gold:       #ffd95a;
  --wsc-gold-rgb:   255, 217, 90;
  --wsc-purple:     #4f2683;   /* true purple — distinct from tailwind.config "purple": #F9C726 */
  --wsc-purple-rgb: 79, 38, 131;
  --wsc-dark:       #111111;
  --wsc-dark-rgb:   17, 17, 17;
  --wsc-light:      #fafafa;
  --wsc-light-rgb:  250, 250, 250;
  --wsc-gray:       #2b2b2b;
  --wsc-gray-rgb:   43, 43, 43;
}
```

> **Important**: `tailwind.config.js` defines `purple: '#F9C726'` (actually yellow/gold) — this conflicts with the CSS variable `--wsc-purple: #4f2683` (true purple). Rename during migration to avoid confusion.

### Global Typography (index.css)

| Element | Size | Weight | Font |
|---------|------|--------|------|
| `h1` | 3.0em | 500 | Georgia serif |
| `h2` | 2.2em | 250 | Georgia serif |
| `h3` | 1.5em | — | Georgia serif |
| `p` | 1.1em | — | Georgia serif, line-height 1.5 |
| `button` | 1em | 500 | Georgia serif, letter-spacing 0.03em |
| `a` | 1.2em | 500 | Georgia serif, hover → `--wsc-gold` |

### Global Animations (index.css)

| Name | Description |
|------|-------------|
| `logoSpin` | 360° rotation, 20s |
| `fadeIn` | opacity 0→1, 0.5s |
| `heroFadeIn` | opacity 0→0.5, 0.5s |
| `pulse` | opacity 0.6↔0.8, 1.5s cubic-bezier |
| `fadeInUp` | translateY(30px)→0 + opacity 0→1, 0.8s ease-out |

### App-Level Classes (App.css)

| Class | Description |
|-------|-------------|
| `.fade-in` | `fadeIn` 0.5s ease-in-out |
| `.hero-fade-in` | `heroFadeIn` 0.5s ease-in |
| `.animate-pulse` | `pulse` 1.5s infinite |
| `.parallax-container` | overflow hidden, will-change: transform |
| `.fade-in-up` | opacity 0, `fadeInUp` 0.8s ease-out forwards |

---

## Components

### Nav

**File**: `src/components/nav/Nav.jsx`
**Type**: Presentational with state
**Props**: None (uses `useLocation()` internally)

**State**: `isMobileMenuOpen: boolean`, `scrollPositionRef` (saved scroll Y)

**Key CSS classes** (`Nav.css`):
- `.hamburger-button`: 3.0rem × 3.0rem, flex center
- `.hamburger-line`: 1.5rem wide, 2px tall, white; animated on open
- `.hamburger-line-top.open` / `.hamburger-line-middle.open` / `.hamburger-line-bottom.open`: rotate ±45°, fade middle
- `.mobile-menu`: fixed, 80% width, 100vh, translateX(-100%) → translateX(0) on open, 0.3s ease-in-out
- `.mobile-backdrop`: fixed inset-0, rgba(0,0,0,0.6), backdrop-filter blur(2px)
- `.mobile-menu-item`: staggered fadeIn, 50ms increments (0–200ms delay)
- `.mobile-menu-link.active`: font-weight 600
- `.desktop-nav-link::after`: absolute bottom underline (active state indicator)

**Third-party deps**: `react-router-dom` (Link, useLocation)

---

### Footer

**File**: `src/components/footer/Footer.jsx`
**Type**: Presentational
**Props**: None

**Key Tailwind classes**:
- `w-full py-16 bg-[#1F1F1F]`
- `grid grid-cols-1 md:grid-cols-3 gap-12`
- `text-gray-300 hover:text-western-gold transition-colors`
- `border-t border-gray-700`

**Columns**: Brand info + social links | Quick links | Legal + TSI attribution

---

### Preloader

**File**: `src/components/preloader/Preloader.jsx`
**Type**: Presentational
**Props**: `{ onLoadComplete: () => void }`

**State**: `loading: boolean`, `progress: 0–100`

**Key CSS classes** (`Preloader.css`):
- `.preloader`: fixed inset-0, z-9999, bg `--wsc-dark`, fade-out transition 0.8s
- `.preloader.fade-out`: opacity 0, visibility hidden, pointer-events none
- `.loading-bar`: height 100%, bg `--wsc-gold`, width animated 0→100%, gold glow box-shadow
- `pulseLogo` animation: scale 1→1.1→1, opacity 0.8→1→0.8, 2s infinite

**Images preloaded**: `/shark.avif`, `/UC-HILL.avif`, `/TORONTO.avif`, `/MIDDLESEX.avif`

---

### ContactForm

**File**: `src/components/contact-form/ContactForm.jsx`
**Type**: Data-fetching (EmailJS)
**Props**: None

**State**:
- `formData: { name, email, organization_type, subject, message }`
- `isSubmitting: boolean`
- `submitStatus: 'success' | 'error' | null`
- `fieldErrors: { [field]: boolean }`

**Form fields**:
| Field | Type | Validation |
|-------|------|-----------|
| `name` | text | Required |
| `email` | email | Required + regex |
| `organization_type` | text | Optional |
| `subject` | text | Required |
| `message` | textarea | Required, max 1000 chars |

**Key CSS classes** (`ContactForm.css`):
- `.contact-form-container`: grid 1fr → 1fr 1.2fr @ lg
- `.contact-social-section` / `.contact-form-section`: gradient bg purple 0.15, border purple 0.3, backdrop-filter blur
- `.contact-social-section::before`: radial gradient gold 0.08 shimmer on hover
- `.social-icon-wrapper`: 3.5rem circle, hover rotate 360° + scale 1.1
- `.contact-page-input.error`: red border + shake animation
- `.spinner`: 1.25rem, border gold + transparent, spin 0.8s linear infinite

**Animations**: `fadeInUp`, `shimmer` (3s infinite), `slideDown` (0.3s), `shake` (0.4s)

**EmailJS config**: Service ID `service_qwpe0fl`, Template ID `template_lt8anmn`, 200 email/month limit

---

### PageTitle

**File**: `src/components/page-title/PageTitle.jsx`
**Type**: Presentational
**Props**: `{ title: string, description?: string, className?: string }`

**Key Tailwind classes**:
- `mx-auto text-center max-w-3xl px-6 md:px-12 pt-12`
- `text-3xl font-bold pb-5` (h1)
- `border-t border-[#F9C726] w-4/5 mx-auto pb-5` (divider)
- `text-gray-300 font-georgia leading-relaxed pb-10 px-4 md:px-12` (description)

---

### LazyImage

**File**: `src/components/lazy-image/LazyImage.jsx`
**Type**: Presentational
**Props**: `{ src, alt, className?: string, style?: object, placeholderColor?: string }`

**State**: `isLoaded: boolean`, `isInView: boolean`, `imgRef`

**Key CSS classes** (`LazyImage.css`):
- `.lazy-image-container`: position relative, overflow hidden
- `.lazy-image-placeholder`: absolute inset-0, opacity 1→0 transition 0.5s on load
- `.lazy-image.loaded`: opacity 1 (was 0 until loaded)

**Implementation**: IntersectionObserver with 50px rootMargin, `loading="lazy"` attribute

---

### Event (Card)

**File**: `src/components/event/Event.jsx`
**Type**: Presentational with state
**Props**: `{ event: { date, time, title, location, description } }`

**State**: `isHovered: boolean`

**Styling**: Entirely inline (React state-driven), NO separate .css file

**Key inline style patterns**:
- Card: gradient bg, border purple 0.3 → gold on hover, translateY(-8px) on hover, gold glow box-shadow
- Date block: bg purple → gradient purple→gold on hover
- Shimmer overlay: linear gradient transparent→gold 0.2→transparent
- Location icon: inline SVG 24×24 viewBox

**Responsive**: `window.innerWidth >= 768` check at render: row layout (dateBlock 25%, content 75%) vs column

---

### GallerySection

**File**: `src/components/gallery/GallerySection.jsx`
**Type**: Presentational
**Props**: `{ photos?: Array<{ id, src, alt, caption? }>, loading?: boolean, error?: string | null, onRetry?: () => void }`

**Key CSS classes** (`GallerySection.css`):
- `.gallery-grid`: grid 1fr → repeat(2,1fr) @ 640px → repeat(3,1fr) @ 1024px, gap 1.25→2rem
- `.gallery-item`: border purple 0.3, hover translateY(-4px), hover gold border + glow
- `.gallery-image`: width 100%, aspect-ratio 4/3 (mobile) / 3/2 (desktop), object-fit cover
- `.gallery-skeleton`: aspect-ratio 4/3, `galleryShimmer` 1.5s infinite
- `galleryShimmer` animation: background-position slide

**States rendered**: 6 skeleton divs (loading) → error + retry → "No photos yet" → photo grid

---

### Profile (Executive Card)

**File**: `src/components/profile/Profile.jsx`
**Type**: Presentational
**Props**: `{ executive: { name, title, headshot_path } }`

**Key Tailwind classes**:
- `w-56 h-56 object-cover border-2 border-gray-300`
- `hover:shadow-lg hover:shadow-[var(--wsc-light)] hover:scale-105 duration-300` (image hover)
- `text-xl font-bold pt-4 text-[var(--wsc-gold)]` (name)
- `text-gray-400 text-sm` (title)

**Data dep**: `getPublicUrl('headshots', executive.headshot_path)` from storageUtils

---

### Sponsor (Card)

**File**: `src/components/sponsor/Sponsor.jsx`
**Type**: Presentational with state
**Props**: `{ sponsor: { id, name, logo_path, description, link } }`

**State**: `isHovered: boolean`, `windowWidth: number`

**Styling**: Entirely inline (same pattern as Event card)

**Key inline style patterns**:
- Card: translateY(-8px) + gold glow on hover
- Logo block: gradient bg, min-height 200px
- Logo image: 120px → 160px height, object-fit contain
- Shimmer overlay on hover

**Responsive**: Desktop (≥768px): row layout (logo 35%, content 65%)

**Link**: Logo wrapped in `<a target="_blank">` to `sponsor.link`

---

### AsyncStateWrapper

**File**: `src/components/shared/AsyncStateWrapper.jsx`
**Type**: State handler
**Props**: `{ loading, error, data, onRetry?, emptyMessage?, children }`

**Rendering logic**: loading → error → empty → children

**Inline spinner styles**: 32px, border gold top, rotate 360° 0.8s linear infinite

---

### ErrorBoundary

**File**: `src/components/shared/ErrorBoundary.jsx`
**Type**: Class component
**Props**: `{ children }`

**Catches**: Render-time errors only (NOT async/event handler/promise errors)

**Fallback**: Error message + "Reload Page" button (inline styles, gold h2)

---

### FullPageLoader

**File**: `src/components/shared/FullPageLoader.jsx`
**Type**: Presentational
**Props**: None

**Inline styles**: flex column center, 100vh dark bg, 40px gold spinner, 0.6 opacity text

---

## Pages

### Landing

**File**: `src/pages/Landing/Landing.jsx`
**Type**: Data-fetching page
**Props**: `{ events?, loading?, error? }`

**Sections**:
1. Hero — bg UC-HILL.avif, 100vh, fadeInUp text
2. About — 2-col grid (text + stats card)
3. Landscape — bg TORONTO.avif with quote overlay
4. What We Do — 3-col feature card grid
5. Sponsors Carousel — marquee animation, 60s linear infinite
6. Events Preview — top 3 events via Event component
7. Contact — ContactForm component
8. Join — CTA with bg MIDDLESEX.avif

**Key CSS classes** (`Landing.css`):
- `.section-title`: 2.25→2.5rem responsive, centered, bold
- `.container-custom`: max-width 90%, margin 0 auto
- `.divider`: 80vw, 2px gold
- `.hero-section`: flex column, 100vh
- `.hero-background`: absolute inset-0, opacity 0.5, `heroFadeIn`
- `.hero-content`: z-10, `fadeInUp` 1s
- `.about-stats-card`: gradient light bg, hover shadow + transform
- `.stat-item`: flex column center, border-bottom gold
- `.feature-card`: gradient bg purple 0.1, backdrop blur, hover scale 1.02 + glow
- `.feature-icon`: 5–5.5rem circle, gradient purple→dark, gold border, hover rotate 360°
- `.sponsors-carousel`: bg `#1F1F1F`
- `.marquee-track`: width 200%, `marquee` 60s linear infinite
- `.sponsor-logo`: 9→12rem responsive
- `.join-section`: bg MIDDLESEX.avif, opacity 0.3

**Animations**: `shimmer` (translate + rotate, 3s infinite), `marquee` (translateX -50%, 60s)

---

### About

**File**: `src/pages/About/About.jsx`
**Type**: Data-fetching page
**Props**: None

**Sections**: Mission & Vision cards (2-col) + Gallery

**Key CSS classes** (`About.css`):
- `.about-container`: 92% width, max-width 1600px
- `.about-section`: margin-bottom 6rem, `fadeInUp` with delay (0.1–0.3s stagger)
- `.about-card`: max-width 720px, gradient bg purple 0.08, left border gold 4px
- `.about-card__title::after`: gold underline
- `.about-card__text`: 1.0625→1.125rem, line-height 1.85

---

### Events

**File**: `src/pages/Events/Events.jsx`
**Type**: Data-fetching page (receives events as props)
**Props**: `{ events?, loading?, error? }`

**Key CSS classes** (`Events.css`):
- `.events-hero`: relative, 80vh, flex column
- `.events-hero-background`: absolute, bg TORONTO.avif, opacity 0.3
- `.events-hero-description`: hidden mobile, visible @ 640px+
- `.events-page-container`: flex column, padding 3rem 3rem 5rem, gap 2rem

---

### Sponsors

**File**: `src/pages/Sponsors/Sponsors.jsx`
**Type**: Data-fetching page
**Props**: None

**Key CSS classes** (`Sponsors.css`):
- `.sponsors-hero`: relative, 80vh, flex column
- `.sponsors-hero-background`: bg NEWYORK.avif, opacity 0.3
- `.sponsors-page-container`: flex column, padding 3rem 0 5rem

---

### Contact

**File**: `src/pages/Contact/Contact.jsx`
**Type**: Presentational wrapper
**Props**: None

Renders `<PageTitle>` + `<ContactForm>` + 5rem bottom spacer.

---

### ExecutiveTeam

**File**: `src/pages/Team/ExecutiveTeam.jsx`
**Type**: Data-fetching page
**Props**: None

**Grid layouts** (`ExecutiveTeam.css`):
- Presidents: `1fr` → `repeat(2,1fr)` @ 768px, max-width 48rem
- Vice Presidents: `repeat(2,1fr)` → `repeat(4,1fr)` @ 1024px
- Assistant VPs: same as Vice Presidents

- `.team-section-title`: 1.5rem bold, margin-top 2.5rem
- `.team-section-divider`: 2px gold, 50% width

---

### TermsOfService / PrivacyPolicy

**Files**: `src/pages/TermsOfService.jsx`, `src/pages/PrivacyPolicy.jsx`
**Type**: Purely static
**Props**: None

**Key Tailwind classes**:
- `flex flex-col min-h-screen`
- `container mx-auto px-6 md:px-12 py-16 pt-32 flex-grow max-w-4xl`
- `text-4xl font-bold mb-8 border-b pb-4` (h1)
- `list-disc pl-8 mb-3 space-y-2 leading-relaxed` (lists)

---

### AdminDashboard

**File**: `src/pages/Admin/AdminDashboard.jsx`
**Type**: Admin-only
**Props**: None

**State**: `activeTab: 'events' | 'sponsors' | 'executives' | 'gallery_photos'`

**Key CSS classes** (`AdminDashboard.css`):
- `.admin-layout`: flex
- `.admin-sidebar`: fixed-width left pane, scrollable
- `.admin-main`: flex-grow right pane

---

### AdminSection

**File**: `src/pages/Admin/AdminSection.jsx`
**Type**: Generic CRUD
**Props**: `{ configKey: string, config: ContentConfig }`

**Key CSS classes**:
- `.admin-modal-overlay`: fixed inset-0, semi-transparent, flex center
- `.admin-modal`: white bg, padding, max-width 600px
- `.admin-toggle` / `.admin-toggle-slider`: custom animated checkbox toggle
- `.admin-image-preview`: ~60×60px thumbnail in table

---

### AdminForm

**File**: `src/pages/Admin/AdminForm.jsx`
**Type**: Generic form
**Props**: `{ fields, initialData?, pathColumn?, bucket?, onSave, onCancel, saving, error? }`

**Field types**: `text`, `textarea`, `select`, `date`, `image`

**Key CSS classes**:
- `.admin-dropzone`: flex center, border dashed, padding; hover background change
- `.admin-dropzone-active`: highlighted bg
- `.admin-dropzone-clear`: X button (calls `e.stopPropagation()`)
- `.admin-save-btn` / `.admin-cancel-btn`: styled action buttons

**Image upload**: drag-drop + click, MIME + dimensions + size validation before upload

---

## Dependency Map

| Package | Components Using It |
|---------|-------------------|
| `react-router-dom` | Nav, Landing, Footer, App |
| `@supabase/supabase-js` | All data-fetching components |
| `@emailjs/browser` | ContactForm |
| `@fortawesome/*` | Imported but mostly replaced with inline SVGs |
| `react-big-calendar` | Installed, not observed in active use |
| `react-calendar` | Installed, not observed in active use |
| `date-fns` | Event date formatting |

---

## Animation Patterns Summary

| Pattern | Implementation | Used In |
|---------|---------------|---------|
| Fade-in on load | CSS `fadeInUp`, `fadeIn` classes | All page sections |
| Hover lift | `translateY(-4px to -8px)` | Cards, gallery items, sponsor cards |
| Hover glow | `box-shadow` with gold rgba | Event cards, sponsor cards, feature cards |
| Loading spinner | `border-top` gold, `rotate` 360° infinite | AsyncStateWrapper, FullPageLoader |
| Shimmer skeleton | `background-position` slide, 1.5s | GallerySection, marquee |
| Parallax | `scrollY * 0.3–0.69` on bg elements | Landing, Events, Sponsors heroes |
| Marquee scroll | `translateX(-50%)` 60s linear infinite | Landing sponsors carousel |
| Icon rotation | `rotate(360deg)` on hover, transition 0.3s | Feature icons, social icon wrappers |
| Staggered entrance | Animation delay increments (50ms) | Nav mobile menu items |
| Shake | `translateX ±8px` on form error | ContactForm invalid fields |

---

## Responsive Breakpoints

| Breakpoint | Width | Source |
|-----------|-------|--------|
| Default (mobile) | < 640px | Tailwind / CSS media queries |
| `sm` | 640px | Tailwind |
| `md` | 768px | Tailwind |
| `lg` | 1024px | Tailwind |
| `xl` | 1280px | Tailwind |

> No custom breakpoints defined in `tailwind.config.js`. All media queries use Tailwind defaults.

---

## Color Palette (Actual Usage)

| Color | Value | Usage |
|-------|-------|-------|
| `--wsc-gold` / `#ffd95a` | Gold | Primary accent: borders, hovers, icons, buttons, dividers |
| `--wsc-purple` / `#4f2683` | True purple | Card borders, gradient fills, feature card backgrounds |
| `--wsc-dark` / `#111111` | Near-black | Page backgrounds |
| `--wsc-light` / `#fafafa` | Off-white | Body text, foreground elements |
| `--wsc-gray` / `#2b2b2b` | Dark gray | Secondary fills, card backgrounds |
| `#1F1F1F` | Dark gray (hardcoded) | Footer bg, sponsors carousel bg |
| `#F9C726` (tailwind `purple`) | Yellow-gold | PageTitle divider, team section divider |
| `#d1d5db` | gray-300 | Secondary text (location, executive titles) |
