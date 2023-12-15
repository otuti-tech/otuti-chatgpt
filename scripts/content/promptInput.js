/* global isGenerating, textAreaElementInputEventListener, textAreaElementKeydownEventListenerSync, addUploadFileButton, curFileAttachments, addPageDragAndDropEventListener, overrideSubmitForm, */

// eslint-disable-next-line prefer-const
let textAreaElementOldValue = '';
// eslint-disable-next-line prefer-const, no-unused-vars

// eslint-disable-next-line no-unused-vars
function initializeInput() {
  const textAreaElement = document.querySelector('main form textarea');
  if (!textAreaElement) return;
  textAreaElement.parentElement.classList.remove('overflow-hidden');
}
function addInputFormActionWrapper() {
  const inputForm = document.querySelector('main form');
  if (!inputForm) return false;
  const textAreaElement = inputForm.querySelector('textarea');
  let inputFormActionWrapper = inputForm.querySelector('#input-form-action-wrapper');
  if (inputFormActionWrapper) return inputFormActionWrapper;
  if (inputForm.firstChild.firstChild.tagName === 'DIV' && inputForm.firstChild.firstChild.classList.value === '' && !inputForm.firstChild.firstChild.contains(textAreaElement)) {
    inputFormActionWrapper = inputForm.firstChild.childNodes[0].firstChild;
  } else {
    const newInputFormActionWrapper = '<div><div id="input-form-action-wrapper" class="h-full flex md:w-full md:mx-auto md:mb-4 gap-0 md:gap-2 mt-2 justify-center items-end"></div></div>';
    inputForm.firstChild.insertAdjacentHTML('afterbegin', newInputFormActionWrapper);
    inputFormActionWrapper = inputForm.querySelector('#input-form-action-wrapper');
  }
  inputFormActionWrapper.id = 'input-form-action-wrapper';
  inputFormActionWrapper.classList = 'h-full flex md:w-full md:mx-auto md:mb-4 mt-2 gap-0 md:gap-2 justify-center items-end';
  inputFormActionWrapper.style.minHeight = '38px';
  if (inputFormActionWrapper.querySelector('.grow')) {
    inputFormActionWrapper.querySelector('.grow').style.zIndex = '1000';
  }
  return inputFormActionWrapper;
}
// eslint-disable-next-line no-unused-vars
function replaceTextAreaElemet(settings) {
  let inputForm = document.querySelector('main form');
  if (!inputForm) {
    const { pathname } = new URL(window.location.toString());

    // if (document.querySelector('main').innerText.toLowerCase().includes('there was an error generating a response')) {
    if (pathname !== '/gpts/discovery') {
      const newInputFormHTML = '<div class="w-full pt-2 md:pt-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:w-[calc(100%-.5rem)]"><form class="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"><div class="relative flex h-full flex-1 items-stretch md:flex-col w-full"><div class="overflow-hidden [&:has(textarea:focus)]:border-token-border-xheavy [&:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)] flex flex-col w-full dark:border-token-border-heavy flex-grow relative border border-token-border-heavy dark:text-white rounded-2xl bg-white dark:bg-gray-800 shadow-[0_0_0_2px_rgba(255,255,255,0.95)] dark:shadow-[0_0_0_2px_rgba(52,53,65,0.95)]"><textarea id="prompt-textarea" tabindex="0" data-id="root" rows="1" placeholder="Send a message (Type @ for Custom Prompts and # for Prompt Chains)" class="m-0 w-full resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:py-3.5 md:pr-12 placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4" style="max-height: 200px; height: 52px; overflow-y: hidden;"></textarea><button class="absolute md:bottom-3 md:right-3 dark:hover:bg-gray-900 dark:disabled:hover:bg-transparent right-2 dark:disabled:bg-white disabled:bg-black disabled:opacity-10 disabled:text-gray-400 enabled:bg-black text-white p-0.5 border border-black rounded-lg dark:border-white dark:bg-white bottom-1.5 transition-colors" data-testid="send-button" disabled=""><span class="" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button></div></div></form></div>';
      const presentation = document.querySelector('main > div[role=presentation]');
      if (!presentation) return false;
      // if presentation has more than 1 child remove all childs except the first one
      if (presentation.childNodes.length > 1) {
        while (presentation.childNodes.length > 1) {
          presentation.removeChild(presentation.lastChild);
        }
      }
      // append to presentation
      presentation.insertAdjacentHTML('beforeend', newInputFormHTML);
      inputForm = document.querySelector('main form');
    } else {
      return false;
    }
  }

  if (!inputForm.querySelector('#enforcement-trigger35')) {
    inputForm.firstChild.insertAdjacentHTML('beforeend', '<button type="button" class="hidden" id="enforcement-trigger35"></button>');
  }
  if (!inputForm.querySelector('#enforcement-trigger4')) {
    inputForm.firstChild.insertAdjacentHTML('beforeend', '<button type="button" class="hidden" id="enforcement-trigger4"></button>');
  }
  if (settings.customConversationWidth) {
    inputForm.style = `${inputForm.style.cssText}; max-width:${settings.conversationWidth}%;`;
  }
  inputForm.parentElement.classList = 'w-full pt-2 md:pt-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:w-[calc(100%-.5rem)]';
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
  const textAreaElementOriginalValue = textAreaElement.value;
  if (!textAreaElement) {
    const textAreaElementWrapperHTML = '<div class="overflow-hidden [&:has(textarea:focus)]:border-token-border-xheavy [&:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)] flex flex-col w-full dark:border-token-border-heavy flex-grow relative border border-token-border-heavy dark:text-white rounded-2xl bg-white dark:bg-gray-800 shadow-[0_0_0_2px_rgba(255,255,255,0.95)] dark:shadow-[0_0_0_2px_rgba(52,53,65,0.95)]"><textarea id="prompt-textarea" tabindex="0" data-id="root" rows="1" placeholder="Send a message (Type @ for Custom Prompts and # for Prompt Chains)" class="m-0 w-full resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:py-3.5 md:pr-12 placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4" style="max-height: 200px; height: 52px; overflow-y: hidden;"></textarea><button class="absolute md:bottom-3 md:right-3 dark:hover:bg-gray-900 dark:disabled:hover:bg-transparent right-2 dark:disabled:bg-white disabled:bg-black disabled:opacity-10 disabled:text-gray-400 enabled:bg-black text-white p-0.5 border border-black rounded-lg dark:border-white dark:bg-white bottom-1.5 transition-colors" data-testid="send-button" disabled=""><span class="" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></button></div>';
    // insert text area element wrapper in input form first child at the end
    inputForm.firstChild.insertAdjacentHTML('beforeend', textAreaElementWrapperHTML);
    textAreaElement = inputForm.querySelector('textarea');
  }
  const newTextAreaElement = textAreaElement.cloneNode(true);
  newTextAreaElement.id = 'prompt-textarea';
  newTextAreaElement.dir = 'auto';
  newTextAreaElement.placeholder = 'Send a message (Type @ for Custom Prompt and # for Prompt Chains)';
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
    } else if (newTextAreaElement.value !== textAreaElementOldValue) {
      textAreaElementOldValue = newTextAreaElement.value;
    }
  });

  newTextAreaElement.addEventListener('keydown', textAreaElementKeydownEventListenerSync);
  // also async
  newTextAreaElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.which === 13 && !event.shiftKey && !isGenerating) {
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
  newTextAreaElement.value = textAreaElementOriginalValue;
  newTextAreaElement.parentElement.classList.remove('overflow-hidden');

  addInputFormActionWrapper();
  addUploadFileButton();
  addPageDragAndDropEventListener();
  addInputCounter();
  addGpt4Counter();
  overrideSubmitForm();
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
function showHideTextAreaElement(forceShow = false) {
  chrome.storage.local.get('settings', ({ settings }) => {
    const textAreaElement = document.querySelector('main form textarea');
    if (!textAreaElement) return;
    const textAreaParent = textAreaElement.parentElement;
    const allMessageWrapper = document.querySelectorAll('[id^="message-wrapper-"]');
    const continueButton = document.querySelector('#continue-conversation-button-wrapper');
    if (allMessageWrapper.length > 0) {
      const lastMessageWrapperElement = allMessageWrapper[allMessageWrapper.length - 1];

      if (!forceShow && lastMessageWrapperElement && lastMessageWrapperElement.dataset.role === 'user') {
        textAreaParent.style.display = 'none';
        if (continueButton) continueButton.style.display = 'none';
      } else {
        textAreaParent.style = '';
        if (continueButton && settings.showCustomPromptsButton) continueButton.style.display = 'flex';
      }
    } else {
      textAreaParent.style = '';
    }
  });
}
// eslint-disable-next-line no-unused-vars
function canSubmitPrompt() {
  const submitButton = document.querySelector('main form textarea ~ button');
  if (!submitButton) { return false; }
  // if submit button not contained and svg element retur false
  const submitSVG = submitButton.querySelector('svg');// (...)
  if (!submitSVG) { return false; }
  if (isGenerating) { return false; }
  return true;
}

function addInputCounter() {
  const main = document.querySelector('main');
  if (!main) return;
  const inputForm = main.querySelector('form');
  if (!inputForm) return;
  // find sibling of input form
  const inputFormSibling = inputForm.nextElementSibling;
  if (inputFormSibling) {
    inputFormSibling.style.disply = 'none';
  }

  const textAreaElement = inputForm.querySelector('textarea');
  if (!textAreaElement) return;
  // add input char/word counter
  const existingInputCounterElement = document.querySelector('#gptx-input-counter');
  if (existingInputCounterElement) existingInputCounterElement.remove();
  const inputCounterElement = document.createElement('span');
  inputCounterElement.id = 'gptx-input-counter';
  inputCounterElement.style = 'position: absolute; bottom: -15px; right: 0px; font-size: 10px; color: #999; opacity: 0.8;z-index: 100;';
  inputCounterElement.innerText = '0 chars / 0 words';

  textAreaElement.parentElement.appendChild(inputCounterElement);
}
// eslint-disable-next-line no-unused-vars
function updateInputCounter(text) {
  const isGPT4 = document.querySelector('#navbar-selected-model-title')?.innerText?.toLowerCase()?.includes('gpt4');
  const yellowLimit = isGPT4 ? 120000 : 28000;
  const redLimit = isGPT4 ? 124000 : 30000;
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
  const textAreaElement = document.querySelector('main form textarea');
  if (!textAreaElement) return;
  // add input char/word counter
  const existingGpt4CounterElement = document.querySelector('#gpt4-counter');
  if (existingGpt4CounterElement) existingGpt4CounterElement.remove();
  const gpt4CounterElement = document.createElement('span');
  gpt4CounterElement.id = 'gpt4-counter';
  gpt4CounterElement.style = 'position: absolute; bottom: -15px; left: 0px; font-size: 10px; color: #999; opacity: 0.8; z-index: 100;display:none;';
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
