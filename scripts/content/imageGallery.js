/* global downloadFileFrmoUrl, openUpgradeModal, hljs, formatDate, formatTime, formatDateDalle, toast, getDownloadUrlFromFileId, debounce */
let selectedGalleryImage = null;
let downloadImageOffset = 0;
const downloadImageLimit = 12;
let allImageNodes = [];
let currentTab = 'dalle'; // dalle or charts
// eslint-disable-next-line no-unused-vars
function openImageGallery() {
  selectedGalleryImage = null;
  const gallery = `<div id="image-gallery" data-state="open" style="z-index:20;" class="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-xl radix-state-open:animate-show" style="pointer-events: auto;"><div role="dialog" id="radix-:rl:" aria-describedby="radix-:rn:" aria-labelledby="radix-:rm:" data-state="open" class="relative flex h-screen w-screen justify-stretch divide-x divide-white/10 focus:outline-none radix-state-open:animate-contentShow" tabindex="-1" style="pointer-events: auto;"><div id="image-gallery-image-wrapper" class="flex flex-1 transition-[flex-basis]"><div class="flex flex-1 flex-col md:p-6"><div class="flex items-center justify-between text-white"><div class="flex"><button id="gallery-close-button" class="transition hover:text-gray-300 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Close Modal" type="button"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-md" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div><div class="flex"><button id="toggle-gallery-sidebar" class="btn relative btn-small md:inline-flex" aria-label="Toggle Sidebar"><div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-md" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg></div></button></div></div><div class="flex items-center justify-between px-6 py-2 pt-6 text-white sm:mb-4 md:mt-2 md:px-0 md:py-2"><div class="flex"><input type="search" id="gallery-search" tabindex="0" placeholder="Search gallery" class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800"></div><div id="gallery-tabs-wrapper" role="radiogroup" aria-required="false" dir="ltr" class="flex w-full overflow-hidden rounded-xl bg-token-surface-secondary p-1.5 dark:bg-token-surface-tertiary md:w-1/3 flex-shrink-0 self-center" tabindex="0" style="outline: none;"><button id="gallery-tab-dalle" type="button" role="radio" data-state="${currentTab === 'dalle' ? 'checked' : 'unchecked'}" value="dalle" class="text-md w-1/3 flex-grow rounded-lg border-token-border-light p-1.5 font-medium text-token-text-tertiary transition hover:text-token-text-primary radix-state-checked:border radix-state-checked:bg-token-surface-primary radix-state-checked:text-token-text-primary radix-state-checked:shadow-[0_0_2px_rgba(0,0,0,.03)] radix-state-checked:dark:bg-token-surface-secondary md:w-1/2" tabindex="0" data-radix-collection-item="">Dall·E</button><button id="gallery-tab-charts" type="button" role="radio" data-state="${currentTab === 'charts' ? 'checked' : 'unchecked'}" value="charts" class="text-md w-1/3 flex-grow rounded-lg border-token-border-light p-1.5 font-medium text-token-text-tertiary transition hover:text-token-text-primary radix-state-checked:border radix-state-checked:bg-token-surface-primary radix-state-checked:text-token-text-primary radix-state-checked:shadow-[0_0_2px_rgba(0,0,0,.03)] radix-state-checked:dark:bg-token-surface-secondary md:w-1/2" tabindex="-1" data-radix-collection-item="">Charts</button></div><div class="flex"><button id="gallery-download-all-button" class="btn btn-dark mr-4">Download All</button></div></div><div id="gallery-image-list" style="display: flex;flex-flow: wrap;justify-content: start;align-items: stretch;overflow-y:scroll;"></div></div></div><div id="image-gallery-sidebar" class="flex overflow-y-scroll hidden items-start justify-start overflow-hidden bg-gray-900 text-white transition-[flex-basis] duration-500 md:flex md:basis-[25vw]"><div class="w-[25vw]"><div class="flex flex-col w-full justify-start items-start gap-2 p-4" draggable="false" data-projection-id="38"><img id="gallery-selected-image" style="aspect-ratio:1;background-color: #333;" src="${chrome.runtime.getURL('images/loading.gif')}" class="row-span-4 mx-auto h-full rounded-md object-scale-down" data-projection-id="39"><div id="gallery-selected-image-timestamp" class="w-full text-xs text-gray-500">${formatDate(selectedGalleryImage?.createTime) || '...'}</div></div><div class="flex flex-col items-start gap-3 p-4"><div class="text-sm text-gray-300 sm:text-base" id="gallery-selected-image-prompt-title">${currentTab === 'dalle' ? 'Prompt' : 'Code'}</div><div id="gallery-selected-image-prompt" class="w-full text-sm sm:text-lg">${currentTab === 'dalle' ? selectedGalleryImage?.prompt || '...' : codeWrapper(selectedGalleryImage?.prompt, selectedGalleryImage?.language) || '...'}</div><button id="gallery-selected-image-prompt-copy-button" class="btn relative btn-dark hidden sm:block"><div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Copy</div></button><div><div class="flex my-1 ${selectedGalleryImage?.genId ? 'visible' : 'invisible'}">Gen ID:&nbsp;<div class="font-bold flex cursor-pointer" id="gallery-selected-image-gen-id-copy-button"><span id="gallery-selected-image-gen-id">${selectedGalleryImage?.genId}</span><button class="flex ml-1 gap-2 items-center rounded-md p-1 text-xs text-gray-400 hover:text-gray-200"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg></button></div></div><div class="flex my-1 ${selectedGalleryImage?.seed ? 'visible' : 'invisible'}">Seed:&nbsp;<div class="font-bold flex cursor-pointer" id="gallery-selected-image-seed-copy-button"><span id="gallery-selected-image-seed">${selectedGalleryImage?.seed}</span><button class="flex ml-1 gap-2 items-center rounded-md p-1 text-xs text-gray-400 hover:text-gray-200"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg></button></div></div></div><div id="go-to-conversation-${selectedGalleryImage?.conversationId}" class="cursor-pointer no-underline hover:underline" style="color:#3c80f5;">Go to conversation ➜</div></div></div></div></div></div>`;
  // remove existing gallery
  const existingGallery = document.getElementById('image-gallery');
  existingGallery?.remove();
  // add gallery to body
  const body = document.querySelector('body');
  body.insertAdjacentHTML('beforeend', gallery);
  addImageGalleryEventListeners();
  loadImageList();
}
function loadImageList() {
  chrome.storage.local.get(['conversationsOrder', 'conversations'], (result) => {
    const { conversationsOrder, conversations } = result;
    selectedGalleryImage = null;
    downloadImageOffset = 0;
    allImageNodes = [];
    const searchValue = document.getElementById('gallery-search').value.toLowerCase();
    const allConversationsIds = [...new Set(conversationsOrder.map((convOrFold) => {
      if (typeof convOrFold === 'string') return convOrFold;
      if (convOrFold.id === 'trash') return [];
      return convOrFold.conversationIds;
    }).flat())];
    allConversationsIds.forEach((conversationId) => {
      const conversation = conversations[conversationId];
      if (!conversation) return;
      const messages = Object.values(conversation?.mapping);
      messages.forEach((m) => {
        const { message } = m;
        const createTime = new Date(formatTime(message?.create_time));
        const shouldAddMessage = currentTab === 'dalle'
          ? message?.author?.name === 'dalle.text2im'
          : message?.content?.text?.includes('<<ImageDisplayed>>');
        if (shouldAddMessage) {
          const messageId = message.id;
          const images = currentTab === 'dalle'
            ? message?.content?.parts?.filter((part) => part?.content_type === 'image_asset_pointer')
            : message?.metadata?.aggregate_result?.messages?.filter((msg) => msg?.message_type === 'image');
          const { language, value: resValue } = currentTab === 'dalle'
            ? { language: '', value: '' }
            : hljs.highlightAuto(message?.metadata?.aggregate_result?.code);
          images.forEach((image) => {
            const imageId = currentTab === 'dalle'
              ? image?.asset_pointer?.split('file-service://')[1]
              : image?.image_url?.split('file-service://')[1];
            if (!imageId) return;
            const { width, height } = image;
            const prompt = currentTab === 'dalle' ? image?.metadata?.dalle?.prompt : resValue;
            const genId = image?.metadata?.dalle?.gen_id;
            const seed = image?.metadata?.dalle?.seed;

            if (searchValue && !prompt.toLowerCase().includes(searchValue)) return;
            allImageNodes.push({
              conversationId, messageId, imageId, width, height, prompt, genId, seed, language, createTime,
            });
          });
        }
      });
    });
    // sort by create time
    allImageNodes.sort((a, b) => b.createTime - a.createTime);
    // get the first batch of images
    const firstImageNodes = allImageNodes.slice(downloadImageOffset, downloadImageOffset + downloadImageLimit);
    // eslint-disable-next-line prefer-destructuring
    selectedGalleryImage = firstImageNodes[0];
    const galleryImageList = document.getElementById('gallery-image-list');
    if (firstImageNodes.length === 0) {
      galleryImageList.innerHTML = '<div class="flex flex-col w-full justify-start items-start"><div class="relative flex flex-col w-full h-full justify-center items-center gap-2 p-4 text-gray-500 text-2xl font-bold cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 hover:shadow-xl rounded-xl">No images found!</div></div>';
      return;
    }
    galleryImageList.innerHTML = `${firstImageNodes.map((imageNode) => `<div class="group/dalle-image relative flex flex-col w-full justify-start items-start gap-2 p-2 cursor-pointer" style="font-size:12px;min-width:20%;max-width: 20%;" draggable="false" data-projection-id="38"><img id="gallery-image-card-${imageNode.imageId}" src="${chrome.runtime.getURL('images/loading.gif')}" alt="${imageNode.prompt?.replace(/[^a-zA-Z0-9 ]/gi, '') || 'Generated by DALL·E'}" style="aspect-ratio:1;background-color:#333;" class="w-full row-span-4 mx-auto h-full rounded-md object-scale-down ${selectedGalleryImage.imageId === imageNode.imageId ? 'ring-2 ring-white ring-offset-4 ring-offset-black' : ''}" data-projection-id="39"><div class="invisible absolute left-3 top-3 group-hover/dalle-image:visible"><button id="image-download-button-${imageNode.imageId}" class="flex h-6 w-6 items-center justify-center rounded bg-black/50"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm text-white"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.70711 10.2929C7.31658 9.90237 6.68342 9.90237 6.29289 10.2929C5.90237 10.6834 5.90237 11.3166 6.29289 11.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L17.7071 11.7071C18.0976 11.3166 18.0976 10.6834 17.7071 10.2929C17.3166 9.90237 16.6834 9.90237 16.2929 10.2929L13 13.5858L13 4C13 3.44771 12.5523 3 12 3C11.4477 3 11 3.44771 11 4L11 13.5858L7.70711 10.2929ZM5 19C4.44772 19 4 19.4477 4 20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19L5 19Z" fill="currentColor"></path></svg></button></div></div>`).join('')}${firstImageNodes.length >= downloadImageLimit ? '<div class="flex flex-col w-full justify-start items-start gap-2 p-2" style="min-width:20%;max-width:20%;aspect-ration:1;"><div id="load-more-images-button" class="relative flex flex-col w-full h-full justify-center items-center gap-2 p-4 text-gray-500 text-2xl font-bold cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 hover:shadow-xl rounded-xl">Load more...</div></div>' : ''}`;
    addGalleryImageCardEventListeners(firstImageNodes);
    addLoadMoreImagesEventListener(allImageNodes);
    // load image src
    replaceGalleryImageSrc(firstImageNodes);
    // click on first image
    const firstImage = document.getElementById(`gallery-image-card-${firstImageNodes[0]?.imageId}`);
    firstImage?.click();
  });
}
function downloadAllImages() {
  // const zip = new JSZip();
  // const folder = zip.folder('Superpower-ChatGPT-Gallery');

  for (let i = 0; i < allImageNodes.length; i += 1) {
    const imageNode = allImageNodes[i];
    const { imageId } = imageNode;
    // eslint-disable-next-line no-loop-func, no-await-in-loop
    getDownloadUrlFromFileId(imageId).then((response) => {
      const imageElement = document.getElementById(`gallery-image-card-${imageId}`);
      const filename = currentTab === 'dalle' ? `DALL·E ${formatDateDalle()} - ${imageElement?.alt}.png` : `Data Analytic Image ${formatDateDalle()}.png`;
      downloadFileFrmoUrl(response.download_url, filename);
      // fetch(response.download_url).then((resp) => resp.blob()).then((blob) => {
      //   folder.file(filename, blob);
      // });
    });
  }
  // return zip;
}
function loadMoreImagePlaceholders(imageNodes) {
  const loadMoreImagesButton = document.getElementById('load-more-images-button');
  const newImagePlaceholders = imageNodes.map((imageNode) => `<div class="group/dalle-image relative flex flex-col w-full justify-start items-start gap-2 p-2 cursor-pointer" style="font-size:12px;min-width:20%;max-width: 20%;" draggable="false" data-projection-id="38"><img id="gallery-image-card-${imageNode.imageId}" src="${chrome.runtime.getURL('images/loading.gif')}" alt="${imageNode.prompt?.replace(/[^a-zA-Z0-9 ]/gi, '') || 'Generated by DALL·E'}" style="aspect-ratio:1;" class="w-full row-span-4 mx-auto h-full rounded-md object-scale-down ${selectedGalleryImage.imageId === imageNode.imageId ? 'ring-2 ring-white ring-offset-4 ring-offset-black' : ''}" data-projection-id="39"><div class="invisible absolute left-3 top-3 group-hover/dalle-image:visible"><button id="image-download-button-${imageNode.imageId}" class="flex h-6 w-6 items-center justify-center rounded bg-black/50"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm text-white"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.70711 10.2929C7.31658 9.90237 6.68342 9.90237 6.29289 10.2929C5.90237 10.6834 5.90237 11.3166 6.29289 11.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L17.7071 11.7071C18.0976 11.3166 18.0976 10.6834 17.7071 10.2929C17.3166 9.90237 16.6834 9.90237 16.2929 10.2929L13 13.5858L13 4C13 3.44771 12.5523 3 12 3C11.4477 3 11 3.44771 11 4L11 13.5858L7.70711 10.2929ZM5 19C4.44772 19 4 19.4477 4 20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19L5 19Z" fill="currentColor"></path></svg></button></div></div>`).join('');
  loadMoreImagesButton.parentElement.insertAdjacentHTML('beforebegin', newImagePlaceholders);
  if (imageNodes.length < downloadImageLimit) {
    loadMoreImagesButton.remove();
  }
}
function getGalleryImageSrc(imageId) {
  getDownloadUrlFromFileId(imageId).then((response) => {
    const imageElement = document.getElementById(`gallery-image-card-${imageId}`);
    const selectImageElement = document.getElementById('gallery-selected-image');
    if (imageElement) {
      imageElement.src = response.download_url;
    }
    if (selectedGalleryImage?.imageId === imageId) {
      selectImageElement.src = response.download_url;
    }
  });
}
function replaceGalleryImageSrc(imageNodes) {
  imageNodes.forEach((imageNode) => {
    const { imageId } = imageNode;
    getGalleryImageSrc(imageId);
  });
  downloadImageOffset += downloadImageLimit;
}
function addLoadMoreImagesEventListener(imageNodes) {
  const loadMoreImagesButton = document.getElementById('load-more-images-button');
  loadMoreImagesButton?.addEventListener('click', () => {
    const nextImageNodes = imageNodes.slice(downloadImageOffset, downloadImageOffset + downloadImageLimit);
    loadMoreImagePlaceholders(nextImageNodes);
    addGalleryImageCardEventListeners(nextImageNodes);
    replaceGalleryImageSrc(nextImageNodes);
  });
  // add an observer to click the load more button when it is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadMoreImagesButton?.click();
      }
    });
  }, { threshold: 1 });
  if (loadMoreImagesButton) {
    observer.observe(loadMoreImagesButton);
  }
}
function addImageGalleryEventListeners() {
  // close gallery
  const closeGalleryButton = document.getElementById('gallery-close-button');
  closeGalleryButton?.addEventListener('click', () => {
    const galleryElement = document.getElementById('image-gallery');
    galleryElement.remove();
  });
  // sidebar hide/close
  const toggleGallerySidebarButton = document.getElementById('toggle-gallery-sidebar');
  toggleGallerySidebarButton?.addEventListener('click', () => {
    const imageWrapper = document.getElementById('image-gallery-image-wrapper');
    const sidebar = document.getElementById('image-gallery-sidebar');
    const sidebarIsOpen = sidebar.classList.contains('md:basis-[25vw]');
    if (sidebarIsOpen) {
      sidebar.classList.replace('md:basis-[25vw]', 'md:basis-0');
      imageWrapper.classList.add('md:basis-[75vw]');
    } else {
      sidebar.classList.replace('md:basis-0', 'md:basis-[25vw]');
      imageWrapper.classList.remove('md:basis-[75vw]');
    }
  });
  // search
  const gallerySearch = document.getElementById('gallery-search');
  gallerySearch?.addEventListener('input', () => {
    debounce(() => {
      loadImageList();
    }, 1000)();
  });
  // tab switch
  const dalleTab = document.getElementById('gallery-tab-dalle');
  const chartsTab = document.getElementById('gallery-tab-charts');
  dalleTab?.addEventListener('click', () => {
    if (currentTab === 'dalle') return;
    dalleTab.dataset.state = 'checked';
    chartsTab.dataset.state = 'unchecked';
    document.getElementById('gallery-search').value = '';
    currentTab = 'dalle';
    loadImageList();
  });
  chartsTab?.addEventListener('click', () => {
    if (currentTab === 'charts') return;
    dalleTab.dataset.state = 'unchecked';
    chartsTab.dataset.state = 'checked';
    document.getElementById('gallery-search').value = '';
    currentTab = 'charts';
    loadImageList();
  });
  // download all
  const downloadAllButton = document.querySelector('[id="gallery-download-all-button"]');
  downloadAllButton?.addEventListener('click', async () => {
    downloadAllImages();
    // zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }).then((content) => {
    //   saveAs(content, `${new Date().toISOString().slice(0, 10)}-superpower-chatgpt-gallery.zip`);
    // });
  });

  // copy prompt
  const copyPromptButton = document.getElementById('gallery-selected-image-prompt-copy-button');
  copyPromptButton?.addEventListener('click', () => {
    copyPromptButton.innerHTML = '<div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Copied!</div>';
    copyPromptButton.classList = 'opacity-50 hover:bg-inherit cursor-not-allowed btn relative btn-dark hidden sm:block';
    setTimeout(() => {
      copyPromptButton.innerHTML = '<div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Copy</div>';
      copyPromptButton.classList = 'btn relative btn-dark hidden sm:block';
    }, 2000);
    const prompt = document.getElementById('gallery-selected-image-prompt');
    navigator.clipboard.writeText(prompt.textContent);
  });
  // copy gen id
  const copyGenIdButton = document.getElementById('gallery-selected-image-gen-id-copy-button');
  copyGenIdButton?.addEventListener('click', () => {
    navigator.clipboard.writeText(copyGenIdButton.innerText);
    toast('Copied Gen ID to clipboard');
  });
  // copy seed
  const copySeedButton = document.getElementById('gallery-selected-image-seed-copy-button');
  copySeedButton?.addEventListener('click', () => {
    navigator.clipboard.writeText(copySeedButton.innerText);
    toast('Copied Seed to clipboard');
  });
  // go to conversation
  const goToConversationButton = document.querySelector('[id^=go-to-conversation-]');
  goToConversationButton?.addEventListener('click', () => {
    // close gallery
    const galleryElement = document.getElementById('image-gallery');
    galleryElement.remove();
    goToConversation(selectedGalleryImage?.conversationId);
  });
}
function addGalleryImageCardEventListeners(imageNodes) {
  // download center image
  const imageDownloadButtons = document.querySelectorAll('[id^="image-download-button-"]');
  const newImageNodeIds = imageNodes.map((imageNode) => imageNode.imageId);
  imageDownloadButtons.forEach((imageDownloadButton) => {
    const imageId = imageDownloadButton.id.split('image-download-button-')[1];
    if (!imageId) return;
    if (!newImageNodeIds.includes(imageId)) return;
    imageDownloadButton?.addEventListener('click', () => {
      const imageElement = document.getElementById(`gallery-image-card-${imageId}`);
      const filename = currentTab === 'dalle' ? `DALL·E ${formatDateDalle()} - ${imageElement?.alt}.png` : `Data Analytic Image ${formatDateDalle()}.png`;
      if (imageElement.src) {
        downloadFileFrmoUrl(imageElement.src, filename);
      }
    });
  });

  // thumbnail image click
  const galleryImages = document.querySelectorAll('[id^="gallery-image-card-"]');
  galleryImages.forEach((image) => {
    const imageId = image.id.split('gallery-image-card-')[1];
    if (!imageId) return;
    if (!newImageNodeIds.includes(imageId)) return;
    image.addEventListener('click', () => {
      selectedGalleryImage = allImageNodes.find((imageNode) => imageNode.imageId === image.id.split('gallery-image-card-')[1]);
      document.querySelectorAll('[id^="gallery-image-card-"]').forEach((galleryImage) => {
        galleryImage.classList.remove('ring-2', 'ring-white', 'ring-offset-4', 'ring-offset-black');
      });
      if (image.src === chrome.runtime.getURL('images/loading.gif')) {
        getGalleryImageSrc(imageId);
      }
      image.classList.add('ring-2', 'ring-white', 'ring-offset-4', 'ring-offset-black');
      // open sidebar if closed
      const imageWrapper = document.getElementById('image-gallery-image-wrapper');
      const sidebar = document.getElementById('image-gallery-sidebar');
      sidebar.classList.replace('md:basis-0', 'md:basis-[25vw]');
      imageWrapper.classList.remove('md:basis-[75vw]');
      // update image info in sidebar
      const selectedImage = document.getElementById('gallery-selected-image');
      selectedImage.src = image.src;
      selectedImage.style.aspectRatio = Math.min(1, (selectedGalleryImage?.width || 1) / (selectedGalleryImage?.height || 1));
      const selectedImageTime = document.getElementById('gallery-selected-image-timestamp');
      selectedImageTime.textContent = formatDate(selectedGalleryImage.createTime);
      const selectedImagePromptTitle = document.getElementById('gallery-selected-image-prompt-title');
      selectedImagePromptTitle.textContent = currentTab === 'dalle' ? 'Prompt' : 'Code';
      const prompt = document.getElementById('gallery-selected-image-prompt');
      prompt.innerHTML = currentTab === 'dalle' ? selectedGalleryImage.prompt : codeWrapper(selectedGalleryImage.prompt, selectedGalleryImage.language);
      const genId = document.getElementById('gallery-selected-image-gen-id');
      genId.textContent = selectedGalleryImage.genId;
      genId.parentElement.parentElement.classList = `flex my-1 ${selectedGalleryImage.genId ? 'visible' : 'invisible'}`;
      const seed = document.getElementById('gallery-selected-image-seed');
      seed.textContent = selectedGalleryImage.seed;
      seed.parentElement.parentElement.classList = `flex my-1 ${selectedGalleryImage.seed ? 'visible' : 'invisible'}`;
      const goToConversationButton = document.querySelector('[id^=go-to-conversation-]');
      goToConversationButton.id = `go-to-conversation-${selectedGalleryImage.conversationId}`;
    });
  });
}
function codeWrapper(code, language) {
  return `<div class="overflow-y-auto" style="background: #333; padding: 8px; border-radius: 8px;"><code hljs language-${language} id="message-plugin-request-html-36053455-5209-4236-901d-a179d861f092" class="!whitespace-pre-wrap" style="font-size:12px;">${code}</code></div>`;
}
function goToConversation(conversationId) {
  const conversationButton = document.querySelector(`[id="conversation-button-${conversationId}"]`);
  if (!conversationButton) return;
  conversationButton.click();
}
function openSubscriptionModal() {
  const gallery = `<div id="image-gallery" data-state="open" style="z-index:20;" class="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-xl radix-state-open:animate-show" style="pointer-events: auto;"><div class="w-full absolute inset-0 flex items-center flex-wrap justify-center text-white m-auto p-4 bg-black rounded-md" style="max-width:400px; max-height:240px;"><div>Image gallery requires a Superpower ChatGPT Pro subscription. Upgrade to Pro to see the full list of all of your images. You can search, see the prompts, and download all images! <a href="https://www.youtube.com/watch?v=oU6_wgJLYEM&ab_channel=Superpower" target="_blank" class="underline text-gold" rel="noreferrer">Learn more</a> about Image Gallery!</div><button id="cancel-button" class="btn p-3 relative btn-neutral" as="button"><div class="flex w-full gap-2 items-center justify-center">Cancel</div></button><button id="upgrade-to-pro-button-gallery" class="flex flex-wrap px-3 py-1 items-center rounded-md bg-gold hover:bg-gold-dark transition-colors duration-200 text-black cursor-pointer text-sm m-4 font-bold" style="width: 230px;"><div class="flex w-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width:20px; height:20px; margin-right:6px;position:relative; top:10px;" stroke="purple" fill="purple"><path d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z"></path></svg> Upgrade to Pro</div><div style="font-size:10px;font-weight:400;margin-left:28px;" class="flex w-full">Get GPT Store, Image Gallery, and more</div></button></div><img src="${chrome.runtime.getURL('images/gallery.png')}"></div>`;
  // add gallery to body
  const body = document.querySelector('body');
  body.insertAdjacentHTML('beforeend', gallery);
  // add event listeners
  addSubscriptionModalEventListeners();
}
function addSubscriptionModalEventListeners() {
  // close gallery
  const cancelButton = document.getElementById('cancel-button');
  cancelButton.addEventListener('click', () => {
    const galleryElement = document.getElementById('image-gallery');
    galleryElement.remove();
  });
  // upgrade to pro
  const upgradeToProButton = document.getElementById('upgrade-to-pro-button-gallery');
  upgradeToProButton.addEventListener('click', () => {
    openUpgradeModal(false);
  });
}
function addGalleryButton() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // check if the setting button is already added
  if (document.querySelector('#gallery-button')) return;
  // create the setting button by copying the nav button
  const galleryButton = document.createElement('a');
  galleryButton.classList = 'flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm';
  galleryButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" ><path d="M512 0C547.3 0 576 28.65 576 64V288C576 323.3 547.3 352 512 352H64C28.65 352 0 323.3 0 288V64C0 28.65 28.65 0 64 0H512zM512 48H64C55.16 48 48 55.16 48 64V288C48 296.8 55.16 304 64 304H512C520.8 304 528 296.8 528 288V64C528 55.16 520.8 48 512 48zM0 448C0 430.3 14.33 416 32 416H64C81.67 416 96 430.3 96 448V480C96 497.7 81.67 512 64 512H32C14.33 512 0 497.7 0 480V448zM224 416C241.7 416 256 430.3 256 448V480C256 497.7 241.7 512 224 512H192C174.3 512 160 497.7 160 480V448C160 430.3 174.3 416 192 416H224zM320 448C320 430.3 334.3 416 352 416H384C401.7 416 416 430.3 416 448V480C416 497.7 401.7 512 384 512H352C334.3 512 320 497.7 320 480V448zM544 416C561.7 416 576 430.3 576 448V480C576 497.7 561.7 512 544 512H512C494.3 512 480 497.7 480 480V448C480 430.3 494.3 416 512 416H544z"/></svg> Gallery';
  galleryButton.title = 'CMD/CTRL + ALT + Y';

  galleryButton.id = 'gallery-button';
  // Add click event listener to setting button
  galleryButton.addEventListener('click', () => {
    // open the setting modal
    chrome.runtime.sendMessage({
      checkHasSubscription: true,
      detail: {
        forceRefresh: true,
      },
    }, (hasSubscription) => {
      if (hasSubscription) {
        openImageGallery();
      } else {
        openSubscriptionModal();
      }
    });
  });
  const userMenu = nav.querySelector('#user-menu');
  userMenu.prepend(galleryButton);
}
// eslint-disable-next-line no-unused-vars
function initializeGallery() {
  addGalleryButton();
}
