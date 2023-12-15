/* global SSE, addGizmoToList */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
let API_URL = 'https://api.wfh.team';
chrome.storage.local.get(['API_URL'], (r) => {
  API_URL = r.API_URL;
});
let lastPromptSuggestions = [];

// get auth token from sync storage
const defaultHeaders = {
  'content-type': 'application/json',
};
function getExamplePrompts(offset = 0, limit = 4) {
  const url = new URL('https://chat.openai.com/backend-api/prompt_library/');
  const params = { offset, limit };
  url.search = new URLSearchParams(params).toString();
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((response) => response.json()))
    .then((data) => {
      lastPromptSuggestions = data.items.map((item) => item.prompt);
      return data;
    });
}

function generateSuggestions(conversationId, messageId, model, numSuggestions = 2) {
  const payload = {
    message_id: messageId,
    model,
    num_suggestions: numSuggestions,
  };
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/conversation/${conversationId}/experimental/generate_suggestions`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
    body: JSON.stringify(payload),
  }).then((response) => response.json()))
    .then((data) => {
      lastPromptSuggestions = data.suggestions;
      return data;
    });
}
function convertGizmoToPayload(gizmoResource) {
  return {
    id: gizmoResource.gizmo.id,
    name: gizmoResource.gizmo.display.name,
    author: gizmoResource.gizmo.author,
    config: {
      context_message: gizmoResource.gizmo.instructions,
      model_slug: null,
      assistant_welcome_message: gizmoResource.gizmo.display.welcome_message,
      prompt_starters: gizmoResource.gizmo.display.prompt_starters,
      enabled_tools: gizmoResource.tools.map((t) => ({ tool_id: t.type })),
      files: gizmoResource.files,
      tags: gizmoResource.gizmo.tags,
    },
    description: gizmoResource.gizmo.display.description,
    owner_id: gizmoResource.gizmo.author.user_id,
    updated_at: gizmoResource.gizmo.updated_at,
    profile_pic_permalink: gizmoResource.gizmo.display.profile_picture_url,
    share_recipient: gizmoResource.gizmo.share_recipient,
    version: gizmoResource.gizmo.version,
    live_version: gizmoResource.gizmo.live_version,
    short_url: gizmoResource.gizmo.short_url,
    vanity_metrics: gizmoResource.gizmo.vanity_metrics,
    allowed_sharing_recipients: gizmoResource.gizmo.allowed_sharing_recipients,
    product_features: gizmoResource.product_features,
  };
}
function generateChat(userInputParts, conversationId, messageId, parentMessageId, token, gizmoResource = null, metadata = {}, suggestions = [], saveHistory = true, role = 'user', name = '', action = 'next', contentType = 'text') {
  return chrome.storage.local.get(['settings', 'enabledPluginIds', 'installedPlugins', 'gizmosBootstrap']).then((res) => chrome.storage.sync.get(['accessToken']).then((result) => {
    const payload = {
      action,
      force_paragen: false,
      force_rate_limit: false,
      arkose_token: token,
      model: res.settings.selectedModel.slug,
      parent_message_id: parentMessageId,
      history_and_training_disabled: !saveHistory,
      suggestions,
      timezone_offset_min: new Date().getTimezoneOffset(),
      conversation_mode: {
        kind: gizmoResource ? 'gizmo_interaction' : 'primary_assistant',
      },
    };
    if (action === 'next' || action === 'variant') {
      payload.messages = messageId
        ? [
          {
            id: messageId,
            author: {
              role,
              name,
            },
            content: {
              content_type: contentType,
              parts: userInputParts,
            },
            metadata,
          },
        ]
        : null;
    }
    const replyToText = metadata?.targeted_reply;
    if (messageId && replyToText) {
      payload.messages.push({
        id: self.crypto.randomUUID(),
        author: {
          role: 'system',
        },
        content: {
          content_type: 'text',
          parts: [
            `User is replying to this part in particular: [${replyToText}]`,
          ],
        },
        metadata: {
          exclude_after_next_user_message: true,
        },
      });
    }
    if (action === 'variant') {
      payload.variant_purpose = 'comparison_implicit';
    }
    if (gizmoResource) {
      payload.conversation_mode.gizmo = gizmoResource;
      payload.conversation_mode.gizmo_id = gizmoResource.gizmo.id;
    }
    if (conversationId) {
      payload.conversation_id = conversationId;
    }
    // plugin model: text-davinci-002-plugins
    if (!conversationId && (res.settings.selectedModel.slug.includes('plugins') || res.settings.selectedModel.slug === 'gpt-4')) {
      // remove plugin ids from enabledPluginIds that are not installed
      const newEnabledPluginIds = res.enabledPluginIds.filter((id) => res.installedPlugins.find((p) => p.id === id));
      payload.plugin_ids = newEnabledPluginIds;
      chrome.storage.local.set({ enabledPluginIds: newEnabledPluginIds });
    }
    // clear arkose once used
    window.localStorage.removeItem('arkoseToken');
    const eventSource = new SSE(
      '/backend-api/conversation',
      {
        method: 'POST',
        headers: {
          ...defaultHeaders,
          accept: 'text/event-stream',
          Authorization: result.accessToken,
        },
        payload: JSON.stringify(payload),
      },
    );
    eventSource.stream();
    return eventSource;
  }));
}
function getConversation(conversationId, forceRefresh = false) {
  return chrome.storage.local.get(['conversations', 'conversationsAreSynced', 'settings']).then((res) => {
    const { conversations, conversationsAreSynced } = res;
    const { autoSync } = res.settings;
    if (!forceRefresh && (typeof autoSync === 'undefined' || autoSync) && conversationsAreSynced && conversations && conversations[conversationId]) {
      if (!conversations[conversationId].shouldRefresh) {
        return conversations[conversationId];
      }
    }
    return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/conversation/${conversationId}`, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        Authorization: result.accessToken,
      },

    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    }));
  });
}
function getAccount() {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch('https://chat.openai.com/backend-api/accounts/check', {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }));
}
function getGizmosBootstrap(limit = 2) {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/gizmos/bootstrap?limit=${limit}`, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }));
}
function updateGizmoSidebar(gizmoId, action) {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/gizmos/${gizmoId}/sidebar`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
    body: JSON.stringify({ action }),
  }).then((response) => {
    // update gizmosBootstrap
    chrome.storage.local.get(['gizmosBootstrap']).then((res) => {
      const { gizmosBootstrap } = res;

      const gizmoData = gizmosBootstrap?.gizmos?.find((g) => g?.resource?.gizmo?.id === gizmoId);
      if (gizmoData) {
        chrome.storage.local.set({
          gizmosBootstrap: {
            ...gizmosBootstrap,
            gizmos: [
              ...gizmosBootstrap.gizmos.filter((g) => g?.resource?.gizmo?.id !== gizmoId),
              {
                ...gizmoData,
                flair: {
                  ...gizmoData.flair,
                  kind: action === 'keep' ? 'sidebar_keep' : 'recent',
                },
              },
            ],
          },
        }, () => {
          // update sidebar
          const gptList = document.querySelector('#gpt-list');
          const gizmoItem = gptList.querySelector(`a[href*="${gizmoId}"]`)?.parentElement;
          const gptListRecentBorder = document.querySelector('#gpt-list-recent-border');
          if (action === 'keep') {
            if (gizmoItem) {
              gptList.insertBefore(gizmoItem, gptListRecentBorder);
            } else {
              addGizmoToList(gizmoId, false);
            }
          } else if (gizmoItem && action === 'hide') {
            gizmoItem.remove();
          }
          if (gptListRecentBorder?.nextElementSibling?.id === 'gpt-list-explore-button') {
            gptListRecentBorder.remove();
          }
          // update top gizmo menu option
          // gizmo-menu-option-hide-from-sidebar
          // if gizmoId is in url path
          if (window.location.pathname.includes(gizmoId)) {
            if (action === 'hide') {
              const gizmoMenuOptionHideFromSidebar = document.querySelector('#gizmo-menu-option-hide-from-sidebar');
              if (gizmoMenuOptionHideFromSidebar) {
                gizmoMenuOptionHideFromSidebar.id = 'gizmo-menu-option-keep-in-sidebar';
                gizmoMenuOptionHideFromSidebar.innerHTML = '<svg class="mr-2 icon-md" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.4845 2.8798C16.1773 1.57258 14.0107 1.74534 12.9272 3.24318L9.79772 7.56923C9.60945 7.82948 9.30775 7.9836 8.98654 7.9836H6.44673C3.74061 7.9836 2.27414 11.6759 4.16948 13.5713L6.59116 15.993L2.29324 20.2909C1.90225 20.6819 1.90225 21.3158 2.29324 21.7068C2.68422 22.0977 3.31812 22.0977 3.70911 21.7068L8.00703 17.4088L10.4287 19.8305C12.3241 21.7259 16.0164 20.2594 16.0164 17.5533V15.0135C16.0164 14.6923 16.1705 14.3906 16.4308 14.2023L20.7568 11.0728C22.2547 9.98926 22.4274 7.8227 21.1202 6.51549L17.4845 2.8798ZM11.8446 18.4147C12.4994 19.0694 14.0141 18.4928 14.0141 17.5533V15.0135C14.0141 14.0499 14.4764 13.1447 15.2572 12.58L19.5832 9.45047C20.0825 9.08928 20.1401 8.3671 19.7043 7.93136L16.0686 4.29567C15.6329 3.85993 14.9107 3.91751 14.5495 4.4168L11.4201 8.74285C10.8553 9.52359 9.95016 9.98594 8.98654 9.98594H6.44673C5.5072 9.98594 4.93059 11.5006 5.58535 12.1554L11.8446 18.4147Z" fill="currentColor"></path></svg>Keep in sidebar';
              }
            } else if (action === 'keep') {
              // gizmo-menu-option-keep-in-sidebar
              const gizmoMenuOptionKeepInSidebar = document.querySelector('#gizmo-menu-option-keep-in-sidebar');
              if (gizmoMenuOptionKeepInSidebar) {
                gizmoMenuOptionKeepInSidebar.id = 'gizmo-menu-option-hide-from-sidebar';
                gizmoMenuOptionKeepInSidebar.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 icon-md"><path d="M15 15V17.5585C15 18.4193 14.4491 19.1836 13.6325 19.4558L13.1726 19.6091C12.454 19.8487 11.6616 19.6616 11.126 19.126L4.87403 12.874C4.33837 12.3384 4.15132 11.546 4.39088 10.8274L4.54415 10.3675C4.81638 9.55086 5.58066 9 6.44152 9H9M12 6.2L13.6277 3.92116C14.3461 2.91549 15.7955 2.79552 16.6694 3.66942L20.3306 7.33058C21.2045 8.20448 21.0845 9.65392 20.0788 10.3723L18 11.8571" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 16L3 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 4L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>Hide from sidebar';
              }
            }
          }
        });
      }
    });
  }));
}
function getConversationTemplates(workspaceId, gizmoId) {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/workspaces/${workspaceId}/conversation_templates/${gizmoId}`, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  }));
}
function deleteGizmo(gizmoId) {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/gizmos/${gizmoId}`, {
    method: 'DELETE',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((response) => {
    if (response.ok) {
      chrome.runtime.sendMessage({
        deleteSuperpowerGizmo: true,
        detail: {
          gizmoId,
        },
      });
      return response.json();
    }
    return Promise.reject(response);
  }));
}
function getGizmoById(gizmoId, forceRefresh = false) {
  if (!gizmoId) {
    return Promise.resolve(null);
  }
  return chrome.storage.local.get(['gizmosBootstrap']).then((res) => {
    const { gizmosBootstrap } = res;

    const gizmoData = gizmosBootstrap?.gizmos?.find((g) => g?.resource?.gizmo?.id === gizmoId);
    if (gizmoData && !forceRefresh) {
      return gizmoData;
    }
    return chrome.storage.sync.get(['accessToken', 'openai_id']).then((result) => fetch(`https://chat.openai.com/backend-api/gizmos/${gizmoId}`, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        Authorization: result.accessToken,
      },
    }).then((response) => {
      if (response.ok) {
        // add to gizmosBootstrap
        return response.json();
      }
      return Promise.reject(response);
    }).then((data) => {
      // add gizmo to superpower
      chrome.runtime.sendMessage({
        submitSuperpowerGizmos: true,
        detail: {
          openAiId: result.openai_id,
          gizmos: [data.gizmo],
        },
      });
      // add to gizmosBootstrap
      chrome.storage.local.set({
        gizmosBootstrap: {
          ...gizmosBootstrap,
          gizmos: [
            ...gizmosBootstrap.gizmos.filter((g) => g?.resource?.gizmo?.id !== gizmoId),
            {
              flair: { kind: 'recent' },
              resource: data,
            },
          ],
        },
      });
      return {
        flair: { kind: 'recent' },
        resource: data,
      };
    }));
  });
}
function getGizmoDiscovery(type, cursor, limit = 24) {
  let url = new URL('https://chat.openai.com/public-api/gizmos/discovery');
  if (type) url = new URL(`https://chat.openai.com/public-api/gizmos/discovery/${type}`);
  if (cursor) url.searchParams.append('cursor', cursor);
  if (limit) url.searchParams.append('limit', limit);
  return chrome.storage.sync.get(['accessToken', 'openai_id']).then((result) => fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  }).then((data) => {
    // uncomment this when gizmo discovery is fixed
    const gizmos = type ? data.list.items.map((item) => item.resource.gizmo) : data.cuts.map((cut) => cut.list.items.map((item) => item.resource.gizmo)).flat();
    // remove this when gizmo discovery is fixed
    // const gizmos = data.cuts.map((cut) => cut.list.items.map((item) => item.resource.gizmo)).flat();
    chrome.runtime.sendMessage({
      submitSuperpowerGizmos: true,
      detail: {
        openAiId: result.openai_id,
        gizmos,
      },
    });
    // remove this when gizmo discovery is fixed
    // if (type) return data.cuts.find((cut) => cut.info.id === type);
    return data;
  }));
}
function updateActionSettings(gizmoId, domain, gizmoActionId, actionSettings) {
  const payload = {
    domain,
    gizmo_action_id: gizmoActionId,
    action_settings: actionSettings,
  };
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch('https://chat.openai.com/backend-api/gizmos/action_settings', {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) {
      getGizmoUserActionSettings(gizmoId, true);
      return response.json();
    }
    return Promise.reject(response);
  }));
}
// https://chat.openai.com/backend-api/gizmos/user_action_settings?gizmo_id=g-TsiYOneyk
function getGizmoUserActionSettings(gizmoId, forceRefresh = false) {
  return chrome.storage.local.get(['gizmoUserActionSettings']).then((res) => {
    const gizmoUserActionSettings = res.gizmoUserActionSettings || {};

    if (gizmoUserActionSettings[gizmoId] && !forceRefresh) {
      return gizmoUserActionSettings[gizmoId];
    }
    return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/gizmos/user_action_settings?gizmo_id=${gizmoId}`, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        Authorization: result.accessToken,
      },
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    }).then((data) => {
      gizmoUserActionSettings[gizmoId] = data;
      chrome.storage.local.set({
        gizmoUserActionSettings,
      });
      return data;
    }));
  });
}
// {
//   "account_plan": {
//     "is_paid_subscription_active": true,
//     "subscription_plan": "chatgptplusplan",
//     "account_user_role": "account-owner",
//     "was_paid_customer": true,
//     "has_customer_object": true
//   },
//   "user_country": "US",
//   "features": [
//     "model_switcher",
//     "system_message"
//   ]
// }
function createFileInServer(file, useCase) {
  // get filesize
  const payload = {
    file_name: file.name,
    file_size: file.size,
    use_case: useCase,
  };
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch('https://chat.openai.com/backend-api/files', {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
    body: JSON.stringify(payload),
  }).then((res) => {
    if (res.ok) {
      return res.json();
      // {
      //   "status": "success",
      //     "upload_url": "https://fileserviceuploadsperm.blob.core.windows.net/files/file-WY8iSpWv8dVG6Y32heI7Bx1E?se=2023-10-04T21%3A25%3A34Z&sp=c&sv=2021-08-06&sr=b&sig=RcCQ5Sk0BQOZ6KAMT0UIa9br5C5IVGtoWevk/E84Chw%3D",
      //       "file_id": "file-WY8iSpWv8dVG6Y32heI7Bx1E"
      // }
    }
    return Promise.reject(res);
  }));
}
// {
//   "id": "file-lHLuMEsIDvUV9Ue09nOm6PAT",
//   "name": "SaeedEzzati.pdf",
//   "creation_time": "2023-12-03 19:14:12.392627+00:00",
//   "state": "ready",
//   "ready_time": "2023-12-03 19:14:13.158478+00:00",
//   "size": 124824,
//   "metadata": {
//       "retrieval": {
//           "status": "parsed"
//       }
//   },
//   "use_case": "my_files",
//   "retrieval_index_status": "parsed",
//   "file_size_tokens": 0
// }
// {
//   "id": "file-lHLuMEsIDvUV9Ue09nOm6PAT",
//   "name": "SaeedEzzati.pdf",
//   "creation_time": "2023-12-03 19:14:12.392627+00:00",
//   "state": "ready",
//   "ready_time": "2023-12-03 19:14:13.158478+00:00",
//   "size": 124824,
//   "metadata": {
//       "retrieval": {
//           "status": "success"
//       }
//   },
//   "use_case": "my_files",
//   "retrieval_index_status": "success",
//   "file_size_tokens": 768
// }
function getFileStatus(fileId) {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/files/${fileId}`, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }));
}
function uploadFileAPI(fileId, uploadUrl, file) {
  return fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'x-ms-blob-type': 'BlockBlob',
    },
    body: file,
  }).then((res) => {
    if (res.ok) {
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  });
}
function uploadedAPI(fileId) {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/files/${fileId}/uploaded`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
      // {
      //   "status": "success",
      //     "download_url": "https://fileserviceuploadsperm.blob.core.windows.net/files/file-WY8iSpWv8dVG6Y32heI7Bx1E?se=2023-10-04T21%3A25%3A38Z&sp=r&sv=2021-08-06&sr=b&rscd=attachment%3B%20filename%3D6c2b35cf-4d72-42ad-a004-6becbdc6e799.png&sig=Lii1Uuy2QHFqZ0o0GKv3CtqXzOcdUDGHwX5/NhuMZ3k%3D",
      //       "metadata": null
      // }
    }
    return Promise.reject(res);
  }));
}
function getDownloadUrlFromFileId(fileId) {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/files/${fileId}/download`, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }));
}
// https://chat.openai.com/backend-api/conversation/f291cc96-96d7-4ac1-a6e9-491b3281b4fa/interpreter/download?message_id=b26793a5-0432-4eeb-9164-09ea13a3468c&sandbox_path=/mnt/data/subscribers_per_day_line_chart.png
function getDownloadUrlFromSandBoxPath(conversationId, messageId, sandboxPath) {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/conversation/${conversationId}/interpreter/download?message_id=${messageId}&sandbox_path=${sandboxPath}`, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }));
}

function setUserSystemMessage(aboutUser, aboutModel, enabled) {
  const payload = {
    about_user_message: aboutUser,
    about_model_message: aboutModel,
    enabled,
  };
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch('https://chat.openai.com/backend-api/user_system_messages', {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
    body: JSON.stringify(payload),
  }).then((res) => res.json()))
    .then((data) => {
      chrome.storage.local.set({ customInstructionProfileIsEnabled: data.enabled });
    });
}
function getUserSystemMessage() {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch('https://chat.openai.com/backend-api/user_system_messages', {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((res) => res.json()))
    .then((data) => {
      chrome.storage.local.get(['customInstructionProfiles'], (result) => {
        const { customInstructionProfiles } = result;

        const newCustomInstructionProfiles = customInstructionProfiles.map((p) => {
          if (p.isSelected) {
            if (p.aboutModel === data.about_model_message && p.aboutUser === data.about_user_message) {
              return p;
            }
            return { ...p, isSelected: false };
          }
          if (p.aboutModel === data.about_model_message && p.aboutUser === data.about_user_message) {
            return { ...p, isSelected: true };
          }
          return p;
        });
        chrome.storage.local.set({ customInstructionProfiles: newCustomInstructionProfiles });
      });
      return data;
    });
}
function getModels() {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch('https://chat.openai.com/backend-api/models', {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((response) => response.json()))
    .then((data) => {
      if (data.models) {
        chrome.storage.local.get(['settings', 'models'], (res) => {
          const { models, settings } = res;
          chrome.storage.local.set({
            models: data.models,
            settings: { ...settings, selectedModel: settings.selectedModel || data.models?.[0] },
          });
          if (data.models.map((m) => m.slug).find((m) => m.includes('plugins'))) {
            setTimeout(() => {
              getAllPlugins();
              getInstalledPlugins();
            }, 1000);
          }
        });
      }
    });
}
function getConversationLimit() {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch('https://chat.openai.com/public-api/conversation_limit', {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((response) => response.json())
    .then((data) => {
      if (data.message_cap) {
        chrome.storage.local.set({
          conversationLimit: data,
        });
      }
    }));
}
function openGraph(url) {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/opengraph/tags??url=${url}`, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((response) => response.json()));
}

