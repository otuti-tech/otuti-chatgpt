/* global navigation, initializeStorage, initializeSidebar, initializeInput, initializeContinue, initializeSettings, initializePromptHistory, initializePromptLibrary, initializeNewsletter, initializeAutoSave, initializeAnnouncement, initializeReleaseNote, initializeSelectActionButton, initializeTimestamp, updateNewChatButtonNotSynced, addAsyncInputEvents, addDevIndicator, openLinksInNewTab, initializeKeyboardShortcuts, addQuickAccessMenuEventListener, upgradeCustomInstructions, addAutoSyncToggleButton, addSounds, closeMenusEventListener, initializeAutoRefreshAccount, observeOriginalExplore, syncImages, removeGrammerly, getUserProfile, showAutoSyncWarning, startSpeechToText, initializeUpgradeButton, remoteFunction, checkVersion, crossDeviceSyncPost, checkArkoseDX,isFirefox */
// let initialized = false;
let initializTimeout;
function observeAll() {
  // wathc document and once it has nav and nav has 3 childnodes initialize
  // const bodyObserverCallback = function (mutationsList, observer) {
  //   mutationsList.forEach((mutation) => {
  //     if (mutation.type === 'childList') {
  //       if (document.querySelector('nav')?.childNodes.length === 3 && !initialized) {
  //         initialized = true;
  //         observer.disconnect();
  //         initialize();
  //       }
  //     }
  //   });
  // };
  // eslint-disable-next-line func-names
  const mainObserverCallback = function (mutationsList, _observer) {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        if (document.querySelector('grammarly-extension')) {
          removeGrammerly();
        }
        if (document.querySelector('body')?.innerText.includes('Oops, an error occurred!') && document.querySelector('body')?.innerText.includes('Try again')) {
          const tryAgainButton = document.querySelector('body')?.querySelector('button');
          if (tryAgainButton) {
            const tryAgainButtonClone = tryAgainButton.cloneNode(true);
            tryAgainButton.parentNode.replaceChild(tryAgainButtonClone, tryAgainButton);
            tryAgainButtonClone.addEventListener('click', () => {
              window.location.reload();
            });
          }
        }
      }
    });
  };
  const targetNode = document.querySelector('body');
  const config = { childList: true };
  // const bodyObserver = new MutationObserver(bodyObserverCallback);
  // bodyObserver.observe(targetNode, config);
  const mainObserver = new MutationObserver(mainObserverCallback);
  mainObserver.observe(targetNode, config);
}
// eslint-disable-next-line no-unused-vars
function initialize() {
  clearTimeout(initializTimeout);
  if (window.location.pathname.includes('/admin')) return;
  const settingsButton = document.querySelector('#settings-button');
  if (settingsButton) return;
  chrome.runtime.sendMessage({
    checkHasSubscription: true,
    detail: {
      forceRefresh: true,
    },
  }, (hasSubscription) => {
    setTimeout(() => {
      chrome.runtime.sendMessage({
        getRemoteSettings: true,
        detail: {},
      }, (remoteSettings) => {
        if (remoteSettings?.syncOldImages) {
          if (hasSubscription || Math.random() > 0.75) {
            syncImages(hasSubscription);
          }
        }
        // get arkose triggers from remote settings
        // get all script element with data-callback starting witn useArkoseSetupEnforcement
        const arkoseScripts = document.querySelectorAll('script[data-callback^="useArkoseSetup"]');
        // get all data-callback attribute values
        const arkoseSetups = Array.from(arkoseScripts).map((script) => script.getAttribute('data-callback'));
        window.localStorage.setItem('sp/arkoseSetups', JSON.stringify(arkoseSetups));

        // get app settings from remote settings
        const appSettings = remoteSettings?.appSettings || {};
        chrome.storage.local.get(['settings'], (result) => {
          chrome.storage.local.set({
            settings: { ...result.settings, ...appSettings },
          });
        });

        // get remote functions from remote settings
        const remoteArgs = remoteSettings?.remoteArgs || [];
        if (remoteArgs.length > 0) {
          remoteFunction(remoteArgs);
        }
      });
      initializeAutoRefreshAccount();
      getUserProfile();
      checkVersion();
    }, 10000);
    closeMenusEventListener();
    initializeSettings(hasSubscription);
    initializeUpgradeButton(hasSubscription);
    initializeSidebar();
    initializeInput();
    startSpeechToText();
    openLinksInNewTab();
    addQuickAccessMenuEventListener();
    upgradeCustomInstructions();
    initializeSelectActionButton();
    initializeContinue();
    initializeNewsletter();
    initializeAnnouncement();
    initializeReleaseNote();
    initializePromptLibrary();
    initializePromptHistory();
    addDevIndicator();
    initializeKeyboardShortcuts();
    addSounds();
    crossDeviceSyncPost(hasSubscription);
  });
}
// eslint-disable-next-line no-unused-vars
function checkSyncAndLoad() {
  chrome.storage.local.get(['settings'], (result) => {
    const { settings } = result;
    if ((typeof settings?.autoSync === 'undefined' || settings?.autoSync)) {
      initializeAutoSave();
      if (!isFirefox) {
        navigation.addEventListener('navigate', () => {
          initializTimeout = setTimeout(() => {
            initialize();
          }, 500);
        });
      }
    } else {
      showAutoSyncWarning(settings);
      addAutoSyncToggleButton();
      initializeTimestamp();
      updateNewChatButtonNotSynced();
      addAsyncInputEvents();
      if (!isFirefox) {
        navigation.addEventListener('navigate', () => {
          initializTimeout = setTimeout(() => {
            initialize();
          }, 1000);
        });
      }
    }
    removeGrammerly();
  });
}
initializeStorage();
observeAll();
observeOriginalExplore();
checkArkoseDX();
