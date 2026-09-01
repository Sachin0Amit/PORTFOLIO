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

---
Task ID: 7
Agent: main (Z.ai Code) — direct user request
Task: User asked to change the "Academic Telemetry" section's entire style/design — full visual redesign of Performance.tsx

Work Log:
- Located "ACADEMIC TELEMETRY" = Performance.tsx (section id="performance", anchored by Navbar/SectionRail/CommandPalette/Footer — all kept intact)
- Old design: recharts RadialBarChart gauge + 4 floating TiltCard metric tiles + shimmer progress bar (scattered glass cards, standard dashboard look)
- New design: ONE unified mission-control instrument console with HUD corner brackets, scanlines + fine-grid texture, top edge light:
  - Console header strip: 3 status LEDs (flicker/blink/pulse), "ACAD.SYS // SEMESTER FEED" label, live ticking SYS.TIME clock (useClock, en-GB 24h, hydration-safe "--:--:--" initial), pinging LIVE badge
  - Left panel: custom hand-built SVG speedometer (NO recharts) — 240° sweep, gradient value arc animated via framer-motion pathLength (0 → 0.81), 21 tick marks (bright up to 8.1), scale numbers 0-10 (8 highlighted alien, 10 plasma), sweeping needle (motion.g rotate -120° → 74.4°, transformBox view-box), center hub, pulsing endpoint dot, dashed plasma target zone (9→10) with TGT label
  - Digital readout: count-up 0 → 8.1 (useCountUp rAF, cubic ease-out), "SGPA / 10.0", "GRADE A · 81% NOMINAL" chip, performance.note
  - Right panel: 6 datasheet-style DATA READOUT rows (SEMESTER 01/08, GRADE BAND A·DISTINCTION, PERCENTILE ~81%, TARGET SGPA 9.0+, CREDIT LOAD FULL, STATUS NOMINAL w/ ping dot) with dotted leader lines, staggered slide-in, hover bg + animated left accent bar
  - Waveform strip: dual traveling EKG-style SVG oscilloscope (alien + plasma layers, opposite directions/speeds, mask fade edges, vectorEffect non-scaling-stroke) + SIGNAL·OK tag
  - Program tracker: 8 B.Tech semester segments — SEM 01 filled "8.1" (glow), SEM 02 animated diagonal stripes (stripe-live, seamless 16.97px loop), 03-08 queued; legend row
  - Console footer strip: CALIBRATION 8.1/10.0 · CHANNEL CSE·Y2 + FEED STABLE
- globals.css: added .stripe-live + @keyframes stripeSlide, .wave-track/.wave-track-slow + @keyframes waveSlide (all under existing reduced-motion kill switch)
- Removed recharts + TiltCard imports from Performance (recharts stays installed for ui/chart.tsx)
- FIXED hydration mismatch: raw SVG line/text coords drifted between Node SSR and Chrome ("47.979862216582404" vs "...41") → all coords now pre-rounded via r2() toFixed(2) strings (TICKS array, scale numbers, TGT label, endpoint circles)
- QA (agent-browser): fresh load = 0 console errors, 0 page errors (hydration fixed); structure verified via DOM (gauge svg 300px, 6 rows, 8 segments, clock/LIVE/SIGNAL·OK/FEED STABLE/8.1 all present); animations verified (needle style.transform = rotate(74.4deg), counter reached 8.1, value arc dasharray 0.81px 1px); navbar TELEMETRY link scrolls section to top:0; mobile 390px: no horizontal overflow (scrollW=clientW=390)
- VLM visual QA: desktop (console frame, gauge arc/ticks/numbers/needle/TGT all correct, dotted leaders aligned, no glitches), tracker area (8 segments w/ 8.1+LIVE, waveform + SIGNAL·OK, CALIBRATION/FEED STABLE footer), mobile (gauge centered, rows clean, 8 segments fit w/ readable text)
- Note: hover effects (row bg + accent bar) gated by Tailwind v4 @media (hover: hover) — headless Chrome reports (hover: none) so they can't render in QA, but rules verified present in stylesheet; will work on real pointer devices (same as all other site hover effects)
- tsc clean (app code), eslint clean, dev server 200

