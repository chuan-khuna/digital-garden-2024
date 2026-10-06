# Resume Versions share one collection per data type

Resume content lives under `src/content/resume/<version>/`, where `index` is the Default Version. Rather than registering a separate set of collections for every Resume Version, each resume data type stays a single collection (`resumeSkills`, `resumeExperiences`, …) whose loader spans every version folder and tags each entry with the `version` it came from. A custom loader replaces `file()` for the JSON files, because `file()` can only read one file.

We chose this so that adding a Resume Version means adding a folder — no code or schema changes — and so the print pages can derive their `getStaticPaths` from the data itself. The trade-off is a small custom loader and a query helper that every resume page must go through instead of calling `getCollection` directly.

## Consequences

- Components must not call `getCollection('resume*')` themselves (e.g. the print header); they receive version-resolved data as props, otherwise they silently show the wrong version.
- `index` is a reserved version name: it backs `/resume-print`, and no `/resume-print/index` route is generated.
