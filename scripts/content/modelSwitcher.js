/* eslint-disable no-unused-vars */
/* global getInstalledPlugins, addUploadFileButton, arkoseTrigger, curImageAssets:true, curFileAttachments:true, registerWebsocket */
// eslint-disable-next-line no-unused-vars
function modelSwitcher(models, selectedModel, idPrefix, customModels, autoSync, forceDark = false) {
  if (!selectedModel) return '';
  return `<button id="${idPrefix}-model-switcher-button" class="relative w-full cursor-pointer rounded-md border border-token-border-light bg-token-main-surface-primary pl-3 pr-10 text-left focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 sm:text-sm" type="button">
  <label class="relative text-xs text-token-text-tertiary" style="top:-2px;">Model</label>
  <span class="inline-flex w-full truncate font-semibold text-token-text-primary">
    <span class="flex h-5 items-center gap-1 truncate relative" style="top:-2px;"><span id="${idPrefix}-selected-model-title">${selectedModel.title} ${selectedModel.tags?.map((tag) => `<span class="py-0.25 mr-1 rounded px-1 text-sm capitalize bg-blue-200 text-blue-500">${tag}</span>`).join('')}</span>
    </span>
  </span>
  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-gray-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </span>
</button>
<ul id="${idPrefix}-model-list-dropdown" style="width:400px;max-height:400px" class="hidden absolute z-10 mt-1 overflow-auto rounded-md py-1 text-base ring-1 ring-opacity-5 focus:outline-none ${forceDark ? 'ring-white/20 last:border-0' : ''} bg-token-main-surface-primary dark:ring-white/20 dark:last:border-0 sm:text-sm -translate-x-1/4" role="menu" aria-orientation="vertical" aria-labelledby="model-switcher-button" tabindex="-1">
  ${createModelListDropDown(models, selectedModel, idPrefix, customModels, forceDark)}
</ul>`;
}
function createModelListDropDown(models, selectedModel, idPrefix, customModels = [], forceDark = false) {
  return `${models.map((model) => `<li class="text-gray-900 group relative cursor-pointer select-none border-b py-1 pl-3 pr-12 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="${idPrefix}-model-switcher-option-${model.slug}" role="option" tabindex="-1">
 <div class="flex flex-col">
   <span class="font-semibold flex h-6 items-center gap-1 truncate text-token-text-primary">${model.title} ${model?.tags?.map((tag) => `<span class="py-0.25 mr-1 rounded px-1 text-sm capitalize bg-blue-200 text-blue-500">${tag}</span>`).join('')}</span>
   <span class="text-token-text-tertiary text-xs">${model.description}</span>
 </div>
 ${model.slug === selectedModel.slug ? `<span id="${idPrefix}-model-switcher-checkmark" style="right:36px;" class="absolute inset-y-0 right-4 flex items-center text-token-text-primary">
 <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
 <polyline points="20 6 9 17 4 12"></polyline>
 </svg>
 </span>` : ''}
 ${customModels.map((m) => m.slug).includes(model.slug) ? `<span style="top:15px;right:14px;" id="delete-model-${model.slug}" class="absolute w-4 h-4 inset-y-0 flex items-center p-0 text-token-text-primary visible hover:bg-token-main-surface-secondary"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span>` : ''}
</li>`).join('')}`;
}

