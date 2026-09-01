# Project Worklog — Sachin Kumar 3D Portfolio

Project: A top-class, never-seen-before 3D portfolio website for Sachin Kumar
(B.Tech CSE student at Government Engineering College, Sitamarhi; from Bihar, India)

Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + shadcn/ui + three.js (@react-three/fiber + @react-three/drei) + framer-motion + lenis smooth scroll + Prisma (SQLite)

Design concept: Dark futuristic "cosmic code" theme — violet/fuchsia + amber neon accents on deep space black, full-screen WebGL hero (custom shader blob + particle starfield + floating geometry), preloader, custom cursor, scroll-driven animations, glassmorphism cards.

---
Task ID: 1
Agent: main (Z.ai Code)
Task: Project setup — install 3D packages, generate AI images, define Prisma schema, push DB

Work Log:
- Installed three@0.185.1, @react-three/fiber@9.7.0, @react-three/drei@10.7.8, lenis@1.3.26, @types/three
- Generated AI images into public/portfolio/: avatar.png (1024x1024), project-1.png, project-2.png, project-3.png (1344x768)
- Defined Prisma models: ContactMessage, GuestbookEntry, SiteVisit
- Ran bun run db:push successfully

Stage Summary:
- Packages installed, DB schema live, image assets ready
- Next: design system (globals.css), backend API routes, then all frontend components
---
Task ID: 4-b
Agent: full-stack-developer (sonnet)
Task: Build content sections — SectionHeading, Reveal, About, Education, Skills, Goals, Projects, Guestbook, Contact, Footer

Work Log:
- Read worklog.md, portfolio-data.ts, globals.css, API routes (guestbook/contact/visits), prisma schema and shadcn component APIs to match exact response shapes and design utilities
- Created src/components/portfolio/SectionHeading.tsx — numbered kicker (from SECTION_HEADING_NUMBERS), font-display h2, animated scaleX gradient divider, staggered whileInView reveals
- Created src/components/portfolio/Reveal.tsx — shared scroll-reveal wrapper (opacity+y, cubic-bezier ease, once:true, -60px margin)
- Created About.tsx — avatar showcase with rotating conic-gradient ring, glow blob, 3 floating .chip badges; bio paragraphs; 4 quick-fact glass cards; HERO_STATS animated counters (framer-motion animate() + useInView, respects decimals, suffix in .text-gradient-warm)
- Created Education.tsx — vertical timeline: white/10 track + gradient overlay line (scaleY whileInView, glow-violet), alternating lg:grid-cols-2 sides (odd/even col-start, text-right/text-start), pulsing node dots with amber cores, icon map School/BookOpen/GraduationCap, accent-tinted tag chips
- Created Skills.tsx — shadcn Tabs (pill triggers, gradient active state), 18 skill cards with animated gradient progress bars (width 0→level%, 0.05s stagger), "Currently in the lab" glass-strong block with pulsing amber dots
- Created Goals.tsx — 6 goal cards (corner glow, gradient numbers, amber icon squares), language cards (German/Japanese greetings) stand out with border-amber-300/25 + hover:glow-amber, bottom "From Bihar to the World" banner
- Created Projects.tsx — 3 project cards with group-hover:scale-110 images, gradient overlays, category/highlight chips (amber for "You are here"), tech chips, Github/ExternalLink icon buttons, footer note
- Created Guestbook.tsx — form (name/country/message + live 280-char counter) POSTing to /api/guestbook with client validation + toasts; entry list loaded on mount (GET) with 3 Skeleton loading cards, max-h-[480px] custom-scroll list, initials avatars, date-fns "d MMM yyyy" dates, empty state, framer-motion layout prepend animation
- Created Contact.tsx — left info panel (base camp/college/languages/availability with pulsing amber dot + 4 social icon buttons), right "TRANSMISSION FORM" (glass-strong, decorative orb) POSTing to /api/contact with regex email validation, success toast + auto-hiding amber delivered chip
- Created Footer.tsx — sticky-footer convention (mt-auto), SK brand, NAV_LINKS buttons via scrollToSection, visit counter (sessionStorage sk-visited flag → POST/GET /api/visits, AnimatePresence number roll), "Made in Bihar, India" line, copyright row, fixed BackToTop button (scrollY > 600, AnimatePresence)
- Fixed ESLint: JSX "//" literals wrapped in braces (SectionHeading, Contact), removed unused eslint-disable directives (About, Projects)
- Verified: bunx tsc --noEmit → only remaining portfolio error is Footer.tsx importing @/components/portfolio/SmoothScroll which sibling Task 4-a has not written yet (expected race, resolves when they finish); bunx eslint on all 10 files → 0 errors 0 warnings; dev.log clean compiles

