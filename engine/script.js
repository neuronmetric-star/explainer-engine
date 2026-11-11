// Script parser shared by the browser engine and the Node tools.
//
// script.txt markup:
//   plain words             -> spoken + shown as captions, one word at a time
//   *word                   -> caption shown in GOLD (wins, key terms)
//   !word                   -> caption shown in RED  (taxes, losses, danger)
//   {$100M|one hundred million dollars}  -> caption shows "$100M", voice says the words after |
//   {*$100M|one hundred million dollars} -> same, in gold ({!...} for red)
//   [#cue-name]             -> invisible marker; scenes use at('cue-name') to sync visuals
//   # comment line          -> ignored
(function (root) {
  function parse(text) {
    const tokens = [];
    const lines = text.split(/\r?\n/).filter(l => !l.trim().startsWith('#'));
    const src = lines.join(' ');
    const re = /\[#[^\]]+\]|\{[^}]*\}\S*|\S+/g;
    let m;
    while ((m = re.exec(src))) {
      let s = m[0];
      if (s.startsWith('[#')) { tokens.push({ cue: s.slice(2, -1).trim() }); continue; }
      let trail = '';
      if (s[0] === '{') { const i = s.indexOf('}'); trail = s.slice(i + 1); s = s.slice(1, i); }
      let cls = '';
      if (s[0] === '*') { cls = 'gold'; s = s.slice(1); } else if (s[0] === '!') { cls = 'red'; s = s.slice(1); }
      let [disp, spoken] = s.split('|');
      if (spoken === undefined) spoken = disp;
      disp += trail; spoken += trail;
      const n = spoken.trim().split(/\s+/).filter(Boolean).length;
      tokens.push({ disp, spoken, cls, n });
    }
    return tokens;
  }
  function spokenText(text) {
    return parse(text).filter(t => !t.cue).map(t => t.spoken).join(' ').replace(/\s+/g, ' ').trim();
  }
  const api = { parse, spokenText };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ScriptParser = api;
})(this);