function addModelSwitcherEventListener(idPrefix, forceDark = false) {
  const modelSwitcherButton = document.querySelector(`#${idPrefix}-model-switcher-button`);
  if (modelSwitcherButton) {
    modelSwitcherButton.addEventListener('click', () => {
      const modelListDropdown = document.querySelector(`#${idPrefix}-model-list-dropdown`);
      const cl = modelListDropdown.classList;
      if (cl.contains('block')) {
        modelListDropdown.classList.replace('block', 'hidden');
      } else {
        modelListDropdown.classList.replace('hidden', 'block');
      }
    });
  }
  // close modelListDropdown when clicked outside
  document.addEventListener('click', (e) => {
    const modelListDropdown = document.querySelector(`#${idPrefix}-model-list-dropdown`);
    const cl = modelListDropdown?.classList;
    if (cl && cl.contains('block') && !e.target.closest(`#${idPrefix}-model-switcher-button`)) {
      modelListDropdown.classList.replace('block', 'hidden');
    }
  });

  const modelSwitcherOptions = document.querySelectorAll(`[id^=${idPrefix}-model-switcher-option-]`);

  modelSwitcherOptions.forEach((option) => {
    const deleteButton = option.querySelector('[id^=delete-model-]');
    if (deleteButton) {
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const slug = deleteButton.id.split('delete-model-')[1];
        chrome.storage.local.get(['customModels'], (result) => {
          const { customModels } = result;
          const newCustomModels = customModels.filter((m) => m.slug !== slug);
          chrome.storage.local.set({ customModels: newCustomModels }, () => {
            const modelSwitcherOption = document.querySelector(`[id$=-model-switcher-option-${slug.replaceAll('.', '\\.')}]`);
            modelSwitcherOption.remove();
          });
        });
      });
    }

    option.addEventListener('click', () => {
      chrome.storage.local.get(['settings', 'models', 'unofficialModels', 'customModels'], ({
        settings, models, unofficialModels, customModels,
      }) => {
        // clear uploaded files
        const fileWrapperElement = document.querySelector('#prompt-input-form #file-wrapper-element');
        if (fileWrapperElement) {
          fileWrapperElement.remove();
          curImageAssets = [];
          curFileAttachments = [];
        }

        const allModels = [...(models || []), ...(unofficialModels || []), ...(customModels || [])];
        const modelSlug = option.id.split(`${idPrefix}-model-switcher-option-`)[1];
        const selectedModel = allModels.find((m) => m.slug === modelSlug);
        const pluginsDropdownWrapper = document.querySelector(`#plugins-dropdown-wrapper-${idPrefix}`);

        if (pluginsDropdownWrapper) {
          if (selectedModel.slug.includes('plugins')) {
            getInstalledPlugins();
            pluginsDropdownWrapper.style.display = 'block';
          } else {
            pluginsDropdownWrapper.style.display = 'none';
          }
        }
        chrome.storage.local.set({ selectedModel }, () => {
          const textAreaElement = document.querySelector('#prompt-textarea');
          if (textAreaElement?.value?.length > 0) {
            arkoseTrigger();
          }
          addUploadFileButton();
          // focus on input
          const textInput = document.querySelector('#prompt-textarea');
          if (textInput) {
            textInput.focus();
          }
        });
      });
    });
  });
  chrome.storage.onChanged.addListener((e) => {
    if (e.selectedModel && e.selectedModel?.newValue?.slug !== e.selectedModel?.oldValue?.slug) {
      const modelListDropdown = document.querySelector(`#${idPrefix}-model-list-dropdown`);
      if (!modelListDropdown) return;
      modelListDropdown.classList.replace('block', 'hidden');
      const modelSwitcherCheckmark = document.querySelector(`#${idPrefix}-model-switcher-checkmark`);
      modelSwitcherCheckmark.remove();
      const selectedModelTitle = document.querySelector(`#${idPrefix}-selected-model-title`);
      selectedModelTitle.innerHTML = `${e.selectedModel.newValue?.title} ${e.selectedModel.newValue?.tags?.map((tag) => `<span class="py-0.25 mr-1 rounded px-1 text-sm capitalize bg-blue-200 text-blue-500">${tag}</span>`).join('')}`;
      const selectedModelOption = document.querySelector(`#${idPrefix}-model-switcher-option-${e.selectedModel?.newValue?.slug?.replaceAll('.', '\\.')}`);
      selectedModelOption.appendChild(modelSwitcherCheckmark);
    }
  });
}