Stage Summary:
- Files created (10): SectionHeading.tsx, Reveal.tsx, About.tsx, Education.tsx, Skills.tsx, Goals.tsx, Projects.tsx, Guestbook.tsx, Contact.tsx, Footer.tsx (all default exports, all 'use client')
- Key decisions: all content from portfolio-data.ts (zero hardcoding); typed API response interfaces (GuestbookEntry, VisitsResponse, etc.) with no `any`; counters use framer-motion animate() with toFixed(decimals); Education timeline uses per-row grid + col-start instead of CSS :odd for explicit parity control; decorative layers aria-hidden everywhere; touch targets ≥ 40px, focus-visible:ring-fuchsia-400/60 on all interactive elements
- Risks for integration: (1) Footer.tsx imports scrollToSection/scrollToTop from @/components/portfolio/SmoothScroll — Task 4-a must deliver that file with those named exports or tsc fails; (2) page.tsx assembly must wrap content in min-h-screen flex flex-col for Footer mt-auto sticky behavior; (3) Guestbook empty-country entries hide the MapPin span; counter chip shows "N signed"; (4) images use plain <img> (no next/image) per spec — no lint issue since rule disabled in this config
---
Task ID: 4-a
Agent: full-stack-developer (opus)
Task: Build hero experience — SmoothScroll, CustomCursor, Preloader, Navbar, HeroScene (3D), Hero, Marquee

