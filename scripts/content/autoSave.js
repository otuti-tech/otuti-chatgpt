// eslint-disable-next-line no-unused-vars
/* global updateNewChatButtonNotSynced, getAllConversations, getConversation, loadConversationList, initializeTimestamp, isGenerating, prependConversation, generateTitleForConversation, canSubmitPrompt, formatDate, userChatIsActuallySaved:true, addAsyncInputEvents, addSyncBanner, isWindows, sortConversationsByTimestamp, addGizmoToList, formatTime */
/* eslint-disable no-await-in-loop, */
let autoSaveTimeoutId;

// eslint-disable-next-line no-unused-vars
async function autoSaveCountDownAsync() {
  await new Promise((resolve) => {
    autoSaveTimeoutId = setTimeout(() => {
      resolve();
    }, 200);
  });
}
async function addConversationToStorage(localConversations, remoteConvId) {
  const newLocalConversations = await getConversation(remoteConvId).then((conversation) => {
    if (!conversation) return localConversations;
    Object.keys(conversation.mapping).forEach((key) => {
      if (localConversations[remoteConvId] && localConversations[remoteConvId]?.mapping[key] && localConversations[remoteConvId]?.mapping[key]?.pinned) {
        conversation.mapping[key].pinned = true;
      }
    });
    localConversations[remoteConvId] = {
      ...conversation,
      id: remoteConvId,
      archived: false,
      saveHistory: true,
      shouldRefresh: false,
      autoDeleteLock: localConversations[remoteConvId]?.autoDeleteLock || false,
      update_time: formatTime(conversation.update_time),
    };
    chrome.storage.local.set({
      conversations: localConversations,
    });
    return localConversations;
  }, () => localConversations);
  return newLocalConversations;
}
// eslint-disable-next-line no-unused-vars
function updateOutOfDateConversation() {
  chrome.storage.local.get(['conversations'], (result) => {
    const { conversations } = result;
    const outOfDateConversations = Object.values(conversations).filter((conv) => conv.shouldRefresh || conv.update_time === 'force_copy');
    if (outOfDateConversations.length === 0) return;
    outOfDateConversations.forEach((conv) => {
      updateConversationInStorage(conversations, conv.id, true);
    });
  });
}
async function updateConversationInStorage(localConversations, localConvId, forceRefresh = false) {
  const newLocalConversations = await getConversation(localConvId, forceRefresh).then((conversation) => {
    if (!conversation) return localConversations;
    Object.keys(conversation.mapping)?.forEach((key) => {
      if (localConversations[localConvId] && localConversations[localConvId]?.mapping[key] && localConversations[localConvId]?.mapping[key]?.pinned) {
        conversation.mapping[key].pinned = true;
      }
    });
    localConversations[localConvId] = {
      ...localConversations[localConvId],
      ...conversation,
      update_time: formatTime(conversation.update_time),
      shouldRefresh: false,
    };
    chrome.storage.local.set({
      conversations: localConversations,
    });
    return localConversations;
  }, () => localConversations);
  return newLocalConversations;
}

