function toBool(s) {
	if (s === "false")	return false;
	else if (s === "true")	return true;
	else 				return s;
}

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.storage == "getSettings") {
			var settings = {};
			settings.useGApps = toBool(localStorage["useGApps"]);
			settings.gaDomain = localStorage["gaDomain"];
			settings.allowBcc = toBool(localStorage["allowBcc"]);
			settings.useWindow = toBool(localStorage["useWindow"]);
			sendResponse({storage: settings})
		}
		else
		sendResponse({});
});