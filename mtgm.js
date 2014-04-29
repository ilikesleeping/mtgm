// Mailto: for Gmail™   -  By Chris (i.like.sleeping@gmail.com)
// In theory, should comply with RFC2368 - if you find any bugs, let me know :)
// With bugfix thanks to Leonard Ehrenfried and Artur Marnik :)

// Get url parameters.
function getParam(u,p) {
	var r = new RegExp(p + "=[^&]*","i");
	var m = u.match(r);
	return (m) ? m[0].replace(p + '=','') : '';
}

// Convert string values from localStorage to boolean
function toBool(s) {
	if (s === "false")	return false;
	else if (s === "true")	return true;
	else 				return s;
}

// Set link to go to Gmail when clicked
function setLink(e) {
	var x = e.href;
	x = x.replace(/'/ig,'%27').replace(/\+/g,'%2B');
	var to = x.match(/mailto:[^?]*/i)[0].replace(/mailto:/i,'');
	var to2 = getParam(x,"to");
	to = (to2) ? to2 + '; ' + to : to;
	var bcc = (allowBcc == true) ? getParam(x,"bcc") : '';
	x = x.replace(/(bcc=)/ig,'');
	var cc = getParam(x,"cc");
	var su = getParam(x,"subject");
	var body = getParam(x,"body");
	
	var gLink = (useGApps == true) ? 'https://mail.google.com/a/' + gaDomain + '/mail/' : 'https://mail.google.com/mail/';
	var emaillink = gLink + '?view=cm&tf=1&to=' + to + "&cc=" + cc + "&bcc=" + bcc + "&su=" + su + "&body=" + body;

	if (useWindow == true){
	e.setAttribute("onclick", "window.open('" + emaillink + "','_blank','location=yes,menubar=yes,resizable=yes,width=800,height=600');return false;");
	} else {
	e.setAttribute("onclick", "window.open('" + emaillink + "','_blank');return false;");
	}
}

// Find mailto links
function findLinks() {
	for (var z = 0; z < document.links.length; z++) {
		if (document.links[z].href.match(/^mailto:/i)) {
			setLink(document.links[z]);
		}
	}
}

// Get settings
var useGApps, gaDomain, allowBcc, useWindow;
chrome.extension.sendMessage({storage: "getSettings"}, function(r) {
	useGApps = toBool(r.storage.useGApps);
	if (useGApps)
		gaDomain = r.storage.gaDomain;
	allowBcc = toBool(r.storage.allowBcc);
	useWindow = toBool(r.storage.useWindow);
	findLinks();
});

// Called when an element is added after page load
function inserted(e) {
	try {
		if (e.target.nodeName == "A" && e.target.href.match(/^mailto:/i))
			setLink(e.target);
		if (e.target.getElementsByTagName) {
			var nodes = e.target.getElementsByTagName('A');
			for (var z = 0; z < nodes.length; z++){
				if (nodes[z].href.match(/^mailto:/i))
					setLink(nodes[z]);
			}
		}
	} catch (e) {
		//Fail silently
	}
}

// Watch for inserted mailto links
document.addEventListener('DOMNodeInserted', inserted, false );