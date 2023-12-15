/* global getGizmoById, resetSelection, ChatGPTIcon, showNewChatPage, renderGizmoDiscoveryPage, getGizmoIdFromUrl, debounce, showSidebarGizmoMenu */
// eslint-disable-next-line no-unused-vars
function initializeSidebar() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  nav.style.overflow = 'hidden';
  // 1- first child is the history button
  nav.firstChild.id = 'history-off-wrapper';
  // 2- second child is the nav gap
  const navGap = document.querySelector('nav > :nth-child(2)');

  navGap.id = 'nav-gap';
  navGap.style = `${navGap.style.cssText};padding-right:0;display:flex;margin-right:-8px;transition: all 1s ease-in-out; position: relative;`;
  // conversation list
  const conversationList = navGap.lastChild;
  conversationList.id = 'conversation-list';
  conversationList.classList = 'flex flex-col grow gap-2 pb-2 dark:text-gray-100 text-gray-800 text-sm';
  conversationList.style = 'scroll-behavior: smooth; padding-top: 4px;overflow-x:clip;';
  // Nav footer
  const navFooter = document.createElement('div');
  navFooter.id = 'nav-footer';
  navFooter.classList = 'bg-black';
  navFooter.style = 'margin:8px 0 0 0;width:100%;display:flex; flex-direction:column-reverse;justify-content:flex-start;align-items:center;min-height:108px;position:sticky;bottom:0;z-index:10;';
  navGap.appendChild(navFooter);

  // 3- third child is the user menu
  const userMenu = nav.lastChild;
  userMenu.id = 'user-menu';
  userMenu.style.borderTop = '1px solid #333';

  // add expand button(after adding expand button, it will be the 3rd chind and user menu will be the 4th child)
  addExpandButton();
}
// eslint-disable-next-line no-unused-vars
function updateNewChatButtonNotSynced() {
  chrome.storage.local.get(['selectedConversations'], (result) => {
    const { selectedConversations } = result;
    const textAreaElement = document.querySelector('main form textarea');
    const newChatButton = document.querySelector('nav > :nth-child(2)').querySelector('a');
    if (!newChatButton) return;
    newChatButton.classList = 'flex p-2 w-full items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 mb-1 flex-shrink-0';
    newChatButton.id = 'new-chat-button';
    newChatButton.parentElement.parentElement.classList = 'sticky left-0 right-0 top-0 z-20 bg-black pt-3.5';
    newChatButton.addEventListener('click', (e) => {
      if (e.target.closest('a').innerText === 'Clear selection') {
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
    newChatButtonLastButtonChild.classList = 'invisible text-token-text-tertiary hover:text-token-text-secondary group-hover:visible';
  }
  const gptListItems = nav.querySelectorAll('[id^=gpt-list-item-]');
  gptListItems.forEach((item) => {
    const buttons = item.querySelectorAll('button');
    const lastButtonChild = buttons[buttons.length - 1];
    lastButtonChild.classList = 'invisible text-token-text-tertiary hover:text-token-text-secondary group-hover:visible';
  });
}
function updateGPTList() {
  const gptList = document.querySelector('#gpt-list');
  const gptListRecentBorder = gptList.querySelector('div.my-2.ml-2.h-px.w-7.bg-token-border-light');
  if (gptListRecentBorder) gptListRecentBorder.id = 'gpt-list-recent-border';

  const gptListItems = gptList.querySelectorAll('a');
  const gptListItemsWithoutId = gptList.querySelectorAll('a:not([id])');

  if (gptListItemsWithoutId.length > 1) { // excluding explore button
    gptListItems.forEach((oldGptListItem) => {
      if (oldGptListItem.href.includes('/g/g-')) {
        // clone the gptListItem
        const gptListItem = oldGptListItem.cloneNode(true);
        // replace the old gptListItem with the new one
        oldGptListItem.replaceWith(gptListItem);
        const gptListItemId = getGizmoIdFromUrl(gptListItem.getAttribute('href'));
        gptListItem.id = `gpt-list-item-${gptListItemId}`;
        getGizmoById(gptListItemId).then((gizmoData) => {
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
            showNewChatPage(gizmoData?.resource);
            chrome.runtime.sendMessage({
              updateGizmoMetrics: true,
              detail: {
                gizmoId: gizmoData?.resource?.gizmo?.id,
                metricName: 'num_users_interacted_with',
              },
            });
          });
          // override ... menu button
          const existingMenuButton = gptListItem.querySelector('[id^="sidebar-gizmo-menu-button-]');
          if (!existingMenuButton) {
            const newMenuButton = `<div class="text-token-text-tertiary"><button id="sidebar-gizmo-menu-button-${gizmoData?.resource?.gizmo?.id}" class="flex text-token-text-tertiary invisible group-hover:visible" type="button" aria-haspopup="menu" aria-expanded="false" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path></svg></button></div>`;
            gptListItem.lastChild.insertAdjacentHTML('afterbegin', newMenuButton);
            const menuButton = gptListItem.querySelector(`#sidebar-gizmo-menu-button-${gizmoData?.resource?.gizmo?.id}`);
            menuButton?.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              const menu = document.querySelector('#sidebar-gizmo-menu');
              if (menu) menu.remove();
              showSidebarGizmoMenu(e, gizmoData?.resource?.gizmo?.id);
            });
            document.body.addEventListener('click', () => {
              const menu = document.querySelector('#sidebar-gizmo-menu');
              if (menu) menu.remove();
            });
          }
        });
      }
    });
  }
  // update explore button
  const gptListExploreButton = gptList.lastChild;
  if (gptListExploreButton.id !== 'gpt-list-explore-button') {
    gptListExploreButton.id = 'gpt-list-explore-button';
    gptListExploreButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // clear search box
      const searchBox = document.querySelector('#conversation-search');
      if (searchBox?.value) {
        searchBox.value = '';
        searchBox.dispatchEvent(new Event('input'), { bubbles: true });
      }
      hideAllEditIcons();
      // render the explore page with loading indicator
      window.history.replaceState({}, '', 'https://chat.openai.com/gpts/discovery');
      renderGizmoDiscoveryPage();
    });
  }
  // confirm conversation list is loaded correct
  const conversationList = document.querySelector('#conversation-list');
  if (!conversationList) return;
  while (gptList && gptList.nextElementSibling !== conversationList) {
    gptList.nextElementSibling.remove();
  }
}
// eslint-disable-next-line no-unused-vars
function observeGizmoBootstrapList(gizmosBootstrap) {
  const observer = new MutationObserver(debounce(() => {
    const navGap = document.querySelector('#nav-gap');
    if (!navGap) return;
    const gptList = navGap.querySelector('div > :nth-child(2)');
    if (!document.querySelector('#gpt-list')) {
      gptList.id = 'gpt-list';
      updateGPTList();
    }
  }, 100));

  const navGap = document.querySelector('#nav-gap');
  if (!navGap) return;
  // Free accounts don't have the GPTList or explore button. Add it for them
  const exploreButton = navGap.querySelector('a[href="/gpts/discovery"]');
  if (!exploreButton) {
    const newGptList = '<div><div tabindex="0" data-projection-id="2"><a class="flex h-10 w-full items-center gap-2 rounded-lg px-2 font-semibold text-token-text-primary hover:bg-token-surface-primary" href="/gpts/discovery"><div class="flex h-7 w-7 items-center justify-center text-token-text-secondary"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><circle cx="6.75" cy="6.75" r="3.25" stroke="currentColor" stroke-width="2"></circle><circle cx="17.25" cy="6.75" r="3.25" stroke="currentColor" stroke-width="2"></circle><circle cx="6.75" cy="17.25" r="3.25" stroke="currentColor" stroke-width="2"></circle><circle cx="17.25" cy="17.25" r="3.25" stroke="currentColor" stroke-width="2"></circle></svg></div><span class="text-sm">Explore</span></a></div></div>';
    // insert gptlist after navgap firstChild
    navGap.firstChild.insertAdjacentHTML('afterend', newGptList);
  }

  observer.observe(navGap, {
    childList: true,
    subtree: true,
  });
}

