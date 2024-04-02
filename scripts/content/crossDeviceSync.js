/* global getChatGPTAccountIdFromCookie */
const syncKeys = [
  'conversationsOrder',
  'customInstructionProfiles',
  'customModels',
  'customPrompts',
  'promptChains',
  'settings',
  'userInputValueHistory',
];
function snakeToCamel(s) {
  return s.replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
}
let lastCrossDeviceSyncAt = new Date();
// eslint-disable-next-line no-unused-vars
function crossDeviceSyncGet() {
  chrome.runtime.sendMessage({
    checkHasSubscription: true,
    detail: {
      forceRefresh: false,
    },
  }, (hasSubscription) => {
    if (!hasSubscription) return;
    const chatgptAccountId = getChatGPTAccountIdFromCookie();

    chrome.storage.local.get(['settings', 'lastSyncedAt'], (result) => {
      const { settings, lastSyncedAt } = result;
      if ((typeof settings?.crossDeviceSync === 'undefined' || settings?.crossDeviceSync)) {
        chrome.runtime.sendMessage({
          crossDeviceSyncGet: true,
        }, (data) => {
          if (!data) return;
          if (data?.status === 'error') return;
          if (!data?.last_synced_at) return;
          const lastServerSyncedAt = new Date(data.last_synced_at).getTime();
          const lastClientSyncedAt = lastSyncedAt?.[chatgptAccountId] || 0;
          if (lastClientSyncedAt && lastServerSyncedAt <= lastClientSyncedAt) return;
          chrome.storage.local.set({ lastSyncedAt: { ...(lastSyncedAt || {}), [chatgptAccountId]: lastServerSyncedAt } });
          const newData = Object.keys(data)?.reduce((acc, key) => {
            const formattedKey = snakeToCamel(key);
            if (syncKeys.includes(formattedKey) && data[key]) {
              acc[formattedKey] = data[key];
            }
            return acc;
          }, {});
          if (Object.keys(newData).length > 0) {
            chrome.storage.local.set(newData);
          }
        });
      }
    });
  });
}
// eslint-disable-next-line no-unused-vars
function crossDeviceSyncPost(hasSubscription) {
  if (!hasSubscription) return;
  chrome.storage.local.get(['settings', 'lastSyncedAt'], (result) => {
    const { settings, lastSyncedAt } = result;
    const chatgptAccountId = getChatGPTAccountIdFromCookie();

    if ((typeof settings?.crossDeviceSync === 'undefined' || settings?.crossDeviceSync)) {
      if (typeof lastSyncedAt === 'undefined' || !lastSyncedAt?.[chatgptAccountId]) {
        initialSync();
      }
      let payload = {};
      chrome.storage.onChanged.addListener((e) => {
        const keys = Object.keys(e);
        // eslint-disable-next-line no-restricted-syntax
        for (const key of keys) {
          if (syncKeys.includes(key)) {
            payload[key] = e[key].newValue;
          }
        }
        if (Object.keys(payload).length > 0 && (new Date() - lastCrossDeviceSyncAt) > 30000) {
          lastCrossDeviceSyncAt = new Date();
          // send payload to server
          sendCrossDeviceSync(payload, chatgptAccountId);
          payload = {};
        }
      });

      // if tab is not focused, send payload to server
      document.addEventListener('visibilitychange', () => {
        if (Object.keys(payload).length > 0 && !document.hidden) {
          lastCrossDeviceSyncAt = new Date();
          // send payload to server
          sendCrossDeviceSync(payload, chatgptAccountId);
          payload = {};
        }
      });
      // if mouse moved out of body, send payload to server
      document.addEventListener('mouseleave', () => {
        if (Object.keys(payload).length > 0) {
          lastCrossDeviceSyncAt = new Date();
          // send payload to server
          sendCrossDeviceSync(payload, chatgptAccountId);
          payload = {};
        }
      });
    }
  });
}
function initialSync() {
  const chatgptAccountId = getChatGPTAccountIdFromCookie();
  chrome.storage.local.get(syncKeys, (result) => {
    const payload = Object.keys(result)?.reduce((acc, key) => {
      if (result[key]) {
        acc[key] = result[key];
      }
      return acc;
    }, {});
    sendCrossDeviceSync(payload, chatgptAccountId);
  });
}
function sendCrossDeviceSync(payload, chatgptAccountId) {
  chrome.storage.local.get('lastSyncedAt', (result) => {
    const lastClientSyncedAt = result.lastSyncedAt?.[chatgptAccountId] || 0;
    payload.lastClientSyncedAt = lastClientSyncedAt;
    chrome.runtime.sendMessage({
      crossDeviceSyncPost: true,
      detail: {
        payload,
      },
    }, (data) => {
      if (!data) return;
      if (data?.status === 'error') return;
      if (data?.last_synced_at) {
        chrome.storage.local.set({ lastSyncedAt: { ...(result.lastSyncedAt || {}), [chatgptAccountId]: new Date(data.last_synced_at).getTime() } });
      }
    });
  });
}
