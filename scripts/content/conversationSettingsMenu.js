/* global isDescendant, openUpgradeModal, getConversations, getConversation, toast, shareConversation, fileFormatConverter, showActionConfirm, deleteConversation, showNewChatPage, emptyFolderElement, notSelectedClassList, formatTime */
/* eslint-disable no-unused-vars */
function conversationSettingsMenu(conversation, hasSubscription, side = 'right', forceDark = false) {
  const { autoDeleteLock } = conversation;
  return `<div style="position:absolute;right:12px;min-width:48px;max-width:48px;z-index:100;"><button id="conversation-setting-menu" class="relative w-full flex items-center cursor-pointer rounded-md border ${forceDark ? 'bg-gray-800 border-white/20' : 'bg-white border-gray-300'} p-2 text-center focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-white/20 dark:bg-gray-800 sm:text-sm" type="button">
  <span class="flex items-center justify-center w-full truncate font-semibold ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100">
<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" viewBox="0 0 448 512"><path d="M0 88C0 74.75 10.75 64 24 64H424C437.3 64 448 74.75 448 88C448 101.3 437.3 112 424 112H24C10.75 112 0 101.3 0 88zM0 248C0 234.7 10.75 224 24 224H424C437.3 224 448 234.7 448 248C448 261.3 437.3 272 424 272H24C10.75 272 0 261.3 0 248zM424 432H24C10.75 432 0 421.3 0 408C0 394.7 10.75 384 24 384H424C437.3 384 448 394.7 448 408C448 421.3 437.3 432 424 432z"/></svg>
</button>
<ul id="conversation-setting-menu-options" style="max-height:400px;width:250px;" class="hidden transition-all absolute z-10 ${side === 'right' ? 'right-0' : 'left-0'} mt-1 overflow-auto rounded-md p-1 text-base ring-1 ring-opacity-5 focus:outline-none ${forceDark ? 'bg-gray-800 ring-white/20 last:border-0' : 'bg-white'} dark:bg-gray-800 dark:ring-white/20 dark:last:border-0 sm:text-sm -translate-x-1/4" role="menu" aria-orientation="vertical" tabindex="-1">
  <li title="Prevent conversation from being auto-deleted" class="text-gray-900 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 ${forceDark ? 'border-white/20' : 'border-gray-100'} dark:border-white/20 hover:bg-gray-600" id="conversation-setting-menu-option-auto-delete-lock" role="option" tabindex="-1">
    <div class="flex flex-col" style="margin-bottom:6px;">
      <span class="font-semibold flex h-6 items-center gap-1 truncate ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100">Auto-Delete Lock
      <input type="checkbox" id="checkbox" ${autoDeleteLock ? 'checked' : ''} style="position: absolute; top: 8px; right: 12px; z-index: 11; cursor: pointer;" ${hasSubscription ? '' : 'disabled'}">
      </span>
    </div>
    ${!hasSubscription ? '<div role="button" style="background-color: rgb(25, 195, 125); color: black; padding: 2px 4px; border-radius: 12px; font-size: 0.7em; margin-right: 8px; width: 120px; height: 18px; line-height: 12px; margin-top: 4px;">⚡️ Requires Pro Account</div>' : ''}
    <div style="font-size:11px;" class="${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100">This only protect agains auto-delete. <br/>If you try to to delete this chat using the Delete or Delete All button, this lock won't prevent deleting.
    </div>
  </li>
  <li class="relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 ${forceDark ? 'border-white/20' : 'border-gray-100'} dark:border-white/20 hover:bg-gray-600" id="conversation-setting-menu-option-export-markdown" role="option" tabindex="-1">
  <div class="flex items-center" style="margin-bottom:6px;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round" class="h-4 w-4 mr-2 top-1" height="1em" width="1em"><path d="M568.1 303l-80-80c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L494.1 296H216C202.8 296 192 306.8 192 320s10.75 24 24 24h278.1l-39.03 39.03C450.3 387.7 448 393.8 448 400s2.344 12.28 7.031 16.97c9.375 9.375 24.56 9.375 33.94 0l80-80C578.3 327.6 578.3 312.4 568.1 303zM360 384c-13.25 0-24 10.74-24 24V448c0 8.836-7.164 16-16 16H64.02c-8.836 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1v72c0 13.25 10.74 24 23.1 24S384 245.3 384 232V138.6c0-16.98-6.742-33.26-18.75-45.26l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H63.1C28.65 0-.002 28.66 0 64l.0065 384c.002 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64v-40C384 394.7 373.3 384 360 384z"/></svg>
    <span class="font-semibold flex h-6 items-center gap-1 truncate ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100">Export As Markdown </span>
  </div>
  <li class="relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 ${forceDark ? 'border-white/20' : 'border-gray-100'} dark:border-white/20 hover:bg-gray-600" id="conversation-setting-menu-option-export-text" role="option" tabindex="-1">
  <div class="flex items-center" style="margin-bottom:6px;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round" class="h-4 w-4 mr-2 top-1" height="1em" width="1em"><path d="M568.1 303l-80-80c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L494.1 296H216C202.8 296 192 306.8 192 320s10.75 24 24 24h278.1l-39.03 39.03C450.3 387.7 448 393.8 448 400s2.344 12.28 7.031 16.97c9.375 9.375 24.56 9.375 33.94 0l80-80C578.3 327.6 578.3 312.4 568.1 303zM360 384c-13.25 0-24 10.74-24 24V448c0 8.836-7.164 16-16 16H64.02c-8.836 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1v72c0 13.25 10.74 24 23.1 24S384 245.3 384 232V138.6c0-16.98-6.742-33.26-18.75-45.26l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H63.1C28.65 0-.002 28.66 0 64l.0065 384c.002 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64v-40C384 394.7 373.3 384 360 384z"/></svg>

    <span class="font-semibold flex h-6 items-center gap-1 truncate ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100">Export As Text </span>
  </div>
  <li class="relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 ${forceDark ? 'border-white/20' : 'border-gray-100'} dark:border-white/20 hover:bg-gray-600" id="conversation-setting-menu-option-export-json" role="option" tabindex="-1">
  <div class="flex items-center" style="margin-bottom:6px;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round" class="h-4 w-4 mr-2 top-1" height="1em" width="1em"><path d="M568.1 303l-80-80c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L494.1 296H216C202.8 296 192 306.8 192 320s10.75 24 24 24h278.1l-39.03 39.03C450.3 387.7 448 393.8 448 400s2.344 12.28 7.031 16.97c9.375 9.375 24.56 9.375 33.94 0l80-80C578.3 327.6 578.3 312.4 568.1 303zM360 384c-13.25 0-24 10.74-24 24V448c0 8.836-7.164 16-16 16H64.02c-8.836 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1v72c0 13.25 10.74 24 23.1 24S384 245.3 384 232V138.6c0-16.98-6.742-33.26-18.75-45.26l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H63.1C28.65 0-.002 28.66 0 64l.0065 384c.002 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64v-40C384 394.7 373.3 384 360 384z"/></svg>

    <span class="font-semibold flex h-6 items-center gap-1 truncate ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100">Export As JSON </span>
  </div>

  <li class="relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 ${forceDark ? 'border-white/20' : 'border-gray-100'} dark:border-white/20 hover:bg-gray-600" id="conversation-setting-menu-option-share" role="option" tabindex="-1">
  <div class="flex items-center" style="margin-bottom:6px;">
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
    <span class="font-semibold flex h-6 items-center gap-1 truncate ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100">Share </span>
  </div>
  <li class="relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 ${forceDark ? 'border-white/20' : 'border-gray-100'} dark:border-white/20 hover:bg-gray-600" id="conversation-setting-menu-option-delete" role="option" tabindex="-1">
  <div class="flex items-center" style="margin-bottom:6px;">
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
    <span class="font-semibold flex h-6 items-center gap-1 truncate ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100">Delete </span>
  </div>
</li>
  </ul>
  </div>`;
}

