/* global deleteConversation, deleteAllConversations, resetSelection, showNewChatPage, notSelectedClassList, emptyFolderElement, isDescendant */
function replaceDeleteConversationButton() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const deleteConversationsButton = document.createElement('a');
  deleteConversationsButton.classList = 'flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm';
  // remove existing
  const existingDeleteConversationsButton = document.getElementById('delete-conversations-button');
  if (existingDeleteConversationsButton) existingDeleteConversationsButton.remove();
  const userMenu = nav.querySelector('#user-menu');
  userMenu.prepend(deleteConversationsButton);
  deleteConversationsButton.id = 'delete-conversations-button';
  chrome.storage.local.get(['selectedConversations'], (result) => {
    let { selectedConversations } = result;
    if (!selectedConversations) selectedConversations = [];
    deleteConversationsButton.innerHTML = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>Delete ${selectedConversations?.length === 0 ? 'All' : `${selectedConversations?.length} Selected`}`;
  });
  deleteConversationsButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    chrome.storage.local.get(['selectedConversations'], (result) => {
      const { selectedConversations } = result;

      e.target.style.removeProperty('background-color');
      e.target.style.color = 'white';
      e.target.style.borderColor = 'none';
      if (e.target.textContent === 'Delete All' && selectedConversations && selectedConversations?.length === 0) {
        showActionConfirm('Delete All', 'Are you sure you want to delete all conversations?', 'Delete All', null, confirmDeleteAllConversations);
      } else {
        showActionConfirm('Delete Selected', `Are you sure you want to delete ${selectedConversations?.length} conversations?`, 'Delete Selected', null, confirmDeleteSelectedConversations);
      }
    });
  });
}
function confirmDeleteAllConversations() {
  chrome.storage.local.get(['conversationsOrder', 'conversations', 'conversationsAreSynced', 'settings'], (result) => {
    const {
      conversationsOrder, conversations, conversationsAreSynced, settings,
    } = result;
    const trashFolder = conversationsOrder?.find((folder) => folder.id === 'trash');

    deleteAllConversations().then((data) => {
      if (data.success) {
        // set archived = true for all conversations
        const newConversations = conversations
          ? Object.keys(conversations).reduce(
            (acc, key) => {
              acc[key] = {
                ...conversations[key],
                archived: true,
              };
              return acc;
            },
            {},
          ) : {};
        chrome.storage.local.set({
          conversations: newConversations,
          selectedConversations: [],
          lastSelectedConversation: null,
        });
        // remove all children of conversationlist
        const conversationList = document.querySelector('#conversation-list');
        const conversationElements = Array.from(conversationList.querySelectorAll('[id^=conversation-button-]'));

        conversationElements.forEach((conversationElement) => {
          if (conversationsAreSynced && conversations && settings.autoSync) {
            conversationElement.querySelector('[id^=checkbox-wrapper-]')?.remove();
            conversationElement.querySelector('[id^=actions-wrapper-]')?.remove();
            conversationElement.classList = notSelectedClassList;
            conversationElement.style.opacity = 0.7;
            conversationElement.classList.remove('hover:pr-20');
            const conversationElementIcon = conversationElement.querySelector('img');
            conversationElementIcon.src = chrome.runtime.getURL('icons/trash.png');
            // move conversation after archivedConversationsTitle
            const trashFolderContent = document.querySelector('#folder-content-trash');
            if (trashFolderContent) {
              const emptyFolderElement = trashFolderContent.querySelector('#empty-folder-trash');
              if (emptyFolderElement) emptyFolderElement.remove();
              trashFolderContent.prepend(conversationElement);
            }
            // update conversationsOrder
            const convId = conversationElement.id.split('conversation-button-')[1];
            if (trashFolder && !trashFolder.conversationIds.includes(convId)) {
              trashFolder.conversationIds.unshift(convId);
            }
          } else {
            conversationElement.remove();
          }
        });
        conversationList.querySelectorAll('[id^=wrapper-folder-]').forEach((folderElement) => {
          if (folderElement.id !== 'wrapper-folder-trash') {
            folderElement.remove();
          }
        });
        // replace trashFolder with new trashFolder
        if (trashFolder) {
          chrome.storage.local.set({
            conversationsOrder: [trashFolder],
          });
        }
        showNewChatPage();
      }
    }, () => { });
  });
}
function confirmDeleteSelectedConversations() {
  document.querySelector('#delete-conversations-button').innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>Delete All';
  chrome.storage.local.get(['conversationsOrder', 'selectedConversations', 'conversations', 'conversationsAreSynced', 'settings'], (result) => {
    const {
      conversationsOrder, selectedConversations, conversations, conversationsAreSynced, settings,
    } = result;
    const trashFolder = conversationsOrder?.find((folder) => folder.id === 'trash');

    const selectedConversationIds = selectedConversations.map((conversation) => conversation.id);
    const successfullyDeletedConvIds = [];
    // wait for all deleteConversation to be resolved
    const promises = [];

    for (let i = 0; i < selectedConversationIds.length; i += 1) {
      promises.push(deleteConversation(selectedConversationIds[i]).then((data) => {
        if (data.success) {
          successfullyDeletedConvIds.push(selectedConversationIds[i]);
          const conversationElement = document.querySelector(`#conversation-button-${selectedConversationIds[i]}`);
          if (conversationElement && conversationElement.classList.contains('selected')) {
            showNewChatPage();
          }
          if (conversationElement && conversationsAreSynced && conversations && settings.autoSync) {
            conversationElement.querySelector('[id^=checkbox-wrapper-]')?.remove();
            conversationElement.querySelector('[id^=actions-wrapper-]')?.remove();
            conversationElement.classList = notSelectedClassList;
            conversationElement.style.opacity = 0.7;
            conversationElement.classList.remove('hover:pr-20');
            const conversationElementIcon = conversationElement.querySelector('img');
            conversationElementIcon.src = chrome.runtime.getURL('icons/trash.png');
            const trashFolderContent = document.querySelector('#folder-content-trash');
            if (trashFolderContent) {
              const emptyFolderElement = trashFolderContent.querySelector('#empty-folder-trash');
              if (emptyFolderElement) emptyFolderElement.remove();
              // prepend conversation to trash folder
              trashFolderContent.prepend(conversationElement);
            }
          } else {
            conversationElement?.remove();
          }
        }
      }, () => { }));
    }
    resetSelection();
    // set archived = true for all selected conversations
    if (conversationsAreSynced && conversations && settings.autoSync) {
      Promise.all(promises).then(() => {
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
        const newValues = {
          conversations: newConversations,
          selectedConversations: [],
          lastSelectedConversation: null,
        };
        // update conversationsOrder
        for (let i = 0; i < successfullyDeletedConvIds.length; i += 1) {
          const convId = successfullyDeletedConvIds[i];
          let conversationOrderIndex = conversationsOrder.findIndex((id) => id === convId);
          if (conversationOrderIndex !== -1) {
            conversationsOrder.splice(conversationOrderIndex, 1);
          } else { // if not found, look into folders
            const conversationFolder = conversationsOrder.find((f) => (f.id !== 'trash') && f.conversationIds && f.conversationIds.includes(convId));
            if (conversationFolder) {
              conversationOrderIndex = conversationFolder.conversationIds.findIndex((id) => id === convId);
              conversationFolder.conversationIds.splice(conversationOrderIndex, 1);
              // if folder is empty now, add empty folder element
              if (conversationFolder.conversationIds.length === 0) {
                const folderContent = document.querySelector(`#folder-content-${conversationFolder.id}`);
                folderContent.appendChild(emptyFolderElement(conversationFolder.id));
              }
            }
          }
        }

        if (trashFolder) {
          trashFolder.conversationIds = [...successfullyDeletedConvIds, ...trashFolder.conversationIds];
          // remove dupleicate conversationIds
          trashFolder.conversationIds = [...new Set(trashFolder.conversationIds)];
          const newConversationsOrder = conversationsOrder.map((folder) => {
            if (folder.id === 'trash') {
              return trashFolder;
            }
            return folder;
          });
          chrome.storage.local.set({
            conversationsOrder: newConversationsOrder,
          });
        }
        chrome.storage.local.set(newValues);
      });
    }
  });
}
// eslint-disable-next-line no-unused-vars
function showActionConfirm(title, subtitle, confirm, cancelCallback, confirmCallback, confirmType = 'red') { // confirmType: red, orange, green
  const bottonColors = {
    red: 'btn-danger',
    orange: 'btn-warning',
    green: 'btn-primary',
  };
  const confirmActionDialog = `<div data-state="open" class="fixed inset-0 bg-black/50 dark:bg-gray-600/70" style="pointer-events: auto;"><div class="grid-cols-[10px_1fr_10px] grid h-full w-full grid-rows-[minmax(10px,_1fr)_auto_minmax(10px,_1fr)] md:grid-rows-[minmax(20px,_1fr)_auto_minmax(20px,_1fr)] overflow-y-auto"><div id="confirm-action-dialog-content" role="dialog" id="radix-:r3m:" aria-describedby="radix-:r3o:" aria-labelledby="radix-:r3n:" data-state="open" class="relative col-auto col-start-2 row-auto row-start-2 w-full rounded-xl text-left shadow-xl transition-all left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 max-w-md" tabindex="-1" style="pointer-events: auto;"><div class="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-black/10 dark:border-white/10"><div class="flex"><div class="flex items-center"><div class="flex grow flex-col gap-1"><h2 id="radix-:r3n:" as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">${title}</h2></div></div></div></div><div class="p-4 sm:p-6"><div class="text-sm">${subtitle}</div><div class="mt-5 sm:mt-4"><div class="mt-5 flex flex-col gap-3 sm:mt-4 sm:flex-row-reverse"><button id="confirm-button" class="btn relative ${bottonColors[confirmType]}" as="button"><div class="flex w-full gap-2 items-center justify-center">${confirm}</div></button><button id="cancel-button" class="btn relative btn-neutral" as="button"><div class="flex w-full gap-2 items-center justify-center">Cancel</div></button></div></div></div></div></div></div></div>`;
  const confirmActionDialogElement = document.createElement('div');
  confirmActionDialogElement.id = 'confirm-action-dialog';
  confirmActionDialogElement.classList = 'absolute inset-0';
  confirmActionDialogElement.style = 'z-index: 10000;';
  confirmActionDialogElement.innerHTML = confirmActionDialog;
  document.body.appendChild(confirmActionDialogElement);
  const confirmButton = document.querySelector('#confirm-action-dialog #confirm-button');
  const cancelButton = document.querySelector('#confirm-action-dialog #cancel-button');
  confirmButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirmCallback) confirmCallback();
    confirmActionDialogElement.remove();
  });
  cancelButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cancelCallback) cancelCallback();
    confirmActionDialogElement.remove();
  });
  // click outside to close
  confirmActionDialogElement.addEventListener('click', (e) => {
    const confirmActionDialogContent = document.querySelector('#confirm-action-dialog-content');
    if (!isDescendant(confirmActionDialogContent, e.target)) {
      confirmActionDialogElement.remove();
    }
  });
}
// eslint-disable-next-line no-unused-vars
function initializeReplaceDeleteConversationButton() {
  replaceDeleteConversationButton();
}