Work Log:
- Read worklog.md, portfolio-data.ts, globals.css, layout.tsx; verified drei v10.7.8 exports (Grid/Stars/Sparkles/Float/MeshDistortMaterial) and lenis 1.3 typings before writing code
- Created src/components/portfolio/SmoothScroll.tsx — Lenis instance (lerp 0.09, smoothWheel) stored on window.__lenis via cast (no global declaration, avoids cross-agent merge conflicts), rAF loop with full cleanup; exported scrollToSection(id) (offset -84, duration 1.4) and scrollToTop() with native fallbacks
- Created src/components/portfolio/CustomCursor.tsx — pointer:fine gated, adds .custom-cursor-active to <html>; 8px violet-400 dot (stiff spring ~80ms) + 36px fuchsia ring (soft spring ~250ms) via useMotionValue+useSpring; mouseover closest() hover detection (ring 2x + amber border/bg, dot 0.5x), mousedown 0.85x, opacity-0 until first mousemove
- Created src/components/portfolio/Preloader.tsx — SACHIN.EXE + INITIALIZING UNIVERSE (caret █), 0->100 counter via framer-motion animate() (1500ms easeOut), gradient progress bar, threshold status lines (shaders/particles/starfield/universe), body overflow lock, AnimatePresence exit y:-100% (0.7s, cubic [0.76,0,0.24,1]) after 350ms hold, then null; total ~2.55s
- Created src/components/portfolio/Navbar.tsx — scroll progress hairline (useScroll+useSpring, violet->fuchsia->amber gradient, origin-left), floating glass-strong pill nav, SK. logo (scrollToTop), desktop links from NAV_LINKS with hover underline scaleX + IntersectionObserver active-section tracking (rootMargin -40%/-55%) + fuchsia active dot, amber Hire Me chip, full-screen staggered mobile menu (AnimatePresence, body scroll lock, RSC-safe cleanup)
- Created src/components/portfolio/three/HeroScene.tsx — Canvas dpr [1,1.75], fov 45, alpha+antialias+high-performance; Rig group lerping toward state.pointer (y *0.16, x *-0.1, damping 0.05) + breathing scale sin(t*0.6)*0.01; MeshDistortMaterial icosahedron (distort 0.42, speed 2.2, #3b0f70) + counter-rotating fuchsia wireframe shell; 5 Float satellites (torus knot amber, octahedron violet wire, dodecahedron amber wire, fuchsia torus, white tetra wire); Stars 2200 + dual Sparkles clouds (amber/fuchsia); infinite Grid floor at y=-3.6 (#7c3aed sections); style touchAction pan-y so mobile scroll is not blocked
- Created src/components/portfolio/Hero.tsx — dynamic HeroScene (ssr:false) + top/bottom gradient + radial vignette overlays; chip badge, per-letter overflow-hidden stagger reveal of SACHIN (fg) / KUMAR (text-gradient) with 2.5-2.6s delays; useTypewriter hook (70ms type / 1600ms hold / 35ms delete) over PERSONAL.heroRoles with caret; heroIntro paragraph, dual CTA (gradient glow-violet Explore / glass Say Hello), StatCard count-ups (useInView once, self-timed delay for first-load sync), scroll indicator with infinite y-bob ChevronDown
- Created src/components/portfolio/Marquee.tsx — server-safe pure component (no client JS); -1.2deg slanted 110% width strip, row 1 solid (every 3rd .text-gradient, every 4th .text-gradient-warm, amber Sparkle separators), row 2 outlined ghost text (WebkitTextStroke fuchsia, +2.4deg nested counter-rotation, opacity-70); items duplicated exactly 2x with pr-N padding (not container gap) for seamless -50% loop; both rows overflow-hidden + mask-fade-x
- Fixed 2 eslint errors from React Compiler rules: CustomCursor setEnabled deferred via rAF in effect; Navbar goTo no longer mutates document.body directly in handler (rAF-deferred scrollToSection)
- Verification: bunx tsc --noEmit — zero errors in my 7 files (only pre-existing errors in examples/ and skills/ folders, out of scope); eslint exit 0 on all 7 files; dev.log clean (only "✓ Compiled" lines, no explosions)

Stage Summary:
- Files created: src/components/portfolio/{SmoothScroll,CustomCursor,Preloader,Navbar,Hero,Marquee}.tsx and src/components/portfolio/three/HeroScene.tsx — exactly the 7 assigned files
- Key decisions: (1) custom cursor z-[110] instead of spec z-[90] because Preloader sits at z-[100] — otherwise the native cursor (hidden by CSS) would leave a dead-cursor window during the 2.4s boot; (2) marquee rows use per-item pr- padding instead of flex container gap to make the -50% translate loop mathematically seamless; (3) Hero stat count-ups self-detect first-load (inView within 600ms of mount -> 3.6s delay) to stay in sync with the preloader choreography without cross-component state; (4) Canvas gets touchAction pan-y to keep mobile scrolling possible over the WebGL hero; (5) window.__lenis accessed via type-cast helper, no global augmentation
- Timing contract for integrator: Preloader total ~2.55s; Hero entrance delays are hard-coded 2.5s base (badge 2.5, letters 2.6-2.9, typewriter 3.2, paragraph 3.35, CTAs 3.5, stats 3.65, scroll cue 4.0) — components must mount together on the page for sync
- Integration notes: page.tsx should render <SmoothScroll/>, <CustomCursor/>, <Preloader/>, <Navbar/> (order-agnostic siblings) + <Hero/> + <Marquee/> right after Hero. scrollToSection/scrollToTop are exported from SmoothScroll.tsx for any agent that needs programmatic nav. Marquee is RSC-safe (no "use client")
- Risks: (1) hover:border-fuchsia-400/40 on .glass button relies on Tailwind utility order vs custom @utility — cosmetic only, may not visibly win; (2) per-letter .text-gradient on KUMAR gives each letter its own full gradient (spec-mandated) rather than one continuous sweep; (3) IntersectionObserver active-link tracking depends on the section ids about/education/skills/goals/projects/guestbook/contact existing in the DOM at Navbar mount — sections agent must use exactly those ids from NAV_LINKS; (4) lenis smooth scroll + IntersectionObserver both work on native window scroll — no conflict expected
---
Task ID: 5
Agent: main (Z.ai Code)
Task: User-requested revision — remove marquee/3D/avatar/Goals/location, fix college name (Sheikhpura), simplify headings

Work Log:
- Removed Marquee.tsx, Goals.tsx, three/HeroScene.tsx and public/portfolio/avatar.png; deleted three/ folder
- page.tsx: removed Marquee + Goals from page assembly
- Hero.tsx: replaced WebGL canvas with CSS ambient background (star-field + grid-bg + violet glow), badge text "MY PORTFOLIO", CTA "More About Me"
- About.tsx: removed photo column entirely; single centered column with bio, 4 quick facts (Degree/Year/College/SGPA), animated stats
- portfolio-data.ts: college → Government Engineering College, Sheikhpura; removed tagline exaggerations, location fields, GOALS + MARQUEE_ITEMS data; NAV_LINKS now 6 links; sections renumbered 01-06; simplified heroRoles/bio/heroIntro
- Education/Skills/Projects/Guestbook/Contact headings simplified ("Education", "My Skills", "My Projects", "Guestbook", "Get in Touch")
- Contact.tsx: removed Base Camp location item; college = GEC Sheikhpura; "Send Message"/"Message sent" copy
- Footer.tsx: removed "Made in Bihar", "cosmic travelers" → "visitors so far", credits "Built with Next.js & Tailwind CSS"
- Preloader.tsx: "SACHIN KUMAR / LOADING PORTFOLIO" with simple status lines
- Guestbook toasts simplified; layout.tsx metadata updated (Sheikhpura, plain titles)
- Verified: tsc clean, eslint clean, browser-tested — 0 canvases, no marquee/goals/avatar, Sheikhpura shown, all 7 sections present, nav scrolling works, guestbook POST works, VLM visual QA passed on hero/about/education/skills/contact/footer

Stage Summary:
- Site is now a clean, professional dark portfolio without 3D/photo/location elements, college corrected to GEC Sheikhpura
- All interactive features still functional (tabs, guestbook, contact, nav, back-to-top, visitor counter)

---
Task ID: 6
Agent: main (Z.ai Code) — cron webDevReview round 1
Task: User uploaded reference workspace tar — "make it like this use its content" — adopt alien-themed portfolio design wholesale

Work Log:
- Extracted /home/z/my-project/upload/workspace-*.tar to /tmp/reference; studied structure (19 portfolio components, 11 effect components, 2 API routes, Prisma Transmission+Testimonial models)
- Adopted wholesale: src/components/portfolio/*, src/components/effects/*, src/hooks/{use-sound,use-tilt}.ts, src/lib/portfolio-data.ts, src/app/{page,layout,globals.css}, public/assets/* (8 images), prisma schema, api/contact + api/testimonials routes; removed old api/guestbook + api/visits and old public/portfolio images
- Dependency diff: reference needs nothing extra (kept three/fiber/drei/lenis installed but unused)
- Fixed college name everywhere: Sitamarhi → Sheikhpura (portfolio-data.ts x5, layout.tsx metadata x2, About.tsx x2, Contact.tsx x1) — preserves user's factual correction
- Generated missing /assets/proj-atlas.png via z-ai image (sci-fi holographic map, 1344x768) — referenced by ProjectDialog for Bihar Heritage Atlas but absent from tar
- Fixed 3 pre-existing type errors from reference: bare `fill` props on lucide icons in Testimonials.tsx (boolean → fill="currentColor" x2); TiltCard glareColor union type widened to string + Record<string,string> lookup (fixes 4 errors in Achievements/Certificates/Projects)
- Pushed Prisma schema (Transmission, Testimonial); had to restart dev server (stale PrismaClient cache: db.testimonial was undefined)
- QA via agent-browser: 0 page errors; all 10 sections render + Sheikhpura confirmed, Sitamarhi absent; starfield canvas active; command palette Ctrl+K opens + navigates (Archive → scrollY 8965 exact); certificate dialog opens with real cert image; project dialog opens (PROJ.CIPHER-02); testimonial form end-to-end (submit → toast → appears in list); contact form end-to-end (persisted=true → toast → form cleared)
- Fixed mobile horizontal overflow (450px vs 390px viewport): decorative absolute glow orbs escaping sections → changed body overflow-x:hidden → overflow-x:clip on html+body; verified 390=390 after fix
- Mobile menu opens + navigates correctly (9 links, ARCHIVE → projects 8965)
- VLM visual QA on 10 desktop screenshots: all sections render fully, no overlaps/broken layouts
- tsc clean (only pre-existing examples/skills errors), eslint clean

Stage Summary:
- Project is now the alien/sci-fi themed "Cosmic Engineer" portfolio per user's reference: StarfieldCanvas, AlienCursor, ScrollProgress, SectionRail, CommandPalette (Ctrl+K), Konami easter egg, SoundToggle (WebAudio), TiltCards, ParallaxBreaks, 11 content sections incl. Certificates (TechBairn cert), Performance (SGPA telemetry), Achievements, Testimonials (live DB-backed with form), TransmissionCounter (live contact count in footer)
- College name corrected to GEC Sheikhpura throughout; proj-atlas.png generated
- All interactive flows browser-verified; mobile overflow fixed

Unresolved issues / next-phase priorities:
- Social links point to "#" placeholders (user should supply real GitHub/LinkedIn/Email)
- Testimonials currently has QA test data (Test Visitor, Ananya Singh) — harmless but could be cleared
- Konami easter egg + sound toggle not explicitly tested this round (code intact from reference)
- Consider: seed a few real testimonials, add projects' real links, maybe site favicon with alien glyph
