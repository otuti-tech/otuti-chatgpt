/* eslint-disable no-unused-vars */
function arkoseWasInitialized() {
  const enforcementContainer4 = document.querySelector('#enforcement-containergpt4');
  const enforcementContainer35 = document.querySelector('#enforcement-containergpt35');
  if (!enforcementContainer4 || !enforcementContainer35) {
    return false;
  }
  return true;
}
function confirmArkoseExists() {
  const arkoseIframeWrapper4 = document.querySelector('[class="arkose-35536E1E-65B4-4D96-9D97-6ADB7EFF8147-wrapper"]');
  const arkoseIframeWrapper35 = document.querySelector('[class="arkose-3D86FBBA-9D22-402A-B512-3420086BA6CC-wrapper"]');
  if (!arkoseIframeWrapper4 || !arkoseIframeWrapper35) addArkoseCallback();
}
function addArkoseCallback() {
  const existingArkoseCallback = document.querySelector('script[src*="chrome-extension"][src$="/scripts/content/arkose.js"]');
  if (existingArkoseCallback) existingArkoseCallback.remove();
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', chrome.runtime.getURL('scripts/content/arkose.js'));
  document.body.appendChild(script);
  addArkoseScript();
}

function addArkoseScript() {
  // check if a script element with src including api.js and chrome-extension and data-callback=useArkoseSetupEnforcement35 exists
  // 4
  const arkoseScript4 = document.querySelector('script[src*="chrome-extension"][src*="api.js"][data-callback="useArkoseSetupEnforcement4"]');
  if (arkoseScript4) arkoseScript4.remove();
  const arkoseApiScript4 = document.createElement('script');
  arkoseApiScript4.async = !0;
  // arkoseApiScript4.defer = !0;
  arkoseApiScript4.setAttribute('type', 'text/javascript');
  arkoseApiScript4.setAttribute('data-status', 'loading');
  arkoseApiScript4.setAttribute('data-callback', 'useArkoseSetupEnforcement4');
  arkoseApiScript4.setAttribute('src', chrome.runtime.getURL('v2/35536E1E-65B4-4D96-9D97-6ADB7EFF8147/api.js'));
  document.body.appendChild(arkoseApiScript4);
  // 3.5
  const arkoseScript35 = document.querySelector('script[src*="chrome-extension"][src*="api.js"][data-callback="useArkoseSetupEnforcement35"]');
  if (arkoseScript35) arkoseScript35.remove();
  const arkoseApiScript35 = document.createElement('script');
  arkoseApiScript35.async = !0;
  arkoseApiScript35.defer = !0;
  arkoseApiScript35.setAttribute('type', 'text/javascript');
  arkoseApiScript35.setAttribute('data-status', 'loading');
  arkoseApiScript35.setAttribute('data-callback', 'useArkoseSetupEnforcement35');
  arkoseApiScript35.setAttribute('src', chrome.runtime.getURL('v2/3D86FBBA-9D22-402A-B512-3420086BA6CC/api.js'));
  document.body.appendChild(arkoseApiScript35);
}
function arkoseTrigger() {
  confirmArkoseExists();
  chrome.storage.local.get(['account', 'settings'], ({
    account, settings,
  }) => {
    // const isPaid = account?.accounts?.default?.entitlement?.has_active_subscription || false;
    const isGPT4 = settings.selectedModel?.tags?.includes('gpt4');
    const isGizmo = document.querySelector('#gizmo-menu-wrapper-navbar') !== null;
    window.localStorage.removeItem('arkoseToken');
    const inputForm = document.querySelector('main form');
    if (!inputForm) return;
    if (isGPT4 || isGizmo) {
      if (!inputForm.querySelector('#enforcement-trigger4')) {
        inputForm.firstChild.insertAdjacentHTML('beforeend', '<button type="button" class="hidden" id="enforcement-trigger4"></button>');
      }
      inputForm.querySelector('#enforcement-trigger4').click();
    } else {
      if (!inputForm.querySelector('#enforcement-trigger35')) {
        inputForm.firstChild.insertAdjacentHTML('beforeend', '<button type="button" class="hidden" id="enforcement-trigger35"></button>');
      }
      inputForm.querySelector('#enforcement-trigger35').click();
    }
  });
}