// eslint-disable-next-line no-unused-vars
function updateOrCreateConversation(conversationId, gizmoId, messages, parentId, settings, generateTitle = false, forceRefresh = false, newSystemMessage = {}) {
  if (!messages || messages.length === 0) return;
  // eslint-disable-next-line consistent-return
  return chrome.storage.local.get(['conversations', 'enabledPluginIds']).then((result) => {
    const existingConversation = result.conversations?.[conversationId];
    if (existingConversation) {
      existingConversation.languageCode = settings.selectedLanguage.code;
      existingConversation.toneCode = settings.selectedTone.code;
      existingConversation.writingStyleCode = settings.selectedWritingStyle.code;
      existingConversation.shouldRefresh = forceRefresh;
      existingConversation.current_node = messages[messages.length - 1].id;
      existingConversation.update_time = 'force_copy';
      messages.forEach((message, index) => {
        if (!message.create_time) message.create_time = (new Date()).getTime();
        const pid = index === 0 ? parentId : messages[index - 1]?.id;
        if (existingConversation.mapping[message.id]?.id) {
          existingConversation.mapping[message.id].message = message;
        } else {
          existingConversation.mapping[message.id] = {
            children: [], id: message.id, message, parent: pid,
          };
        }
        if (pid) {
          // eslint-disable-next-line prefer-destructuring
          const children = existingConversation.mapping[pid]?.children;
          if (children && !children.includes(message.id)) {
            existingConversation.mapping[pid].children.push(message.id);
          }
        }
      });
      return chrome.storage.local.set(
        {
          conversations: {
            ...result.conversations,
            [conversationId]: existingConversation,
          },
        },
      ).then(
        () => {
          userChatIsActuallySaved = true;
          const mapping = Object.values(existingConversation.mapping);
          const userMessages = mapping.filter((m) => (m.message?.role === 'user' || m.message?.author?.role === 'user') && m.message.recipient === 'all');
          const assistantMessages = mapping.filter((m) => (m.message?.role === 'assistant' || m.message?.author?.role === 'assistant') && m.message.recipient === 'all');
          if (generateTitle && existingConversation.title === 'New chat' && userMessages.length === 1 && assistantMessages.length > 0) { // only one assistant message
            if (settings.saveHistory) {
              // find last system message
              const allSystemMessages = mapping.filter((m) => m.message?.role === 'system' || m.message?.author?.role === 'system');

              const systemMessageWithCustomInstruction = allSystemMessages.find((node) => node?.message?.metadata?.user_context_message_data);
              const customInstrucionProfile = systemMessageWithCustomInstruction?.message?.metadata?.user_context_message_data || undefined;
              generateTitleForConversation(existingConversation.id, messages[messages.length - 1].id, customInstrucionProfile);
            }
          } else { // === updated
            // move cnversationelemnt after searchbox
            const conversationElement = document.querySelector(`#conversation-button-${conversationId}`);
            const conversationUpdateTime = formatDate(new Date());
            const searchBoxWrapper = document.querySelector('#conversation-search-wrapper');

            if (conversationElement && searchBoxWrapper) {
              const conversationTimestampElement = conversationElement.querySelector('#timestamp');
              conversationTimestampElement.innerHTML = `${existingConversation.autoDeleteLock && !existingConversation.archived ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" stroke="#ef4146" fill="#ef4146" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1 h-2 w-2" height="1em" width="1em"><path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"/></svg>' : ''}${conversationUpdateTime}`;
              let lastFolderAtTheTop = searchBoxWrapper;
              while (lastFolderAtTheTop.nextElementSibling.id.startsWith('wrapper-folder-') && lastFolderAtTheTop.nextElementSibling.id !== 'wrapper-folder-trash') {
                lastFolderAtTheTop = lastFolderAtTheTop.nextElementSibling;
              }
              // update conversationsOrder
              chrome.storage.local.get(['conversationsOrder'], (res) => {
                const { conversationsOrder } = res;
                const conversationIndex = conversationsOrder.findIndex((conv) => conv === conversationId);
                if (conversationIndex !== -1) {
                  // this guarantees we only move if conversation is not in a folder
                  lastFolderAtTheTop.after(conversationElement);
                  // find the folder with id matching the wrapper-folder id
                  const lastFolderAtTheTopIndex = conversationsOrder.findIndex((conv) => conv?.id === lastFolderAtTheTop.id.split('wrapper-folder-')[1]);
                  conversationsOrder.splice(conversationIndex, 1);
                  conversationsOrder.splice(lastFolderAtTheTopIndex, 0, conversationId);

                  chrome.storage.local.set({
                    conversationsOrder,
                  });
                }
              });
            }
          }
        },
      );
    }
    const systemMessage = {
      id: newSystemMessage.id,
      message: { ...newSystemMessage },
      parent: parentId,
      children: [
        messages[0].id,
      ],
    };
    const newConversation = {
      id: conversationId,
      shouldRefresh: false,
      archived: false,
      saveHistory: settings.saveHistory,
      languageCode: settings.selectedLanguage?.code,
      toneCode: settings.selectedTone?.code,
      writingStyleCode: settings.selectedWritingStyle?.code,
      current_node: messages[0].id,
      title: 'New chat',
      create_time: (new Date()).getTime(),
      update_time: 'force_copy',
      mapping: {
        [parentId]: {
          children: [systemMessage.id], id: parentId, message: null, parent: null,
        },
        [systemMessage.id]: systemMessage,
        [messages[0].id]: {
          children: [], id: messages[0].id, message: messages[0], parent: systemMessage.id,
        },
      },
      moderation_results: [],
    };
    if (settings.selectedModel.slug.includes('plugins')) {
      newConversation.pluginIds = result.enabledPluginIds;
    }
    if (gizmoId) {
      newConversation.gizmo_id = gizmoId;
      newConversation.conversation_template_id = gizmoId;
    }
    return chrome.storage.local.set({
      conversations: {
        ...result.conversations,
        [conversationId]: newConversation,
      },
    }).then(() => {
      userChatIsActuallySaved = true;
      prependConversation(newConversation, settings);
      if (gizmoId) {
        addGizmoToList(gizmoId, true);
      }
    });
  });
}
function addProgressBar() {
  const existingSyncDiv = document.getElementById('sync-div');
  if (existingSyncDiv) existingSyncDiv.remove();

  const nav = document.querySelector('nav');
  if (!nav) return;
  nav.style.position = 'relative';
  nav.style.overflow = 'hidden';
  const progressBar = document.createElement('div');
  progressBar.classList = 'absolute bottom-0 left-0 z-50 animate-pulse';
  progressBar.style = 'height:1px;width: 100%; background-color: #00aaff;margin:0;';
  progressBar.id = 'sync-progressbar';
  const progressLabel = document.createElement('div');
  progressLabel.classList = 'absolute bottom-1 right-1 z-50 text-xs text-gray-500';
  progressLabel.id = 'sync-progresslabel';
  progressLabel.innerText = 'Syncing...';

  const tooltip = document.createElement('div');
  tooltip.classList = 'flex z-50 text-xs rounded p-2';
  tooltip.style = 'position: absolute; width: 250px; border: solid 1px #8e8ea0; bottom: 20px; right: 4px; background-color: #343541; display:none; margin:0;';
  tooltip.id = 'sync-tooltip';
  tooltip.innerText = 'You conversations are being backed up in your computer for a faster experience! This can take a while.';
  progressLabel.addEventListener('mouseover', () => {
    tooltip.style.display = 'block';
  });
  progressLabel.addEventListener('mouseout', () => {
    tooltip.style.display = 'none';
  });
  const refreshButton = document.createElement('div');
  refreshButton.id = 'sync-refresh-button';
  refreshButton.classList = 'z-50 text-xs text-gray-500 w-3 h-3 m-0';
  refreshButton.style = 'position: absolute; bottom: 6px; left: 8px; cursor: pointer;';
  refreshButton.title = 'Syncing Conversations';
  refreshButton.innerHTML = '<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#00aaff" d="M468.9 32.11c13.87 0 27.18 10.77 27.18 27.04v145.9c0 10.59-8.584 19.17-19.17 19.17h-145.7c-16.28 0-27.06-13.32-27.06-27.2c0-6.634 2.461-13.4 7.96-18.9l45.12-45.14c-28.22-23.14-63.85-36.64-101.3-36.64c-88.09 0-159.8 71.69-159.8 159.8S167.8 415.9 255.9 415.9c73.14 0 89.44-38.31 115.1-38.31c18.48 0 31.97 15.04 31.97 31.96c0 35.04-81.59 70.41-147 70.41c-123.4 0-223.9-100.5-223.9-223.9S132.6 32.44 256 32.44c54.6 0 106.2 20.39 146.4 55.26l47.6-47.63C455.5 34.57 462.3 32.11 468.9 32.11z"/></svg>';
  const syncDiv = document.createElement('div');
  syncDiv.classList = 'flex flex-1 flex-col';
  syncDiv.id = 'sync-div';
  syncDiv.style = 'max-height: 10px; opacity:1';
  syncDiv.appendChild(tooltip);
  syncDiv.appendChild(refreshButton);
  syncDiv.appendChild(progressLabel);
  syncDiv.appendChild(progressBar);
  nav.appendChild(syncDiv);
}
function resetProgressBar() {
  const progressBar = document.getElementById('sync-progressbar');
  const progressLabel = document.getElementById('sync-progresslabel');
  const tooltip = document.getElementById('sync-tooltip');
  if (progressBar && progressLabel && tooltip) {
    progressBar.style.backgroundColor = 'gold';
    progressBar.classList.remove('animate-pulse');
    progressLabel.innerText = 'Synced';

    tooltip.innerText = 'Your conversations are synced!';
  }
  const refreshButton = document.getElementById('sync-refresh-button');
  if (refreshButton) {
    refreshButton.title = 'Sync Conversations';
    refreshButton.classList.add('cursor-pointer');
    refreshButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="gold" d="M468.9 32.11c13.87 0 27.18 10.77 27.18 27.04v145.9c0 10.59-8.584 19.17-19.17 19.17h-145.7c-16.28 0-27.06-13.32-27.06-27.2c0-6.634 2.461-13.4 7.96-18.9l45.12-45.14c-28.22-23.14-63.85-36.64-101.3-36.64c-88.09 0-159.8 71.69-159.8 159.8S167.8 415.9 255.9 415.9c73.14 0 89.44-38.31 115.1-38.31c18.48 0 31.97 15.04 31.97 31.96c0 35.04-81.59 70.41-147 70.41c-123.4 0-223.9-100.5-223.9-223.9S132.6 32.44 256 32.44c54.6 0 106.2 20.39 146.4 55.26l47.6-47.63C455.5 34.57 462.3 32.11 468.9 32.11z"/></svg>';
    refreshButton.onclick = (e) => {
      // remove progress bar and refresh button and progress label
      const canSubmit = canSubmitPrompt();
      if (isGenerating || !canSubmit) return;
      const syncDiv = document.getElementById('sync-div');
      syncDiv.remove();
      const { pathname } = new URL(window.location.toString());
      const conversationId = pathname.split('/c/').pop().replace(/[^a-z0-9-]/gi, '');
      const refreshIds = [];
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(conversationId)) {
        refreshIds.push(conversationId);
      }
      // if shift + cmnd/ctrl
      if (e.shiftKey && (e.metaKey || (isWindows() && e.ctrlKey))) {
        chrome.storage.local.set({
          conversations: {},
          conversationsAreSynced: false,
        }, () => {
          window.location.reload();
        });
      } else {
        initializeAutoSave(true, refreshIds);
      }
    };
  }
}
function reloadOrAddRefreshButtonToSyncBanner(settings) {
  const existingSyncBanner = document.querySelector('#sync-nav-wrapper');
  const refreshButton = document.getElementById('sync-refresh-button');
  const textAreaElement = document.querySelector('main form textarea');
  const modalWrapper = document.querySelector('[id^=modal-wrapper-]');
  const newPromptChainModal = document.querySelector('#new-prompt-chain-modal');
  const customInstructionNameInput = document.querySelector('#custom-instructions-name-input');
  if (settings.autoRefreshAfterSync && textAreaElement && textAreaElement.value === '' && !modalWrapper && !customInstructionNameInput && !newPromptChainModal) {
    window.location.reload();
  } else {
    // replace the content with "sync is complete" and a refresh button
    const pageRefreshButton = document.createElement('button');
    refreshButton.id = 'sync-page-refresh-button';
    pageRefreshButton.style = 'color: gold; cursor: pointer; border: solid 1px gold; padding: 8px; border-radius: 4px; margin-left: 16px;';
    pageRefreshButton.innerText = 'Refresh page';
    pageRefreshButton.addEventListener('click', () => {
      window.location.reload();
    });
    setTimeout(() => {
      existingSyncBanner.firstChild.innerHTML = 'Sync is complete! Refresh the page to see enable all features.';
      existingSyncBanner.firstChild.appendChild(pageRefreshButton);
    }, 500);
  }
}
function inSyncConversations(localConvs, remoteConvs) {
  return Object.keys(localConvs).filter(
    (id) => !localConvs[id].archived
      && !localConvs[id].shouldRefresh
      && (formatTime(localConvs[id]?.update_time) === formatTime(remoteConvs.find((rc) => rc.id === id)?.update_time))
      && (typeof localConvs[id].saveHistory === 'undefined' || localConvs[id].saveHistory),
  );
}
function updateProgressBar(localConvs, remoteConvs) {
  const progressLabel = document.getElementById('sync-progresslabel');
  if (progressLabel) {
    // eslint-disable-next-line no-loop-func
    progressLabel.innerText = `Syncing(${inSyncConversations(localConvs, remoteConvs).length}/${Object.keys(remoteConvs).length})`;
    if (remoteConvs.length > 0 && remoteConvs.length - inSyncConversations(localConvs, remoteConvs).length > 10) {
      addSyncBanner();
    }
  }
}

