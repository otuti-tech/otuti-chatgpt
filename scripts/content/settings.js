// eslint-disable-next-line no-unused-vars
/* global isFirefox, isOpera, createModal, Sortable, getGizmoById, generateRandomDarkColor, createReleaseNoteModal, languageList, writingStyleList, toneList, toast, loadConversationList, modelSwitcher, openUpgradeModal, addModelSwitcherEventListener, dropdown, addDropdownEventListener, API_URL:true, showConfirmDialog, createContinueButton, speechToTextLanguageList, initializePromptChain, addPromptChainCreateButton, addKeyboardShortcutsModalButton, initializePromptLibrary, initializePromptHistory, updateAccountUserSetting, checkSyncAndLoad, textToSpeechVoiceList, synthesize, getUserSettings, defaultPrompts */

const autoArchiveModes = [
  { code: "dias", name: "Arquivar conversas após" },
  { code: "number", name: "Manter apenas as últimas" },
];
let settingTestAudio;

function createSettingsModal(initialTab = 0) {
  const bodyContent = settingsModalContent(initialTab);
  const actionsBarContent = settingsModalActions();
  createModal(
    "Configurações",
    "Você pode alterar as configurações do Superpower aqui",
    bodyContent,
    actionsBarContent
  );
}
const inactiveTabElementStyles =
  "border-right: 1px solid lightslategray; border-bottom:2px solid white; border-top-right-radius: 16px; font-size: 0.8em;  padding:8px 12px;color: lightslategray;margin:-1px;height:100%;min-width:100px;";
const activeTabElementStyles =
  "background-color: #0b0d0e;border:solid 2px white; border-bottom:0; border-top-right-radius: 16px;font-size: 0.8em; padding:8px 12px;color: white;height:100%;min-width:100px;";
function selectedTabContent(selectedTab, hasSubscription) {
  switch (selectedTab) {
    case 0:
      return generalTabContent(hasSubscription);
    case 1:
      return autoSyncTabContent(hasSubscription);
    case 2:
      return historyTabContent(hasSubscription);
    case 3:
      return conversationTabContent(hasSubscription);
    case 4:
      return textToSpeechTabContent(hasSubscription);
    case 5:
      return promptInputTabContent(hasSubscription);
    case 6:
      return modelsTabContent(hasSubscription);
    case 7:
      return customPromptTabContent(hasSubscription);
    case 8:
      return exportTabContent(hasSubscription);
    case 9:
      return splitterTabContent(hasSubscription);
    case 10:
      return newsletterTabContent(hasSubscription);
    default:
      return generalTabContent(hasSubscription);
  }
}
function settingsModalContent(initialTab = 0) {
  const settingsTabs = [
    "Geral",
    "Sincronização Automática",
    "Histórico",
    "Conversa",
    "Voz",
    "Entrada de Prompt",
    "Modelos",
    "Prompts Personalizados",
    "Exportar",
    "Divisor",
    "Newsletter",
  ];
  let activeTab = initialTab;
  // create history modal content
  const content = document.createElement("div");
  content.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start;width:100%; height: 100%;";
  const tabs = document.createElement("div");
  tabs.style =
    "display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; background-color: #1e1e2f;z-index:1000;overflow:hidden; overflow-x:scroll;-ms-overflow-style: none; scrollbar-width: none;";
  // hide scrollbar for chrome
  tabs.classList.add("scrollbar-hide");
  chrome.runtime.sendMessage(
    {
      checkHasSubscription: true,
      detail: {
        forceRefresh: false,
      },
    },
    (hasSubscription) => {
      settingsTabs.forEach((tab, index) => {
        const tabButton = document.createElement("button");
        if (activeTab === settingsTabs.indexOf(tab)) {
          tabButton.classList = "active-tab";
        } else {
          tabButton.removeAttribute("class");
        }
        tabButton.style =
          activeTab === settingsTabs.indexOf(tab)
            ? activeTabElementStyles
            : inactiveTabElementStyles;

        tabButton.textContent = tab;
        tabButton.addEventListener("click", () => {
          activeTab = index;
          const activeTabElemet = document.querySelector(".active-tab");
          activeTabElemet.style = inactiveTabElementStyles;
          activeTabElemet.removeAttribute("class");
          tabButton.classList = "active-tab";
          tabButton.style = activeTabElementStyles;
          const settingsModalTabContent = document.querySelector(
            "#settings-modal-tab-content"
          );
          const newContent = selectedTabContent(activeTab, hasSubscription);
          settingsModalTabContent.parentNode.replaceChild(
            newContent,
            settingsModalTabContent
          );
        });
        tabs.appendChild(tabButton);
      });
      const tabsLastChild = document.createElement("div");
      tabsLastChild.style =
        "width:100%; height:100%; border-bottom: solid 2px white;";
      tabs.appendChild(tabsLastChild);
      content.appendChild(selectedTabContent(activeTab, hasSubscription));
    }
  );

  content.appendChild(tabs);
  return content;
}
function generalTabContent(hasSubscription = false) {
  const content = document.createElement("div");
  content.id = "settings-modal-tab-content";
  content.style =
    "display: flex; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; height: 100%;padding-bottom:80px;";
  const leftContent = document.createElement("div");
  leftContent.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start; width: 50%;padding-right: 8px;";
  const rightContent = document.createElement("div");
  rightContent.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: end; width: 50%;padding-left: 8px;";

  // dark mode
  const darkModeSwitchWrapper = document.createElement("div");
  darkModeSwitchWrapper.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start; width: 100%; margin: 8px 0;";
  const darkModeSwitch = document.createElement("div");
  darkModeSwitch.style =
    "display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0;color:white;";
  darkModeSwitch.textContent = "Modo Escuro";
  const darkModeLabel = document.createElement("label");
  darkModeLabel.classList = "sp-switch";
  const darkModeInput = document.createElement("input");
  darkModeInput.type = "checkbox";
  darkModeInput.checked = !!document
    .querySelector("html")
    .classList.contains("dark");
  darkModeInput.addEventListener("change", () => {
    if (document.querySelector("html").classList.contains("dark")) {
      document.querySelector("html").classList.replace("dark", "light");
      document.querySelector("html").style = "color-scheme: light;";
      window.localStorage.setItem("theme", "light");
    } else {
      document.querySelector("html").classList.replace("light", "dark");
      document.querySelector("html").style = "color-scheme: dark;";
      window.localStorage.setItem("theme", "dark");
    }
  });
  const darkModeSlider = document.createElement("span");
  darkModeSlider.classList = "sp-switch-slider round";

  darkModeLabel.appendChild(darkModeInput);
  darkModeLabel.appendChild(darkModeSlider);
  darkModeSwitch.appendChild(darkModeLabel);
  darkModeSwitchWrapper.appendChild(darkModeSwitch);
  leftContent.appendChild(darkModeSwitchWrapper);

  // release note

  const hideReleaseNoteSwitch = createSwitch(
    "Ocultar Nota de Lançamento",
    "Não mostrar nota de lançamento quando a extensão for atualizada",
    "hideReleaseNote",
    true
  );
  leftContent.appendChild(hideReleaseNoteSwitch);

  const hideUpdateNotificationSwitch = createSwitch(
    "Ocultar Notificação de Atualização",
    "Não mostrar notificação de atualização quando uma nova versão estiver disponível",
    "hideUpdateNotification",
    false
  );
  leftContent.appendChild(hideUpdateNotificationSwitch);

  const crossDeviceSyncSwitch = createSwitch(
    "Sincronização Entre Dispositivos",
    "Sincronizar configurações, pastas, prompts personalizados, cadeias de prompt e histórico em todos os seus dispositivos",
    "crossDeviceSync",
    hasSubscription,
    refreshPage,
    ["⚡️ Requer Conta Pro", "Novo"],
    !hasSubscription
  );
  leftContent.appendChild(crossDeviceSyncSwitch);

  const enhanceGPTStoreSwitch = createSwitch(
    "Loja GPT Melhorada",
    "Obter acesso à lista completa de milhares de GPTs Personalizados com a capacidade de pesquisar e ordenar diretamente do ChatGPT",
    "enhanceGPTStore",
    true,
    refreshPage,
    ["Requer Atualização"]
  );
  leftContent.appendChild(enhanceGPTStoreSwitch);

  const importExportKeys = [
    "settings",
    "customModels",
    "customPrompts",
    "customInstructionProfiles",
    "promptChains",
    "conversationsOrder",
    "syncImagesCompletedAgainAgain",
    "syncedConvIdsNew",
    "allConversationsOrder",
  ];

  const importExportWrapper = document.createElement("div");
  importExportWrapper.style =
    "display: flex; flex-direction: row; flex-wrap: wrap; justify-content: start; align-items: center; width: 100%; margin: 8px 0; color:white;";
  const importExportLabel = document.createElement("div");
  importExportLabel.style = "width: 100%; margin: 8px 0;";
  importExportLabel.innerHTML =
    'Importar / Exportar Configurações, Prompts Personalizados e Pastas (<a style="text-decoration:underline; color:gold;" href="https://www.otuti.so" target="blank">Saiba Mais</a>)';
  importExportWrapper.appendChild(importExportLabel);

  const importExportButtonWrapper = document.createElement("div");
  importExportButtonWrapper.style =
    "display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0;";

  const importButton = document.createElement("button");
  importButton.classList =
    "w-full px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-token-main-surface-secondary";
  importButton.textContent = "Importar";
  importButton.addEventListener("click", () => {
    // open file picker
    const filePicker = document.createElement("input");
    filePicker.type = "file";
    filePicker.accept = ".json";
    filePicker.addEventListener("change", (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (document.querySelector("#modal-close-button-settings")) {
          document.querySelector("#modal-close-button-settings").click();
        }
        const dataFromFile = JSON.parse(e.target.result);
        // get importExportKeys from importedData
        const importedData = {};
        importExportKeys.forEach((key) => {
          if (dataFromFile[key]) {
            importedData[key] = dataFromFile[key];
          }
        });
        chrome.storage.local.set(importedData, () => {
          window.location.reload();
          toast("Configurações importadas com sucesso!");
        });
      };
      reader.readAsText(file);
    });
    filePicker.click();
  });
  importExportButtonWrapper.appendChild(importButton);

  const exportButton = document.createElement("button");
  exportButton.classList =
    "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-token-main-surface-secondary";
  exportButton.textContent = "Exportar";
  exportButton.addEventListener("click", () => {
    chrome.storage.sync.get(["version"], ({ version }) => {
      chrome.storage.local.get(importExportKeys, (result) => {
        const data = {
          version,
          ...result,
        };
        const element = document.createElement("a");
        element.setAttribute(
          "href",
          `data:text/plain;charset=utf-8,${encodeURIComponent(
            JSON.stringify(data)
          )}`
        );
        const todatDate = new Date();
        const filePostfix = `${todatDate.getFullYear()}-${
          todatDate.getMonth() + 1
        }-${todatDate.getDate()}`;

        element.setAttribute(
          "download",
          `superpower-chatgpt-settings-${filePostfix}.json`
        );
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast("Configurações exportadas com sucesso!");
      });
    });
  });
  importExportButtonWrapper.appendChild(exportButton);
  importExportWrapper.appendChild(importExportButtonWrapper);

  leftContent.appendChild(importExportWrapper);

  // discord widget
  const discordWidget = document.createElement("div");
  discordWidget.innerHTML =
    '<iframe style="border-radius:8px;width:350px; max-width:100%;height:400px;" src="https://discord.com" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>';
  rightContent.appendChild(discordWidget);
  content.appendChild(leftContent);
  content.appendChild(rightContent);
  // extra links
  const linkWrapper = document.createElement("div");
  linkWrapper.style =
    "display: flex; flex-direction: row; flex-wrap:wrap; justify-content: start; align-items: start; width: 100%; padding: 8px 16px; position:absolute; bottom:0; left:0;background-color:#0b0d0e;border-top:1px solid #565869;";

  // add a link to Updates and FAQ
  const updatesLink = document.createElement("a");
  updatesLink.href = "https://help.openai.com/en/collections/3742473-chatgpt";
  updatesLink.target = "_blank";
  updatesLink.textContent = "Obter Suporte ➜";
  updatesLink.style =
    "color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;padding-right:";
  updatesLink.addEventListener("mouseover", () => {
    updatesLink.style =
      "color: gold; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;";
  });
  updatesLink.addEventListener("mouseout", () => {
    updatesLink.style =
      "color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;";
  });
  linkWrapper.appendChild(updatesLink);

  // add link for sponsorship
  const sponsorLink = document.createElement("a");
  sponsorLink.href = "https://www.otuti.me/";
  sponsorLink.target = "_blank";
  sponsorLink.textContent = "Parcerias ➜";
  sponsorLink.style =
    "color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;";
  sponsorLink.addEventListener("mouseover", () => {
    sponsorLink.style =
      "color: gold; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;";
  });
  sponsorLink.addEventListener("mouseout", () => {
    sponsorLink.style =
      "color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;";
  });
  linkWrapper.appendChild(sponsorLink);

  // add link for FAQ
  const faqLink = document.createElement("a");
  faqLink.href = "https://otuti.site/";
  faqLink.target = "_blank";
  faqLink.textContent = "FAQ ➜";
  faqLink.style =
    "color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;";
  faqLink.addEventListener("mouseover", () => {
    faqLink.style =
      "color: gold; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;";
  });
  faqLink.addEventListener("mouseout", () => {
    faqLink.style =
      "color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;";
  });
  linkWrapper.appendChild(faqLink);

  // add link for YouTube
  const youtubeLink = document.createElement("a");
  youtubeLink.href = "https://www.youtube.com/@otuti";
  youtubeLink.target = "_blank";
  youtubeLink.textContent = "YouTube ➜";
  youtubeLink.style =
    "color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;";
  youtubeLink.addEventListener("mouseover", () => {
    youtubeLink.style =
      "color: gold; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;";
  });
  youtubeLink.addEventListener("mouseout", () => {
    youtubeLink.style =
      "color: #999; font-size: 12px; margin: 8px 0;min-width: 25%;text-align:center;padding-right: 8px;";
  });
  linkWrapper.appendChild(youtubeLink);
  content.appendChild(linkWrapper);

  return content;
}
function toggleCustomWidthInput(customConversationWidth) {
  chrome.storage.local.get(["settings"], (result) => {
    const customWidthInput = document.getElementById(
      "conversation-width-input"
    );
    customWidthInput.disabled = !customConversationWidth;
    const { settings } = result;
    if (customConversationWidth) {
      Array.from(document.querySelectorAll("[id^=message-wrapper]")).forEach(
        (el) => {
          el.querySelector(
            "div"
          ).style.maxWidth = `${settings.conversationWidth}%`;
        }
      );
      if (document.querySelector("#conversation-bottom")) {
        document.querySelector(
          "#conversation-bottom"
        ).firstChild.style.maxWidth = `${settings.conversationWidth}%`;
      }
      document.querySelector(
        "main form"
      ).style.maxWidth = `${settings.conversationWidth}%`;
    } else {
      Array.from(document.querySelectorAll("[id^=message-wrapper]")).forEach(
        (el) => {
          el.querySelector("div").style.removeProperty("max-width");
        }
      );
      if (document.querySelector("#conversation-bottom")) {
        document
          .querySelector("#conversation-bottom")
          .firstChild.style.removeProperty("max-width");
      }
      document.querySelector("main form").style.removeProperty("max-width");
    }
  });
}
function autoSyncTabContent(hasSubscription = false) {
  const content = document.createElement("div");
  content.id = "settings-modal-tab-content";
  content.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;";
  // Auto Sync

  const autoSyncSwitch = createSwitch(
    "Sincronização Automática",
    "Baixe e sincronize automaticamente todas as suas conversas com o seu computador. A Sincronização Automática só funciona quando o ChatGPT está aberto. Desativar a Sincronização Automática também desativará algumas das funcionalidades existentes, como Pastas, Pesquisa e Galeria.",
    "autoSync",
    true,
    refreshPage,
    ["Requer Atualização"]
  );

  content.appendChild(autoSyncSwitch);
  chrome.storage.local.get(["settings", "totalConversations"], (result) => {
    const { autoSync } = result.settings;

    const autoSyncCountSlider = createSlider(
      "Contagem de Sincronização Automática",
      `O número de conversas recentes a serem sincronizadas. Para o melhor desempenho, configure para <300. Você tem um total de <b class="text-gold">${result.totalConversations}</b> conversas. <a class="underline text-gold" href="https://www.youtube.com/watch?v=t2fEPVQT-X4&ab_channel=Superpower">Saiba mais</a>`,
      "autoSyncCount",
      100,
      0,
      1000,
      100,
      autoSyncCountCallback,
      "Requer Sincronização Automática",
      !autoSync
    );

    content.appendChild(autoSyncCountSlider);

    const autoRefreshAfterSyncSwitch = createSwitch(
      "Atualização Automática Após Sincronização",
      "Atualiza automaticamente a página após a conclusão da sincronização das conversas",
      "autoRefreshAfterSync",
      true,
      null,
      ["Requires Auto-Sync"],
      !autoSync
    );
    content.appendChild(autoRefreshAfterSyncSwitch);

    // add a title that says warning zone
    const warningZoneTitle = document.createElement("div");
    warningZoneTitle.style =
      "width:100%;font-size:0.8em;color:lightslategray;margin-top:24px;";
    warningZoneTitle.innerText = "Warning Zone";
    content.appendChild(warningZoneTitle);
    // add a divider
    const divider = document.createElement("div");
    divider.style =
      "width:100%;height:1px;background-color:lightslategray;margin:0 0 24px 0;";
    content.appendChild(divider);

    // Reset Auto Sync
    const resetAutoSyncButton = document.createElement("button");
    resetAutoSyncButton.textContent = "Resetar Auto Sync";
    resetAutoSyncButton.disabled = !autoSync;
    resetAutoSyncButton.style.pointerEvents = !autoSync ? "none" : "auto";
    resetAutoSyncButton.classList =
      "btn btn-warning flex justify-center gap-2 border-0 md:border";
    resetAutoSyncButton.addEventListener("click", () => {
      showConfirmDialog(
        "Reiniciar Auto Sincronização",
        "Clicar em Reiniciar irá atualizar a página e tentar ressincronizar todas as suas conversas. Suas pastas também serão removidas.",
        "Reiniciar",
        null,
        resetAutoSync,
        "orange"
      );
    });
    content.appendChild(resetAutoSyncButton);
    const resetAutoSyncDesc = document.createElement("div");
    resetAutoSyncDesc.style =
      "width:100%;font-size:0.8em;color:lightslategray;margin-top:8px;";
    resetAutoSyncDesc.innerText =
      "Isso irá ressincronizar todas as conversas do banco de dados do ChatGPT. Isso é útil se você estiver tendo problemas com a Auto Sincronização. Resetar a Auto Sincronização também removerá todas as suas pastas.";
    content.appendChild(resetAutoSyncDesc);
  });

  return content;
}
function autoSyncCountCallback(oldValue, newValue) {
  if (oldValue === newValue) return;
  showConfirmDialog(
    `Atualização da Contagem de Sincronização Automática: <span class="text-gold text-xs">${
      oldValue === "1000" ? "Todas as Conversas" : oldValue
    } ➜ ${newValue === "1000" ? "Todas as Conversas" : newValue}</span>`,
    "Clicar em Confirmar irá atualizar a página",
    "Confirmar",
    () => autoSyncCountCancelCallback(oldValue),
    refreshPage,
    "orange"
  );
}

