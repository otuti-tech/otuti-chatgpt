// eslint-disable-next-line prefer-const
// initialize environment to be production
let API_URL = 'https://api.wfh.team';
let STRIPE_PAYMENT_LINK_ID = '8wM5nW6oq7y287ufZ8';
let STRIPE_PORTAL_LINK_ID = '00g0237Sr78wcM03cc';
chrome.storage.local.set({ API_URL, STRIPE_PAYMENT_LINK_ID, STRIPE_PORTAL_LINK_ID });
const defaultGPTXHeaders = {};
chrome.management.getSelf(
  (extensionInfo) => {
    if (extensionInfo.installType !== 'development') {
      API_URL = 'https://dev.wfh.team:8000';
      STRIPE_PAYMENT_LINK_ID = 'test_8wM9DsccF8XT9nWeUW';
      STRIPE_PORTAL_LINK_ID = 'test_28o17Id1S70U6ZOfYY';
    }
    chrome.storage.local.set({ API_URL, STRIPE_PAYMENT_LINK_ID, STRIPE_PORTAL_LINK_ID });
  },
);
chrome.runtime.onInstalled.addListener((detail) => {
  chrome.management.getSelf(
    (extensionInfo) => {
      if (extensionInfo.installType === 'development') {
        chrome.storage.local.get({ installDate: null }, (result) => {
          if (!result.installDate) {
            chrome.storage.local.set({ installDate: Date.now() });
          }
        });
        if (detail.reason === 'install') {
          chrome.tabs.query({ url: 'https://chat.openai.com/*', active: false }, (tabs) => {
            tabs.forEach((tab) => {
              chrome.tabs.remove(tab.id);
            });
          });
          // chrome.tabs.create({ url: 'https://ezi.notion.site/Superpower-ChatGPT-FAQ-9d43a8a1c31745c893a4080029d2eb24', active: false });
          // chrome.tabs.create({ url: 'https://superpowerdaily.com', active: false });
          // chrome.tabs.create({ url: 'https://www.youtube.com/@superpowerdaily', active: false });
          chrome.tabs.create({ url: 'https://chat.openai.com', active: true });
          // } else if (detail.reason === 'update') {
          //   chrome.tabs.query({ url: 'https://www.superpowerdaily.com/', active: false }, (tabs) => {
          //     tabs.forEach((tab) => {
          //       chrome.tabs.remove(tab.id);
          //     });
          //   });

          //   checkHasSubscription(true).then((hasSubscription) => {
          //     if (!hasSubscription) {
          //       chrome.tabs.create({ url: 'https://superpowerdaily.com', active: false, pinned: true }, (tab) => {
          //         const closeTabe = () => {
          //           chrome.tabs.remove(tab.id);
          //         };
          //         setTimeout(closeTabe, 300000);
          //       });
          //     }
          //   });
        }
      }
    },
  );
});
chrome.action.onClicked.addListener((tab) => {
  if (!tab.url) {
    chrome.tabs.update(tab.id, { url: 'https://chat.openai.com' });
  } else {
    chrome.tabs.create({ url: 'https://chat.openai.com', active: true });
  }
});
//-----------------------------------
async function createHash(token) {
  const msgBuffer = new TextEncoder().encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
//-----------------------------------
function registerUser(session) {
  chrome.storage.sync.get(['name', 'nickname', 'url'], (syncResult) => {
    chrome.storage.local.get(['account', 'totalConversations', 'chatgptAccountId'], (r) => {
      const isPaid = r?.account?.accounts?.[r.chatgptAccountId || 'default']?.entitlement?.has_active_subscription || false;

      const { user, accessToken } = session;
      const { version } = chrome.runtime.getManifest();
      chrome.management.getSelf(
        (extensionInfo) => {
          if (extensionInfo.installType !== 'development') {
            chrome.runtime.setUninstallURL(`${API_URL}/gptx/uninstall?p=${user.id.split('-')[1]}`);
          }
        },
      );
      // get navigator language
      const navigatorInfo = {
        appCodeName: navigator.appCodeName,
        connectionDownlink: navigator?.connection?.downlink,
        connectionEffectiveType: navigator?.connection?.effectiveType,
        deviceMemory: navigator.deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
        language: navigator.language,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
      };

      // create hash of access token
      createHash(accessToken).then((hashAcessToken) => {
        defaultGPTXHeaders['Hat-Token'] = hashAcessToken;
        const body = {
          openai_id: user.id,
          email: user.email,
          avatar: user.image,
          name: syncResult.name ? syncResult.name : user.name,
          plus: isPaid,
          hash_access_token: hashAcessToken,
          version,
          navigator: navigatorInfo,
          total_conversations: r.totalConversations,
          multiple_accounts: r.account?.account_ordering?.length > 1 || false,
          use_websocket: r.account?.accounts?.[r.chatgptAccountId || 'default']?.features?.includes('shared_websocket') || false,
          account: r.account || null,
        };
        if (syncResult.url) body.url = syncResult.url;
        if (syncResult.nickname) body.nickname = syncResult.nickname;

        chrome.storage.sync.set({
          openai_id: user.id,
          accessToken: `Bearer ${accessToken}`,
          mfa: user.mfa ? user.mfa : false,
          hashAcessToken,
        }, () => {
          // register user to the server
          fetch(`${API_URL}/gptx/register/`, {
            method: 'POST',
            headers: {
              ...defaultGPTXHeaders,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }).then((res) => res.json())
            .then((newData) => {
              if (newData.is_banned) {
                chrome.storage.sync.clear(() => {
                  chrome.storage.local.clear(() => {
                    chrome.storage.local.set({ isBanned: true });
                  });
                });
                return;
              }
              chrome.storage.sync.set({
                user_id: newData.id,
                name: newData.name,
                nickname: newData.nickname ? newData.nickname : newData.name,
                email: newData.email,
                avatar: newData.avatar,
                url: newData.url,
                version: newData.version,
                lastUserSync: typeof r.totalConversations === 'undefined' ? null : Date.now(),
              });
            });
        });
      });
    });
  });
}
chrome.runtime.onMessage.addListener(
  // eslint-disable-next-line no-unused-vars
  (request, sender, sendResponse) => {
    if (request.authReceived) {
      const session = request.detail;
      chrome.storage.sync.get(['user_id', 'openai_id', 'version', 'avatar', 'lastUserSync', 'accessToken', 'hashAcessToken'], (result) => {
        defaultGPTXHeaders['Hat-Token'] = result.hashAcessToken;
        // or conditionor
        const { version } = chrome.runtime.getManifest();
        const shouldRegister = !result.lastUserSync
          || result.lastUserSync < Date.now() - 1000 * 60 * 60
          || !result.avatar
          || !result.user_id
          || !result.openai_id
          || !result.accessToken
          || !result.hashAcessToken
          || result.accessToken !== `Bearer ${session.accessToken}`
          || result.version !== version;

        if (result.openai_id !== session.user.id) {
          // remove any key from localstorage except the following keys: API_URL, settings, customInstructionProfiles, customPrompts, readNewsletterIds, promptChains, userInputValueHistory
          chrome.storage.local.get(['settings', 'customInstructionProfiles', 'customPrompts', 'readNewsletterIds', 'promptChains', 'userInputValueHistory'], (res) => {
            const {
              settings, customInstructionProfiles, customPrompts, readNewsletterIds, promptChains, userInputValueHistory,
            } = res;
            chrome.storage.local.clear(() => {
              chrome.storage.local.set({
                API_URL,
                settings,
                customInstructionProfiles,
                customPrompts,
                readNewsletterIds,
                promptChains,
                userInputValueHistory,
              });
            });
          });
          // remove any key from syncstorage except the following keys: lastSeenAnnouncementId, lastSeenReleaseNoteVersion
          chrome.storage.sync.get(['lastSeenAnnouncementId', 'lastSeenReleaseNoteVersion'], (res) => {
            const {
              lastSeenAnnouncementId, lastSeenReleaseNoteVersion,
            } = res;
            chrome.storage.sync.clear(() => {
              chrome.storage.sync.set({
                lastSeenAnnouncementId,
                lastSeenReleaseNoteVersion,
              }, () => registerUser(session));
            });
          });
        } else if (shouldRegister) {
          registerUser(session);
        }
      });
    }
  },
);
//-----------------------------------
function checkHasSubscription(forceRefresh = false) {
  return chrome.storage.local.get(['hasSubscription', 'lastSubscriptionCheck']).then((localRes) => {
    // if last check has subscription check once every 30 minutes
    if (!forceRefresh && localRes.hasSubscription && localRes.lastSubscriptionCheck && localRes.lastSubscriptionCheck > Date.now() - 1000 * 60 * 30) {
      return Promise.resolve(true);
    }
    // if last check not has subscription check once a minute
    if (!forceRefresh && typeof localRes.hasSubscription !== 'undefined' && !localRes.hasSubscription && localRes.lastSubscriptionCheck && localRes.lastSubscriptionCheck > Date.now() - 1000 * 60) {
      return Promise.resolve(false);
    }
    return fetch(`${API_URL}/gptx/check-has-subscription/`, {
      method: 'GET',
      headers: {
        ...defaultGPTXHeaders,
        'content-type': 'application/json',
      },
    }).then((res) => res.json()).then((res) => {
      chrome.storage.local.set({ hasSubscription: true, lastSubscriptionCheck: Date.now() });
      return true;
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.warn('error', error);
      return false;
    });
  });
}
function addPromptToLibrary(prompt, promptTitle, categories, promptLangage, modelSlug, nickname, url, hideFullPrompt = false, promptId = null) {
  chrome.storage.sync.set({
    name: nickname,
    url,
  });
  const body = {
    text: prompt.trim(),
    title: promptTitle.trim(),
    nickname,
    hide_full_prompt: hideFullPrompt,
    url,
  };
  if (modelSlug) {
    body.model_slug = modelSlug;
  }
  if (promptId) {
    body.prompt_id = promptId;
  }
  if (categories) {
    body.categories = categories.map((category) => category.trim().toLowerCase().replaceAll(/\s/g, '_')).join(',');
  }
  if (promptLangage && promptLangage !== 'select') {
    body.language = promptLangage;
  }
  return fetch(`${API_URL}/gptx/add-prompt/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}

function deletePrompt(promptId) {
  return fetch(`${API_URL}/gptx/delete-prompt/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      prompt_id: promptId,
    }),
  }).then((res) => res.json());
}
function getNewsletters(page) {
  return fetch(`${API_URL}/gptx/newsletters-paginated/?page=${page}`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getNewsletter(id) {
  return fetch(`${API_URL}/gptx/${id}/newsletter/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getLatestNewsletter() {
  return fetch(`${API_URL}/gptx/latest-newsletter/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getLatestAnnouncement() {
  return fetch(`${API_URL}/gptx/announcements/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getReleaseNote(version) {
  return fetch(`${API_URL}/gptx/release-notes/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ version }),
  }).then((res) => res.json());
}
function getLatestVersion() {
  return fetch(`${API_URL}/gptx/latest-version/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json()).then((res) => {
    const currentVersion = chrome.runtime.getManifest().version;
    const latestVersion = res?.latest_version;
    if (latestVersion && currentVersion !== latestVersion) {
      return chrome.runtime.requestUpdateCheck().then((updateCheck) => {
        if (updateCheck.status === 'update_available' && updateCheck.version === latestVersion) {
          return updateCheck;
        }
        return {
          status: 'no_update',
          version: '',
        };
      });
    }
    return {
      status: 'no_update',
      version: '',
    };
  });
}
function reloadExtension() {
  return chrome.runtime.reload().then(() => true);
}
function submitSuperpowerGizmos(gizmos, category = '') {
  const body = {
    gizmos,
    category,
  };
  return fetch(`${API_URL}/gptx/add-gizmos/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}
function updateGizmoMetrics(gizmoId, metricName, direction) {
  const body = {
    gizmo_id: gizmoId,
    metric_name: metricName,
    direction,
  };
  return fetch(`${API_URL}/gptx/update-gizmo-metrics/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}
function deleteSuperpowerGizmo(gizmoId) {
  const body = {
    gizmo_id: gizmoId,
  };
  return fetch(`${API_URL}/gptx/delete-gizmo/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}
function getSuperpowerGizmos(pageNumber, searchTerm, sortBy = 'recent', category = 'all') {
  // get user id from sync storage
  let url = `${API_URL}/gptx/get-gizmos/?order_by=${sortBy}`;
  if (pageNumber) url += `&page=${pageNumber}`;
  if (category !== 'all') url += `&category=${category}`;
  if (searchTerm && searchTerm.trim().length > 0) url += `&search=${searchTerm.trim()}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json()).then((res) => {
    // set id to gizmo_id
    res.results = res?.results?.map((gizmo) => ({
      ...gizmo,
      id: gizmo.gizmo_id,
      vanity_metrics: {
        num_conversations_str: gizmo.num_conversations_str,
        created_ago_str: gizmo.created_ago_str,
        review_stats: gizmo.review_stats,
      },
    }));
    return res;
  });
}
function getRandomGizmo() {
  const url = `${API_URL}/gptx/get-random-gizmo/`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json()).then((res) => ({ gizmo: { ...res[0], id: res[0].gizmo_id } }));
}
function addGalleryImages(images) {
  return fetch(`${API_URL}/gptx/add-gallery-images/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ gallery_images: images }),
  }).then((res) => res.json());
}
function getGalleryImages(pageNumber = 1, searchTerm = '', sortBy = '-created_at', category = 'dalle') {
  let url = `${API_URL}/gptx/get-gallery-images/?order_by=${sortBy}&category=${category}`;
  if (pageNumber) url += `&page=${pageNumber}`;
  if (searchTerm && searchTerm.trim().length > 0) url += `&search=${searchTerm.trim()}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json());
}
function getAllGalleryImages() {
  const url = `${API_URL}/gptx/get-all-gallery-images/`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json());
}
function getPrompts(pageNumber, searchTerm, sortBy = 'recent', language = 'all', category = 'all') {
  // get user id from sync storage
  let url = `${API_URL}/gptx/?order_by=${sortBy}`;
  if (sortBy === 'mine') url = `${API_URL}/gptx/?order_by=${sortBy}`;
  if (pageNumber) url += `&page=${pageNumber}`;
  if (language !== 'all') url += `&language=${language}`;
  if (category !== 'all') url += `&category=${category}`;
  if (searchTerm && searchTerm.trim().length > 0) url += `&search=${searchTerm}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json());
}
function getPrompt(promptId) {
  const url = `${API_URL}/gptx/${promptId}/`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json());
}

