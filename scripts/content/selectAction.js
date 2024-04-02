/* global defaultFolderActions, addToFolderAction, ChatGPTIcon, openExportAllModal, showConfirmDialog, confirmDeleteAllConversations, closeMenus, confirmDeleteSelectedConversations, confirmArchiveSelectedConversations, openMoveToFolderModal, archiveAllConversations */
function openSelectActionModal() {
  chrome.storage.local.get(['selectedConversations', 'settings'], (result) => {
    const { selectedConversations, settings } = result;
    const selectActionButton = document.querySelector('#select-action-button');
    const { right, top } = selectActionButton.getBoundingClientRect();
    const translateX = right + 12;
    const translateY = top - 148;
    const menu = `<div data-radix-popper-content-wrapper="" id="selected-conversations-action-menu" dir="ltr" style="position:fixed;left:0;top:0;transform:translate3d(${translateX}px,${translateY}px,0);min-width:max-content;z-index:auto;--radix-popper-anchor-width:18px;--radix-popper-anchor-height:18px;--radix-popper-available-width:1167px;--radix-popper-available-height:604px;--radix-popper-transform-origin:0% 0px"><div data-side="bottom" data-align="start" role="menu" aria-orientation="vertical" data-state="open" data-radix-menu-content="" dir="ltr" aria-labelledby="radix-:r6g:" class="mt-2 min-w-[200px] max-w-xs rounded-lg border border-gray-100 bg-token-main-surface-primary shadow-lg dark:border-gray-700" tabindex="-1" data-orientation="vertical" style="outline:0;--radix-dropdown-menu-content-transform-origin:var(--radix-popper-transform-origin);--radix-dropdown-menu-content-available-width:var(--radix-popper-available-width);--radix-dropdown-menu-content-available-height:var(--radix-popper-available-height);--radix-dropdown-menu-trigger-width:var(--radix-popper-anchor-width);--radix-dropdown-menu-trigger-height:var(--radix-popper-anchor-height);pointer-events:auto">

    <div role="menuitem" id="select-all-button" class="flex items-center gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round" height="15" width="15"><path d="M176.1 240.1C167.6 250.3 152.4 250.3 143 240.1L63.03 160.1C53.66 151.6 53.66 136.4 63.03 127C72.4 117.7 87.6 117.7 96.97 127L160 190.1L303 47.03C312.4 37.66 327.6 37.66 336.1 47.03C346.3 56.4 346.3 71.6 336.1 80.97L176.1 240.1zM176.1 464.1C167.6 474.3 152.4 474.3 143 464.1L7.029 328.1C-2.343 319.6-2.343 304.4 7.029 295C16.4 285.7 31.6 285.7 40.97 295L160 414.1L407 167C416.4 157.7 431.6 157.7 440.1 167C450.3 176.4 450.3 191.6 440.1 200.1L176.1 464.1z"/></svg>Select All</div>

    
    <div role="menuitem" id="export-selected-button" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round" style="position:relative; top:5px;left:3px;" height="15" width="15"><path d="M568.1 303l-80-80c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L494.1 296H216C202.8 296 192 306.8 192 320s10.75 24 24 24h278.1l-39.03 39.03C450.3 387.7 448 393.8 448 400s2.344 12.28 7.031 16.97c9.375 9.375 24.56 9.375 33.94 0l80-80C578.3 327.6 578.3 312.4 568.1 303zM360 384c-13.25 0-24 10.74-24 24V448c0 8.836-7.164 16-16 16H64.02c-8.836 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1v72c0 13.25 10.74 24 23.1 24S384 245.3 384 232V138.6c0-16.98-6.742-33.26-18.75-45.26l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H63.1C28.65 0-.002 28.66 0 64l.0065 384c.002 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64v-40C384 394.7 373.3 384 360 384z"/></svg>Export ${selectedConversations.length > 0 ? 'selected' : 'all'} chats</div>

    ${settings.autoSync ? `<div role="menuitem" id="move-selectd-button" class="flex items-center gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 512 512"><path d="M448 96h-172.1L226.7 50.75C214.7 38.74 198.5 32 181.5 32H64C28.66 32 0 60.66 0 96v320c0 35.34 28.66 64 64 64h384c35.34 0 64-28.66 64-64V160C512 124.7 483.3 96 448 96zM464 416c0 8.824-7.18 16-16 16H64c-8.82 0-16-7.176-16-16V96c0-8.824 7.18-16 16-16h117.5c4.273 0 8.289 1.664 11.31 4.688L256 144h192c8.82 0 16 7.176 16 16V416zM336 264h-56V207.1C279.1 194.7 269.3 184 256 184S232 194.7 232 207.1V264H175.1C162.7 264 152 274.7 152 288c0 13.26 10.73 23.1 23.1 23.1h56v56C232 381.3 242.7 392 256 392c13.26 0 23.1-10.74 23.1-23.1V311.1h56C349.3 311.1 360 301.3 360 288S349.3 264 336 264z"/></svg>Move ${selectedConversations.length > 0 ? 'selected' : 'all'} chats</div>` : ''}
    
    <div role="menuitem" id="archive-selectd-button" class="flex items-center gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.62188 3.07918C3.87597 2.571 4.39537 2.25 4.96353 2.25H13.0365C13.6046 2.25 14.124 2.571 14.3781 3.07918L15.75 5.82295V13.5C15.75 14.7426 14.7426 15.75 13.5 15.75H4.5C3.25736 15.75 2.25 14.7426 2.25 13.5V5.82295L3.62188 3.07918ZM13.0365 3.75H4.96353L4.21353 5.25H13.7865L13.0365 3.75ZM14.25 6.75H3.75V13.5C3.75 13.9142 4.08579 14.25 4.5 14.25H13.5C13.9142 14.25 14.25 13.9142 14.25 13.5V6.75ZM6.75 9C6.75 8.58579 7.08579 8.25 7.5 8.25H10.5C10.9142 8.25 11.25 8.58579 11.25 9C11.25 9.41421 10.9142 9.75 10.5 9.75H7.5C7.08579 9.75 6.75 9.41421 6.75 9Z" fill="currentColor"></path></svg>Archive ${selectedConversations.length > 0 ? 'selected' : 'all'} chats</div>
    
    <div role="menuitem" id="delete-selected-button" class="flex items-center gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group text-red-500" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5555 4C10.099 4 9.70052 4.30906 9.58693 4.75114L9.29382 5.8919H14.715L14.4219 4.75114C14.3083 4.30906 13.9098 4 13.4533 4H10.5555ZM16.7799 5.8919L16.3589 4.25342C16.0182 2.92719 14.8226 2 13.4533 2H10.5555C9.18616 2 7.99062 2.92719 7.64985 4.25342L7.22886 5.8919H4C3.44772 5.8919 3 6.33961 3 6.8919C3 7.44418 3.44772 7.8919 4 7.8919H4.10069L5.31544 19.3172C5.47763 20.8427 6.76455 22 8.29863 22H15.7014C17.2354 22 18.5224 20.8427 18.6846 19.3172L19.8993 7.8919H20C20.5523 7.8919 21 7.44418 21 6.8919C21 6.33961 20.5523 5.8919 20 5.8919H16.7799ZM17.888 7.8919H6.11196L7.30423 19.1057C7.3583 19.6142 7.78727 20 8.29863 20H15.7014C16.2127 20 16.6417 19.6142 16.6958 19.1057L17.888 7.8919ZM10 10C10.5523 10 11 10.4477 11 11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V16C15 16.5523 14.5523 17 14 17C13.4477 17 13 16.5523 13 16V11C13 10.4477 13.4477 10 14 10Z" fill="currentColor"></path></svg>Delete ${selectedConversations.length > 0 ? 'selected' : 'all'} chats</div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', menu);
    addSelectActionButtonEventListeners();
  });
}
function addSelectActionButtonEventListeners() {
  const selectAllButton = document.querySelector('#select-all-button');
  const exportSelectedButton = document.querySelector('#export-selected-button');
  const moveSelectedButton = document.querySelector('#move-selectd-button');
  const archiveSelectedButton = document.querySelector('#archive-selectd-button');
  const deleteSelectedButton = document.querySelector('#delete-selected-button');
  selectAllButton.addEventListener('click', () => {
    const conversationButtonsCheckboxWrappers = document.querySelectorAll('#conversation-list [id^="conversation-button-"] [id^="checkbox-wrapper"]');
    const selectedConversations = [];
    showAllCheckboxes();
    conversationButtonsCheckboxWrappers.forEach((checkboxWrapper) => {
      if (checkboxWrapper && !checkboxWrapper.querySelector('#checkbox').checked) {
        checkboxWrapper.querySelector('#checkbox').checked = true;
      }
      const conversationId = checkboxWrapper.id.split('checkbox-wrapper-').pop();
      selectedConversations.push({ id: conversationId });
    });
    chrome.storage.local.set({ selectedConversations });
    updateButtonsAfterSelection(selectedConversations);
  });
  exportSelectedButton.addEventListener('click', () => {
    openExportAllModal();
  });
  archiveSelectedButton?.addEventListener('click', (e) => {
    chrome.storage.local.get(['selectedConversations'], (result) => {
      const { selectedConversations } = result;
      if (e.target.textContent === 'Arquivar todas as conversas' && selectedConversations && selectedConversations?.length === 0) {
        showConfirmDialog('Arquivar Tudo', 'Você tem certeza de que quer arquivar todas as conversas? Conversas arquivadas podem ser restauradas mais tarde.', 'Arquivar Todas as Conversas', null, () => archiveAllConversations(), 'orange', true);
      } else {
        const selectedConversationIds = selectedConversations.map((conv) => conv.id);
        showConfirmDialog('Arquivar Selecionadas', 'Você tem certeza de que quer arquivar as conversas selecionadas? Conversas arquivadas podem ser restauradas mais tarde.', `Arquivar ${selectedConversations?.length} Conversas`, null, () => confirmArchiveSelectedConversations(selectedConversationIds), 'orange', false);
      }
    });
  });
  moveSelectedButton?.addEventListener('click', () => {
    chrome.storage.local.get(['selectedConversations', 'conversations'], (result) => {
      const { selectedConversations, conversations } = result;
      let selectedConversationIds = selectedConversations.map((conv) => conv.id);
      if (selectedConversationIds.length === 0) {
        selectedConversationIds = Object.keys(conversations);
      }

      openMoveToFolderModal(selectedConversationIds);
    });
  });
  deleteSelectedButton?.addEventListener('click', (e) => {
    chrome.storage.local.get(['selectedConversations'], (result) => {
      const { selectedConversations } = result;

      if (e.target.textContent === 'Delete all chats' && selectedConversations && selectedConversations?.length === 0) {
        showConfirmDialog('Excluir Tudo', 'Você tem certeza de que quer excluir todas as conversas? Conversas excluídas NÃO podem ser restauradas mais tarde.', 'Excluir Todas as Conversas', null, confirmDeleteAllConversations, 'red', true);
      } else {
        const selectedConversationIds = selectedConversations.map((conv) => conv.id);
        showConfirmDialog('Excluir Selecionadas', 'Você tem certeza de que quer excluir as conversas selecionadas? Conversas excluídas NÃO podem ser restauradas mais tarde.', `Excluir ${selectedConversations?.length} Conversas`, null, () => confirmDeleteSelectedConversations(selectedConversationIds), 'red', false);
      }
    });
  });
}
function addSelectActionButton() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // check if the export all button is already added
  if (document.querySelector('#select-action-button')) return;
  // create the export all button by copying the nav button
  const selectActionButton = document.createElement('a');
  selectActionButton.classList = 'flex py-3 px-3 items-center gap-3 rounded-md hover:bg-token-main-surface-tertiary transition-colors duration-200 text-token-text-primary cursor-pointer text-sm';
  selectActionButton.id = 'select-action-button';
  chrome.storage.local.get(['selectedConversations'], (result) => {
    let { selectedConversations } = result;
    if (!selectedConversations) {
      selectedConversations = [];
      chrome.storage.local.set({ selectedConversations });
    }
    selectActionButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" viewBox="0 0 512 512"><path d="M81.84 152.1C77.43 156.9 71.21 159.8 64.63 159.1C58.05 160.2 51.69 157.6 47.03 152.1L7.029 112.1C-2.343 103.6-2.343 88.4 7.029 79.03C16.4 69.66 31.6 69.66 40.97 79.03L63.08 101.1L118.2 39.94C127 30.09 142.2 29.29 152.1 38.16C161.9 47.03 162.7 62.2 153.8 72.06L81.84 152.1zM81.84 312.1C77.43 316.9 71.21 319.8 64.63 319.1C58.05 320.2 51.69 317.6 47.03 312.1L7.029 272.1C-2.343 263.6-2.343 248.4 7.029 239C16.4 229.7 31.6 229.7 40.97 239L63.08 261.1L118.2 199.9C127 190.1 142.2 189.3 152.1 198.2C161.9 207 162.7 222.2 153.8 232.1L81.84 312.1zM216 120C202.7 120 192 109.3 192 96C192 82.75 202.7 72 216 72H488C501.3 72 512 82.75 512 96C512 109.3 501.3 120 488 120H216zM192 256C192 242.7 202.7 232 216 232H488C501.3 232 512 242.7 512 256C512 269.3 501.3 280 488 280H216C202.7 280 192 269.3 192 256zM160 416C160 402.7 170.7 392 184 392H488C501.3 392 512 402.7 512 416C512 429.3 501.3 440 488 440H184C170.7 440 160 429.3 160 416zM64 448C46.33 448 32 433.7 32 416C32 398.3 46.33 384 64 384C81.67 384 96 398.3 96 416C96 433.7 81.67 448 64 448z"/></svg><span id="selected-conversations-count">${selectedConversations?.length}</span> Selected <div class="absolute flex right-3 z-10 "><button class="p-1 text-token-text-primary"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path></svg></button></div>`;
  });
  // Add click event listener to setting button
  selectActionButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenus();
    openSelectActionModal();
  });
  // add the export all button immediately after the navgap element
  const userMenu = nav.querySelector('#user-menu');
  userMenu.prepend(selectActionButton);
}
// eslint-disable-next-line no-unused-vars
function updateButtonsAfterSelection(selectedConversations) {
  //  nav second child first a element
  const selectedConversationsCount = document.querySelector('#selected-conversations-count');
  if (selectedConversationsCount) {
    selectedConversationsCount.innerText = selectedConversations.length;
  }

  const newChatButton = document.querySelector('#nav-gap').querySelector('a');
  if (!newChatButton) return;
  if (selectedConversations.length > 0) {
    // show an x svg followed by clear selection
    newChatButton.innerHTML = '<div class="h-7 w-7 flex-shrink-0"><div class="gizmo-shadow-stroke relative flex h-full items-center justify-center rounded-full bg-white text-black"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div></div>Clear selection';
    showAddToFolderButton();
  } else {
    // show a plus svg followed by new chat
    newChatButton.innerHTML = ChatGPTIcon();
    showDefaultFolderActions();
  }
}
function showAddToFolderButton() {
  const allFolderActionWrappers = document.querySelectorAll('[id^="folder-actions-wrapper-"]');
  if (allFolderActionWrappers.length === 0) return;
  allFolderActionWrappers.forEach((wrapper) => {
    const folderId = wrapper.id.split('folder-actions-wrapper-').pop();
    wrapper.replaceWith(addToFolderAction(folderId));
  });
}
function showDefaultFolderActions() {
  const allFolderActionWrappers = document.querySelectorAll('[id^="folder-actions-wrapper-"]');
  if (allFolderActionWrappers.length === 0) return;
  allFolderActionWrappers.forEach((wrapper) => {
    const folderId = wrapper.id.split('folder-actions-wrapper-').pop();
    const curFolderIcon = document.querySelector(`#folder-${folderId} img`);

    wrapper.replaceWith(defaultFolderActions(folderId, curFolderIcon?.dataset?.isOpen === 'true'));
  });
}
// eslint-disable-next-line no-unused-vars
function hideAllButLastCheckboxes(lastCheckboxId) {
  const conversationList = document.querySelector('#conversation-list');
  const chatButtons = conversationList.querySelectorAll('a');
  chatButtons.forEach((button) => {
    const checkbox = button.querySelector('#checkbox');
    if (!checkbox) return;
    checkbox.checked = false;
    const checkboxWrapper = checkbox.parentNode;
    checkboxWrapper.style.width = '40px';
    if (button.id !== `conversation-button-${lastCheckboxId}`) {
      checkboxWrapper.style.display = 'none';
    }
  });
}
// eslint-disable-next-line no-unused-vars
function showAllCheckboxes() {
  const conversationList = document.querySelector('#conversation-list');
  const chatButtons = conversationList.querySelectorAll('a');
  chatButtons.forEach((button) => {
    const checkbox = button.querySelector('#checkbox');
    if (!checkbox) return;
    const checkboxWrapper = checkbox.parentNode;
    checkboxWrapper.style.width = '100%';
    checkboxWrapper.style.display = 'block';
  });
}
// eslint-disable-next-line no-unused-vars
function resetSelection() {
  const newChatButton = document.querySelector('#nav-gap').querySelector('a');
  if (newChatButton?.textContent.toLocaleLowerCase() === 'clear selection') {
    newChatButton.innerHTML = ChatGPTIcon();
    chrome.storage.local.set({ selectedConversations: [], lastSelectedConversation: null });
    // select-action-button
    const selectActionButton = document.querySelector('#select-action-button');
    selectActionButton.style.outline = '';
    // enable menu buttons
    const actionsWrappers = document.querySelectorAll('#conversation-list [id^=actions-wrapper-]');
    actionsWrappers.forEach((aw) => {
      aw.classList.add('group-hover:visible');
    });
    // update the selectedConversationsCount
    const selectedConversationsCount = document.querySelector('#selected-conversations-count');
    if (selectedConversationsCount) {
      selectedConversationsCount.textContent = '0';
    }
    const conversationList = document.querySelector('#conversation-list');
    const chatButtons = conversationList.querySelectorAll('a');
    chatButtons.forEach((button) => {
      const checkbox = button.querySelector('#checkbox');
      if (!checkbox) return;
      checkbox.checked = false;
      const checkboxWrapper = checkbox.parentNode;
      checkboxWrapper.style.width = '40px';
      checkboxWrapper.style.display = 'none';
    });
    showDefaultFolderActions();
  }
}
// eslint-disable-next-line no-unused-vars
function initializeSelectActionButton() {
  addSelectActionButton();
}
