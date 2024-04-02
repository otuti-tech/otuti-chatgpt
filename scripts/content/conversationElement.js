/* eslint-disable no-restricted-globals */
/* global updateButtonsAfterSelection, formatDate, showAllCheckboxes, hideAllButLastCheckboxes, loadConversation, shiftKeyPressed:true, isWindows, arkoseWasInitialized, updateOutOfDateConversation, hideAllEditIcons, formatTime, showConversationElementMenu, closeMenus */

const notSelectedClassList = 'flex py-3 px-3 pr-3 w-full items-center gap-3 relative rounded-md hover:bg-token-main-surface-tertiary cursor-pointer break-all hover:pr-10 group';
const selectedClassList = 'flex py-3 px-3 pr-3 w-full items-center gap-3 relative rounded-md bg-token-main-surface-tertiary cursor-pointer break-all hover:pr-10 group selected';

function getConversationElementClassList(conversation) {
  const { pathname } = new URL(window.location.toString());
  const conversationId = pathname.split('/c/').pop().replace(/[^a-z0-9-]/gi, '');
  return conversationId === conversation.id ? selectedClassList : notSelectedClassList;
}
// eslint-disable-next-line no-unused-vars
function createConversation(conversation) {
  const searchbox = document.querySelector('#conversation-search');
  const searchValue = searchbox ? searchbox.value : '';
  const conversationElement = document.createElement('a');
  // conversationElement.href = 'javascript:';
  conversationElement.id = `conversation-button-${conversation.id}`;

  conversationElement.classList = getConversationElementClassList(conversation);
  conversationElement.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenus();
    showConversationElementMenu(e, conversation.id);
  });
  conversationElement.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenus();
    const gizmoPath = conversation.gizmo_id ? `g/${conversation.gizmo_id}/` : '';
    const { pathname } = new URL(window.location.toString());
    if (e.metaKey || (isWindows() && e.ctrlKey)) {
      window.open(`https://chat.openai.com/${gizmoPath}c/${conversation.id}`, '_blank');
      return;
    }
    chrome.storage.local.get(['account', 'chatgptAccountId'], (r) => {
      const isPaid = r?.account?.accounts?.[r?.chatgptAccountId || 'default']?.entitlement?.has_active_subscription || false;
      const arkoseEnabled = r?.account?.accounts?.[r?.chatgptAccountId || 'default']?.features?.find((f) => f.includes('arkose')) || false;

      if (!isPaid || !arkoseEnabled || arkoseWasInitialized()) {
        const conversationId = pathname.split('/c/').pop().replace(/[^a-z0-9-]/gi, '');
        if (searchValue || conversationId !== conversation.id) {
          window.history.pushState({}, '', `https://chat.openai.com/${gizmoPath}c/${conversation.id}`);
          // set conversations with class selected to not selected
          const focusedConversations = document.querySelectorAll('.selected');
          focusedConversations.forEach((c) => {
            c.classList = notSelectedClassList;
            c.style.backgroundColor = '';
          });
          // set selected conversation
          conversationElement.classList = selectedClassList;
          loadConversation(conversation.id);
        }
      } else {
        window.location.href = `https://chat.openai.com/${gizmoPath}c/${conversation.id}`;
      }
      hideAllEditIcons();
      updateOutOfDateConversation();
    });
  });
  const conversationElementIcon = conversation.saveHistory ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="relative w-4 h-4 text-token-text-primary" style=\'top:-2px\' fill="currentColor"><path d="M360 144h-208C138.8 144 128 154.8 128 168S138.8 192 152 192h208C373.3 192 384 181.3 384 168S373.3 144 360 144zM264 240h-112C138.8 240 128 250.8 128 264S138.8 288 152 288h112C277.3 288 288 277.3 288 264S277.3 240 264 240zM447.1 0h-384c-35.25 0-64 28.75-64 63.1v287.1c0 35.25 28.75 63.1 64 63.1h96v83.1c0 9.836 11.02 15.55 19.12 9.7l124.9-93.7h144c35.25 0 64-28.75 64-63.1V63.1C511.1 28.75 483.2 0 447.1 0zM464 352c0 8.75-7.25 16-16 16h-160l-80 60v-60H64c-8.75 0-16-7.25-16-16V64c0-8.75 7.25-16 16-16h384c8.75 0 16 7.25 16 16V352z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="relative w-4 h-4 text-token-text-purple" style=\'top:-2px\' fill="currentColor"><path d="M63.1 351.1c0 35.25 28.75 63.1 63.1 63.1h95.1v83.99c0 9.749 11.25 15.45 19.12 9.7l124.9-93.69l39.37-.0117L63.1 146.9L63.1 351.1zM630.8 469.1l-82.76-64.87c16.77-11.47 27.95-30.46 27.95-52.27V63.1c0-35.25-28.75-63.1-63.1-63.1H127.1c-23.51 0-43.97 12.88-55.07 31.86L38.81 5.128C34.41 1.691 29.19 .0332 24.03 .0332c-7.125 0-14.2 3.137-18.92 9.168c-8.187 10.44-6.365 25.53 4.073 33.7l591.1 463.1c10.5 8.202 25.57 6.333 33.7-4.073C643.1 492.4 641.2 477.3 630.8 469.1z"/></svg>';
  conversationElement.innerHTML = conversationElementIcon;
  const conversationTitle = document.createElement('div');
  conversationTitle.id = `conversation-title-${conversation.id}`;
  conversationTitle.classList = 'flex-1 overflow-hidden text-ellipsis whitespace-nowrap max-h-5 break-all relative text-token-text-primary';
  conversationTitle.style = 'position: relative; bottom: 5px;';
  conversationTitle.innerHTML = conversation.title || 'Novo chat';
  conversationElement.title = conversation.title || 'Novo chat';
  conversationElement.appendChild(conversationTitle);
  // add timestamp
  const timestampElement = document.createElement('div');
  timestampElement.id = 'timestamp';
  timestampElement.classList.add('text-token-text-secondary');
  timestampElement.style = 'display:flex; align-items:center;font-size: 10px; position: absolute; bottom: 0px; left: 40px;';
  const timestamp = conversation.update_time !== 'force_copy'
    ? new Date(formatTime(conversation.update_time))
    : new Date(formatTime(conversation.create_time));
  const conversationLastTimestamp = formatDate(new Date(timestamp));

  timestampElement.innerHTML = conversationLastTimestamp;

  conversationElement.appendChild(timestampElement);
  // action icons
  conversationElement.appendChild(conversationActions(conversation.id));
  // add checkbox
  addCheckboxToConversationElement(conversationElement, conversation);
  return conversationElement;
}
function conversationActions(conversationId) {
  const actionsWrapper = document.createElement('div');
  actionsWrapper.id = `actions-wrapper-${conversationId}`;
  const visibleCheckboxes = document.querySelectorAll('#conversation-list input[type="checkbox"]:checked');
  actionsWrapper.classList = `absolute flex right-3 z-10 text-gray-300 invisible ${visibleCheckboxes.length > 0 ? '' : 'group-hover:visible'}`;
  const conversationElementMenuButton = document.createElement('button');
  conversationElementMenuButton.classList = 'p-1 text-token-text-primary';
  conversationElementMenuButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path></svg>';
  conversationElementMenuButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenus();
    showConversationElementMenu(e, conversationId);
  });

  actionsWrapper.appendChild(conversationElementMenuButton);
  return actionsWrapper;
}

