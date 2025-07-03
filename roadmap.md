# Project Roadmap – PLO5 Mobile Trainer

> **Purpose** — Provide a clear, trackable breakdown of work for the first release of the PLO-5 Mobile Trainer PWA. Two milestones are defined, focused on building the Wrap-Counter first and the Equity-Judger second.

---

## Milestone 1 – Wrap-Counter MVP ✅ **COMPLETED**
**Goal**: Users can open the app, pick or input a flop, and instantly see the max-wrap size (20/17/16 …) along with example hole-card wraps. All functionality runs fully client-side and the site can be exported statically.

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1.1 | **Project scaffolding** – ensure Next 15, TypeScript, Tailwind CSS, PostCSS are configured; dark-mode via `layout.tsx`. | | ✅ |
| 1.2 | **Card asset** – implement `<PlayingCard>` component using Unicode suits; responsive sizing (sm/md/lg). | | ✅ |
| 1.3 | **Data pipeline** – comprehensive `public/data/wraps.json` with 36k+ lines covering all flop combinations and wrap calculations. | | ✅ |
| 1.4 | **Routing** – create `/wrap` page with dynamic `/wrap/[flop]` routes for specific flop targeting; clean URL structure. | | ✅ |
| 1.5 | **WrapQuiz UI** – build `<WrapQuiz>` component with mobile-optimized grid layout:  
&nbsp;&nbsp;• shows random flop or specific flop from URL  
&nbsp;&nbsp;• quiz buttons for user guess (20/17/16/13/… options)  
&nbsp;&nbsp;• reveal answer with 2-4 wrap examples in responsive grid  
&nbsp;&nbsp;• beautiful card components with proper shadows and proportions. | | ✅ |
| 1.6 | **Add-My-Own-Hand flow (Wrap)** – modal with 5 hero + 3 board pickers; compute wrap size in JS; display result. | | ⏳ |
| 1.7 | **URL state** – case-insensitive flop targeting via `/wrap/45J` URLs for shareability and investigation. | | ✅ |
| 1.8 | **Accessibility & mobile UX** – mobile-first non-scrollable design, optimized touch targets, proper ARIA labels, responsive grid layout. | | ✅ |
| 1.10 | **Desktop layout optimization** – resolved desktop squishing bugs, implemented responsive width strategies, enhanced component spacing for cross-device consistency. | | ✅ |
| 1.9 | **Static export** – verified `pnpm build` works perfectly; zero errors, optimized bundles, ready for deployment. | | ✅ |
| 1.3b | **Comprehensive wrap data** – complete dataset with deterministic wrap calculations, max outs detection, nut outs tracking. | | ✅ |

**Exit criteria**: ✅ **ACHIEVED** - Mobile-optimized wrap counter with perfect UX, case-insensitive flop targeting, comprehensive dataset, static export ready.

---

## Current Feature Set ✨

### **Completed Wrap-Counter Features:**
- ✅ **Random Mode** (`/wrap`) - Endless random flop training
- ✅ **Investigation Mode** (`/wrap/45J`) - Study specific flops  
- ✅ **Mobile-First Design** - Non-scrollable, responsive grid layout with optimized desktop experience
- ✅ **Beautiful Components** - Professional card design with proper shadows and refined spacing
- ✅ **Smart Validation** - Case-insensitive input, helpful error messages
- ✅ **Comprehensive Data** - 36k+ lines covering all wrap scenarios
- ✅ **Production Ready** - Zero build errors, optimized bundles

### **Component Architecture:**
- `<WrapQuiz>` - Main quiz orchestration with responsive grid and optimized desktop layout
- `<DrawDetail>` - Individual wrap display with refined spacing and proportional sizing
- `<PlayingCard>` - Hero card component with size variants (sm/md/lg)
- `<PokerTable>` - Flop display with blue glow effects and elegant responsive proportions
- `<OutCard>` - Reference cards for outs display
- `<Header>` - Navigation with home/next functionality

---

## Milestone 2 – Equity-Judger MVP
**Goal**: Users can estimate hero vs. villain equity for predefined hand-class confrontations or custom spots using a WASM equity engine stub.

| # | Task | Owner | Status |
|---|------|-------|--------|
| 2.1 | **WASM equity stub** – scaffold Rust/C++ project (placeholder) that returns deterministic pseudo-equity; expose via `@plo5/equity-wasm`. | | ⏳ |
| 2.2 | **Build script** – docs + command in README for compiling stub (`wasm-pack build --target web`). | | ⏳ |
| 2.3 | **Presets data** – add `public/data/presets.json` with equity drill catalog (hand class vs wrap size buckets). | | ⏳ |
| 2.4 | **Routing** – create `/equity-judger` page and navigation. | | ⏳ |
| 2.5 | **Core components** – implement:  
&nbsp;&nbsp;• `<EquitySlider>` – draggable range to guess %  
&nbsp;&nbsp;• `<HandClassPicker>` – dropdown for villain class  
&nbsp;&nbsp;• `<EquityQuiz>` – orchestrates quiz flow. | | ⏳ |
| 2.6 | **Add-My-Own-Hand flow (Equity)** – reuse card picker modal; call WASM stub to return hero/villain equity; bucket & display result. | | ⏳ |
| 2.7 | **URL state** – sync quiz params for share links. | | ⏳ |
| 2.8 | **Accessibility & mobile UX** – ensure controls are operable with screen readers/touch. | | ⏳ |
| 2.9 | **Static export & deploy** – confirm full export with both modules. | | ⏳ |

**Exit criteria**: Equity estimations return within ±5 % bucket of stubbed truth, Add-My-Own flow functional, app exports statically with both drills accessible.

---

## Nice-to-Have Backlog (post-MVP)
* Replace WASM stub with real Monte-Carlo engine
* Add-My-Own-Hand flow for wrap counter (1.6)
* Enhanced quiz state persistence in URLs
* Plausible analytics integration
* Unit tests with Jest + RTL
* CI pipeline (lint, type-check, build, export)
* Custom card art
* PWA install prompt & offline caching

---

_Last updated: December 2024 - Milestone 1 Complete with Enhanced Desktop Experience! 🎯_ 