/* eslint-disable no-restricted-globals */
/* global isDescendant, getConversations, getConversation, toast, addShareModalEventListener, createShare, shareModal, fileFormatConverter, showConfirmDialog, archiveConversation, deleteConversation, deleteAllConversations, resetSelection, showNewChatPage, emptyFolderElement, emptyFolderElement, formatTime, resetSelection, moveToFolder, generateRandomDarkColor, createFolder, downloadAllImages */
/* eslint-disable no-unused-vars */
function conversationSettingsMenu(hasSubscription = false, side = 'right', forceDark = false) {
  return `<div style="position:absolute;right:12px;min-width:48px;max-width:48px;z-index:100;"><button id="conversation-setting-menu-button" class="relative w-full flex items-center cursor-pointer rounded-md border bg-token-main-surface-primary border-token-border-light p-2 text-center focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 sm:text-sm" type="button">
  <span class="flex items-center justify-center w-full truncate font-semibold text-token-text-primary">
<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" viewBox="0 0 448 512"><path d="M0 88C0 74.75 10.75 64 24 64H424C437.3 64 448 74.75 448 88C448 101.3 437.3 112 424 112H24C10.75 112 0 101.3 0 88zM0 248C0 234.7 10.75 224 24 224H424C437.3 224 448 234.7 448 248C448 261.3 437.3 272 424 272H24C10.75 272 0 261.3 0 248zM424 432H24C10.75 432 0 421.3 0 408C0 394.7 10.75 384 24 384H424C437.3 384 448 394.7 448 408C448 421.3 437.3 432 424 432z"/></svg>
</button>
<ul id="conversation-setting-menu-options" style="max-height:400px;min-width:250px;" class="hidden transition-all absolute z-10 ${side === 'right' ? 'right-0' : 'left-0'} mt-1 overflow-auto rounded-md p-1 text-base ring-1 ring-opacity-5 focus:outline-none bg-token-main-surface-primary ${forceDark ? 'ring-white/20 last:border-0' : ''} dark:ring-white/20 dark:last:border-0 sm:text-sm -translate-x-1/4" role="menu" aria-orientation="vertical" tabindex="-1">
  <li class="relative cursor-pointer select-none border-b py-1 px-3 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="conversation-setting-menu-option-export-markdown" role="option" tabindex="-1">
  <div class="flex items-center text-token-text-primary" style="margin-bottom:6px;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round" class="h-4 w-4 mr-2 top-1" height="1em" width="1em"><path d="M568.1 303l-80-80c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L494.1 296H216C202.8 296 192 306.8 192 320s10.75 24 24 24h278.1l-39.03 39.03C450.3 387.7 448 393.8 448 400s2.344 12.28 7.031 16.97c9.375 9.375 24.56 9.375 33.94 0l80-80C578.3 327.6 578.3 312.4 568.1 303zM360 384c-13.25 0-24 10.74-24 24V448c0 8.836-7.164 16-16 16H64.02c-8.836 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1v72c0 13.25 10.74 24 23.1 24S384 245.3 384 232V138.6c0-16.98-6.742-33.26-18.75-45.26l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H63.1C28.65 0-.002 28.66 0 64l.0065 384c.002 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64v-40C384 394.7 373.3 384 360 384z"/></svg>
    <span class="font-semibold flex h-6 items-center gap-1 truncate text-token-text-primary">Exportar como Markdown </span>
  </div>
  </li>

  <li class="relative cursor-pointer select-none border-b py-1 px-3 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="conversation-setting-menu-option-export-text" role="option" tabindex="-1">
  <div class="flex items-center text-token-text-primary" style="margin-bottom:6px;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round" class="h-4 w-4 mr-2 top-1" height="1em" width="1em"><path d="M568.1 303l-80-80c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L494.1 296H216C202.8 296 192 306.8 192 320s10.75 24 24 24h278.1l-39.03 39.03C450.3 387.7 448 393.8 448 400s2.344 12.28 7.031 16.97c9.375 9.375 24.56 9.375 33.94 0l80-80C578.3 327.6 578.3 312.4 568.1 303zM360 384c-13.25 0-24 10.74-24 24V448c0 8.836-7.164 16-16 16H64.02c-8.836 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1v72c0 13.25 10.74 24 23.1 24S384 245.3 384 232V138.6c0-16.98-6.742-33.26-18.75-45.26l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H63.1C28.65 0-.002 28.66 0 64l.0065 384c.002 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64v-40C384 394.7 373.3 384 360 384z"/></svg>

    <span class="font-semibold flex h-6 items-center gap-1 truncate text-token-text-primary">Exportar como Texto </span>
  </div>
  </li>

  <li class="relative cursor-pointer select-none border-b py-1 px-3 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="conversation-setting-menu-option-export-json" role="option" tabindex="-1">
  <div class="flex items-center text-token-text-primary" style="margin-bottom:6px;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round" class="h-4 w-4 mr-2 top-1" height="1em" width="1em"><path d="M568.1 303l-80-80c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L494.1 296H216C202.8 296 192 306.8 192 320s10.75 24 24 24h278.1l-39.03 39.03C450.3 387.7 448 393.8 448 400s2.344 12.28 7.031 16.97c9.375 9.375 24.56 9.375 33.94 0l80-80C578.3 327.6 578.3 312.4 568.1 303zM360 384c-13.25 0-24 10.74-24 24V448c0 8.836-7.164 16-16 16H64.02c-8.836 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1v72c0 13.25 10.74 24 23.1 24S384 245.3 384 232V138.6c0-16.98-6.742-33.26-18.75-45.26l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H63.1C28.65 0-.002 28.66 0 64l.0065 384c.002 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64v-40C384 394.7 373.3 384 360 384z"/></svg>

    <span class="font-semibold flex h-6 items-center gap-1 truncate text-token-text-primary">Exportar como JSON </span>
  </div>
  </li>

  <li class="relative cursor-pointer select-none border-b py-1 px-3 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="conversation-setting-menu-option-share" role="option" tabindex="-1">
  <div class="flex items-center text-token-text-primary" style="margin-bottom:6px;">
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
    <span class="font-semibold flex h-6 items-center gap-1 truncate text-token-text-primary">Compartilhar </span>
  </div>

  <li class="relative cursor-pointer select-none border-b py-1 px-3 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="conversation-setting-menu-option-download-images" role="option" tabindex="-1">
  <div class="flex items-center text-token-text-primary" style="margin-bottom:6px;">
  <svg stroke="currentColor" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.70711 10.2929C7.31658 9.90237 6.68342 9.90237 6.29289 10.2929C5.90237 10.6834 5.90237 11.3166 6.29289 11.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L17.7071 11.7071C18.0976 11.3166 18.0976 10.6834 17.7071 10.2929C17.3166 9.90237 16.6834 9.90237 16.2929 10.2929L13 13.5858L13 4C13 3.44771 12.5523 3 12 3C11.4477 3 11 3.44771 11 4L11 13.5858L7.70711 10.2929ZM5 19C4.44772 19 4 19.4477 4 20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19L5 19Z" fill="currentColor"></path></svg>
    <span class="font-semibold flex h-6 items-center gap-1 truncate text-token-text-primary">Baixar imagens 
    <span role="button" style="background-color: rgb(25, 195, 125); color: black; padding: 0px 4px; border-radius: 8px; font-size: 0.7em; margin-right: 8px;">⚡️ Requires Pro </span>
    </span>
  </div>
  
  <li class="relative cursor-pointer select-none border-b py-1 px-3 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="conversation-setting-menu-option-move-to-folder" role="option" tabindex="-1">
  <div class="flex items-center text-token-text-primary" style="margin-bottom:6px;">
  <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2" height="1em" width="1em" stroke-width="2" viewBox="0 0 512 512"><path d="M448 96h-172.1L226.7 50.75C214.7 38.74 198.5 32 181.5 32H64C28.66 32 0 60.66 0 96v320c0 35.34 28.66 64 64 64h384c35.34 0 64-28.66 64-64V160C512 124.7 483.3 96 448 96zM464 416c0 8.824-7.18 16-16 16H64c-8.82 0-16-7.176-16-16V96c0-8.824 7.18-16 16-16h117.5c4.273 0 8.289 1.664 11.31 4.688L256 144h192c8.82 0 16 7.176 16 16V416zM336 264h-56V207.1C279.1 194.7 269.3 184 256 184S232 194.7 232 207.1V264H175.1C162.7 264 152 274.7 152 288c0 13.26 10.73 23.1 23.1 23.1h56v56C232 381.3 242.7 392 256 392c13.26 0 23.1-10.74 23.1-23.1V311.1h56C349.3 311.1 360 301.3 360 288S349.3 264 336 264z"/></svg>
    <span class="font-semibold flex h-6 items-center gap-1 truncate text-token-text-primary">Mover para a pasta </span>
  </div>

  </li>
  <li class="relative cursor-pointer select-none border-b py-1 px-3 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="conversation-setting-menu-option-archive" role="option" tabindex="-1">
  <div class="flex items-center text-token-text-primary" style="margin-bottom:6px;">
  <svg class="h-4 w-4 mr-2" height="1em" width="1em" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.62188 3.07918C3.87597 2.571 4.39537 2.25 4.96353 2.25H13.0365C13.6046 2.25 14.124 2.571 14.3781 3.07918L15.75 5.82295V13.5C15.75 14.7426 14.7426 15.75 13.5 15.75H4.5C3.25736 15.75 2.25 14.7426 2.25 13.5V5.82295L3.62188 3.07918ZM13.0365 3.75H4.96353L4.21353 5.25H13.7865L13.0365 3.75ZM14.25 6.75H3.75V13.5C3.75 13.9142 4.08579 14.25 4.5 14.25H13.5C13.9142 14.25 14.25 13.9142 14.25 13.5V6.75ZM6.75 9C6.75 8.58579 7.08579 8.25 7.5 8.25H10.5C10.9142 8.25 11.25 8.58579 11.25 9C11.25 9.41421 10.9142 9.75 10.5 9.75H7.5C7.08579 9.75 6.75 9.41421 6.75 9Z" fill="currentColor"></path></svg>
    <span class="font-semibold flex h-6 items-center gap-1 truncate text-token-text-primary">Arquivar conversa</span>
  </div>
  </li>
  <li class="relative text-red-500 cursor-pointer select-none border-b py-1 px-3 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="conversation-setting-menu-option-delete" role="option" tabindex="-1">
  <div class="flex items-center" style="margin-bottom:6px;">
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
    <span class="font-semibold flex h-6 items-center gap-1 truncate text-red-500">Excluir conversa</span>
  </div>
  </li>
  </ul>
  </div>`;
}

