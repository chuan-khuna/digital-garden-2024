---
name: polish-writing
description: Proofread and polish an article in British English, by the grammar of Smashing Grammar and the prose habits of 100 Ways to Improve Your Writing, with technical-writing and unslop.
disable-model-invocation: true
---

# Polish writing

Help the user polish an article so a reader gets through it in one pass and the user still hears their own voice in it. The user gives the text: a paragraph, a section, a whole post or note, or a file path. You return the text, ready to paste or saved back to the file.

The rules come from these sources, in this order of precedence:

1. [Article rules](#article-rules) below, which adapt everything after them to an article. The grammar rules come mainly from Craig Shrives, _Smashing Grammar_. The prose rules come mainly from Gary Provost, _100 Ways to Improve Your Writing_.
2. The **technical-writing** and **unslop** skills.
3. House style: [British spelling](#british-spelling) and British punctuation.

## Steps

1. Read the **technical-writing** and **unslop** skills in full.
2. Read the whole article before you change a word. Name, in one sentence, the point of the article and who reads it. If you cannot, ask the user before you rewrite.
3. Edit the [structure](#structure): the opening, the order of sections, the paragraphs and the ending. Keep every fact and every opinion. Every claim in the result is **traceable**: it comes from the user's text or from the user's answers. Where a passage needs an example, a number or a source that the user has not given, keep the passage without it and add a question.
4. Edit the [prose](#prose), sentence by sentence.
5. Proofread the text to the [grammar rules](#grammar) and [British spelling](#british-spelling). Read each sentence aloud in your head, word by word. A spellchecker passes homophones, so check each one by meaning.
6. Check the text against every article rule and every unslop rule by number. The step is done when no line fails a rule.
7. Return the polished text. If the user gave a file, edit the file in place. After it, list each change that altered a fact, dropped a claim or moved a section, then the questions for the user. The user stays the author, so make each change easy to accept or reject.

## Article rules

### Leave alone

- Frontmatter keys and values, except `title` and `description`, which you proofread.
- Code, inline code, commands, file paths, URLs and identifiers.
- Wiki links (`[[Note title]]`, `[[Note title|label]]`): keep the target exactly. You may proofread the label.
- Quotations from other people. Fix only an obvious typo, and say so.
- Text in a language other than English.

### Structure

These rules come from _100 Ways to Improve Your Writing_.

- **The opening.** The first paragraph tells the reader what the article is about and why it matters to them. Cut a warm-up paragraph that the article would not miss, such as a dictionary definition or "In today's world".
- **One idea per paragraph.** Start a new paragraph when the idea changes. Vary paragraph length, and let a one-sentence paragraph carry a point you want to land.
- **Order.** Put the sections in the order the reader needs them. Move a section only when the reader would otherwise meet a term or an idea before it is explained.
- **Headings.** Each heading names what its section says, in sentence case (unslop 17).
- **Specific detail.** Prefer the example, the number and the name to the general statement. Where the text is general and the user knows the specific, ask for it.
- **Show, then tell.** Give the example or the evidence, then the conclusion it supports.
- **The ending.** End on the last thing the reader needs: the result, the decision, the next step or the open question. Cut a closing summary that repeats the article (unslop 25).

### Prose

These rules come from _100 Ways to Improve Your Writing_, and add to the technical-writing and unslop rules.

- **Rhythm.** Vary the sentence length. Put a short sentence after a long one. Read three sentences of the same length as a fault.
- **Strong verbs and concrete nouns.** Prefer a strong verb to a verb and an adverb, and a concrete noun to an abstract one.
- **Emphasis at the end.** Put the word that matters most at the end of the sentence.
- **Cut qualifiers.** Cut "very", "really", "just", "quite", "rather", "somewhat" and "a bit". Keep a qualifier that changes a fact.
- **Clichés.** Replace a cliché with the literal statement.
- **Parallel structure.** Write the items of a list, and the halves of a comparison, in the same grammatical form.
- **Jargon.** Use a term of art when the reader knows it. Define any other term on first use, or replace it with the plain word.
- **Voice.** Keep the user's person ("I", "we" or "you") and register. Polish the voice; do not replace it.

### Grammar

These rules come from _Smashing Grammar_.

- **Homophones.** Check each of these by meaning: affect and effect, its and it's, your and you're, their, there and they're, practice and practise, licence and license, principal and principle, complement and compliment, discreet and discrete, stationary and stationery, lose and loose, then and than, whose and who's.
- **Apostrophes** mark missing letters (`it's`), possession (`the team's model`), and time or quantity (`two years' experience`). Plurals and acronym plurals take none: `APIs`, `the 2010s`.
- **Collective nouns.** Treat one organisation as singular: "the company and its data team". Keep the choice through the article.
- **Commas.**
  - Put a comma after a long introductory phrase or clause.
  - Put commas round a non-restrictive clause or phrase ("The model, which I trained last year, still runs") and none round a restrictive one ("The model that I trained last year still runs").
  - Do not join two sentences with a comma. Use a full stop, a semicolon or a conjunction.
- **That and which.** Use "that" for a restrictive clause and ", which" for a non-restrictive one.
- **Semicolons** join two closely linked sentences, or separate list items that hold commas. Use one at most per paragraph.
- **Colons** go before a list, an example or an explanation, after a complete sentence (unslop 14).
- **Dangling modifiers.** The subject of the main clause does the action in an opening phrase. "After training the model, the accuracy rose" becomes "After I trained the model, the accuracy rose".
- **Who and whom; I and me.** Use "whom" and "me" for the object. Test by turning the sentence round.
- **Fewer and less.** "Fewer" goes with things you count (fewer false alarms), "less" with amounts (less memory).
- **Compound adjectives.** Hyphenate a compound adjective before its noun ("an end-to-end pipeline") and leave it open after the verb ("the pipeline runs end to end"). Leave an "-ly" adverb open: "a widely used model".
- **Lists.** Pick the serial comma or no serial comma, and keep the choice through the article. Join items with "and", not "&".
- **i.e. and e.g.** "i.e." means "that is", "e.g." means "for example". Prefer the English words in prose.
- **Capitals.** Capitalise proper nouns only. Spell product names as their makers do: `PostgreSQL`, `GitHub`, `TypeScript`.
- **Abbreviations.** Keep an abbreviation that every reader of the article knows. Spell out any other on first use, with the abbreviation in brackets. Write initials without full stops. This rule replaces unslop 33 for abbreviations.
- **Numbers.** Spell out one to nine in prose, and use figures for 10 and above, and for every measurement (`3 GB`, `5 ms`). Spell out a number that starts a sentence, or reword the sentence.

### British punctuation

- **Quotation marks.** Use straight quotes (unslop 19). Keep the article's existing choice of single or double quotes; for a new article, use single quotes, with double quotes for a quote inside a quote.
- **Punctuation and quotes.** Put a full stop or a comma inside the closing quote only when it belongs to the quoted words.
- **Dates.** Write "17 November 2026", with no comma and no ordinal suffix.

### British spelling

- `-ise` and `-isation`: analyse, standardise, visualise, organisation, optimisation.
- `-our`: behaviour, colour, labour.
- `-re`: centre, metre, fibre.
- Doubled `l`: modelling, labelled, travelled.
- Nouns and verbs: practice (noun), practise (verb). Licence (noun), license (verb).
- "Programme" for a scheme or a course, and "program" for software.
- Keep the maker's spelling in a proper noun or a code identifier, such as the CSS property `color`.

### Technical-writing rules

The technical-writing rules apply. Use Diátaxis to name the article's mode, and keep the article to that mode. Where the article mixes modes, point that out as a question, and do not split the article without the user's approval.