function autoSyncCountCancelCallback(oldValue) {
  chrome.storage.local.get(["settings"], (result) => {
    chrome.storage.local.set({
      settings: { ...result.settings, autoSyncCount: oldValue },
    });
    const autoSyncCountInput = document.querySelector(
      "#sp-range-slider-autoSyncCount"
    );
    autoSyncCountInput.value = oldValue;
    const autoSyncCountSliderValue = document.querySelector(
      "#sp-range-slider-value-autoSyncCount"
    );
    autoSyncCountSliderValue.innerHTML =
      oldValue === "1000" ? "Todas as conversas" : oldValue;
  });
}
function resetAutoSync() {
  chrome.storage.local.set(
    {
      conversations: {},
      conversationsOrder: [],
      conversationsAreSynced: false,
    },
    () => {
      refreshPage();
    }
  );
}
function reloadConversationList(skipFullReload = true) {
  chrome.storage.local.get(["settings"], (result) => {
    const { autoSync } = result.settings;
    if (autoSync) {
      loadConversationList(skipFullReload);
    } else {
      refreshPage();
    }
  });
}

function sortConversationsByTimestamp(
  conversationsOrder,
  conversations,
  settings
) {
  const folders = conversationsOrder.filter((c) => typeof c !== "string");
  // close all folders
  folders?.forEach((f) => {
    if (f) f.isOpen = false;
  });
  folders.forEach((folder) => {
    if (folder.conversationIds.length > 0) {
      const folderConversations = Object.values(conversations).filter((c) =>
        folder?.conversationIds?.includes(c?.id)
      );
      const sortedFolderConversations = folderConversations.sort(
        (a, b) => b.update_time - a.update_time
      );
      folder.conversationIds = sortedFolderConversations.map((c) => c.id);
    }
  });
  // sort folders alphabetically
  if (settings?.autoSortFolders) {
    folders.sort((a, b) => a.name.localeCompare(b.name));
  }
  const conversationIds = conversationsOrder.filter(
    (c) => typeof c === "string"
  );

  // sort conversationIds by last updated time
  conversationIds.sort((a, b) => {
    const aLastUpdated = conversations[a]?.update_time || 0;
    const bLastUpdated = conversations[b]?.update_time || 0;
    return bLastUpdated - aLastUpdated;
  });

  const newConversationsOrder = [...folders, ...conversationIds];
  return newConversationsOrder;
}
// eslint-disable-next-line no-unused-vars
function toggleKeepFoldersAtTheTop(isChecked) {
  chrome.storage.local.get(
    ["conversationsOrder", "conversations", "settings"],
    (result) => {
      const { conversationsOrder, conversations, settings } = result;
      const newConversationsOrder = sortConversationsByTimestamp(
        conversationsOrder,
        conversations,
        settings
      );
      chrome.storage.local.set(
        { conversationsOrder: newConversationsOrder },
        () => reloadConversationList()
      );
    }
  );
}
function toggleShowFolderCounts(isChecked) {
  const allFolderTitleElements = document.querySelectorAll(
    "[id^=title-folder-]"
  );
  allFolderTitleElements.forEach((el) => {
    el.style.bottom = isChecked ? "5px" : "0px";
  });
  const allFolderCountElements = document.querySelectorAll(
    "[id^=count-folder-]"
  );
  allFolderCountElements.forEach((el) => {
    el.style.display = isChecked ? "block" : "none";
  });
}
function toggleGpt4Counter(show) {
  const gpt4CounterElement = document.querySelector("#gpt4-counter");
  if (gpt4CounterElement)
    gpt4CounterElement.style.display = show ? "block" : "none";
}
function toggleTopNav(autohide) {
  const navWrapperElement = document.querySelector("#gptx-nav-wrapper");
  if (autohide) {
    navWrapperElement.style.top = "-56px";
    navWrapperElement.style.position = "absolute";
    navWrapperElement.style.height = "112px";
  } else {
    navWrapperElement.style.top = "0px";
    navWrapperElement.style.position = "relative";
    navWrapperElement.style.height = "56px";
  }
}
function historyTabContent(hasSubscription = false) {
  const content = document.createElement("div");
  content.id = "settings-modal-tab-content";
  content.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;";
  chrome.storage.local.get(["settings"], (result) => {
    const {
      autoSync,
      autoArchiveOldChats,
      autoArchiveMode,
      autoArchiveThreshold,
    } = result.settings;

    const showFolderCountsSwitch = createSwitch(
      "Mostrar Contagem das Pastas",
      "Mostra o número de conversas em cada pasta",
      "showFolderCounts",
      true,
      toggleShowFolderCounts,
      ["Requer Auto-Sincronização"],
      !autoSync
    );
    content.appendChild(showFolderCountsSwitch);

    const showMyPromptHistorySwitch = createSwitch(
      "Mostrar Meu Histórico de Prompts",
      "Mostrar o botão Meu Histórico de Prompts na barra lateral",
      "showMyPromptHistory",
      true,
      toggleShowMyPromptHistory,
      ["Novo"]
    );
    content.appendChild(showMyPromptHistorySwitch);

    const showCommunityPromptsSwitch = createSwitch(
      "Mostrar Prompts da Comunidade",
      "Mostrar o botão Prompts da Comunidade na barra lateral",
      "showCommunityPrompts",
      true,
      toggleShowCommunityPrompts,
      ["Novo"]
    );
    content.appendChild(showCommunityPromptsSwitch);

    const customGPTAutoFolderSwitch = createSwitch(
      "Pasta Automática para GPT Personalizado",
      "Salvar automaticamente Chats de GPT Personalizados em pastas separadas",
      "customGPTAutoFolder",
      false,
      toggleCustomGPTAutoFolder,
      ["Requer Auto-Sincronização", "⚡️ Requer Conta Pro"],
      !hasSubscription || !autoSync
    );
    content.appendChild(customGPTAutoFolderSwitch);

    const autoColorFoldersSwitch = createSwitch(
      "Pastas com Cores Automáticas",
      "Selecionar automaticamente uma cor aleatória ao criar pastas",
      "autoColorFolders",
      false,
      null,
      ["Requer Auto-Sincronização"],
      !autoSync
    );
    content.appendChild(autoColorFoldersSwitch);

    const autoSortFoldersSwitch = createSwitch(
      "Ordenação Automática de Pastas",
      "Ordenar automaticamente as pastas em ordem alfabética",
      "autoSortFolders",
      true,
      reloadConversationList,
      ["Requer Auto-Sincronização"],
      !autoSync
    );
    content.appendChild(autoSortFoldersSwitch);

    const multiSelectIndicatorSwitch = createSwitch(
      "Indicador de Múltipla Seleção",
      "Abrir automaticamente a barra lateral inferior ao selecionar múltiplos chats",
      "multiSelectIndicator",
      true
    );
    content.appendChild(multiSelectIndicatorSwitch);

    // auto archive
    const autoArchiveOldChatsSwitch = createSwitch(
      "Arquivar Automaticamente Chats Antigos",
      'Arquivar automaticamente chats antigos (<a style="text-decoration:underline; color:gold;" href="https://www.youtube.com/@otuti" target="blank">Saiba Mais</a>)',
      "autoArchiveOldChats",
      false,
      toggleAutoArchiveOldChats,
      ["Necessário Auto-Sincronização"],
      !autoSync
    );
    content.appendChild(autoArchiveOldChatsSwitch);

    const autoArchiveModesWrapper = document.createElement("div");
    autoArchiveModesWrapper.id = "autoArchiveModesWrapper";
    autoArchiveModesWrapper.style =
      "position:relative;z-index:1000;display:flex;align-items:center;";
    autoArchiveModesWrapper.innerHTML = dropdown(
      "Auto-Archive-Mode",
      autoArchiveModes,
      autoArchiveMode,
      "left",
      true
    );
    if (!hasSubscription || !autoSync || !autoArchiveOldChats) {
      autoArchiveModesWrapper.style.opacity = 0.5;
      autoArchiveModesWrapper.style.pointerEvents = "none";
    }
    // input for number of days
    const autoArchiveThresholdInput = document.createElement("input");
    autoArchiveThresholdInput.id = "auto-archive-threshold-input";
    autoArchiveThresholdInput.type = "number";
    autoArchiveThresholdInput.classList =
      "w-20 px-4 py-2 ml-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-token-main-surface-secondary disabled:opacity-40 text-white";
    autoArchiveThresholdInput.value = autoArchiveThreshold;
    autoArchiveThresholdInput.addEventListener("change", () => {
      const curAutoArchiveThresholdInput = document.querySelector(
        "#auto-archive-threshold-input"
      );
      const newValue = Math.round(curAutoArchiveThresholdInput.value);
      curAutoArchiveThresholdInput.value = newValue;
      chrome.storage.local.get("settings", ({ settings }) => {
        chrome.storage.local.set({
          settings: { ...settings, autoArchiveThreshold: newValue },
        });
      });
    });
    autoArchiveThresholdInput.addEventListener("input", () => {
      const curAutoArchiveThresholdInput = document.querySelector(
        "#auto-archive-threshold-input"
      );
      const newValue = Math.round(curAutoArchiveThresholdInput.value);
      curAutoArchiveThresholdInput.value = newValue;
      chrome.storage.local.get("settings", ({ settings }) => {
        chrome.storage.local.set({
          settings: { ...settings, autoArchiveThreshold: newValue },
        });
      });
    });

    autoArchiveModesWrapper.appendChild(autoArchiveThresholdInput);

    const autoArchiveThresholdLabel = document.createElement("label");
    autoArchiveThresholdLabel.id = "auto-archive-threshold-label";
    autoArchiveThresholdLabel.classList =
      "ml-2 mr-4 text-sm text-gray-300 flex items-center";
    autoArchiveThresholdLabel.textContent =
      autoArchiveMode.code === "days" ? "days" : "chats";
    autoArchiveModesWrapper.appendChild(autoArchiveThresholdLabel);

    const skipAutoArchiveFolderSwitch = createSwitch(
      "Ignorar Chats em Pastas",
      "Ignorar o arquivamento de chats que estão em uma pasta",
      "skipAutoArchiveFolder",
      false,
      null
    );
    autoArchiveModesWrapper.appendChild(skipAutoArchiveFolderSwitch);

    content.appendChild(autoArchiveModesWrapper);
    addDropdownEventListener(
      "Auto-Archive-Mode",
      autoArchiveModes,
      toggleAutoArchiveOldChatMode
    );

    // add a title that says warning zone
    const warningZoneTitle = document.createElement("div");
    warningZoneTitle.style =
      "width:100%;font-size:0.8em;color:lightslategray;margin-top:24px;";
    warningZoneTitle.innerText = "Warning Zone";
    content.appendChild(warningZoneTitle);
    // add a divider
    const divider = document.createElement("div");
    divider.style =
      "width:100%;height:1px;background-color:lightslategray;margin:0 0 24px 0;";
    content.appendChild(divider);

    // Reset Folders
    const resetFoldersButton = document.createElement("button");
    resetFoldersButton.textContent = "Resetar Pastas";
    resetFoldersButton.disabled = !autoSync;
    resetFoldersButton.style.pointerEvents = !autoSync ? "none" : "auto";
    resetFoldersButton.classList =
      "btn btn-warning flex justify-center gap-2 border-0 md:border";
    resetFoldersButton.addEventListener("click", () => {
      showConfirmDialog(
        "Resetar Pastas",
        "Clicar em Reiniciar removerá todas as pastas e permitirá que você as recrie novamente.",
        "Reiniciar",
        null,
        resetFolders,
        "laranja"
      );
    });
    content.appendChild(resetFoldersButton);
    const resetFoldersDesc = document.createElement("div");
    resetFoldersDesc.style =
      "width:100%;font-size:0.8em;color:lightslategray;margin-top:8px;";
    resetFoldersDesc.innerText =
      "Isto removerá todas as pastas, mas as conversas dentro das pastas não serão deletadas.";
    content.appendChild(resetFoldersDesc);
  });
  return content;
}
function toggleShowMyPromptHistory(isChecked) {
  if (isChecked) {
    initializePromptHistory();
  } else {
    const myPromptHistoryButton = document.querySelector(
      "#my-prompt-history-button"
    );
    if (myPromptHistoryButton) {
      myPromptHistoryButton.remove();
    }
  }
}
function toggleShowCommunityPrompts(isChecked) {
  if (isChecked) {
    initializePromptLibrary();
  } else {
    const communityPromptsButton = document.querySelector(
      "#community-prompts-button"
    );
    if (communityPromptsButton) {
      communityPromptsButton.remove();
    }
  }
}
function resetFolders() {
  chrome.storage.local.remove("conversationsOrder", () => {
    window.location.reload();
  });
}
function toggleCustomGPTAutoFolder(isChecked) {
  if (isChecked) {
    chrome.runtime.sendMessage(
      {
        checkHasSubscription: true,
        detail: {
          forceRefresh: true,
        },
      },
      (hasSubscription) => {
        if (!hasSubscription) {
          toast("Está ação exige uma Assinatura Pro", "error");
          return;
        }
        chrome.storage.local.get(
          ["conversations", "conversationsOrder", "settings"],
          (result) => {
            const { conversations, conversationsOrder, settings } = result;
            // find custom gpt conversations
            const conversationIds = conversationsOrder.filter(
              (c) => typeof c === "string"
            );
            const customGPTConversations = conversationIds
              .map((c) => conversations[c])
              .filter((c) => c?.gizmo_id);
            const customGPTConversationIds = customGPTConversations.map(
              (c) => c.id
            );

            // get unique gizmo_ids
            const uniqueGizmoIds = [
              ...new Set(customGPTConversations.map((c) => c.gizmo_id)),
            ];
            if (uniqueGizmoIds.length === 0) return;

            // for each id in customGPTConversations,
            const newConversationOrder = conversationsOrder.filter(
              (c) =>
                typeof c !== "string" || !customGPTConversationIds.includes(c)
            );

            // get gizmo_name for each gizmo_id
            const processedGizmoIds = [];
            // add an overlay to the full page with wpinner and text that says auto folder is being created
            const overlay = document.createElement("div");
            overlay.id = "loading-overlay";
            overlay.style =
              "position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.5); z-index:100000; display:flex; justify-content:center; align-items:center;";
            overlay.innerHTML =
              '<div class="w-full flex-wrap inset-0 flex items-center justify-center text-white"><svg x="0" y="0" viewbox="0 0 40 40" class="spinner"><circle fill="transparent" stroke="#ffffff50" stroke-width="4" stroke-linecap="round" stroke-dasharray="125.6" cx="20" cy="20" r="18"></circle></svg><div style="font-size: 1.5em;font-weight: 600;color: lightslategray;width: 100%;display: flex;align-items: center;justify-content: center;margin-top:16px;">Creating Custom GPT Folders</div></div>';
            document.body.appendChild(overlay);
            // for each gizmo_id, get gizmo_name and create a folder with that name
            uniqueGizmoIds.forEach((gid) =>
              getGizmoById(gid).then((gizmoData) => {
                const existingFolder = newConversationOrder.find(
                  (f) => f?.id === gid
                );
                if (existingFolder) {
                  newConversationOrder.find(
                    (f) => f?.id === gid
                  ).conversationIds = [
                    ...new Set([
                      ...existingFolder.conversationIds,
                      ...customGPTConversations
                        .filter((c) => c.gizmo_id === gid)
                        .map((c) => c.id),
                    ]),
                  ];
                } else {
                  newConversationOrder.unshift({
                    id: gid,
                    color: settings.autoColorFolders
                      ? generateRandomDarkColor()
                      : "#40414f",
                    name: gizmoData?.resource?.gizmo?.display?.name || gid,
                    conversationIds: [
                      ...new Set(
                        customGPTConversations
                          .filter((c) => c.gizmo_id === gid)
                          .map((c) => c.id)
                      ),
                    ],
                  });
                }
                processedGizmoIds.push(gid);
                if (processedGizmoIds.length === uniqueGizmoIds.length) {
                  chrome.storage.local.set(
                    { conversationsOrder: newConversationOrder },
                    () => {
                      reloadConversationList();
                      // remove the overlay
                      document.querySelector("#loading-overlay").remove();
                    }
                  );
                }
              })
            );
          }
        );
      }
    );
  }
}
function toggleAutoArchiveOldChats(isChecked) {
  const autoArchiveModesWrapper = document.querySelector(
    "#autoArchiveModesWrapper"
  );
  if (isChecked) {
    autoArchiveModesWrapper.style.opacity = 1;
    autoArchiveModesWrapper.style.pointerEvents = "auto";
    toast("Auto Archive Old Chats Enabled", "warning");
  } else {
    autoArchiveModesWrapper.style.opacity = 0.5;
    autoArchiveModesWrapper.style.pointerEvents = "none";
  }
}
function toggleAutoArchiveOldChatMode(mode) {
  chrome.storage.local.get("settings", ({ settings }) => {
    chrome.storage.local.set(
      { settings: { ...settings, autoArchiveMode: mode } },
      () => {
        const autoArchiveThresholdLabel = document.querySelector(
          "#auto-archive-threshold-label"
        );
        autoArchiveThresholdLabel.textContent =
          mode.code === "days" ? "days" : "chats";
      }
    );
  });
}
function conversationTabContent(hasSubscription = false) {
  const content = document.createElement("div");
  content.id = "settings-modal-tab-content";
  content.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;";
  chrome.storage.local.get(["settings"], (result) => {
    const { autoSync, customConversationWidth, conversationWidth } =
      result.settings;

    // conversation width
    const customConversationWidthSwitch = createSwitch(
      "Largura Personalizada da Conversa",
      "DESLIGADO: Usar padrão / LIGADO: Definir Largura da Conversa (30%-90%)",
      "customConversationWidth",
      false,
      toggleCustomWidthInput,
      ["Requer Auto-Sincronização"],
      !autoSync
    );

    content.appendChild(customConversationWidthSwitch);

    const conversationWidthInput = document.createElement("input");
    conversationWidthInput.id = "conversation-width-input";
    conversationWidthInput.type = "number";
    conversationWidthInput.classList =
      "max-w-full px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-token-main-surface-secondary disabled:opacity-40 text-white";
    conversationWidthInput.disabled = !customConversationWidth;
    conversationWidthInput.value = conversationWidth;
    conversationWidthInput.addEventListener("change", () => {
      const curConversationWidthInput = document.querySelector(
        "#conversation-width-input"
      );
      const newValue = Math.round(curConversationWidthInput.value);
      curConversationWidthInput.value = newValue;
      Array.from(document.querySelectorAll("[id^=message-wrapper]")).forEach(
        (el) => {
          el.querySelector("div").style.maxWidth = `${newValue}%`;
        }
      );
      if (document.querySelector("#conversation-bottom")) {
        document.querySelector(
          "#conversation-bottom"
        ).firstChild.style.maxWidth = `${newValue}%`;
      }
      document.querySelector("main form").style.maxWidth = `${newValue}%`;
      chrome.storage.local.get("settings", ({ settings }) => {
        chrome.storage.local.set({
          settings: {
            ...settings,
            conversationWidth: newValue,
            customConversationWidth: true,
          },
        });
      });
    });
    conversationWidthInput.addEventListener("input", () => {
      const curConversationWidthInput = document.querySelector(
        "#conversation-width-input"
      );
      const newValue = Math.round(curConversationWidthInput.value);
      curConversationWidthInput.value = newValue;
      Array.from(document.querySelectorAll("[id^=message-wrapper]")).forEach(
        (el) => {
          el.querySelector("div").style.maxWidth = `${newValue}%`;
        }
      );
      if (document.querySelector("#conversation-bottom")) {
        document.querySelector(
          "#conversation-bottom"
        ).firstChild.style.maxWidth = `${newValue}%`;
      }
      document.querySelector("main form").style.maxWidth = `${newValue}%`;
      chrome.storage.local.get("settings", ({ settings }) => {
        chrome.storage.local.set({
          settings: {
            ...settings,
            conversationWidth: newValue,
            customConversationWidth: true,
          },
        });
      });
    });
    content.appendChild(conversationWidthInput);

    const pluginDefaultOpenSwitch = createSwitch(
      "Abrir Detalhe do Plugin por Padrão",
      "Mostrar detalhe do plugin por padrão",
      "pluginDefaultOpen",
      false,
      togglePluginDefaultOpen,
      ["Requer Auto-Sincronização"],
      !autoSync
    );
    content.appendChild(pluginDefaultOpenSwitch);

    const alternateMainColorsSwitch = createSwitch(
      "Alternar Cores de Fundo",
      "Alternar as cores de fundo entre usuário e ChatGPT",
      "alternateMainColors",
      false,
      toggleAlternateMainColors,
      ["Requer Auto-Sincronização", "Novo"],
      !autoSync
    );
    content.appendChild(alternateMainColorsSwitch);

    const showLanguageSelectorSwitch = createSwitch(
      "Mostrar Seletor de Idioma",
      "Mostrar o seletor de idioma na barra superior",
      "showLanguageSelector",
      false,
      toggleShowLanguageSelector,
      ["Requer Auto-Sincronização", "Novo"],
      !autoSync
    );
    content.appendChild(showLanguageSelectorSwitch);

    const showWritingStyleSelectorSwitch = createSwitch(
      "Mostrar Seletor de Estilo de Escrita",
      "Mostrar o seletor de estilo de escrita na barra superior",
      "showWritingStyleSelector",
      false,
      toggleShowWritingStyleSelector,
      ["Requer Auto-Sincronização", "Novo"],
      !autoSync
    );
    content.appendChild(showWritingStyleSelectorSwitch);

    const showToneSelectorSwitch = createSwitch(
      "Mostrar Seletor de Tom",
      "Mostrar o seletor de tom na barra superior",
      "showToneSelector",
      false,
      toggleShowToneSelector,
      ["Requer Auto-Sincronização", "Novo"],
      !autoSync
    );
    content.appendChild(showToneSelectorSwitch);

    const showMessageTimestampSwitch = createSwitch(
      "Mostrar Carimbo de Data/Hora da Mensagem",
      "Mostrar carimbos de data/hora em cada mensagem",
      "showMessageTimestamp",
      false,
      () => reloadConversationList(false),
      ["Requer Auto-Sincronização"],
      !autoSync
    );
    content.appendChild(showMessageTimestampSwitch);

    const pinNavSwitch = createSwitch(
      "Mostrar Navegação por Pins",
      "Mostrar pins de mensagem para navegação rápida (apenas quando as conversas estiverem totalmente sincronizadas)",
      "showPinNav",
      true,
      () => reloadConversationList(false),
      ["Requer Auto-Sincronização"],
      !autoSync
    );
    content.appendChild(pinNavSwitch);

    const showNewChatSettingsSwitch = createSwitch(
      "Mostrar Configurações do Novo Chat",
      "Mostrar as configurações na página de novo chat",
      "showNewChatSettings",
      false,
      toggleShowNewChatSettings,
      ["Requer Auto-Sincronização"],
      !autoSync
    );
    content.appendChild(showNewChatSettingsSwitch);

    const showPromptChainButtonSwitch = createSwitch(
      "Mostrar Botão de Cadeia de Prompt",
      "Mostrar o botão de cadeia de prompt no canto inferior direito",
      "showPromptChainButton",
      true,
      toggleShowPromptChainButton,
      ["Requer Auto-Sincronização", "Novo"],
      !autoSync
    );
    content.appendChild(showPromptChainButtonSwitch);

    const showKeyboardShortcutButtonSwitch = createSwitch(
      "Mostrar Botão de Atalho de Teclado",
      "Mostrar o botão de atalho de teclado no canto inferior direito",
      "showKeyboardShortcutButton",
      true,
      toggleShowKeyboardShortcutButtonButton
    );
    content.appendChild(showKeyboardShortcutButtonSwitch);

    const showWordCountSwitch = createSwitch(
      "Mostrar Contagem de Palavras/Caracteres",
      "Mostrar contagem de palavras/caracteres em cada mensagem",
      "showWordCount",
      false,
      () => reloadConversationList(false)
    );
    content.appendChild(showWordCountSwitch);

    const showTotalWordCountSwitch = createSwitch(
      "Mostrar Contagem Total de Palavras/Caracteres",
      "Mostrar contagem total de palavras/caracteres no canto inferior direito da conversa",
      "showTotalWordCount",
      false,
      () => reloadConversationList(false),
      ["Novo"]
    );
    content.appendChild(showTotalWordCountSwitch);

    const autoHideTopNav = createSwitch(
      "Ocultar Automaticamente a Barra Superior",
      "Ocultar automaticamente a barra superior da página quando mover o mouse para fora dela.",
      "autoHideTopNav",
      true,
      toggleTopNav,
      ["Requer Auto-Sincronização"],
      !autoSync
    );
    content.appendChild(autoHideTopNav);

    const autoResetTopNav = createSwitch(
      "Redefinição Automática da Barra Superior",
      "Redefinir automaticamente o tom, o estilo de escrita e o idioma para o padrão ao mudar para novos chats",
      "autoResetTopNav",
      false,
      null,
      ["Requer Auto-Sincronização"],
      !autoSync
    );
    content.appendChild(autoResetTopNav);
    
    const chatEndedSoundSwitch = createSwitch(
      "Alarme Sonoro",
      "Tocar um som quando o ChatGPT terminar de responder",
      "chatEndedSound",
      false,
      null,
      ["Requer Auto-Sincronização"],
      !autoSync
    );
    content.appendChild(chatEndedSoundSwitch);
    
    const animateFaviconSwitch = createSwitch(
      "Animar Favicon",
      "Animar o ícone do ChatGPT na aba do navegador enquanto o chat está respondendo",
      "animateFavicon",
      false,
      null,
      ["Requer Auto-Sincronização"],
      !autoSync
    );
    content.appendChild(animateFaviconSwitch);
    
    const copyModeSwitch = createSwitch(
      "Modo de Copiar",
      "DESLIGADO: copiar apenas a resposta / LIGADO: copiar tanto a solicitação quanto a resposta",
      "copyMode",
      false
    );
    content.appendChild(copyModeSwitch);
    
    const autoScrollSwitch = createSwitch(
      "Rolar Automaticamente",
      "Rolar automaticamente para baixo enquanto responde",
      "autoScroll",
      true
    );
    content.appendChild(autoScrollSwitch);    
  });
  return content;
}
function toggleShowLanguageSelector(isChecked) {
  const languageSelector = document.querySelector("#language-selector-wrapper");
  if (languageSelector) {
    if (isChecked) {
      languageSelector.style.display = "block";
    } else {
      languageSelector.style.display = "none";
    }
  }
}
function toggleShowWritingStyleSelector(isChecked) {
  const writingStyleSelector = document.querySelector(
    "#writing-style-selector-wrapper"
  );
  if (writingStyleSelector) {
    if (isChecked) {
      writingStyleSelector.style.display = "block";
    } else {
      writingStyleSelector.style.display = "none";
    }
  }
}
function toggleShowToneSelector(isChecked) {
  const toneSelector = document.querySelector("#tone-selector-wrapper");
  if (toneSelector) {
    if (isChecked) {
      toneSelector.style.display = "block";
    } else {
      toneSelector.style.display = "none";
    }
  }
}

