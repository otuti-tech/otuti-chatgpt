/* global getConversation,getConversations, formatTime, getSelectedConversations, JSZip, saveAs, resetSelection */
let exportAllCanceled = false;
let timeout;

function fileFormatConverter(fileFormat) {
  switch (fileFormat) {
    case 'json':
      return 'json';
    case 'text':
      return 'txt';
    case 'markdown':
      return 'md';
    case 'html':
      return 'html';
    default:
      return 'txt';
  }
}

function exportAllConversations(exportFormat) {
  const exportAllModalProgressBarLabel = document.getElementById('export-all-modal-progress-bar-label');
  const exportAllModalProgressBarFill = document.getElementById('export-all-modal-progress-bar-fill');
  const exportAllModalProgressBarFilename = document.getElementById('export-all-modal-progress-bar-filename');
  getSelectedConversations().then((convs) => {
    const zip = new JSZip();
    // fetch every conversation
    const fetchConversation = async (conversationId, exportMode) => {
      if (exportAllCanceled) {
        return;
      }
      await getConversation(conversationId).then((conversation) => {
        const conversationTitle = conversation.title.replace(/[^a-zA-Z0-9]/g, '_');
        let currentNode = conversation.current_node;
        const createDate = new Date(formatTime(conversation.create_time));
        //  folderName = conversation.create_time in local time in the format of YYYY-MM-DD
        const folderName = `${createDate.getFullYear()}-${createDate.getMonth() + 1}-${createDate.getDate()}`;
        // create filePrefix  from conversation.create_time in user local time in the format of HH-MM-SS
        const filePrefix = `${createDate.getHours()}-${createDate.getMinutes()}-${createDate.getSeconds()}`;
        // create zip folder with date as name if it doesn't exist
        zip.folder(folderName);
        let messages = [];
        while (currentNode) {
          const { message, parent } = conversation.mapping[currentNode];
          if (message) messages.push(message);
          currentNode = parent;
        }

        if (exportMode === 'assistant') {
          messages = messages.filter((m) => m.role === 'assistant' || m.author?.role === 'assistant');
        }
        // download as .txt file
        if (exportFormat === 'text') {
          const conversationText = messages.reverse().filter((m) => {
            const role = m?.author?.role || m?.role;
            const recipient = m?.recipient;
            return role === 'user' || (recipient === 'all' && role === 'assistant');
          }).map((m) => `${exportMode === 'both' ? `>> ${m.role ? m.role.toUpperCase() : m.author?.role.toUpperCase()}: ` : ''}${m.content?.parts?.filter((p) => typeof p === 'string')?.join('\n').replace(/## Instructions[\s\S]*## End Instructions\n\n/, '')}`)?.join('\n\n');
          zip.file(`${folderName}/${filePrefix}-${conversationTitle}.${fileFormatConverter(exportFormat)}`, conversationText);
        }
        // download as .json file
        if (exportFormat === 'json') {
          const conversationJson = conversation;
          zip.file(`${folderName}/${filePrefix}-${conversationTitle}.${fileFormatConverter(exportFormat)}`, JSON.stringify(conversationJson));
        }
        // download as .md file
        if (exportFormat === 'markdown') {
          const conversationMarkdown = messages.reverse().filter((m) => {
            const role = m?.author?.role || m?.role;
            const recipient = m?.recipient;
            return role === 'user' || (recipient === 'all' && role === 'assistant');
          }).map((m) => `${exportMode === 'both' ? `## ${m.role ? m.role.toUpperCase() : m.author?.role.toUpperCase()}\n` : ''}${m.content?.parts?.filter((p) => typeof p === 'string')?.join('\n').replace(/## Instructions[\s\S]*## End Instructions\n\n/, '')}`)?.join('\n\n');
          zip.file(`${folderName}/${filePrefix}-${conversationTitle}.${fileFormatConverter(exportFormat)}`, conversationMarkdown);
        }

        // update exportAllModalProgressBar.style
        const fileCount = Object.values(zip.files).filter((f) => !f.dir).length;
        const percentage = Math.round((fileCount / convs.length) * 100);
        exportAllModalProgressBarLabel.textContent = `${fileCount} / ${convs.length}`;
        exportAllModalProgressBarFill.style.width = `${percentage}%`;
        exportAllModalProgressBarFilename.textContent = `${conversationTitle}.${fileFormatConverter(exportFormat)}`;
      })
        .catch((_err) => { });
    };

    const fetchAllConversationsAsync = async (conversations, exportMode) => {
      for (let i = 0; i < conversations.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await fetchConversation(conversations[i].id, exportMode, i);
        // const fileCount = Object.values(zip.files).filter((f) => !f.dir).length;
        // if (fileCount > 0 && fileCount % 1 === 0) {
        //   // eslint-disable-next-line no-await-in-loop
        //   await chrome.storage.local.get(['conversations', 'conversationsAreSynced', 'settings']).then(async (res) => {
        //     const { conversationsAreSynced, settings } = res;
        //     const { autoSync } = settings;
        //     if (!conversationsAreSynced || !autoSync) {
        //       await exportCountDownAsync();
        //     }
        //   });
        // }
      }
    };
    chrome.storage.local.get('settings', ({ settings }) => {
      const { exportMode } = settings;
      fetchAllConversationsAsync(convs, exportMode).then(() => {
        if (exportAllCanceled) {
          exportAllCanceled = false;
          return;
        }
        clearTimeout(timeout);
        zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }).then((content) => {
          saveAs(content, `${new Date().toISOString().slice(0, 10)}-conversations.zip`);
          const exportAllModal = document.getElementById('export-all-modal');
          resetSelection();
          setTimeout(() => {
            exportAllModal.remove();
          }, 500);
        });
      });
    });
  }, () => { });
}

