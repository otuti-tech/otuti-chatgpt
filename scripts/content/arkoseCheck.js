/* global arkoseDX, isFirefox, registerWebsocket */
/* eslint-disable no-unused-vars */
function arkoseWasInitialized() {
  const enforcementContainer = document.querySelector('[id^=enforcement-container]');
  if (!enforcementContainer) {
    return false;
  }
  return true;
}
function confirmArkoseExists() {
  if (isFirefox) {
    const arkoseIframeWrapper4 = document.querySelector('[class="arkose-35536E1E-65B4-4D96-9D97-6ADB7EFF8147-wrapper"]');
    if (!arkoseIframeWrapper4) addArkoseCallback();
  }
}
function addArkoseCallback() {
  if (isFirefox) {
    const existingArkoseCallback = document.querySelector('script[src*="-extension"][src$="/scripts/content/arkoseFirefox.js"]');
    if (existingArkoseCallback) existingArkoseCallback.remove();
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', chrome.runtime.getURL('scripts/content/arkoseFirefox.js'));
    document.body.appendChild(script);
    addArkoseScript();
  }
}

function addArkoseScript() {
  if (isFirefox) {
    // check if a script element with src including api.js and -extension and data-callback=useArkoseSetupEnforcementpaid exists
    const arkoseScript4 = document.querySelector('script[src*="-extension"][src*="api.js"][data-callback^="useArkoseSetupEnforcement"]');
    const oldDataCallback = arkoseScript4?.getAttribute('data-callback') || 'useArkoseSetupEnforcementpaid';
    if (arkoseScript4) arkoseScript4.remove();

    const arkoseApiScript4 = document.createElement('script');
    arkoseApiScript4.async = !0;
    // arkoseApiScript4.defer = !0;
    arkoseApiScript4.setAttribute('type', 'text/javascript');
    arkoseApiScript4.setAttribute('data-status', 'loading');
    arkoseApiScript4.setAttribute('data-callback', oldDataCallback);
    arkoseApiScript4.setAttribute('src', chrome.runtime.getURL('v2/35536E1E-65B4-4D96-9D97-6ADB7EFF8147/api.js'));
    document.body.appendChild(arkoseApiScript4);
  }
}
let arkoseDXIsPending = false;
function arkoseTrigger() {
  confirmArkoseExists(); // only does it if it's firefox
  chrome.storage.local.get(['account', 'selectedModel', 'websocket', 'chatgptAccountId'], ({
    account, selectedModel, websocket,
  }) => {
    // if older than 1 minute, register again
    if (!websocket || !websocket?.wss_url || !websocket?.registeredAt || (new Date() - new Date(websocket.registeredAt)) > 60000) {
      registerWebsocket();
    }
    // const isPaid = account?.accounts?.[chatgptAccountId || 'default']?.entitlement?.has_active_subscription || false;
    // const isGPT4 = selectedModel?.tags?.includes('gpt4');
    window.localStorage.removeItem('arkoseToken');
    const inputForm = document.querySelector('#prompt-input-form');
    if (!inputForm) return;
    // if (isGPT4) {
    arkoseDXIsPending = true;
    arkoseDX().then((e) => {
      arkoseDXIsPending = false;
      if (!inputForm.querySelector('#enforcement-trigger')) {
        inputForm.firstChild.insertAdjacentHTML('beforeend', '<button type="button" class="hidden" id="enforcement-trigger"></button>');
      }
      inputForm.querySelector('#enforcement-trigger').click();
    });
    // }
    // else {
    //   if (!inputForm.querySelector('#enforcement-trigger35')) {
    //     inputForm.firstChild.insertAdjacentHTML('beforeend', '<button type="button" class="hidden" id="enforcement-trigger35"></button>');
    //   }
    //   inputForm.querySelector('#enforcement-trigger35').click();
    // }
  });
}
