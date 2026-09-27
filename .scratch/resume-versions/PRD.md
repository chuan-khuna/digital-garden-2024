# PRD: Resume Versions for the Print Pages

Status: ready-for-agent

## Problem Statement

I keep one resume in the repo, but when I apply for different roles I want to send a resume tailored to each one — different skills emphasised, different projects, sometimes a different job title in the header. Today the Print Pages (`/resume-print` and `/cv-print`) can only render the single set of resume content, so tailoring means editing the real content, printing, and reverting — losing the tailored copy and risking the public resume. There is also a latent bug: the CV Print Page filters entries by the resume's visibility flag instead of its own `cv_print` flag, so per-page visibility doesn't mean what it says.

## Solution

Introduce **Resume Versions**: named sets of resume content living side by side with the **Default Version** (`index`). A Resume Version contains only the **Sections** it wants to change; every other Section is inherited whole from the Default Version. Each Resume Version is reachable at `/resume-print/<version>` and `/cv-print/<version>`, while `/resume-print`, `/cv-print` and the web `/resume` keep showing the Default Version. Version pages are not indexed by search engines and are not linked anywhere, so I can share a link to a tailored resume without it becoming part of the public site. Adding a new Resume Version is just adding a folder of content — no code changes.

## User Stories

1. As the site owner, I want to create a Resume Version by adding a folder named after it, so that tailoring a resume needs no code changes.
2. As the site owner, I want a Resume Version to contain only the Sections I changed, so that I don't have to copy content I'm not tailoring.
3. As the site owner, I want any Section missing from a Resume Version to come from the Default Version, so that my header, education and other shared content stay in one place.
4. As the site owner, I want a Section that a Resume Version defines to replace the Default Version's Section entirely, so that I can see exactly what a version shows by looking at its folder.
5. As the site owner, I want to hide a single project in a Resume Version by copying the projects Section and removing or hiding that entry, so that tailoring rules stay simple and predictable.
6. As the site owner, I want every Resume Version to inherit only from the Default Version, never from another Resume Version, so that I can always tell where content comes from.
7. As the site owner, I want to view a Resume Version's one-page resume at `/resume-print/<version>`, so that I can print it to PDF.
8. As the site owner, I want to view a Resume Version's CV at `/cv-print/<version>`, so that I can print the multi-page CV for the same application.
9. As the site owner, I want `/resume-print` and `/cv-print` to keep showing the Default Version at the same URLs, so that existing links keep working.
10. As the site owner, I want the web `/resume` page to always show the Default Version, so that the public resume is never affected by tailoring.
11. As the site owner, I want no `/resume-print/index` or `/cv-print/index` page, so that the Default Version has a single canonical URL.
12. As the site owner, I want `index` to be a reserved name, so that I can't accidentally create a Resume Version that collides with the Default Version.
13. As the site owner, I want Resume Version names to be any lowercase kebab-case slug, so that they are always URL-safe.
14. As the site owner, I want the build to fail with a clear message when a Resume Version folder has an invalid name, so that I notice mistakes before deploying.
15. As the site owner, I want to follow a `yyyy-mmm-role` naming convention (e.g. `2026-jul-dev`) without the build enforcing it, so that I have a habit, not a constraint.
16. As the site owner, I want Resume Version pages marked `noindex`, so that tailored resumes don't show up in search results.
17. As the site owner, I want Resume Version pages not linked from navigation or other pages, so that only people I send the link to find them.
18. As the site owner, I want Default Version Print Pages to remain indexable, so that my public resume stays discoverable.
19. As the site owner, I want the page title of a Resume Version's Print Page to stay `"<Name>'s Resume"`, so that the PDF file name a recruiter sees doesn't expose my internal version naming.
20. As the site owner, I want a Resume Version link I shared earlier to reflect later changes to inherited Sections, so that the link is a living document (the PDF I sent is the frozen copy).
21. As the site owner, I want to freeze a Resume Version by copying every Section into its folder, so that later changes to the Default Version don't affect it.
22. As the site owner, I want a `now` Section placed inside a Resume Version to be ignored silently, so that the web-only `now` content always comes from the Default Version.
23. As the site owner, I want the CV Print Page to filter experiences, projects and educations by the `cv_print` visibility flag, so that I can control CV content independently from the one-page resume.
24. As the site owner, I want the Resume Print Page to keep filtering by the `resume_print` visibility flag, so that its behaviour is unchanged.
25. As the site owner, I want visibility flags and project ordering to apply within a Resume Version exactly as they do in the Default Version, so that tailored Sections behave the same way.
26. As the site owner, I want the print header to show the Resume Version's header when the version defines one, and the Default Version's header otherwise, so that I can tailor my job title per application.
27. As the site owner, I want the same schema validation for Resume Version content as for Default Version content, so that mistakes in tailored content fail the build.
28. As the site owner, I want a mock Resume Version (`2026-jul-dev`) that overrides every Section except `now` with obviously fake data, so that I can see a fully tailored version working end to end.
29. As the site owner, I want the author docs to explain how to create a Resume Version, so that I (or an agent) can do it later without rereading the code.
30. As a developer agent, I want the architecture docs to describe the version-spanning collections, the fallback rules and the routes, so that I can change the resume system safely.
31. As a developer agent, I want resume components to receive already-resolved Sections as props instead of querying collections themselves, so that no component can silently show the wrong version.
32. As a developer agent, I want Print Page markup shared between the Default Version routes and the Resume Version routes, so that layout changes only happen in one place.
33. As a developer agent, I want an automated test of the built site, so that routing, fallback, noindex and visibility behaviour are protected from regressions.