Stage Summary:
- Performance/Academic Telemetry section completely redesigned from scattered glass-card dashboard into a single cohesive sci-fi mission-control console: custom SVG speedometer gauge with animated needle + target zone, live clock, datasheet readout rows, traveling EKG waveform, and 8-semester program tracker (new content dimension)
- Hydration mismatch root-caused (SSR/client float drift on SVG coords) and fixed with 2-decimal rounding
- All anchors (#performance) and shared SectionHeading rhythm preserved; verified end-to-end on desktop + mobile

Unresolved issues / next-phase priorities:
- Same as Task 6: social links "#", QA testimonial data, untested Konami/sound toggle
- Semester tracker shows SEM 02 as "LIVE" — consistent with site's "Semester 1 recorded / currently enrolled" story, but if user is actually in a later semester the tracker mapping should be updated
- recharts now only used by unused ui/chart.tsx — could be dropped from deps if desired

---
Task ID: 8
Agent: main (Z.ai Code) — direct user request
Task: User wants live LeetCode / GitHub / Codeforces progress on the site, connectable via backend; profile links will be sent later (no auth tokens required unless desired)

Work Log:
- Added Prisma model PlatformConfig (platform unique, handle?, profileUrl?, enabled, sortOrder) + db:push; restarted dev server for fresh Prisma client
- Built src/lib/platform-types.ts (shared client/server types: PlatformResponse with status live|standby|degraded|disabled)
- Built src/lib/platform-stats.ts (server fetchers):
  - LeetCode: public GraphQL (matchedUser → ranking, userAvatar, submitStatsGlobal acSubmissionNum counts; userContestRanking → contest rating)
  - Codeforces: official REST user.info (rating, maxRating, rank, maxRank, contribution, avatar)
  - GitHub: REST /users/{h} + /users/{h}/repos (sum stars excl. forks, top-3 languages by repo count, followers, member since); optional GITHUB_TOKEN env lifts rate limits
  - In-memory cache: 10 min success / 2 min failure TTL; 8s AbortController timeout; rate-limit (403/429) → "UPSTREAM RATE LIMITED"
- Built /api/platforms route: GET (per-platform stats or standby when no handle; profileUrl auto-synthesized from handle), POST (connect/update handle+profileUrl, zod-like manual validation, optional UPLINK_ADMIN_KEY header guard when env set), DELETE (?platform= disconnect); cache cleared on writes
- Built Platforms.tsx section (id="platforms", heading "07 // UPLINK / CODING UPLINK", accent cyan):
  - 3 mini-console cards matching the redesigned Performance telemetry aesthetic (scanlines, header strip w/ platform icon + CH·01-03 + status badge, footer w/ avatar + @handle + VIEW PROFILE external link)
  - LeetCode card: animated SVG ring (total solved / ~3600) + EASY(alien)/MEDIUM(amber)/HARD(plasma) bars + GLOBAL RANK + CONTEST rating
  - Codeforces card: big tier-colored rating, rank badge (blue-free tier map: legendary→plasma, master→amber, expert/specialist→cyan), current-vs-peak bar, contribution
  - GitHub card: 2x2 stats grid (REPOS/STARS/FOLLOWERS/FOLLOWING) + TOP LANGUAGES chips + member-since
  - States: loading skeleton, STANDBY ("AWAITING UPLINK" pulsing satellite dish, dashed ring), DEGRADED ("SIGNAL LOST" + error code + AUTO-RETRY), LIVE (pinging badge)
  - Sync strip: UPLINKS n/3 ACTIVE · LAST SYNC hh:mm:ss · AUTO 10M + RESYNC button (spins while refreshing); polls every 10 min
- Registered section: page.tsx (after Skills), Navbar (UPLINK), SectionRail (UPLINK), CommandPalette (Uplink/Satellite icon), Footer nav; renumbered later sections (Projects 08, Testimonials 09, Goals 10, Contact 11)
- Fixed 3 type errors (Map entries typing on findMany fallback, CacheEntry.value access, removed unused eslint-disable)
- QA: tsc clean (app), eslint clean, 0 console/page errors
- Backend verified end-to-end with public test profiles: leetcode=neal_wu (253 solved, 60/141/52 E/M/H, rank #627341, contest 3686), codeforces=tourist (3528/4009 legendary GM, +109), github=octocat (8 repos, 20821 stars, 23887 followers, HTML/CSS) — then all DISCONNECTED and reset to standby
- Browser QA: standby (3x AWAITING UPLINK) → connect → RESYNC click → live cards render (VLM verified ring+bars, rating+badge, degraded state on rate-limited GitHub) → DELETE → RESYNC → back to 3x standby; nav UPLINK scrolls to top:0; mobile 390px no overflow, cards stack, ring+bars side-by-side fit
- Final state: all three platforms in STANDBY awaiting the user's real handles

Stage Summary:
- Full live-stats pipeline shipped: DB-configurable handles → server fetchers (no auth needed for LeetCode/Codeforces; GitHub works unauthenticated but shared-IP rate limits can degrade it — GITHUB_TOKEN env optional) → cached /api/platforms GET → console-style UI with live/standby/degraded states + manual RESYNC + 10-min auto-poll
- To connect when the user sends profile links: POST /api/platforms {"platform":"leetcode","handle":"<user>"} (same for codeforces/github) — or tell me the links and I will set them
- No user data is fabricated: cards stay in honest STANDBY state until real handles are linked

Unresolved issues / next-phase priorities:
- Awaiting user's real LeetCode/Codeforces/GitHub profile links (send handles or full URLs — I will POST them)
- GitHub unauthenticated rate limit (60/hr shared IP): if the deployed card flips to SIGNAL LOST occasionally, ask user for a Personal Access Token (public read-only scope) and set GITHUB_TOKEN env
- Social links in Footer/About still "#" placeholders — will be filled when user sends real profiles
- Could later add: GitHub contribution heatmap (needs token+GraphQL), LeetCode recent-contest history, streak stats

---
Task ID: 9
Agent: main (Z.ai Code) — direct user request
Task: User sent real LeetCode identity — "sachin0amit this is my leetcode it and email is sachinamit7144097@gmail.com" — connect the live LeetCode uplink and wire the real email into the site

Work Log:
- Tested LeetCode public GraphQL from sandbox: username sachin0amit resolves — totalSolved 1 (1 Hard, 0 Easy, 0 Medium), ranking 5000001 (LeetCode's "unranked" sentinel for new accounts), contest data null (0 contests attended), avatar assets.leetcode.com/users/sachin0amit/avatar_1767690583.png
- Extended GraphQL query with: tagProblemCounts (fundamental/intermediate/advanced) → skill tags [Array, Binary Search, Divide and Conquer], recentAcSubmissionList (limit 3) → last solve "Median of Two Sorted Arrays" (LC Hard #4), userContestRanking.attendedContestsCount
- Connected handle: POST /api/platforms {"platform":"leetcode","handle":"sachin0amit"} → stored in PlatformConfig table; profileUrl auto-synthesizes to https://leetcode.com/u/sachin0amit
- platform-types.ts: added LeetCodeRecentSolve interface; LeetCodeStats += contestsAttended, recentSolves[], skillTags[]
- platform-stats.ts: new parse logic — recent solves (unix-sec string → ISO, malformed rows filtered), skill tags (deduped via Map, most-solved-first, top 4), contestsAttended default 0
- Platforms.tsx LeetCodeBody: unranked sentinel (ranking >= 5000000) now renders "GLOBAL RANK PENDING" instead of the odd "#5,000,001"; null contest rating falls back to "CONTESTS 0"; new SKILL SIGNALS chip row; new RECENT SOLVES feed (▸ title + relative time via hand-rolled relTime: now/m/h/d/mo, each row links to leetcode.com/problems/{slug}, hover highlight); hydration-safe (data arrives via client fetch, no SSR content)
- Real email wired everywhere the placeholder lived: portfolio-data.ts socials, Contact.tsx EMAIL row, Footer.tsx mailto → sachinamit7144097@gmail.com (GitHub/LinkedIn socials still "#" — handles not yet provided by user)
- QA (agent-browser + VLM): 0 console errors; LeetCode card LIVE with ring "1 SOLVED", EASY/MEDIUM/HARD bars, GLOBAL RANK PENDING, CONTESTS 0, SKILL SIGNALS chips, RECENT SOLVES "Median of Two Sorted Arrays · 7mo", footer avatar + @sachin0amit + VIEW PROFILE; Codeforces/GitHub cards honest STANDBY (AWAITING UPLINK); RESYNC button clicked end-to-end (spinner fires, card stays LIVE after refetch); contact section shows real email; mobile 390px: scrollW=clientW=390, cards stack, ring+bars side-by-side fit, all text readable; tsc clean, eslint clean, dev.log clean

Stage Summary:
- LeetCode uplink is LIVE with the user's real account @sachin0amit — honest data (1 hard problem solved: Median of Two Sorted Arrays, unranked global rank shown as PENDING, 0 contests) + skill-topic chips + recent-solves feed, all auto-refreshing every 10 min
- Real contact email sachinamit7144097@gmail.com live in Contact section, Footer and socials
- Connect flow proven: to add GitHub/Codeforces later just POST /api/platforms {"platform":"github"|"codeforces","handle":"<user>"}

Unresolved issues / next-phase priorities:
- AWAITING user's GitHub username + Codeforces handle (send links/handles → I will POST them; cards will flip from AWAITING UPLINK to LIVE automatically)
- LinkedIn/GitHub social links in Contact/Footer still "#" placeholders
- GitHub unauthenticated rate limit (60/hr shared IP) — GITHUB_TOKEN env optional if SIGNAL LOST appears
- Sandbox clock is set months ahead of the solve timestamp (2026-09 vs 2026-01) → relative time shows "7mo" in QA; on real visitor devices it will show the correct relative time
