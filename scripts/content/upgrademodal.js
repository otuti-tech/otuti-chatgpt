/* global isDescendant */
// eslint-disable-next-line no-unused-vars
function openUpgradeModal(hasSubscription = false) {
  chrome.storage.local.get({ STRIPE_PAYMENT_LINK_ID: '8wM5nW6oq7y287ufZ8', STRIPE_PORTAL_LINK_ID: '00g0237Sr78wcM03cc' }, (r) => {
    // const beforeDate = new Date('2024-01-02');
    // const now = new Date();
    const limitedTimeOffer = !hasSubscription ? '<span class="text-xs self-end">Limited time offer</span>' : '';
    const proPrice = !hasSubscription ? 'USD <span class="line-through">$19.99</span> <span>$10/month <span class="text-xs">(billed yearly)</span></span>' : '';
    chrome.storage.sync.get(['email'], ({ email }) => {
      const upgradeModal = `<div id="upgrade-to-pro-modal" class="absolute inset-0" style="z-index:100000;"><div data-state="open" class="fixed inset-0 bg-black/50 dark:bg-gray-600/70" style="pointer-events:auto"><div class="grid-cols-[10px_1fr_10px] grid h-full w-full grid-rows-[minmax(10px,_1fr)_auto_minmax(10px,_1fr)] md:grid-rows-[minmax(20px,_1fr)_auto_minmax(20px,_1fr)] overflow-y-auto"><div role="dialog" id="radix-:R15dm:" aria-describedby="radix-:R15dmH2:" aria-labelledby="radix-:R15dmH1:" data-state="open" class="relative col-auto col-start-2 row-auto row-start-2 w-full rounded-xl text-left shadow-xl transition-all left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 focus-none !bg-transparent !shadow-none outline-none md:max-w-4xl lg:w-full" tabindex="-1" style="pointer-events:auto"><div class=""><div class="focus-none flex h-full flex-col items-center justify-start outline-none"><div class="relative"><div id="upgrade-to-pro-modal-content" class="flex grow justify-center bg-white dark:bg-gray-900 rounded-md flex-col items-start overflow-hidden border shadow-md dark:border-gray-600"><div class="flex w-full flex-row items-center justify-between border-b border-token-border-light bg-token-main-surface-secondary px-8 py-6"><span class="text-xl font-medium">${hasSubscription ? 'Superpower ChatGPT Pro Plan' : 'Upgrade Superpower ChatGPT Plan'}</span><button id="upgrade-modal-close-button" class="text-token-text-primary opacity-50 transition hover:opacity-75"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div><div class="flex flex-col md:flex-row">${hasSubscription ? '' : '<div class="text-sm relative flex-1 flex gap-5 flex-col border-t py-4 px-6 border-token-border-light md:border-r last:border-r-0 md:border-t-0" style="max-width:450px;"><div class="relative flex flex-col bg-token-main-surface-primary"><div class="flex flex-col gap-1"><p class="flex items-center gap-2 text-xl font-medium">Free</p><p class="text-base font-light text-token-text-tertiary">USD $0/month</p></div></div><div class="relative flex flex-col bg-token-main-surface-primary"><button class="opacity-50 hover:bg-inherit cursor-not-allowed btn relative btn-disabled py-3 font-semibold" disabled=""><div class="flex w-full gap-2 items-center justify-center">Your current plan</div></button></div><div class="flex flex-col flex-grow gap-2"><div class="relative flex flex-col bg-token-main-surface-primary"><p class="text-l font-medium">For people just getting started with Superpower ChatGPT</p></div><div class="relative bg-token-main-surface-primary"><div class="text-l flex justify-start gap-2"><div class="w-8 flex-shrink-0"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span>Create Folders and Search All Conversations</span></div></div><div class="relative bg-token-main-surface-primary"><div class="text-l flex justify-start gap-2"><div class="w-8 flex-shrink-0"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span>Unlimited Custom Instruction Profiles</span></div></div><div class="relative bg-token-main-surface-primary"><div class="text-l flex justify-start gap-2"><div class="w-8 flex-shrink-0"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span>Prompt Chains, Prompt Templates, and Custom Prompts</span></div></div><div class="relative bg-token-main-surface-primary"><div class="text-l flex justify-start gap-2"><div class="w-8 flex-shrink-0"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span>Change Model Mid Conversation</span></div></div><div class="relative bg-token-main-surface-primary"><div class="text-l flex justify-start gap-2"><div class="w-8 flex-shrink-0"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span>Prompt History, Favorite Prompts, and Community Prompts</span></div></div><div class="relative bg-token-main-surface-primary"><div class="text-l flex justify-start gap-2"><div class="w-8 flex-shrink-0"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span>Auto Splitter and Auto Summarizer</span></div></div><div class="relative bg-token-main-surface-primary"><div class="text-l flex justify-start gap-2"><div class="w-8 flex-shrink-0"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span>Export Chats in Multiple Formats</span></div></div></div></div>'}<div class="text-sm relative flex-1 flex gap-5 flex-col border-t py-4 px-6 border-token-border-light md:border-r last:border-r-0 md:border-t-0" style="max-width:450px;"><div class="relative flex flex-col bg-token-main-surface-primary"><div class="flex flex-col gap-1"><p class="flex items-center gap-2 text-xl font-medium"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width:20px;height:20px;margin-right:6px" stroke="gold" fill="gold"><path d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z"/></svg>Pro ${limitedTimeOffer}</p><p class="text-base font-light text-token-text-tertiary">${proPrice}</p></div></div><div class="relative flex flex-col bg-token-main-surface-primary"><div class="relative w-full"><span class="" data-state="closed"><button id="upgrade-modal-confirm-button" class="btn relative btn-primary w-full py-3 py-3 font-semibold ${hasSubscription ? 'opacity-50 hover:bg-inherit cursor-not-allowed btn-disabled' : ''}" data-testid="select-plan-button-plus-waitlist">${hasSubscription ? '<div class="flex w-full gap-2 items-center justify-center">Your current plan</div>' : `<a class="flex w-full items-center justify-center" target="_self" href="https://buy.stripe.com/${r.STRIPE_PAYMENT_LINK_ID || '8wM5nW6oq7y287ufZ8'}?prefilled_email=${encodeURIComponent(email)}">Upgrade to Pro</a>`}</button></span></div></div><div class="flex flex-col flex-grow gap-2"><div class="relative flex flex-col bg-token-main-surface-primary">${hasSubscription ? '' : '<p class="text-l font-medium">Everything in Free, and:</p>'}</div>
            
      <div class="relative bg-token-main-surface-primary"><div class="text-l flex justify-start gap-2"><div class="w-8 flex-shrink-0"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span><b>Image gallery.</b> Search, See Prompt and Download all Images in One Place. <a style="text-decoration:underline;color:gold" href="https://www.youtube.com/watch?v=oU6_wgJLYEM&ab_channel=Superpower" target="blank">Watch Demo ➜</a></span></div></div>

      <div class="relative bg-token-main-surface-primary"><div class="text-l flex justify-start gap-2"><div class="w-8 flex-shrink-0"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span><b>ChatGPT with Voice.</b> Text to Speech and Speech to Text. Elevenlabs and Whisper coming soon. <a style="text-decoration:underline;color:gold" href="https://www.youtube.com/watch?v=ckHAyrVqj-w&ab_channel=Superpower" target="blank">Watch Demo ➜</a></span></div></div>
      
      <div class="relative bg-token-main-surface-primary"><div class="text-l flex justify-start gap-2"><div class="w-8 flex-shrink-0"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span><b>Auto Folder</b> Custom GPT Chats. <a style="text-decoration:underline;color:gold" href="https://www.youtube.com/watch?v=lCCyDwJFoOo&ab_channel=Superpower" target="blank">Watch Demo ➜</a></span></div></div>

      <div class="relative bg-token-main-surface-primary"><div class="text-l flex justify-start gap-2"><div class="w-8 flex-shrink-0"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span><b>Enhanced GPT Store.</b> Access to full list of all GPTs in the store. With the ability to search and sort by most popular. <a style="text-decoration:underline;color:gold" href="https://www.youtube.com/watch?v=q1VUONah6fE&ab_channel=Superpower" target="blank">Watch Demo ➜</a></span></div></div>

      <div class="relative bg-token-main-surface-primary"><div class="text-l flex justify-start gap-2"><div class="w-8 flex-shrink-0"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span><b>Priority Support</b> and a Private Channel for Pro Members on Discord</span></div></div>
            
      <div class="relative bg-token-main-surface-primary"><div class="text-l flex justify-start gap-2"><div class="w-8 flex-shrink-0"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mr-2 mt-1 h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span>More coming ...</span></div></div>
      
      </div>${hasSubscription ? `<div class="relative flex flex-col bg-token-main-surface-primary text-xs text-token-text-secondary"><div><a class="px-2 underline" href="https://billing.stripe.com/p/login/${r.STRIPE_PORTAL_LINK_ID || '00g0237Sr78wcM03cc'}?prefilled_email=${encodeURIComponent(email)}">Manage my subscription</a></div></div>` : ''}</div></div>
      
      <div class="flex w-full items-center justify-center border-t border-token-border-light bg-token-main-surface-secondary px-8 py-6"><div class="text-sm text-token-text-primary sm:flex sm:items-center">Have any questions? <a target="_blank" class="mx-1 font-semibold underline" href="mailto:saeed@superpowerdaily.com?subject=Superpower ChatGPT Pro Subscription">Email Us ➜</a></div></div></div></div></div></div></div></div></div></div>`;
      document.body.insertAdjacentHTML('beforeend', upgradeModal);
      const upgradeModalCloseButton = document.getElementById('upgrade-modal-close-button');
      upgradeModalCloseButton.addEventListener('click', () => {
        document.getElementById('upgrade-to-pro-modal').remove();
      });
      // if click anywhere outside the upgrade-to-pro-modal-content, but inside upgrade-to-pro-modal, close the modal
      const upgradeModalContent = document.getElementById('upgrade-to-pro-modal-content');
      document.getElementById('upgrade-to-pro-modal').addEventListener('click', (e) => {
        if (!isDescendant(upgradeModalContent, e.target)) {
          document.getElementById('upgrade-to-pro-modal').remove();
        }
      });
    });
  });
}