## Implementation Decisions

- **Content layout.** All resume content moves under a per-version folder. The Default Version is the folder named `index`; each Resume Version is a sibling folder with the same file structure. No resume content sits loose outside a version folder.
- **One collection per data type, spanning every version** (ADR-0001). The existing resume collections keep their names; each entry gains a `version` field taken from its folder, and entry ids are unique across versions. Markdown Sections (experiences, projects) use a glob spanning version folders; JSON Sections use a small custom loader because the built-in single-file loader can read only one file. Existing Section schemas are unchanged apart from the added `version`.
- **Resume resolution module.** A single query module is the only entry point for pages. It exposes: resolve all Sections for a given version (with fallback applied), and list the Resume Versions (all versions except `index`). Resolution rules: a version overrides a Section whole if it has any entries for it; otherwise the whole Section comes from `index`; no per-entry merge; no version-to-version inheritance; the `now` Section always comes from `index`.
- **Components take data, not queries.** No resume component calls the collection API directly. The print header receives its header data as a prop.
- **Shared Print Page components.** The Resume Print Page and CV Print Page bodies become components that take resolved resume data plus page options (e.g. `noindex`). Both the Default Version routes and the Resume Version routes render them.
- **Routes.** `/resume-print` and `/cv-print` render `index`. Dynamic routes `/resume-print/[version]` and `/cv-print/[version]` generate static paths from the Resume Version list, excluding `index`. The site stays statically generated.
- **Version name validation.** A Resume Version name must be a lowercase kebab-case slug and must not be `index`; otherwise the build fails with a clear error naming the offending folder.
- **Indexing.** The print layout accepts a `noindex` option; Resume Version pages set it, Default Version pages don't. Page titles are unchanged.
- **Visibility bug fix.** The CV Print Page filters on `cv_print`; the Resume Print Page on `resume_print`; the web page on `web`.
- **Mock data.** A `2026-jul-dev` Resume Version overrides every Section except `now` with obviously fake content that satisfies the schemas.
- **Docs.** The resume architecture doc and the resume content doc are updated for the new layout, loader, resolution rules, routes and authoring steps; the existing doc error listing projects as a JSON file is corrected.

## Testing Decisions

- **One seam: the built site.** Tests run the production build and assert on the generated HTML only — never on loader or resolution internals. That keeps tests valid through refactors of the collections or the resolution module.
- **What a good test checks here** (external behaviour only):
  - `/resume-print`, `/cv-print`, `/resume`, `/resume-print/2026-jul-dev` and `/cv-print/2026-jul-dev` are generated; `/resume-print/index` and `/cv-print/index` are not.
  - Resume Version pages show that version's content (mock header name, mock skills) and Default Version pages show the real content.
  - Section fallback: a Resume Version that omits a Section shows the Default Version's content for that Section while showing its own content for Sections it defines.
  - Resume Version pages carry `noindex`; Default Version pages don't.
  - Page titles are identical between a Resume Version and the Default Version.
  - The CV Print Page hides an entry whose `cv_print` is false but whose `resume_print` is true, and vice versa for the Resume Print Page.
- **Fallback coverage needs a partial version.** The mock `2026-jul-dev` overrides every Section, so it can't exercise fallback. Tests need a Resume Version that defines only some Sections (e.g. only skills). See Further Notes.
- **Tooling.** Vitest (new to the repo) with a `test` script; tests build once and parse the HTML output. Invalid-name build failure is covered by a test that builds against a fixture with a bad folder name, or deferred if the build can't be pointed at a fixture cheaply.
- **Prior art.** None — the repo has no tests yet. This establishes the pattern.

## Out of Scope

- Versioning the web `/resume` page.
- Per-entry merging or inheritance between Resume Versions.
- Enforcing the `yyyy-mmm-role` naming convention.
- Access control or password protection for Resume Version pages (they are public-but-unlisted).
- Freezing/snapshotting versions automatically.
- Automated PDF generation — printing remains a browser action.
- Showing the version name in the page title or PDF file name.

## Further Notes

- Glossary terms (Resume Version, Default Version, Section, Print Page) are defined in `CONTEXT.md`; the collection shape is recorded in `docs/adr/0001-versioned-resume-collections.md`.
- Because Resume Version pages are deployed publicly (noindex, unlisted), tailored content must never contain anything private.
- Open point for the implementer: how to give the tests a partial Resume Version without deploying a test-only version to production. Options: a test fixture content folder the build can be pointed at, or a small partial version kept in content. Prefer the fixture if the build can be redirected cheaply.
- An implementation of this feature is already in progress on `feature/resume-print-versioning`; the tests described here should be written against it.