function addConversationSettingsMenuEventListener(conversationId, callback = null) {
  chrome.runtime.sendMessage({
    checkHasSubscription: true,
    detail: {
      forceRefresh: false,
    },
  }, (hasSubscription) => {
    const menuButton = document.querySelector('#conversation-setting-menu-button');
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
      const optionListDropdown = document.querySelector('#conversation-setting-menu-options');
      const cl = optionListDropdown?.classList;

      if (cl?.contains('block') && !isDescendant(optionListDropdown, e.target)) {
        optionListDropdown.classList.replace('block', 'hidden');
      }
    });
    const optionSelectorOptions = document.querySelectorAll('[id^=conversation-setting-menu-option-]');
    optionSelectorOptions.forEach((option) => {
      option.addEventListener('click', (e) => {
        // close menu
        const optionListDropdown = document.querySelector('#conversation-setting-menu-options');
        optionListDropdown.classList.replace('block', 'hidden');

        const id = option.id.split('conversation-setting-menu-option-')[1];
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
              toast('Erro durante o carregamento da conversa!');
            });
          } else {
            getSingleConversation(conversationId, exportType);
          }
        }
        if (id === 'share') {
          shareConversation(conversationId);
        }
        if (id === 'download-images') {
          if (hasSubscription) {
            downloadAllImages(conversationId);
          } else {
            document.querySelector('#upgrade-to-pro-side-button')?.click();
          }
        }
        if (id === 'move-to-folder') {
          openMoveToFolderModal([conversationId]);
        }
        if (id === 'archive') {
          confirmArchiveSelectedConversations([conversationId]);
        }
        if (id === 'delete') {
          showConfirmDialog('Excluir Selecionado', 'Você tem certeza que deseja excluir estas conversas?', 'Excluir', null, () => confirmDeleteSelectedConversations([conversationId]), 'red', false);
        }
      });
    });
  });
}
function openMoveToFolderModal(conversationIds) {
  chrome.storage.local.get(['conversationsOrder'], (res) => {
    const { conversationsOrder } = res;
    const folders = conversationsOrder.filter((f) => typeof f === 'object');
    const moveToFolderModal = `<div id="move-to-folder-modal" class="absolute inset-0" style="z-index: 10000;"><div data-state="open" class="fixed inset-0 bg-black/50 dark:bg-gray-600/70" style="pointer-events: auto;"><div class="grid-cols-[10px_1fr_10px] grid h-full w-full grid-rows-[minmax(10px,_1fr)_auto_minmax(10px,_1fr)] md:grid-rows-[minmax(20px,_1fr)_auto_minmax(20px,_1fr)] overflow-y-auto"><div id="move-to-folder-content" role="dialog" aria-describedby="radix-:r3o:" aria-labelledby="radix-:r3n:" data-state="open" class="relative col-auto col-start-2 row-auto row-start-2 w-full rounded-xl text-left shadow-xl transition-all left-1/2 -translate-x-1/2 bg-token-main-surface-secondary max-w-md" tabindex="-1" style="pointer-events: auto;"><div class="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-black/10 dark:border-white/10"><div class="flex"><div class="flex items-center"><div class="flex grow flex-col gap-1"><h2 id="radix-:r3n:" as="h3" class="text-lg font-medium leading-6 text-token-text-primary">Select a folder</h2></div></div></div><div class="flex items-center"><button id="move-to-folder-new-folder" class="btn flex justify-center gap-2 btn-primary mr-2 border-0 md:border" data-default="true" style="min-width: 72px; height: 34px;">+ New Folder</button><button id="move-to-folder-close-button" class="text-token-text-secondary hover:text-token-text-primary transition"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div></div><div id="move-to-folder-list" class="p-4 sm:p-6 overflow-y-scroll" style="max-height:300px;" >${folders.length > 0 ? folders.map((folder) => simpleFolderElement(folder)).join('') : '<div class="text-sm text-token-text-secondary">You currently don\'t have any folders. Try making folders first.</div>'}</div></div></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', moveToFolderModal);
    addMoveToFolderModalEventListener(conversationIds);
  });
}
function simpleFolderElement(folder) {
  return `<div id="move-to-folder-wrapper-folder-${folder.id}" class="flex w-full mb-2 hoverScale" style="flex-wrap: wrap;"><div id="folder-${folder.id}" class="flex py-3 px-3 pr-3 w-full items-center gap-3 relative rounded-md cursor-pointer break-all hover:pr-10 group" title="${folder.name}" style="background-color: ${folder.color};"><img class="w-4 h-4" src="${chrome.runtime.getURL('icons/folder.png')}" data-is-open="false"><div id="title-folder-${folder.id}" class="flex-1 text-ellipsis max-h-5 overflow-hidden whitespace-nowrap break-all relative text-token-text-primary relative" style="bottom: 5px;">${folder.name}</div><div id="folder-actions-wrapper-${folder.id}" class="absolute flex right-1 z-10 text-gray-300"><button id="move-to-folder-${folder.id}" class="p-1 hover:text-white" title="Move to folder"><svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" stroke-width="2" viewBox="0 0 512 512"><path d="M464 96h-192l-64-64h-160C21.5 32 0 53.5 0 80v352C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM336 311.1h-56v56C279.1 381.3 269.3 392 256 392c-13.27 0-23.1-10.74-23.1-23.1V311.1H175.1C162.7 311.1 152 301.3 152 288c0-13.26 10.74-23.1 23.1-23.1h56V207.1C232 194.7 242.7 184 256 184s23.1 10.74 23.1 23.1V264h56C349.3 264 360 274.7 360 288S349.3 311.1 336 311.1z"></path></svg></button></div><div id="count-folder-${folder.id}" style="color:white; font-size: 10px; position: absolute; left: 40px; bottom: 0px; display: block;">${folder.conversationIds.length} chats</div></div></div>`;
}
function addMoveToFolderModalEventListener(conversationIds) {
  const folderWrappers = document.querySelectorAll('[id^=move-to-folder-wrapper-folder-]');
  folderWrappers.forEach((folderWrapper) => {
    const folderId = folderWrapper.id.split('move-to-folder-wrapper-folder-')[1];
    folderWrapper.addEventListener('click', () => {
      moveToFolder(folderId, conversationIds);
      toast('Conversa movida para a pasta');
      const moveToFolderModal = document.querySelector('#move-to-folder-modal');
      moveToFolderModal?.remove();
    });
  });
  const newFolderButton = document.querySelector('#move-to-folder-new-folder');
  newFolderButton.addEventListener('click', () => {
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
        const newFolderElement = createFolder(newFolder, []);
        const curConversationList = document.querySelector('#conversation-list');
        const searchBoxWrapper = document.querySelector('#conversation-search-wrapper');
        curConversationList.insertBefore(newFolderElement, searchBoxWrapper.nextSibling);
        const moveToFolderList = document.querySelector('#move-to-folder-list');
        moveToFolderList.insertAdjacentHTML('afterbegin', simpleFolderElement(newFolder));
        const folderWrapper = document.querySelector(`#move-to-folder-wrapper-folder-${newFolder.id}`);
        folderWrapper.addEventListener('click', () => {
          moveToFolder(newFolder.id, conversationIds);
          toast('Conversa movida para a pasta');
          const moveToFolderModal = document.querySelector('#move-to-folder-modal');
          moveToFolderModal?.remove();
        });
      });
    });
  });
  const moveToFolderCloseButton = document.querySelector('#move-to-folder-close-button');
  moveToFolderCloseButton.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const moveToFolderModal = document.querySelector('#move-to-folder-modal');
    moveToFolderModal?.remove();
  });
  // close modal when clicked outside
  document.addEventListener('click', (e) => {
    const moveToFolderModal = document.querySelector('#move-to-folder-modal');
    const moveToFolderContent = document.querySelector('#move-to-folder-content');
    if (moveToFolderContent && !isDescendant(moveToFolderContent, e.target)) {
      moveToFolderModal.remove();
    }
  });
}
function shareConversation(conversationId) {
  // make API call
  chrome.storage.sync.get(['name'], (syncResult) => {
    chrome.storage.local.get(['conversations'], (result) => {
      const { conversations } = result;
      const currentNodeId = conversations[conversationId].current_node;
      if (conversations[conversationId]?.saveHistory === false) {
        toast('Conversas ocultas (ícone roxo) não podem ser compartilhadas.', 'warning');
        return;
      }
      createShare(conversationId, currentNodeId).then(async (res) => {
        const shareModalWrapper = document.createElement('div');
        shareModalWrapper.id = 'share-modal-wrapper';
        shareModalWrapper.classList = 'absolute inset-0 z-10';
        shareModalWrapper.innerHTML = '<div class="w-full h-full inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center text-white"><svg x="0" y="0" viewbox="0 0 40 40" class="spinner"><circle fill="transparent" stroke="#ffffff50" stroke-width="4" stroke-linecap="round" stroke-dasharray="125.6" cx="20" cy="20" r="18"></circle></svg></div>';
        document.body.appendChild(shareModalWrapper);
        shareModalWrapper.innerHTML = await shareModal(conversations[conversationId], res, syncResult.name);
        addShareModalEventListener(res, syncResult.name);
      });
    });
  });
}

