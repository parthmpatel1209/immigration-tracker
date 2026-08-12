# Immigration Data Tracker — Page-by-Page UI Improvement Guide

**Site:** https://immigration-tracker.vercel.app/  
**Standard:** Modern · Professional · Clean · Enterprise-grade  
**Reference:** Linear, Vercel, Stripe, GOV.UK, Notion  
**Stack assumed:** Next.js · Tailwind CSS · React

> Every section below is written with enough specificity to hand directly to a developer.  
> Classes shown use Tailwind CSS conventions. Hex colors reference the recommended palette from Part 1.

---

## Table of Contents

- [Global: Nav, Footer, Tokens](#global-nav-footer-tokens)
- [Page 1: Homepage](#page-1-homepage)
- [Page 2: Latest Draw](#page-2-latest-draw)
- [Page 3: CRS Scores](#page-3-crs-scores)
- [Page 4: CRS Calculator](#page-4-crs-calculator)
- [Page 5: News](#page-5-news)
- [Page 6: My Journey](#page-6-my-journey)
- [Page 7: PR Pathways](#page-7-pr-pathways)
- [Page 8: What Is...? (Glossary)](#page-8-what-is-glossary)
- [Page 9: Early Access](#page-9-early-access)
- [Global: Micro-interactions & Motion](#global-micro-interactions--motion)
- [Tailwind Config Reference](#tailwind-config-reference)

---

## Global: Nav, Footer, Tokens

These apply to every page. Fix these first — they create the foundation every page inherits.

---

### Global Navigation

#### Current problems (confirmed from source)

| Element | Current state | Problem |
|---|---|---|
| Desktop nav | "CalculatorPopular" — badge injected inline | Badge text is fused to label, breaks nav rhythm |
| Desktop vs mobile | "Latest Draw" / "Draws", "Calculator" / "Calc" | Different labels for same pages |
| Mobile nav | "Draws CalcPopular News More" | "Calc" is truncated, "Popular" still injected |
| Second mobile row | "CRS Scores · My Journey · More · PR Pathways · What Is...? · Early Access · Switch to Dark Mode" | Overflow items scattered with no grouping |
| New Tool badge | "New Tool CLB Language Converter" lives inside main nav | Promotional content in nav — breaks rhythm |
| Logo | Text-only "Canada Immigration Data Tracker" | Too long, no wordmark, no visual identity |

#### Redesigned nav — specification

```
Desktop (≥1024px):
┌────────────────────────────────────────────────────────────────┐
│ [Logo mark] DrawIQ   Draws  CRS Score  Calculator  News  More▾  [Early Access →] │
└────────────────────────────────────────────────────────────────┘

Mobile (<1024px) — top bar:
┌──────────────────────────────────┐
│ [Logo]  DrawIQ            ☰      │
└──────────────────────────────────┘

Mobile — bottom tab bar (primary navigation):
┌──────────────────────────────────────────┐
│ 🏠 Home  📋 Draws  🧮 Score  📰 News  ••• More │
└──────────────────────────────────────────┘
```

**HTML structure:**

```html
<header class="sticky top-0 z-50 h-[60px] bg-white border-b border-slate-200 
               flex items-center px-6 justify-between">
  
  <!-- Logo -->
  <a href="/" class="flex items-center gap-2 text-[15px] font-semibold 
                     text-slate-900 tracking-tight">
    <span class="w-7 h-7 bg-[#0F2040] rounded-lg flex items-center 
                 justify-center text-white text-xs font-bold">D</span>
    DrawIQ
  </a>

  <!-- Desktop nav -->
  <nav class="hidden lg:flex items-center gap-1" aria-label="Main navigation">
    <a href="/draws"       class="nav-item">Draws</a>
    <a href="/crs-scores"  class="nav-item">CRS Score</a>
    <a href="/calculator"  class="nav-item">Calculator</a>
    <a href="/news"        class="nav-item">News</a>
    <div class="relative">
      <button class="nav-item flex items-center gap-1">
        More <ChevronDown size={14} />
      </button>
      <!-- Dropdown: PR Pathways · CLB Converter · What Is...? · Changelog · About -->
    </div>
  </nav>

  <!-- CTA -->
  <a href="/early-access" 
     class="hidden lg:inline-flex text-[13px] font-medium text-white 
            bg-[#0F2040] px-4 py-2 rounded-lg hover:bg-[#1B3A6B] 
            transition-colors">
    Early Access
  </a>

  <!-- Mobile hamburger -->
  <button class="lg:hidden p-2" aria-label="Open menu">
    <Menu size={20} />
  </button>
</header>
```

**Nav item CSS (Tailwind `nav-item` utility):**

```css
.nav-item {
  @apply text-[14px] text-slate-500 font-normal px-3 py-2 rounded-lg
         hover:text-slate-900 hover:bg-slate-50 transition-colors;
}
.nav-item.active {
  @apply text-slate-900 font-medium;
}
```

**"More" dropdown contents:**

```
PR Pathways
CLB Converter      [New]  ← badge here, not in main nav
What Is...?
Changelog
About / Contact
```

The `[New]` badge on CLB Converter goes inside the dropdown item, not in the main nav. Style it as:

```html
<span class="ml-auto text-[10px] font-semibold bg-blue-50 text-blue-600 
             px-2 py-0.5 rounded-full">New</span>
```

---

### Global Footer

#### Current state (confirmed from source)

```
Privacy Policy • Terms of Use • Accessibility Statement • Contact
[Instagram URL raw text] [Facebook URL raw text]
immigrationdatacanada@gmail.com
© 2026 Canada Immigration Data Tracker. | Made with ❤️ in Canada
⚠️ Disclaimer [long block]
```

**Problems:**
- Raw URLs for social links (not styled as icon buttons)
- Gmail address signals hobby project
- No footer column structure — everything is flat single-line
- Disclaimer is buried at the very bottom in the same visual weight as everything else
- "Made with ❤️ in Canada" is charming but shouldn't be the last brand impression
- No newsletter signup, no product links, no tools list

#### Redesigned footer — specification

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Logo] DrawIQ                                                 │
│  Canada's immigration data platform.                           │
│  Not affiliated with IRCC.                                     │
│                                                                 │
│  Tools              Learn             Connect                  │
│  CRS Calculator     PR Pathways       Twitter/X                │
│  Score Analytics    What Is EE?       Instagram                │
│  CLB Converter      Province Guides   Facebook                 │
│  Historical Data    News & Updates    Contact us               │
│  Draw Tracker       FAQ                                        │
│                                                                 │
│ ───────────────────────────────────────────────────────────── │
│  © 2026 DrawIQ · Privacy · Terms · Accessibility   🇨🇦 Canada  │
│                                                                 │
│  ⚠️ This site is NOT affiliated with IRCC. Data is for         │
│  informational purposes only. Consult an RCIC before making   │
│  any immigration decisions.                                     │
└─────────────────────────────────────────────────────────────────┘
```

**Tailwind implementation:**

```html
<footer class="border-t border-slate-200 bg-white mt-24">
  <div class="max-w-[1200px] mx-auto px-6 py-16">
    
    <!-- Top row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
      
      <!-- Brand col -->
      <div class="col-span-1">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-7 h-7 bg-[#0F2040] rounded-lg flex items-center 
                       justify-content text-white text-xs font-bold">D</span>
          <span class="font-semibold text-slate-900">DrawIQ</span>
        </div>
        <p class="text-[13px] text-slate-500 leading-relaxed mb-4">
          Real-time Canadian immigration data. Not affiliated with IRCC.
        </p>
        <div class="flex gap-3">
          <a href="https://www.instagram.com/immigtrackerca/" 
             aria-label="Instagram" 
             class="w-8 h-8 rounded-lg border border-slate-200 flex items-center 
                    justify-center text-slate-400 hover:text-slate-900 
                    hover:border-slate-400 transition-colors">
            <Instagram size={14} />
          </a>
          <!-- Facebook, Twitter icons same pattern -->
        </div>
      </div>

      <!-- Tools col -->
      <div>
        <h3 class="text-[11px] font-semibold uppercase tracking-widest 
                   text-slate-400 mb-4">Tools</h3>
        <ul class="space-y-2.5">
          <li><a href="/calculator" class="footer-link">CRS Calculator</a></li>
          <li><a href="/crs-scores" class="footer-link">Score Analytics</a></li>
          <li><a href="/clb-converter" class="footer-link">CLB Converter</a></li>
          <li><a href="/draws" class="footer-link">Draw Tracker</a></li>
        </ul>
      </div>

      <!-- Learn col -->
      <div>
        <h3 class="text-[11px] font-semibold uppercase tracking-widest 
                   text-slate-400 mb-4">Learn</h3>
        <ul class="space-y-2.5">
          <li><a href="/pathways" class="footer-link">PR Pathways</a></li>
          <li><a href="/what-is" class="footer-link">What Is Express Entry?</a></li>
          <li><a href="/news" class="footer-link">News & Updates</a></li>
          <li><a href="/faq" class="footer-link">FAQ</a></li>
        </ul>
      </div>

      <!-- Account col -->
      <div>
        <h3 class="text-[11px] font-semibold uppercase tracking-widest 
                   text-slate-400 mb-4">Account</h3>
        <ul class="space-y-2.5">
          <li><a href="/my-journey" class="footer-link">My Journey</a></li>
          <li><a href="/early-access" class="footer-link">Early Access</a></li>
          <li><a href="mailto:hello@drawiq.ca" class="footer-link">Contact</a></li>
        </ul>
      </div>

    </div>

    <!-- Bottom bar -->
    <div class="border-t border-slate-100 pt-6 flex flex-col md:flex-row 
                md:items-center md:justify-between gap-4">
      <div class="flex items-center gap-4 text-[12px] text-slate-400">
        <span>© 2026 DrawIQ</span>
        <a href="/privacy" class="hover:text-slate-600">Privacy</a>
        <a href="/terms" class="hover:text-slate-600">Terms</a>
        <a href="/accessibility" class="hover:text-slate-600">Accessibility</a>
      </div>
      <span class="text-[12px] text-slate-400">Made with ❤️ in Canada 🇨🇦</span>
    </div>

    <!-- Disclaimer — visually separated, smaller -->
    <div class="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
      <p class="text-[12px] text-amber-700 leading-relaxed">
        <strong>⚠️ Disclaimer:</strong> This website is NOT affiliated with, 
        endorsed by, or connected to IRCC or the Government of Canada. All data 
        is for informational purposes only and may not reflect the most current 
        information. Always verify details at 
        <a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" 
           class="underline">IRCC</a> 
        and consult a licensed RCIC before making immigration decisions.
      </p>
    </div>

  </div>
</footer>
```

**Footer link utility:**
```css
.footer-link {
  @apply text-[13px] text-slate-500 hover:text-slate-900 transition-colors;
}
```

---

### Global Design Tokens

Add to your `tailwind.config.js` and/or CSS variables:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        navy:   { DEFAULT: '#0F2040', mid: '#1B3A6B', light: '#EFF6FF' },
        action: { DEFAULT: '#2563EB' },
        canada: { red: '#DC2626' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.04em' }],
        'xs':  ['12px', { lineHeight: '16px' }],
        'sm':  ['13px', { lineHeight: '20px' }],
        'base':['14px', { lineHeight: '22px' }],
        'md':  ['16px', { lineHeight: '26px' }],
        'lg':  ['18px', { lineHeight: '28px' }],
        'xl':  ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '38px' }],
        '4xl': ['36px', { lineHeight: '44px', letterSpacing: '-0.01em' }],
        '5xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        'sm':  '6px',
        'DEFAULT': '8px',
        'md':  '10px',
        'lg':  '12px',
        'xl':  '16px',
        '2xl': '20px',
      },
      boxShadow: {
        // Use borders, not shadows — Linear/Vercel philosophy
        'card': 'none',
      },
    },
  },
}
```

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;
  
  /* Spacing */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-6: 24px;  --space-8: 32px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px;

  /* Skeleton animation */
  --skeleton-bg: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
}

/* Skeleton loader */
.skeleton {
  background: var(--skeleton-bg);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Section label — used everywhere */
.section-label {
  @apply text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 mb-3;
}
```

---

## Page 1: Homepage

**Route:** `/`  
**Primary goal:** Orient new users + direct to Calculator (primary CTA) + build trust

---

### Section 1.1 — Announcement Bar (new)

A slim bar directly above the nav. Shows the most recent draw result. Auto-updates with each draw.

```html
<div class="w-full bg-[#0F2040] text-white text-center py-2.5 px-4 
            text-[13px] flex items-center justify-center gap-2">
  <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
  <span>
    Latest draw: <strong>May 21, 2026</strong> · 
    CRS cutoff <strong>485</strong> · 
    4,300 invited
  </span>
  <a href="/draws" class="ml-2 underline underline-offset-2 opacity-80 
                          hover:opacity-100 text-[12px]">
    View details →
  </a>
  <button aria-label="Dismiss" class="ml-auto opacity-60 hover:opacity-100">×</button>
</div>
```

**Why:** Every user gets the key data point in the first pixel they see. No loading state needed — this can be static-rendered at build time and revalidated every draw.

---

### Section 1.2 — Hero

#### Current (exact source text):

```
# Your Path to CNADA  Starts Here
Navigate your Canadian immigration journey with real-time data, 
accurate CRS calculations, and comprehensive pathway insights that 
empower your decisions every step of the way.

[0 Last Draw]  [0 Invitations]  [Bi-Weekly Frequency]
```

#### Problems:
1. "CNADA" — typo, blocker
2. Stats are "0" — broken appearance
3. No primary CTA button in the hero — the #1 conversion rule violation
4. Subheadline is 28 words of marketing fluff with no specificity
5. "empower your decisions every step of the way" — cliché filler
6. No visual element — just text on a white background

#### Redesigned hero:

```html
<section class="max-w-[1200px] mx-auto px-6 pt-20 pb-16 text-center">
  
  <!-- Eyebrow / live badge -->
  <div class="inline-flex items-center gap-2 bg-blue-50 text-blue-700 
              border border-blue-100 rounded-full px-4 py-1.5 
              text-[12px] font-medium mb-6">
    <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
    Updated every draw · Sourced from IRCC
  </div>

  <!-- Headline -->
  <h1 class="text-[42px] md:text-[52px] font-semibold text-slate-900 
             leading-[1.15] tracking-[-0.02em] mb-5 max-w-[700px] mx-auto">
    Know your CRS odds<br class="hidden md:block"> 
    before the next draw
  </h1>

  <!-- Subheadline — specific, no filler -->
  <p class="text-[17px] text-slate-500 leading-relaxed max-w-[520px] 
            mx-auto mb-8">
    Real-time Express Entry draw results, accurate CRS calculations, 
    and PNP pathway data — all in one place.
  </p>

  <!-- CTA row -->
  <div class="flex items-center justify-center gap-3 flex-wrap mb-12">
    <a href="/calculator" 
       class="inline-flex items-center gap-2 bg-[#0F2040] text-white 
              font-medium px-6 py-3 rounded-lg text-[15px] 
              hover:bg-[#1B3A6B] transition-colors shadow-sm">
      Calculate my CRS score
      <ArrowRight size={16} />
    </a>
    <a href="/draws" 
       class="inline-flex items-center gap-2 border border-slate-200 
              text-slate-700 font-medium px-6 py-3 rounded-lg text-[15px] 
              hover:border-slate-400 hover:bg-slate-50 transition-colors">
      View latest draws
    </a>
  </div>

  <!-- KPI bar — NEVER show 0 -->
  <div class="flex items-center justify-center gap-8 md:gap-16 
              border-t border-slate-100 pt-8">
    {isLoading ? (
      <>
        <KPISkeleton />
        <KPISkeleton />
        <KPISkeleton />
        <KPISkeleton />
      </>
    ) : (
      <>
        <KPI value={latestCRS}    label="Latest CRS cutoff"   mono />
        <KPI value={invitations}  label="Invitations issued"  mono />
        <KPI value="Bi-weekly"    label="Draw frequency"           />
        <KPI value="15,000+"      label="Applicants tracking"      />
      </>
    )}
  </div>

</section>
```

**KPI component:**
```tsx
function KPI({ value, label, mono = false }) {
  return (
    <div className="text-center">
      <div className={`text-[28px] font-semibold text-slate-900 leading-none mb-1
                       ${mono ? 'font-mono' : ''}`}>
        {value}
      </div>
      <div className="text-[12px] text-slate-400 font-medium">{label}</div>
    </div>
  );
}

function KPISkeleton() {
  return (
    <div className="text-center">
      <div className="skeleton h-7 w-16 mx-auto mb-2 rounded" />
      <div className="skeleton h-3 w-24 mx-auto rounded" />
    </div>
  );
}
```

---

### Section 1.3 — Trust Bar

Add immediately below the hero, before any content. This is a single-row strip.

```html
<div class="border-y border-slate-100 bg-slate-50 py-3">
  <div class="max-w-[1200px] mx-auto px-6 flex items-center justify-center 
              gap-6 md:gap-12 flex-wrap">
    {[
      { icon: <Database size={14}/>, text: 'Data from IRCC' },
      { icon: <RefreshCw size={14}/>, text: 'Updated every draw' },
      { icon: <ShieldCheck size={14}/>, text: 'Not affiliated with IRCC' },
      { icon: <Users size={14}/>, text: '15,000+ users' },
    ].map(item => (
      <div className="flex items-center gap-1.5 text-[12px] text-slate-500 
                      font-medium">
        <span className="text-slate-400">{item.icon}</span>
        {item.text}
      </div>
    ))}
  </div>
</div>
```

---

### Section 1.4 — Province Section (replace ticker entirely)

#### Current (confirmed from source):
33 identical `<img src="maple.png" alt="maple" />` elements in a marquee, all with `alt="maple"`.

#### Problems:
- 33 DOM nodes rendering the same image — pointless render weight
- `alt="maple"` for every province — accessibility failure
- Zero data displayed — just names and a leaf icon
- Not tappable or interactive
- Auto-scrolling is an accessibility violation without pause control (WCAG 2.1 SC 2.2.2)

#### Redesigned province grid:

```html
<section class="max-w-[1200px] mx-auto px-6 py-16">
  
  <div class="flex items-end justify-between mb-8">
    <div>
      <div class="section-label">Provincial Programs</div>
      <h2 class="text-[22px] font-semibold text-slate-900">
        Provincial Nominee Programs
      </h2>
    </div>
    <a href="/pathways" class="text-[13px] text-blue-600 hover:text-blue-800 
                               font-medium flex items-center gap-1">
      Compare all provinces <ArrowRight size={14}/>
    </a>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
    {provinces.map(p => (
      <a href={`/pathways/${p.slug}`} key={p.slug}
         class="group flex flex-col p-4 border border-slate-200 rounded-xl 
                bg-white hover:border-slate-400 hover:shadow-sm 
                transition-all duration-150">
        
        <!-- Badge -->
        <div class={`w-9 h-9 rounded-lg flex items-center justify-center 
                     text-[13px] font-bold mb-3 ${p.color}`}
             aria-label={p.name}>
          {p.abbr}
        </div>

        <!-- Name -->
        <div class="text-[14px] font-medium text-slate-900 mb-0.5 
                    group-hover:text-blue-700 transition-colors">
          {p.name}
        </div>

        <!-- Program name -->
        <div class="text-[12px] text-slate-400 mb-2">{p.program}</div>

        <!-- Live data row -->
        <div class="mt-auto pt-3 border-t border-slate-100">
          {p.isLoading ? (
            <div class="skeleton h-3 w-28 rounded" />
          ) : (
            <div class="text-[11px] font-mono text-slate-500">
              {p.lastDrawDate} · 
              <span class={p.isActive ? 'text-green-600' : 'text-amber-600'}>
                {p.isActive ? 'Active' : 'Paused'}
              </span>
            </div>
          )}
        </div>
      </a>
    ))}
  </div>

</section>
```

**Province color map (replace `alt="maple"` with semantic badges):**

```javascript
const provinces = [
  { abbr:'ON', name:'Ontario',              program:'OINP',   slug:'ontario',       color:'bg-blue-100 text-blue-800' },
  { abbr:'BC', name:'British Columbia',     program:'BC PNP', slug:'bc',            color:'bg-teal-100 text-teal-800' },
  { abbr:'AB', name:'Alberta',              program:'AAIP',   slug:'alberta',       color:'bg-orange-100 text-orange-800' },
  { abbr:'SK', name:'Saskatchewan',         program:'SINP',   slug:'saskatchewan',  color:'bg-purple-100 text-purple-800' },
  { abbr:'MB', name:'Manitoba',             program:'MPNP',   slug:'manitoba',      color:'bg-green-100 text-green-800' },
  { abbr:'NS', name:'Nova Scotia',          program:'NSNP',   slug:'nova-scotia',   color:'bg-red-100 text-red-800' },
  { abbr:'NB', name:'New Brunswick',        program:'NBPNP',  slug:'new-brunswick', color:'bg-indigo-100 text-indigo-800' },
  { abbr:'PEI',name:'Prince Edward Island', program:'PEI PNP',slug:'pei',           color:'bg-pink-100 text-pink-800' },
  { abbr:'NL', name:'Newfoundland',         program:'NLPNP',  slug:'nl',            color:'bg-cyan-100 text-cyan-800' },
  { abbr:'YT', name:'Yukon',               program:'YNP',    slug:'yukon',         color:'bg-lime-100 text-lime-800' },
  { abbr:'NT', name:'Northwest Territories',program:'NTNP',   slug:'nt',            color:'bg-slate-100 text-slate-700' },
];
```

---

### Section 1.5 — Feature Cards

#### Current (confirmed from source):
```
Latest Draws        "Real-time updates on Express Entry and PNP draws · Updated 2h ago"
CRS Calculator      "Popular" badge · "Calculate your score accurately in seconds"
Score Analytics     "Historical trends and cutoff predictions"
Pathways & News     "Latest policy changes and immigration routes"
```

#### Problems:
- No icons — visually flat
- No data preview — no number/stat to entice click
- "Popular" badge on Calculator manually placed — doesn't scale
- "Score Analytics" and "Pathways & News" lumped together — separate concerns
- Card links are unclear (does clicking go to the page or just look decorative?)

#### Redesigned feature cards:

```html
<section class="max-w-[1200px] mx-auto px-6 py-16">

  <div class="section-label">What you can do</div>
  <h2 class="text-[22px] font-semibold text-slate-900 mb-8">
    Your complete immigration toolkit
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    
    <!-- Card 1: Latest Draws -->
    <a href="/draws" 
       class="group p-6 border border-slate-200 rounded-xl bg-white 
              hover:border-slate-300 hover:shadow-sm transition-all">
      <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center 
                  justify-center mb-4">
        <BarChart3 size={20} class="text-blue-600" />
      </div>
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-[16px] font-semibold text-slate-900">Latest Draws</h3>
        <span class="text-[11px] font-medium text-green-600 bg-green-50 
                     px-2 py-0.5 rounded-full flex items-center gap-1">
          <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          Updated 2h ago
        </span>
      </div>
      <p class="text-[14px] text-slate-500 mb-4 leading-relaxed">
        Every Express Entry and PNP draw result — with cutoff scores, 
        invitation counts, and draw type history.
      </p>
      <!-- Data preview -->
      <div class="flex gap-4 pt-4 border-t border-slate-100">
        <div>
          <div class="text-[20px] font-semibold font-mono text-slate-900">485</div>
          <div class="text-[11px] text-slate-400">Last CRS cutoff</div>
        </div>
        <div>
          <div class="text-[20px] font-semibold font-mono text-slate-900">4,300</div>
          <div class="text-[11px] text-slate-400">Last invited</div>
        </div>
      </div>
    </a>

    <!-- Card 2: CRS Calculator -->
    <a href="/calculator" 
       class="group p-6 border border-slate-200 rounded-xl bg-white 
              hover:border-slate-300 hover:shadow-sm transition-all">
      <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center 
                  justify-center mb-4">
        <Calculator size={20} class="text-purple-600" />
      </div>
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-[16px] font-semibold text-slate-900">CRS Calculator</h3>
        <span class="text-[11px] font-medium text-purple-600 bg-purple-50 
                     px-2 py-0.5 rounded-full">Most used</span>
      </div>
      <p class="text-[14px] text-slate-500 mb-4 leading-relaxed">
        Get your exact Comprehensive Ranking System score in under 3 minutes. 
        Accounts for all factors including spousal points and provincial nominations.
      </p>
      <div class="flex items-center text-[13px] font-medium text-purple-600 
                  group-hover:gap-2 gap-1 transition-all">
        Calculate my score <ArrowRight size={14}/>
      </div>
    </a>

    <!-- Card 3: Score Analytics -->
    <a href="/crs-scores" 
       class="group p-6 border border-slate-200 rounded-xl bg-white 
              hover:border-slate-300 hover:shadow-sm transition-all">
      <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center 
                  justify-center mb-4">
        <TrendingUp size={20} class="text-green-600" />
      </div>
      <h3 class="text-[16px] font-semibold text-slate-900 mb-2">
        Score Analytics
      </h3>
      <p class="text-[14px] text-slate-500 mb-4 leading-relaxed">
        Historical CRS cutoffs by draw type — see exactly where the floor has 
        been trending and what to expect next.
      </p>
      <div class="flex items-center text-[13px] font-medium text-green-600 
                  group-hover:gap-2 gap-1 transition-all">
        View trends <ArrowRight size={14}/>
      </div>
    </a>

    <!-- Card 4: News & Pathways -->
    <a href="/news" 
       class="group p-6 border border-slate-200 rounded-xl bg-white 
              hover:border-slate-300 hover:shadow-sm transition-all">
      <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center 
                  justify-center mb-4">
        <Bell size={20} class="text-amber-600" />
      </div>
      <h3 class="text-[16px] font-semibold text-slate-900 mb-2">
        News & Alerts
      </h3>
      <p class="text-[14px] text-slate-500 mb-4 leading-relaxed">
        Policy changes, new draw announcements, and program updates — 
        curated and tagged by which immigration program they affect.
      </p>
      <div class="flex items-center text-[13px] font-medium text-amber-600 
                  group-hover:gap-2 gap-1 transition-all">
        Read latest news <ArrowRight size={14}/>
      </div>
    </a>

  </div>
</section>
```

---

### Section 1.6 — Historical Data Table

#### Current (confirmed from source):
A raw `<table>` with 17 rows (2010–2026), 5 columns. No chart. Footer note about 2025–2026 being targets buried below.

#### Problems:
- No chart above the table — the data tells a 16-year story that rows don't convey
- No sticky header
- "Target" / "COVID impact" notes are in a raw "Notes" text column
- No visual differentiation for 2025/2026 target rows
- No sort indicator affordance visible
- Mobile: 5-column table at 375px is unreadable

#### Redesigned table section:

```html
<section class="max-w-[1200px] mx-auto px-6 py-16">

  <div class="flex items-end justify-between mb-6">
    <div>
      <div class="section-label">Historical data · 2010 – 2026</div>
      <h2 class="text-[22px] font-semibold text-slate-900">
        Canadian Immigration at a Glance
      </h2>
      <p class="text-[14px] text-slate-500 mt-1">
        Annual admissions data · Sources: IRCC Annual Reports, Statistics Canada
      </p>
    </div>
    <a href="/data-export.csv" 
       class="flex items-center gap-1.5 text-[13px] text-slate-500 
              hover:text-slate-900 border border-slate-200 px-3 py-1.5 
              rounded-lg hover:border-slate-400 transition-colors">
      <Download size={14}/> Export CSV
    </a>
  </div>

  <!-- Add a chart HERE — see Chart spec below -->
  <AdmissionsChart data={historicalData} />

  <!-- Table -->
  <div class="mt-8 border border-slate-200 rounded-xl overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-[13px]">
        
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            {['Year','Permanent Residents','Study Permits',
              'Work Permits','Citizenship Grants','Notes'].map(col => (
              <th class="text-left px-4 py-3 text-[11px] font-semibold 
                         uppercase tracking-wide text-slate-400 
                         whitespace-nowrap cursor-pointer hover:text-slate-700
                         select-none"
                  onClick={() => sortBy(col)}>
                <div class="flex items-center gap-1">
                  {col}
                  <ChevronsUpDown size={12} class="text-slate-300" />
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {historicalData.map((row, i) => (
            <tr key={row.year}
                class={`border-b border-slate-100 last:border-0
                        hover:bg-slate-50 transition-colors
                        ${row.isTarget ? 'bg-amber-50/50' : 
                          i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
              
              <td class="px-4 py-3.5 font-mono font-medium text-slate-900">
                {row.year}
              </td>
              
              <td class="px-4 py-3.5 font-mono text-right text-slate-700">
                <div class="flex items-center gap-2 justify-end">
                  <!-- Mini bar for visual scale -->
                  <div class="w-16 h-1.5 bg-slate-100 rounded-full 
                              overflow-hidden hidden md:block">
                    <div class="h-full bg-blue-500 rounded-full"
                         style={{width: `${(row.pr / maxPR) * 100}%`}}/>
                  </div>
                  {row.pr?.toLocaleString() ?? '—'}
                </div>
              </td>

              <td class="px-4 py-3.5 font-mono text-right text-slate-600">
                {row.study?.toLocaleString() ?? 
                  <span class="text-slate-300 italic text-[12px]">Pending</span>}
              </td>
              
              <td class="px-4 py-3.5 font-mono text-right text-slate-600">
                {row.work?.toLocaleString() ?? 
                  <span class="text-slate-300 italic text-[12px]">Pending</span>}
              </td>
              
              <td class="px-4 py-3.5 font-mono text-right text-slate-600">
                {row.citizenship?.toLocaleString() ?? 
                  <span class="text-slate-300 italic text-[12px]">Pending</span>}
              </td>

              <td class="px-4 py-3.5">
                {row.note && (
                  <span class={`inline-flex items-center text-[11px] font-medium 
                                px-2 py-0.5 rounded-full
                                ${row.note === 'Target' ? 
                                  'bg-amber-100 text-amber-700' :
                                  row.note === 'COVID impact' ? 
                                  'bg-red-100 text-red-700' : 
                                  'bg-slate-100 text-slate-600'}`}>
                    {row.note}
                  </span>
                )}
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  </div>

  <p class="text-[12px] text-slate-400 mt-3">
    Approximate figures used where exact data unavailable · 
    2025–2026 figures are government targets, not final counts
  </p>
</section>
```

**Admissions chart spec:**
```
Type:        Stacked bar chart (Recharts BarChart)
X-axis:      Year (2010–2026)
Series:      Permanent Residents (navy), Study Permits (blue), 
             Work Permits (teal), Citizenship Grants (slate)
Height:      240px
Tooltip:     Show all 4 values on hover
Grid:        Horizontal lines only, stroke #E2E8F0
Legend:      Below chart, small colored dots + labels
Target years: Dashed bar outline for 2025/2026
```

---

### Section 1.7 — Waitlist CTA

#### Current (confirmed from source):
```
Stay Ahead of the Curve
Join the waitlist for premium features including real-time alerts 
and personalized immigration roadmaps.

[Join the Waitlist button]
```

#### Problems:
- "Stay Ahead of the Curve" is a generic cliché used by thousands of SaaS sites
- No user count (social proof)
- No specific benefits listed
- No trust micro-copy ("No spam")
- Single input + button with no value articulation

#### Redesigned CTA section:

```html
<section class="max-w-[1200px] mx-auto px-6 py-16">
  <div class="bg-[#0F2040] rounded-2xl px-8 md:px-16 py-14 text-center">
    
    <!-- User count badge -->
    <div class="inline-flex items-center gap-2 bg-white/10 text-white/80 
                rounded-full px-4 py-1.5 text-[12px] font-medium mb-6">
      <Users size={14}/> Join 15,000+ applicants tracking their journey
    </div>

    <h2 class="text-[28px] md:text-[34px] font-semibold text-white 
               leading-tight mb-4 max-w-[480px] mx-auto">
      Get alerted the moment a draw is announced
    </h2>
    
    <p class="text-[15px] text-white/60 mb-8 max-w-[400px] mx-auto">
      Early access members get real-time draw alerts, a personalized 
      CRS roadmap, and province eligibility matching.
    </p>

    <!-- Benefits row -->
    <div class="flex items-center justify-center gap-6 md:gap-10 
                flex-wrap mb-10">
      {[
        'Real-time draw alerts',
        'Personalized CRS roadmap', 
        'Province eligibility match',
      ].map(b => (
        <div class="flex items-center gap-2 text-[13px] text-white/70">
          <CheckCircle size={15} class="text-green-400 flex-shrink-0"/>
          {b}
        </div>
      ))}
    </div>

    <!-- Email input -->
    <div class="flex flex-col sm:flex-row gap-3 max-w-[440px] mx-auto">
      <input 
        type="email" 
        placeholder="your@email.com"
        class="flex-1 px-4 py-3 rounded-lg bg-white text-slate-900 
               text-[14px] placeholder-slate-400 outline-none 
               focus:ring-2 focus:ring-blue-500"
      />
      <button class="px-5 py-3 bg-white text-[#0F2040] font-semibold 
                     rounded-lg text-[14px] hover:bg-slate-100 
                     transition-colors whitespace-nowrap">
        Get early access
      </button>
    </div>

    <!-- Trust micro-copy -->
    <p class="text-[12px] text-white/40 mt-4">
      No spam. No credit card required. Unsubscribe anytime.
    </p>

  </div>
</section>
```

---

## Page 2: Latest Draw

**Route:** `/draws`  
**Primary goal:** Show the most recent draw prominently, then history with filters

---

### Layout specification

```
┌────────────────────────────────────────────────────────┐
│  Page header                                           │
│  "Express Entry & PNP Draw Results"                    │
│  Subtitle + last updated timestamp                     │
├────────────────────────────────────────────────────────┤
│  LATEST DRAW CARD — large, prominent                  │
│  Draw #283 · May 21, 2026 · All Programs               │
│  CRS Cutoff: 485  |  Invited: 4,300  |  Tie-break: —  │
│  [Compare to previous draw] [View IRCC source →]       │
├────────────────────────────────────────────────────────┤
│  Filter bar                                            │
│  [All] [Express Entry] [PNP] | [2026▾] | [Search...]  │
├────────────────────────────────────────────────────────┤
│  Draws list / table                                    │
│  Each row: Draw# · Date · Type · CRS · Invited         │
│  Hover: expand to show draw breakdown                  │
└────────────────────────────────────────────────────────┘
```

### Latest Draw Card

```html
<div class="max-w-[1200px] mx-auto px-6 pt-12 pb-6">

  <!-- Page header -->
  <div class="mb-8">
    <div class="section-label">Express Entry & PNP</div>
    <h1 class="text-[32px] font-semibold text-slate-900 tracking-tight">
      Draw Results
    </h1>
    <p class="text-[14px] text-slate-400 mt-1 flex items-center gap-2">
      <RefreshCw size={13}/> Last updated May 21, 2026 · 
      <a href="https://www.canada.ca/en/immigration..." 
         class="text-blue-500 hover:underline">Source: IRCC</a>
    </p>
  </div>

  <!-- Latest draw card -->
  <div class="border border-blue-200 bg-blue-50/40 rounded-2xl p-6 md:p-8 mb-8">
    <div class="flex items-center gap-3 mb-5">
      <span class="text-[11px] font-semibold uppercase tracking-widest 
                   text-blue-500 bg-blue-100 px-3 py-1 rounded-full">
        Latest Draw
      </span>
      <span class="text-[13px] text-slate-500 font-mono">Draw #283</span>
    </div>

    <div class="flex flex-col md:flex-row md:items-center 
                md:justify-between gap-6">
      <div>
        <div class="text-[13px] text-slate-500 mb-1">May 21, 2026 · All Programs</div>
        <div class="text-[52px] font-bold font-mono text-slate-900 leading-none">
          485
        </div>
        <div class="text-[14px] text-slate-500 mt-1">CRS cutoff score</div>
      </div>

      <div class="flex gap-8 md:gap-12">
        <div>
          <div class="text-[28px] font-semibold font-mono text-slate-900">4,300</div>
          <div class="text-[13px] text-slate-500">Invitations issued</div>
        </div>
        <div>
          <div class="text-[28px] font-semibold font-mono text-slate-900">
            <span class="text-[16px] text-slate-400">vs prev</span> +5
          </div>
          <div class="text-[13px] text-red-500">CRS increased ↑</div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <a href="/draws/compare/283-282" 
           class="px-4 py-2 border border-slate-200 text-[13px] font-medium 
                  text-slate-700 rounded-lg hover:bg-white transition-colors">
          Compare to previous draw
        </a>
        <a href="https://www.canada.ca/..." target="_blank" rel="noopener"
           class="px-4 py-2 text-center text-[13px] text-blue-600 hover:underline 
                  flex items-center justify-center gap-1">
          IRCC source <ExternalLink size={12}/>
        </a>
      </div>
    </div>
  </div>

</div>
```

### Filter Bar

```html
<div class="sticky top-[60px] bg-white border-b border-slate-200 z-30 py-3 px-6">
  <div class="max-w-[1200px] mx-auto flex items-center gap-3 flex-wrap">
    
    <!-- Type filters -->
    <div class="flex gap-1 bg-slate-100 p-1 rounded-lg">
      {['All','Express Entry','PNP','French','STEM'].map(f => (
        <button class={`px-3 py-1.5 rounded-md text-[13px] font-medium 
                        transition-colors ${active === f ? 
                          'bg-white text-slate-900 shadow-sm' : 
                          'text-slate-500 hover:text-slate-900'}`}>
          {f}
        </button>
      ))}
    </div>

    <!-- Year -->
    <select class="text-[13px] border border-slate-200 rounded-lg px-3 py-2 
                   text-slate-700 bg-white hover:border-slate-400 
                   transition-colors outline-none">
      <option>2026</option>
      <option>2025</option>
      <option>2024</option>
      <option>2023</option>
      <option>All years</option>
    </select>

    <!-- Search -->
    <div class="ml-auto relative">
      <Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 
                                text-slate-400" />
      <input type="search" placeholder="Search draws..."
             class="pl-8 pr-4 py-2 text-[13px] border border-slate-200 
                    rounded-lg bg-white focus:outline-none 
                    focus:ring-2 focus:ring-blue-500 w-[200px]"/>
    </div>

  </div>
</div>
```

### Draws Table

```html
<table class="w-full text-[13px]">
  <thead>
    <tr class="bg-slate-50 border-b border-slate-200">
      <th class="th-cell">Draw #</th>
      <th class="th-cell">Date</th>
      <th class="th-cell">Type</th>
      <th class="th-cell text-right">CRS Cutoff</th>
      <th class="th-cell text-right">Invited</th>
      <th class="th-cell text-right">vs Prev</th>
      <th class="th-cell"></th>
    </tr>
  </thead>
  <tbody>
    {draws.map(draw => (
      <tr class="border-b border-slate-100 hover:bg-slate-50 
                 transition-colors group cursor-pointer"
          onClick={() => expandDraw(draw.id)}>
        
        <td class="td-cell font-mono text-slate-400">#{draw.number}</td>
        <td class="td-cell text-slate-700">{formatDate(draw.date)}</td>
        
        <td class="td-cell">
          <span class={`draw-type-badge draw-type-${draw.type}`}>
            {draw.type}
          </span>
        </td>
        
        <td class="td-cell text-right font-mono font-semibold text-slate-900">
          {draw.crs}
        </td>
        
        <td class="td-cell text-right font-mono text-slate-700">
          {draw.invited.toLocaleString()}
        </td>
        
        <td class="td-cell text-right">
          <span class={draw.delta > 0 ? 'text-red-500' : 
                       draw.delta < 0 ? 'text-green-500' : 
                       'text-slate-400'}>
            {draw.delta > 0 ? '+' : ''}{draw.delta}
          </span>
        </td>

        <td class="td-cell">
          <ChevronDown size={14} 
            class="text-slate-300 group-hover:text-slate-600 transition-colors" />
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

**Draw type badge colors:**
```css
.draw-type-badge {
  @apply inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full;
}
.draw-type-All-Programs    { @apply bg-blue-100 text-blue-700; }
.draw-type-STEM            { @apply bg-purple-100 text-purple-700; }
.draw-type-French          { @apply bg-amber-100 text-amber-700; }
.draw-type-Healthcare      { @apply bg-green-100 text-green-700; }
.draw-type-Trade-Occupations { @apply bg-orange-100 text-orange-700; }
.draw-type-PNP             { @apply bg-slate-100 text-slate-700; }
```

---

## Page 3: CRS Scores

**Route:** `/crs-scores`  
**Primary goal:** Show CRS score history and trends visually — this is the analytics page

### Layout specification

```
┌────────────────────────────────────────────────────────┐
│  Page header + description                             │
├────────────────────────────────────────────────────────┤
│  KPI strip: Average CRS · Highest · Lowest · Last      │
├────────────────────────────────────────────────────────┤
│  Filter: [All] [EE General] [STEM] [French] [PNP]      │
│          [6 months] [12 months] [2 years] [All time]   │
├────────────────────────────────────────────────────────┤
│  LINE CHART — CRS cutoff over time (main visual)       │
│  Height: 320px · Multi-series · Hover tooltip          │
├────────────────────────────────────────────────────────┤
│  Score distribution chart (smaller, supplementary)     │
├────────────────────────────────────────────────────────┤
│  Where does your score land?                           │
│  Score input → show percentile vs recent draws         │
└────────────────────────────────────────────────────────┘
```

### KPI Strip

```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  {[
    { label: 'Current cutoff',   value: '485',  sub: 'May 21, 2026',   color: 'text-slate-900' },
    { label: 'Average (12 mo)',  value: '498',  sub: 'Across 24 draws',color: 'text-blue-600'  },
    { label: '12-month high',    value: '549',  sub: 'Jan 2025',       color: 'text-red-500'   },
    { label: '12-month low',     value: '462',  sub: 'Sep 2024',       color: 'text-green-600' },
  ].map(k => (
    <div class="p-5 border border-slate-200 rounded-xl bg-white">
      <div class="section-label">{k.label}</div>
      <div class={`text-[32px] font-semibold font-mono leading-none ${k.color}`}>
        {k.value}
      </div>
      <div class="text-[12px] text-slate-400 mt-1">{k.sub}</div>
    </div>
  ))}
</div>
```

### Interactive "Where does my score land?" widget

This is a new feature. Highest engagement potential on this page.

```html
<div class="border border-slate-200 rounded-xl p-6 bg-white">
  <h3 class="text-[16px] font-semibold text-slate-900 mb-1">
    Where does your score land?
  </h3>
  <p class="text-[13px] text-slate-500 mb-5">
    Enter your CRS score to see how you compare to recent draw cutoffs.
  </p>

  <div class="flex gap-3 mb-6">
    <input 
      type="number" 
      placeholder="e.g. 472"
      min="0" max="1200"
      class="w-32 px-4 py-2.5 border border-slate-200 rounded-lg 
             font-mono text-[16px] text-slate-900 focus:ring-2 
             focus:ring-blue-500 outline-none"
    />
    <button class="px-4 py-2.5 bg-[#0F2040] text-white rounded-lg 
                   text-[13px] font-medium">
      Check my score
    </button>
  </div>

  <!-- Result — shown after input -->
  <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
    <p class="text-[14px] text-amber-800">
      A score of <strong>472</strong> would not have qualified in any of the 
      last 5 draws (min cutoff: 485). You need <strong>13 more points</strong>.
    </p>
    <a href="/calculator" class="text-[13px] font-medium text-blue-600 
                                  hover:underline mt-2 inline-block">
      Find out how to improve your score →
    </a>
  </div>
</div>
```

---

## Page 4: CRS Calculator

**Route:** `/calculator`  
**Primary goal:** Accurate score calculation + immediate actionable result

This is the highest-value page on the site. Every design decision should serve one goal: get the user their score, then show them what to do with it.

### Layout: Multi-step form

Never put a 30-field form on a single page. Break it into logical steps.

```
Step 1: Core profile        [Age, Education, Language, Work Experience]
Step 2: Spouse / partner    [if applicable]
Step 3: Canadian factors    [Job offer, Provincial nomination, Canadian education]
Step 4: Your score          [Breakdown + comparison + next steps]
```

### Step progress indicator

```html
<div class="max-w-[680px] mx-auto px-6 pt-10 pb-6">
  
  <div class="flex items-center gap-2 mb-8">
    {steps.map((step, i) => (
      <>
        <div class={`flex items-center gap-2 ${i <= currentStep ? 
                     'text-slate-900' : 'text-slate-400'}`}>
          <div class={`w-7 h-7 rounded-full flex items-center justify-center 
                        text-[12px] font-semibold border
                        ${i < currentStep  ? 'bg-[#0F2040] border-[#0F2040] text-white' : 
                          i === currentStep ? 'border-[#0F2040] text-[#0F2040]' : 
                          'border-slate-200 text-slate-400'}`}>
            {i < currentStep ? <Check size={14}/> : i + 1}
          </div>
          <span class="text-[13px] font-medium hidden md:block">{step.label}</span>
        </div>
        {i < steps.length - 1 && (
          <div class={`flex-1 h-px ${i < currentStep ? 
                       'bg-[#0F2040]' : 'bg-slate-200'}`}/>
        )}
      </>
    ))}
  </div>
```

### Form field specification

Every field needs: visible label, helper text, validation, and proper input type.

```html
<!-- Age field — example -->
<div class="mb-6">
  <label class="block text-[14px] font-medium text-slate-900 mb-1.5">
    Your age
  </label>
  <p class="text-[12px] text-slate-500 mb-2">
    Age is scored as of the date your profile is submitted to the pool.
  </p>
  <div class="relative">
    <input type="number" min="17" max="99" 
           placeholder="e.g. 32"
           class="w-full px-4 py-3 border border-slate-200 rounded-lg 
                  text-[15px] font-mono text-slate-900 bg-white 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-transparent w-[180px]
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none"/>
    <span class="absolute right-4 top-1/2 -translate-y-1/2 
                 text-[13px] text-slate-400">years</span>
  </div>
  <!-- Inline validation -->
  {age < 17 && (
    <p class="text-[12px] text-red-500 mt-1.5 flex items-center gap-1">
      <AlertCircle size={12}/> Must be 17 or older to submit an EE profile
    </p>
  )}
</div>

<!-- Language test — select with conditional sub-fields -->
<div class="mb-6">
  <label class="block text-[14px] font-medium text-slate-900 mb-1.5">
    English / French language test
  </label>
  <select class="w-full px-4 py-3 border border-slate-200 rounded-lg 
                 text-[14px] text-slate-900 bg-white focus:ring-2 
                 focus:ring-blue-500 outline-none mb-3">
    <option value="">Select your test type</option>
    <option value="IELTS">IELTS General Training</option>
    <option value="CELPIP">CELPIP General</option>
    <option value="TEF">TEF Canada (French)</option>
    <option value="TCF">TCF Canada (French)</option>
  </select>
  
  <!-- Sub-fields appear after test selection -->
  {selectedTest && (
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      {['Listening','Reading','Writing','Speaking'].map(skill => (
        <div>
          <label class="text-[12px] font-medium text-slate-600 mb-1 block">
            {skill}
          </label>
          <input type="number" step="0.5" min="0" max="9"
                 placeholder="—"
                 class="w-full px-3 py-2.5 border border-slate-200 
                        rounded-lg text-[14px] font-mono text-center 
                        focus:ring-2 focus:ring-blue-500 outline-none"/>
        </div>
      ))}
    </div>
  )}
</div>
```

### Score result page (Step 4)

This is the money screen. Most sites terminate here. Don't.

```html
<div class="max-w-[680px] mx-auto px-6">

  <!-- Score display -->
  <div class="text-center mb-10">
    <div class="section-label mb-2">Your CRS Score</div>
    <div class="text-[80px] font-bold font-mono text-slate-900 leading-none mb-2">
      {score}
    </div>
    <div class="text-[14px] text-slate-500">
      out of 1,200 possible points
    </div>
  </div>

  <!-- Score vs draws comparison — NEW, high value -->
  <div class="border border-slate-200 rounded-xl overflow-hidden mb-6">
    <div class="px-5 py-4 border-b border-slate-100 bg-slate-50">
      <h3 class="text-[14px] font-semibold text-slate-900">
        How you compare to recent draws
      </h3>
    </div>
    <div class="divide-y divide-slate-100">
      {recentDraws.slice(0, 5).map(draw => (
        <div class="flex items-center justify-between px-5 py-3.5">
          <div>
            <div class="text-[13px] font-medium text-slate-900">
              Draw #{draw.number} · {draw.type}
            </div>
            <div class="text-[12px] text-slate-400">{draw.date}</div>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-[15px] font-mono font-semibold text-slate-900">
              Cutoff: {draw.crs}
            </div>
            <span class={`text-[12px] font-medium px-2.5 py-0.5 rounded-full
                          ${score >= draw.crs ? 
                            'bg-green-100 text-green-700' : 
                            'bg-red-100 text-red-700'}`}>
              {score >= draw.crs ? '✓ Would qualify' : `Need +${draw.crs - score}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>

  <!-- Score breakdown accordion -->
  <div class="border border-slate-200 rounded-xl overflow-hidden mb-6">
    <div class="px-5 py-4 border-b border-slate-100 bg-slate-50">
      <h3 class="text-[14px] font-semibold text-slate-900">Score breakdown</h3>
    </div>
    {scoreCategories.map(cat => (
      <div class="flex items-center justify-between px-5 py-3.5 
                  border-b border-slate-100 last:border-0">
        <div class="text-[13px] text-slate-700">{cat.label}</div>
        <div class="flex items-center gap-3">
          <div class="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 rounded-full"
                 style={{width: `${(cat.score / cat.max) * 100}%`}}/>
          </div>
          <div class="text-[13px] font-mono font-medium text-slate-900 
                      w-12 text-right">
            {cat.score}/{cat.max}
          </div>
        </div>
      </div>
    ))}
  </div>

  <!-- How to improve — NEW, highest engagement feature -->
  <div class="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
    <h3 class="text-[15px] font-semibold text-blue-900 mb-3">
      How to improve your score
    </h3>
    <div class="space-y-3">
      {improvements.map(imp => (
        <div class="flex items-start gap-3">
          <div class="w-6 h-6 bg-blue-100 text-blue-700 rounded-full 
                      flex items-center justify-center text-[11px] 
                      font-bold flex-shrink-0 mt-0.5">
            +{imp.points}
          </div>
          <div>
            <div class="text-[13px] font-medium text-blue-900">{imp.action}</div>
            <div class="text-[12px] text-blue-700/70">{imp.detail}</div>
          </div>
        </div>
      ))}
    </div>
  </div>

  <!-- Province eligibility quick check -->
  <div class="border border-slate-200 rounded-xl p-5 mb-6">
    <h3 class="text-[14px] font-semibold text-slate-900 mb-3">
      Province eligibility at your score
    </h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
      {provinceEligibility.map(p => (
        <div class={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px]
                     ${p.eligible ? 'bg-green-50 text-green-800' : 
                       'bg-slate-50 text-slate-500'}`}>
          <span class="font-semibold">{p.abbr}</span>
          <span>{p.eligible ? 'May qualify' : 'Check criteria'}</span>
        </div>
      ))}
    </div>
  </div>

  <!-- CTAs -->
  <div class="flex gap-3">
    <a href="/early-access" class="flex-1 text-center px-5 py-3 bg-[#0F2040] 
                                    text-white font-medium rounded-lg text-[14px]">
      Get draw alerts for my score
    </a>
    <button onClick={shareResult}
            class="px-5 py-3 border border-slate-200 text-slate-700 
                   font-medium rounded-lg text-[14px] flex items-center gap-2">
      <Share2 size={15}/> Share
    </button>
  </div>

</div>
```

---

## Page 5: News

**Route:** `/news`  
**Primary goal:** Be the most useful immigration news source for Canadian applicants

### Layout specification

```
┌────────────────────────────────────────────────────────┐
│  Page header                                           │
├────────────────────────────────────────────────────────┤
│  Filter tags: [All] [Express Entry] [PNP] [Study]      │
│               [Work Permit] [Policy] [PR Pathways]     │
├────────────────────────────────────────────────────────┤
│  Featured article (large card, top story)              │
├─────────────────────────┬──────────────────────────────┤
│  Article list (main)    │  Sidebar                    │
│                         │  Latest draw                │
│                         │  CRS Calculator →           │
│                         │  Newsletter signup          │
└─────────────────────────┴──────────────────────────────┘
```

### Article Card

```html
<article class="group border border-slate-200 rounded-xl bg-white 
                overflow-hidden hover:border-slate-300 hover:shadow-sm 
                transition-all">
  
  <div class="p-5">
    <!-- Tags -->
    <div class="flex gap-2 mb-3">
      <span class="text-[11px] font-medium bg-blue-50 text-blue-600 
                   px-2.5 py-0.5 rounded-full">Express Entry</span>
      <span class="text-[11px] font-medium bg-amber-50 text-amber-600 
                   px-2.5 py-0.5 rounded-full">Policy Change</span>
    </div>

    <!-- Title -->
    <h2 class="text-[16px] font-semibold text-slate-900 leading-snug 
               mb-2 group-hover:text-blue-700 transition-colors">
      <a href={`/news/${article.slug}`}>{article.title}</a>
    </h2>

    <!-- Excerpt -->
    <p class="text-[13px] text-slate-500 leading-relaxed mb-4 
              line-clamp-2">
      {article.excerpt}
    </p>

    <!-- "What this means for you" — NEW, highest-value addition -->
    <div class="bg-blue-50 rounded-lg px-3.5 py-3 mb-4">
      <div class="text-[11px] font-semibold uppercase tracking-wider 
                  text-blue-500 mb-1.5">What this means for you</div>
      <ul class="space-y-1">
        {article.implications.map(point => (
          <li class="text-[12px] text-blue-800 flex items-start gap-1.5">
            <span class="text-blue-400 mt-0.5 flex-shrink-0">→</span>
            {point}
          </li>
        ))}
      </ul>
    </div>

    <!-- Footer row -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-slate-200 rounded-full"></div>
        <span class="text-[12px] text-slate-500">
          {article.author} · {formatDate(article.date)}
        </span>
      </div>
      <a href={`/news/${article.slug}`}
         class="text-[13px] font-medium text-blue-600 hover:text-blue-800 
                flex items-center gap-1">
        Read more <ArrowRight size={13}/>
      </a>
    </div>
  </div>
</article>
```

### Article Detail Page — "What this means for you" block

At the top of every article, before the body:

```html
<div class="border border-blue-100 bg-blue-50/50 rounded-xl px-5 py-4 mb-8">
  <div class="text-[11px] font-semibold uppercase tracking-widest 
              text-blue-400 mb-2">What this means for your application</div>
  <ul class="space-y-2">
    {implications.map(p => (
      <li class="flex items-start gap-2 text-[14px] text-blue-900">
        <CheckCircle size={15} class="text-blue-500 flex-shrink-0 mt-0.5"/>
        {p}
      </li>
    ))}
  </ul>
  <div class="flex items-center gap-1.5 mt-3 pt-3 border-t border-blue-100">
    <span class="text-[12px] text-blue-400">Affects:</span>
    <span class="text-[12px] font-medium bg-blue-100 text-blue-700 
                 px-2 py-0.5 rounded-full">Express Entry</span>
    <span class="text-[12px] font-medium bg-blue-100 text-blue-700 
                 px-2 py-0.5 rounded-full">Ontario PNP</span>
  </div>
</div>
```

---

## Page 6: My Journey

**Route:** `/my-journey`  
**Primary goal:** Personalized immigration dashboard (gated by email/account)

This page currently exists in nav but likely shows a bare/placeholder state. Design it for two states: unauthenticated and authenticated.

### Unauthenticated state

```html
<div class="max-w-[560px] mx-auto px-6 py-20 text-center">
  <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center 
              justify-center mx-auto mb-5">
    <Map size={24} class="text-slate-400"/>
  </div>
  <h1 class="text-[24px] font-semibold text-slate-900 mb-3">
    Your immigration journey, tracked
  </h1>
  <p class="text-[15px] text-slate-500 leading-relaxed mb-8 max-w-[400px] mx-auto">
    Save your CRS score, track draw cutoffs relative to your profile, 
    and get personalized alerts when you're likely to receive an ITA.
  </p>
  <div class="flex flex-col sm:flex-row gap-3 justify-center">
    <a href="/early-access" 
       class="px-6 py-3 bg-[#0F2040] text-white rounded-lg font-medium text-[14px]">
      Get early access
    </a>
    <a href="/calculator"
       class="px-6 py-3 border border-slate-200 text-slate-700 
              rounded-lg font-medium text-[14px]">
      Calculate my score first
    </a>
  </div>
  <!-- Feature preview -->
  <div class="mt-12 grid grid-cols-3 gap-3 text-left">
    {[
      { icon: <Bell/>, title: 'Draw alerts', desc: 'Notified every draw' },
      { icon: <TrendingUp/>, title: 'CRS roadmap', desc: 'Exact path to ITA' },
      { icon: <MapPin/>, title: 'Province match', desc: 'Best PNP for you' },
    ].map(f => (
      <div class="p-4 border border-slate-200 rounded-xl bg-white">
        <div class="text-slate-400 mb-2">{f.icon}</div>
        <div class="text-[13px] font-semibold text-slate-900 mb-0.5">{f.title}</div>
        <div class="text-[12px] text-slate-500">{f.desc}</div>
      </div>
    ))}
  </div>
</div>
```

### Authenticated state — dashboard layout

```
┌─────────────────────────────────────────────────────────┐
│  "Good morning, [Name]. Next draw expected in ~7 days." │
├───────────────────────┬─────────────────────────────────┤
│  MY CRS SCORE         │  NEXT STEPS                     │
│  472                  │  +13 to qualify in last draw    │
│  Last updated today   │  → Improve language test        │
│                       │  → Check AB AAIP eligibility    │
├───────────────────────┴─────────────────────────────────┤
│  Score history chart (last 6 months of manual updates)  │
├─────────────────────────────────────────────────────────┤
│  Recent draws vs my score                               │
│  Draw #283 — Cutoff 485 — I needed 13 more              │
│  Draw #282 — Cutoff 480 — I needed 8 more               │
└─────────────────────────────────────────────────────────┘
```

---

## Page 7: PR Pathways

**Route:** `/pathways`  
**Primary goal:** Help users identify which immigration pathway fits them

### Layout specification

```
┌────────────────────────────────────────────────────────┐
│  Page header + "Find your pathway" quick filter        │
├────────────────────────────────────────────────────────┤
│  Pathway finder (questionnaire — 3 questions)          │
│  → Recommend top 2–3 pathways based on answers         │
├────────────────────────────────────────────────────────┤
│  All pathways — card grid                              │
│  Express Entry · PNP by province · Quebec · Atlantic   │
└────────────────────────────────────────────────────────┘
```

### Pathway card

```html
<div class="border border-slate-200 rounded-xl p-5 bg-white 
            hover:border-slate-300 hover:shadow-sm transition-all">
  
  <div class="flex items-start justify-between mb-3">
    <div>
      <h3 class="text-[15px] font-semibold text-slate-900">
        Federal Skilled Worker
      </h3>
      <div class="text-[12px] text-slate-400 mt-0.5">Express Entry · FSW</div>
    </div>
    <span class="text-[11px] font-medium bg-green-50 text-green-700 
                 px-2.5 py-0.5 rounded-full">Open</span>
  </div>

  <!-- Eligibility summary -->
  <div class="space-y-2 mb-4">
    {[
      { label: 'Min. work experience', value: '1 year skilled' },
      { label: 'Language requirement', value: 'CLB 7 minimum' },
      { label: 'Education',            value: 'Secondary or post-secondary' },
    ].map(row => (
      <div class="flex items-center justify-between text-[12px]">
        <span class="text-slate-500">{row.label}</span>
        <span class="text-slate-900 font-medium">{row.value}</span>
      </div>
    ))}
  </div>

  <div class="flex gap-2">
    <a href={`/pathways/fsw`} 
       class="flex-1 text-center py-2 border border-slate-200 rounded-lg 
              text-[13px] font-medium text-slate-700 hover:bg-slate-50">
      Learn more
    </a>
    <a href="/calculator" 
       class="flex-1 text-center py-2 bg-[#0F2040] text-white rounded-lg 
              text-[13px] font-medium hover:bg-[#1B3A6B]">
      Check eligibility
    </a>
  </div>
</div>
```

---

## Page 8: What Is...? (Glossary)

**Route:** `/what-is`  
**Primary goal:** SEO landing page + educational resource for new users

### Layout specification

Each term gets its own section, linkable by anchor. Structure:

```html
<section class="max-w-[800px] mx-auto px-6 py-16">

  <!-- Sticky sidebar TOC on desktop -->
  <div class="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">
    
    <!-- TOC -->
    <aside class="hidden lg:block">
      <nav class="sticky top-20">
        <div class="section-label mb-3">On this page</div>
        <ul class="space-y-1">
          {terms.map(t => (
            <li>
              <a href={`#${t.slug}`} 
                 class="text-[13px] text-slate-500 hover:text-slate-900 
                        py-1 block transition-colors">
                {t.term}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>

    <!-- Content -->
    <div class="space-y-12">
      {terms.map(t => (
        <div id={t.slug} class="scroll-mt-20">
          <h2 class="text-[22px] font-semibold text-slate-900 mb-2">
            {t.term}
          </h2>
          <p class="text-[14px] text-slate-400 font-mono mb-4">
            Abbreviation: {t.abbr}
          </p>
          <div class="prose prose-slate prose-sm max-w-none">
            {t.content}
          </div>
          <!-- Related tools -->
          <div class="mt-4 p-4 bg-slate-50 rounded-xl">
            <div class="text-[11px] font-semibold uppercase tracking-wider 
                        text-slate-400 mb-2">Related tools</div>
            <div class="flex gap-2">
              {t.relatedTools.map(tool => (
                <a href={tool.href}
                   class="text-[13px] font-medium text-blue-600 
                          hover:text-blue-800">
                  {tool.label} →
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>
```

---

## Page 9: Early Access

**Route:** `/early-access`  
**Primary goal:** Highest-converting page — capture email, set expectations, build excitement

### Layout specification

This page should feel premium. It's the product pitch page.

```html
<div class="min-h-screen bg-[#0A1628]">
  
  <!-- Hero -->
  <div class="max-w-[680px] mx-auto px-6 pt-24 pb-16 text-center">
    
    <div class="inline-flex items-center gap-2 border border-white/10 
                rounded-full px-4 py-1.5 text-[12px] text-white/60 mb-8">
      <span class="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
      Accepting early access applications
    </div>

    <h1 class="text-[44px] md:text-[56px] font-semibold text-white 
               leading-[1.1] tracking-[-0.02em] mb-5">
      Immigration intelligence.<br>
      <span class="text-blue-400">Built for serious applicants.</span>
    </h1>

    <p class="text-[17px] text-white/50 leading-relaxed max-w-[480px] mx-auto mb-10">
      Real-time draw alerts, a personalized CRS roadmap, and province 
      eligibility matching — everything you need to plan your PR journey 
      with confidence.
    </p>

    <!-- Form -->
    <div class="flex gap-3 max-w-[440px] mx-auto mb-4">
      <input type="email" placeholder="your@email.com"
             class="flex-1 px-4 py-3.5 rounded-xl bg-white/10 border 
                    border-white/20 text-white placeholder-white/30 
                    text-[14px] outline-none focus:border-blue-400 
                    focus:ring-2 focus:ring-blue-500/30"/>
      <button class="px-6 py-3.5 bg-white text-[#0A1628] font-semibold 
                     rounded-xl text-[14px] hover:bg-blue-50 whitespace-nowrap">
        Request access
      </button>
    </div>
    
    <p class="text-[12px] text-white/30">
      Join 15,000+ applicants · No spam · Free to start
    </p>

  </div>

  <!-- Feature cards -->
  <div class="max-w-[1000px] mx-auto px-6 pb-24 
              grid grid-cols-1 md:grid-cols-3 gap-4">
    {features.map(f => (
      <div class="border border-white/10 rounded-2xl p-6 bg-white/5">
        <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center 
                    justify-center mb-4">
          {f.icon}
        </div>
        <h3 class="text-[15px] font-semibold text-white mb-2">{f.title}</h3>
        <p class="text-[13px] text-white/50 leading-relaxed">{f.desc}</p>
      </div>
    ))}
  </div>
</div>
```

---

## Global: Micro-interactions & Motion

Use `prefers-reduced-motion` for all animations. Every animation must serve a purpose.

```css
/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Interaction inventory

| Element | Interaction | Duration | Easing |
|---|---|---|---|
| Nav items | Color transition on hover | 150ms | ease |
| Cards | `border-color` + `shadow` on hover | 150ms | ease |
| CTA buttons | `background-color` on hover | 150ms | ease |
| Score reveal (calculator) | Count-up animation | 800ms | ease-out |
| Skeleton loaders | Shimmer pulse | 1500ms | ease-in-out infinite |
| Page transitions | Fade in (0→1 opacity) | 200ms | ease |
| Draw type badges | None — static is fine | — | — |
| Sort change (table) | Row reorder | 250ms | ease |
| Province cards | `border-color` on hover | 150ms | ease |
| Announcement bar dismiss | Slide up + fade | 200ms | ease |
| Score bars (breakdown) | Width animate on mount | 500ms | ease-out |

### Score count-up animation

```javascript
function useCountUp(target, duration = 800) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  
  return count;
}
```

---

## Tailwind Config Reference

```javascript
// tailwind.config.js — complete config for this project
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['Geist Mono', 'JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        brand: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          500: '#2563EB',
          900: '#1B3A6B',
          950: '#0F2040',
        },
      },
      maxWidth: {
        container: '1200px',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        pulse:   'pulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 200ms ease forwards',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(4px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
```

---

## Implementation Priority Summary

| Priority | Task | Page | Effort |
|---|---|---|---|
| 🔴 P0 | Fix "CNADA" typo | Homepage hero | 5 min |
| 🔴 P0 | Add skeleton loaders — replace "0" stats | Homepage hero | 2 hrs |
| 🔴 P0 | Add primary CTA button to hero | Homepage hero | 30 min |
| 🔴 P0 | Remove province ticker, add card grid | Homepage | 1 day |
| 🟡 P1 | Add trust bar | Homepage | 2 hrs |
| 🟡 P1 | Redesign feature cards with icons + data | Homepage | 4 hrs |
| 🟡 P1 | Add chart above historical table | Homepage | 2 days |
| 🟡 P1 | Style data table (zebra, sticky, sort UI) | Homepage | 4 hrs |
| 🟡 P1 | Rewrite waitlist CTA with social proof | Homepage | 2 hrs |
| 🟡 P1 | Standardize nav labels + move New badge | Global nav | 1 hr |
| 🟡 P1 | Redesign footer with columns | Global footer | 4 hrs |
| 🟡 P1 | Implement Inter typography | Global | 2 hrs |
| 🟢 P2 | Latest Draw page layout + filter bar | /draws | 2 days |
| 🟢 P2 | CRS Scores analytics + "Where do I land?" | /crs-scores | 2 days |
| 🟢 P2 | Calculator multi-step + result + improvements | /calculator | 3–5 days |
| 🟢 P2 | News article cards + "What this means" block | /news | 2 days |
| 🟢 P2 | My Journey unauthenticated state | /my-journey | 1 day |
| 🔵 P3 | Early Access dark page | /early-access | 1 day |
| 🔵 P3 | PR Pathways card grid + questionnaire | /pathways | 2–3 days |
| 🔵 P3 | Glossary with sticky TOC | /what-is | 1 day |
| 🔵 P3 | Count-up animation on score reveal | /calculator | 2 hrs |
| 🔵 P3 | Brand name + wordmark | Global | 1–2 days |
| 🔵 P3 | Custom domain + professional email | Infra | 1 hr |

---

*Page-by-page UI guide v1.0 · immigration-tracker.vercel.app · May 2026*  
*All code examples assume Next.js 14+, Tailwind CSS 3.4+, React 18+*  
*Icons from Lucide React unless noted*