function toggleAlternateMainColors(isChecked) {
  const conversationTop = document.querySelector("#conversation-top");
  if (!conversationTop) return;
  if (isChecked) {
    conversationTop?.classList?.remove("bg-token-main-surface-primary");
    conversationTop?.classList?.add("bg-token-main-surface-tertiary");
  } else {
    conversationTop?.classList?.remove("bg-token-main-surface-tertiary");
    conversationTop?.classList?.add("bg-token-main-surface-primary");
  }
  const allMessageWrapperAssistantElements = document.querySelectorAll(
    "[id^=message-wrapper-][data-role=assistant]"
  );
  allMessageWrapperAssistantElements.forEach((el) => {
    if (isChecked) {
      el?.classList?.remove("bg-token-main-surface-primary");
      el?.classList?.add("bg-token-main-surface-tertiary");
    } else {
      el?.classList?.remove("bg-token-main-surface-tertiary");
      el?.classList?.add("bg-token-main-surface-primary");
    }
  });
}
function togglePluginDefaultOpen(isChecked) {
  updateAccountUserSetting("show_expanded_code_view", isChecked);
}
function toggleShowNewChatSettings(isChecked) {
  const newPageSettings = document.querySelector("#new-page-settings");
  if (newPageSettings) {
    if (isChecked) {
      newPageSettings.classList.replace("hidden", "flex");
    } else {
      newPageSettings.classList.replace("flex", "hidden");
    }
  }
}

