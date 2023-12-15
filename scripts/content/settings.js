// eslint-disable-next-line no-unused-vars
/* global createModal, Sortable, getGizmoById, generateRandomDarkColor, createReleaseNoteModal, languageList, writingStyleList, toneList, toast, loadConversationList, modelSwitcher, openUpgradeModal, addModelSwitcherEventListener, dropdown, addDropdownEventListener, API_URL:true, showActionConfirm, initializeUpgradeButton */
const defaultPrompts = [
  { title: 'Continue', text: 'Please continue', isDefault: true },
  { title: 'Rewrite', text: 'Please rewrite your last response', isDefault: false },
  { title: 'Paraphrase', text: 'Please paraphrase your last response', isDefault: false },
  { title: 'Explain', text: 'Please explain your last response', isDefault: false },
  { title: 'Clarify', text: 'Please clarify your last response', isDefault: false },
  { title: 'Expand', text: 'Please expand your last response', isDefault: false },
  { title: 'Summarize', text: 'Please summarize your last response', isDefault: false },
];
const autoDeleteModes = [{ code: 'days', name: 'Delete chats after' }, { code: 'number', name: 'Only keep the last' }];

function createSettingsModal(initialTab = 0) {
  const bodyContent = settingsModalContent(initialTab);
  const actionsBarContent = settingsModalActions();
  createModal('Settings', 'Your can change the Superpower settings here', bodyContent, actionsBarContent);
}
const inactiveTabElementStyles = 'border-right: 1px solid lightslategray; border-bottom:2px solid white; border-top-right-radius: 16px; font-size: 0.8em;  padding:8px 12px;color: lightslategray;margin:-1px;height:100%;min-width:100px;';
const activeTabElementStyles = 'background-color: #0b0d0e;border:solid 2px white; border-bottom:0; border-top-right-radius: 16px;font-size: 0.8em; padding:8px 12px;color: white;height:100%;min-width:100px;';
function selectedTabContent(selectedTab, hasSubscription) {
  switch (selectedTab) {
    case 0:
      return generalTabContent(hasSubscription);
    case 1:
      return autoSyncTabContent(hasSubscription);
    case 2:
      return historyTabContent(hasSubscription);
    case 3:
      return conversationTabContent(hasSubscription);
    case 4:
      return promptInputTabContent(hasSubscription);
    case 5:
      return modelsTabContent(hasSubscription);
    case 6:
      return customPromptTabContent(hasSubscription);
    case 7:
      return exportTabContent(hasSubscription);
    case 8:
      return splitterTabContent(hasSubscription);
    case 9:
      return newsletterTabContent(hasSubscription);
    default:
      return generalTabContent(hasSubscription);
  }
}
function settingsModalContent(initialTab = 0) {
  const settingsTabs = ['General', 'Auto Sync', 'History', 'Conversation', 'Prompt Input', 'Models', 'Custom Prompts', 'Export', 'Splitter', 'Newsletter'];
  let activeTab = initialTab;
  // create history modal content
  const content = document.createElement('div');
  content.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start;width:100%; height: 100%;';
  const tabs = document.createElement('div');
  tabs.style = 'display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; background-color: #1e1e2f;z-index:1000;overflow:hidden; overflow-x:scroll;-ms-overflow-style: none; scrollbar-width: none;';
  // hide scrollbar for chrome
  tabs.classList.add('scrollbar-hide');
  chrome.runtime.sendMessage({
    checkHasSubscription: true,
    detail: {
      forceRefresh: false,
    },
  }, (hasSubscription) => {
    settingsTabs.forEach((tab, index) => {
      const tabButton = document.createElement('button');
      if (activeTab === settingsTabs.indexOf(tab)) {
        tabButton.classList = 'active-tab';
      } else {
        tabButton.removeAttribute('class');
      }
      tabButton.style = activeTab === settingsTabs.indexOf(tab) ? activeTabElementStyles : inactiveTabElementStyles;

      tabButton.textContent = tab;
      tabButton.addEventListener('click', () => {
        activeTab = index;
        const activeTabElemet = document.querySelector('.active-tab');
        activeTabElemet.style = inactiveTabElementStyles;
        activeTabElemet.removeAttribute('class');
        tabButton.classList = 'active-tab';
        tabButton.style = activeTabElementStyles;
        const settingsModalTabContent = document.querySelector('#settings-modal-tab-content');
        const newContent = selectedTabContent(activeTab, hasSubscription);
        settingsModalTabContent.parentNode.replaceChild(newContent, settingsModalTabContent);
      });
      tabs.appendChild(tabButton);
    });
    const tabsLastChild = document.createElement('div');
    tabsLastChild.style = 'width:100%; height:100%; border-bottom: solid 2px white;';
    tabs.appendChild(tabsLastChild);
    content.appendChild(selectedTabContent(activeTab, hasSubscription));
  });

  content.appendChild(tabs);
  return content;
}
function generalTabContent(hasSubscription = false) {
  const content = document.createElement('div');
  content.id = 'settings-modal-tab-content';
  content.style = 'display: flex; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; height: 100%;padding-bottom:80px;';
  const leftContent = document.createElement('div');
  leftContent.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start; width: 50%;padding-right: 8px;';
  const rightContent = document.createElement('div');
  rightContent.style = 'display: flex; flex-direction: column; justify-content: start; align-items: end; width: 50%;padding-left: 8px;';

  // dark mode
  const darkModeSwitchWrapper = document.createElement('div');
  darkModeSwitchWrapper.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start; width: 100%; margin: 8px 0;';
  const darkModeSwitch = document.createElement('div');
  darkModeSwitch.style = 'display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0;color:white;';
  darkModeSwitch.textContent = 'Dark mode';
  const darkModeLabel = document.createElement('label');
  darkModeLabel.classList = 'switch';
  const darkModeInput = document.createElement('input');
  darkModeInput.type = 'checkbox';
  darkModeInput.checked = !!document.querySelector('html').classList.contains('dark');
  darkModeInput.addEventListener('change', () => {
    if (document.querySelector('html').classList.contains('dark')) {
      document.querySelector('html').classList.replace('dark', 'light');
      document.querySelector('html').style = 'color-scheme: light;';
      window.localStorage.setItem('theme', 'light');
    } else {
      document.querySelector('html').classList.replace('light', 'dark');
      document.querySelector('html').style = 'color-scheme: dark;';
      window.localStorage.setItem('theme', 'dark');
    }
  });
  const darkModeSlider = document.createElement('span');
  darkModeSlider.classList = 'slider round';

  darkModeLabel.appendChild(darkModeInput);
  darkModeLabel.appendChild(darkModeSlider);
  darkModeSwitch.appendChild(darkModeLabel);
  darkModeSwitchWrapper.appendChild(darkModeSwitch);
  leftContent.appendChild(darkModeSwitchWrapper);

  // daily newsletter
  const hideReleaseNoteSwitch = createSwitch('Hide Release Note', 'Don’t show release note when extension is updated', 'hideReleaseNote', false);
  leftContent.appendChild(hideReleaseNoteSwitch);

  const importExportWrapper = document.createElement('div');
  importExportWrapper.style = 'display: flex; flex-direction: row; flex-wrap: wrap; justify-content: start; align-items: center; width: 100%; margin: 8px 0; color:white;';
  const importExportLabel = document.createElement('div');
  importExportLabel.style = 'width: 100%; margin: 8px 0;';
  importExportLabel.innerHTML = 'Import / Export Settings, Custom Prompts, and Folders (<a style="text-decoration:underline; color:gold;" href="https://www.notion.so/ezi/Superpower-ChatGPT-FAQ-9d43a8a1c31745c893a4080029d2eb24?pvs=4#efc8c6a6004142b189412e8e6785956d" target="blank">Learn More</a>)';
  importExportWrapper.appendChild(importExportLabel);

  const importExportButtonWrapper = document.createElement('div');
  importExportButtonWrapper.style = 'display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0;';

  const importButton = document.createElement('button');
  importButton.classList = 'w-full px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800';
  importButton.textContent = 'Import';
  importButton.addEventListener('click', () => {
    // open file picker
    const filePicker = document.createElement('input');
    filePicker.type = 'file';
    filePicker.accept = '.json';
    filePicker.addEventListener('change', (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (document.querySelector('[id*=close-button]')) {
          document.querySelector('[id*=close-button]').click();
        }
        const importedData = JSON.parse(e.target.result);
        const {
          settings, customModels, customPrompts, conversationsOrder, customInstructionProfiles, promptChains,
        } = importedData;
        chrome.storage.local.set({
          settings, customModels, customPrompts, customInstructionProfiles, promptChains, conversationsOrder,
        }, () => {
          window.location.reload();
          toast('Imported Settings Successfully');
        });
      };
      reader.readAsText(file);
    });
    filePicker.click();
  });
  importExportButtonWrapper.appendChild(importButton);

  const exportButton = document.createElement('button');
  exportButton.classList = 'w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800';
  exportButton.textContent = 'Export';
  exportButton.addEventListener('click', () => {
    chrome.storage.sync.get(['version'], ({ version }) => {
      chrome.storage.local.get(['conversationsOrder', 'settings', 'customModels', 'customPrompts', 'customInstructionProfiles', 'promptChains'], (result) => {
        const {
          settings, customModels, customPrompts, customInstructionProfiles, promptChains, conversationsOrder,
        } = result;
        const data = {
          version, settings, customModels, customPrompts, conversationsOrder, customInstructionProfiles, promptChains,
        };
        const element = document.createElement('a');
        element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`);
        const todatDate = new Date();
        const filePostfix = `${todatDate.getFullYear()}-${todatDate.getMonth() + 1}-${todatDate.getDate()}`;

        element.setAttribute('download', `superpower-chatgpt-settings-${filePostfix}.json`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast('Settings exported');
      });
    });
  });
  importExportButtonWrapper.appendChild(exportButton);
  importExportWrapper.appendChild(importExportButtonWrapper);

  leftContent.appendChild(importExportWrapper);

  // discord widget
  const discordWidget = document.createElement('div');
  discordWidget.innerHTML = '<iframe style="border-radius:8px;width:350px; max-width:100%;height:400px;" src="https://discord.com/widget?id=1083455984489476220&theme=dark" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>';
  rightContent.appendChild(discordWidget);
  content.appendChild(leftContent);
  content.appendChild(rightContent);
  // extra links
  const linkWrapper = document.createElement('div');
  linkWrapper.style = 'display: flex; flex-direction: row; flex-wrap:wrap; justify-content: start; align-items: start; width: 100%; padding: 8px 16px; position:absolute; bottom:0; left:0;background-color:#0b0d0e;border-top:1px solid #565869;';

  // add a link to Updates and FAQ
  const updatesLink = document.createElement('a');
  updatesLink.href = 'https://help.openai.com/en/collections/3742473-chatgpt';
  updatesLink.target = '_blank';
  updatesLink.textContent = 'Get help ➜';
  updatesLink.style = 'color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;padding-right:';
  updatesLink.addEventListener('mouseover', () => {
    updatesLink.style = 'color: gold; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;';
  });
  updatesLink.addEventListener('mouseout', () => {
    updatesLink.style = 'color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;';
  });
  linkWrapper.appendChild(updatesLink);

  // add link for sponsorship
  const sponsorLink = document.createElement('a');
  sponsorLink.href = 'https://www.passionfroot.me/superpower';
  sponsorLink.target = '_blank';
  sponsorLink.textContent = 'Advertise with us ➜';
  sponsorLink.style = 'color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;';
  sponsorLink.addEventListener('mouseover', () => {
    sponsorLink.style = 'color: gold; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;';
  });
  sponsorLink.addEventListener('mouseout', () => {
    sponsorLink.style = 'color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;';
  });
  linkWrapper.appendChild(sponsorLink);

  // add link for FAQ
  const faqLink = document.createElement('a');
  faqLink.href = 'https://ezi.notion.site/Superpower-ChatGPT-FAQ-9d43a8a1c31745c893a4080029d2eb24';
  faqLink.target = '_blank';
  faqLink.textContent = 'FAQ ➜';
  faqLink.style = 'color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;';
  faqLink.addEventListener('mouseover', () => {
    faqLink.style = 'color: gold; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;';
  });
  faqLink.addEventListener('mouseout', () => {
    faqLink.style = 'color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;';
  });
  linkWrapper.appendChild(faqLink);

  // add link for YouTube
  const youtubeLink = document.createElement('a');
  youtubeLink.href = 'https://www.youtube.com/@superpowerdaily';
  youtubeLink.target = '_blank';
  youtubeLink.textContent = 'YouTube ➜';
  youtubeLink.style = 'color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;';
  youtubeLink.addEventListener('mouseover', () => {
    youtubeLink.style = 'color: gold; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;';
  });
  youtubeLink.addEventListener('mouseout', () => {
    youtubeLink.style = 'color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;';
  });
  linkWrapper.appendChild(youtubeLink);
  content.appendChild(linkWrapper);

  return content;
}
function toggleCustomWidthInput(customConversationWidth) {
  chrome.storage.local.get(['settings'], (result) => {
    const customWidthInput = document.getElementById('conversation-width-input');
    customWidthInput.disabled = !customConversationWidth;
    const { settings } = result;
    if (customConversationWidth) {
      Array.from(document.querySelectorAll('[id^=message-wrapper]')).forEach((el) => {
        el.querySelector('div').style.maxWidth = `${settings.conversationWidth}%`;
      });
      if (document.querySelector('#conversation-bottom')) {
        document.querySelector('#conversation-bottom').firstChild.style.maxWidth = `${settings.conversationWidth}%`;
      }
      document.querySelector('main').querySelector('form').style.maxWidth = `${settings.conversationWidth}%`;
    } else {
      Array.from(document.querySelectorAll('[id^=message-wrapper]')).forEach((el) => {
        el.querySelector('div').style.removeProperty('max-width');
      });
      if (document.querySelector('#conversation-bottom')) {
        document.querySelector('#conversation-bottom').firstChild.style.removeProperty('max-width');
      }
      document.querySelector('main').querySelector('form').style.removeProperty('max-width');
    }
  });
}
function autoSyncTabContent(hasSubscription = false) {
  const content = document.createElement('div');
  content.id = 'settings-modal-tab-content';
  content.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;';
  // Auto Sync
  const autoSyncSwitch = createSwitch('Auto Sync', 'Automatically download and sync all your conversations to your computer. Auto Sync only works when ChatGPT is open. Disabling Auto Sync will also disable some of the existing features such as the ability to search for messages and many future features that rely on Auto Sync.(Requires Refresh)', 'autoSync', true, refreshPage, ['Requires Refresh']);
  content.appendChild(autoSyncSwitch);
  chrome.storage.local.get(['settings'], (result) => {
    const { autoSync } = result.settings;

    const autoRefreshAfterSyncSwitch = createSwitch('Auto Refresh After Sync', 'Automatically refresh the page after syncing conversations is completed', 'autoRefreshAfterSync', true, null, ['Requires Auto-Sync'], !autoSync);
    content.appendChild(autoRefreshAfterSyncSwitch);

    // add a title that says warning zone
    const warningZoneTitle = document.createElement('div');
    warningZoneTitle.style = 'width:100%;font-size:0.8em;color:lightslategray;margin-top:24px;';
    warningZoneTitle.innerText = 'Warning Zone';
    content.appendChild(warningZoneTitle);
    // add a divider
    const divider = document.createElement('div');
    divider.style = 'width:100%;height:1px;background-color:lightslategray;margin:0 0 24px 0;';
    content.appendChild(divider);

    // Reset Auto Sync
    const resetAutoSyncButton = document.createElement('button');
    resetAutoSyncButton.textContent = 'Reset Auto Sync';
    resetAutoSyncButton.disabled = !autoSync;
    resetAutoSyncButton.style.pointerEvents = !autoSync ? 'none' : 'auto';
    resetAutoSyncButton.classList = 'btn btn-warning flex justify-center gap-2 border-0 md:border';
    resetAutoSyncButton.addEventListener('click', () => {
      showActionConfirm('Reset Auto Sync', 'Clicking on Restart will refresh the page and attempt to re-sync all your conversations', 'Restart', null, resetAutoSync, 'orange');
    });
    content.appendChild(resetAutoSyncButton);
    const resetAutoSyncDesc = document.createElement('div');
    resetAutoSyncDesc.style = 'width:100%;font-size:0.8em;color:lightslategray;margin-top:8px;';
    resetAutoSyncDesc.innerText = 'This will re-sync all the conversations from ChatGPT database. This is useful if you are having issues with Auto Sync.';
    content.appendChild(resetAutoSyncDesc);
  });

  return content;
}
function resetAutoSync() {
  chrome.storage.local.set({
    conversations: {},
    conversationsAreSynced: false,
  }, () => {
    refreshPage();
  });
}
function reloadConversationList() {
  chrome.storage.local.get(['settings'], (result) => {
    const { autoSync } = result.settings;
    if (autoSync) {
      loadConversationList(true);
    } else {
      refreshPage();
    }
  });
}

function sortConversationsByTimestamp(conversationsOrder, conversations) {
  const folders = conversationsOrder.filter((c) => typeof c !== 'string' && c?.id !== 'trash');
  // close all folders
  folders?.forEach((f) => {
    if (f) f.isOpen = false;
  });
  folders.forEach((folder) => {
    if (folder.conversationIds.length > 0) {
      const folderConversations = Object.values(conversations).filter((c) => folder?.conversationIds?.includes(c?.id));
      const sortedFolderConversations = folderConversations.sort((a, b) => b.update_time - a.update_time);
      folder.conversationIds = sortedFolderConversations.map((c) => c.id);
    }
  });
  const conversationIds = conversationsOrder.filter((c) => typeof c === 'string');
  const trash = conversationsOrder.find((c) => c?.id === 'trash');
  // close trash
  trash.isOpen = false;

  // sort conversationIds by last updated time
  conversationIds.sort((a, b) => {
    const aLastUpdated = conversations[a]?.update_time || 0;
    const bLastUpdated = conversations[b]?.update_time || 0;
    return bLastUpdated - aLastUpdated;
  });

  const newConversationsOrder = [...folders, ...conversationIds, trash];
  return newConversationsOrder;
}
// eslint-disable-next-line no-unused-vars
function toggleKeepFoldersAtTheTop(isChecked) {
  chrome.storage.local.get(['conversationsOrder', 'conversations'], (result) => {
    const { conversationsOrder, conversations } = result;
    const newConversationsOrder = sortConversationsByTimestamp(conversationsOrder, conversations);
    chrome.storage.local.set({ conversationsOrder: newConversationsOrder }, () => reloadConversationList());
  });
}
function toggleShowFolderCounts(isChecked) {
  const allFolderTitleElements = document.querySelectorAll('[id^=title-folder-]');
  allFolderTitleElements.forEach((el) => {
    el.style.bottom = isChecked ? '5px' : '0px';
  });
  const allFolderCountElements = document.querySelectorAll('[id^=count-folder-]');
  allFolderCountElements.forEach((el) => {
    el.style.display = isChecked ? 'block' : 'none';
  });
}
function toggleGpt4Counter(show) {
  const gpt4CounterElement = document.querySelector('#gpt4-counter');
  if (gpt4CounterElement) gpt4CounterElement.style.display = show ? 'block' : 'none';
}
function toggleTopNav(autohide) {
  const navWrapperElement = document.querySelector('#gptx-nav-wrapper');
  if (autohide) {
    navWrapperElement.style.top = '-56px';
    navWrapperElement.style.position = 'absolute';
    navWrapperElement.style.height = '112px';
  } else {
    navWrapperElement.style.top = '0px';
    navWrapperElement.style.position = 'relative';
    navWrapperElement.style.height = '56px';
  }
}
function historyTabContent(hasSubscription = false) {
  const content = document.createElement('div');
  content.id = 'settings-modal-tab-content';
  content.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;';
  chrome.storage.local.get(['settings'], (result) => {
    const {
      autoSync, autoDeleteOldChats, autoDeleteMode, autoDeleteThreshold,
    } = result.settings;

    const showFolderCountsSwitch = createSwitch('Show Folder Counts', 'Show the number of conversations in each folder', 'showFolderCounts', true, toggleShowFolderCounts, ['Requires Auto-Sync'], !autoSync);
    content.appendChild(showFolderCountsSwitch);

    const customGPTAutoFolderSwitch = createSwitch('Custom GPT Auto Folder', 'Automatically save Custom GPT Chats into separate folders', 'customGPTAutoFolder', false, toggleCustomGPTAutoFolder, ['Requires Auto-Sync', '⚡️ Requires Pro Account'], !hasSubscription || !autoSync);
    content.appendChild(customGPTAutoFolderSwitch);

    const autoColorFoldersSwitch = createSwitch('Auto Color Folders', 'Automatically select a random color when creating folders', 'autoColorFolders', false, null, ['Requires Auto-Sync'], !autoSync);
    content.appendChild(autoColorFoldersSwitch);

    // auto delete
    const autoDeleteOldChatsSwitch = createSwitch('Auto Delete Old Chats', 'Automatically delete old chats (<a style="text-decoration:underline; color:gold;" href="https://ezi.notion.site/Superpower-ChatGPT-FAQ-9d43a8a1c31745c893a4080029d2eb24" target="blank">Learn More</a>)', 'autoDeleteOldChats', false, toggleAutoDeleteOldChats, ['Requires Auto-Sync', '⚡️ Requires Pro Account'], !hasSubscription || !autoSync);
    content.appendChild(autoDeleteOldChatsSwitch);

    const autoDeleteModesWrapper = document.createElement('div');
    autoDeleteModesWrapper.id = 'autoDeleteModesWrapper';
    autoDeleteModesWrapper.style = 'position:relative;min-width:240px;max-width:200px;z-index:1000;display:flex;';
    autoDeleteModesWrapper.innerHTML = dropdown('Auto-Delete-Mode', autoDeleteModes, autoDeleteMode, 'left', true);
    if (!hasSubscription || !autoSync || !autoDeleteOldChats) {
      autoDeleteModesWrapper.style.opacity = 0.5;
      autoDeleteModesWrapper.style.pointerEvents = 'none';
    }
    // input for number of days
    const autoDeleteThresholdInput = document.createElement('input');
    autoDeleteThresholdInput.id = 'auto-delete-threshold-input';
    autoDeleteThresholdInput.type = 'number';
    autoDeleteThresholdInput.classList = 'w-20 px-4 py-2 ml-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 disabled:opacity-40 text-white';
    autoDeleteThresholdInput.value = autoDeleteThreshold;
    autoDeleteThresholdInput.addEventListener('change', () => {
      const curAutoDeleteThresholdInput = document.querySelector('#auto-delete-threshold-input');
      const newValue = Math.round(curAutoDeleteThresholdInput.value);
      curAutoDeleteThresholdInput.value = newValue;
      chrome.storage.local.set({ settings: { ...result.settings, autoDeleteThreshold: newValue } });
    });
    autoDeleteThresholdInput.addEventListener('input', () => {
      const curAutoDeleteThresholdInput = document.querySelector('#auto-delete-threshold-input');
      const newValue = Math.round(curAutoDeleteThresholdInput.value);
      curAutoDeleteThresholdInput.value = newValue;
      chrome.storage.local.set({ settings: { ...result.settings, autoDeleteThreshold: newValue } });
    });

    autoDeleteModesWrapper.appendChild(autoDeleteThresholdInput);

    const autoDeleteThresholdLabel = document.createElement('label');
    autoDeleteThresholdLabel.id = 'auto-delete-threshold-label';
    autoDeleteThresholdLabel.classList = 'ml-2 text-sm text-gray-300 flex items-center';
    autoDeleteThresholdLabel.textContent = autoDeleteMode.code === 'days' ? 'days' : 'chats';
    autoDeleteModesWrapper.appendChild(autoDeleteThresholdLabel);

    content.appendChild(autoDeleteModesWrapper);
    addDropdownEventListener('Auto-Delete-Mode', autoDeleteModes, toggleAutoDeleteOldChatMode);

    // add a title that says warning zone
    const warningZoneTitle = document.createElement('div');
    warningZoneTitle.style = 'width:100%;font-size:0.8em;color:lightslategray;margin-top:24px;';
    warningZoneTitle.innerText = 'Warning Zone';
    content.appendChild(warningZoneTitle);
    // add a divider
    const divider = document.createElement('div');
    divider.style = 'width:100%;height:1px;background-color:lightslategray;margin:0 0 24px 0;';
    content.appendChild(divider);

    // Reset Folders
    const resetFoldersButton = document.createElement('button');
    resetFoldersButton.textContent = 'Reset Folders';
    resetFoldersButton.disabled = !autoSync;
    resetFoldersButton.style.pointerEvents = !autoSync ? 'none' : 'auto';
    resetFoldersButton.classList = 'btn btn-warning flex justify-center gap-2 border-0 md:border';
    resetFoldersButton.addEventListener('click', () => {
      showActionConfirm('Reset Folders', 'Clicking on Restart will remove all folders and allow you to recreate them again.', 'Restart', null, resetFolders, 'orange');
    });
    content.appendChild(resetFoldersButton);
    const resetFoldersDesc = document.createElement('div');
    resetFoldersDesc.style = 'width:100%;font-size:0.8em;color:lightslategray;margin-top:8px;';
    resetFoldersDesc.innerText = 'This will remove all folders. The conversations inside folders will not be deleted, but your trash folder will get emptied.';
    content.appendChild(resetFoldersDesc);
  });
  return content;
}
function resetFolders() {
  chrome.storage.local.remove('conversationsOrder', () => {
    window.location.reload();
  });
}
function toggleCustomGPTAutoFolder(isChecked) {
  if (isChecked) {
    chrome.runtime.sendMessage({
      checkHasSubscription: true,
      detail: {
        forceRefresh: true,
      },
    }, (hasSubscription) => {
      if (!hasSubscription) {
        toast('This action requires a Pro account', 'error');
        return;
      }
      chrome.storage.local.get(['conversations', 'conversationsOrder', 'settings'], (result) => {
        const { conversations, conversationsOrder, settings } = result;
        // find custom gpt conversations
        const conversationIds = conversationsOrder.filter((c) => typeof c === 'string');
        const customGPTConversations = conversationIds.map((c) => conversations[c]).filter((c) => c?.gizmo_id);
        const customGPTConversationIds = customGPTConversations.map((c) => c.id);

        // get unique gizmo_ids
        const uniqueGizmoIds = [...new Set(customGPTConversations.map((c) => c.gizmo_id))];
        if (uniqueGizmoIds.length === 0) return;

        // for each id in customGPTConversations,
        const newConversationOrder = conversationsOrder.filter((c) => typeof c !== 'string' || !customGPTConversationIds.includes(c));

        // get gizmo_name for each gizmo_id
        const processedGizmoIds = [];
        // add an overlay to the full page with wpinner and text that says auto folder is being created
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.style = 'position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.5); z-index:100000; display:flex; justify-content:center; align-items:center;';
        overlay.innerHTML = '<div class="w-full flex-wrap inset-0 flex items-center justify-center text-white"><svg x="0" y="0" viewbox="0 0 40 40" class="spinner"><circle fill="transparent" stroke="#ffffff50" stroke-width="4" stroke-linecap="round" stroke-dasharray="125.6" cx="20" cy="20" r="18"></circle></svg><div style="font-size: 1.5em;font-weight: 600;color: lightslategray;width: 100%;display: flex;align-items: center;justify-content: center;margin-top:16px;">Creating Custom GPT Folders</div></div>';
        document.body.appendChild(overlay);
        // for each gizmo_id, get gizmo_name and create a folder with that name
        uniqueGizmoIds.forEach((gid) => getGizmoById(gid).then((gizmoData) => {
          const existingFolder = newConversationOrder.find((f) => f?.id === gid);
          if (existingFolder) {
            newConversationOrder.find((f) => f?.id === gid).conversationIds = [...new Set([...existingFolder.conversationIds, ...customGPTConversations.filter((c) => c.gizmo_id === gid).map((c) => c.id)])];
          } else {
            newConversationOrder.unshift({
              id: gid,
              color: settings.autoColorFolders ? generateRandomDarkColor() : '#40414f',
              name: gizmoData?.resource?.gizmo?.display?.name,
              conversationIds: [...new Set(customGPTConversations.filter((c) => c.gizmo_id === gid).map((c) => c.id))],
            });
          }
          processedGizmoIds.push(gid);
          if (processedGizmoIds.length === uniqueGizmoIds.length) {
            chrome.storage.local.set({ conversationsOrder: newConversationOrder }, () => {
              reloadConversationList();
              // remove the overlay
              document.querySelector('#loading-overlay').remove();
            });
          }
        }));
      });
    });
  }
}
function toggleAutoDeleteOldChats(isChecked) {
  const autoDeleteModesWrapper = document.querySelector('#autoDeleteModesWrapper');
  if (isChecked) {
    autoDeleteModesWrapper.style.opacity = 1;
    autoDeleteModesWrapper.style.pointerEvents = 'auto';
    toast('Auto Delete Old Chats Enabled', 'warning');
  } else {
    autoDeleteModesWrapper.style.opacity = 0.5;
    autoDeleteModesWrapper.style.pointerEvents = 'none';
  }
}
function toggleAutoDeleteOldChatMode(mode) {
  chrome.storage.local.get(['settings'], (result) => {
    chrome.storage.local.set({ settings: { ...result.settings, autoDeleteMode: mode } }, () => {
      const autoDeleteThresholdLabel = document.querySelector('#auto-delete-threshold-label');
      autoDeleteThresholdLabel.textContent = mode.code === 'days' ? 'days' : 'chats';
    });
  });
}
function conversationTabContent(hasSubscription = false) {
  const content = document.createElement('div');
  content.id = 'settings-modal-tab-content';
  content.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;';
  chrome.storage.local.get(['settings'], (result) => {
    const { autoSync, customConversationWidth, conversationWidth } = result.settings;

    // conversation width
    const customConversationWidthSwitch = createSwitch('Custom Conversation Width', 'OFF: Use default / ON: Set Conversation Width (30%-90%)', 'customConversationWidth', false, toggleCustomWidthInput);
    content.appendChild(customConversationWidthSwitch);

    const conversationWidthInput = document.createElement('input');
    conversationWidthInput.id = 'conversation-width-input';
    conversationWidthInput.type = 'number';
    conversationWidthInput.classList = 'max-w-full px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 disabled:opacity-40 text-white';
    conversationWidthInput.disabled = !customConversationWidth;
    conversationWidthInput.value = conversationWidth;
    conversationWidthInput.addEventListener('change', () => {
      const curConversationWidthInput = document.querySelector('#conversation-width-input');
      const newValue = Math.round(curConversationWidthInput.value);
      curConversationWidthInput.value = newValue;
      Array.from(document.querySelectorAll('[id^=message-wrapper]')).forEach((el) => {
        el.querySelector('div').style.maxWidth = `${newValue}%`;
      });
      if (document.querySelector('#conversation-bottom')) {
        document.querySelector('#conversation-bottom').firstChild.style.maxWidth = `${newValue}%`;
      }
      document.querySelector('main').querySelector('form').style.maxWidth = `${newValue}%`;
      chrome.storage.local.set({ settings: { ...result.settings, conversationWidth: newValue, customConversationWidth: true } });
    });
    conversationWidthInput.addEventListener('input', () => {
      const curConversationWidthInput = document.querySelector('#conversation-width-input');
      const newValue = Math.round(curConversationWidthInput.value);
      curConversationWidthInput.value = newValue;
      Array.from(document.querySelectorAll('[id^=message-wrapper]')).forEach((el) => {
        el.querySelector('div').style.maxWidth = `${newValue}%`;
      });
      if (document.querySelector('#conversation-bottom')) {
        document.querySelector('#conversation-bottom').firstChild.style.maxWidth = `${newValue}%`;
      }
      document.querySelector('main').querySelector('form').style.maxWidth = `${newValue}%`;
      chrome.storage.local.set({ settings: { ...result.settings, conversationWidth: newValue, customConversationWidth: true } });
    });
    content.appendChild(conversationWidthInput);

    const pluginDefaultOpenSwitch = createSwitch('Open Plugin Detail by Default', 'Show Plugin detail by default', 'pluginDefaultOpen', false, null, ['Requires Auto-Sync'], !autoSync);
    content.appendChild(pluginDefaultOpenSwitch);

    const showMessageTimestampSwitch = createSwitch('Message Timestamp', 'Show/hide timestamps on each message', 'showMessageTimestamp', false, reloadConversationList, ['Requires Auto-Sync'], !autoSync);
    content.appendChild(showMessageTimestampSwitch);

    const pinNavSwitch = createSwitch('Pin Navigation', 'Show/hide message pins for quick navigation(only when conversations are fully synced)', 'showPinNav', true, reloadConversationList, ['Requires Auto-Sync'], !autoSync);
    content.appendChild(pinNavSwitch);

    const autoHideThreadCountSwitch = createSwitch('Auto Hide Thread Count', 'Hide the thread count (<1/2>) unless you hover over the message', 'autoHideThreadCount', true, toggleAutoHideThreadCount, ['Requires Auto-Sync'], !autoSync);
    content.appendChild(autoHideThreadCountSwitch);

    const autoHideTopNav = createSwitch('Auto Hide Top Navbar', 'Automatically hide the navbar at the top of the page when move the mouse out of it.', 'autoHideTopNav', true, toggleTopNav, ['Requires Auto-Sync'], !autoSync);
    content.appendChild(autoHideTopNav);

    const autoResetTopNav = createSwitch('Auto Reset Top Navbar', 'Automatically reset the tone, writing style, and language to default when switching to new chats', 'autoResetTopNav', false, null, ['Requires Auto-Sync'], !autoSync);
    content.appendChild(autoResetTopNav);

    const chatEndedSoundSwitch = createSwitch('Sound Alarm', 'Play a sound when the chat ends', 'chatEndedSound', false, null, ['Requires Auto-Sync'], !autoSync);
    content.appendChild(chatEndedSoundSwitch);

    // copy mode
    const copyModeSwitch = createSwitch('Copy mode', 'OFF: only copy response / ON: copy both request and response', 'copyMode', false);
    content.appendChild(copyModeSwitch);

    // show word counter
    const showWordCountSwitch = createSwitch('Word/Char Count', 'Show/hide word/char count on each message', 'showWordCount', true, reloadConversationList);
    content.appendChild(showWordCountSwitch);

    // auto scroll
    const autoScrollSwitch = createSwitch('Auto Scroll', 'Automatically scroll down while responding', 'autoScroll', true);
    content.appendChild(autoScrollSwitch);
  });
  return content;
}
function toggleAutoHideThreadCount(isChecked) {
  const allThreadButtonsWrapper = document.querySelectorAll('[id^=thread-buttons-wrapper-]');
  allThreadButtonsWrapper.forEach((el) => {
    if (el.textContent !== '1 / 1') {
      if (isChecked) {
        el.classList.add('invisible');
      } else {
        el.classList.remove('invisible');
      }
    }
  });
}
function promptInputTabContent(hasSubscription = false) {
  const content = document.createElement('div');
  content.id = 'settings-modal-tab-content';
  content.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;';
  chrome.storage.local.get(['settings'], (result) => {
    const { autoSync } = result.settings;
    // input history
    const promptHistorySwitch = createSwitch('Input History Shortkey', 'Enable/disable the up and down arrow to cycle through input history.', 'promptHistory', true);
    content.appendChild(promptHistorySwitch);

    const showGpt4Counter = createSwitch('Show GPT-4 Counter', 'Show the number of GPT-4 messages in the last 3 hours', 'showGpt4Counter', true, toggleGpt4Counter, ['Requires Auto-Sync'], !autoSync);
    content.appendChild(showGpt4Counter);

    const showExamplePromptsSwitch = createSwitch('Show Example Prompts', 'Show the example prompts when starting a new chat', 'showExamplePrompts', true, null, ['Requires Auto-Sync'], !autoSync);
    content.appendChild(showExamplePromptsSwitch);

    // prompt template
    const promptTemplateSwitch = createSwitch('Prompt Template', 'Enable/disable the doube {{curly}} brackets replacement (<a style="text-decoration:underline; color:gold;" href="https://www.youtube.com/watch?v=JMBjq0XtutA&ab_channel=Superpower" target="blank">Learn More</a>)', 'promptTemplate', true, null, ['Requires Auto-Sync'], !autoSync);
    content.appendChild(promptTemplateSwitch);
  });
  return content;
}
function modelsTabContent(hasSubscription = false) {
  const content = document.createElement('div');
  content.id = 'settings-modal-tab-content';
  content.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;';

  const modelSwitcherRow = document.createElement('div');
  modelSwitcherRow.style = 'display: flex; flex-direction: row; justify-content: start; align-items: center; width:100%;';

  const modelSwitcherWrapper = document.createElement('div');
  modelSwitcherWrapper.style = 'position:relative;min-width:200px;z-index:1000; pointer-events: none;';
  const idPrefix = 'settings';
  modelSwitcherWrapper.id = `model-switcher-wrapper-${idPrefix}`;
  modelSwitcherRow.appendChild(modelSwitcherWrapper);
  content.appendChild(modelSwitcherRow);
  const betaTag = document.createElement('span');
  betaTag.style = 'background-color: #ff9800; color: black; padding: 2px 4px; border-radius: 8px; font-size: 0.7em;margin-top:8px;';
  betaTag.textContent = 'Requires Auto-Sync';
  content.appendChild(betaTag);
  chrome.storage.local.get(['settings', 'models', 'unofficialModels', 'customModels'], (result) => {
    const {
      models, unofficialModels, customModels, settings,
    } = result;
    const allModels = [...models, ...unofficialModels, ...customModels];
    const { autoSync } = result.settings;
    modelSwitcherWrapper.innerHTML = modelSwitcher(allModels, settings.selectedModel, idPrefix, customModels, settings.autoSync, true);
    addModelSwitcherEventListener(idPrefix, true);
    if (autoSync) {
      modelSwitcherWrapper.style.pointerEvents = 'all';
    } else {
      modelSwitcherWrapper.style.pointerEvents = 'none';
    }
    const unofficialNote = document.createElement('div');
    unofficialNote.style = 'color: #eee; font-size: 0.8em; margin-left:8px';
    unofficialNote.innerHTML = 'Unofficial and custom models are experimental. They may or may not work. This feature was implemented to make it easy to test other models. <a href="https://www.youtube.com/watch?v=laRDIUkedz8&ab_channel=Superpower" target="_blank" class="underline text-gold" rel="noreferrer">Learn more</a>';
    modelSwitcherRow.appendChild(unofficialNote);
  });
  const newCustomModelWrapper = document.createElement('div');
  newCustomModelWrapper.id = 'new-custom-model-wrapper';
  newCustomModelWrapper.style = 'display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin-top: 24px; flex-wrap:wrap;padding: 8px; border-radius: 8px;background-color: #1e1e2f;';
  const newCustomModelInputWrapper = document.createElement('div');
  newCustomModelInputWrapper.style = 'display: flex; flex-direction: row; justify-content: start; align-items: start; width: 100%; margin: 8px 0;';
  const newCustomModelWrapperTitle = document.createElement('div');
  newCustomModelWrapperTitle.style = 'width: 100%; margin: 8px 0;color: #eee;';
  newCustomModelWrapperTitle.innerHTML = 'Add a Custom Model<span style="background-color: rgb(255, 152, 0); color: black; padding: 2px 4px; border-radius: 8px; font-size: 0.7em; margin-left: 8px;position:relative; bottom:2px;">Experimental</span>';

  const newCustomModelSlug = document.createElement('input');
  newCustomModelSlug.style = 'width: 160px; height: 34px; border-radius: 4px; border: 1px solid #565869; background-color: #0b0d0e;margin-right:8px; color: #eee; padding: 0 8px; font-size: 14px;';
  newCustomModelSlug.placeholder = 'Model Slug';
  newCustomModelSlug.autocomplete = 'off';
  // only accept alphanumerics and dashes and parentheses and underscores
  newCustomModelSlug.pattern = '[a-zA-Z0-9-_()]+';
  newCustomModelSlug.autofocus = true;
  newCustomModelSlug.dir = 'auto';
  newCustomModelSlug.addEventListener('input', () => {
    newCustomModelSlug.style.borderColor = '#565869';
    repeatedSlugError.style.visibility = 'hidden';
  });

  const newCustomModelText = document.createElement('textarea');
  newCustomModelText.style = 'width: 100%; height: 34px; min-height: 34px; border-radius: 4px; border: 1px solid #565869; background-color: #0b0d0e; color: #eee; padding: 4px 8px; font-size: 14px;';
  newCustomModelText.placeholder = 'Model description';
  newCustomModelText.dir = 'auto';
  newCustomModelText.addEventListener('input', () => {
    newCustomModelText.style.borderColor = '#565869';
  });

  const repeatedSlugError = document.createElement('div');
  repeatedSlugError.id = 'repeated-name-error';
  repeatedSlugError.style = 'color: #f56565; font-size: 10px;visibility: hidden;';
  repeatedSlugError.textContent = 'Another model with this slug already exist.';
  const newCustomModelButtonWrapper = document.createElement('div');
  newCustomModelButtonWrapper.style = 'display: flex; flex-direction: row; justify-content: end; align-items: center; width: 100%; margin-bottom: 16px;';
  const newCustomModelSlugDescription = document.createElement('div');
  newCustomModelSlugDescription.style = 'width: 100%; margin: 8px 8px 8px 0; font-size: 12px; color: #eee;';
  newCustomModelSlugDescription.textContent = 'The slug is used to identify the model by OpenAI. Description can be anything, but slug has to be the official name of the model in OpenAI';

  const newCustomModelCancelButton = document.createElement('button');
  newCustomModelCancelButton.textContent = 'Cancel';
  newCustomModelCancelButton.classList = 'btn flex justify-center gap-2 btn-dark border-0 md:border mr-2';
  newCustomModelCancelButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const curnewCustomModelWrapper = document.getElementById('new-custom-model-wrapper');
    curnewCustomModelWrapper.remove();
  });
  const newCustomModelSaveButton = document.createElement('button');
  newCustomModelSaveButton.textContent = 'Save';
  newCustomModelSaveButton.classList = 'btn flex justify-center gap-2 btn-primary border-0 md:border';
  newCustomModelSaveButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!newCustomModelText.value.trim()) {
      newCustomModelText.style.borderColor = '#ff4a4a';
    }
    if (!newCustomModelSlug.value.trim()) {
      newCustomModelSlug.style.borderColor = '#ff4a4a';
    }
    if (!newCustomModelSlug.value.trim() || !newCustomModelText.value.trim()) return;
    chrome.storage.local.get(['models', 'unofficialModels', 'customModels', 'settings'], (res) => {
      const allModels = [...res.models, ...res.unofficialModels, ...res.customModels];
      const newCustomModels = (res.customModels && res.customModels.length > 0) ? res.customModels : [];
      if (allModels.map((k) => k?.slug?.toLowerCase()).includes(newCustomModelSlug.value.trim().toLowerCase())) {
        newCustomModelSlug.style.borderColor = '#ff4a4a';
        repeatedSlugError.style.visibility = 'visible';
        return;
      }
      newCustomModels.push({
        title: `${newCustomModelSlug.value.trim()}`,
        description: newCustomModelText.value.trim(),
        slug: newCustomModelSlug.value.trim(),
        tags: ['Custom'],
      });
      chrome.storage.local.set({ customModels: newCustomModels }, () => {
        const modelSwitcherWrappers = document.querySelectorAll('[id^=model-switcher-wrapper-]');
        modelSwitcherWrappers.forEach((wrapper) => {
          const curIdPrefix = wrapper.id.split('model-switcher-wrapper-')[1];
          const newAllModels = [...res.models, ...res.unofficialModels, ...newCustomModels];
          wrapper.innerHTML = modelSwitcher(newAllModels, res.settings.selectedModel, curIdPrefix, newCustomModels, res.settings.autoSync, true);
          addModelSwitcherEventListener(curIdPrefix, true);
        });
        // clear the input fields
        newCustomModelText.value = '';
        newCustomModelSlug.value = '';
      });
    });
  });
  newCustomModelWrapper.appendChild(newCustomModelWrapperTitle);
  newCustomModelInputWrapper.appendChild(newCustomModelSlug);
  newCustomModelInputWrapper.appendChild(newCustomModelText);
  newCustomModelButtonWrapper.appendChild(newCustomModelSlugDescription);
  newCustomModelButtonWrapper.appendChild(newCustomModelCancelButton);
  newCustomModelButtonWrapper.appendChild(newCustomModelSaveButton);
  newCustomModelWrapper.appendChild(newCustomModelInputWrapper);
  newCustomModelWrapper.appendChild(repeatedSlugError);
  newCustomModelWrapper.appendChild(newCustomModelButtonWrapper);
  content.appendChild(newCustomModelWrapper);
  return content;
}
function toggleCustomPromptsButtonVisibility(isChecked) {
  const customPromptsButton = document.querySelector('#continue-conversation-button-wrapper');
  if (!customPromptsButton) return;
  if (isChecked) {
    customPromptsButton.style.display = 'flex';
  } else {
    customPromptsButton.style.display = 'none';
  }
}
function customPromptTabContent(hasSubscription = false) {
  const content = document.createElement('div');
  content.id = 'settings-modal-tab-content';
  content.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;';

  chrome.storage.local.get(['customPrompts', 'settings'], (result) => {
    // custom prompts section
    const customPromptSectionWrapper = document.createElement('div');
    customPromptSectionWrapper.style = 'display: flex; justify-content:space-between; align-items:center; width: 100%; color: lightslategray; font-size: 16px;';
    const customPromptSection = document.createElement('div');
    customPromptSection.style = 'color: lightslategray; font-size: 16px; margin: 12px 0;';
    // customPromptSection.textContent = 'Custom Prompts';

    const showCustomPromptsButtonSwitch = createSwitch('Show Custom Prompts Button', 'Show/hide the button to use custom prompts. <a href="https://www.youtube.com/watch?v=FBgR7YmrxUk&ab_channel=Superpower" target="_blank" class="underline text-gold" rel="noreferrer">Learn more</a>', 'showCustomPromptsButton', true, toggleCustomPromptsButtonVisibility);
    customPromptSection.appendChild(showCustomPromptsButtonSwitch);

    const newCustomPromptButton = document.createElement('button');
    newCustomPromptButton.textContent = 'Add New Custom Prompts';
    newCustomPromptButton.classList = 'btn flex justify-center gap-2 btn-dark border-0 md:border';
    newCustomPromptButton.addEventListener('click', () => {
      const existingNewCustomPromptWrapper = document.querySelector('#new-custom-prompt-wrapper');
      if (existingNewCustomPromptWrapper) return;
      const newCustomPromptWrapper = document.createElement('div');
      newCustomPromptWrapper.id = 'new-custom-prompt-wrapper';
      newCustomPromptWrapper.style = 'display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0; flex-wrap:wrap;padding: 8px; border-radius: 8px;background-color: #1e1e2f;';
      const newCustomPromptInputWrapper = document.createElement('div');
      newCustomPromptInputWrapper.style = 'display: flex; flex-direction: row; justify-content: start; align-items: start; width: 100%; margin: 8px 0;';
      const newCustomPromptTitle = document.createElement('input');
      newCustomPromptTitle.style = 'width: 120px; height: 34px; border-radius: 4px; border: 1px solid #565869; background-color: #0b0d0e;margin-right:8px; color: #eee; padding: 0 8px; font-size: 14px;';
      newCustomPromptTitle.placeholder = 'Prompt Title';
      newCustomPromptTitle.autofocus = true;
      newCustomPromptTitle.dir = 'auto';
      newCustomPromptTitle.addEventListener('input', () => {
        newCustomPromptTitle.style.borderColor = '#565869';
        repeatedNameError.style.visibility = 'hidden';
      });
      const newCustomPromptText = document.createElement('textarea');
      newCustomPromptText.style = 'width: 100%; height: 34px; min-height: 34px; border-radius: 4px; border: 1px solid #565869; background-color: #0b0d0e; color: #eee; padding: 4px 8px; font-size: 14px;';
      newCustomPromptText.placeholder = 'Prompt Text';
      newCustomPromptText.dir = 'auto';
      newCustomPromptText.addEventListener('input', () => {
        newCustomPromptText.style.borderColor = '#565869';
      });

      const helperText = document.createElement('div');
      helperText.style = 'color: #999; font-size: 12px; margin: 8px 0;';
      helperText.textContent = 'Tip: You can use @promptTitle anywhere in your prompt input to automatically replace it with the prompt text. For this feature to work make sure you don\'t have any space in the prompt title. Smart replace is not case sensitive.';

      const repeatedNameError = document.createElement('div');
      repeatedNameError.id = 'repeated-name-error';
      repeatedNameError.style = 'color: #f56565; font-size: 12px;visibility: hidden;';
      repeatedNameError.textContent = 'Another custom prompt with this name already exist. Please use a different name.';
      const newCustomPromptButtonWrapper = document.createElement('div');
      newCustomPromptButtonWrapper.style = 'display: flex; flex-direction: row; justify-content: end; align-items: center; width: 100%; margin-bottom: 16px;';
      const newCustomPromptCancelButton = document.createElement('button');
      newCustomPromptCancelButton.textContent = 'Cancel';
      newCustomPromptCancelButton.classList = 'btn flex justify-center gap-2 btn-dark border-0 md:border mr-2';
      newCustomPromptCancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const curNewCustomPromptWrapper = document.getElementById('new-custom-prompt-wrapper');
        curNewCustomPromptWrapper.remove();
      });
      const newCustomPromptSaveButton = document.createElement('button');
      newCustomPromptSaveButton.textContent = 'Save';
      newCustomPromptSaveButton.classList = 'btn flex justify-center gap-2 btn-primary border-0 md:border';
      newCustomPromptSaveButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!newCustomPromptTitle.value.trim()) {
          newCustomPromptTitle.style.borderColor = '#ff4a4a';
        }
        if (!newCustomPromptText.value.trim()) {
          newCustomPromptText.style.borderColor = '#ff4a4a';
        }
        if (!newCustomPromptTitle.value.trim() || !newCustomPromptText.value.trim()) return;
        chrome.storage.local.get(['customPrompts'], (res) => {
          const newCustomPrompts = (res.customPrompts && res.customPrompts.length > 0) ? res.customPrompts : defaultPrompts;
          if (newCustomPrompts.map((k) => k.title.toLowerCase()).includes(newCustomPromptTitle.value.trim().toLowerCase())) {
            newCustomPromptTitle.style.borderColor = '#ff4a4a';
            repeatedNameError.style.visibility = 'visible';
            return;
          }
          newCustomPrompts.push({ title: newCustomPromptTitle.value.trim(), text: newCustomPromptText.value.trim(), isDefault: false });
          chrome.storage.local.set({ customPrompts: newCustomPrompts }, () => {
            // add new custom prompt right after curNewCustomPromptWrapper
            const curNewCustomPromptWrapper = document.getElementById('new-custom-prompt-wrapper');
            const newCustomPromptRow = createPromptRow(newCustomPromptTitle.value.trim(), newCustomPromptText.value.trim(), false, 'customPrompts');
            const customPromptsList = document.getElementById('custom-prompt-list');
            // add to the beginning of the list
            customPromptsList.insertBefore(newCustomPromptRow, customPromptsList.firstChild);
            curNewCustomPromptWrapper.remove();
          });
        });
      });
      newCustomPromptInputWrapper.appendChild(newCustomPromptTitle);
      newCustomPromptInputWrapper.appendChild(newCustomPromptText);
      newCustomPromptButtonWrapper.appendChild(newCustomPromptCancelButton);
      newCustomPromptButtonWrapper.appendChild(newCustomPromptSaveButton);
      newCustomPromptWrapper.appendChild(newCustomPromptInputWrapper);
      newCustomPromptWrapper.appendChild(helperText);
      newCustomPromptWrapper.appendChild(repeatedNameError);
      newCustomPromptWrapper.appendChild(newCustomPromptButtonWrapper);
      // insert after customPromptSectionWrapper
      customPromptSectionWrapper.parentNode.insertBefore(newCustomPromptWrapper, customPromptSectionWrapper.nextSibling);
    });
    customPromptSectionWrapper.appendChild(customPromptSection);
    customPromptSectionWrapper.appendChild(newCustomPromptButton);
    content.appendChild(customPromptSectionWrapper);
    const customPromptsList = document.createElement('div');
    customPromptsList.id = 'custom-prompt-list';
    customPromptsList.classList = 'flex flex-col w-full';
    const { customPrompts, settings } = result;
    const { autoSync, customInstruction } = settings;
    if (customPrompts) {
      for (let i = 0; i < customPrompts?.length; i += 1) {
        const promptTitle = customPrompts[i].title;
        const promptText = customPrompts[i].text;
        const { isDefault } = customPrompts[i];
        const promptRow = createPromptRow(promptTitle, promptText, isDefault, 'customPrompts');
        customPromptsList.appendChild(promptRow);
      }
    }
    Sortable.create(customPromptsList, {
      group: {
        name: 'custom-prompts-list',
        pull: true,
        // eslint-disable-next-line func-names, object-shorthand, no-unused-vars
        put: function (to, from, dragged) {
          return from.el.id !== 'folder-content-trash';
        },
      },
      direction: 'vertical',
      invertSwap: true,
      draggable: '#custom-prompt-row',
      onEnd: (event) => {
        const { oldIndex, newIndex } = event;
        chrome.storage.local.get(['customPrompts'], (res) => {
          const newPrompts = res.customPrompts;
          const [removed] = newPrompts.splice(oldIndex, 1);
          newPrompts.splice(newIndex, 0, removed);
          chrome.storage.local.set({ customPrompts: newPrompts });
        });
      },
    });
    content.appendChild(customPromptsList);
    // custom inststruction section
    const customInstructionSection = document.createElement('div');
    customInstructionSection.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start; width: 100%; margin: 16px 0;';

    const customInstructionSwitch = createSwitch('Custom Instruction', 'Custom instruction will be added to the end of each promps. You can use it to add instructions that you like to include in every prompt. For example, you can add "Please repeat the prompt after me.", or "Please refrain from writing warnings about your knowledge cutoff" to the custom instruction, and it will be added to the end of every prompt.(Make sure to add a space or new-line in the beggining!)', 'useCustomInstruction', false, toggleCustomInstructionInput, ['Requires Auto-Sync'], !autoSync);

    const customInstructionInputWrapper = document.createElement('div');
    customInstructionInputWrapper.style = 'display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin-bottom: 8px;';
    const customInstructionInput = document.createElement('textarea');
    customInstructionInput.id = 'custom-instruction-input';
    customInstructionInput.style = 'width: 100%; height: 100px; border-radius: 4px; border: 1px solid #565869; background-color: #2d2d3a; color: #eee; padding: 8px;';
    customInstructionInput.placeholder = 'Enter your custom instruction here...';
    customInstructionInput.value = customInstruction;
    customInstructionInput.addEventListener('input', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const newCustomInstruction = e.target.value;
      chrome.storage.local.get(['settings'], (res) => {
        chrome.storage.local.set({ settings: { ...res.settings, customInstruction: newCustomInstruction } });
      });
    });
    customInstructionInputWrapper.appendChild(customInstructionInput);

    customInstructionSection.appendChild(customInstructionSwitch);
    customInstructionSection.appendChild(customInstructionInputWrapper);
    content.appendChild(customInstructionSection);

    const extraSpaceDiv = document.createElement('div');
    extraSpaceDiv.style = 'min-height: 200px;';
    content.appendChild(extraSpaceDiv);
  });
  return content;
}
function toggleCustomInstructionInput(isChecked) {
  const customInstructionInput = document.getElementById('custom-instruction-input');
  if (isChecked) {
    customInstructionInput.style.opacity = '1';
    customInstructionInput.disabled = false;
  } else {
    customInstructionInput.style.opacity = '0.5';
    customInstructionInput.disabled = true;
  }
}
function createPromptRow(promptTitle, promptText, isDefault, promptObjectName) {
  const promptRow = document.createElement('div');
  promptRow.id = 'custom-prompt-row';
  promptRow.style = 'display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0;';
  const dragPromptButton = document.createElement('div');
  dragPromptButton.style = 'width: 48px; display:flex;align-items:center;justify-content:start; color: #eee;cursor:grab;';
  dragPromptButton.title = 'Drag to reorder';
  dragPromptButton.id = 'custom-prompt-drag-handle';
  dragPromptButton.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="2em" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 288zm0-128c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z"/></svg>';
  promptRow.appendChild(dragPromptButton);
  const promptLabel = document.createElement('div');
  promptLabel.style = 'min-width: 100px; max-width:100px; margin-right: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;color:white;text-transform: capitalize;';
  promptLabel.innerHTML = `<div style="display:flex;"><b style="position:relative;margin-right:4px;bottom:2px;">@</b>${promptTitle}</div>`;
  promptLabel.title = promptTitle;
  promptLabel.dir = 'auto';
  const promptInput = document.createElement('textarea');
  promptInput.style = 'width: 100%; height: 34px; min-height: 34px; border-radius: 4px; border: 1px solid #565869; background-color: #1e1e2f; color: #eee; padding: 4px 8px; font-size: 14px;margin-right: 8px;';
  promptInput.id = `${promptObjectName}-${promptTitle}`;
  promptInput.dir = 'auto';
  promptInput.value = promptText;
  promptInput.addEventListener('change', () => {
    chrome.storage.local.get([promptObjectName], (res) => {
      const newPrompts = res[promptObjectName];
      newPrompts.find((p) => p.title === promptTitle).text = promptInput.value.trim();
      chrome.storage.local.set({ [promptObjectName]: newPrompts });
    });
  });
  promptRow.appendChild(promptLabel);
  promptRow.appendChild(promptInput);
  if (promptObjectName === 'customPrompts') {
    const deleteButton = document.createElement('button');
    deleteButton.classList = 'btn flex justify-center gap-2 btn-dark border-0 md:border mr-2';
    deleteButton.style = 'min-width:72px;height:34px;';
    deleteButton.textContent = 'Delete';
    deleteButton.disabled = isDefault;
    deleteButton.addEventListener('click', (e) => {
      if (e.target.textContent === 'Confirm') {
        chrome.storage.local.get([promptObjectName], (res) => {
          let newPrompts = res[promptObjectName];
          if (newPrompts.length <= 1) {
            toast('You must have at least one custom prompt', 'error');
          } else if (newPrompts.find((p) => p.title === promptTitle).isDefault) {
            toast('You cannot delete a default prompt', 'error');
          } else {
            newPrompts = newPrompts.filter((p) => p.title !== promptTitle);
            chrome.storage.local.set({ [promptObjectName]: newPrompts }, () => {
              promptRow.remove();
            });
          }
        });
      } else {
        e.target.textContent = 'Confirm';
        e.target.style.backgroundColor = '#864e6140';
        e.target.style.color = '#ff4a4a';
        e.target.style.borderColor = '#ff4a4a';
        setTimeout(() => {
          e.target.textContent = 'Delete';
          e.target.style = 'min-width:72px;height:34px;';
        }, 1500);
      }
    });
    promptRow.appendChild(deleteButton);

    const defaultButton = document.createElement('button');
    defaultButton.classList = `btn flex justify-center gap-2 ${isDefault ? 'btn-primary' : 'btn-dark'} border-0 md:border`;
    defaultButton.setAttribute('data-default', isDefault ? 'true' : 'false');
    defaultButton.style = 'min-width:72px;height:34px;';
    defaultButton.textContent = 'Default';
    defaultButton.addEventListener('click', () => {
      chrome.storage.local.get([promptObjectName], (res) => {
        const newPrompts = res[promptObjectName];
        newPrompts.find((p) => p.isDefault).isDefault = false;
        newPrompts.find((p) => p.title === promptTitle).isDefault = true;
        chrome.storage.local.set({ [promptObjectName]: newPrompts }, () => {
          const curDefaultButton = document.querySelector('[data-default="true"]');
          const curDeleteButton = [...curDefaultButton.parentNode.querySelectorAll('button')].find((b) => b.textContent === 'Delete');
          curDeleteButton.disabled = false;
          curDefaultButton.setAttribute('data-default', 'false');
          curDefaultButton.classList = 'btn flex justify-center gap-2 btn-dark border-0 md:border';
          defaultButton.classList = 'btn flex justify-center gap-2 btn-primary border-0 md:border';
          defaultButton.textContent = 'Default';
          defaultButton.setAttribute('data-default', 'true');
          defaultButton.style = 'min-width:72px;height:34px;';
          const newDeleteButton = [...promptRow.querySelectorAll('button')].find((b) => b.textContent === 'Delete');
          newDeleteButton.disabled = true;
        });
      });
    });
    promptRow.appendChild(defaultButton);
  }
  return promptRow;
}

function exportTabContent(hasSubscription = false) {
  const content = document.createElement('div');
  content.id = 'settings-modal-tab-content';
  content.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;';

  // Export Mode
  const exportModeSwitchWrapper = document.createElement('div');
  exportModeSwitchWrapper.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start; width: 100%; margin: 8px 0;';
  const exportModeSwitch = document.createElement('div');
  exportModeSwitch.style = 'display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0; color:white;';
  exportModeSwitch.textContent = 'Export mode';
  const exportModeHelper = document.createElement('div');
  exportModeHelper.style = 'font-size: 12px; color: #999;';
  const exportModeLabel = document.createElement('label');
  exportModeLabel.classList = 'switch';
  const exportModeInput = document.createElement('input');
  exportModeInput.type = 'checkbox';
  chrome.storage.local.get('settings', ({ settings }) => {
    exportModeInput.checked = settings.exportMode === 'both';
    exportModeHelper.textContent = settings.exportMode === 'both' ? 'Export both Assistant and User\'s chats' : 'Export only Assistant\'s chats';
  });
  exportModeInput.addEventListener('change', () => {
    chrome.storage.local.get('settings', ({ settings }) => {
      settings.exportMode = exportModeInput.checked ? 'both' : 'assistant';
      exportModeHelper.textContent = settings.exportMode === 'both' ? 'Export both Assistant and User\'s chats' : 'Export only Assistant\'s chats';
      chrome.storage.local.set({ settings });
    });
  });
  const exportModeSlider = document.createElement('span');
  exportModeSlider.classList = 'slider round';

  exportModeLabel.appendChild(exportModeInput);
  exportModeLabel.appendChild(exportModeSlider);
  exportModeSwitch.appendChild(exportModeLabel);
  exportModeSwitchWrapper.appendChild(exportModeSwitch);
  exportModeSwitchWrapper.appendChild(exportModeHelper);

  // export format
  const exportNamingFormatLabel = document.createElement('div');
  exportNamingFormatLabel.style = 'display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0; color:white; opacity: 0.5;';
  exportNamingFormatLabel.textContent = 'Export naming format';
  const betaTag = document.createElement('span');
  betaTag.style = 'background-color: #ff9800; color: black; padding: 2px 4px; border-radius: 8px; margin-left: 8px; font-size: 0.7em;';
  betaTag.textContent = 'Coming soon';
  content.appendChild(exportModeSwitchWrapper);
  content.appendChild(exportNamingFormatLabel);
  exportNamingFormatLabel.appendChild(betaTag);
  return content;
}
function splitterTabContent(hasSubscription = false) {
  const content = document.createElement('div');
  content.id = 'settings-modal-tab-content';
  content.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;';

  // conversation width
  chrome.storage.local.get(['settings'], (result) => {
    const { autoSync } = result.settings;
    const splitterSwitchWrapper = document.createElement('div');
    splitterSwitchWrapper.style = 'display: flex; gap:16px; justify-content: start; align-items: start; width: 100%; margin: 8px 0;';
    const autoSplitSwitch = createSwitch('Auto Split', 'Automatically split long prompts into smaller chunks (<a style="text-decoration:underline; color:gold;" href="https://www.youtube.com/watch?v=IhRbmIhAm3I&ab_channel=Superpower" target="blank">Learn More</a>)', 'autoSplit', true, toggleAutoSummarizerSwitch, ['Requires Auto-Sync'], !autoSync);
    const autoSummarizeSwitch = createSwitch('Auto Summarize', 'Automatically summarize each chunk after auto split (<a style="text-decoration:underline; color:gold;" href="https://www.youtube.com/watch?v=IhRbmIhAm3I&ab_channel=Superpower" target="blank">Learn More</a>)', 'autoSummarize', false, updateAutoSplitPrompt, ['Requires Auto-Sync'], !autoSync);

    const autoSplitChunkSizeLabel = document.createElement('div');
    autoSplitChunkSizeLabel.style = 'display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0; color:white;';
    autoSplitChunkSizeLabel.textContent = 'Auto Split Chunk Size (GPT-3.5: <28,000 - GPT-4: <120,000)';

    const autoSplitChunkSizeInput = document.createElement('input');
    autoSplitChunkSizeInput.id = 'split-prompt-limit-input';
    autoSplitChunkSizeInput.type = 'number';
    autoSplitChunkSizeInput.classList = 'w-full px-4 py-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 disabled:opacity-40';
    autoSplitChunkSizeInput.value = result.settings.autoSplitLimit;
    autoSplitChunkSizeInput.addEventListener('change', () => {
      const curAutoSplitChunkSizeInput = document.querySelector('#split-prompt-limit-input');
      const newValue = Math.round(curAutoSplitChunkSizeInput.value);

      curAutoSplitChunkSizeInput.value = newValue;
      chrome.storage.local.set({ settings: { ...result.settings, autoSplitLimit: newValue } });
    });
    autoSplitChunkSizeInput.addEventListener('input', () => {
      const curAutoSplitChunkSizeInput = document.querySelector('#split-prompt-limit-input');
      const newValue = Math.round(curAutoSplitChunkSizeInput.value);

      curAutoSplitChunkSizeInput.value = newValue;
      chrome.storage.local.set({ settings: { ...result.settings, autoSplitLimit: newValue } });
    });

    // splitter initial prompt
    const autoSplitInitialPromptLabel = document.createElement('div');
    autoSplitInitialPromptLabel.style = 'display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin-top: 16px; color:white;';
    autoSplitInitialPromptLabel.textContent = 'Auto Split Prompt';

    const autoSplitInitialPromptHelper = document.createElement('div');
    autoSplitInitialPromptHelper.style = 'font-size: 12px; color: #999;margin-bottom: 8px;';
    autoSplitInitialPromptHelper.textContent = 'Auto Split Prompt is a instruction that will be used to split long user inputs into multiple chunks.';

    const autoSplitInitialPromptText = document.createElement('textarea');
    autoSplitInitialPromptText.id = 'split-initial-prompt-textarea';
    autoSplitInitialPromptText.style = 'width: 100%; height: 200px; min-height: 200px; border-radius: 4px; border: 1px solid #565869; background-color: #0b0d0e; color: #eee; padding: 4px 8px; font-size: 14px;';
    autoSplitInitialPromptText.placeholder = 'Enter Auto Split Prompt here...';
    chrome.storage.local.get('settings', ({ settings }) => {
      autoSplitInitialPromptText.value = settings.autoSplitInitialPrompt;
    });
    autoSplitInitialPromptText.dir = 'auto';
    autoSplitInitialPromptText.addEventListener('input', () => {
      autoSplitInitialPromptText.style.borderColor = '#565869';
      chrome.storage.local.get('settings', ({ settings }) => {
        chrome.storage.local.set({ settings: { ...settings, autoSplitInitialPrompt: autoSplitInitialPromptText.value } });
      });
    });

    // splitter chunk prompt
    const autoSplitChunkPromptLabel = document.createElement('div');
    autoSplitChunkPromptLabel.style = 'display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin-top: 16px; color:white;';
    autoSplitChunkPromptLabel.textContent = 'Auto Split Chunk Prompt';

    const autoSplitChunkPromptHelper = document.createElement('div');
    autoSplitChunkPromptHelper.style = 'font-size: 12px; color: #999;margin-bottom: 8px;';
    autoSplitChunkPromptHelper.textContent = 'Auto Split Chunk Prompt is the instruction used to process each chunk. For instance, it can be used to summarize the chunk.';

    const autoSplitChunkPromptText = document.createElement('textarea');
    autoSplitChunkPromptText.id = 'split-chunk-prompt-textarea';
    autoSplitChunkPromptText.style = 'width: 100%; height: 100px; min-height: 100px; border-radius: 4px; border: 1px solid #565869; background-color: #0b0d0e; color: #eee; padding: 4px 8px; font-size: 14px;';
    autoSplitChunkPromptText.placeholder = 'Enter splitter prompt here...';
    chrome.storage.local.get('settings', ({ settings }) => {
      autoSplitChunkPromptText.value = settings.autoSplitChunkPrompt;
    });
    autoSplitChunkPromptText.dir = 'auto';
    autoSplitChunkPromptText.addEventListener('input', () => {
      autoSplitChunkPromptText.style.borderColor = '#565869';
      chrome.storage.local.get('settings', ({ settings }) => {
        chrome.storage.local.set({ settings: { ...settings, autoSplitChunkPrompt: autoSplitChunkPromptText.value } });
      });
    });

    splitterSwitchWrapper.appendChild(autoSplitSwitch);
    splitterSwitchWrapper.appendChild(autoSummarizeSwitch);
    content.appendChild(splitterSwitchWrapper);
    content.appendChild(autoSplitChunkSizeLabel);
    content.appendChild(autoSplitChunkSizeInput);
    content.appendChild(autoSplitInitialPromptLabel);
    content.appendChild(autoSplitInitialPromptHelper);
    content.appendChild(autoSplitInitialPromptText);
    content.appendChild(autoSplitChunkPromptLabel);
    content.appendChild(autoSplitChunkPromptHelper);
    content.appendChild(autoSplitChunkPromptText);
  });
  return content;
}
function toggleAutoSummarizerSwitch(isChecked) {
  // if autoSplit is off, check autoSummarize and turn it off if it's on
  if (!isChecked) {
    const autoSummarizeSwitch = document.querySelector('#switch-auto-summarize');
    if (autoSummarizeSwitch.checked) {
      autoSummarizeSwitch.checked = false;
      chrome.storage.local.get('settings', ({ settings }) => {
        chrome.storage.local.set({ settings: { ...settings, autoSummarize: false } });
      });
    }
  }
}
function updateAutoSplitPrompt(autoSummarize) {
  const autoSplitChunkPrompt = `Reply with OK: [CHUNK x/TOTAL]
Don't reply with anything else!`;
  const autoSplitChunkPromptSummarize = `Reply with OK: [CHUNK x/TOTAL]
Summary: A short summary of the last chunk. Keep important facts and names in the summary. Don't reply with anything else!`;
  chrome.storage.local.get('settings', ({ settings }) => {
    chrome.storage.local.set({ settings: { ...settings, autoSplitChunkPrompt: autoSummarize ? autoSplitChunkPromptSummarize : autoSplitChunkPrompt } }, () => {
      const autoSplitInitialPromptText = document.querySelector('#split-chunk-prompt-textarea');
      autoSplitInitialPromptText.value = autoSummarize ? autoSplitChunkPromptSummarize : autoSplitChunkPrompt;
    });
  });
}
function newsletterTabContent(hasSubscription = false) {
  const content = document.createElement('div');
  content.id = 'settings-modal-tab-content';
  content.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;';
  // daily newsletter
  const dailyNewsletterSwitch = createSwitch('Hide Daily Newsletter', 'Do not show the daily newsletter popup inside ChatGPT.', 'hideNewsletter', false);
  content.appendChild(dailyNewsletterSwitch);

  // daily newsletter
  const showNewsletterOnUpdateSwitch = createSwitch('Show Newsletter on Update', 'Open Superpower Daily newsletter when extension updates', 'showNewsletterOnUpdate', !hasSubscription, null, ['⚡️ Requires Pro Account'], !hasSubscription);
  content.appendChild(showNewsletterOnUpdateSwitch);

  return content;
}

function createSwitch(title, subtitle, settingsKey, defaultValue, callback = null, tags = [], disabled = false) {
  const switchWrapper = document.createElement('div');
  switchWrapper.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start; width: 100%; margin: 8px 0;';
  const switchElement = document.createElement('div');
  switchElement.style = 'display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0;color:white;';
  switchElement.innerHTML = title;
  const label = document.createElement('label');
  label.classList = 'switch';
  label.style.opacity = disabled ? '0.5' : '1';
  const input = document.createElement('input');
  input.id = `switch-${title.toLowerCase().replaceAll(' ', '-')}`;
  input.type = 'checkbox';
  input.disabled = disabled;
  const betaTagWrapper = document.createElement('div');
  tags.forEach((tag) => {
    const betaTag = document.createElement('span');
    betaTag.style = `${tag === '⚡️ Requires Pro Account' ? 'background-color: #19c37d; color: black;' : 'background-color: #ff9800; color: black;'}  padding: 2px 4px; border-radius: 8px; font-size: 0.7em;margin-right:8px;`;
    betaTag.textContent = tag;
    if (tag === '⚡️ Requires Pro Account') {
      betaTag.role = 'button';
      betaTag.addEventListener('click', () => {
        document.querySelector('#upgrade-to-pro-button-settings').click();
      });
    }
    betaTagWrapper.appendChild(betaTag);
  });
  const helper = document.createElement('div');
  helper.style = 'font-size: 12px; color: #999;';
  helper.innerHTML = subtitle;
  if (settingsKey) {
    chrome.storage.local.get('settings', ({ settings }) => {
      const settingValue = settings[settingsKey];
      if (settingValue === undefined && defaultValue !== undefined) {
        settings[settingsKey] = defaultValue;
        chrome.storage.local.set(settings);
      } else {
        input.checked = settingValue;
      }
    });
    input.addEventListener('change', () => {
      chrome.storage.local.get('settings', ({ settings }) => {
        settings[settingsKey] = input.checked;
        chrome.storage.local.set({ settings }, () => {
          if (callback) {
            callback(input.checked);
          }
        });
      });
    });
  } else {
    input.checked = defaultValue;
    input.addEventListener('change', () => {
      if (callback) {
        callback(input.checked);
      }
    });
  }
  const slider = document.createElement('span');
  slider.classList = 'slider round';

  label.appendChild(input);
  label.appendChild(slider);
  switchElement.appendChild(label);
  if (tags.length > 0) switchElement.appendChild(betaTagWrapper);
  switchWrapper.appendChild(switchElement);
  switchWrapper.appendChild(helper);
  return switchWrapper;
}
function refreshPage() {
  window.location.reload();
}
// function safeModeTrigger(safeMode) {
//   chrome.runtime.sendMessage({ type: 'safeMode', safeMode });
// }
function settingsModalActions() {
  // add actionbar at the bottom of the content
  const actionBar = document.createElement('div');
  actionBar.style = 'display: flex; flex-direction: row; justify-content: start; align-items: end; margin-top: 8px;width:100%;';
  const logo = document.createElement('img');
  logo.src = chrome.runtime.getURL('icons/logo.png');
  logo.style = 'width: 40px; height: 40px;';

  actionBar.appendChild(logo);
  const textWrapper = document.createElement('div');
  textWrapper.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start; margin-left: 8px;';
  // powere by
  const poweredBy = document.createElement('div');
  poweredBy.textContent = 'Powered by';
  poweredBy.style = 'color: #999; font-size: 12px;';
  const superpowerChatGPT = document.createElement('a');
  superpowerChatGPT.href = 'https://chrome.google.com/webstore/detail/superpower-chatgpt/amhmeenmapldpjdedekalnfifgnpfnkc';
  superpowerChatGPT.target = '_blank';
  superpowerChatGPT.textContent = 'Superpower ChatGPT';
  superpowerChatGPT.style = 'color: #999; font-size: 12px; margin-left: 4px; text-decoration: underline;';
  superpowerChatGPT.addEventListener('mouseover', () => {
    superpowerChatGPT.style = 'color: gold; font-size: 12px; margin-left: 4px;text-decoration: underline;';
  });
  superpowerChatGPT.addEventListener('mouseout', () => {
    superpowerChatGPT.style = 'color: #999; font-size: 12px; margin-left: 4px;text-decoration: underline;';
  });
  poweredBy.appendChild(superpowerChatGPT);
  const versionNumber = document.createElement('span');
  const { version } = chrome.runtime.getManifest();
  versionNumber.textContent = `(v ${version}`;
  versionNumber.style = 'color: #999; font-size: 12px; margin-left: 4px;';
  poweredBy.appendChild(versionNumber);
  const releaseNote = document.createElement('span');
  releaseNote.textContent = 'Release Note)';
  releaseNote.style = 'color: #999; font-size: 12px; margin-left: 4px; text-decoration: underline; cursor: pointer;';
  releaseNote.addEventListener('mouseover', () => {
    releaseNote.style = 'color: gold; font-size: 12px; margin-left: 4px;text-decoration: underline; cursor: pointer;';
  });
  releaseNote.addEventListener('mouseout', () => {
    releaseNote.style = 'color: #999; font-size: 12px; margin-left: 4px;text-decoration: underline; cursor: pointer;';
  });
  releaseNote.addEventListener('click', () => {
    // click on close settings modal close button
    document.querySelector('button[id^=modal-close-button-release-note]')?.click();
    createReleaseNoteModal(version);
  });
  poweredBy.appendChild(releaseNote);
  textWrapper.appendChild(poweredBy);
  // made by
  const madeBy = document.createElement('div');
  madeBy.textContent = 'Made by';
  madeBy.style = 'color: #999; font-size: 12px;';
  const madeByLink = document.createElement('a');
  madeByLink.href = 'https://twitter.com/eeeziii';
  madeByLink.target = '_blank';
  madeByLink.textContent = 'Saeed Ezzati';
  madeByLink.style = 'color: #999; font-size: 12px; margin-left: 4px; text-decoration: underline;';
  madeByLink.addEventListener('mouseover', () => {
    madeByLink.style = 'color: gold; font-size: 12px; margin-left: 4px;text-decoration: underline;';
  });
  madeByLink.addEventListener('mouseout', () => {
    madeByLink.style = 'color: #999; font-size: 12px; margin-left: 4px;text-decoration: underline;';
  });
  // support
  const support = document.createElement('span');
  support.textContent = ' - ';
  support.style = 'color: #999; font-size: 12px;';
  const supportLink = document.createElement('a');
  supportLink.href = 'https://www.buymeacoffee.com/ezii';
  supportLink.target = '_blank';
  supportLink.textContent = '🍕 Buy me a pizza ➜';
  supportLink.style = 'color: #999; font-size: 12px; margin-left: 4px; text-decoration: underline;';
  supportLink.addEventListener('mouseover', () => {
    supportLink.style = 'color: gold; font-size: 12px; margin-left: 4px;text-decoration: underline;';
  });
  supportLink.addEventListener('mouseout', () => {
    supportLink.style = 'color: #999; font-size: 12px; margin-left: 4px;text-decoration: underline;';
  });
  madeBy.appendChild(madeByLink);
  support.appendChild(supportLink);
  madeBy.appendChild(madeByLink);
  madeBy.appendChild(support);

  textWrapper.appendChild(madeBy);
  actionBar.appendChild(textWrapper);
  const upgradeToPro = document.createElement('button');
  upgradeToPro.id = 'upgrade-to-pro-button-settings';
  upgradeToPro.classList = 'flex flex-wrap px-3 py-1 items-center rounded-md bg-gold hover:bg-gold-dark transition-colors duration-200 text-black cursor-pointer text-sm ml-auto font-bold';
  upgradeToPro.style.width = '230px';
  upgradeToPro.innerHTML = '<div class="flex w-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width:20px; height:20px; margin-right:6px;position:relative; top:10px;" stroke="purple" fill="purple"><path d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z"/></svg> Upgrade to Pro</div><div style="font-size:10px;font-weight:400;margin-left:28px;" class="flex w-full">Get GPT Store, Image Gallery, and more</div>';
  // make the button shake every 5 seconds

  chrome.runtime.sendMessage({
    checkHasSubscription: true,
    detail: {
      forceRefresh: false,
    },
  }, (hasSubscription) => {
    if (hasSubscription) {
      upgradeToPro.classList = 'flex px-3 py-3 items-center rounded-md bg-gold hover:bg-gold-dark transition-colors duration-200 text-black cursor-pointer text-sm ml-auto font-bold';
      upgradeToPro.style.width = 'auto';
      upgradeToPro.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width:20px; height:20px;margin-right:6px;" stroke="purple" fill="purple"><path d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z"/></svg> Pro account';
    } else {
      setInterval(() => {
        upgradeToPro.classList.add('animate-shake');
        setTimeout(() => {
          upgradeToPro.classList.remove('animate-shake');
        }, 1000);
      }, 7000);
    }
    upgradeToPro.addEventListener('click', () => {
      openUpgradeModal(hasSubscription);
    });
    actionBar.appendChild(upgradeToPro);
  });
  return actionBar;
}
function addSettingsButton() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // check if the setting button is already added
  if (document.querySelector('#settings-button')) return;
  // create the setting button by copying the nav button
  const settingsButton = document.createElement('a');
  settingsButton.classList = 'flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm';
  settingsButton.textContent = 'Settings';
  settingsButton.title = 'CMD/CTRL + SHIFT + S';

  const settingsButtonIcon = document.createElement('img');
  settingsButtonIcon.style = 'width: 16px; height: 16px;';
  settingsButtonIcon.src = chrome.runtime.getURL('icons/settings.png');
  settingsButton.id = 'settings-button';
  settingsButton.prepend(settingsButtonIcon);
  settingsButton.style = `${settingsButton.style.cssText}; width: 100%;`;
  // Add click event listener to setting button
  settingsButton.addEventListener('click', () => {
    // open the setting modal
    createSettingsModal();
  });
  const userMenu = nav.querySelector('#user-menu');
  userMenu.prepend(settingsButton);
}
// eslint-disable-next-line no-unused-vars
function initializeSettings() {
  // get dark mode from html tag class="dark"
  // create setting storage
  chrome.runtime.sendMessage({
    checkHasSubscription: true,
    detail: {
      forceRefresh: true,
    },
  }, (hasSubscription) => {
    initializeUpgradeButton(hasSubscription);

    chrome.storage.local.get(['settings', 'presetPrompts', 'selectedConversations', 'customPrompts', 'customInstructionProfiles'], (result) => {
      let newCustomPrompts = Array.isArray(result.customPrompts)
        ? result.customPrompts
        : [
          ...(result.presetPrompts ? Object.keys(result.presetPrompts).map((key) => ({ title: key, text: result.presetPrompts[key], isDefault: false })) : []),
          ...(result.customPrompts ? Object.keys(result.customPrompts).map((key) => ({ title: key, text: result.customPrompts[key], isDefault: false })) : []),
        ];
      if (newCustomPrompts.length === 0) {
        newCustomPrompts = defaultPrompts;
      }
      const hasDefault = newCustomPrompts.find((prompt) => prompt.isDefault);
      if (!hasDefault) {
        newCustomPrompts[0].isDefault = true;
      }
      chrome.storage.local.set({
        settings: {
          ...result.settings,
          autoScroll: result.settings?.autoScroll !== undefined ? result.settings.autoScroll : true,
          autoSync: result.settings?.autoSync !== undefined ? result.settings.autoSync : true,
          autoRefreshAfterSync: result.settings?.autoRefreshAfterSync !== undefined ? result.settings.autoRefreshAfterSync : true,
          safeMode: result.settings?.safeMode !== undefined ? result.settings.safeMode : true,
          promptHistory: result.settings?.promptHistory !== undefined ? result.settings.promptHistory : true,
          copyMode: result.settings?.copyMode !== undefined ? result.settings.copyMode : false,
          autoResetTopNav: result.settings?.autoResetTopNav !== undefined ? result.settings.autoResetTopNav : false,
          hideBottomSidebar: result.settings?.hideBottomSidebar !== undefined ? result.settings.hideBottomSidebar : false,
          showExamplePrompts: result.settings?.showExamplePrompts !== undefined ? result.settings.showExamplePrompts : true,
          showMessageTimestamp: result.settings?.showMessageTimestamp !== undefined ? result.settings.showMessageTimestamp : false,
          showCustomPromptsButton: result.settings?.showCustomPromptsButton !== undefined ? result.settings.showCustomPromptsButton : true,
          pluginDefaultOpen: result.settings?.pluginDefaultOpen !== undefined ? result.settings.pluginDefaultOpen : false,
          showWordCount: result.settings?.showWordCount !== undefined ? result.settings.showWordCount : true,
          hideNewsletter: result.settings?.hideNewsletter !== undefined ? result.settings.hideNewsletter : false,
          hideReleaseNote: result.settings?.hideReleaseNote !== undefined ? result.settings.hideReleaseNote : false,
          showNewsletterOnUpdate: result.settings?.showNewsletterOnUpdate !== undefined ? result.settings.showNewsletterOnUpdate : !hasSubscription,
          chatEndedSound: result.settings?.chatEndedSound !== undefined ? result.settings.chatEndedSound : false,
          autoColorFolders: result.settings?.autoColorFolders !== undefined ? result.settings.autoColorFolders : false,
          customGPTAutoFolder: result.settings?.customGPTAutoFolder !== undefined ? result.settings.customGPTAutoFolder : false,
          customInstruction: result.settings?.customInstruction !== undefined ? result.settings.customInstruction : '',
          useCustomInstruction: result.settings?.useCustomInstruction !== undefined ? result.settings.useCustomInstruction : false,
          customConversationWidth: result.settings?.customConversationWidth !== undefined ? result.settings.customConversationWidth : false,
          conversationWidth: result.settings?.conversationWidth !== undefined ? result.settings.conversationWidth : 50,
          autoHideThreadCount: result.settings?.autoHideThreadCount !== undefined ? result.settings.autoHideThreadCount : true,
          autoDeleteOldChats: result.settings?.autoDeleteOldChats !== undefined ? result.settings.autoDeleteOldChats : false,
          autoDeleteMode: result.settings?.autoDeleteMode !== undefined ? result.settings.autoDeleteMode : autoDeleteModes[0],
          autoDeleteThreshold: result.settings?.autoDeleteThreshold !== undefined ? result.settings.autoDeleteThreshold : 7,
          saveHistory: result.settings?.saveHistory !== undefined ? result.settings.saveHistory : true,
          promptTemplate: result.settings?.promptTemplate !== undefined ? result.settings.promptTemplate : true,
          emailNewsletter: result.settings?.emailNewsletter !== undefined ? result.settings.emailNewsletter : false,
          autoClick: result.settings?.autoClick !== undefined ? result.settings.autoClick : false,
          showGpt4Counter: result.settings?.showGpt4Counter !== undefined ? result.settings.showGpt4Counter : true,
          autoSummarize: result.settings?.autoSummarize !== undefined ? result.settings.autoSummarize : false,
          autoSplit: result.settings?.autoSplit !== undefined ? result.settings.autoSplit : true,
          autoSplitLimit: result.settings?.autoSplitLimit !== undefined ? result.settings.autoSplitLimit : 24000,
          autoSplitInitialPrompt: result.settings?.autoSplitInitialPrompt !== undefined ? result.settings?.autoSplitInitialPrompt : `Act like a document/text loader until you load and remember the content of the next text/s or document/s.
There might be multiple files, each file is marked by name in the format ### DOCUMENT NAME.
I will send them to you in chunks. Each chunk starts will be noted as [START CHUNK x/TOTAL], and the end of this chunk will be noted as [END CHUNK x/TOTAL], where x is the number of current chunks, and TOTAL is the number of all chunks I will send you.
I will split the message in chunks, and send them to you one by one. For each message follow the instructions at the end of the message.
Let's begin:

`,
          autoSplitChunkPrompt: result.settings?.autoSplitChunkPrompt !== undefined ? result.settings?.autoSplitChunkPrompt : `Reply with OK: [CHUNK x/TOTAL]
Don't reply with anything else!`,
          showFolderCounts: result.settings?.showFolderCounts !== undefined ? result.settings.showFolderCounts : true,
          autoHideTopNav: result.settings?.autoHideTopNav !== undefined ? result.settings.autoHideTopNav : false,
          navOpen: result.settings?.navOpen !== undefined ? result.settings.navOpen : true,
          showPinNav: result.settings?.showPinNav !== undefined ? result.settings.showPinNav : true,
          selectedLanguage: result.settings?.selectedLanguage || languageList.find((language) => language.code === 'default'),
          selectedTone: result.settings?.selectedTone || toneList.find((tone) => tone.code === 'default'),
          selectedWritingStyle: result.settings?.selectedWritingStyle || writingStyleList.find((writingStyle) => writingStyle.code === 'default'),
          exportMode: result.settings?.exportMode || 'both',
          historyFilter: result.settings?.historyFilter || 'favorites',
          selectedLibrarySortBy: result.settings?.selectedLibrarySortBy || { name: 'New', code: 'recent' },
          selectedLibraryCategory: result.settings?.selectedLibraryCategory || { name: 'All', code: 'all' },
          selectedLibraryLanguage: result.settings?.selectedLibraryLanguage || { name: 'All', code: 'all' },
          selectedPromptLanguage: result.settings?.selectedPromptLanguage || { name: 'Select', code: 'select' },
        },
        presetPrompts: {},
        customInstructionProfiles: result.customInstructionProfiles !== undefined ? result.customInstructionProfiles : [],
        customPrompts: newCustomPrompts,
      }, () => addSettingsButton());
    });
  });
}
