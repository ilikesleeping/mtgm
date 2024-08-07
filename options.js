const defaultOptions = {
    hasMigratedFromV2: false,
    useGApps: false,
    gaDomain: '',
    useAccountNo: false,
    accountNo: 0,
    allowBcc: false,
    useWindow: false,
}

/**
 * Saves options to localStorage.
 */
async function saveOptions(ev) {
    ev.preventDefault();

    const f = document.forms["options"];

    // Validation
    const useGApps = f.o_useGApps.checked;
    const gaDomain = f.o_gaDomain.value.trim();
    if (useGApps && !gaDomain) {
        updateStatus('Fill in the Google Apps domain you wish to use.');
        return;
    }

    await chrome.storage.local.set({
        useGApps,
        gaDomain,
        useAccountNo: f.o_useAccountNo.checked,
        accountNo: f.o_accountNo.value ?? 0,
        allowBcc: f.o_allowBcc.checked,
        // useWindow: f.o_useWindow.checked,
    })

    updateStatus('Options saved.');
}


/**
 * Restores select box state to saved value from localStorage.
 */
async function restoreOptions() {
    const f = document.forms["options"];
    const options = await chrome.storage.local.get(defaultOptions);

    f.o_useGApps.checked = options.useGApps;
    f.o_gaDomain.value = options.gaDomain;
    f.o_useAccountNo.checked = options.useAccountNo;
    f.o_accountNo.value = options.accountNo;
    f.o_allowBcc.checked = options.allowBcc;
    // f.o_useWindow.checked = options.useWindow;
	
}

/**
 * Update status to let user know options were saved.
 */
function updateStatus(message) {
    const status = document.getElementById("status");
    status.innerText = message;
    status.className = 'open';
    setTimeout(function() {
        status.className = '';
    }, 6000);
}

/**
 * Convert string values from localStorage to boolean
 */
function toBool(s) {
    return s !== 'false' && Boolean(s);
}

window.addEventListener('load', restoreOptions);
document.getElementById('options').addEventListener('submit', saveOptions);
document.getElementById('o_reset').addEventListener('click', restoreOptions);

if (document.location.search === '?first=1') {
    document.getElementById('installed').className = 'show';
}