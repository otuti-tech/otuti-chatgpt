/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-unused-vars
/* global isFirefox, arkoseTrigger, addArkoseCallback, TurndownService, generateInstructions, generateChat, generateChatWS, formatDate, loadConversation, resetSelection, initializeAutoArchive, ChatGPTIcon, rowUser, rowAssistant, updateOrCreateConversation, sharedWebsocket, isGenerating:true, generateTitle, debounce, replaceTextAreaElement, showNewChatPage, chatStreamIsClosed:true, addScrollDetector, scrolUpDetected:true, Sortable, updateInputCounter, addUserPromptToHistory, getGPT4CounterMessageCapWindow, createFolder, getConversationElementClassList, notSelectedClassList, selectedClassList, conversationActions, addCheckboxToConversationElement, createConversation, deleteConversation, handleQueryParams, addScrollButtons, updateTotalCounter, isWindows, createTemplateWordsModal, initializePromptChain, initializeUpgradeButton, insertNextChain, runningPromptChainSteps:true, runningPromptChainStepIndex:true, lastPromptSuggestions, playSound, toast, curImageAssets:true, curFileAttachments:true, addConversationsEventListeners, addFinalCompletionClassToLastMessageWrapper, addMessagePluginToggleButtonsEventListeners, addNodeToRowAssistant, showDefaultFolderActions, updateLastMessagePluginDropdown, textAreaElementOldValue:true, conversationSettingsMenu, toggleKeepFoldersAtTheTop, addConversationSettingsMenuEventListener, addCustomInstructionInfoIconEventListener, getGizmoById, updateGPTEditIcon, renderGizmoDiscoveryPage, initializeCustomSelectionMenu,getGizmoIdFromUrl, renderGPTList, getMousePosition, updateGizmoSidebar, formatTime, replaceAllConfimationWrappersWithActionStopped, initializeGallery, resetFolders, generateRandomDarkColor, unarchiveConversationById, closeMenus, animateFavicon, stopAnimateFavicon, updateCounter, chatRequirementsIsPending, createSettingsModal, addMissingGizmoNamesAndAvatars, registerWebsocket, thinkingRowAssistant, removeThinkingRowAssistant, stopConversationWS */

// Initial state
let userChatIsActuallySaved = false;
let chunkNumber = 1;
let totalChunks = 1;
let remainingText = '';
let finalSummary = '';
let shouldSubmitFinalSummary = false;
let lastScrollToBottomTimestamp = 0;
function replaceOriginalConversationList() {
  const navGap = document.querySelector('#nav-gap');
  if (!navGap) return;
  navGap.style = `${navGap.style.cssText};display:flex;margin-right:-8px;`;
  const conversationList = navGap.querySelector('#conversation-list');
  if (!conversationList) return;
  conversationList.innerHTML = '';
  // add newConversationList to navGap before navGap's last child
  // eslint-disable-next-line no-unused-vars
  const sortable = Sortable.create(conversationList, {
    // multiDrag: true,
    // selectedClass: 'multi-drag-selected',
    // handle: '[id^="checkbox-wrapper-"], [id^="conversation-button-"], [id^="wrapper-folder-"]',
    group: {
      name: 'conversation-list',
      pull: true,
      put: true,
    },
    direction: 'vertical',
    invertSwap: true,
    draggable: isFirefox ? '[id^="conversation-button-"], [id^="wrapper-folder-"]' : '[id^="conversation-button-"]:not(:has([id^=conversation-rename-])), [id^="wrapper-folder-"]:not(:has([id^=rename-folder-])):not(:has([id^=conversation-rename-]))',
    // the above selector is to prevent dragging the rename input, but can also cause an issue if trying to drag a file into a folder while the rename input is open(the folder will not be counted, and the index  will be wrong)
    onEnd: (event) => {
      const {
        item, to, oldDraggableIndex, newDraggableIndex,
      } = event;
      const isFolder = item.id.startsWith('wrapper-folder-');
      const isToFolder = to.id.startsWith('folder-content-');

      const fromId = 'conversation-list';
      const toId = isToFolder ? to.id.split('folder-content-')[1] : 'conversation-list';
      if (oldDraggableIndex === newDraggableIndex && toId === fromId) return;

      chrome.storage.local.get(['conversationsOrder'], (result) => {
        const { conversationsOrder } = result;
        const movingItem = conversationsOrder[oldDraggableIndex];
        if (isToFolder) {
          const emptyFolder = document.querySelector(`#empty-folder-${toId}`);
          if (emptyFolder) emptyFolder.remove();
          const toFolderIndex = conversationsOrder.findIndex((c) => c?.id === toId);
          const toFolder = conversationsOrder[toFolderIndex];
          if (!isFolder && toFolder && typeof movingItem === 'string') {
            toFolder.conversationIds.splice(newDraggableIndex, 0, movingItem);
            // add to folder
            conversationsOrder.splice(toFolderIndex, 1, toFolder);
            // then remove from conversation list
            conversationsOrder.splice(oldDraggableIndex, 1);
            chrome.storage.local.set({ conversationsOrder });
          }
        } else {
          // move movingItem from oldDraggableIndex to newDraggableIndex
          conversationsOrder.splice(newDraggableIndex, 0, conversationsOrder.splice(oldDraggableIndex, 1)[0]);
          chrome.storage.local.set({ conversationsOrder }, () => {
            const folderCount = Array.from(document.querySelectorAll('#conversation-list > [id^=wrapper-folder-]')).length;
            let newIndex = newDraggableIndex;
            if (isFolder) {
              newIndex = Math.min(newDraggableIndex, folderCount - 1);
            } else {
              newIndex = Math.max(newDraggableIndex, folderCount);
            }
            if (newIndex !== newDraggableIndex) {
              toggleKeepFoldersAtTheTop(true);
            }
          });
        }
      });
    },
    onMove: (event) => {
      const { dragged, related } = event;
      const isFolder = dragged.id.startsWith('wrapper-folder-');
      const isToFolder = related.id.startsWith('wrapper-folder');
      const curFolderContent = document.querySelector(`#folder-content-${related.id.split('wrapper-folder-')[1]}`);
      const folderIsClosed = curFolderContent?.style.display === 'none';
      const shiftKeyIsDown = event.originalEvent.shiftKey;
      if (!isFolder && isToFolder && folderIsClosed && shiftKeyIsDown) {
        related.click();
      }
      return true;
    },
  });
}

