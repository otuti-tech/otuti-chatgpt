// eslint-disable-next-line no-unused-vars
/* global isFirefox, isOpera, isGenerating:true, submitChat, textAreaElementInputEventListener, textAreaElementKeydownEventListenerSync, addUploadFileButton, curFileAttachments, addPageDragAndDropEventListener, chatStreamIsClosed:true, overrideSubmitForm, arkoseTrigger, createContinueButton */

// eslint-disable-next-line prefer-const
let textAreaElementOldValue = '';
// eslint-disable-next-line prefer-const, no-unused-vars

// eslint-disable-next-line no-unused-vars
function initializeInput() {
  const textAreaElement = document.querySelector('#prompt-textarea');
  if (!textAreaElement) return;
  textAreaElement.parentElement.classList.remove('overflow-hidden');
}
// eslint-disable-next-line no-unused-vars
function replaceTextAreaElement(settings) {
  chatStreamIsClosed = true;
  const { pathname } = new URL(window.location.toString());
  if (pathname.startsWith('/gpts')) return false;

  const presentation = document.querySelector('main > div[role=presentation]');
  const lastMessageWrapper = [...document.querySelectorAll('[id^="message-wrapper-"]')].pop();

  const placeHolderText = `$ for Custom Prompts — # for Prompt Chains${(isFirefox || isOpera) ? '' : ' — Hold down Alt to enable speaking'}`;
  if (!isGenerating && lastMessageWrapper?.dataset?.role === 'user') {
    // add regenerate button event listener
    let regenerateButton = document.querySelector('#conversation-regenerate-button');
    if (!regenerateButton) {
      const regenerateWrapperHTML = '<div class="w-full pt-2 md:pt-0 border-token-border-light md:border-transparent md:dark:border-transparent md:w-[calc(100%-.5rem)]"><div><div class="mb-3 text-center text-xs">There was an error generating a response</div><div class="flex items-center md:mb-4"><button id="conversation-regenerate-button" class="btn relative btn-primary m-auto" as="button"><div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 icon-xs" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>Regenerate</div></button></div></div><div class="relative px-2 py-2 text-center text-xs text-token-text-tertiary md:px-[60px]"><span>ChatGPT can make mistakes. Consider checking important information.</span></div></div>';
      if (presentation.childNodes.length > 1) {
        while (presentation.childNodes.length > 1) {
          presentation.removeChild(presentation.lastChild);
        }
      }
      // append to presentation
      presentation.insertAdjacentHTML('beforeend', regenerateWrapperHTML);
      regenerateButton = document.querySelector('#conversation-regenerate-button');
      regenerateButton.addEventListener('click', () => {
        // remove regenerate wrapper
        presentation.lastChild.remove();
        // add input form
        replaceTextAreaElement(settings);
        chrome.storage.local.get(['conversations', 'settings', 'models', 'selectedModel', 'account', 'chatgptAccountId'], (result) => {
          const submitButton = document.querySelector('[data-testid="send-button"]');
          if (submitButton) {
            submitButton.disabled = false;
          }
          const { pathname: curPathname } = new URL(window.location.toString());
          const conversationId = curPathname.split('/c/').pop().replace(/[^a-z0-9-]/gi, '');
          if (!conversationId) return;
          const conversation = result.conversations[conversationId];
          if (!conversation) return;
          isGenerating = true;
          const curLastMessageWrapper = [...document.querySelectorAll('[id^="message-wrapper-"]')].pop();

          // if thread is on the first message
          const lastUserChatMessageId = curLastMessageWrapper.id.split('message-wrapper-').pop();

          const lastUserMessage = conversation.mapping[lastUserChatMessageId];

          const lastUserMessageParentId = lastUserMessage.parent;

          const newMessage = (lastUserMessage.message?.content?.parts || [])?.filter((p) => typeof p === 'string').join('\n');
          const imageAssets = (lastUserMessage.message?.content?.parts || [])?.filter((p) => p && typeof p !== 'string') || [];
          const fileAttachments = lastUserMessage.message?.metadata?.attachments || [];
          submitChat(newMessage, conversation, lastUserChatMessageId, lastUserMessageParentId, result.settings, result.account, result.chatgptAccountId, result.models, result.selectedModel, imageAssets, fileAttachments, false, true);
        });
      });
    }
    return false;
  }
  const originalTextAreaElement = document.querySelector('#prompt-textarea');
  const originalTextAreaElementValue = originalTextAreaElement?.value || '';
  let inputForm = document.querySelector('#prompt-input-form');

  if (!inputForm) {
    const newInputFormHTML = `<div class="w-full pt-2 md:pt-0 border-token-border-light md:border-transparent md:dark:border-transparent md:w-[calc(100%-.5rem)]"><form id="prompt-input-form" class="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"><div class="relative flex h-full flex-1 flex-col"><div><div id="input-form-action-wrapper" class="h-full flex md:w-full md:mx-auto md:mb-4 mt-2 gap-0 md:gap-2 justify-center items-end" style="min-height: 38px;"></div></div><div class="overflow-hidden [&:has(textarea:focus)]:border-token-border-xheavy [&:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)] flex flex-col w-full dark:border-token-border-heavy flex-grow relative border border-token-border-heavy dark:text-white rounded-2xl bg-token-main-surface-primary shadow-[0_0_0_2px_rgba(255,255,255,0.95)] dark:shadow-[0_0_0_2px_rgba(52,53,65,0.95)]"><textarea id="prompt-textarea" tabindex="0" data-id="root" rows="1" placeholder="${placeHolderText}" class="m-0 w-full resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:py-3.5 md:pr-12 placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4" style="max-height: 200px; height: 52px; overflow-y: hidden;"></textarea><button class="absolute bg-black md:bottom-3 md:right-3 dark:hover:bg-white right-2 disabled:opacity-10 disabled:text-gray-400 enabled:bg-black text-white p-0.5 border border-black rounded-lg dark:border-white dark:bg-white bottom-1.5 transition-colors flex items-center justify-center" style="min-width:30px;min-height:30px;" data-testid="send-button" disabled=""><span class="" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button></div></div></form></div>`;
    if (!presentation) return false;
    // if presentation has more than 1 child remove all childs except the first one
    if (presentation.childNodes.length > 1) {
      while (presentation.childNodes.length > 1) {
        presentation.removeChild(presentation.lastChild);
      }
    }
    // append to presentation
    presentation.insertAdjacentHTML('beforeend', newInputFormHTML);
    inputForm = document.querySelector('#prompt-input-form');

    // if (!inputForm.querySelector('#enforcement-trigger35')) {
    //   inputForm.firstChild.insertAdjacentHTML('beforeend', '<button type="button" class="hidden" id="enforcement-trigger35"></button>');
    // }
    if (!inputForm.querySelector('#enforcement-trigger')) {
      inputForm.firstChild.insertAdjacentHTML('beforeend', '<button type="button" class="hidden" id="enforcement-trigger"></button>');
    }
    if (settings.customConversationWidth) {
      inputForm.style = `${inputForm.style.cssText}; max-width:${settings.conversationWidth}%;`;
    }
    inputForm.parentElement.classList = 'w-full pt-2 md:pt-0 border-token-border-light md:border-transparent md:dark:border-transparent md:w-[calc(100%-.5rem)]';
    // add  w-full to input form first child
    inputForm.firstChild.classList.add('w-full');
    // remove all div childs of inputForm if child element textcontent include gpt
    const allChilds = inputForm.parentElement.childNodes;
    allChilds.forEach((c) => {
      if (c.tagName === 'DIV' && c.textContent && c.textContent.toLowerCase().includes('gpt')) {
        c.textContent = '';
      }
    });

    let textAreaElement = inputForm.querySelector('textarea');
    if (!textAreaElement) {
      const textAreaElementWrapperHTML = `<div class="overflow-hidden [&:has(textarea:focus)]:border-token-border-xheavy [&:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)] flex flex-col w-full dark:border-token-border-heavy flex-grow relative border border-token-border-heavy dark:text-white rounded-2xl bg-token-main-surface-primary shadow-[0_0_0_2px_rgba(255,255,255,0.95)] dark:shadow-[0_0_0_2px_rgba(52,53,65,0.95)]"><textarea id="prompt-textarea" tabindex="0" data-id="root" rows="1" placeholder="${placeHolderText}" class="m-0 w-full resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:py-3.5 md:pr-12 placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4" style="max-height: 200px; height: 52px; overflow-y: hidden;"></textarea><button class="absolute bg-black md:bottom-3 md:right-3 dark:hover:bg-white right-2 disabled:opacity-10 disabled:text-gray-400 enabled:bg-black text-white p-0.5 border border-black rounded-lg dark:border-white dark:bg-white bottom-1.5 transition-colors flex items-center justify-center" style="min-width:30px;min-height:30px;" data-testid="send-button" disabled=""><span class="" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button></div>`;
      // insert text area element wrapper in input form first child at the end
      inputForm.firstChild.insertAdjacentHTML('beforeend', textAreaElementWrapperHTML);
      textAreaElement = inputForm.querySelector('textarea');
    }

    const newTextAreaElement = textAreaElement.cloneNode(true);
    newTextAreaElement.id = 'prompt-textarea';
    newTextAreaElement.dir = 'auto';
    newTextAreaElement.placeholder = placeHolderText;
    // auto resize textarea height up to 200px
    newTextAreaElement.style.height = 'auto';
    newTextAreaElement.style.height = `${newTextAreaElement.scrollHeight || '52'}px`;
    newTextAreaElement.style.maxHeight = '200px';
    newTextAreaElement.style.minHeight = '52px';
    newTextAreaElement.style.paddingRight = '48px';
    newTextAreaElement.style.overflowY = 'hidden';
    // keydown is triggered before input event and before value is changed.
    newTextAreaElement.addEventListener('input', () => {
      // console.warn('input event', 'old: ', textAreaElementOldValue, 'new: ', newTextAreaElement.value);
      const fileElement = document.querySelectorAll('[id^=file-element-');

      if (textAreaElementOldValue === '' && newTextAreaElement.value !== textAreaElementOldValue) {
        textAreaElementOldValue = newTextAreaElement.value;
        if (fileElement.length === 0) {
          arkoseTrigger();
        }
      } else if (newTextAreaElement.value !== textAreaElementOldValue) {
        textAreaElementOldValue = newTextAreaElement.value;
      }
    });

    newTextAreaElement.addEventListener('keydown', textAreaElementKeydownEventListenerSync);
    // also async
    newTextAreaElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && event.which === 13 && !event.shiftKey && !isGenerating) {
        const quickAccessMenu = document.querySelector('#quick-access-menu');
        if (quickAccessMenu && quickAccessMenu.style.display !== 'none') return;
        textAreaElementOldValue = '';
        if (newTextAreaElement.value.trim().length === 0 && curFileAttachments?.length === 0) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        const isUploading = document.querySelector('[id^=file-upload-spinner-]');
        if (isGenerating) return;
        if (isUploading) return;
        inputForm.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    });
    newTextAreaElement.addEventListener('input', textAreaElementInputEventListener);
    newTextAreaElement.addEventListener('paste', textAreaElementPasteEventListener);
    textAreaElement.replaceWith(newTextAreaElement);
    newTextAreaElement.value = originalTextAreaElementValue;
    newTextAreaElement.parentElement.classList.remove('overflow-hidden');
    // focus on new textarea element at the end of the input
    newTextAreaElement.focus();
    // set cursor at the end of the text
    newTextAreaElement.setSelectionRange(newTextAreaElement.value.length, newTextAreaElement.value.length);
    addUploadFileButton();
    addPageDragAndDropEventListener();
    addInputCounter();
    addGpt4Counter();
    overrideSubmitForm();
    createContinueButton();
  }
  return true;
}

