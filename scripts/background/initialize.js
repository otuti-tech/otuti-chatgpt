// eslint-disable-next-line prefer-const
// initialize environment to be production
let API_URL = "https://api.wfh.team";
let STRIPE_PAYMENT_LINK_ID = "8wM5nW6oq7y287ufZ8";
let STRIPE_PORTAL_LINK_ID = "00g0237Sr78wcM03cc";
chrome.storage.local.set({
  API_URL,
  STRIPE_PAYMENT_LINK_ID,
  STRIPE_PORTAL_LINK_ID,
});
const defaultGPTXHeaders = {};

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url) {
    chrome.tabs.update(tab.id, { url: "https://chat.openai.com" });
  } else {
    chrome.tabs.create({ url: "https://chat.openai.com", active: true });
  }
});
//-----------------------------------
async function createHash(token) {
  const msgBuffer = new TextEncoder().encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
//-----------------------------------
function registerUser(session) {
  chrome.storage.sync.get(["name", "nickname", "url"], (syncResult) => {
    chrome.storage.local.get(
      ["account", "totalConversations", "chatgptAccountId"],
      (r) => {
        const isPaid =
          r?.account?.accounts?.[r.chatgptAccountId || "default"]?.entitlement
            ?.has_active_subscription || false;

        const { user, accessToken } = session;
        const { version } = chrome.runtime.getManifest();
        chrome.management.getSelf((extensionInfo) => {
          if (extensionInfo.installType !== "development") {
            chrome.runtime.setUninstallURL(
              `${API_URL}/gptx/uninstall?p=${user.id.split("-")[1]}`
            );
          }
        });
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
          defaultGPTXHeaders["Hat-Token"] = hashAcessToken;
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
            use_websocket:
              r.account?.accounts?.[
                r.chatgptAccountId || "default"
              ]?.features?.includes("shared_websocket") || false,
            account: r.account || null,
          };
          if (syncResult.url) body.url = syncResult.url;
          if (syncResult.nickname) body.nickname = syncResult.nickname;
        });
      }
    );
  });
}
chrome.runtime.onMessage.addListener(
  // eslint-disable-next-line no-unused-vars
  (request, sender, sendResponse) => {
    if (request.authReceived) {
      const session = request.detail;
      chrome.storage.sync.get(
        [
          "user_id",
          "openai_id",
          "version",
          "avatar",
          "lastUserSync",
          "accessToken",
          "hashAcessToken",
        ],
        (result) => {
          defaultGPTXHeaders["Hat-Token"] = result.hashAcessToken;
          // or conditionor
          const { version } = chrome.runtime.getManifest();
          const shouldRegister =
            !result.lastUserSync ||
            result.lastUserSync < Date.now() - 1000 * 60 * 60 ||
            !result.avatar ||
            !result.user_id ||
            !result.openai_id ||
            !result.accessToken ||
            !result.hashAcessToken ||
            result.accessToken !== `Bearer ${session.accessToken}` ||
            result.version !== version;

          if (result.openai_id !== session.user.id) {
            // remove any key from localstorage except the following keys: API_URL, settings, customInstructionProfiles, customPrompts, readNewsletterIds, promptChains, userInputValueHistory
            chrome.storage.local.get(
              [
                "settings",
                "customInstructionProfiles",
                "customPrompts",
                "readNewsletterIds",
                "promptChains",
                "userInputValueHistory",
              ],
              (res) => {
                const {
                  settings,
                  customInstructionProfiles,
                  customPrompts,
                  readNewsletterIds,
                  promptChains,
                  userInputValueHistory,
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
              }
            );
          } else if (shouldRegister) {
            registerUser(session);
          }
        }
      );
    }
  }
);
//-----------------------------------
function checkHasSubscription(forceRefresh = false) {
  return chrome.storage.local
    .get(["hasSubscription", "lastSubscriptionCheck", "settings"])
    .then((localRes) => {
      // if last check not has subscription check once a minute
      if (
        !forceRefresh &&
        typeof localRes.hasSubscription !== "undefined" &&
        !localRes.hasSubscription &&
        localRes.lastSubscriptionCheck &&
        localRes.lastSubscriptionCheck > Date.now() - 1000 * 60
      ) {
        return Promise.resolve(false);
      }

      const newSettings = localRes.settings;
      chrome.storage.local.set({
        hasSubscription: true,
        lastSubscriptionCheck: Date.now(),
        settings: newSettings,
      });

      return true;
    });
}
function addPromptToLibrary(
  prompt,
  promptTitle,
  categories,
  promptLangage,
  modelSlug,
  nickname,
  url,
  hideFullPrompt = false,
  promptId = null
) {
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
    body.categories = categories
      .map((category) => category.trim().toLowerCase().replaceAll(/\s/g, "_"))
      .join(",");
  }
  if (promptLangage && promptLangage !== "select") {
    body.language = promptLangage;
  }
  return true;
}

