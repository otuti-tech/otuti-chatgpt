/* global createModal, highlightBracket */
// eslint-disable-next-line no-unused-vars
function createTemplateWordsModal(templateWords) {
  const uniqueTemplateWords = [...new Set(templateWords)];
  const bodyContent = templateWordsModalContent(uniqueTemplateWords);
  const actionsBarContent = templateWordsModalActions(uniqueTemplateWords);
  createModal('Template words', 'Please replace the template words', bodyContent, actionsBarContent, true);
}

function templateWordsModalContent(templateWords) {
  // create releaseNote modal content
  const content = document.createElement('div');
  content.id = 'modal-content-template-words';
  content.style = 'position:relative;margin: 16px';
  const textAreaElement = document.querySelector('#prompt-textarea');

  const promptPreviewTitle = document.createElement('div');
  promptPreviewTitle.style = 'width: 100%;color:white;text-transform: capitalize;margin-bottom: 8px; font-size: 20px; font-weight: bold; color: #bbb;';
  promptPreviewTitle.innerHTML = 'Prompt preview';
  content.appendChild(promptPreviewTitle);

  const promptPreview = document.createElement('div');
  promptPreview.style = 'width: 100%; margin-bottom: 16px; padding: 0 8px;';
  promptPreview.innerHTML = highlightBracket(textAreaElement.value);

  content.appendChild(promptPreview);

  templateWords.forEach((templateWord, index) => {
    const templateWordDiv = document.createElement('div');
    templateWordDiv.id = `template-word-row-${index}`;
    templateWordDiv.style = 'display: flex; flex-wrap:wrap;justify-content: space-between; align-items: center;width: 100%; margin-bottom: 12px;';
    const templateWordLabel = document.createElement('label');
    templateWordLabel.style = 'width: 100%;color:white;text-transform: capitalize;margin-bottom: 8px;';
    // remove the {{ curly }} braces
    templateWordLabel.innerHTML = templateWord.replace(/{{|}}/g, '');
    const templateWordInput = document.createElement('textarea');
    templateWordInput.style = 'width: 100%; height: 100px; min-height: 100px; border-radius: 4px; border: 1px solid #565869; background-color: #1e1e2f; color: #eee; padding: 4px 8px; font-size: 14px;margin-right: 8px;';
    templateWordInput.id = `template-input-${templateWord}`;
    templateWordDiv.appendChild(templateWordLabel);
    templateWordDiv.appendChild(templateWordInput);
    content.appendChild(templateWordDiv);
  });

  return content;
}

function templateWordsModalActions(templateWords) {
  // add actionbar at the bottom of the content
  const actionBar = document.createElement('div');
  actionBar.style = 'display: flex; flex-wrap:wrap;justify-content: end; align-items: center;width: 100%; font-size: 12px;';
  const submitButton = document.createElement('button');
  submitButton.style = 'background-color: #565869; color: #eee; border: 1px solid #565869; border-radius: 4px; padding: 4px 8px; margin: 8px 0; width: 60px; height: 30px;';
  submitButton.innerHTML = 'Submit';
  submitButton.id = 'modal-submit-button';

  submitButton.addEventListener('click', (e) => {
    const textAreaElement = document.querySelector('#prompt-textarea');
    // replace template words in text area value with the input values associated with them
    let newValue = textAreaElement.value;
    templateWords.forEach((templateWord) => {
      const templateWordInput = document.getElementById(`template-input-${templateWord}`);
      const templateWordInputValue = templateWordInput.value;
      newValue = newValue.replace(templateWord, templateWordInputValue);
    });
    textAreaElement.value = newValue;
    const closeButton = document.querySelector('#modal-close-button-template-words');
    if (closeButton) {
      closeButton.click();
    }
    if (!e.shiftKey) {
      const chatSubmitButton = document.querySelector('#prompt-textarea ~ button');
      chatSubmitButton.click();
    }
  });
  actionBar.appendChild(submitButton);
  return actionBar;
}