// eslint-disable-next-line no-unused-vars
function openExportAllModal() {
  clearTimeout(timeout);
  exportAllCanceled = false;
  const exportAllModal = document.createElement('div');
  exportAllModal.style = 'position:fixed;top:0px;left:0px;width:100%;height:100%;z-index:1000;display:flex;align-items:center;justify-content:center;color:lightslategray;';
  exportAllModal.classList = 'bg-black/50 dark:bg-gray-600/70';
  exportAllModal.id = 'export-all-modal';
  exportAllModal.addEventListener('click', (e) => {
    // export-all-modal-progress-bar-fill
    const exportAllModalProgressBarFill = document.getElementById('export-all-modal-progress-bar-fill');
    if (e.target.id === 'export-all-modal' && (exportAllModalProgressBarFill.style.width === '0%' || exportAllModalProgressBarFill.style.width === '100%')) {
      exportAllModal.remove();
    }
  });
  const exportAllModalContent = document.createElement('div');
  exportAllModalContent.style = 'width:400px;min-height:300px;background-color:#0b0d0e;border-radius:8px;padding:16px;display:flex;flex-direction:column;align-items:flex-start;justify-content:start;box-shadow: rgb(0 0 0 / 72%) 0px 0px 20px 0px; border: 1px solid #555;';
  exportAllModal.appendChild(exportAllModalContent);
  const exportAllModalTitle = document.createElement('div');
  exportAllModalTitle.style = 'font-size:1.25rem;font-weight:500;';
  chrome.storage.local.get(['selectedConversations'], (result) => {
    const { selectedConversations } = result;
    if (!selectedConversations || selectedConversations.length === 0) {
      exportAllModalTitle.textContent = 'Export All';
    } else {
      exportAllModalTitle.textContent = `Export ${selectedConversations.length} Selected`;
    }
  });
  exportAllModalContent.appendChild(exportAllModalTitle);
  // const exportAllModalDescription = document.createElement('div');
  // exportAllModalDescription.style = 'font-size:0.875rem;color:#565869;';
  // exportAllModalDescription.textContent = 'This can take a few seconds.';
  // exportAllModalContent.appendChild(exportAllModalDescription);

  // 3 radio buttons in a row for export format: input/label, input/label, input/label
  const exportAllModalFormatTitle = document.createElement('div');
  exportAllModalFormatTitle.style = 'font-size:0.875rem;font-weight:500;margin-top:32px;';
  exportAllModalFormatTitle.textContent = 'In what format do you want to export?';
  exportAllModalContent.appendChild(exportAllModalFormatTitle);
  const exportAllModalRadioButtonsWrapper = document.createElement('div');
  exportAllModalRadioButtonsWrapper.style = 'display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:8px;';
  exportAllModalContent.appendChild(exportAllModalRadioButtonsWrapper);
  const exportAllModalRadioButtons = [
    {
      id: 'export-all-modal-radio-button-markdown',
      name: 'export-all-modal-radio-button',
      value: 'markdown',
      label: 'Markdown',
    },
    {
      id: 'export-all-modal-radio-button-json',
      name: 'export-all-modal-radio-button',
      value: 'json',
      label: 'Json',
    },
    {
      id: 'export-all-modal-radio-button-text',
      name: 'export-all-modal-radio-button',
      value: 'text',
      label: 'Text',
    },
  ];
  let exportFormat = 'markdown';
  // onchange event listener for radio buttons
  const exportAllModalRadioButtonsOnChange = (e) => {
    const { value } = e.target;
    exportFormat = value;
  };
  exportAllModalRadioButtons.forEach((radioButton) => {
    const exportAllModalRadioButtonWrapper = document.createElement('div');
    exportAllModalRadioButtonWrapper.style = 'display:flex;align-items:center;justify-content:center;';
    exportAllModalRadioButtonsWrapper.appendChild(exportAllModalRadioButtonWrapper);
    const exportAllModalRadioButton = document.createElement('input');
    exportAllModalRadioButton.type = 'radio';
    exportAllModalRadioButton.id = radioButton.id;
    exportAllModalRadioButton.name = radioButton.name;
    exportAllModalRadioButton.value = radioButton.value;
    exportAllModalRadioButton.checked = radioButton.value === 'markdown';
    exportAllModalRadioButton.addEventListener('change', exportAllModalRadioButtonsOnChange);
    exportAllModalRadioButtonWrapper.appendChild(exportAllModalRadioButton);
    const exportAllModalRadioButtonLabel = document.createElement('label');
    exportAllModalRadioButtonLabel.htmlFor = radioButton.id;
    exportAllModalRadioButtonLabel.style = 'font-size:0.875rem;margin-left:8px;';
    exportAllModalRadioButtonLabel.textContent = radioButton.label;

    exportAllModalRadioButtonWrapper.appendChild(exportAllModalRadioButtonLabel);
  });

  // progress bar label
  const exportAllModalProgressBarLabel = document.createElement('div');
  exportAllModalProgressBarLabel.id = 'export-all-modal-progress-bar-label';
  exportAllModalProgressBarLabel.style = 'font-size:0.875rem;margin:32px auto 8px;';
  exportAllModalProgressBarLabel.textContent = '0 / --';

  exportAllModalContent.appendChild(exportAllModalProgressBarLabel);
  // progress bar
  const exportAllModalProgressBar = document.createElement('div');
  exportAllModalProgressBar.id = 'export-all-modal-progress-bar';
  exportAllModalProgressBar.style = 'position:relative;width:100%;height:12px;min-height:12px;background-color:#565869;border-radius:4px;overflow:hidden;';
  exportAllModalContent.appendChild(exportAllModalProgressBar);

  const exportAllModalProgressBarFill = document.createElement('div');
  exportAllModalProgressBarFill.id = 'export-all-modal-progress-bar-fill';
  exportAllModalProgressBarFill.style = 'position:absolute;top:0px;left:0px;width:0%;height:12px;min-height:12px;background-color:gold;border-radius:4px;';
  exportAllModalProgressBar.appendChild(exportAllModalProgressBarFill);
  // progress bar filename
  const exportAllModalProgressBarFilename = document.createElement('div');
  exportAllModalProgressBarFilename.id = 'export-all-modal-progress-bar-filename';
  exportAllModalProgressBarFilename.style = 'font-size:0.875rem;margin:8px auto 32px;';
  exportAllModalProgressBarFilename.classList = 'truncate w-full';
  exportAllModalProgressBarFilename.textContent = ' ';
  exportAllModalContent.appendChild(exportAllModalProgressBarFilename);

  // modal action wrapper
  const exportAllModalActionWrapper = document.createElement('div');
  exportAllModalActionWrapper.style = 'display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:auto;';
  exportAllModalContent.appendChild(exportAllModalActionWrapper);

  // cancel button
  const exportAllModalCancelButton = document.createElement('button');
  exportAllModalCancelButton.style = 'width:100%;height:40px;border-radius:4px;border:1px solid #565869;background-color:#40414f;color:white;font-size:0.875rem;margin-top:auto; margin-right: 8px;';
  exportAllModalCancelButton.textContent = 'Cancel';
  exportAllModalCancelButton.addEventListener('click', () => {
    exportAllCanceled = true;
    // Get a reference to the last interval + 1
    const intervalId = setInterval(() => { }, Number.MAX_SAFE_INTEGER);
    // Clear any timeout/interval up to that id
    for (let i = 1; i < intervalId; i += 1) {
      clearInterval(i);
    }
    clearTimeout(timeout);

    exportAllModal.remove();
  });
  exportAllModalActionWrapper.appendChild(exportAllModalCancelButton);
  // export button
  const exportAllModalExportButton = document.createElement('button');
  exportAllModalExportButton.style = 'width:100%;height:40px;border-radius:4px;border:1px solid #565869;background-color:#40414f;color:white;font-size:0.875rem;margin-top:auto; margin-left: 8px;opacity:0.5;';
  exportAllModalExportButton.textContent = 'Export';
  exportAllModalExportButton.disabled = true;
  exportAllModalExportButton.addEventListener('click', () => {
    exportAllCanceled = false;
    exportAllModalExportButton.disabled = true;
    exportAllModalExportButton.textContent = 'Exporting...';
    exportAllModalExportButton.style.opacity = '0.5';
    const formatRadioButtons = document.querySelectorAll('input[name="export-all-modal-radio-button"]');
    formatRadioButtons.forEach((radioButton) => {
      radioButton.disabled = true;
    });
    exportAllConversations(exportFormat);
  });
  exportAllModalActionWrapper.appendChild(exportAllModalExportButton);

  chrome.storage.local.get(['selectedConversations'], (result) => {
    const { selectedConversations } = result;
    if (selectedConversations?.length > 0) {
      exportAllModalExportButton.disabled = false;
      exportAllModalExportButton.style.opacity = '1';
      exportAllModalProgressBarLabel.textContent = `0 / ${selectedConversations?.length}`;
    } else {
      chrome.storage.local.get(['conversations', 'conversationsAreSynced', 'settings']).then((res) => {
        const { conversations: storageConversations, conversationsAreSynced, settings } = res;
        const { autoSync } = settings;
        if (conversationsAreSynced && autoSync) {
          const allConversations = Object.values(storageConversations);

          exportAllModalProgressBarLabel.textContent = `0 / ${allConversations.length}`;
          exportAllModalExportButton.disabled = allConversations.length === 0;
          exportAllModalExportButton.style.opacity = allConversations.length === 0 ? '0.5' : '1';
        } else {
          getConversations(0, 1).then((conversations) => {
            const { total } = conversations;
            exportAllModalProgressBarLabel.textContent = `0 / ${total}`;
            exportAllModalExportButton.disabled = total === 0;
            exportAllModalExportButton.style.opacity = total === 0 ? '0.5' : '1';
          }, () => {
            exportAllModalProgressBarLabel.textContent = '0 / --';
          });
        }
      });
    }
  });
  document.body.appendChild(exportAllModal);
}