function incrementUseCount(promptId) {
  // increment use count
  const url = `${API_URL}/gptx/${promptId}/use-count/`;
  return fetch(url, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  }).then((response) => response.json());
}

function vote(promptId, voteType) {
  // update vote count
  const url = `${API_URL}/gptx/${promptId}/vote/`;
  return fetch(url, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vote_type: voteType }),
  }).then((response) => response.json());
}

function report(promptId) {
  // increment report count
  const url = `${API_URL}/gptx/${promptId}/report/`;
  return fetch(url, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  }).then((response) => response.json());
}

function incrementOpenRate(announcementId) {
  const url = `${API_URL}/gptx/increment-open-rate/`;
  return fetch(url, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ announcement_id: announcementId }),
  }).then((response) => response.json());
}

function incrementClickRate(announcementId) {
  const url = `${API_URL}/gptx/increment-click-rate/`;
  return fetch(url, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ announcement_id: announcementId }),
  }).then((response) => response.json());
}

function getCrossDeviceSync() {
  return chrome.storage.local.get(['chatgptAccountId']).then((r) => {
    const url = `${API_URL}/gptx/get-cross-device-sync/?account_id=${r.chatgptAccountId || 'default'}`;
    return fetch(url, {
      method: 'GET',
      headers: {
        ...defaultGPTXHeaders,
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json());
  });
}
function updateCrossDeviceSync(data) {
  return chrome.storage.local.get(['chatgptAccountId']).then((r) => {
    const url = `${API_URL}/gptx/update-cross-device-sync/`;
    return fetch(url, {
      method: 'POST',
      headers: {
        ...defaultGPTXHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversations_order: data.conversationsOrder,
        custom_instruction_profiles: data.customInstructionProfiles,
        custom_models: data.customModels,
        custom_prompts: data.customPrompts,
        prompt_chains: data.promptChains,
        settings: data.settings,
        user_input_value_history: data.userInputValueHistory,
        last_client_synced_at: data.lastClientSyncedAt,
        account_id: r.chatgptAccountId || 'default',
      }),
    }).then((response) => response.json());
  });
}
function getRemoteSettings() {
  // convert
  // created_at: "2024-02-25T20:36:19.473406-08:00"id: 1, key: "syncOldImages", value: false
  // to
  // {
  //   "syncOldImages": false
  // }
  return fetch(`${API_URL}/gptx/remote-settings/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then(
    (res) => res.json(),
  ).then((remoteSettings) => {
    const settings = {};
    remoteSettings.forEach((setting) => {
      settings[setting.key] = setting.value;
    });
    return settings;
  });
}
//-----------------------------------
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    (async () => {
      chrome.storage.sync.get(['hashAcessToken'], (result) => {
        defaultGPTXHeaders['Hat-Token'] = result.hashAcessToken;
        const data = request.detail;
        if (request.checkHasSubscription) {
          checkHasSubscription(data.forceRefresh).then((res) => {
            sendResponse(res);
          });
        } else if (request.addPromptToLibrary) {
          addPromptToLibrary(data.prompt, data.promptTitle, data.categories, data.promptLangage, data.modelSlug, data.nickname, data.url, data.hideFullPrompt, data.promptId).then((res) => {
            sendResponse(res);
          });
        } else if (request.deletePrompt) {
          deletePrompt(data.promptId).then((res) => {
            sendResponse(res);
          });
        } else if (request.getNewsletters) {
          getNewsletters(data.page).then((res) => {
            sendResponse(res);
          });
        } else if (request.getNewsletter) {
          getNewsletter(data.id).then((res) => {
            sendResponse(res);
          });
        } else if (request.getLatestNewsletter) {
          getLatestNewsletter().then((res) => {
            sendResponse(res);
          });
        } else if (request.getReleaseNote) {
          getReleaseNote(data.version).then((res) => {
            sendResponse(res);
          });
        } else if (request.getLatestVersion) {
          getLatestVersion().then((res) => {
            sendResponse(res);
          });
        } else if (request.reloadExtension) {
          reloadExtension().then((res) => {
            sendResponse(res);
          });
        } else if (request.getLatestAnnouncement) {
          getLatestAnnouncement().then((res) => {
            sendResponse(res);
          });
        } else if (request.getPrompts) {
          getPrompts(data.pageNumber, data.searchTerm, data.sortBy, data.language, data.category).then((res) => {
            sendResponse(res);
          });
        } else if (request.getRandomGizmo) {
          getRandomGizmo().then((res) => {
            sendResponse(res);
          });
        } else if (request.getSuperpowerGizmos) {
          getSuperpowerGizmos(data.pageNumber, data.searchTerm, data.sortBy, data.category).then((res) => {
            sendResponse(res);
          });
        } else if (request.submitSuperpowerGizmos) {
          submitSuperpowerGizmos(data.gizmos, data.category).then((res) => {
            sendResponse(res);
          });
        } else if (request.updateGizmoMetrics) {
          updateGizmoMetrics(data.gizmoId, data.metricName, data.direction).then((res) => {
            sendResponse(res);
          });
        } else if (request.deleteSuperpowerGizmo) {
          deleteSuperpowerGizmo(data.gizmoId).then((res) => {
            sendResponse(res);
          });
        } else if (request.addGalleryImages) {
          addGalleryImages(data.images).then((res) => {
            sendResponse(res);
          });
          // } else if (request.updateGlleryImage) {
          //   updateGlleryImage(data.openAiId, data.imageId, data.imageData).then((res) => {
          //     sendResponse(res);
          //   });
        } else if (request.getGalleryImages) {
          getGalleryImages(data.pageNumber, data.searchTerm, data.sortBy, data.category).then((res) => {
            sendResponse(res);
          });
        } else if (request.getAllGalleryImages) {
          getAllGalleryImages().then((res) => {
            sendResponse(res);
          });
        } else if (request.getPrompt) {
          getPrompt(data.promptId).then((res) => {
            sendResponse(res);
          });
        } else if (request.incrementUseCount) {
          incrementUseCount(data.promptId).then((res) => {
            sendResponse(res);
          });
        } else if (request.vote) {
          vote(data.promptId, data.voteType).then((res) => {
            sendResponse(res);
          });
        } else if (request.report) {
          report(data.promptId).then((res) => {
            sendResponse(res);
          });
        } else if (request.incrementOpenRate) {
          incrementOpenRate(data.announcementId).then((res) => {
            sendResponse(res);
          });
        } else if (request.incrementClickRate) {
          incrementClickRate(data.announcementId).then((res) => {
            sendResponse(res);
          });
        } else if (request.crossDeviceSyncPost) {
          updateCrossDeviceSync(data.payload).then((res) => {
            sendResponse(res);
          });
        } else if (request.crossDeviceSyncGet) {
          getCrossDeviceSync().then((res) => {
            sendResponse(res);
          });
        } else if (request.getRemoteSettings) {
          getRemoteSettings().then((res) => {
            sendResponse(res);
          });
        }
      });
    })();
    return true;
  },
);
