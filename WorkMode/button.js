chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    chrome.storage.local.get(function (localStorage) {
        var tab = sender.tab;
        if (localStorage.tabs) {
            if (localStorage.tabs[tab.openerTabId] === true) {
                localStorage.tabs[tab.id] = true;
                chrome.storage.local.set(localStorage);
            }
            var text = (localStorage.tabs[tab.id] === true) ? "on" : "";
            chrome.browserAction.setBadgeText({ text: text, tabId: tab.id });
            callback(localStorage.tabs[tab.id] === true);
        }
    });
    return true;
});
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.storage.local.get(function (localStorage) {
        if (localStorage.tabs === undefined) {
            localStorage.tabs = {};
        }
        var state = localStorage.tabs[tab.id];
        if (state) {
            state = !state;
        }
        else {
            state = true;
        }
        localStorage.tabs[tab.id] = state;

        chrome.storage.local.set(localStorage);
        var text = (state === true) ? "on" : "";
        chrome.browserAction.setBadgeText({ text: text, tabId: tab.id });
        var code = (state === true) ? "workmodeon(true);" : "workmodeoff();";
        chrome.tabs.executeScript({
            code: code
        });
        if (state === true) {
            chrome.browserAction.setBadgeText({ text: "on", tagId: tag.id });
        }
    });

    tab.onRemoved.addListener(function (tabid, removeInfo) {
        localStorage.tabs.splice(tabid);
    });
});