<p align="center"><img src="icons/icon128.png" width="96" alt="Recent Tab Switcher logo"></p>

<h1 align="center">Recent Tab Switcher</h1>

<p align="center">Switch Chrome tabs in most-recently-used order, like Cmd+Tab on macOS or Ctrl+Tab in VS Code.</p>

Chrome's built-in shortcuts move through tabs in the order they sit in the tab bar. This extension jumps between the tabs you actually used last, the way Arc, Dia and VS Code do.

## How it works

- **Hold Option and tap Tab** to show your recent tabs, newest first. Keep tapping to move down the list, then **release Option** to switch.
- **A quick Option+Tab** jumps straight to your last tab, so you can bounce between two tabs.
- While the list is open: **Shift+Tab** goes back up, **Esc** cancels, and the **arrow keys**, **Enter** and **mouse clicks** work.
- The list covers all your windows and brings the right window to the front.
- **Option+Q** jumps to your last tab from any page, including Chrome's own pages. It doesn't show the list.

## Changing the shortcut

Click the extension's toolbar icon to open settings. You can pick any **Option + key** or **Control + key**, for example Control+\`. The quick-jump shortcut can be changed at `chrome://extensions/shortcuts`.

## Limits

- **Control+Tab can't be used.** Chrome keeps it for itself and never passes it to extensions.
- The list can't open on Chrome's own pages (new tab, settings, `chrome://` pages, the Chrome Web Store). Use the quick-jump shortcut there.
- If your cursor is inside an embedded frame (some editors and video players), click the main page first.

## Install

**From the Chrome Web Store:** coming soon.

**From source:**
1. Download or clone this repo.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select the repo folder.

## Privacy

The extension doesn't collect, store or send any data. Tab titles and URLs are only read to draw the switcher list on your screen. See [PRIVACY.md](PRIVACY.md).

## Build a store package

```sh
./build.sh   # creates dist/recent-tab-switcher.zip
```

## License

MIT
