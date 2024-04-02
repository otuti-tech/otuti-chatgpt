/* global isDescendant, TurndownService */
function customSelectionMenuShow(x, y, _selection) {
  const menu = document.getElementById('custom-selection-menu');
  if (!menu) return;
  menu.style.display = 'block';
  menu.style.left = `${x}px`;
  menu.style.top = `${y - menu.offsetHeight - 12}px`; // Adjust Y to show above
}
function customSelectionMenuHide() {
  const menu = document.getElementById('custom-selection-menu');
  if (!menu) return;
  menu.style.display = 'none';
}
function customSelectionMenuQuote() {
  const sel = window.getSelection();
  const container = document.createElement('div');
  for (let i = 0, len = sel.rangeCount; i < len; i += 1) {
    container.appendChild(sel.getRangeAt(i).cloneContents());
  }
  const turndownService = new TurndownService();
  const selectedTextMarkdown = turndownService.turndown(container.innerHTML);

  const textAreaElement = document.querySelector('#prompt-textarea');
  if (!textAreaElement) return;
  const existingReplyToPreviewElement = document.getElementById('reply-to-preview-wrapper');
  if (existingReplyToPreviewElement) existingReplyToPreviewElement.remove();

  const taggedGizmoElement = document.getElementById('tagged-gizmo-wrapper');

  const replyToPreviewElement = `<div id="reply-to-preview-wrapper" class="relative flex items-start gap-3 py-2.5 pl-2 pr-2 text-sm md:pl-4 md:pr-3 bg-token-main-surface-secondary text-token-text-secondary ${taggedGizmoElement ? '' : 'rounded-t-2xl'}">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 6C5.55228 6 6 6.44772 6 7V11C6 11.5523 6.44772 12 7 12H16.5858L14.2929 9.70711C13.9024 9.31658 13.9024 8.68342 14.2929 8.29289C14.6834 7.90237 15.3166 7.90237 15.7071 8.29289L19.7071 12.2929C20.0976 12.6834 20.0976 13.3166 19.7071 13.7071L15.7071 17.7071C15.3166 18.0976 14.6834 18.0976 14.2929 17.7071C13.9024 17.3166 13.9024 16.6834 14.2929 16.2929L16.5858 14H7C5.34315 14 4 12.6569 4 11V7C4 6.44772 4.44772 6 5 6Z" fill="currentColor"></path></svg>
  <div id="reply-to-preview-content" class="max-h-32 flex-1 overflow-y-auto whitespace-pre-wrap break-words">${selectedTextMarkdown}</div>
  <button id="reply-to-preview-wrapper-close-button" class="shrink-0"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-token-text-secondary"><path d="M6.34315 6.34338L17.6569 17.6571M17.6569 6.34338L6.34315 17.6571" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
  </div>`;
  const fileWrapperElement = document.querySelector('#file-wrapper-element');
  // add replyToElement right before textAreaElement
  if (fileWrapperElement) {
    fileWrapperElement.insertAdjacentHTML('beforebegin', replyToPreviewElement);
  } else {
    textAreaElement.insertAdjacentHTML('beforebegin', replyToPreviewElement);
  }
  // add event listener to remove replyToElement when click on close button
  const closeButton = document.querySelector('#reply-to-preview-wrapper-close-button');
  if (!closeButton) return;
  closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const curReplyToPreviewElement = document.getElementById('reply-to-preview-wrapper');
    if (curReplyToPreviewElement) curReplyToPreviewElement.remove();
  });
  // clear selection
  window.getSelection().removeAllRanges();
  // hide menu
  customSelectionMenuHide();
  // focus on input
  setTimeout(() => {
    textAreaElement.focus();
  }, 10);
}
function selectionListener() {
  const selection = window.getSelection().toString();

  if (selection.length > 0) {
    // all element with id staring with message-wrapper and role = assistant
    const allAssistantWrapper = document.querySelectorAll('[id^="message-wrapper-"][data-role="assistant"]');
    // check if selected text is a child of of message -wrapper with role = assitant
    const selectionNode = window.getSelection().anchorNode.parentElement;

    if (selectionNode) {
      for (let i = 0; i < allAssistantWrapper.length; i += 1) {
        if (isDescendant(allAssistantWrapper[i], selectionNode)) {
          const range = window.getSelection().getRangeAt(0);
          const rect = range.getClientRects()[0];
          customSelectionMenuShow(rect.left, rect.top, selection);
          return;
        }
      }
      customSelectionMenuHide();
    }
  } else {
    customSelectionMenuHide();
  }
}
// eslint-disable-next-line no-unused-vars
function initializeCustomSelectionMenu() {
  const menu = '<div id="custom-selection-menu" class="absolute" style="width: 49px; height: 21px;display:none;"><span class="" data-state="closed"><button id="quote-reply" class="btn relative btn-neutral btn-small"><div class="flex w-full gap-2 items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path d="M7.5 13.25C7.98703 13.25 8.45082 13.1505 8.87217 12.9708C8.46129 14.0478 7.62459 15.5792 6.35846 15.76C5.81173 15.8382 5.43183 16.3447 5.50993 16.8914C5.58804 17.4382 6.09457 17.8181 6.6413 17.7399C9.19413 17.3753 10.7256 14.4711 11.169 12.1909C11.4118 10.942 11.3856 9.58095 10.8491 8.44726C10.2424 7.16517 8.92256 6.24402 7.48508 6.25001C5.55895 6.25805 4 7.82196 4 9.74998C4 11.683 5.567 13.25 7.5 13.25Z" fill="currentColor"></path><path d="M16.1799 13.25C16.667 13.25 17.1307 13.1505 17.5521 12.9708C17.1412 14.0478 16.3045 15.5792 15.0384 15.76C14.4917 15.8382 14.1118 16.3447 14.1899 16.8914C14.268 17.4382 14.7745 17.8181 15.3212 17.7399C17.8741 17.3753 19.4056 14.4711 19.8489 12.1909C20.0918 10.942 20.0655 9.58095 19.529 8.44726C18.9223 7.16517 17.6025 6.24402 16.165 6.25001C14.2389 6.25805 12.6799 7.82196 12.6799 9.74998C12.6799 11.683 14.2469 13.25 16.1799 13.25Z" fill="currentColor"></path></svg></div></button></span></div>';
  document.body.insertAdjacentHTML('beforeend', menu);
  addCustomSelectionMenuEventListener();
}
function addCustomSelectionMenuEventListener() {
  document.addEventListener('mouseup', selectionListener);
  // hide menu when click outside
  document.addEventListener('mousedown', (event) => {
    const menu = document.getElementById('custom-selection-menu');
    if (!menu) return;
    if (!menu.contains(event.target)) {
      customSelectionMenuHide();
    }
  });

  const quoteReplyButton = document.getElementById('quote-reply');
  if (!quoteReplyButton) return;
  quoteReplyButton.addEventListener('click', customSelectionMenuQuote);
}
