# Mayflower State Code — public reader

A static, mobile-friendly legal code reader for the State of Mayflower, modeled on the public UCMJ reader in [JAGC-Site](https://github.com/officalbusinesscloudy/JAGC-Site). It is designed for GitHub Pages and requires **no server, API key, authentication, or database**.

**Publication status:** A working **unapproved consolidation draft** has been imported from the former State Code spreadsheet. The draft is **not enacted law**. Some old provisions are held for review because they are inactive, repealed, dependent on the former Central Authority, or create overlapping executive agencies. The source and migration crosswalk are preserved under `data/legacy/`. Internal legacy cross-references, classifications, agency powers and penalties still require substantive legal review.

## Publishing the Code

Edit `data/code.json`. Schema:

```json
{
  "title": "Mayflower State Code",
  "edition": "Approved edition date or designation",
  "updated": "2026-10-27",
  "titles": [{"id":"title-1","number":"1","heading":"GENERAL PROVISIONS"}],
  "chapters": [{"id":"chapter-1-1","title_id":"title-1","number":"1","heading":"GENERAL"}],
  "sections": [{
    "number": "1-1",
    "chapter_id": "chapter-1-1",
    "title_number": "1",
    "section_number": "1",
    "heading": "Definitions",
    "text": "(a) First subsection text.\n\n(b) Second subsection text.",
    "history": [],
    "notes": ""
  }]
}
```

Stored section `8-1` under title 8 is displayed as `8 M.S.C. § 1`. The chapter number does not appear in the section citation, and numbering starts from § 1 within each title. Explicit `title_number` and `section_number` fields are also supported. The above is a **schema demonstration only**, not enacted law. Source text belongs solely in `sections[].text`. Separate paragraphs with a blank line; preserve actual numbering and punctuation. Section numbers must be unique. Title and chapter IDs must be unique, and each chapter/section must reference a real parent. Make legal edits only against an approved authoritative source. Use `history` only for documented enactments/amendments; never infer dates or legislative histories.

Supported features: title and chapter contents, title/section filtering, citation lookup (`10 M.S.C. § 111(a)`; equivalent shorthand accepted), keyword/phrase search, stable direct links (`?section=8-1#section-8-1-a`), subsection anchors, related-section links in text, copy citation/link, adjacent provision links, mobile contents drawer, and print layout.

## GitHub Pages

Go to **Settings → Pages → Build and deployment**, select **Deploy from a branch**, branch **main**, folder **/(root)**, and save. Alternatively use any static file server. Because the site uses relative URLs it also works on `username.github.io/MayflowerStateCode/`.

## Legal accuracy checks

Before release verify all title/chapter references, exact provision text, subsection anchors, internal citations, and amendment dates against the approved State Code. Check in a mobile and desktop browser, test search and deep links, and audit source diffs before every publication. **Never substitute the JAGC UCMJ for state law.**

## Reorganization and citation history

The consolidated draft uses title → chapter → section. There are currently 32 substantive chapters and 327 draft sections across the retained nine-title structure. Related old administrative provisions have been grouped, including the State Bar provisions formerly shown as numerous standalone entries. Individual criminal and traffic offenses remain separate to avoid conflating distinct legal elements and penalties. Older draft deep links are still recognized by the reader, and the citation crosswalk is in `data/legacy/citation-crosswalk.json`.

This editorial restructuring does not itself enact, repeal, or amend law. All existing internal cross-references that still point to the former numbering need verification before the text is approved.

## Automated Code Integrity Check

Run `node scripts/check-code.mjs` after any change to `data/code.json`. The script checks section identity and parent relationships, current M.S.C. citations, obsolete title/subtitle/chapter references, grouped source-text consistency, and short-title or legacy-penalty artifacts. It fails with a nonzero exit code if a structural error is found.

The full November 3, 2026 audit and remaining substantive legal-review items are documented in [CODE_AUDIT.md](CODE_AUDIT.md). A passing structural audit does not constitute enactment, approval, or legal validation of proposed provisions.

## Historical Archive (1991 setting)

The site also publishes a separate history reader at [history/](history/). Its in-universe present is **1991**; events after 1991 are not treated as completed history. The archive is distinct from the State Code and Executive Orders and does not have legal effect.

The history reader is a zero-build static module app. Its entrypoint is `history/index.html`; `history/app.js` handles article links (`?article=slug`), full-text search (`?q=term`), chronology (`?view=timeline`), copy-link and print controls. Articles are stored in arrays exported from `history/data/*.js`; each item has an `id`, `title`, `period`, `group`, `summary`, and `sections`, with headings and paragraphs. Add new articles to a module imported by `history/app.js` and keep article IDs unique.

The published narrative combines user-established Union of Columbia and Mayflower foundations with newly written alternate-history details. Names, dates and events added in the archive are editorial canon developed for this edition rather than documentary claims about real-world history. Revisions should preserve historical consistency and be reviewed before publication. The reader uses the existing site's branding and works on the same GitHub Pages deployment without build tooling.
