// eslint-disable-next-line no-unused-vars
/* global isGenerating, chatStreamIsClosed:true */
function toggleStopGeneratingResponseButton(skipIsGenerating) {
  const textAreaElement = document.querySelector('#prompt-textarea');
  if (!textAreaElement) return;
  const submitButton = document.querySelector('#prompt-textarea ~ button');
  if (!submitButton) return;

  const existingStopGeneratingResponseButton = document.querySelector('#stop-generating-response-button');
  if (existingStopGeneratingResponseButton && !isGenerating) {
    existingStopGeneratingResponseButton.remove();
    return;
  }
  if (existingStopGeneratingResponseButton) return;
  if (!skipIsGenerating) {
    if (!isGenerating) return;
  }
  const newStopGeneratingResponseButton = document.createElement('button');
  newStopGeneratingResponseButton.id = 'stop-generating-response-button';
  newStopGeneratingResponseButton.type = 'button';
  newStopGeneratingResponseButton.classList = 'btn flex justify-center gap-2 btn-neutral border';
  newStopGeneratingResponseButton.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>Stop generating';
  newStopGeneratingResponseButton.addEventListener('click', () => {
    chatStreamIsClosed = true;
    newStopGeneratingResponseButton.remove();
  });

  const inputFormActionWrapper = document.querySelector('#input-form-action-wrapper');
  inputFormActionWrapper?.appendChild(newStopGeneratingResponseButton);
}

// eslint-disable-next-line no-unused-vars
function initializeStopGeneratingResponseButton(skipIsGenerating) {
  toggleStopGeneratingResponseButton(skipIsGenerating);
}
