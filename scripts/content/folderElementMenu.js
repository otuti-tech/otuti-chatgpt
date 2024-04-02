/* global getMousePosition, deleteConversation, folderActions, showNewChatPage, generateRandomDarkColor, showNewChatPage,  showConfirmDialog */
// eslint-disable-next-line no-unused-vars
function showFolderElementMenu(event, folderId) {
  const { x, y } = getMousePosition(event);
  const translateX = x + 4;
  const translateY = y + 4;
  const menu = `<div data-radix-popper-content-wrapper="" id="folder-element-menu" dir="ltr" style="position:fixed;left:0;top:0;transform:translate3d(${translateX}px,${translateY}px,0);min-width:max-content;z-index:auto;--radix-popper-anchor-width:18px;--radix-popper-anchor-height:18px;--radix-popper-available-width:1167px;--radix-popper-available-height:604px;--radix-popper-transform-origin:0% 0px"><div data-side="bottom" data-align="start" role="menu" aria-orientation="vertical" data-state="open" data-radix-menu-content="" dir="ltr" aria-labelledby="radix-:r6g:" class="mt-2 min-w-[200px] max-w-xs rounded-lg border border-gray-100 bg-token-main-surface-primary shadow-lg dark:border-gray-700" tabindex="-1" data-orientation="vertical" style="outline:0;--radix-dropdown-menu-content-transform-origin:var(--radix-popper-transform-origin);--radix-dropdown-menu-content-available-width:var(--radix-popper-available-width);--radix-dropdown-menu-content-available-height:var(--radix-popper-available-height);--radix-dropdown-menu-trigger-width:var(--radix-popper-anchor-width);--radix-dropdown-menu-trigger-height:var(--radix-popper-anchor-height);pointer-events:auto"><div role="menuitem" id="rename-folder-button-${folderId}" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.2929 4.29291C15.0641 2.52167 17.9359 2.52167 19.7071 4.2929C21.4783 6.06414 21.4783 8.93588 19.7071 10.7071L18.7073 11.7069L11.1603 19.2539C10.7182 19.696 10.1489 19.989 9.53219 20.0918L4.1644 20.9864C3.84584 21.0395 3.52125 20.9355 3.29289 20.7071C3.06453 20.4788 2.96051 20.1542 3.0136 19.8356L3.90824 14.4678C4.01103 13.8511 4.30396 13.2818 4.7461 12.8397L13.2929 4.29291ZM13 7.41422L6.16031 14.2539C6.01293 14.4013 5.91529 14.591 5.88102 14.7966L5.21655 18.7835L9.20339 18.119C9.40898 18.0847 9.59872 17.9871 9.7461 17.8397L16.5858 11L13 7.41422ZM18 9.5858L14.4142 6.00001L14.7071 5.70712C15.6973 4.71693 17.3027 4.71693 18.2929 5.70712C19.2831 6.69731 19.2831 8.30272 18.2929 9.29291L18 9.5858Z" fill="currentColor"></path></svg>Rename</div><div role="menuitem" id="change-color-folder-button-${folderId}" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg stroke="currentColor" fill="currentColor" stroke-width="2" viewBox="0 0 512 512" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M160 255.1C160 273.7 145.7 287.1 128 287.1C110.3 287.1 96 273.7 96 255.1C96 238.3 110.3 223.1 128 223.1C145.7 223.1 160 238.3 160 255.1zM128 159.1C128 142.3 142.3 127.1 160 127.1C177.7 127.1 192 142.3 192 159.1C192 177.7 177.7 191.1 160 191.1C142.3 191.1 128 177.7 128 159.1zM288 127.1C288 145.7 273.7 159.1 256 159.1C238.3 159.1 224 145.7 224 127.1C224 110.3 238.3 95.1 256 95.1C273.7 95.1 288 110.3 288 127.1zM320 159.1C320 142.3 334.3 127.1 352 127.1C369.7 127.1 384 142.3 384 159.1C384 177.7 369.7 191.1 352 191.1C334.3 191.1 320 177.7 320 159.1zM441.9 319.1H344C317.5 319.1 296 341.5 296 368C296 371.4 296.4 374.7 297 377.9C299.2 388.1 303.5 397.1 307.9 407.8C313.9 421.6 320 435.3 320 449.8C320 481.7 298.4 510.5 266.6 511.8C263.1 511.9 259.5 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 256.9 511.1 257.8 511.1 258.7C511.6 295.2 478.4 320 441.9 320V319.1zM463.1 258.2C463.1 257.4 464 256.7 464 255.1C464 141.1 370.9 47.1 256 47.1C141.1 47.1 48 141.1 48 255.1C48 370.9 141.1 464 256 464C258.9 464 261.8 463.9 264.6 463.8C265.4 463.8 265.9 463.6 266.2 463.5C266.6 463.2 267.3 462.8 268.2 461.7C270.1 459.4 272 455.2 272 449.8C272 448.1 271.4 444.3 266.4 432.7C265.8 431.5 265.2 430.1 264.5 428.5C260.2 418.9 253.4 403.5 250.1 387.8C248.7 381.4 248 374.8 248 368C248 314.1 290.1 271.1 344 271.1H441.9C449.6 271.1 455.1 269.3 459.7 266.2C463 263.4 463.1 260.9 463.1 258.2V258.2z"/></svg>Change color</div><div role="menuitem" id="delete-folder-button-${folderId}" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group text-red-500" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5555 4C10.099 4 9.70052 4.30906 9.58693 4.75114L9.29382 5.8919H14.715L14.4219 4.75114C14.3083 4.30906 13.9098 4 13.4533 4H10.5555ZM16.7799 5.8919L16.3589 4.25342C16.0182 2.92719 14.8226 2 13.4533 2H10.5555C9.18616 2 7.99062 2.92719 7.64985 4.25342L7.22886 5.8919H4C3.44772 5.8919 3 6.33961 3 6.8919C3 7.44418 3.44772 7.8919 4 7.8919H4.10069L5.31544 19.3172C5.47763 20.8427 6.76455 22 8.29863 22H15.7014C17.2354 22 18.5224 20.8427 18.6846 19.3172L19.8993 7.8919H20C20.5523 7.8919 21 7.44418 21 6.8919C21 6.33961 20.5523 5.8919 20 5.8919H16.7799ZM17.888 7.8919H6.11196L7.30423 19.1057C7.3583 19.6142 7.78727 20 8.29863 20H15.7014C16.2127 20 16.6417 19.6142 16.6958 19.1057L17.888 7.8919ZM10 10C10.5523 10 11 10.4477 11 11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V16C15 16.5523 14.5523 17 14 17C13.4477 17 13 16.5523 13 16V11C13 10.4477 13.4477 10 14 10Z" fill="currentColor"></path></svg>Delete folder</div></div></div>`;
  document.body.insertAdjacentHTML('beforeend', menu);
  addFolderMenuEventListeners(folderId);
}
function addFolderMenuEventListeners(folderId) {
  const renameFolderButton = document.getElementById(`rename-folder-button-${folderId}`);
  const changeColorFolderButton = document.getElementById(`change-color-folder-button-${folderId}`);
  const deleteFolderButton = document.getElementById(`delete-folder-button-${folderId}`);
  renameFolderButton.addEventListener('click', () => {
    openRenameFolder(folderId);
  });
  changeColorFolderButton.addEventListener('click', () => {
    document.getElementById('folder-element-menu').remove();
    chrome.storage.local.get(['conversationsOrder'], (result) => {
      const { conversationsOrder } = result;
      const actionsWrapper = document.getElementById(`folder-actions-wrapper-${folderId}`);
      actionsWrapper.replaceWith(colorPicker(conversationsOrder.find((conv) => conv?.id === folderId)));
      const colorPickerElement = document.getElementById(`color-picker-${folderId}`);
      colorPickerElement.focus();
    });
  });
  deleteFolderButton.addEventListener('click', () => {
    document.getElementById('folder-element-menu').remove();
    deleteFolder(folderId);
  });
}
function openRenameFolder(folderId) {
  let skipBlur = false;
  document.getElementById('folder-element-menu')?.remove();
  chrome.storage.local.get(['conversationsOrder', 'settings'], (result) => {
    const { conversationsOrder, settings } = result;
    const folder = conversationsOrder.find((conv) => conv?.id === folderId);
    const textInput = document.createElement('input');
    const folderTitle = document.querySelector(`#title-folder-${folderId}`);
    textInput.id = `rename-folder-${folderId}`;
    textInput.classList = 'border-0 bg-transparent p-0 focus:ring-0 focus-visible:ring-0 relative';
    textInput.style = `bottom:${settings.showFolderCounts ? '5px' : '0px'};`;
    textInput.value = folder.name;
    folderTitle.parentElement.replaceChild(textInput, folderTitle);

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
      if (newTitle !== folder.name) {
        folderTitle.innerText = newTitle;
        conversationsOrder.find((f) => f.id === folder.id).name = textInput.value;
        chrome.storage.local.set({ conversationsOrder });
      }
      textInput.parentElement?.replaceChild(folderTitle, textInput);
    });
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.which === 13) {
        skipBlur = true;
        const newTitle = textInput.value;
        if (newTitle !== folder.name) {
          folderTitle.innerText = newTitle;
          conversationsOrder.find((f) => f.id === folder.id).name = textInput.value;
          chrome.storage.local.set({ conversationsOrder });
        }
        textInput.parentElement?.replaceChild(folderTitle, textInput);
      }
      // esc key cancels the rename
      if (e.key === 'Escape') {
        skipBlur = true;
        folderTitle.innerText = folder.name;
        textInput.parentElement?.replaceChild(folderTitle, textInput);
      }
    });
  });
}
function deleteFolder(folderId) {
  chrome.storage.local.get(['conversationsOrder'], (result) => {
    const { conversationsOrder } = result;
    const folder = conversationsOrder.find((conv) => conv?.id === folderId);
    showConfirmDialog('Excluir Pasta', 'Você tem certeza que deseja excluir esta pasta?', 'Excluir', cancelDeleteFolder, () => confirmDeleteFolder(folder), 'red', false);
  });
}
function cancelDeleteFolder() {
  chrome.storage.local.set({
    selectedConversations: [],
  });
}
function confirmDeleteFolder(folder) {
  const confirmButtonContent = document.querySelector('#confirm-action-dialog #confirm-button div');
  chrome.storage.local.get(['conversations', 'conversationsOrder'], async (result) => {
    const { conversations, conversationsOrder } = result;
    const folderIndex = conversationsOrder.findIndex((f) => f.id === folder.id);
    const selectedConversationIds = folder.conversationIds;
    const successfullyDeletedConvIds = [];
    // wait for all deleteConversation to be resolved

    for (let i = 0; i < selectedConversationIds.length; i += 1) {
      const conv = conversations[selectedConversationIds[i]];
      if (!conv) continue;
      // eslint-disable-next-line no-await-in-loop
      const response = await deleteConversation(conv.id);
      if (confirmButtonContent && selectedConversationIds.length > 1) {
        confirmButtonContent.innerHTML = `<div class="w-full h-full inset-0 flex items-center justify-center text-white"><svg x="0" y="0" viewbox="0 0 40 40" style="width:16px; height:16px;" class="spinner mr-2"><circle fill="transparent" stroke="#ffffff50" stroke-width="4" stroke-linecap="round" stroke-dasharray="125.6" cx="20" cy="20" r="18"></circle></svg><span class="visually-hidden">${i + 1} / ${selectedConversationIds.length}</span></div>`;
      }
      if (response.success) {
        delete conversations[conv.id];
        successfullyDeletedConvIds.push(conv.id);
        const conversationElement = document.querySelector(`#conversation-button-${conv.id}`);
        if (conversationElement && conversationElement.classList.contains('selected')) {
          showNewChatPage();
        }
        conversationsOrder[folderIndex].conversationIds = conversationsOrder[folderIndex].conversationIds.filter((id) => id !== conv.id);
        conversationElement.remove();
      }
    }
    const confirmActionDialogElement = document.querySelector('#confirm-action-dialog');
    if (confirmActionDialogElement) {
      confirmActionDialogElement.remove();
    }
    if (successfullyDeletedConvIds.length === folder.conversationIds.length) {
      // remove folder element
      document.querySelector(`#wrapper-folder-${folder.id}`)?.remove();
      // remove folder from conversationsOrder
      conversationsOrder.splice(folderIndex, 1);
    }

    chrome.storage.local.set({
      conversations,
      conversationsOrder,
    });
  });
}

function colorPicker(folder) {
  const folderElement = document.querySelector(`#folder-${folder.id}`);
  folderElement.classList.replace('pr-3', 'pr-10');
  folderElement.classList.replace('hover:pr-10', 'hover:pr-10');
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
      const curColorPickerElement = document.getElementById(`color-picker-${folder.id}`);
      curColorPickerElement.value = darkColor;
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
    curFolderElement.classList.replace('pr-10', 'pr-3');
    folderElement.classList.replace('hover:pr-10', 'hover:pr-10');
  });

  return colorPickerElement;
}