function addUpgradeToProSideButton() {
  const existingUpgradeToProSideButton = document.getElementById('upgrade-to-pro-side-button');

  const textAreaElement = document.querySelector('#prompt-textarea');
  if (!textAreaElement) {
    if (existingUpgradeToProSideButton) existingUpgradeToProSideButton.remove();
    return;
  }
  if (existingUpgradeToProSideButton) return;

  const upgradeToProSideButton = document.createElement('button');
  upgradeToProSideButton.id = 'upgrade-to-pro-side-button';
  upgradeToProSideButton.title = 'Upgrade to Pro';
  upgradeToProSideButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width:20px; height:20px;" stroke="purple" fill="purple"><path d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z"/></svg>';// <div style="position: absolute; width: 58px; height: 58px; top: -22px; left: -7px; transform: rotate(15deg);">${santa}</div>`;
  upgradeToProSideButton.classList = 'relative flex flex-wrap p-1 items-center rounded-md bg-gold hover:bg-gold-dark transition-colors duration-200 text-black cursor-pointer text-sm ml-auto font-bold';
  upgradeToProSideButton.style = 'margin-bottom: 1rem;right:0rem;width:2rem;height:2rem;flex-wrap:wrap;border: solid 1px;';

  upgradeToProSideButton.addEventListener('click', () => {
    openUpgradeModal(false);
  });
  const scrollButtonWrapper = document.getElementById('scroll-button-wrapper');
  if (scrollButtonWrapper) {
    scrollButtonWrapper.prepend(upgradeToProSideButton);
  }
}
// eslint-disable-next-line no-unused-vars
function initializeUpgradeButton(hasSubscription) {
  if (hasSubscription) return;
  addUpgradeToProSideButton();
  const observer = new MutationObserver(() => {
    addUpgradeToProSideButton();
  });
  const main = document.querySelector('main');
  if (!main) return;
  observer.observe(main, {
    childList: true,
    subtree: true,
  });
}

