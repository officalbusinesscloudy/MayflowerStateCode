# Mayflower State Code — Comprehensive Citation and Integrity Audit
**Audit date:** November 3, 2026  
**Repository:** `officalbusinesscloudy/MayflowerStateCode`  
**Status:** Editorial review of an **unapproved consolidation draft**, not legislative enactment.

## Scope and method
Reviewed the complete active `data/code.json` dataset against its own titles, chapters, sections, subsection rendering, and preserved `data/legacy/` citation sources. Examined the reader in `assets/app.js` and its ability to search and link nested and historical citations. The active dataset consists of **9 titles, 32 chapters, and 327 sections**. The archived migration crosswalk and historical source files remain untouched.

The audit included individual code references, citations to former title/subtitle/chapter structures, citation ranges, decimal references, stand-alone short-title text, legacy classification/penalty metadata, and references embedded in grouped statutory parts. A new integrity checker is available at `scripts/check-code.mjs`.

## Source corrections committed
- **287** direct historical citation occurrences were mapped to current sections using the migration crosswalk or a uniquely supported source mapping.
- **7** historical chapter references were mapped to current sections.
- **15** former multi-section citation ranges were mapped to a consolidated current section where the endpoints had a supported common destination.
- **16** obsolete decimal-style citations were normalized to their existing parent section. Their former subsection-level precision **has not been independently restored**.
- **21** nonoperative short-title/long-title units and **4** corresponding title-only parts were removed from the active statutory presentation.
- **211** imported legacy classification/penalty metadata records were removed from the active dataset; historical source data is preserved in `data/legacy/`. Express classifications or sentences written in operative statute text remain subject to the statute and still require legal review.
- Fixed the exemption in **4 M.S.C. § 8(a)(2)**: it now refers to the State Intelligence Administration provision at **4 M.S.C. § 9**, limits exceptions to written and narrowly tailored administrative exemptions, and preserves constitutional, judicial, and criminal-law constraints.
- Removed unsupported references to defunct criminal, vehicle, and administrative provisions; corrected the inactive idling citation, vehicle lighting provisions, conservation enforcement, administrative employment references, and numerous cross-title connections.
- Replaced the nonoperative “See Statute” placeholder in **7 M.S.C. § 1** with proposed operative offense text, requiring legislative review.
- Removed obsolete “Active status” / “By Conviction” multiplier provisions and outdated sentencing classification references from the active text.
- Renumbered parking-enforcement clauses after removing an inactive idling entry.
- Improved the reader's nested citation anchors, historical citation lookup, and link formatting for citations like `4 M.S.C. § 8(a)(2)`.

## Integrity check result
`node scripts/check-code.mjs` validates title/chapter/section integrity, duplicate citation numbers, source/rendered text consistency, obsolete source citation formats, unsupported cross-references, residual short-title filler, legacy penalty fields, and obvious placeholders.

**Result: 0 structural errors, 1 review note.** The remaining automatic review note is that **Title 1 (General Provisions) contains no operative sections**. Title 2 contains two sections and Title 3 contains one; those titles need substantive drafting, not renumbering.

The checker is a structural audit, not a constitutional validity or legal-policy certification.

## Substantive drafting issues requiring decisions

| Priority | Provision | Issue | Recommended next action |
|---|---|---|---|
| Critical | **8 M.S.C. § 4 — Capital Punishment** | Defines death sentences and unusually broad collateral property seizure, creating significant due-process and proportionality questions. | Conduct a complete constitutional and sentencing-law review before enactment. |
| High | **8 M.S.C. § 9 and 7 M.S.C. § 90 — Felony Murder / First-degree murder** | Overlapping bases for homicide liability and differing predicate-felony theories. | Consolidate the offenses and require a clear causal and culpability standard. |
| High | **4 M.S.C. §§ 8–9 — Intelligence** | Administrative exceptions and information-classification authority must be reconciled with judicial oversight and the role of the Governor. | Approve a single coherent structure with recorded exceptions and limited operational authority. |
| High | **4 M.S.C. § 19 — Classification of Government Information** | Extensive classification rules and related penalties require coordination with privacy, disclosure, and criminal-law safeguards. | Review classification authority, appeal mechanisms, and the four classification levels. |
| High | **8 M.S.C. § 6 — Limitations on Proceedings** | The recodification removed obsolete sentencing multipliers and adopted uniform limitations language; this is a substantive policy choice. | Confirm limitation periods and penalty ceilings through the legislative process. |
| High | **7 M.S.C. § 1 — Unauthorized Distribution of Classified Information** | The original source had no operative offense text; the replacement is a proposed draft, not a verified enactment. | Approve offense elements, protected disclosures, and sentence classification. |
| Medium | **5 M.S.C. § 33 — State Police** | The State Police is correctly independent, but the Colonel's duties still include taxi, commercial-aircraft, and driver permitting. | Transfer licensing responsibilities to the appropriate transportation authority while preserving State Police independence. |
| Medium | **5 M.S.C. § 54 — Security Services Regulation** | Insurance, casinos, and financial crimes are grouped inside Public Safety and Transportation. | Relocate commerce regulation to Title 6 and expressly defined crimes to Title 7 where appropriate. |
| Medium | **4 M.S.C. § 24 — State Agency Administration** | Detailed hiring, promotion, and rank-management provisions risk unnecessary complexity and conflicts with agency autonomy. | Streamline the civil-service and command provisions. |
| Medium | **8 M.S.C. § 1 — State Bar and Admission to Practice** | Contains numerous distinct administrative and court-security subjects under a single section. | Divide into precise sections with stable citation paths after the final judicial framework is approved. |
| Medium | **Title 1 — General Provisions** | No substantive sections have been published in the consolidated draft. | Draft rules of construction, definitions, effective dates, severability, and statutory publication rules. |

## Important limitations
This audit verified that current **explicit M.S.C. section citations** point to existing sections in the dataset, and removed unsupported former title/subtitle/chapter references in operative text. It does **not** prove that every newly consolidated section preserves the exact scope of its original subsection, that every cross-reference points to the most legally appropriate proposition, or that every offense and sentence is constitutionally or substantively sound.

In particular, sections consolidating many former provisions often cannot reconstruct a precise `(a)(1)` or `(b)(2)` target from the old citation alone. Those require section-by-section legal editing after the new structure is approved.

No enactment, repeal, judicial decision, or official approval is implied by a GitHub commit. All changes remain draft legislative text until lawfully adopted.