function addCheckboxToConversationElement(conversationElement, conversation) {
  chrome.storage.local.get(['selectedConversations'], (result) => {
    const selectedConvs = result.selectedConversations;
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.style = 'position: absolute; top: 0px; left: 0px; z-index:10; display:none;cursor: pointer;width:40px;height: 100%;border:none;border-radius:6px;';
    checkboxWrapper.id = `checkbox-wrapper-${conversation.id}`;
    checkboxWrapper.addEventListener('click', (event) => {
      event.stopPropagation();
      const checkbox = conversationElement.querySelector('#checkbox');
      if (!checkbox) return;
      if (event.shiftKey) {
        shiftKeyPressed = true;
      }
      checkbox.click();
    });
    conversationElement.appendChild(checkboxWrapper);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'checkbox';
    checkbox.style = 'position: absolute; top: 12px; left: 12px; z-index:11; cursor: pointer;border-radius:2px;';
    checkbox.checked = false;
    checkboxWrapper.appendChild(checkbox);
    if (selectedConvs?.length > 0) {
      checkboxWrapper.style.display = 'block';
      checkboxWrapper.style.width = '100%';
      if (selectedConvs.map((c) => c?.id).includes(conversation.id)) {
        checkbox.checked = true;
      }
    }

    checkbox.addEventListener('click', (event) => {
      event.stopPropagation();
      chrome.storage.local.get(['conversationsOrder', 'lastSelectedConversation', 'conversations', 'settings', 'selectedConversations'], (res) => {
        const {
          conversationsOrder, lastSelectedConversation, selectedConversations, conversations, settings,
        } = res;
        // uncheck
        if (!event.target.checked) {
          const newSelectedConversations = selectedConversations.filter((conv) => conv?.id !== conversation.id);
          chrome.storage.local.set({ selectedConversations: newSelectedConversations }, () => {
            if (newSelectedConversations.length === 0) {
              hideAllButLastCheckboxes(conversation.id);
              // select-action-button
              const selectActionButton = document.querySelector('#select-action-button');
              selectActionButton.style.outline = '';
              // enable menu buttons
              const actionsWrappers = document.querySelectorAll('#conversation-list [id^=actions-wrapper-]');
              actionsWrappers.forEach((aw) => {
                aw.classList.add('group-hover:visible');
              });
            }
            updateButtonsAfterSelection(newSelectedConversations);
          });
        }
        // single check
        if (event.target.checked && ((!event.shiftKey && !shiftKeyPressed) || selectedConversations.length === 0)) {
          const newSelectedConversations = [...selectedConversations, conversation];

          chrome.storage.local.set({
            selectedConversations: newSelectedConversations,
            lastSelectedConversation: conversation,
          }, () => {
            if (newSelectedConversations.length === 1) {
              showAllCheckboxes();
            }
            if (settings.hideBottomSidebar && settings.multiSelectIndicator) {
              document.querySelector('#expand-sidebar-bottom-button')?.click();
            }
            // select-action-button
            const selectActionButton = document.querySelector('#select-action-button');
            selectActionButton.style.outline = 'solid 1px gold';
            selectActionButton.classList.add('animate-flash');
            setTimeout(() => {
              selectActionButton.classList.remove('animate-flash');
            }, 1000);
            // disable menu buttons
            const actionsWrappers = document.querySelectorAll('#conversation-list [id^=actions-wrapper-]');
            actionsWrappers.forEach((aw) => {
              aw.classList.remove('group-hover:visible');
            });
            updateButtonsAfterSelection(newSelectedConversations);
          });
        }
        // shift check
        if (event.target.checked && (event.shiftKey || shiftKeyPressed) && selectedConversations.length > 0) {
          shiftKeyPressed = false;
          // flash select action button
          const newSelectedConversations = [...selectedConversations, conversation];
          const selectActionButton = document.querySelector('#select-action-button');
          selectActionButton.classList.add('animate-flash');
          setTimeout(() => {
            selectActionButton.classList.remove('animate-flash');
          }, 1000);

          if (lastSelectedConversation) {
            // find last conversation index in conversationsOrder
            let lastConversationIndex = conversationsOrder.findIndex((c) => c === lastSelectedConversation.id);
            let newConversationIndex = conversationsOrder.findIndex((c) => c === conversation.id);

            if (lastConversationIndex === -1 || newConversationIndex === -1) {
              const folderConatainingLastConversation = conversationsOrder.find((f) => f.conversationIds?.find((cid) => cid === lastSelectedConversation.id));

              const folderConatainingNewConversation = conversationsOrder.find((f) => f.conversationIds?.find((cid) => cid === conversation.id));

              if (folderConatainingLastConversation?.id === folderConatainingNewConversation?.id) {
                lastConversationIndex = folderConatainingLastConversation?.conversationIds?.findIndex((cid) => cid === lastSelectedConversation.id);
                newConversationIndex = folderConatainingNewConversation?.conversationIds?.findIndex((cid) => cid === conversation.id);
                const conversationsToSelect = folderConatainingLastConversation.conversationIds?.slice(Math.min(lastConversationIndex, newConversationIndex) + 1, Math.max(lastConversationIndex, newConversationIndex)).filter((f) => typeof f === 'string');

                // click on the new conversation to select it
                conversationsToSelect.forEach((cid) => {
                  if (!selectedConversations.map((c) => c?.id).includes(cid)) {
                    newSelectedConversations.push(conversations[cid]);
                  }
                  const convElement = document.querySelector(`#checkbox-wrapper-${cid}`);

                  if (convElement && !convElement.querySelector('#checkbox').checked) {
                    convElement.querySelector('#checkbox').checked = true;
                  }
                });
              }
            } else {
              // select all conversations between the last selected and the current one
              const conversationsToSelect = conversationsOrder?.slice(Math.min(lastConversationIndex, newConversationIndex) + 1, Math.max(lastConversationIndex, newConversationIndex)).filter((f) => typeof f === 'string');

              // click on the new conversation to select it
              conversationsToSelect.forEach((cid) => {
                if (!selectedConversations.map((c) => c?.id).includes(cid)) {
                  newSelectedConversations.push(conversations[cid]);
                }
                const convElement = document.querySelector(`#checkbox-wrapper-${cid}`);

                if (convElement && !convElement.querySelector('#checkbox').checked) {
                  convElement.querySelector('#checkbox').checked = true;
                }
              });
            }
            chrome.storage.local.set({ selectedConversations: newSelectedConversations });
            updateButtonsAfterSelection(newSelectedConversations);
          }
          chrome.storage.local.set({ lastSelectedConversation: conversation });
        }
      });
    });

    conversationElement.addEventListener('mouseenter', () => {
      checkboxWrapper.style.display = 'block';
    });
    conversationElement.addEventListener('mouseleave', () => {
      const conversationList = document.querySelector('#conversation-list');
      const selectedConversations = conversationList.querySelectorAll('input[type="checkbox"]:checked');
      if (selectedConversations.length === 0) {
        checkboxWrapper.style.display = 'none';
      }
    });
  });
}
