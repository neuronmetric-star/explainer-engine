// Babytopia — Facebook explained like you're 5 (16:9 long-form). Built on draft timing; re-check after voice alignment.
// Layout (1920x1080): Mark stands left facing right, Pal/Twins/Yahoo stand right facing left. Subtitles live below y≈930.
const ZUCK_L = (pose, extra) => Object.assign({ img: `img/zuck-${pose}.png`, talk: `img/zuck-${pose}-open.png`, who: 'ZUCK', s: [560, 600], w: pose === 'calm' ? 250 : 340, depth: 1.3, bob: 4 }, extra || {});
const PAL_L = (pose, extra) => Object.assign({ img: `img/pal-${pose}.png`, talk: `img/pal-${pose}-open.png`, who: 'PAL', s: [1380, 600], w: pose === 'curious' ? 455 : 290, depth: 1.4, bob: 4 }, extra || {});
const TWINS_L = { img: 'img/twins-angry.png', talk: 'img/twins-angry-open.png', who: 'TWINS', s: [1360, 600], w: 570, depth: 1.4, bob: 3 };
const YAHOO_L = { img: 'img/yahoo-offer.png', talk: 'img/yahoo-offer-open.png', who: 'YAHOO', s: [600, 620], w: 760, depth: 1.4, bob: 3 };
const P = (img, at, move, extra) => Object.assign({ img: `img/${img}.webp`, at, origin: [50, 45], move }, extra || {});
const IN = { zoom: [1.04, 1.16] }, OUT = { zoom: [1.18, 1.05] }, PANR = { zoom: [1.12, 1.14], x: [40, -40] }, PANL = { zoom: [1.12, 1.14], x: [-40, 40] };

