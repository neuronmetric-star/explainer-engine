// Shared helpers for the Node tools.
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const ScriptParser = require('../engine/script.js');

const ROOT = path.join(__dirname, '..');
const vdir = slug => path.join(ROOT, 'videos', slug);

function ffmpegPath() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try { const p = require('ffmpeg-static'); if (p && fs.existsSync(p)) return p; } catch (e) {}
  return 'ffmpeg';
}
function ffprobeDuration(file) {
  const r = spawnSync(ffmpegPath(), ['-hide_banner', '-i', file, '-f', 'null', '-'], { encoding: 'utf8' });
  const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(r.stderr);
  if (!m) throw new Error('could not read duration of ' + file);
  return (+m[1]) * 3600 + (+m[2]) * 60 + parseFloat(m[3]);
}
function readScript(slug) {
  const f = path.join(vdir(slug), 'script.txt');
  if (!fs.existsSync(f)) throw new Error('missing ' + f);
  return fs.readFileSync(f, 'utf8');
}
// data.js is what the browser engine loads: script + word timings + audio length
function writeData(slug, script, words, audioLength) {
  const out = path.join(vdir(slug), 'data.js');
  fs.writeFileSync(out, 'window.VIDEO_DATA = ' + JSON.stringify({ script, words, audioLength }, null, 0) + ';\n');
  const toks = ScriptParser.parse(script).filter(t => !t.cue).reduce((a, t) => a + t.n, 0);
  if (toks !== words.length) console.warn(`WARNING: script has ${toks} spoken words but timing has ${words.length}`);
  console.log('wrote', path.relative(ROOT, out), `(${words.length} words, ${audioLength.toFixed(2)}s)`);
}
module.exports = { fs, path, ROOT, vdir, ffmpegPath, ffprobeDuration, readScript, writeData, ScriptParser, execFileSync, spawnSync };
