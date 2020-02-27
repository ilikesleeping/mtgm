function toBool(s) {
    return s !== 'false' && Boolean(s);
}

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.storage === "getSettings") {
			var settings = {};
			settings.useGApps = toBool(localStorage["useGApps"]);
			settings.gaDomain = localStorage["gaDomain"];
            settings.useAccountNo = toBool(localStorage["useAccountNo"]);
            settings.accountNo = localStorage["accountNo"];
            settings.allowBcc = toBool(localStorage["allowBcc"]);
			settings.useWindow = toBool(localStorage["useWindow"]);
			sendResponse({storage: settings})
		}
		else
		sendResponse({});
});

// Check first run?
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        // Better: Loop through open tabs and inject script
        chrome.tabs.create({url: 'options.html?first=1'});
    }
});
