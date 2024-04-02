/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
/* global toast, Sortable, createModal, settingsModalActions */
let runningPromptChainSteps;
let runningPromptChainStepIndex = 0;

function createPromptChainListModal() {
  const bodyContent = promptChainListModalContent();
  const actionsBarContent = promptChainListModalActions();
  createModal('Cadeias de Prompt', 'Você pode encontrar e executar todas as suas cadeias de prompt existentes aqui', bodyContent, actionsBarContent);
}
function promptChainListModalContent() {
  const content = document.createElement('div');
  content.id = 'modal-content-prompt-chain-list';
  content.style = 'overflow-y: hidden;position: relative;height:100%; width:100%';
  content.classList = 'markdown prose-invert';
  const logoWatermark = document.createElement('img');
  logoWatermark.src = chrome.runtime.getURL('icons/logo.png');
  logoWatermark.style = 'position: fixed; top: 50%; right: 50%; width: 400px; height: 400px; opacity: 0.07; transform: translate(50%, -50%);box-shadow:none !important;';
  content.appendChild(logoWatermark);
  const createPromptChainWrapper = document.createElement('div');
  createPromptChainWrapper.style = 'display:flex;align-items:end;justify-content:end;width:100%;padding:8px;';
  const createPromptChainButton = document.createElement('button');
  createPromptChainButton.classList = 'btn flex justify-center gap-2 btn-primary border-0 md:border';
  createPromptChainButton.style = 'margin-top:16px;';
  createPromptChainButton.textContent = '+ Criar nova Prompt Chain';
  createPromptChainButton.addEventListener('click', () => {
    createNewPromptChainModal('', ['']);
    addNewPromptModalEventListener();
  });
  createPromptChainWrapper.appendChild(createPromptChainButton);
  content.appendChild(createPromptChainWrapper);

  const promptChainList = document.createElement('article');
  promptChainList.style = 'width:100%;height:100%;display:flex;align-items:center;justify-content:flex-start;overflow-y:scroll;padding:16px;flex-direction:column;position:relative;';
  chrome.storage.local.get(['promptChains'], (result) => {
    const allPromptChains = result.promptChains || [];
    if (allPromptChains.length === 0) {
      promptChainList.innerHTML = '<div style="font-size:1em;">Atualmente, você não tem cadeias de prompt salvas. Clique no botão Criar Nova Cadeia de Prompt ou crie uma cadeia de prompt a partir de qualquer conversa existente usando o botão no lado direito da tela.</div>';
    } else {
      allPromptChains.forEach((promptChain) => {
        const promptChainElement = createPromptChainElement(promptChain);
        promptChainList.appendChild(promptChainElement);
      });
    }
  });

  content.appendChild(promptChainList);
  return content;
}
function createPromptChainElement(promptChain) {
  const promptChainElement = document.createElement('div');
  promptChainElement.id = `prompt-chain-${promptChain.id}`;
  promptChainElement.style = 'display:flex;align-items:center;justify-content:space-between;width:100%;padding:4px 8px; border: 1px solid #565869;border-radius:4px;margin-bottom:16px;color:#fff;cursor:pointer;';
  const promptChainName = document.createElement('div');
  promptChainName.classList = 'flex-1 truncate relative mr-2';
  promptChainName.innerHTML = `<div style="font-size:1em;">${promptChain.title} (${promptChain.steps.length} prompts)</div>`;
  promptChainName.title = promptChain.steps.map((step, i) => `Componente ${i + 1}:\n${step}`).join('\n\n');
  promptChainElement.appendChild(promptChainName);
  promptChainElement.addEventListener('click', () => {
    // document.getElementById('modal-close-button-prompt-chains').click();
    createNewPromptChainModal(promptChain.title, promptChain.steps, promptChain.id);
    addNewPromptModalEventListener();
  });
  const promptChainActions = document.createElement('div');
  promptChainActions.style = 'display:flex;align-items:center;justify-content:flex-end;width:25%;';
  const promptChainRunButton = document.createElement('button');
  promptChainRunButton.classList = 'btn flex justify-center gap-2 btn-dark border-0 md:border mr-1';
  promptChainRunButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
  promptChainRunButton.title = 'Executar (Shift + Clique para continuar na conversa atual)';
  promptChainRunButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('modal-close-button-prompt-chains').click();
    runPromptChain(promptChain.steps, 0, !e.shiftKey);
  });
  promptChainActions.appendChild(promptChainRunButton);
  const promptChainEditButton = document.createElement('button');
  promptChainEditButton.classList = 'btn flex justify-center gap-2 btn-dark border-0 md:border mr-1';
  promptChainEditButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>';
  promptChainEditButton.title = 'Editar a Prompt Chain';
  promptChainEditButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    // document.getElementById('modal-close-button-prompt-chains').click();
    createNewPromptChainModal(promptChain.title, promptChain.steps, promptChain.id);
    addNewPromptModalEventListener();
  });
  promptChainActions.appendChild(promptChainEditButton);

  const promptChainDuplicateButton = document.createElement('button');
  promptChainDuplicateButton.classList = 'btn flex justify-center gap-2 btn-dark border-0 md:border mr-1';
  promptChainDuplicateButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  promptChainDuplicateButton.title = 'Duplicar a Prompt Chain';
  promptChainDuplicateButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    chrome.storage.local.get(['promptChains'], (result) => {
      const allPromptChains = result.promptChains || [];
      const index = allPromptChains.findIndex((chain) => chain.id === promptChain.id);
      const newPromptChain = { ...promptChain };
      newPromptChain.id = self.crypto.randomUUID();
      allPromptChains.splice(index, 0, newPromptChain);
      chrome.storage.local.set({ promptChains: allPromptChains });
      const newPromptChainElement = createPromptChainElement(newPromptChain);
      promptChainElement.insertAdjacentElement('afterend', newPromptChainElement);
    });
  });
  promptChainActions.appendChild(promptChainDuplicateButton);

  const promptChainDeleteButton = document.createElement('button');
  promptChainDeleteButton.classList = 'btn flex justify-center gap-2 btn-dark border-0 md:border';
  promptChainDeleteButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
  promptChainDeleteButton.title = 'Excluir a Prompt Chain';
  promptChainDeleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (promptChainDeleteButton.title === 'Confirmar exclusão') {
      chrome.storage.local.get(['promptChains'], (result) => {
        const allPromptChains = result.promptChains || [];
        const index = allPromptChains.findIndex((chain) => chain.id === promptChain.id);
        allPromptChains.splice(index, 1);
        chrome.storage.local.set({ promptChains: allPromptChains });
      });
      promptChainElement.remove();
    } else {
      promptChainDeleteButton.title = 'Confirmar exclusão';
      promptChainDeleteButton.style.backgroundColor = '#864e6140';
      promptChainDeleteButton.style.color = '#ff4a4a';
      promptChainDeleteButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      setTimeout(() => {
        promptChainDeleteButton.title = 'Excluir';
        promptChainDeleteButton.style.backgroundColor = '';
        promptChainDeleteButton.style.color = '';
        promptChainDeleteButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
      }, 3000);
    }
  });
  promptChainActions.appendChild(promptChainDeleteButton);
  promptChainElement.appendChild(promptChainActions);
  return promptChainElement;
}
function promptChainListModalActions() {
  return settingsModalActions();
}
function createPromptChainStep(promptChain, stepIndex, isNew = false) {
  const promptRow = document.createElement('div');
  promptRow.style = 'width:100%;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;border-radius:4px;align-self:stretch;position:relative;';
  // create a textinput for each prompt and insert the prompt text in it
  const promptInputActionWrapper = document.createElement('div');
  promptInputActionWrapper.style = 'display:flex;flex-direction:column;align-items:center;justify-content:space-between;width:70px;min-height:144px;max-height:144px; border: 1px solid #565869;border-right:none;border-top-left-radius:4px;border-bottom-left-radius:4px;';
  if (!isNew) {
    const runFromHereButton = document.createElement('button');
    runFromHereButton.style = 'width: 100%; height: 48px; border: none;display:flex;align-items:center;justify-content:center; background-color: #2d2d3a; color: #eee; border-bottom: 1px solid #565869;border-top-left-radius:4px;';
    runFromHereButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    runFromHereButton.title = 'Executar nesta conversa';
    promptInputActionWrapper.appendChild(runFromHereButton);
    runFromHereButton.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('new-prompt-chain-modal-content')?.parentElement?.remove();
      document.getElementById('modal-close-button-prompt-chains')?.click();
      runPromptChain(promptChain, stepIndex, false);
    });
  }
  const deletePromptButton = document.createElement('button');
  deletePromptButton.style = `width: 100%; height: ${isNew ? '72px' : '48px'}; border: none;display:flex;align-items:center;justify-content:center; background-color: #2d2d3a; color: #eee; border-bottom: 1px solid #565869;border-top-left-radius:4px;`;
  deletePromptButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
  deletePromptButton.title = 'Excluir';
  deletePromptButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (deletePromptButton.title === 'Confirmar exclusão') {
      promptChain.splice(stepIndex, 1);
      promptRow.remove();
    } else {
      deletePromptButton.title = 'Confirmar exclusão';
      deletePromptButton.style.backgroundColor = '#864e6140';
      deletePromptButton.style.color = '#ff4a4a';
      deletePromptButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      setTimeout(() => {
        deletePromptButton.title = 'Excluir';
        deletePromptButton.style.backgroundColor = '#2d2d3a';
        deletePromptButton.style.color = '#eee';
        deletePromptButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
      }, 3000);
    }
  });
  promptInputActionWrapper.appendChild(deletePromptButton);
  const dragPromptButton = document.createElement('div');
  dragPromptButton.style = `width: 100%; height: ${isNew ? '72px' : '48px'}; display:flex;align-items:center;justify-content:center; border: none; background-color: #2d2d3a; color: #eee;border-bottom-left-radius:4px;cursor:grab;`;
  dragPromptButton.title = 'Arraste para reordenar';
  dragPromptButton.id = 'prompt-chain-drag-handle';
  dragPromptButton.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="2em" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 288zm0-128c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z"/></svg>';
  promptInputActionWrapper.appendChild(dragPromptButton);
  promptRow.appendChild(promptInputActionWrapper);

  const promptInput = document.createElement('textarea');
  promptInput.placeholder = 'Digite o texto do prompt. Dica: Use {{nome da variável}} para solicitar a entrada do usuário. Para pedir ao usuário para fazer upload de um arquivo, inicie seu prompt com {{files}} (apenas GPT-4)';
  promptInput.id = `prompt-chain-input-${stepIndex}`;
  promptInput.style = 'width: 100%; height: 144px; min-height: 144px; border-top-right-radius: 4px;border-bottom-right-radius: 4px; border: 1px solid #565869; background-color: #2d2d3a; color: #eee; padding: 4px 8px; font-size: 14px; resize: none;';
  promptInput.dir = 'auto';
  promptInput.value = promptChain[stepIndex];
  promptInput.addEventListener('input', () => {
    promptChain[stepIndex] = promptInput.value;
  });
  promptRow.appendChild(promptInput);

  const promptChainStepCount = document.createElement('div');
  promptChainStepCount.id = 'prompt-chain-step-count';
  promptChainStepCount.style = 'position:absolute;bottom:4px;right:10px;color:lightslategray;font-size:10px;';
  promptChainStepCount.innerHTML = `${stepIndex + 1} / ${promptChain.length}`;
  promptRow.appendChild(promptChainStepCount);

  return promptRow;
}
function createNewPromptChainModal(promptChainName, promptChainSteps, promptChainId) {
  const isNew = promptChainId === undefined;
  const newPromptChainModal = document.createElement('div');
  newPromptChainModal.style = 'position:fixed;top:0px;left:0px;width:100%;height:100%;;z-index:1000;display:flex;align-items:center;justify-content:center;z-index:10001;overflow-y: scroll; max-height: 100vh;';
  newPromptChainModal.classList = 'bg-black/50 dark:bg-gray-600/70';
  newPromptChainModal.id = 'new-prompt-chain-modal';
  newPromptChainModal.addEventListener('click', (e) => {
    if (e.target.id === 'new-prompt-chain-modal') {
      newPromptChainModal.remove();
    }
  });
  const newPromptChainModalContent = document.createElement('div');
  newPromptChainModalContent.style = 'width:700px;height:70vh;max-height:70vh;background-color:#0b0d0e;border-radius:8px;padding:16px 0;display:flex;flex-direction:column;align-items:start;justify-content:start;box-shadow: rgb(0 0 0 / 72%) 0px 0px 20px 0px;border: 1px solid #555;';
  newPromptChainModalContent.id = 'new-prompt-chain-modal-content';
  const modalTitle = document.createElement('div');
  modalTitle.style = 'display:flex; align-items:center; justify-content:space-between;color:white;font-size:1.25rem; font-weight: bold; margin-bottom: 16px;padding: 0 16px;width:100%;';
  modalTitle.innerHTML = `${isNew ? '<span>Criar nova Prompt Chain</span>' : '<span>Editar a Prompt Chain</span>'} <button class="btn flex justify-center gap-2 btn-primary border-0 md:border" id="see-all-prompt-chains" style="margin:0 8px;">Ver todas as Prompt Chains</button>`;
  newPromptChainModalContent.appendChild(modalTitle);
  const modalSubtitle = document.createElement('div');
  modalSubtitle.style = 'color:lightslategray;font-size:0.875rem; margin-bottom: 16px;padding: 0 16px;';
  modalSubtitle.innerHTML = 'Cadeias de prompt (Prompt Chains) são compostas por uma série de prompts que são executados automaticamente em sequência. Você pode criar uma nova cadeia de prompt a partir de qualquer conversa existente. Você pode adicionar, remover, editar ou reordenar os elementos (Prompts) nas Prompt Chains.';
  newPromptChainModalContent.appendChild(modalSubtitle);
  const promptInputListWrapper = document.createElement('div');
  promptInputListWrapper.id = 'prompt-chain-input-list-wrapper';
  promptInputListWrapper.style = 'width:100%;display:flex;flex-direction:column;align-items:start;justify-content:start;overflow-y: scroll;padding: 0 16px;scrollBehavior: smooth;';

  const promptInputNameInput = document.createElement('input');
  promptInputNameInput.id = 'prompt-chain-name-input';
  promptInputNameInput.style = 'width: calc(100% - 40px); min-height: 40px; border-radius: 4px; border: 1px solid #565869; background-color: #2d2d3a; color: #eee; padding: 4px 8px; font-size: 14px; margin: 0 24px 16px 16px;';
  promptInputNameInput.placeholder = 'Nome da Prompt Chain ';
  promptInputNameInput.value = promptChainName;
  promptInputNameInput.addEventListener('input', () => {
    promptInputNameInput.style.border = '1px solid #565869';
    promptChainName = promptInputNameInput.value;
  });
  newPromptChainModalContent.appendChild(promptInputNameInput);

  promptChainSteps.forEach((_prompt, stepIndex) => {
    const promptRow = createPromptChainStep(promptChainSteps, stepIndex, isNew);
    promptInputListWrapper.appendChild(promptRow);
  });
  // modal action wrapper
  const sortable = Sortable.create(promptInputListWrapper, {
    handle: '#prompt-chain-drag-handle',
    multiDrag: true,
    direction: 'vertical',
    selectedClass: 'multi-drag-selected',
  });
  newPromptChainModalContent.appendChild(promptInputListWrapper);

  const newPromptChainModalActionWrapper = document.createElement('div');
  newPromptChainModalActionWrapper.style = 'display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:auto;padding:0 16px;';
  newPromptChainModalContent.appendChild(newPromptChainModalActionWrapper);
  const leftSection = document.createElement('div');
  leftSection.style = 'display:flex;align-items:center;justify-content:flex-start;';
  newPromptChainModalActionWrapper.appendChild(leftSection);

  const addStepButton = document.createElement('button');
  addStepButton.classList = 'btn flex justify-center gap-2 btn-primary border-0 md:border';
  addStepButton.style = 'margin-top:16px;';
  addStepButton.id = 'prompt-chain-add-step-button';
  addStepButton.textContent = '+ Adicionar Prompt';
  addStepButton.addEventListener('click', () => {
    promptChainSteps.push('');
    const promptRow = createPromptChainStep(promptChainSteps, promptChainSteps.length - 1, isNew);
    const curPromptInputListWrapper = document.getElementById('prompt-chain-input-list-wrapper');
    curPromptInputListWrapper.appendChild(promptRow);
    promptRow.scrollIntoView({ behavior: 'smooth', block: 'end' });
    setTimeout(() => {
      promptRow.querySelector('textarea').focus();
    }, 500);
  });
  leftSection.appendChild(addStepButton);
  const rightSection = document.createElement('div');
  rightSection.style = 'display:flex;align-items:center;justify-content:flex-end;';
  newPromptChainModalActionWrapper.appendChild(rightSection);
  // add cancel button
  const cancelButton = document.createElement('button');
  cancelButton.classList = 'btn flex justify-center gap-2 btn-dark border-0 md:border mr-2';
  cancelButton.style = 'margin-top:16px;margin-left:8px;';
  cancelButton.textContent = 'Cancelar';
  cancelButton.id = 'prompt-chain-cancel-button';
  cancelButton.addEventListener('click', () => {
    newPromptChainModal.remove();
  });
  rightSection.appendChild(cancelButton);

  // add submit button
  const submitButton = document.createElement('button');
  submitButton.classList = 'btn flex justify-center gap-2 btn-primary border-0 md:border';
  submitButton.style = 'margin-top:16px;margin-left:8px;margin-right:8px;';
  submitButton.id = 'prompt-chain-submit-button';
  submitButton.textContent = isNew ? 'Salvar a Prompt Chain' : 'Atualizar Prompt Chain';
  submitButton.addEventListener('click', () => {
    if (!promptChainName) {
      const curPromptInputNameInput = document.getElementById('prompt-chain-name-input');
      curPromptInputNameInput.focus();
      curPromptInputNameInput.style.border = '1px solid #ff4a4a';
      toast('Digite um nome para a Prompt Chain', 'error');
      return;
    }
    chrome.storage.local.get(['promptChains'], (res) => {
      const allPromptChains = res.promptChains || [];
      const nonEmptySteps = [];
      document.querySelectorAll('[id^=prompt-chain-input-]').forEach((step) => {
        if (step.value) nonEmptySteps.push(step.value);
      });
      if (nonEmptySteps.length === 0) {
        toast('É necessário incluir ao menos um componente à cadeia de prompt.', 'error');
        return;
      }
      if (isNew) {
        // add to the beginning of the array
        const id = self.crypto.randomUUID();

        allPromptChains.unshift({ id, title: promptChainName, steps: nonEmptySteps });
      } else {
        const promptChainIndex = allPromptChains.findIndex((chain) => chain.id === promptChainId);
        allPromptChains[promptChainIndex] = { id: promptChainId, title: promptChainName, steps: nonEmptySteps };
      }
      chrome.storage.local.set({ promptChains: allPromptChains }, () => {
        const modalBodyPromptChains = document.getElementById('modal-body-prompt-chains');
        if (modalBodyPromptChains) {
          modalBodyPromptChains.innerHTML = '';
          const newContent = promptChainListModalContent();
          modalBodyPromptChains.appendChild(newContent);
        }
      });
      newPromptChainModal.remove();
      toast(`A Prompt Chain foi ${isNew ? 'saved' : 'updated'}!`);
    });
  });
  rightSection.appendChild(submitButton);

  newPromptChainModal.appendChild(newPromptChainModalContent);
  document.body.appendChild(newPromptChainModal);

  // observe promptInputListWrapper for changes and add step count/total to each prompt
  const curPromptInputListWrapper = document.getElementById('prompt-chain-input-list-wrapper');
  const observer = new MutationObserver(() => {
    const promptRows = curPromptInputListWrapper.childNodes;
    promptRows.forEach((row, i) => {
      const stepCount = i + 1;
      const promptCount = promptRows.length;
      const promptCountElement = row.querySelector('#prompt-chain-step-count');
      if (promptCountElement) promptCountElement.innerHTML = `${stepCount} / ${promptCount}`;
    });
  });
  observer.observe(curPromptInputListWrapper, { childList: true });
}

