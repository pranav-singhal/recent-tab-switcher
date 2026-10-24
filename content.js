(() => {
  // Shut down any older copy of this script (e.g. after the extension reloads).
  window.dispatchEvent(new Event('recent-tab-switcher-reset'));

  const SHOW_DELAY_MS = 120; // a quick tap switches without flashing the list

  let open = false;
  let loaded = false;
  let releasedEarly = false;
  let items = [];
  let index = 0;
  let host = null;
  let listEl = null;
  let showTimer = null;

  // The switcher shortcut: hold `modifier`, tap `code`. Set on the settings page.
  let shortcut = { modifier: 'Alt', code: 'Tab' };
  chrome.storage.sync.get('shortcut').then(r => { if (r.shortcut) shortcut = r.shortcut; }).catch(() => {});
  chrome.storage.onChanged.addListener(changes => {
    if (changes.shortcut?.newValue) shortcut = changes.shortcut.newValue;
  });

  const isTrigger = e =>
    e.code === shortcut.code &&
    !e.metaKey &&
    (shortcut.modifier === 'Alt' ? e.altKey && !e.ctrlKey : e.ctrlKey && !e.altKey);

  function alive() {
    try { return !!chrome.runtime?.id; } catch { return false; }
  }

  async function start(backwards) {
    open = true;
    loaded = false;
    releasedEarly = false;
    try {
      items = await chrome.runtime.sendMessage({ type: 'list' });
    } catch {
      return close();
    }
    if (!open) return;
    if (!items || items.length < 2) return close();
    loaded = true;
    index = backwards ? items.length - 1 : 1;
    if (releasedEarly) return commit();
    showTimer = setTimeout(render, SHOW_DELAY_MS);
  }

  function move(step) {
    if (!loaded) return;
    index = (index + step + items.length) % items.length;
    render();
  }

  function commit() {
    const target = items[index];
    close();
    if (target) chrome.runtime.sendMessage({ type: 'switch', id: target.id }).catch(() => {});
  }

  function close() {
    open = false;
    loaded = false;
    clearTimeout(showTimer);
    if (host) host.style.display = 'none';
  }

  function favicon(url) {
    const u = new URL(chrome.runtime.getURL('/_favicon/'));
    u.searchParams.set('pageUrl', url);
    u.searchParams.set('size', '32');
    return u.toString();
  }

  function hostname(url) {
    try { return new URL(url).hostname || url; } catch { return url; }
  }

  function ensureHost() {
    if (host && host.isConnected) return;
    host = document.createElement('div');
    host.style.cssText = 'all:initial;position:fixed;inset:0;z-index:2147483647;display:none;';
    const root = host.attachShadow({ mode: 'closed' });
    root.innerHTML = `
      <style>
        .backdrop { position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
          font:13px/1.3 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .panel { width:min(560px, calc(100vw - 32px)); max-height:70vh; overflow:auto; padding:6px;
          border-radius:12px; background:rgba(30,30,32,.92); color:#eee;
          box-shadow:0 20px 60px rgba(0,0,0,.45); backdrop-filter:blur(20px); }
        .row { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:8px; cursor:pointer; }
        .row.active { background:#3a6df0; color:#fff; }
        .row img { width:16px; height:16px; flex:none; }
        .text { min-width:0; }
        .title, .url { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .url { font-size:11px; opacity:.6; }
      </style>
      <div class="backdrop"><div class="panel"></div></div>`;
    listEl = root.querySelector('.panel');
    listEl.addEventListener('mousedown', e => {
      const row = e.target.closest('.row');
      if (!row) return;
      e.preventDefault();
      index = Number(row.dataset.i);
      commit();
    });
    (document.documentElement || document).appendChild(host);
  }

  function render() {
    if (!open || !loaded) return;
    clearTimeout(showTimer);
    ensureHost();
    listEl.replaceChildren(...items.map((t, i) => {
      const row = document.createElement('div');
      row.className = 'row' + (i === index ? ' active' : '');
      row.dataset.i = i;
      const img = document.createElement('img');
      img.src = favicon(t.url);
      const text = document.createElement('div');
      text.className = 'text';
      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = t.title;
      const url = document.createElement('div');
      url.className = 'url';
      url.textContent = hostname(t.url);
      text.append(title, url);
      row.append(img, text);
      return row;
    }));
    host.style.display = 'block';
    listEl.children[index]?.scrollIntoView({ block: 'nearest' });
  }

  function onKeyDown(e) {
    if (!alive()) return teardown();
    if (isTrigger(e)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (!open) start(e.shiftKey);
      else move(e.shiftKey ? -1 : 1);
    } else if (open) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowDown') move(1);
      else if (e.key === 'ArrowUp') move(-1);
      else if (e.key === 'Enter') commit();
    }
  }

  function onKeyUp(e) {
    if (!open || e.key !== shortcut.modifier) return;
    e.preventDefault();
    if (loaded) commit();
    else releasedEarly = true;
  }

  function onBlur() {
    if (open) close();
  }

  function teardown() {
    close();
    window.removeEventListener('keydown', onKeyDown, true);
    window.removeEventListener('keyup', onKeyUp, true);
    window.removeEventListener('blur', onBlur);
    window.removeEventListener('recent-tab-switcher-reset', teardown);
    host?.remove();
  }

  window.addEventListener('keydown', onKeyDown, true);
  window.addEventListener('keyup', onKeyUp, true);
  window.addEventListener('blur', onBlur);
  window.addEventListener('recent-tab-switcher-reset', teardown);
})();
