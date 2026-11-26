// The beats file is the heart of the explainer system (docs/explainer-system.md): one row per idea in the script.
// Usage:
//   node tools/beats.js check <slug>    validate beats.json against script.txt + art/ (cues exist, images exist, one painting per idea, camera moves); lists the images Brian still has to paint
//   node tools/beats.js art <slug>      write videos/<slug>/art-prompts.md (the ChatGPT batches) from beats.json "images"; skips images that already exist in art/ (use --all to include them)
//   node tools/beats.js shots <slug>    write videos/<slug>/shotlist.md (beat -> painting -> camera -> overlays)
const { fs, path, ROOT, vdir, readScript, ScriptParser } = require('./lib');
const [cmd, slug] = process.argv.slice(2);
if (!cmd || !slug) { console.error('usage: node tools/beats.js check|art|shots <slug>'); process.exit(1); }
const dir = vdir(slug), bf = path.join(dir, 'beats.json');
if (!fs.existsSync(bf)) { console.error('missing ' + bf + ' (copy docs/templates/beats.example.json and edit it)'); process.exit(1); }
const B = JSON.parse(fs.readFileSync(bf, 'utf8'));
const script = fs.existsSync(path.join(dir, 'script.txt')) ? readScript(slug) : '';
const cues = []; for (const tk of ScriptParser.parse(script)) if (tk.cue) cues.push(tk.cue);
const cueName = c => { const m = /^([\w-]+)([+-][\d.]+)?$/.exec(String(c)); return m ? m[1] : null; };
const cueIdx = c => cues.indexOf(cueName(c));
const artFile = f => path.join(dir, 'art', f);

if (cmd === 'check') {
  let errs = 0, warns = 0; const bad = m => { console.log('  ✗ ' + m); errs++; }, warn = m => { console.log('  ! ' + m); warns++; }, ok = m => console.log('  ✓ ' + m);
  console.log('beats check: ' + slug);
  // cues
  const refs = [];
  (B.shots || []).forEach(s => refs.push(['shot', s.at]));
  (B.overlays || []).forEach(o => { refs.push(['overlay ' + o.type, o.at]); if (o.to) refs.push(['overlay to', o.to]); });
  (B.actors || []).forEach(a => { refs.push(['actor from', a.from]); if (a.to) refs.push(['actor to', a.to]); (a.events || []).forEach(e => { refs.push(['event', e.at]); if (e.to) refs.push(['event to', e.to]); }); });
  if (B.helicopter) refs.push(['helicopter', B.helicopter.at]);
  Object.values(B.gauges || {}).forEach(g => g.keys.forEach(k => refs.push(['gauge key', k[0]])));
  (B.shakes || []).concat(B.flashes || []).forEach(x => refs.push(['shake/flash', x[0]]));
  const missing = [...new Set(refs.filter(r => cueIdx(r[1]) < 0).map(r => r[0] + ' [#' + cueName(r[1]) + ']'))];
  missing.length ? missing.forEach(m => bad('unknown cue: ' + m + ' (add [#cue] to script.txt)')) : ok(`all ${refs.length} cue references exist in script.txt (${cues.length} cues)`);
  // plates / props / images
  const needed = [];
  for (const [n, p] of Object.entries(B.plates || {})) { if (!fs.existsSync(artFile(p.img))) needed.push(p.img); }
  for (const [k, f] of Object.entries(B.props || {})) { if (!fs.existsSync(artFile(f))) needed.push(f); }
  const noPlate = [...new Set((B.shots || []).filter(s => !(B.plates || {})[s.plate]).map(s => s.plate))];
  noPlate.forEach(p => bad('shot uses an undefined plate: ' + p));
  needed.length ? needed.forEach(f => warn('image not painted yet: art/' + f)) : ok('every plate and prop image exists in art/');
  // camera moves in every shot
  const still = (B.shots || []).filter(s => s.zoom[0] === s.zoom[1]).map(s => s.at);
  still.length ? still.forEach(a => bad('static shot (zoom start == end): ' + a + ' (the camera must move in every shot)')) : ok('the camera moves in every shot');
  // order
  let prev = -1, order = true; (B.shots || []).forEach(s => { const i = cueIdx(s.at); if (i < prev) order = false; prev = Math.max(prev, i); });
  order ? ok('shots are in script order') : bad('shots are not in script order');
  // one painting per idea (needs data.js for seconds; else count runs)
  const runs = []; (B.shots || []).forEach(s => { if (!runs.length || runs[runs.length - 1].plate !== s.plate) runs.push({ plate: s.plate, at: s.at }); });
  let dataOk = false, L = 0, C = {};
  if (fs.existsSync(path.join(dir, 'data.js'))) { global.window = {}; eval(fs.readFileSync(path.join(dir, 'data.js'), 'utf8')); const D = window.VIDEO_DATA; let wi = 0, pend = []; for (const tk of ScriptParser.parse(D.script)) { if (tk.cue) { pend.push(tk.cue); continue; } const w = D.words[Math.min(wi, D.words.length - 1)]; pend.forEach(c => C[c] = w.start); pend = []; wi += tk.n; } L = D.audioLength + (B.tail || 1); dataOk = true; }
  const distinct = new Set(runs.map(r => r.plate)).size;
  ok(`${distinct} distinct paintings in ${runs.length} runs`);
  if (dataOk) runs.forEach((r, i) => { const t0 = C[cueName(r.at)], t1 = i + 1 < runs.length ? C[cueName(runs[i + 1].at)] : L, d = t1 - t0; if (d > 12.5 && r.plate !== (B.endingPlate || 'E')) warn(`painting ${r.plate} holds ${d.toFixed(1)} s (> ~12 s: give the next idea its own painting)`); });
  else warn('no data.js yet: hold times not checked (run tools/align.js first)');
  // search phrase
  if (B.searchPhrase) { const first = require(path.join(ROOT, 'engine', 'script.js')).spokenText(script).toLowerCase().split(/\s+/).slice(0, 14).join(' '); first.includes(B.searchPhrase.toLowerCase().split(' ').slice(-2).join(' ')) ? ok('the search phrase is in the first spoken words') : warn('the search phrase "' + B.searchPhrase + '" is not in the first spoken words'); }
  // overlay types
  const known = new Set(['text', 'title', 'counter', 'steps', 'flow', 'prop', 'bar', 'ripple', 'gauge']); (B.overlays || []).filter(o => !known.has(o.type)).forEach(o => bad('unknown overlay type: ' + o.type));
  console.log(errs ? `FAIL: ${errs} error(s), ${warns} warning(s)` : `PASS (${warns} warning(s))`);
  if (needed.length) console.log('\nBrian still has to paint: ' + needed.join(', '));
  process.exit(errs ? 1 : 0);
}