function addPromptChainCreateButton() {
  const existingPromptChainCreateButton = document.getElementById('prompt-chain-create-button');

  const textAreaElement = document.querySelector('#prompt-textarea');
  if (!textAreaElement) {
    if (existingPromptChainCreateButton) existingPromptChainCreateButton.remove();
    return;
  }
  if (existingPromptChainCreateButton) return;

  const promptChainCreateButton = document.createElement('button');
  promptChainCreateButton.id = 'prompt-chain-create-button';
  promptChainCreateButton.title = 'Criar nova Prompt Chain (CMD/CTRL + SHIFT + C)';
  promptChainCreateButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" fill="currentColor"><path d="M72 48C85.25 48 96 58.75 96 72V120C96 133.3 85.25 144 72 144V232H128C128 218.7 138.7 208 152 208H200C213.3 208 224 218.7 224 232V280C224 293.3 213.3 304 200 304H152C138.7 304 128 293.3 128 280H72V384C72 388.4 75.58 392 80 392H128C128 378.7 138.7 368 152 368H200C213.3 368 224 378.7 224 392V440C224 453.3 213.3 464 200 464H152C138.7 464 128 453.3 128 440H80C49.07 440 24 414.9 24 384V144C10.75 144 0 133.3 0 120V72C0 58.75 10.75 48 24 48H72zM160 96C160 82.75 170.7 72 184 72H488C501.3 72 512 82.75 512 96C512 109.3 501.3 120 488 120H184C170.7 120 160 109.3 160 96zM288 256C288 242.7 298.7 232 312 232H488C501.3 232 512 242.7 512 256C512 269.3 501.3 280 488 280H312C298.7 280 288 269.3 288 256zM288 416C288 402.7 298.7 392 312 392H488C501.3 392 512 402.7 512 416C512 429.3 501.3 440 488 440H312C298.7 440 288 429.3 288 416z"/></svg>';
  promptChainCreateButton.classList = 'relative flex items-center justify-center border border-token-border-light text-token-text-secondary bg-token-main-surface-primary hover:text-token-text-primary  text-xs font-sans cursor-pointer rounded-md z-10';
  promptChainCreateButton.style = 'margin-bottom: 1rem;right: 0;width: 2rem;height: 2rem;flex-wrap:wrap;';
  const plusIcon = document.createElement('div');
  plusIcon.classList = 'border border-token-border-light text-token-text-secondary hover:text-token-text-primary bg-token-main-surface-primary';
  plusIcon.style = 'width: 1rem;height: 1rem;border-radius: 50%;position: absolute;top: 0;right: 0;transform: translate(50%, -50%);';
  plusIcon.textContent = '+';
  promptChainCreateButton.appendChild(plusIcon);
  promptChainCreateButton.addEventListener('click', (e) => {
    // if shift key is  pressed
    if (e.shiftKey) {
      // open prompt chain list modal
      createPromptChainListModal();
      return;
    }
    // get all visible user messages
    const allUserMessageWrappers = document.querySelectorAll('[id^="message-wrapper-"][data-role="user"]');
    const allUserMessages = [];
    allUserMessageWrappers.forEach((userMessageWrapper) => {
      const userMessage = userMessageWrapper.querySelector('[id^="message-text-"]');
      if (userMessage) allUserMessages.push(userMessage.textContent);
    });
    const promptChainName = document.querySelector('[id^="conversation-top-title"]')?.textContent || '';
    createNewPromptChainModal(promptChainName, allUserMessages.length > 0 ? allUserMessages : ['']);
    addNewPromptModalEventListener();
  });
  const scrollUpButton = document.getElementById('scroll-up-button');
  if (scrollUpButton) {
    // add right before scrollUpButton
    scrollUpButton.insertAdjacentElement('beforebegin', promptChainCreateButton);
  }
}
function addNewPromptModalEventListener() {
  const seeAllPromptsButton = document.getElementById('see-all-prompt-chains');
  seeAllPromptsButton.addEventListener('click', () => {
    const newPromptChainModal = document.getElementById('new-prompt-chain-modal');
    newPromptChainModal.remove();
    const existingPromptChainListModal = document.getElementById('modal-prompt-chains');
    if (existingPromptChainListModal) return;
    createPromptChainListModal();
  });
}
function runPromptChain(promptChainSteps, initialStep = 0, newChat = true) {
  if (newChat) {
    document.querySelector('[id="new-chat-button"]').click();
    // wait for new chat to open
    setTimeout(() => {
      runPromptChain(promptChainSteps, initialStep, false);
    }, 1000);
    return;
  }
  const textAreaElement = document.querySelector('#prompt-textarea');
  const submitButtonElement = document.querySelector('[data-testid="send-button"]');
  // eslint-disable-next-line prefer-destructuring
  textAreaElement.value = promptChainSteps[initialStep];
  runningPromptChainSteps = promptChainSteps;
  runningPromptChainStepIndex = initialStep;
  // add prompt chain step counter
  const existingRunningPromptChainStepCount = document.getElementById('running-prompt-chain-step-count');
  if (existingRunningPromptChainStepCount) existingRunningPromptChainStepCount.remove();
  const runningPromptChainStepCount = document.createElement('div');
  runningPromptChainStepCount.id = 'running-prompt-chain-step-count';
  runningPromptChainStepCount.style = 'position:absolute;top:-18px;right:16px;color:lightslategray;font-size:10px;';
  runningPromptChainStepCount.innerHTML = `Executando os elementos Prompt Chain: ${runningPromptChainStepIndex + 1} / ${runningPromptChainSteps.length}`;
  textAreaElement.parentNode.appendChild(runningPromptChainStepCount);

  textAreaElement.focus();
  textAreaElement.dispatchEvent(new Event('input', { bubbles: true }));
  textAreaElement.dispatchEvent(new Event('change', { bubbles: true }));
  setTimeout(() => {
    submitButtonElement.click();
  }, 300);
}
function insertNextChain(promptChainSteps, promptChainStepIndex) {
  const textAreaElement = document.querySelector('#prompt-textarea');
  const submitButtonElement = document.querySelector('[data-testid="send-button"]');
  textAreaElement.value = promptChainSteps[promptChainStepIndex];
  // update prompt chain step counter
  const runningPromptChainStepCount = document.getElementById('running-prompt-chain-step-count');
  if (runningPromptChainStepCount) runningPromptChainStepCount.innerHTML = `Executando os elementos da Prompt Chain: ${promptChainStepIndex + 1} / ${promptChainSteps.length}`;

  runningPromptChainSteps = promptChainSteps;
  runningPromptChainStepIndex = promptChainStepIndex;
  textAreaElement.focus();
  textAreaElement.dispatchEvent(new Event('input', { bubbles: true }));
  textAreaElement.dispatchEvent(new Event('change', { bubbles: true }));
  setTimeout(() => {
    submitButtonElement.click();
  }, 300);
}
function addMissingIds() {
  chrome.storage.local.get(['promptChains'], (result) => {
    const allPromptChains = result.promptChains || [];
    const updatedPromptChains = allPromptChains.map((chain) => {
      if (!chain.id) chain.id = self.crypto.randomUUID();
      return chain;
    });
    chrome.storage.local.set({ promptChains: updatedPromptChains });
  });
}
function initializePromptChain() {
  addMissingIds();
  chrome.storage.local.get(['settings'], (result) => {
    const settings = result.settings || {};
    if (settings?.showPromptChainButton || typeof settings?.showPromptChainButton === 'undefined') {
      const observer = new MutationObserver(() => {
        addPromptChainCreateButton();
      });
      const main = document.querySelector('main');
      observer.observe(main, {
        childList: true,
        subtree: true,
      });
    }
  });
}