function confirmArchiveSelectedConversations(conversationIds) {
  const confirmButtonContent = document.querySelector('#confirm-action-dialog #confirm-button div');
  // disable all click on the html
  chrome.storage.local.get(['conversationsOrder', 'conversations'], async (result) => {
    const { conversationsOrder, conversations } = result;
    for (let i = 0; i < conversationIds.length; i += 1) {
      // wait for 5 seconds
      const conversationId = conversationIds[i];
      if (conversations[conversationId]?.saveHistory === false) {
        toast('Conversas ocultas (ícone roxo) não podem ser compartilhadas.', 'warning');
        continue;
      }
      toast('A conversa foi arquivada.');

      // eslint-disable-next-line no-await-in-loop
      const response = await archiveConversation(conversationId);
      if (confirmButtonContent && conversationIds.length > 1) {
        confirmButtonContent.innerHTML = `<div class="w-full h-full inset-0 flex items-center justify-center text-white"><svg id="progress-spinner" x="0" y="0" viewbox="0 0 40 40" style="width:16px; height:16px;" class="spinner mr-2"><circle fill="transparent" stroke="#ffffff50" stroke-width="4" stroke-linecap="round" stroke-dasharray="125.6" cx="20" cy="20" r="18"></circle></svg><span class="visually-hidden">${i + 1} / ${conversationIds.length}</span></div>`;
      }
      if (response.success) {
        const conversationElement = document.querySelector(`#conversation-button-${conversationId}`);
        if (conversationElement?.classList?.contains('selected')) {
          showNewChatPage();
        }
        delete conversations[conversationId];

        // remove conversation element from conversations list
        conversationElement?.remove();

        // update conversationsOrder
        let conversationOrderIndex = conversationsOrder.findIndex((id) => id === conversationId);
        if (conversationOrderIndex !== -1) {
          conversationsOrder.splice(conversationOrderIndex, 1);
        } else { // if not found, look into folders
          const conversationFolder = conversationsOrder.find((f) => f.conversationIds && f.conversationIds.includes(conversationId));
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
      }
    }

    const confirmActionDialogElement = document.querySelector('#confirm-action-dialog');
    if (confirmActionDialogElement) {
      confirmActionDialogElement.remove();
    }
    resetSelection();
    chrome.storage.local.set({
      conversationsOrder,
      conversations,
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
        toast('Salvo no clipboard (json)');
      }
      // download as .txt file
      if (exportType.toLowerCase() === 'text') {
        const conversationText = messages.reverse().filter((m) => {
          const role = m?.author?.role || m?.role;
          const recipient = m?.recipient;
          return role === 'user' || (recipient === 'all' && role === 'assistant');
        }).map((m) => `${exportMode === 'both' ? `>> ${m.role ? m.role.toUpperCase() : m.author?.role.toUpperCase()}: ` : ''}${(m.content?.parts || [])?.filter((p) => typeof p === 'string')?.join('\n').replace(/## Instruções[\s\S]*## Final das Instruções\n\n/, '')}`).join('\n\n');
        const element = document.createElement('a');
        element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(conversationText)}`);
        element.setAttribute('download', `${filePrefix}-${conversationTitle}.${fileFormatConverter(exportType.toLowerCase())}`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        navigator.clipboard.writeText(conversationText);
        toast('Salvo no clipboard (texto)');
      }
      // download as .md file
      if (exportType.toLowerCase() === 'markdown') {
        const conversationMarkdown = messages.reverse().filter((m) => {
          const role = m?.author?.role || m?.role;
          const recipient = m?.recipient;
          return role === 'user' || (recipient === 'all' && role === 'assistant');
        }).map((m) => `${exportMode === 'both' ? `## ${m.role ? m.role.toUpperCase() : m.author?.role.toUpperCase()}\n` : ''}${(m.content?.parts || [])?.filter((p) => typeof p === 'string')?.join('\n').replace(/## Instruções[\s\S]*## Final das Instruções\n\n/, '')}`).join('\n\n');
        const element = document.createElement('a');
        element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(conversationMarkdown)}`);
        // add timestamp to conversation title to make file name
        element.setAttribute('download', `${filePrefix}-${conversationTitle}.${fileFormatConverter(exportType.toLowerCase())}`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        navigator.clipboard.writeText(conversationMarkdown);
        toast('Salvo no clipboard (markdown)');
      }
    });
  });
}

/* eslint-disable no-unused-vars */
function confirmDeleteAllConversations() {
  chrome.storage.local.get(['conversationsOrder', 'conversations', 'conversationsAreSynced', 'settings'], async (result) => {
    const {
      conversationsOrder, conversations, conversationsAreSynced, settings,
    } = result;

    const response = await deleteAllConversations();
    if (response.success) {
      chrome.storage.local.set({
        conversations: {},
        conversationsOrder: [],
        selectedConversations: [],
        lastSelectedConversation: null,
      });
      // remove all children of conversationlist
      const conversationList = document.querySelector('#conversation-list');
      // remove all children of conversationlist other than the first child (searchbar)
      while (conversationList.children.length > 1) {
        conversationList.removeChild(conversationList.lastChild);
      }
      showNewChatPage();
    }
  });
}
function confirmDeleteSelectedConversations(conversationIds) {
  const confirmButtonContent = document.querySelector('#confirm-action-dialog #confirm-button div');
  chrome.storage.local.get(['conversationsOrder', 'conversations', 'conversationsAreSynced', 'settings'], async (result) => {
    const {
      conversationsOrder, conversations, conversationsAreSynced, settings,
    } = result;
    let newConversationsOrder = conversationsOrder;

    for (let i = 0; i < conversationIds.length; i += 1) {
      const conversationId = conversationIds[i];
      // eslint-disable-next-line no-await-in-loop
      const response = await deleteConversation(conversationId);
      if (confirmButtonContent && conversationIds.length > 1) {
        confirmButtonContent.innerHTML = `<div class="w-full h-full inset-0 flex items-center justify-center text-white"><svg id="progress-spinner" x="0" y="0" viewbox="0 0 40 40" style="width:16px; height:16px;" class="spinner mr-2"><circle fill="transparent" stroke="#ffffff50" stroke-width="4" stroke-linecap="round" stroke-dasharray="125.6" cx="20" cy="20" r="18"></circle></svg><span class="visually-hidden">${i + 1} / ${conversationIds.length}</span></div>`;
      }
      if (response.success) {
        if (conversationsAreSynced && conversations && settings.autoSync) {
          delete conversations[conversationId];
          newConversationsOrder = removeConversationIdFromConversationsOrder(conversationsOrder, conversationId);
        }
        // remove conversation element and show new chat page if selected
        const conversationElement = document.querySelector(`#conversation-button-${conversationId}`);
        if (conversationElement) {
          if (conversationElement.classList.contains('selected')) {
            showNewChatPage();
          }
          conversationElement.remove();
        }
      }
    }
    // close confirm dialog
    const confirmActionDialogElement = document.querySelector('#confirm-action-dialog');
    if (confirmActionDialogElement) {
      confirmActionDialogElement.remove();
    }
    resetSelection();
    if (conversationsAreSynced && conversations && settings.autoSync) {
      chrome.storage.local.set({
        conversations,
        conversationsOrder: newConversationsOrder,
      });
    }
  });
}
function removeConversationIdFromConversationsOrder(conversationsOrder, convId) {
  const newConversationsOrder = conversationsOrder;
  let conversationOrderIndex = newConversationsOrder.findIndex((id) => id === convId);
  if (conversationOrderIndex !== -1) {
    newConversationsOrder.splice(conversationOrderIndex, 1);
  } else { // if not found, look into folders
    const conversationFolderIndex = newConversationsOrder.findIndex((f) => f.conversationIds && f.conversationIds.includes(convId));
    const conversationFolder = newConversationsOrder[conversationFolderIndex];
    if (conversationFolder) {
      conversationOrderIndex = conversationFolder.conversationIds.findIndex((id) => id === convId);
      conversationFolder.conversationIds.splice(conversationOrderIndex, 1);
      newConversationsOrder.splice(conversationFolderIndex, 1, conversationFolder);
      // if folder is empty now, add empty folder element
      if (conversationFolder.conversationIds.length === 0) {
        const folderContent = document.querySelector(`#folder-content-${conversationFolder.id}`);
        folderContent.appendChild(emptyFolderElement(conversationFolder.id));
      }
    }
  }
  return newConversationsOrder;
}
