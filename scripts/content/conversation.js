/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-unused-vars
/* global TurndownService, conversationSettingsMenu, addConversationSettingsMenuEventListener, submitChat, openSubmitPromptModal, showHideTextAreaElement, rowAssistant, rowUser, copyRichText, messageFeedback, openFeedbackModal, initializeStopGeneratingResponseButton, generateInstructions, isGenerating:true, scrolUpDetected:true, addScrollDetector, languageList, writingStyleList, toneList, arkoseTrigger, createFullSizeFileWrapper, addFullSizeFileWrapperEventListener, addUploadFileButton, getMousePosition, renderAllDalleImages, getGizmoById, initializeNavbar, replacePageContent, replaceTextAreaElemet, addFinalCompletionClassToLastMessageWrapper, highlightSearch, getGizmoUserActionSettings, actionAllowedRenderer, actionDeniedRenderer, updateLastMessagePluginDropdown, initializeAutoSave, renderAllPythonImages, getDownloadUrlFromFileId, getDownloadUrlFromSandBoxPath, toast, downloadFileFrmoUrl */

function showCustomInstructionTooltip(event, aboutUser, aboutModel) {
  const { x, y } = getMousePosition(event);
  const translateX = Math.min(x - 225, window.innerWidth - 450);
  const translateY = y + 10;
  return `<div id="custom-instruction-tooltip" data-radix-popper-content-wrapper="" style="position: fixed; left: 0px; top: 0px; transform: translate3d(${translateX}px, ${translateY}px, 0px); min-width: max-content; z-index: auto; --radix-popper-anchor-width: 20px; --radix-popper-anchor-height: 22px; --radix-popper-available-width: 891.59375px; --radix-popper-available-height: 905px; --radix-popper-transform-origin: 50% 0px;"><div data-side="bottom" data-align="center" data-state="open" role="dialog" id="radix-:r2f:" class="relative max-h-[450px] animate-slideDownAndFade select-none overflow-y-auto whitespace-pre-line rounded-xl border-gray-100 bg-white p-4 text-sm text-gray-600 shadow-xs dark:bg-gray-900 dark:text-white sm:max-w-lg md:max-w-xl" tabindex="-1" style="min-width:450px; max-width: 450px; --radix-popover-content-transform-origin: var(--radix-popper-transform-origin); --radix-popover-content-available-width: var(--radix-popper-available-width); --radix-popover-content-available-height: var(--radix-popper-available-height); --radix-popover-trigger-width: var(--radix-popper-anchor-width); --radix-popover-trigger-height: var(--radix-popper-anchor-height);"><div class="mb-5 mt-1 border-b border-black/10 pb-5 dark:border-white/10"><div class="flex flex-row items-center gap-2 text-gray-500">Custom instructions are on and can only be changed at the beginning of the chat.</div></div><div class="flex flex-col gap-7"><div class="flex flex-col gap-3"><div class="font-medium text-gray-600 dark:text-gray-200">What would you like ChatGPT to know about you to provide better responses?</div><div style="user-select: text;" class="flex flex-row gap-1 text-gray-500">${aboutUser}</div></div><div class="flex flex-col gap-3"><div class="font-medium text-gray-600 dark:text-gray-200">How would you like ChatGPT to respond?</div><div style="user-select: text;" class="flex flex-row gap-1 text-gray-500">${aboutModel}</div></div></div></div></div>`;
}

function UpdatePathWithGizmoName(conversationId, gizmoId) {
  getGizmoById(gizmoId).then((gizmoData) => {
    const newGizmoPath = gizmoId ? `g/${gizmoData?.resource?.gizmo?.short_url}/` : '';
    window.history.pushState({}, '', `https://chat.openai.com/${newGizmoPath}c/${conversationId}`);
  });
}
function addPinNav(sortedNodes) {
  chrome.storage.local.get(['settings'], (res) => {
    const { settings } = res;
    const { showPinNav } = settings;
    const existingPinNav = document.querySelector('#pin-nav');
    if (existingPinNav) existingPinNav.remove();
    if (!showPinNav) return;
    const pinNav = document.createElement('div');
    pinNav.classList = 'flex flex-col items-center py-4 mr-4 absolute right-0 top-0 z-50 justify-center overflow-y-scroll';
    pinNav.style = 'height:calc(100vh - 56px);';
    pinNav.id = 'pin-nav';
    sortedNodes.forEach((node) => {
      const { id, pinned } = node;
      if (!pinned) return;
      const pin = document.createElement('button');
      pin.style = 'background-color: transparent; border: none; cursor: pointer;width:100%;width: 18px; margin-bottom:4px;transition: width 0.2s ease-in-out;';
      pin.id = `pin-nav-item-${id}`;
      pin.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="gold" d="M48 0H336C362.5 0 384 21.49 384 48V487.7C384 501.1 373.1 512 359.7 512C354.7 512 349.8 510.5 345.7 507.6L192 400L38.28 507.6C34.19 510.5 29.32 512 24.33 512C10.89 512 0 501.1 0 487.7V48C0 21.49 21.49 0 48 0z"/></svg>';
      pin.addEventListener('click', () => {
        const messageWrapper = document.querySelector(`#message-wrapper-${id}`);
        messageWrapper.scrollIntoView({ behavior: 'smooth' });
      });
      pinNav.appendChild(pin);
      const messagePinButton = document.querySelector(`#message-pin-button-${id}`);
      observePinButton(messagePinButton);
    });
    const main = document.querySelector('main');

    main.appendChild(pinNav);
  });
}
function loadConversationFromNode(conversationId, newMessageId, oldMessageId, searchValue = '') {
  chrome.storage.sync.get(['name', 'avatar'], (result) => {
    chrome.storage.local.get(['conversations', 'settings', 'models'], (res) => {
      const fullConversation = res.conversations?.[conversationId];
      getGizmoById(fullConversation.gizmo_id).then((gizmoData) => {
        const { settings } = res;

        let currentNode = fullConversation.mapping[newMessageId];
        const sortedNodes = [];
        while (currentNode) {
          const parentId = currentNode.parent;
          const parent = fullConversation.mapping[parentId];
          const siblings = parent.children;
          const curNodeIndex = siblings.findIndex((id) => id === newMessageId);// only for the first node
          const threadIndex = curNodeIndex === -1 ? 1 : curNodeIndex + 1;
          const threadCount = siblings.length;
          sortedNodes.push({ ...currentNode, threadIndex, threadCount });
          currentNode = fullConversation.mapping[currentNode.children[0]];
        }

        let messageDiv = '';
        for (let i = 0; i < sortedNodes.length; i += 1) {
          const { message, threadCount, threadIndex } = sortedNodes[i];
          // eslint-disable-next-line no-continue
          if (!message) continue;
          const role = message.role || message.author?.role;
          if (!role || role === 'system') continue;
          if (role === 'user') {
            messageDiv += rowUser(fullConversation, sortedNodes[i], threadIndex, threadCount, result.name, result.avatar, settings);
          } else {
            const assistantNodes = [sortedNodes[i]];
            let nextMessage = sortedNodes[i + 1]?.message;
            while (nextMessage && nextMessage.role !== 'user' && nextMessage.author?.role !== 'user') {
              assistantNodes.push(sortedNodes[i + 1]);
              // message.content.parts = message.content.parts.concat(nextMessage.content.parts);
              i += 1;
              nextMessage = sortedNodes[i + 1]?.message;
            }
            // sortedNodes[i].message = message;
            messageDiv += rowAssistant(fullConversation, assistantNodes, threadIndex, threadCount, res.models, settings, gizmoData, false);
          }
        }
        const conversationBottom = document.querySelector('#conversation-bottom');

        const messageWrapper = document.querySelector(`#message-wrapper-${oldMessageId}`);
        while (messageWrapper.nextElementSibling && messageWrapper.nextElementSibling.id.startsWith('message-wrapper-')) {
          messageWrapper.nextElementSibling.remove();
        }
        messageWrapper.remove();

        // inser messageDiv html above conversation bottom
        conversationBottom.insertAdjacentHTML('beforebegin', messageDiv);
        if (searchValue) {
          const conversationInnerDiv = document.querySelector('#conversation-inner-div');
          const conversationTopTitle = document.querySelector('#conversation-top-title');
          highlightSearch([conversationTopTitle, conversationInnerDiv], searchValue);
        }
        addFinalCompletionClassToLastMessageWrapper();
        renderAllDalleImages(fullConversation);
        renderAllPythonImages(fullConversation);
        showHideTextAreaElement();
        addConversationsEventListeners(fullConversation.id);
        initializeStopGeneratingResponseButton();
        addPinNav(sortedNodes);
        initializeNavbar(fullConversation);
        updateTotalCounter();
      });
    });
  });
}

