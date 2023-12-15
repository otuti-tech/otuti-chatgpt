/* global isDescendant, updateActionSettings, showNewChatPage, updateGizmoSidebar, getGizmoUserActionSettings, toast */
/* eslint-disable no-unused-vars */
function gizmoMenu(gizmoData, currentUserId, side = 'left', forceDark = false) {
  const gizmoResource = gizmoData?.resource;
  const gizmoId = gizmoResource.gizmo.id;
  const authorId = gizmoResource.gizmo.author.user_id;
  const isPublic = gizmoResource.gizmo.tags.includes('public');
  const gizmoAction = gizmoResource.tools.find((tool) => !['browser', 'dalle', 'python'].includes(tool.type));

  return `<div style="left:12px;height:46px;z-index:100;width:100%;"><button id="gizmo-menu" class="relative w-full h-full flex items-center cursor-pointer rounded-md border ${forceDark ? 'bg-gray-800 border-white/20' : 'bg-white border-gray-300'} p-2 text-center focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 dark:border-white/20 dark:bg-gray-800 sm:text-sm" type="button">
  <span class="flex items-center justify-center w-full truncate font-semibold ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100">
${gizmoResource.gizmo.display.name} <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="ml-2 h-4 w-4 text-gray-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"></polyline></svg></svg>
</button>
<ul id="gizmo-menu-options" style="max-height:400px;width:250px;" class="hidden transition-all absolute z-10 ${side === 'right' ? 'right-0' : 'left-0'} mt-1 overflow-auto rounded-md p-1 text-base ring-1 ring-opacity-5 focus:outline-none ${forceDark ? 'bg-gray-800 ring-white/20 last:border-0' : 'bg-white'} dark:bg-gray-800 dark:ring-white/20 dark:last:border-0 sm:text-sm -translate-x-1/4" role="menu" aria-orientation="vertical" tabindex="-1">

  <li class="flex ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100 py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 ${forceDark ? 'border-white/20' : 'border-gray-100'} dark:border-white/20 hover:bg-gray-600" id="gizmo-menu-option-new-chat" role="option" tabindex="-1">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.7929 2.79289C18.0118 1.57394 19.9882 1.57394 21.2071 2.79289C22.4261 4.01184 22.4261 5.98815 21.2071 7.20711L12.7071 15.7071C12.5196 15.8946 12.2652 16 12 16H9C8.44772 16 8 15.5523 8 15V12C8 11.7348 8.10536 11.4804 8.29289 11.2929L16.7929 2.79289ZM19.7929 4.20711C19.355 3.7692 18.645 3.7692 18.2071 4.2071L10 12.4142V14H11.5858L19.7929 5.79289C20.2308 5.35499 20.2308 4.64501 19.7929 4.20711ZM6 5C5.44772 5 5 5.44771 5 6V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V14C19 13.4477 19.4477 13 20 13C20.5523 13 21 13.4477 21 14V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34314 4.34315 3 6 3H10C10.5523 3 11 3.44771 11 4C11 4.55228 10.5523 5 10 5H6Z" fill="currentColor"></path></svg>New chat
  </li>

  <li class="flex ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100 py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 ${forceDark ? 'border-white/20' : 'border-gray-100'} dark:border-white/20 hover:bg-gray-600" id="gizmo-menu-option-about" role="option" tabindex="-1">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 icon-md"><path d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V12Z" fill="currentColor"></path><path d="M12 9.5C12.6904 9.5 13.25 8.94036 13.25 8.25C13.25 7.55964 12.6904 7 12 7C11.3096 7 10.75 7.55964 10.75 8.25C10.75 8.94036 11.3096 9.5 12 9.5Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" fill="currentColor"></path></svg>About
  </li>

  ${gizmoAction ? `<li class="flex ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100 py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 ${forceDark ? 'border-white/20' : 'border-gray-100'} dark:border-white/20 hover:bg-gray-600" id="gizmo-menu-option-privacy-settings" role="option" tabindex="-1">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C9.79086 4 8 5.79086 8 8H16C16 5.79086 14.2091 4 12 4ZM6 10C5.44772 10 5 10.4477 5 11V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V11C19 10.4477 18.5523 10 18 10H6ZM6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8C19.6569 8 21 9.34315 21 11V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V11C3 9.34315 4.34315 8 6 8ZM10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14C14 14.7403 13.5978 15.3866 13 15.7324V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V15.7324C10.4022 15.3866 10 14.7403 10 14Z" fill="currentColor"></path></svg>Privacy settings
  </li>` : ''}
  ${authorId === currentUserId ? `<li class="flex ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100 py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 ${forceDark ? 'border-white/20' : 'border-gray-100'} dark:border-white/20 hover:bg-gray-600" id="gizmo-menu-option-edit-gpt" role="option" tabindex="-1">
  <a href="https://chat.openai.com/gpts/editor/${gizmoId}" target="_self" class="flex items-center w-full truncate">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 icon-md"><path d="M11.6439 3C10.9352 3 10.2794 3.37508 9.92002 3.98596L9.49644 4.70605C8.96184 5.61487 7.98938 6.17632 6.93501 6.18489L6.09967 6.19168C5.39096 6.19744 4.73823 6.57783 4.38386 7.19161L4.02776 7.80841C3.67339 8.42219 3.67032 9.17767 4.01969 9.7943L4.43151 10.5212C4.95127 11.4386 4.95127 12.5615 4.43151 13.4788L4.01969 14.2057C3.67032 14.8224 3.67339 15.5778 4.02776 16.1916L4.38386 16.8084C4.73823 17.4222 5.39096 17.8026 6.09966 17.8083L6.93502 17.8151C7.98939 17.8237 8.96185 18.3851 9.49645 19.294L9.92002 20.014C10.2794 20.6249 10.9352 21 11.6439 21H12.3561C13.0648 21 13.7206 20.6249 14.08 20.014L14.5035 19.294C15.0381 18.3851 16.0106 17.8237 17.065 17.8151L17.9004 17.8083C18.6091 17.8026 19.2618 17.4222 19.6162 16.8084L19.9723 16.1916C20.3267 15.5778 20.3298 14.8224 19.9804 14.2057L19.5686 13.4788C19.0488 12.5615 19.0488 11.4386 19.5686 10.5212L19.9804 9.7943C20.3298 9.17767 20.3267 8.42219 19.9723 7.80841L19.6162 7.19161C19.2618 6.57783 18.6091 6.19744 17.9004 6.19168L17.065 6.18489C16.0106 6.17632 15.0382 5.61487 14.5036 4.70605L14.08 3.98596C13.7206 3.37508 13.0648 3 12.3561 3H11.6439Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path><circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="2"></circle></svg>Edit GPT</a>
  </li>` : ''}
  ${gizmoData.flair.kind === 'sidebar_keep' ? `<li class="flex ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100 py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 ${forceDark ? 'border-white/20' : 'border-gray-100'} dark:border-white/20 hover:bg-gray-600" id="gizmo-menu-option-hide-from-sidebar" role="option" tabindex="-1"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 icon-md"><path d="M15 15V17.5585C15 18.4193 14.4491 19.1836 13.6325 19.4558L13.1726 19.6091C12.454 19.8487 11.6616 19.6616 11.126 19.126L4.87403 12.874C4.33837 12.3384 4.15132 11.546 4.39088 10.8274L4.54415 10.3675C4.81638 9.55086 5.58066 9 6.44152 9H9M12 6.2L13.6277 3.92116C14.3461 2.91549 15.7955 2.79552 16.6694 3.66942L20.3306 7.33058C21.2045 8.20448 21.0845 9.65392 20.0788 10.3723L18 11.8571" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 16L3 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 4L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>Hide from sidebar</li>` : `<li class="flex ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100 py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 ${forceDark ? 'border-white/20' : 'border-gray-100'} dark:border-white/20 hover:bg-gray-600" id="gizmo-menu-option-keep-in-sidebar" role="option" tabindex="-1"><svg class="mr-2 icon-md" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.4845 2.8798C16.1773 1.57258 14.0107 1.74534 12.9272 3.24318L9.79772 7.56923C9.60945 7.82948 9.30775 7.9836 8.98654 7.9836H6.44673C3.74061 7.9836 2.27414 11.6759 4.16948 13.5713L6.59116 15.993L2.29324 20.2909C1.90225 20.6819 1.90225 21.3158 2.29324 21.7068C2.68422 22.0977 3.31812 22.0977 3.70911 21.7068L8.00703 17.4088L10.4287 19.8305C12.3241 21.7259 16.0164 20.2594 16.0164 17.5533V15.0135C16.0164 14.6923 16.1705 14.3906 16.4308 14.2023L20.7568 11.0728C22.2547 9.98926 22.4274 7.8227 21.1202 6.51549L17.4845 2.8798ZM11.8446 18.4147C12.4994 19.0694 14.0141 18.4928 14.0141 17.5533V15.0135C14.0141 14.0499 14.4764 13.1447 15.2572 12.58L19.5832 9.45047C20.0825 9.08928 20.1401 8.3671 19.7043 7.93136L16.0686 4.29567C15.6329 3.85993 14.9107 3.91751 14.5495 4.4168L11.4201 8.74285C10.8553 9.52359 9.95016 9.98594 8.98654 9.98594H6.44673C5.5072 9.98594 4.93059 11.5006 5.58535 12.1554L11.8446 18.4147Z" fill="currentColor"></path></svg>Keep in sidebar </li>`}
  ${isPublic ? `<li class="flex ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100 py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 ${forceDark ? 'border-white/20' : 'border-gray-100'} dark:border-white/20 hover:bg-gray-600" id="gizmo-menu-option-copy-link" role="option" tabindex="-1">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.2929 5.70711C16.4743 3.88849 13.5257 3.88849 11.7071 5.70711L10.7071 6.70711C10.3166 7.09763 9.68341 7.09763 9.29289 6.70711C8.90236 6.31658 8.90236 5.68342 9.29289 5.2929L10.2929 4.29289C12.8926 1.69323 17.1074 1.69323 19.7071 4.2929C22.3068 6.89256 22.3068 11.1074 19.7071 13.7071L18.7071 14.7071C18.3166 15.0976 17.6834 15.0976 17.2929 14.7071C16.9024 14.3166 16.9024 13.6834 17.2929 13.2929L18.2929 12.2929C20.1115 10.4743 20.1115 7.52572 18.2929 5.70711ZM15.7071 8.2929C16.0976 8.68342 16.0976 9.31659 15.7071 9.70711L9.7071 15.7071C9.31658 16.0976 8.68341 16.0976 8.29289 15.7071C7.90236 15.3166 7.90236 14.6834 8.29289 14.2929L14.2929 8.2929C14.6834 7.90237 15.3166 7.90237 15.7071 8.2929ZM6.7071 9.2929C7.09763 9.68342 7.09763 10.3166 6.7071 10.7071L5.7071 11.7071C3.88849 13.5257 3.88849 16.4743 5.7071 18.2929C7.52572 20.1115 10.4743 20.1115 12.2929 18.2929L13.2929 17.2929C13.6834 16.9024 14.3166 16.9024 14.7071 17.2929C15.0976 17.6834 15.0976 18.3166 14.7071 18.7071L13.7071 19.7071C11.1074 22.3068 6.89255 22.3068 4.29289 19.7071C1.69322 17.1074 1.69322 12.8926 4.29289 10.2929L5.29289 9.2929C5.68341 8.90237 6.31658 8.90237 6.7071 9.2929Z" fill="currentColor"></path></svg>Copy link
  </li>` : ''}

  ${isPublic && false ? `<li class="flex ${forceDark ? 'text-gray-100' : 'text-gray-800'} dark:text-gray-100 py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 ${forceDark ? 'border-white/20' : 'border-gray-100'} dark:border-white/20 hover:bg-gray-600" id="gizmo-menu-option-report" role="option" tabindex="-1">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 4.64048V13.4946C6.97966 13.1602 7.88099 13.0195 8.73583 13.0151C9.9815 13.0088 11.0694 13.2939 12.0551 13.5954C12.2535 13.6561 12.448 13.7172 12.6399 13.7776C14.3554 14.3169 15.8581 14.7893 18 14.2515V5.61807C18 5.6177 18 5.61836 18 5.61807C17.9973 5.61407 17.9883 5.60143 17.9674 5.58771C17.9132 5.55219 17.8375 5.53958 17.7738 5.55802C15.2418 6.29023 13.3072 5.56144 11.6733 4.94591C11.5513 4.89998 11.4311 4.85467 11.3124 4.81066C9.6336 4.18815 8.14486 3.74466 6 4.64048ZM18 14.2793C18 14.2796 18 14.2795 18 14.2793V14.2793ZM6 15.637C7.06717 15.1777 7.95744 15.0191 8.74594 15.0151C9.68064 15.0104 10.5334 15.2214 11.4701 15.5079C11.657 15.5651 11.8472 15.6255 12.0411 15.6871C13.7733 16.2375 15.806 16.8833 18.556 16.1737C19.4513 15.9427 20 15.1264 20 14.2793V5.61807C20 4.07012 18.4318 3.28577 17.2182 3.63675C15.3407 4.1797 13.9832 3.67281 12.3112 3.04848C12.2112 3.01115 12.1101 2.9734 12.0077 2.93543C10.1745 2.25564 8.06074 1.59138 5.17004 2.81991C4.41981 3.13875 4 3.87462 4 4.61803V21C4 21.5523 4.44772 22 5 22C5.55228 22 6 21.5523 6 21V15.637Z" fill="currentColor"></path></svg>Report
  </li>` : ''}
  </ul>
  </div>`;
}

