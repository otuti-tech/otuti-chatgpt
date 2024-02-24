/* global toast, defaultPrompts, createSettingsModal */
let continueButtonCursorPositionStart = 0;
let continueButtonCursorPositionEnd = 0;
function promptDropdown() {
  const dropdown = document.createElement('ul');
  dropdown.id = 'continue-conversation-dropdown-list';
  dropdown.style = 'max-height:300px;overflow-y:scroll;width:132px;bottom:40px; left:0;z-index:200;';
  dropdown.classList = 'hidden absolute z-10 right-0 mt-1 overflow-auto rounded-sm py-1 text-base ring-1 ring-opacity-5 focus:outline-none dark:ring-white/20 dark:last:border-0 sm:text-sm -translate-x-1/4 bg-token-main-surface-primary';
  dropdown.setAttribute('role', 'menu');
  dropdown.setAttribute('aria-orientation', 'vertical');
  dropdown.setAttribute('aria-labelledby', 'continue-conversation-dropdown-button');
  dropdown.setAttribute('tabindex', '-1');
  chrome.storage.local.get(['customPrompts'], (result) => {
    let { customPrompts } = result;
    if (!customPrompts) customPrompts = defaultPrompts;
    const allPrompts = [...customPrompts, { title: '+ Add more' }];
    for (let i = 0; i < allPrompts.length; i += 1) {
      const promptTitle = allPrompts[i].title;
      const promptText = allPrompts[i].text;
      const { isDefault } = allPrompts[i];
      if (isDefault) continue;
      const dropdownItem = document.createElement('li');
      dropdownItem.id = `continue-conversation-dropdown-item-${promptTitle}`;
      dropdownItem.dir = 'auto';
      dropdownItem.classList = 'text-token-text-primary relative cursor-pointer select-none border-b p-2 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary';
      const dropdownOption = document.createElement('span');
      dropdownOption.classList = 'font-semibold flex h-6 items-center gap-1 truncate text-token-text-primary';
      dropdownOption.style = 'text-transform: capitalize;';
      if (promptTitle === '+ Add more') {
        dropdownOption.classList.add('text-token-text-tertiary');
      }
      dropdownOption.innerText = promptTitle;
      dropdownOption.title = `${promptTitle}-${promptText}`;
      dropdownItem.appendChild(dropdownOption);
      dropdownItem.setAttribute('role', 'option');
      dropdownItem.setAttribute('tabindex', '-1');

      // eslint-disable-next-line no-loop-func
      dropdownItem.addEventListener('click', (e) => {
        if (promptTitle === '+ Add more') {
          createSettingsModal(7); // tab 2 is for prompts
          return;
        }
        const textAreaElement = document.querySelector('#prompt-textarea');
        textAreaElement.value = `${textAreaElement.value.slice(0, continueButtonCursorPositionStart)}${promptText} ${textAreaElement.value.slice(continueButtonCursorPositionEnd)}`;
        textAreaElement.focus();
        textAreaElement.dispatchEvent(new Event('input', { bubbles: true }));
        textAreaElement.dispatchEvent(new Event('change', { bubbles: true }));
        // put cursor at the continueButtonCursorPositionStart + promptText.length
        textAreaElement.setSelectionRange(continueButtonCursorPositionStart + promptText.length, continueButtonCursorPositionStart + promptText.length);
        if (e.shiftKey) return;
        const curSubmitButton = document.querySelector('[data-testid="send-button"]');

        setTimeout(() => {
          curSubmitButton.click();
        }, 300);
      });
      dropdown.appendChild(dropdownItem);
    }
  });

  document.addEventListener('click', (e) => {
    const continueConversationDropdown = document.querySelector('#continue-conversation-dropdown-list');
    const cl = continueConversationDropdown?.classList;
    if (cl?.contains('block') && !e.target.closest('#continue-conversation-dropdown-button')) {
      continueConversationDropdown.classList.replace('block', 'hidden');
    }
  });
  return dropdown;
}
function createContinueButton() {
  chrome.storage.local.get('settings', ({ settings }) => {
    if (!settings.showCustomPromptsButton) return;
    const existingContinueButton = document.querySelector('#continue-conversation-button-wrapper');
    if (existingContinueButton) return;
    const continueButtonWrapper = document.createElement('div');
    continueButtonWrapper.style = 'position:absolute;left:0;z-index:200;display:flex;';
    continueButtonWrapper.id = 'continue-conversation-button-wrapper';

    const continueButtonDropdown = document.createElement('button');
    continueButtonDropdown.textContent = '⋮';
    continueButtonDropdown.id = 'continue-conversation-dropdown-button';
    continueButtonDropdown.type = 'button';
    continueButtonDropdown.style = 'width:38px;border-top-right-radius:0;border-bottom-right-radius:0;z-index:2;';
    continueButtonDropdown.classList = 'btn flex justify-center gap-2 btn-neutral border ';
    continueButtonWrapper.addEventListener('mouseenter', () => {
      const textAreaElement = document.querySelector('#prompt-textarea');
      continueButtonCursorPositionStart = textAreaElement.selectionStart;
      continueButtonCursorPositionEnd = textAreaElement.selectionEnd;
    });
    continueButtonDropdown.addEventListener('click', () => {
      const dropdown = document.getElementById('continue-conversation-dropdown-list');
      if (!dropdown) return;
      if (dropdown.classList.contains('block')) {
        dropdown.classList.replace('block', 'hidden');
      } else {
        dropdown.classList.replace('hidden', 'block');
      }
    });
    const shiftClickText = document.createElement('div');
    shiftClickText.textContent = 'Shift + Click to edit before running';
    shiftClickText.style = 'font-size:10px;position:absolute;left:0px;bottom:-15px;display:none;width:200px;';
    shiftClickText.classList = 'text-token-text-tertiary';
    const continueButton = document.createElement('button');
    chrome.storage.local.get('customPrompts', ({ customPrompts }) => {
      continueButton.textContent = Array.isArray(customPrompts) ? customPrompts.find((p) => p.isDefault)?.title || 'Continue' : 'Continue';
    });
    continueButton.id = 'continue-conversation-button';
    continueButton.type = 'button';
    continueButton.dir = 'auto';
    continueButton.style = 'width:96px;border-radius:0;border-left:0;z-index:1;text-transform: capitalize;';
    continueButton.classList.add('btn', 'block', 'justify-center', 'gap-2', 'btn-neutral', 'border', 'max-w-10', 'truncate');
    continueButton.classList = 'btn block justify-center gap-2 btn-neutral border max-w-10 truncate ';

    continueButton.addEventListener('click', (e) => {
      chrome.storage.local.get('customPrompts', ({ customPrompts }) => {
        const textAreaElement = document.querySelector('#prompt-textarea');
        if (!textAreaElement) return;
        const customPromptText = Array.isArray(customPrompts) ? customPrompts.find((p) => p.isDefault)?.text || '' : 'Continue please';
        textAreaElement.value = `${textAreaElement.value.slice(0, continueButtonCursorPositionStart)}${customPromptText} ${textAreaElement.value.slice(continueButtonCursorPositionEnd)}`;
        textAreaElement.focus();
        textAreaElement.dispatchEvent(new Event('input', { bubbles: true }));
        textAreaElement.dispatchEvent(new Event('change', { bubbles: true }));
        // put cursor at the continueButtonCursorPositionStart + customPromptText.length
        textAreaElement.setSelectionRange(continueButtonCursorPositionStart + customPromptText.length, continueButtonCursorPositionStart + customPromptText.length);
        if (e.shiftKey) return;
        const curSubmitButton = document.querySelector('[data-testid="send-button"]');
        setTimeout(() => {
          curSubmitButton.click();
        }, 300);
      });
    });
    continueButton.addEventListener('mouseover', () => {
      shiftClickText.style = 'font-size:10px;position:absolute;left:0px;bottom:-15px;width:200px;';
    });
    continueButton.addEventListener('mouseout', () => {
      shiftClickText.style = 'font-size:10px;position:absolute;left:0px;bottom:-15px;display:none;width:200px;';
    });

    const autoClickButton = document.createElement('button');
    autoClickButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-width="2" viewBox="0 0 512 512" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M256 464c114.9 0 208-93.1 208-208s-93.1-208-208-208S48 141.1 48 256c0 5.5 .2 10.9 .6 16.3L1.8 286.1C.6 276.2 0 266.2 0 256C0 114.6 114.6 0 256 0S512 114.6 512 256s-114.6 256-256 256c-10.2 0-20.2-.6-30.1-1.8l13.8-46.9c5.4 .4 10.8 .6 16.3 .6zm-2.4-48l14.3-48.6C324.2 361.4 368 313.8 368 256c0-61.9-50.1-112-112-112c-57.8 0-105.4 43.8-111.4 100.1L96 258.4c0-.8 0-1.6 0-2.4c0-88.4 71.6-160 160-160s160 71.6 160 160s-71.6 160-160 160c-.8 0-1.6 0-2.4 0zM39 308.5l204.8-60.2c12.1-3.6 23.4 7.7 19.9 19.9L203.5 473c-4.1 13.9-23.2 15.6-29.7 2.6l-28.7-57.3c-.7-1.3-1.5-2.6-2.5-3.7l-88 88c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l88-88c-1.1-1-2.3-1.9-3.7-2.5L36.4 338.2c-13-6.5-11.3-25.6 2.6-29.7z"/></svg>';
    autoClickButton.id = 'auto-click-button';
    autoClickButton.type = 'button';
    autoClickButton.style = 'width:38px;border-top-left-radius:0;border-bottom-left-radius:0;border-left:0;z-index:1;padding:0;';
    autoClickButton.title = `Auto Continue is ${settings.autoClick ? 'ON' : 'OFF'}`;
    if (settings.autoClick) {
      // autoClickButton.classList.add('btn', 'flex', 'justify-center', 'gap-2', 'btn-primary', 'border');
      autoClickButton.classList = 'btn flex justify-center gap-2 btn-primary border';
    } else {
      // autoClickButton.classList.add('btn', 'flex', 'justify-center', 'gap-2', 'btn-neutral', 'border');
      autoClickButton.classList = 'btn flex justify-center gap-2 btn-neutral border ';
    }

    autoClickButton.addEventListener('click', () => {
      chrome.storage.local.get(['settings'], (result) => {
        chrome.storage.local.set({ settings: { ...result.settings, autoClick: !result.settings.autoClick } }, () => {
          if (result.settings.autoClick) {
            autoClickButton.classList.replace('btn-primary', 'btn-neutral');
            autoClickButton.classList.add('bg-token-sidebar-surface-secondary', 'hover:bg-token-main-surface-tertiary');
          } else {
            autoClickButton.classList.replace('btn-neutral', 'btn-primary');
            autoClickButton.classList.remove('bg-token-sidebar-surface-secondary', 'hover:bg-token-main-surface-tertiary');
          }
          toast(`Auto Continue is ${result.settings.autoClick ? 'Disabled' : 'Enabled (<a style="text-decoration:underline; color:gold;" href="https://www.notion.so/ezi/Superpower-ChatGPT-FAQ-9d43a8a1c31745c893a4080029d2eb24?pvs=4#ed16d04d414941d4abcb59b6d765008d" target="blank">Learn More</a>)'}`, 'success');
        });
      });
    });

    continueButtonWrapper.appendChild(shiftClickText);
    continueButtonWrapper.appendChild(continueButtonDropdown);
    continueButtonWrapper.appendChild(promptDropdown());
    continueButtonWrapper.appendChild(continueButton);
    if (settings?.autoSync) {
      continueButtonWrapper.appendChild(autoClickButton);
    }
    const inputFormActionWrapper = document.querySelector('#input-form-action-wrapper');
    if (inputFormActionWrapper) {
      inputFormActionWrapper.prepend(continueButtonWrapper);
    }
  });
}

// eslint-disable-next-line no-unused-vars
function initializeContinue() {
  // add eventlistener to chrome storage
  chrome.storage.onChanged.addListener((e) => {
    if (e.customPrompts) {
      const existingContinueButton = document.querySelector('#continue-conversation-button-wrapper');
      if (existingContinueButton) existingContinueButton.remove();
      createContinueButton();
    }
  });
}