function messageFeedback(conversationId, messageId, rating, text = '') {
  const data = {
    conversation_id: conversationId,
    message_id: messageId,
    rating,
    tags: [],
  };
  if (text) {
    data.text = text;
  }
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch('https://chat.openai.com/backend-api/conversation/message_feedback', {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json()));
}
function getAllPlugins() {
  return getPlugins(0, 250, undefined, 'approved').then((res) => {
    chrome.storage.local.set({
      allPlugins: res.items,
    });
  });
}
function getApprovedPlugins() {
  getPlugins(0, 100, undefined, 'approved').then((res) => res);
}
function getInstalledPlugins() {
  getPlugins(0, 250, true, undefined).then((res) => {
    chrome.storage.local.set({
      installedPlugins: res.items,
    });
  });
}
function getPlugins(offset = 0, limit = 20, isInstalled = undefined, statuses = undefined) {
  const url = new URL('https://chat.openai.com/backend-api/aip/p');
  // without passing limit it returns 20 by default
  // limit cannot be more than 100
  const params = { offset, limit };
  url.search = new URLSearchParams(params).toString();
  if (isInstalled !== undefined) {
    url.searchParams.append('is_installed', isInstalled);
  }
  if (statuses) {
    url.searchParams.append('statuses', statuses);
  }
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }));
}
function installPlugin(pluginId) {
  const url = new URL(`https://chat.openai.com/backend-api/aip/p/${pluginId}/user-settings`);
  // without passing limit it returns 20 by default
  // limit cannot be more than 100
  const data = {
    is_installed: true,
  };
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(url, {
    method: 'PATCH',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
    body: JSON.stringify(data),

  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }));
}
function uninstallPlugin(pluginId) {
  const url = new URL(`https://chat.openai.com/backend-api/aip/p/${pluginId}/user-settings`);
  // without passing limit it returns 20 by default
  // limit cannot be more than 100
  const data = {
    is_installed: false,
  };
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(url, {
    method: 'PATCH',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
    body: JSON.stringify(data),

  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }));
}
function userSettings(pluginId) {
  const url = new URL(`https://chat.openai.com/backend-api/aip/${pluginId}/user-settings`);
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }));
}

