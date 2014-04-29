// Saves options to localStorage.
function save_options() {
	var f = document.getElementById("options");
	var useGApps = f.o_useGApps.checked;
	var gaDomain = f.o_gaDomain.value;
	if (useGApps == true && gaDomain == "") {
			updateStatus('Fill in the Google Apps domain you wish to use.');
			return;
	} else if (useGApps == true && gaDomain != "") {
			localStorage["useGApps"] = useGApps;
			localStorage["gaDomain"] = gaDomain;
	} else if (useGApps == false) {
			localStorage["useGApps"] = useGApps;
			localStorage["gaDomain"] = "";
	}
	var allowBcc = f.o_allowBcc.checked;
	localStorage["allowBcc"] = allowBcc;
	var useWindow = f.o_useWindow.checked;
	localStorage["useWindow"] = useWindow;
	
	updateStatus('Options Saved.');
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	var f = document.getElementById("options");
	var useGApps = toBool(localStorage["useGApps"]);
	f.o_useGApps.checked = useGApps;
	if (useGApps) {
			var gaDomain = localStorage["gaDomain"];
			f.o_gaDomain.value = gaDomain;
	}
	f.o_allowBcc.checked = toBool(localStorage["allowBcc"]);
	f.o_useWindow.checked = toBool(localStorage["useWindow"]);
	
}

// Update status to let user know options were saved.
function updateStatus(s) {
	var status = document.getElementById("status");
	var wrap = document.getElementById("wrap");
	status.innerHTML = s;
	status.style.visibility = "visible";
	wrap.style.backgroundColor = "#B0C4DE";
	setTimeout(function() {
		status.innerHTML = "";
		status.style.visibility = "hidden";
		wrap.style.backgroundColor = "#eef";
	}, 2000);
}

// Convert string values from localStorage to boolean
function toBool(s) {
	if (s === "false")	return false;
	else 				return s;
}

window.addEventListener('load', restore_options);
document.getElementById('o_save').addEventListener('click', save_options);
document.getElementById('o_reset').addEventListener('click', restore_options);