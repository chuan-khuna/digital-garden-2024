# Resume writing: what claude-resume-kit encodes, and what our resume skill should take from it

Source read: [ARPeeketi/claude-resume-kit](https://github.com/ARPeeketi/claude-resume-kit) at commit [`69930e9`](https://github.com/ARPeeketi/claude-resume-kit/tree/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e) (2026-03-09, "fix: use consistent 'skills' terminology in DOCS.md"). Every kit link below points at that commit.

Two more sources, supplied by the user:

- Harvard FAS Mignone Center for Career Success, [Create a strong resume](https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/), read 2026-11-17. The page shows no last-updated date; its footer reads "© 2026".
- Martin Williams, [Grammar rules for your CV: top tips](https://www.theguardian.com/careers/careers-blog/grammar-rules-cv-top-tips), Guardian Careers, 25 October 2013. Byline and date confirmed from the page metadata.

In the tables below, H is the Harvard page and G is the Guardian article, followed by the tip number.

Compared against: `.claude-dev/skills/resume/SKILL.md`, `.claude-dev/skills/technical-writing/SKILL.md`, `.claude-dev/skills/unslop/SKILL.md`, `docs/content-formats/resume.md` and `GLOSSARY.md`.

## Summary

The kit is a LaTeX pipeline for academic and research CVs. Its strongest ideas are not about prose. They are about accuracy and tailoring: an explicit priority order (Accuracy > Relevance > Impact > ATS > Brevity), verb discipline that ties the strength of a verb to how much of the work the user owned, a job-description analysis that sorts every requirement into Direct, Bridge or Gap, honest wording for gaps, and a mandatory stop for the user to approve the plan before anything is written.

Our skill already covers the prose rules well, often more strictly than the kit (no dashes at all, a numbered slop catalogue, traceable claims). It has no job-description workflow at all, even though every Resume Version is a per-job tailoring folder. That is the main gap.

The kit cites no external source for any claim about recruiters, ATS software or AI detection. Its reading-time windows (10 seconds, 30 seconds, 2 minutes), the 70% keyword match threshold and the "~60% of large employers" figure are all uncited. Adopt its procedures, not its numbers.

The Harvard page and the Guardian article add sentence-level rules the kit lacks: proofreading for homophones and apostrophes, consistent capitalisation, the singular for one organisation, and spelling out abbreviations. Most of their other points are already in our skills. They disagree on one point that affects us: Harvard says never use personal pronouns or a narrative style, while the Guardian treats first person as standard. Our skill sits between them: no "I" in bullets, "I" allowed in `introduction`. Neither source cites evidence, so they are editorial advice.

## What the kit contains

The kit has six user-invoked skills that share rules through `CLAUDE.md` and reference files under `resume_builder/reference/`. The README describes the flow: extract papers once, build a knowledge base, then per job run `/make-resume`, `/make-cl`, `/critique` and `/edit-resume`, each in a fresh session ([README.md L38-51](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/README.md#L38-L51), [L121-142](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/README.md#L121-L142)).

### Project rules (`CLAUDE.md`)

Shared by every skill. Sets the priority order, anti-fabrication rules, verb discipline and five generation rules (no internal folder names as package names, no lines-of-code or test counts, accurate publication status, "et al." format, funding is not a personal award) ([CLAUDE.md L43-108](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/CLAUDE.md#L43-L108)). It also defines user focus directives such as "Emphasize X", "Downplay Y" and "Lead with A" ([L58-66](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/CLAUDE.md#L58-L66)).

### `/setup-extract`

Reads one paper, then stops to ask the user what they personally did, which tools they built, which results they can claim, and what must not appear on the resume ([SKILL.md L51-64](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/setup-extract/SKILL.md#L51-L64)). The extraction records "Safe to claim", "Needs hedging" and "Do NOT claim" ([L112-116](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/setup-extract/SKILL.md#L112-L116)) and drafts STAR bullet seeds ([L118-125](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/setup-extract/SKILL.md#L118-L125)). The worked example shows the claiming rules in practice, including "Safe verbs for bullets" per contribution ([example_extraction.md](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/examples/extractions/example_extraction.md)).

### `/setup-build-kb`

Turns extractions into one experience file per position, each achievement with 1L, 2L and 3L bullet variants, key skills and ATS keywords ([SKILL.md L37-79](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/setup-build-kb/SKILL.md#L37-L79)). Builds a skills taxonomy with evidence-based proficiency levels ([L120-123](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/setup-build-kb/SKILL.md#L120-L123)), a reframing guide with a lead verb per role type and an "Overclaiming warning" per achievement ([L161-192](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/setup-build-kb/SKILL.md#L161-L192)), and one "bundle" per target role type with a priority matrix, summary guide, reframing map and skills guide ([L201-264](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/setup-build-kb/SKILL.md#L201-L264)).

### `/make-resume`

The tailoring skill and the most relevant to us ([SKILL.md](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/make-resume/SKILL.md)).

- Phase 0 reads the job description, classifies every requirement as Direct, Bridge (with confidence) or Gap, extracts ATS keywords by category, writes a framing strategy, then stops for the user to confirm ([L74-115](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/make-resume/SKILL.md#L74-L115)).
- Phase 1 presents a bullet plan per position, each candidate marked recommended, available or not recommended with its job-description match, then stops again ([L119-159](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/make-resume/SKILL.md#L119-L159)).
- A budget gate refuses to proceed if the bullet count does not match the page budget ([L163-169](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/make-resume/SKILL.md#L163-L169)).
- Phase 2 generates section by section with a character-count gate per position, a page-fill gate and a compile gate that views the PDF ([L173-218](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/make-resume/SKILL.md#L173-L218)).
- All bullet content must come from experience files ([L27](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/make-resume/SKILL.md#L27)).

Detailed rules live in [resume_reference.md](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/resume_reference.md), with a compact re-read in [critical_rules.md](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critical_rules.md).

### `/make-cl`

Cover letters. Every claim must trace to a resume bullet, and every external hook (a named paper, programme or product) must be web-verified or flagged "UNVERIFIED" ([SKILL.md L91-103](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/make-cl/SKILL.md#L91-L103), [cl_reference.md L85-93](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/cl_reference.md#L85-L93)). Out of scope for us except for the package rule that the resume must stand alone ([cl_reference.md L76-81](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/cl_reference.md#L76-L81)).

### `/edit-resume`

Edits from critique or user feedback. Records a baseline, classifies each change as MODIFY, SWAP, ADD, REMOVE, VARIANT CHANGE or FIXED, stops for approval, applies edits one section at a time, then shows a before and after table and marks the last critique stale ([SKILL.md L62-205](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/edit-resume/SKILL.md#L62-L205)). Template-locked sections are refused ([L30-33](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/edit-resume/SKILL.md#L30-L33)).

### `/critique`

Runs in a fresh session for an unanchored read ([DOCS.md L105-117](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/DOCS.md#L105-L117)). Follows [critique_framework.md](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md): a domain-specialist lens, five reader perspectives (ATS, recruiter, HR, hiring manager, technical reviewer), an eight-dimension weighted score, interview likelihood, tiered fixes, interview talking points and a mechanical checklist ([SKILL.md L80-93](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/critique/SKILL.md#L80-L93)).

### Supporting files

- [ai_fingerprint_rules.md](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/support/ai_fingerprint_rules.md): banned words and phrases, structural rules, positive markers and a 12-item scan.
- [shared_ops.md](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/shared_ops.md) and [session_file_template.md](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/session_file_template.md): the per-job session file that records every decision and lets a skill resume after interruption.
- [char_count.py](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/helpers/char_count.py): strips LaTeX and counts rendered characters.
- [example_config.md](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/examples/example_config.md): provenance flags and a "KB Corrections Log" of facts never to reintroduce.

## Guidance extracted

### Accuracy and fabrication

- Priority order for every decision: Accuracy > Relevance > Impact > ATS > Brevity. "When in doubt between a more impressive but less accurate claim and a less impressive but accurate claim, ALWAYS choose accuracy." ([CLAUDE.md L74-77](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/CLAUDE.md#L74-L77))
- Never claim unpublished work as published, internal tools as peer-reviewed, a higher author position, or collaborators' results as the user's own ([CLAUDE.md L79-84](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/CLAUDE.md#L79-L84)).
- Verb discipline: full-ownership verbs (Developed, Built, Engineered, Designed) only for work the user did alone; hedged verbs (Contributed, Provided, Supported) for shared work; "When in doubt, hedge" ([CLAUDE.md L86-89](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/CLAUDE.md#L86-L89)). The README names the failure it prevents: upgrading "contributed to" into "developed" ([README.md L3](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/README.md#L3)).
- Ask the user about their personal contribution before writing anything from a source ([setup-extract L51-64](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/setup-extract/SKILL.md#L51-L64)).
- A corrections log of verified facts, checked before every generation so a fixed error does not return ([example_config.md](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/examples/example_config.md), [critical_rules.md L70-72](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critical_rules.md#L70-L72)).
- Do not present internal code folder names as software packages. Describe the tool instead ([CLAUDE.md L95-96](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/CLAUDE.md#L95-L96)).
- Do not include lines-of-code or test counts ([CLAUDE.md L98-99](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/CLAUDE.md#L98-L99)).
- The technical reviewer pass builds a truthfulness table: claim, verified or not, source ([critique_framework.md L135-147](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L135-L147)).

### Tailoring to a job description

- Classify every requirement as Direct, Bridge (with HIGH, MEDIUM or LOW confidence) or Gap, and extract keywords by category: domain, methods, tools, soft skills ([make-resume L89](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/make-resume/SKILL.md#L89), [session_file_template.md L18-34](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/session_file_template.md#L18-L34)).
- Read the job description three times: for requirements, for culture signals, and for vocabulary. Rank the 8 to 10 key terms by frequency, by placement in the title or header, and by whether they are binary capabilities. Identify the one thing they need most ([critique_framework.md L35-39](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L35-L39)).
- Build a vocabulary map: "Resume currently says" against "Should say for THIS JD" ([critique_framework.md L41-46](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L41-L46)).
- Rank gaps: fatal (binary capabilities, terms in the title, or terms repeated three or more times), serious, cosmetic. For each, ask whether it can be bridged truthfully ([critique_framework.md L48-52](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L48-L52)).
- Gap wording: use "methodology transferable to X" or "equivalent experience with Y", never "experienced with X" unless directly shown. The user decides per gap whether to omit or bridge ([resume_reference.md L267-279](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/resume_reference.md#L267-L279)).
- Write in the target vocabulary from the start rather than translating afterwards ([resume_reference.md L195](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/resume_reference.md#L195)).
- Methodology transfer test: for each top achievement, write one sentence on how an expert at the hiring company would map it to their work. If it cannot be written honestly, it is a hard gap, not a wording problem ([critique_framework.md L54-57](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L54-L57)).
- Select and rank achievements per job, allocating more bullets to the more relevant positions ([resume_reference.md L166-168](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/resume_reference.md#L166-L168), [L186-193](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/resume_reference.md#L186-L193)).
- The bold line above each position is a job-specific theme, called the "single most powerful JD customization lever" ([resume_reference.md L201-212](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/resume_reference.md#L201-L212)).
- Stop for the user to confirm the role type, format and framing, and again for the bullet plan ([make-resume L111-115](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/make-resume/SKILL.md#L111-L115), [L155-159](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/make-resume/SKILL.md#L155-L159)).

### Bullet structure

- STAR: action verb, what was done, quantitative result ([setup-extract L118-125](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/setup-extract/SKILL.md#L118-L125)).
- End on a concrete result, number or object, not an "-ing" phrase such as "...advancing the field" ([ai_fingerprint_rules.md L80](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/support/ai_fingerprint_rules.md#L80)).
- Front-load the concrete thing; use named tools, methods and institutions; use the job description's vocabulary ([ai_fingerprint_rules.md L91-99](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/support/ai_fingerprint_rules.md#L91-L99)).
- Avoid more than two "X, Y, and Z" triplets per document ([ai_fingerprint_rules.md L87](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/support/ai_fingerprint_rules.md#L87)).
- Flag passive voice above 20% of bullet verbs ([ai_fingerprint_rules.md L129](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/support/ai_fingerprint_rules.md#L129)).

### Quantification

- Prefer specific numbers: "Ran 847 MD simulations" over "Conducted extensive simulations" ([ai_fingerprint_rules.md L93](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/support/ai_fingerprint_rules.md#L93)).
- Unpublished work gets no specific numbers or publication claims ([critical_rules.md L53-56](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critical_rules.md#L53-L56)).
- Mentorship example: a concrete outcome is stronger than "guided students" ([example_experience.md L70](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/examples/experience/example_experience.md#L70)).

### Length and page fit

- Resume bullets are exactly two rendered lines, 189 to 205 characters, about 23 to 25 words; aim for the middle of the range, not the maximum ([resume_reference.md L64-94](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/resume_reference.md#L64-L94)).
- The last line of a multi-line bullet must fill at least 70% of the width ([resume_reference.md L119](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/resume_reference.md#L119)).
- A position title and its date must fit on one line ([resume_reference.md L172](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/resume_reference.md#L172)).
- Page fill: at most three lines of white space on the last page; verify by compiling and viewing the PDF ([make-resume L207-216](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/make-resume/SKILL.md#L207-L216)).
- Density per format: a one-page resume holds about six bullets ([resume_reference.md L283-290](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/resume_reference.md#L283-L290)).

### Ordering and section choices

- The first bullet under each position is the strongest job-relevant achievement ([critique_framework.md L114](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L114)).
- Skills group names, not only their contents, should signal the target domain ([critique_framework.md L113](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L113)).
- Summary: 4 to 5 sentences; open with the role identity; one quantified metric; two or three named tools; no "Passionate" or "Motivated" ([resume_reference.md L30](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/resume_reference.md#L30), [example_bundle.md L40-49](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/examples/bundles/example_bundle.md#L40-L49)).
- Fixed sections (education, awards, header) never change per job; only variable sections are generated ([resume_reference.md L219-231](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/resume_reference.md#L219-L231)).
- Narrative arc across positions should progress logically ([critique_framework.md L128](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L128)).
- Omit office tools such as Excel and PowerPoint from skills ([example_bundle.md L87](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/examples/bundles/example_bundle.md#L87)).

### Keywords

- Match the job description's terms verbatim where truthful; flag any term the job description uses three or more times that the resume never uses ([critique_framework.md L81-88](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L81-L88)).
- Over-saturation: a keyword repeated more than 8 times is a concern, 6 to 8 is borderline ([critique_framework.md L145](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L145)).
- Keyword stuffing that feels forced is a hiring-manager red flag ([critique_framework.md L129](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L129)).

### Verbs and banned words

- Banned verbs with replacements: leverage, utilize, harness, spearhead, foster, facilitate, showcase, underscore, bolster ([ai_fingerprint_rules.md L24-36](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/support/ai_fingerprint_rules.md#L24-L36)).
- Banned adjectives: robust, comprehensive, innovative, pivotal, meticulous, diverse, extensive ([L12-22](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/support/ai_fingerprint_rules.md#L12-L22)); plus cutting-edge, novel, groundbreaking, multifaceted, holistic, nuanced ([L10](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/support/ai_fingerprint_rules.md#L10)).
- Banned resume phrases: "proven track record", "passionate about", "demonstrated ability to", "strong foundation in", "well-versed in", "adept at" ([L56-63](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/support/ai_fingerprint_rules.md#L56-L63)).
- Technical exceptions: "landscape" when literal; "novel" when quoting a job description ([L42](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/support/ai_fingerprint_rules.md#L42)).
- There is no list of recommended action verbs. Verb choice is governed by ownership, not by a word bank.

### Review and workflow

- Re-read the session file at the start of every phase, so decisions survive context compaction ([shared_ops.md L51](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/shared_ops.md#L51)).
- Critique in a fresh session so the reviewer is not anchored on the writer's reasoning ([DOCS.md L107](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/DOCS.md#L107)).
- Five reader passes with what each reader sees: recruiter (name, current title, education, tagline, first two summary lines), HR (summary, skills headers, first bullet per position), hiring manager (everything), technical reviewer (every claim against its source) ([critique_framework.md L73-147](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L73-L147)).
- Tiered fixes: Tier 1 must be applied; Tier 3 is "not worth the edit" ([critique_framework.md L210-235](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L210-L235)).
- Edits are classified and approved before they are applied, and a before and after table flags anything that got worse ([edit-resume L98-114](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/edit-resume/SKILL.md#L98-L114), [L186-195](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/edit-resume/SKILL.md#L186-L195)).
- Mid-run feedback never restarts a phase; it patches the affected part and continues ([make-resume L32-39](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/.claude/skills/make-resume/SKILL.md#L32-L39)).

## Sourced and uncited claims

The kit has no external citations. A search of every Markdown file for URLs found only the Claude Code docs, TeX distributions and the repo itself. Nothing could be followed to a primary source. Every factual claim about readers, ATS software or AI detection is uncited:

| Claim | Where | Status |
|---|---|---|
| ATS pattern-matches keywords with "no synonyms (unless configured), no reading comprehension" | [critique_framework.md L79](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L79) | Uncited |
| A keyword match rate of 70% or more passes ATS; below 60% fails | [critique_framework.md L84](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L84), [L463](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L463) | Uncited |
| A recruiter reads for 10 seconds and sees only the header, education and first two summary lines | [critique_framework.md L90-92](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L90-L92) | Uncited |
| HR reads for 30 seconds, a hiring manager for 2 minutes, a technical reviewer for 10 minutes | [critique_framework.md L105-135](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L105-L135) | Uncited |
| "~60% of large employers use ATS/AI on CLs" | [critique_framework.md L292](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L292) | Uncited |
| "Many hiring managers never read the CL" | [cl_reference.md L78](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/cl_reference.md#L78) | Uncited |
| A keyword repeated more than 8 times is over-saturated | [critique_framework.md L145](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L145) | Uncited |
| "-ing" endings on bullets are the "#1 structural AI marker" | [ai_fingerprint_rules.md L80](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/support/ai_fingerprint_rules.md#L80) | Uncited |
| Three consecutive sentences of similar length "flag as AI" | [ai_fingerprint_rules.md L85](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/support/ai_fingerprint_rules.md#L85) | Uncited |
| 85% of score improvement comes from domain reframing; reframing moves scores from about 60 to about 85 | [critique_framework.md L5](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/critique_framework.md#L5), [resume_reference.md L195](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/resume_reference.md#L195) | Uncited. The score is the kit's own critique score, not a hiring outcome, so the claim measures the kit against itself. |
| Bold text renders wider; the width penalty is "COMPILE-VERIFIED" | [resume_reference.md L96-110](https://github.com/ARPeeketi/claude-resume-kit/blob/69930e9de21d5595f9b8c9427adc9c51a9fcbc0e/resume_builder/reference/resume_reference.md#L96-L110) | Internal measurement of the kit's LaTeX templates. Not a claim about readers, and not portable to our HTML print layouts. |

The eight-dimension weights (ATS 15%, Bullets 25% and so on) and the per-reader interview probabilities are also unexplained. They give a precise number with no evidence behind it, so we should not copy them.

The two added sources make few factual claims, and neither cites one:

| Claim | Where | Status |
|---|---|---|
| "Research suggests that capitals are harder to read than lowercase" | [Guardian](https://www.theguardian.com/careers/careers-blog/grammar-rules-cv-top-tips), tip 2 | Uncited. The article's sentence links nothing. |
| Resumes are read by "people who / systems that scan quickly" | [Harvard](https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/), "Resume language should be" | Uncited, and no reading time is given |
| AI output "tends to be generic", so AI "should not be the primary author" | [Harvard](https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/), AI section | Uncited opinion |

## Other sources: Harvard and the Guardian

### Harvard FAS, "Create a strong resume"

A US university careers page aimed at students. Quotes below are from [Harvard](https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/). The action-verb list is a section of the same page ([#verbs](https://careerservices.fas.harvard.edu/resources/create-a-strong-resume#verbs)), not a separate PDF. The page links a [resume sample PDF](https://cdn-careerservices.fas.harvard.edu/wp-content/uploads/sites/161/2026/07/resume-sample.pdf) and a [bullet-point template](https://careerservices.fas.harvard.edu/resources/bullet-point-resume-template/); I did not read those, because the guidance is on the main page.

Guidance:

- Language should be "Specific rather than general", "Active rather than passive", "Fact-based (quantify and qualify)", plain rather than flowery, and written for "people who / systems that scan quickly".
- Top mistakes include spelling and grammar errors, passive language, poor organisation or length, and "Not demonstrating results".
- Don't: "Use personal pronouns (such as I or We)", "Use a narrative style", "Abbreviate", use slang, "Start each line with a date", add a photo, age, gender or reference list.
- Do: "Be consistent in format and content", "Use consistent spacing, underlining, italics, bold, and capitalization", "List headings (such as Experience) in order of importance", list entries "in reverse chronological order (most recent first)", use white space, explain gaps, and check formatting after conversion to PDF.
- "Tailor your resume to the type of position you're seeking." The AI section suggests using AI to "incorporate keywords gleaned from a job description", but says "Generative AI should not be the primary author."
- Action verbs grouped as leadership, communication, research, technical, teaching, quantitative, creative, helping and organisational. Examples: Led, Supervised, Spearheaded, Oversaw; Presented, Drafted, Edited; Conducted, Investigated, Examined; Built, Designed, Engineered, Programmed; Trained, Taught, Facilitated; Budgeted, Forecasted, Maximized; Launched, Monitored, Validated.
- No page limit for the resume. No guidance on tense.

### The Guardian, "Grammar rules for your CV: top tips"

A 2013 newspaper careers column, 13 years old, written for UK CVs. Treat it as editorial advice, not evidence. Its eight tips, from [Guardian](https://www.theguardian.com/careers/careers-blog/grammar-rules-cv-top-tips):

1. Don't rely on spellcheckers. Homophones such as effect and affect, your and you're, their and there pass them.
2. Don't over-capitalise. Be consistent: if a job title is lowercase once, keep it lowercase everywhere. Never capitalise common nouns such as "job" or "employer" mid-sentence.
3. Get apostrophes right: missing letters, possession, and time or quantity.
4. Use the singular for one organisation: "its team", not "their team".
5. Keep the person consistent. First person is standard; don't switch between first and third person.
6. Past jobs take the past tense, the current job the present. Don't switch mid-phrase.
7. Spell out an abbreviation on first use with the abbreviation in brackets, unless it is universally known. No full stops between initials.
8. If in doubt, avoid semicolons.

### What our skills already cover

| Point | Source | Our coverage |
|---|---|---|
| Specific, fact-based, quantified | H | Resume rule "One result per bullet"; unslop 27, 30 |
| Active rather than passive | H | unslop 29; technical-writing "Say who does what" |
| Plain, not flowery; no slang | H | technical-writing "short, everyday word", "Skip idioms, colloquialisms"; unslop 31, 32 |
| Show results | H | Resume rule "One result per bullet" |
| Action verbs | H | Resume rule "A bullet starts with a verb" |
| Tailor to the position | H | Not covered; see recommendation 1 |
| Past tense for past jobs, present for the current one | G 6 | Resume rule "Bullets": present tense when `time` ends in `Present` |
| Don't switch person | G 5 | Resume rule "Person": bullets never use "I" |
| Avoid semicolons | G 8 | technical-writing "Use periods, not semicolons", but not restated in the resume rules |
| Spell out abbreviations | G 7, H | unslop 33 "Spell out arrows and abbreviations", with no exception for well-known terms |
| One name per thing | H (consistency) | unslop 11; technical-writing "Call each thing by one name" |
| Reverse chronological order, headings by importance | H | Handled by the page layout, not the skill |
| Don't start lines with dates; no photo, age or references | H | Handled by the schema and layout: dates sit in `time` |
| Sentence case | G 2 (capitals) | unslop 17 covers headings only |

### What is new

- Proofread for homophones and apostrophes (G 1, G 3). Our check step tests unslop and resume rules, not spelling.
- Consistent capitalisation of job titles, labels and common nouns (G 2, H). Our labels are in title case, for example `**Data Analysis & Visualisation**`; nothing says they must all follow one style.
- Singular for one organisation (G 4).
- An exception for universally known abbreviations (G 7). Without it, unslop 33 would expand "ML" or "API" in every bullet.
- Formatting consistency after conversion to PDF (H). This is our Print Page, see recommendation 13.

### Conflicts

- **Pronouns.** Harvard: no personal pronouns and no narrative style anywhere. Guardian: first person is standard. Our skill: no "I" in bullets, "I" allowed in `introduction` and `now.json`. Bullets agree with Harvard. The current `introduction` ("I've worked across the ML workflow") follows the Guardian. Both readings are defensible; the rule that matters to both sources is consistency within a field.
- **Abbreviations.** Harvard says do not abbreviate at all; the Guardian allows universally known ones; unslop 33 says spell them out. For a technical resume, "SQL", "API" and "ML" are the terms the reader searches for, so the Guardian rule fits best.
- **Verb list.** Harvard's list includes "Spearheaded", "Facilitated" and "Maximized". The kit bans "spearhead" and "facilitate", and unslop 31 prefers plain words. Use Harvard's list only for its plain verbs (Led, Built, Designed, Trained, Launched, Monitored).
- **US spelling.** Harvard writes "organization" and "capitalization". We keep UK spelling.
- **Tense.** Harvard is silent. The Guardian matches our rule.
- **Scope of Harvard's AI warning.** "Generative AI should not be the primary author" cuts against a skill that rewrites the resume. Our traceability rule keeps the user's facts as the source, and the questions step keeps the user in the loop. The report should make each change reviewable so the user stays the author.

## How our skill compares

### Already covered by our skill

| Kit guidance | Our rule |
|---|---|
| Never fabricate; source every claim | Step 4: every claim is traceable to the existing text or the user |
| Ask instead of inventing a number | Step 4: keep the bullet without the number and add a question |
| Action verb first, action, object, result | Resume rules: Bullets, One result per bullet |
| No "-ing" analysis endings | unslop 3 |
| Em dash limit of 2 per document | unslop 13 is stricter: none at all |
| Banned AI vocabulary | unslop 7, 26, 31 (partial overlap, see below) |
| Named tools, correct spelling | Resume rules: Tools |
| Specific numbers over vague adverbs | unslop 27, 30 |
| No forced triplets | unslop 10 |
| Active voice | unslop 29 |
| Edit only variable parts | Prose fields list; ids, `time`, `visibility` untouched |
| Fixed versus variable sections | Our whole-Section override: a Resume Version holds only the Sections it changes |
| Build verifies output | Step 6: `bun run build` |
| Report changes that alter a fact | Step 7 |

### Missing from our skill and worth adopting

1. Any job-description workflow (analysis, Direct/Bridge/Gap, keyword map, approval stop).
2. Verb discipline tied to ownership, and the accuracy-first priority order.
3. Honest gap wording and a rule against claiming a job-description term the source does not support.
4. Ordering: strongest job-relevant bullet first in each entry, most relevant entries first.
5. Section selection for a Resume Version: which Sections to override for this job.
6. A reader-pass review (recruiter view of the header, then every claim against its source).
7. Resume-specific banned phrases that unslop 7 does not list.
8. Internal names presented as products.
9. Keyword repetition cap.
10. A proofreading pass for homophones, apostrophes and semicolons (Guardian).
11. Consistent capitalisation of labels and job titles (Guardian, Harvard).
12. An exception to unslop 33 for well-known abbreviations (Guardian).
13. A check that the `resume_print` Surface still fits one page.

### Conflicts with our setup

| Kit guidance | Why it does not fit |
|---|---|
| Character counts, bold-width penalty, 70% orphan rule, `char_count.py` | Calibrated to the kit's LaTeX geometry. Our Print Layouts are HTML and CSS, with two-column and one-column variants that wrap differently. |
| Two-page resume, ~20 bullets, "pad" short bullets to fill lines | Our Resume Print Layouts are one page. Padding conflicts with unslop 23 and the technical-writing rule to cut every word that does no work. |
| Replace extra em dashes with semicolons or parentheses | technical-writing says use periods, not semicolons; unslop 13 forbids parentheses as dashes. |
| FLIPPED position title: replace the bold line with a job-specific theme | Our experience `jobTitle` is the real title at the employer. Changing it misstates the job. The nearest safe lever is the bullet `**Label**`. |
| Write every bullet fresh from a knowledge base | We have no knowledge base. The existing `index` content and the user's answers are our source of truth. Rewriting "fresh" would break traceability. |
| Session files, `CLAUDE.md` Active Sessions, corrections log in `CLAUDE.md` | Our `CLAUDE.md` is checked-in project instructions, not per-job state. Writing to it per job is out of place. |
| Mandatory company web research | Feeds the cover letter, which we do not produce. Optional for us at most. |
| Weighted score out of 100, interview probabilities | Uncited numbers; false precision. |
| Publications, "et al.", immigration line, funding versus awards | Academic CV rules with no matching Section in our schema. |
| US spelling throughout ("optimization", "utilize") | We use UK spelling. |

## Recommendations for `.claude-dev/skills/resume/SKILL.md`

Ranked by expected value for a per-job Resume Version. Proposed wording is written to drop into the skill as is.

### 1. Add a tailoring procedure for a job description

Our Resume Versions exist for one job each, and the skill currently has no step that reads the job. All three sources tell the writer to tailor; Harvard also suggests taking keywords from the job description. Add a second procedure, used when the arguments include a job description (a file path or pasted text) and a Resume Version slug.

> ## Tailor to a job description
>
> Use these steps when the arguments include a job description. The scope is one Resume Version folder, never `index`.
>
> 1. Read the job description in full. List its requirements, and mark each one **Direct** (the `index` content shows it), **Bridge** (related work exists, give the evidence) or **Gap** (nothing in the content or from the user supports it).
> 2. List the 8 to 10 terms the job description uses most or puts in its title. Write each one as the job description spells it.
> 3. For each term, find the `index` text that supports it. Where the content says the same thing in other words, plan to use the job description's word. Where nothing supports it, add it to the Gaps.
> 4. Choose the Sections to override. Copy a Section into the version only when its text, order or selection changes for this job. Every other Section stays inherited from `index`.
> 5. Write a plan: the requirement table, the Sections to override, the entries and bullets to keep, reorder or hide, and one question per Gap.
> 6. Stop and show the plan. Wait for the user to approve it before you create or edit any file.
> 7. Apply the approved plan, then run the [Steps](#steps) from step 4 on the version folder.

### 2. Add verb discipline and an accuracy-first order

Our "traceable" rule stops invented facts but not inflated verbs. A rewrite that turns "contributed to the pipeline" into "built the pipeline" passes our current checks.

> - **Ownership.** Use "built", "designed", "led" or "developed" only when the source says the user did that work alone or led it. For shared work, use "co-developed", "contributed to" or "worked with". If the source does not say, keep the verb from the source and ask the user.
> - **Priority.** When two rules pull apart, follow this order: accuracy, then relevance to the job, then impact, then keywords, then length. Never trade accuracy for a stronger claim.

### 3. Add honest gap wording

> - **Gaps.** Never write that the user has experience with a tool, method or domain that the source does not show. When a job asks for X and the source shows a close equivalent Y, name Y, and add "comparable to X" only after the user approves it. List every Gap in the report, with its question.

### 4. Add ordering rules

> - **Order.** In each experience and project, put the bullet that matches the job most closely first. In a Resume Version, order projects by relevance with `order`, and hide an entry that does not help this job with `visibility.resume_print: false` instead of deleting it.

### 5. Treat the header as the first read

The kit's 10-second figure is uncited, but its point (the header is read first and sometimes only) shapes where tailoring matters most. Our skill currently allows `jobTitle` changes "only on request".

> - **Header.** In a Resume Version, the first sentence of `introduction` names the role the job asks for and the user's strongest matching fact. Change `jobTitle` to the job's title only when it describes work the user has done, and say so in the report.

### 6. Add a reader-pass review step

A lighter version of the kit's five perspectives, without scores. Insert it after our current step 5.

> 6. Read the result twice. First, read only `header.json` and the first bullet of each entry, and check that they answer the job's top requirement. Second, read every bullet and check each claim against its source: name the source line or the user's answer. Fix or flag any claim with no source.

### 7. Add a proofreading pass

From the Guardian (tips 1, 3, 4 and 8). Our check step tests style rules, not spelling, and the current content has semicolons in bullets (for example `themather-datascientist.md`). Add to the check step:

> - **Proofread.** Read each field for words a spellchecker passes: effect and affect, your and you're, its and it's, their and there. Check every apostrophe. Refer to one organisation as "it", not "they". Split a bullet at any semicolon, or rewrite it as one clause.

### 8. Keep capitalisation consistent

From the Guardian (tip 2) and Harvard ("consistent ... capitalization").

> - **Capitals.** Write every bullet label in the same case. Use sentence case for new labels, for example `**Data analysis and visualisation**`. Capitalise a job title the same way everywhere it appears. Never capitalise a common noun such as "pipeline" or "dashboard" mid-sentence.

If the user prefers the current title-case labels, the rule becomes "keep title case in every label"; the point is one style.

### 9. Allow well-known abbreviations

From the Guardian (tip 7). This overrides unslop 33 for resumes, because a technical reader searches for the abbreviation.

> - **Abbreviations.** Keep an abbreviation that the job description uses or that a developer would say aloud, such as SQL, API, ML or CI. Spell out any other abbreviation on first use, with the abbreviation in brackets after it. Write initials without full stops.

### 10. Extend the banned list for resumes

unslop 7 does not cover the resume clichés the kit lists. Harvard's verb list includes some of them ("Spearheaded", "Facilitated"), so name them explicitly. Add them as a resume rule rather than editing unslop.

> - **Resume clichés.** Do not use: spearhead, facilitate, maximise, robust, comprehensive, cutting-edge, innovative, novel, extensive, "proven track record", "passionate about", "demonstrated ability to", "strong foundation in", "well-versed in", "adept at", "results-driven". Use a job-description term only where it describes the user's work.

### 11. Cap keyword repetition

The kit's threshold of 8 is uncited and assumes two pages. For one page, a lower cap is our own judgement.

> - **Keywords.** Use a job-description keyword where the work happened. Do not repeat one keyword in more than three bullets.

### 12. Ban internal names presented as products

> - **Internal names.** Do not present a repository, folder or internal service name as if it were a known product. Say what it does: "a Django starter template", not the repository name.

### 13. Check the one-page Print Layout

Our skill says entries with `resume_print: true` share one printed page but has no step that checks it. The kit's compile gate views the output for this reason, and Harvard says to check formatting after conversion to PDF.

> 8. After the build passes, open `/resume-print/<version>` (or `/resume-print` for `index`) in the `resume-two-cols` and `resume-one-col` layouts and confirm each fits one page. If one does not, cut or hide the least relevant bullet and check again.

## Open questions

1. Where should the job description and the tailoring plan live? The kit keeps a session file per job. Options for us: the report only; a file under `.scratch/<slug>/`, which matches our issue-tracker convention; or a file in the version folder. A non-JSON, non-`experiences`/`projects` file inside `src/content/resume/<version>/` needs checking against `resume-loaders.ts` before we use it.
2. Should tailoring and rewriting be two skills? The kit splits generation, editing and critique into separate skills and fresh sessions. Our single skill could grow a mode instead, as recommendation 1 proposes. A separate critique run in a fresh context would give an unanchored review, at the cost of another invocation.
3. Do we want a corrections log? The kit's log stops a fixed fact from coming back. For us it could be a short list in the skill or in `docs/content-formats/resume.md`. It is useful only if the same wrong fact appears more than once.
4. How should the one-page check run? An agent cannot see print pagination from `bun run build`. Options: the user checks, the `run` skill takes a screenshot, or a test measures the rendered height. Each has a different cost.
5. Can bullet labels carry job vocabulary? Our `**Label**` is the closest safe equivalent of the kit's job-specific position theme. Rewording labels per Resume Version fits the format, but labels also serve the web resume through `index`, so changes belong only in version folders.
6. Should `introduction` keep "I"? Harvard says no pronouns and no narrative style; the Guardian says first person is standard. Our skill allows "I" there. A pronoun-free introduction ("Data scientist and developer with four years of ...") would satisfy both sources, but the choice is the user's.
7. The kit's 23 to 25 word target for a two-line bullet is close to our 30-word cap. Whether 30 words still fit two lines in our two-column layout is untested.
