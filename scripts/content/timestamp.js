/* global ChatGPTIcon, hideAllButLastCheckboxes,  showAllCheckboxes, getAllConversations, formatTime, updateButtonsAfterSelection, formatDate, shiftKeyPressed: true */

function updateTimestamp(conversationList) {
  if (!conversationList) return;
  const chatButtons = conversationList.querySelectorAll('a');
  chrome.storage.local.get(['selectedConversations'], (result) => {
    const selectedConvs = result.selectedConversations;
    getAllConversations().then((conversations) => {
      if (Object.keys(conversations).length === 0) return;
      chatButtons.forEach((button, index) => {
        const existingTimestamp = button.querySelector('#timestamp');
        if (!existingTimestamp) {
          button.classList = 'flex p-3 items-center gap-3 relative rounded-md hover:bg-gray-100 dark:hover:bg-[#2A2B32] cursor-pointer break-all bg-gray-50 gizmo:bg-white gizmo:hover:bg-gray-100 hover:pr-4 dark:bg-black group';
          button.style = 'padding: 0.75rem !important; gap: 0.75rem !important;';
          // prepen svg html to button
          const bubbleIcon = '<svg class="text-token-text-primary" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
          button.insertAdjacentHTML('afterbegin', bubbleIcon);
          // button first div child
          const chatTitle = button.querySelector('div');
          chatTitle.classList = 'flex-1 text-ellipsis max-h-5 overflow-hidden whitespace-nowrap break-all relative';
          if (chatTitle) {
            chatTitle.style = `${chatTitle?.style?.cssText} position: relative; bottom: 5px;`;
          }
          const timestamp = document.createElement('div');
          timestamp.id = 'timestamp';
          timestamp.style = 'font-size: 10px; color: lightslategray; position: absolute; bottom: 0px; left: 40px;';
          const conversation = conversations[index];
          if (!conversation) return;
          button.id = `conversation-button-${conversation.id}`;
          const updateTime = formatTime(conversation.update_time);
          // convert create time from GMT to local time
          timestamp.innerHTML = formatDate(new Date(updateTime));
          button.appendChild(timestamp);
          // add checkbox
          const checkboxWrapper = document.createElement('div');
          checkboxWrapper.style = 'position: absolute; top: 0px; left: 0px; z-index:10; display:none;cursor: pointer;width:40px;height: 100%;';
          checkboxWrapper.id = `checkbox-wrapper-${conversation.id}`;
          checkboxWrapper.addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
            const checkbox = button.querySelector('#checkbox');
            if (!checkbox) return;
            if (event.shiftKey) {
              shiftKeyPressed = true;
            }
            checkbox.click();
          });
          button.appendChild(checkboxWrapper);

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = 'checkbox';
          checkbox.style = 'position: absolute; top: 12px; left: 12px; z-index:11; cursor: pointer;';
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
            chrome.storage.local.get(['lastSelectedConversation', 'selectedConversations'], (res) => {
              const { lastSelectedConversation, selectedConversations } = res;
              if (!event.target.checked) {
                const newSelectedConversations = selectedConversations.filter((conv) => conv?.id !== conversation.id);
                chrome.storage.local.set({ selectedConversations: newSelectedConversations }, () => {
                  if (newSelectedConversations.length === 0) {
                    hideAllButLastCheckboxes(conversation.id);
                  }
                  updateButtonsAfterSelection(newSelectedConversations);
                });
              }
              if (event.target.checked && ((!event.shiftKey && !shiftKeyPressed) || selectedConversations.length === 0)) {
                const newSelectedConversations = [...selectedConversations, conversation];

                chrome.storage.local.set({
                  selectedConversations: newSelectedConversations,
                  lastSelectedConversation: conversation,
                }, () => {
                  if (newSelectedConversations.length === 1) {
                    showAllCheckboxes();
                  }
                  updateButtonsAfterSelection(newSelectedConversations);
                });
              }
              if (event.target.checked && (event.shiftKey || shiftKeyPressed) && selectedConversations.length > 0) {
                shiftKeyPressed = false;
                const newSelectedConversations = [...selectedConversations, conversation];
                const conversationsOrder = Array.from(conversationList.querySelectorAll('[id^=checkbox-wrapper-]')).map((c) => c?.id.split('checkbox-wrapper-')[1]);

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
                        const conv = Object.values(conversations).find((c) => c.id === cid);
                        if (!selectedConversations.map((c) => c?.id).includes(cid)) {
                          newSelectedConversations.push(conv);
                        }
                        const convElement = document.querySelector(`#checkbox-wrapper-${cid}`);

                        if (convElement && !convElement.querySelector('#checkbox').checked) {
                          convElement.querySelector('#checkbox').checked = true;
                        }
                      });
                    }
                  } else {
                    // select all conversations between the last selected and the current one
                    const conversationsToSelect = conversationsOrder.slice(Math.min(lastConversationIndex, newConversationIndex) + 1, Math.max(lastConversationIndex, newConversationIndex)).filter((f) => typeof f === 'string');

                    // click on the new conversation to select it
                    conversationsToSelect.forEach((cid) => {
                      const conv = Object.values(conversations).find((c) => c.id === cid);

                      if (!selectedConversations.map((c) => c?.id).includes(cid)) {
                        newSelectedConversations.push(conv);
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
          // const svg = button.querySelector('svg');
          // if (svg) {
          //   button.insertBefore(checkbox, svg);
          // }
          button.addEventListener('mouseenter', () => {
            checkboxWrapper.style.display = 'block';
          });
          button.addEventListener('mouseleave', () => {
            const curConversationList = document.querySelector('#conversation-list');
            const selectedConversations = curConversationList.querySelectorAll('input[type="checkbox"]:checked');
            if (selectedConversations.length === 0) {
              checkboxWrapper.style.display = 'none';
            }
          });
          // disable double click on button
          button.addEventListener('dblclick', (event) => {
            event.stopPropagation();
            event.preventDefault();
          });
        }
      });
    }, () => {
      // console.error(error);
    });
  });
}

function addTimestamp() {
  const conversationList = document.querySelector('#conversation-list');
  updateTimestamp(conversationList);
  const observer = new MutationObserver(() => {
    updateTimestamp(conversationList);
  });
  observer.observe(conversationList, { childList: true });
}
// eslint-disable-next-line no-unused-vars
function initializeTimestamp() {
  chrome.storage.local.get(['selectedConversations'], (result) => {
    const newChatButton = document.querySelector('#nav-gap').querySelector('a');
    if (!newChatButton) return;
    if (result.selectedConversations?.length > 0) {
      newChatButton.innerHTML = '<div class="h-7 w-7 flex-shrink-0"><div class="gizmo-shadow-stroke relative flex h-full items-center justify-center rounded-full bg-white text-black"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div></div>Limpar Seleção';
    } else {
      newChatButton.innerHTML = ChatGPTIcon();
    }
  });
  addTimestamp();
}