function toggleShowKeyboardShortcutButtonButton(isChecked) {
  if (isChecked) {
    addKeyboardShortcutsModalButton();
  } else {
    const keyboardShortcutButton = document.querySelector(
      "#keyboard-shortcuts-modal-button"
    );
    if (keyboardShortcutButton) keyboardShortcutButton.remove();
  }
}
function toggleShowPromptChainButton(isChecked) {
  if (isChecked) {
    addPromptChainCreateButton();
    initializePromptChain();
  } else {
    const promptChainCrreateButton = document.querySelector(
      "#prompt-chain-create-button"
    );
    if (promptChainCrreateButton) promptChainCrreateButton.remove();
  }
}

function textToSpeechTabContent(hasSubscription = false) {
  const content = document.createElement("div");
  content.id = "settings-modal-tab-content";
  content.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;";

  // text to speech
  const textToSpeechHeader = document.createElement("div");
  textToSpeechHeader.style =
    "display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; margin: 8px 0;";
  const textToSpeechLabel = document.createElement("div");
  textToSpeechLabel.style = "color:white;";
  textToSpeechLabel.innerHTML =
    'Texto Para Fala<span class="text-xs"> — ChatGPT fala com você. <a class="underline text-gold" href="https://www.youtube.com/@otuti">Saiba mais</a></span></span>';

  textToSpeechHeader.appendChild(textToSpeechLabel);

  content.appendChild(textToSpeechHeader);

  const textToSpeechWrapper = document.createElement("div");
  textToSpeechWrapper.style =
    "position:relative;display: flex; flex-flow: wrap; justify-content: start; align-items: center; width: 100%; margin: 12px 0 24px 0; padding: 8px; border-radius: 8px; background-color: rgb(30, 30, 47);";

  const autoSpeakSwitch = createSwitch(
    "Fala Automática",
    "Falar automaticamente a resposta assim que ela for concluída",
    "autoSpeak",
    false,
    null,
    ["Requer Auto-Sincronização", "⚡️ Requer Conta Pro"]
  );

  textToSpeechWrapper.appendChild(autoSpeakSwitch);

  const ttsVoiceSelectorWrapper = document.createElement("div");
  ttsVoiceSelectorWrapper.id = "tts-voice-selector-wrapper";
  ttsVoiceSelectorWrapper.style =
    "position:absolute;top:10px;right:10px;width:150px;margin-left:8px;";

  getUserSettings().then((openAIUserSettings) => {
    const voiceName = openAIUserSettings.settings?.voice_name || "juniper";
    const textToSpeechVoice =
      textToSpeechVoiceList.find((v) => v.code === voiceName) ||
      textToSpeechVoiceList[0];
    ttsVoiceSelectorWrapper.innerHTML = dropdown(
      "TTS-Voice",
      textToSpeechVoiceList,
      textToSpeechVoice,
      "right",
      true
    );

    addDropdownEventListener("TTS-Voice", textToSpeechVoiceList, (voice) => {
      updateAccountUserSetting("voice_name", voice.code);
    });
  });
  textToSpeechWrapper.appendChild(ttsVoiceSelectorWrapper);

  const audioTestButton = document.createElement("button");
  audioTestButton.classList =
    "btn flex justify-center gap-2 btn-primary border-0 md:border";
  audioTestButton.style = "min-width:120px;height:34px;margin-left:auto;";
  audioTestButton.textContent = "Test Audio 🎧";
  audioTestButton.addEventListener("click", () => {
    if (settingTestAudio) settingTestAudio.pause();
    if (audioTestButton.innerText === "Stop Audio 🎧") {
      audioTestButton.innerText = "Test Audio 🎧";
      return;
    }
    chrome.storage.local.get(["conversations"], (res) => {
      const { conversations } = res;
      const randomIndex = Math.floor(
        Math.random() * Object.keys(conversations).length
      );
      const testConversation =
        conversations[Object.keys(conversations)[randomIndex]];
      if (!testConversation) return;
      const testMessage = Object.values(testConversation?.mapping)?.find(
        (m) => m?.message?.author?.role === "assistant"
      );
      if (!testMessage) return;
      audioTestButton.innerText = "Carregando...";
      audioTestButton.disabled = true;
      synthesize(testConversation.conversation_id, testMessage.id).then(
        async (audio) => {
          if (!audio || !audio.src) return;
          audioTestButton.innerText = "Stop Audio 🎧";
          audioTestButton.disabled = false;
          settingTestAudio.pause();
          settingTestAudio = audio;
          audio.addEventListener("ended", () => {
            audioTestButton.innerText = "Test Audio 🎧";
          });
          const settingsModal = document.querySelector("#modal-settings");
          if (!settingsModal) {
            settingTestAudio.pause();
          }
        }
      );
    });
  });
  textToSpeechWrapper.appendChild(audioTestButton);

  content.appendChild(textToSpeechWrapper);

  // speech to text

  const speechToTextHeader = document.createElement("div");
  speechToTextHeader.style =
    "display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; margin: 8px 0; ";
  const speechToTextLabel = document.createElement("div");
  speechToTextLabel.style = "color:white;";
  speechToTextLabel.innerHTML = `Speech To Text${
    isFirefox || isOpera
      ? '<span class="text-xs"> (Firefox e Opera não suportam <a class="underline text-gold" href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility">Reconhecimento de Fala</a>)</span>'
      : '<span class="text-xs"> — Converse com o ChatGPT. </span>'
  }`;
  speechToTextHeader.appendChild(speechToTextLabel);

  const sttLanguageSelectorWrapper = document.createElement("div");
  sttLanguageSelectorWrapper.style =
    "position:relative;width:150px;margin-left:8px;";
  if (isFirefox || isOpera) {
    sttLanguageSelectorWrapper.style.opacity = 0.5;
    sttLanguageSelectorWrapper.style.pointerEvents = "none";
  }
  chrome.storage.local.get(["settings"], (res) => {
    const { speechToTextLanguage } = res.settings;
    sttLanguageSelectorWrapper.innerHTML = dropdown(
      "STT-Language",
      speechToTextLanguageList,
      speechToTextLanguage,
      "right",
      true
    );
    addDropdownEventListener(
      "STT-Language",
      speechToTextLanguageList,
      (lang) => {
        chrome.storage.local.get("settings", ({ settings }) => {
          chrome.storage.local.set({
            settings: { ...settings, speechToTextLanguage: lang },
          });
        });
      }
    );
  });
  speechToTextHeader.appendChild(sttLanguageSelectorWrapper);

  content.appendChild(speechToTextHeader);

  const speechToTextWrapper = document.createElement("div");
  speechToTextWrapper.style =
    "display: flex; flex-flow: wrap; justify-content: start; align-items: center; width: 100%; margin: 12px 0; padding: 8px; border-radius: 8px; background-color: rgb(30, 30, 47);";
  if (isFirefox || isOpera) {
    speechToTextWrapper.style.opacity = 0.5;
    speechToTextWrapper.style.pointerEvents = "none";
  }
  const speechToTextInterimResultsSwitch = createSwitch(
    "Resultados Intermediários",
    "Mostrar resultados intermediários enquanto fala",
    "speechToTextInterimResults",
    true,
    null,
    ["Requer Auto-Sincronização", "⚡️ Requer Conta Pro"],
    !hasSubscription
  );
  speechToTextWrapper.appendChild(speechToTextInterimResultsSwitch);
  
  const autoSubmitWhenReleaseAltSwitch = createSwitch(
    "Enviar Automaticamente ao Soltar o Alt",
    "Enviar automaticamente a mensagem quando você soltar a tecla Alt",
    "autoSubmitWhenReleaseAlt",
    false,
    null,
    ["Requer Auto-Sincronização", "⚡️ Requer Conta Pro"],
    !hasSubscription
  );  
  speechToTextWrapper.appendChild(autoSubmitWhenReleaseAltSwitch);

  content.appendChild(speechToTextWrapper);

  return content;
}

