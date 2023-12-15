/* global createConversation, Sortable, generateRandomDarkColor, deleteConversation, showNewChatPage, notSelectedClassList, deleteConversationOnDragToTrash, showDefaultFolderActions, toggleKeepFoldersAtTheTop, resetSelection, showActionConfirm, confirmDeleteSelectedConversations,  */

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
  folderElement.classList = 'flex py-3 px-3 pr-3 w-full items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-20 group';
  folderElement.style.backgroundColor = folder.color || '#40414f';
  folderElement.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    // get closet element with id starting with conversation-button
    chrome.storage.local.get(['conversationsOrder'], (result) => {
      const { conversationsOrder } = result;
      const folderElementId = e.srcElement.closest('[id^="folder-"]').id.split('folder-')[1];
      const curFolderIcon = document.querySelector(`#folder-${folderElementId} img`);
      curFolderIcon.src = chrome.runtime.getURL(`${curFolderIcon.dataset.isOpen === 'false' ? 'icons/folder-open.png' : 'icons/folder.png'}`);
      curFolderIcon.dataset.isOpen = curFolderIcon.dataset.isOpen === 'false' ? 'true' : 'false';
      const curFolderContent = document.querySelector(`#folder-content-${folderElementId}`);
      curFolderContent.style.display = folderContent.style.display === 'none' ? 'block' : 'none';
      conversationsOrder.find((c) => c?.id === folderElementId).isOpen = curFolderIcon.dataset.isOpen === 'true';
      chrome.storage.local.set({ conversationsOrder });
    });
  });

  // folder icon
  const folderIcon = document.createElement('img');
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
  if (allSelectedCheckbox?.length > 0 && folderId !== 'trash') {
    folderElement.appendChild(addToFolderAction(folderId));
  } else {
    folderElement.appendChild(defaultFolderActions(folderId));
  }

  // add checkbox
  // addCheckboxToConversationElement(conversationElement, conversation);
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
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
      pull: function (to, from, dragged) {
        return from.el.id !== 'folder-content-trash';
      },
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
      const isFolder = item.id.startsWith('wrapper-folder-');
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
          if (!isFolder && toId === 'trash' && fromId !== 'trash') {
            deleteConversationOnDragToTrash(itemId);
          }
          chrome.storage.local.set({ conversationsOrder });
        } else {
          conversationsOrder.splice(newIndex - 1, 0, itemId); // if adding to conversation list use index-1(for search box)
          chrome.storage.local.set({ conversationsOrder }, () => {
            const folderCount = Array.from(document.querySelectorAll('#conversation-list > [id^=wrapper-folder-]:not(#wrapper-folder-trash)')).length;
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
    const editFolderNameButton = folderElementWrapper.querySelector(`#edit-folder-name-${folderId}`);
    editFolderNameButton?.click();
    // select the text
    setTimeout(() => {
      const textInput = document.querySelector(`#rename-folder-${folderId}`);
      textInput.select();
    }, 50);
  }
  return folderElementWrapper;
}
function emptyFolderElement(folderId) {
  const emptyFolder = document.createElement('div');
  emptyFolder.id = `empty-folder-${folderId}`;
  emptyFolder.classList = 'flex w-full p-3 text-xs text-gray-500';
  emptyFolder.innerHTML = folderId === 'trash'
    ? 'No Archived Conversation.<br/>Deleted chats will be moved here.'
    : 'Empty folder.<br/>Drag conversations to add';
  return emptyFolder;
}
function folderActions(folderId) {
  const allSelectedCheckbox = document.querySelectorAll('[id^="conversation-button"] input[type="checkbox"]:checked');
  if (allSelectedCheckbox?.length > 0) {
    return addToFolderAction(folderId);
  }
  return defaultFolderActions(folderId);
}
function defaultFolderActions(folderId) {
  const actionsWrapper = document.createElement('div');
  actionsWrapper.id = `folder-actions-wrapper-${folderId}`;
  actionsWrapper.classList = 'absolute flex right-1 z-10 text-gray-300 invisible group-hover:visible';
  const changeColorButton = document.createElement('button');
  changeColorButton.id = `change-color-${folderId}`;
  changeColorButton.classList = 'p-1 hover:text-white';
  changeColorButton.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="2" viewBox="0 0 512 512" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M160 255.1C160 273.7 145.7 287.1 128 287.1C110.3 287.1 96 273.7 96 255.1C96 238.3 110.3 223.1 128 223.1C145.7 223.1 160 238.3 160 255.1zM128 159.1C128 142.3 142.3 127.1 160 127.1C177.7 127.1 192 142.3 192 159.1C192 177.7 177.7 191.1 160 191.1C142.3 191.1 128 177.7 128 159.1zM288 127.1C288 145.7 273.7 159.1 256 159.1C238.3 159.1 224 145.7 224 127.1C224 110.3 238.3 95.1 256 95.1C273.7 95.1 288 110.3 288 127.1zM320 159.1C320 142.3 334.3 127.1 352 127.1C369.7 127.1 384 142.3 384 159.1C384 177.7 369.7 191.1 352 191.1C334.3 191.1 320 177.7 320 159.1zM441.9 319.1H344C317.5 319.1 296 341.5 296 368C296 371.4 296.4 374.7 297 377.9C299.2 388.1 303.5 397.1 307.9 407.8C313.9 421.6 320 435.3 320 449.8C320 481.7 298.4 510.5 266.6 511.8C263.1 511.9 259.5 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 256.9 511.1 257.8 511.1 258.7C511.6 295.2 478.4 320 441.9 320V319.1zM463.1 258.2C463.1 257.4 464 256.7 464 255.1C464 141.1 370.9 47.1 256 47.1C141.1 47.1 48 141.1 48 255.1C48 370.9 141.1 464 256 464C258.9 464 261.8 463.9 264.6 463.8C265.4 463.8 265.9 463.6 266.2 463.5C266.6 463.2 267.3 462.8 268.2 461.7C270.1 459.4 272 455.2 272 449.8C272 448.1 271.4 444.3 266.4 432.7C265.8 431.5 265.2 430.1 264.5 428.5C260.2 418.9 253.4 403.5 250.1 387.8C248.7 381.4 248 374.8 248 368C248 314.1 290.1 271.1 344 271.1H441.9C449.6 271.1 455.1 269.3 459.7 266.2C463 263.4 463.1 260.9 463.1 258.2V258.2z"/></svg>';
  changeColorButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    chrome.storage.local.get(['conversationsOrder'], (result) => {
      const { conversationsOrder } = result;
      actionsWrapper.replaceWith(colorPicker(conversationsOrder.find((conv) => conv?.id === folderId)));
      const colorPickerElement = document.getElementById(`color-picker-${folderId}`);
      colorPickerElement.focus();
    });
  });

  const editFolderNameButton = document.createElement('button');
  editFolderNameButton.id = `edit-folder-name-${folderId}`;
  editFolderNameButton.classList = 'p-1 hover:text-white';
  editFolderNameButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>';
  editFolderNameButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    chrome.storage.local.get(['conversationsOrder', 'settings'], (result) => {
      const { conversationsOrder, settings } = result;
      const textInput = document.createElement('input');
      const folderTitle = document.querySelector(`#title-folder-${folderId}`);
      textInput.id = `rename-folder-${folderId}`;
      textInput.classList = 'border-0 bg-transparent p-0 focus:ring-0 focus-visible:ring-0 relative';
      textInput.style = `max-width:140px;bottom:${settings.showFolderCounts ? '5px' : '0px'};`;
      textInput.value = conversationsOrder.find((conv) => conv?.id === folderId).name;
      folderTitle.parentElement.replaceChild(textInput, folderTitle);
      setTimeout(() => {
        textInput.select();
      }, 50);
      textInput.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        textInput.focus();
      });
      // replace action buttons with save and cancel buttons
      actionsWrapper.replaceWith(folderConfirmActions(conversationsOrder.find((conv) => conv?.id === folderId), 'edit'));
    });
  });
  const deleteFolderButton = document.createElement('button');
  deleteFolderButton.classList = 'p-1 hover:text-white';
  deleteFolderButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
  deleteFolderButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteFolder(folderId);
    // remove all other visible cancel buttons
    // get all cancel buttons with last part of id not equal to this conversation id and click on them
    const cancelButtons = document.querySelectorAll(`button[id^="cancel-"]:not(#cancel-${folderId})`);
    cancelButtons.forEach((button) => {
      button.click();
    });
  });
  actionsWrapper.appendChild(changeColorButton);
  if (folderId !== 'trash') {
    actionsWrapper.appendChild(editFolderNameButton);
  }
  actionsWrapper.appendChild(deleteFolderButton);
  return actionsWrapper;
}
function addToFolderAction(folderId) {
  const actionsWrapper = document.createElement('div');
  actionsWrapper.id = `folder-actions-wrapper-${folderId}`;
  actionsWrapper.classList = 'absolute flex right-1 z-10 text-gray-300';
  const moveToFolderButton = document.createElement('button');
  moveToFolderButton.id = `move-to-folder-${folderId}`;
  moveToFolderButton.classList = 'p-1 hover:text-white';
  moveToFolderButton.title = 'Move to folder';
  moveToFolderButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" stroke-width="2" viewBox="0 0 512 512"><path d="M464 96h-192l-64-64h-160C21.5 32 0 53.5 0 80v352C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM336 311.1h-56v56C279.1 381.3 269.3 392 256 392c-13.27 0-23.1-10.74-23.1-23.1V311.1H175.1C162.7 311.1 152 301.3 152 288c0-13.26 10.74-23.1 23.1-23.1h56V207.1C232 194.7 242.7 184 256 184s23.1 10.74 23.1 23.1V264h56C349.3 264 360 274.7 360 288S349.3 311.1 336 311.1z"/></svg>';
  moveToFolderButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    // if shift click
    if (event.shiftKey) { // remove from folder
      const sourceFolderId = folderId;
      // get all the selected conversations inside the folder and move them out of the folder
      chrome.storage.local.get(['selectedConversations', 'conversationsOrder'], (result) => {
        const { selectedConversations, conversationsOrder } = result;
        const sourceFolder = conversationsOrder.find((f) => f.id === sourceFolderId);
        const selectedConversationsIds = selectedConversations.map((c) => c?.id);
        const selectedConversationsIdsInSourceFolder = selectedConversationsIds.filter((id) => sourceFolder.conversationIds.includes(id));
        if (selectedConversationsIdsInSourceFolder.length === 0) return;
        const folderCount = Array.from(document.querySelectorAll('#conversation-list > [id^=wrapper-folder-]:not(#wrapper-folder-trash)')).length;
        // remove selected conversations from source folder
        for (let i = 0; i < selectedConversationsIdsInSourceFolder.length; i += 1) {
          const conversationIndex = sourceFolder.conversationIds.findIndex((c) => c === selectedConversationsIdsInSourceFolder[i]);
          // remove from source folder
          sourceFolder.conversationIds.splice(conversationIndex, 1);
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
        if (sourceFolder.conversationIds.length === 0) {
          const sourceFolderContent = document.querySelector(`#folder-content-${sourceFolder.id}`);
          sourceFolderContent.appendChild(emptyFolderElement(sourceFolder.id));
        }
        chrome.storage.local.set({ conversationsOrder, selectedConversations: [] }, () => {
          showDefaultFolderActions();
          resetSelection();
        });
      });
    } else { // add to folder
      const targetFolderId = folderId;
      chrome.storage.local.get(['selectedConversations', 'conversationsOrder'], (result) => {
        const { selectedConversations, conversationsOrder } = result;
        const targetFolderIndex = conversationsOrder.findIndex((f) => f.id === targetFolderId);
        const targetFolder = conversationsOrder[targetFolderIndex];
        // if target folder is empty now, remove empty folder element
        if (targetFolder.conversationIds.length === 0) {
          const emptyFolder = document.querySelector(`#empty-folder-${targetFolderId}`);
          if (emptyFolder) emptyFolder.remove();
        }
        const selectedConversationsIds = selectedConversations.map((c) => c?.id);
        // remove selected conversations from conversationsOrder
        for (let i = 0; i < selectedConversationsIds.length; i += 1) {
          const conversationIndex = conversationsOrder.findIndex((c) => c === selectedConversationsIds[i]);
          if (conversationIndex !== -1) {
            // remove id from conversationsOrder
            conversationsOrder.splice(conversationIndex, 1);
            // move element to folder
            const conversationElement = document.querySelector(`#conversation-button-${selectedConversationsIds[i]}`);
            const targetFolderContentElement = document.querySelector(`#folder-content-${targetFolderId}`);
            targetFolderContentElement.appendChild(conversationElement);
          } else {
            // look inside folders
            const sourceFolder = conversationsOrder.find((f) => f.conversationIds.includes(selectedConversationsIds[i]));
            if (sourceFolder) {
              // remove id from source folder
              const sourceFolderConversationIndex = sourceFolder.conversationIds.findIndex((c) => c === selectedConversationsIds[i]);
              const sourceFolderIndex = conversationsOrder.findIndex((f) => f.id === sourceFolder.id);
              sourceFolder.conversationIds.splice(sourceFolderConversationIndex, 1);
              // update conversationsOrder with updated source folder
              conversationsOrder.splice(sourceFolderIndex, 1, sourceFolder);
              // move element to target folder
              const conversationElement = document.querySelector(`#conversation-button-${selectedConversationsIds[i]}`);
              const targetFolderContent = document.querySelector(`#folder-content-${targetFolderId}`);
              targetFolderContent.appendChild(conversationElement);
              // if source folder is empty now, add empty folder element
              if (sourceFolder.conversationIds.length === 0) {
                const folderContent = document.querySelector(`#folder-content-${sourceFolder.id}`);
                folderContent.appendChild(emptyFolderElement(sourceFolder.id));
              }
            }
          }
        }
        // add all selected conversations to folder
        const newConversationIds = targetFolder.conversationIds.concat(selectedConversationsIds);
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
  });
  actionsWrapper.appendChild(moveToFolderButton);
  return actionsWrapper;
}
function colorPicker(folder) {
  const folderElement = document.querySelector(`#folder-${folder.id}`);
  folderElement.classList.replace('pr-3', 'pr-20');
  folderElement.classList.replace('hover:pr-20', 'hover:pr-20');
  const colorPickerElement = document.createElement('div');
  colorPickerElement.id = `folder-actions-wrapper-${folder.id}`;
  colorPickerElement.tabIndex = 0;
  colorPickerElement.contentEditable = true;
  colorPickerElement.classList = 'absolute flex right-1 z-10 cursor-pointer flex items-center';
  colorPickerElement.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="2" viewBox="0 0 512 512" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M496 40v160C496 213.3 485.3 224 472 224h-160C298.8 224 288 213.3 288 200s10.75-24 24-24h100.5C382.8 118.3 322.5 80 256 80C158.1 80 80 158.1 80 256s78.97 176 176 176c41.09 0 81.09-14.47 112.6-40.75c10.16-8.5 25.31-7.156 33.81 3.062c8.5 10.19 7.125 25.31-3.062 33.81c-40.16 33.44-91.17 51.77-143.5 51.77C132.4 479.9 32 379.5 32 256s100.4-223.9 223.9-223.9c79.85 0 152.4 43.46 192.1 109.1V40c0-13.25 10.75-24 24-24S496 26.75 496 40z"/></svg><input type="color" class="w-6 border-gray-300 border rounded-md" id="color-picker-${folder.id}" style="cursor:pointer" value=${folder.color || '#5ea674'}>`;
  colorPickerElement.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  colorPickerElement.lastChild.addEventListener('input', (e) => {
    e.preventDefault();
    e.stopPropagation();
    chrome.storage.local.get(['conversationsOrder'], (result) => {
      const { conversationsOrder } = result;
      const curFolderElement = document.querySelector(`#folder-${folder.id}`);
      const folderContentElement = document.querySelector(`#folder-content-${folder.id}`);
      const folderIndex = conversationsOrder.findIndex((f) => f.id === folder.id);
      conversationsOrder[folderIndex].color = e.target.value;
      chrome.storage.local.set({ conversationsOrder }, () => {
        curFolderElement.style.backgroundColor = e.target.value;
        folderContentElement.style.borderColor = e.target.value;
      });
    });
  });

  // reset click
  colorPickerElement.firstChild.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    chrome.storage.local.get(['conversationsOrder', 'settings'], (result) => {
      const { conversationsOrder, settings } = result;
      const curFolderElement = document.querySelector(`#folder-${folder.id}`);
      const folderContentElement = document.querySelector(`#folder-content-${folder.id}`);
      const folderIndex = conversationsOrder.findIndex((f) => f.id === folder.id);
      const darkColor = settings.autoColorFolders ? generateRandomDarkColor() : '#40414f';
      conversationsOrder[folderIndex].color = darkColor;
      curFolderElement.style.backgroundColor = darkColor;
      folderContentElement.style.borderColor = darkColor;
      chrome.storage.local.set({ conversationsOrder });
    });
  });
  colorPickerElement.addEventListener('focusout', (e) => {
    if (colorPickerElement.contains(e.relatedTarget)) return;
    const curFolderElement = document.querySelector(`#folder-${folder.id}`);
    colorPickerElement.replaceWith(folderActions(folder.id));
    curFolderElement.classList.replace('pr-20', 'pr-3');
    folderElement.classList.replace('hover:pr-20', 'hover:pr-20');
  });

  return colorPickerElement;
}
function folderConfirmActions(folder, action) {
  let skipBlur = false;
  const folderElement = document.querySelector(`#folder-${folder.id}`);
  folderElement.classList.replace('pr-3', 'pr-20');
  folderElement.classList.replace('hover:pr-20', 'hover:pr-20');
  const actionsWrapper = document.createElement('div');
  actionsWrapper.id = `folder-actions-wrapper-${folder.id}`;
  actionsWrapper.classList = 'absolute flex right-1 z-10 text-gray-300';
  const confirmButton = document.createElement('button');
  confirmButton.id = `confirm-${folder.id}`;
  confirmButton.classList = 'p-1 hover:text-white';
  confirmButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  confirmButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (action === 'edit') {
      chrome.storage.local.get(['conversationsOrder', 'settings'], (result) => {
        const { conversationsOrder, settings } = result;
        const textInput = document.querySelector(`#rename-folder-${folder.id}`);
        const folderTitle = document.createElement('div');
        folderTitle.id = `title-folder-${folder.id}`;
        folderTitle.classList = 'flex-1 text-ellipsis max-h-5 overflow-hidden whitespace-nowrap break-all relative text-white relative';
        folderTitle.style.bottom = settings.showFolderCounts ? '5px' : '0px';
        folderTitle.innerText = textInput.value;
        textInput.parentElement.replaceChild(folderTitle, textInput);
        actionsWrapper.replaceWith(folderActions(folder.id));
        skipBlur = false;
        conversationsOrder.find((f) => f.id === folder.id).name = textInput.value;
        chrome.storage.local.set({ conversationsOrder });
        folderElement.classList.replace('pr-20', 'pr-3');
        folderElement.classList.replace('hover:pr-20', 'hover:pr-20');
      });
    }
  });
  const cancelButton = document.createElement('button');
  cancelButton.id = `cancel-${folder.id}`;
  cancelButton.classList = 'p-1 hover:text-white';
  cancelButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  cancelButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (action === 'edit') {
      chrome.storage.local.get(['settings'], (result) => {
        const { settings } = result;
        const textInput = document.querySelector(`#rename-folder-${folder.id}`);
        const folderTitle = document.createElement('div');
        folderTitle.id = `title-folder-${folder.id}`;
        folderTitle.classList = 'flex-1 text-ellipsis max-h-5 overflow-hidden whitespace-nowrap break-all relative';
        folderTitle.innerText = folder.name;
        folderTitle.style.bottom = settings.showFolderCounts ? '5px' : '0px';
        textInput.parentElement.replaceChild(folderTitle, textInput);
      });
    }
    actionsWrapper.replaceWith(folderActions(folder.id));
    folderElement.classList.replace('pr-20', 'pr-3');
    folderElement.classList.replace('hover:pr-20', 'hover:pr-20');
  });
  actionsWrapper.appendChild(confirmButton);
  actionsWrapper.appendChild(cancelButton);
  const textInput = document.querySelector(`#rename-folder-${folder.id}`);
  if (textInput) {
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.which === 13) {
        skipBlur = true;
        confirmButton.click();
      } else if (e.key === 'Escape') {
        cancelButton.click();
      }
      folderElement.classList.replace('pr-20', 'pr-3');
      folderElement.classList.replace('hover:pr-20', 'hover:pr-20');
    });
    textInput.addEventListener('blur', (e) => {
      if (skipBlur) return;
      if (e.relatedTarget?.id === `confirm-${folder.id}`) return;
      cancelButton.click();
      folderElement.classList.replace('pr-20', 'pr-3');
      folderElement.classList.replace('hover:pr-20', 'hover:pr-20');
    });
  }
  return actionsWrapper;
}
function emptyTrash() {
  showNewChatPage();
  chrome.storage.local.get(['conversations', 'conversationsOrder'], (result) => {
    const { conversations, conversationsOrder } = result;
    const newConversations = {};
    Object.keys(conversations).forEach((key) => {
      if (!conversations[key].archived) {
        newConversations[key] = conversations[key];
      }
    });
    const newConversationsOrder = conversationsOrder;

    const trashFolderContent = document.querySelector('#folder-content-trash');
    if (trashFolderContent) {
      // remove all children
      while (trashFolderContent.firstChild) {
        trashFolderContent.removeChild(trashFolderContent.firstChild);
      }
      trashFolderContent.appendChild(emptyFolderElement('trash'));
    }

    const trashFolder = conversationsOrder?.find((f) => f.id === 'trash');
    trashFolder.conversationIds = [];

    chrome.storage.local.set({
      conversations: newConversations,
      conversationsOrder: newConversationsOrder.map((f) => {
        if (f.id === 'trash') {
          return trashFolder;
        }
        return f;
      }),
    });
  });
}
function deleteFolder(folderId) {
  chrome.storage.local.get(['conversationsOrder'], (result) => {
    const { conversationsOrder } = result;
    const folder = conversationsOrder.find((conv) => conv?.id === folderId);
    showActionConfirm('Delete Folder', 'Are you sure you want to delete this folder? All conversations inside the folder will be deleted too.', 'Delete Folder', cancelDeleteFolder, () => confirmDeleteFolder(folder));
  });
}
function cancelDeleteFolder() {
  chrome.storage.local.set({
    selectedConversations: [],
  });
}
function confirmDeleteFolder(folder) {
  if (folder.id === 'trash') {
    emptyTrash();
    return;
  }
  chrome.storage.local.get(['conversations', 'conversationsOrder'], (result) => {
    const { conversations, conversationsOrder } = result;
    let newConversationsOrder = conversationsOrder;

    const trashFolder = newConversationsOrder?.find((f) => f.id === 'trash');

    const selectedConversationIds = folder.conversationIds;
    const successfullyDeletedConvIds = [];
    // wait for all deleteConversation to be resolved
    const promises = [];

    for (let i = 0; i < selectedConversationIds.length; i += 1) {
      const conv = conversations[selectedConversationIds[i]];
      if (!conv) continue;
      promises.push(deleteConversation(conv.id).then((data) => {
        if (data.success) {
          successfullyDeletedConvIds.push(conv.id);
          const conversationElement = document.querySelector(`#conversation-button-${conv.id}`);
          if (conversationElement && conversationElement.classList.contains('selected')) {
            showNewChatPage();
          }
          conversationElement.querySelector('[id^=checkbox-wrapper-]').remove();
          conversationElement.querySelector('[id^=actions-wrapper-]').remove();
          conversationElement.classList = notSelectedClassList;
          conversationElement.style.opacity = 0.7;
          conversationElement.classList.remove('hover:pr-20');
          const conversationElementIcon = conversationElement.querySelector('img');
          conversationElementIcon.src = chrome.runtime.getURL('icons/trash.png');
          const trashFolderContent = document.querySelector('#folder-content-trash');
          if (trashFolderContent) {
            const curEmptyFolderElement = trashFolderContent.querySelector('#empty-folder-trash');
            if (curEmptyFolderElement) curEmptyFolderElement.remove();
            // prepend conversation to trash folder
            trashFolderContent.prepend(conversationElement);
          }
        }
      }, () => { }));
    }
    // set archived = true for all selected conversations
    Promise.all(promises).then(() => {
      if (successfullyDeletedConvIds.length === folder.conversationIds.length) {
        // remove folder element
        document.querySelector(`#wrapper-folder-${folder.id}`)?.remove();
        // remove folder from conversationsOrder
        newConversationsOrder = conversationsOrder.filter((f) => f.id !== folder.id);
      }
      const newConversations = conversations
        ? Object.keys(conversations).reduce(
          (acc, key) => {
            if (successfullyDeletedConvIds.includes(key)) {
              acc[key] = {
                ...conversations[key],
                archived: true,
              };
            } else {
              acc[key] = {
                ...conversations[key],
              };
            }
            return acc;
          },
          {},
        )
        : {};
      trashFolder.conversationIds = [...successfullyDeletedConvIds, ...trashFolder.conversationIds];
      // remove duplicate conversationIds
      trashFolder.conversationIds = [...new Set(trashFolder.conversationIds)];

      chrome.storage.local.set({
        conversations: newConversations,
        conversationsOrder: newConversationsOrder.map((f) => {
          if (f.id === 'trash') {
            return trashFolder;
          }
          return f;
        }),
      });
    });
  });
}
