// eslint-disable-next-line prefer-const
// initialize environment to be production
let API_URL = 'https://api.wfh.team';
let STRIPE_PAYMENT_LINK_ID = 'aEU5nW3ce8C61J6eV3';
let STRIPE_PORTAL_LINK_ID = '00g0237Sr78wcM03cc';
chrome.storage.local.set({ API_URL, STRIPE_PAYMENT_LINK_ID, STRIPE_PORTAL_LINK_ID });

chrome.management.getSelf(
  (extensionInfo) => {
    if (extensionInfo.installType === 'development') {
      API_URL = 'https://dev.wfh.team:8000';
      STRIPE_PAYMENT_LINK_ID = 'test_8wM9DsccF8XT9nWeUW';
      STRIPE_PORTAL_LINK_ID = 'test_28o17Id1S70U6ZOfYY';
    }
    chrome.storage.local.set({ API_URL, STRIPE_PAYMENT_LINK_ID, STRIPE_PORTAL_LINK_ID });
  },
);

chrome.runtime.onMessage.addListener(
  // eslint-disable-next-line no-unused-vars
  (request, sender, sendResponse) => {
    if (request.setUninstallURL) {
      chrome.runtime.setUninstallURL(`${API_URL}/gptx/uninstall?p=${request.userId}`);
    }
  },
);
chrome.runtime.onInstalled.addListener((detail) => {
  chrome.management.getSelf(
    (extensionInfo) => {
      if (extensionInfo.installType !== 'development') {
        if (detail.reason === 'install') {
          chrome.tabs.create({ url: 'https://ezi.notion.site/Superpower-ChatGPT-FAQ-9d43a8a1c31745c893a4080029d2eb24', active: false });
          chrome.tabs.create({ url: 'https://superpowerdaily.com', active: false });
          chrome.tabs.create({ url: 'https://www.youtube.com/@superpowerdaily', active: false });
          chrome.tabs.create({ url: 'https://chat.openai.com', active: true });
        } else {
          chrome.tabs.query({ url: 'https://www.superpowerdaily.com/', active: false }, (tabs) => {
            tabs.forEach((tab) => {
              chrome.tabs.remove(tab.id);
            });
          });
          chrome.storage.local.get(['settings'], (result) => {
            if (result.settings?.showNewsletterOnUpdate) {
              chrome.tabs.create({ url: 'https://superpowerdaily.com', active: false, pinned: true }, (tab) => {
                const closeTabe = () => {
                  chrome.tabs.remove(tab.id);
                };
                setTimeout(closeTabe, 300000);
              });
            } else {
              checkHasSubscription(true).then((hasSubscription) => {
                if (!hasSubscription) {
                  chrome.tabs.create({ url: 'https://superpowerdaily.com', active: false, pinned: true }, (tab) => {
                    const closeTabe = () => {
                      chrome.tabs.remove(tab.id);
                    };
                    setTimeout(closeTabe, 300000);
                  });
                }
              });
            }
          });
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
function registerUser(data) {
  chrome.storage.local.get(['account'], (r) => {
    const { account } = r;
    const isPaid = account?.accounts?.default?.entitlement?.has_active_subscription || false;
    const { user, accessToken } = data;
    const { version } = chrome.runtime.getManifest();
    // create hash of access token
    createHash(accessToken).then((hashAcessToken) => {
      const body = {
        openai_id: user.id,
        email: user.email,
        avatar: user.image,
        name: user.name,
        plus: isPaid,
        hash_access_token: hashAcessToken,
        version,
      };
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
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }).then((res) => res.json())
          .then((newData) => {
            chrome.storage.sync.set({
              user_id: newData.id,
              name: newData.name,
              nickname: newData.nickname ? newData.nickname : newData.name,
              email: newData.email,
              avatar: newData.avatar,
              url: newData.url,
              version: newData.version,
              lastUserSync: Date.now(),
            });
            chrome.storage.local.get(['settings'], (result) => {
              chrome.storage.local.set({ settings: { ...result.settings, emailNewsletter: newData.email_newsletter } });
            });
            chrome.runtime.sendMessage({ setUninstallURL: true, userId: user.id.split('-')[1] });
          });
      });
    });
  });
}
chrome.runtime.onMessage.addListener(
  // eslint-disable-next-line no-unused-vars
  (request, sender, sendResponse) => {
    if (request.authReceived) {
      const data = request.detail;
      chrome.storage.sync.get(['user_id', 'openai_id', 'version', 'avatar', 'lastUserSync', 'accessToken', 'hashAcessToken'], (result) => {
        // or conditionor
        const { version } = chrome.runtime.getManifest();
        const shouldRegister = !result.lastUserSync
          || result.lastUserSync < Date.now() - 1000 * 60 * 60 * 24
          || !result.avatar
          || !result.user_id
          || !result.openai_id
          || !result.accessToken
          || !result.hashAcessToken
          || result.accessToken !== `Bearer ${data.accessToken}`
          || result.version !== version;
        chrome.storage.sync.set({
          lastUserSync: null,
        }, () => {
          if (result.openai_id !== data.user.id) {
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
                }, () => registerUser(data));
              });
            });
          } else if (shouldRegister) {
            registerUser(data);
          }
        });
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
    if (!forceRefresh && !localRes.hasSubscription && localRes.lastSubscriptionCheck && localRes.lastSubscriptionCheck > Date.now() - 1000 * 60) {
      return Promise.resolve(false);
    }
    return chrome.storage.sync.get(['hashAcessToken']).then((result) => {
      if (!result.hashAcessToken) return Promise.resolve(false);
      return fetch(`${API_URL}/gptx/check-has-subscription/?hat=${result.hashAcessToken}`).then((res) => res.json()).then((res) => {
        if (res.success) {
          chrome.storage.local.set({ hasSubscription: true, lastSubscriptionCheck: Date.now() });
          return true;
        }
        chrome.storage.local.set({ hasSubscription: false, lastSubscriptionCheck: Date.now() });
        return false;
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.warn('error', error);
        return false;
      });
    });
  });
}
function submitPrompt(openAiId, prompt, promptTitle, categories, promptLangage, modelSlug, nickname, url, hideFullPrompt = false, promptId = null) {
  chrome.storage.sync.set({
    name: nickname,
    url,
  });
  const body = {
    openai_id: openAiId,
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
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}

function deletePrompt(promptId) {
  return chrome.storage.sync.get(['openai_id']).then((result) => {
    const openAiId = result.openai_id;
    return fetch(`${API_URL}/gptx/delete-prompt/`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        openai_id: openAiId,
        prompt_id: promptId,
      }),
    }).then((res) => res.json());
  });
}
function getNewsletters() {
  return fetch(`${API_URL}/gptx/newsletters/`).then((res) => res.json());
}
function getNewsletter(id) {
  return fetch(`${API_URL}/gptx/${id}/newsletter/`).then((res) => res.json());
}
function getLatestNewsletter() {
  return fetch(`${API_URL}/gptx/latest-newsletter/`).then((res) => res.json());
}
function getLatestAnnouncement() {
  return fetch(`${API_URL}/gptx/announcements/`).then((res) => res.json());
}
function getReleaseNote(version) {
  return fetch(`${API_URL}/gptx/release-notes/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ version }),
  }).then((res) => res.json());
}

function submitSuperpowerGizmos(openAiId, gizmos) {
  const body = {
    openai_id: openAiId,
    gizmos,
  };
  return fetch(`${API_URL}/gptx/add-gizmos/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}
function updateGizmoMetrics(gizmoId, metricName, direction) {
  return chrome.storage.sync.get(['hashAcessToken']).then((result) => {
    const body = {
      hat: result.hashAcessToken,
      gizmo_id: gizmoId,
      metric_name: metricName,
      direction,
    };
    return fetch(`${API_URL}/gptx/update-gizmo-metrics/`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());
  });
}
function deleteSuperpowerGizmo(gizmoId) {
  return chrome.storage.sync.get(['hashAcessToken']).then((result) => {
    const body = {
      hat: result.hashAcessToken,
      gizmo_id: gizmoId,
    };
    return fetch(`${API_URL}/gptx/delete-gizmo/`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());
  });
}
function getSuperpowerGizmos(hat, pageNumber, searchTerm, sortBy = 'recent', category = 'all') {
  // get user id from sync storage
  return chrome.storage.sync.get(['hashAcessToken']).then((result) => {
    let url = `${API_URL}/gptx/get-gizmos/?hat=${result.hashAcessToken}&order_by=${sortBy}`;
    if (pageNumber) url += `&page=${pageNumber}`;
    if (category !== 'all') url += `&category=${category}`;
    if (searchTerm && searchTerm.trim().length > 0) url += `&search=${searchTerm}`;
    return fetch(url)
      .then((response) => response.json()).then((res) => {
        // set id to gizmo_id
        res.results = res?.results?.map((gizmo) => ({ ...gizmo, id: gizmo.gizmo_id }));
        return res;
      });
  });
}
function getRandomGizmo() {
  const url = `${API_URL}/gptx/get-random-gizmo/`;
  return fetch(url)
    .then((response) => response.json()).then((res) => ({ gizmo: { ...res[0], id: res[0].gizmo_id } }));
}
function getPrompts(pageNumber, searchTerm, sortBy = 'recent', language = 'all', category = 'all') {
  // get user id from sync storage
  return chrome.storage.sync.get(['openai_id']).then((result) => {
    const openaiId = result.openai_id;
    let url = `${API_URL}/gptx/?order_by=${sortBy}`;
    if (sortBy === 'mine') url = `${API_URL}/gptx/?order_by=${sortBy}&id=${openaiId}`;
    if (pageNumber) url += `&page=${pageNumber}`;
    if (language !== 'all') url += `&language=${language}`;
    if (category !== 'all') url += `&category=${category}`;
    if (searchTerm && searchTerm.trim().length > 0) url += `&search=${searchTerm}`;
    return fetch(url)
      .then((response) => response.json());
  });
}
function getPrompt(promptId) {
  const url = `${API_URL}/gptx/${promptId}/`;
  return fetch(url)
    .then((response) => response.json());
}

function incrementUseCount(promptId) {
  return chrome.storage.sync.get(['openai_id']).then((result) => {
    const openaiId = result.openai_id;
    // increment use count
    const url = `${API_URL}/gptx/${promptId}/use-count/`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ openai_id: openaiId }),
    }).then((response) => response.json());
  });
}