function createShare(conversationId, currentNodeId, isAnnonymous = true) {
  const url = new URL('https://chat.openai.com/backend-api/share/create');
  // without passing limit it returns 50 by default
  // limit cannot be more than 20
  const data = {
    is_anonymous: isAnnonymous,
    conversation_id: conversationId,
    current_node_id: currentNodeId,
    // message_id: `aaa1${self.crypto.randomUUID().slice(4)}`,
  };
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(url, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
    body: JSON.stringify(data),

  }).then((res) => {
    if (res.ok) {
      const jsonData = res.json();
      return jsonData;
    }
    return Promise.reject(res);
  }));
}

function share(shareId, title, highlightedMessageId, isAnonymous = true, isVisibile = true, isPublic = true) {
  const url = new URL(`https://chat.openai.com/backend-api/share/${shareId}`);
  // without passing limit it returns 50 by default
  // limit cannot be more than 20
  const data = {
    is_public: isPublic,
    is_anonymous: isAnonymous,
    is_visible: isVisibile,
    title,
    highlighted_message_id: highlightedMessageId,
    share_id: shareId,
  };
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(url, {
    method: 'PATCH',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
    body: JSON.stringify(data),

  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }));
}

function deleteShare(shareId) {
  const url = new URL(`https://chat.openai.com/backend-api/share/${shareId}`);
  // without passing limit it returns 50 by default
  // limit cannot be more than 20
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(url, {
    method: 'DELETE',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }));
}
// returnsa thenable promise. If selectedConversations exist, return them, otherwise get all conversations
function getSelectedConversations(forceRefresh = false) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['selectedConversations'], (result) => {
      if (!forceRefresh && result.selectedConversations && result.selectedConversations.length > 0) {
        resolve(result.selectedConversations);
      } else {
        resolve(getAllConversations());
      }
    });
  });
}

