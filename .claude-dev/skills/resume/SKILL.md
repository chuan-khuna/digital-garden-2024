---
name: resume
description: Write and proofread resume content in British English, by the Harvard and Guardian CV rules, with technical-writing and unslop.
disable-model-invocation: true
---

# Resume

Help the user write resume content that a recruiter reads in one pass and the user can defend line by line in an interview. The user gives the text: a bullet, an entry, a summary, a whole resume, or notes about their work. You return the text, ready to paste.

The rules come from these sources, in this order of precedence:

1. [Resume rules](#resume-rules) below, which adapt everything after them to a CV. The content rules come mainly from Harvard FAS Career Services, ["Create a strong resume"](https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/). The grammar rules come mainly from the Guardian, ["Grammar rules for your CV: top tips"](https://www.theguardian.com/careers/careers-blog/grammar-rules-cv-top-tips).
2. The **technical-writing** and **unslop** skills.
3. House style: British English, the grammar of Craig Shrives' _Smashing Grammar_, and the prose habits of Gary Provost's _100 Ways to Improve Your Writing_.

## Steps

1. Read the **technical-writing** and **unslop** skills in full.
2. If the user gives a job description, do the [tailoring](#tailoring) steps first.
3. Rewrite the text to the [content rules](#content). Every claim in the result is **traceable**: it comes from the user's text or from the user's answers. Where a bullet needs a number or a result that the user has not given, keep the bullet without it and add a question.
4. Proofread the text to the [grammar rules](#grammar) and [British spelling](#british-spelling). Read each sentence aloud in your head, word by word. A spellchecker passes homophones, so check each one by meaning.
5. Check the text against every resume rule and every unslop rule by number. The step is done when no line fails a rule.
6. Return the rewritten text, ready to paste. After it, list each change that altered a fact or dropped a claim, then the questions for the user. The user stays the author, so make each change easy to accept or reject.

## Resume rules

### Content

Harvard asks for writing that is specific, active, fact-based and plain, for a reader who scans.

- **One result per bullet.** Write the action, the thing it acted on, and the result. Quantify with the user's number. Qualify with the scale or the users when there is no number: how many sites, cameras, users or teams.
- **Plain action verbs.** Start each bullet with a plain verb from Harvard's list: built, designed, developed, led, trained, analysed, deployed, automated, monitored, launched, presented, wrote.
- **Ownership.** Use "built", "designed" or "led" when the user did that work alone or led it. Use "co-developed" or "contributed to" for shared work. When the text does not say, keep its verb and ask.
- **Evidence, not adjectives.** Replace a self-description, such as "passionate", "results-driven", "hard-working" or "team player", with the fact that shows it.
- **Specific nouns.** Name the tool, dataset or system. "Detect vehicles on 12 CCTV feeds with YOLO" tells the reader more than "work on computer vision solutions".
- **Most relevant first.** Order the bullets in an entry by relevance to the target role.
- **Length.** Keep a bullet to 30 words or fewer, about two printed lines.
- **Labels.** When bullets start with a bold label (`**Label**: text.`), the label names the area of work in two to four words, in sentence case. The text after it adds what the label does not say (unslop 16).

### Person and tense

- **Bullets** have no subject and no pronoun (Harvard). The verb starts the line.
- **Summaries and profiles** use the first person, consistently (Guardian). Keep "I" from the first sentence to the last. Stay out of the third person.
- **Tense.** Use present tense for the current role, and past tense for every other entry (Guardian). Use the past tense inside a current role only for a finished piece of work, and keep one tense within a bullet.

### Grammar

These rules come from the Guardian and _Smashing Grammar_.

- **Homophones.** Check each of these by meaning: affect and effect, its and it's, your and you're, their, there and they're, practice and practise, licence and license, principal and principle, complement and compliment, discreet and discrete, stationary and stationery.
- **Apostrophes** mark missing letters (`it's`), possession (`the team's model`), and time or quantity (`two years' experience`). Plurals and acronym plurals take none: `APIs`, `the 2010s`.
- **One organisation is singular.** "The company and its data team", not "their data team".
- **Capitals.** Capitalise proper nouns only. Write job titles and common nouns, such as "data scientist", "job" and "employer", in lower case inside sentences, and keep the same choice everywhere. Spell product names as their makers do: `PostgreSQL`, `RF-DETR`, `TimescaleDB`, `GitHub`.
- **Abbreviations.** Keep an abbreviation that every reader in the field knows as it is: `SQL`, `API`, `ML`, `CV`, `AWS`. Spell out any other on first use, with the abbreviation in brackets: "Recency, Frequency, Monetary (RFM) analysis". Write initials without full stops. This rule replaces unslop 33 for abbreviations.
- **Quotation marks.** Use straight quotes, `"` and `'`, for quotation marks and apostrophes alike (unslop 19).
- **Semicolons.** Use a full stop and two bullets, or a comma. A bullet that holds a semicolon holds two results, so split it.
- **Compound adjectives.** Hyphenate a compound adjective before its noun ("an end-to-end pipeline", "a real-time feed") and leave it open after the verb ("the pipeline runs end to end"). Leave an "-ly" adverb open: "a widely used model".
- **Lists.** Use the serial comma, consistently. Join items with "and", not "&".
- **Fewer and less.** "Fewer" goes with things you count (fewer false alarms), "less" with amounts (less memory).
- **Numbers.** Use figures for every metric, measurement and count of 10 or more. Spell out one to nine in prose, except before a unit (`3 GB`, `5 ms`).

### British spelling

- `-ise` and `-isation`: analyse, standardise, visualise, organisation, optimisation.
- `-our`: behaviour, colour, labour.
- Doubled `l`: modelling, labelled, travelled.
- Nouns and verbs: practice (noun), practise (verb). Licence (noun), license (verb).
- "Programme" for a scheme or a course, and "program" for software.
- Keep the maker's spelling in a proper noun or a code identifier, such as the CSS property `color`.

### Rhythm

These rules come from _100 Ways to Improve Your Writing_. They apply to summaries, profiles and other prose. Bullets follow the content rules.

- Vary the sentence length. Put a short sentence after a long one.
- Prefer a strong verb to a verb and an adverb, and a concrete noun to an abstract one.
- Cut "very", "really" and "just".
- Replace a cliché with the literal statement.

### Reader

The technical-writing rules on Diátaxis and on addressing the reader as "you" do not apply. A resume talks about the writer.

## Tailoring

Use these steps when the user gives a job description.

1. Read the job description. List each requirement.
2. Sort each requirement against the user's text:
   - **Direct**: the text shows it.
   - **Bridge**: the text shows a close equivalent.
   - **Gap**: the text does not show it.
3. Write a plan: the entries to keep, the bullets to reorder or rewrite, and the job's terms each change uses. Use a term from the job description only where the user's text supports it. For a Bridge, name what the user did, not what the job asked for. For a Gap, write a question for the user.
4. Stop and show the plan. Rewrite only after the user approves it.
5. Do the [steps](#steps), with the approved plan as an extra source.