function createSearchBox() {
  const existingSearchBoxWrapper = document.querySelector('#conversation-search-wrapper');
  if (existingSearchBoxWrapper) existingSearchBoxWrapper.remove();
  const conversationList = document.querySelector('#conversation-list');
  const searchBoxWrapper = document.createElement('div');
  searchBoxWrapper.id = 'conversation-search-wrapper';
  searchBoxWrapper.classList = 'flex items-center justify-center';
  const searchbox = document.createElement('input');
  searchbox.type = 'search';
  searchbox.id = 'conversation-search';
  searchbox.tabIndex = 0;
  searchbox.placeholder = 'Search conversations';
  searchbox.classList = 'w-full px-4 py-2 mr-2 border border-token-border-light rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-token-sidebar-surface-secondary text-token-text-primary';
  searchbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      const focusedConversation = document.querySelector('.selected');
      if (focusedConversation) {
        const nextConversation = focusedConversation.nextElementSibling;
        if (nextConversation) {
          nextConversation.click();
          nextConversation.scrollIntoView({ block: 'center' });
        }
      }
    }
    if (event.key === 'ArrowUp') {
      const focusedConversation = document.querySelector('.selected');
      if (focusedConversation) {
        const previousConversation = focusedConversation.previousElementSibling;
        if (previousConversation) {
          previousConversation.click();
          previousConversation.scrollIntoView({ block: 'center' });
        }
      }
    }
  });
  searchbox.addEventListener('input', (event) => {
    const searchValue = event.target.value;
    if (searchValue.length === 1) {
      // open all folders
      const allFolders = document.querySelectorAll('[id^=wrapper-folder-]');
      allFolders.forEach((f) => {
        const folderId = f.id.split('wrapper-folder-')[1];
        const folderContent = document.querySelector(`#folder-content-${folderId}`);
        if (folderContent) folderContent.style.display = 'block';
        const folderIcon = document.querySelector(`#folder-icon-${folderId}`);
        if (folderIcon) {
          folderIcon.src = chrome.runtime.getURL('icons/folder-open.png');
          folderIcon.dataset.isOpen = 'true';
        }
        const actionsWrapper = document.querySelector(`#folder-actions-wrapper-${folderId}`);
        if (actionsWrapper.querySelector('button')) {
          actionsWrapper.querySelector('button').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" stroke-width="2"><path d="M432.6 209.3l-191.1 183.1C235.1 397.8 229.1 400 224 400s-11.97-2.219-16.59-6.688L15.41 209.3C5.814 200.2 5.502 184.1 14.69 175.4c9.125-9.625 24.38-9.938 33.91-.7187L224 342.8l175.4-168c9.5-9.219 24.78-8.906 33.91 .7187C442.5 184.1 442.2 200.2 432.6 209.3z"/></svg>';
        }
      });
    } else if (searchValue.length === 0) {
      // close all folders
      const allFolders = document.querySelectorAll('[id^=wrapper-folder-]');
      allFolders.forEach((f) => {
        const folderId = f.id.split('wrapper-folder-')[1];
        const folderContent = document.querySelector(`#folder-content-${folderId}`);
        if (folderContent) folderContent.style.display = 'none';
        const folderIcon = document.querySelector(`#folder-icon-${folderId}`);
        if (folderIcon) {
          folderIcon.src = chrome.runtime.getURL('icons/folder.png');
          folderIcon.dataset.isOpen = 'false';
        }
        const actionsWrapper = document.querySelector(`#folder-actions-wrapper-${folderId}`);
        if (actionsWrapper.querySelector('button')) {
          actionsWrapper.querySelector('button').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" stroke-width="2"><path d="M113.3 47.41l183.1 191.1c4.469 4.625 6.688 10.62 6.688 16.59s-2.219 11.97-6.688 16.59l-183.1 191.1c-9.152 9.594-24.34 9.906-33.9 .7187c-9.625-9.125-9.938-24.38-.7187-33.91l168-175.4L78.71 80.6c-9.219-9.5-8.906-24.78 .7187-33.91C88.99 37.5 104.2 37.82 113.3 47.41z"/></svg>';
        }
      });
    }
  });
  searchbox.addEventListener('input', debounce((event) => {
    const searchValue = event.target.value;
    chrome.storage.local.get(['conversations'], (result) => {
      const { conversations } = result;

      const allConversations = Object.values(conversations) || [];
      // sort by update_time. if update time is force_copy, show at the top
      let filteredConversations = allConversations.sort((a, b) => {
        if (a?.update_time === 'force_copy') return -1;
        if (b?.update_time === 'force_copy') return 1;
        return b.update_time - a.update_time;
      });
      let filteredConversationIds = filteredConversations.map((c) => c?.id);
      // load-more-conversations-button
      const loadMoreButton = document.querySelector('#load-more-conversations-button');
      resetSelection();
      if (searchValue.length) {
        filteredConversations = allConversations?.filter((c) => (
          [c.title, ...Object.values(c.mapping).map((m) => (m?.message?.content?.parts || [])?.filter((p) => typeof p === 'string')?.join(' ')?.replace(/## Instruções[\s\S]*## Final Instruções\n\n/, ''))]
            .join(' ')?.toLowerCase()
            .includes(searchValue.toLowerCase())));
        filteredConversationIds = filteredConversations.map((c) => c?.id);
        if (loadMoreButton) loadMoreButton.style.display = 'none';
      } else {
        if (loadMoreButton) loadMoreButton.style.display = 'block';
      }
      loadFilteredConversations(filteredConversationIds);
    });
  }, 200));

  const newFolderButton = document.createElement('button');
  newFolderButton.id = 'new-folder-button';
  newFolderButton.classList = 'w-12 h-full flex items-center justify-center rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-token-main-surface-tertiary hover:bg-token-main-surface-secondary border border-token-border-light';
  const newFoolderIcon = document.createElement('img');
  newFoolderIcon.classList = 'w-5 h-5';
  newFoolderIcon.src = chrome.runtime.getURL('icons/new-folder.png');
  newFolderButton.append(newFoolderIcon);

  newFolderButton.addEventListener('click', (e) => {
    // inser a new folder at the top of the list
    // if cmnd + shift
    if (e.shiftKey && (e.metaKey || (isWindows() && e.ctrlKey))) {
      resetFolders();
      return;
    }
    chrome.storage.local.get(['conversationsOrder', 'settings'], (result) => {
      const { conversationsOrder, settings } = result;
      const newFolder = {
        id: self.crypto.randomUUID(),
        name: 'Nova Pasta',
        conversationIds: [],
        isOpen: true,
        color: settings.autoColorFolders ? generateRandomDarkColor() : '#40414f',
      };
      chrome.storage.local.set({ conversationsOrder: [newFolder, ...conversationsOrder] }, () => {
        const newFolderElement = createFolder(newFolder, [], true);
        const curConversationList = document.querySelector('#conversation-list');
        curConversationList.insertBefore(newFolderElement, searchBoxWrapper.nextSibling);
        curConversationList.scrollTop = 0;
      });
    });
  });
  searchBoxWrapper.append(newFolderButton);
  // add conversation search box to the top of the list
  searchBoxWrapper.prepend(searchbox);
  conversationList?.prepend(searchBoxWrapper);
}
function addHistorySyncingMessage() {
  const conversationList = document.querySelector('#conversation-list');
  const historySyncMessage = document.createElement('div');
  historySyncMessage.id = 'history-sync-message';
  historySyncMessage.classList = 'flex items-center justify-center w-full my-4 text-sm text-token-text-secondary';
  historySyncMessage.innerHTML = 'Sincronizando conversas...';
  conversationList?.append(historySyncMessage);
}
// eslint-disable-next-line no-unused-vars
function showSidebarGizmoMenu(event, gizmoId) {
  getGizmoById(gizmoId).then((gizmoData) => {
    const { x, y } = getMousePosition(event);
    const translateX = x + 4;
    const translateY = y + 4;

    const menu = `<div id="sidebar-gizmo-menu" data-radix-popper-content-wrapper="" dir="ltr" style="position: fixed; left: 0px; top: 0px; transform: translate3d(${translateX}px, ${translateY}px, 0px); min-width: max-content; z-index: auto; --radix-popper-anchor-width: 20px; --radix-popper-anchor-height: 20px; --radix-popper-available-width: 1173px; --radix-popper-available-height: 825px; --radix-popper-transform-origin: 0% 0px;"><div data-side="bottom" data-align="start" role="menu" aria-orientation="vertical" data-state="open" data-radix-menu-content="" dir="ltr" id="radix-:r25:" aria-labelledby="radix-:r24:" class="mt-2 min-w-[100px] max-w-xs rounded-lg border border-gray-100 bg-token-main-surface-primary py-1.5 shadow-lg dark:border-gray-700" tabindex="-1" data-orientation="vertical" style="outline: none; --radix-dropdown-menu-content-transform-origin: var(--radix-popper-transform-origin); --radix-dropdown-menu-content-available-width: var(--radix-popper-available-width); --radix-dropdown-menu-content-available-height: var(--radix-popper-available-height); --radix-dropdown-menu-trigger-width: var(--radix-popper-anchor-width); --radix-dropdown-menu-trigger-height: var(--radix-popper-anchor-height); pointer-events: auto;">${gizmoData?.flair?.kind !== 'sidebar_keep' ? '<div id="sidebar-gizmo-menu-option-keep-in-sidebar" role="menuitem" class="flex gap-2 m-1.5 rounded px-5 py-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">Keep in sidebar</div>' : ''}<div id="sidebar-gizmo-menu-option-hide-from-sidebar" role="menuitem" class="flex gap-2 m-1.5 rounded px-5 py-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">Hide from sidebar</div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', menu);
    // add event listeners to menu options
    const keepInSidebarOption = document.querySelector('#sidebar-gizmo-menu-option-keep-in-sidebar');
    keepInSidebarOption?.addEventListener('click', () => {
      updateGizmoSidebar(gizmoData?.resource?.gizmo?.id, 'keep');
      chrome.runtime.sendMessage({
        updateGizmoMetrics: true,
        detail: {
          gizmoId: gizmoData?.resource?.gizmo?.id,
          metricName: 'num_pins',
          direction: 'up',
        },
      });
    });

    const hideFromSidebarOption = document.querySelector('#sidebar-gizmo-menu-option-hide-from-sidebar');
    hideFromSidebarOption.addEventListener('click', () => {
      updateGizmoSidebar(gizmoData?.resource?.gizmo?.id, 'hide');
      chrome.runtime.sendMessage({
        updateGizmoMetrics: true,
        detail: {
          gizmoId: gizmoData?.resource?.gizmo?.id,
          metricName: 'num_pins',
          direction: 'down',
        },
      });
    });
  });
}
function addToOrCreateCustomGPTFolder(conversation, settings) {
  const conversationList = document.querySelector('#conversation-list');
  const searchBoxWrapper = document.querySelector('#conversation-search-wrapper');
  const conversationElement = createConversation(conversation);
  const gizmoId = conversation.gizmo_id;
  const existingFolderContent = conversationList.querySelector(`#folder-content-${gizmoId}`);
  if (existingFolderContent) {
    // insert conversationElement after the last folder
    existingFolderContent.insertBefore(conversationElement, existingFolderContent.firstChild);
    chrome.storage.local.get(['conversationsOrder'], (result) => {
      const { conversationsOrder } = result;
      const folderIndex = conversationsOrder.findIndex((c) => c?.id === gizmoId);
      const folder = conversationsOrder[folderIndex];
      folder.conversationIds.splice(0, 0, conversation.id);
      conversationsOrder.splice(folderIndex, 1, folder);
      chrome.storage.local.set({ conversationsOrder });
    });
  } else {
    getGizmoById(gizmoId).then((gizmoData) => {
      const newFolder = {
        id: gizmoId,
        name: gizmoData?.resource?.gizmo?.display?.name,
        conversationIds: [conversation.id],
        isOpen: true,
        color: settings.autoColorFolders ? generateRandomDarkColor() : '#40414f',
      };
      const newFolderElement = createFolder(newFolder, { [conversation.id]: conversation });
      conversationList.insertBefore(newFolderElement, searchBoxWrapper.nextSibling);
      chrome.storage.local.get(['conversationsOrder'], (result) => {
        const { conversationsOrder } = result;
        conversationsOrder.splice(0, 0, newFolder);
        chrome.storage.local.set({ conversationsOrder });
      });
    });
  }
  // scroll conversation element into view
  conversationElement?.scrollIntoView({ block: 'center' });
}
// eslint-disable-next-line no-unused-vars
function generateTitleForConversation(conversationId, messageId, profile) {
  setTimeout(() => {
    generateTitle(conversationId, messageId).then((data) => {
      const { title } = data;
      if (!title) return;
      chrome.storage.local.get('conversations', (result) => {
        const { conversations } = result;
        conversations[conversationId].title = title;
        chrome.storage.local.set({ conversations });
      });
      document.title = title;
      const conversationElement = document.querySelector(`#conversation-button-${conversationId}`);
      if (!conversationElement) return;
      conversationElement.classList.add('animate-flash');
      const conversationTitle = conversationElement.querySelector(`#conversation-title-${conversationId}`);
      const topTitle = document.querySelector('#conversation-top-title');
      // animate writing title one character at a time
      conversationTitle.innerHTML = '';
      if (topTitle) topTitle.innerHTML = '';
      if (!title) return;
      title.split('').forEach((c, i) => {
        setTimeout(() => {
          conversationTitle.innerHTML += c;
          if (topTitle) topTitle.innerHTML += c;
          if (i === title.length - 1) {
            conversationElement.classList.remove('animate-flash');
          }
        }, i * 50);
      });
      // at the end, add custom instructions icon
      setTimeout(() => {
        if (topTitle && profile?.about_user_message) {
          topTitle.innerHTML += '<span id="custom-instruction-info-icon" style="display:flex;align-items:center;">&nbsp;&nbsp;<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" class="ml-0.5 mt-0.5 h-4 w-4 flex-shrink-0 text-token-text-primary sm:mb-0.5 sm:mt-0 sm:h-5 sm:w-5"><path d="M8.4375 8.4375L8.46825 8.4225C8.56442 8.37445 8.67235 8.35497 8.77925 8.36637C8.88615 8.37776 8.98755 8.41955 9.07143 8.48678C9.15532 8.55402 9.21818 8.64388 9.25257 8.74574C9.28697 8.8476 9.29145 8.95717 9.2655 9.0615L8.7345 11.1885C8.70836 11.2929 8.7127 11.4026 8.74702 11.5045C8.78133 11.6065 8.84418 11.6965 8.9281 11.7639C9.01202 11.8312 9.1135 11.8731 9.2205 11.8845C9.32749 11.8959 9.43551 11.8764 9.53175 11.8282L9.5625 11.8125M15.75 9C15.75 9.88642 15.5754 10.7642 15.2362 11.5831C14.897 12.4021 14.3998 13.1462 13.773 13.773C13.1462 14.3998 12.4021 14.897 11.5831 15.2362C10.7642 15.5754 9.88642 15.75 9 15.75C8.11358 15.75 7.23583 15.5754 6.41689 15.2362C5.59794 14.897 4.85382 14.3998 4.22703 13.773C3.60023 13.1462 3.10303 12.4021 2.76381 11.5831C2.42459 10.7642 2.25 9.88642 2.25 9C2.25 7.20979 2.96116 5.4929 4.22703 4.22703C5.4929 2.96116 7.20979 2.25 9 2.25C10.7902 2.25 12.5071 2.96116 13.773 4.22703C15.0388 5.4929 15.75 7.20979 15.75 9ZM9 6.1875H9.006V6.1935H9V6.1875Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
          addCustomInstructionInfoIconEventListener(conversationId, topTitle.querySelector('#custom-instruction-info-icon'));
        }
      }, title.length * 50);
    });
  }, 500);// a little delay to make sure gen title still works even if user stops the generation
}
function addToTheTopOfConversationList(conversation) {
  const conversationList = document.querySelector('#conversation-list');
  const searchBoxWrapper = document.querySelector('#conversation-search-wrapper');
  const conversationElement = createConversation(conversation);
  const folderElements = Array.from(conversationList.querySelectorAll('[id^=wrapper-folder-]'));
  if (folderElements.length > 0) {
    // insert conversationElement after the last folder
    conversationList.insertBefore(conversationElement, folderElements[folderElements.length - 1].nextSibling);
  } else {
    if (searchBoxWrapper) { // insert after search box wrapper
      searchBoxWrapper.insertAdjacentElement('afterend', conversationElement);
    } else {
      conversationList.prepend(conversationElement);
    }
  }
  chrome.storage.local.get(['conversationsOrder'], (result) => {
    const { conversationsOrder } = result;
    conversationsOrder.splice(folderElements.length, 0, conversation.id);
    chrome.storage.local.set({ conversationsOrder });
  });
  // scroll conversation element into view
  conversationElement?.scrollIntoView({ block: 'center' });
}
// eslint-disable-next-line no-unused-vars
function prependConversation(conversation, settings) {
  const historySyncMessage = document.querySelector('#history-sync-message');
  if (historySyncMessage) historySyncMessage.remove();
  addConversationSettingsMenuEventListener(conversation.id);
  const existingConversationElement = document.querySelector(`#conversation-button-${conversation.id}`);
  if (existingConversationElement) existingConversationElement.remove();

  if (settings.customGPTAutoFolder && conversation.gizmo_id) {
    addToOrCreateCustomGPTFolder(conversation, settings);
  } else {
    addToTheTopOfConversationList(conversation);
  }
}
// eslint-disable-next-line no-unused-vars
function updateConversationTitle(conversationId, title) {
  setTimeout(() => {
    chrome.storage.local.get('conversations', (result) => {
      const { conversations } = result;
      conversations[conversationId].title = title;
      chrome.storage.local.set({ conversations });

      const mapping = Object.values(conversations[conversationId].mapping);
      const allSystemMessages = mapping.filter((m) => m.message?.role === 'system' || m.message?.author?.role === 'system');
      const systemMessageWithCustomInstruction = allSystemMessages.find((node) => node?.message?.metadata?.user_context_message_data);
      const customInstrucionProfile = systemMessageWithCustomInstruction?.message?.metadata?.user_context_message_data || undefined;

      document.title = title;
      const conversationElement = document.querySelector(`#conversation-button-${conversationId}`);
      if (!conversationElement) return;
      conversationElement.classList.add('animate-flash');
      const conversationTitle = conversationElement.querySelector(`#conversation-title-${conversationId}`);
      const topTitle = document.querySelector('#conversation-top-title');
      // animate writing title one character at a time
      conversationTitle.innerHTML = '';
      if (topTitle) topTitle.innerHTML = '';
      if (!title) return;
      title.split('').forEach((c, i) => {
        setTimeout(() => {
          conversationTitle.innerHTML += c;
          if (topTitle) topTitle.innerHTML += c;
          if (i === title.length - 1) {
            conversationElement.classList.remove('animate-flash');
          }
        }, i * 50);
      });
      // at the end, add custom instructions icon
      setTimeout(() => {
        if (topTitle && customInstrucionProfile?.about_user_message) {
          topTitle.innerHTML += '<span id="custom-instruction-info-icon" style="display:flex;align-items:center;">&nbsp;&nbsp;<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" class="ml-0.5 mt-0.5 h-4 w-4 flex-shrink-0 text-token-text-primary sm:mb-0.5 sm:mt-0 sm:h-5 sm:w-5"><path d="M8.4375 8.4375L8.46825 8.4225C8.56442 8.37445 8.67235 8.35497 8.77925 8.36637C8.88615 8.37776 8.98755 8.41955 9.07143 8.48678C9.15532 8.55402 9.21818 8.64388 9.25257 8.74574C9.28697 8.8476 9.29145 8.95717 9.2655 9.0615L8.7345 11.1885C8.70836 11.2929 8.7127 11.4026 8.74702 11.5045C8.78133 11.6065 8.84418 11.6965 8.9281 11.7639C9.01202 11.8312 9.1135 11.8731 9.2205 11.8845C9.32749 11.8959 9.43551 11.8764 9.53175 11.8282L9.5625 11.8125M15.75 9C15.75 9.88642 15.5754 10.7642 15.2362 11.5831C14.897 12.4021 14.3998 13.1462 13.773 13.773C13.1462 14.3998 12.4021 14.897 11.5831 15.2362C10.7642 15.5754 9.88642 15.75 9 15.75C8.11358 15.75 7.23583 15.5754 6.41689 15.2362C5.59794 14.897 4.85382 14.3998 4.22703 13.773C3.60023 13.1462 3.10303 12.4021 2.76381 11.5831C2.42459 10.7642 2.25 9.88642 2.25 9C2.25 7.20979 2.96116 5.4929 4.22703 4.22703C5.4929 2.96116 7.20979 2.25 9 2.25C10.7902 2.25 12.5071 2.96116 13.773 4.22703C15.0388 5.4929 15.75 7.20979 15.75 9ZM9 6.1875H9.006V6.1935H9V6.1875Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
          addCustomInstructionInfoIconEventListener(conversationId, topTitle.querySelector('#custom-instruction-info-icon'));
        }
      }, title.length * 50);
    });
  }, 1000);// a little delay to make sure gen title still works even if user stops the generation
}
function loadFilteredConversations(conversationIds) {
  const searchInput = document.querySelector('#conversation-search');
  const searchValue = searchInput?.value || '';
  const conversationList = document.querySelector('#conversation-list');
  if (!conversationList) return;
  const allConversations = conversationList.querySelectorAll('[id^="conversation-button-"]');
  allConversations.forEach((c) => {
    c.classList = notSelectedClassList;
    if (searchValue) {
      if (!conversationIds.includes(c.id.split('conversation-button-')[1])) {
        c.classList.add('hidden');
      } else {
        c.classList.remove('hidden');
      }
    } else {
      c.classList.remove('hidden');
    }
  });
  toggleFoldersVisibility();
  if (conversationIds.length > 0) {
    const existingNoResult = document.querySelector('#search-no-result');
    if (existingNoResult) existingNoResult.remove();
    // update location path to the first conversation
    const firstConversation = conversationList.querySelectorAll('[id^=conversation-button-]:not(.hidden)')[0];
    firstConversation.classList = selectedClassList;
    const firstConversationId = firstConversation?.id?.split('conversation-button-')[1];
    if (searchValue) {
      window.history.pushState({}, '', `/c/${firstConversationId}`);
      loadConversation(firstConversationId);
    } else {
      window.history.pushState({}, '', '/');
      showNewChatPage(null, false);
    }
  } else {
    const existingNoResult = document.querySelector('#search-no-result');
    if (!existingNoResult) {
      const noResult = document.createElement('div');
      noResult.id = 'search-no-result';
      noResult.classList = 'text-token-text-tertiary text-center';
      noResult.innerHTML = 'Nenhum resultado';
      noResult.style.height = '500px';
      conversationList.appendChild(noResult);
    }
    // update location path to the first conversation
    window.history.pushState({}, '', '/');
    showNewChatPage(null, false);
  }
}
function toggleFoldersVisibility() {
  const conversationList = document.querySelector('#conversation-list');
  if (!conversationList) return;
  const allFolders = conversationList.querySelectorAll('[id^=wrapper-folder-]');
  const searchInput = document.querySelector('#conversation-search');
  const searchValue = searchInput?.value || '';
  allFolders.forEach((f) => {
    const folderId = f.id.split('wrapper-folder-')[1];
    const folderContent = document.querySelector(`#folder-content-${folderId}`);
    if (searchValue && folderContent && folderContent.querySelectorAll('[id^=conversation-button-]:not(.hidden)').length === 0) {
      f.classList.add('hidden');
    } else {
      f.classList.remove('hidden');
    }
  });
}
function loadStorageConversations(conversations, conversationsOrder = [], filteredConversationIds = [], searchValue = '') {
  const conversationList = document.querySelector('#conversation-list');
  if (!conversationList) return;
  const existingNoResult = document.querySelector('#search-no-result');
  if (existingNoResult) existingNoResult.remove();
  const historySyncMessage = document.querySelector('#history-sync-message');
  const syncBanner = document.querySelector('#sync-nav-wrapper');

  if (conversations && !syncBanner) {
    if (historySyncMessage) historySyncMessage.remove();
  }
  // add folders
  const folders = conversationsOrder.filter((c) => typeof c === 'object');
  for (let i = 0; i < folders.length; i += 1) {
    const folder = folders[i];
    // if folder.conversationIds has overlap with filteredConversationIds
    if (searchValue) {
      const conversationIds = folder.conversationIds.filter((c) => filteredConversationIds.includes(c));
      if (conversationIds.length === 0) continue;
      folder.isOpen = true;
      folder.conversationIds = conversationIds;
    }
    const folderElement = createFolder(folder, conversations);
    conversationList.appendChild(folderElement);
  }
  // add conversations
  const conversationIds = conversationsOrder?.filter((c) => typeof c === 'string') || [];
  for (let i = 0; i < conversationIds.length; i += 1) {
    const conversationId = conversationIds[i];
    if (searchValue && !filteredConversationIds.includes(conversationId)) continue;
    const conv = conversations[conversationId];
    if (!conv) continue;
    const conversationElement = createConversation(conv);
    conversationList.appendChild(conversationElement);
  }

  if (searchValue) {
    if (Object.values(conversations).length > 0) {
      // click on first conversation
      const firstConversationId = document.querySelector('[id^="conversation-button-"]:not(.hidden)')?.id?.split('conversation-button-')[1];
      if (firstConversationId) {
        loadConversation(firstConversationId);
      }
    } else {
      const noResult = document.createElement('div');
      noResult.id = 'search-no-result';
      noResult.classList = 'text-token-text-tertiary text-center';
      noResult.innerHTML = 'Nenhum resultado';
      noResult.style.height = '500px';
      conversationList.appendChild(noResult);
      showNewChatPage(null, false);
    }
  } else {
    chrome.storage.local.get(['settings', 'totalConversations'], (result) => {
      const { settings, totalConversations } = result;
      if (parseInt(settings.autoSyncCount, 10) < totalConversations && !conversationList.innerText.includes('Sincronizando conversas...')) {
        const loadMoreConversationsButton = document.createElement('button');
        loadMoreConversationsButton.id = 'load-more-conversations-button';
        loadMoreConversationsButton.classList = 'w-full py-3 text-sm text-center text-token-text-tertiary cursor-pointer hover:text-token-text-primary';
        loadMoreConversationsButton.innerHTML = 'Carregar mais conversas ➜';
        loadMoreConversationsButton.addEventListener('click', () => {
          toast('Aumente o limite de conversas nas configurações de Auto-Sync', 'info', 7000);
          createSettingsModal(1);
        });
        conversationList.appendChild(loadMoreConversationsButton);
      }
    });
  }
}

function updateNewChatButtonSynced() {
  chrome.storage.local.get(['selectedConversations'], (result) => {
    const { selectedConversations } = result;
    const textAreaElement = document.querySelector('#prompt-textarea');
    const newChatButton = document.querySelector('#nav-gap')?.querySelector('a');
    if (!newChatButton) return;
    newChatButton.classList = 'flex p-2 w-full items-center gap-3 transition-colors duration-200 text-token-text-primary cursor-pointer text-sm rounded-md border border-token-border-light bg-token-sidebar-surface-primary hover:bg-token-main-surface-tertiary mb-1 flex-shrink-0';
    newChatButton.parentElement.parentElement.classList = 'sticky left-0 right-0 top-0 z-20 bg-token-sidebar-surface-primary pt-3.5';

    // clone newChatButton
    // if (conversationsAreSynced) {
    const newChatButtonClone = newChatButton.cloneNode(true);
    newChatButtonClone.id = 'new-chat-button';
    newChatButton.replaceWith(newChatButtonClone);
    if (!newChatButtonClone) return;
    newChatButtonClone.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenus();
      // closest a element
      if (e.target.closest('a').innerText === 'Clear selection') {
        showDefaultFolderActions();
        resetSelection();
      } else {
        const allNewChatButtonButtons = newChatButtonClone.querySelectorAll('button');
        const newChatButtonLastButtonChild = allNewChatButtonButtons[allNewChatButtonButtons.length - 1];
        newChatButtonLastButtonChild.classList = 'text-token-text-primary';
        showNewChatPage();
        updateGPTEditIcon();

        if (textAreaElement) {
          textAreaElement.focus();
        }
        // remove selected class from conversations from conversations list
        const focusedConversations = document.querySelectorAll('.selected');
        focusedConversations.forEach((c) => {
          c.classList = notSelectedClassList;
        });
      }
    });
    if (selectedConversations?.length > 0) {
      newChatButtonClone.innerHTML = '<div class="h-7 w-7 flex-shrink-0"><div class="gizmo-shadow-stroke relative flex h-full items-center justify-center rounded-full bg-white text-black"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div></div>Clear selection';
    } else {
      newChatButtonClone.innerHTML = ChatGPTIcon();
    }
    // }
  });
}
function submitChat(userInput, conversation, messageId, parentId, settings, account, chatgptAccountId, models, selectedModel, imageAssets = [], fileAttachments = [], continueGenerating = false, regenerateResponse = false, authorRole = 'user', authorName = '', initialMetadata = {}) {
  const conversationBottom = document.querySelector('#conversation-bottom');
  conversationBottom.insertAdjacentHTML('beforebegin', thinkingRowAssistant(settings));
  if (!scrolUpDetected && settings.autoScroll) {
    // conversation-inner-div
    const conversationInnerDiv = document.querySelector('#conversation-inner-div');
    const conversationInnerDivStyle = conversationInnerDiv.style.cssText;
    conversationInnerDiv.style = '';
    document.querySelector('#conversation-bottom')?.scrollIntoView();
    conversationInnerDiv.style = conversationInnerDivStyle;
  }
  // const chatgptAccountId = document?.cookie?.split('; ')?.find((row) => row?.startsWith('_account'))?.split('=')?.[1] || 'default';

  // const sharedWebsocket = chatgptAccountId ? account?.accounts?.[chatgptAccountId]?.features?.includes('shared_websocket') : false;
  if (sharedWebsocket) {
    submitChatWS(userInput, conversation, messageId, parentId, settings, account, chatgptAccountId, models, selectedModel, imageAssets, fileAttachments, continueGenerating, regenerateResponse, authorRole, authorName, initialMetadata);
  } else {
    submitChatStream(userInput, conversation, messageId, parentId, settings, account, chatgptAccountId, models, selectedModel, imageAssets, fileAttachments, continueGenerating, regenerateResponse, authorRole, authorName, initialMetadata);
  }
}
function submitChatStream(userInput, conversation, messageId, parentId, settings, account, chatgptAccountId, models, selectedModel, imageAssets = [], fileAttachments = [], continueGenerating = false, regenerateResponse = false, authorRole = 'user', authorName = '', initialMetadata = {}) {
  const lastMessageFailed = conversation?.mapping?.[conversation?.current_node]?.message?.author?.role === 'user';
  const isPaid = account?.accounts?.[chatgptAccountId || 'default']?.entitlement?.has_active_subscription || false;
  // check window. localstorage every 200ms until arkoseToken is set
  // const isGPT4 = selectedModel.tags.includes('gpt4');
  let arkoseToken = window.localStorage.getItem('sp/arkoseToken');
  const foundArkoseSetups = JSON.parse(window.localStorage.getItem('sp/arkoseSetups') || '[]');

  // if (isGPT4 && !arkoseToken) {
  if (!arkoseToken) {
    arkoseTrigger();
  }
  const userMessageId = messageId;
  let assistantData = [];
  let generatedTitleAlready = false;
  const startTime = Date.now();
  const interval = setInterval(() => {
    arkoseToken = window.localStorage.getItem('sp/arkoseToken');

    if (Date.now() - startTime > 5000 && !chatRequirementsIsPending) {
      clearInterval(interval);
      isGenerating = false;
      chunkNumber = 1;
      totalChunks = 1;
      remainingText = '';
      finalSummary = '';
      shouldSubmitFinalSummary = false;
      // remove the last user message
      const lastMessageWrapper = [...document.querySelectorAll('[id^="message-wrapper-"]')].pop();
      if (lastMessageWrapper?.dataset?.role !== 'assistant') {
        lastMessageWrapper.remove();
        toast('Something went wrong. Please refresh the page!', 'error');
      }
      const syncDiv = document.getElementById('sync-div');
      syncDiv.style.opacity = '1';
      const submitButton = document.querySelector('[data-testid="send-button"]');
      // submitButton.disabled = false;
      submitButton.classList.replace('rounded-full', 'rounded-lg');
      submitButton.innerHTML = '<span class="" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
      removeThinkingRowAssistant();
      const resultStreamingDivs = document.querySelectorAll('.result-streaming');
      resultStreamingDivs?.forEach((div) => {
        div.classList.remove('result-streaming');
      });
      return;
    }
    // if (arkoseToken || (isPaid && !selectedModel.tags.includes('gpt4'))) {
    // if (!isGPT4 || arkoseToken) {
    if (arkoseToken || foundArkoseSetups.length === 0) {
      // if (arkoseToken) {
      clearInterval(interval);
      scrolUpDetected = false;
      // // clear search
      // const searchBox = document.querySelector('#conversation-search');
      // if (searchBox?.value) {
      //   searchBox.value = '';
      //   searchBox.dispatchEvent(new Event('input', { bubbles: true }));
      // }

      const syncDiv = document.getElementById('sync-div');
      if (syncDiv) syncDiv.style.opacity = '0.3';
      chatStreamIsClosed = false;
      let isRenderingAssistantRow = false;
      // for continue generating
      const incompleteAssistant = [...document.querySelectorAll('[id^="message-wrapper-"][data-role="assistant"]')].pop();
      const existingInnerHTML = incompleteAssistant?.querySelector('[id^=message-text-]')?.innerHTML || '';

      const suggestionsWrapper = document.querySelector('#suggestions-wrapper');
      if (suggestionsWrapper) suggestionsWrapper.remove();
      const saveHistory = conversation?.id ? conversation.saveHistory : settings.saveHistory;
      const userInputParts = selectedModel.tags.includes('gpt4') ? [...imageAssets, userInput] : [userInput];
      const contentType = userInputParts.find((p) => typeof p !== 'string') ? 'multimodal_text' : 'text';
      const metadata = selectedModel.tags.includes('gpt4') ? (fileAttachments?.length > 0 ? { attachments: fileAttachments, ...initialMetadata } : initialMetadata) : initialMetadata;
      const { pathname } = new URL(window.location.toString());
      let gizmoId;
      if (pathname.startsWith('/g/g-')) {
        gizmoId = getGizmoIdFromUrl();
      }

      // eslint-disable-next-line no-nested-ternary
      const action = regenerateResponse ? 'variant' : continueGenerating ? 'continue' : 'next';
      getGizmoById(gizmoId).then((gizmoData) => {
        generateChat(userInputParts, conversation?.id, userMessageId, parentId, arkoseToken, gizmoData?.resource, metadata, lastPromptSuggestions, saveHistory, authorRole, authorName, action, contentType, lastMessageFailed).then((chatStream) => {
          const curSubmitButton = document.querySelector('[data-testid="send-button"]');
          curSubmitButton.classList.replace('rounded-lg', 'rounded-full');
          curSubmitButton.innerHTML = '<span class="" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 384 512" width="16" height="16" class="text-white dark:text-black"><path d="M384 128v255.1c0 35.35-28.65 64-64 64H64c-35.35 0-64-28.65-64-64V128c0-35.35 28.65-64 64-64H320C355.3 64 384 92.65 384 128z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';

          const faviconTimeout = settings.animateFavicon ? animateFavicon() : undefined;
          userChatIsActuallySaved = regenerateResponse || continueGenerating || authorRole !== 'user';
          let userChatSavedLocally = regenerateResponse || continueGenerating || authorRole !== 'user'; // false by default unless regenerateResponse is true
          let assistantChatSavedLocally = false;
          let finalMessage = '';
          // let diffMessage = '';
          let finalConversationId = '';
          let initialUserMessage = {};
          let systemMessage = {};

          chatStream.addEventListener('message', (e) => {
            if (e.data === '[DONE]' || chatStreamIsClosed) {
              updateLastMessagePluginDropdown();
              stopAnimateFavicon(faviconTimeout);
              if (!scrolUpDetected && settings.autoScroll) {
                document.querySelector('#conversation-bottom')?.scrollIntoView();
              }
              const submitButton = document?.querySelector('[data-testid="send-button"]');
              const textAreaElement = document?.querySelector('#prompt-textarea');
              textAreaElement?.focus();
              textAreaElement.dispatchEvent(new Event('input', { bubbles: true }));
              textAreaElement.dispatchEvent(new Event('change', { bubbles: true }));
              // update all ids with last message id
              const lastMessageWrapper = [...document.querySelectorAll('[id^="message-wrapper-"]')]?.pop();
              if (lastMessageWrapper) {
                const lastMessageWrapperId = lastMessageWrapper?.id.split('message-wrapper-')[1];
                if (lastMessageWrapperId !== finalMessage.id) {
                  // get all elements inside lastMessageWrapper where id include lastMessageWrapperId but not include -plugin- or -dalle-
                  const lastMessageWrapperElements = [...lastMessageWrapper.querySelectorAll(`[id*="${lastMessageWrapperId}"]:not([id*="plugin"]):not([id*="dalle"])`)];
                  // for each element replace lastMessageWrapperId with finalMessage.id
                  lastMessageWrapperElements?.forEach((el) => {
                    el.id = el.id.replace(lastMessageWrapperId, finalMessage.id);
                  });
                  // update lastMessageWrapper id
                  lastMessageWrapper.id = lastMessageWrapper?.id.replace(lastMessageWrapperId, finalMessage.id);
                }
              }
              // submitButton.disabled = false;
              if (submitButton) {
                submitButton.classList.replace('rounded-full', 'rounded-lg');
                submitButton.innerHTML = '<span class="" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
                const resultStreamingDivs = document.querySelectorAll('.result-streaming');
                resultStreamingDivs?.forEach((div) => {
                  div.classList.remove('result-streaming');
                });
              }
              if (chatStreamIsClosed && e.data !== '[DONE]') {
                try {
                  const data = JSON.parse(e.data);
                  if (data.error) throw new Error(data.error);
                  const { conversation_id: conversationId, message } = data;
                  finalConversationId = conversationId;
                  finalMessage = message;
                  // reset splitter stuff
                  chunkNumber = 1;
                  totalChunks = 1;
                  remainingText = '';
                  finalSummary = '';
                  shouldSubmitFinalSummary = false;
                } catch (err) {
                  // console.error(err);
                }
                // update rowAssistant?
              }
              // since we are closing the chat stream, but the following function has a delay
              const tmpChatStreamIsClosed = chatStreamIsClosed;
              if (finalMessage) {
                const tempId = setInterval(() => {
                  if (userChatIsActuallySaved) {
                    clearInterval(tempId);
                    // don't generate title if tmpChatStreamIsClosed
                    const assistantMessages = assistantData.map((m) => m.message);
                    updateOrCreateConversation(finalConversationId, gizmoId, assistantMessages, userMessageId, settings, !tmpChatStreamIsClosed && !generatedTitleAlready, tmpChatStreamIsClosed).then(() => {
                      if (!tmpChatStreamIsClosed) { // if not clicked on stop generating button
                        if (runningPromptChainSteps && runningPromptChainSteps.length > 1 && runningPromptChainStepIndex < runningPromptChainSteps.length - 1) {
                          setTimeout(() => {
                            insertNextChain(runningPromptChainSteps, runningPromptChainStepIndex + 1);
                          }, isPaid ? 2000 : 2000);
                        } else {
                          runningPromptChainSteps = undefined;
                          runningPromptChainStepIndex = 0;
                          const runningPromptChainStepCount = document.querySelector('#running-prompt-chain-step-count');
                          if (runningPromptChainStepCount) runningPromptChainStepCount.remove();
                          setTimeout(() => {
                            insertNextChunk(settings, finalMessage);
                          }, isPaid ? 2000 : 2000);
                        }
                      } else {
                        runningPromptChainSteps = undefined;
                        runningPromptChainStepIndex = 0;
                        const runningPromptChainStepCount = document.querySelector('#running-prompt-chain-step-count');
                        if (runningPromptChainStepCount) runningPromptChainStepCount.remove();
                      }
                    });
                  }
                }, 1000);
              }
              replaceTextAreaElement(settings);
              isGenerating = false;
              chatStreamIsClosed = false;
              chatStream.close();
              if (syncDiv) syncDiv.style.opacity = '1';
              addFinalCompletionClassToLastMessageWrapper();
              addConversationsEventListeners(finalConversationId, true);
              updateCounter();
              updateTotalCounter(settings);
              if (settings.chatEndedSound) {
                playSound('beep');
              }
              if (settings.autoSpeak) {
                setTimeout(() => {
                  const textToSpeechButton = document.querySelector(`#text-to-speech-button-${finalMessage?.id}`);
                  textToSpeechButton?.click();
                }, 1000);
              }
              // generateSuggestions(finalConversationId, userMessageId, selectedModel.slug);
            } else if (e.event === 'ping') {
              // console.error('PING RECEIVED', e);
            } else {
              try {
                if (chatStream.readyState !== 2) {
                  isGenerating = true;
                }

                const data = JSON.parse(e.data);
                if (data.type === 'title_generation') {
                  generatedTitleAlready = true;
                  updateConversationTitle(data.conversation_id, data.title);
                  return;
                }
                if (data.error) throw new Error(data.error);
                const { conversation_id: conversationId, message } = data;
                const { role } = message.author;
                const { recipient } = message;

                if (finalMessage === '') {
                  // update gpt4 counter
                  if (!continueGenerating) {
                    chrome.storage.local.get(['gpt4Timestamps', 'settings', 'selectedModel', 'conversationLimit'], (result) => {
                      const { gpt4Timestamps } = result;
                      if (!result.selectedModel.tags.includes('gpt4') && result.selectedModel.slug !== 'gpt-4') return;
                      const now = new Date().getTime();
                      const gpt4CounterElement = document.querySelector('#gpt4-counter');
                      if (!gpt4CounterElement) return;
                      gpt4CounterElement.style.display = result.settings.showGpt4Counter ? 'block' : 'none';
                      const messageCap = result?.conversationLimit?.message_cap || 50;
                      const messageCapWindow = result?.conversationLimit?.message_cap_window || 180;
                      if (gpt4Timestamps) {
                        gpt4Timestamps.push(now);
                        const hoursAgo = now - (messageCapWindow / 60) * 60 * 60 * 1000;
                        const gpt4TimestampsFiltered = gpt4Timestamps.filter((timestamp) => timestamp > hoursAgo);

                        const firstTimestamp = gpt4Timestamps[0];

                        // find difference between 3 hours ago to first timestamp
                        const countdownTimer = firstTimestamp ? Math.max(0, 3 * 60 * 60 * 1000 - (now - firstTimestamp)) : 0;
                        // show a countdown time if countdownTimer is greater than 0
                        let countdownTimerText = '';
                        if (countdownTimer > 0) {
                          countdownTimerText = ` (Nvoas requisições disponíveis em ${Math.floor(countdownTimer / 1000 / 60)} minutos)`;
                        }

                        chrome.storage.local.set({ gpt4Timestamps: gpt4TimestampsFiltered, capExpiresAt: '' });
                        if (gpt4CounterElement) {
                          gpt4CounterElement.innerText = `Uso do GPT-4 (últimas ${getGPT4CounterMessageCapWindow(messageCapWindow)}): ${gpt4TimestampsFiltered.length}/${messageCap} ${countdownTimerText}`;
                        }
                      } else {
                        chrome.storage.local.set({ gpt4Timestamps: [now] });
                        if (gpt4CounterElement) {
                          gpt4CounterElement.innerText = `Uso do GPT-4 (últimas ${getGPT4CounterMessageCapWindow(messageCapWindow)}): 1/${messageCap} (Novas requisições em 180 minutos)`;
                        }
                      }
                    });
                  }
                }

                finalConversationId = conversationId;
                const { pathname: curpathname } = new URL(window.location.toString());
                if (!curpathname.includes('/c/')) { // https://chat.openai.com/
                  // only change url if there are any user messages. if user switch to new page while generating, don't change url when done generating
                  const anyUserMessageWrappers = document.querySelectorAll('[id^="message-wrapper-"][data-role="user"]').length > 0;
                  if (anyUserMessageWrappers) {
                    window.history.pushState({}, '', `https://chat.openai.com${curpathname === '/' ? '' : curpathname}/c/${finalConversationId}`);
                  }
                }
                // save user chat locally
                if (!conversation?.id) {
                  if (role === 'system') {
                    systemMessage = message;
                    return;
                  }
                  if (role === 'user') {
                    initialUserMessage = message;
                    initialUserMessage.metadata = { ...initialUserMessage.metadata, model_slug: selectedModel.slug };
                    // set forcerefresh=true when adding user chat, and set it to false when stream ends. This way if something goes wrong in between, the conversation will be refreshed later
                    updateOrCreateConversation(finalConversationId, gizmoId, [initialUserMessage], parentId, settings, false, true, systemMessage);
                    return;
                  }
                } else if (!userChatSavedLocally) {
                  const userMessage = {
                    id: userMessageId,
                    author: {
                      role: 'user',
                      metadata: {},
                    },
                    content: {
                      content_type: 'text',
                      parts: userInputParts,
                    },
                    metadata: { model_slug: selectedModel.slug, ...metadata },
                    recipient: recipient || 'all',
                  };

                  // set forcerefresh=true when adding user chat, and set it to false when stream ends. This way if something goes wrong in between, the conversation will be refreshed later
                  updateOrCreateConversation(finalConversationId, gizmoId, [userMessage], parentId, settings, false, true);
                  userChatSavedLocally = true;
                }
                if (!conversation?.id || userChatSavedLocally) {
                  // save assistant chat locally
                  // if (finalMessage?.content?.parts?.[0]) {
                  //   diffMessage = message?.content?.parts?.[0]?.split(finalMessage?.content?.parts?.[0])?.[1] || '';
                  // } else {
                  //   diffMessage = message?.content?.parts?.[0] || '';
                  // }
                  // console.warn('DIFF MESSAGE', diffMessage);

                  finalMessage = message;
                  if (role === 'assistant' || role === 'tool') {
                    if (!assistantData || assistantData.length === 0) {
                      assistantData = [data];
                    } else {
                      const lastAssistantData = assistantData[assistantData.length - 1];
                      if (lastAssistantData?.message?.id === message.id) {
                        // replace last assistant message with new one
                        assistantData[assistantData.length - 1] = data;
                      } else {
                        assistantData.push(data);
                      }
                    }
                  }
                  if (!assistantChatSavedLocally && (role === 'assistant' || role === 'tool')) {
                    assistantChatSavedLocally = true;
                    const tempId = setInterval(() => {
                      if (userChatIsActuallySaved) {
                        clearInterval(tempId);
                        const assistantMessages = assistantData.map((m) => m.message);
                        updateOrCreateConversation(finalConversationId, gizmoId, assistantMessages, userMessageId, settings);
                      }
                    }, 100);
                  }
                }

                // if user switch conv while generating, dont show the assistant row until the user switch back to the original conv
                const urlConversationId = curpathname.split('/c/').pop().replace(/[^a-z0-9-]/gi, '');
                if (finalConversationId !== urlConversationId) return;

                if (role === 'system') return;
                removeThinkingRowAssistant();
                const lastRowAssistant = [...document.querySelectorAll('[id^="message-wrapper-"][data-role="assistant"]')].pop();
                const existingRowAssistant = (continueGenerating || authorRole !== 'user') ? lastRowAssistant : document.querySelector(`[id="message-wrapper-${assistantData[0]?.message?.id}"][data-role="assistant"]`);

                if (existingRowAssistant && !existingRowAssistant.nextElementSibling.id.startsWith('message-wrapper-')) {
                  isRenderingAssistantRow = false;
                  addNodeToRowAssistant(finalConversationId, data, gizmoId, continueGenerating, existingInnerHTML, true, settings.pluginDefaultOpen);
                  if (!scrolUpDetected && settings.autoScroll) {
                    // if current time is greater than last scroll timestamp + 1 seconds, scroll to bottom
                    const now = new Date();
                    if (now.getTime() > lastScrollToBottomTimestamp + 500) {
                      lastScrollToBottomTimestamp = now.getTime();
                      document.querySelector('#conversation-bottom')?.scrollIntoView();
                    }
                  }
                } else {
                  const lastMessageWrapper = [...document.querySelectorAll('[id^="message-wrapper-"]')].pop();
                  if (lastMessageWrapper?.dataset?.role !== 'assistant') {
                    const existingRowUser = document.querySelector(`[id="message-wrapper-${userMessageId}"][data-role="user"]`);

                    if (existingRowUser && !isRenderingAssistantRow) {
                      isRenderingAssistantRow = true;
                      let threadCount = Object.keys(conversation).length > 0 ? conversation?.mapping[userMessageId]?.children?.length || 1 : 1;
                      if (regenerateResponse && !lastMessageFailed) threadCount += 1;
                      const assistantRow = rowAssistant(conversation, assistantData, threadCount, threadCount, models, settings, gizmoData, true, true);

                      const conversationBottom = document.querySelector('#conversation-bottom');
                      conversationBottom.insertAdjacentHTML('beforebegin', assistantRow);
                      setTimeout(() => {
                        const lastMessagePluginToggleButton = [...document.querySelectorAll('[id^="message-plugin-toggle-"]')].pop();
                        if (lastMessagePluginToggleButton) {
                          addMessagePluginToggleButtonsEventListeners([lastMessagePluginToggleButton]);
                        }
                        addMissingGizmoNamesAndAvatars();
                      }, 300);
                      if (!scrolUpDetected && settings.autoScroll) {
                        conversationBottom.scrollIntoView();
                      }
                    }
                  }
                }
                // addCopyCodeButtonsEventListeners();
              } catch (err) {
                // console.warn('error', err);
                try {
                  if (JSON.parse(e.data)?.error) {
                    toast(JSON.parse(e.data).error, 'error');
                  }
                } catch (err2) {
                  // console.warn('error', err);
                  // console.warn(e.data);
                }
              }
            }
          });
          chatStream.addEventListener('error', (err) => {
            // Firefox returns error when closing chat stream
            // if firefox and no error data, do nothing
            if (isFirefox && !err.data) return;
            if (settings.chatEndedSound) {
              playSound('beep');
            }
            isGenerating = false;
            chunkNumber = 1;
            totalChunks = 1;
            remainingText = '';
            finalSummary = '';
            shouldSubmitFinalSummary = false;
            syncDiv.style.opacity = '1';
            const submitButton = document.querySelector('[data-testid="send-button"]');
            // submitButton.disabled = false;
            submitButton.classList.replace('rounded-full', 'rounded-lg');
            submitButton.innerHTML = '<span class="" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
            const resultStreamingDivs = document.querySelectorAll('.result-streaming');
            resultStreamingDivs?.forEach((div) => {
              div.classList.remove('result-streaming');
            });

            // eslint-disable-next-line no-console
            console.warn(err);
            if (err.data) {
              try {
                const error = JSON.parse(err.data);
                const errorCode = error?.detail?.code;
                let errorMessage = typeof error.detail === 'string' ? error.detail : error.detail.message;
                if (errorCode === 'model_cap_exceeded') {
                  // seconds until cap is cleared
                  const clearsIn = error?.detail?.clears_in;
                  const date = new Date();
                  date.setSeconds(date.getSeconds() + clearsIn);
                  // print expire hour minute from local time
                  const hour = date.getHours();
                  const minute = date.getMinutes();
                  const ampm = hour >= 12 ? 'pm' : 'am';
                  const hour12 = hour % 12;
                  const hour12Display = hour12 || 12;
                  const minuteDisplay = minute < 10 ? `0${minute}` : minute;
                  const capExpiresAt = `${hour12Display}:${minuteDisplay}${ampm}`;
                  chrome.storage.local.set({ capExpiresAt });
                  errorMessage = `Você atingiu o limite de uso atual para este modelo. Você pode continuar com o modelo padrão agora ou tentar novamente em ${capExpiresAt}.`;
                } else {
                  replaceTextAreaElement(settings);
                  chrome.storage.local.set({ capExpiresAt: '' });
                }
                const conversationBottom = document.querySelector('#conversation-bottom');
                const errorMessageElement = `<div id="response-error-msg" style="max-width:400px" class="py-2 px-3 my-2 border rounded-md text-sm text-token-text-secondary border-red-500 bg-red-500/10">${errorMessage}</div>`;
                conversationBottom.insertAdjacentHTML('beforebegin', errorMessageElement);
                if (!scrolUpDetected && settings.autoScroll) {
                  conversationBottom.scrollIntoView({ behavior: 'smooth' });
                }
              } catch (err2) {
                // console.error(err);
              }
            }
          });
        });
      });
    }
  }, 200);
}
function submitChatWS(userInput, conversation, messageId, parentId, settings, account, chatgptAccountId, models, selectedModel, imageAssets = [], fileAttachments = [], continueGenerating = false, regenerateResponse = false, authorRole = 'user', authorName = '', initialMetadata = {}) {
  const lastMessageFailed = conversation?.mapping?.[conversation?.current_node]?.message?.author?.role === 'user';

  const isPaid = account?.accounts?.[chatgptAccountId || 'default']?.entitlement?.has_active_subscription || false;
  // check window. localstorage every 200ms until arkoseToken is set
  // const isGPT4 = selectedModel.tags.includes('gpt4');
  let arkoseToken = window.localStorage.getItem('sp/arkoseToken');
  const foundArkoseSetups = JSON.parse(window.localStorage.getItem('sp/arkoseSetups') || '[]');
  // if (isGPT4 && !arkoseToken) {
  if (!arkoseToken) {
    arkoseTrigger();
  }
  const userMessageId = messageId;
  let assistantData = [];
  let generatedTitleAlready = false;
  const startTime = Date.now();
  const interval = setInterval(() => {
    arkoseToken = window.localStorage.getItem('sp/arkoseToken');

    if (Date.now() - startTime > 5000 && !chatRequirementsIsPending) {
      clearInterval(interval);
      isGenerating = false;
      chunkNumber = 1;
      totalChunks = 1;
      remainingText = '';
      finalSummary = '';
      shouldSubmitFinalSummary = false;
      // remove the last user message
      const lastMessageWrapper = [...document.querySelectorAll('[id^="message-wrapper-"]')].pop();
      if (lastMessageWrapper?.dataset?.role !== 'assistant') {
        lastMessageWrapper.remove();
        toast('Something went wrong. Please refresh the page!', 'error');
      }
      const syncDiv = document.getElementById('sync-div');
      syncDiv.style.opacity = '1';
      const submitButton = document.querySelector('[data-testid="send-button"]');
      // submitButton.disabled = false;
      submitButton.classList.replace('rounded-full', 'rounded-lg');
      submitButton.innerHTML = '<span class="" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
      removeThinkingRowAssistant();
      const resultStreamingDivs = document.querySelectorAll('.result-streaming');
      resultStreamingDivs?.forEach((div) => {
        div.classList.remove('result-streaming');
      });
      return;
    }
    // if (arkoseToken || (isPaid && !selectedModel.tags.includes('gpt4'))) {
    // if (!isGPT4 || arkoseToken) {
    if (arkoseToken || foundArkoseSetups.length === 0) {
      // if (arkoseToken) {
      clearInterval(interval);
      scrolUpDetected = false;
      // // clear search
      // const searchBox = document.querySelector('#conversation-search');
      // if (searchBox?.value) {
      //   searchBox.value = '';
      //   searchBox.dispatchEvent(new Event('input', { bubbles: true }));
      // }
      const syncDiv = document.getElementById('sync-div');
      if (syncDiv) syncDiv.style.opacity = '0.3';
      chatStreamIsClosed = false;
      let isRenderingAssistantRow = false;
      // for continue generating
      const incompleteAssistant = [...document.querySelectorAll('[id^="message-wrapper-"][data-role="assistant"]')].pop();
      const existingInnerHTML = incompleteAssistant?.querySelector('[id^=message-text-]')?.innerHTML || '';

      const suggestionsWrapper = document.querySelector('#suggestions-wrapper');
      if (suggestionsWrapper) suggestionsWrapper.remove();
      const saveHistory = conversation?.id ? conversation.saveHistory : settings.saveHistory;
      const userInputParts = selectedModel.tags.includes('gpt4') ? [...imageAssets, userInput] : [userInput];
      const contentType = userInputParts.find((p) => typeof p !== 'string') ? 'multimodal_text' : 'text';
      const metadata = selectedModel.tags.includes('gpt4') ? (fileAttachments?.length > 0 ? { attachments: fileAttachments, ...initialMetadata } : initialMetadata) : initialMetadata;
      const { pathname } = new URL(window.location.toString());
      let gizmoId;
      if (pathname.startsWith('/g/g-')) {
        gizmoId = getGizmoIdFromUrl();
      }

      // eslint-disable-next-line no-nested-ternary
      const action = regenerateResponse ? 'variant' : continueGenerating ? 'continue' : 'next';
      const faviconTimeout = settings.animateFavicon ? animateFavicon() : undefined;
      userChatIsActuallySaved = regenerateResponse || continueGenerating || authorRole !== 'user';
      let userChatSavedLocally = regenerateResponse || continueGenerating || authorRole !== 'user'; // false by default unless regenerateResponse is true
      let assistantChatSavedLocally = false;
      let finalMessage = '';
      // let diffMessage = '';
      let finalConversationId = '';
      let initialUserMessage = {};
      let systemMessage = {};
      chrome.storage.local.get('websocket', ({ websocket }) => {
        const spws = new WebSocket(websocket.wss_url);
        // console.warn('spws', spws.url);
        getGizmoById(gizmoId).then((gizmoData) => {
          spws.addEventListener('message', (e) => {
            const encodedData = JSON.parse(e.data);
            let decodedBody = atob(encodedData.body)?.trim();

            if (decodedBody.startsWith('data: ')) {
              decodedBody = decodedBody.replace('data: ', '');
            }
            if (decodedBody === '[DONE]' || chatStreamIsClosed) {
              updateLastMessagePluginDropdown();
              stopAnimateFavicon(faviconTimeout);
              if (!scrolUpDetected && settings.autoScroll) {
                document.querySelector('#conversation-bottom')?.scrollIntoView();
              }
              const submitButton = document?.querySelector('[data-testid="send-button"]');
              const textAreaElement = document?.querySelector('#prompt-textarea');
              textAreaElement?.focus();
              // update all ids with last message id
              const lastMessageWrapper = [...document.querySelectorAll('[id^="message-wrapper-"]')]?.pop();
              if (lastMessageWrapper) {
                const lastMessageWrapperId = lastMessageWrapper?.id.split('message-wrapper-')[1];
                if (lastMessageWrapperId !== finalMessage.id) {
                  // get all elements inside lastMessageWrapper where id include lastMessageWrapperId but not include -plugin- or -dalle-
                  const lastMessageWrapperElements = [...lastMessageWrapper.querySelectorAll(`[id*="${lastMessageWrapperId}"]:not([id*="plugin"]):not([id*="dalle"])`)];
                  // for each element replace lastMessageWrapperId with finalMessage.id
                  lastMessageWrapperElements?.forEach((el) => {
                    el.id = el.id.replace(lastMessageWrapperId, finalMessage.id);
                  });
                  // update lastMessageWrapper id
                  lastMessageWrapper.id = lastMessageWrapper?.id.replace(lastMessageWrapperId, finalMessage.id);
                }
              }
              // submitButton.disabled = false;
              if (submitButton) {
                submitButton.classList.replace('rounded-full', 'rounded-lg');
                submitButton.innerHTML = '<span class="" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
                const resultStreamingDivs = document.querySelectorAll('.result-streaming');
                resultStreamingDivs?.forEach((div) => {
                  div.classList.remove('result-streaming');
                });
              }
              if (chatStreamIsClosed && decodedBody !== '[DONE]') {
                const data = decodedBody ? JSON.parse(decodedBody) : {};

                try {
                  if (data.error) throw new Error(data.error);
                  const { conversation_id: conversationId, message } = data;
                  finalConversationId = conversationId;
                  finalMessage = message;
                  // reset splitter stuff
                  chunkNumber = 1;
                  totalChunks = 1;
                  remainingText = '';
                  finalSummary = '';
                  shouldSubmitFinalSummary = false;
                } catch (err) {
                  // console.error(err);
                }
                // update rowAssistant?
              }
              // since we are closing the chat stream, but the following function has a delay
              const tmpChatStreamIsClosed = chatStreamIsClosed;
              if (finalMessage) {
                const tempId = setInterval(() => {
                  if (userChatIsActuallySaved) {
                    clearInterval(tempId);
                    // don't generate title if tmpChatStreamIsClosed
                    const assistantMessages = assistantData.map((m) => m.message);
                    updateOrCreateConversation(finalConversationId, gizmoId, assistantMessages, userMessageId, settings, !tmpChatStreamIsClosed && !generatedTitleAlready, tmpChatStreamIsClosed).then(() => {
                      if (!tmpChatStreamIsClosed) { // if not clicked on stop generating button
                        if (runningPromptChainSteps && runningPromptChainSteps.length > 1 && runningPromptChainStepIndex < runningPromptChainSteps.length - 1) {
                          setTimeout(() => {
                            insertNextChain(runningPromptChainSteps, runningPromptChainStepIndex + 1);
                          }, isPaid ? 2000 : 2000);
                        } else {
                          runningPromptChainSteps = undefined;
                          runningPromptChainStepIndex = 0;
                          const runningPromptChainStepCount = document.querySelector('#running-prompt-chain-step-count');
                          if (runningPromptChainStepCount) runningPromptChainStepCount.remove();
                          setTimeout(() => {
                            insertNextChunk(settings, finalMessage);
                          }, isPaid ? 2000 : 2000);
                        }
                      } else {
                        runningPromptChainSteps = undefined;
                        runningPromptChainStepIndex = 0;
                        const runningPromptChainStepCount = document.querySelector('#running-prompt-chain-step-count');
                        if (runningPromptChainStepCount) runningPromptChainStepCount.remove();
                      }
                    });
                  }
                }, 1000);
              }
              replaceTextAreaElement(settings);
              isGenerating = false;
              chatStreamIsClosed = false;
              spws.close();
              if (syncDiv) syncDiv.style.opacity = '1';
              addFinalCompletionClassToLastMessageWrapper();
              addConversationsEventListeners(finalConversationId, true);
              updateCounter();
              updateTotalCounter(settings);
              if (settings.chatEndedSound) {
                playSound('beep');
              }
              if (settings.autoSpeak) {
                setTimeout(() => {
                  const textToSpeechButton = document.querySelector(`#text-to-speech-button-${finalMessage?.id}`);
                  textToSpeechButton?.click();
                }, 1000);
              }
              // generateSuggestions(finalConversationId, userMessageId, selectedModel.slug);
            } else if (e.event === 'ping') {
              // console.error('PING RECEIVED', e);
            } else {
              try {
                if (spws.readyState < 2) {
                  isGenerating = true;
                }
                const data = decodedBody ? JSON.parse(decodedBody) : {};
                if (data.type === 'title_generation') {
                  generatedTitleAlready = true;
                  updateConversationTitle(data.conversation_id, data.title);
                  return;
                }
                if (data.error) throw new Error(data.error);
                const { conversation_id: conversationId, message } = data;
                const { role } = message.author;
                const { recipient } = message;

                if (finalMessage === '') {
                  // update gpt4 counter
                  if (!continueGenerating) {
                    chrome.storage.local.get(['gpt4Timestamps', 'settings', 'selectedModel', 'conversationLimit'], (result) => {
                      const { gpt4Timestamps } = result;
                      if (!result.selectedModel.tags.includes('gpt4') && result.selectedModel.slug !== 'gpt-4') return;
                      const now = new Date().getTime();
                      const gpt4CounterElement = document.querySelector('#gpt4-counter');
                      if (!gpt4CounterElement) return;
                      gpt4CounterElement.style.display = result.settings.showGpt4Counter ? 'block' : 'none';
                      const messageCap = result?.conversationLimit?.message_cap || 50;
                      const messageCapWindow = result?.conversationLimit?.message_cap_window || 180;
                      if (gpt4Timestamps) {
                        gpt4Timestamps.push(now);
                        const hoursAgo = now - (messageCapWindow / 60) * 60 * 60 * 1000;
                        const gpt4TimestampsFiltered = gpt4Timestamps.filter((timestamp) => timestamp > hoursAgo);

                        const firstTimestamp = gpt4Timestamps[0];

                        // find difference between 3 hours ago to first timestamp
                        const countdownTimer = firstTimestamp ? Math.max(0, 3 * 60 * 60 * 1000 - (now - firstTimestamp)) : 0;
                        // show a countdown time if countdownTimer is greater than 0
                        let countdownTimerText = '';
                        if (countdownTimer > 0) {
                          countdownTimerText = ` (Novas requisições disponíveis em  ${Math.floor(countdownTimer / 1000 / 60)} minutos)`;
                        }

                        chrome.storage.local.set({ gpt4Timestamps: gpt4TimestampsFiltered, capExpiresAt: '' });
                        if (gpt4CounterElement) {
                          gpt4CounterElement.innerText = `Uso do GPT-4 (últimas ${getGPT4CounterMessageCapWindow(messageCapWindow)}): ${gpt4TimestampsFiltered.length}/${messageCap} ${countdownTimerText}`;
                        }
                      } else {
                        chrome.storage.local.set({ gpt4Timestamps: [now] });
                        if (gpt4CounterElement) {
                          gpt4CounterElement.innerText = `Uso do GPT-4 (últimas ${getGPT4CounterMessageCapWindow(messageCapWindow)}): 1/${messageCap} (Novas requisições em 180 minutos)`;
                        }
                      }
                    });
                  }
                }

                finalConversationId = conversationId;
                const { pathname: curpathname } = new URL(window.location.toString());
                if (!curpathname.includes('/c/')) { // https://chat.openai.com/
                  // only change url if there are any user messages. if user switch to new page while generating, don't change url when done generating
                  const anyUserMessageWrappers = document.querySelectorAll('[id^="message-wrapper-"][data-role="user"]').length > 0;
                  if (anyUserMessageWrappers) {
                    window.history.pushState({}, '', `https://chat.openai.com${curpathname === '/' ? '' : curpathname}/c/${finalConversationId}`);
                  }
                }
                // save user chat locally
                if (!conversation?.id) {
                  if (role === 'system') {
                    systemMessage = message;
                    return;
                  }
                  if (role === 'user') {
                    initialUserMessage = message;
                    initialUserMessage.metadata = { ...initialUserMessage.metadata, model_slug: selectedModel.slug };
                    // set forcerefresh=true when adding user chat, and set it to false when stream ends. This way if something goes wrong in between, the conversation will be refreshed later
                    updateOrCreateConversation(finalConversationId, gizmoId, [initialUserMessage], parentId, settings, false, true, systemMessage);
                    return;
                  }
                } else if (!userChatSavedLocally) {
                  const userMessage = {
                    id: userMessageId,
                    author: {
                      role: 'user',
                      metadata: {},
                    },
                    content: {
                      content_type: 'text',
                      parts: userInputParts,
                    },
                    metadata: { model_slug: selectedModel.slug, ...metadata },
                    recipient: recipient || 'all',
                  };

                  // set forcerefresh=true when adding user chat, and set it to false when stream ends. This way if something goes wrong in between, the conversation will be refreshed later
                  updateOrCreateConversation(finalConversationId, gizmoId, [userMessage], parentId, settings, false, true);
                  userChatSavedLocally = true;
                }
                if (!conversation?.id || userChatSavedLocally) {
                  // save assistant chat locally
                  // if (finalMessage?.content?.parts?.[0]) {
                  //   diffMessage = message?.content?.parts?.[0]?.split(finalMessage?.content?.parts?.[0])?.[1] || '';
                  // } else {
                  //   diffMessage = message?.content?.parts?.[0] || '';
                  // }
                  // console.warn('DIFF MESSAGE', diffMessage);

                  finalMessage = message;
                  if (role === 'assistant' || role === 'tool') {
                    if (!assistantData || assistantData.length === 0) {
                      assistantData = [data];
                    } else {
                      const lastAssistantData = assistantData[assistantData.length - 1];
                      if (lastAssistantData?.message?.id === message.id) {
                        // replace last assistant message with new one
                        assistantData[assistantData.length - 1] = data;
                      } else {
                        assistantData.push(data);
                      }
                    }
                  }
                  if (!assistantChatSavedLocally && (role === 'assistant' || role === 'tool')) {
                    assistantChatSavedLocally = true;
                    const tempId = setInterval(() => {
                      if (userChatIsActuallySaved) {
                        clearInterval(tempId);
                        const assistantMessages = assistantData.map((m) => m.message);
                        updateOrCreateConversation(finalConversationId, gizmoId, assistantMessages, userMessageId, settings);
                      }
                    }, 100);
                  }
                }

                // if user switch conv while generating, dont show the assistant row until the user switch back to the original conv
                const urlConversationId = curpathname.split('/c/').pop().replace(/[^a-z0-9-]/gi, '');
                if (finalConversationId !== urlConversationId) return;

                if (role === 'system') return;
                removeThinkingRowAssistant();

                const lastRowAssistant = [...document.querySelectorAll('[id^="message-wrapper-"][data-role="assistant"]')].pop();
                const existingRowAssistant = (continueGenerating || authorRole !== 'user') ? lastRowAssistant : document.querySelector(`[id="message-wrapper-${assistantData[0]?.message?.id}"][data-role="assistant"]`);

                if (existingRowAssistant && !existingRowAssistant.nextElementSibling.id.startsWith('message-wrapper-')) {
                  isRenderingAssistantRow = false;
                  addNodeToRowAssistant(finalConversationId, data, gizmoId, continueGenerating, existingInnerHTML, true, settings.pluginDefaultOpen);
                  if (!scrolUpDetected && settings.autoScroll) {
                    // if current time is greater than last scroll timestamp + 1 seconds, scroll to bottom
                    const now = new Date();
                    if (now.getTime() > lastScrollToBottomTimestamp + 500) {
                      lastScrollToBottomTimestamp = now.getTime();
                      document.querySelector('#conversation-bottom')?.scrollIntoView();
                    }
                  }
                } else {
                  const lastMessageWrapper = [...document.querySelectorAll('[id^="message-wrapper-"]')].pop();
                  if (lastMessageWrapper?.dataset?.role !== 'assistant') {
                    const existingRowUser = document.querySelector(`[id="message-wrapper-${userMessageId}"][data-role="user"]`);

                    if (existingRowUser && !isRenderingAssistantRow) {
                      isRenderingAssistantRow = true;
                      let threadCount = Object.keys(conversation).length > 0 ? conversation?.mapping[userMessageId]?.children?.length || 1 : 1;
                      if (regenerateResponse && !lastMessageFailed) threadCount += 1;
                      const assistantRow = rowAssistant(conversation, assistantData, threadCount, threadCount, models, settings, gizmoData, true, true);

                      const conversationBottom = document.querySelector('#conversation-bottom');
                      conversationBottom.insertAdjacentHTML('beforebegin', assistantRow);
                      setTimeout(() => {
                        const lastMessagePluginToggleButton = [...document.querySelectorAll('[id^="message-plugin-toggle-"]')].pop();
                        if (lastMessagePluginToggleButton) {
                          addMessagePluginToggleButtonsEventListeners([lastMessagePluginToggleButton]);
                        }
                        addMissingGizmoNamesAndAvatars();
                      }, 300);
                      if (!scrolUpDetected && settings.autoScroll) {
                        conversationBottom.scrollIntoView();
                      }
                    }
                  }
                }
                // addCopyCodeButtonsEventListeners();
              } catch (err) {
                // console.warn('error', err);
                try {
                  const data = decodedBody ? JSON.parse(decodedBody) : {};

                  if (data?.error) {
                    toast(data.error, 'error');
                  }
                } catch (err2) {
                  // console.warn('error', err);
                  // console.warn(data);
                }
              }
            }
          });
          spws.addEventListener('error', (err) => {
            spws.close();
            // Firefox returns error when closing chat stream
            // if firefox and no error data, do nothing
            if (isFirefox && !err.data) return;
            if (settings.chatEndedSound) {
              playSound('beep');
            }
            isGenerating = false;
            chunkNumber = 1;
            totalChunks = 1;
            remainingText = '';
            finalSummary = '';
            shouldSubmitFinalSummary = false;
            syncDiv.style.opacity = '1';
            const submitButton = document.querySelector('[data-testid="send-button"]');
            // submitButton.disabled = false;
            if (submitButton) {
              submitButton.classList.replace('rounded-full', 'rounded-lg');
              submitButton.innerHTML = '<span class="" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
              // find all div with class result-streaming
              const resultStreamingDivs = document.querySelectorAll('.result-streaming');
              resultStreamingDivs?.forEach((div) => {
                div.classList.remove('result-streaming');
              });
            }
            // eslint-disable-next-line no-console
            // console.warn(err);
            if (err.data) {
              try {
                const error = JSON.parse(err.data);
                const errorCode = error?.detail?.code;
                let errorMessage = typeof error.detail === 'string' ? error.detail : error.detail.message;
                if (errorCode === 'model_cap_exceeded') {
                  // seconds until cap is cleared
                  const clearsIn = error?.detail?.clears_in;
                  const date = new Date();
                  date.setSeconds(date.getSeconds() + clearsIn);
                  // print expire hour minute from local time
                  const hour = date.getHours();
                  const minute = date.getMinutes();
                  const ampm = hour >= 12 ? 'pm' : 'am';
                  const hour12 = hour % 12;
                  const hour12Display = hour12 || 12;
                  const minuteDisplay = minute < 10 ? `0${minute}` : minute;
                  const capExpiresAt = `${hour12Display}:${minuteDisplay}${ampm}`;
                  chrome.storage.local.set({ capExpiresAt });
                  errorMessage = `Você atingiu o limite de uso atual para este modelo. Você pode continuar com o modelo padrão agora ou tentar novamente em ${capExpiresAt}.`;
                } else {
                  replaceTextAreaElement(settings);
                  chrome.storage.local.set({ capExpiresAt: '' });
                }
                const conversationBottom = document.querySelector('#conversation-bottom');
                const errorMessageElement = `<div id="response-error-msg" style="max-width:400px" class="py-2 px-3 my-2 border rounded-md text-sm text-token-text-secondary border-red-500 bg-red-500/10">${errorMessage}</div>`;
                conversationBottom.insertAdjacentHTML('beforebegin', errorMessageElement);
                if (!scrolUpDetected && settings.autoScroll) {
                  conversationBottom.scrollIntoView({ behavior: 'smooth' });
                }
              } catch (err2) {
                // console.error(err);
              }
            }
          });
          generateChatWS(userInputParts, conversation?.id, userMessageId, parentId, arkoseToken, gizmoData?.resource, metadata, lastPromptSuggestions, saveHistory, authorRole, authorName, action, contentType, lastMessageFailed).then(() => {
            const curSubmitButton = document.querySelector('[data-testid="send-button"]');
            curSubmitButton.classList.replace('rounded-lg', 'rounded-full');
            curSubmitButton.innerHTML = '<span class="" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 384 512" width="16" height="16" class="text-white dark:text-black"><path d="M384 128v255.1c0 35.35-28.65 64-64 64H64c-35.35 0-64-28.65-64-64V128c0-35.35 28.65-64 64-64H320C355.3 64 384 92.65 384 128z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
          }).catch((err) => {
            spws.close();
            // Firefox returns error when closing chat stream
            // if firefox and no error data, do nothing
            if (isFirefox && !err.data) return;
            if (settings.chatEndedSound) {
              playSound('beep');
            }
            isGenerating = false;
            chunkNumber = 1;
            totalChunks = 1;
            remainingText = '';
            finalSummary = '';
            shouldSubmitFinalSummary = false;
            syncDiv.style.opacity = '1';
            const submitButton = document.querySelector('[data-testid="send-button"]');
            // submitButton.disabled = false;
            submitButton.classList.replace('rounded-full', 'rounded-lg');
            submitButton.innerHTML = '<span class="" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
            const resultStreamingDivs = document.querySelectorAll('.result-streaming');
            resultStreamingDivs?.forEach((div) => {
              div.classList.remove('result-streaming');
            });

            // eslint-disable-next-line no-console
            if (err) {
              try {
                const errorCode = err?.detail?.code;
                let errorMessage = typeof err.detail === 'string' ? err.detail : err.detail.message;
                if (errorCode === 'model_cap_exceeded') {
                  // seconds until cap is cleared
                  const clearsIn = err?.detail?.clears_in;
                  const date = new Date();
                  date.setSeconds(date.getSeconds() + clearsIn);
                  // print expire hour minute from local time
                  const hour = date.getHours();
                  const minute = date.getMinutes();
                  const ampm = hour >= 12 ? 'pm' : 'am';
                  const hour12 = hour % 12;
                  const hour12Display = hour12 || 12;
                  const minuteDisplay = minute < 10 ? `0${minute}` : minute;
                  const capExpiresAt = `${hour12Display}:${minuteDisplay}${ampm}`;
                  chrome.storage.local.set({ capExpiresAt });
                  errorMessage = `Você atingiu o limite de uso atual para este modelo. Você pode continuar com o modelo padrão agora ou tentar novamente em ${capExpiresAt}.`;
                } else {
                  replaceTextAreaElement(settings);
                  chrome.storage.local.set({ capExpiresAt: '' });
                }
                const conversationBottom = document.querySelector('#conversation-bottom');
                const errorMessageElement = `<div id="response-error-msg" style="max-width:400px" class="py-2 px-3 my-2 border rounded-md text-sm text-token-text-secondary border-red-500 bg-red-500/10">${errorMessage}</div>`;
                conversationBottom.insertAdjacentHTML('beforebegin', errorMessageElement);
                if (!scrolUpDetected && settings.autoScroll) {
                  conversationBottom.scrollIntoView({ behavior: 'smooth' });
                }
              } catch (err2) {
                // console.error(err2);
              }
            }
          });
        });
      });
    }
  }, 200);
}
function submitFinalSummary() {
  if (!shouldSubmitFinalSummary) return;
  if (finalSummary === '') return;
  const inputForm = document.querySelector('#prompt-input-form');
  if (!inputForm) return;
  const submitButton = document.querySelector('[data-testid="send-button"]');
  if (!submitButton) return;
  const textAreaElement = document.querySelector('#prompt-textarea');
  if (!textAreaElement) return;

  textAreaElement.value = `Aqui está o resumo final da nossa conversa:
  ${finalSummary}
  Responda com OK: [Resumo recebido!]. Não responda com mais nada!`;
  shouldSubmitFinalSummary = false;
  finalSummary = '';
  textAreaElement.focus();
  textAreaElement.dispatchEvent(new Event('input', { bubbles: true }));
  textAreaElement.dispatchEvent(new Event('change', { bubbles: true }));
  setTimeout(() => {
    submitButton.click();
  }, 300);
}
function insertNextChunk(settings, previousMessage) {
  if (settings.autoSummarize) {
    finalSummary = `${finalSummary}\n${(previousMessage?.content?.parts || [])?.filter((p) => typeof p === 'string')?.join('\n')}`;

    if (shouldSubmitFinalSummary) {
      submitFinalSummary();
      return;
    }
  }
  if (!settings.autoSplit || totalChunks === 1 || remainingText === '') {
    if (settings.autoClick) {
      const continueButton = document.getElementById('continue-conversation-button');
      if (!continueButton) return;
      continueButton.click();
    }
    return;
  }
  const textAreaElement = document.querySelector('#prompt-textarea');
  if (!textAreaElement) return;
  const submitButton = document.querySelector('[data-testid="send-button"]');
  if (!submitButton) return;
  const lastNewLineIndexBeforeLimit = settings.autoSplitLimit > remainingText.length ? settings.autoSplitLimit : getLastIndexOf(remainingText, settings.autoSplitLimit);

  textAreaElement.value = `[INÍCIO CHUNK ${chunkNumber}/${totalChunks}]
${remainingText.slice(0, lastNewLineIndexBeforeLimit)}
[FINAL CHUNK ${chunkNumber}/${totalChunks}]
${settings.autoSplitChunkPrompt}`;
  textAreaElement.focus();
  textAreaElement.dispatchEvent(new Event('input', { bubbles: true }));
  textAreaElement.dispatchEvent(new Event('change', { bubbles: true }));
  setTimeout(() => {
    submitButton.click();
  }, 300);
}

function getLastIndexOf(text, position) {
  // if text down't include \n or . or ? or ! return position
  if (!text.includes('\n') && !text.includes('.') && !text.includes('?') && !text.includes('!')) return position;
  // last index of space before position
  const space = text.lastIndexOf(' ', position);
  // last index of \n before position
  const newLine = text.lastIndexOf('\n', position);
  // last index of . before newLine
  const period = text.lastIndexOf('.', position);
  // last index of ? before newLine
  const questionMark = text.lastIndexOf('?', position);
  // last index of ! before newLine
  const exclamationMark = text.lastIndexOf('!', position);
  // return the closest index to position
  return Math.max(space, newLine, period, questionMark, exclamationMark) + 1;
}
// eslint-disable-next-line no-unused-vars
function overrideSubmitForm() {
  const inputForm = document.querySelector('#prompt-input-form');
  if (!inputForm) return;
  inputForm.addEventListener('submit', (e) => {
    const textAreaElement = document.querySelector('#prompt-textarea');
    let textAreaValue = textAreaElement.value.trim();
    e.preventDefault();
    e.stopPropagation();
    if (isGenerating) return;

    // get all words wrapped in {{ and }}
    chrome.storage.local.get(['settings', 'conversations', 'models', 'selectedModel', 'account', 'chatgptAccountId'], ({
      settings, conversations, models, account, selectedModel, chatgptAccountId,
    }) => {
      const fileTemplate = textAreaValue.includes('{{files}}');
      const templateWords = textAreaValue.match(/{{(.*?)}}/g);
      if (settings.promptTemplate && fileTemplate) {
        const uploadFileButton = document.querySelector('#upload-file-button');
        if (uploadFileButton) {
          uploadFileButton.click();
        } else {
          toast('Você quis dizer usar {{files}} para fazer upload de um arquivo? Por favor, selecione um modelo GPT-4.', 'success', 6000);
        }
      } else if (settings.promptTemplate && templateWords?.length > 0) {
        // open template words modal and wait for user to select a word. the when user submit, submit the input form with the replacement

        createTemplateWordsModal(templateWords);
        setTimeout(() => {
          const firstTemplateWordInput = document.querySelector('[id^=template-input-]');
          if (firstTemplateWordInput) {
            firstTemplateWordInput.focus();
            firstTemplateWordInput.value = '';
          }
        }, 100);
      } else {
        textAreaElement.value = '';

        if (templateWords?.length > 0) {
          if (!window.localStorage.getItem('seenPromptTemplateToast')) {
            toast('Você quis dizer usar {{prompt templates}}? Se sim, primeiro ative isso no menu de Configurações.', 'success', 6000);
            window.localStorage.setItem('seenPromptTemplateToast', 'true');
          }
        }
        const { pathname } = new URL(window.location.toString());
        // const isSharedConversation = pathname.startsWith('/share/') && window.location.href.endsWith('/continue');
        const conversationId = pathname.split('/c/').pop().replace(/[^a-z0-9-]/gi, '');
        const anyUserMessageWrappers = document.querySelectorAll('[id^="message-wrapper-"][data-role="user"]').length > 0;

        const imageAssets = curImageAssets;
        const fileAttachments = curFileAttachments;
        curImageAssets = [];
        curFileAttachments = [];
        // if conversationId is valid and there are any user messages, submit chat
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(conversationId) && anyUserMessageWrappers) {
          const conversation = conversations[conversationId];
          chrome.storage.sync.get(['name', 'avatar'], (result) => {
            // let text = textAreaElement.value.trim();
            if (chunkNumber === 1) {
              finalSummary = '';
              if (settings.autoSplit && textAreaValue.length > settings.autoSplitLimit && !runningPromptChainSteps) {
                totalChunks = Math.ceil(textAreaValue.length / settings.autoSplitLimit);
                const lastNewLineIndexBeforeLimit = settings.autoSplitLimit > textAreaValue.length ? settings.autoSplitLimit : getLastIndexOf(textAreaValue, settings.autoSplitLimit);
                remainingText = textAreaValue.substring(lastNewLineIndexBeforeLimit);
                textAreaValue = `${settings.autoSplitInitialPrompt}[INÍCIO CHUNK ${chunkNumber}/${totalChunks}]
${textAreaValue.substring(0, lastNewLineIndexBeforeLimit)}
[FINAL CHUNK ${chunkNumber}/${totalChunks}]
${settings.autoSplitChunkPrompt}`;
                chunkNumber += 1;
              } else {
                textAreaValue = generateInstructions(conversation, settings, textAreaValue);
              }
            } else if (chunkNumber === totalChunks) {
              if (totalChunks > 1 && settings.autoSummarize) shouldSubmitFinalSummary = true;
              chunkNumber = 1;
              totalChunks = 1;
              remainingText = '';
            } else {
              chunkNumber += 1;
              const lastNewLineIndexBeforeLimit = settings.autoSplitLimit > remainingText.length ? settings.autoSplitLimit : getLastIndexOf(remainingText, settings.autoSplitLimit);
              remainingText = remainingText.slice(lastNewLineIndexBeforeLimit);
            }
            const messageId = self.crypto.randomUUID();
            const allMessages = document.querySelectorAll('[id^="message-wrapper-"]');
            const lastMessage = allMessages[allMessages.length - 1];
            const parentId = lastMessage?.id?.split('message-wrapper-')[1] || self.crypto.randomUUID();
            const conversationBottom = document.querySelector('#conversation-bottom');
            if (textAreaValue && settings.useCustomInstruction) {
              textAreaValue += settings.customInstruction;
            }
            const initialMetadata = {};
            // check if a gizmo is tagged
            const taggedGizmoElement = document.getElementById('tagged-gizmo-wrapper');
            if (taggedGizmoElement) {
              initialMetadata.gizmo_id = taggedGizmoElement.dataset.gizmoid;
            }

            // check if user is replying to a message
            const replyToPreviewContent = document.querySelector('#reply-to-preview-content');
            if (replyToPreviewContent) {
              initialMetadata.targeted_reply = replyToPreviewContent.innerText;
              document.getElementById('reply-to-preview-wrapper')?.remove();
            }
            // eslint-disable-next-line no-nested-ternary
            const node = selectedModel.tags.includes('gpt4')
              ? { message: { id: messageId, content: { parts: [...imageAssets, textAreaValue] }, metadata: fileAttachments?.length > 0 ? { attachments: fileAttachments, ...initialMetadata } : initialMetadata } }
              : { message: { id: messageId, content: { parts: [textAreaValue] }, metadata: initialMetadata } };

            const userRow = rowUser(conversation, node, 1, 1, result.name, result.avatar, settings);
            // if last message data-role !== user, insert user row before conversation bottom
            if (lastMessage?.dataset?.role !== 'user') {
              replaceAllConfimationWrappersWithActionStopped();
              conversationBottom.insertAdjacentHTML('beforebegin', userRow);
            }
            if (!scrolUpDetected && settings.autoScroll) {
              conversationBottom.scrollIntoView({ behavior: 'smooth' });
            }
            if (textAreaValue || fileAttachments.length > 0) {
              isGenerating = true;

              submitChat(textAreaValue, conversation, messageId, parentId, settings, account, chatgptAccountId, models, selectedModel, imageAssets, fileAttachments, false, false, 'user', '', initialMetadata);
              const fileWrapperElement = inputForm.querySelector('#file-wrapper-element');
              if (fileWrapperElement) {
                fileWrapperElement.remove();
              }
              textAreaElement.value = '';
              textAreaElementOldValue = '';
              textAreaElement.style.height = '52px';
              updateInputCounter('');
            }
          });
        } else { // starting a new conversation
          chrome.runtime.sendMessage({
            checkHasSubscription: true,
            detail: {
              forceRefresh: false,
            },
          }, (hasSubscription) => {
            chrome.storage.sync.get(['name', 'avatar'], (result) => {
              // let text = textAreaElement.value.trim();
              if (chunkNumber === 1) {
                finalSummary = '';
                if (settings.autoSplit && textAreaValue.length > settings.autoSplitLimit) {
                  totalChunks = Math.ceil(textAreaValue.length / settings.autoSplitLimit);
                  const lastNewLineIndexBeforeLimit = settings.autoSplitLimit > textAreaValue.length ? settings.autoSplitLimit : getLastIndexOf(textAreaValue, settings.autoSplitLimit);
                  remainingText = textAreaValue.substring(lastNewLineIndexBeforeLimit);
                  textAreaValue = `${settings.autoSplitInitialPrompt}[INÍCIO CHUNK ${chunkNumber}/${totalChunks}]
${textAreaValue.substring(0, lastNewLineIndexBeforeLimit)}
[FINAL CHUNK ${chunkNumber}/${totalChunks}]
${settings.autoSplitChunkPrompt}`;
                  chunkNumber += 1;
                } else {
                  textAreaValue = generateInstructions({}, settings, textAreaValue);
                }
              } else if (chunkNumber === totalChunks) {
                if (totalChunks > 1 && settings.autoSummarize) shouldSubmitFinalSummary = true;
                chunkNumber = 1;
                totalChunks = 1;
                remainingText = '';
              } else {
                chunkNumber += 1;
                const lastNewLineIndexBeforeLimit = settings.autoSplitLimit > remainingText.length ? settings.autoSplitLimit : getLastIndexOf(remainingText, settings.autoSplitLimit);
                remainingText = remainingText.slice(lastNewLineIndexBeforeLimit);
              }

              const messageId = self.crypto.randomUUID();
              if (textAreaValue && settings.useCustomInstruction) {
                textAreaValue += settings.customInstruction;
              }

              const initialMetadata = {};
              // check if a gizmo is tagged
              const taggedGizmoElement = document.getElementById('tagged-gizmo-wrapper');
              if (taggedGizmoElement) {
                initialMetadata.gizmo_id = taggedGizmoElement.dataset.gizmoid;
              }

              // eslint-disable-next-line no-nested-ternary
              const node = selectedModel.tags.includes('gpt4')
                ? { message: { id: messageId, content: { parts: [...imageAssets, textAreaValue] }, metadata: { attachments: fileAttachments, ...initialMetadata } } }
                : { message: { id: messageId, content: { parts: [textAreaValue] }, metadata: initialMetadata } };

              const allMessages = document.querySelectorAll('[id^="message-wrapper-"]');
              const lastMessage = allMessages[allMessages.length - 1];
              const parentId = lastMessage?.id?.split('message-wrapper-')[1] || self.crypto.randomUUID();
              // remove main first child
              const presentation = document.querySelector('main > div[role=presentation]');
              presentation.classList = 'flex h-full flex-col';
              presentation?.firstChild.remove();

              const outerDiv = document.createElement('div');
              outerDiv.classList = 'flex-1 overflow-hidden';
              const innerDiv = document.createElement('div');
              innerDiv.classList = 'h-full overflow-y-auto';
              innerDiv.style = 'scroll-behavior: smooth;';
              innerDiv.id = 'conversation-inner-div';
              addScrollDetector(innerDiv);
              const conversationDiv = document.createElement('div');
              conversationDiv.classList = 'flex flex-col items-center text-sm h-full bg-token-main-surface-primary';
              const userRow = rowUser({}, node, 1, 1, result.name, result.avatar, settings);
              replaceAllConfimationWrappersWithActionStopped();
              conversationDiv.innerHTML = userRow;
              const topDiv = `<div id="conversation-top" class="w-full flex relative items-center justify-center border-b border-black/10 dark:border-gray-900/50 text-token-text-primary group ${settings.alternateMainColors ? 'bg-token-main-surface-tertiary' : 'bg-token-main-surface-primary'}" style="min-height:56px;"><span id="conversation-top-title" class="flex">Novo Chat</span>${conversationSettingsMenu(hasSubscription)}</div>`;
              conversationDiv.insertAdjacentHTML('afterbegin', topDiv);

              const bottomDiv = document.createElement('div');
              bottomDiv.id = 'conversation-bottom';
              bottomDiv.classList = 'w-full h-32 md:h-48 flex-shrink-0';
              conversationDiv.appendChild(bottomDiv);
              const bottomDivContent = document.createElement('div');
              bottomDivContent.classList = 'relative text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl flex lg:px-0';
              if (settings.customConversationWidth) {
                bottomDivContent.style.maxWidth = `${settings.conversationWidth}%`;
              }
              bottomDiv.appendChild(bottomDivContent);
              if (settings.showTotalWordCount) {
                const totalCounter = document.createElement('div');
                totalCounter.id = 'total-counter';
                totalCounter.style = 'position: absolute; top: 0px; right: 0px; font-size: 10px; color: rgb(153, 153, 153); opacity: 0.8;';
                bottomDivContent.appendChild(totalCounter);
              }
              innerDiv.appendChild(conversationDiv);
              outerDiv.appendChild(innerDiv);
              presentation.prepend(outerDiv);
              if (textAreaValue || fileAttachments.length > 0) {
                isGenerating = true;
                submitChat(textAreaValue, {}, messageId, parentId, settings, account, chatgptAccountId, models, selectedModel, imageAssets, fileAttachments, false, false, 'user', '', initialMetadata);
                const fileWrapperElement = inputForm.querySelector('#file-wrapper-element');
                if (fileWrapperElement) {
                  fileWrapperElement.remove();
                }
                textAreaElement.value = '';
                textAreaElementOldValue = '';
                textAreaElement.style.height = '52px';
                updateInputCounter('');
              }
            });
          });
        }
      }
    });
  });

  const submitButton = document.querySelector('[data-testid="send-button"]');
  const submitButtonClone = submitButton.cloneNode(true);
  submitButtonClone.type = 'button';
  submitButtonClone.addEventListener('click', () => {
    const textAreaElement = document.querySelector('#prompt-textarea');
    if (isGenerating) {
      chatStreamIsClosed = true;
      stopConversationWS();
      return;
    }
    textAreaElement.style.height = '52px';
    if (textAreaElement.value.trim().length === 0 && curFileAttachments?.length === 0) return;
    addUserPromptToHistory(textAreaElement.value.trim());
    inputForm.dispatchEvent(new Event('submit', { cancelable: true }));
  });
  submitButton.parentNode.replaceChild(submitButtonClone, submitButton);
}

function setBackButtonDetection() {
  window.addEventListener('popstate', () => {
    const { pathname } = new URL(window.location.toString());
    const conversationId = pathname.split('/c/').pop().replace(/[^a-z0-9-]/gi, '');
    chrome.storage.local.get(['conversations'], (result) => {
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(conversationId)) {
        const { conversations } = result;
        if (conversations && conversations[conversationId]) {
          const conversationElement = document.querySelector(`#conversation-button-${conversationId}`);
          const focusedConversations = document.querySelectorAll('.selected');
          focusedConversations.forEach((c) => {
            c.classList = notSelectedClassList;
          });
          // set selected conversation
          if (conversationElement) {
            conversationElement.classList = selectedClassList;
          }
          loadConversation(conversationId);
        }
      } else if (pathname.startsWith('/g/g-')) {
        const gizmoId = getGizmoIdFromUrl();
        getGizmoById(gizmoId).then((gizmoData) => {
          showNewChatPage(gizmoData?.resource);
        });
      } else if (pathname === '/') {
        showNewChatPage();
      }
    });
  });
}

