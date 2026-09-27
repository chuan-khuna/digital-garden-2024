# Resume Versions — Architecture Review

- **Date:** 2026-09-26
- **Scope:** `src/content/resume/`, `src/content/collection-definitions/resume*.ts`, `src/lib/resume.ts`, the Print Pages and `src/pages/resume.astro`
- **Status:** Candidates only — nothing decided yet. When a candidate is accepted, or rejected for a reason a future review would need, record it as an ADR in `docs/adr/`.
- **Constraint:** All candidates keep [ADR-0001](../adr/0001-versioned-resume-collections.md) (one collection per data type, loader tags each entry with its `version`).

Vocabulary: domain terms (Resume Version, Section, Default Version, Print Page) come from `CONTEXT.md`; architecture terms (module, interface, seam, adapter, depth, leverage, locality) from the `codebase-design` skill.

## Summary

| # | Candidate | Strength |
|---|---|---|
| 1 | Move Visibility behind the Resume module's interface | **Strong** |
| 2 | Separate Resume Version resolution from `astro:content` | Worth exploring |
| 3 | Define each Section once (Section registry) | Worth exploring |
| 4 | Stop storing singleton Sections as arrays | Speculative |

**Top recommendation:** candidate 1. It is the only one that fixes a real bug (`visibility.web` has no effect), the diff is small, and it sets up candidate 2.

---

## 1. Move Visibility behind the Resume module's interface — Strong

**Files:** `src/lib/resume.ts`, `src/components/resume/pages/ResumePrintPage.astro`, `src/components/resume/pages/CvPrintPage.astro`, `src/pages/resume.astro`

**Problem.** Visibility leaks across the seam. `getResume(version)` returns every entry unfiltered, so each page has to know which Sections carry `visibility` and filter them itself:

```
getResume(version) ──► ResumePrintPage   filters resume_print ×3
                   ──► CvPrintPage       filters cv_print ×3
                   ──► /resume           filters nothing
```

`/resume` never filters, so `visibility.web: false` is a dead flag — `docs/content/resume.md` even documents `/resume` as "renders every entry". Adding a Section with `visibility` also requires editing both Print Pages (docs step 4 of "adding a Section").

**Solution.** `getResume(version, target)` where `target` is `'web' | 'resume_print' | 'cv_print'`, returning a Resume that is already filtered and ordered. Pages only render.

**Wins**
- Locality: Visibility rules live in one module.
- `web: false` starts working.
- New Sections don't touch the Print Pages.
- Leverage: one interface, five routes.

## 2. Separate Resume Version resolution from `astro:content` — Worth exploring

**Files:** `src/lib/resume.ts` (`resolveSection`, `loadAllSections`, `getResume`, `getResumeVersions`)

**Problem.** The subtlest rules of Resume Versions — whole-Section override, `now` always from the Default Version, header required, projects sorted by `order` — sit underneath eight `getCollection` calls. The only way to exercise them is a full Astro build, and there are currently no tests.

**Solution.** Put the seam at "entries in": a pure `resolveResume(entries, version, target)` holds the rules; `getResume()` becomes a thin adapter that loads the collections and passes them in.

```
before:  getResume = getCollection×8 + fallback + required checks + sort   (untestable)
after:   Astro content adapter ─┐
         fixture adapter (test) ─┴─► resolveResume(entries, version, target)   (pure)
```

**Wins**
- Two adapters: Astro content in prod, fixture arrays in tests — a real seam.
- Tests hit the same interface the pages use.
- Fallback bugs surface in tests, not in a printed PDF.

**Caveat.** The project has no test runner. Only worth it alongside adding Vitest; pairs naturally with candidate 1.

## 3. Define each Section once (Section registry) — Worth exploring

**Files:** `src/content/collection-definitions/resume.ts`, `src/content.config.ts`, `src/lib/resume.ts`

**Problem.** Knowledge of "what a Section is" is spread out. Adding one Section touches five places: schema + loader, `content.config.ts`, the `Resume` interface, `loadAllSections`, and the `getResume` return. `visibilitySchema.default(...)` is repeated 3×, the `version` field 8×, and header / interests / now are special-cased by hand (`[0]`, `.data.items`).

**Solution.** One `RESUME_SECTIONS` table — `{ source, schema, shape: 'list' | 'single', visibility?, defaultOnly? }` per Section — from which collections, the `Resume` type, and load/resolve are derived.

**Wins**
- Locality: a Section is one row.
- "Adding a Section" in the docs shrinks to one step.

**Caveat.** A generic registry can degrade `CollectionEntry<…>` type inference for the section components. With eight stable Sections that rarely change, the payoff is lower than candidate 1.

## 4. Stop storing singleton Sections as arrays — Speculative

**Files:** `src/content/resume/*/header.json`, `interests.json`, `now.json`; `versionedResumeJson` in `resume-loaders.ts`

**Problem.** header, interests and now are one thing per Resume Version, but must be written as `[ { "id": "header", … } ]`. The loader then demands an `id`, warns on duplicates, and `getResume` unwraps with `[0]` and `[0]?.data.items ?? []`. The fake array is interface the content author has to remember.

**Solution.** `versionedResumeJson(fileName, { shape: 'single' })` reads a plain object and stores one entry per version (id = version).

**Wins**
- Content interface shrinks.
- The unwrapping in `getResume` disappears.

**Caveat.** Changes the content file format (affects the web-master agent and `docs/content/resume.md`). Only worth doing together with candidate 3.
