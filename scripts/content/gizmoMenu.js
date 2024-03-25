/* global isDescendant, updateActionSettings, showNewChatPage, updateGizmoSidebar, getGizmoUserActionSettings, toast, openOAuthDialog, getGizmoAbout, getGizmosByUser */
/* eslint-disable no-unused-vars */
function gizmoMenu(gizmoData, currentUserId, side = 'left', forceDark = false) {
  const gizmoResource = gizmoData?.resource;
  const gizmoId = gizmoResource?.gizmo?.id;
  const authorId = gizmoResource?.gizmo?.author?.user_id.split('__')?.[0];
  const isPublic = gizmoResource?.gizmo?.tags?.includes('public');
  const gizmoAction = gizmoResource?.tools?.find((tool) => !['browser', 'dalle', 'python']?.includes(tool.type));

  return `<div style="left:12px;height:46px;z-index:100;width:100%;"><button id="gizmo-menu" class="relative w-full h-full flex items-center cursor-pointer rounded-md border border-token-border-light bg-token-main-surface-primary p-2 text-center focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 sm:text-sm" type="button" data-gizmoAvatar="${gizmoResource?.gizmo?.display?.profile_picture_url}">
  <span class="flex items-center justify-center w-full truncate font-semibold text-token-text-primary">
${gizmoResource?.gizmo?.display?.name} <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="ml-2 h-4 w-4 text-gray-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"></polyline></svg></svg>
</button>
<ul id="gizmo-menu-options" style="max-height:400px;width:250px;" class="hidden transition-all absolute z-10 ${side === 'right' ? 'right-0' : 'left-0'} mt-1 overflow-auto rounded-md p-1 text-base ring-1 ring-opacity-5 focus:outline-none ${forceDark ? 'ring-white/20 last:border-0' : ''} bg-token-main-surface-primary dark:ring-white/20 dark:last:border-0 sm:text-sm -translate-x-1/4" role="menu" aria-orientation="vertical" tabindex="-1">

  <li class="flex text-token-text-primary py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="gizmo-menu-option-new-chat" role="option" tabindex="-1">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.7929 2.79289C18.0118 1.57394 19.9882 1.57394 21.2071 2.79289C22.4261 4.01184 22.4261 5.98815 21.2071 7.20711L12.7071 15.7071C12.5196 15.8946 12.2652 16 12 16H9C8.44772 16 8 15.5523 8 15V12C8 11.7348 8.10536 11.4804 8.29289 11.2929L16.7929 2.79289ZM19.7929 4.20711C19.355 3.7692 18.645 3.7692 18.2071 4.2071L10 12.4142V14H11.5858L19.7929 5.79289C20.2308 5.35499 20.2308 4.64501 19.7929 4.20711ZM6 5C5.44772 5 5 5.44771 5 6V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V14C19 13.4477 19.4477 13 20 13C20.5523 13 21 13.4477 21 14V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34314 4.34315 3 6 3H10C10.5523 3 11 3.44771 11 4C11 4.55228 10.5523 5 10 5H6Z" fill="currentColor"></path></svg>New chat
  </li>

  <li class="flex text-token-text-primary py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="gizmo-menu-option-about" role="option" tabindex="-1">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 icon-md"><path d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V12Z" fill="currentColor"></path><path d="M12 9.5C12.6904 9.5 13.25 8.94036 13.25 8.25C13.25 7.55964 12.6904 7 12 7C11.3096 7 10.75 7.55964 10.75 8.25C10.75 8.94036 11.3096 9.5 12 9.5Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" fill="currentColor"></path></svg>About
  </li>

  ${gizmoAction ? `<li class="flex text-token-text-primary py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="gizmo-menu-option-privacy-settings" role="option" tabindex="-1">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C9.79086 4 8 5.79086 8 8H16C16 5.79086 14.2091 4 12 4ZM6 10C5.44772 10 5 10.4477 5 11V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V11C19 10.4477 18.5523 10 18 10H6ZM6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8C19.6569 8 21 9.34315 21 11V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V11C3 9.34315 4.34315 8 6 8ZM10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14C14 14.7403 13.5978 15.3866 13 15.7324V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V15.7324C10.4022 15.3866 10 14.7403 10 14Z" fill="currentColor"></path></svg>Privacy settings
  </li>` : ''}
  ${authorId === currentUserId.split('__')?.[0] ? `<li class="flex text-token-text-primary py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="gizmo-menu-option-edit-gpt" role="option" tabindex="-1">
  <a href="https://chat.openai.com/gpts/editor/${gizmoId}" target="_self" class="flex items-center w-full truncate">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 icon-md"><path d="M11.6439 3C10.9352 3 10.2794 3.37508 9.92002 3.98596L9.49644 4.70605C8.96184 5.61487 7.98938 6.17632 6.93501 6.18489L6.09967 6.19168C5.39096 6.19744 4.73823 6.57783 4.38386 7.19161L4.02776 7.80841C3.67339 8.42219 3.67032 9.17767 4.01969 9.7943L4.43151 10.5212C4.95127 11.4386 4.95127 12.5615 4.43151 13.4788L4.01969 14.2057C3.67032 14.8224 3.67339 15.5778 4.02776 16.1916L4.38386 16.8084C4.73823 17.4222 5.39096 17.8026 6.09966 17.8083L6.93502 17.8151C7.98939 17.8237 8.96185 18.3851 9.49645 19.294L9.92002 20.014C10.2794 20.6249 10.9352 21 11.6439 21H12.3561C13.0648 21 13.7206 20.6249 14.08 20.014L14.5035 19.294C15.0381 18.3851 16.0106 17.8237 17.065 17.8151L17.9004 17.8083C18.6091 17.8026 19.2618 17.4222 19.6162 16.8084L19.9723 16.1916C20.3267 15.5778 20.3298 14.8224 19.9804 14.2057L19.5686 13.4788C19.0488 12.5615 19.0488 11.4386 19.5686 10.5212L19.9804 9.7943C20.3298 9.17767 20.3267 8.42219 19.9723 7.80841L19.6162 7.19161C19.2618 6.57783 18.6091 6.19744 17.9004 6.19168L17.065 6.18489C16.0106 6.17632 15.0382 5.61487 14.5036 4.70605L14.08 3.98596C13.7206 3.37508 13.0648 3 12.3561 3H11.6439Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path><circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="2"></circle></svg>Edit GPT</a>
  </li>` : ''}
  ${gizmoData?.flair?.kind === 'sidebar_keep' ? '<li class="flex text-token-text-primary py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="gizmo-menu-option-hide-from-sidebar" role="option" tabindex="-1"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 icon-md"><path d="M15 15V17.5585C15 18.4193 14.4491 19.1836 13.6325 19.4558L13.1726 19.6091C12.454 19.8487 11.6616 19.6616 11.126 19.126L4.87403 12.874C4.33837 12.3384 4.15132 11.546 4.39088 10.8274L4.54415 10.3675C4.81638 9.55086 5.58066 9 6.44152 9H9M12 6.2L13.6277 3.92116C14.3461 2.91549 15.7955 2.79552 16.6694 3.66942L20.3306 7.33058C21.2045 8.20448 21.0845 9.65392 20.0788 10.3723L18 11.8571" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 16L3 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 4L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>Hide from sidebar</li>' : '<li class="flex text-token-text-primary py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="gizmo-menu-option-keep-in-sidebar" role="option" tabindex="-1"><svg class="mr-2 icon-md" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.4845 2.8798C16.1773 1.57258 14.0107 1.74534 12.9272 3.24318L9.79772 7.56923C9.60945 7.82948 9.30775 7.9836 8.98654 7.9836H6.44673C3.74061 7.9836 2.27414 11.6759 4.16948 13.5713L6.59116 15.993L2.29324 20.2909C1.90225 20.6819 1.90225 21.3158 2.29324 21.7068C2.68422 22.0977 3.31812 22.0977 3.70911 21.7068L8.00703 17.4088L10.4287 19.8305C12.3241 21.7259 16.0164 20.2594 16.0164 17.5533V15.0135C16.0164 14.6923 16.1705 14.3906 16.4308 14.2023L20.7568 11.0728C22.2547 9.98926 22.4274 7.8227 21.1202 6.51549L17.4845 2.8798ZM11.8446 18.4147C12.4994 19.0694 14.0141 18.4928 14.0141 17.5533V15.0135C14.0141 14.0499 14.4764 13.1447 15.2572 12.58L19.5832 9.45047C20.0825 9.08928 20.1401 8.3671 19.7043 7.93136L16.0686 4.29567C15.6329 3.85993 14.9107 3.91751 14.5495 4.4168L11.4201 8.74285C10.8553 9.52359 9.95016 9.98594 8.98654 9.98594H6.44673C5.5072 9.98594 4.93059 11.5006 5.58535 12.1554L11.8446 18.4147Z" fill="currentColor"></path></svg>Keep in sidebar </li>'}
  ${isPublic ? `<li class="flex text-token-text-primary py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="gizmo-menu-option-copy-link" role="option" tabindex="-1">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.2929 5.70711C16.4743 3.88849 13.5257 3.88849 11.7071 5.70711L10.7071 6.70711C10.3166 7.09763 9.68341 7.09763 9.29289 6.70711C8.90236 6.31658 8.90236 5.68342 9.29289 5.2929L10.2929 4.29289C12.8926 1.69323 17.1074 1.69323 19.7071 4.2929C22.3068 6.89256 22.3068 11.1074 19.7071 13.7071L18.7071 14.7071C18.3166 15.0976 17.6834 15.0976 17.2929 14.7071C16.9024 14.3166 16.9024 13.6834 17.2929 13.2929L18.2929 12.2929C20.1115 10.4743 20.1115 7.52572 18.2929 5.70711ZM15.7071 8.2929C16.0976 8.68342 16.0976 9.31659 15.7071 9.70711L9.7071 15.7071C9.31658 16.0976 8.68341 16.0976 8.29289 15.7071C7.90236 15.3166 7.90236 14.6834 8.29289 14.2929L14.2929 8.2929C14.6834 7.90237 15.3166 7.90237 15.7071 8.2929ZM6.7071 9.2929C7.09763 9.68342 7.09763 10.3166 6.7071 10.7071L5.7071 11.7071C3.88849 13.5257 3.88849 16.4743 5.7071 18.2929C7.52572 20.1115 10.4743 20.1115 12.2929 18.2929L13.2929 17.2929C13.6834 16.9024 14.3166 16.9024 14.7071 17.2929C15.0976 17.6834 15.0976 18.3166 14.7071 18.7071L13.7071 19.7071C11.1074 22.3068 6.89255 22.3068 4.29289 19.7071C1.69322 17.1074 1.69322 12.8926 4.29289 10.2929L5.29289 9.2929C5.68341 8.90237 6.31658 8.90237 6.7071 9.2929Z" fill="currentColor"></path></svg>Copy link
  </li>` : ''}

  ${isPublic && false ? `<li class="flex text-token-text-primary py-2 relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="gizmo-menu-option-report" role="option" tabindex="-1">
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
    option.addEventListener('click', (e) => {
      const id = option.id.split('gizmo-menu-option-')[1];

      if (id === 'new-chat') {
        showNewChatPage(gizmoData?.resource);
      }
      if (id === 'about') {
        e.preventDefault();
        e.stopPropagation();
        getGizmoAbout(gizmoData?.resource?.gizmo?.id).then((gizmoAbout) => {
          showGizmoAboutDialog(gizmoAbout);
        });
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
  getGizmoUserActionSettings(gizmoResource.gizmo.id).then((allUserActionSettings) => {
    const gizmoActions = gizmoResource.tools.filter((tool) => !['browser', 'dalle', 'python'].includes(tool.type));
    const privacySettingsDialog = `<div id="gizmo-privacy-settings-dialog" class="absolute inset-0">
    <div data-state="open" class="fixed inset-0 bg-black/50 dark:bg-black/80" style="pointer-events: auto;">
      <div class="grid h-full w-full grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,_1fr)_auto_minmax(10px,_1fr)] overflow-y-auto md:grid-rows-[minmax(20px,_1fr)_auto_minmax(20px,_1fr)]" style="opacity: 1; transform: none;">
        <div role="dialog" id="gizmo-privacy-settings-dialog-content" aria-describedby="radix-:r25j:" aria-labelledby="radix-:r25i:" data-state="open" class="popover relative left-1/2 col-auto col-start-2 row-auto row-start-2 w-full -translate-x-1/2 rounded-xl bg-token-main-surface-primary text-left shadow-xl transition-all flex flex-col focus:outline-none min-h-[50vh] max-w-3xl overflow-y-auto scroll-smooth" tabindex="-1" style="pointer-events: auto;">
          <div class="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-black/10 dark:border-white/10">
            <div class="flex">
              <div class="flex items-center">
                <div class="flex grow flex-col gap-1">
                  <h2 id="radix-:r25i:" as="h3" class="text-lg font-medium leading-6 text-token-text-primary">GPT's privacy settings</h2>
                </div>
              </div>
            </div>
            <button id="gizmo-privacy-settings-close-button" class="text-token-text-tertiary hover:text-token-text-secondary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M6.34315 6.34338L17.6569 17.6571M17.6569 6.34338L6.34315 17.6571" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
          </div>
          <div class="flex-grow overflow-y-auto">
            <div dir="ltr" data-orientation="vertical" class="flex flex-row gap-6 p-4">
              <div role="tablist" aria-orientation="vertical" class="flex min-w-[180px] max-w-[200px] flex-shrink-0 flex-col gap-2" tabindex="0" data-orientation="vertical" style="outline: none;">
                <button type="button" role="tab" aria-selected="true" aria-controls="radix-:r26e:-content-actions" data-state="active" id="gizmo-privacy-settings-tab-actions" class="flex rounded-md px-2 py-1.5 text-sm text-token-text-primary radix-state-active:bg-white dark:radix-state-active:bg-token-main-surface-tertiary md:radix-state-active:bg-token-main-surface-tertiary md:radix-state-active:text-token-text-primary" tabindex="0" data-orientation="vertical" data-radix-collection-item="">
                  <div class="truncate">Actions</div>
                </button>
                <button type="button" role="tab" aria-selected="false" aria-controls="radix-:r26e:-content-connected_accounts" data-state="inactive" id="gizmo-privacy-settings-tab-connected-accounts" class="flex rounded-md px-2 py-1.5 text-sm text-token-text-primary radix-state-active:bg-white dark:radix-state-active:bg-token-main-surface-tertiary md:radix-state-active:bg-token-main-surface-tertiary md:radix-state-active:text-token-text-primary" tabindex="-1" data-orientation="vertical" data-radix-collection-item="">
                  <div class="truncate">Connected accounts</div>
                </button>
              </div>
              <div id="gizmo-privacy-settings-tab-content" class="flex-1 text-sm">
                <div id="gizmo-privacy-settings-tab-actions-content" class="flex flex-col gap-6">Select which 3rd party actions are allowed in conversations with ${gizmoResource.gizmo.display.name}.
                ${gizmoActions.map((gizmoAction) => {
      const userActionSettings = allUserActionSettings.settings.find((actionSetting) => actionSetting.action_id === gizmoAction.metadata?.action_id)?.action_settings;
      return `<div>
                    <div class="flex flex-row justify-between py-3 items-center border-b border-black/10 dark:border-white/10">
                      <div class="flex flex-row space-x-4">
                        <div class="font-medium">${gizmoAction.metadata.domain}</div>
                        <a href="${gizmoAction.metadata.privacy_policy_url}" target="_blank" rel="noreferrer" class="flex items-center gap-1 text-token-text-tertiary hover:cursor-pointer hover:text-token-text-secondary">Privacy policy
                          <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      </div>
                      <select id="gizmo-privacy-settings-action-${gizmoAction.metadata?.action_id}" class="rounded border-none bg-token-main-surface-primary text-sm">
                        <option ${userActionSettings?.all === 'always_allow' ? 'selected' : ''} value="always_allow">Always allow</option>
                        <option ${(userActionSettings?.all === 'unset' || typeof userActionSettings?.all === 'undefined') ? 'selected' : ''} value="unset">Ask</option>
                      </select>
                    </div>
                  </div>`;
    }).join('')}
                </div>
                <div id="gizmo-privacy-settings-tab-connected-accounts-content" class="flex flex-col gap-6 hidden">Manage which 3rd party accounts can be accessed by ${gizmoResource.gizmo.display.name}.
                  <div>
                  ${gizmoActions.filter((gizmoAction) => gizmoAction.metadata?.auth?.type === 'oauth')?.map((gizmoAction) => `<div class="flex flex-row justify-between py-3 items-center">
                        <div class="font-medium">plugin.scholar-ai.net</div>
                        <button id="gizmo-connected-account-action-${gizmoAction.metadata?.action_id}" class="btn relative btn-neutral px-2 py-1">
                          <div class="flex w-full gap-2 items-center justify-center">Log in</div>
                        </button>
                      </div>`).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
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
        const gizmoActionId = select.id.split('gizmo-privacy-settings-action-')[1];
        const gizmoAction = gizmoActions.find((action) => action.metadata.action_id === gizmoActionId);
        const { domain } = gizmoAction.metadata;
        const { value } = e.target;
        const newActionSettings = {
          all: value,
        };
        updateActionSettings(gizmoResource.gizmo.id, domain, gizmoActionId, newActionSettings);
      });
    });

    // add event listeners to connected account buttons
    const connectedAccountButtons = document.querySelectorAll('[id^=gizmo-connected-account-action-]');
    connectedAccountButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const gizmoActionId = button.id.split('gizmo-connected-account-action-')[1];
        const gizmoAction = gizmoActions.find((action) => action.metadata.action_id === gizmoActionId);
        const { domain } = gizmoAction.metadata;
        const redirectTo = encodeURIComponent(`https://chat.openai.com/g/${gizmoResource.gizmo.short_url}`);
        openOAuthDialog(gizmoResource.gizmo.id, domain, gizmoActionId, redirectTo);
      });
    });
  });
}
function showReportDialog(gizmoResource) {

}
function showGizmoAboutDialog(gizmoResource, showStartChat = false) {
  const uniqueTools = gizmoResource.tools.map((tool) => tool.type).filter((value, index, self) => self.indexOf(value) === index);
  const title = gizmoResource?.gizmo?.display?.name;
  const creator = gizmoResource?.gizmo?.author?.display_name || 'community builder';
  const authorLink = gizmoResource ? gizmoResource?.gizmo?.author?.link_to || '' : '';
  const creatorElement = authorLink ? `<a href="${authorLink}" target="_blank" class="underline">${creator}</a>` : creator;
  const rating = gizmoResource?.about_blocks?.find((block) => block.type === 'rating');
  const category = gizmoResource?.about_blocks?.find((block) => block.type === 'category');
  const conversations = gizmoResource?.about_blocks?.find((block) => block.type === 'generic_title_subtitle');
  const conversationStarters = gizmoResource?.gizmo?.display?.prompt_starters.sort(() => Math.random() - 0.5).slice(0, 4);

  const aboutDialog = `<div id="gizmo-about-dialog" class="absolute inset-0">
  <div data-state="open" class="fixed inset-0 bg-black/50 dark:bg-black/80" style="pointer-events: auto;">
    <div class="grid h-full w-full grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,_1fr)_auto_minmax(10px,_1fr)] overflow-y-auto md:grid-rows-[minmax(20px,_1fr)_auto_minmax(20px,_1fr)]" style="opacity: 1; transform: none;">
      <div role="dialog" id="gizmo-about-dialog-content" aria-describedby="radix-:r6c:" aria-labelledby="radix-:r6b:" data-state="open" class="popover relative left-1/2 col-auto col-start-2 row-auto row-start-2 w-full -translate-x-1/2 rounded-xl bg-token-main-surface-primary text-left shadow-xl transition-all flex flex-col focus:outline-none max-w-md flex h-[calc(100vh-25rem)] min-h-[80vh] max-w-xl flex-col" tabindex="-1" style="pointer-events: auto;">
        <div class="flex-grow overflow-y-auto">
          <div class="relative flex h-full flex-col gap-2 overflow-hidden px-2 py-4">
            <div id="gizmo-about-dialog-inner-content" class="relative flex flex-grow flex-col gap-4 overflow-y-auto px-6 pb-20 pt-16">
              <div class="absolute top-0">
                <div class="fixed left-4 right-4 z-10 flex min-h-[64px] items-start justify-end gap-4 bg-gradient-to-b from-token-main-surface-primary to-transparent px-2">
                  <button id="gizmo-about-menu-button" type="button" id="radix-:r6d:" aria-haspopup="menu" aria-expanded="false" data-state="closed" class="hidden text-token-text-primary border border-transparent inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-white px-3 text-sm dark:transparent dark:bg-transparent leading-none outline-none cursor-pointer hover:bg-token-main-surface-secondary dark:hover:bg-token-main-surface-secondary focus-visible:border-green-500 dark:focus-visible:border-green-500 radix-state-active:text-token-text-secondary radix-disabled:cursor-auto radix-disabled:bg-transparent radix-disabled:text-token-text-tertiary dark:radix-disabled:bg-transparent focus:border-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                      xmlns="http://www.w3.org/2000/svg" class="text-token-text-tertiary hover:text-token-text-secondary">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path>
                    </svg>
                  </button>
                  <button id="gizmo-about-close-button" class="text-token-text-tertiary hover:text-token-text-secondary">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.34315 6.34338L17.6569 17.6571M17.6569 6.34338L6.34315 17.6571" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="absolute bottom-[64px]">
                <div class="fixed left-4 right-4 z-10 flex min-h-[64px] items-end bg-gradient-to-t from-token-main-surface-primary to-transparent px-2">
                  ${showStartChat ? `<div class="flex flex-grow flex-col items-center"><a target="_self" class="btn relative btn-primary h-12 w-full" as="link" to="/g/${gizmoResource.gizmo.short_url}" href="/g/${gizmoResource.gizmo.short_url}"><div class="flex w-full gap-2 items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-lg"><g id="chat"><path id="vector" fill-rule="evenodd" clip-rule="evenodd" d="M12 4.5C7.58172 4.5 4 8.08172 4 12.5C4 14.6941 4.88193 16.6802 6.31295 18.1265C6.6343 18.4513 6.69466 18.9526 6.45959 19.3443L5.76619 20.5H12C16.4183 20.5 20 16.9183 20 12.5C20 8.08172 16.4183 4.5 12 4.5ZM2 12.5C2 6.97715 6.47715 2.5 12 2.5C17.5228 2.5 22 6.97715 22 12.5C22 18.0228 17.5228 22.5 12 22.5H4C3.63973 22.5 3.30731 22.3062 3.1298 21.9927C2.95229 21.6792 2.95715 21.2944 3.14251 20.9855L4.36137 18.9541C2.88894 17.2129 2 14.9595 2 12.5Z" fill="currentColor"></path></g></svg>Start Chat</div></a></div>` : ''}
                </div>
              </div>
              <div class="flex h-full flex-col items-center justify-center text-token-text-primary !h-fit">
                <div class="relative">
                  <div class="mb-3 h-12 w-12 !h-20 !w-20">
                    <div class="gizmo-shadow-stroke overflow-hidden rounded-full">
                      <img src="${gizmoResource.gizmo.display.profile_picture_url}" class="h-full w-full bg-token-main-surface-secondary" alt="GPT" width="80" height="80">
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <div class="text-center text-2xl font-medium">${title}</div>
                    <div class="flex items-center gap-1 text-token-text-tertiary">
                      <div class="mt-1 flex flex-row items-center space-x-1">
                        <div class="text-sm text-token-text-tertiary">By ${creatorElement}</div>
                        <div>
                          <div title="The builder of this GPT cannot view your conversations." class="my-2" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r6f:" data-state="closed">
                            <div class="flex items-center gap-1 rounded-xl bg-token-main-surface-secondary px-2 py-1">
                              <svg width="24" height="24" viewBox="0 0 20 20" fill="red"
                                xmlns="http://www.w3.org/2000/svg" class="icon-xs text-token-text-secondary">
                                <path id="vector" fill-rule="evenodd" clip-rule="evenodd" d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM9.98514 2.00291C9.99328 2.00046 9.99822 2.00006 9.99964 2C10.001 2.00006 10.0067 2.00046 10.0149 2.00291C10.0256 2.00615 10.047 2.01416 10.079 2.03356C10.2092 2.11248 10.4258 2.32444 10.675 2.77696C10.9161 3.21453 11.1479 3.8046 11.3486 4.53263C11.6852 5.75315 11.9156 7.29169 11.981 9H8.01901C8.08442 7.29169 8.3148 5.75315 8.65137 4.53263C8.85214 3.8046 9.08392 3.21453 9.32495 2.77696C9.57422 2.32444 9.79081 2.11248 9.92103 2.03356C9.95305 2.01416 9.97437 2.00615 9.98514 2.00291ZM6.01766 9C6.08396 7.13314 6.33431 5.41167 6.72334 4.00094C6.87366 3.45584 7.04762 2.94639 7.24523 2.48694C4.48462 3.49946 2.43722 5.9901 2.06189 9H6.01766ZM2.06189 11H6.01766C6.09487 13.1737 6.42177 15.1555 6.93 16.6802C7.02641 16.9694 7.13134 17.2483 7.24522 17.5131C4.48461 16.5005 2.43722 14.0099 2.06189 11ZM8.01901 11H11.981C11.9045 12.9972 11.6027 14.7574 11.1726 16.0477C10.9206 16.8038 10.6425 17.3436 10.3823 17.6737C10.2545 17.8359 10.1506 17.9225 10.0814 17.9649C10.0485 17.9852 10.0264 17.9935 10.0153 17.9969C10.0049 18.0001 9.99994 18 9.99994 18C9.99994 18 9.99479 18 9.98471 17.9969C9.97356 17.9935 9.95155 17.9852 9.91857 17.9649C9.84943 17.9225 9.74547 17.8359 9.61768 17.6737C9.35747 17.3436 9.0794 16.8038 8.82736 16.0477C8.39726 14.7574 8.09547 12.9972 8.01901 11ZM13.9823 11C13.9051 13.1737 13.5782 15.1555 13.07 16.6802C12.9736 16.9694 12.8687 17.2483 12.7548 17.5131C15.5154 16.5005 17.5628 14.0099 17.9381 11H13.9823ZM17.9381 9C17.5628 5.99009 15.5154 3.49946 12.7548 2.48694C12.9524 2.94639 13.1263 3.45584 13.2767 4.00094C13.6657 5.41167 13.916 7.13314 13.9823 9H17.9381Z" fill="currentColor"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="max-w-md text-center text-sm font-normal text-token-text-primary">${gizmoResource.gizmo.display.description}</div>
                  </div>
                </div>
                <div class="flex justify-center">
                  ${rating ? `<div class="flex flex-col justify-center items-center gap-2 border-l border-token-border-heavy first:border-0 w-48 mt-4 px-2">
                    <div class="flex flex-row items-center gap-1.5 pt-1 text-xl font-medium text-center leading-none">
                      <svg width="24" height="24" viewBox="0 0 39 39" fill="none"
                        xmlns="http://www.w3.org/2000/svg" class="icon-sm">
                        <path d="M15.6961 2.70609C17.4094 -0.33367 21.7868 -0.333671 23.5002 2.70609L27.237 9.33591C27.3648 9.56271 27.585 9.72268 27.8402 9.77418L35.3003 11.2794C38.7207 11.9695 40.0734 16.1327 37.7119 18.7015L32.5613 24.3042C32.3851 24.4958 32.301 24.7547 32.3309 25.0133L33.2046 32.5734C33.6053 36.0397 30.0639 38.6127 26.891 37.1605L19.971 33.9933C19.7342 33.885 19.4621 33.885 19.2253 33.9933L12.3052 37.1605C9.1324 38.6127 5.59103 36.0397 5.99163 32.5734L6.86537 25.0133C6.89526 24.7547 6.81116 24.4958 6.63496 24.3042L1.48438 18.7015C-0.877157 16.1327 0.475528 11.9695 3.89596 11.2794L11.356 9.77418C11.6113 9.72268 11.8314 9.56271 11.9593 9.33591L15.6961 2.70609Z" fill="currentColor"></path>
                      </svg>${rating.avg}
                    </div>
                    <div class="text-xs text-token-text-tertiary">${rating.count_str}</div>
                  </div>` : ''}
                  ${category ? `<div class="flex flex-col justify-center items-center gap-2 border-l border-token-border-heavy first:border-0 w-48 mt-4 px-2">
                    <div class="flex flex-row items-center gap-1.5 pt-1 text-xl font-medium text-center leading-none">${category.category_ranking ? `#${category.category_ranking}` : category.category_str}</div>
                    <div class="text-xs text-token-text-tertiary">${category.category_ranking ? `in ${category.category_str} ${category.category_locale_str}` : 'Category'}</div>
                  </div>` : ''}
                  ${conversations ? `<div class="flex flex-col justify-center items-center gap-2 border-l border-token-border-heavy first:border-0 w-48 mt-4 px-2">
                    <div class="flex flex-row items-center gap-1.5 pt-1 text-xl font-medium text-center leading-none">${conversations.title}</div>
                    <div class="text-xs text-token-text-tertiary">${conversations.subtitle}</div>
                  </div>` : ''}
                </div>
                <div class="flex flex-col">
                  <div class="font-bold mt-6">Conversation Starters</div>
                  <div class="mt-4 grid grid-cols-2 gap-x-1.5 gap-y-2">
                    ${conversationStarters.map((conversationStarter) => `<div class="flex" tabindex="0">
                      <a class="group relative ml-2 h-14 flex-grow rounded-xl border border-token-border-medium bg-token-main-surface-primary px-4 hover:bg-token-main-surface-secondary focus:outline-none" target="_self" href="/g/${gizmoResource.gizmo.short_url}?p=${conversationStarter}">
                        <div class="flex h-full items-center">
                          <div class="text-sm line-clamp-2 break-all">${conversationStarter}</div>
                        </div>
                        <div class="absolute -bottom-px -left-2 h-3 w-4 border-b border-token-border-medium bg-token-main-surface-primary group-hover:bg-token-main-surface-secondary">
                          <div class="h-3 w-2 rounded-br-full border-b border-r border-token-border-medium bg-token-main-surface-primary"></div>
                        </div>
                        <div class="absolute bottom-0 right-2 top-0 hidden items-center group-hover:flex">
                          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-token-main-surface-primary">
                            <svg width="24" height="24" viewBox="0 0 24 25" fill="none"
                              xmlns="http://www.w3.org/2000/svg" class="icon-md text-token-text-primary">
                              <g id="chat">
                                <path id="vector" fill-rule="evenodd" clip-rule="evenodd" d="M12 4.5C7.58172 4.5 4 8.08172 4 12.5C4 14.6941 4.88193 16.6802 6.31295 18.1265C6.6343 18.4513 6.69466 18.9526 6.45959 19.3443L5.76619 20.5H12C16.4183 20.5 20 16.9183 20 12.5C20 8.08172 16.4183 4.5 12 4.5ZM2 12.5C2 6.97715 6.47715 2.5 12 2.5C17.5228 2.5 22 6.97715 22 12.5C22 18.0228 17.5228 22.5 12 22.5H4C3.63973 22.5 3.30731 22.3062 3.1298 21.9927C2.95229 21.6792 2.95715 21.2944 3.14251 20.9855L4.36137 18.9541C2.88894 17.2129 2 14.9595 2 12.5Z" fill="currentColor"></path>
                              </g>
                            </svg>
                          </div>
                        </div>
                      </a>
                    </div>`).join('')}
                  </div>
                </div>
                <div class="flex flex-col">
                  <div class="font-bold mt-6 mb-2">Capabilities</div>
                  ${uniqueTools.map((tool) => `<div class="flex flex-row items-start gap-2 py-1 text-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                      xmlns="http://www.w3.org/2000/svg" class="icon-sm mt-0.5 text-green-600">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0633 5.67375C18.5196 5.98487 18.6374 6.607 18.3262 7.06331L10.8262 18.0633C10.6585 18.3093 10.3898 18.4678 10.0934 18.4956C9.79688 18.5234 9.50345 18.4176 9.29289 18.2071L4.79289 13.7071C4.40237 13.3166 4.40237 12.6834 4.79289 12.2929C5.18342 11.9023 5.81658 11.9023 6.20711 12.2929L9.85368 15.9394L16.6738 5.93664C16.9849 5.48033 17.607 5.36263 18.0633 5.67375Z" fill="currentColor"></path>
                    </svg>
                    <div>${toolPrettyName(tool)}
                      ${tool === 'plugins_prototype' ? '<div class="text-xs text-token-text-tertiary">Retrieves or takes actions outside of ChatGPT</div>' : ''}
                    </div>
                  </div>`).join('')}
                </div>
                <div class="flex flex-col">
                  <div class="mb-2">
                    <div class="font-bold mt-6">Ratings</div>
                  </div>
                ${gizmoResource?.review_stats?.by_rating.length > 0 ? `${gizmoResource?.review_stats?.by_rating?.reverse()?.map((ratingStat, index) => `
                  <div class="flex flex-row items-center gap-2 py-1 text-xl font-medium">
                    <div class="icon-lg relative">
                      <svg width="24" height="24" viewBox="0 0 39 39" fill="none"
                        xmlns="http://www.w3.org/2000/svg" class="icon-lg text-green-500">
                        <path d="M15.6961 2.70609C17.4094 -0.33367 21.7868 -0.333671 23.5002 2.70609L27.237 9.33591C27.3648 9.56271 27.585 9.72268 27.8402 9.77418L35.3003 11.2794C38.7207 11.9695 40.0734 16.1327 37.7119 18.7015L32.5613 24.3042C32.3851 24.4958 32.301 24.7547 32.3309 25.0133L33.2046 32.5734C33.6053 36.0397 30.0639 38.6127 26.891 37.1605L19.971 33.9933C19.7342 33.885 19.4621 33.885 19.2253 33.9933L12.3052 37.1605C9.1324 38.6127 5.59103 36.0397 5.99163 32.5734L6.86537 25.0133C6.89526 24.7547 6.81116 24.4958 6.63496 24.3042L1.48438 18.7015C-0.877157 16.1327 0.475528 11.9695 3.89596 11.2794L11.356 9.77418C11.6113 9.72268 11.8314 9.56271 11.9593 9.33591L15.6961 2.70609Z" fill="currentColor"></path>
                      </svg>
                      <div class="absolute inset-0 flex items-center justify-center text-[11px] text-white">${5 - index}</div>
                    </div>
                    <div class="h-2.5 flex-grow overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                      <div class="h-full bg-green-500" style="width: ${ratingStat * 100}%;"></div>
                    </div>
                  </div>`).join('')}
                ` : '<div class="text-sm text-token-text-tertiary">Not enough ratings yet</div>'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
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
  getGizmosByUser(gizmoResource?.gizmo?.author?.user_id).then((response) => {
    const gizmosByUser = response.items;
    if (gizmosByUser.length === 0) return;
    const gizmosByUserElement = `<div class="flex flex-col"><div class="mb-2"><div class="font-bold mt-6">More by ${gizmoResource.gizmo.author.display_name}</div></div><div class="no-scrollbar group flex min-h-[104px] items-center space-x-2 overflow-x-auto overflow-y-hidden">
      ${gizmosByUser.map((gizmoByUser) => `
      <a href="/g/${gizmoByUser.gizmo.short_url}" class="h-fit min-w-fit rounded-xl bg-token-main-surface-secondary px-1 py-4 md:px-3 md:py-4 lg:px-3"><div class="flex w-full flex-grow items-center gap-4 overflow-hidden"><div class="h-12 w-12 flex-shrink-0"><div class="gizmo-shadow-stroke overflow-hidden rounded-full"><img src="${gizmoByUser.gizmo.display.profile_picture_url}" class="h-full w-full bg-token-main-surface-secondary" alt="GPT" width="80" height="80"></div></div><div class="overflow-hidden text-ellipsis break-words"><span class="text-sm font-medium leading-tight line-clamp-2">${gizmoByUser.gizmo.display.name}</span><span class="text-xs line-clamp-3">${gizmoByUser.gizmo.display.description}</span><div class="mt-1 flex items-center gap-1 text-ellipsis whitespace-nowrap pr-1 text-xs text-token-text-tertiary"><div class="mt-1 flex flex-row items-center space-x-1"><div class="text-token-text-tertiary text-xs">By ${gizmoByUser.gizmo.author.display_name}</div></div><span class="text-[8px]">•</span><svg width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3"><path id="vector" fill-rule="evenodd" clip-rule="evenodd" d="M9 2.33317C5.31811 2.33317 2.33334 5.31794 2.33334 8.99984C2.33334 10.8282 3.06828 12.4833 4.2608 13.6886C4.52859 13.9592 4.57889 14.377 4.383 14.7034L3.80516 15.6665H9C12.6819 15.6665 15.6667 12.6817 15.6667 8.99984C15.6667 5.31794 12.6819 2.33317 9 2.33317ZM0.666672 8.99984C0.666672 4.39746 4.39763 0.666504 9 0.666504C13.6024 0.666504 17.3333 4.39746 17.3333 8.99984C17.3333 13.6022 13.6024 17.3332 9 17.3332H2.33334C2.03311 17.3332 1.75609 17.1717 1.60817 16.9104C1.46025 16.6492 1.4643 16.3285 1.61876 16.0711L2.63448 14.3782C1.40745 12.9272 0.666672 11.0494 0.666672 8.99984Z" fill="currentColor"></path></svg>${gizmoByUser.gizmo.vanity_metrics.num_conversations_str}</div></div></div></a>`).join('')}  
    </div></div>`;
    const aboutDialogInnerContent = document.querySelector('#gizmo-about-dialog-inner-content');
    aboutDialogInnerContent.insertAdjacentHTML('beforeend', gizmosByUserElement);
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
    case 'plugins_prototype':
      return 'Actions';
    default:
      return tool;
  }
}