function removeDuplicateConversationIds(conversationsOrder) {
  const conversationsOrderIds = conversationsOrder.filter((conv) => (typeof conv === 'string'));
  const folders = conversationsOrder.filter((conv) => typeof conv === 'object' && conv?.id !== 'trash');
  const trash = conversationsOrder.find((folder) => folder?.id === 'trash');
  // remove duplicates from conversationsOrderIds
  const newConversationsOrderIds = [...new Set(conversationsOrderIds)];
  // remove duplicates from folders
  folders.forEach((folder) => {
    folder.conversationIds = [...new Set(folder?.conversationIds)];
  });
  // remove duplicates from trash
  trash.conversationIds = [...new Set(trash?.conversationIds)];
  // ---------------------------------------
  // combine folders with same id into one and remove duplicates
  const newFolders = [];
  folders.forEach((folder) => {
    const existingFolder = newFolders.find((f) => f?.id === folder?.id);
    if (existingFolder) {
      existingFolder.conversationIds = [...new Set([...existingFolder.conversationIds, ...folder.conversationIds])];
    } else {
      newFolders.push(folder);
    }
  });
  // ---------------------------------------
  // remove anything in trash from newConversationsOrderIds
  trash.conversationIds.forEach((convId) => {
    if (newConversationsOrderIds.includes(convId)) {
      newConversationsOrderIds.splice(newConversationsOrderIds.indexOf(convId), 1);
    }
  });
  // remove anything in trash from folders
  newFolders.forEach((folder) => {
    folder.conversationIds = folder.conversationIds.filter((convId) => !trash.conversationIds.includes(convId));
  });
  // ---------------------------------------
  // remove anything in folders from newConversationsOrderIds
  newFolders.forEach((folder) => {
    folder.conversationIds.forEach((convId) => {
      if (newConversationsOrderIds.includes(convId)) {
        newConversationsOrderIds.splice(newConversationsOrderIds.indexOf(convId), 1);
      }
    });
  });
  // ---------------------------------------
  // remove anything in folders from other folders
  newFolders.forEach((folder) => {
    newFolders.forEach((f) => {
      if (f.id !== folder.id) {
        f.conversationIds = f.conversationIds.filter((convId) => !folder.conversationIds.includes(convId));
      }
    });
  });

  return [...newFolders, ...newConversationsOrderIds, trash];
}

