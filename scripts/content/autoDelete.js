/* global deleteConversation, showNewChatPage, emptyFolderElement */
// eslint-disable-next-line no-unused-vars
function initializeAutoDelete() {
  chrome.storage.local.get(['settings', 'conversations', 'conversationsAreSynced', 'conversationsOrder'], ({
    settings, conversations, conversationsAreSynced, conversationsOrder,
  }) => {
    const {
      autoSync, autoDeleteOldChats, autoDeleteMode, autoDeleteThreshold,
    } = settings;
    if (!autoSync) return;
    if (!conversationsAreSynced) return;
    if (!autoDeleteOldChats) return;

    chrome.runtime.sendMessage({
      checkHasSubscription: true,
      detail: {
        forceRefresh: false,
      },
    }, (hasSubscription) => {
      if (!hasSubscription) return;
      if (autoDeleteMode.code === 'days') {
        deleteByDate(conversationsOrder, conversations, autoDeleteThreshold);
      } else if (autoDeleteMode.code === 'number') {
        deleteByCount(conversationsOrder, conversations, autoDeleteThreshold);
      }
    });
  });
}

function deleteByDate(conversationsOrder, conversations, autoDeleteThreshold) {
  const now = new Date();
  const threshold = autoDeleteThreshold;
  const thresholdDate = new Date(now.getTime() - threshold * 24 * 60 * 60 * 1000);
  const thresholdTimestamp = thresholdDate.getTime();
  const conversationsToDelete = Object.values(conversations).filter((c) => !c.autoDeleteLock && !c.archived && c.update_time < thresholdTimestamp);
  if (conversationsToDelete.length === 0) return;
  const conversationsToDeleteIds = conversationsToDelete.map((c) => c?.id);

  deleteConversationsByIds(conversationsOrder, conversations, conversationsToDeleteIds);
}
function deleteByCount(conversationsOrder, conversations, autoDeleteThreshold) {
  if (Object.values(conversations).length <= autoDeleteThreshold) return;
  const conversationsToDelete = Object.values(conversations).sort(
    (a, b) => b.update_time - a.update_time,
  ).filter((c) => !c.autoDeleteLock && !c.archived).slice(autoDeleteThreshold);

  const conversationsToDeleteIds = conversationsToDelete.map((c) => c?.id);

  deleteConversationsByIds(conversationsOrder, conversations, conversationsToDeleteIds);
}

function deleteConversationsByIds(conversationsOrder, conversations, conversationsToDeleteIds) {
  const successfullyDeletedConvIds = [];
  const promises = [];

  for (let i = 0; i < conversationsToDeleteIds.length; i += 1) {
    promises.push(deleteConversation(conversationsToDeleteIds[i]).then((data) => {
      if (data.success) {
        successfullyDeletedConvIds.push(conversationsToDeleteIds[i]);
        const conversationElement = document.querySelector(`#conversation-button-${conversationsToDeleteIds[i]}`);
        if (conversationElement && conversationElement.classList.contains('selected')) {
          showNewChatPage();
        }
        conversationElement.querySelector('[id^=checkbox-wrapper-]')?.remove();
        conversationElement.querySelector('[id^=actions-wrapper-]')?.remove();
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
      }
    }, () => { }));
  }

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
    const trashFolder = conversationsOrder?.find((folder) => folder.id === 'trash');
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
