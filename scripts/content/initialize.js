/* global navigation, initializeStorage, initializeSidebar, initializeInput, initializeContinue, initializeSettings, initializePromptHistory, initializePromptLibrary, initializeNewsletter, initializeAutoSave, initializeAnnouncement, initializeReleaseNote, initializeSelectActionButton, initializeTimestamp, updateNewChatButtonNotSynced, addAsyncInputEvents, addDevIndicator, openLinksInNewTab, initializeKeyboardShortcuts, addQuickAccessMenuEventListener, upgradeCustomInstructions, addAutoSyncToggleButton, addSounds, closeMenusEventListener, initializeAutoRefreshAccount, observeOriginalExplore, removeGrammerly, showAutoSyncWarning, startSpeechToText, initializeUpgradeButton */
// let initialized = false;
let initializTimeout;
function observeNav() {
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
    closeMenusEventListener();
    initializeSettings(hasSubscription);
    initializeUpgradeButton(hasSubscription);
    initializeAutoRefreshAccount();
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
  });
}
// eslint-disable-next-line no-unused-vars
function checkSyncAndLoad() {
  chrome.storage.local.get(['settings'], (result) => {
    const { settings } = result;
    if ((typeof settings?.autoSync === 'undefined' || settings?.autoSync)) {
      initializeAutoSave();
      navigation.addEventListener('navigate', () => {
        initializTimeout = setTimeout(() => {
          initialize();
        }, 500);
      });
    } else {
      showAutoSyncWarning(settings);
      addAutoSyncToggleButton();
      initializeTimestamp();
      updateNewChatButtonNotSynced();
      addAsyncInputEvents();
      navigation.addEventListener('navigate', () => {
        initializTimeout = setTimeout(() => {
          initialize();
        }, 1000);
      });
    }
    removeGrammerly();
  });
}

initializeStorage();
observeNav();
observeOriginalExplore();
