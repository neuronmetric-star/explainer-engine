// Sound effects for burger-1955 (synthesized by tools/sfx.py). Build: node tools/sfx.js burger-1955
module.exports = ({ T, word }) => {
  const ev = [];
  const steps = (from, dur, rate, g) => { for (let t = T(from) + .2; t < T(from) + dur; t += 1 / rate) ev.push({ at: t, sfx: 'step', gain: g }); };
  for (const c of ['cal', 'card', 'beef', 'bun', 'vit', 'cheese', 'melt', 'ketchup', 'mustard', 'pickles', 'numbers', 'dv', 'sugar', 'end'])
    ev.push({ at: T(c) - .12, sfx: 'whoosh', gain: .2 });
  ev.push({ at: 'q', sfx: 'pop', gain: .5 }, { at: 'q+0.6', sfx: 'pop', gain: .45 }, { at: word('three', 'cal'), sfx: 'pop', gain: .5 });
  ev.push({ at: word('chemistry', 'chem'), sfx: 'pop', gain: .6 }, { at: word('chemistry', 'chem') + .1, sfx: 'servo', gain: .25 });   // bubbling kit
  steps('gary', 1.0, 2.8, .35); ev.push({ at: word('break', 'gary'), sfx: 'pop', gain: .4 });
  for (const [w, c] of [['one', 'beef'], ['salt', 'beef'], ['pepper', 'beef'], ['enriched', 'bun'], ['water', 'bun'], ['yeast', 'bun'],
    ['niacin', 'vit'], ['iron', 'vit'], ['thiamine', 'vit'], ['riboflavin', 'vit'], ['folic', 'vit'], ['milk', 'cheese'], ['sodium', 'cheese'],
    ['tomatoes', 'ketchup'], ['two', 'ketchup'], ['highfructose', 'hfcs'], ['vinegar', 'mustard'], ['seed', 'mustard'], ['potassium', 'sorbate']])
    ev.push({ at: word(w, c), sfx: 'tap', gain: .45 });
  ev.push({ at: word('vitamins', 'vit'), sfx: 'beep', gain: .45 }, { at: word('melt', 'melt'), sfx: 'pop', gain: .45 });
  for (const [w, c] of [['three', 'numbers'], ['fifteen', 'numbers'], ['thirtyone', 'numbers'], ['thirteen', 'numbers'], ['six', 'numbers']])
    ev.push({ at: word(w, c), sfx: 'tap', gain: .55 });
  ev.push({ at: 'sodium+0.3', sfx: 'clunk', gain: .9 }, { at: 'sodium+0.6', sfx: 'beep', gain: .5 });   // the shaker lands, 710 in red
  ev.push({ at: word('thirtyone', 'dv'), sfx: 'pop', gain: .6 });
  ev.push({ at: word('sugar', 'sugar') - .4, sfx: 'tap', gain: .5 }, { at: word('fiber', 'sugar') - .3, sfx: 'tap', gain: .5 });
  ev.push({ at: word('sodium', 'heli'), sfx: 'pop', gain: .45 }, { at: word('number', 'heli'), sfx: 'beep', gain: .5 });
  // the helicopter ending + the helicopter clip under the follow CTA (PLAYBOOK §1.12a)
  ev.push({ at: 'heli', sfx: 'helicopter', gain: .6 }, { at: 'cta', sfx: 'helicopter', gain: .55 });
  ev.push({ at: 'cta+1.4', sfx: 'pop', gain: .5 }, { at: 'cta+2.9', sfx: 'click', gain: .9 });
  return ev;
};
