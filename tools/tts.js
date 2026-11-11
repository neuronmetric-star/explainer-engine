// Generate the voiceover with ElevenLabs AND exact per-word timings.
// Usage:  node tools/tts.js <video-slug>
// Needs:  ELEVENLABS_API_KEY in the environment (or a .env file at the repo root)
// Voice:  ELEVENLABS_VOICE_ID env, or "voiceId" in videos/<slug>/config.json, else the default in config.json at root
const { fs, path, ROOT, vdir, readScript, writeData, ScriptParser, ffprobeDuration } = require('./lib');

function loadEnv() {
  const f = path.join(ROOT, '.env');
  if (fs.existsSync(f)) for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z_]+)\s*=\s*(.*)\s*$/.exec(line); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

(async () => {
  loadEnv();
  const slug = process.argv[2]; if (!slug) throw new Error('usage: node tools/tts.js <video-slug>');
  const key = process.env.ELEVENLABS_API_KEY; if (!key) throw new Error('Set ELEVENLABS_API_KEY (see README). No key? Use OpenArt + tools/align.js instead.');
  const rootCfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'));
  const vcfgF = path.join(vdir(slug), 'config.json'); const vcfg = fs.existsSync(vcfgF) ? JSON.parse(fs.readFileSync(vcfgF, 'utf8')) : {};
  const voiceId = process.env.ELEVENLABS_VOICE_ID || vcfg.voiceId || rootCfg.voiceId;
  const model = vcfg.modelId || rootCfg.modelId || 'eleven_multilingual_v2';
  const script = readScript(slug);
  const text = ScriptParser.spokenText(script);
  console.log(`voice ${voiceId}, model ${model}, ${text.length} chars`);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`, {
    method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: model, voice_settings: Object.assign({ stability: .45, similarity_boost: .8, style: .3 }, rootCfg.voiceSettings, vcfg.voiceSettings) }),
  });
  if (!res.ok) throw new Error('ElevenLabs error ' + res.status + ': ' + await res.text());
  const j = await res.json();
  const mp3 = path.join(vdir(slug), 'voice.mp3');
  fs.writeFileSync(mp3, Buffer.from(j.audio_base64, 'base64'));
  // characters -> words
  const al = j.alignment || j.normalized_alignment;
  const words = []; let cur = null;
  al.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) { if (cur) { words.push(cur); cur = null; } return; }
    if (!cur) cur = { w: '', start: al.character_start_times_seconds[i], end: 0 };
    cur.w += ch; cur.end = al.character_end_times_seconds[i];
  });
  if (cur) words.push(cur);
  writeData(slug, script, words, ffprobeDuration(mp3));
})().catch(e => { console.error(e.message || e); process.exit(1); });