function promptInputTabContent(hasSubscription = false) {
  const content = document.createElement("div");
  content.id = "settings-modal-tab-content";
  content.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;";
    chrome.storage.local.get(["settings"], (result) => {
      const { autoSync } = result.settings;
      // histórico de entrada
      const promptHistorySwitch = createSwitch(
        "Atalho de Histórico de Entrada",
        "Ativar/desativar as setas para cima e para baixo para percorrer o histórico de entrada.",
        "promptHistory",
        true
      );
      content.appendChild(promptHistorySwitch);
    
      const showGpt4Counter = createSwitch(
        "Mostrar Contador GPT-4",
        "Mostrar o número de mensagens GPT-4 nas últimas 3 horas",
        "showGpt4Counter",
        true,
        toggleGpt4Counter,
        ["Requer Auto-Sincronização"],
        !autoSync
      );
      content.appendChild(showGpt4Counter);
    
      const showExamplePromptsSwitch = createSwitch(
        "Mostrar Prompts de Exemplo",
        "Mostrar os prompts de exemplo ao iniciar um novo chat ou usar GPTs personalizados",
        "showExamplePrompts",
        false,
        null,
        ["Requer Auto-Sincronização"],
        !autoSync
      );
      content.appendChild(showExamplePromptsSwitch);
    
      // template de prompt
      const promptTemplateSwitch = createSwitch(
        "Template de Prompt",
        'Ativar/desativar a substituição das {{chaves}} duplas (<a style="text-decoration:underline; color:gold;" href="https://www.youtube.com/watch?v=JMBjq0XtutA&ab_channel=Superpower" target="blank">Saiba Mais</a>)',
        "promptTemplate",
        true,
        null,
        ["Requer Auto-Sincronização"],
        !autoSync
      );
      content.appendChild(promptTemplateSwitch);
    });
    return content;    
}
function modelsTabContent(hasSubscription = false) {
  const content = document.createElement("div");
  content.id = "settings-modal-tab-content";
  content.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;";

  const modelSwitcherRow = document.createElement("div");
  modelSwitcherRow.style =
    "display: flex; flex-direction: row; justify-content: start; align-items: center; width:100%;";

  const modelSwitcherWrapper = document.createElement("div");
  modelSwitcherWrapper.style =
    "position:relative;min-width:200px;z-index:1000; pointer-events: none;";
  const idPrefix = "settings";
  modelSwitcherWrapper.id = `model-switcher-wrapper-${idPrefix}`;
  modelSwitcherRow.appendChild(modelSwitcherWrapper);
  content.appendChild(modelSwitcherRow);
  const betaTag = document.createElement("span");
  betaTag.style =
    "background-color: #ff9800; color: black; padding: 2px 4px; border-radius: 8px; font-size: 0.7em;margin-top:8px;";
  betaTag.textContent = "Requer Auto-Sync";
  content.appendChild(betaTag);
  chrome.storage.local.get(
    ["settings", "models", "unofficialModels", "customModels", "selectedModel"],
    (result) => {
      const {
        models,
        unofficialModels,
        customModels,
        settings,
        selectedModel,
      } = result;
      const allModels = [
        ...(models || []),
        ...(unofficialModels || []),
        ...(customModels || []),
      ];
      const { autoSync } = result.settings;
      modelSwitcherWrapper.innerHTML = modelSwitcher(
        allModels,
        selectedModel,
        idPrefix,
        customModels,
        settings.autoSync,
        true
      );
      addModelSwitcherEventListener(idPrefix, true);
      if (autoSync) {
        modelSwitcherWrapper.style.pointerEvents = "all";
      } else {
        modelSwitcherWrapper.style.pointerEvents = "none";
      }
      const unofficialNote = document.createElement("div");
      unofficialNote.style = "color: #eee; font-size: 0.8em; margin-left:8px";
      unofficialNote.innerHTML =
      'Modelos personalizados são experimentais. Eles podem ou não funcionar. Esta funcionalidade foi implementada para facilitar o teste de outros modelos. <a href="https://www.youtube.com/@otuti" target="_blank" class="underline text-gold" rel="noreferrer">Saiba mais</a>';
      modelSwitcherRow.appendChild(unofficialNote);
    }
  );
  const newCustomModelWrapper = document.createElement("div");
  newCustomModelWrapper.id = "new-custom-model-wrapper";
  newCustomModelWrapper.style =
    "display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin-top: 24px; flex-wrap:wrap;padding: 8px; border-radius: 8px;background-color: #1e1e2f;";
  const newCustomModelInputWrapper = document.createElement("div");
  newCustomModelInputWrapper.style =
    "display: flex; flex-direction: row; justify-content: start; align-items: start; width: 100%; margin: 8px 0;";
  const newCustomModelWrapperTitle = document.createElement("div");
  newCustomModelWrapperTitle.style = "width: 100%; margin: 8px 0;color: #eee;";
  newCustomModelWrapperTitle.innerHTML =
    'Adicionar Modelos Customizados<span style="background-color: rgb(255, 152, 0); color: black; padding: 2px 4px; border-radius: 8px; font-size: 0.7em; margin-left: 8px;position:relative; bottom:2px;">Experimental</span>';

  const newCustomModelSlug = document.createElement("input");
  newCustomModelSlug.style =
    "width: 160px; height: 34px; border-radius: 4px; border: 1px solid #565869; background-color: #0b0d0e;margin-right:8px; color: #eee; padding: 0 8px; font-size: 14px;";
  newCustomModelSlug.placeholder = "Slug do Modelo";
  newCustomModelSlug.autocomplete = "off";
  // only accept alphanumerics and dashes and parentheses and underscores
  newCustomModelSlug.pattern = "[a-zA-Z0-9-_()]+";
  newCustomModelSlug.autofocus = true;
  newCustomModelSlug.dir = "auto";
  newCustomModelSlug.addEventListener("input", () => {
    newCustomModelSlug.style.borderColor = "#565869";
    repeatedSlugError.style.visibility = "hidden";
  });

  const newCustomModelText = document.createElement("textarea");
  newCustomModelText.style =
    "width: 100%; height: 34px; min-height: 34px; border-radius: 4px; border: 1px solid #565869; background-color: #0b0d0e; color: #eee; padding: 4px 8px; font-size: 14px;";
  newCustomModelText.placeholder = "Descrição do Modelo";
  newCustomModelText.dir = "auto";
  newCustomModelText.addEventListener("input", () => {
    newCustomModelText.style.borderColor = "#565869";
  });

  const repeatedSlugError = document.createElement("div");
  repeatedSlugError.id = "repeated-name-error";
  repeatedSlugError.style =
    "color: #f56565; font-size: 10px;visibility: hidden;";
  repeatedSlugError.textContent = "Já existe outro modelo com este identificador.";
  const newCustomModelButtonWrapper = document.createElement("div");
  newCustomModelButtonWrapper.style =
    "display: flex; flex-direction: row; justify-content: end; align-items: center; width: 100%; margin-bottom: 16px;";
  const newCustomModelSlugDescription = document.createElement("div");
  newCustomModelSlugDescription.style =
    "width: 100%; margin: 8px 8px 8px 0; font-size: 12px; color: #eee;";
  newCustomModelSlugDescription.textContent =
    "O identificador é usado para identificar o modelo pela OpenAI. A descrição pode ser qualquer coisa, mas o identificador deve ser o nome oficial do modelo na OpenAI";


  const newCustomModelCancelButton = document.createElement("button");
  newCustomModelCancelButton.textContent = "Cancelar";
  newCustomModelCancelButton.classList =
    "btn flex justify-center gap-2 btn-dark border-0 md:border mr-2";
  newCustomModelCancelButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const curnewCustomModelWrapper = document.getElementById(
      "new-custom-model-wrapper"
    );
    curnewCustomModelWrapper.remove();
  });
  const newCustomModelSaveButton = document.createElement("button");
  newCustomModelSaveButton.textContent = "Salvar";
  newCustomModelSaveButton.classList =
    "btn flex justify-center gap-2 btn-primary border-0 md:border";
  newCustomModelSaveButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!newCustomModelText.value.trim()) {
      newCustomModelText.style.borderColor = "#ff4a4a";
    }
    if (!newCustomModelSlug.value.trim()) {
      newCustomModelSlug.style.borderColor = "#ff4a4a";
    }
    if (!newCustomModelSlug.value.trim() || !newCustomModelText.value.trim())
      return;
    chrome.storage.local.get(
      [
        "models",
        "unofficialModels",
        "customModels",
        "settings",
        "selectedModel",
      ],
      (res) => {
        const allModels = [
          ...res.models,
          ...res.unofficialModels,
          ...res.customModels,
        ];
        const newCustomModels =
          res.customModels && res.customModels.length > 0
            ? res.customModels
            : [];
        if (
          allModels
            .map((k) => k?.slug?.toLowerCase())
            .includes(newCustomModelSlug.value.trim().toLowerCase())
        ) {
          newCustomModelSlug.style.borderColor = "#ff4a4a";
          repeatedSlugError.style.visibility = "visible";
          return;
        }
        newCustomModels.push({
          title: `${newCustomModelSlug.value.trim()}`,
          description: newCustomModelText.value.trim(),
          slug: newCustomModelSlug.value.trim(),
          tags: ["Custom"],
        });
        chrome.storage.local.set({ customModels: newCustomModels }, () => {
          const modelSwitcherWrappers = document.querySelectorAll(
            "[id^=model-switcher-wrapper-]"
          );
          modelSwitcherWrappers.forEach((wrapper) => {
            const curIdPrefix = wrapper.id.split("model-switcher-wrapper-")[1];
            const newAllModels = [
              ...res.models,
              ...res.unofficialModels,
              ...newCustomModels,
            ];
            wrapper.innerHTML = modelSwitcher(
              newAllModels,
              res.selectedModel,
              curIdPrefix,
              newCustomModels,
              res.settings.autoSync,
              true
            );
            addModelSwitcherEventListener(curIdPrefix, true);
          });
          // clear the input fields
          newCustomModelText.value = "";
          newCustomModelSlug.value = "";
        });
      }
    );
  });
  newCustomModelWrapper.appendChild(newCustomModelWrapperTitle);
  newCustomModelInputWrapper.appendChild(newCustomModelSlug);
  newCustomModelInputWrapper.appendChild(newCustomModelText);
  newCustomModelButtonWrapper.appendChild(newCustomModelSlugDescription);
  newCustomModelButtonWrapper.appendChild(newCustomModelCancelButton);
  newCustomModelButtonWrapper.appendChild(newCustomModelSaveButton);
  newCustomModelWrapper.appendChild(newCustomModelInputWrapper);
  newCustomModelWrapper.appendChild(repeatedSlugError);
  newCustomModelWrapper.appendChild(newCustomModelButtonWrapper);
  content.appendChild(newCustomModelWrapper);
  return content;
}
function toggleCustomPromptsButtonVisibility(isChecked) {
  if (isChecked) {
    createContinueButton();
  } else {
    const customPromptsButton = document.querySelector(
      "#continue-conversation-button-wrapper"
    );
    customPromptsButton?.remove();
  }
}
function customPromptTabContent(hasSubscription = false) {
  const content = document.createElement("div");
  content.id = "settings-modal-tab-content";
  content.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;";

  chrome.storage.local.get(["customPrompts", "settings"], (result) => {
    // custom prompts section
    const customPromptSectionWrapper = document.createElement("div");
    customPromptSectionWrapper.style =
      "display: flex; justify-content:space-between; align-items:center; width: 100%; color: lightslategray; font-size: 16px;";
    const customPromptSection = document.createElement("div");
    customPromptSection.style =
      "color: lightslategray; font-size: 16px; margin: 12px 0;";
    // customPromptSection.textContent = 'Custom Prompts';

    const showCustomPromptsButtonSwitch = createSwitch(
      "Mostrar Botão de Prompts Personalizados",
      'Mostrar/esconder o botão para usar prompts personalizados. <a href="https://www.youtube.com/@otuti" target="_blank" class="underline text-gold" rel="noreferrer">Saiba mais</a>',
      "showCustomPromptsButton",
      true,
      toggleCustomPromptsButtonVisibility
    );
    
    customPromptSection.appendChild(showCustomPromptsButtonSwitch);

    const newCustomPromptButton = document.createElement("button");
    newCustomPromptButton.textContent = "Adicionar Novo Prompts Customizado";
    newCustomPromptButton.classList =
      "btn flex justify-center gap-2 btn-dark border-0 md:border";
    newCustomPromptButton.addEventListener("click", () => {
      const existingNewCustomPromptWrapper = document.querySelector(
        "#new-custom-prompt-wrapper"
      );
      if (existingNewCustomPromptWrapper) return;
      const newCustomPromptWrapper = document.createElement("div");
      newCustomPromptWrapper.id = "new-custom-prompt-wrapper";
      newCustomPromptWrapper.style =
        "display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0; flex-wrap:wrap;padding: 8px; border-radius: 8px;background-color: #1e1e2f;";
      const newCustomPromptInputWrapper = document.createElement("div");
      newCustomPromptInputWrapper.style =
        "display: flex; flex-direction: row; justify-content: start; align-items: start; width: 100%; margin: 8px 0;";
      const newCustomPromptTitle = document.createElement("input");
      newCustomPromptTitle.style =
        "width: 120px; height: 34px; border-radius: 4px; border: 1px solid #565869; background-color: #0b0d0e;margin-right:8px; color: #eee; padding: 0 8px; font-size: 14px;";
      newCustomPromptTitle.placeholder = "Título do Prompt";
      newCustomPromptTitle.autofocus = true;
      newCustomPromptTitle.dir = "auto";
      newCustomPromptTitle.addEventListener("input", () => {
        newCustomPromptTitle.style.borderColor = "#565869";
        repeatedNameError.style.visibility = "hidden";
      });
      const newCustomPromptText = document.createElement("textarea");
      newCustomPromptText.style =
        "width: 100%; height: 34px; min-height: 34px; border-radius: 4px; border: 1px solid #565869; background-color: #0b0d0e; color: #eee; padding: 4px 8px; font-size: 14px;";
      newCustomPromptText.placeholder = "Texto do Prompt";
      newCustomPromptText.dir = "auto";
      newCustomPromptText.addEventListener("input", () => {
        newCustomPromptText.style.borderColor = "#565869";
      });

      const helperText = document.createElement("div");
      helperText.style = "color: #999; font-size: 12px; margin: 8px 0;";
      helperText.textContent =
      "Dica: Você pode usar $promptTitle em qualquer lugar na sua entrada de prompt para substituí-lo automaticamente pelo texto do prompt. Para que esta funcionalidade funcione, certifique-se de não ter espaços no título do prompt. A substituição inteligente não é sensível a maiúsculas e minúsculas.";

      const repeatedNameError = document.createElement("div");
      repeatedNameError.id = "repeated-name-error";
      repeatedNameError.style =
        "color: #f56565; font-size: 12px;visibility: hidden;";
      repeatedNameError.textContent =
      "Já existe outro prompt personalizado com este nome. Por favor, use um nome diferente.";
      const newCustomPromptButtonWrapper = document.createElement("div");
      newCustomPromptButtonWrapper.style =
        "display: flex; flex-direction: row; justify-content: end; align-items: center; width: 100%; margin-bottom: 16px;";
      const newCustomPromptCancelButton = document.createElement("button");
      newCustomPromptCancelButton.textContent = "Cancel";
      newCustomPromptCancelButton.classList =
        "btn flex justify-center gap-2 btn-dark border-0 md:border mr-2";
      newCustomPromptCancelButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const curNewCustomPromptWrapper = document.getElementById(
          "new-custom-prompt-wrapper"
        );
        curNewCustomPromptWrapper.remove();
      });
      const newCustomPromptSaveButton = document.createElement("button");
      newCustomPromptSaveButton.textContent = "Save";
      newCustomPromptSaveButton.classList =
        "btn flex justify-center gap-2 btn-primary border-0 md:border";
      newCustomPromptSaveButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!newCustomPromptTitle.value.trim()) {
          newCustomPromptTitle.style.borderColor = "#ff4a4a";
        }
        if (!newCustomPromptText.value.trim()) {
          newCustomPromptText.style.borderColor = "#ff4a4a";
        }
        if (
          !newCustomPromptTitle.value.trim() ||
          !newCustomPromptText.value.trim()
        )
          return;
        chrome.storage.local.get(["customPrompts"], (res) => {
          const newCustomPrompts =
            res.customPrompts && res.customPrompts.length > 0
              ? res.customPrompts
              : defaultPrompts;
          if (
            newCustomPrompts
              .map((k) => k.title.toLowerCase())
              .includes(newCustomPromptTitle.value.trim().toLowerCase())
          ) {
            newCustomPromptTitle.style.borderColor = "#ff4a4a";
            repeatedNameError.style.visibility = "visible";
            return;
          }
          newCustomPrompts.unshift({
            title: newCustomPromptTitle.value.trim(),
            text: newCustomPromptText.value.trim(),
            isDefault: false,
          });
          chrome.storage.local.set({ customPrompts: newCustomPrompts }, () => {
            // add new custom prompt right after curNewCustomPromptWrapper
            const curNewCustomPromptWrapper = document.getElementById(
              "new-custom-prompt-wrapper"
            );
            const newCustomPromptRow = createPromptRow(
              newCustomPromptTitle.value.trim(),
              newCustomPromptText.value.trim(),
              false,
              "customPrompts"
            );
            const customPromptsList =
              document.getElementById("custom-prompt-list");
            // add to the beginning of the list
            customPromptsList.insertBefore(
              newCustomPromptRow,
              customPromptsList.firstChild
            );
            curNewCustomPromptWrapper.remove();
          });
        });
      });
      newCustomPromptInputWrapper.appendChild(newCustomPromptTitle);
      newCustomPromptInputWrapper.appendChild(newCustomPromptText);
      newCustomPromptButtonWrapper.appendChild(newCustomPromptCancelButton);
      newCustomPromptButtonWrapper.appendChild(newCustomPromptSaveButton);
      newCustomPromptWrapper.appendChild(newCustomPromptInputWrapper);
      newCustomPromptWrapper.appendChild(helperText);
      newCustomPromptWrapper.appendChild(repeatedNameError);
      newCustomPromptWrapper.appendChild(newCustomPromptButtonWrapper);
      // insert after customPromptSectionWrapper
      customPromptSectionWrapper.parentNode.insertBefore(
        newCustomPromptWrapper,
        customPromptSectionWrapper.nextSibling
      );
      newCustomPromptTitle.focus();
    });
    customPromptSectionWrapper.appendChild(customPromptSection);
    customPromptSectionWrapper.appendChild(newCustomPromptButton);
    content.appendChild(customPromptSectionWrapper);
    const customPromptsList = document.createElement("div");
    customPromptsList.id = "custom-prompt-list";
    customPromptsList.classList = "flex flex-col w-full";
    const { customPrompts, settings } = result;
    const { autoSync, customInstruction } = settings;
    if (customPrompts) {
      for (let i = 0; i < customPrompts?.length; i += 1) {
        const promptTitle = customPrompts[i].title;
        const promptText = customPrompts[i].text;
        const { isDefault } = customPrompts[i];
        const promptRow = createPromptRow(
          promptTitle,
          promptText,
          isDefault,
          "customPrompts"
        );
        customPromptsList.appendChild(promptRow);
      }
    }
    Sortable.create(customPromptsList, {
      group: {
        name: "custom-prompts-list",
        pull: true,
        // eslint-disable-next-line func-names, object-shorthand, no-unused-vars
        put: true,
      },
      direction: "vertical",
      invertSwap: true,
      handle: "#custom-prompt-drag-handle",
      onEnd: (event) => {
        const { oldIndex, newIndex } = event;
        chrome.storage.local.get(["customPrompts"], (res) => {
          const newPrompts = res.customPrompts;
          const [removed] = newPrompts.splice(oldIndex, 1);
          newPrompts.splice(newIndex, 0, removed);
          chrome.storage.local.set({ customPrompts: newPrompts });
        });
      },
    });
    content.appendChild(customPromptsList);
    // custom inststruction section
    const customInstructionSection = document.createElement("div");
    customInstructionSection.style =
      "display: flex; flex-direction: column; justify-content: start; align-items: start; width: 100%; margin: 16px 0;";

      const customInstructionSwitch = createSwitch(
        "Instrução Personalizada",
        'Uma instrução personalizada será adicionada ao final de cada prompt. Você pode usá-la para adicionar instruções que gostaria de incluir em todos os prompts. Por exemplo, você pode adicionar "Por favor, repita o prompt depois de mim.", ou "Por favor, abstenha-se de escrever avisos sobre seu limite de conhecimento" à instrução personalizada, e ela será adicionada ao final de cada prompt. (Certifique-se de adicionar um espaço ou nova linha no início!)',
        "useCustomInstruction",
        false,
        toggleCustomInstructionInput,
        ["Requer Auto-Sincronização"],
        !autoSync
      );
      

    const customInstructionInputWrapper = document.createElement("div");
    customInstructionInputWrapper.style =
      "display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin-bottom: 8px;";
    const customInstructionInput = document.createElement("textarea");
    customInstructionInput.id = "custom-instruction-input";
    customInstructionInput.style =
      "width: 100%; height: 100px; border-radius: 4px; border: 1px solid #565869; background-color: #2d2d3a; color: #eee; padding: 8px;";
    customInstructionInput.placeholder =
    "Digite sua instrução personalizada aqui...";
    customInstructionInput.value = customInstruction;
    customInstructionInput.addEventListener("input", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const newCustomInstruction = e.target.value;
      chrome.storage.local.get(["settings"], (res) => {
        chrome.storage.local.set({
          settings: {
            ...res.settings,
            customInstruction: newCustomInstruction,
          },
        });
      });
    });
    customInstructionInputWrapper.appendChild(customInstructionInput);

    customInstructionSection.appendChild(customInstructionSwitch);
    customInstructionSection.appendChild(customInstructionInputWrapper);
    content.appendChild(customInstructionSection);

    const extraSpaceDiv = document.createElement("div");
    extraSpaceDiv.style = "min-height: 200px;";
    content.appendChild(extraSpaceDiv);
  });
  return content;
}
function toggleCustomInstructionInput(isChecked) {
  const customInstructionInput = document.getElementById(
    "custom-instruction-input"
  );
  if (isChecked) {
    customInstructionInput.style.opacity = "1";
    customInstructionInput.disabled = false;
  } else {
    customInstructionInput.style.opacity = "0.5";
    customInstructionInput.disabled = true;
  }
}
function createPromptRow(promptTitle, promptText, isDefault, promptObjectName) {
  const promptRow = document.createElement("div");
  promptRow.id = "custom-prompt-row";
  promptRow.style =
    "display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0;";
  const dragPromptButton = document.createElement("div");
  dragPromptButton.style =
    "width: 48px; display:flex;align-items:center;justify-content:start; color: #eee;cursor:grab;";
  dragPromptButton.title = "Arraste para reordenar";
  dragPromptButton.id = "custom-prompt-drag-handle";
  dragPromptButton.innerHTML =
    '<svg stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="2em" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 288zm0-128c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z"/></svg>';
  promptRow.appendChild(dragPromptButton);
  const promptLabelInput = document.createElement("input");
  promptLabelInput.style =
    "min-width: 100px; max-width:100px; margin-right: 8px; text-transform: capitalize;";
  promptLabelInput.style =
    "min-width: 100px; max-width:100px; height: 34px; min-height: 34px; border-radius: 4px; border: 1px solid #565869; background-color: #1e1e2f; color: #eee; padding: 4px 8px; font-size: 14px;margin-right: 8px;";

  promptLabelInput.value = promptTitle;
  promptLabelInput.dir = "auto";
  promptLabelInput.addEventListener("change", (e) => {
    chrome.storage.local.get([promptObjectName], (res) => {
      const newPrompts = res[promptObjectName];
      newPrompts.find((p) => p.title === promptTitle).title =
        e.target.value.trim();
      chrome.storage.local.set({ [promptObjectName]: newPrompts });
    });
  });
  const promptInput = document.createElement("textarea");
  promptInput.style =
    "width: 100%; height: 34px; min-height: 34px; border-radius: 4px; border: 1px solid #565869; background-color: #1e1e2f; color: #eee; padding: 4px 8px; font-size: 14px;margin-right: 8px;";
  promptInput.id = `${promptObjectName}-${promptTitle}`;
  promptInput.dir = "auto";
  promptInput.value = promptText;
  promptInput.addEventListener("change", () => {
    chrome.storage.local.get([promptObjectName], (res) => {
      const newPrompts = res[promptObjectName];
      newPrompts.find((p) => p.title === promptTitle).text =
        promptInput.value.trim();
      chrome.storage.local.set({ [promptObjectName]: newPrompts });
    });
  });
  promptRow.appendChild(promptLabelInput);
  promptRow.appendChild(promptInput);
  if (promptObjectName === "customPrompts") {
    const deleteButton = document.createElement("button");
    deleteButton.classList =
      "btn flex justify-center gap-2 btn-dark border-0 md:border mr-2";
    deleteButton.style = "min-width:72px;height:34px;";
    deleteButton.textContent = "Excluir";
    deleteButton.disabled = isDefault;
    deleteButton.addEventListener("click", (e) => {
      if (e.target.textContent === "Confirmar") {
        chrome.storage.local.get([promptObjectName], (res) => {
          let newPrompts = res[promptObjectName];
          if (newPrompts.length <= 1) {
            toast("Você deve ter pelo menos um prompt personalizado", "error");
          } else if (
            newPrompts.find((p) => p.title === promptTitle).isDefault
          ) {
            toast("Você não pode deletar um prompt padrão", "error");
          } else {
            newPrompts = newPrompts.filter((p) => p.title !== promptTitle);
            chrome.storage.local.set({ [promptObjectName]: newPrompts }, () => {
              promptRow.remove();
            });
          }
        });
      } else {
        e.target.textContent = "Confirmar";
        e.target.style.backgroundColor = "#864e6140";
        e.target.style.color = "#ff4a4a";
        e.target.style.borderColor = "#ff4a4a";
        setTimeout(() => {
          e.target.textContent = "Excluir";
          e.target.style = "min-width:72px;height:34px;";
        }, 1500);
      }
    });
    promptRow.appendChild(deleteButton);

    const defaultButton = document.createElement("button");
    defaultButton.classList = `btn flex justify-center gap-2 ${
      isDefault ? "btn-primary" : "btn-dark"
    } border-0 md:border`;
    defaultButton.setAttribute("data-default", isDefault ? "true" : "false");
    defaultButton.style = "min-width:72px;height:34px;";
    defaultButton.textContent = "Default";
    defaultButton.addEventListener("click", () => {
      chrome.storage.local.get([promptObjectName], (res) => {
        const newPrompts = res[promptObjectName];
        newPrompts.find((p) => p.isDefault).isDefault = false;
        newPrompts.find((p) => p.title === promptTitle).isDefault = true;
        chrome.storage.local.set({ [promptObjectName]: newPrompts }, () => {
          const curDefaultButton = document.querySelector(
            '[data-default="true"]'
          );
          const curDeleteButton = [
            ...curDefaultButton.parentNode.querySelectorAll("button"),
          ].find((b) => b.textContent === "Excluir");
          curDeleteButton.disabled = false;
          curDefaultButton.setAttribute("data-default", "false");
          curDefaultButton.classList =
            "btn flex justify-center gap-2 btn-dark border-0 md:border";
          defaultButton.classList =
            "btn flex justify-center gap-2 btn-primary border-0 md:border";
          defaultButton.textContent = "Default";
          defaultButton.setAttribute("data-default", "true");
          defaultButton.style = "min-width:72px;height:34px;";
          const newDeleteButton = [
            ...promptRow.querySelectorAll("button"),
          ].find((b) => b.textContent === "Excluir");
          newDeleteButton.disabled = true;
        });
      });
    });
    promptRow.appendChild(defaultButton);
  }
  return promptRow;
}

