// eslint-disable-next-line no-unused-vars
/* global createSwitch, gptSVG, getUserSystemMessage, setUserSystemMessage, profileDropdown, profileDropdownButton, handleQueryParams, updateOutOfDateConversation, notSelectedClassList, runningPromptChainSteps:true, runningPromptChainIndex:true, replaceTextAreaElemet, showHideTextAreaElement, initializeNavbar, replacePageContent, languageList, writingStyleList, toneList, getExamplePrompts, addInputFormActionWrapper, getGizmoUserActionSettings */

// eslint-disable-next-line no-unused-vars
function showNewChatPage(gizmoResource = null, shouldResetSearch = true) {
  if (shouldResetSearch) {
    // clear search box
    const searchBox = document.querySelector('#conversation-search');
    if (searchBox?.value) {
      searchBox.value = '';
      searchBox.dispatchEvent(new Event('input'), { bubbles: true });
    }
  }
  if (gizmoResource) {
    getGizmoUserActionSettings(gizmoResource.gizmo.id, true);
  }
  // update out of date conversation
  updateOutOfDateConversation();

  const targetPath = gizmoResource ? `/g/${gizmoResource.gizmo?.short_url}` : '/';
  if (true) {
    window.location.href = `https://chat.openai.com${targetPath}`;
    return;
  }
  // chatStreamIsClosed = true;
  chrome.storage.local.get(['conversationsAreSynced', 'settings', 'models', 'unofficialModels', 'customModels'], (result) => {
    const pluginDropdownButton = document.querySelector('#navbar-plugins-dropdown-button');
    if (pluginDropdownButton) {
      pluginDropdownButton.disabled = false;
      pluginDropdownButton.style.opacity = 1;
      pluginDropdownButton.title = '';
    }

    const {
      conversationsAreSynced, settings, models, unofficialModels, customModels,
    } = result;
    const {
      selectedLanguage, selectedModel, selectedTone, selectedWritingStyle, showExamplePrompts, autoResetTopNav,
    } = settings;
    const allModels = [...models, ...unofficialModels, ...customModels];
    const newSelectedModel = gizmoResource ? allModels.find((m) => m.slug === 'gpt-4-gizmo') : selectedModel;

    chrome.storage.local.set({
      settings: {
        ...settings,
        selectedModel: newSelectedModel,
        autoClick: false,
        selectedLanguage: autoResetTopNav ? languageList.find((language) => language.code === 'default') : selectedLanguage,
        selectedTone: autoResetTopNav ? toneList.find((tone) => tone.code === 'default') : selectedTone,
        selectedWritingStyle: autoResetTopNav ? writingStyleList.find((writingStyle) => writingStyle.code === 'default') : selectedWritingStyle,
      },
    }, () => {
      if (autoResetTopNav) {
        document.querySelectorAll('#language-list-dropdown li')?.[0]?.click();
        document.querySelectorAll('#tone-list-dropdown li')?.[0]?.click();
        document.querySelectorAll('#writing-style-list-dropdown li')?.[0]?.click();
      }
      document.querySelector('#auto-click-button')?.classList?.replace('btn-primary', 'btn-neutral');
    });
    runningPromptChainSteps = undefined;
    runningPromptChainIndex = 0;
    document.title = `ChatGPT ${gizmoResource ? ` - ${gizmoResource?.gizmo?.display?.name}` : ''}`;
    if (!conversationsAreSynced) return;
    const focusedConversations = document.querySelectorAll('.selected');
    focusedConversations.forEach((c) => {
      c.classList = notSelectedClassList;
    });
    const { href, search } = new URL(window.location.toString());
    if (href !== `https://chat.openai.com${targetPath}`) {
      window.history.replaceState({}, '', `https://chat.openai.com${targetPath}`);
    }
    replacePageContent(newChatPage(gizmoResource));

    initializeNavbar();
    const pinNav = document.querySelector('#pin-nav');
    if (pinNav) {
      pinNav.remove();
    }
    let textAreaElement = document.querySelector('main form textarea');
    if (!textAreaElement) {
      replaceTextAreaElemet(settings);
      textAreaElement = document.querySelector('main form textarea');
    }

    textAreaElement.focus();
    const tempVal = textAreaElement.value;
    textAreaElement.value = '';
    textAreaElement.value = tempVal;

    showHideTextAreaElement();
    if (showExamplePrompts) {
      if (gizmoResource) {
        const examplePrompts = {
          items: gizmoResource?.gizmo?.display?.prompt_starters.map((prompt) => ({
            title: prompt,
            description: '',
            prompt,
          })),
        };
        loadExamplePrompts(examplePrompts);
      } else {
        getExamplePrompts().then((examplePrompts) => {
          loadExamplePrompts(examplePrompts);
        });
      }
    }
    handleQueryParams(search);
  });
}

