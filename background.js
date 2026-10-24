// Tabs sorted by most recently used. Chrome tracks lastAccessed for us.
async function recentTabs() {
  const tabs = await chrome.tabs.query({});
  return tabs
    .sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0))
    .map(t => ({ id: t.id, windowId: t.windowId, title: t.title || t.url, url: t.url || '' }));
}

async function switchTo(tab) {
  await chrome.tabs.update(tab.id, { active: true });
  await chrome.windows.update(tab.windowId, { focused: true });
}

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg.type === 'list') {
    recentTabs().then(reply);
    return true;
  }
  if (msg.type === 'switch') {
    chrome.tabs.get(msg.id).then(switchTo).catch(() => {});
  }
});

// Fallback shortcut: works on chrome:// pages too, toggles to the last tab.
chrome.commands.onCommand.addListener(async cmd => {
  if (cmd !== 'previous-tab') return;
  const [, prev] = await recentTabs();
  if (prev) switchTo(prev);
});

// Clicking the toolbar icon opens settings.
chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());

// Inject into tabs that were already open when the extension was installed.
chrome.runtime.onInstalled.addListener(async () => {
  for (const tab of await chrome.tabs.query({})) {
    chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] }).catch(() => {});
  }
});
