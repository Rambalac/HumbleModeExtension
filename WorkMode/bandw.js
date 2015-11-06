chrome.runtime.sendMessage({},function() {
	var body = document.getElementsByTagName('body')[0];
	body.className += " ___body_desaturated___";
});