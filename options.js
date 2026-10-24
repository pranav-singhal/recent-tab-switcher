const DEFAULT = { modifier: 'Alt', code: 'Tab' };
const isMac = navigator.platform.toUpperCase().includes('MAC');

const recorder = document.getElementById('recorder');
const msg = document.getElementById('msg');
let current = DEFAULT;
let recording = false;

function keyName(code) {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  return { Backquote: '`', Tab: 'Tab', Space: 'Space', Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']',
    Semicolon: ';', Quote: "'", Comma: ',', Period: '.', Slash: '/', Backslash: '\\' }[code] || code;
}

function label(s) {
  const mod = s.modifier === 'Alt' ? (isMac ? 'Option' : 'Alt') : (isMac ? 'Control' : 'Ctrl');
  return `${mod} + ${keyName(s.code)}`;
}

function show() {
  recorder.textContent = recording ? 'Press your shortcut…' : label(current);
  recorder.classList.toggle('recording', recording);
}

function say(text, kind = '') {
  msg.textContent = text;
  msg.className = 'msg ' + kind;
}

async function save(s) {
  current = s;
  await chrome.storage.sync.set({ shortcut: s });
  say(`Saved. Hold ${label(s).replace(' + ', ' and tap ')}. Refresh any tab that doesn't pick it up.`, 'ok');
}

recorder.addEventListener('click', () => { recording = true; say(''); show(); });
recorder.addEventListener('blur', () => { recording = false; show(); });

recorder.addEventListener('keydown', e => {
  if (!recording) return;
  e.preventDefault();
  if (e.key === 'Escape') { recording = false; return show(); }
  if (['Alt', 'Control', 'Shift', 'Meta'].includes(e.key)) return; // wait for the real key

  if (e.metaKey) return say('Command shortcuts are taken by macOS and Chrome. Use Option or Control.', 'error');
  if (e.altKey === e.ctrlKey) return say('Hold exactly one of Option or Control, then press a key.', 'error');
  if (e.shiftKey) return say('Leave Shift out. It goes backwards through the list while the switcher is open.', 'error');
  if (e.ctrlKey && e.code === 'Tab') {
    return say("Chrome keeps Control + Tab for itself, so extensions never see it. Try Control + ` (the key above Tab).", 'error');
  }

  recording = false;
  show();
  save({ modifier: e.altKey ? 'Alt' : 'Control', code: e.code });
});

// Ctrl+Tab never reaches the page, so catch the attempt another way:
// if the page loses visibility while recording with Control held, explain why.
document.addEventListener('visibilitychange', () => {
  if (recording && document.hidden) {
    recording = false;
    show();
    say("Chrome keeps Control + Tab for itself, so extensions never see it. Try Control + ` (the key above Tab).", 'error');
  }
});

document.getElementById('reset').addEventListener('click', () => save(DEFAULT).then(show));
document.getElementById('chromeShortcuts').addEventListener('click', () =>
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' }));

chrome.storage.sync.get('shortcut').then(r => { if (r.shortcut) current = r.shortcut; show(); });
show();
