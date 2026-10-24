# Chrome Web Store listing

**Name:** Recent Tab Switcher
**Category:** Productivity (Workflow & planning)
**Language:** English

## Summary (132 chars max)
Switch tabs in most-recently-used order. Hold Option and tap Tab, like Cmd+Tab on macOS or Ctrl+Tab in VS Code and Arc.

## Description
Chrome's tab shortcuts move through tabs left to right. Recent Tab Switcher jumps between the tabs you actually used last, the way Arc, Dia and VS Code do.

• Hold Option and tap Tab to see your recent tabs, newest first. Release Option to switch.
• A quick Option+Tab bounces between your two latest tabs.
• Shift+Tab goes back, Esc cancels, arrow keys and clicks work too.
• Works across all your windows.
• Option+Q jumps to your last tab from any page, even Chrome's own pages.
• Pick your own shortcut (any Option or Control combo) in settings.

No data collection, no tracking, no network requests. Open source: https://github.com/pranav-singhal/recent-tab-switcher

Note: the switcher list can't appear on Chrome's own pages (new tab, settings, Web Store). Use Option+Q there.

## Privacy tab
**Single purpose:** Lets you switch between browser tabs in most-recently-used order with a keyboard shortcut.

**Permission justifications:**
- tabs: Reads tab titles, URLs and last-used times to list recent tabs and switch to the chosen one.
- scripting: Adds the switcher to tabs that were already open when the extension is installed.
- favicon: Shows each tab's icon in the switcher list.
- storage: Saves the user's chosen shortcut.
- Host permission (<all_urls>): The switcher list is drawn on top of the current page and needs to detect when the shortcut keys are pressed and released. Page content is not read or changed.

**Remote code:** No, I am not using remote code.

**Data usage:** Collects none of the listed data types. Certify all three disclosures.

**Privacy policy URL:** https://github.com/pranav-singhal/recent-tab-switcher/blob/main/PRIVACY.md
