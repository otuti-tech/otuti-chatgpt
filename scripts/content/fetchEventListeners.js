/* global getAllPlugins, getInstalledPlugins, initialize */

window.addEventListener('historyLoadedReceived', () => {
  initialize();
});

window.addEventListener('authReceived', (event) => {
  chrome.runtime.sendMessage({ authReceived: true, detail: event.detail });
});

window.addEventListener('accountReceived', (event) => {
  chrome.storage.local.set({ account: event.detail });
});

window.addEventListener('gizmosBootstrapReceived', (event) => {
  chrome.storage.local.set({ gizmosBootstrap: event.detail });
});

// window.addEventListener('gizmoDiscoveryReceived', (event) => {
//   chrome.storage.local.set({ gizmoDiscovery: event.detail });
// });

window.addEventListener('conversationLimitReceived', (event) => {
  chrome.storage.local.set({
    conversationLimit: event.detail,
  });
});

window.addEventListener('modelsReceived', (event) => {
  const data = event.detail;
  chrome.storage.local.get(['settings', 'models'], (res) => {
    const { settings } = res;
    if (!settings) return;
    chrome.storage.local.set({
      models: data.models,
      settings: { ...settings, selectedModel: settings.selectedModel || data.models?.[0] },
    });
    if (data.models.map((m) => m.slug).find((m) => m.includes('plugins'))) {
      getAllPlugins();
      getInstalledPlugins();
    }
  });
});