if (cmd === 'art') {
  const all = process.argv.includes('--all');
  const start = fs.readFileSync(path.join(ROOT, 'docs', 'templates', 'style-bible-start.txt'), 'utf8').replace('{{RECURRING}}', (B.recurring && B.recurring.length) ? '\nRECURRING OBJECTS (identical every time they appear, never redesign them):\n' + B.recurring.map(r => '- ' + r).join('\n') + '\n' : '');
  const imgs = (B.images || []).filter(i => all || !fs.existsSync(artFile(i.file)));
  const bgs = imgs.filter(i => (i.kind || 'background') === 'background'), props = imgs.filter(i => i.kind === 'prop');
  const fmtBg = i => `${i.file}: SHOT: ${i.shot}\nPLACE + MOOD: ${i.place}\nHERO: ${i.hero}\nFOREGROUND: ${i.foreground}\nMIDGROUND: ${i.midground}\nBACKGROUND: ${i.background}\nDRESSING: ${i.dressing}\nSTORY DETAILS: ${i.story}\nLIGHT: ${i.light}\nPALETTE: ${i.palette}\nTEXTURE: ${i.texture}\nSTAGING: ${i.staging}\nTEXT: none. No numbers.\nSTRICT: no people, no faces, no hands, no animals.`;
  const fmtProp = i => `${i.file}: ${i.brief} Seen from the front, soft light from the left, a thin darker outline. Centered on a solid pure green #00FF00 background, no shadow on the background, no text.`;
  let out = `# ChatGPT batch file: ${slug} (${imgs.length} new image${imgs.length === 1 ? '' : 's'}) · generated by tools/beats.js from beats.json\n\n**How to use:** new chat → paste START, then each batch; send Claude the images after each batch (as ATTACHED FILES, never pasted into the chat).\n**Skipped (already painted):** ${(B.images || []).filter(i => !imgs.includes(i)).map(i => i.file).join(', ') || 'none'}\n\n\`\`\`\n${start}\`\`\`\n`;
  for (let i = 0; i < bgs.length; i += 4) { const g = bgs.slice(i, i + 4); out += `\n\`\`\`\nBATCH ${Math.floor(i / 4) + 1} (backgrounds)\n${g.map(fmtBg).join('\n\n')}\n\`\`\`\n`; }
  if (props.length) out += `\n\`\`\`\nBATCH ${Math.ceil(bgs.length / 4) + 1} (props, solid pure green #00FF00)\n${props.map(fmtProp).join('\n\n')}\n\`\`\`\n`;
  fs.writeFileSync(path.join(dir, 'art-prompts.md'), out);
  console.log(`wrote videos/${slug}/art-prompts.md: ${bgs.length} background(s), ${props.length} prop(s)`);
}

if (cmd === 'shots') {
  const rows = (B.shots || []).map(s => { const ov = (B.overlays || []).filter(o => cueName(o.at) === cueName(s.at)).map(o => o.type + (o.text ? ' "' + o.text + '"' : '')).join('; '); return `| ${s.at} | ${s.plate} (${(B.plates[s.plate] || {}).img || '?'}) | ${s.zoom[0]} → ${s.zoom[1]} | ${ov} |`; });
  fs.writeFileSync(path.join(dir, 'shotlist.md'), `# Shot list: ${B.title || slug} (generated by tools/beats.js from beats.json)\n\n| Cue | Painting | Zoom | Overlays starting here |\n|---|---|---|---|\n${rows.join('\n')}\n`);
  console.log(`wrote videos/${slug}/shotlist.md (${rows.length} shots)`);
}