function exportTabContent(hasSubscription = false) {
  const content = document.createElement("div");
  content.id = "settings-modal-tab-content";
  content.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;";

  // Export Mode
  const exportModeSwitchWrapper = document.createElement("div");
  exportModeSwitchWrapper.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start; width: 100%; margin: 8px 0;";
  const exportModeSwitch = document.createElement("div");
  exportModeSwitch.style =
    "display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0; color:white;";
  exportModeSwitch.textContent = "Mode de Exportar";
  const exportModeHelper = document.createElement("div");
  exportModeHelper.style = "font-size: 12px; color: #999;";
  const exportModeLabel = document.createElement("label");
  exportModeLabel.classList = "sp-switch";
  const exportModeInput = document.createElement("input");
  exportModeInput.type = "checkbox";
  chrome.storage.local.get("settings", ({ settings }) => {
    exportModeInput.checked = settings.exportMode === "both";
    exportModeHelper.textContent =
      settings.exportMode === "both"
        ? "Export both Assistant and User's chats"
        : "Export only Assistant's chats";
  });
  exportModeInput.addEventListener("change", () => {
    chrome.storage.local.get("settings", ({ settings }) => {
      settings.exportMode = exportModeInput.checked ? "both" : "assistant";
      exportModeHelper.textContent =
        settings.exportMode === "both"
          ? "Exportar os chats do Assistente e do Usuário"
          : "Exportar apenas os chats do Assistente";
      chrome.storage.local.set({ settings });
    });
  });
  const exportModeSlider = document.createElement("span");
  exportModeSlider.classList = "sp-switch-slider round";

  exportModeLabel.appendChild(exportModeInput);
  exportModeLabel.appendChild(exportModeSlider);
  exportModeSwitch.appendChild(exportModeLabel);
  exportModeSwitchWrapper.appendChild(exportModeSwitch);
  exportModeSwitchWrapper.appendChild(exportModeHelper);

  // export format
  const exportNamingFormatLabel = document.createElement("div");
  exportNamingFormatLabel.style =
    "display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0; color:white; opacity: 0.5;";
  exportNamingFormatLabel.textContent = "Fomatação do nome para exportação";
  const betaTag = document.createElement("span");
  betaTag.style =
    "background-color: #ff9800; color: black; padding: 2px 4px; border-radius: 8px; margin-left: 8px; font-size: 0.7em;";
  betaTag.textContent = "Em breve";
  exportNamingFormatLabel.appendChild(betaTag);
  content.appendChild(exportModeSwitchWrapper);
  content.appendChild(exportNamingFormatLabel);
  return content;
}
function splitterTabContent(hasSubscription = false) {
  const content = document.createElement("div");
  content.id = "settings-modal-tab-content";
  content.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;";

  // conversation width
  chrome.storage.local.get(["settings"], (result) => {
    const { autoSync } = result.settings;
    const splitterSwitchWrapper = document.createElement("div");
    splitterSwitchWrapper.style =
      "display: flex; gap:16px; justify-content: start; align-items: start; width: 100%; margin: 8px 0;";
      const autoSplitSwitch = createSwitch(
        "Divisão Automática",
        'Dividir automaticamente prompts longos em pedaços menores (<a style="text-decoration:underline; color:gold;" href="https://www.youtube.com/watch?v=IhRbmIhAm3I&ab_channel=Superpower" target="blank">Saiba Mais</a>)',
        "autoSplit",
        true,
        toggleAutoSummarizerSwitch,
        ["Requer Auto-Sincronização"],
        !autoSync
      );
      const autoSummarizeSwitch = createSwitch(
        "Resumo Automático",
        'Resumir automaticamente cada pedaço após a divisão automática (<a style="text-decoration:underline; color:gold;" href="https://www.youtube.com/@otuti" target="blank">Saiba Mais</a>)',
        "autoSummarize",
        false,
        updateAutoSplitPrompt,
        ["Requer Auto-Sincronização"],
        !autoSync
      );

    const autoSplitChunkSizeLabel = document.createElement("div");
    autoSplitChunkSizeLabel.style =
      "display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0; color:white;";
    autoSplitChunkSizeLabel.textContent =
      "Tamanho do pedaços para Auto Split (GPT-3.5: <28,000 - GPT-4: <120,000)";

    const autoSplitChunkSizeInput = document.createElement("input");
    autoSplitChunkSizeInput.id = "split-prompt-limit-input";
    autoSplitChunkSizeInput.type = "number";
    autoSplitChunkSizeInput.classList =
      "w-full px-4 py-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-token-main-surface-secondary disabled:opacity-40";
    autoSplitChunkSizeInput.value = result.settings.autoSplitLimit;
    autoSplitChunkSizeInput.addEventListener("change", () => {
      const curAutoSplitChunkSizeInput = document.querySelector(
        "#split-prompt-limit-input"
      );
      const newValue = Math.round(curAutoSplitChunkSizeInput.value);

      curAutoSplitChunkSizeInput.value = newValue;
      chrome.storage.local.get("settings", ({ settings }) => {
        chrome.storage.local.set({
          settings: { ...settings, autoSplitLimit: newValue },
        });
      });
    });
    autoSplitChunkSizeInput.addEventListener("input", () => {
      const curAutoSplitChunkSizeInput = document.querySelector(
        "#split-prompt-limit-input"
      );
      const newValue = Math.round(curAutoSplitChunkSizeInput.value);

      curAutoSplitChunkSizeInput.value = newValue;
      chrome.storage.local.get("settings", ({ settings }) => {
        chrome.storage.local.set({
          settings: { ...settings, autoSplitLimit: newValue },
        });
      });
    });

    // splitter initial prompt
    const autoSplitInitialPromptLabel = document.createElement("div");
    autoSplitInitialPromptLabel.style =
      "display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin-top: 16px; color:white;";
    autoSplitInitialPromptLabel.textContent = "Auto Split Prompt";

    const autoSplitInitialPromptHelper = document.createElement("div");
    autoSplitInitialPromptHelper.style =
      "font-size: 12px; color: #999;margin-bottom: 8px;";
    autoSplitInitialPromptHelper.textContent =
    "Prompt de Divisão Automática (Auto Split) é uma instrução que será usada para dividir entradas longas do usuário em vários pedaços."


    const autoSplitInitialPromptText = document.createElement("textarea");
    autoSplitInitialPromptText.id = "split-initial-prompt-textarea";
    autoSplitInitialPromptText.style =
      "width: 100%; height: 200px; min-height: 200px; border-radius: 4px; border: 1px solid #565869; background-color: #0b0d0e; color: #eee; padding: 4px 8px; font-size: 14px;";
    autoSplitInitialPromptText.placeholder = "Copie o Prompt de Auto Split aqui...";
    chrome.storage.local.get("settings", ({ settings }) => {
      autoSplitInitialPromptText.value = settings.autoSplitInitialPrompt;
    });
    autoSplitInitialPromptText.dir = "auto";
    autoSplitInitialPromptText.addEventListener("input", () => {
      autoSplitInitialPromptText.style.borderColor = "#565869";
      chrome.storage.local.get("settings", ({ settings }) => {
        chrome.storage.local.set({
          settings: {
            ...settings,
            autoSplitInitialPrompt: autoSplitInitialPromptText.value,
          },
        });
      });
    });

    // splitter chunk prompt
    const autoSplitChunkPromptLabel = document.createElement("div");
    autoSplitChunkPromptLabel.style =
      "display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin-top: 16px; color:white;";
    autoSplitChunkPromptLabel.textContent = "Auto Split Prompt";

    const autoSplitChunkPromptHelper = document.createElement("div");
    autoSplitChunkPromptHelper.style =
      "font-size: 12px; color: #999;margin-bottom: 8px;";
    autoSplitChunkPromptHelper.textContent =
    "Prompt de Auto Split Chunk é a instrução usada para processar cada pedaço. Por exemplo, pode ser usada para resumir o pedaço."

    const autoSplitChunkPromptText = document.createElement("textarea");
    autoSplitChunkPromptText.id = "split-chunk-prompt-textarea";
    autoSplitChunkPromptText.style =
      "width: 100%; height: 100px; min-height: 100px; border-radius: 4px; border: 1px solid #565869; background-color: #0b0d0e; color: #eee; padding: 4px 8px; font-size: 14px;";
    autoSplitChunkPromptText.placeholder = "Copie o Prompt de Auto Split aqui...";
    chrome.storage.local.get("settings", ({ settings }) => {
      autoSplitChunkPromptText.value = settings.autoSplitChunkPrompt;
    });
    autoSplitChunkPromptText.dir = "auto";
    autoSplitChunkPromptText.addEventListener("input", () => {
      autoSplitChunkPromptText.style.borderColor = "#565869";
      chrome.storage.local.get("settings", ({ settings }) => {
        chrome.storage.local.set({
          settings: {
            ...settings,
            autoSplitChunkPrompt: autoSplitChunkPromptText.value,
          },
        });
      });
    });

    splitterSwitchWrapper.appendChild(autoSplitSwitch);
    splitterSwitchWrapper.appendChild(autoSummarizeSwitch);
    content.appendChild(splitterSwitchWrapper);
    content.appendChild(autoSplitChunkSizeLabel);
    content.appendChild(autoSplitChunkSizeInput);
    content.appendChild(autoSplitInitialPromptLabel);
    content.appendChild(autoSplitInitialPromptHelper);
    content.appendChild(autoSplitInitialPromptText);
    content.appendChild(autoSplitChunkPromptLabel);
    content.appendChild(autoSplitChunkPromptHelper);
    content.appendChild(autoSplitChunkPromptText);
  });
  return content;
}
function toggleAutoSummarizerSwitch(isChecked) {
  // if autoSplit is off, check autoSummarize and turn it off if it's on
  if (!isChecked) {
    const autoSummarizeSwitch = document.querySelector(
      "#switch-auto-summarize"
    );
    if (autoSummarizeSwitch.checked) {
      autoSummarizeSwitch.checked = false;
      chrome.storage.local.get("settings", ({ settings }) => {
        chrome.storage.local.set({
          settings: { ...settings, autoSummarize: false },
        });
      });
    }
  }
}
function updateAutoSplitPrompt(autoSummarize) {
  const autoSplitChunkPrompt = `Responda com OK: [PEDAÇO x/TOTAL]
Não responda com mais nada!`;
  const autoSplitChunkPromptSummarize = `Responda com OK: [PEDAÇO x/TOTAL]
Resumo: Um resumo curto do último pedaço. Mantenha fatos e nomes importantes no resumo. Não responda com mais nada!`;
}
  chrome.storage.local.get("settings", ({ settings }) => {
    chrome.storage.local.set(
      {
        settings: {
          ...settings,
          autoSplitChunkPrompt: autoSummarize
            ? autoSplitChunkPromptSummarize
            : autoSplitChunkPrompt,
        },
      },
      () => {
        const autoSplitInitialPromptText = document.querySelector(
          "#split-chunk-prompt-textarea"
        );
        autoSplitInitialPromptText.value = autoSummarize
          ? autoSplitChunkPromptSummarize
          : autoSplitChunkPrompt;
      }
    );
  });

