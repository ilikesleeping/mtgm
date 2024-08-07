chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'GET_LOCALSTORAGE': {
            const localStorageItems = {...localStorage};
            sendResponse(localStorageItems);
            break;
        }
        case 'CLEAR_LOCALSTORAGE': {
            localStorage.clear();
            sendResponse(true);
            break;
        }
    }
})