function getAllConversations(forceRefresh = false) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['conversations', 'conversationsAreSynced', 'settings']).then((res) => {
      const {
        conversations, conversationsAreSynced, settings,
      } = res;
      const { autoSync } = settings;

      if (!forceRefresh && conversationsAreSynced && (typeof autoSync === 'undefined' || autoSync)) {
        const visibleConversation = Object.values(conversations);
        resolve(visibleConversation);
      } else {
        const allConversations = [];
        const initialOffset = 0;
        const initialLimit = 100;
        getConversations(initialOffset, initialLimit).then((convs) => {
          const {
            limit, offset, items,
          } = convs;
          // eslint-disable-next-line no-nested-ternary
          const total = convs.total ? Math.min(convs.total, 10000) : 10000; // sync last 10000 conversations
          if (items.length === 0 || total === 0) {
            resolve([]);
            return;
          }
          allConversations.push(...items);
          if (offset + limit < total) {
            const promises = [];
            for (let i = 1; i < Math.ceil(total / limit); i += 1) {
              promises.push(getConversations(i * limit, limit));
            }
            Promise.all(promises).then((results) => {
              results.forEach((result) => {
                if (result.items) {
                  allConversations.push(...result.items);
                }
              });
              resolve(allConversations);
            }, (err) => {
              console.warn('error getting conversations promise', err);
              if (conversationsAreSynced) {
                const visibleConversation = Object.values(conversations).filter((conversation) => !conversation.archived);
                resolve(visibleConversation);
              }
              resolve(Promise.reject(err));
            });
          } else {
            resolve(allConversations);
          }
        }, (err) => {
          console.warn('error getting conversations', err);
          if (conversationsAreSynced) {
            const visibleConversation = Object.values(conversations).filter((conversation) => !conversation.archived);
            resolve(visibleConversation);
          }
          resolve(Promise.reject(err));
        });
      }
    });
  });
}
function getSharedConversations(offset = 0, limit = 100) {
  const url = new URL('https://chat.openai.com/backend-api/shared_conversations');
  // without passing limit it returns 50 by default
  // limit cannot be more than 20
  // const params = { offset, limit };
  // url.search = new URLSearchParams(params).toString();
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }));
}
function getConversations(offset = 0, limit = 100, order = 'updated') {
  const url = new URL('https://chat.openai.com/backend-api/conversations');
  // without passing limit it returns 50 by default
  // limit cannot be more than 20
  const params = { offset, limit, order };
  url.search = new URLSearchParams(params).toString();
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }));
}
function updateConversation(id, data) {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/conversation/${id}`, {
    method: 'PATCH',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json()));
}
function generateTitle(conversationId, messageId) {
  return chrome.storage.local.get(['settings']).then((res) => {
    const data = {
      message_id: messageId,
    };
    return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/conversation/gen_title/${conversationId}`, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        Authorization: result.accessToken,
      },
      body: JSON.stringify(data),
    }).then((response) => response.json()));
  });
}
function renameConversation(conversationId, title) {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/conversation/${conversationId}`, {
    method: 'PATCH',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
    body: JSON.stringify({ title }),
  }).then((res) => res.json()));
}
function deleteConversation(conversationId) {
  return chrome.storage.local.get(['conversations']).then((localRes) => {
    const { conversations } = localRes;
    if (!conversations[conversationId].saveHistory) {
      return { success: true };
    }
    return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chat.openai.com/backend-api/conversation/${conversationId}`, {
      method: 'PATCH',
      headers: {
        ...defaultHeaders,
        Authorization: result.accessToken,
      },
      body: JSON.stringify({ is_visible: false }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(res);
    }));
  });
}
function deleteAllConversations() {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch('https://chat.openai.com/backend-api/conversations', {
    method: 'PATCH',
    headers: {
      ...defaultHeaders,
      Authorization: result.accessToken,
    },
    body: JSON.stringify({ is_visible: false }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }));
}