function headerContent(gizmoResource = null) {
  const title = gizmoResource ? gizmoResource?.gizmo?.display?.name : 'How can I help you today?';
  const subtitle = gizmoResource ? gizmoResource?.gizmo?.display?.description : '';
  const creator = gizmoResource ? gizmoResource?.gizmo?.author?.display_name || 'community builder' : '';
  const authorLink = gizmoResource ? gizmoResource?.gizmo?.author?.link_to || '' : '';
  const logo = gizmoResource ? `<img src="${gizmoResource?.gizmo?.display?.profile_picture_url}" class="h-full w-full bg-token-surface-secondary dark:bg-token-surface-tertiary" alt="GPT" width="80" height="80">` : gptSVG;
  const creatorElement = authorLink ? `<a href="${authorLink}" target="_blank" class="underline">${creator}</a>` : creator;
  const creatorTooltipName = (creator && creator !== 'community builder') ? creator : `${title}'s builder`;
  return `<div class="mb-3 h-[72px] w-[72px]"><div id="header-gizmo-logo" class="gizmo-shadow-stroke relative flex h-full items-center justify-center rounded-full bg-white text-black overflow-hidden">${logo}</div></div><div class="flex flex-col items-center gap-0 p-2"><div id="header-gizmo-title" class="text-center text-2xl font-medium">${title}</div>${gizmoResource ? `<div id="header-gizmo-subtitle" class="max-w-md text-center text-xl font-normal text-token-text-secondary">${subtitle}</div><div class="mt-1 flex items-center gap-1 text-token-text-tertiary"><div id="header-gizmo-creator" class="text-sm text-token-text-tertiary">By ${creatorElement}</div><span title="${creatorTooltipName} can't view your chats" class="pt-[1px]" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-xs"><path d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V12Z" fill="currentColor"></path><path d="M12 9.5C12.6904 9.5 13.25 8.94036 13.25 8.25C13.25 7.55964 12.6904 7 12 7C11.3096 7 10.75 7.55964 10.75 8.25C10.75 8.94036 11.3096 9.5 12 9.5Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" fill="currentColor"></path></svg></span></div>` : '<div class="h-10"></div>'}</div>`;
}
function suggestionColumn(suggestions, columnNumber = 0) {
  return suggestions.map((suggestion, index) => `${suggestion?.title ? `<span data-projection-id="107" style="opacity: 1; transform: none;"><button id="prompt-starter-${columnNumber * 2 + index}" class="btn relative btn-neutral group w-full whitespace-nowrap rounded-xl text-left text-gray-700 dark:text-gray-300 md:whitespace-normal" as="button"><div class="flex w-full gap-2 items-center justify-center"><div class="flex w-full items-center justify-between"><div class="flex flex-col overflow-hidden"><div class="truncate font-normal">${suggestion?.title}</div><div class="truncate opacity-50">${suggestion?.description || ''}</div></div><div class="absolute bottom-0 right-0 top-0 flex items-center rounded-xl bg-gradient-to-l from-gray-100 from-[60%] pl-6 pr-2 text-gray-700 opacity-0 group-hover:opacity-100 dark:from-gray-700 dark:text-gray-200"><span class="" data-state="closed"><div class="rounded-lg bg-token-surface-secondary p-1"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="icon-sm text-token-text-primary"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></span></div></div></div></button></span>` : ''}`).join('');
}
function loadExamplePrompts(examplePrompts) {
  // randomize the order of the example prompts
  examplePrompts.items.sort(() => Math.random() - 0.5);
  const existingSuggestionsWrapper = document.querySelector('#suggestions-wrapper');
  if (existingSuggestionsWrapper) existingSuggestionsWrapper.remove();
  const suggestionsWrapper = `<div id="suggestions-wrapper" class="grow" style="z-index:1000;"><div class="absolute bottom-full left-0 mb-4 flex w-full grow gap-2 pb-1 sm:pb-0 md:static md:mb-0 md:max-w-none"><div class="grid w-full grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2"><div class="flex flex-col gap-2">${suggestionColumn([examplePrompts.items[0], examplePrompts.items[2]], 0)}</div><div class="flex flex-col gap-2">${suggestionColumn([examplePrompts.items[1], examplePrompts.items[3]], 1)}</div></div></div></div>`;

  // check if still on new chat page
  const { pathname } = new URL(window.location.toString());
  if (pathname === '/' || pathname.startsWith('/g/g-')) {
    const inputFormActionWrapper = addInputFormActionWrapper();
    if (inputFormActionWrapper) {
      inputFormActionWrapper.innerHTML = '';
      inputFormActionWrapper.insertAdjacentHTML('beforeend', suggestionsWrapper);
      const suggestions = document.querySelectorAll('#suggestions-wrapper [id^="prompt-starter-"]');
      suggestions.forEach((suggestion) => {
        const suggestionIndex = suggestion.id.split('-').pop();
        suggestion.addEventListener('click', () => {
          const textAreaElement = document.querySelector('main form textarea');
          textAreaElement.value = examplePrompts.items[suggestionIndex].prompt;
          // remove all suggestion buttons
          const curSuggestionsWrapper = document.querySelector('#suggestions-wrapper');
          if (curSuggestionsWrapper) curSuggestionsWrapper.remove();
          // click the submit button
          textAreaElement.focus();
          textAreaElement.dispatchEvent(new Event('input', { bubbles: true }));
          textAreaElement.dispatchEvent(new Event('change', { bubbles: true }));
          setTimeout(() => {
            const submitButton = document.querySelector('main form textarea ~ button');
            submitButton.click();
          }, 100);
        });
      });
    }
  }
}
// eslint-disable-next-line no-unused-vars
function newChatPage(gizmoResource = null) {
  const outerDiv = document.createElement('div');
  outerDiv.classList = 'h-full dark:bg-gray-800';
  outerDiv.style = 'scroll-behavior: smooth;';

  const innerDiv = document.createElement('div');
  innerDiv.classList = 'flex flex-col items-center text-sm h-full dark:bg-gray-800;';
  outerDiv.appendChild(innerDiv);

  const body = document.createElement('div');
  body.classList = 'text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100';
  innerDiv.appendChild(body);

  const header = document.createElement('div');
  header.classList = 'text-5xl font-semibold text-center mt-10 ml-auto mr-auto mb-10 flex flex-col gap-2 items-center justify-center';
  header.innerHTML = headerContent(gizmoResource);
  body.appendChild(header);

  const content = document.createElement('div');
  content.classList = 'flex items-center justify-center text-center gap-3.5';
  body.appendChild(content);

  const settings = document.createElement('div');
  settings.id = 'new-page-settings';
  settings.classList = 'flex flex-col items-start justify-end border border-gray-500 rounded-md p-4';
  settings.style = 'width: 600px;';
  content.appendChild(settings);
  settings.style.minHeight = '260px';
  // custom instruction settings
  const customInstructionSettings = customInstructionSettingsElement();
  settings.appendChild(customInstructionSettings);

  // divider
  const divider = document.createElement('div');
  divider.classList = 'border border-gray-500';
  divider.style = 'width: 70%; height: 1px; background-color: #e5e7eb; margin: 16px auto;';
  settings.appendChild(divider);

  const saveHistorySwitch = createSwitch('<span style="color:#8e8ea0 !important;">Chat History & Training</span>', '<div class="text-left">Save new chats to your history and allow them to be used to improve ChatGPT via model training. Unsaved chats will be deleted from our systems within 30 days. <a href="https://help.openai.com/en/articles/7730893" target="_blank" class="underline" rel="noreferrer">Learn more</a></div>', 'saveHistory', true);
  settings.appendChild(saveHistorySwitch);
  const bottom = document.createElement('div');
  bottom.classList = 'w-full h-32 md:h-48 flex-shrink-0';
  innerDiv.appendChild(bottom);

  return outerDiv;
}
function toggleCustomInstructionSettings(checked) {
  chrome.storage.local.get(['customInstructionProfiles'], (result) => {
    const { customInstructionProfiles } = result;
    const selectedProfile = customInstructionProfiles.find((p) => p.isSelected);
    setUserSystemMessageCallback(checked, selectedProfile);
  });
}
function customInstructionSettingsElement() {
  const { pathname } = new URL(window.location.toString());
  const customInstructionSettings = document.createElement('div');
  customInstructionSettings.id = 'custom-instruction-settings';
  customInstructionSettings.classList = `relative flex items-start justify-between w-full ${pathname === '/' ? '' : 'opacity-50 pointer-events-none'}`;
  customInstructionSettings.style.height = '96px';
  const customInstructionSettingsOverlay = document.createElement('div');
  customInstructionSettingsOverlay.style = 'position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.8);z-index:1;border-radius: 8px;';
  // add 'Custom Instruction is only available on the main page' to the overlay
  const customInstructionSettingsOverlayText = document.createElement('div');
  customInstructionSettingsOverlayText.style = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:16px;font-weight:500;color:#fff;';
  customInstructionSettingsOverlayText.innerHTML = 'Custom Instructions are only available with the default ChatGPT';
  customInstructionSettingsOverlay.appendChild(customInstructionSettingsOverlayText);
  if (pathname !== '/') {
    customInstructionSettings.appendChild(customInstructionSettingsOverlay);
  }

  const customInstructionSettingsLeft = document.createElement('div');
  customInstructionSettingsLeft.style = 'width: 60%;';
  const customInstructionSettingsRight = document.createElement('div');
  customInstructionSettingsRight.style = 'width: 40%;display:flex;justify-content:flex-end;';
  customInstructionSettings.appendChild(customInstructionSettingsLeft);
  customInstructionSettings.appendChild(customInstructionSettingsRight);
  getUserSystemMessage().then((systemMessage) => {
    const customInstructionSwitch = createSwitch('<span style="color:#8e8ea0 !important;">Custom Instruction</span>', '<div class="text-left"><a href="https://www.youtube.com/watch?v=5IzCehR0Hok&ab_channel=Superpower" target="_blank" class="underline" rel="noreferrer">Learn more</a> about Custom instructions and how they’re used to help ChatGPT provide better responses.</div>', null, systemMessage.enabled, toggleCustomInstructionSettings);
    customInstructionSettingsLeft.appendChild(customInstructionSwitch);
    chrome.storage.local.get(['customInstructionProfiles'], (result) => {
      const { customInstructionProfiles, customInstructionProfileIsEnabled } = result;
      let newCustomInstructionProfiles = customInstructionProfiles;
      const selectedProfile = customInstructionProfiles.find((p) => p.isSelected);
      if (!selectedProfile || selectedProfile.aboutUser.replace(/[^a-zA-Z]/g, '') !== systemMessage?.about_user_message?.replace(/[^a-zA-Z]/g, '') || selectedProfile.aboutModel.replace(/[^a-zA-Z]/g, '') !== systemMessage?.about_model_message?.replace(/[^a-zA-Z]/g, '')) {
        newCustomInstructionProfiles = customInstructionProfiles.map((p) => {
          if (p.aboutModel.replace(/[^a-zA-Z]/g, '') === systemMessage?.about_model_message?.replace(/[^a-zA-Z]/g, '') && p.aboutUser.replace(/[^a-zA-Z]/g, '') === systemMessage?.about_user_message?.replace(/[^a-zA-Z]/g, '')) {
            return { ...p, isSelected: true };
          }
          if (p.isSelected) {
            return { ...p, isSelected: false };
          }
          return p;
        });

        chrome.storage.local.set({ customInstructionProfiles: newCustomInstructionProfiles, customInstructionProfileIsEnabled: systemMessage.enabled });
      } else {
        chrome.storage.local.set({ customInstructionProfileIsEnabled: systemMessage.enabled });
      }

      const profileButtonWrapper = document.createElement('div');
      profileButtonWrapper.style = 'position:relative;width: 200px;margin-top:8px;';
      profileButtonWrapper.id = 'custom-instructions-profile-button-wrapper-new-page';
      if (!systemMessage.enabled) {
        profileButtonWrapper.style.pointerEvents = 'none';
        profileButtonWrapper.style.opacity = '0.5';
      }

      profileButtonWrapper.appendChild(profileDropdown(newCustomInstructionProfiles, customInstructionProfileIsEnabled, 'new-page'));
      profileButtonWrapper.appendChild(profileDropdownButton(newCustomInstructionProfiles, 'new-page'));
      customInstructionSettingsRight.appendChild(profileButtonWrapper);
    });
  });
  return customInstructionSettings;
}
function setUserSystemMessageCallback(checked, systemMessage) {
  const profileButtonWrapper = document.getElementById('custom-instructions-profile-button-wrapper-new-page');
  if (checked) {
    profileButtonWrapper.style.pointerEvents = 'unset';
    profileButtonWrapper.style.opacity = '1';
  } else {
    profileButtonWrapper.style.pointerEvents = 'none';
    profileButtonWrapper.style.opacity = '0.5';
  }
  if (!systemMessage) return;

  setUserSystemMessage(systemMessage.aboutUser, systemMessage.aboutModel, checked);
}
