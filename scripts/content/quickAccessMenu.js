/* eslint-disable no-unused-vars */
/* global defaultPrompts, getGizmosPinned, getGizmoDiscovery, createSettingsModal, createPromptChainListModal, runPromptChain */
function addQuickAccessMenuEventListener() {
  document.addEventListener('selectionchange', (e) => {
    // bsckspace does not trigger selectionchange
    const textAreaElement = document.querySelector('#prompt-textarea');
    if (textAreaElement !== document.activeElement) return;

    const quickAccessMenuElement = document.querySelector('#quick-access-menu');
    const cursorPosition = textAreaElement.selectionStart;
    const textAreaValue = textAreaElement.value;
    const previousAtPosition = textAreaValue.lastIndexOf('@', cursorPosition - 1);
    const previousSlashPosition = textAreaValue.lastIndexOf('/', cursorPosition - 1);
    const previousHashtagPosition = textAreaValue.lastIndexOf('#', cursorPosition - 1);
    if (cursorPosition === 0 || (previousAtPosition === -1 && previousSlashPosition === -1 && previousHashtagPosition === -1)) {
      if (quickAccessMenuElement) quickAccessMenuElement.remove();
      return;
    }
    // whichever is closer to the cursor
    const previousTriggerPosition = Math.max(previousAtPosition, previousSlashPosition, previousHashtagPosition);
    const previousTrigger = textAreaElement.value.substring(previousTriggerPosition, previousTriggerPosition + 1);
    // get the word between the previous trigger and the cursor
    if (!quickAccessMenuElement && previousTriggerPosition !== -1 && cursorPosition > previousTriggerPosition && textAreaValue.lastIndexOf(' ', cursorPosition - 1) < previousTriggerPosition) {
      quickAccessMenu(previousTrigger);
    } else if (quickAccessMenuElement && (previousTriggerPosition === -1 || textAreaValue.lastIndexOf(' ', cursorPosition - 1) > previousTriggerPosition)) {
      quickAccessMenuElement.remove();
    }
  });
  document.body.addEventListener('click', (e) => {
    const quickAccessMenuElement = document.querySelector('#quick-access-menu');
    const textAreaElement = document.querySelector('#prompt-textarea');
    if (!quickAccessMenuElement) return;
    if (textAreaElement?.contains(e.target)) {
      setTimeout(() => {
        updateQuickAccessMenuItems();
      }, 100);
      e.stopPropagation();
      const cursorPosition = textAreaElement.selectionStart;
      const textAreaValue = textAreaElement.value;

      const previousAtPosition = textAreaElement.value.lastIndexOf('@', cursorPosition);
      const previousSlashPosition = textAreaElement.value.lastIndexOf('/', cursorPosition);
      const previousHashtagPosition = textAreaElement.value.lastIndexOf('#', cursorPosition);
      if (cursorPosition === 0 || (previousAtPosition === -1 && previousSlashPosition === -1 && previousHashtagPosition === -1)) {
        if (quickAccessMenuElement) quickAccessMenuElement.remove();
        return;
      }
      // whichever is closer to the cursor
      const previousTriggerPosition = Math.max(previousAtPosition, previousSlashPosition, previousHashtagPosition);
      const previousTrigger = textAreaElement.value.substring(previousTriggerPosition, previousTriggerPosition + 1);

      // if there is a space between previoustriggerpos and cur cursor position
      if (!quickAccessMenuElement && previousTriggerPosition !== -1 && cursorPosition > previousTriggerPosition && textAreaValue.lastIndexOf(' ', cursorPosition - 1) < previousTriggerPosition) {
        quickAccessMenu(previousTrigger);
      } else if (previousTriggerPosition === -1 || textAreaValue.lastIndexOf(' ', cursorPosition - 1) > previousTriggerPosition) {
        quickAccessMenuElement.remove();
      }
    } else if (!quickAccessMenuElement.contains(e.target) && !e.target.id.startsWith('enforcement-trigger')) {
      quickAccessMenuElement.remove();
    }
  });
  document.body.addEventListener('keydown', (event) => {
    const menu = document.querySelector('#quick-access-menu');
    if (!menu) return;
    const menuContent = menu.querySelector('#quick-access-menu-content');
    if (event.key === 'ArrowUp') {
      // rotate focus between quick-access-menu-item s where style.display:block
      const menuItems = menuContent.querySelectorAll('button[id^=quick-access-menu-item-]:not([style*="display: none"])');
      if (menuItems.length > 0) {
        if (!menu.contains(document.activeElement)) {
          menu.focus();
          menuItems[menuItems.length - 1].focus();
          menuItems[0]?.querySelector('span#item-arrow')?.classList?.add('invisible');
          menuItems[menuItems.length - 1]?.querySelector('span#item-arrow')?.classList?.remove('invisible');
        } else {
          const currentFocusIndex = Array.from(menuItems).indexOf(document.activeElement);
          menuItems[currentFocusIndex]?.querySelector('span#item-arrow')?.classList?.add('invisible');

          if (currentFocusIndex === 0) {
            setTimeout(() => {
              menuContent.scrollTop = menuContent.scrollHeight;
            }, 100);
            menuItems[menuItems.length - 1].focus({ preventScroll: true });
            menuItems[menuItems.length - 1]?.querySelector('span#item-arrow')?.classList?.remove('invisible');
          } else if (currentFocusIndex > 0) {
            menuItems[currentFocusIndex - 1].focus();
            menuItems[currentFocusIndex - 1]?.querySelector('span#item-arrow')?.classList?.remove('invisible');
          }
        }
      }
      return;
    }
    if (event.key === 'ArrowDown') {
      // rotate focus to between quick-access-menu-item s
      const menuItems = menuContent.querySelectorAll('button[id^=quick-access-menu-item-]:not([style*="display: none"])');
      if (menuItems.length > 0) {
        if (!menu.contains(document.activeElement)) {
          menu.focus();
          menuItems[0].focus();
          menuItems[0]?.querySelector('span#item-arrow')?.classList?.remove('invisible');
        } else {
          const currentFocusIndex = Array.from(menuItems).indexOf(document.activeElement);
          menuItems[currentFocusIndex]?.querySelector('span#item-arrow')?.classList?.add('invisible');
          if (currentFocusIndex === menuItems.length - 1) {
            setTimeout(() => {
              menuContent.scrollTop = 0;
            }, 100);
            menuItems[0].focus({ preventScroll: true });
            menuItems[0]?.querySelector('span#item-arrow')?.classList?.remove('invisible');
          } else if (currentFocusIndex < menuItems.length - 1) {
            menuItems[currentFocusIndex + 1].focus();
            menuItems[currentFocusIndex + 1]?.querySelector('span#item-arrow')?.classList?.remove('invisible');
          }
        }
      }
      return;
    }
    if (event.key === 'Backspace') {
      if (document.activeElement !== document.querySelector('#prompt-textarea')) {
        event.preventDefault();
      }
      const menuItems = menuContent.querySelectorAll('button[id^=quick-access-menu-item-]:not([style*="display: none"])');
      const currentFocusIndex = Array.from(menuItems).indexOf(document.activeElement);
      menuItems[currentFocusIndex]?.querySelector('span#item-arrow')?.classList?.add('invisible');
      menuItems[0]?.querySelector('span#item-arrow')?.classList?.remove('invisible');

      document.querySelector('#prompt-textarea').focus();
      return;
    }
    // if any key other than the above, focus on the text area
    if (event.key !== 'Enter') {
      const textAreaElement = document.querySelector('#prompt-textarea');
      if (textAreaElement) textAreaElement.focus();
    }
  });
}
function updateQuickAccessMenuItems() {
  // find the closest trigger
  const textAreaElement = document.querySelector('#prompt-textarea');
  const quickAccessMenuContent = document.querySelector('#quick-access-menu-content');
  if (!textAreaElement || !quickAccessMenuContent) return;
  const cursorPosition = textAreaElement.selectionStart;
  const textAreaValue = textAreaElement.value;
  const previousAtPosition = textAreaElement.value.lastIndexOf('@', cursorPosition);
  const previousSlashPosition = textAreaElement.value.lastIndexOf('/', cursorPosition);
  const previousHashtagPosition = textAreaValue.lastIndexOf('#', cursorPosition - 1);
  if (cursorPosition === 0 || (previousAtPosition === -1 && previousSlashPosition === -1 && previousHashtagPosition === -1)) {
    return;
  }
  let nextSpacePos = textAreaValue.indexOf(' ', cursorPosition);
  if (nextSpacePos === -1) nextSpacePos = textAreaValue.length;
  const previousTriggerPosition = Math.max(previousAtPosition, previousSlashPosition, previousHashtagPosition);

  const triggerWord = textAreaValue.substring(previousTriggerPosition + 1, nextSpacePos);

  let foundFirstVisibleItem = false;
  const menuItems = quickAccessMenuContent.querySelectorAll('button[id^=quick-access-menu-item-]');
  menuItems.forEach((item) => {
    const itemText = item.textContent;

    if (itemText.toLowerCase().includes(triggerWord.toLowerCase())) {
      item.style.display = 'flex';
      if (!foundFirstVisibleItem) {
        foundFirstVisibleItem = true;
        item?.querySelector('span#item-arrow')?.classList?.remove('invisible');
      } else {
        item?.querySelector('span#item-arrow')?.classList?.add('invisible');
      }
    } else {
      item.style.display = 'none';
    }
  });
}
function quickAccessMenu(trigger) {
  chrome.storage.local.get(['account', 'chatgptAccountId'], (r) => {
    const isPaid = r?.account?.accounts?.[r.chatgptAccountId || 'default']?.entitlement?.has_active_subscription || false;
    const isGPT4 = document.querySelector('#navbar-selected-model-title')?.innerText?.toLowerCase()?.includes('gpt-4');
    // #gizmo-menu-wrapper-navbar
    const isGizmo = document.querySelector('#gizmo-menu-wrapper-navbar');
    if (trigger !== '@' || (isPaid && (isGPT4 || isGizmo))) {
      const existingMenu = document.querySelector('#quick-access-menu');
      if (existingMenu) {
        existingMenu.remove();
        return;
      }
      const menu = document.createElement('div');
      menu.id = 'quick-access-menu';
      menu.classList = 'absolute flex flex-col gap-2 bg-token-main-surface-primary border border-token-border-light rounded-xl shadow-xs';
      menu.style = 'height: 300px; top:-316px; left:0; width:100%; z-index: 10000;';
      const menuHeader = document.createElement('div');
      menuHeader.classList = 'flex justify-between items-center py-2 px-3 border-b border-token-border-light';
      const menuTitle = document.createElement('h3');
      menuTitle.classList = 'text-lg font-bold';
      menuHeader.appendChild(menuTitle);
      const menuHeaderButton = document.createElement('button');
      menuHeaderButton.classList = 'btn flex justify-center gap-2 btn-primary border-0 md:border';
      menuHeaderButton.type = 'button';
      menuHeader.appendChild(menuHeaderButton);
      menu.appendChild(menuHeader);
      if (trigger === '@') {
        menuTitle.textContent = 'Custom GPTs (@)';
        menuHeaderButton.id = 'see-all-custom-gpts';
        menuHeaderButton.textContent = '+ Create a GPT';
        // open '/gpts/editor' in new tab
        menuHeaderButton.addEventListener('click', () => {
          menu.remove();
          window.open('/gpts/editor', '_blank');
        });
        menu.appendChild(loadCustomGPTs());
      }
      if (trigger === '/') {
        menuTitle.textContent = `Custom Prompts (${trigger})`;
        menuHeaderButton.id = 'see-all-custom-prompts';
        menuHeaderButton.textContent = '+ Add More';
        menuHeaderButton.addEventListener('click', () => {
          menu.remove();
          createSettingsModal(7);
        });
        menu.appendChild(loadCustomPrompts());
      }
      if (trigger === '#') {
        menuTitle.textContent = 'Prompt Chains (#)';
        menuHeaderButton.id = 'see-all-prompt-chains';
        menuHeaderButton.textContent = 'See All Prompt Chains';
        menuHeaderButton.addEventListener('click', () => {
          menu.remove();
          createPromptChainListModal();
        });
        menu.appendChild(loadPromptChains());
      }
      const textAreaElement = document.querySelector('#prompt-textarea');
      textAreaElement.parentElement.appendChild(menu);
    }
  });
}
function loadCustomGPTs() {
  const menuContent = document.createElement('div');
  menuContent.id = 'quick-access-menu-content';
  menuContent.classList = 'flex flex-col gap-2';
  menuContent.style = 'overflow-y: scroll;height: 100%; width: 100%;padding:1px;';
  getGizmoDiscovery('recent', null, 24, 'global', false).then((gizmoDiscovery) => {
    getGizmosPinned(false).then((gizmosPinned) => {
      const recentGizmos = gizmoDiscovery.list.items.map((item) => ({ ...item.resource.gizmo, isRecent: true }));
      // add gizmo pinned to gizmos if not already present
      gizmosPinned.forEach((gizmoPinned) => {
        const gizmoPinnedId = gizmoPinned?.gizmo?.id;
        if (!recentGizmos.find((recentGizmo) => recentGizmo.id === gizmoPinnedId)) {
          recentGizmos.push(gizmoPinned.gizmo);
        }
      });
      for (let i = 0; i < recentGizmos.length; i += 1) {
        const gizmo = recentGizmos[i];
        const gizmoRow = document.createElement('button');
        gizmoRow.type = 'button';
        gizmoRow.id = `quick-access-menu-item-${i}`;
        gizmoRow.classList = 'btn p-0 w-full text-left focus:outline focus:ring-2 focus:ring-gray-200 hover:bg-token-main-surface-tertiary flex justify-between items-center';
        gizmoRow.innerHTML = `<div class="w-full" tabindex="0"> <div class="group flex h-10 items-center gap-2 rounded-lg px-2 font-medium text-sm text-token-text-primary" > <div class="h-7 w-7 flex-shrink-0"> <div class="gizmo-shadow-stroke overflow-hidden rounded-full"> <img src="${gizmo?.display?.profile_picture_url}" class="h-full w-full bg-token-main-surface-secondary dark:bg-token-main-surface-tertiary" alt="GPT" width="80" height="80" /></div></div><div class="flex h-fit grow flex-row justify-between space-x-2 overflow-hidden text-ellipsis whitespace-nowrap"> <div class="flex flex-row space-x-2"> <span class="shrink-0 truncate">${gizmo?.display?.name}</span ><span class="flex-grow truncate text-sm font-light text-token-text-tertiary max-w-sm">${gizmo?.display?.description}</span > </div> <span class="shrink-0 self-center flex items-center"><span id="item-arrow" class="flex items-center justify-between text-xl mr-2 rounded-md px-2 bg-token-main-surface-secondary ${i === 0 ? '' : 'invisible'}"><span class="text-sm mr-2">Enter</span> ➜</span>${gizmo?.isRecent ? '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" > <circle cx="12" cy="12" r="10"></circle> <polyline points="12 6 12 12 16 14"></polyline></svg>' : '<svg class="icon-sm" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M17.4845 2.8798C16.1773 1.57258 14.0107 1.74534 12.9272 3.24318L9.79772 7.56923C9.60945 7.82948 9.30775 7.9836 8.98654 7.9836H6.44673C3.74061 7.9836 2.27414 11.6759 4.16948 13.5713L6.59116 15.993L2.29324 20.2909C1.90225 20.6819 1.90225 21.3158 2.29324 21.7068C2.68422 22.0977 3.31812 22.0977 3.70911 21.7068L8.00703 17.4088L10.4287 19.8305C12.3241 21.7259 16.0164 20.2594 16.0164 17.5533V15.0135C16.0164 14.6923 16.1705 14.3906 16.4308 14.2023L20.7568 11.0728C22.2547 9.98926 22.4274 7.8227 21.1202 6.51549L17.4845 2.8798ZM11.8446 18.4147C12.4994 19.0694 14.0141 18.4928 14.0141 17.5533V15.0135C14.0141 14.0499 14.4764 13.1447 15.2572 12.58L19.5832 9.45047C20.0825 9.08928 20.1401 8.3671 19.7043 7.93136L16.0686 4.29567C15.6329 3.85993 14.9107 3.91751 14.5495 4.4168L11.4201 8.74285C10.8553 9.52359 9.95016 9.98594 8.98654 9.98594H6.44673C5.5072 9.98594 4.93059 11.5006 5.58535 12.1554L11.8446 18.4147Z" fill="currentColor"></path></svg>'}</span></div></div></div>`;
        menuContent.appendChild(gizmoRow);
        gizmoRow.addEventListener('click', () => {
          const textAreaElement = document.querySelector('#prompt-textarea');
          if (!textAreaElement) return;
          document.querySelector('#quick-access-menu').remove();
          // find the neeares previous @ position
          const textAreaValue = textAreaElement.value;
          const cursorPosition = textAreaElement.selectionStart;
          const previousAtPosition = textAreaValue.lastIndexOf('@', cursorPosition);
          const newText = textAreaValue.substring(0, previousAtPosition) + textAreaValue.substring(cursorPosition);
          textAreaElement.value = newText;
          const existingTaggedGizmoElement = document.getElementById('tagged-gizmo-wrapper');
          if (existingTaggedGizmoElement) existingTaggedGizmoElement.remove();
          const taggedGizmoElement = `<div id="tagged-gizmo-wrapper" data-gizmoid="${gizmo.id}" class="flex w-full flex-row items-center rounded-t-2xl bg-token-main-surface-secondary px-2 py-1"><div class="group flex h-10 items-center gap-2 rounded-lg px-2 font-medium"><div class="h-6 w-6 flex-shrink-0"><div class="gizmo-shadow-stroke overflow-hidden rounded-full"><img src="${gizmo?.display?.profile_picture_url}" class="h-full w-full bg-token-main-surface-secondary dark:bg-token-main-surface-tertiary" alt="GPT" width="80" height="80"></div></div><div class="space-x-2 overflow-hidden text-ellipsis text-sm font-light text-token-text-tertiary">Talking to <span class="font-medium text-token-text-secondary">${gizmo?.display?.name}</span></div></div><button id="tagged-gizmo-close-button" class="absolute right-4 text-sm font-bold"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md text-token-text-secondary hover:text-token-text-primary"><path d="M6.34315 6.34338L17.6569 17.6571M17.6569 6.34338L6.34315 17.6571" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div>`;

          const replyToPreviewElement = document.getElementById('reply-to-preview-wrapper');
          if (replyToPreviewElement) {
            replyToPreviewElement.classList.remove('rounded-t-2xl');
          }
          textAreaElement.parentElement.insertAdjacentHTML('afterbegin', taggedGizmoElement);
          textAreaElement.focus();
          textAreaElement.dispatchEvent(new Event('input', { bubbles: true }));
          textAreaElement.dispatchEvent(new Event('change', { bubbles: true }));

          const closeButton = document.querySelector('#tagged-gizmo-close-button');
          if (!closeButton) return;
          closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const curTaggedGizmoElement = document.getElementById('tagged-gizmo-wrapper');
            if (curTaggedGizmoElement) curTaggedGizmoElement.remove();
          });
        });
      }
    });
  });
  return menuContent;
}
function loadCustomPrompts() {
  const menuContent = document.createElement('div');
  menuContent.id = 'quick-access-menu-content';
  menuContent.classList = 'flex flex-col gap-2';
  menuContent.style = 'overflow-y: scroll;height: 100%; width: 100%;padding:1px;';
  chrome.storage.local.get(['customPrompts'], (result) => {
    let { customPrompts } = result;
    if (!customPrompts) customPrompts = defaultPrompts;
    const sortedCustomPrompts = customPrompts;
    for (let i = 0; i < sortedCustomPrompts.length; i += 1) {
      const prompt = sortedCustomPrompts[i];
      const promptElement = document.createElement('button');
      promptElement.type = 'button';
      promptElement.id = `quick-access-menu-item-${i}`;
      promptElement.classList = 'btn w-full text-left focus:outline focus:ring-2 focus:ring-gray-200 hover:bg-token-main-surface-tertiary flex justify-between items-center';
      promptElement.innerHTML = `<span style="width:80%;"><span style="font-weight:bold; font-size:14px; margin-right:16px;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;display:block;width:100%;">${prompt.title}</span><span style="font-size:12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;display:block;width:100%;color:#888;">${prompt.text}</span></span><span id="item-arrow" class="flex items-center justify-between text-xl mr-2 rounded-md px-2 bg-token-main-surface-secondary ${i === 0 ? '' : 'invisible'}"><span class="text-sm mr-2">Enter</span> ➜</span>`;
      promptElement.addEventListener('click', () => {
        const textAreaElement = document.querySelector('#prompt-textarea');
        if (!textAreaElement) return;
        document.querySelector('#quick-access-menu').remove();
        // find the neeares previous / position
        const textAreaValue = textAreaElement.value;
        const cursorPosition = textAreaElement.selectionStart;
        const previousSlashPosition = textAreaValue.lastIndexOf('/', cursorPosition);
        const newText = textAreaValue.substring(0, previousSlashPosition) + prompt.text + textAreaValue.substring(cursorPosition);
        textAreaElement.value = newText;
        textAreaElement.focus();
        textAreaElement.dispatchEvent(new Event('input', { bubbles: true }));
        textAreaElement.dispatchEvent(new Event('change', { bubbles: true }));
      });
      menuContent.appendChild(promptElement);
    }
  });
  return menuContent;
}
function loadPromptChains() {
  const menuContent = document.createElement('div');
  menuContent.id = 'quick-access-menu-content';
  menuContent.classList = 'flex flex-col gap-2';
  menuContent.style = 'overflow-y: scroll;height: 100%; width: 100%;padding:1px;';
  chrome.storage.local.get(['promptChains'], (result) => {
    const { promptChains } = result;
    const sortedPromptChains = promptChains?.sort((a, b) => a.title.localeCompare(b.title));
    if (!promptChains) {
      const noPromptChains = document.createElement('div');
      noPromptChains.classList = 'text-center text-token-text-secondary text-sm';
      noPromptChains.textContent = 'You haven\'t created any prompt chain yet.';
      menuContent.appendChild(noPromptChains);
      return;
    }
    for (let i = 0; i < sortedPromptChains.length; i += 1) {
      const prompt = sortedPromptChains[i];
      const promptElement = document.createElement('button');
      promptElement.type = 'button';
      promptElement.id = `quick-access-menu-item-${i}`;
      promptElement.classList = 'btn w-full text-left focus:outline focus:ring-2 focus:ring-gray-200 hover:bg-token-main-surface-tertiary flex justify-between items-center';
      promptElement.innerHTML = `<span  style="width:80%;"><span style="font-weight:bold; font-size:14px; margin-right:16px;white-space: nowrap; overflow: hidden; text-overflow: ellipsis;display:block;width:100%;">${prompt.title} (${prompt.steps.length} prompts)</span><span style="font-size:12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;display:block;width:100%;color:#888;">Prompt 1: ${prompt.steps[0]}</span></span><span id="item-arrow" class="flex items-center justify-between text-xl mr-2 rounded-md px-2 bg-token-main-surface-secondary ${i === 0 ? '' : 'invisible'}"><span class="text-sm mr-2">Enter</span> ➜</span>`;
      // also trigger on enter
      promptElement.addEventListener('click', () => {
        runPromptChain(prompt.steps, 0, false);
      });
      menuContent.appendChild(promptElement);
    }
  });
  return menuContent;
}
