chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	chrome.storage.local.get(function(localStorage){
		var tab = sender.tab;
		if (localStorage.tabs)
		{
			if (localStorage.tabs[tab.openerTabId] === true)
			{
				localStorage.tabs[tab.id] = true;
			}
			if (localStorage.tabs[tab.id] === true)
			{
				callback();
			}
		}
	});
	return true;
});
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.storage.local.get(function(localStorage){
		if (localStorage.tabs === undefined)
		{
			localStorage.tabs={};
		}
		var state=localStorage.tabs[tab.id];
		if (state)
		{
			state=!state;
		}
		else
		{
			state=true;
		}
		localStorage.tabs[tab.id] = state;
		
		chrome.storage.local.set(localStorage);
		var file=(state === true)?"onworkmodeon.js":"onworkmodeoff.js";
		chrome.tabs.executeScript({
			file: file
		});
	});
	
	tab.onRemoved.addListener(function(tabid, removeInfo){
		localStorage.tabs.splice(tabid);
	});
});