function deleteFromConversationsOrder(conversationsOrder, convId, addToTrash = true) {
  const newConversationsOrder = conversationsOrder || [];
  // check conversations
  if (newConversationsOrder.indexOf(convId) !== -1) {
    newConversationsOrder.splice(newConversationsOrder.indexOf(convId), 1);
  } else {
    // check folders
    // eslint-disable-next-line no-loop-func
    newConversationsOrder.forEach((folder) => {
      if (typeof folder === 'object' && folder?.id !== 'trash' && folder?.conversationIds.indexOf(convId) !== -1) {
        folder?.conversationIds.splice(folder.conversationIds.indexOf(convId), 1);
      }
    });
  }
  if (addToTrash) {
    const trashFolder = newConversationsOrder.find((folder) => folder?.id === 'trash');

    // remove duplicate conversation from trash folder(to be safe)
    trashFolder.conversationIds = [...new Set(trashFolder.conversationIds)];
    // add conversation to the begining of trash folder
    if (!trashFolder?.conversationIds.includes(convId)) {
      newConversationsOrder.find((folder) => folder?.id === 'trash')?.conversationIds.unshift(convId);
    }
  }
  return newConversationsOrder;
}
function removeNonArchivedConversationFromTrash(conversationsOrder, convId) {
  const newConversationsOrder = conversationsOrder || [];
  const allVisibleConversationsOrderIds = newConversationsOrder.filter((conv) => conv?.id !== 'trash').map((conv) => (typeof conv === 'object' ? conv?.conversationIds : conv)).flat();

  const trashConversationIds = newConversationsOrder.find((conv) => conv?.id === 'trash')?.conversationIds || [];
  if (trashConversationIds.includes(convId)) {
    trashConversationIds.splice(trashConversationIds.indexOf(convId), 1);
  }
  if (!allVisibleConversationsOrderIds.includes(convId)) {
    // add conversation to the begining of conversationsOrder (will be sorted later)
    newConversationsOrder.unshift(convId);
  }
  // will be added to conversationsOrder later where this function is called
  return newConversationsOrder;
}
// eslint-disable-next-line no-unused-vars
function initializeAutoSave(skipInputFormReload = false, forceRefreshIds = []) {
  clearTimeout(autoSaveTimeoutId);
  addProgressBar();

  const forceRefresh = true;
  getAllConversations(forceRefresh).then((remoteConversations) => {
    chrome.storage.local.get(['conversationsOrder', 'conversations', 'settings'], (result) => {
      const { settings, conversationsOrder } = result;
      let localConversations = {};
      if (result.conversations && Object.keys(result.conversations).length > 0) {
        localConversations = result.conversations;
      }
      let newConversationsOrder = conversationsOrder && (conversationsOrder?.findIndex((f) => f && f.id === 'trash') !== -1)
        ? conversationsOrder
        : [{
          id: 'trash',
          name: 'Trash',
          color: '#e12d2d',
          conversationIds: [],
          isOpen: false,
        }];
      chrome.storage.local.set({
        conversationsAreSynced: false,
        conversationsOrder: newConversationsOrder,
        conversations: localConversations,
      }, async () => {
        const remoteConvIds = remoteConversations.map((conv) => conv?.id);
        const localConvIds = Object.keys(localConversations);
        // update existing conversations
        for (let i = 0; i < localConvIds.length; i += 1) {
          if (localConversations[localConvIds[i]].saveHistory === false) continue;
          const remoteConv = remoteConversations.find((conv) => conv?.id === localConvIds[i]);
          if (!remoteConv) {
            localConversations[localConvIds[i]].archived = true;
          } else if (!forceRefreshIds.includes(localConvIds[i]) && localConversations[localConvIds[i]]?.update_time === 'force_copy') {
            localConversations[localConvIds[i]].title = remoteConv?.title;
            localConversations[localConvIds[i]].archived = false;
            localConversations[localConvIds[i]].update_time = formatTime(remoteConv.update_time);
          } else {
            localConversations[localConvIds[i]].title = remoteConv?.title;
            localConversations[localConvIds[i]].archived = false;
            if (
              forceRefreshIds.includes(localConvIds[i])
              || localConversations[localConvIds[i]]?.shouldRefresh
              || formatTime(localConversations[localConvIds[i]]?.update_time) !== formatTime(remoteConv.update_time)) {
              // if conversation was updated on another device, or shouldRefresh=True update it
              localConversations = await updateConversationInStorage(localConversations, localConvIds[i]);
            }
          }
        }
        // save local conversations to storage to lose progress
        chrome.storage.local.set({
          conversations: localConversations,
        });
        // load non-synced state
        if (remoteConvIds.length > 0 && (remoteConvIds.length - inSyncConversations(localConversations, remoteConversations).length) > 10) {
          initializeTimestamp();
          updateNewChatButtonNotSynced();
          addAsyncInputEvents();
          addSyncBanner();
        }
        // Add missing conversations from remote to local
        for (let i = 0; i < remoteConvIds.length; i += 1) {
          if (!localConvIds.includes(remoteConvIds[i])) {
            localConversations = await addConversationToStorage(localConversations, remoteConvIds[i]);
            // update progress bar
            updateProgressBar(localConversations, remoteConversations);
            // await autoSaveCountDownAsync();
          }
        }
        // update conversationsOrder based on localConversations
        const newLocalConvIds = Object.keys(localConversations);
        const allConversationsOrderIds = newConversationsOrder.map((conv) => (typeof conv === 'object' ? conv?.conversationIds : conv)).flat();
        const trashConversationIds = newConversationsOrder.find((conv) => conv?.id === 'trash')?.conversationIds || [];
        // find ids that exist in conversationsOrder but not in localConversations
        const extraConversationsOrderIds = allConversationsOrderIds.filter((id) => !newLocalConvIds.includes(id));
        // remove extraConversationsOrderIds from conversationsOrder
        for (let i = 0; i < extraConversationsOrderIds.length; i += 1) {
          newConversationsOrder = deleteFromConversationsOrder(newConversationsOrder, extraConversationsOrderIds[i], false);
        }
        // add newLocalConvIds to conversationsOrder and move archived conversations to trash
        for (let i = 0; i < newLocalConvIds.length; i += 1) {
          if (localConversations[newLocalConvIds[i]].archived && !trashConversationIds.includes(newLocalConvIds[i])) {
            // move to trash
            newConversationsOrder = deleteFromConversationsOrder(newConversationsOrder, newLocalConvIds[i], true);
          } else if (!localConversations[newLocalConvIds[i]].archived) {
            // if conversationId is in trash remove it from trash
            newConversationsOrder = removeNonArchivedConversationFromTrash(newConversationsOrder, newLocalConvIds[i]);
          }
        }

        // remove duplicate convids from newConversationsOrder and remove duplicates from conversationsIds in each folder
        newConversationsOrder = removeDuplicateConversationIds(newConversationsOrder);
        // sort conversations by updated time
        newConversationsOrder = sortConversationsByTimestamp(newConversationsOrder, localConversations);
        // save everything to storage
        chrome.storage.local.set({
          conversations: localConversations,
          conversationsAreSynced: true,
          conversationsOrder: newConversationsOrder,
        }, () => {
          resetProgressBar();
          const existingSyncBanner = document.querySelector('#sync-nav-wrapper');
          if (existingSyncBanner) {
            reloadOrAddRefreshButtonToSyncBanner(settings);
          } else {
            loadConversationList(skipInputFormReload);
          }
        });
      });
    });
  }, () => {
    // if the conversation history endpoint failed, set conversationsAreSynced to true
    chrome.storage.local.set({
      conversationsAreSynced: true,
    }, () => {
      resetProgressBar();
      loadConversationList(skipInputFormReload);
    });
  });
}
