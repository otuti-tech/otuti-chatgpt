/* global getGizmoIdFromUrl, initialize, unarchiveConversationById, getChatGPTAccountIdFromCookie */

window.addEventListener('historyLoadedReceived', () => {
  chrome.storage.local.get(['isBanned'], (res) => {
    if (res.isBanned) return;
    initialize();
  });
});

window.addEventListener('archivedAllReceived', () => {
  // remove all child but first one
  document.querySelector('#conversation-list').querySelectorAll('[id^=conversation-button]').forEach((item) => {
    item.remove();
  });
});

window.addEventListener('authReceived', (event) => {
  chrome.runtime.sendMessage({ authReceived: true, detail: event.detail });
});
// eslint-disable-next-line no-unused-vars
let sharedWebsocket = false;
window.addEventListener('accountReceived', (event) => {
  const account = event.detail.responseData;
  chrome.storage.local.set({ account });
  if (event.detail.accessToken) {
    chrome.storage.sync.set({ accessToken: event.detail.accessToken });
  }
  const chatgptAccountId = getChatGPTAccountIdFromCookie();

  sharedWebsocket = account?.accounts?.[chatgptAccountId]?.features?.includes('shared_websocket');
  if (event.detail.responseData?.account_ordering?.length > 1) {
    chrome.storage.local.get([
      'allConversations', 'conversations', 'allConversationsOrder', 'conversationsOrder',
    ], (res) => {
      const {
        allConversations, conversations, allConversationsOrder, conversationsOrder,
      } = res;
      //  if event.detail.responseData?.account_ordering has a key that doesn't exist in Object.keys(allConversations || {})
      if (event.detail.responseData?.account_ordering?.some((id) => !Object.keys(allConversations || {}).includes(id))) {
        chrome.storage.local.set({
          allConversations: { ...(allConversations || {}), [chatgptAccountId]: conversations },
          allConversationsOrder: { ...(allConversationsOrder || {}), [chatgptAccountId]: conversationsOrder },
        });
      }
    });
  }
});
// window.addEventListener('registerWebsocketReceived', (event) => {
//   chrome.storage.local.set({
//     websocket: {
//       registeredAt: new Date().toISOString(),
//       ...event.detail,
//     },
//   });
// });
window.addEventListener('gizmoNotFound', (event) => {
  const gizmoId = getGizmoIdFromUrl(event.detail.url);
  chrome.runtime.sendMessage({ deleteSuperpowerGizmo: true, detail: { gizmoId } });
});

window.addEventListener('gizmosBootstrapReceived', (event) => {
  chrome.storage.local.set({ gizmosBootstrap: event.detail });
});

window.addEventListener('conversationUnarchivedReceived', (event) => {
  unarchiveConversationById(event.detail.conversationId);
});
window.addEventListener('userSettingsReceived', (event) => {
  chrome.storage.local.set({ openAIUserSettings: event.detail });
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
  chrome.storage.local.get(['selectedModel', 'settings', 'models'], (res) => {
    const { settings, selectedModel } = res;
    chrome.storage.local.set({
      models: data.models,
      selectedModel: selectedModel || settings?.selectedModel || data.models?.[0],
    });
  });
});