function newsletterTabContent(hasSubscription = false) {
  const content = document.createElement("div");
  content.id = "settings-modal-tab-content";
  content.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; width:100%; padding: 16px; margin-width:100%; height: 100%;";
  // daily newsletter
  const dailyNewsletterSwitch = createSwitch(
    "Ocultar Newsletter Diária",
    "Não mostrar o popup da newsletter diária dentro do ChatGPT.",
    "hideNewsletter",
    false
  );
  content.appendChild(dailyNewsletterSwitch);

  return content;
}
function createSlider(
  title,
  subtitle,
  settingsKey,
  defaultValue,
  min,
  max,
  step,
  callback = null,
  tags = [],
  disabled = false
) {
  const sliderWrapper = document.createElement("div");
  sliderWrapper.style =
    "display: flex; flex-direction:column; justify-content: flex-start; align-items: flex-start; width: 100%; margin: 8px 0;";
  const sliderLabel = document.createElement("div");
  sliderLabel.style =
    "display:flex; align-items: center; width: 100%; margin: 8px 0; color:white;";
  const sliderTitle = document.createElement("div");
  sliderTitle.style = "min-width: fit-content; font-size: 16px;";
  sliderTitle.innerHTML = title;
  const sliderSubtitle = document.createElement("div");
  sliderSubtitle.style = "font-size: 12px; color: #999;";
  sliderSubtitle.innerHTML = subtitle;
  sliderLabel.appendChild(sliderTitle);
  const sliderElement = document.createElement("input");
  sliderElement.id = `sp-range-slider-${settingsKey}`;
  sliderElement.classList = "sp-range-slider";
  sliderElement.style = "width: 100%; margin: 8px";
  sliderElement.type = "range";
  sliderElement.min = min;
  sliderElement.max = max;
  sliderElement.step = step;
  sliderElement.disabled = disabled;
  const sliderValue = document.createElement("span");
  sliderValue.id = `sp-range-slider-value-${settingsKey}`;
  sliderValue.style =
    "min-width: fit-content;font-size: 14px; color: #999; margin: 0 16px;";
  sliderValue.textContent = defaultValue;

  if (settingsKey) {
    chrome.storage.local.get("settings", ({ settings }) => {
      const settingValue = settings[settingsKey];
      if (settingValue === undefined && defaultValue !== undefined) {
        settings[settingsKey] = defaultValue;
        sliderValue.textContent = defaultValue;
        chrome.storage.local.set(settings);
      } else {
        sliderElement.value = settingValue;
        sliderValue.textContent =
          settingValue === "1000" && settingsKey === "autoSyncCount"
            ? "Todas Conversas"
            : settingValue;
      }
    });
    sliderElement.addEventListener("input", () => {
      sliderValue.textContent =
        sliderElement.value === "1000" && settingsKey === "autoSyncCount"
          ? "Todas Conversas"
          : sliderElement.value;
    });
    sliderElement.addEventListener("change", () => {
      chrome.storage.local.get("settings", ({ settings }) => {
        const oldValue = settings[settingsKey];
        settings[settingsKey] = sliderElement.value;
        sliderValue.textContent =
          sliderElement.value === "1000" && settingsKey === "autoSyncCount"
            ? "Todas Conversas"
            : sliderElement.value;
        chrome.storage.local.set({ settings }, () => {
          if (callback) {
            callback(oldValue, sliderElement.value);
          }
        });
      });
    });
  } else {
    sliderElement.value = defaultValue;
    sliderValue.textContent = defaultValue;
    sliderElement.addEventListener("change", () => {
      if (callback) {
        callback(sliderElement.value);
      }
    });
  }
  sliderLabel.appendChild(sliderValue);
  sliderLabel.appendChild(sliderElement);

  sliderWrapper.appendChild(sliderLabel);
  sliderWrapper.appendChild(sliderSubtitle);
  return sliderWrapper;
}
function createSwitch(
  title,
  subtitle,
  settingsKey,
  defaultValue,
  callback = null,
  tags = [],
  disabled = false
) {
  const switchWrapper = document.createElement("div");
  switchWrapper.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start; width: 100%; margin: 8px 0;";
  const switchElement = document.createElement("div");
  switchElement.style =
    "display: flex; flex-direction: row; justify-content: start; align-items: center; width: 100%; margin: 8px 0;color:white;";
  switchElement.innerHTML = title;
  const label = document.createElement("label");
  label.classList = "sp-switch";
  label.style.opacity = disabled ? "0.5" : "1";
  const input = document.createElement("input");
  input.id = `switch-${title.toLowerCase().replaceAll(" ", "-")}`;
  input.type = "checkbox";
  input.disabled = disabled;
  const betaTagWrapper = document.createElement("div");
  tags.forEach((tag) => {
    const betaTag = document.createElement("span");
    betaTag.style = `${
      tag === "⚡️ Requer Assinatura Pro"
        ? "background-color: #19c37d; color: black;"
        : tag === "New"
        ? "background-color: #ef4146; color: white;"
        : "background-color: #ff9800; color: black;"
    }  padding: 2px 4px; border-radius: 8px; font-size: 0.7em;margin-right:8px;`;
    betaTag.textContent = tag;
    if (tag === "⚡️ Requer Assinatura Pro") {
      betaTag.role = "button";
      betaTag.addEventListener("click", () => {
        document.querySelector("#upgrade-to-pro-button-settings")?.click();
      });
    }
    betaTagWrapper.appendChild(betaTag);
  });
  const helper = document.createElement("div");
  helper.style = "font-size: 12px; color: #999;";
  helper.innerHTML = subtitle;
  if (settingsKey) {
    chrome.storage.local.get("settings", ({ settings }) => {
      const settingValue = settings[settingsKey];
      if (settingValue === undefined && defaultValue !== undefined) {
        settings[settingsKey] = defaultValue;
        chrome.storage.local.set(settings);
      } else {
        input.checked = settingValue;
      }
    });
    input.addEventListener("change", () => {
      chrome.runtime.sendMessage(
        {
          checkHasSubscription: true,
          detail: {
            forceRefresh: false,
          },
        },
        (hasSubscription) => {
          if (!hasSubscription && tags.includes("⚡️ Requer Assinatura Pro")) {
            toast(
              "Este recurso está disponível apenas para usuários Pro. Por favor, faça upgrade para Pro para usar este recurso.",
              "error"
            );
            input.checked = defaultValue;
          } else {
            chrome.storage.local.get("settings", ({ settings }) => {
              settings[settingsKey] = input.checked;
              chrome.storage.local.set({ settings }, () => {
                if (callback) {
                  callback(input.checked);
                }
              });
            });
          }
        }
      );
    });
  } else {
    chrome.runtime.sendMessage(
      {
        checkHasSubscription: true,
        detail: {
          forceRefresh: false,
        },
      },
      (hasSubscription) => {
        if (!hasSubscription && tags.includes("⚡️ Requer Assinatura Pro")) {
          toast(
            "Este recurso está disponível apenas para usuários Pro. Por favor, faça upgrade para Pro para usar este recurso.",
            "error"
          );
          input.checked = defaultValue;
        } else {
          input.checked = defaultValue;
          input.addEventListener("change", () => {
            if (callback) {
              callback(input.checked);
            }
          });
        }
      }
    );
  }
  const slider = document.createElement("span");
  slider.classList = "sp-switch-slider round";

  label.appendChild(input);
  label.appendChild(slider);
  switchElement.appendChild(label);
  if (tags.length > 0) switchElement.appendChild(betaTagWrapper);
  switchWrapper.appendChild(switchElement);
  switchWrapper.appendChild(helper);
  return switchWrapper;
}
function refreshPage() {
  window.location.reload();
}
// function safeModeTrigger(safeMode) {
//   chrome.runtime.sendMessage({ type: 'safeMode', safeMode });
// }
function settingsModalActions() {
  // add actionbar at the bottom of the content
  const actionBar = document.createElement("div");
  actionBar.style =
    "display: flex; flex-direction: row; justify-content: start; align-items: end; margin-top: 8px;width:100%;";
  const logo = document.createElement("img");
  logo.src = chrome.runtime.getURL("icons/logo.png");
  logo.style = "width: 40px; height: 40px;";

  actionBar.appendChild(logo);
  const textWrapper = document.createElement("div");
  textWrapper.style =
    "display: flex; flex-direction: column; justify-content: start; align-items: start; margin-left: 8px;";
  // powere by
  const poweredBy = document.createElement("div");
  poweredBy.textContent = "Powered by";
  poweredBy.style = "color: #999; font-size: 12px;";
  const superpowerChatGPT = document.createElement("a");
  superpowerChatGPT.href =
    "https://chrome.google.com/webstore/";
  superpowerChatGPT.target = "_blank";
  superpowerChatGPT.textContent = "Otuti ChatGPT";
  superpowerChatGPT.style =
    "color: #999; font-size: 12px; margin-left: 4px; text-decoration: underline;";
  superpowerChatGPT.addEventListener("mouseover", () => {
    superpowerChatGPT.style =
      "color: gold; font-size: 12px; margin-left: 4px;text-decoration: underline;";
  });
  superpowerChatGPT.addEventListener("mouseout", () => {
    superpowerChatGPT.style =
      "color: #999; font-size: 12px; margin-left: 4px;text-decoration: underline;";
  });
  poweredBy.appendChild(superpowerChatGPT);
  const versionNumber = document.createElement("span");
  const { version } = chrome.runtime.getManifest();
  versionNumber.textContent = `(v ${version}`;
  versionNumber.style = "color: #999; font-size: 12px; margin-left: 4px;";
  poweredBy.appendChild(versionNumber);
  const releaseNote = document.createElement("span");
  releaseNote.textContent = "Release Docs)";
  releaseNote.style =
    "color: #999; font-size: 12px; margin-left: 4px; text-decoration: underline; cursor: pointer;";
  releaseNote.addEventListener("mouseover", () => {
    releaseNote.style =
      "color: gold; font-size: 12px; margin-left: 4px;text-decoration: underline; cursor: pointer;";
  });
  releaseNote.addEventListener("mouseout", () => {
    releaseNote.style =
      "color: #999; font-size: 12px; margin-left: 4px;text-decoration: underline; cursor: pointer;";
  });
  releaseNote.addEventListener("click", () => {
    // click on close settings modal close button
    document
      .querySelector("button[id^=modal-close-button-release-note]")
      ?.click();
    createReleaseNoteModal(version);
  });
  poweredBy.appendChild(releaseNote);
  textWrapper.appendChild(poweredBy);
  // made by
  const madeBy = document.createElement("div");
  madeBy.textContent = "Made by";
  madeBy.style = "color: #999; font-size: 12px;";
  const madeByLink = document.createElement("a");
  madeByLink.href = "https://twitter.com/@otuti";
  madeByLink.target = "_blank";
  madeByLink.textContent = "Otuti LABs";
  madeByLink.style =
    "color: #999; font-size: 12px; margin-left: 4px; text-decoration: underline;";
  madeByLink.addEventListener("mouseover", () => {
    madeByLink.style =
      "color: gold; font-size: 12px; margin-left: 4px;text-decoration: underline;";
  });
  madeByLink.addEventListener("mouseout", () => {
    madeByLink.style =
      "color: #999; font-size: 12px; margin-left: 4px;text-decoration: underline;";
  });
  // support
  const support = document.createElement("span");
  support.textContent = " - ";
  support.style = "color: #999; font-size: 12px;";
  const supportLink = document.createElement("a");
  supportLink.href = "https://www.otuti.com";
  supportLink.target = "_blank";
  supportLink.textContent = "🍕 Place Holder ➜";
  supportLink.style =
    "color: #999; font-size: 12px; margin-left: 4px; text-decoration: underline;";
  supportLink.addEventListener("mouseover", () => {
    supportLink.style =
      "color: gold; font-size: 12px; margin-left: 4px;text-decoration: underline;";
  });
  supportLink.addEventListener("mouseout", () => {
    supportLink.style =
      "color: #999; font-size: 12px; margin-left: 4px;text-decoration: underline;";
  });
  madeBy.appendChild(madeByLink);
  support.appendChild(supportLink);
  madeBy.appendChild(madeByLink);
  madeBy.appendChild(support);

  textWrapper.appendChild(madeBy);
  actionBar.appendChild(textWrapper);
  const upgradeToPro = document.createElement("button");
  upgradeToPro.id = "upgrade-to-pro-button-settings";
  upgradeToPro.classList =
    "flex flex-wrap px-3 py-1 items-center rounded-md bg-gold hover:bg-gold-dark transition-colors duration-200 text-black cursor-pointer text-sm ml-auto font-bold";
  upgradeToPro.style.width = "230px";
  upgradeToPro.innerHTML =
    '<div class="flex w-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width:20px; height:20px; margin-right:6px;position:relative; top:10px;" stroke="purple" fill="purple"><path d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z"/></svg> Upgrade to Pro</div><div style="font-size:10px;font-weight:400;margin-left:28px;" class="flex w-full">GPT Store, Image Gallery, Voice & more</div>';

  chrome.runtime.sendMessage(
    {
      checkHasSubscription: true,
      detail: {
        forceRefresh: false,
      },
    },
    (hasSubscription) => {
      if (hasSubscription) {
        upgradeToPro.classList =
          "flex px-3 py-3 items-center rounded-md bg-gold hover:bg-gold-dark transition-colors duration-200 text-black cursor-pointer text-sm ml-auto font-bold";
        upgradeToPro.style.width = "auto";
        upgradeToPro.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width:20px; height:20px;margin-right:6px;" stroke="purple" fill="purple"><path d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z"/></svg> Pro account';
        // } else {
        // make the button shake every 5 seconds
        //   setInterval(() => {
        //     upgradeToPro.classList.add('animate-shake');
        //     setTimeout(() => {
        //       upgradeToPro.classList.remove('animate-shake');
        //     }, 1000);
        //   }, 7000);
      }
      upgradeToPro.addEventListener("click", () => {
        openUpgradeModal(hasSubscription);
      });
      actionBar.appendChild(upgradeToPro);
    }
  );
  return actionBar;
}
function addSettingsButton() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  // check if the setting button is already added
  if (document.querySelector("#settings-button")) return;
  // create the setting button by copying the nav button
  const settingsButton = document.createElement("a");
  settingsButton.classList =
    "flex py-3 px-3 items-center gap-3 rounded-md hover:bg-token-main-surface-tertiary transition-colors duration-200 text-token-text-primary cursor-pointer text-sm";
  settingsButton.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4 text-token-text-primary" fill="currentColor"><path d="M160 256C160 202.1 202.1 160 256 160C309 160 352 202.1 352 256C352 309 309 352 256 352C202.1 352 160 309 160 256zM256 208C229.5 208 208 229.5 208 256C208 282.5 229.5 304 256 304C282.5 304 304 282.5 304 256C304 229.5 282.5 208 256 208zM293.1 .0003C315.3 .0003 334.6 15.19 339.8 36.74L347.6 69.21C356.1 73.36 364.2 78.07 371.9 83.28L404 73.83C425.3 67.56 448.1 76.67 459.2 95.87L496.3 160.1C507.3 179.3 503.8 203.6 487.8 218.9L463.5 241.1C463.8 246.6 464 251.3 464 256C464 260.7 463.8 265.4 463.5 270L487.8 293.1C503.8 308.4 507.3 332.7 496.3 351.9L459.2 416.1C448.1 435.3 425.3 444.4 404 438.2L371.9 428.7C364.2 433.9 356.1 438.6 347.6 442.8L339.8 475.3C334.6 496.8 315.3 512 293.1 512H218.9C196.7 512 177.4 496.8 172.2 475.3L164.4 442.8C155.9 438.6 147.8 433.9 140.1 428.7L107.1 438.2C86.73 444.4 63.94 435.3 52.85 416.1L15.75 351.9C4.66 332.7 8.168 308.4 24.23 293.1L48.47 270C48.16 265.4 48 260.7 48 255.1C48 251.3 48.16 246.6 48.47 241.1L24.23 218.9C8.167 203.6 4.66 179.3 15.75 160.1L52.85 95.87C63.94 76.67 86.73 67.56 107.1 73.83L140.1 83.28C147.8 78.07 155.9 73.36 164.4 69.21L172.2 36.74C177.4 15.18 196.7 0 218.9 0L293.1 .0003zM205.5 103.6L194.3 108.3C181.6 113.6 169.8 120.5 159.1 128.7L149.4 136.1L94.42 119.9L57.31 184.1L98.81 223.6L97.28 235.6C96.44 242.3 96 249.1 96 256C96 262.9 96.44 269.7 97.28 276.4L98.81 288.4L57.32 327.9L94.42 392.1L149.4 375.9L159.1 383.3C169.8 391.5 181.6 398.4 194.3 403.7L205.5 408.4L218.9 464H293.1L306.5 408.4L317.7 403.7C330.4 398.4 342.2 391.5 352.9 383.3L362.6 375.9L417.6 392.1L454.7 327.9L413.2 288.4L414.7 276.4C415.6 269.7 416 262.9 416 256C416 249.1 415.6 242.3 414.7 235.6L413.2 223.6L454.7 184.1L417.6 119.9L362.6 136.1L352.9 128.7C342.2 120.5 330.4 113.6 317.7 108.3L306.5 103.6L293.1 48H218.9L205.5 103.6z"/></svg> Settings';
  settingsButton.title = "CMD/CTRL + SHIFT + S";

  settingsButton.id = "settings-button";
  settingsButton.style = `${settingsButton.style.cssText}; width: 100%;`;
  // Add click event listener to setting button
  settingsButton.addEventListener("click", () => {
    // open the setting modal
    createSettingsModal();
  });
  const userMenu = nav.querySelector("#user-menu");
  userMenu?.prepend(settingsButton);
}

