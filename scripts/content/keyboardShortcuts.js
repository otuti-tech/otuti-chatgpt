// eslint-disable-next-line no-unused-vars
/* global isWindows, createModal, settingsModalActions, initializePluginStoreModal, addPluginStoreEventListener, volumeIconInterval, speakingMessageId:true, showNewChatPage, createPromptChainListModal, toast */

// eslint-disable-next-line no-unused-vars
function createKeyboardShortcutsModal(version) {
  const bodyContent = keyboardShortcutsModalContent(version);
  const actionsBarContent = keyboardShortcutsModalActions();
  createModal('Keyboard Shortcuts', 'Some shortkeys only work when Auto-Sync is ON. Having issues? see our <a href="https://ezi.notion.site/Superpower-ChatGPT-FAQ-9d43a8a1c31745c893a4080029d2eb24" target="_blank" rel="noopener noreferrer" style="color:gold;">FAQ</a>', bodyContent, actionsBarContent);
}
function buttonGenerator(buttonTexts) {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const newButtonTexts = buttonTexts.map((buttonText) => {
    if (!isMac && buttonText.includes('⌘')) {
      buttonText = buttonText.replace('⌘', 'CTRL');
    }
    if (!isMac && buttonText.includes('⌥')) {
      buttonText = buttonText.replace('⌥', 'Alt');
    }
    return buttonText;
  });
  return `<div class="flex flex-row gap-2">
  ${newButtonTexts.map((buttonText) => `<div class="my-2 flex h-8 items-center justify-center rounded-[4px] border capitalize border-white/20 text-gray-100 ${buttonText.length > 1 ? 'min-w-[50px]' : 'min-w-[32px]'}"><span class="text-sm">${buttonText}</span></div>`).join('')}
  </div>`;
}
function keyboardShortcutsModalContent() {
  // create newsletterList modal content
  const content = document.createElement('div');
  content.id = 'modal-content-keyboard-shortcuts-list';
  content.style = 'overflow-y: hidden;position: relative;height:100%; width:100%';
  content.classList = 'markdown prose-invert';
  const logoWatermark = document.createElement('img');
  logoWatermark.src = chrome.runtime.getURL('icons/logo.png');
  logoWatermark.style = 'position: fixed; top: 50%; right: 50%; width: 400px; height: 400px; opacity: 0.07; transform: translate(50%, -50%);box-shadow:none !important;';
  content.appendChild(logoWatermark);
  const keyboardShortcutsText = document.createElement('div');
  keyboardShortcutsText.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; height: 100%; width: 100%; white-space: break-spaces; overflow-wrap: break-word;padding: 16px;position: relative;z-index:10;';
  const refreshButton = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="gold" d="M468.9 32.11c13.87 0 27.18 10.77 27.18 27.04v145.9c0 10.59-8.584 19.17-19.17 19.17h-145.7c-16.28 0-27.06-13.32-27.06-27.2c0-6.634 2.461-13.4 7.96-18.9l45.12-45.14c-28.22-23.14-63.85-36.64-101.3-36.64c-88.09 0-159.8 71.69-159.8 159.8S167.8 415.9 255.9 415.9c73.14 0 89.44-38.31 115.1-38.31c18.48 0 31.97 15.04 31.97 31.96c0 35.04-81.59 70.41-147 70.41c-123.4 0-223.9-100.5-223.9-223.9S132.6 32.44 256 32.44c54.6 0 106.2 20.39 146.4 55.26l47.6-47.63C455.5 34.57 462.3 32.11 468.9 32.11z"/></svg>';

  keyboardShortcutsText.innerHTML = `
  <table style="width:100%; color: white !important;">
    <tr>
      <th>Shortcut</th>
      <th>Action</th>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'F'])}</td>
      <td>Search Chats/Custom GPTs (To use browser search, press twice)</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', '.'])}</td>
      <td>Open Settings</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', '⌫'])}</td>
      <td>Delete Current Conversation</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'S'])}</td>
      <td>Toggle Sidebar</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'P'])}</td>
      <td>Open Plugin Store</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', '⌥', 'Y'])}</td>
      <td>Open Gallery</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'L'])}</td>
      <td>Open Newsletter Archive</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'X'])}</td>
      <td>Open Prompt Chain List (or SHIFT + Click on New Prompt Chain button <span style="display:inline-block;width:32px;height:24px;"><img src="${chrome.runtime.getURL('icons/new-prompt-chain.png')}"></span>)</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', '⌥', 'C'])}</td>
      <td>Open New Prompt Chain Modal</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'K'])}</td>
      <td>Open Keyboard Shortcut Modal</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', '⌥', 'H'])}</td>
      <td>Hide/Show the Sidebar</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', '⌥', 'S'])}</td>
      <td>Enable/Disable Auto Splitter</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', '⌥', 'A'])}</td>
      <td>Enable/Disable Auto-Sync</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', `<span class="text-sm flex items-center justify-center" style="min-width:100px;">Click on <span style="display:inline-block;margin-left:8px;"><img class="w-4 h-4" src="${chrome.runtime.getURL('icons/new-folder.png')}"></span></span>`])}</td>
      <td>Reset the order of chats from newest to oldest (removes all folders)</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', `<span class="text-sm flex items-center justify-center" style="min-width:100px;">Click on <span style="display: inline-block;width:12px;height:12px;margin-left:8px;">${refreshButton}</span></span>`])}</td>
      <td>Reset Auto Sync</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌥', 'Shift', 'N'])}</td>
      <td>Open New Chat Page</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'C'])}</td>
      <td>Copy last response</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', '⌥', 'C'])}</td>
      <td>Copy last response (HTML)</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'M'])}</td>
      <td>Copy last response (Markdown)</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['Home'])}</td>
      <td>Scroll to top</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['End'])}</td>
      <td>Scroll to Bottom</td> 
    </tr>
    <tr>
      <td>${buttonGenerator(['Esc'])}</td>
      <td>Close Modals/Stop Generating</td>
    </tr>
  </table>
  `;
  content.appendChild(keyboardShortcutsText);
  return content;
}

