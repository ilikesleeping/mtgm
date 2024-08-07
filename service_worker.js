chrome.runtime.onInstalled.addListener(async (details) => {
	console.log('onInstalled', details.reason);
	switch (details.reason) {
		case "install": {
			// First run
			await chrome.runtime.openOptionsPage();
			await addScriptToAllTabs();
			break;
		}
		case "update": {
			const options = await chrome.storage.local.get({
				hasMigratedFromV2: false,
			});
			if (!options.hasMigratedFromV2) {
				await migrateV2Options();
			}
			await addScriptToAllTabs();
			break;
		}
	}
});

/**
 * Add script to all current tabs
 */
async function addScriptToAllTabs() {
	const allTabs = await chrome.tabs.query({
		discarded: false,
		status: 'complete',
	});
	const promises = [];
	for (const tab of allTabs) {
		try {
			if (!tab.url || tab.url.match(/^chrome:\/\/|https?:\/\/chrome(?:webstore)?\.google.[a-z]+/i)) {
				continue;
			}
			const addScriptPromise = chrome.scripting
				.executeScript({
					files: ['mtgm.js'],
					target: {
						tabId: tab.id,
						allFrames: true,
					}
				})
				.catch(err => {
					console.error(`Failed to inject into tab with url ${tab.url}. ${err}`, tab);
				});
			promises.push(addScriptPromise);
		} catch (error) {
			console.error('Error injecting tab', error.message);
		}
	}
	await Promise.all(promises);
}

/**
 * Migrate localStorage settings from V2
 */
async function migrateV2Options() {
	await chrome.offscreen.createDocument({
		url: 'settings_migrate.html',
		reasons: ['LOCAL_STORAGE'],
		justification: 'To migrate settings from previous version.',
	});
	const oldSettings = await new Promise((resolve) => {
		chrome.runtime.sendMessage({ action: 'GET_LOCALSTORAGE' }, (response) => {
			resolve(response);
		})
	});
	await chrome.storage.local.set({
		hasMigratedFromV2: true,
		useGApps: toBool(oldSettings.useGApps),
		gaDomain: oldSettings.gaDomain ?? '',
		useAccountNo: toBool(oldSettings.useAccountNo),
		accountNo: parseInt(oldSettings.accountNo ?? '0', 10),
		allowBcc: toBool(oldSettings.allowBcc),
		useWindow: toBool(oldSettings.useWindow),
	});
	await new Promise((resolve) => {
		chrome.runtime.sendMessage({ action: 'CLEAR_LOCALSTORAGE' }, (response) => {
			resolve(response);
		})
	});
	await chrome.offscreen.closeDocument();
}

function toBool(boolStr) {
	return boolStr !== 'false' && Boolean(boolStr);
}