function addGizmoMenuEventListeners(gizmoData, callback = null, forceDark = false) {
  const menuButton = document.querySelector('#gizmo-menu');
  if (!menuButton) return;
  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    getGizmoUserActionSettings(gizmoData?.resource?.gizmo?.id);
    const optionListDropdown = document.querySelector('#gizmo-menu-options');
    const cl = optionListDropdown.classList;
    if (cl.contains('block')) {
      optionListDropdown.classList.replace('block', 'hidden');
    } else {
      optionListDropdown.classList.replace('hidden', 'block');
    }
  });
  // close optionListDropdown when clicked outside
  document.addEventListener('click', (e) => {
    const optionListDropdown = document.querySelector('#gizmo-menu-options');
    const cl = optionListDropdown?.classList;

    if (cl?.contains('block') && !isDescendant(optionListDropdown, e.target)) {
      optionListDropdown.classList.replace('block', 'hidden');
    }
  });
  const optionSelectorOptions = document.querySelectorAll('[id^=gizmo-menu-option-]');
  optionSelectorOptions.forEach((option) => {
    option.addEventListener('mousemove', () => {
      const darkMode = document.querySelector('html').classList.contains('dark');
      option.classList.add(darkMode || forceDark ? 'bg-gray-600' : 'bg-gray-200');
    });
    option.addEventListener('mouseleave', () => {
      const darkMode = document.querySelector('html').classList.contains('dark');
      option.classList.remove(darkMode || forceDark ? 'bg-gray-600' : 'bg-gray-200');
    });
    option.addEventListener('click', (e) => {
      const id = option.id.split('gizmo-menu-option-')[1];

      if (id === 'new-chat') {
        showNewChatPage(gizmoData?.resource);
      }
      if (id === 'about') {
        e.preventDefault();
        e.stopPropagation();
        // close menu
        showGizmoAboutDialog(gizmoData?.resource);
      }
      if (id === 'privacy-settings') {
        e.preventDefault();
        e.stopPropagation();
        openPrivacySettingsDialog(gizmoData?.resource);
      }
      if (id === 'hide-from-sidebar') {
        updateGizmoSidebar(gizmoData?.resource?.gizmo?.id, 'hide');
        chrome.runtime.sendMessage({
          updateGizmoMetrics: true,
          detail: {
            gizmoId: gizmoData?.resource?.gizmo?.id,
            metricName: 'num_pins',
            direction: 'down',
          },
        });
      }
      if (id === 'keep-in-sidebar') {
        updateGizmoSidebar(gizmoData?.resource?.gizmo?.id, 'keep');
        chrome.runtime.sendMessage({
          updateGizmoMetrics: true,
          detail: {
            gizmoId: gizmoData?.resource?.gizmo?.id,
            metricName: 'num_pins',
            direction: 'up',
          },
        });
      }
      if (id === 'copy-link') {
        navigator.clipboard.writeText(`https://chat.openai.com/g/${gizmoData?.resource?.gizmo?.short_url}`);
        toast('Link copied to clipboard');
      }
      // if (id === 'report') {
      //   e.preventDefault();
      //   e.stopPropagation();
      // }
    });
  });
}
function openPrivacySettingsDialog(gizmoResource) {
  getGizmoUserActionSettings(gizmoResource.gizmo.id).then((userActionSettings) => {
    const { action_id: gizmoActionId, action_settings: actionSettings, operations } = userActionSettings.settings[0];
    const gizmoAction = gizmoResource.tools.find((tool) => !['browser', 'dalle', 'python'].includes(tool.type));
    const privacySettingsDialog = `<div id="gizmo-privacy-settings-dialog" class="absolute inset-0"><div data-state="open" class="fixed inset-0 bg-black/50 dark:bg-gray-600/70" style="pointer-events: auto;"><div class="grid-cols-[10px_1fr_10px] grid h-full w-full grid-rows-[minmax(10px,_1fr)_auto_minmax(10px,_1fr)] md:grid-rows-[minmax(20px,_1fr)_auto_minmax(20px,_1fr)] overflow-y-auto"><div id="gizmo-privacy-settings-dialog-content" role="dialog" id="radix-:rf8:" aria-describedby="radix-:rfa:" aria-labelledby="radix-:rf9:" data-state="open" class="relative col-auto col-start-2 row-auto row-start-2 w-full rounded-xl text-left shadow-xl transition-all left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 min-h-[50vh] max-w-3xl" tabindex="-1" style="pointer-events: auto;"><div class="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-black/10 dark:border-white/10"><div class="flex"><div class="flex items-center"><div class="flex flex-col gap-1 text-center sm:text-left"><h2 id="radix-:rf9:" as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">GPT's privacy settings</h2></div></div></div><button id="gizmo-privacy-settings-close-button" class="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div><div class=""><div dir="ltr" data-orientation="vertical" class="flex flex-row gap-6 p-4"><div role="tablist" aria-orientation="vertical" class="flex min-w-[180px] max-w-[200px] flex-shrink-0 flex-col gap-2" tabindex="0" data-orientation="vertical" style="outline: none;"><button id="gizmo-privacy-settings-tab-actions" type="button" role="tab" aria-selected="true" aria-controls="radix-:rga:-content-actions" data-state="active" id="radix-:rga:-trigger-actions" class="flex rounded-md px-2 py-1.5 text-sm text-token-text-primary radix-state-active:bg-white dark:radix-state-active:bg-token-surface-tertiary md:radix-state-active:bg-token-surface-tertiary md:radix-state-active:text-token-text-primary" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><div class="truncate">Actions</div></button><button id="gizmo-privacy-settings-tab-connected-accounts" type="button" role="tab" aria-selected="false" aria-controls="radix-:rga:-content-connected_accounts" data-state="inactive" id="radix-:rga:-trigger-connected_accounts" class="flex rounded-md px-2 py-1.5 text-sm text-token-text-primary radix-state-active:bg-white dark:radix-state-active:bg-token-surface-tertiary md:radix-state-active:bg-token-surface-tertiary md:radix-state-active:text-token-text-primary" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><div class="truncate">Connected accounts</div></button></div><div id="gizmo-privacy-settings-tab-content" class="flex-1 text-sm"><div id="gizmo-privacy-settings-tab-actions-content" class="flex flex-col gap-6">Select which 3rd party actions are allowed in conversations with ${gizmoResource.gizmo.display.name}. <div><div class="flex flex-row justify-between py-3 items-center border-b pt-0"><div class="font-medium">${gizmoAction.metadata.domain}</div><a href="${gizmoAction.metadata.privacy_policy_url}" target="_blank" rel="noreferrer" class="flex items-center gap-1 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Privacy policy <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a></div> ${Object.keys(operations).map((key) => { const operation = operations[key]; const actionSetting = actionSettings?.[key]; return `<div class="flex flex-row justify-between py-3 items-center"><div>${operation.id}</div><select id="gizmo-privacy-settings-action-${key}" class="overflow-scroll rounded border-none pl-2 pr-8 dark:bg-gray-800">${operation.is_consequential ? '' : `<option ${actionSetting === 'always_allow' ? 'selected' : ''} value="always_allow">Always allow</option>`}<option ${(actionSetting === 'unset' || !actionSetting) ? 'selected' : ''} value="unset">Ask</option></select></div>`; }).join('')} </div></div><div id="gizmo-privacy-settings-tab-connected-accounts-content" class="flex flex-col gap-6 hidden">Manage which 3rd party accounts can be accessed by ${gizmoResource.gizmo.display.name}.<div></div></div></div></div></div></div></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', privacySettingsDialog);
    // add event listeners
    const privacySettingsDialogCloseButton = document.querySelector('#gizmo-privacy-settings-close-button');
    privacySettingsDialogCloseButton.addEventListener('click', () => {
      const curPrivacySettingsDialog = document.querySelector('#gizmo-privacy-settings-dialog');
      curPrivacySettingsDialog.remove();
    });
    // click outside content to close
    document.addEventListener('click', (e) => {
      const privacySettingsDialogContent = document.querySelector('#gizmo-privacy-settings-dialog-content');
      if (privacySettingsDialogContent && !isDescendant(privacySettingsDialogContent, e.target)) {
        const curPrivacySettingsDialog = document.querySelector('#gizmo-privacy-settings-dialog');
        curPrivacySettingsDialog.remove();
      }
    });
    // add event listeners gizmo-privacy-settings-tab-actions
    const privacySettingsTabActions = document.querySelector('#gizmo-privacy-settings-tab-actions');
    const privacySettingsTabActionsContent = document.querySelector('#gizmo-privacy-settings-tab-actions-content');
    const privacySettingsTabConnectedAccounts = document.querySelector('#gizmo-privacy-settings-tab-connected-accounts');
    const privacySettingsTabConnectedAccountsContent = document.querySelector('#gizmo-privacy-settings-tab-connected-accounts-content');

    privacySettingsTabActions.addEventListener('click', () => {
      privacySettingsTabActions.setAttribute('data-state', 'active');
      privacySettingsTabConnectedAccounts.setAttribute('data-state', 'inactive');
      privacySettingsTabActionsContent.classList.remove('hidden');
      privacySettingsTabConnectedAccountsContent.classList.add('hidden');
    });
    privacySettingsTabConnectedAccounts.addEventListener('click', () => {
      privacySettingsTabConnectedAccounts.setAttribute('data-state', 'active');
      privacySettingsTabActions.setAttribute('data-state', 'inactive');
      privacySettingsTabActionsContent.classList.add('hidden');
      privacySettingsTabConnectedAccountsContent.classList.remove('hidden');
    });
    // add event listeners to select
    const privacySettingsActionSelects = document.querySelectorAll('[id^=gizmo-privacy-settings-action-]');
    privacySettingsActionSelects.forEach((select) => {
      select.addEventListener('change', (e) => {
        const { domain } = gizmoAction.metadata;
        const actionId = select.id.split('gizmo-privacy-settings-action-')[1];
        const { value } = e.target;
        const newActionSettings = {
          [actionId]: value,
        };
        updateActionSettings(gizmoResource.gizmo.id, domain, gizmoActionId, newActionSettings);
      });
    });
  });
}
function showReportDialog(gizmoResource) {

}
function showGizmoAboutDialog(gizmoResource) {
  const uniqueToole = gizmoResource.tools.map((tool) => tool.type).filter((value, index, self) => self.indexOf(value) === index).filter((tool) => ['browser', 'dalle', 'python'].includes(tool));
  const title = gizmoResource?.gizmo?.display?.name;
  const creator = gizmoResource?.gizmo?.author?.display_name || 'community builder';
  const authorLink = gizmoResource ? gizmoResource?.gizmo?.author?.link_to || '' : '';
  const creatorElement = authorLink ? `<a href="${authorLink}" target="_blank" class="underline">${creator}</a>` : creator;
  const creatorTooltipName = (creator && creator !== 'community builder') ? creator : `${title}'s builder`;

  const aboutDialog = `<div id="gizmo-about-dialog" class="absolute inset-0"><div data-state="open" class="fixed inset-0 bg-black/50 dark:bg-gray-600/70" style="pointer-events: auto;"><div class="grid-cols-[10px_1fr_10px] grid h-full w-full grid-rows-[minmax(10px,_1fr)_auto_minmax(10px,_1fr)] md:grid-rows-[minmax(20px,_1fr)_auto_minmax(20px,_1fr)] overflow-y-auto"><div id="gizmo-about-dialog-content" role="dialog" id="radix-:r41:" aria-describedby="radix-:r43:" aria-labelledby="radix-:r42:" data-state="open" class="relative col-auto col-start-2 row-auto row-start-2 w-full rounded-xl text-left shadow-xl transition-all left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 max-w-md" tabindex="-1" style="pointer-events: auto;"><div class=""><div class="absolute right-4 top-4"><button id="gizmo-about-close-button" class="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div><div class="border-b border-token-border-heavy px-4 py-5 sm:px-6 sm:py-10"><div class="flex h-full flex-col items-center justify-center"><div class="mb-3 h-[72px] w-[72px]"><div class="gizmo-shadow-stroke overflow-hidden rounded-full"><img src="${gizmoResource.gizmo.display.profile_picture_url}" class="h-full w-full bg-token-surface-secondary dark:bg-token-surface-tertiary" alt="GPT" width="80" height="80"></div></div><div class="flex flex-col items-center gap-0 p-2"><div class="text-center text-2xl font-medium">${title}</div><div class="max-w-md text-center text-xl font-normal text-token-text-secondary">${gizmoResource.gizmo.display.description}</div><div class="mt-1 flex items-center gap-1 text-token-text-tertiary"><div class="text-sm text-token-text-tertiary">By ${creatorElement}</div><span title="${creatorTooltipName} can't view your chats" class="pt-[1px]" data-state="closed"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-xs"><path d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V12Z" fill="currentColor"></path><path d="M12 9.5C12.6904 9.5 13.25 8.94036 13.25 8.25C13.25 7.55964 12.6904 7 12 7C11.3096 7 10.75 7.55964 10.75 8.25C10.75 8.94036 11.3096 9.5 12 9.5Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" fill="currentColor"></path></svg></span></div></div></div></div><div class="px-4 py-5 text-center sm:px-6 sm:py-10"><div class="text-sm font-normal text-token-text-tertiary">Powered by</div><div class="flex items-center justify-center gap-1.5 pt-1 text-2xl font-medium"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-brand-purple"><path d="M19.3975 1.35498C19.3746 1.15293 19.2037 1.00021 19.0004 1C18.7971 0.999793 18.6259 1.15217 18.6026 1.35417C18.4798 2.41894 18.1627 3.15692 17.6598 3.65983C17.1569 4.16274 16.4189 4.47983 15.3542 4.60264C15.1522 4.62593 14.9998 4.79707 15 5.00041C15.0002 5.20375 15.1529 5.37457 15.355 5.39746C16.4019 5.51605 17.1562 5.83304 17.6716 6.33906C18.1845 6.84269 18.5078 7.57998 18.6016 8.63539C18.6199 8.84195 18.7931 9.00023 19.0005 9C19.2078 8.99977 19.3806 8.84109 19.3985 8.6345C19.4883 7.59673 19.8114 6.84328 20.3273 6.32735C20.8433 5.81142 21.5967 5.48834 22.6345 5.39851C22.8411 5.38063 22.9998 5.20782 23 5.00045C23.0002 4.79308 22.842 4.61992 22.6354 4.60157C21.58 4.50782 20.8427 4.18447 20.3391 3.67157C19.833 3.15623 19.516 2.40192 19.3975 1.35498Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11 3C11.4833 3 11.8974 3.34562 11.9839 3.82111C12.4637 6.46043 13.279 8.23983 14.5196 9.48039C15.7602 10.721 17.5396 11.5363 20.1789 12.0161C20.6544 12.1026 21 12.5167 21 13C21 13.4833 20.6544 13.8974 20.1789 13.9839C17.5396 14.4637 15.7602 15.279 14.5196 16.5196C13.279 17.7602 12.4637 19.5396 11.9839 22.1789C11.8974 22.6544 11.4833 23 11 23C10.5167 23 10.1026 22.6544 10.0161 22.1789C9.53625 19.5396 8.72096 17.7602 7.48039 16.5196C6.23983 15.279 4.46043 14.4637 1.82111 13.9839C1.34562 13.8974 1 13.4833 1 13C1 12.5167 1.34562 12.1026 1.82111 12.0161C4.46043 11.5363 6.23983 10.721 7.48039 9.48039C8.72096 8.23983 9.53625 6.46043 10.0161 3.82111C10.1026 3.34562 10.5167 3 11 3ZM5.66618 13C6.9247 13.5226 7.99788 14.2087 8.89461 15.1054C9.79134 16.0021 10.4774 17.0753 11 18.3338C11.5226 17.0753 12.2087 16.0021 13.1054 15.1054C14.0021 14.2087 15.0753 13.5226 16.3338 13C15.0753 12.4774 14.0021 11.7913 13.1054 10.8946C12.2087 9.99788 11.5226 8.9247 11 7.66618C10.4774 8.9247 9.79134 9.99788 8.89461 10.8946C7.99788 11.7913 6.9247 12.4774 5.66618 13Z" fill="currentColor"></path></svg>GPT-4 </div><div class="mx-auto max-w-xs pt-5 text-base font-normal text-token-text-secondary">Browsing, Advanced Data Analysis, and DALL-E are now built into GPT-4</div><div class="flex flex-wrap justify-center gap-3 pt-5">${uniqueToole.map((tool) => `<div class="flex items-center gap-0.5 pt-1 text-xs font-normal text-token-text-tertiary"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm text-green-600"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.0633 5.67378C18.5196 5.9849 18.6374 6.60703 18.3262 7.06334L10.8262 18.0633C10.6585 18.3094 10.3898 18.4678 10.0934 18.4956C9.79688 18.5234 9.50345 18.4177 9.29289 18.2071L4.79289 13.7071C4.40237 13.3166 4.40237 12.6834 4.79289 12.2929C5.18342 11.9024 5.81658 11.9024 6.20711 12.2929L9.85368 15.9395L16.6738 5.93667C16.9849 5.48036 17.607 5.36266 18.0633 5.67378Z" fill="currentColor"></path></svg>${toolPrettyName(tool)}</div>`).join('')}</div></div></div></div></div></div></div>`;
  // add to body
  document.body.insertAdjacentHTML('beforeend', aboutDialog);
  // add event listeners
  const aboutDialogCloseButton = document.querySelector('#gizmo-about-close-button');
  aboutDialogCloseButton.addEventListener('click', () => {
    const curAboutDialog = document.querySelector('#gizmo-about-dialog');
    curAboutDialog.remove();
  });
  // click outside content to close
  document.addEventListener('click', (e) => {
    const aboutDialogContent = document.querySelector('#gizmo-about-dialog-content');
    if (aboutDialogContent && !isDescendant(aboutDialogContent, e.target)) {
      const curAboutDialog = document.querySelector('#gizmo-about-dialog');
      curAboutDialog.remove();
    }
  });
}
function toolPrettyName(tool) {
  switch (tool) {
    case 'browser':
      return 'Browsing';
    case 'python':
      return 'Data Analysis';
    case 'dalle':
      return 'DALL•E';
    default:
      return tool;
  }
}
