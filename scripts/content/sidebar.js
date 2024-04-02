/* global getGizmosBootstrap, resetSelection, ChatGPTIcon, showNewChatPage, renderGizmoDiscoveryPage, getGizmoIdFromUrl, showSidebarGizmoMenu, closeMenus */
// eslint-disable-next-line no-unused-vars
function initializeSidebar() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  nav.style.overflow = 'hidden';
  // 1- first child is the nav gap
  let navGap = nav.firstChild;

  // remove keywoard everywhere
  [...document.querySelectorAll('[class^=xt-]')]?.forEach((el) => {
    el?.remove();
  });
  // start legacy code
  const navChildCount = nav.childElementCount;
  if (navChildCount === 3) {
    // 1- first child is the history button
    nav.firstChild.id = 'history-off-wrapper';
    // 2- second child is the nav gap
    navGap = document.querySelector('nav > :nth-child(2)');
  }
  // end legacy code

  navGap.id = 'nav-gap';
  navGap.style = `${navGap.style.cssText};padding-right:0;display:flex;margin-right:-8px;transition: all 1s ease-in-out; position: relative;`;
  // gpt-list
  addGPTList();
  // conversation list
  const conversationList = navGap.lastChild;
  conversationList.id = 'conversation-list';
  conversationList.classList = 'flex flex-col grow gap-2 pb-2 text-token-text-primary text-sm';
  conversationList.style = 'scroll-behavior: smooth; padding-top: 4px;overflow-x:clip;';
  // Nav footer
  const navFooter = document.createElement('div');
  navFooter.id = 'nav-footer';
  navFooter.classList = 'bg-token-sidebar-surface-primary pt-2';
  navFooter.style = 'margin:auto 0 0 0;width:100%;display:flex; flex-direction:column-reverse;justify-content:flex-start;align-items:center;position:sticky;bottom:0;z-index:10;';
  navGap.appendChild(navFooter);

  // 2- last child is the user menu
  const userMenu = nav.lastChild;
  userMenu.id = 'user-menu';
  userMenu.style.borderTop = '1px solid #999';

  userMenu?.childNodes.forEach((child) => {
    // to remove upgrade/renew button (in any language)
    if (child.tagName === 'A') {
      child.remove();
    }
  });

  // add expand button(after adding expand button, it will be the 3rd chind and user menu will be the 4th child)
  addExpandButton();
}
function addGPTList() {
  const navGap = document.querySelector('#nav-gap');
  if (!navGap) return;
  const exploreButton = navGap.querySelector('a[href="/gpts"]');
  if (!exploreButton) {
    const newGptList = '<div id="gpt-list"></div>';
    // insert gptlist after navgap firstChild
    const gptList = document.querySelector('#gpt-list');
    if (!gptList) {
      navGap.firstChild.insertAdjacentHTML('afterend', newGptList);
    }
  } else {
    const gptList = navGap.querySelector('div > :nth-child(2)');
    gptList.id = 'gpt-list';
  }
}
// eslint-disable-next-line no-unused-vars
function updateNewChatButtonNotSynced() {
  chrome.storage.local.get(['selectedConversations'], (result) => {
    const { selectedConversations } = result;
    const textAreaElement = document.querySelector('#prompt-textarea');
    const newChatButton = document.querySelector('#nav-gap').querySelector('a');
    if (!newChatButton) return;
    newChatButton.classList = 'flex p-2 w-full items-center gap-3 transition-colors duration-200 text-token-text-primary cursor-pointer text-sm rounded-md border border-token-border-light bg-token-sidebar-surface-primary hover:bg-token-main-surface-tertiary mb-1 flex-shrink-0';
    newChatButton.id = 'new-chat-button';
    newChatButton.parentElement.parentElement.classList = 'sticky left-0 right-0 top-0 z-20 bg-token-sidebar-surface-primary pt-3.5';
    newChatButton.addEventListener('click', (e) => {
      if (e.target.closest('a').innerText === 'Limpar Seleção') {
        e.stopPropagation();
        e.preventDefault();
        resetSelection();
      }
      if (textAreaElement) {
        textAreaElement.focus();
      }
    });
    if (selectedConversations?.length > 0) {
      newChatButton.innerHTML = '<div class="h-7 w-7 flex-shrink-0"><div class="gizmo-shadow-stroke relative flex h-full items-center justify-center rounded-full bg-white text-black"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div></div>Clear selection';
    } else {
      newChatButton.innerHTML = ChatGPTIcon();
    }
  });
}
function updateGPTEditIcon(gptListItem = null) {
  const gptList = document.querySelector('#gpt-list');
  const gptListItems = gptList.querySelectorAll('a');
  gptListItems.forEach((item) => {
    if (item !== gptListItem && item.href.includes('/g/g-')) {
      const otherButtons = item.querySelectorAll('button');
      const otherLastButtonChild = otherButtons[otherButtons.length - 1];
      otherLastButtonChild.classList = 'invisible text-token-text-tertiary hover:text-token-text-secondary group-hover:visible';
    }
  });
}
function hideAllEditIcons() {
  const nav = document.querySelector('nav');
  const newChatButton = document.querySelector('#new-chat-button');
  if (newChatButton) {
    const allNewChatButtonButtons = newChatButton.querySelectorAll('button');
    const newChatButtonLastButtonChild = allNewChatButtonButtons[allNewChatButtonButtons.length - 1];
    if (newChatButtonLastButtonChild) {
      newChatButtonLastButtonChild.classList = 'invisible text-token-text-tertiary hover:text-token-text-secondary group-hover:visible';
    }
  }
  const gptListItems = nav.querySelectorAll('[id^=gpt-list-item-]');
  gptListItems.forEach((item) => {
    const buttons = item.querySelectorAll('button');
    const lastButtonChild = buttons[buttons.length - 1];
    lastButtonChild.classList = 'invisible text-token-text-tertiary hover:text-token-text-secondary group-hover:visible';
  });
}
// eslint-disable-next-line no-unused-vars
function renderGPTList(showAll = false, forceRefresh = false) {
  const visibleGizmoCount = 4;
  let gptList = document.querySelector('#gpt-list');
  if (!gptList) addGPTList();
  gptList = document.querySelector('#gpt-list');
  if (!gptList) return;

  const gptIdFromUrl = getGizmoIdFromUrl(window.location.href);

  getGizmosBootstrap(forceRefresh).then((gizmosBootstrap) => {
    let gizmos = gizmosBootstrap?.gizmos || [];
    const keepGizmos = gizmos?.filter((gizmo) => gizmo?.flair?.kind === 'sidebar_keep');
    const recentGizmos = gizmos?.filter((gizmo) => gizmo?.flair?.kind === 'recent');
    gizmos = [...keepGizmos, ...recentGizmos];
    const shouldShowMoreButton = gizmos?.length > 5;
    const visibleGizmos = (showAll || gizmos?.length === 5) ? gizmos : gizmos?.slice(0, visibleGizmoCount);
    // empty gptList
    gptList.innerHTML = '';
    visibleGizmos?.forEach((gizmo, index) => {
      if (index === keepGizmos.length && recentGizmos.length > 0) {
        // add recent border
        const gptListRecentBorder = document.createElement('div');
        gptListRecentBorder.classList = 'my-2 ml-2 h-px w-7 bg-gray-700';
        gptListRecentBorder.id = 'gpt-list-recent-border';
        gptList.appendChild(gptListRecentBorder);
      }
      const gizmoItemWrapper = document.createElement('div');
      gizmoItemWrapper.classList = 'pb-0.5 last:pb-0';
      const gizmoItem = document.createElement('a');
      gizmoItem.id = `gpt-list-item-${gizmo?.resource?.gizmo?.id}`;
      gizmoItem.classList = 'group flex h-10 items-center gap-2 rounded-lg px-2 font-medium hover:bg-token-main-surface-tertiary';
      gizmoItem.href = `/g/g-${gizmo?.resource?.gizmo?.id}`;
      gizmoItem.innerHTML = `<div class="h-7 w-7 flex-shrink-0"><div class="gizmo-shadow-stroke overflow-hidden rounded-full"><img src="${gizmo?.resource?.gizmo?.display?.profile_picture_url}" class="h-full w-full bg-token-sidebar-surface-secondary" alt="GPT" width="80" height="80"></div></div><div class="grow overflow-hidden text-ellipsis whitespace-nowrap text-sm text-token-text-primary">${gizmo?.resource?.gizmo?.display?.name}</div><div class="flex gap-3"><div class="text-token-text-secondary"><button id="sidebar-gizmo-menu-button-${gizmo?.resource?.gizmo?.id}" class="flex text-token-text-secondary invisible group-hover:visible" type="button" aria-haspopup="menu" aria-expanded="false" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path></svg></button></div><span class="flex items-center" data-state="closed"><button class="${gptIdFromUrl === gizmo?.resource?.gizmo?.id ? 'text-token-text-primary' : 'invisible text-token-text-secondary'} hover:text-token-text-secondary group-hover:visible"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.7929 2.79289C18.0118 1.57394 19.9882 1.57394 21.2071 2.79289C22.4261 4.01184 22.4261 5.98815 21.2071 7.20711L12.7071 15.7071C12.5196 15.8946 12.2652 16 12 16H9C8.44772 16 8 15.5523 8 15V12C8 11.7348 8.10536 11.4804 8.29289 11.2929L16.7929 2.79289ZM19.7929 4.20711C19.355 3.7692 18.645 3.7692 18.2071 4.2071L10 12.4142V14H11.5858L19.7929 5.79289C20.2308 5.35499 20.2308 4.64501 19.7929 4.20711ZM6 5C5.44772 5 5 5.44771 5 6V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V14C19 13.4477 19.4477 13 20 13C20.5523 13 21 13.4477 21 14V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34314 4.34315 3 6 3H10C10.5523 3 11 3.44771 11 4C11 4.55228 10.5523 5 10 5H6Z" fill="currentColor"></path></svg></button></span></div>`;
      gizmoItemWrapper.appendChild(gizmoItem);
      gptList.appendChild(gizmoItemWrapper);

      const gptListItem = gptList.querySelector(`[id=gpt-list-item-${gizmo?.resource?.gizmo?.id}]`);
      gptListItem.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // get the last button child of the
        const buttons = gptListItem.querySelectorAll('button');
        const lastButtonChild = buttons[buttons.length - 1];
        lastButtonChild.classList = 'text-token-text-primary';
        // remove Edit Icon from Newchatbutton
        const newChatButton = document.querySelector('#new-chat-button');
        if (newChatButton) {
          const allNewChatButtonButtons = newChatButton.querySelectorAll('button');
          const newChatButtonLastButtonChild = allNewChatButtonButtons[allNewChatButtonButtons.length - 1];
          newChatButtonLastButtonChild.classList = 'invisible text-token-text-tertiary hover:text-token-text-secondary group-hover:visible';
        }

        updateGPTEditIcon(gptListItem);
        showNewChatPage(gizmo?.resource);
        chrome.runtime.sendMessage({
          updateGizmoMetrics: true,
          detail: {
            gizmoId: gizmo?.resource?.gizmo?.id,
            metricName: 'num_users_interacted_with',
          },
        });
      });
      const menuButton = gptListItem.querySelector(`#sidebar-gizmo-menu-button-${gizmo?.resource?.gizmo?.id}`);
      menuButton?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMenus();
        const menu = document.querySelector('#sidebar-gizmo-menu');
        if (menu) menu.remove();
        showSidebarGizmoMenu(e, gizmo?.resource?.gizmo?.id);
      });
    });
    if (shouldShowMoreButton) {
      // add show more button/show less button
      const showMoreButton = document.createElement('button');
      showMoreButton.classList = 'flex items-center gap-1 p-2 text-sm font-medium text-token-text-primary';
      showMoreButton.id = 'show-more-button';
      if (showAll) {
        showMoreButton.innerHTML = 'See less <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L18.7071 13.2929C19.0976 13.6834 19.0976 14.3166 18.7071 14.7071C18.3166 15.0976 17.6834 15.0976 17.2929 14.7071L12 9.41421L6.70711 14.7071C6.31658 15.0976 5.68342 15.0976 5.29289 14.7071C4.90237 14.3166 4.90237 13.6834 5.29289 13.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="currentColor"></path></svg>';
      } else {
        showMoreButton.innerHTML = `${gizmos.length - visibleGizmoCount} more <svg width="16" height="17" viewBox="0 0 16 17" fill="none" class="icon-md"><path d="M11.3346 7.83203L8.00131 11.1654L4.66797 7.83203" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
      }
      showMoreButton.addEventListener('click', () => {
        renderGPTList(!showAll);
      });
      gptList.appendChild(showMoreButton);
    }
    // add explore button
    gptList.insertAdjacentHTML('beforeend', '<div id="gpt-list-explore-button"><a class="flex h-10 w-full items-center gap-2 rounded-lg px-2 font-semibold text-token-text-primary hover:bg-token-main-surface-tertiary" href="/gpts"><div class="flex h-7 w-7 items-center justify-center text-token-text-secondary"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><circle cx="6.75" cy="6.75" r="3.25" stroke="currentColor" stroke-width="2"></circle><circle cx="17.25" cy="6.75" r="3.25" stroke="currentColor" stroke-width="2"></circle><circle cx="6.75" cy="17.25" r="3.25" stroke="currentColor" stroke-width="2"></circle><circle cx="17.25" cy="17.25" r="3.25" stroke="currentColor" stroke-width="2"></circle></svg></div><span class="text-sm">Explore GPTs</span></a></div>');
    // add event listener
    const gptListExploreButton = document.querySelector('#gpt-list-explore-button');
    chrome.storage.local.get(['settings']).then((result) => {
      if (result.settings?.enhanceGPTStore) {
        gptListExploreButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          // clear search box
          const searchBox = document.querySelector('#conversation-search');
          if (searchBox?.value) {
            searchBox.value = '';
            searchBox.dispatchEvent(new Event('input', { bubbles: true }));
          }
          hideAllEditIcons();
          // render the explore page with loading indicator
          window.history.replaceState({}, '', 'https://chat.openai.com/gpts');
          renderGizmoDiscoveryPage();
        });
      } else {
        gptListExploreButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.location.href !== 'https://chat.openai.com/gpts') {
            window.location.href = 'https://chat.openai.com/gpts';
          }
        });
      }
    });
  });
}
function buttonIcon(title) {
  switch (title) {
    case 'HIstórico de Prompts':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4 text-token-text-primary" fill="currentColor"><path d="M448 160C483.3 160 512 188.7 512 224V448C512 483.3 483.3 512 448 512H64C28.65 512 0 483.3 0 448V224C0 188.7 28.65 160 64 160H448zM448 208H64C55.16 208 48 215.2 48 224V448C48 456.8 55.16 464 64 464H448C456.8 464 464 456.8 464 448V224C464 215.2 456.8 208 448 208zM440 80C453.3 80 464 90.75 464 104C464 117.3 453.3 128 440 128H72C58.75 128 48 117.3 48 104C48 90.75 58.75 80 72 80H440zM392 0C405.3 0 416 10.75 416 24C416 37.25 405.3 48 392 48H120C106.7 48 96 37.25 96 24C96 10.75 106.7 0 120 0H392z"/></svg>';
    case 'Community Prompts':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-4 h-4 text-token-text-primary" fill="currentColor"><path d="M448 352V48C448 21.53 426.5 0 400 0h-320C35.89 0 0 35.88 0 80v352C0 476.1 35.89 512 80 512h344c13.25 0 24-10.75 24-24s-10.75-24-24-24H416v-66.95C434.6 390.4 448 372.8 448 352zM368 464h-288c-17.64 0-32-14.34-32-32s14.36-32 32-32h288V464zM400 352h-320c-11.38 0-22.2 2.375-32 6.688V80c0-17.66 14.36-32 32-32h320V352zM152 160h176C341.3 160 352 149.3 352 136S341.3 112 328 112h-176C138.8 112 128 122.8 128 136S138.8 160 152 160zM152 240h176C341.3 240 352 229.3 352 216S341.3 192 328 192h-176C138.8 192 128 202.8 128 216S138.8 240 152 240z"/></svg>';
    default:
      return '';
  }
}
// eslint-disable-next-line no-unused-vars
function addButtonToNavFooter(title, onClick) {
  if (document.querySelector(`#${title.toLowerCase().replaceAll(' ', '-')}-button`)) return;
  // create the setting button by copying the nav button
  const button = document.createElement('a');
  button.classList = 'flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-token-text-primary cursor-pointer text-sm rounded-md border border-token-border-light bg-token-sidebar-surface-primary hover:bg-token-main-surface-tertiary mb-1 flex-shrink-0';
  button.innerHTML = `${buttonIcon(title)} ${title}`;

  button.id = `${title.toLowerCase().replaceAll(' ', '-')}-button`;
  button.style = `${button.style.cssText}; width: 100%;`;
  // Add click event listener to setting button
  button.addEventListener('click', () => {
    // open the setting modal
    onClick();
  });
  // add the setting button to the nav parrent
  const navFooter = document.querySelector('#nav-footer');
  navFooter?.appendChild(button);
}

function addExpandButton() {
  const originalExpandButton = document.querySelector('#expand-sidebar-bottom-button');
  if (originalExpandButton) originalExpandButton.remove();
  const conversationList = document.querySelector('#conversation-list');
  if (!conversationList) return;

  const navGap = document.querySelector('#nav-gap');

  const expandButton = document.createElement('button');
  expandButton.id = 'expand-sidebar-bottom-button';
  expandButton.classList = 'flex items-center justify-center w-10 h-4 relative rounded-md bg-token-sidebar-surface-tertiary hover:bg-token-main-surface-secondary';
  expandButton.style = 'bottom:-8px;margin:auto';
  chrome.storage.local.get(['settings'], (result) => {
    const { settings } = result;
    const userMenu = document.querySelector('#user-menu');
    if (typeof settings === 'undefined' || !settings?.hideBottomSidebar) {
      userMenu.style.paddingTop = '8px';
      expandButton.innerHTML = '<svg class="w-4 h-4 text-token-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>';
    } else {
      userMenu.style.paddingTop = '20px';
      expandButton.innerHTML = '<svg class="w-4 h-4 text-token-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>';
      navGap.style.minHeight = 'calc(100vh - 40px)';
      navGap.style.maxHeight = 'calc(100vh -  40px)';
    }
  });
  expandButton.addEventListener('click', () => {
    chrome.storage.local.get(['settings'], (result) => {
      const { settings } = result;
      const { hideBottomSidebar } = settings;
      chrome.storage.local.set({ settings: { ...settings, hideBottomSidebar: !hideBottomSidebar } }, () => {
        const curConversationListParent = document.querySelector('#conversation-list').parentElement;
        const userMenu = document.querySelector('#user-menu');
        if (!hideBottomSidebar) {
          userMenu.style.paddingTop = '20px';
          curConversationListParent.style.minHeight = 'calc(100vh - 40px)';
          curConversationListParent.style.maxHeight = 'calc(100vh - 40px)';
          expandButton.innerHTML = '<svg class="w-4 h-4 text-token-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>';
        } else {
          userMenu.style.paddingTop = '8px';
          curConversationListParent.style.minHeight = 'unset';
          curConversationListParent.style.maxHeight = 'unset';
          expandButton.innerHTML = '<svg class="w-4 h-4 text-token-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>';
        }
      });
    });
  });
  // add expandButton after conversationListParent
  navGap.after(expandButton);
}
