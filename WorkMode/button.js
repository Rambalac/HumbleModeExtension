var dummyUrl = chrome.extension.getURL("dummy.png");

var tabs = {};

chrome.storage.local.get(function (localStorage) {
  tabs = localStorage.tabs || {};
});

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  var tab = sender.tab;
  if (tabs[tab.openerTabId] === true) {
    tabs[tab.id] = true;
    chrome.storage.local.set({ tabs: tabs });
  }
  if (tabs[tab.id] === true) {
    chrome.browserAction.setBadgeText({ text: "on", tabId: tab.id });
    callback(tab.id);
  }
});

chrome.browserAction.onClicked.addListener(function (tab) {
  var state = tabs[tab.id] || false;
  state = !state;

  tabs[tab.id] = state;
  chrome.storage.local.set({ tabs: tabs });

  var text = (state === true) ? "on" : "";
  chrome.browserAction.setBadgeText({ text: text, tabId: tab.id });
  var code = (state === true) ? "workmodeon(" + tab.id + ");" : "workmodeoff();";
  chrome.tabs.executeScript({
    code: code
  });

  tab.onRemoved.addListener(function (tabid, removeInfo) {
    delete tabs[tabid];
    chrome.storage.local.set({ tabs: tabs });
  });
});

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
      if (tabs[details.tabId] !== true) return;
      return { redirectUrl: dummyUrl };
    },
    {
      urls: ["<all_urls>"],
      types: ["image"]
    },
    ["blocking"]);