function keyboardShortcutsModalActions() {
  return settingsModalActions();
}
function showPluginStore() {
  chrome.storage.local.get(['allPlugins'], (result) => {
    const { allPlugins } = result;
    const popularPlugins = allPlugins.filter((plugin) => plugin.categories.map((c) => c?.id).includes('most_popular'));
    const pluginStoreModal = initializePluginStoreModal(popularPlugins);
    const pluginStoreWrapper = document.createElement('div');
    pluginStoreWrapper.id = 'plugin-store-wrapper';
    pluginStoreWrapper.classList = 'absolute inset-0 z-10';
    pluginStoreWrapper.innerHTML = pluginStoreModal;
    document.body.appendChild(pluginStoreWrapper);
    addPluginStoreEventListener(popularPlugins);
  });
}
function registerShortkeys() {
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || (isWindows() && e.ctrlKey)) {
      const onDiscoveryPage = window.location.pathname.includes('/gpts');
      if (e.key === 'f' || e.key === 'F') {
        let searchbox = document.querySelector('#gizmo-search-bar');
        if (!onDiscoveryPage) {
          searchbox = document.querySelector('#conversation-search');
          searchbox?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (searchbox && searchbox !== document.activeElement) {
          searchbox.focus();
          e.preventDefault();
        }
      }
    }
    // esc
    if (e.keyCode === 27) {
      // stop speaking
      speechSynthesis.cancel();
      clearInterval(volumeIconInterval);
      speakingMessageId = '';
      const allTextToSpeechButtons = document.querySelectorAll('[id^="text-to-speech-button-"]');
      allTextToSpeechButtons.forEach((b) => {
        const volumeIcon = b.querySelector('svg > path');
        volumeIcon.style.fill = 'currentColor';
      });
      // close modals
      if (document.querySelector('[id*=close-button]')) {
        document.querySelector('[id*=close-button]').click();
      } else if (document.querySelector('[id*=cancel-button]')) {
        document.querySelector('[id*=cancel-button]').click();
      } else if (document.querySelector('#quick-access-menu')) {
        document.querySelector('#quick-access-menu').remove();
        document.querySelector('#prompt-textarea').focus();
      } else {
        const stopGeneratingResponseButton = document.querySelector('#stop-generating-response-button');
        if (stopGeneratingResponseButton) {
          e.preventDefault();
          stopGeneratingResponseButton.click();
        }
      }
    }
    // shift key
    if (e.keyCode === 16) {
      const allMoveToFolderButtons = document.querySelectorAll('[id^=move-to-folder-]');
      if (allMoveToFolderButtons.length > 0) {
        allMoveToFolderButtons.forEach((button) => {
          // replace innerHTML with new innerHTML
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" stroke-width="2" viewBox="0 0 512 512"><path d="M464 96h-192l-64-64h-160C21.5 32 0 53.5 0 80v352C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM336 311.1H175.1C162.7 311.1 152 301.3 152 288c0-13.26 10.74-23.1 23.1-23.1h160C349.3 264 360 274.7 360 288S349.3 311.1 336 311.1z"/></svg>';
        });
      }
    }
    // right arrow
    if (e.keyCode === 39) {
      const dalleCarousel = document.querySelector('#dalle-carousel');
      if (!dalleCarousel) return;
      const nextButton = dalleCarousel.querySelector('#carousel-thumbnail-next');
      if (nextButton) {
        nextButton.click();
      }
    }
    // left arrow
    if (e.keyCode === 37) {
      const dalleCarousel = document.querySelector('#dalle-carousel');
      if (!dalleCarousel) return;
      const prevButton = dalleCarousel.querySelector('#carousel-thumbnail-prev');
      if (prevButton) {
        prevButton.click();
      }
    }
    // cmnd + alt + y
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && !e.shiftKey && e.altKey && e.keyCode === 89) {
      e.preventDefault();
      const galleryButton = document.querySelector('#gallery-button');
      const gallery = document.querySelector('#image-gallery');
      if (galleryButton && !gallery) {
        galleryButton.click();
      }
    }

    // cmnd + shift + p
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && e.keyCode === 80) {
      e.preventDefault();
      showPluginStore();
    }
    // cmnd + shift + k
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && e.keyCode === 75) {
      e.preventDefault();
      const keyboardShortcutsModal = document.querySelector('#modal-keyboard-shortcuts');
      if (!keyboardShortcutsModal) {
        createKeyboardShortcutsModal();
      }
    }
    // cmnd + shift + ⌫
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && e.keyCode === 8) {
      e.preventDefault();
      const deleteConversationButton = document.querySelector('#conversation-setting-menu-option-delete');
      if (deleteConversationButton) {
        deleteConversationButton.click();
      }
    }
    // cmnd + alt + c
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && !e.shiftKey && e.altKey && e.keyCode === 67) {
      e.preventDefault();
      chrome.storage.local.get(['settings'], (result) => {
        const { settings } = result;
        const autoSync = typeof settings?.autoSync === 'undefined' || settings?.autoSync;
        if (autoSync) {
          const promptChainCreateModal = document.querySelector('#new-prompt-chain-modal');
          const promptChainCreateButton = document.querySelector('#prompt-chain-create-button');
          if (!promptChainCreateModal && promptChainCreateButton) {
            promptChainCreateButton.click();
          }
        }
      });
    }
    // cmnd + shift + alt + c
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && e.altKey && e.keyCode === 67) {
      e.preventDefault();
      chrome.storage.local.get(['settings'], (result) => {
        const { settings } = result;
        const autoSync = typeof settings?.autoSync === 'undefined' || settings?.autoSync;
        if (autoSync) {
          const copyButtons = document.querySelectorAll('[id^=result-html-copy-button-]');
          if (copyButtons.length > 0) {
            copyButtons[copyButtons.length - 1].click();
            toast('Last response copied to clipboard (HTML)');
          }
        }
      });
    }
    // cmnd + shift + m
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && e.keyCode === 77) {
      e.preventDefault();
      chrome.storage.local.get(['settings'], (result) => {
        const { settings } = result;
        const autoSync = typeof settings?.autoSync === 'undefined' || settings?.autoSync;
        if (autoSync) {
          const copyButtons = document.querySelectorAll('[id^=result-markdown-copy-button-]');
          if (copyButtons.length > 0) {
            copyButtons[copyButtons.length - 1].click();
            toast('Last response copied to clipboard (Markdown)');
          }
        }
      });
    }
    // cmnd + shift + x
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && e.keyCode === 88) {
      e.preventDefault();
      chrome.storage.local.get(['settings'], (result) => {
        const { settings } = result;
        const autoSync = typeof settings?.autoSync === 'undefined' || settings?.autoSync;
        if (autoSync) {
          const promptChainListModal = document.querySelector('#modal-prompt-chains');
          if (!promptChainListModal) {
            createPromptChainListModal();
          }
        }
      });
    }
    // alt + shift + n
    if (e.altKey && e.shiftKey && e.keyCode === 78) {
      e.preventDefault();
      showNewChatPage();
    }
    // cmd/ctrl + alt + A
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.altKey && e.keyCode === 65) {
      e.preventDefault();
      e.preventDefault();
      chrome.storage.local.get(['settings'], (result) => {
        const { settings } = result;
        const autoSync = typeof settings?.autoSync === 'undefined' || settings?.autoSync;
        if (autoSync) {
          settings.autoSync = false;
        } else {
          settings.autoSync = true;
        }
        chrome.storage.local.set({ settings }, () => {
          window.location.reload();
        });
      });
    }
    // cmd/ctrl + alt + S
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.altKey && e.keyCode === 83) {
      e.preventDefault();
      chrome.storage.local.get(['settings'], (result) => {
        const { settings } = result;
        settings.autoSplit = !settings.autoSplit;
        settings.autoSummarize = false;
        toast(`Auto-split is now ${settings.autoSplit ? 'ON' : 'OFF'}`);
        chrome.storage.local.set({ settings });
      });
    }
    // home key
    if (e.keyCode === 36) {
      // if active element is not the textarea, scroll to top
      if (document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.querySelector('#scroll-up-button').click();
      }
    }
    // end key
    if (e.keyCode === 35) {
      if (document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.querySelector('#scroll-down-button').click();
      }
    }
    // cmd/ctrl + shift + .
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && e.keyCode === 190) {
      if (!document.querySelector('#modal-settings')) {
        e.preventDefault();
        // open settings
        document.querySelector('#settings-button')?.click();
      }
    }
    // cmd/ctrl + shift + l
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && e.keyCode === 76) {
      if (!document.querySelector('#modal-newsletter-archive')) {
        // open newsletter
        e.preventDefault();
        document.querySelector('#newsletter-button')?.click();
      }
    }
  });
  document.addEventListener('keyup', (e) => {
    // released shift key
    if (e.keyCode === 16) {
      const allMoveToFolderButtons = document.querySelectorAll('[id^=move-to-folder-]');
      if (allMoveToFolderButtons.length > 0) {
        allMoveToFolderButtons.forEach((button) => {
          // replace innerHTML with new innerHTML
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" stroke-width="2" viewBox="0 0 512 512"><path d="M464 96h-192l-64-64h-160C21.5 32 0 53.5 0 80v352C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM336 311.1h-56v56C279.1 381.3 269.3 392 256 392c-13.27 0-23.1-10.74-23.1-23.1V311.1H175.1C162.7 311.1 152 301.3 152 288c0-13.26 10.74-23.1 23.1-23.1h56V207.1C232 194.7 242.7 184 256 184s23.1 10.74 23.1 23.1V264h56C349.3 264 360 274.7 360 288S349.3 311.1 336 311.1z"/></svg>';
        });
      }
    }
  });
}
function addKeyboardShortcutsModalButton() {
  const existingKeyboardShortcutsModalButton = document.getElementById('keyboard-shortcuts-modal-button');
  if (existingKeyboardShortcutsModalButton) existingKeyboardShortcutsModalButton.remove();

  const keyboardShortcutsModalButton = document.createElement('button');
  keyboardShortcutsModalButton.id = 'keyboard-shortcuts-modal-button';
  keyboardShortcutsModalButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 576 512" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" fill="currentColor"><path d="M64 112c-8.8 0-16 7.2-16 16V384c0 8.8 7.2 16 16 16H512c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H64zM0 128C0 92.7 28.7 64 64 64H512c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM176 320H400c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16zm-72-72c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H120c-8.8 0-16-7.2-16-16V248zm16-96h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H120c-8.8 0-16-7.2-16-16V168c0-8.8 7.2-16 16-16zm64 96c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H200c-8.8 0-16-7.2-16-16V248zm16-96h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H200c-8.8 0-16-7.2-16-16V168c0-8.8 7.2-16 16-16zm64 96c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H280c-8.8 0-16-7.2-16-16V248zm16-96h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H280c-8.8 0-16-7.2-16-16V168c0-8.8 7.2-16 16-16zm64 96c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H360c-8.8 0-16-7.2-16-16V248zm16-96h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H360c-8.8 0-16-7.2-16-16V168c0-8.8 7.2-16 16-16zm64 96c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H440c-8.8 0-16-7.2-16-16V248zm16-96h16c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H440c-8.8 0-16-7.2-16-16V168c0-8.8 7.2-16 16-16z"/></svg>';
  keyboardShortcutsModalButton.classList = 'absolute flex items-center justify-center border border-token-border-light text-token-text-secondary hover:text-token-text-primary text-xs font-sans cursor-pointer rounded-md z-10 bg-token-main-surface-primary';
  keyboardShortcutsModalButton.style = 'bottom: 3rem;right: 3rem;width: 2rem;height: 2rem;flex-wrap:wrap;';
  keyboardShortcutsModalButton.addEventListener('click', () => {
    createKeyboardShortcutsModal();
  });
  document.body.appendChild(keyboardShortcutsModalButton);
}
// eslint-disable-next-line no-unused-vars
function initializeKeyboardShortcuts() {
  registerShortkeys();
  chrome.storage.local.get(['settings'], (result) => {
    const { settings } = result;
    if (settings?.showKeyboardShortcutButton || typeof settings?.showKeyboardShortcutButton === 'undefined') {
      addKeyboardShortcutsModalButton();
    }
  });
}
