/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-unused-vars
/* global arkoseTrigger, TurndownService, generateInstructions, generateChat, formatDate, loadConversation, resetSelection, initializeAutoDelete, ChatGPTIcon, rowUser, rowAssistant, updateOrCreateConversation, replaceTextAreaElemet, isGenerating:true, generateTitle, debounce, initializeStopGeneratingResponseButton, showHideTextAreaElement, showNewChatPage, chatStreamIsClosed:true, addScrollDetector, scrolUpDetected:true, Sortable, updateInputCounter, addUserPromptToHistory, getGPT4CounterMessageCapWindow, createFolder, getConversationElementClassList, notSelectedClassList, selectedClassList, conversationActions, addCheckboxToConversationElement, createConversation, deleteConversation, handleQueryParams, addScrollButtons, updateTotalCounter, isWindows, createTemplateWordsModal, initializePromptChain, initializeUpgradeButton, insertNextChain, runningPromptChainSteps:true, runningPromptChainIndex:true, lastPromptSuggestions, playSound, toast, curImageAssets:true, curFileAttachments:true, addConversationsEventListeners, addFinalCompletionClassToLastMessageWrapper, addMessagePluginToggleButtonsEventListeners, addNodeToRowAssistant, showDefaultFolderActions, updateLastMessagePluginDropdown, textAreaElementOldValue:true, addArkoseCallback, conversationSettingsMenu, toggleKeepFoldersAtTheTop, addConversationSettingsMenuEventListener, addCustomInstructionInfoIconEventListener, getGizmoById, observeGizmoBootstrapList, updateGPTEditIcon, renderGizmoDiscoveryPage, initializeCustomSelectionMenu,getGizmoIdFromUrl, getMousePosition, updateGizmoSidebar, formatTime, replaceAllConfimationWrappersWithActionStopped, initializeGallery, resetFolders, generateRandomDarkColor */

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
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  // eslint-disable-next-line no-unused-vars
  const sortable = Sortable.create(conversationList, {
    // multiDrag: true,
    // selectedClass: 'multi-drag-selected',
    // handle: '[id^="checkbox-wrapper-"], [id^="conversation-button-"], [id^="wrapper-folder-"]',
    group: {
      name: 'conversation-list',
      pull: true,
      // eslint-disable-next-line func-names, object-shorthand, no-unused-vars
      put: function (to, from, dragged) {
        return from.el.id !== 'folder-content-trash';
      },
    },
    direction: 'vertical',
    invertSwap: true,
    draggable: isFirefox ? '[id^="conversation-button-"], [id^="wrapper-folder-"]:not([id="wrapper-folder-trash"]' : '[id^="conversation-button-"]:not(:has([id^=conversation-rename-])), [id^="wrapper-folder-"]:not([id="wrapper-folder-trash"]):not(:has([id^=rename-folder-])):not(:has([id^=conversation-rename-]))',
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

      if (!isFolder && isToFolder && toId === 'trash') {
        deleteConversationOnDragToTrash(item.id.split('conversation-button-')[1]);
      }
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
          // eslint-disable-next-line no-lonely-if
          if (isFolder) {
            conversationsOrder.splice(newDraggableIndex, 0, movingItem);
          } else {
            conversationsOrder.splice(newDraggableIndex, 0, movingItem);
          }
          chrome.storage.local.set({ conversationsOrder }, () => {
            const folderCount = Array.from(document.querySelectorAll('#conversation-list > [id^=wrapper-folder-]:not(#wrapper-folder-trash)')).length;
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
function deleteConversationOnDragToTrash(conversationId) {
  deleteConversation(conversationId);
  const conversationElement = document.querySelector(`#conversation-button-${conversationId}`);
  if (conversationElement && conversationElement.classList.contains('selected')) {
    showNewChatPage();
  }

  conversationElement.querySelector('[id^=checkbox-wrapper-]').remove();
  conversationElement.querySelector('[id^=actions-wrapper-]').remove();
  if (conversationElement.classList.contains('selected')) {
    showNewChatPage();
  }
  conversationElement.classList = notSelectedClassList;
  conversationElement.style.opacity = 0.7;
  conversationElement.classList.remove('hover:pr-20');
  const conversationElementIcon = conversationElement.querySelector('img');
  conversationElementIcon.src = chrome.runtime.getURL('icons/trash.png');
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
  searchbox.classList = 'w-full px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800';
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
  searchbox.addEventListener('input', debounce((event) => {
    const searchValue = event.target.value.toLowerCase();
    chrome.storage.local.get(['conversationsOrder', 'conversations'], (result) => {
      const { conversations, conversationsOrder } = result;
      // remove existing conversations
      const curConversationList = document.querySelector('#conversation-list');
      const searchWrapper = document.querySelector('#conversation-search-wrapper');
      // remove conversations list childs other than the search box wrapper (first child)
      conversationList.innerHTML = '';
      curConversationList.prepend(searchWrapper);
      const searchInput = document.querySelector('#conversation-search');
      searchInput.value = searchValue;

      const allConversations = Object.values(conversations) || [];
      let filteredConversations = allConversations.sort((a, b) => b.update_time - a.update_time);

      resetSelection();
      if (searchValue) {
        filteredConversations = allConversations?.filter((c) => (
          c.title?.toLowerCase()?.includes(searchValue.toLowerCase())
          || Object.values(c.mapping).map((m) => m?.message?.content?.parts?.filter((p) => typeof p === 'string')?.join(' ')?.replace(/## Instructions[\s\S]*## End Instructions\n\n/, ''))
            .join(' ')?.toLowerCase()
            .includes(searchValue.toLowerCase())));
        const filteredConversationIds = filteredConversations.map((c) => c?.id);
        // convert filtered conversations to object with id as key
        const filteredConversationsObj = filteredConversations.reduce((acc, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {});
        loadStorageConversations(filteredConversationsObj, filteredConversationIds, searchValue);
      } else {
        loadStorageConversations(conversations, conversationsOrder, searchValue);
        const { pathname } = new URL(window.location.toString());
        const conversationId = pathname.split('/c/').pop().replace(/[^a-z0-9-]/gi, '');
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(conversationId)) {
          loadConversation(conversationId, '', false);
        }
      }
    });
  }, 500));

  const newFolderButton = document.createElement('button');
  newFolderButton.id = 'new-folder-button';
  newFolderButton.classList = 'w-12 h-full flex items-center justify-center rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 border border-gray-800';
  const newFoolderIcon = document.createElement('img');
  newFoolderIcon.classList = 'w-5 h-5';
  newFoolderIcon.src = chrome.runtime.getURL('icons/new-folder.png');
  newFolderButton.append(newFoolderIcon);
  newFolderButton.addEventListener('mouseover', () => {
    newFolderButton.classList.remove('border-gray-800');
    newFolderButton.classList.add('bg-gray-600', 'border-gray-300');
  });
  newFolderButton.addEventListener('mouseout', () => {
    newFolderButton.classList.add('border-gray-800');

    newFolderButton.classList.remove('bg-gray-600', 'border-gray-300');
  });
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
        name: 'New Folder',
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
// add new conversation to the top of the list
// eslint-disable-next-line no-unused-vars
function addGizmoToList(gizmoId, isRecent = true) {
  if (!gizmoId) return;
  const gptList = document.querySelector('#gpt-list');
  // check if gizmo already in sidebar. Find an a element with href including gizmo_id
  const existingGizmo = gptList.querySelector(`a[href*="${gizmoId}"]`);
  if (existingGizmo) return;

  let gptListRecentBorder = document.querySelector('#gpt-list-recent-border');
  if (isRecent && !gptListRecentBorder) {
    gptListRecentBorder = document.createElement('div');
    gptListRecentBorder.id = 'gpt-list-recent-border';
    gptListRecentBorder.classList = 'my-2 ml-2 h-px w-7 bg-token-border-light';
    // add before last item in gptList (explore button)
    gptList.insertBefore(gptListRecentBorder, gptList.lastChild);
  }
  getGizmoById(gizmoId).then((gizmoData) => {
    const gizmoElement = `<div class="pb-0.5 last:pb-0" tabindex="0" data-projection-id="48"><a class="group flex h-10 items-center gap-2 rounded-lg px-2 font-medium hover:bg-token-surface-primary" href="/g/${gizmoData?.resource?.gizmo?.short_url}"><div class="h-7 w-7 flex-shrink-0"><div class="gizmo-shadow-stroke overflow-hidden rounded-full"><img src="${gizmoData?.resource?.gizmo?.display.profile_picture_url}" class="h-full w-full bg-token-surface-secondary dark:bg-token-surface-tertiary" alt="GPT" width="80" height="80"></div></div><div class="grow overflow-hidden text-ellipsis whitespace-nowrap text-sm text-token-text-primary">${gizmoData?.resource?.gizmo?.display.name}</div><div class="flex gap-3"><div class="text-token-text-tertiary"><button id="sidebar-gizmo-menu-button-${gizmoData?.resource?.gizmo?.id}" class="flex text-token-text-tertiary invisible group-hover:visible" type="button" aria-haspopup="menu" aria-expanded="false" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path></svg></button></div><span class="flex items-center" data-state="closed"><button class="invisible text-token-text-tertiary hover:text-token-text-secondary group-hover:visible"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.7929 2.79289C18.0118 1.57394 19.9882 1.57394 21.2071 2.79289C22.4261 4.01184 22.4261 5.98815 21.2071 7.20711L12.7071 15.7071C12.5196 15.8946 12.2652 16 12 16H9C8.44772 16 8 15.5523 8 15V12C8 11.7348 8.10536 11.4804 8.29289 11.2929L16.7929 2.79289ZM19.7929 4.20711C19.355 3.7692 18.645 3.7692 18.2071 4.2071L10 12.4142V14H11.5858L19.7929 5.79289C20.2308 5.35499 20.2308 4.64501 19.7929 4.20711ZM6 5C5.44772 5 5 5.44771 5 6V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V14C19 13.4477 19.4477 13 20 13C20.5523 13 21 13.4477 21 14V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34314 4.34315 3 6 3H10C10.5523 3 11 3.44771 11 4C11 4.55228 10.5523 5 10 5H6Z" fill="currentColor"></path></svg></button></span></div></a></div>`;
    // add after border or before border
    if (isRecent) {
      gptListRecentBorder.insertAdjacentHTML('afterend', gizmoElement);
      // get all elements after border that contains an a elemnt with href starting with /g/g-
      const gizmoElements = Array.from(document.querySelectorAll('#gpt-list-recent-border ~ div > a[href^="/g/g-"]'));
      // keep the first 2, remove the rest
      gizmoElements.slice(2).forEach((g) => g?.parentElement?.remove());
    } else {
      if (gptListRecentBorder) {
        gptListRecentBorder.insertAdjacentHTML('beforebegin', gizmoElement);
      } else {
        const exploreButton = document.querySelector('#gpt-list-explore-button');
        exploreButton.insertAdjacentHTML('beforebegin', gizmoElement);
      }
    }

    // add event listener to menu button
    const menuButton = document.querySelector(`#sidebar-gizmo-menu-button-${gizmoData?.resource?.gizmo?.id}`);
    menuButton?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const menu = document.querySelector('#sidebar-gizmo-menu');
      if (menu) menu.remove();
      showSidebarGizmoMenu(e, gizmoData?.resource?.gizmo?.id);
    });
    // click anywhere on the page to close the tooltip
    document.body.addEventListener('click', () => {
      const menu = document.querySelector('#sidebar-gizmo-menu');
      if (menu) menu.remove();
    });
  });
}
function showSidebarGizmoMenu(event, gizmoId) {
  getGizmoById(gizmoId).then((gizmoData) => {
    const { x, y } = getMousePosition(event);
    const translateX = x + 4;
    const translateY = y + 4;

    const menu = `<div id="sidebar-gizmo-menu" data-radix-popper-content-wrapper="" dir="ltr" style="position: fixed; left: 0px; top: 0px; transform: translate3d(${translateX}px, ${translateY}px, 0px); min-width: max-content; z-index: auto; --radix-popper-anchor-width: 20px; --radix-popper-anchor-height: 20px; --radix-popper-available-width: 1173px; --radix-popper-available-height: 825px; --radix-popper-transform-origin: 0% 0px;"><div data-side="bottom" data-align="start" role="menu" aria-orientation="vertical" data-state="open" data-radix-menu-content="" dir="ltr" id="radix-:r25:" aria-labelledby="radix-:r24:" class="mt-2 min-w-[100px] max-w-xs rounded-lg border border-gray-100 bg-token-surface-primary py-1.5 shadow-lg dark:border-gray-700" tabindex="-1" data-orientation="vertical" style="outline: none; --radix-dropdown-menu-content-transform-origin: var(--radix-popper-transform-origin); --radix-dropdown-menu-content-available-width: var(--radix-popper-available-width); --radix-dropdown-menu-content-available-height: var(--radix-popper-available-height); --radix-dropdown-menu-trigger-width: var(--radix-popper-anchor-width); --radix-dropdown-menu-trigger-height: var(--radix-popper-anchor-height); pointer-events: auto;">${gizmoData?.flair?.kind !== 'sidebar_keep' ? '<div id="sidebar-gizmo-menu-option-keep-in-sidebar" role="menuitem" class="flex gap-2 m-1.5 rounded px-5 py-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-black/5 dark:hover:bg-white/5 radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">Keep in sidebar</div>' : ''}<div id="sidebar-gizmo-menu-option-hide-from-sidebar" role="menuitem" class="flex gap-2 m-1.5 rounded px-5 py-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-black/5 dark:hover:bg-white/5 radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">Hide from sidebar</div></div></div>`;
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
  // scroll to the top of the conversation list
  conversationList.scrollTop = 0;
}
function addToTheTopOfConversationList(conversation) {
  const conversationList = document.querySelector('#conversation-list');
  const searchBoxWrapper = document.querySelector('#conversation-search-wrapper');
  const conversationElement = createConversation(conversation);
  const folderElements = Array.from(conversationList.querySelectorAll('[id^=wrapper-folder-]:not(#wrapper-folder-trash)'));
  if (folderElements.length > 0) {
    // insert conversationElement after the last folder
    conversationList.insertBefore(conversationElement, folderElements[folderElements.length - 1].nextSibling);
  } else {
    if (searchBoxWrapper) { // next sibling is trash folder
      conversationList.insertBefore(conversationElement, searchBoxWrapper.nextSibling);
    } else {
      conversationList.prepend(conversationElement);
    }
  }
  chrome.storage.local.get(['conversationsOrder'], (result) => {
    const { conversationsOrder } = result;
    conversationsOrder.splice(folderElements.length, 0, conversation.id);
    chrome.storage.local.set({ conversationsOrder });
  });
  // scroll to the top of the conversation list
  conversationList.scrollTop = 0;
}
// eslint-disable-next-line no-unused-vars
function prependConversation(conversation, settings) {
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
function generateTitleForConversation(conversationId, messageId, profile) {
  setTimeout(() => {
    generateTitle(conversationId, messageId).then((data) => {
      const { title } = data;
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
        }, i * 50);
      });
      // at the end, add custom instructions icon
      setTimeout(() => {
        if (topTitle && profile?.about_user_message) {
          topTitle.innerHTML += '<span id="custom-instruction-info-icon" style="display:flex;">&nbsp;&nbsp;<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" class="ml-0.5 mt-0.5 h-4 w-4 flex-shrink-0 text-gray-600 dark:text-gray-200 sm:mb-0.5 sm:mt-0 sm:h-5 sm:w-5"><path d="M8.4375 8.4375L8.46825 8.4225C8.56442 8.37445 8.67235 8.35497 8.77925 8.36637C8.88615 8.37776 8.98755 8.41955 9.07143 8.48678C9.15532 8.55402 9.21818 8.64388 9.25257 8.74574C9.28697 8.8476 9.29145 8.95717 9.2655 9.0615L8.7345 11.1885C8.70836 11.2929 8.7127 11.4026 8.74702 11.5045C8.78133 11.6065 8.84418 11.6965 8.9281 11.7639C9.01202 11.8312 9.1135 11.8731 9.2205 11.8845C9.32749 11.8959 9.43551 11.8764 9.53175 11.8282L9.5625 11.8125M15.75 9C15.75 9.88642 15.5754 10.7642 15.2362 11.5831C14.897 12.4021 14.3998 13.1462 13.773 13.773C13.1462 14.3998 12.4021 14.897 11.5831 15.2362C10.7642 15.5754 9.88642 15.75 9 15.75C8.11358 15.75 7.23583 15.5754 6.41689 15.2362C5.59794 14.897 4.85382 14.3998 4.22703 13.773C3.60023 13.1462 3.10303 12.4021 2.76381 11.5831C2.42459 10.7642 2.25 9.88642 2.25 9C2.25 7.20979 2.96116 5.4929 4.22703 4.22703C5.4929 2.96116 7.20979 2.25 9 2.25C10.7902 2.25 12.5071 2.96116 13.773 4.22703C15.0388 5.4929 15.75 7.20979 15.75 9ZM9 6.1875H9.006V6.1935H9V6.1875Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
          addCustomInstructionInfoIconEventListener(conversationId, topTitle.querySelector('#custom-instruction-info-icon'));
        }
      }, title.length * 50);
    });
  }, 500);// a little delay to make sure gen title still works even if user stops the generation
}

function loadStorageConversations(conversations, conversationsOrder = [], searchValue = '') {
  const conversationList = document.querySelector('#conversation-list');
  // add folders
  const folders = conversationsOrder.filter((c) => typeof c === 'object' && c?.id !== 'trash');
  for (let i = 0; i < folders.length; i += 1) {
    const folder = folders[i];
    const folderElement = createFolder(folder, conversations);
    conversationList.appendChild(folderElement);
  }
  // add conversations
  const conversationIds = conversationsOrder.filter((c) => typeof c === 'string');
  for (let i = 0; i < conversationIds.length; i += 1) {
    const conversationId = conversationIds[i];
    const conv = conversations[conversationId];
    if (!conv) continue;
    const conversationElement = createConversation(conv, searchValue);
    conversationList.appendChild(conversationElement);
  }
  // add trash folder
  const trashFolder = conversationsOrder.find((c) => typeof c === 'object' && c?.id === 'trash');
  if (trashFolder) {
    const trashFolderElement = createFolder(trashFolder, conversations);
    conversationList.appendChild(trashFolderElement);
  }
  const existingNoResult = document.querySelector('#search-no-result');
  if (existingNoResult) existingNoResult.remove();
  if (searchValue) {
    if (Object.values(conversations).length > 0) {
      // click on first conversation
      const firstConversation = document.querySelector('[id^="conversation-button-"]');
      if (firstConversation) {
        firstConversation.click();
        // focus on searchbox
        const searchbox = document.querySelector('#conversation-search');
        searchbox.focus();
      }
    } else {
      const noResult = document.createElement('div');
      noResult.id = 'search-no-result';
      noResult.classList = 'text-gray-300 text-center';
      noResult.innerHTML = 'No results';
      noResult.style.height = '500px';
      conversationList.appendChild(noResult);
      showNewChatPage(null, false);
    }
  }
}

function updateNewChatButtonSynced() {
  chrome.storage.local.get(['selectedConversations', 'conversationsAreSynced'], (result) => {
    const { selectedConversations, conversationsAreSynced } = result;
    const textAreaElement = document.querySelector('main form textarea');
    const newChatButton = document.querySelector('nav > :nth-child(2)').querySelector('a');
    if (!newChatButton) return;
    newChatButton.classList = 'flex p-2 w-full items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 mb-1 flex-shrink-0';
    newChatButton.parentElement.parentElement.classList = 'sticky left-0 right-0 top-0 z-20 bg-black pt-3.5';

    // clone newChatButton
    if (conversationsAreSynced) {
      const newChatButtonClone = newChatButton.cloneNode(true);
      newChatButtonClone.id = 'new-chat-button';
      newChatButton.replaceWith(newChatButtonClone);
      if (!newChatButtonClone) return;
      newChatButtonClone.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
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
    }
  });
}
function submitChat(userInput, conversation, messageId, parentId, settings, account, models, imageAssets = [], fileAttachments = [], continueGenerating = false, regenerateResponse = false, authorRole = 'user', authorName = '', initialMetadata = {}) {
  const isPaid = account?.accounts?.default?.entitlement?.has_active_subscription || false;
  // check window. localstorage every 200ms until arkoseToken is set
  let arkoseToken = window.localStorage.getItem('arkoseToken');
  if (!arkoseToken) {
    arkoseTrigger();
  }
  const userMessageId = messageId;
  let assistantData = [];
  const startTime = Date.now();
  const interval = setInterval(() => {
    arkoseToken = window.localStorage.getItem('arkoseToken');

    if (Date.now() - startTime > 5000) {
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
      }
      const syncDiv = document.getElementById('sync-div');
      syncDiv.style.opacity = '1';
      const submitButton = document.querySelector('main form textarea ~ button');
      // submitButton.disabled = false;
      submitButton.innerHTML = '<span class="" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
      return;
    }
    // if (arkoseToken || (isPaid && !settings.selectedModel.tags.includes('gpt4'))) {
    if (arkoseToken) {
      clearInterval(interval);
      scrolUpDetected = false;
      // clear search
      const searchBox = document.querySelector('#conversation-search');
      if (searchBox?.value) {
        searchBox.value = '';
        searchBox.dispatchEvent(new Event('input'), { bubbles: true });
      }

      const curSubmitButton = document.querySelector('main').querySelector('form').querySelector('textarea ~ button');
      curSubmitButton.disabled = true;
      curSubmitButton.innerHTML = '<span class="" data-state="closed"><svg class="animate-spin" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="#000" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="#000" stroke-width="2"></circle> <path class="opacity-75" fill="#000" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></span>';
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
      const userInputParts = settings.selectedModel.tags.includes('gpt4') ? [...imageAssets, userInput] : [userInput];
      const contentType = userInputParts.find((p) => typeof p !== 'string') ? 'multimodal_text' : 'text';
      const metadata = settings.selectedModel.tags.includes('gpt4') ? { attachments: fileAttachments, ...initialMetadata } : initialMetadata;
      const { pathname } = new URL(window.location.toString());
      let gizmoId;
      if (pathname.startsWith('/g/g-')) {
        gizmoId = getGizmoIdFromUrl();
      }
      if (gizmoId) {
        addGizmoToList(gizmoId, true);
        chrome.runtime.sendMessage({
          updateGizmoMetrics: true,
          detail: {
            gizmoId,
            metricName: 'num_conversations',
          },
        });
      }
      // eslint-disable-next-line no-nested-ternary
      const action = regenerateResponse ? 'variant' : continueGenerating ? 'continue' : 'next';
      getGizmoById(gizmoId).then((gizmoData) => {
        generateChat(userInputParts, conversation?.id, userMessageId, parentId, arkoseToken, gizmoData?.resource, metadata, lastPromptSuggestions, saveHistory, authorRole, authorName, action, contentType).then((chatStream) => {
          userChatIsActuallySaved = regenerateResponse || continueGenerating || authorRole !== 'user';
          let userChatSavedLocally = regenerateResponse || continueGenerating || authorRole !== 'user'; // false by default unless regenerateResponse is true
          let assistantChatSavedLocally = false;
          let finalMessage = '';
          let finalConversationId = '';
          let initialUserMessage = {};
          let systemMessage = {};

          chatStream.addEventListener('message', (e) => {
            if (e.data === '[DONE]' || chatStreamIsClosed) {
              document.querySelector('#conversation-bottom')?.scrollIntoView();
              const inputForm = document.querySelector('main form');
              const submitButton = inputForm?.querySelector('textarea ~ button');
              const textAreaElement = inputForm?.querySelector('textarea');
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
                submitButton.innerHTML = '<span class="" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';
              }
              if (chatStreamIsClosed && e.data !== '[DONE]') {
                updateLastMessagePluginDropdown();
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
                    updateOrCreateConversation(finalConversationId, gizmoId, assistantMessages, userMessageId, settings, !tmpChatStreamIsClosed, tmpChatStreamIsClosed).then(() => {
                      if (!tmpChatStreamIsClosed) { // if not clicked on stop generating button
                        if (runningPromptChainSteps && runningPromptChainSteps.length > 1 && runningPromptChainIndex < runningPromptChainSteps.length - 1) {
                          setTimeout(() => {
                            insertNextChain(runningPromptChainSteps, runningPromptChainIndex + 1);
                          }, isPaid ? 700 : 2000);
                        } else {
                          runningPromptChainSteps = undefined;
                          runningPromptChainIndex = 0;
                          setTimeout(() => {
                            insertNextChunk(settings, finalMessage);
                          }, isPaid ? 700 : 2000);
                        }
                      } else {
                        runningPromptChainSteps = undefined;
                        runningPromptChainIndex = 0;
                      }
                    });
                  }
                }, 1000);
              }
              isGenerating = false;
              chatStreamIsClosed = false;
              chatStream.close();
              if (syncDiv) syncDiv.style.opacity = '1';
              showHideTextAreaElement();
              initializeStopGeneratingResponseButton();
              addFinalCompletionClassToLastMessageWrapper();
              addConversationsEventListeners(finalConversationId, true);
              updateTotalCounter();
              if (settings.chatEndedSound) {
                playSound('beep');
              }
              // generateSuggestions(finalConversationId, userMessageId, settings.selectedModel.slug);
            } else if (e.event === 'ping') {
              // console.error('PING RECEIVED', e);
            } else {
              try {
                if (chatStream.readyState !== 2) {
                  isGenerating = true;
                }

                const data = JSON.parse(e.data);
                if (data.error) throw new Error(data.error);
                const { conversation_id: conversationId, message } = data;
                const { role } = message.author;
                const { recipient } = message;

                if (finalMessage === '') {
                  const pluginDropdownButton = document.querySelector('#navbar-plugins-dropdown-button');
                  if (pluginDropdownButton) {
                    pluginDropdownButton.disabled = true;
                    pluginDropdownButton.style.opacity = 0.75;
                    pluginDropdownButton.title = 'Changing plugins in the middle of the conversation is not allowed';
                  }
                  initializeStopGeneratingResponseButton();
                  // update gpt4 counter
                  if (!continueGenerating) {
                    chrome.storage.local.get(['gpt4Timestamps', 'settings', 'conversationLimit'], (result) => {
                      const { gpt4Timestamps } = result;
                      if (!result.settings.selectedModel.tags.includes('gpt4') && result.settings.selectedModel.slug !== 'gpt-4') return;
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
                          countdownTimerText = ` (New request available in ${Math.floor(countdownTimer / 1000 / 60)} minutes)`;
                        }

                        chrome.storage.local.set({ gpt4Timestamps: gpt4TimestampsFiltered, capExpiresAt: '' });
                        if (gpt4CounterElement) {
                          gpt4CounterElement.innerText = `GPT-4 requests (last ${getGPT4CounterMessageCapWindow(messageCapWindow)}): ${gpt4TimestampsFiltered.length}/${messageCap} ${countdownTimerText}`;
                        }
                      } else {
                        chrome.storage.local.set({ gpt4Timestamps: [now] });
                        if (gpt4CounterElement) {
                          gpt4CounterElement.innerText = `GPT-4 requests (last ${getGPT4CounterMessageCapWindow(messageCapWindow)}): 1/${messageCap} (New request available in 180 minutes)`;
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
                    initialUserMessage.metadata = { ...initialUserMessage.metadata, model_slug: settings.selectedModel.slug };
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
                    metadata: { model_slug: settings.selectedModel.slug, ...metadata },
                    recipient: recipient || 'all',
                  };

                  // set forcerefresh=true when adding user chat, and set it to false when stream ends. This way if something goes wrong in between, the conversation will be refreshed later
                  updateOrCreateConversation(finalConversationId, gizmoId, [userMessage], parentId, settings, false, true);
                  userChatSavedLocally = true;
                }
                if (!conversation?.id || userChatSavedLocally) {
                  // save assistant chat locally
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

                const lastRowAssistant = [...document.querySelectorAll('[id^="message-wrapper-"][data-role="assistant"]')].pop();
                const existingRowAssistant = (continueGenerating || authorRole !== 'user') ? lastRowAssistant : document.querySelector(`[id="message-wrapper-${assistantData[0]?.message?.id}"][data-role="assistant"]`);

                if (existingRowAssistant) {
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
                      if (regenerateResponse) threadCount += 1;
                      const assistantRow = rowAssistant(conversation, assistantData, threadCount, threadCount, models, settings, gizmoData, true);

                      const conversationBottom = document.querySelector('#conversation-bottom');
                      conversationBottom.insertAdjacentHTML('beforebegin', assistantRow);
                      setTimeout(() => {
                        const lastMessagePluginToggleButton = [...document.querySelectorAll('[id^="message-plugin-toggle-"]')].pop();
                        if (lastMessagePluginToggleButton) {
                          addMessagePluginToggleButtonsEventListeners([lastMessagePluginToggleButton]);
                        }
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
            const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
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
            const submitButton = document.querySelector('main form textarea ~ button');
            // submitButton.disabled = false;
            submitButton.innerHTML = '<span class="" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>';

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
                  errorMessage = `You've reached the current usage cap for this model. You can continue with the default model now, or try again after ${capExpiresAt}.`;
                } else {
                  showHideTextAreaElement();
                  chrome.storage.local.set({ capExpiresAt: '' });
                }
                const conversationBottom = document.querySelector('#conversation-bottom');
                const errorMessageElement = `<div id="response-error-msg" style="max-width:400px" class="py-2 px-3 my-2 border text-gray-600 rounded-md text-sm dark:text-gray-100 border-red-500 bg-red-500/10">${errorMessage}</div>`;
                conversationBottom.insertAdjacentHTML('beforebegin', errorMessageElement);
                conversationBottom.scrollIntoView({ behavior: 'smooth' });
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
function submitFinalSummary() {
  if (!shouldSubmitFinalSummary) return;
  if (finalSummary === '') return;
  const inputForm = document.querySelector('form');
  if (!inputForm) return;
  const submitButton = inputForm.querySelector('textarea ~ button');
  if (!submitButton) return;
  const textAreaElement = inputForm.querySelector('textarea');
  if (!textAreaElement) return;

  textAreaElement.value = `Here's the final summary of our conversation:
${finalSummary}
Reply with OK: [Summary is received!]. Don't reply with anything else!`;
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
    finalSummary = `${finalSummary}\n${previousMessage?.content?.parts?.filter((p) => typeof p === 'string')?.join('\n')}`;

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
  const textAreaElement = document.querySelector('main form textarea');
  if (!textAreaElement) return;
  const submitButton = document.querySelector('main form textarea ~ button');
  if (!submitButton) return;
  const lastNewLineIndexBeforeLimit = settings.autoSplitLimit > remainingText.length ? settings.autoSplitLimit : getLastIndexOf(remainingText, settings.autoSplitLimit);

  textAreaElement.value = `[START CHUNK ${chunkNumber}/${totalChunks}]
${remainingText.slice(0, lastNewLineIndexBeforeLimit)}
[END CHUNK ${chunkNumber}/${totalChunks}]
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
  const main = document.querySelector('main');
  if (!main) return;
  const inputForm = main.querySelector('form');
  if (!inputForm) return;
  inputForm.addEventListener('submit', (e) => {
    const textAreaElement = inputForm.querySelector('textarea');
    let textAreaValue = textAreaElement.value.trim();
    e.preventDefault();
    e.stopPropagation();
    if (isGenerating) return;
    // get all words wrapped in {{ and }}
    chrome.storage.local.get(['settings', 'conversations', 'models', 'account'], ({
      settings, conversations, models, account,
    }) => {
      const templateWords = textAreaValue.match(/{{(.*?)}}/g);
      if (settings.promptTemplate && templateWords?.length > 0) {
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
            toast('Did you mean to use {{prompt templates}}? If yes, first turn it on in the Settings menu', 'success', 6000);
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
                textAreaValue = `${settings.autoSplitInitialPrompt}[START CHUNK ${chunkNumber}/${totalChunks}]
${textAreaValue.substring(0, lastNewLineIndexBeforeLimit)}
[END CHUNK ${chunkNumber}/${totalChunks}]
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
            // check if user is replying to a message
            const replyToPreviewContent = document.querySelector('#reply-to-preview-content');
            let replyToText = '';
            const initialMetadata = {};
            if (replyToPreviewContent) {
              const turndownService = new TurndownService();
              replyToText = turndownService.turndown(replyToPreviewContent);
              initialMetadata.targeted_reply = replyToText;
              document.getElementById('reply-to-preview-wrapper')?.remove();
            }
            // eslint-disable-next-line no-nested-ternary
            const node = settings.selectedModel.tags.includes('gpt4')
              ? { message: { id: messageId, content: { parts: [...imageAssets, textAreaValue] }, metadata: { attachments: fileAttachments, ...initialMetadata } } }
              : { message: { id: messageId, content: { parts: [textAreaValue] }, metadata: initialMetadata } };

            const userRow = rowUser(conversation, node, 1, 1, result.name, result.avatar, settings);
            // if last message data-role !== user, insert user row before conversation bottom
            if (lastMessage?.dataset?.role !== 'user') {
              replaceAllConfimationWrappersWithActionStopped();
              conversationBottom.insertAdjacentHTML('beforebegin', userRow);
            }
            conversationBottom.scrollIntoView({ behavior: 'smooth' });
            if (textAreaValue || fileAttachments.length > 0) {
              isGenerating = true;

              submitChat(textAreaValue, conversation, messageId, parentId, settings, account, models, imageAssets, fileAttachments, false, false, 'user', '', initialMetadata);
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
                  textAreaValue = `${settings.autoSplitInitialPrompt}[START CHUNK ${chunkNumber}/${totalChunks}]
${textAreaValue.substring(0, lastNewLineIndexBeforeLimit)}
[END CHUNK ${chunkNumber}/${totalChunks}]
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
              // eslint-disable-next-line no-nested-ternary
              const node = settings.selectedModel.tags.includes('gpt4')
                ? { message: { id: messageId, content: { parts: [...imageAssets, textAreaValue] }, metadata: { attachments: fileAttachments } } }
                : { message: { id: messageId, content: { parts: [textAreaValue] } } };

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
              conversationDiv.classList = 'flex flex-col items-center text-sm h-full dark:bg-gray-800';
              const userRow = rowUser({}, node, 1, 1, result.name, result.avatar, settings);
              replaceAllConfimationWrappersWithActionStopped();
              conversationDiv.innerHTML = userRow;
              const topDiv = `<div id="conversation-top" class="w-full flex relative items-center justify-center border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]" style="min-height:56px;"><span id="conversation-top-title" class="flex">New Chat</span>${conversationSettingsMenu({ autoDeleteLock: false }, hasSubscription)}</div>`;
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
              const totalCounter = document.createElement('div');
              totalCounter.id = 'total-counter';
              totalCounter.style = 'position: absolute; top: 0px; right: 0px; font-size: 10px; color: rgb(153, 153, 153); opacity: 0.8;';
              bottomDivContent.appendChild(totalCounter);

              innerDiv.appendChild(conversationDiv);
              outerDiv.appendChild(innerDiv);
              presentation.prepend(outerDiv);
              if (textAreaValue || fileAttachments.length > 0) {
                isGenerating = true;
                submitChat(textAreaValue, {}, messageId, parentId, settings, account, models, imageAssets, fileAttachments);
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

  const submitButton = inputForm.querySelector('textarea ~ button');
  const submitButtonClone = submitButton.cloneNode(true);
  submitButtonClone.type = 'button';
  submitButtonClone.addEventListener('click', () => {
    const textAreaElement = inputForm.querySelector('textarea');
    if (isGenerating) return;
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
          const searchbox = document.querySelector('#conversation-search');
          const searchValue = searchbox.value;
          const conversationElement = document.querySelector(`#conversation-button-${conversationId}`);
          const focusedConversations = document.querySelectorAll('.selected');
          focusedConversations.forEach((c) => {
            c.classList = notSelectedClassList;
          });
          // set selected conversation
          conversationElement.classList = selectedClassList;
          loadConversation(conversationId, searchValue);
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
function loadConversationList(skipInputFormReload = false) {
  chrome.storage.local.get(['conversationsOrder', 'conversations', 'conversationsAreSynced', 'settings', 'gizmosBootstrap'], (result) => {
    const { conversationsAreSynced, conversations } = result;
    if (conversationsAreSynced && typeof conversations !== 'undefined') {
      if (!skipInputFormReload) initializeGallery();
      if (!skipInputFormReload) initializeCustomSelectionMenu();
      if (!skipInputFormReload) updateNewChatButtonSynced();
      if (!skipInputFormReload) observeGizmoBootstrapList(result.gizmosBootstrap);
      if (!skipInputFormReload) replaceTextAreaElemet(result.settings);
      replaceOriginalConversationList();
      createSearchBox();
      loadStorageConversations(result.conversations, result.conversationsOrder);
      const {
        origin, pathname, search,
      } = new URL(window.location.toString());
      const conversationId = pathname.split('/c/').pop().replace(/[^a-z0-9-]/gi, '');
      const conversationList = document.querySelector('#conversation-list');
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(conversationId)) {
        const conversation = conversations[conversationId];
        if (!conversation.archived) {
          setTimeout(() => {
            const focusedConversation = conversationList.querySelector(`#conversation-button-${conversationId}`);

            if (focusedConversation) {
              focusedConversation.scrollIntoView({ block: 'nearest' });
            }
          }, 500);
          loadConversation(conversationId);
          if (search) {
            window.history.replaceState({}, '', `${origin}${pathname}`);
            handleQueryParams(search);
          }
        } else {
          showNewChatPage();
        }
      } else if (pathname.startsWith('/g/g-')) {
        const gizmoId = getGizmoIdFromUrl();
        getGizmoById(gizmoId).then((gizmoData) => {
          showNewChatPage(gizmoData?.resource);
        });
      } else if (pathname === '/gpts/discovery') {
        renderGizmoDiscoveryPage();
      } else if (pathname === '/') {
        showNewChatPage();
      }
      if (!skipInputFormReload) addScrollButtons();
      if (!skipInputFormReload) initializePromptChain();
      if (!skipInputFormReload) setBackButtonDetection();
      setTimeout(() => {
        if (!skipInputFormReload) addArkoseCallback();
        initializeAutoDelete();
      }, 1000);
    }
  });
}
