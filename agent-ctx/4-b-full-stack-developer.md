# Task 4-b — full-stack-developer (content sections)

## Scope
Built the 10 content-section components for Sachin Kumar's 3D portfolio in
`/home/z/my-project/src/components/portfolio/`:

| File | Purpose |
| --- | --- |
| SectionHeading.tsx | Numbered kicker + font-display h2 + animated gradient divider |
| Reveal.tsx | Shared whileInView reveal wrapper (used by every section) |
| About.tsx | Avatar w/ conic ring, bio, quick facts, HERO_STATS animated counters |
| Education.tsx | Alternating vertical timeline, animated gradient spine, pulsing nodes |
| Skills.tsx | shadcn Tabs, animated progress bars, "Currently in the lab" block |
| Goals.tsx | 6 goal cards (DE/JP language cards accented), "From Bihar to the World" banner |
| Projects.tsx | 3 project cards with image zoom, chips, icon link buttons |
| Guestbook.tsx | POST/GET /api/guestbook, live list, skeletons, toasts, date-fns dates |
| Contact.tsx | POST /api/contact, client validation, success chip, socials |
| Footer.tsx | Sticky footer, visit counter (POST/GET /api/visits + sessionStorage), BackToTop |

## Verification status
- `bunx tsc --noEmit`: portfolio-clean EXCEPT `Footer.tsx` →
  `Cannot find module '@/components/portfolio/SmoothScroll'` — that file is
  owned by sibling Task 4-a and had not been written when I finished. The
  import (default-less named imports `scrollToSection`, `scrollToTop`) matches
  the agreed contract and will resolve once 4-a lands SmoothScroll.tsx.
- `bunx eslint <10 files>`: 0 errors, 0 warnings.
- dev.log: clean compiles, no runtime errors (page.tsx does not import these
  components yet — expected).

## Integration notes for the lead
1. Import order suggestion for page.tsx: Hero → Marquee → About → Education →
   Skills → Goals → Projects → Guestbook → Contact → Footer.
2. Wrap everything in `<div className="min-h-screen flex flex-col">` (or on
   body) so Footer's `mt-auto` sticks to the viewport bottom on short pages.
3. All sections are self-contained `section#id` elements with their own ambient
   star-field/grid/glow layers — no shared wrapper needed.
4. Content is 100% sourced from `@/lib/portfolio-data.ts` — data edits need no
   component changes (icon names are string-mapped: School/BookOpen/
   GraduationCap, Code2/Globe/Wrench, Target/Code2/Rocket/Languages/Globe2).
5. Images use plain `<img>` with relative `/portfolio/*` paths per spec.
