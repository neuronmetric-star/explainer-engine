// Plain-language check for a script (PLAYBOOK §1.6b). Anyone should be able to follow it.
// Usage: node tools/readability.js <slug> [file=script.txt]
// Reports: word count, reading grade (Flesch-Kincaid), long sentences, long words, and banned shorthand.
// Targets: grade ≤ 5, no sentence over 14 words, few 4+ syllable words (each one explained or swapped).
const fs = require('fs'), path = require('path');
const { spokenText } = require('../engine/script.js');
const slug = process.argv[2];
if (!slug) { console.error('usage: node tools/readability.js <slug> [file]'); process.exit(1); }
const file = path.join(__dirname, '..', 'videos', slug, process.argv[3] || 'script.txt');
const src = fs.readFileSync(file, 'utf8');
const cta = spokenText(src.split('\n').filter(l => l.startsWith('[#cta]')).join('\n'));
const text = spokenText(src.split('\n').filter(l => !l.startsWith('[#cta]')).join('\n'));

function syllables(w) {
  w = w.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = w.match(/[aeiouy]{1,2}/g);
  return Math.max(1, m ? m.length : 1);
}
const sentences = text.split(/(?<=[.?!…]["”]?)\s+/).map(s => s.trim()).filter(s => /[a-z]/i.test(s));
const words = text.split(/\s+/).filter(w => /[a-z]/i.test(w));
const syl = words.reduce((a, w) => a + syllables(w), 0);
const grade = 0.39 * (words.length / sentences.length) + 11.8 * (syl / words.length) - 15.59;

// Number words are long but easy; don't flag them.
const NUM = /^(seventeen|eighteen|nineteen|seventy|ninety|thousand|hundred|million|billion|twenty|thirty|forty|fifty|sixty|eighty|fourteen|fifteen|sixteen|thirteen|eleven|twelve|percent)/i;
const longWords = [...new Set(words.map(w => w.replace(/[^A-Za-z'-]/g, ''))
  .filter(w => syllables(w) >= 4 && !NUM.test(w)))];
const longSent = sentences.filter(s => s.split(/\s+/).length > 14);
// Shorthand that makes a viewer fill in the logic themselves.
const SHORTHAND = [/\bnobody bit\b/i, /\bsay less\b/i, /\btimeout\b/i, /\bbasically\b/i, /\bfinna\b/i, /\bdrip\b/i,
  /\bcap\b/i, /\bglazing\b/i, /\bper\b/i, /\bvia\b/i, /\be\.g\./i, /\bi\.e\./i];
const flagged = SHORTHAND.filter(r => r.test(text)).map(r => r.source.replace(/\\b/g, ''));

console.log(`story words: ${words.length}  (+ CTA ${cta.split(/\s+/).filter(Boolean).length})`);
console.log(`sentences: ${sentences.length}  avg ${(words.length / sentences.length).toFixed(1)} words`);
console.log(`reading grade: ${grade.toFixed(1)}  ${grade <= 5 ? 'OK' : 'TOO HARD (target ≤ 5)'}`);
console.log(`long sentences (>14 words): ${longSent.length ? '\n  - ' + longSent.join('\n  - ') : 'none'}`);
console.log(`long words (4+ syllables) — explain or swap: ${longWords.join(', ') || 'none'}`);
console.log(`shorthand/slang to replace: ${flagged.join(', ') || 'none'}`);
