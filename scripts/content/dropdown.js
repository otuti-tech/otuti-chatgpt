/* global */
/* eslint-disable no-unused-vars */
function dropdown(title, options, selectedOption, side = 'right', forceDark = false) {
  // eslint-disable-next-line prefer-destructuring
  if (!selectedOption) selectedOption = options[0];
  let menuTitle = title.replace('-', ' ');
  if (menuTitle.startsWith('Library ')) menuTitle = menuTitle.replace('Library ', '');
  return `<button id="${title.toLowerCase()}-selector-button" class="relative w-full cursor-pointer rounded-md border bg-token-main-surface-primary border-token-border-light pl-3 pr-6 text-left focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 sm:text-sm" type="button">
  <label class="relative text-xs text-token-text-tertiary" style="top:-2px;">${menuTitle}</label>
  <span class="inline-flex w-full truncate font-semibold  text-token-text-primary">
    <span class="flex h-5 items-center gap-1 truncate relative" style="top:-2px;"><span id="selected-${title.toLowerCase()}-title">${selectedOption.name}</span>
    </span>
  </span>
  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4  text-gray-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </span>
</button>
<ul id="${title.toLowerCase()}-list-dropdown" style="max-height:400px;overflow-y:scroll;width:250px;" class="hidden transition-all absolute z-10 ${side === 'right' ? 'right-0' : 'left-0'} mt-1 overflow-auto rounded-md py-1 text-base ring-1 ring-opacity-5 focus:outline-none ${forceDark ? 'ring-white/20 last:border-0' : ''} bg-token-main-surface-primary dark:ring-white/20 dark:last:border-0 sm:text-sm -translate-x-1/4" role="menu" aria-orientation="vertical" aria-labelledby="${title.toLowerCase()}-selector-button" tabindex="-1">
  ${options.map((option) => `<li title="${option.description || ''}" class="text-token-text-primary relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="${title.toLowerCase()}-selector-option-${option.code}" role="option" tabindex="-1">
    <div class="flex flex-col">
      <span class="font-semibold flex h-6 items-center gap-1 truncate text-token-text-primary">${option.name}</span>
    </div>
    ${option.code === selectedOption.code ? `<span id="${title.toLowerCase()}-selector-checkmark" class="absolute inset-y-0 right-0 flex items-center pr-4 text-token-text-primary">
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    </span>` : ''}
  </li>`).join('')}
  </ul>`;
}

function addDropdownEventListener(title, options, callback = null, forceDark = false) {
  const optionSelectorButton = document.querySelector(`#${title.toLowerCase()}-selector-button`);
  optionSelectorButton?.addEventListener('click', () => {
    const optionListDropdown = document.querySelector(`#${title.toLowerCase()}-list-dropdown`);
    const cl = optionListDropdown.classList;
    if (cl.contains('block')) {
      optionListDropdown.classList.replace('block', 'hidden');
    } else {
      optionListDropdown.classList.replace('hidden', 'block');
    }
  });
  // close optionListDropdown when clicked outside
  document.addEventListener('click', (e) => {
    const optionListDropdown = document.querySelector(`#${title.toLowerCase()}-list-dropdown`);
    const cl = optionListDropdown?.classList;
    if (cl?.contains('block') && !e.target.closest(`#${title.toLowerCase()}-selector-button`)) {
      optionListDropdown.classList.replace('block', 'hidden');
    }
  });
  const optionSelectorOptions = document.querySelectorAll(`[id^=${title.toLowerCase()}-selector-option-]`);
  optionSelectorOptions.forEach((option) => {
    option.addEventListener('click', () => {
      chrome.storage.local.get(['settings'], ({ settings }) => {
        const optionListDropdown = document.querySelector(`#${title.toLowerCase()}-list-dropdown`);
        optionListDropdown.classList.replace('block', 'hidden');
        const optionSelectorCheckmark = document.querySelector(`#${title.toLowerCase()}-selector-checkmark`);
        if (optionSelectorCheckmark) {
          optionSelectorCheckmark.remove();
          option.appendChild(optionSelectorCheckmark);
        }
        const optionCode = option.id.split(`${title.toLowerCase()}-selector-option-`)[1];
        const selectedOption = options.find((l) => l.code === optionCode);
        const selectedOptionTitle = document.querySelector(`#selected-${title.toLowerCase()}-title`);
        selectedOptionTitle.textContent = selectedOption.name;
        chrome.storage.local.set({ settings: { ...settings, [`selected${title.replace('-', '')}`]: selectedOption } }, () => {
          if (callback) callback(selectedOption);
        });
      });
    });
  });
}
