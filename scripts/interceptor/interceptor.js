// intercept fetch requests
const browserIsFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
if (!browserIsFirefox) {
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

    let bodyObj = {};
    if (args.length > 1 && args[1]?.body) {
      try {
        bodyObj = JSON.parse(args[1]?.body);
      } catch (e) {
        // do nothing
      }
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);

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
    // if (response && url.includes('discovery_anon')) {
    //   return '';
    // }
    if (response && url.includes('backend-api/gizmos/g-')) {
      const responseData = await response.clone().json();
      if (responseData?.detail?.toLowerCase().includes('not found')) {
        const gizmoNotFoundEvent = new CustomEvent('gizmoNotFound', {
          detail: url,
        });
        window.dispatchEvent(gizmoNotFoundEvent);
      }
    }
    if (response && url.includes('public-api/gizmos/discovery')) {
      if ((window.localStorage.getItem('sp/enhanceGPTStore') || 'true') === 'true' && (window.localStorage.getItem('sp/autoSync' || 'true') === 'true')) {
        // do nothing
        return '';
      }
    }
    if (response && url.includes('backend-api/accounts/check')) {
      // get authorization header from request
      let accessToken;
      if (args.length > 1 && args[1]?.headers) {
        accessToken = args[1].headers.Authorization;
      }
      const responseData = await response.clone().json();
      if (responseData.accounts) {
        const accountReceivedEvent = new CustomEvent('accountReceived', {
          detail: {
            responseData,
            accessToken,
          },
        });
        window.dispatchEvent(accountReceivedEvent);
      }
    }

    if (response && url.includes('backend-api/settings/user')) {
      const responseData = await response.clone().json();
      if (responseData) {
        const userSettingsReceivedEvent = new CustomEvent('userSettingsReceived', {
          detail: responseData,
        });
        window.dispatchEvent(userSettingsReceivedEvent);
      }
    }
    if (response && url.includes('backend-api/register-websocket')) {
      const responseData = await response.clone().json();
      if (responseData?.wss_url) {
        const registerWebsocketEvent = new CustomEvent('registerWebsocketReceived', {
          detail: responseData,
        });
        window.dispatchEvent(registerWebsocketEvent);
      }
    }
    if (response && url.includes('backend-api/conversations') && bodyObj.is_archived === true && args[1]?.method === 'PATCH') {
      const responseData = await response.clone().json();
      const archivedAllReceivedEvent = new CustomEvent('archivedAllReceived', {
        detail: responseData,
      });
      window.dispatchEvent(archivedAllReceivedEvent);
    }
    // not including is_archived or is_archived=false
    if (response && url.includes('backend-api/conversations?') && parseInt(queryParams.get('limit'), 10) === 28 && parseInt(queryParams.get('offset'), 10) % 28 === 0 && (queryParams.get('is_archived') === 'false' || queryParams.get('is_archived') === null)) {
      const responseData = await response.clone().json();
      // if items key in response data
      if ('items' in responseData) {
        const historyLoadedReceivedEvent = new CustomEvent('historyLoadedReceived', {
          detail: responseData,
        });
        const delayMultiple = Math.floor(parseInt(queryParams.get('offset'), 10) / 28);

        setTimeout(() => {
          window.dispatchEvent(historyLoadedReceivedEvent);
        }, 500 * delayMultiple);
      }
    }

    if (response && url.includes('backend-api/conversation/') && bodyObj.is_archived === false) {
      const responseData = await response.clone().json();
      if (responseData.success) {
        const conversationId = url.split('/').pop();
        const conversationUnarchivedReceivedEvent = new CustomEvent('conversationUnarchivedReceived', {
          detail: { conversationId },
        });
        window.dispatchEvent(conversationUnarchivedReceivedEvent);
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
}
