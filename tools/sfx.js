// Builds the sound-effect library in engine/sfx/*.wav from math (no downloads, no credits).
// Usage: node tools/sfx.js      Scenes use them via  sfx: [['cue', 'hit', 0.6], ...]
const { fs, path, ROOT, ffmpegPath, spawnSync } = require('./lib');
const out = path.join(ROOT, 'engine', 'sfx'); fs.mkdirSync(out, { recursive: true });
const S = {
  // deep cinematic boom
  hit: ['aevalsrc=0.9*sin(2*PI*(38+90*exp(-t*18))*t)*exp(-t*3.2)+0.25*(random(0)*2-1)*exp(-t*28):s=44100:d=1.8'],
  // soft impact for cards / stamps
  thud: ['aevalsrc=0.8*sin(2*PI*(70+160*exp(-t*30))*t)*exp(-t*9)+0.2*(random(0)*2-1)*exp(-t*40):s=44100:d=0.6'],
  // air whoosh for cuts
  whoosh: ['anoisesrc=d=0.7:c=pink:a=0.9:r=44100', 'bandpass=f=1400:w=1.3,volume=\'sin(PI*t/0.7)^2*2.5\':eval=frame'],
  // TV / radio static
  static: ['anoisesrc=d=2.6:c=white:a=0.5:r=44100', 'highpass=f=1800,lowpass=f=7000,volume=\'0.6+0.4*sin(2*PI*13*t)\':eval=frame,afade=t=out:st=2.1:d=0.5'],
  // short digital glitch burst
  glitch: ['aevalsrc=0.6*sgn(sin(2*PI*(220+1800*random(0))*t))*lt(mod(t\\,0.09)\\,0.05):s=44100:d=0.5', 'lowpass=f=5000,afade=t=out:st=0.35:d=0.15'],
  // electrical hum / buzz
  buzz: ['aevalsrc=0.35*sgn(sin(2*PI*120*t))*(0.7+0.3*sin(2*PI*7*t)):s=44100:d=3.5', 'lowpass=f=1500,afade=t=in:d=0.2,afade=t=out:st=2.8:d=0.7'],
  // warning alarm (two-tone)
  alarm: ['aevalsrc=0.45*sin(2*PI*(if(lt(mod(t\\,0.5)\\,0.25)\\,880\\,660))*t)*lt(mod(t\\,0.25)\\,0.2):s=44100:d=2', 'afade=t=out:st=1.6:d=0.4'],
  // error beep
  beep: ['aevalsrc=0.5*sin(2*PI*440*t)*lt(mod(t\\,0.18)\\,0.12):s=44100:d=0.4'],
  // positive chime (check mark)
  ding: ['aevalsrc=0.5*sin(2*PI*1320*t)*exp(-t*5)+0.3*sin(2*PI*1980*t)*exp(-t*7):s=44100:d=1.2'],
  // UI pop for cards
  pop: ['aevalsrc=0.6*sin(2*PI*(900-500*t/0.09)*t)*exp(-t*30):s=44100:d=0.15'],
  // clock ticks
  tick: ['aevalsrc=0.7*sin(2*PI*2400*t)*exp(-mod(t\\,0.5)*120):s=44100:d=1.5'],
  // fast counter clicks
  count: ['aevalsrc=0.4*sin(2*PI*3000*t)*exp(-mod(t\\,0.06)*200)*lt(t\\,1.3):s=44100:d=1.4'],
  // jet engine roar
  jet: ['anoisesrc=d=3.5:c=brown:a=0.9:r=44100', 'lowpass=f=900,volume=\'1.6*sin(PI*t/3.5)\':eval=frame'],
  // tension riser
  riser: ['anoisesrc=d=1.6:c=pink:a=0.6:r=44100', 'bandpass=f=900:w=1,volume=\'(t/1.6)^2*3\':eval=frame'],
  // mouse click
  click: ['aevalsrc=0.8*(random(0)*2-1)*exp(-t*400):s=44100:d=0.05'],
};
for (const [name, [src, af]] of Object.entries(S)) {
  const args = ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', src];
  if (af) args.push('-af', af);
  args.push('-ac', '2', path.join(out, name + '.wav'));
  const r = spawnSync(ffmpegPath(), args, { encoding: 'utf8' });
  console.log(r.status === 0 ? 'ok ' : 'FAIL', name, r.stderr || '');
}