// eslint-disable-next-line no-unused-vars
function addButtonToNavFooter(title, onClick) {
  if (document.querySelector(`#${title.toLowerCase().replaceAll(' ', '-')}-button`)) return;
  // create the setting button by copying the nav button
  const button = document.createElement('a');
  button.classList = 'flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 mb-1 flex-shrink-0';
  button.textContent = title;

  const buttonIcon = document.createElement('img');
  buttonIcon.style = 'width: 16px; height: 16px;';
  buttonIcon.src = chrome.runtime.getURL(`icons/${title.toLowerCase().replaceAll(' ', '-')}.png`);
  button.id = `${title.toLowerCase().replaceAll(' ', '-')}-button`;
  button.prepend(buttonIcon);
  button.style = `${button.style.cssText}; width: 100%;`;
  // Add click event listener to setting button
  button.addEventListener('click', () => {
    // open the setting modal
    onClick();
  });
  // add the setting button to the nav parrent
  const navFooter = document.querySelector('#nav-footer');
  navFooter.appendChild(button);
}

function addExpandButton() {
  const originalExpandButton = document.querySelector('#expand-sidebar-bottom-button');
  if (originalExpandButton) originalExpandButton.remove();
  const conversationList = document.querySelector('#conversation-list');
  if (!conversationList) return;

  const navGap = document.querySelector('#nav-gap');

  const expandButton = document.createElement('button');
  expandButton.id = 'expand-sidebar-bottom-button';
  expandButton.classList = 'flex items-center justify-center w-10 h-4 relative rounded-md bg-gray-800 hover:bg-gray-700 ';
  expandButton.style = 'bottom:-8px;margin:auto';
  chrome.storage.local.get(['settings'], (result) => {
    const { settings } = result;
    if (!settings) return;
    const { hideBottomSidebar } = settings;
    const userMenu = document.querySelector('#user-menu');
    if (!hideBottomSidebar) {
      userMenu.style.paddingTop = '8px';
      expandButton.innerHTML = '<svg class="w-4 h-4 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>';
    } else {
      userMenu.style.paddingTop = '20px';
      expandButton.innerHTML = '<svg class="w-4 h-4 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>';
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
          expandButton.innerHTML = '<svg class="w-4 h-4 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>';
        } else {
          userMenu.style.paddingTop = '8px';
          curConversationListParent.style.minHeight = 'unset';
          curConversationListParent.style.maxHeight = 'unset';
          expandButton.innerHTML = '<svg class="w-4 h-4 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>';
        }
      });
    });
  });
  // add expandButton after conversationListParent
  navGap.after(expandButton);
}
