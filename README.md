# Mayflower State Code — public reader

A static, mobile-friendly legal code reader for the State of Mayflower, modeled on the public UCMJ reader in [JAGC-Site](https://github.com/officalbusinesscloudy/JAGC-Site). It is designed for GitHub Pages and requires **no server, API key, authentication, or database**.

**Publication status:** The repository does not yet contain an approved Mayflower statutory text. The website deliberately shows an empty-library notice instead of inventing provisions or importing an unrelated jurisdiction's code. Do not describe the site as an authenticated official legal publication until an approved source is loaded and reviewed.

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
    "number": "1-101",
    "chapter_id": "chapter-1-1",
    "heading": "Definitions",
    "text": "(a) First subsection text.\n\n(b) Second subsection text.",
    "history": [],
    "notes": ""
  }]
}
```

Stored section `10-111` under title 10 is displayed as `10 M.S.C. § 111`. Explicit `title_number` and `section_number` fields are also supported. The above is a **schema demonstration only**, not enacted law. Source text belongs solely in `sections[].text`. Separate paragraphs with a blank line; preserve actual numbering and punctuation. Section numbers must be unique. Title and chapter IDs must be unique, and each chapter/section must reference a real parent. Make legal edits only against an approved authoritative source. Use `history` only for documented enactments/amendments; never infer dates or legislative histories.

Supported features: title and chapter contents, title/section filtering, citation lookup (`10 M.S.C. § 111(a)`; equivalent shorthand accepted), keyword/phrase search, stable direct links (`?section=1-101#section-1-101-a`), subsection anchors, related-section links in text, copy citation/link, adjacent provision links, mobile contents drawer, and print layout.

## GitHub Pages

Go to **Settings → Pages → Build and deployment**, select **Deploy from a branch**, branch **main**, folder **/(root)**, and save. Alternatively use any static file server. Because the site uses relative URLs it also works on `username.github.io/MayflowerStateCode/`.

## Legal accuracy checks

Before release verify all title/chapter references, exact provision text, subsection anchors, internal citations, and amendment dates against the approved State Code. Check in a mobile and desktop browser, test search and deep links, and audit source diffs before every publication. **Never substitute the JAGC UCMJ for state law.**
