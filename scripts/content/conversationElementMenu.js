/* global getMousePosition, shareConversation, renameConversation, confirmArchiveSelectedConversations,showConfirmDialog, confirmDeleteSelectedConversations, formatDate, openMoveToFolderModal */
// eslint-disable-next-line no-unused-vars
function showConversationElementMenu(event, conversationId) {
  const { x, y } = getMousePosition(event);
  const translateX = x + 4;
  const translateY = y + 4;
  const menu = `<div data-radix-popper-content-wrapper="" id="conversation-element-menu" dir="ltr" style="position:fixed;left:0;top:0;transform:translate3d(${translateX}px,${translateY}px,0);min-width:max-content;z-index:auto;--radix-popper-anchor-width:18px;--radix-popper-anchor-height:18px;--radix-popper-available-width:1167px;--radix-popper-available-height:604px;--radix-popper-transform-origin:0% 0px"><div data-side="bottom" data-align="start" role="menu" aria-orientation="vertical" data-state="open" data-radix-menu-content="" dir="ltr" aria-labelledby="radix-:r6g:" class="mt-2 min-w-[200px] max-w-xs rounded-lg border border-token-border-light bg-token-main-surface-primary shadow-lg" tabindex="-1" data-orientation="vertical" style="outline:0;--radix-dropdown-menu-content-transform-origin:var(--radix-popper-transform-origin);--radix-dropdown-menu-content-available-width:var(--radix-popper-available-width);--radix-dropdown-menu-content-available-height:var(--radix-popper-available-height);--radix-dropdown-menu-trigger-width:var(--radix-popper-anchor-width);--radix-dropdown-menu-trigger-height:var(--radix-popper-anchor-height);pointer-events:auto">
  
  <div role="menuitem" id="share-conversation-button-${conversationId}" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.2929 2.29289C11.6834 1.90237 12.3166 1.90237 12.7071 2.29289L16.7071 6.29289C17.0976 6.68342 17.0976 7.31658 16.7071 7.70711C16.3166 8.09763 15.6834 8.09763 15.2929 7.70711L13 5.41421V14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14V5.41421L8.70711 7.70711C8.31658 8.09763 7.68342 8.09763 7.29289 7.70711C6.90237 7.31658 6.90237 6.68342 7.29289 6.29289L11.2929 2.29289ZM4 13C4.55228 13 5 13.4477 5 14V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V14C19 13.4477 19.4477 13 20 13C20.5523 13 21 13.4477 21 14V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V14C3 13.4477 3.44772 13 4 13Z" fill="currentColor"></path></svg>Share</div>
  
  <div role="menuitem" id="rename-conversation-button-${conversationId}" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.2929 4.29291C15.0641 2.52167 17.9359 2.52167 19.7071 4.2929C21.4783 6.06414 21.4783 8.93588 19.7071 10.7071L18.7073 11.7069L11.1603 19.2539C10.7182 19.696 10.1489 19.989 9.53219 20.0918L4.1644 20.9864C3.84584 21.0395 3.52125 20.9355 3.29289 20.7071C3.06453 20.4788 2.96051 20.1542 3.0136 19.8356L3.90824 14.4678C4.01103 13.8511 4.30396 13.2818 4.7461 12.8397L13.2929 4.29291ZM13 7.41422L6.16031 14.2539C6.01293 14.4013 5.91529 14.591 5.88102 14.7966L5.21655 18.7835L9.20339 18.119C9.40898 18.0847 9.59872 17.9871 9.7461 17.8397L16.5858 11L13 7.41422ZM18 9.5858L14.4142 6.00001L14.7071 5.70712C15.6973 4.71693 17.3027 4.71693 18.2929 5.70712C19.2831 6.69731 19.2831 8.30272 18.2929 9.29291L18 9.5858Z" fill="currentColor"></path></svg>Rename</div>
  
  <div role="menuitem" id="archive-conversation-button-${conversationId}" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.62188 3.07918C3.87597 2.571 4.39537 2.25 4.96353 2.25H13.0365C13.6046 2.25 14.124 2.571 14.3781 3.07918L15.75 5.82295V13.5C15.75 14.7426 14.7426 15.75 13.5 15.75H4.5C3.25736 15.75 2.25 14.7426 2.25 13.5V5.82295L3.62188 3.07918ZM13.0365 3.75H4.96353L4.21353 5.25H13.7865L13.0365 3.75ZM14.25 6.75H3.75V13.5C3.75 13.9142 4.08579 14.25 4.5 14.25H13.5C13.9142 14.25 14.25 13.9142 14.25 13.5V6.75ZM6.75 9C6.75 8.58579 7.08579 8.25 7.5 8.25H10.5C10.9142 8.25 11.25 8.58579 11.25 9C11.25 9.41421 10.9142 9.75 10.5 9.75H7.5C7.08579 9.75 6.75 9.41421 6.75 9Z" fill="currentColor"></path></svg>Archive chat</div>
  
  <div role="menuitem" id="move-to-folder-conversation-button-${conversationId}" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" stroke-width="2" viewBox="0 0 512 512"><path d="M448 96h-172.1L226.7 50.75C214.7 38.74 198.5 32 181.5 32H64C28.66 32 0 60.66 0 96v320c0 35.34 28.66 64 64 64h384c35.34 0 64-28.66 64-64V160C512 124.7 483.3 96 448 96zM464 416c0 8.824-7.18 16-16 16H64c-8.82 0-16-7.176-16-16V96c0-8.824 7.18-16 16-16h117.5c4.273 0 8.289 1.664 11.31 4.688L256 144h192c8.82 0 16 7.176 16 16V416zM336 264h-56V207.1C279.1 194.7 269.3 184 256 184S232 194.7 232 207.1V264H175.1C162.7 264 152 274.7 152 288c0 13.26 10.73 23.1 23.1 23.1h56v56C232 381.3 242.7 392 256 392c13.26 0 23.1-10.74 23.1-23.1V311.1h56C349.3 311.1 360 301.3 360 288S349.3 264 336 264z"/></svg>Move to folder</div>

  <div role="menuitem" id="delete-conversation-button-${conversationId}" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group text-red-500" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5555 4C10.099 4 9.70052 4.30906 9.58693 4.75114L9.29382 5.8919H14.715L14.4219 4.75114C14.3083 4.30906 13.9098 4 13.4533 4H10.5555ZM16.7799 5.8919L16.3589 4.25342C16.0182 2.92719 14.8226 2 13.4533 2H10.5555C9.18616 2 7.99062 2.92719 7.64985 4.25342L7.22886 5.8919H4C3.44772 5.8919 3 6.33961 3 6.8919C3 7.44418 3.44772 7.8919 4 7.8919H4.10069L5.31544 19.3172C5.47763 20.8427 6.76455 22 8.29863 22H15.7014C17.2354 22 18.5224 20.8427 18.6846 19.3172L19.8993 7.8919H20C20.5523 7.8919 21 7.44418 21 6.8919C21 6.33961 20.5523 5.8919 20 5.8919H16.7799ZM17.888 7.8919H6.11196L7.30423 19.1057C7.3583 19.6142 7.78727 20 8.29863 20H15.7014C16.2127 20 16.6417 19.6142 16.6958 19.1057L17.888 7.8919ZM10 10C10.5523 10 11 10.4477 11 11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V16C15 16.5523 14.5523 17 14 17C13.4477 17 13 16.5523 13 16V11C13 10.4477 13.4477 10 14 10Z" fill="currentColor"></path></svg>Delete chat</div></div></div>`;
  document.body.insertAdjacentHTML('beforeend', menu);
  addConversationElementMenuEventListeners(conversationId);
}
function addConversationElementMenuEventListeners(conversationId) {
  const shareConversationButton = document.getElementById(`share-conversation-button-${conversationId}`);
  const renameConversationButton = document.getElementById(`rename-conversation-button-${conversationId}`);
  const archiveConversationButton = document.getElementById(`archive-conversation-button-${conversationId}`);
  const moveToFolderConversationButton = document.getElementById(`move-to-folder-conversation-button-${conversationId}`);
  const deleteConversationButton = document.getElementById(`delete-conversation-button-${conversationId}`);
  shareConversationButton.addEventListener('click', () => {
    document.getElementById('conversation-element-menu').remove();
    shareConversation(conversationId);
  });
  renameConversationButton.addEventListener('click', () => {
    let skipBlur = false;

    document.getElementById('conversation-element-menu').remove();
    chrome.storage.local.get(['conversations'], (result) => {
      const { conversations } = result;
      const textInput = document.createElement('input');
      const conversationTitle = document.querySelector(`#conversation-title-${conversationId}`);
      textInput.id = `conversation-rename-${conversationId}`;
      textInput.classList = 'border-0 bg-transparent p-0 focus:ring-0 focus-visible:ring-0';
      textInput.style = 'position: relative; bottom: 5px;';
      textInput.value = conversations[conversationId].title;
      conversationTitle?.parentElement?.replaceChild(textInput, conversationTitle);
      textInput.focus();
      setTimeout(() => {
        textInput.select();
      }, 50);
      textInput.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        textInput.focus();
      });
      // click out of input or press enter will save the new title
      textInput.addEventListener('blur', () => {
        if (skipBlur) return;
        const newTitle = textInput.value;
        if (newTitle !== conversations[conversationId].title) {
          updateConversationElementName(conversations, conversationTitle, conversationId, newTitle);
        }
        textInput.parentElement?.replaceChild(conversationTitle, textInput);
      });
      textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.which === 13) {
          skipBlur = true;
          const newTitle = textInput.value;
          if (newTitle !== conversations[conversationId].title) {
            updateConversationElementName(conversations, conversationTitle, conversationId, newTitle);
          }
          textInput.parentElement?.replaceChild(conversationTitle, textInput);
        }
        // esc key cancels the rename
        if (e.key === 'Escape') {
          skipBlur = true;
          conversationTitle.innerText = conversations[conversationId].title;
          textInput.parentElement?.replaceChild(conversationTitle, textInput);
        }
      });
    });
  });
  archiveConversationButton.addEventListener('click', () => {
    document.getElementById('conversation-element-menu').remove();
    confirmArchiveSelectedConversations([conversationId]);
  });
  moveToFolderConversationButton.addEventListener('click', () => {
    openMoveToFolderModal([conversationId]);
  });
  deleteConversationButton.addEventListener('click', () => {
    document.getElementById('conversation-element-menu').remove();
    chrome.storage.local.get(['conversationsOrder', 'conversations'], (res) => {
      const { conversations } = res;
      showConfirmDialog('Delete chat?', `This will delete <strong>${conversations[conversationId].title}</strong>`, 'Delete', null, () => confirmDeleteSelectedConversations([conversationId]));
    });
  });
}
function updateConversationElementName(conversations, conversationTitle, conversationId, newTitle) {
  conversationTitle.innerText = newTitle;
  conversations[conversationId].title = newTitle;
  if (conversations[conversationId]?.saveHistory !== false) {
    renameConversation(conversationId, newTitle);
  }
  // set updated_time to now
  const conversationElement = document.getElementById(`conversation-button-${conversationId}`);
  const conversationElementTimestamp = conversationElement.querySelector('#timestamp');
  conversationElementTimestamp.innerHTML = formatDate(new Date());
  // move conversationElement to the top of the list
  const conversationElementParent = conversationElement.parentElement;
  // first conversationElement in parent
  const firstConversationElement = document.querySelector(`#${conversationElementParent.id} > [id^=conversation-button-]`);
  conversationElementParent.insertBefore(conversationElement, firstConversationElement);
  chrome.storage.local.set({ conversations });
}
