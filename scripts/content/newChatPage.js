// eslint-disable-next-line no-unused-vars
/* global createSwitch, gptSVG, getUserSystemMessage, setUserSystemMessage, profileDropdown, profileDropdownButton, handleQueryParams, updateOutOfDateConversation, arkoseWasInitialized, notSelectedClassList, runningPromptChainSteps:true, runningPromptChainStepIndex:true, replaceTextAreaElement, initializeNavbar, replacePageContent, languageList, writingStyleList, toneList, getExamplePrompts, getGizmoUserActionSettings, removeTextInputExtras, registerWebsocket */

// eslint-disable-next-line no-unused-vars
function showNewChatPage(gizmoResource = null, shouldResetSearch = true) {
  chrome.storage.local.get(['account', 'chatgptAccountId', 'settings', 'models', 'unofficialModels', 'customModels'], (result) => {
    const isPaid = result?.account?.accounts?.[result.chatgptAccountId || 'default']?.entitlement?.has_active_subscription || false;
    const initializedArkose = arkoseWasInitialized();

    if (!isPaid || initializedArkose) {
      registerWebsocket();
      removeTextInputExtras();
      speechSynthesis.cancel();
      // clear search box
      const searchBox = document.querySelector('#conversation-search');
      if (searchBox?.value) {
        if (shouldResetSearch) {
          searchBox.value = '';
          searchBox.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
      if (gizmoResource?.gizmo?.id) {
        getGizmoUserActionSettings(gizmoResource?.gizmo?.id, true);
      }
      // update out of date conversation
      updateOutOfDateConversation();

      const targetPath = gizmoResource?.gizmo?.short_url ? `/g/${gizmoResource.gizmo?.short_url}` : '/';
      const textAreaElement = document.querySelector('#prompt-textarea');

      if (textAreaElement && isPaid && !initializedArkose) {
        window.location.href = `https://chat.openai.com${targetPath}`;
        return;
      }
      // chatStreamIsClosed = true;
      const pluginDropdownButton = document.querySelector('#navbar-plugins-dropdown-button');
      if (pluginDropdownButton) {
        pluginDropdownButton.disabled = false;
        pluginDropdownButton.style.opacity = 1;
        pluginDropdownButton.title = '';
      }

      const {
        settings, models, unofficialModels, customModels, selectedModel,
      } = result;
      const {
        selectedLanguage, selectedTone, selectedWritingStyle, showExamplePrompts, autoResetTopNav,
      } = settings;
      const allModels = [...(models || []), ...(unofficialModels || []), ...(customModels || [])];
      const newSelectedModel = gizmoResource?.gizmo ? allModels.find((m) => m.slug === 'gpt-4-gizmo') : selectedModel;

      chrome.storage.local.set({
        selectedModel: newSelectedModel,
        settings: {
          ...settings,
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
      runningPromptChainStepIndex = 0;
      const runningPromptChainStepCount = document.querySelector('#running-prompt-chain-step-count');
      if (runningPromptChainStepCount) runningPromptChainStepCount.remove();
      document.title = `ChatGPT ${gizmoResource?.gizmo ? ` - ${gizmoResource?.gizmo?.display?.name}` : ''}`;
      // #conversation-list > [id^=conversation-button-].selected :not .hidden
      const focusedConversations = document.querySelectorAll('#conversation-list > [id^=conversation-button-].selected');
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

      replaceTextAreaElement(settings);
      if (!(searchBox.value || document.activeElement.id === 'conversation-search')) {
        textAreaElement?.focus();
        textAreaElement?.setSelectionRange(textAreaElement.value.length, textAreaElement.value.length);
      } else {
        searchBox.focus();
      }
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
    } else {
      const targetPath = gizmoResource?.gizmo?.short_url ? `/g/${gizmoResource.gizmo?.short_url}` : '/';
      window.location.href = `https://chat.openai.com${targetPath}`;
    }
  });
}

function headerContent(gizmoResource = null) {
  const title = gizmoResource ? gizmoResource?.gizmo?.display?.name : 'How can I help you today?';
  const subtitle = gizmoResource ? gizmoResource?.gizmo?.display?.description : '';
  const creator = gizmoResource ? gizmoResource?.gizmo?.author?.display_name || 'community builder' : '';
  const authorLink = gizmoResource ? gizmoResource?.gizmo?.author?.link_to || '' : '';
  const numConversationsStr = gizmoResource ? gizmoResource?.gizmo?.vanity_metrics?.num_conversations_str || '' : '';
  const logo = gizmoResource ? `<img src="${gizmoResource?.gizmo?.display?.profile_picture_url}" class="h-full w-full bg-token-main-surface-secondary dark:bg-token-main-surface-tertiary" alt="GPT" width="80" height="80">` : gptSVG;
  const creatorElement = authorLink ? `<a href="${authorLink}" target="_blank" class="underline">${creator}</a>` : creator;
  const creatorTooltipName = (creator && creator !== 'community builder') ? creator : `${title}'s builder`;
  return `<div class="mb-3 h-12 w-12"><div id="header-gizmo-logo" class="gizmo-shadow-stroke relative flex h-full items-center justify-center rounded-full bg-white text-black overflow-hidden">${logo}</div></div><div class="flex flex-col items-center gap-2"><div id="header-gizmo-title" class="text-center text-2xl font-medium">${title}</div>${gizmoResource ? `<div class="flex items-center gap-1 text-token-text-tertiary font-normal"><div id="header-gizmo-creator" class="text-sm text-token-text-tertiary">By ${creatorElement}</div><span title="${creatorTooltipName} can't view your chats" class="pt-[1px]" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-xs"><path d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V12Z" fill="currentColor"></path><path d="M12 9.5C12.6904 9.5 13.25 8.94036 13.25 8.25C13.25 7.55964 12.6904 7 12 7C11.3096 7 10.75 7.55964 10.75 8.25C10.75 8.94036 11.3096 9.5 12 9.5Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" fill="currentColor"></path></svg></span> — <div class="flex text-sm text-token-text-tertiary items-end">${numConversationsStr ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm mr-1"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.52242 6.53608C9.7871 4.41979 12.1019 3 14.75 3C18.7541 3 22 6.24594 22 10.25C22 11.9007 21.4474 13.4239 20.5183 14.6425L21.348 15.97C21.5407 16.2783 21.5509 16.6668 21.3746 16.9848C21.1984 17.3027 20.8635 17.5 20.5 17.5H15.4559C14.1865 19.5963 11.883 21 9.25 21C9.18896 21 9.12807 20.9992 9.06735 20.9977C9.04504 20.9992 9.02258 21 9 21H3.5C3.13647 21 2.80158 20.8027 2.62536 20.4848C2.44913 20.1668 2.45933 19.7783 2.652 19.47L3.48171 18.1425C2.55263 16.9239 2 15.4007 2 13.75C2 9.99151 4.85982 6.90116 8.52242 6.53608ZM10.8938 6.68714C14.106 7.43177 16.5 10.3113 16.5 13.75C16.5 14.3527 16.4262 14.939 16.2871 15.5H18.6958L18.435 15.0828C18.1933 14.6961 18.2439 14.1949 18.5579 13.8643C19.4525 12.922 20 11.651 20 10.25C20 7.35051 17.6495 5 14.75 5C13.2265 5 11.8535 5.64888 10.8938 6.68714ZM8.89548 19C8.94178 18.9953 8.98875 18.9938 9.03611 18.9957C9.107 18.9986 9.17831 19 9.25 19C11.3195 19 13.1112 17.8027 13.9668 16.0586C14.3079 15.363 14.5 14.5804 14.5 13.75C14.5 10.8505 12.1495 8.5 9.25 8.5C9.21772 8.5 9.18553 8.50029 9.15341 8.50087C6.2987 8.55218 4 10.8828 4 13.75C4 15.151 4.54746 16.422 5.44215 17.3643C5.75613 17.6949 5.80666 18.1961 5.56498 18.5828L5.30425 19H8.89548Z" fill="currentColor"></path></svg><div title="Number of conversations" class="text-sm flex">${numConversationsStr}</div>` : ''}</div></div><div id="header-gizmo-subtitle" class="max-w-md text-center text-sm font-normal text-token-text-primary">${subtitle}</div>` : '<div class="h-10"></div>'}</div>`;
}
function suggestionColumn(suggestions, columnNumber = 0) {
  return suggestions.map((suggestion, index) => `${suggestion?.title ? `<span data-projection-id="107" style="opacity: 1; transform: none;"><button id="prompt-starter-${index * 2 + columnNumber}" class="btn relative btn-neutral group w-full whitespace-nowrap rounded-xl text-left md:whitespace-normal" as="button"><div class="flex w-full gap-2 items-center justify-center"><div class="flex w-full items-center justify-between"><div class="flex flex-col overflow-hidden"><div class="truncate font-normal text-token-text-primary">${suggestion?.title}</div><div class="truncate text-token-text-tertiary">${suggestion?.description || ''}</div></div><div class="absolute bottom-0 right-0 top-0 flex items-center rounded-xl bg-gradient-to-l from-gray-100 from-[60%] pl-6 pr-2 opacity-0 group-hover:opacity-100 text-token-text-primary"><span class="" data-state="closed"><div class="rounded-lg bg-token-main-surface-secondary p-1"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="icon-sm text-token-text-primary"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></span></div></div></div></button></span>` : ''}`).join('');
}
function loadExamplePrompts(examplePrompts) {
  if (!examplePrompts?.items?.length) return;
  // randomize the order of the example prompts
  examplePrompts?.items?.sort(() => Math.random() - 0.5);
  const existingSuggestionsWrapper = document.querySelector('#suggestions-wrapper');
  if (existingSuggestionsWrapper) existingSuggestionsWrapper.remove();
  const suggestionsWrapper = `<div id="suggestions-wrapper" class="grow" style="z-index:1000;"><div class="absolute bottom-full left-0 mb-4 flex w-full grow gap-2 pb-1 sm:pb-0 md:static md:mb-0 md:max-w-none"><div class="grid w-full grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2"><div class="flex flex-col gap-2">${suggestionColumn([examplePrompts.items[0], examplePrompts.items[2]], 0)}</div><div class="flex flex-col gap-2">${suggestionColumn([examplePrompts.items[1], examplePrompts.items[3]], 1)}</div></div></div></div>`;

  // check if still on new chat page
  const { pathname } = new URL(window.location.toString());
  if (pathname === '/' || pathname.startsWith('/g/g-')) {
    const inputFormActionWrapper = document.querySelector('#input-form-action-wrapper');
    if (inputFormActionWrapper) {
      inputFormActionWrapper.insertAdjacentHTML('beforeend', suggestionsWrapper);
      const suggestions = document.querySelectorAll('#suggestions-wrapper [id^="prompt-starter-"]');
      suggestions.forEach((suggestion) => {
        const suggestionIndex = suggestion.id.split('-').pop();
        suggestion.addEventListener('click', () => {
          const textAreaElement = document.querySelector('#prompt-textarea');
          textAreaElement.value = examplePrompts.items[suggestionIndex].prompt;
          // remove all suggestion buttons
          const curSuggestionsWrapper = document.querySelector('#suggestions-wrapper');
          if (curSuggestionsWrapper) curSuggestionsWrapper.remove();
          // click the submit button
          textAreaElement.focus();
          textAreaElement.dispatchEvent(new Event('input', { bubbles: true }));
          textAreaElement.dispatchEvent(new Event('change', { bubbles: true }));
          setTimeout(() => {
            const submitButton = document.querySelector('[data-testid="send-button"]');
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
  outerDiv.classList = 'h-full bg-token-main-surface-secondary';
  outerDiv.style = 'scroll-behavior: smooth;';

  const innerDiv = document.createElement('div');
  innerDiv.classList = 'flex flex-col items-center text-sm h-full bg-token-main-surface-primary';
  outerDiv.appendChild(innerDiv);

  const body = document.createElement('div');
  body.classList = 'flex h-full flex-col items-center justify-center text-token-text-primary';
  innerDiv.appendChild(body);

  const header = document.createElement('div');
  header.classList = 'text-5xl font-semibold text-center my-4 ml-auto mr-auto flex flex-col gap-2 items-center justify-center';
  header.innerHTML = headerContent(gizmoResource);
  body.appendChild(header);

  const content = document.createElement('div');
  content.classList = 'flex items-center justify-center text-center gap-3.5';
  body.appendChild(content);

  const settingsWrpper = document.createElement('div');
  settingsWrpper.id = 'new-page-settings';
  settingsWrpper.classList = 'hidden flex-col items-start justify-end border border-gray-500 rounded-md p-4';
  chrome.storage.local.get(['settings'], (result) => {
    const { settings: { showNewChatSettings } } = result;
    if (showNewChatSettings || typeof showNewChatSettings === 'undefined') {
      settingsWrpper.classList = 'flex flex-col items-start justify-end border border-gray-500 rounded-md p-4';
    }
  });
  settingsWrpper.style = 'width: 600px; min-height: 260px;';
  content.appendChild(settingsWrpper);
  // custom instruction settings
  const customInstructionSettings = customInstructionSettingsElement();
  settingsWrpper.appendChild(customInstructionSettings);

  // divider
  const divider = document.createElement('div');
  divider.classList = 'border border-gray-500';
  divider.style = 'width: 70%; height: 1px; background-color: #e5e7eb; margin: 16px auto;';
  settingsWrpper.appendChild(divider);
  chrome.storage.local.get(['account'], (r) => {
    const chatgptAccountId = document?.cookie?.split('; ')?.find((row) => row?.startsWith('_account'))?.split('=')?.[1];

    const isTeam = chatgptAccountId ? r?.account?.accounts?.[chatgptAccountId]?.account?.plan_type === 'team' || false : false;

    const saveHistorySwitch = createSwitch(`<span style="color:#8e8ea0 !important;">Chat History${isTeam ? '' : ' & Training'}</span>`, `<div class="text-left">Save new chats to your history${isTeam ? '' : ' and allow them to be used to improve ChatGPT via model training'}. Unsaved chats will be deleted from our systems within 30 days. <a href="https://help.openai.com/en/articles/7730893" target="_blank" class="underline" rel="noreferrer">Learn more</a></div>`, 'saveHistory', true);
    settingsWrpper.appendChild(saveHistorySwitch);
  });
  // const bottom = document.createElement('div');
  // bottom.classList = 'w-full h-32 md:h-48 flex-shrink-0';
  // innerDiv.appendChild(bottom);

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
  const customInstructionSettings = document.createElement('div');
  customInstructionSettings.id = 'custom-instruction-settings';
  customInstructionSettings.classList = 'relative flex items-start justify-between w-full';
  customInstructionSettings.style.height = '96px';
  const customInstructionSettingsOverlay = document.createElement('div');
  customInstructionSettingsOverlay.style = 'position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.8);z-index:1;border-radius: 8px;';
  // add 'Custom Instruction is only available on the main page' to the overlay
  // const customInstructionSettingsOverlayText = document.createElement('div');
  // customInstructionSettingsOverlayText.style = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:16px;font-weight:500;color:#fff;';
  // customInstructionSettingsOverlayText.innerHTML = 'Custom Instructions are only available with the default ChatGPT';
  // customInstructionSettingsOverlay.appendChild(customInstructionSettingsOverlayText);
  // if (pathname !== '/') {
  //   customInstructionSettings.appendChild(customInstructionSettingsOverlay);
  // }

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

      if (!selectedProfile || selectedProfile.aboutUser.replace(/[^a-zA-Z]/g, '') !== (systemMessage?.about_user_message)?.toString()?.replace(/[^a-zA-Z]/g, '') || selectedProfile?.aboutModel?.replace(/[^a-zA-Z]/g, '') !== (systemMessage?.about_model_message)?.toString()?.replace(/[^a-zA-Z]/g, '')) {
        newCustomInstructionProfiles = customInstructionProfiles.map((p) => {
          if (p.aboutModel.replace(/[^a-zA-Z]/g, '') === (systemMessage?.about_model_message)?.toString()?.replace(/[^a-zA-Z]/g, '') && p.aboutUser.replace(/[^a-zA-Z]/g, '') === (systemMessage?.about_user_message)?.toString()?.replace(/[^a-zA-Z]/g, '')) {
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
