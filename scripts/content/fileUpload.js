/* global toast, arkoseTrigger, isGenerating, createFileInServer, isDescendant, uploadFileAPI, uploadedAPI, getThumbnail */
// eslint-disable-next-line no-unused-vars
let curImageAssets = [];
let curFileAttachments = [];
function removeUploadFileButton() {
  const inputForm = document.querySelector('#prompt-input-form');
  const textAreaElement = document.querySelector('#prompt-textarea');
  // button with aria-lable =Attach files
  // find an svg with path d = M19 13H5v-2h14v2z
  const paperclipIcon = inputForm?.querySelector('svg path[d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.4477 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z"]')?.parentElement;
  // go up to parent until you find the button
  if (paperclipIcon) paperclipIcon.parentElement?.parentElement?.remove();
  if (textAreaElement) {
    textAreaElement.classList = 'm-0 w-full resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:py-3.5 md:pr-12 placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4';
  }
}
// eslint-disable-next-line no-unused-vars
function addPageDragAndDropEventListener() {
  const presentation = document.querySelector('main > div[role=presentation]');
  presentation.addEventListener('dragenter', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isGPT4 = document.querySelector('#navbar-selected-model-title')?.innerText?.toLowerCase()?.includes('gpt-4');
    // #gizmo-menu-wrapper-navbar
    const isGizmo = document.querySelector('#gizmo-menu-wrapper-navbar');
    if (presentation.lastChild.id === 'drag-and-drop-overlay') return;
    if (presentation.lastChild.textContent.includes('Add anything')) {
      presentation.lastChild.remove();
    }
    if (!isGPT4 && !isGizmo) return;
    presentation.insertAdjacentHTML('beforeend', dragAndDropOverlay());
  });
  presentation.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    // if not hovering over the drag and drop overlay

    if (e.target.id !== 'drag-and-drop-overlay') return;
    if (isDescendant(presentation, e.relatedTarget)) return;
    if (presentation.lastChild.innerText.includes('Add anything')) {
      presentation.lastChild.remove();
    }
  });
  presentation.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const isGPT4 = document.querySelector('#navbar-selected-model-title')?.innerText?.toLowerCase()?.includes('gpt-4');
    const isGizmo = document.querySelector('#gizmo-menu-wrapper-navbar');

    if (!isGPT4 && !isGizmo) return;

    if (presentation.lastChild.innerText.includes('Add anything')) {
      presentation.lastChild.remove();
    }
    const { files } = e.dataTransfer;
    if (!files || files.length === 0) return;
    fileChangeHandler(files);
  });
}
function addUploadFileButton() {
  chrome.storage.local.get(['selectedModel'], (result) => {
    const textAreaElement = document.querySelector('#prompt-textarea');
    if (!textAreaElement) return;
    removeUploadFileButton();

    if (result?.selectedModel?.tags?.includes('gpt4')) {
      const uploadButton = '<div class="absolute bottom-2 md:bottom-3 left-2 md:left-4"><div class="flex"><button id="upload-file-button" class="btn relative p-0 text-black dark:text-white" aria-label="Attach files"><div class="flex w-full gap-2 items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 7C9 4.23858 11.2386 2 14 2C16.7614 2 19 4.23858 19 7V15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15V9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9V15C7 17.7614 9.23858 20 12 20C14.7614 20 17 17.7614 17 15V7C17 5.34315 15.6569 4 14 4C12.3431 4 11 5.34315 11 7V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 13.4477 8 14 8C14.5523 8 15 8.44772 15 9V15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15V7Z" fill="currentColor"></path></svg></div></button><input multiple="" type="file" tabindex="-1" class="hidden" style="display: none;"></div></div>';
      // inset upload button right after textareaelement
      textAreaElement.insertAdjacentHTML('afterend', uploadButton);
      textAreaElement.classList = 'm-0 w-full resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:py-3.5 md:pr-12 placeholder-black/50 dark:placeholder-white/50 pl-10 md:pl-[55px]';
      addUploadFileButtonEventListener();
    }
  });
}
function addUploadFileButtonEventListener() {
  const uploadFileButton = document.querySelector('#upload-file-button');
  if (!uploadFileButton) return;
  const fileInput = uploadFileButton.parentElement.querySelector('input[type="file"]');
  if (!fileInput) return;

  // <div id="file-upload-spinner" class="absolute inset-0 flex items-center justify-center bg-black/5 text-white"><svg class="spinner"> <circle cx="20" cy="20" r="18"></circle> </svg></div>
  fileInput.addEventListener('change', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.target;

    fileChangeHandler(files);
  });
  uploadFileButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const curFileInput = uploadFileButton.parentElement.querySelector('input[type="file"]');
    curFileInput?.click();
  });
}
function fileChangeHandler(files) {
  const uploadLimit = 10;
  if (!files || files.length === 0) return;
  const existingFileElements = document.querySelectorAll('[id^=file-element-]');
  if (files.length + existingFileElements.length > uploadLimit) {
    toast(`Too many files uploaded. Maximum number of files at a time is ${uploadLimit}`, 'error');
    return;
  }
  if (existingFileElements.length === 0) {
    arkoseTrigger();
  }
  const textAreaElement = document.querySelector('#prompt-textarea');
  const existingFileWrapperElement = textAreaElement.parentElement.querySelector('#file-wrapper-element');
  if (!existingFileWrapperElement) {
    curImageAssets = [];
    curFileAttachments = [];
    const fileWrapperElement = '<div id="file-wrapper-element" class="mx-2 mt-2 flex flex-wrap gap-2 px-2.5 md:pl-0 md:pr-4"></div>';
    textAreaElement.insertAdjacentHTML('beforebegin', fileWrapperElement);
  }
  // disable submit button
  const submitButton = document.querySelector('[data-testid="send-button"]');
  if (!isGenerating) {
    submitButton.disabled = true;
  }
  // disable submit event in textareaElement
  textAreaElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const fileType = getFileType(file.name);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // eslint-disable-next-line no-loop-func
    reader.onload = () => {
      const dataUrl = reader.result;
      const isImage = fileType === 'Image';
      // add the file right before the textarea
      // eslint-disable-next-line no-restricted-globals
      const uuid = self.crypto.randomUUID();
      const fileElementHTML = isImage
        ? `<div id="file-element-${i + existingFileElements.length}" data-uuid=${uuid} class="group relative inline-block text-sm text-token-text-primary"><div class="relative overflow-hidden rounded-xl"><div class="h-14 w-14"><button type="button" id="full-size-file-button-${i + existingFileElements.length}" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r2c:" data-state="closed" class="h-full w-full"><span class="flex items-center h-full w-full justify-center bg-token-main-surface-secondary bg-cover bg-center text-white" style="background-image: url(&quot;${dataUrl}&quot;);"></span></button></div></div><button id="remove-file-button-${i + existingFileElements.length}" class="absolute right-1 top-1 -translate-y-1/2 translate-x-1/2 rounded-full bg-token-main-surface-secondary p-0.5 text-token-text-primary transition-colors hover:opacity-100 group-hover:opacity-100 md:opacity-0"><span class="" data-state="closed"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span></button><div id="file-upload-spinner-${i}" class="absolute inset-0 flex items-center justify-center bg-black/50 text-white"><svg x="0" y="0" viewbox="0 0 40 40" class="spinner"><circle fill="transparent" stroke="#ffffff50" stroke-width="4" stroke-linecap="round" stroke-dasharray="125.6" cx="20" cy="20" r="18"></circle></svg></div></div>`
        : `<div id="file-element-${i + existingFileElements.length}" data-uuid=${uuid} class="group relative inline-block text-sm text-token-text-primary"><div class="relative overflow-hidden rounded-xl"><div class="p-2 bg-token-main-surface-secondary w-60"><div class="flex flex-row items-center gap-2"><div class="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">${getThumbnail(fileType)}</div><div class="overflow-hidden"><div class="truncate font-medium">${file.name}</div><div class="truncate text-token-text-secondary">${fileType}</div></div></div></div></div><button id="remove-file-button-${i + existingFileElements.length}" class="absolute right-1 top-1 -translate-y-1/2 translate-x-1/2 rounded-full border border-token-border-light p-0.5 text-token-text-primary transition-colors bg-token-main-surface-secondary hover:opacity-100 group-hover:opacity-100 md:opacity-0"><span class="" data-state="closed"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span></button><div id="file-upload-spinner-${i}" class="absolute inset-0 flex items-center justify-center bg-black/50 text-white"><svg x="0" y="0" viewbox="0 0 40 40" class="spinner"><circle fill="transparent" stroke="#ffffff50" stroke-width="4" stroke-linecap="round" stroke-dasharray="125.6" cx="20" cy="20" r="18"></circle></svg></div></div>`;
      const fileWrapperElement = textAreaElement.parentElement.querySelector('#file-wrapper-element');
      if (!fileWrapperElement) return;
      fileWrapperElement.insertAdjacentHTML('beforeend', fileElementHTML);
      addFileWrapperEventListener(i + existingFileElements.length, dataUrl, uploadLimit);
      const useCase = fileType === 'Image' ? 'multimodal' : ['Spreadsheet'].includes(fileType) ? 'ace_upload' : 'my_files';
      createFileInServer(file, useCase).then((result) => {
        if (fileWrapperElement.children.length === uploadLimit) {
          removeUploadFileButton();
        }
        if (result.status === 'success') {
          uploadFileAPI(result.file_id, result.upload_url, file).then(async () => {
            uploadedAPI(result.file_id).then(() => {
              if (fileType === 'Image') {
                const img = new Image();
                img.src = dataUrl;
                img.onload = () => {
                  curImageAssets.push({
                    content_type: 'image_asset_pointer',
                    asset_pointer: `file-service://${result.file_id}`,
                    height: img.height,
                    width: img.width,
                    size_bytes: file.size,
                    uuid,
                  });
                  curFileAttachments.push({
                    id: result.file_id,
                    name: file.name,
                    size_bytes: file.size,
                    mimeType: file.type,
                    height: img.height,
                    width: img.width,
                    uuid,
                  });
                };
              } else {
                curFileAttachments.push({
                  id: result.file_id,
                  name: file.name,
                  size_bytes: file.size,
                  mimeType: file.type,
                  uuid,
                });
              }

              // remove spinner
              const spinner = document.querySelectorAll(`#file-upload-spinner-${i}`);
              spinner.forEach((s) => s.remove());

              // get all remaining spinners
              const spinners = document.querySelectorAll('[id^=file-upload-spinner-]');
              if (spinners.length === 0) {
                submitButton.disabled = false;
              }

              // remove all {{files}}
              if (textAreaElement.value.includes('{{files}}')) {
                // replace all {{files}} with ''
                textAreaElement.value = textAreaElement.value.replaceAll('{{files}}', '');
              }
            });
          }, () => {
            toast(`Unable to upload ${file.name}`, 'error');
            // remove file element
            const fileElement = fileWrapperElement.querySelector(`#file-element-${i + existingFileElements.length}`);
            fileElement.remove();
          });
        }
      });
    };
  }
}
function addFileWrapperEventListener(i, dataUrl, uploadLimit) {
  const inputForm = document.querySelector('#prompt-input-form');
  const fileWrapperElement = inputForm.querySelector('#file-wrapper-element');
  if (!fileWrapperElement) return;
  const fullSizeFileButton = fileWrapperElement.querySelector(`#full-size-file-button-${i}`);
  if (fullSizeFileButton) {
    fullSizeFileButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // show the content of fullSizeFileButton in full screen
      createFullSizeFileWrapper(dataUrl);
    });
  }
  const removeButton = fileWrapperElement.querySelector(`#remove-file-button-${i}`);
  if (removeButton) {
    removeButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const fileElement = fileWrapperElement.querySelector(`#file-element-${i}`);
      if (!fileElement) return;
      fileElement.remove();
      if (fileWrapperElement.children.length === 0) {
        fileWrapperElement.remove();
        curImageAssets = [];
        curFileAttachments = [];
        const textAreaElement = document.querySelector('#prompt-textarea');
        const submitButton = document.querySelector('[data-testid="send-button"]');
        if (textAreaElement.value.length === 0 && !isGenerating) {
          submitButton.disabled = true;
        }
      }
      if (fileWrapperElement.children.length < uploadLimit && !inputForm.querySelector('#upload-file-button')) {
        addUploadFileButton();
      }
      // remove the file from curImageAssets and curFileAttachments
      const { uuid } = fileElement.dataset;
      const fileIndex = curFileAttachments.findIndex((file) => file.uuid === uuid);
      if (fileIndex !== -1) {
        curFileAttachments.splice(fileIndex, 1);
      }
      const imageIndex = curImageAssets.findIndex((image) => image.uuid === uuid);
      if (imageIndex !== -1) {
        curImageAssets.splice(imageIndex, 1);
      }
    });
  }
}
function createFullSizeFileWrapper(src) {
  const fullSizeFileWrapper = `<div id="full-size-file-wrapper" data-state="open" class="fixed inset-0 flex items-center justify-center overflow-hidden bg-black/90 radix-state-open:animate-show dark:bg-black/80" style="pointer-events: auto;"><button id="full-size-file-wrapper-close-button" class="absolute right-4 top-4 text-gray-50 transition hover:text-gray-200" type="button" data-aria-hidden="true" aria-hidden="true"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button><div id="full-size-file-wrapper-file" role="dialog" id="radix-:r2r:" aria-describedby="radix-:r2t:" aria-labelledby="radix-:r2s:" data-state="open" class="relative max-h-[85vh] max-w-[90vw] shadow-xl focus:outline-none radix-state-open:animate-contentShow" tabindex="-1" style="aspect-ratio: 1 / 1; pointer-events: auto;"><img src="${src}" alt="User uploaded image" class="h-full w-full object-contain"></div></div>`;
  // add to end of body
  document.body.insertAdjacentHTML('beforeend', fullSizeFileWrapper);
  addFullSizeFileWrapperEventListener();
}
function addFullSizeFileWrapperEventListener() {
  const fullSizeFileWrapper = document.querySelector('#full-size-file-wrapper');
  if (!fullSizeFileWrapper) return;
  const closeButton = fullSizeFileWrapper.querySelector('#full-size-file-wrapper-close-button');
  if (!closeButton) return;
  closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    fullSizeFileWrapper.remove();
  });
  // close outside image close too
  fullSizeFileWrapper.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const fullSizeFileWrapperFile = fullSizeFileWrapper.querySelector('#full-size-file-wrapper-file');
    if (fullSizeFileWrapperFile && fullSizeFileWrapperFile.contains(e.target)) return;
    fullSizeFileWrapper.remove();
  });
}

