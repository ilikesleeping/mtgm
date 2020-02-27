// Saves options to localStorage.
function save_options() {
	var f = document.forms["options"];

	// GApps
	var useGApps = f.o_useGApps.checked;
	var gaDomain = f.o_gaDomain.value.trim();
	if (useGApps && !gaDomain) {
        updateStatus('Fill in the Google Apps domain you wish to use.');
        return;
	}
    localStorage["useGApps"] = useGApps;
    localStorage["gaDomain"] = useGApps ? gaDomain : '';
    localStorage["useAccountNo"] = f.o_useAccountNo.checked;
    localStorage["accountNo"] = f.o_useAccountNo.checked ? (f.o_accountNo.value || '0') : '';
    localStorage["allowBcc"] = f.o_allowBcc.checked;
    localStorage["useWindow"] = f.o_useWindow.checked;

    updateStatus('Options saved. Refresh target page to apply.');
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	var f = document.forms["options"];
    var useGApps = toBool(localStorage["useGApps"]);
	f.o_useGApps.checked = useGApps;
    f.o_gaDomain.value = useGApps ? localStorage["gaDomain"] : '';
    var useAccountNo = toBool(localStorage["useAccountNo"]);
    f.o_useAccountNo.checked = useAccountNo;
    f.o_accountNo.value = useAccountNo ? localStorage["accountNo"] : '';
    f.o_allowBcc.checked = toBool(localStorage["allowBcc"]);
	f.o_useWindow.checked = toBool(localStorage["useWindow"]);
	
}

// Update status to let user know options were saved.
function updateStatus(s) {
    var status = document.getElementById("status");
    var wrap = document.getElementById("wrap");
    status.innerHTML = s;
    status.className = 'open';
    setTimeout(function() {
        status.innerHTML = "";
        status.className = '';
    }, 6000);
}

// Convert string values from localStorage to boolean
function toBool(s) {
    return s !== 'false' && Boolean(s);
}

window.addEventListener('load', restore_options);
document.getElementById('options').addEventListener('submit', save_options);
document.getElementById('o_reset').addEventListener('click', restore_options);

if (document.location.search === '?first=1') {
    document.getElementById('installed').className = 'show';
}