function vote(promptId, voteType) {
  return chrome.storage.sync.get(['openai_id']).then((result) => {
    const openaiId = result.openai_id;
    // update vote count
    const url = `${API_URL}/gptx/${promptId}/vote/`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ openai_id: openaiId, vote_type: voteType }),
    }).then((response) => response.json());
  });
}

function report(promptId) {
  return chrome.storage.sync.get(['openai_id']).then((result) => {
    const openaiId = result.openai_id;
    // increment report count
    const url = `${API_URL}/gptx/${promptId}/report/`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ openai_id: openaiId }),
    }).then((response) => response.json());
  });
}

function incrementOpenRate(announcementId) {
  const url = `${API_URL}/gptx/increment-open-rate/`;
  return fetch(url, {
    method: 'POST',
    headers: {
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
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ announcement_id: announcementId }),
  }).then((response) => response.json());
}

//-----------------------------------
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    (async () => {
      const data = request.detail;
      if (request.checkHasSubscription) {
        checkHasSubscription(data.forceRefresh).then((res) => {
          sendResponse(res);
        });
      } else if (request.submitPrompt) {
        submitPrompt(data.openAiId, data.prompt, data.promptTitle, data.categories, data.promptLangage, data.modelSlug, data.nickname, data.url, data.hideFullPrompt, data.promptId).then((res) => {
          sendResponse(res);
        });
      } else if (request.deletePrompt) {
        deletePrompt(data.promptId).then((res) => {
          sendResponse(res);
        });
      } else if (request.getNewsletters) {
        getNewsletters().then((res) => {
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
        getSuperpowerGizmos(data.openAiId, data.pageNumber, data.searchTerm, data.sortBy, data.category).then((res) => {
          sendResponse(res);
        });
      } else if (request.submitSuperpowerGizmos) {
        submitSuperpowerGizmos(data.openAiId, data.gizmos).then((res) => {
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
      }
    })();
    return true;
  },
);