function getFileType(fileName) {
  switch (fileName?.split('.').pop()) {
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return 'Image';
    case 'pdf':
      return 'PDF';
    case 'doc':
    case 'docx':
    case 'txt':
      return 'Document';
    case 'csv':
    case 'xls':
    case 'xlsx':
      return 'Spreadsheet';
    case 'js':
      return 'JavaScript';
    case 'py':
      return 'Python';
    default:
      return 'File';
  }
}

function dragAndDropOverlay() {
  return '<div id="drag-and-drop-overlay" class="absolute inset-0 opacity-80 flex gap-2 flex-col justify-center items-center bg-token-main-surface-secondary dark:text-gray-100" style="z-index:1000000;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 132 108" fill="none" width="132" height="108"><g clip-path="url(#clip0_3605_64419)"><path fill-rule="evenodd" clip-rule="evenodd" d="M25.2025 29.3514C10.778 33.2165 8.51524 37.1357 11.8281 49.4995L13.4846 55.6814C16.7975 68.0453 20.7166 70.308 35.1411 66.443L43.3837 64.2344C57.8082 60.3694 60.0709 56.4502 56.758 44.0864L55.1016 37.9044C51.7887 25.5406 47.8695 23.2778 33.445 27.1428L29.3237 28.2471L25.2025 29.3514ZM18.1944 42.7244C18.8572 41.5764 20.325 41.1831 21.4729 41.8459L27.3517 45.24C28.4996 45.9027 28.8929 47.3706 28.2301 48.5185L24.836 54.3972C24.1733 55.5451 22.7054 55.9384 21.5575 55.2757C20.4096 54.613 20.0163 53.1451 20.6791 51.9972L22.8732 48.1969L19.0729 46.0028C17.925 45.3401 17.5317 43.8723 18.1944 42.7244ZM29.4091 56.3843C29.066 55.104 29.8258 53.7879 31.1062 53.4449L40.3791 50.9602C41.6594 50.6172 42.9754 51.377 43.3184 52.6573C43.6615 53.9376 42.9017 55.2536 41.6214 55.5967L32.3485 58.0813C31.0682 58.4244 29.7522 57.6646 29.4091 56.3843Z" fill="#AFC1FF"></path></g><g clip-path="url(#clip1_3605_64419)"><path fill-rule="evenodd" clip-rule="evenodd" d="M86.8124 13.4036C81.0973 11.8722 78.5673 13.2649 77.0144 19.0603L68.7322 49.97C67.1793 55.7656 68.5935 58.2151 74.4696 59.7895L97.4908 65.958C103.367 67.5326 105.816 66.1184 107.406 60.1848L115.393 30.379C115.536 29.8456 115.217 29.2959 114.681 29.16C113.478 28.8544 112.435 28.6195 111.542 28.4183C106.243 27.2253 106.22 27.2201 109.449 20.7159C109.73 20.1507 109.426 19.4638 108.816 19.3004L86.8124 13.4036ZM87.2582 28.4311C86.234 28.1567 85.1812 28.7645 84.9067 29.7888C84.6323 30.813 85.2401 31.8658 86.2644 32.1403L101.101 36.1158C102.125 36.3902 103.178 35.7824 103.453 34.7581C103.727 33.7339 103.119 32.681 102.095 32.4066L87.2582 28.4311ZM82.9189 37.2074C83.1934 36.1831 84.2462 35.5753 85.2704 35.8497L100.107 39.8252C101.131 40.0996 101.739 41.1524 101.465 42.1767C101.19 43.201 100.137 43.8088 99.1132 43.5343L84.2766 39.5589C83.2523 39.2844 82.6445 38.2316 82.9189 37.2074ZM83.2826 43.2683C82.2584 42.9939 81.2056 43.6017 80.9311 44.626C80.6567 45.6502 81.2645 46.703 82.2888 46.9775L89.7071 48.9652C90.7313 49.2396 91.7841 48.6318 92.0586 47.6076C92.333 46.5833 91.7252 45.5305 90.7009 45.256L83.2826 43.2683Z" fill="#7989FF"></path></g><path fill-rule="evenodd" clip-rule="evenodd" d="M40.4004 71.8426C40.4004 57.2141 44.0575 53.5569 61.1242 53.5569H66.0004H70.8766C87.9432 53.5569 91.6004 57.2141 91.6004 71.8426V79.1569C91.6004 93.7855 87.9432 97.4426 70.8766 97.4426H61.1242C44.0575 97.4426 40.4004 93.7855 40.4004 79.1569V71.8426ZM78.8002 67.4995C78.8002 70.1504 76.6512 72.2995 74.0002 72.2995C71.3492 72.2995 69.2002 70.1504 69.2002 67.4995C69.2002 64.8485 71.3492 62.6995 74.0002 62.6995C76.6512 62.6995 78.8002 64.8485 78.8002 67.4995ZM60.7204 70.8597C60.2672 70.2553 59.5559 69.8997 58.8004 69.8997C58.045 69.8997 57.3337 70.2553 56.8804 70.8597L47.2804 83.6597C46.4851 84.72 46.7 86.2244 47.7604 87.0197C48.8208 87.8149 50.3251 87.6 51.1204 86.5397L58.8004 76.2997L66.4804 86.5397C66.8979 87.0962 67.5363 87.4443 68.2303 87.4936C68.9243 87.5429 69.6055 87.2887 70.0975 86.7967L74.8004 82.0938L79.5034 86.7967C80.4406 87.734 81.9602 87.734 82.8975 86.7967C83.8347 85.8595 83.8347 84.3399 82.8975 83.4026L76.4975 77.0026C75.5602 76.0653 74.0406 76.0653 73.1034 77.0026L68.6601 81.4459L60.7204 70.8597Z" fill="#3C46FF"></path><defs><clipPath id="clip0_3605_64419"><rect width="56" height="56" fill="white" transform="translate(0 26.9939) rotate(-15)"></rect></clipPath><clipPath id="clip1_3605_64419"><rect width="64" height="64" fill="white" transform="translate(69.5645 0.5) rotate(15)"></rect></clipPath></defs></svg><h3>Add anything</h3><h4 class="w-2/3">Drop any file here to add it to the conversation</h4></div>';
}
