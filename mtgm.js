/**
 * Mailto: for Gmail™   -  By Chris (chris@ilikesleeping.co.uk)
 * In theory, should comply with RFC2368 - if you find any bugs, let me know :)
 * With bugfix thanks to Leonard Ehrenfried and Artur Marnik :)
 */

const defaultOptions = {
    useGApps: false,
    gaDomain: '',
    useAccountNo: false,
    accountNo: 0,
    allowBcc: false,
    useWindow: false,
};

/**
 * Find mailto links
 */
function findLinks() {
    for (const link of document.links) {
        if ((/^mailto:/i).test(link.href)) {
            setLink(link);
        }
    }
}

/**
 * Remove all added listeners (for when ext is updated)
 */
function removeListeners() {
    for (const link of document.links) {
        if ((/^mailto:/i).test(link.href)) {
            link.removeEventListener('click', mailtoClickListener);
        }
    }
}

function setLink(linkEl) {
    linkEl.addEventListener('click', mailtoClickListener);
}

/**
 * Listener for mailto link clicked
 */
function mailtoClickListener(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    launchCompose(ev.currentTarget);
    return false;
}

async function launchCompose(linkEl) {
    const linkUrl = new URL(linkEl.href);
    const parts = {
        to: linkUrl.pathname,
        cc: '',
        bcc: '',
        subject: '',
        body: '',
    };
    linkUrl.searchParams.forEach((value, key) => {
        const keyLower = key.toLowerCase();
        if (parts[keyLower]) {
            parts[keyLower] += ';';
            parts[keyLower] += value;
        }
        else {
            parts[keyLower] = value;
        }
    });

    const opts = await new Promise(resolve => {
        chrome.storage.local.get(defaultOptions, resolve)
    }).catch(err => {
        // This will fail if extension has been updated or otherwise gone out of scope. Log other errors
        return null;
    })

    if (!opts) {
        removeListeners();
        return;
    }

    if (!opts.allowBcc) {
        parts.bcc = '';
    }

    if (!opts) {
        // Extension has gone away.
        linkEl.removeEventListener('click', mailtoClickListener);
        return;
    }

    const gLinkSuffix = (opts.useAccountNo && opts.accountNo)
        ? `u/${opts.accountNo}/`
        : '';
    const gLink = (opts.useGApps && opts.gaDomain)
        ? `https://mail.google.com/a/${opts.gaDomain}/mail/${gLinkSuffix}`
        : `https://mail.google.com/mail/${gLinkSuffix}`;
    const emailLink = `${gLink}?view=cm&tf=1&to=${parts.to}&cc=${parts.cc}&bcc=${parts.bcc}&su=${parts.subject}&body=${parts.body}`;
    // const windowFeatures = opts.useWindow
    //     ? 'noopener,noreferrer,location,menubar,resizable,width=800,height=600'
    //     : 'noopener,noreferrer';
    const windowFeatures = 'noopener,noreferrer';
    return window.open(emailLink, '_blank', windowFeatures);
}

/**
 * Called when an element is added after page load
 */
function inserted(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type !== 'childList') {
            continue;
        }
        for (const node of mutation.addedNodes) {
            try {
                if (node.nodeName === 'A' && node.href.match(/^mailto:/i)) {
                    setLink(node);
                } else if (node.getElementsByTagName) {
                    const childNodes = node.getElementsByTagName('A');
                    for (const childNode of childNodes) {
                        if (childNodes[childNode].href.match(/^mailto:/i)) {
                            setLink(childNodes[childNode]);
                        }
                    }
                }
            } catch (e) {
                // Fail silently
            }
        }
    }
}

// Run on initial set of links
findLinks();

// Watch for inserted mailto links
const observer = new MutationObserver(inserted);
observer.observe(document.body, { childList: true, subtree: true });