// eslint-disable-next-line no-unused-vars
function initializeSettings(hasSubscription) {
  // listen to autoSyncChange and update it in window.localStorage to be able to access it from arkose.js
  chrome.storage.onChanged.addListener((e) => {
    if (
      e.settings &&
      e.settings?.newValue?.autoSync !== e.settings?.oldValue?.autoSync
    ) {
      window.localStorage.setItem("sp/autoSync", e.settings.newValue.autoSync);
    }
    if (
      e.settings &&
      e.settings?.newValue?.enhanceGPTStore !==
        e.settings?.oldValue?.enhanceGPTStore
    ) {
      window.localStorage.setItem(
        "sp/enhanceGPTStore",
        e.settings.newValue.enhanceGPTStore
      );
    }
  });

  chrome.storage.local.get(
    [
      "settings",
      "presetPrompts",
      "selectedConversations",
      "customInstructionProfiles",
      "openAIUserSettings",
    ],
    (result) => {
      window.localStorage.setItem(
        "sp/autoSync",
        result.settings?.autoSync !== undefined
          ? result.settings.autoSync
          : true
      );
      window.localStorage.setItem(
        "sp/enhanceGPTStore",
        result.settings?.enhanceGPTStore !== undefined
          ? result.settings.enhanceGPTStore
          : true
      );
      chrome.storage.local.set(
        {
          settings: {
            ...result.settings,
            hideUpdateNotification:
              result.settings?.hideUpdateNotification !== undefined
                ? result.settings.hideUpdateNotification
                : false,
            animateFavicon:
              result.settings?.animateFavicon !== undefined
                ? result.settings.animateFavicon
                : false,
            crossDeviceSync:
              result.settings?.crossDeviceSync !== undefined
                ? result.settings.crossDeviceSync && hasSubscription
                : hasSubscription,
            autoScroll:
              result.settings?.autoScroll !== undefined
                ? result.settings.autoScroll
                : true,
            autoSync:
              result.settings?.autoSync !== undefined
                ? result.settings.autoSync
                : true,
            autoSyncCount:
              result.settings?.autoSyncCount !== undefined
                ? result.settings.autoSyncCount
                : 100,
            autoRefreshAfterSync:
              result.settings?.autoRefreshAfterSync !== undefined
                ? result.settings.autoRefreshAfterSync
                : true,
            dontShowAutoSyncWarning:
              result.settings?.dontShowAutoSyncWarning !== undefined
                ? result.settings.dontShowAutoSyncWarning
                : false,
            safeMode:
              result.settings?.safeMode !== undefined
                ? result.settings.safeMode
                : true,
            promptHistory:
              result.settings?.promptHistory !== undefined
                ? result.settings.promptHistory
                : true,
            copyMode:
              result.settings?.copyMode !== undefined
                ? result.settings.copyMode
                : false,
            autoResetTopNav:
              result.settings?.autoResetTopNav !== undefined
                ? result.settings.autoResetTopNav
                : false,
            hideBottomSidebar:
              result.settings?.hideBottomSidebar !== undefined
                ? result.settings.hideBottomSidebar
                : false,
            showExamplePrompts:
              result.settings?.showExamplePrompts !== undefined
                ? result.settings.showExamplePrompts
                : false,
            showMessageTimestamp:
              result.settings?.showMessageTimestamp !== undefined
                ? result.settings.showMessageTimestamp
                : false,
            showCustomPromptsButton:
              result.settings?.showCustomPromptsButton !== undefined
                ? result.settings.showCustomPromptsButton
                : true,
            pluginDefaultOpen: result.openAIUserSettings?.settings
              ?.show_expanded_code_view
              ? result.openAIUserSettings?.settings?.show_expanded_code_view
              : result.settings?.pluginDefaultOpen !== undefined
              ? result.settings.pluginDefaultOpen
              : false,
            showWordCount:
              result.settings?.showWordCount !== undefined
                ? result.settings.showWordCount
                : false,
            showTotalWordCount:
              result.settings?.showTotalWordCount !== undefined
                ? result.settings.showTotalWordCount
                : false,
            hideNewsletter:
              result.settings?.hideNewsletter !== undefined
                ? result.settings.hideNewsletter
                : false,
            hideReleaseNote:
              result.settings?.hideReleaseNote !== undefined
                ? result.settings.hideReleaseNote
                : true,
            showNewsletterOnUpdate:
              result.settings?.showNewsletterOnUpdate !== undefined
                ? result.settings.showNewsletterOnUpdate
                : true,
            chatEndedSound:
              result.settings?.chatEndedSound !== undefined
                ? result.settings.chatEndedSound
                : false,
            autoColorFolders:
              result.settings?.autoColorFolders !== undefined
                ? result.settings.autoColorFolders
                : false,
            autoSortFolders:
              result.settings?.autoSortFolders !== undefined
                ? result.settings.autoSortFolders
                : true,
            customGPTAutoFolder:
              result.settings?.customGPTAutoFolder !== undefined
                ? result.settings.customGPTAutoFolder
                : false,
            customInstruction:
              result.settings?.customInstruction !== undefined
                ? result.settings.customInstruction
                : "",
            useCustomInstruction:
              result.settings?.useCustomInstruction !== undefined
                ? result.settings.useCustomInstruction
                : false,
            customConversationWidth:
              result.settings?.customConversationWidth !== undefined
                ? result.settings.customConversationWidth
                : false,
            conversationWidth:
              result.settings?.conversationWidth !== undefined
                ? result.settings.conversationWidth
                : 50,
            autoArchiveOldChats:
              result.settings?.autoArchiveOldChats !== undefined
                ? result.settings.autoArchiveOldChats
                : false,
            skipAutoArchiveFolder:
              result.settings?.skipAutoArchiveFolder !== undefined
                ? result.settings.skipAutoArchiveFolder
                : false,
            autoArchiveMode:
              result.settings?.autoArchiveMode !== undefined
                ? result.settings.autoArchiveMode
                : autoArchiveModes[0],
            autoArchiveThreshold:
              result.settings?.autoArchiveThreshold !== undefined
                ? result.settings.autoArchiveThreshold
                : 7,
            saveHistory:
              result.settings?.saveHistory !== undefined
                ? result.settings.saveHistory
                : true,
            promptTemplate:
              result.settings?.promptTemplate !== undefined
                ? result.settings.promptTemplate
                : true,
            enhanceGPTStore:
              result.settings?.enhanceGPTStore !== undefined
                ? result.settings.enhanceGPTStore
                : true,
            emailNewsletter:
              result.settings?.emailNewsletter !== undefined
                ? result.settings.emailNewsletter
                : false,
            autoClick:
              result.settings?.autoClick !== undefined
                ? result.settings.autoClick
                : false,
            showGpt4Counter:
              result.settings?.showGpt4Counter !== undefined
                ? result.settings.showGpt4Counter
                : true,
            autoSummarize:
              result.settings?.autoSummarize !== undefined
                ? result.settings.autoSummarize
                : false,
            autoSplit:
              result.settings?.autoSplit !== undefined
                ? result.settings.autoSplit
                : true,
            autoSplitLimit:
              result.settings?.autoSplitLimit !== undefined
                ? result.settings.autoSplitLimit
                : 24000,
            autoSplitInitialPrompt:
              result.settings?.autoSplitInitialPrompt !== undefined
                ? result.settings?.autoSplitInitialPrompt
                : `Agir como um carregador de documentos/textos até que você carregue e memorize o conteúdo do(s) próximo(s) texto(s) ou documento(s).
                Pode haver múltiplos arquivos, cada arquivo é marcado por nome no formato ### NOME DO DOCUMENTO.
                Eu os enviarei em pedaços. Cada pedaço começa será indicado como [INÍCIO DO PEDAÇO x/TOTAL], e o final deste pedaço será indicado como [FIM DO PEDAÇO x/TOTAL], onde x é o número do pedaço atual, e TOTAL é o número de todos os pedaços que eu enviarei.
                Eu dividirei a mensagem em pedaços e enviarei um por um. Para cada mensagem, siga as instruções no final da mensagem.
                Vamos começar:`,
            autoSplitChunkPrompt:
              result.settings?.autoSplitChunkPrompt !== undefined
                ? result.settings?.autoSplitChunkPrompt
                : `Responda precisamento: [CHUNK x/TOTAL]
Evite ao extremo qualquer outro conteúdo, ou frase na resposta!`,
            showFolderCounts:
              result.settings?.showFolderCounts !== undefined
                ? result.settings.showFolderCounts
                : true,
            autoHideTopNav:
              result.settings?.autoHideTopNav !== undefined
                ? result.settings.autoHideTopNav
                : false,
            navOpen:
              result.settings?.navOpen !== undefined
                ? result.settings.navOpen
                : true,
            showPinNav:
              result.settings?.showPinNav !== undefined
                ? result.settings.showPinNav
                : true,
            showLanguageSelector:
              result.settings?.showLanguageSelector !== undefined
                ? result.settings.showLanguageSelector
                : false,
            showToneSelector:
              result.settings?.showToneSelector !== undefined
                ? result.settings.showToneSelector
                : false,
            showWritingStyleSelector:
              result.settings?.showWritingStyleSelector !== undefined
                ? result.settings.showWritingStyleSelector
                : false,
            selectedLanguage:
              result.settings?.selectedLanguage ||
              languageList.find((language) => language.code === "default"),
            selectedTone:
              result.settings?.selectedTone ||
              toneList.find((tone) => tone.code === "default"),
            selectedWritingStyle:
              result.settings?.selectedWritingStyle ||
              writingStyleList.find(
                (writingStyle) => writingStyle.code === "default"
              ),
            exportMode: result.settings?.exportMode || "both",
            historyFilter: result.settings?.historyFilter || "favorites",
            selectedLibrarySortBy: result.settings?.selectedLibrarySortBy || {
              name: "New",
              code: "recent",
            },
            selectedLibraryCategory: result.settings
              ?.selectedLibraryCategory || { name: "All", code: "all" },
            selectedLibraryLanguage: result.settings
              ?.selectedLibraryLanguage || { name: "All", code: "all" },
            selectedPromptLanguage: result.settings?.selectedPromptLanguage || {
              name: "Select",
              code: "select",
            },
            multiSelectIndicator:
              result.settings?.multiSelectIndicator !== undefined
                ? result.settings.multiSelectIndicator
                : true,
            // text to speech
            autoSpeak:
              result.settings?.autoSpeak !== undefined
                ? result.settings.autoSpeak && hasSubscription
                : false,
            skipCodeReading:
              result.settings?.skipCodeReading !== undefined
                ? result.settings.skipCodeReading
                : false,
            alternateMainColors:
              result.settings?.alternateMainColors !== undefined
                ? result.settings.alternateMainColors
                : false,
            showNewChatSettings:
              result.settings?.showNewChatSettings !== undefined
                ? result.settings.showNewChatSettings
                : false,
            showMyPromptHistory:
              result.settings?.showMyPromptHistory !== undefined
                ? result.settings.showMyPromptHistory
                : true,
            showCommunityPrompts:
              result.settings?.showCommunityPrompts !== undefined
                ? result.settings.showCommunityPrompts
                : true,
            showKeyboardShortcutButton:
              result.settings?.showKeyboardShortcutButton !== undefined
                ? result.settings.showKeyboardShortcutButton
                : true,
            showPromptChainButton:
              result.settings?.showPromptChainButton !== undefined
                ? result.settings.showPromptChainButton
                : true,
            // speech to text
            speechToTextLanguage:
              result.settings?.speechToTextLanguage !== undefined
                ? result.settings?.speechToTextLanguage
                : { name: "Portuguese (Brazillian)", code: "pt-BR" },
            speechToTextInterimResults:
              result.settings?.speechToTextInterimResults !== undefined
                ? result.settings?.speechToTextInterimResults
                : true,
            autoSubmitWhenReleaseAlt:
              result.settings?.autoSubmitWhenReleaseAlt !== undefined
                ? result.settings.autoSubmitWhenReleaseAlt && hasSubscription
                : false,
          },
        },
        () => {
          addSettingsButton();
          checkSyncAndLoad();
        }
      );
    }
  );
}