// eslint-disable-next-line no-unused-vars
function loadConversation(conversationId, searchValue = '', focusOnInput = true) {
  //  = true;
  const suggestionsWrapper = document.querySelector('#suggestions-wrapper');
  if (suggestionsWrapper) suggestionsWrapper.remove();
  scrolUpDetected = false;
  chrome.runtime.sendMessage({
    checkHasSubscription: true,
    detail: {
      forceRefresh: false,
    },
  }, (hasSubscription) => {
    chrome.storage.sync.get(['name', 'avatar'], (result) => {
      chrome.storage.local.get(['conversationsOrder', 'conversations', 'settings', 'models'], (res) => {
        const fullConversation = res.conversations?.[conversationId];
        getGizmoById(fullConversation.gizmo_id).then((gizmoData) => {
          const { settings, conversationsOrder } = res;
          // remove fileWrapperElement
          const fileWrapperElement = document.querySelector('main form #file-wrapper-element');
          if (fileWrapperElement) {
            fileWrapperElement.remove();
          }
          const folderConatainingConversation = conversationsOrder.find((folder) => folder?.conversationIds?.includes(conversationId));
          let folderName = '';
          if (folderConatainingConversation) {
            folderName = folderConatainingConversation.name;
          }
          // set page title meta to fullConversation.title
          document.title = fullConversation.title || 'New chat';
          if (fullConversation.gizmo_id) {
            UpdatePathWithGizmoName(fullConversation.id, fullConversation.gizmo_id);
          }
          if (!fullConversation || !fullConversation?.current_node) return;
          const main = document.querySelector('main');
          main.style.position = 'relative';
          const outerDiv = document.createElement('div');
          outerDiv.classList = 'flex-1 overflow-hidden';
          const innerDiv = document.createElement('div');
          innerDiv.classList = 'h-full overflow-y-auto';
          innerDiv.id = 'conversation-inner-div';
          addScrollDetector(innerDiv);
          const conversationDiv = document.createElement('div');
          conversationDiv.classList = 'flex flex-col items-center text-sm h-full dark:bg-gray-800';
          //--------
          // traverse up the current node to get all the parent nodes
          const sortedNodes = [];
          let currentNodeId = fullConversation.current_node;

          while (currentNodeId) {
            const currentNode = fullConversation.mapping[currentNodeId];
            if (!currentNode) {
              initializeAutoSave(false, fullConversation.id);
              break;
            }
            const parentId = currentNode.parent;
            const parent = parentId ? fullConversation.mapping[parentId] : null;
            const siblings = parent ? parent.children : [];

            // eslint-disable-next-line no-loop-func
            const currentNodeIndex = siblings.findIndex((id) => currentNodeId === id);

            const threadIndex = currentNodeIndex === -1 ? siblings.length : currentNodeIndex + 1;
            const threadCount = siblings.length;
            sortedNodes.push({ ...currentNode, threadIndex, threadCount });
            currentNodeId = parentId;
          }
          sortedNodes.reverse();
          //--------
          // find last system message
          const systemMessage = [...sortedNodes].reverse().find((node) => node?.message?.role === 'system' || node?.message?.author?.role === 'system');
          const customInstrucionProfile = systemMessage?.message?.metadata?.user_context_message_data || undefined;

          let messageDiv = `<div id="conversation-top" class="w-full flex relative items-center justify-center border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]" style="min-height:56px;"><span id="conversation-top-title" class="flex">${folderName ? `<strong>${folderName}  &nbsp;&nbsp;&nbsp;› &nbsp;&nbsp;&nbsp;</strong>` : ''}${fullConversation.title}${customInstrucionProfile ? '<span id="custom-instruction-info-icon" style="display:flex;">&nbsp;&nbsp;<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" class="ml-0.5 mt-0.5 h-4 w-4 flex-shrink-0 text-gray-600 dark:text-gray-200 sm:mb-0.5 sm:mt-0 sm:h-5 sm:w-5"><path d="M8.4375 8.4375L8.46825 8.4225C8.56442 8.37445 8.67235 8.35497 8.77925 8.36637C8.88615 8.37776 8.98755 8.41955 9.07143 8.48678C9.15532 8.55402 9.21818 8.64388 9.25257 8.74574C9.28697 8.8476 9.29145 8.95717 9.2655 9.0615L8.7345 11.1885C8.70836 11.2929 8.7127 11.4026 8.74702 11.5045C8.78133 11.6065 8.84418 11.6965 8.9281 11.7639C9.01202 11.8312 9.1135 11.8731 9.2205 11.8845C9.32749 11.8959 9.43551 11.8764 9.53175 11.8282L9.5625 11.8125M15.75 9C15.75 9.88642 15.5754 10.7642 15.2362 11.5831C14.897 12.4021 14.3998 13.1462 13.773 13.773C13.1462 14.3998 12.4021 14.897 11.5831 15.2362C10.7642 15.5754 9.88642 15.75 9 15.75C8.11358 15.75 7.23583 15.5754 6.41689 15.2362C5.59794 14.897 4.85382 14.3998 4.22703 13.773C3.60023 13.1462 3.10303 12.4021 2.76381 11.5831C2.42459 10.7642 2.25 9.88642 2.25 9C2.25 7.20979 2.96116 5.4929 4.22703 4.22703C5.4929 2.96116 7.20979 2.25 9 2.25C10.7902 2.25 12.5071 2.96116 13.773 4.22703C15.0388 5.4929 15.75 7.20979 15.75 9ZM9 6.1875H9.006V6.1935H9V6.1875Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>' : ''}</span>${conversationSettingsMenu(fullConversation, hasSubscription)}</div>`;
          if (fullConversation.archived) {
            messageDiv = '<div id="conversation-top"></div><div style="display: flex; align-items: center; justify-content: center; min-height: 56px; width: 100%; color:white; background-color: #ff0000; position: sticky; top: 0; z-index: 1000;">This is an archived chat. You can read archived chats, but you cannot continue them.</div>';
          }

          messageDiv.id = 'conversation-wrapper';
          for (let i = 0; i < sortedNodes.length; i += 1) {
            const { message, threadCount, threadIndex } = sortedNodes[i];
            // eslint-disable-next-line no-continue
            if (!message) continue;
            const role = message.role || message.author?.role;
            if (!role || role === 'system') continue;
            if (role === 'user') {
              messageDiv += rowUser(fullConversation, sortedNodes[i], threadIndex, threadCount, result.name, result.avatar, settings);
            } else {
              const assistantNodes = [sortedNodes[i]];
              let nextMessage = sortedNodes[i + 1]?.message;
              while (nextMessage && nextMessage.role !== 'user' && nextMessage.author?.role !== 'user') {
                assistantNodes.push(sortedNodes[i + 1]);
                // message.content.parts.push(...nextMessage.content.parts);
                i += 1;
                nextMessage = sortedNodes[i + 1]?.message;
              }
              // sortedNodes[i].message = message;
              messageDiv += rowAssistant(fullConversation, assistantNodes, threadIndex, threadCount, res.models, settings, gizmoData, false);
            }
          }
          conversationDiv.innerHTML = messageDiv;
          const bottomDiv = document.createElement('div');
          bottomDiv.id = 'conversation-bottom';
          bottomDiv.classList = 'w-full h-32 md:h-48 flex-shrink-0';
          conversationDiv.appendChild(bottomDiv);
          const bottomDivContent = document.createElement('div');
          bottomDivContent.classList = 'relative text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl flex lg:px-0';
          if (settings.customConversationWidth) {
            bottomDivContent.style.maxWidth = `${settings.conversationWidth}%`;
          }
          bottomDiv.appendChild(bottomDivContent);
          const totalCounter = document.createElement('div');
          totalCounter.id = 'total-counter';
          totalCounter.style = 'position: absolute; top: 0px; right: 0px; font-size: 10px; color: rgb(153, 153, 153); opacity: 0.8;';
          bottomDivContent.appendChild(totalCounter);
          innerDiv.appendChild(conversationDiv);
          outerDiv.appendChild(innerDiv);
          replacePageContent(innerDiv);
          if (searchValue) {
            // const get conversationList node
            const conversationTopTitle = document.querySelector('#conversation-top-title');
            highlightSearch([conversationTopTitle, conversationDiv], searchValue);
          }
          let textAreaElement = document.querySelector('main form textarea');
          if (!textAreaElement) {
            replaceTextAreaElemet(settings);
            textAreaElement = document.querySelector('main form textarea');
          }
          // has to be before scrollIntoView to render the images first
          renderAllDalleImages(fullConversation);
          renderAllPythonImages(fullConversation);

          if (!searchValue) {
            if (focusOnInput) {
              if (textAreaElement) {
                textAreaElement.focus();
                const tempVal = textAreaElement.value;
                textAreaElement.value = '';
                textAreaElement.value = tempVal;
              }
            }
            innerDiv.scrollTop = innerDiv.scrollHeight;
            innerDiv.style = 'scroll-behavior: smooth;';
          }
          addFinalCompletionClassToLastMessageWrapper();
          showHideTextAreaElement();
          addConversationsEventListeners(fullConversation.id);
          addConversationSettingsMenuEventListener(fullConversation.id);
          initializeStopGeneratingResponseButton();
          addPinNav(sortedNodes);
          initializeNavbar(fullConversation);
          updateTotalCounter();
          if (fullConversation.gizmo_id) {
            getGizmoUserActionSettings(fullConversation.gizmo_id, true);
          }
          if (settings.autoClick) {
            document.querySelector('#auto-click-button').click();
          }
        });
      });
    });
  });
}

