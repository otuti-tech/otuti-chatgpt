/* global getAccount, getModels, getConversationLimit, initializeStorage, cleanNav, initializeContinue, initializeExport, initializeSettings, initializePromptHistory, initializePromptLibrary, initializeAutoSave, addNavToggleButton, initializeReleaseNote, initializeReplaceDeleteConversationButton, initializeCopyAndCounter, initializeAddToPromptLibrary, initializeTimestamp, updateNewChatButtonNotSynced, addAsyncInputEvents, initializeContentMessageListeners, addDevIndicator, addExpandButton, openLinksInNewTab, addEnforcementTriggerElement, initializeKeyboardShortcuts, addQuickAccessMenuEventListener, upgradeCustomInstructions, watchError, showAutoSyncToast */

// eslint-disable-next-line no-unused-vars
function initialize() {
  const historyButton = document.querySelector('a[id="my-prompt-history-button"]');
  if (
    window.location.pathname.startsWith('/share/') &&
    !window.location.pathname.endsWith('/continue')
  )
    return;

  if (!historyButton) {
    setTimeout(() => {
      initializeStorage().then(() => {
        // watchError();
        getAccount();
        getModels();
        getConversationLimit();
        openLinksInNewTab();
        addNavToggleButton();
        initializeContentMessageListeners();
        addQuickAccessMenuEventListener();
        cleanNav();
        upgradeCustomInstructions();
        initializeExport();
        initializeContinue();
        initializeSettings();
        initializeReleaseNote();
        initializePromptLibrary();
        initializePromptHistory();
        addExpandButton();
        addDevIndicator();
        initializeKeyboardShortcuts();
        addEnforcementTriggerElement();
        // showAutoSyncToast();
        setTimeout(() => {
          chrome.storage.local.get(['settings'], (result) => {
            const { settings } = result;
            if (
              (typeof settings?.autoSync === 'undefined' || settings?.autoSync) &&
              !window.location.pathname.startsWith('/share/')
            ) {
              // if (typeof settings?.autoSync === 'undefined' || settings?.autoSync) {
              initializeAutoSave();
            } else {
              initializeCopyAndCounter();
              initializeAddToPromptLibrary();
              initializeTimestamp();
              updateNewChatButtonNotSynced();
              addAsyncInputEvents();
            }
            initializeReplaceDeleteConversationButton();
          });
        });
      }, 100);
    }, 100);
  }
}
initialize();
