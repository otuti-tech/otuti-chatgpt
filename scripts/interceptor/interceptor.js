// intercept fetch requests
const originalFetch = window.fetch;

// eslint-disable-next-line func-names
window.fetch = async function (...args) {
  const input = args[0];
  let url;

  if (input instanceof Request) {
    url = input.url;
  } else if (input instanceof URL) {
    url = input.href;
  } else {
    url = input;
  }

  const response = await originalFetch(...args);

  if (response && url.includes('backend-api/prompt_library')) {
    // do nothing
    return '';
  }
  if (response && url.includes('api/auth/session')) {
    const responseData = await response.clone().json();

    if (responseData.accessToken) {
      const authReceivedEvent = new CustomEvent('authReceived', {
        detail: responseData,
      });
      window.dispatchEvent(authReceivedEvent);
    }
  }
  // if (response && url === 'https://chat.openai.com/backend-api/gizmos/discovery') {
  //   return '';
  // }
  if (response && url.includes('backend-api/accounts/check')) {
    const responseData = await response.clone().json();
    if (responseData.accounts) {
      const accountReceivedEvent = new CustomEvent('accountReceived', {
        detail: responseData,
      });
      window.dispatchEvent(accountReceivedEvent);
    }
  }
  if (response && url.includes('backend-api/conversations?offset=0') && !url.includes('limit=100')) {
    const responseData = await response.clone().json();
    if (responseData.items) {
      const historyLoadedReceivedEvent = new CustomEvent('historyLoadedReceived', {
        detail: responseData,
      });
      window.dispatchEvent(historyLoadedReceivedEvent);
    }
  }

  if (response && url.includes('public-api/conversation_limit')) {
    const responseData = await response.clone().json();
    if (responseData.message_cap) {
      const conversationLimitReceivedEvent = new CustomEvent('conversationLimitReceived', {
        detail: responseData,
      });
      window.dispatchEvent(conversationLimitReceivedEvent);
    }
  }
  if (response && url.includes('backend-api/gizmos/bootstrap')) {
    const responseData = await response.clone().json();
    const gizmosBootstrapReceivedEvent = new CustomEvent('gizmosBootstrapReceived', {
      detail: responseData,
    });
    window.dispatchEvent(gizmosBootstrapReceivedEvent);
  }
  // if (response && url.includes('backend-api/gizmos/discovery')) {
  //   const responseData = await response.clone().json();
  //   const gizmoDiscoveryReceivedEvent = new CustomEvent('gizmoDiscoveryReceived', {
  //     detail: responseData,
  //   });
  //   window.dispatchEvent(gizmoDiscoveryReceivedEvent);
  // }
  if (response && url.includes('backend-api/models')) {
    const responseData = await response.clone().json();
    if (responseData.models) {
      const modelsReceivedEvent = new CustomEvent('modelsReceived', {
        detail: responseData,
      });
      window.dispatchEvent(modelsReceivedEvent);
    }
  }
  return response;
};
