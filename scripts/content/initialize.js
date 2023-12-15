/* global navigation, initializeStorage, initializeSidebar, initializeInput, initializeContinue, initializeExport, initializeSettings, initializePromptHistory, initializePromptLibrary, initializeNewsletter, initializeAutoSave, initializeAnnouncement, initializeReleaseNote, initializeReplaceDeleteConversationButton, initializeTimestamp, updateNewChatButtonNotSynced, addAsyncInputEvents, addDevIndicator, openLinksInNewTab, initializeKeyboardShortcuts, addQuickAccessMenuEventListener, upgradeCustomInstructions, addAutoSyncToggleButton, addSounds, initializeAutoRefreshAccount, observeOriginalExplore, removeGrammerly */
// let initialized = false;
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
  const mainObserverCallback = function (mutationsList, observer) {
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
  observeOriginalExplore();
  initializeStorage().then(() => {
    setTimeout(() => {
      initializeSettings();
      initializeAutoRefreshAccount();
      initializeSidebar();
      initializeInput();
      openLinksInNewTab();
      addQuickAccessMenuEventListener();
      upgradeCustomInstructions();
      initializeExport();
      initializeContinue();
      initializeNewsletter();
      initializeAnnouncement();
      initializeReleaseNote();
      initializePromptLibrary();
      initializePromptHistory();
      addDevIndicator();
      initializeKeyboardShortcuts();
      addSounds();
      setTimeout(() => {
        chrome.storage.local.get(['settings'], (result) => {
          const { settings } = result;
          if (typeof settings?.autoSync === 'undefined' || settings?.autoSync) {
            initializeAutoSave();
          } else {
            addAutoSyncToggleButton();
            initializeTimestamp();
            updateNewChatButtonNotSynced();
            addAsyncInputEvents();
            navigation.addEventListener('navigate', () => {
              setTimeout(() => {
                addAsyncInputEvents();
              }, 500);
            });
          }
          removeGrammerly();
          initializeReplaceDeleteConversationButton();
        });
      });
    }, 100);
  });
}
observeNav();