function deletePrompt(promptId) {
  return true;
}
function getNewsletters(page) {
  return true;
}
function getNewsletter(id) {
  return true;
}
function getLatestNewsletter() {
  return true;
}
function getLatestAnnouncement() {
  return true;
}
function getReleaseNote(version) {
  return true;
}
function getLatestVersion() {
  return true;
}
function reloadExtension() {
  return chrome.runtime.reload().then(() => true);
}
function submitSuperpowerGizmos(gizmos, category = "") {
  const body = {
    gizmos,
    category,
  };
  return true;
}
function updateGizmoMetrics(gizmoId, metricName, direction) {
  const body = {
    gizmo_id: gizmoId,
    metric_name: metricName,
    direction,
  };
  return true;
}
function deleteSuperpowerGizmo(gizmoId) {
  const body = {
    gizmo_id: gizmoId,
  };
  return true;
}
function getSuperpowerGizmos(
  pageNumber,
  searchTerm,
  sortBy = "recent",
  category = "all"
) {
  // get user id from sync storage
  let url = `${API_URL}/gptx/get-gizmos/?order_by=${sortBy}`;
  if (pageNumber) url += `&page=${pageNumber}`;
  if (category !== "all") url += `&category=${category}`;
  if (searchTerm && searchTerm.trim().length > 0)
    url += `&search=${searchTerm.trim()}`;
  return true;
}
function getRandomGizmo() {
  const url = `${API_URL}/gptx/get-random-gizmo/`;
  return true;
}
function addGalleryImages(images) {
  return true;
}
function getGalleryImages(
  showAll = false,
  pageNumber = 1,
  searchTerm = "",
  byUserId = "",
  sortBy = "-created_at",
  category = "dalle",
  isPublic = false
) {
  let url = `${API_URL}/gptx/get-gallery-images/?order_by=${sortBy}&category=${category}`;
  if (showAll) url += "&show_all=true";
  if (searchTerm && searchTerm.trim().length > 0)
    url += `&search=${searchTerm}`;
  if (pageNumber) url += `&page=${pageNumber}`;
  if (byUserId) url += `&by_user_id=${byUserId}`;
  if (isPublic) url += `&is_public=${isPublic}`;
  return true;
}
function getAllGalleryImages(category = "dalle", conversationId = null) {
  return true;
}
function deleteGalleryImages(imageIds = [], category = "dalle") {
  return true;
}
function shareGalleryImages(imageIds = [], category = "dalle") {
  return true;
}
function getPrompts(
  pageNumber,
  searchTerm,
  sortBy = "recent",
  language = "all",
  category = "all"
) {
  // get user id from sync storage
  let url = `${API_URL}/gptx/?order_by=${sortBy}`;
  if (sortBy === "mine") url = `${API_URL}/gptx/?order_by=${sortBy}`;
  if (pageNumber) url += `&page=${pageNumber}`;
  if (language !== "all") url += `&language=${language}`;
  if (category !== "all") url += `&category=${category}`;
  if (searchTerm && searchTerm.trim().length > 0)
    url += `&search=${searchTerm}`;
  return true;
}
function getPrompt(promptId) {
  return true;
}

function incrementUseCount(promptId) {
  // increment use count
  return true;
}

function vote(promptId, voteType) {
  // update vote count
  return true;
}

function report(promptId) {
  // increment report count
  return true;
}

function incrementOpenRate(announcementId) {
  return true;
}

function incrementClickRate(announcementId) {
  return true;
}

function getCrossDeviceSync() {
  return true;
}
function updateCrossDeviceSync(data) {
  return true;
}

function getRemoteSettings() {
  // convert
  // created_at: "2024-02-25T20:36:19.473406-08:00"id: 1, key: "syncOldImages", value: false
  // to
  // {
  //   "syncOldImages": false
  // }
  return true;
}
//-----------------------------------
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    chrome.storage.sync.get(["hashAcessToken"], (result) => {
      defaultGPTXHeaders["Hat-Token"] = result.hashAcessToken;
      const data = request.detail;
      if (request.checkHasSubscription) {
        checkHasSubscription(data.forceRefresh).then((res) => {
          sendResponse(res);
        });
      } else if (request.addPromptToLibrary) {
        addPromptToLibrary(
          data.prompt,
          data.promptTitle,
          data.categories,
          data.promptLangage,
          data.modelSlug,
          data.nickname,
          data.url,
          data.hideFullPrompt,
          data.promptId
        ).then((res) => {
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
        getPrompts(
          data.pageNumber,
          data.searchTerm,
          data.sortBy,
          data.language,
          data.category
        ).then((res) => {
          sendResponse(res);
        });
      } else if (request.getRandomGizmo) {
        getRandomGizmo().then((res) => {
          sendResponse(res);
        });
      } else if (request.getSuperpowerGizmos) {
        getSuperpowerGizmos(
          data.pageNumber,
          data.searchTerm,
          data.sortBy,
          data.category
        ).then((res) => {
          sendResponse(res);
        });
      } else if (request.submitSuperpowerGizmos) {
        submitSuperpowerGizmos(data.gizmos, data.category).then((res) => {
          sendResponse(res);
        });
      } else if (request.updateGizmoMetrics) {
        updateGizmoMetrics(data.gizmoId, data.metricName, data.direction).then(
          (res) => {
            sendResponse(res);
          }
        );
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
        getGalleryImages(
          data.showAll,
          data.pageNumber,
          data.searchTerm,
          data.byUserId,
          data.sortBy,
          data.category,
          data.isPublic
        ).then((res) => {
          sendResponse(res);
        });
      } else if (request.getAllGalleryImages) {
        getAllGalleryImages(data.category, data.conversationId).then((res) => {
          sendResponse(res);
        });
      } else if (request.deleteGalleryImages) {
        deleteGalleryImages(data.imageIds, data.category).then((res) => {
          sendResponse(res);
        });
      } else if (request.shareGalleryImages) {
        shareGalleryImages(data.imageIds, data.category).then((res) => {
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
});
