#!/usr/bin/env node
// Structural checks for the Mayflower State Code publication dataset.
// Usage: node scripts/check-code.mjs
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../data/code.json', import.meta.url), 'utf8'));
const errors = [];
const warnings = [];
const titles = new Map(data.titles.map(t => [t.id, t]));
const chapters = new Map(data.chapters.map(c => [c.id, c]));
const numbers = new Set();
const citations = new Set();
const add = (where, message) => errors.push(where + ': ' + message);

for (const chapter of data.chapters) {
  if (!titles.has(chapter.title_id)) add(chapter.id, 'missing parent title');
}
for (const s of data.sections) {
  if (numbers.has(s.number)) add(s.number, 'duplicate section id');
  numbers.add(s.number);
  const parent = chapters.get(s.chapter_id);
  if (!parent) add(s.number, 'missing parent chapter');
  else if (titles.get(parent.title_id)?.number !== s.title_number)
    add(s.number, 'title number differs from parent chapter');
  const citationKey = s.title_number + ':' + s.section_number;
  if (citations.has(citationKey)) add(s.number, 'duplicate displayed citation');
  citations.add(citationKey);
  const units = s.parts?.length ? s.parts.flatMap(p => p.units || []) : s.units || [];
  if (units.join('\n\n') !== s.text) add(s.number, 'display text differs from constituent units');
  if (!s.text?.trim()) add(s.number, 'missing operative text');
  if (s.penalty) add(s.number, 'unverified legacy penalty metadata in published data');
  if (/\b(?:SHORT TITLE|LONG TITLE|may be cited as)\b/i.test(s.text))
    add(s.number, 'nonoperative short-title filler remains');
  if ((s.parts || []).some(part => /\b(?:SHORT TITLE|LONG TITLE)\b/i.test(part.heading)))
    add(s.number, 'nonoperative short-title heading remains');
  if (/\b(?:By Conviction|Active status|CA MANDATED)\b/i.test(s.text))
    add(s.number, 'legacy status language remains');
  if (/\bTitle\s+\d+\s*,?\s*(?:Subtitle\s+\d+\s*,?\s*)?Chapter\s+[IVXLCDM\d]+/i.test(s.text)
      || /\bTitle\s+\d+\s*,?\s*Subtitle\s+\d+/i.test(s.text))
    add(s.number, 'obsolete title/subtitle/chapter reference');
  if (/\b\d+\s*M\.?S\.?C\.?\s*\d+\s*§/i.test(s.text)
      || /\b\d+\s*M\.?S\.?C\.?\s*§§/i.test(s.text))
    add(s.number, 'obsolete source-style section reference');
  const refs = /\b(\d+)\s*M\.?S\.?C\.?\s*§\s*(\d+[a-z]?)(?:\.(\d+))?(?:\([a-z0-9]+\))*/gi;
  for (const m of s.text.matchAll(refs)) {
    if (m[3] || !data.sections.some(dest => dest.title_number === m[1] && dest.section_number === m[2]))
      add(s.number, 'unresolvable citation: ' + m[0]);
  }
  if (/\b(?:subchapter|subtitle)\b/i.test(s.text))
    warnings.push(s.number + ': remaining generic subchapter/subtitle language requires editorial review');
}
for (const title of data.titles) {
  if (!data.sections.some(s => s.title_number === title.number))
    warnings.push('Title ' + title.number + ': no operative sections drafted');
}
console.log('Mayflower Code integrity audit');
console.log(data.titles.length + ' titles; ' + data.chapters.length + ' chapters; ' + data.sections.length + ' sections');
for (const issue of errors) console.error('ERROR ' + issue);
for (const issue of warnings) console.warn('REVIEW ' + issue);
console.log(errors.length + ' structural error(s); ' + warnings.length + ' review note(s).');
if (errors.length) process.exitCode = 1;