// eslint-disable-next-line no-unused-vars
function loadConversationList(skipFullReload = false) {
  chrome.storage.local.get(['conversationsOrder', 'conversations', 'settings'], (result) => {
    const { conversations, settings } = result;
    if (typeof conversations !== 'undefined') {
      replaceOriginalConversationList();
      createSearchBox();
      if (typeof settings === 'undefined' || settings.autoSyncCount > 0) {
        addHistorySyncingMessage();
      }
      loadStorageConversations(result.conversations, result.conversationsOrder, result.conversationsOrder);
      if (!skipFullReload) {
        initializeGallery();
        initializeCustomSelectionMenu();
        updateNewChatButtonSynced();
        renderGPTList();
        const {
          origin, pathname, search,
        } = new URL(window.location.toString());
        const conversationId = pathname.split('/c/').pop().replace(/[^a-z0-9-]/gi, '');
        const conversationList = document.querySelector('#conversation-list');
        if (!conversationList) return;

        if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(conversationId)) {
          const conversation = conversations?.[conversationId];
          if (conversation && conversation.id) {
            setTimeout(() => {
              const focusedConversation = conversationList.querySelector(`#conversation-button-${conversationId}`);

              if (focusedConversation) {
                focusedConversation.scrollIntoView({ block: 'nearest' });
              }
            }, 500);

            loadConversation(conversationId);
            const conversationElement = document.querySelector(`#conversation-button-${conversationId}`);
            conversationElement?.scrollIntoView({ block: 'center' });

            if (search) {
              window.history.replaceState({}, '', `${origin}${pathname}`);
              handleQueryParams(search);
            }
          } else {
            unarchiveConversationById(conversationId, false).then(({ conv, convExistsInRemoteButIsArchived }) => {
              if (convExistsInRemoteButIsArchived) {
                const historySyncMessage = document.querySelector('#history-sync-message');
                const isArchived = conv.is_archived && settings?.autoSyncCount > 0 && !historySyncMessage; // if autoSyncCount is 0, there is a good chance the convesation still exists in remote but we are just not seeing it. if autoSyncCount > 0, it less likely to go to a chat that is archived in remote but not locally, so we consider it as archived(but that's not the case always). if historySyncMessage exists, it means we are currently doing the initial history syncing, so we don't want to show the conversation as archived
                loadConversation(conversationId, isArchived);
              } else {
                showNewChatPage();
              }
            });
          }
        } else if (pathname.startsWith('/g/g-')) {
          const gizmoId = getGizmoIdFromUrl();
          getGizmoById(gizmoId).then((gizmoData) => {
            showNewChatPage(gizmoData?.resource);
          });
        } else if (pathname.startsWith('/gpts')) {
          const category = pathname.includes('/gpts/') ? pathname.split('/gpts/').pop() : 'all';
          if (settings?.enhanceGPTStore) {
            renderGizmoDiscoveryPage(category);
          }
        } else if (pathname === '/') {
          showNewChatPage();
        }
        addScrollButtons();
        initializePromptChain();
        setBackButtonDetection();
        setTimeout(() => {
          addArkoseCallback();
          initializeAutoArchive();
        }, 1000);
      }
    }
  });
}
