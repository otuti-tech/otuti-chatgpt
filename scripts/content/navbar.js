/* global modelSwitcher, dropdown, addDropdownEventListener, languageList, writingStyleList, toneList, addModelSwitcherEventListener, pluginsDropdown, addPluginsDropdownEventListener, gizmoMenu, addGizmoMenuEventListeners, addUploadFileButton, getGizmoById, getGizmoIdFromUrl */
function addNavbar(conversation = null) {
  const pluginIds = conversation?.plugin_ids || [];
  const languageCode = conversation?.languageCode || null;
  const toneCode = conversation?.toneCode || null;
  const writingStyleCode = conversation?.writingStyleCode || null;
  const lastModelUsedInConversation = conversation?.mapping?.[conversation?.current_node]?.message?.metadata?.model_slug;
  const existingSyncBanner = document.querySelector('#sync-nav-wrapper');
  if (existingSyncBanner) existingSyncBanner.remove();
  const navWrapper = document.createElement('div');
  navWrapper.id = 'gptx-nav-wrapper';
  navWrapper.classList = 'w-full bg-transparent transition-all relative top-0';
  navWrapper.style = 'height: 56px;z-index:10000;';
  const navbar = document.createElement('div');
  navbar.id = 'gptx-navbar';
  navbar.classList = 'w-full flex items-center justify-between border-b h-14 border-black/10 px-3 py-1 text-gray-500 dark:border-gray-900/50 bg-token-main-surface-primary dark:text-gray-300 shadow-md';

  chrome.storage.local.get(['settings', 'models', 'selectedModel', 'installedPlugins', 'enabledPluginIds', 'unofficialModels', 'customModels'], (result) => {
    const {
      models, selectedModel, settings, unofficialModels, customModels, installedPlugins, enabledPluginIds,
    } = result;
    const {
      autoSync, selectedLanguage, selectedTone, selectedWritingStyle, autoHideTopNav,
    } = settings;
    if (autoHideTopNav) {
      navWrapper.style.top = '-56px';
      navWrapper.style.position = 'absolute';
      navWrapper.style.height = '112px';
    }
    const allModels = [...(models || []), ...(unofficialModels || []), ...(customModels || [])];

    let newSelectedModel = lastModelUsedInConversation ? allModels.find((m) => m.slug === lastModelUsedInConversation) : (selectedModel || allModels[0]);
    const gizmoId = getGizmoIdFromUrl();
    const newEnabledPluginIds = pluginIds || enabledPluginIds;
    const newSelectedLanguage = languageCode ? languageList.find((language) => language.code === languageCode) : selectedLanguage;
    const newSelectedTone = toneCode ? toneList.find((tone) => tone.code === toneCode) : selectedTone;
    const newSelectedWritingStyle = writingStyleCode ? writingStyleList.find((writingStyle) => writingStyle.code === writingStyleCode) : selectedWritingStyle;
    const { pathname } = new URL(window.location.toString());

    if (!pathname.startsWith('/g/g-') && newSelectedModel?.slug?.includes('gizmo')) {
      // eslint-disable-next-line prefer-destructuring
      newSelectedModel = allModels.find((m) => m.slug === 'gpt-4') || allModels[0];
    }
    chrome.storage.sync.get(['openai_id']).then((syncRes) => {
      const { openai_id: currentUserId } = syncRes;
      chrome.storage.local.set({
        selectedModel: newSelectedModel,
        settings: {
          ...settings,
          selectedLanguage: newSelectedLanguage,
          selectedTone: newSelectedTone,
          selectedWritingStyle: newSelectedWritingStyle,
        },
        enabledPluginIds: newEnabledPluginIds,
      }, () => {
        addUploadFileButton();
        // Add model switcher
        const leftSection = document.createElement('div');
        leftSection.style = 'display:flex;z-index:1000;margin-right:auto;height:100%;';
        const idPrefix = 'navbar';
        if (gizmoId) {
          getGizmoById(gizmoId).then((gizmoData) => {
            const gizmoMenuWrapper = document.createElement('div');
            gizmoMenuWrapper.style = 'position:relative;min-width:120px;z-index:1000';
            gizmoMenuWrapper.id = `gizmo-menu-wrapper-${idPrefix}`;

            gizmoMenuWrapper.innerHTML = gizmoMenu(gizmoData, currentUserId);
            leftSection.appendChild(gizmoMenuWrapper);
          });
        } else {
          const modelSwitcherWrapper = document.createElement('div');
          modelSwitcherWrapper.style = 'position:relative;width:240px;z-index:1000';
          modelSwitcherWrapper.id = `model-switcher-wrapper-${idPrefix}`;
          modelSwitcherWrapper.innerHTML = modelSwitcher(allModels, newSelectedModel, idPrefix, customModels, autoSync);
          leftSection.appendChild(modelSwitcherWrapper);
        }
        // Add plugins dropdown
        if (models?.map((m) => m.slug).find((m) => m.includes('plugins'))) {
          const pluginsDropdownWrapper = document.createElement('div');
          pluginsDropdownWrapper.style = 'position:relative;width:200px;margin-left:8px;z-index:1000;display:none';
          if (!pathname.startsWith('/g/g-') && newSelectedModel.slug.includes('plugins')) {
            pluginsDropdownWrapper.style.display = 'block';
          }
          if (conversation) {
            pluginsDropdownWrapper.style.pointerEvents = 'none';
            pluginsDropdownWrapper.style.opacity = '0.75';
            pluginsDropdownWrapper.title = 'Changing plugins in the middle of the conversation is not allowed';
          }
          pluginsDropdownWrapper.id = `plugins-dropdown-wrapper-${idPrefix}`;
          pluginsDropdownWrapper.innerHTML = pluginsDropdown(installedPlugins, newEnabledPluginIds, idPrefix);
          leftSection.appendChild(pluginsDropdownWrapper);
        }
        navbar.appendChild(leftSection);

        const rightSection = document.createElement('div');
        rightSection.style = 'display:flex;z-index:1000;margin-left:auto;';
        // Add tone selector
        const toneSelectorWrapper = document.createElement('div');
        toneSelectorWrapper.id = 'tone-selector-wrapper';
        toneSelectorWrapper.style = `position:relative;width:150px;margin-left:8px;display:${settings.showToneSelector ? 'block' : 'none'}`;
        toneSelectorWrapper.innerHTML = dropdown('Tone', toneList, newSelectedTone, 'right');
        rightSection.appendChild(toneSelectorWrapper);

        // Add writing style selector
        const writingStyleSelectorWrapper = document.createElement('div');
        writingStyleSelectorWrapper.id = 'writing-style-selector-wrapper';
        writingStyleSelectorWrapper.style = `position:relative;width:150px;margin-left:8px;display:${settings.showWritingStyleSelector ? 'block' : 'none'}`;
        writingStyleSelectorWrapper.innerHTML = dropdown('Writing-Style', writingStyleList, newSelectedWritingStyle, 'right');
        rightSection.appendChild(writingStyleSelectorWrapper);

        // Add language selector
        const languageSelectorWrapper = document.createElement('div');
        languageSelectorWrapper.id = 'language-selector-wrapper';
        languageSelectorWrapper.style = `position:relative;width:150px;margin-left:8px;display:${settings.showLanguageSelector ? 'block' : 'none'}`;
        languageSelectorWrapper.innerHTML = dropdown('Language', languageList, newSelectedLanguage, 'right');
        rightSection.appendChild(languageSelectorWrapper);
        navbar.appendChild(rightSection);

        navWrapper.addEventListener('mouseover', () => {
          chrome.storage.local.get(['settings'], (res) => {
            if (res.settings.autoHideTopNav) {
              navWrapper.style.top = '0px';
            }
          });
        });
        navWrapper.addEventListener('mouseout', () => {
          chrome.storage.local.get(['settings'], (res) => {
            if (res.settings.autoHideTopNav) {
              navWrapper.style.top = '-56px';
            }
          });
        });

        const main = document.querySelector('main');
        if (!main) return;
        navWrapper.appendChild(navbar);

        const existingNavWrapper = document.querySelector('#gptx-nav-wrapper');
        if (existingNavWrapper) {
          // replace existing nav wrapper
          existingNavWrapper.replaceWith(navWrapper);
        } else {
          main.parentNode.insertBefore(navWrapper, main);
        }
        // Add event listeners
        addModelSwitcherEventListener(idPrefix);
        if (gizmoId) {
          getGizmoById(gizmoId).then((gizmoData) => {
            addGizmoMenuEventListeners(gizmoData);
          });
        }
        if (models?.map((m) => m.slug).find((m) => m.includes('plugins'))) {
          addPluginsDropdownEventListener(idPrefix);
        }
        addDropdownEventListener('Tone', toneList);
        addDropdownEventListener('Writing-Style', writingStyleList);
        addDropdownEventListener('Language', languageList);
      });
    });
  });
}

// eslint-disable-next-line no-unused-vars
function initializeNavbar(conversation = null) {
  const { pathname } = new URL(window.location.toString());
  const isOnNewChatPage = pathname === '/';
  const isOnChat = pathname.startsWith('/c/') || pathname.startsWith('/g/');
  if (!isOnNewChatPage && !isOnChat) return;
  addNavbar(conversation);
}