function addConversationSettingsMenuEventListener(conversationId, callback = null, forceDark = false) {
  const menuButton = document.querySelector('#conversation-setting-menu');
  menuButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const optionListDropdown = document.querySelector('#conversation-setting-menu-options');
    const cl = optionListDropdown.classList;
    if (cl.contains('block')) {
      optionListDropdown.classList.replace('block', 'hidden');
    } else {
      optionListDropdown.classList.replace('hidden', 'block');
    }
  });
  // close optionListDropdown when clicked outside
  document.addEventListener('click', (e) => {
    const conversationSettingMenu = document.querySelector('#conversation-setting-menu');
    const optionListDropdown = document.querySelector('#conversation-setting-menu-options');
    const cl = optionListDropdown?.classList;

    if (cl?.contains('block') && !isDescendant(optionListDropdown, e.target)) {
      optionListDropdown.classList.replace('block', 'hidden');
    }
  });
  const optionSelectorOptions = document.querySelectorAll('[id^=conversation-setting-menu-option-]');
  optionSelectorOptions.forEach((option) => {
    option.addEventListener('mousemove', () => {
      const darkMode = document.querySelector('html').classList.contains('dark');
      option.classList.add(darkMode || forceDark ? 'bg-gray-600' : 'bg-gray-200');
    });
    option.addEventListener('mouseleave', () => {
      const darkMode = document.querySelector('html').classList.contains('dark');
      option.classList.remove(darkMode || forceDark ? 'bg-gray-600' : 'bg-gray-200');
    });
    option.addEventListener('click', (e) => {
      const id = option.id.split('conversation-setting-menu-option-')[1];
      if (id === 'auto-delete-lock') {
        chrome.runtime.sendMessage({
          checkHasSubscription: true,
          detail: {
            forceRefresh: false,
          },
        }, (hasSubscription) => {
          if (hasSubscription) {
            const checkbox = option.querySelector('#checkbox');
            if (e.target.id !== 'checkbox') {
              checkbox.checked = !checkbox.checked;
            }
            const conversationButtonElement = document.querySelector(`#conversation-button-${conversationId}`);
            const timestampElement = conversationButtonElement.querySelector('#timestamp');
            if (checkbox.checked) {
              timestampElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" stroke="#ef4146" fill="#ef4146" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1 h-2 w-2" height="1em" width="1em"><path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"/></svg>${timestampElement.innerText}`;
            } else {
              timestampElement.innerHTML = timestampElement.innerText;
            }
            chrome.storage.local.get(['conversations'], ({ conversations }) => {
              conversations[conversationId].autoDeleteLock = checkbox.checked;
              chrome.storage.local.set({ conversations });
            });
          } else {
            openUpgradeModal(false);
          }
        });
      }
      if (id === 'export-markdown' || id === 'export-text' || id === 'export-json') {
        const exportType = id.split('export-')[1];
        const { pathname } = new URL(window.location.toString());
        //  if conversation id is not valid uuid v4
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(conversationId)) {
          // happens when auto-sync is off and create a new chat. there is no id in url initially
          getConversations(0, 1).then((conversations) => {
            const lastConversation = conversations.items[0];
            if (lastConversation) {
              conversationId = lastConversation.id;
            }
            getSingleConversation(conversationId, exportType);
          }, () => {
            toast('Error while getting conversation');
          });
        } else {
          getSingleConversation(conversationId, exportType);
        }
      }
      if (id === 'share') {
        shareConversation(conversationId);
      }
      if (id === 'delete') {
        showActionConfirm('Delete Selected', 'Are you sure you want to delete this conversations?', 'Delete', null, () => confirmDeleteConversations(conversationId));
      }
    });
  });
}
function confirmDeleteConversations(conversationId) {
  chrome.storage.local.get(['conversationsOrder', 'conversations'], (result) => {
    const { conversationsOrder, conversations } = result;
    deleteConversation(conversationId).then((data) => {
      if (data.success) {
        showNewChatPage();
        conversations[conversationId].archived = true;
        // remove conversation element from conversations list
        const conversationElement = document.querySelector(`#conversation-button-${conversationId}`);
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
        // update conversationsOrder
        let conversationOrderIndex = conversationsOrder.findIndex((id) => id === conversationId);
        if (conversationOrderIndex !== -1) {
          conversationsOrder.splice(conversationOrderIndex, 1);
        } else { // if not found, look into folders
          const conversationFolder = conversationsOrder.find((f) => (f.id !== 'trash') && f.conversationIds && f.conversationIds.includes(conversationId));
          if (conversationFolder) {
            conversationOrderIndex = conversationFolder.conversationIds.findIndex((id) => id === conversationId);
            conversationFolder.conversationIds.splice(conversationOrderIndex, 1);
            // if folder is empty now, add empty folder element
            if (conversationFolder.conversationIds.length === 0) {
              const folderContent = document.querySelector(`#folder-content-${conversationFolder.id}`);
              folderContent.appendChild(emptyFolderElement(conversationFolder.id));
            }
          }
        }
        let newConversationsOrder = conversationsOrder;
        // update trash folder
        const trashFolder = conversationsOrder?.find((folder) => folder.id === 'trash');
        if (trashFolder) {
          trashFolder.conversationIds = [conversationId, ...trashFolder.conversationIds];
          // remove dupleicate conversationIds
          trashFolder.conversationIds = [...new Set(trashFolder.conversationIds)];
          newConversationsOrder = conversationsOrder.map((folder) => {
            if (folder.id === 'trash') {
              return trashFolder;
            }
            return folder;
          });
        }
        chrome.storage.local.set({
          conversationsOrder: newConversationsOrder,
          conversations,
        });
      }
    });
  });
}
function getSingleConversation(conversationId, exportType) {
  getConversation(conversationId).then((conversation) => {
    const conversationTitle = conversation.title.replace(/[^a-zA-Z0-9]/g, '_');
    const createDate = new Date(formatTime(conversation.create_time));
    const filePrefix = `${createDate.getHours()}-${createDate.getMinutes()}-${createDate.getSeconds()}`;

    let currentNode = conversation.current_node;
    let messages = [];
    while (currentNode) {
      const { message, parent } = conversation.mapping[currentNode];
      if (message) messages.push(message);
      currentNode = parent;
    }
    // get export mode from settings
    chrome.storage.local.get('settings', ({ settings }) => {
      const { exportMode } = settings;

      if (exportMode === 'assistant') {
        messages = messages.filter((m) => m.role === 'assistant' || m.author?.role === 'assistant');
      }
      if (exportType.toLowerCase() === 'json') {
        const conversationJson = conversation;
        const element = document.createElement('a');
        element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(conversationJson))}`);
        element.setAttribute('download', `${filePrefix}-${conversationTitle}.${fileFormatConverter(exportType.toLowerCase())}`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        navigator.clipboard.writeText(JSON.stringify(conversationJson));
        toast('Copied to clipboard');
      }
      // download as .txt file
      if (exportType.toLowerCase() === 'text') {
        const conversationText = messages.reverse().filter((m) => {
          const role = m?.author?.role || m?.role;
          const recipient = m?.recipient;
          return role === 'user' || (recipient === 'all' && role === 'assistant');
        }).map((m) => `${exportMode === 'both' ? `>> ${m.role ? m.role.toUpperCase() : m.author?.role.toUpperCase()}: ` : ''}${m.content?.parts?.filter((p) => typeof p === 'string')?.join('\n').replace(/## Instructions[\s\S]*## End Instructions\n\n/, '')}`).join('\n\n');
        const element = document.createElement('a');
        element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(conversationText)}`);
        element.setAttribute('download', `${filePrefix}-${conversationTitle}.${fileFormatConverter(exportType.toLowerCase())}`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        navigator.clipboard.writeText(conversationText);
        toast('Copied to clipboard');
      }
      // download as .md file
      if (exportType.toLowerCase() === 'markdown') {
        const conversationMarkdown = messages.reverse().filter((m) => {
          const role = m?.author?.role || m?.role;
          const recipient = m?.recipient;
          return role === 'user' || (recipient === 'all' && role === 'assistant');
        }).map((m) => `${exportMode === 'both' ? `## ${m.role ? m.role.toUpperCase() : m.author?.role.toUpperCase()}\n` : ''}${m.content?.parts?.filter((p) => typeof p === 'string')?.join('\n').replace(/## Instructions[\s\S]*## End Instructions\n\n/, '')}`).join('\n\n');
        const element = document.createElement('a');
        element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(conversationMarkdown)}`);
        // add timestamp to conversation title to make file name
        element.setAttribute('download', `${filePrefix}-${conversationTitle}.${fileFormatConverter(exportType.toLowerCase())}`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        navigator.clipboard.writeText(conversationMarkdown);
        toast('Copied to clipboard');
      }
    });
  });
}