function updateTotalCounter() {
  const totalCounterElement = document.querySelector('#total-counter');
  if (!totalCounterElement) return;
  const allMessages = document.querySelectorAll('[id^=message-text-]');
  // add the total number of words  and characters
  let totalWords = 0;
  let totalCharacters = 0;
  allMessages.forEach((message) => {
    const text = message.innerText;
    const words = text.split(/[ /]/);

    totalWords += words.length;
    totalCharacters += text.replace(/\n/g, '').length;
  });
  totalCounterElement.innerHTML = `Total: ${totalCharacters} chars / ${totalWords} words`;
}
function addCopyCodeButtonsEventListeners() {
  const copyCodeButtons = document.querySelectorAll('[id="copy-code"][data-initialized="false"]');

  copyCodeButtons.forEach((btn) => {
    // clear existing event listeners
    const button = btn.cloneNode(true);
    button.dataset.initialized = true;
    btn.parentNode.replaceChild(button, btn);
    button.addEventListener('click', () => {
      // get closest code element
      const code = button.closest('pre').querySelector('code');
      navigator.clipboard.writeText(code.innerText);
      button.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>Copied!';
      setTimeout(
        () => {
          button.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>Copy code';
        },
        1500,
      );
    });
  });
}
function addConversationsEventListeners(conversationId, onlyUpdateLastMessage = false) {
  const lastMessageWrapper = [...document.querySelectorAll('[id^="message-wrapper-"]')].pop();
  let messageEditButtons = document.querySelectorAll('[id^="message-edit-button-"]');
  let addToLibraryButtons = document.querySelectorAll('[id^="message-add-to-library-button-"]');
  let thumbsUpButtons = document.querySelectorAll('[id^="thumbs-up-button"]');
  let thumbsDownButtons = document.querySelectorAll('[id^="thumbs-down-button"]');
  let resultCopyButtons = document.querySelectorAll('[id^="result-copy-button-"]');
  let threadPrevButtons = document.querySelectorAll('[id^="thread-prev-button-"]');
  let threadNextButtons = document.querySelectorAll('[id^="thread-next-button-"]');
  let messagePinButtons = document.querySelectorAll('[id^="message-pin-button-"]');
  let regenerateResponseButtons = document.querySelectorAll('[id^="message-regenerate-button-"]');
  let continueButtons = document.querySelectorAll('[id^="message-continue-button-"]');
  let assetButtons = document.querySelectorAll('[id^="asset-"]');
  let messagePluginToggleButtons = document.querySelectorAll('[id^="message-plugin-toggle-"]');
  // all a element with href starting with sandbox
  let sandboxLinks = document.querySelectorAll('a[href^="sandbox:/"]');
  // get all a tags inside role=presentation
  let citations = document.querySelector('main').querySelectorAll('div[role="presentation"] a');
  const toolActionRequestAllowButtons = document.querySelectorAll('[id^="tool-action-request-allow-"]');
  const toolActionRequestDenyButtons = document.querySelectorAll('[id^="tool-action-request-deny-"]');
  const toolActionRequestOauthButtons = document.querySelectorAll('[id^="tool-action-request-oauth-"]');
  const customInstructionInfoIcon = document.querySelector('#custom-instruction-info-icon');
  if (onlyUpdateLastMessage) {
    messageEditButtons = Array.from(messageEditButtons).slice(-1);
    addToLibraryButtons = Array.from(addToLibraryButtons).slice(-1);
    thumbsUpButtons = Array.from(thumbsUpButtons).slice(-1);
    thumbsDownButtons = Array.from(thumbsDownButtons).slice(-1);
    resultCopyButtons = Array.from(resultCopyButtons).slice(-1);
    // start - last 2 buttons for thread buttons
    threadPrevButtons = Array.from(threadPrevButtons).slice(-2);
    threadNextButtons = Array.from(threadNextButtons).slice(-2);
    assetButtons = Array.from(assetButtons).slice(-2);
    messagePinButtons = Array.from(messagePinButtons).slice(-2);
    // end - last 2 buttons for thread buttons
    messagePluginToggleButtons = lastMessageWrapper?.querySelectorAll('[id^="message-plugin-toggle-"]');
    citations = lastMessageWrapper?.querySelectorAll('a');
    sandboxLinks = lastMessageWrapper?.querySelectorAll('a[href^="sandbox:/"]');
    regenerateResponseButtons = Array.from(regenerateResponseButtons).slice(-1);
    continueButtons = Array.from(continueButtons).slice(-1);
  }
  if (customInstructionInfoIcon) {
    addCustomInstructionInfoIconEventListener(conversationId, customInstructionInfoIcon);
  }
  addCopyCodeButtonsEventListeners();
  messageEditButtons.forEach((btn) => {
    // clear existing event listeners
    const button = btn.cloneNode(true);
    btn.parentNode.replaceChild(button, btn);
    button.addEventListener('click', () => {
      const messageId = button.id.split('message-edit-button-').pop();
      const messageEditWrapper = document.querySelector(`#message-edit-wrapper-${messageId}`);
      // hide messageEditWrapper
      messageEditWrapper.style.display = 'none';
      const existingActionDiv = document.querySelector(`#action-div-${messageId}`);
      if (existingActionDiv) return;
      const messageReplyToPreview = document.querySelector(`#message-reply-to-preview-${messageId}`);
      if (messageReplyToPreview) messageReplyToPreview.style.display = 'none';
      const oldElement = document.querySelector(`#message-text-${messageId}`);
      const userInput = oldElement.innerText;
      const textArea = document.createElement('textarea');
      textArea.classList = 'm-0 resize-none border-0 bg-transparent p-0 focus:ring-0 focus-visible:ring-0';
      textArea.style = `height: ${oldElement.offsetHeight}px; overflow-y: hidden;`;
      textArea.value = userInput;
      textArea.spellcheck = false;
      textArea.id = `message-text-${messageId}`;
      textArea.addEventListener('input', (e) => {
        e.target.style.height = `${e.target.scrollHeight}px`;
      });
      oldElement.parentElement.replaceChild(textArea, oldElement);
      textArea.focus();
      const actionDiv = document.createElement('div');
      actionDiv.classList = 'text-center mt-2 flex justify-center';
      actionDiv.id = `action-div-${messageId}`;
      const saveButton = document.createElement('button');
      saveButton.classList = 'btn flex justify-center gap-2 btn-primary mr-2';
      saveButton.innerText = 'Save & Submit';
      saveButton.addEventListener('click', () => {
        messageEditWrapper.style.display = 'block';
        chrome.storage.local.get(['conversations', 'settings', 'models', 'account'], (result) => {
          const conversation = result.conversations[conversationId];
          const message = conversation.mapping[messageId];
          arkoseTrigger();
          let newMessage = textArea.value;
          // this is the right way, but OpenAI always creat a new chat even if you don't change the input, so we follow the same behavior
          // const newMessageId = newMessage !== userInput ? self.crypto.randomUUID() : messageId;
          const newMessageId = self.crypto.randomUUID();
          const newElement = document.createElement('div');
          newElement.classList = oldElement.classList;
          newElement.id = `message-text-${newMessageId}`;
          newElement.innerText = newMessage;
          textArea.parentElement.replaceChild(newElement, textArea);
          actionDiv.remove();
          // if (newMessage.trim() !== userInput.trim()) {
          const messageWrapper = document.querySelector(`#message-wrapper-${messageId}`);
          messageWrapper.id = `message-wrapper-${newMessageId}`;
          const parentId = message.parent;
          // default parentId to root message

          while (messageWrapper.nextElementSibling && messageWrapper.nextElementSibling.id.startsWith('message-wrapper-')) {
            messageWrapper.nextElementSibling.remove();
          }
          // messageWrapper.remove();
          const threadCountWrapper = messageWrapper.querySelector(`#thread-count-wrapper-${messageId}`);
          const [, childCount] = threadCountWrapper.textContent.split(' / ');
          const threadPrevButton = messageWrapper.querySelector(`#thread-prev-button-${messageId}`);
          threadPrevButton.disabled = false;
          const threadNextButton = messageWrapper.querySelector(`#thread-next-button-${messageId}`);
          threadNextButton.disabled = true;
          threadCountWrapper.innerText = `${parseInt(childCount, 10) + 1} / ${parseInt(childCount, 10) + 1}`;
          const threadButtonsWrapper = messageWrapper.querySelector(`#thread-buttons-wrapper-${messageId}`);
          if (result.settings.autoHideThreadCount) {
            threadButtonsWrapper.classList.add('group-hover:visible');
          } else {
            threadButtonsWrapper.classList.remove('invisible');
          }
          // replace messageId with newMessageId in all the children ids
          // id ends with messageId
          const children = messageWrapper.querySelectorAll(`[id$="-${messageId}"]`);
          children.forEach((child) => {
            if (!child.id) return;
            const childId = child.id.replace(messageId, newMessageId);
            child.id = childId;
          });
          // new row
          // check if original prompt has instructions, if it does, add the instruction to the prompt, otherwise, don't add it.
          const theOriginalPrompt = conversation.mapping[messageId].message.content.parts.filter((p) => typeof p === 'string').join('\n');
          // if theOriginalPrompt include (languageCode: ${selectedLanguage.code}). extract the language code
          const languageCode = theOriginalPrompt.match(/\(languageCode: (.*)\)/)?.[1];
          const toneCode = theOriginalPrompt.match(/\(toneCode: (.*)\)/)?.[1];
          const writingStyleCode = theOriginalPrompt.match(/\(writingStyleCode: (.*)\)/)?.[1];
          if (languageCode || toneCode || writingStyleCode) {
            newMessage = generateInstructions(conversation, result.settings, newMessage, true);// forceAddInstructions=true
          }
          isGenerating = true;
          submitChat(newMessage, conversation, newMessageId, parentId, result.settings, result.account, result.models);
          // }
        });
      });
      const cancelButton = document.createElement('button');
      cancelButton.classList = 'btn flex justify-center gap-2 btn-neutral';
      cancelButton.innerText = 'Cancel';
      cancelButton.addEventListener('click', () => {
        messageEditWrapper.style.display = 'block';
        // add back messageReplyToPreview
        const hiddenMessageReplyToPreview = document.querySelector(`#message-reply-to-preview-${messageId}`);
        if (hiddenMessageReplyToPreview) hiddenMessageReplyToPreview.style.display = 'block';
        textArea.parentElement.replaceChild(oldElement, textArea);
        actionDiv.remove();
      });
      actionDiv.appendChild(saveButton);
      actionDiv.appendChild(cancelButton);
      // if ESC click on cancel button
      textArea.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          cancelButton.click();
        }
      });
      textArea.parentElement.appendChild(actionDiv);
    });
  });
  addToLibraryButtons.forEach((btn) => {
    // clear existing event listeners
    const button = btn.cloneNode(true);
    btn.parentNode.replaceChild(button, btn);
    button.addEventListener('click', () => {
      const messageId = button.id.split('message-add-to-library-button-').pop();
      const messageElement = document.querySelector(`#message-text-${messageId}`);
      const userInput = messageElement.innerText || messageElement.value;
      chrome.storage.local.get(['conversations'], (result) => {
        const conversation = result.conversations[conversationId];
        const modelSlug = conversation.mapping[messageId]?.message.metadata?.model_slug || '';
        openSubmitPromptModal(userInput, modelSlug);
      });
    });
  });
  thumbsUpButtons.forEach((btn) => {
    // clear existing event listeners
    const button = btn.cloneNode(true);
    btn.parentNode.replaceChild(button, btn);
    button.addEventListener('click', () => {
      const messageId = button.id.split('thumbs-up-button-').pop();
      messageFeedback(conversationId, messageId, 'thumbsUp');
      openFeedbackModal(conversationId, messageId, 'thumbsUp');
      button.disabled = true;
      const thumbsDownButton = document.querySelector(`#thumbs-down-button-${messageId}`);
      thumbsDownButton.style.display = 'none';
    });
  });
  thumbsDownButtons.forEach((btn) => {
    // clear existing event listeners
    const button = btn.cloneNode(true);
    btn.parentNode.replaceChild(button, btn);
    button.addEventListener('click', () => {
      const messageId = button.id.split('thumbs-down-button-').pop();
      messageFeedback(conversationId, messageId, 'thumbsDown');
      openFeedbackModal(conversationId, messageId, 'thumbsDown');
      button.disabled = true;
      const thumbsUpButton = document.querySelector(`#thumbs-up-button-${messageId}`);
      thumbsUpButton.style.display = 'none';
    });
  });

  resultCopyButtons.forEach((btn) => {
    // clear existing event listeners
    const button = btn.cloneNode(true);
    btn.parentNode.replaceChild(button, btn);
    const messageId = button.id.split('result-copy-button-').pop();
    const copyMenu = document.querySelector(`#copy-result-menu-${messageId}`);
    const htmlButton = document.querySelector(`#result-html-copy-button-${messageId}`);
    const newHtmlButton = htmlButton.cloneNode(true);
    htmlButton.parentNode.replaceChild(newHtmlButton, htmlButton);
    const markdownButton = document.querySelector(`#result-markdown-copy-button-${messageId}`);
    const newMarkdownButton = markdownButton.cloneNode(true);
    markdownButton.parentNode.replaceChild(newMarkdownButton, markdownButton);

    button.addEventListener('mouseover', () => {
      copyMenu.style.display = 'block';
    });
    button.addEventListener('mouseout', () => {
      copyMenu.style.display = 'none';
    });
    copyMenu.addEventListener('mouseover', () => {
      copyMenu.style.display = 'block';
    });
    copyMenu.addEventListener('mouseout', () => {
      copyMenu.style.display = 'none';
    });
    button.addEventListener('click', () => {
      chrome.storage.local.get(['settings'], (result) => {
        // while parent is not user, keep going up
        const messageWrapper = document.querySelector(`#message-wrapper-${messageId}`);
        // get all message text nodes in the messageWrapperClone
        const messageTextNodes = messageWrapper.querySelectorAll('[id^="message-text-"]');
        // create a new div that only contains the message text nodes
        const assistantTextOnlyElements = document.createElement('div');
        messageTextNodes.forEach((node) => {
          assistantTextOnlyElements.appendChild(node.cloneNode(true));
        });

        const userElement = messageWrapper.previousElementSibling;
        const codeHeaders = assistantTextOnlyElements.querySelectorAll('#code-header');
        // hide all code headers
        codeHeaders.forEach((header) => {
          header.remove();
        });
        const text = `${result.settings.copyMode ? `>> USER: ${userElement.innerText}\n>> ASSISTANT: ` : ''}${assistantTextOnlyElements.innerText}`;
        navigator.clipboard.writeText(text.trim());

        // animate copy button text to copied and back in 3 seconds
        button.textContent = 'Copied!';
        setTimeout(
          () => {
            button.textContent = 'Copy';
          },
          1500,
        );
      });
    });
    newHtmlButton.addEventListener('click', () => {
      chrome.storage.local.get(['settings'], (result) => {
        const messageWrapper = document.querySelector(`#message-wrapper-${messageId}`);
        // get all message text nodes in the messageWrapperClone
        const messageTextNodes = messageWrapper.querySelectorAll('[id^="message-text-"]');
        // create a new div that only contains the message text nodes
        const assistantTextOnlyElements = document.createElement('div');
        messageTextNodes.forEach((node) => {
          assistantTextOnlyElements.appendChild(node.cloneNode(true));
        });

        // don't want avatar in HTML
        const userElement = messageWrapper.previousElementSibling;

        if (result.settings.copyMode) {
          assistantTextOnlyElements.innerHTML = `<div>USER:</div><div>${userElement.innerText}</div><br><div>ASSISTANT:</div>${assistantTextOnlyElements.innerHTML}`;
        }
        copyRichText(assistantTextOnlyElements);
        // animate copy htmlButton text to copied and back in 3 seconds
        newHtmlButton.textContent = 'Copied!';
        setTimeout(
          () => {
            newHtmlButton.textContent = 'HTML';
          },
          1500,
        );
      });
    });

    newMarkdownButton.addEventListener('click', () => {
      chrome.storage.local.get(['settings'], (result) => {
        const messageWrapper = document.querySelector(`#message-wrapper-${messageId}`);
        // get all message text nodes in the messageWrapperClone
        const messageTextNodes = messageWrapper.querySelectorAll('[id^="message-text-"]');
        // create a new div that only contains the message text nodes
        const assistantTextOnlyElements = document.createElement('div');
        messageTextNodes.forEach((node) => {
          assistantTextOnlyElements.appendChild(node.cloneNode(true));
        });

        const userElement = messageWrapper.previousElementSibling;

        const turndownService = new TurndownService();
        let markdown = turndownService.turndown(assistantTextOnlyElements.innerHTML);

        if (result.settings.copyMode) {
          markdown = `##USER:\n${userElement.innerText}\n\n##ASSISTANT:\n${markdown}`;
        }
        navigator.clipboard.writeText(markdown.trim());

        // animate copy markdownButton text to copied and back in 3 seconds
        newMarkdownButton.textContent = 'Copied!';
        setTimeout(
          () => {
            newMarkdownButton.textContent = 'Markdown';
          },
          1500,
        );
      });
    });
  });

  threadPrevButtons.forEach((btn) => {
    // clear existing event listeners
    const button = btn.cloneNode(true);
    btn.parentNode.replaceChild(button, btn);
    button.addEventListener('click', () => {
      chrome.storage.local.get(['conversations'], (result) => {
        const conversation = result.conversations[conversationId];
        const messageId = button.id.split('thread-prev-button-').pop();
        const messageWrapper = document.querySelector(`#message-wrapper-${messageId}`);
        const previousMessageWrapper = messageWrapper.previousElementSibling;
        // if thread is on the first message
        let parentId = conversation.mapping[messageId].parent;
        // if thread is not on the first message
        if (previousMessageWrapper && previousMessageWrapper.id.startsWith('message-wrapper-')) {
          parentId = previousMessageWrapper.id.split('message-wrapper-').pop();
        }
        const parent = conversation.mapping[parentId];
        const siblings = parent.children;
        const threadButtonsWrapper = document.querySelector(`#thread-count-wrapper-${messageId}`);
        const [currentThreadIndex] = threadButtonsWrapper.textContent.split(' / ').map((n) => parseInt(n, 10));
        if (currentThreadIndex > 1) {
          const newThreadIndex = currentThreadIndex - 1;
          const newMessageId = siblings[newThreadIndex - 1]; // thread index is 1-based, array index is 0-based
          const searchbox = document.querySelector('#conversation-search');
          const searchValue = searchbox.value;
          loadConversationFromNode(conversation.id, newMessageId, messageId, searchValue);
        }
      });
    });
  });

  threadNextButtons.forEach((btn) => {
    // clear existing event listeners
    const button = btn.cloneNode(true);
    btn.parentNode.replaceChild(button, btn);
    button.addEventListener('click', () => {
      chrome.storage.local.get(['conversations'], (result) => {
        const conversation = result.conversations[conversationId];
        const messageId = button.id.split('thread-next-button-').pop();
        const messageWrapper = document.querySelector(`#message-wrapper-${messageId}`);
        const previousMessageWrapper = messageWrapper.previousElementSibling;
        // if thread is on the first message
        let parentId = conversation.mapping[messageId].parent;
        // if thread is not on the first message
        if (previousMessageWrapper && previousMessageWrapper.id.startsWith('message-wrapper-')) {
          parentId = previousMessageWrapper.id.split('message-wrapper-').pop();
        }
        const parent = conversation.mapping[parentId];
        const siblings = parent.children;
        const threadButtonsWrapper = document.querySelector(`#thread-count-wrapper-${messageId}`);
        const [currentThreadIndex, threadCount] = threadButtonsWrapper.textContent.split(' / ').map((n) => parseInt(n, 10));
        if (currentThreadIndex < threadCount) {
          const newThreadIndex = currentThreadIndex + 1;

          const newMessageId = siblings[newThreadIndex - 1]; // thread index is 1-based, array index is 0-based
          const searchbox = document.querySelector('#conversation-search');
          const searchValue = searchbox.value;
          loadConversationFromNode(conversation.id, newMessageId, messageId, searchValue);
        }
      });
    });
  });
  regenerateResponseButtons.forEach((btn) => {
    const button = btn.cloneNode(true);
    btn.parentNode.replaceChild(button, btn);
    button.addEventListener('click', () => {
      chrome.storage.local.get(['conversations', 'settings', 'models', 'account'], (result) => {
        const conversation = result.conversations[conversationId];
        const messageId = button.id.split('message-regenerate-button-').pop();
        const messageWrapper = document.querySelector(`#message-wrapper-${messageId}`);
        const lastUserMessageWrapper = messageWrapper.previousElementSibling;
        // if thread is on the first message
        let lastUserChatMessageId = conversation.mapping[messageId].parent;
        // if thread is not on the first message
        if (lastUserMessageWrapper && lastUserMessageWrapper.id.startsWith('message-wrapper-')) {
          lastUserChatMessageId = lastUserMessageWrapper.id.split('message-wrapper-').pop();
        }
        const lastUserMessage = conversation.mapping[lastUserChatMessageId];

        const lastUserMessageParentId = lastUserMessage.parent;

        const newMessage = lastUserMessage.message.content.parts.filter((p) => typeof p === 'string').join('\n');
        const imageAssets = lastUserMessage.message?.content?.parts?.filter((p) => p && typeof p !== 'string') || [];
        const fileAttachments = lastUserMessage.message?.metadata?.attachments || [];
        messageWrapper.remove();
        isGenerating = true;
        submitChat(newMessage, conversation, lastUserChatMessageId, lastUserMessageParentId, result.settings, result.account, result.models, imageAssets, fileAttachments, false, true);
      });
    });
  });
  continueButtons.forEach((btn) => {
    const button = btn.cloneNode(true);
    btn.parentNode.replaceChild(button, btn);
    button.addEventListener('click', () => {
      chrome.storage.local.get(['conversations', 'settings', 'models', 'account'], (result) => {
        const conversation = result.conversations[conversationId];
        isGenerating = true;
        btn.classList.remove('md:group-[.final-completion]:visible');
        submitChat(null, conversation, conversation.current_node, conversation.current_node, result.settings, result.account, result.models, [], [], true);
      });
    });
  });

  messagePinButtons.forEach((btn) => {
    // clear existing event listeners
    const button = btn.cloneNode(true);
    btn.parentNode.replaceChild(button, btn);
    button.addEventListener('click', () => {
      chrome.storage.local.get(['conversations', 'settings'], (result) => {
        const { conversations, settings } = result;
        const conversation = conversations[conversationId];
        const messageId = button.id.split('message-pin-button-').pop();
        const isPinned = conversation.mapping[messageId].pinned || false;
        conversation.mapping[messageId].pinned = !isPinned;
        conversations[conversationId] = conversation;
        chrome.storage.local.set({ conversations }, () => {
          const messageWrapper = document.querySelector(`#message-wrapper-${messageId}`);
          const icon = button.querySelector('path');
          let defaultCalsses = 'dark:bg-gray-800';
          if (messageWrapper.getAttribute('data-role') === 'user') {
            defaultCalsses = ['dark:bg-gray-800'];
          } else {
            defaultCalsses = ['bg-gray-50', 'dark:bg-[#444654]'];
          }
          if (isPinned) {
            icon.setAttribute('fill', '#aaa');
            button.classList.remove('visible');
            button.classList.add('invisible', 'group-hover:visible');
            messageWrapper.classList.remove('border-l-pinned', 'bg-pinned', 'dark:bg-pinned');
            messageWrapper.classList.add(...defaultCalsses);
          } else {
            icon.setAttribute('fill', 'gold');
            button.classList.remove('invisible', 'group-hover:visible');
            button.classList.add('visible');
            messageWrapper.classList.remove(...defaultCalsses);
            messageWrapper.classList.add('border-l-pinned', 'bg-pinned', 'dark:bg-pinned');
          }
          if (settings.showPinNav) {
            const pinNav = document.querySelector('#pin-nav');
            if (isPinned) {
              pinNav.removeChild(pinNav.querySelector(`#pin-nav-item-${messageId}`));
            } else {
              const pin = document.createElement('button');
              pin.style = 'background-color: transparent; border: none; cursor: pointer;width:100%;width: 18px; margin-bottom:4px;transition: width 0.2s ease-in-out;';
              pin.id = `pin-nav-item-${messageId}`;
              pin.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="gold" d="M48 0H336C362.5 0 384 21.49 384 48V487.7C384 501.1 373.1 512 359.7 512C354.7 512 349.8 510.5 345.7 507.6L192 400L38.28 507.6C34.19 510.5 29.32 512 24.33 512C10.89 512 0 501.1 0 487.7V48C0 21.49 21.49 0 48 0z"/></svg>';
              pin.addEventListener('click', () => {
                messageWrapper.scrollIntoView({ behavior: 'smooth' });
              });
              // get all elemnt with id starting with message-pin-button- that also has class visible
              const newMessagePinButtons = document.querySelectorAll('[id^="message-pin-button-"].visible');
              // fake because it only has id and pinned=true which is enough for addPinNav
              const fakeSortedNodes = [...newMessagePinButtons].map((b) => ({ id: b.id.split('message-pin-button-').pop(), pinned: true }));
              addPinNav(fakeSortedNodes);
              observePinButton(button);
            }
          }
        });
      });
    });
    chrome.storage.local.get(['settings'], (result) => {
      const { settings } = result;
      if (settings.showPinNav) {
        observePinButton(button);
      }
    });
  });
  assetButtons?.forEach((btn) => {
    const button = btn.cloneNode(true);
    btn.parentNode.replaceChild(button, btn);
    button.addEventListener('click', () => {
      // if button is img, get src
      let imageUrl = '';
      if (button.tagName === 'IMG') {
        imageUrl = button.getAttribute('src');
      }
      // if button is span, get the url from background-image
      if (button.tagName === 'SPAN') {
        // eslint-disable-next-line prefer-destructuring
        imageUrl = button.style.backgroundImage.split('"')[1];
      }
      createFullSizeFileWrapper(imageUrl);
      addFullSizeFileWrapperEventListener();
    });
  });
  citations?.forEach((citation) => {
    if (!citation.href) return;
    if (!citation.href.startsWith('http')) return;
    const citationElement = citation.cloneNode(true);
    citation.parentNode.replaceChild(citationElement, citation);
    citationElement.addEventListener('mouseenter', (e) => {
      showCitationTooltip(e, citationElement);
    });
    citationElement.addEventListener('mouseleave', (e) => {
      hideCitationTooltip(e);
    });
  });
  sandboxLinks?.forEach((sandboxLink) => {
    const linkElement = sandboxLink.cloneNode(true);
    sandboxLink.parentNode.replaceChild(linkElement, sandboxLink);
    linkElement.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.storage.local.get(['conversations'], (result) => {
        const { conversations } = result;
        const conversation = conversations[conversationId];
        const sandboxUrl = linkElement.getAttribute('href');
        const fileName = sandboxUrl.split('/').pop();
        const sandboxUrlPath = sandboxUrl.split('sandbox:').pop();
        const node = Object.values(conversation.mapping).find((n) => n.message?.metadata?.aggregate_result?.final_expression_output?.includes(`'${sandboxUrlPath}'`));

        const resultImages = node?.message?.metadata?.aggregate_result?.messages?.filter((m) => m?.message_type === 'image');
        const image = resultImages?.[0];
        const imageId = image?.image_url?.split('file-service://')?.pop();
        if (imageId) {
          getDownloadUrlFromFileId(imageId).then((response) => {
            // save the file to user downloads folder: response.download_url;
            if (response.status === 'error') {
              toast('Code interpreter session expired', 'error');
              return;
            }
            const downloadUrl = response.download_url;
            downloadFileFrmoUrl(downloadUrl, fileName);
          });
        } else {
          getDownloadUrlFromSandBoxPath(conversationId, node.id, sandboxUrlPath).then((response) => {
            // save the file to user downloads folder: response.download_url;
            if (response.status === 'error') {
              toast('Code interpreter session expired', 'error');
              return;
            }
            const downloadUrl = response.download_url;
            downloadFileFrmoUrl(downloadUrl, fileName);
          });
        }
      });
    });
  });
  toolActionRequestAllowButtons.forEach((btn) => {
    const button = btn.cloneNode(true);
    btn.parentNode.replaceChild(button, btn);
    button.addEventListener('click', () => {
      const parentMessageId = button.id.split('tool-action-request-allow-').pop();
      const toolActionRequestWrapper = document.querySelector(`#tool-action-request-wrapper-${parentMessageId}`);
      const domain = toolActionRequestWrapper.getAttribute('data-domain');
      submitActionResponse(conversationId, parentMessageId, domain, 'allow');
    });
  });
  toolActionRequestDenyButtons.forEach((btn) => {
    const button = btn.cloneNode(true);
    btn.parentNode.replaceChild(button, btn);
    button.addEventListener('click', () => {
      const parentMessageId = button.id.split('tool-action-request-deny-').pop();
      const toolActionRequestWrapper = document.querySelector(`#tool-action-request-wrapper-${parentMessageId}`);
      const domain = toolActionRequestWrapper.getAttribute('data-domain');
      submitActionResponse(conversationId, parentMessageId, domain, 'deny');
    });
  });
  addMessagePluginToggleButtonsEventListeners(messagePluginToggleButtons);
}
function submitActionResponse(conversationId, parentMessageId, domain, actionType) {
  chrome.storage.local.get(['conversations', 'settings', 'models', 'account'], (result) => {
    const toolActionRequestWrapper = document.querySelector(`#tool-action-request-wrapper-${parentMessageId}`);
    const responseNode = actionType === 'allow' ? actionAllowedRenderer(domain) : actionDeniedRenderer(domain);
    if (toolActionRequestWrapper) {
      // replace the toolActionRequestWrapper with actionDeniedRenderer(domain)
      toolActionRequestWrapper.outerHTML = responseNode;
    } else {
      // add before lastMessageFeedbackWrapper
      const lastMessageFeedbackWrapper = [...document.querySelectorAll('[id^=message-feedback-wrapper-]')].pop();
      lastMessageFeedbackWrapper?.insertAdjacentHTML('beforebegin', responseNode);
    }
    const conversation = result.conversations[conversationId];
    isGenerating = true;
    const messageId = self.crypto.randomUUID();
    const actionRequestNode = conversation.mapping[parentMessageId];
    const actions = actionRequestNode?.message?.metadata?.jit_plugin_data?.from_server.body?.actions;
    const { name: authorName, role: authorRole } = actionRequestNode.message.author;
    const userAction = actions?.find((a) => a.type === actionType);
    const metadata = {
      jit_plugin_data: {
        from_client: {
          user_action: {
            data: {
              type: actionType,
            },
            target_message_id: userAction?.[actionType]?.target_message_id,
          },
        },
      },
      timestamp_: 'absolute',
    };
    updateLastMessagePluginDropdown();
    submitChat('', conversation, messageId, parentMessageId, result.settings, result.account, result.models, [], [], false, false, authorRole, authorName, metadata);
  });
}
function addMessagePluginToggleButtonsEventListeners(messagePluginToggleButtons) {
  messagePluginToggleButtons?.forEach((btn) => {
    const button = btn.cloneNode(true);
    btn.parentNode.replaceChild(button, btn);
    button.addEventListener('click', () => {
      const messageId = button.id.split('message-plugin-toggle-').pop();
      const pluginContent = document.querySelector(`#message-plugin-content-${messageId}`);
      // if pluginContent has class hidden remove it, otherwise add it
      if (pluginContent.classList.contains('hidden')) {
        button.querySelector('polyline').setAttribute('points', '18 15 12 9 6 15');
        pluginContent.classList.remove('hidden');
      } else {
        button.querySelector('polyline').setAttribute('points', '6 9 12 15 18 9');
        pluginContent.classList.add('hidden');
      }
    });
  });
}
function addCustomInstructionInfoIconEventListener(conversationId, customInstructionInfoIcon) {
  chrome.storage.local.get(['conversations'], (result) => {
    const conversation = result.conversations[conversationId];
    const allSystemMessages = Object.values(conversation.mapping)?.filter((node) => node?.message?.role === 'system' || node?.message?.author?.role === 'system');
    const systemMessageWithCustomInstruction = allSystemMessages.find((node) => node?.message?.metadata?.user_context_message_data);
    const customInstrucionProfile = systemMessageWithCustomInstruction?.message?.metadata?.user_context_message_data || undefined;
    let keepCustomInstructionTooltipOpen = false;

    customInstructionInfoIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      keepCustomInstructionTooltipOpen = true;
      const existingTooltip = document.querySelector('#custom-instruction-tooltip');
      if (existingTooltip) return;
      if (!customInstrucionProfile) return;
      // set active element to customInstructionInfoIcon
      const tooltip = showCustomInstructionTooltip(e, customInstrucionProfile.about_user_message, customInstrucionProfile.about_model_message);
      document.body.insertAdjacentHTML('beforeend', tooltip);
    });
    customInstructionInfoIcon.addEventListener('mouseenter', (e) => {
      const existingTooltip = document.querySelector('#custom-instruction-tooltip');
      if (existingTooltip) return;
      if (!customInstrucionProfile) return;
      const tooltip = showCustomInstructionTooltip(e, customInstrucionProfile.about_user_message, customInstrucionProfile.about_model_message);
      document.body.insertAdjacentHTML('beforeend', tooltip);
    });

    customInstructionInfoIcon.addEventListener('mouseleave', () => {
      if (keepCustomInstructionTooltipOpen) return;
      const tooltip = document.querySelector('#custom-instruction-tooltip');
      if (tooltip) tooltip.remove();
    });

    // click anywhere on the page to close the tooltip
    document.body.addEventListener('click', (e) => {
      const tooltip = document.querySelector('#custom-instruction-tooltip');
      if (tooltip && !tooltip.contains(e.target)) {
        keepCustomInstructionTooltipOpen = false;
        tooltip.remove();
      }
    });
  });
}
function showCitationTooltip(e, citationElement) {
  const citationUrl = new URL(citationElement.getAttribute('href'));
  const citationTitle = citationUrl.host ? citationElement.title : citationElement.href.includes('sandbox') ? 'Download file' : '';
  const citationDomain = citationUrl.hostname;
  const { x, y } = citationElement.getBoundingClientRect();
  if (!citationTitle) return;
  const citationTooltip = `<div id="citation-tooltip" data-radix-popper-content-wrapper="" style="position: fixed; left: 0px; top: 0px; transform: translate3d(${x}px, ${y - 30}px, 0px); min-width: max-content; z-index: auto; --radix-popper-anchor-width: 25px; --radix-popper-anchor-height: 21px; --radix-popper-available-width: 753.3125px; --radix-popper-available-height: 535px; --radix-popper-transform-origin: 50% 34px;"><div data-side="top" data-align="center" data-state="delayed-open" class="relative rounded-lg border border-white/20 bg-black p-1 shadow-xs transition-opacity max-w-sm" style="--radix-tooltip-content-transform-origin: var(--radix-popper-transform-origin); --radix-tooltip-content-available-width: var(--radix-popper-available-width); --radix-tooltip-content-available-height: var(--radix-popper-available-height); --radix-tooltip-trigger-width: var(--radix-popper-anchor-width); --radix-tooltip-trigger-height: var(--radix-popper-anchor-height);"><span class="flex items-center whitespace-pre-wrap px-2 py-1 text-center font-medium normal-case text-white text-sm"><a href="${citationUrl.href}" target="_blank" rel="noreferrer" class="text-xs !no-underline"><div class="flex items-center gap-2">${citationUrl.host ? `<div class="flex shrink-0 items-center justify-center"><img src="https://icons.duckduckgo.com/ip3/${citationDomain}.ico" alt="Favicon" width="16" height="16" class="my-0"></div>` : ''}<div class="max-w-xs truncate">${citationTitle}</div>${citationUrl.host ? '<div class="shrink-0"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-xs" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></div>' : ''}</div></a></span></div></div>`;
  const existingTooltip = document.querySelector('#citation-tooltip');
  if (existingTooltip) return;
  document.body.insertAdjacentHTML('beforeend', citationTooltip);
  const tooltip = document.querySelector('#citation-tooltip');
  const tooltipWidth = tooltip.offsetWidth;
  tooltip.style.transform = `translate3d(${x - tooltipWidth / 2}px, ${y - 30}px, 0px)`;
  tooltip.addEventListener('mouseout', (event) => {
    hideCitationTooltip(event);
  });
}
function hideCitationTooltip(e) {
  const tooltip = document.querySelector('#citation-tooltip');
  if (tooltip && !tooltip.contains(e.relatedTarget)) {
    tooltip.remove();
  }
}
function observePinButton(button) {
  const buttonMessageId = button.id.split('message-pin-button-').pop();
  const messagePinButton = document.querySelector(`#message-pin-button-${buttonMessageId}`);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const messageId = entry.target.id.split('message-pin-button-').pop();
      const pinNav = document.querySelector('#pin-nav');
      const pin = pinNav?.querySelector(`#pin-nav-item-${messageId}`);
      if (!pin) return;
      if (entry.isIntersecting) {
        pin.style.width = '18px';
      } else {
        pin.style.width = '12px';
      }
    });
  });
  if (!messagePinButton) return;
  observer.observe(messagePinButton);
}