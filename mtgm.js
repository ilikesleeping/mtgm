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
    return s !== 'false' && Boolean(s);
}

// Find mailto links
function findLinks() {
    var links = document.links;
    var l = links.length;
    for (var z = 0; z < l; z++) {
        if ((/^mailto:/i).test(links[z].href)) {
            setLink(links[z]);
        }
    }
}

// Set link to go to Gmail when clicked
function setLink(e) {
    var x = e.href;
    x = x.replace(/'/ig,'%27').replace(/\+/g,'%2B');
    var to = x.match(/mailto:[^?]*/i)[0].replace(/mailto:/i,'');
    var to2 = getParam(x,"to");
    to = (to2) ? to2 + '; ' + to : to;
    var bcc = (allowBcc === true) ? getParam(x,"bcc") : '';
    x = x.replace(/(bcc=)/ig,'');
    var cc = getParam(x,"cc");
    var su = getParam(x,"subject");
    var body = getParam(x,"body");

    e.addEventListener('click', function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        return !launchCompose(to, cc, bcc, su, body);
    });
}

function launchCompose(to, cc, bcc, su, body) {
    var emaillink = gLink + '?view=cm&tf=1&to=' + to + "&cc=" + cc + "&bcc=" + bcc + "&su=" + su + "&body=" + body;
    if (useWindow){
        return window.open(emaillink,'_blank','location=yes,menubar=yes,resizable=yes,width=800,height=600');
    } else {
        return window.open(emaillink, '_blank');
    }
}


// Get settings
var useGApps, gaDomain, allowBcc, useWindow, gLink;
chrome.extension.sendMessage({storage: "getSettings"}, function(r) {
    useGApps = toBool(r.storage.useGApps);
    if (useGApps && r.storage.gaDomain) {
        gLink = 'https://mail.google.com/a/' + r.storage.gaDomain + '/mail/';
    } else {
        gLink = 'https://mail.google.com/mail/';
    }
    if (toBool(r.storage.useAccountNo)) {
        gLink += 'u/' + r.storage.accountNo + '/';
    }
    allowBcc = toBool(r.storage.allowBcc);
    useWindow = toBool(r.storage.useWindow);
    findLinks();
});

// Called when an element is added after page load
function inserted(e) {
    try {
        if (e.target.nodeName === "A" && e.target.href.match(/^mailto:/i)) {
            setLink(e.target);
        } else if (e.target.getElementsByTagName) {
            var nodes = e.target.getElementsByTagName('A');
            for (var z = 0; z < nodes.length; z++){
                if (nodes[z].href.match(/^mailto:/i)) {
                    setLink(nodes[z]);
                }
            }
        }
    } catch (e) {
        //Fail silently
    }
}

// Watch for inserted mailto links
document.addEventListener('DOMNodeInserted', inserted, false );