const santa = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" id="Layer_1" x="0" y="0" style="enable-background:new 0 0 864 864" version="1.1" viewBox="0 0 864 864"><style>.st0{fill:#fff}</style><path d="M820.1 563.1c10.9-10.9 14.3-25.4 10.7-40.4-2.2-9.3-6.2-18.1-11.6-26-.2-.3-.4-.6-.6-.8-2.8-4.1-6-7.8-9.6-11.3-2.5-2.4-6.9-7.5-10.5-8 .7.1 1.5.2 2.2.4 2.6.4 6.1 1.6 8.8 1.1 3.1-.6 3.8-3.2 2.9-5.5-.9-13.2-17.1-25.9-26.8-32.9-6-4.3-18-10-28.2-10.6.6-.4 1.3-.8 1.9-1.3 1.6-1.1 1.6-3 .1-4.2-12.6-9.9-29.7-12.8-45.2-8.8-8.4 2.2-17.8 6.7-24.9 13.2l-.1-.1c1.2-1.6-.4-4.5-2.7-4-19.2 4.1-37.7 24.6-41 44-7.7-4.1-12.7-11.2-16.9-20-1.5-9.6-2-19.3-2.3-27.7-1-24.6.6-49.1-1.3-73.7-2.9-39.1-10-82.2-28.1-118-9-31-32.4-57.7-58-76.4-31.9-23.4-70.4-35.7-109-42-40.7-6.6-83.4-9.2-123.6 1.2-36.8 9.5-70.8 28.2-99.9 52.6-16.6 13.9-31.5 29.6-45 46.4-7 8.7-13.7 17.7-19.9 27-3.1 4.6-6.3 9.3-9.1 14.1-2.7 4.8-4.2 10-6.5 15-15.2-3.7-32.3 1.8-44.2 12.4-5.8 5.1-11 11.2-14.3 18.3-3.7 7.8-4.3 14.4-2 22.9 1.2 4.3 3.2 8.4 6.3 11.5-1.8 3.1-2.4 6.9-1.6 10.4-6.7 2.5-13.5 5-18.1 10.9-6.5 8.2-8.5 19.6-6.9 29.9 2.4 15.5 14.2 26.1 28.8 30.6 1.5.5 3.1.9 4.5 1.6 1.4.7 2.6 1.8 3.8 2.8 5.3 4.6 10.7 9.2 16.8 12.8 7.7 4.5 16.2 6.4 25.1 5.8 6.6-.5 13.2-2.2 19.2-5.2 1.6-.8 16.2-12.2 15.5-12.5 1.2.5 2.5.9 3.8 1.2 6.7 1.3 15.5-2.4 18.5-8.8 6.9 4.6 15.5 4 23.3 1.2 12.1-4.4 25.7-12.2 33.9-23.3 2.5 2.7 7.1 4.3 10.7 4.3 7.2 0 14.6-4.6 17.1-11.4 2 1.9 4.2 3.7 6.4 5.3 8.6 6 18.8 9.4 29.2 9.9 9.1.4 18.3-1.2 26.9-4.2 4.5-1.6 8.9-3.6 13-6.1 2.7-1.6 6.9-6.5 10.2-5.1 1.2.5 2.2 1.5 3.2 2.4 6.3 5.7 14.4 10.2 22.7 12.1 8.9 2 18 .6 26.5-2.2 4.3-1.4 6.9-2.9 11.4-1.8 3.9.9 8.1 2.5 11.4 4.9 2.8 2.1 4.6 5.2 7.3 7.4 3.3 2.7 8.3 5.4 12.3 7 10.6 4.3 23.7 5.7 34.3.5 8.6 8.7 19.7 14.8 31.7 17.4 4.4 28.9 17.8 53.5 36.4 75.9 8.9 10.7 18.8 20.8 30.6 28.1 12.5 7.7 25.3 10.6 39.7 12.4.3 0 .6.1.7.3.1.1.1.3.1.4 1.4 10.8 3.4 21.6 6.9 31.9 4.7 13.7 12.8 26.3 23.7 35.8 22.4 19.6 54.9 25.4 82.7 15.1.6-.2 1.1-.6 1.4-1.1 5.8 1.1 11.8.8 17.7-1.3 15.1-5.4 31.7-16.1 38.4-31.1v-.1c3-4.8-4.6-10.6-12.1-14 1-.1 1.9-.2 2.9-.3 14.5-2 28.4-8.2 38.4-18.2z"/><path d="M523.8 420.4c-8 2.8-16.4 2.1-23.5-2.6-4.2-2.8-7.3-6.5-8.9-11.4-.7-2-.9-3.7-1.7-5.4-.1-2.1-2.2-4.1-4.4-2.6-7.5 5-14.9 9-24.3 8.7-4.5-.2-22.8-4.4-25.1-11.6 2.9-.5 5.6-1.8 7.8-4 2.8-2.7-1.1-6.6-4.1-4.3-9 6.7-26.7-1.4-27.4-12.7 0-.5-.9-.8-1-.2-.8 3.8-.1 7.4 1.7 10.5-10.8 3.4-21.8 7.7-33.2 5.2-9.4-2.1-17-7.8-23-15-2.6-3.1 0-5.8 1.7-8.6.5-.9 1-2.1.4-2.9h-1.1c-.2 0-2.5 4.1-2.9 4.6-1.7 2-3.8 3.5-5.8 5.2-4.8 4.2-10.3 7.6-16.2 10.2-11.6 5.2-25.1 7.7-37.7 5.1-7.7-1.6-14.8-5-21.1-9.7-3.3-2.5-6.3-5.3-9.2-8.2-2.6-2.5-5.5-5.3-8.5-7.3-.2 1.8.8 3.4 1.8 5 1.9 2.9 4 5.4 3.4 9-.6 4.1-5.3 8.1-9 9.2-2.5.7-8.4.6-11.4-1.7 2.1-3.5 3.7-7.4 4.4-11.5.6-3.3-4.1-4.9-5.2-1.6-4.3 13-13.7 21.4-25.7 27.4-11.6 5.8-41 9.8-39.8-11.3 0-.8-1.2-1-1.4-.2-2.2 6.7-1.1 13.3 3.1 18.5-3.8 3.7-6.8 7.4-13 6.5-5.3-.7-10.2-5.7-12.4-10.4-.3-.6-1-.2-1.1.3-.6 4.6.9 8.8 3.7 11.9-10.1 9-22 15.6-36.1 14.3-12.8-1.2-23.6-7.8-31.4-17.6 2.7-.8 5.4-1.9 8.1-3.5 3.6-2.1 1.3-7.1-2.6-6.5-8.6 1.3-17.2 5.2-25.2-.3-6.7-4.6-10.4-12.5-11.3-20.3-1.5-12.5 4.4-30.3 16.9-35.1.9 2.4 2.3 4.7 4.6 6.6 1.1.9 2.7-.1 2.1-1.5-4.9-10-2.3-19.3 8.2-23.5 2.9-1.2.9-5.7-2-5-3.5.9-6.5 2.8-8.8 5.4-2.8-6.7-5.4-13.9-4.4-21.2 1.4-10.2 9.2-18.8 16.9-25 8.1-6.6 18.2-10.3 28.7-9.5 7.3.6 21.3 3.7 24.4 11.4 1.9 4.6 2.1 8.4 6 12 .8.7 1.9-.1 1.4-1.1-6.1-13.4 11.5-28.9 22.7-32 13.1-3.6 20.6 3.8 30.1 10.9 1.7 1.3 4.4-.7 3.8-2.8-1-3.3-2.8-6-5-8.3 11.5-17.1 40-15.1 56-5.8-.8 3.2-.9 6.4.2 9.3.4 1.1 1.8 1.4 2.5.4 2.2-3.2 2.5-6.8 3.9-10.3 2-4.9 5-9.5 8.7-13.4 7.2-7.5 16.9-11.9 27.1-13.6 18.4-2.9 44.1 3 49.6 23.5 0 .1.1.2.1.3-1.4 1.6-2.1 3.4-1.3 5.6 0 .1.1.2.2.2 3.7.1 7.1-3.4 10.7-4.2 6.2-1.5 11.1 1.8 15.2 6 2.4 2.4 6.4-.5 4.8-3.5-2.2-4.1-6.1-7.1-10.5-8.5 11.9-12.7 31.7-16.8 48.5-12.9 17.9 4.1 28 16.1 34.5 32.3-2.3.7-4.6 2-6.6 3.9-1.4 1.3.2 3.3 1.6 3 6-.7 10.9-2.3 16.9.1 5.4 2.2 8.7 6.3 11.2 11.4 1.4 2.9 6.5 1 5.4-2.1-.8-2.2-2-4.4-3.6-6.4l.3-.3c7.1-10 23-11.5 34.1-8.3 11.4 3.4 19.5 12.3 21.7 23.9 0 .2.1.4.2.5-1.8 1.2-3.2 3-3.8 5.5-.1.2.1.4.3.4 2.8-.5 5.4-2 8.2-2.6 4.7-1 9.4.3 13.3 3 7 4.9 9.5 12.8 5.6 20.6-1.1 2.1 1.6 4.8 3.5 2.8 2.7-2.7 4-6 4.3-9.3 8.5-.5 16.2.7 22.1 8 1.6 2 3 4.3 4 6.7 0 .1 0 .3.1.4 2.5 5.9 2.2 11.4-1.9 16.4-.1.1-.2.3-.2.4-2.9.7-2.7 5.1.6 5.5 18.2 2 25.9 16.7 21.1 33.8-3.7 13.2-13.7 19.3-25.2 24.7-.8-1.9-1.9-3.8-3.3-5.6-.9-1.2-2.7.3-2.1 1.5 7.9 16.1-4.1 32.8-20.2 36.1-12.5 2.6-29.7-4.4-31.2-16.9.4-.8.3-1.8-.1-2.7.2-2.5.9-5.2 2.5-8.1.4-.8-.6-1.8-1.3-1.1-2.4 2.5-3.8 5.1-4.7 7.9z" class="st0"/><path d="M598.3 533.5c9.4-1 18.3-7.2 24-14.7.1-.1-.1-.2-.1-.2-9.4 6.6-22.4 14.5-34.1 9.2-2.7-1.2-5.1-3-7.4-4.8-10-8-19.1-16.2-27.4-26.1-9.6-11.4-17.5-23.7-23.2-37.3 5.7 4.9 12.9 7.7 20.5 6 .2 0 .2-.3 0-.4-9.4-3.7-17.9-7.7-24.1-15.2-.2-.6-.4-1.2-.6-1.9-1-3.2-1.8-6.8-1.6-10.2 0-.3.1-.6.2-.9.6-.8 1.9 0 2.5.8 3.1 3.9 6.2 7.9 11.1 9.2 5.7 1.6 11.6 2.5 17.5 1.8 9.7-1.1 19.1-6.4 24.9-14.3 2.6-3.6 4.9-8.3 5.2-12.9.2-3.4.6-7.8 4.1-9.6 2.9-1.5 6.3-1.3 9.4-3.1 5.2-3.1 9-8 11.6-13.4 5.2-11 6-25.1.7-36.2-3.1-6.4-8.4-11.5-15.4-13.4 5.8-7.3-.3-22.7-5-28.7-3.3-4.1-8.1-4.9-9.9-10.3-1.2-3.7-2.3-11-1.6-14.7 2.3-12.3 2.1-25.9-.7-38.4-1-11.3-5.2-22.2-13.4-29.6-.3-.2-.7 0-.6.3 1.9 7.4 8.3 17.6 6.1 25.3-.1.3-.2.6-.4.8-.4.5-1.1.5-1.7.3-.6-.2-1-.7-1.4-1.2-3.1-3.7-4.5-9.7-6.8-14.1-2.5-4.9-5.2-9.6-8.2-14.2-5.9-9-12.9-17.3-20.9-24.5-.3-.3-.9.1-.6.5 1.3 1.9 2.6 3.8 3.8 5.7 8.7 15.5 17.3 31 22.5 48.1 1.6 5.2 2.7 10.3 1.5 15.7-.1.6-.3 1.2-.7 1.6-.5.5-1.4.6-2.1.4-.7-.2-1.3-.7-1.9-1.1-6.8-5.3-12.1-12-18.9-17.3-6.6-5.2-13.7-9.8-21.2-13.7-.9-.5-1.9-1-2.9-.7 0 .9.9 1.6 1.7 2.1 6.4 4.6 11 10.7 16.6 16 7.4 8 15.5 17.5 17.5 28.5.3 1.6.3 3.6-1 4.6-.4.3-.9.5-1.4.6-4.4 1-7.4-2.1-9.1-5.6-1.8-3.6-3.7-7-6.5-10-5.6-6-13.3-9.9-21.4-11.3-11-1.9-30.3-.2-35.3 12-4.5-3.9-10.2-6.6-15.8-6.7-2.4-19.4-21.3-34.5-39.6-38.1-16.9-3.4-44.6.1-51.8 18.8-1.7-.3-3.4-.3-5.2-.1-1.5.2-3.6.8-5.6 1.7-7-21.3-32.6-28.7-53.1-26.4-11.9 1.3-23.4 6.1-32 14.5-3.4 3.3-7.4 8.3-10 13.6-10.8-7-24.5-8.5-36.9-6-9.5 1.9-20.2 6.2-23.3 15.6-9.4-7.4-24.7-8.1-34.9-3.2-7.2 3.5-16 11.2-19.6 19.6-3.7-3.7-7.8-6.4-12.1-8.3.3-.6.6-1.5 1.1-2.4 5.6-9.3 10.3-19.5 17.5-27.5 7.4-8.3 18.3-13.7 28-19 19.7-10.8 40.6-18.2 62.2-24.5.1 0 0-.1 0-.1-23.2 3.7-45.9 12-66.9 22.6-5.5 2.8-11.2 5.8-16.5 9.4l1.5-2.1c11.2-15.3 23.8-29.7 37.5-42.9 13.7-13.1 28.6-25.6 45.4-34.5 18.9-10 39.8-17.9 61.1-19.2 15.7-1 30.9 1 46 5.2 1.1.3 1.6-1.3.5-1.7-15.3-5.4-31.7-8-47.9-7.6-7 .2-14 1.1-20.8 2.7 3.4-1.4 6.8-2.7 10.3-3.9 37.3-12.9 75.8-13.6 114.8-9.5 39.6 4.1 79.7 13.4 114.3 33.8 34.1 20.1 58.5 49.2 72.6 86 .2.4.4.8.7 1.1 5.5 17.2 11.4 34.2 15.5 51.8 6.1 25.7 9.5 52 10.3 78.4.3 9.7.1 19.4.1 29.1-.1 9.4-.9 19.4.4 28.7 1.9 13.2-4.3 26.8-15.3 34.2-.1 0 0 .2.1.2 6.9-2.5 13.1-7.9 16.8-14.5 1.7 13.9 4.4 27.5 13.8 38.5 3.1 3.6 6.9 6.7 11.4 8.1-.2-1.4-1.3-2.4-2.3-3.5-3.5-3.5-5.9-8-8.1-12.4-.5-.9-.9-1.9-.5-2.8.9-2.4 3.4 1.1 4.3 1.7 2.3 1.6 5.1 2.6 7.8 3.3 5.3 1.5 11 1.8 16.4 2.7 20.8 3.3 11.7 32.8 1.8 42.6-10.4 10.3-26.5 16-40.8 17.6-9.8 1.1-18.7-.6-27.1-4.1z" style="fill:#be1622"/><path d="M814.8 501.4c-3.5-5.5-7.6-10.5-12-15.4-2.2-2.5-4.6-5-6.9-7.4-.9-.9-5.1-6.5-6.1-6.5 2.5-.2 5.1-.2 7.6.1 2 .3 4.2.7 6.1-.1.3-.1.6-.3.7-.6.1-.2 0-.5-.1-.7-3.8-10.6-14.6-19.7-23.4-26-5.8-4.1-12.2-7.3-19.2-9-1.4-.3-17.4-1-13.1-5.1.4-.4 5.4-5.1 5.7-5-12-7.3-26-9.4-39.8-5.3-6.6 2-12.4 5.7-17.7 9.9-4.1 3.2-9.7 10.3-15 11.2-.4.1-1 0-1.2-.3-.1-.2-.1-.4-.1-.6.3-3.4 1.1-6.8 2.7-9.7-9.6 4.9-17.4 11.1-23.6 20.6-2.9 4.5-5.1 9.3-7.4 14.2-.4.9-.9 2.6-1.8 4 2.4.8 5 1.3 7.9 1.6 10.5.9 18.3 3.1 22.6 13.7 8.1 19.9-7.2 40.1-23.8 49.6-9.1 5.2-19.1 8.7-29.3 10 1.2 2.7.9 5.8 1.1 8.8.5 6.9 1.5 13.8 3.6 20.4 4 12.8 11.2 24.6 21 33.8 9.9 9.4 22.5 15.6 35.9 18.4 6.6 1.4 13.4 1.9 20.2 1.6 3.2-.1 9.6.3 12-2 .1-.1.3-.3.3-.5s-.2-.5-.3-.6c-3-3.1-7-5.1-9.2-8.9.2-.9 1.5-.8 2.4-.5 9.2 3.4 18.2 7.1 28.2 7.3 4.2.1 8.1-1.1 11.9-2.8 12.7-5.5 23-13.3 31.2-24.2-.1-.6.1-1.3.7-1.7 1.9-1.5-16.1-13.5-17.3-14.2-.5-.3-1.1-.9-.8-1.4 6.5 1.3 13-1.7 19.1-3.4 6.2-1.8 12.3-3.8 17.9-7.1.5-.3 1-.7 1.6-1 7.5-7.4 14.3-16.2 16.9-26.3 3.5-13-2.2-27.9-9.2-38.9zm-26 41.8c-1.9 4.2-4.4 7.6-7.7 10.6 5.6 3.6-.5 11.6-5 14.6-7.1 4.9-15.2 8.4-23.2 11.5-4 1.6-8.3 3.8-12.7 4.6 1.4 1.2 2.5 2.6 3.1 4.4.2.6-.1 1.2-.5 1.7-5.2 5.4-16 6.9-23.2 7.2-8.2.4-15.7-1.4-23.1-4.4.1 1.4-.2 2.8-1.6 3.8-2.7 2.1-6.3.4-8.9-.9-3.3-1.6-6.4-4.2-9.2-6.6-1.6-1.4-3.1-2.8-4.6-4.2-2.9-2.8-5.6-5.8-7.9-9.1-1-1.4-2-2.9-2.9-4.5-.4-.7-2.6-3.9-2-4.5.3-.3.8-.2 1.1.1 4.1 4.6 8.3 9.4 12.8 13.7 4.8 4.5 10.1 8.6 16.1 11.4.6.3 1.4.6 1.9.2.4-.3.5-.7.6-1.2.2-1 .2-2 .1-3 0-.3 0-.7.3-.8.1 0 .2 0 .3.1 3.9 1.5 7.6 3.4 11.6 4.5 4.1 1.1 8.4 1.7 12.6 1.7 4.2 0 8.4-.4 12.5-1.4 2.9-.7 15-3.6 5.1-8.1-1.5-.7-1.5-3.2.5-3.2 7.9.4 17.7-5 24.8-8.2 2.8-1.2 5.5-2.6 8.2-4 1.4-.8 18-11.3 9.4-13.4-1.6-.4-1.4-2.4-.3-3.2 4.1-3 6.8-6.5 9.3-10.8.7-1.1 3.1-.1 2.5 1.4z" class="st0"/></svg>';
