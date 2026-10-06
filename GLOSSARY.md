# Digital Garden 2024

A personal digital garden (posts and notes) plus a resume/CV that is published on the web and printed to PDF.

## Language

### Resume

**Resume Version**:
A named set of resume content tailored for a specific job application or role, e.g. `2026-jul-dev`. It defines only the Sections it changes and inherits every other Section, whole, from the Default Version.
_Avoid_: Variant, edition, snapshot

**Section**:
One kind of resume content — header, skills, experiences, projects, educations, activities, interests, or now. The unit a Resume Version overrides or inherits. The `now` Section belongs only to the Default Version.
_Avoid_: Block, part

**Default Version**:
The Resume Version named `index`; the one shown when no version is requested.
_Avoid_: Main resume, base resume

**Surface**:
Where a Resume Version is shown — the web resume (`web`), the Resume Print Page (`resume_print`) or the CV Print Page (`cv_print`). An entry's **Visibility** says, per Surface, whether it appears there; the Resume is always resolved for exactly one Surface.
_Avoid_: Target, layout, output

**Print Page**:
A print-to-PDF rendering of a Resume Version — either the **Resume** (one page) or the **CV** (multi-page).
_Avoid_: PDF page, export
