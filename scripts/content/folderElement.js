/* global isFirefox, createConversation, Sortable, showDefaultFolderActions, toggleKeepFoldersAtTheTop, resetSelection, showFolderElementMenu, closeMenus, openRenameFolder  */

// eslint-disable-next-line no-unused-vars
function createFolder(folder, conversations = [], isNewFolder = false) {
  // generate random uuid
  const folderId = folder.id;
  // if current conversation is in this folder, open the folder
  const { pathname } = new URL(window.location.toString());
  const convId = pathname.split('/c/').pop().replace(/[^a-z0-9-]/gi, '');
  if (folder.conversationIds.includes(convId)) {
    folder.isOpen = true;
  }

  const folderElementWrapper = document.createElement('div');
  folderElementWrapper.id = `wrapper-folder-${folderId}`;
  folderElementWrapper.classList = 'flex w-full';
  folderElementWrapper.style = 'flex-wrap: wrap;';
  folderElementWrapper.addEventListener('click', (e) => {
    closeMenus();
    // click on the sideline: if clicked element is not folder and not folder content
    if (!e.srcElement.id.startsWith('folder-') && !e.srcElement.id.startsWith('folder-content-') && !e.srcElement.id.startsWith('empty-folder-')) {
      const curFolderId = e.srcElement.id.split('wrapper-folder-')[1];
      const curFolderElement = document.querySelector(`#folder-${curFolderId}`);
      curFolderElement?.click();
    }
  });
  // folder element
  const folderElement = document.createElement('div');
  folderElement.id = `folder-${folderId}`;
  folderElement.classList = 'flex py-3 px-3 pr-8 w-full items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all group';
  folderElement.style.backgroundColor = folder.color || '#40414f';
  folderElement.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenus();
    showFolderElementMenu(e, folderId);
  });
  folderElement.addEventListener('mouseenter', () => {
    const allSelectedCheckbox = document.querySelectorAll('[id^="conversation-button"] input[type="checkbox"]:checked');
    if (allSelectedCheckbox?.length > 0) return;
    const actionsWrapper = document.querySelector(`#folder-actions-wrapper-${folderId}`);
    if (actionsWrapper.querySelector('button')) {
      actionsWrapper.querySelector('button').innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path></svg>';
    }
  });
  folderElement.addEventListener('mouseleave', () => {
    const allSelectedCheckbox = document.querySelectorAll('[id^="conversation-button"] input[type="checkbox"]:checked');
    if (allSelectedCheckbox?.length > 0) return;
    const actionsWrapper = document.querySelector(`#folder-actions-wrapper-${folderId}`);
    const curFolderIcon = document.querySelector(`#folder-icon-${folder.id}`);
    if (actionsWrapper.querySelector('button')) {
      actionsWrapper.querySelector('button').innerHTML = curFolderIcon?.dataset?.isOpen === 'true' ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" stroke-width="2"><path d="M432.6 209.3l-191.1 183.1C235.1 397.8 229.1 400 224 400s-11.97-2.219-16.59-6.688L15.41 209.3C5.814 200.2 5.502 184.1 14.69 175.4c9.125-9.625 24.38-9.938 33.91-.7187L224 342.8l175.4-168c9.5-9.219 24.78-8.906 33.91 .7187C442.5 184.1 442.2 200.2 432.6 209.3z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" stroke-width="2"><path d="M113.3 47.41l183.1 191.1c4.469 4.625 6.688 10.62 6.688 16.59s-2.219 11.97-6.688 16.59l-183.1 191.1c-9.152 9.594-24.34 9.906-33.9 .7187c-9.625-9.125-9.938-24.38-.7187-33.91l168-175.4L78.71 80.6c-9.219-9.5-8.906-24.78 .7187-33.91C88.99 37.5 104.2 37.82 113.3 47.41z"/></svg>';
    }
  });
  folderElement.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenus();
    // get closet element with id starting with conversation-button
    chrome.storage.local.get(['conversationsOrder'], (result) => {
      const { conversationsOrder } = result;
      const curFolderIcon = document.querySelector(`#folder-icon-${folder.id}`);
      curFolderIcon.src = chrome.runtime.getURL(`${curFolderIcon.dataset.isOpen === 'false' ? 'icons/folder-open.png' : 'icons/folder.png'}`);
      curFolderIcon.dataset.isOpen = curFolderIcon.dataset.isOpen === 'false' ? 'true' : 'false';
      const curFolderContent = document.querySelector(`#folder-content-${folder.id}`);
      curFolderContent.style.display = folderContent.style.display === 'none' ? 'block' : 'none';
      conversationsOrder.find((c) => c?.id === folder.id).isOpen = curFolderIcon.dataset.isOpen === 'true';
      chrome.storage.local.set({ conversationsOrder });
    });
  });

  // folder icon
  const folderIcon = document.createElement('img');
  folderIcon.id = `folder-icon-${folderId}`;
  folderIcon.classList = 'w-4 h-4';
  folderIcon.src = folder.isOpen ? chrome.runtime.getURL('icons/folder-open.png') : chrome.runtime.getURL('icons/folder.png');
  folderIcon.dataset.isOpen = folder.isOpen ? 'true' : 'false';
  folderElement.appendChild(folderIcon);

  const folderTitle = document.createElement('div');
  folderTitle.id = `title-folder-${folderId}`;
  folderTitle.classList = 'flex-1 text-ellipsis max-h-5 overflow-hidden whitespace-nowrap break-all relative text-white relative';
  folderTitle.innerHTML = folder.name;
  folderElement.title = folder.name;
  folderElement.appendChild(folderTitle);

  // folder content
  const folderContent = document.createElement('div');
  folderContent.id = `folder-content-${folderId}`;
  folderContent.classList = 'w-full border-l border-gray-500';
  folderContent.style.borderColor = folder.color || '#40414f';
  folderContent.style.borderLeftWidth = '2px';
  folderContent.style.borderBottomLeftRadius = '6px';
  folderContent.style.marginLeft = '16px';
  folderContent.style.paddingTop = '2px';
  folderContent.style.display = folder.isOpen ? 'block' : 'none';
  folderContent.style.borderColor = folder.color || '#40414f';

  // folder count
  chrome.storage.local.get(['settings'], (result) => {
    const { settings } = result;
    const folderCount = document.createElement('div');
    folderCount.id = `count-folder-${folderId}`;
    folderCount.classList = 'text-white';
    folderCount.style = `font-size:10px;position:absolute;left:40px;bottom:0px;display:${settings.showFolderCounts ? 'block' : 'none'}`;
    if (settings.showFolderCounts) folderElement.querySelector('[id^="title-folder-"]').style.bottom = '5px';
    folderCount.innerHTML = `${folder?.conversationIds?.length} chats`;
    folderElement.appendChild(folderCount);
  });
  // add an observer to folderContent to update folder count
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const folderCountElement = document.querySelector(`#count-folder-${folderId}`);
        if (!folderCountElement) return;
        folderCountElement.innerHTML = `${folderContent.querySelectorAll('[id^="conversation-button-"]')?.length || 0} chats`;
      }
    });
  });
  observer.observe(folderContent, { childList: true, subtree: true });

  if (folder.conversationIds.length > 0) {
    folder.conversationIds.forEach((conversationId) => {
      if (typeof conversationId === 'string') {
        const conversation = conversations[conversationId];
        if (conversation) {
          const conversationElement = createConversation(conversation);
          folderContent.appendChild(conversationElement);
        }
      }
    });
  } else {
    folderContent.appendChild(emptyFolderElement(folderId));
  }

  // action icons
  const allSelectedCheckbox = document.querySelectorAll('[id^="conversation-button"] input[type="checkbox"]:checked');
  if (allSelectedCheckbox?.length > 0) {
    folderElement.appendChild(addToFolderAction(folderId));
  } else {
    folderElement.appendChild(defaultFolderActions(folderId, folder.isOpen));
  }

  // add checkbox
  // addCheckboxToConversationElement(conversationElement, conversation);
  // eslint-disable-next-line no-unused-vars
  const sortable = Sortable.create(folderContent, {
    draggable: isFirefox ? '[id^="conversation-button-"]' : '[id^="conversation-button-"]:not(:has([id^=conversation-rename-]))',
    direction: 'vertical',
    invertSwap: true,
    disabled: false,
    // multiDrag: true,
    // selectedClass: 'multi-drag-selected',
    // handle: '[id^="checkbox-wrapper-"], [id^="conversation-button-"]',
    group: {
      name: folderId,
      // eslint-disable-next-line func-names, object-shorthand, no-unused-vars
      pull: true,
      // eslint-disable-next-line func-names, object-shorthand
      put: function (to, from, dragged) {
        return !dragged.id.startsWith('wrapper-folder-');
      },
    },
    onEnd: (event) => {
      const {
        item, to, from, newIndex, oldDraggableIndex, newDraggableIndex,
      } = event;
      const itemId = item.id.split('conversation-button-')[1];
      const isToFolder = to.id.startsWith('folder-content-');
      const fromId = from.id.split('folder-content-')[1];
      const toId = isToFolder ? to.id.split('folder-content-')[1] : 'conversation-list';
      if (oldDraggableIndex === newDraggableIndex && toId === fromId) return;

      chrome.storage.local.get(['conversationsOrder'], (result) => {
        const { conversationsOrder } = result;
        const fromFolderIndex = conversationsOrder.findIndex((c) => c?.id === fromId);
        const fromFolder = conversationsOrder[fromFolderIndex];
        fromFolder.conversationIds.splice(oldDraggableIndex, 1);
        if (fromFolder.conversationIds.length === 0) {
          from.appendChild(emptyFolderElement(folderId));
        }
        if (isToFolder) {
          const curEmptyFolder = document.querySelector(`#empty-folder-${toId}`);
          if (curEmptyFolder) curEmptyFolder.remove();
          const toFolderIndex = conversationsOrder.findIndex((c) => c?.id === toId);
          const toFolder = conversationsOrder[toFolderIndex];
          toFolder.conversationIds.splice(newDraggableIndex, 0, itemId);
          conversationsOrder.splice(toFolderIndex, 1, toFolder);
          chrome.storage.local.set({ conversationsOrder });
        } else {
          conversationsOrder.splice(newIndex - 1, 0, itemId); // if adding to conversation list use index-1(for search box)
          chrome.storage.local.set({ conversationsOrder }, () => {
            const folderCount = Array.from(document.querySelectorAll('#conversation-list > [id^=wrapper-folder-]')).length;
            if (newIndex <= folderCount) {
              toggleKeepFoldersAtTheTop(true);
            }
          });
        }
      });
    },
  });
  folderElementWrapper.appendChild(folderElement);
  folderElementWrapper.appendChild(folderContent);
  if (isNewFolder) {
    openRenameFolder(folderId);
    setTimeout(() => {
      const textInput = document.querySelector(`#rename-folder-${folderId}`);
      textInput?.select();
    }, 50);
  }
  return folderElementWrapper;
}
function emptyFolderElement(folderId) {
  const emptyFolder = document.createElement('div');
  emptyFolder.id = `empty-folder-${folderId}`;
  emptyFolder.classList = 'flex w-full p-3 text-xs text-token-text-tertiary';
  emptyFolder.innerHTML = 'Empty folder.<br/>Drag or select chats to add';
  return emptyFolder;
}
// eslint-disable-next-line no-unused-vars
function folderActions(folderId) {
  const allSelectedCheckbox = document.querySelectorAll('[id^="conversation-button"] input[type="checkbox"]:checked');
  if (allSelectedCheckbox?.length > 0) {
    return addToFolderAction(folderId);
  }
  const curFolderIcon = document.querySelector(`#folder-icon-${folderId}`);

  return defaultFolderActions(folderId, curFolderIcon?.dataset?.isOpen === 'true');
}
function defaultFolderActions(folderId, isOpen = false) {
  const actionsWrapper = document.createElement('div');
  actionsWrapper.id = `folder-actions-wrapper-${folderId}`;
  actionsWrapper.classList = 'absolute flex right-1 z-10 text-gray-300';

  const folderElementMenuButton = document.createElement('button');
  folderElementMenuButton.classList = 'p-1 text-white';
  folderElementMenuButton.innerHTML = isOpen ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" stroke-width="2"><path d="M432.6 209.3l-191.1 183.1C235.1 397.8 229.1 400 224 400s-11.97-2.219-16.59-6.688L15.41 209.3C5.814 200.2 5.502 184.1 14.69 175.4c9.125-9.625 24.38-9.938 33.91-.7187L224 342.8l175.4-168c9.5-9.219 24.78-8.906 33.91 .7187C442.5 184.1 442.2 200.2 432.6 209.3z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" stroke-width="2"><path d="M113.3 47.41l183.1 191.1c4.469 4.625 6.688 10.62 6.688 16.59s-2.219 11.97-6.688 16.59l-183.1 191.1c-9.152 9.594-24.34 9.906-33.9 .7187c-9.625-9.125-9.938-24.38-.7187-33.91l168-175.4L78.71 80.6c-9.219-9.5-8.906-24.78 .7187-33.91C88.99 37.5 104.2 37.82 113.3 47.41z"/></svg>';
  folderElementMenuButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenus();
    showFolderElementMenu(e, folderId);
  });

  actionsWrapper.appendChild(folderElementMenuButton);

  return actionsWrapper;
}
function addToFolderAction(folderId) {
  const actionsWrapper = document.createElement('div');
  actionsWrapper.id = `folder-actions-wrapper-${folderId}`;
  actionsWrapper.classList = 'absolute flex right-1 z-10 text-gray-300';
  const moveToFolderButton = document.createElement('button');
  moveToFolderButton.id = `move-to-folder-button-${folderId}`;
  moveToFolderButton.classList = 'p-1 hover:text-white';
  moveToFolderButton.title = 'Move to folder';
  moveToFolderButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" stroke-width="2" viewBox="0 0 512 512"><path d="M464 96h-192l-64-64h-160C21.5 32 0 53.5 0 80v352C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM336 311.1h-56v56C279.1 381.3 269.3 392 256 392c-13.27 0-23.1-10.74-23.1-23.1V311.1H175.1C162.7 311.1 152 301.3 152 288c0-13.26 10.74-23.1 23.1-23.1h56V207.1C232 194.7 242.7 184 256 184s23.1 10.74 23.1 23.1V264h56C349.3 264 360 274.7 360 288S349.3 311.1 336 311.1z"/></svg>';
  moveToFolderButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    // if shift click
    if (event.shiftKey) { // remove from folder
      chrome.storage.local.get(['selectedConversations'], (result) => {
        const { selectedConversations } = result;
        const selectedConversationsIds = selectedConversations.map((c) => c?.id);
        moveOutOfFolder(folderId, selectedConversationsIds);
      });
    } else { // add to folder
      chrome.storage.local.get(['selectedConversations'], (result) => {
        const { selectedConversations } = result;
        const selectedConversationsIds = selectedConversations.map((c) => c?.id);
        moveToFolder(folderId, selectedConversationsIds);
      });
    }
  });
  actionsWrapper.appendChild(moveToFolderButton);
  return actionsWrapper;
}
function moveToFolder(folderId, conversationIds) {
  const targetFolderId = folderId;
  chrome.storage.local.get(['conversationsOrder'], (result) => {
    const { conversationsOrder } = result;
    const targetFolderIndex = conversationsOrder.findIndex((f) => f.id === targetFolderId);
    const targetFolder = conversationsOrder[targetFolderIndex];
    // if target folder is empty now, remove empty folder element
    if (targetFolder.conversationIds.length === 0) {
      const emptyFolder = document.querySelector(`#empty-folder-${targetFolderId}`);
      if (emptyFolder) emptyFolder.remove();
    }
    // remove selected conversations from conversationsOrder
    for (let i = 0; i < conversationIds.length; i += 1) {
      const conversationIndex = conversationsOrder.findIndex((c) => c === conversationIds[i]);
      if (conversationIndex !== -1) {
        // remove id from conversationsOrder
        conversationsOrder.splice(conversationIndex, 1);
        // move element to folder
        const conversationElement = document.querySelector(`#conversation-button-${conversationIds[i]}`);
        const targetFolderContentElement = document.querySelector(`#folder-content-${targetFolderId}`);
        targetFolderContentElement.appendChild(conversationElement);
      } else {
        // look inside folders
        const sourceFolder = conversationsOrder.find((f) => typeof f === 'object' && f?.conversationIds?.includes(conversationIds[i]));
        if (sourceFolder) {
          // remove id from source folder
          const sourceFolderConversationIndex = sourceFolder?.conversationIds?.findIndex((c) => c === conversationIds[i]);
          const sourceFolderIndex = conversationsOrder.findIndex((f) => f.id === sourceFolder.id);
          sourceFolder?.conversationIds?.splice(sourceFolderConversationIndex, 1);
          // update conversationsOrder with updated source folder
          conversationsOrder.splice(sourceFolderIndex, 1, sourceFolder);
          // move element to target folder
          const conversationElement = document.querySelector(`#conversation-button-${conversationIds[i]}`);
          const targetFolderContent = document.querySelector(`#folder-content-${targetFolderId}`);
          targetFolderContent.appendChild(conversationElement);
          // if source folder is empty now, add empty folder element
          if (sourceFolder?.conversationIds?.length === 0) {
            const folderContent = document.querySelector(`#folder-content-${sourceFolder.id}`);
            folderContent.appendChild(emptyFolderElement(sourceFolder.id));
          }
        }
      }
    }
    // add all selected conversations to folder
    const newConversationIds = targetFolder.conversationIds.concat(conversationIds);
    conversationsOrder.splice(targetFolderIndex, 1, { ...targetFolder, conversationIds: newConversationIds });
    if (newConversationIds.length > 0) {
      const emptyFolder = document.querySelector(`#empty-folder-${targetFolderId}`);
      if (emptyFolder) emptyFolder.remove();
    }

    chrome.storage.local.set({ conversationsOrder, selectedConversations: [] }, () => {
      showDefaultFolderActions();
      resetSelection();
    });
  });
}
function moveOutOfFolder(folderId, conversationIds) {
  const sourceFolderId = folderId;
  // get all the selected conversations inside the folder and move them out of the folder
  chrome.storage.local.get(['conversationsOrder'], (result) => {
    const { conversationsOrder } = result;
    const sourceFolder = conversationsOrder.find((f) => f.id === sourceFolderId);
    const selectedConversationsIdsInSourceFolder = conversationIds?.filter((id) => sourceFolder?.conversationIds?.includes(id));
    if (selectedConversationsIdsInSourceFolder.length === 0) return;
    const folderCount = Array.from(document.querySelectorAll('#conversation-list > [id^=wrapper-folder-]')).length;
    // remove selected conversations from source folder
    for (let i = 0; i < selectedConversationsIdsInSourceFolder.length; i += 1) {
      const conversationIndex = sourceFolder?.conversationIds?.findIndex((c) => c === selectedConversationsIdsInSourceFolder[i]);
      // remove from source folder
      sourceFolder?.conversationIds.splice(conversationIndex, 1);
      // add to conversationsOrder
      conversationsOrder.splice(folderCount, 0, selectedConversationsIdsInSourceFolder[i]);
      // move the conversation element out of the folder
      const conversationElement = document.querySelector(`#conversation-button-${selectedConversationsIdsInSourceFolder[i]}`);
      // add conversation element to conversation list at index folderCount+1(searchbox)
      const conversationList = document.querySelector('#conversation-list');
      conversationList.insertBefore(conversationElement, conversationList.children[folderCount + 1]);
    }
    // update conversationsOrder with updated source folder
    const sourceFolderIndex = conversationsOrder.findIndex((f) => f.id === sourceFolder.id);
    conversationsOrder.splice(sourceFolderIndex, 1, sourceFolder);

    // if source folder is empty now, add empty folder element
    if (sourceFolder?.conversationIds?.length === 0) {
      const sourceFolderContent = document.querySelector(`#folder-content-${sourceFolder.id}`);
      sourceFolderContent.appendChild(emptyFolderElement(sourceFolder.id));
    }
    chrome.storage.local.set({ conversationsOrder, selectedConversations: [] }, () => {
      showDefaultFolderActions();
      resetSelection();
    });
  });
}