function textAreaElementPasteEventListener(event) {
  if (event.clipboardData.files.length > 0) {
    event.preventDefault();
    event.stopPropagation();
    const uploadFileButton = document.querySelector('#upload-file-button');
    if (!uploadFileButton) return;
    const fileInput = uploadFileButton.parentElement.querySelector('input[type="file"]');
    if (!fileInput) return;
    fileInput.files = event.clipboardData.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
// eslint-disable-next-line no-unused-vars
function canSubmitPrompt() {
  const submitButton = document.querySelector('[data-testid="send-button"]');
  if (!submitButton) { return false; }
  const submitSVG = submitButton.querySelector('svg path[d="M7 11L12 6L17 11M12 18V7"]');
  if (!submitSVG) { return false; }
  if (isGenerating) { return false; }
  return true;
}

function addInputCounter() {
  const inputForm = document.querySelector('main form');
  if (!inputForm) return;
  // find sibling of input form
  const inputFormSibling = inputForm.nextElementSibling;
  if (inputFormSibling) {
    inputFormSibling.style.disply = 'none';
  }

  const textAreaElement = document.querySelector('#prompt-textarea');
  if (!textAreaElement) return;
  // add input char/word counter
  const existingInputCounterElement = document.querySelector('#gptx-input-counter');
  if (existingInputCounterElement) existingInputCounterElement.remove();
  const inputCounterElement = document.createElement('span');
  inputCounterElement.id = 'gptx-input-counter';
  inputCounterElement.classList = 'text-token-text-secondary select-none';
  inputCounterElement.style = 'position: absolute; bottom: -15px; right: 0px; font-size: 10px; z-index: 100;';
  inputCounterElement.innerText = '0 chars / 0 words';

  textAreaElement.parentElement.appendChild(inputCounterElement);
}
// eslint-disable-next-line no-unused-vars
function updateInputCounter(text) {
  const isGPT4 = document.querySelector('#navbar-selected-model-title')?.innerText?.toLowerCase()?.includes('gpt4');
  const isGizmo = document.querySelector('#gizmo-menu-wrapper-navbar');

  const yellowLimit = isGPT4 || isGizmo ? 120000 : 28000;
  const redLimit = isGPT4 || isGizmo ? 124000 : 30000;
  const curInputCounterElement = document.querySelector('#gptx-input-counter');
  if (curInputCounterElement) {
    // word count split by space or newline
    const wordCount = text ? text.split(/[\s\n]+/).length : 0;
    const charCount = text.length;
    if (charCount < yellowLimit) {
      curInputCounterElement.style.color = '#999';
    }
    if (charCount > yellowLimit && charCount < redLimit) {
      curInputCounterElement.style.color = '#fbd986';
    }
    if (charCount > redLimit) {
      curInputCounterElement.style.color = '#ff4a4a';
    }
    curInputCounterElement.innerText = `${Math.max(charCount, 0)} chars / ${Math.max(wordCount, 0)} words`;
  }
}
function getGPT4CounterMessageCapWindow(messageCapWindow) {
  if (messageCapWindow < 60) return messageCapWindow < 2 ? 'minute' : ''.concat(messageCapWindow, ' minutes');
  const n = Math.floor(messageCapWindow / 60);
  if (n < 24) return n < 2 ? 'hour' : ''.concat(n, ' hours');
  const t = Math.floor(n / 24);
  if (t < 7) return t < 2 ? 'day' : ''.concat(t, ' days');
  const r = Math.floor(t / 7);
  return r < 2 ? 'week' : ''.concat(r, ' weeks');
}
function addGpt4Counter() {
  const textAreaElement = document.querySelector('#prompt-textarea');
  if (!textAreaElement) return;
  // add input char/word counter
  const existingGpt4CounterElement = document.querySelector('#gpt4-counter');
  if (existingGpt4CounterElement) existingGpt4CounterElement.remove();
  const gpt4CounterElement = document.createElement('span');
  gpt4CounterElement.id = 'gpt4-counter';
  gpt4CounterElement.classList = 'text-token-text-secondary';
  gpt4CounterElement.style = 'position: absolute; bottom: -15px; left: 0px; font-size: 10px; z-index: 100;display:none;';
  chrome.storage.local.get(['gpt4Timestamps', 'models', 'conversationLimit', 'settings', 'capExpiresAt'], (result) => {
    if (!result.models) return;
    if (!result.models.find((model) => model.slug === 'gpt-4')) return;
    gpt4CounterElement.style.display = result.settings.showGpt4Counter ? 'block' : 'none';
    const gpt4Timestamps = result.gpt4Timestamps || [];

    const messageCap = result?.conversationLimit?.message_cap || 50;
    const messageCapWindow = result?.conversationLimit?.message_cap_window || 180;
    const now = new Date().getTime();
    const timestampsInCapWindow = gpt4Timestamps.filter((timestamp) => now - timestamp < (messageCapWindow / 60) * 60 * 60 * 1000);
    // const resetTimeText = timestampsInCapWindow.length > 0 ? `New message available at: ${new Date(timestampsInCapWindow[0] + (messageCapWindow / 60) * 60 * 60 * 1000).toLocaleString()}` : '';
    const gpt4counter = timestampsInCapWindow.length;
    const capExpiresAtTimeString = result.capExpiresAt ? `(Cap Expires At: ${result.capExpiresAt})` : '';
    // earliest timestamp in the last 3 hours
    const firstTimestamp = gpt4Timestamps[0];
    // find difference between 3 hours ago to first timestamp
    const countdownTimer = firstTimestamp ? Math.max(0, 3 * 60 * 60 * 1000 - (now - firstTimestamp)) : 0;
    // show a countdown time if countdownTimer is greater than 0
    let countdownTimerText = '';

    if (countdownTimer > 0) {
      countdownTimerText = ` (New request available in ${Math.floor(countdownTimer / 1000 / 60)} minutes)`;
      gpt4CounterElement.innerText = `GPT-4 requests (last ${getGPT4CounterMessageCapWindow(messageCapWindow)}): ${gpt4counter}/${messageCap} ${countdownTimerText} ${capExpiresAtTimeString}`;
      setTimeout(() => {
        addGpt4Counter();
      }, 30000);
      return;
    }
    if (gpt4counter) {
      gpt4CounterElement.innerText = `GPT-4 requests (last ${getGPT4CounterMessageCapWindow(messageCapWindow)}): ${gpt4counter}/${messageCap} ${capExpiresAtTimeString}`;
    } else {
      gpt4CounterElement.innerText = `GPT-4 requests (last ${getGPT4CounterMessageCapWindow(messageCapWindow)}): 0/${messageCap}`;
    }
  });

  textAreaElement.parentElement.appendChild(gpt4CounterElement);

  chrome.storage.onChanged.addListener((e) => {
    if (e.conversationLimit) {
      addGpt4Counter();
    }
  });
}