window.SCENE = {
  format: 'wide', brand: '', autoWhoosh: true,
  chapters: [
    { at: 'ch1', n: 'CHAPTER 1', title: 'The Website Harvard Shut Down', dur: 2.4 },
    { at: 'ch2', n: 'CHAPTER 2', title: 'The Billion-Dollar No', dur: 2.4 },
    { at: 'ch3', n: 'CHAPTER 3', title: 'Free Toys', dur: 2.4 },
    { at: 'ch4', n: 'CHAPTER 4', title: 'The Price of Free', dur: 2.4 },
  ],
  panels: [
    // ---- cold open: already moving at frame 1, fast teaser cuts ----
    P('s01', 0, { zoom: [1.14, 1.04], x: [0, -30] }, { fade: 0 }),
    P('s02', 'later', OUT, { parts: { n: 18, speed: .6, size: .7 } }),
    P('s21', 'tease', { zoom: [1.06, 1.2] }, { fade: .12 }),
    P('s10', 'sued', { zoom: [1.2, 1.08] }, { fade: .12 }),
    P('s25', 'tease2', { zoom: [1.06, 1.22] }, { fade: .12 }),
    P('s03', 'question', IN),
    // ---- chapter 1 ----
    P('s04', 'ch1', { zoom: [1.2, 1.05], y: [30, 0] }),
    P('s05', 'facemash+2.4', IN, { fx: 'flicker' }),   // ch1+facemash share a cue: s04 holds for '2003. Harvard.'
    P('s06', 'viral', PANR),
    P('s07', 'shutdown', OUT, { fx: 'dark' }),
    P('set-dorm', 'pal1', PANL, { layers: [ZUCK_L('laptop'), PAL_L('curious')] }),
    P('s08', 'launch', IN, { fx: 'pulse' }),
    P('set-dorm', 'pitch', { zoom: [1.08, 1.18], x: [-30, 20] }, { layers: [ZUCK_L('laptop'), PAL_L('curious')] }),
    P('s09', 'signups', IN, { parts: { n: 20, speed: .7, size: .7 } }),
    P('s10', 'twins', PANR),
    P('set-courtyard', 'twinsline', PANL, { layers: [ZUCK_L('calm'), TWINS_L] }),
    P('s11b', 'settle', { zoom: [1.05, 1.14], x: [20, -20] }),
    P('s11', 'paid', { zoom: [1.08, 1.2] }),
    // ---- chapter 2 ----
    P('s12', 'ch2', { zoom: [1.18, 1.04], x: [-40, 20] }),
    P('s13', 'thiel', IN),
    P('s14', 'spread', PANR),
    P('set-boardroom', 'yahoo', { zoom: [1.06, 1.14] }, { layers: [{ ...YAHOO_L }] }),
    P('set-boardroom', 'no', { zoom: [1.12, 1.2], x: [-20, 20] }, { layers: [ZUCK_L('calm', { s: [1460, 600], flip: true }), { ...YAHOO_L }] }),
    P('set-boardroom', 'faint', { zoom: [1.14, 1.08] }, { layers: [ZUCK_L('calm'), PAL_L('shock')] }),
    P('s15', 'crazy', OUT),
    // ---- chapter 3 ----
    P('s16', 'ch3', { zoom: [1.2, 1.05], y: [20, -10] }),
    P('s17', 'watch', IN),
    P('s18', 'product', { zoom: [1.05, 1.22] }, { fx: 'pulse' }),
    P('s19', 'ipo', OUT, { parts: { n: 24, speed: .9 } }),
    P('s20', 'lunch', PANR),   // TODO s20 not made yet (popular camera girl at lunch table)
    P('s21', 'bought', IN),
    P('s21c', 'email', { zoom: [1.06, 1.16], x: [0, -30] }),
    P('s22', 'whatsapp', PANL),
    P('s23', 'today', OUT),
    // ---- chapter 4 ----
    P('s24', 'ch4', { zoom: [1.06, 1.18] }, { fx: 'flicker' }),
    P('s24', 'uhoh', { zoom: [1.18, 1.22], x: [0, -20] }, { fade: .15, layers: [PAL_L('shock', { s: [1720, 660], w: 280, in: ['uhoh', 400, .4] })] }),
    P('s25', 'fine', IN, { fx: 'dark' }),
    P('s26', 'answer', PANR, { parts: { n: 20, speed: .7 } }),
    P('s27', 'callback', { zoom: [1.04, 1.24] }),
    P('s28', 'motto', { zoom: [1.2, 1.04] }, { fx: 'flicker' }),
  ],
  cards: [
    { l: 'PEOPLE EVERY MONTH', v: '3 BILLION', cls: 'big', s: [960, 200], t0: 'later+1.2', t1: 'tease' },
    { l: 'A YEAR', v: '$160B', cls: 'big', s: [960, 200], t0: 'question+1.6', t1: 'ch1' },
    { l: 'IN 24 HOURS', v: '1,200', cls: 'big', s: [1440, 200], t0: 'signups+1', t1: 'twins', count: [0, 1200, 'signups+1', 1], fmt: n => Math.round(n).toLocaleString('en-US') },
    { l: 'SETTLEMENT', v: '$65M', cls: 'red', s: [420, 200], t0: 'paid+0.8', t1: 'ch2' },
    { l: 'IPO VALUE', v: '$104B', cls: 'big', s: [960, 200], t0: 'ipo+1.5', t1: 'lunch' },
    { l: 'INSTAGRAM', v: '13 EMPLOYEES', s: [600, 200], t0: 'insta+1.6', t1: 'bought' },
    { l: 'USERS', v: '30M', s: [1320, 200], t0: 'insta+2.6', t1: 'bought' },
    { l: 'PRICE', v: '$1B', cls: 'green', s: [1440, 200], t0: 'bought+0.6', t1: 'email' },
    { l: 'WHATSAPP USERS', v: '450M', s: [600, 200], t0: 'whatsapp+0.8', t1: 'today' },
    { l: 'PRICE', v: '$19B', cls: 'big', s: [1320, 200], t0: 'price+0.4', t1: 'today' },
    { l: 'INSTAGRAM TODAY', v: '2 BILLION', cls: 'big', s: [960, 200], t0: 'today+1', t1: 'ch4' },
    { l: 'USERS EXPOSED', v: '87M', cls: 'red', s: [600, 200], t0: 'scandal+3.2', t1: 'uhoh' },
    { l: 'RECORD FINE', v: '$5B', cls: 'red', s: [420, 200], t0: 'fine+1.2', t1: 'answer' },
    { l: 'META REVENUE 2024', v: '$164B', cls: 'big', s: [700, 200], t0: 'answer+1.4', t1: 'callback' },
    { l: 'FROM ADS', v: '98%', cls: 'big', s: [1260, 200], t0: 'ads+0.6', t1: 'callback' },
  ],
  sfx: [
    ['hook+0.1', 'hit', .6],
    ['later+1.2', 'pop', .6], ['question+1.6', 'cash', .8],
    ['ch1-0.9', 'riser', .6], ['ch2-0.9', 'riser', .6], ['ch3-0.9', 'riser', .6], ['ch4-0.9', 'riser', .6],
    ['facemash+2.5', 'shutter', .8], ['shutdown+0.3', 'slam', .6],
    ['signups+1', 'tick', .6], ['paid+0.8', 'cash', .8], ['thiel+1.4', 'cash', .8],
    ['offer', 'cash', .9], ['no', 'slam', 1], ['faint', 'hit', .6],
    ['ipo', 'shutter', .8], ['ipo+1.5', 'cash', .8], ['bought+0.6', 'cash', .8], ['price+0.4', 'cash', .9],
    ['scandal+3.2', 'hit', .7], ['fine+1.2', 'slam', 1], ['answer+1.4', 'cash', .8],
    ['sellsyou+1', 'hit', 1], ['break+0.8', 'slam', .8],
  ],
  shakes: [['shutdown+0.3', .35, .2], ['no', .35, .3], ['fine+1.2', .4, .3], ['sellsyou+1', .35, .25], ['break+0.8', .4, .3]],
  flashes: [['facemash+2.5', .2, .3], ['ipo', .2, .3], ['sellsyou+1', .25, .3]],
};
