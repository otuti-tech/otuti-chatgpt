/* global downloadFileFrmoUrl, getAllConversations, getConversation, openUpgradeModal, hljs, formatDate, toast, getDownloadUrlFromFileId, debounce, imageGalleryMenu, addImageGalleryMenuEventListener, imageGalleryMenuOptions, highlightSearch */
let selectedGalleryImage = null;
const allImageNodes = [];
let selectedImageGalleryImageIds = [];
let imageGalleryCurrentTab = 'dalle'; // dalle or chart or public
// eslint-disable-next-line no-unused-vars
function openImageGallery() {
  selectedGalleryImage = null;
  const gallery = `<div id="image-gallery" data-state="open" style="z-index:20;" class="dark fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-xl radix-state-open:animate-show" style="pointer-events: auto;"><div role="dialog" id="radix-:rl:" aria-describedby="radix-:rn:" aria-labelledby="radix-:rm:" data-state="open" class="relative flex h-screen w-screen justify-stretch divide-x divide-white/10 focus:outline-none radix-state-open:animate-contentShow" tabindex="-1" style="pointer-events: auto;">
  
  <div id="image-gallery-image-wrapper" class="flex flex-1 transition-[flex-basis]"><div class="flex flex-1 flex-col md:p-6">

  <div class="flex items-center justify-between text-token-text-primary"><div class="flex"><button id="gallery-close-button" class="transition text-token-text-secondary hover:text-token-text-primary" aria-label="Close Modal" type="button"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-md" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div><div class="flex"><button id="toggle-gallery-sidebar" class="btn relative btn-small md:inline-flex" aria-label="Toggle Sidebar"><div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-md" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg></div></button></div></div>
  
  <div id="gallery-header" class="flex items-center justify-between px-6 py-2 pt-6 text-token-text-primary sm:mb-4 md:mt-2 md:px-0 md:py-2">
  
  <div class="flex"><input type="search" id="gallery-search" tabindex="0" placeholder="Search gallery" class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-token-main-surface-secondary"></div>
  
  <div id="gallery-tabs-wrapper" role="radiogroup" aria-required="false" dir="ltr" class="flex w-full overflow-hidden rounded-xl bg-token-main-surface-secondary p-1.5 dark:bg-token-main-surface-tertiary md:w-1/3 flex-shrink-0 self-center" tabindex="0" style="outline: none;"><button id="gallery-tab-dalle" type="button" role="radio" data-state="${imageGalleryCurrentTab === 'dalle' ? 'checked' : 'unchecked'}" value="dalle" class="text-md w-1/3 flex-grow rounded-lg border-token-border-light p-1.5 font-medium text-token-text-tertiary transition hover:text-token-text-primary radix-state-checked:border radix-state-checked:bg-token-main-surface-primary radix-state-checked:text-token-text-primary radix-state-checked:shadow-[0_0_2px_rgba(0,0,0,.03)] radix-state-checked:dark:bg-token-main-surface-secondary md:w-1/3" tabindex="0" data-radix-collection-item="">Dall·E</button><button id="gallery-tab-chart" type="button" role="radio" data-state="${imageGalleryCurrentTab === 'chart' ? 'checked' : 'unchecked'}" value="chart" class="text-md w-1/3 flex-grow rounded-lg border-token-border-light p-1.5 font-medium text-token-text-tertiary transition hover:text-token-text-primary radix-state-checked:border radix-state-checked:bg-token-main-surface-primary radix-state-checked:text-token-text-primary radix-state-checked:shadow-[0_0_2px_rgba(0,0,0,.03)] radix-state-checked:dark:bg-token-main-surface-secondary md:w-1/3" tabindex="-1" data-radix-collection-item="">Charts</button><button id="gallery-tab-public" type="button" role="radio" data-state="${imageGalleryCurrentTab === 'public' ? 'checked' : 'unchecked'}" value="public" class="text-md w-1/3 flex-grow rounded-lg border-token-border-light p-1.5 font-medium text-token-text-tertiary transition hover:text-token-text-primary radix-state-checked:border radix-state-checked:bg-token-main-surface-primary radix-state-checked:text-token-text-primary radix-state-checked:shadow-[0_0_2px_rgba(0,0,0,.03)] radix-state-checked:dark:bg-token-main-surface-secondary md:w-1/3" tabindex="-1" data-radix-collection-item="">Public</button></div>
  
  <div class="flex relative">${imageGalleryMenu()}</div>
  
  </div>
  
  <div id="gallery-image-list" style="display: flex;flex-flow: wrap;justify-content: start;align-items: stretch;overflow-y:scroll;"></div>
  
  </div></div>
  
  <div id="image-gallery-sidebar" class="flex overflow-y-scroll hidden items-start justify-start overflow-hidden bg-gray-900 text-token-text-primary transition-[flex-basis] duration-500 md:flex md:basis-[25vw]"><div class="w-[25vw]"><div class="flex flex-col w-full justify-start items-start gap-2 p-4" draggable="false" data-projection-id="38">
  
  <img id="gallery-selected-image" style="aspect-ratio:1;background-color: #333;" src="${chrome.runtime.getURL('images/loading.gif')}" class="row-span-4 mx-auto h-full rounded-md object-scale-down" data-projection-id="39">
  
  <div id="gallery-selected-image-timestamp" class="w-full text-xs text-gray-500">${formatDate(new Date(selectedGalleryImage?.created_at)) || '...'}</div></div>
  
  <div class="flex flex-col items-start gap-3 p-4"><div class="text-sm text-gray-300 sm:text-base" id="gallery-selected-image-prompt-title">${imageGalleryCurrentTab === 'chart' ? 'Code' : 'Prompt'}</div>
  
  <div id="gallery-selected-image-prompt" class="w-full text-sm sm:text-lg !whitespace-pre-wrap">${imageGalleryCurrentTab === 'chart' ? codeWrapper(selectedGalleryImage?.prompt) || '...' : selectedGalleryImage?.prompt || '...'}</div>
  <button id="gallery-selected-image-prompt-copy-button" class="btn relative btn-dark hidden sm:block"><div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Copy</div></button>
  
  <div>
  <div class="flex my-1 ${selectedGalleryImage?.gen_id && imageGalleryCurrentTab !== 'public' ? 'visible' : 'invisible'}">Gen ID:&nbsp;<div class="font-bold flex cursor-pointer" id="gallery-selected-image-gen-id-copy-button"><span id="gallery-selected-image-gen-id">${selectedGalleryImage?.gen_id}</span><button class="flex ml-1 gap-2 items-center rounded-md p-1 text-xs text-token-text-secondary hover:text-token-text-primary"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg></button></div></div>
  
  <div class="flex my-1 ${selectedGalleryImage?.seed && imageGalleryCurrentTab !== 'public' ? 'visible' : 'invisible'}">Seed:&nbsp;<div class="font-bold flex cursor-pointer" id="gallery-selected-image-seed-copy-button"><span id="gallery-selected-image-seed">${selectedGalleryImage?.seed}</span><button class="flex ml-1 gap-2 items-center rounded-md p-1 text-xs text-token-text-secondary hover:text-token-text-primary"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg></button></div></div>
  
  </div>
  
  <a id="go-to-conversation" class="${imageGalleryCurrentTab !== 'public' ? 'visible' : 'invisible'} target="_blank" href="${selectedGalleryImage?.conversation_id ? `https://chat.openai.com/c/${selectedGalleryImage?.conversation_id}` : 'https://chat.openai.com'}" cursor-pointer no-underline hover:underline" style="color:#3c80f5;">Open conversation in new tab ➜</a>
  
  <div id="more-by" class="${imageGalleryCurrentTab === 'public' ? 'invisible' : 'invisible'} cursor-pointer no-underline hover:underline" style="color:#3c80f5;">More images by this user</div>
  
  </div></div></div>
  
  </div></div>`;
  // remove existing gallery
  const existingGallery = document.getElementById('image-gallery');
  existingGallery?.remove();
  // add gallery to body
  const body = document.querySelector('body');
  body.insertAdjacentHTML('beforeend', gallery);
  addImageGalleryEventListeners();
  loadImageList();
}
// eslint-disable-next-line no-unused-vars
function syncImages(hasSubscription) {
  chrome.storage.local.get(['syncImagesCompletedAgainAgain', 'syncedConvIdsNew', 'lastMessageFailed', 'account'], (result) => {
    const {
      syncImagesCompletedAgainAgain, syncedConvIdsNew, account, chatgptAccountId,
    } = result;
    // console.warn('syncImagesCompletedAgainAgain', syncImagesCompletedAgainAgain, syncedConvIdsNew.length);

    if (syncImagesCompletedAgainAgain) return;
    const isPaid = account?.accounts?.[chatgptAccountId || 'default']?.entitlement?.has_active_subscription || false;
    if (!isPaid) return;
    const allSyncImages = [];
    getAllConversations(true, true).then(async (remoteConversations) => {
      const remoteConvIds = remoteConversations.map((conv) => conv?.id);
      for (let i = 0; i < remoteConvIds.length; i += 1) {
        const remoteConvId = remoteConvIds[i];
        // console.warn('remoteConvIds', i, remoteConvId);
        if (syncedConvIdsNew?.includes(remoteConvId)) continue;
        // eslint-disable-next-line no-loop-func, no-await-in-loop
        const conversation = await getConversation(remoteConvId);
        if (!conversation || !conversation?.mapping) continue;
        const mapping = conversation?.mapping;
        const messages = Object.values(mapping);
        for (let j = 0; j < messages.length; j += 1) {
          const { message } = messages[j];
          const shouldAddMessage = message?.author?.name === 'dalle.text2im' || message?.content?.text?.includes('<<ImageDisplayed>>');
          if (!shouldAddMessage) continue;

          const dalleImages = (message?.content?.parts || [])?.filter((part) => part?.content_type === 'image_asset_pointer').map((part) => ({ category: 'dalle', ...part })) || [];
          const chartImages = message?.metadata?.aggregate_result?.messages?.filter((msg) => msg?.message_type === 'image').map((msg) => ({ category: 'chart', ...msg })) || [];
          const allImages = [...dalleImages, ...chartImages];
          for (let k = 0; k < allImages.length; k += 1) {
            const image = allImages[k];
            const imageId = image.category === 'dalle'
              ? image?.asset_pointer?.split('file-service://')[1]
              : image?.image_url?.split('file-service://')[1];
            if (!imageId) return;
            const { width, height } = image;
            const prompt = image.category === 'dalle' ? image?.metadata?.dalle?.prompt : hljs.highlightAuto(message?.metadata?.aggregate_result?.code).value;

            const genId = image?.metadata?.dalle?.gen_id;
            const seed = image?.metadata?.dalle?.seed;
            const imageNode = {
              conversation_id: remoteConvId, image_id: imageId, width, height, prompt, gen_id: genId, seed, category: image.category, is_public: false,
            };
            // console.warn('imageNode', imageNode);

            // eslint-disable-next-line no-await-in-loop
            const response = await getDownloadUrlFromFileId(imageId);
            // console.warn('response', response);

            imageNode.download_url = response.download_url;
            imageNode.created_at = new Date(response.creation_time);
            allSyncImages.push(imageNode);
            // if (allSyncImages.length % 2 === 0) {
            chrome.runtime.sendMessage({
              addGalleryImages: true,
              detail: {
                images: allSyncImages,
              },
            });
            // empty the array
            allSyncImages.length = 0;
            // }
          }
        }

        if ((i % 10 === 0 || i === remoteConvIds.length - 1) && allSyncImages.length === 0) {
          chrome.storage.local.set({ syncedConvIdsNew: remoteConvIds.slice(0, i + 1) });
        }
        // random between 20000 and 30000
        const timeoutSec = Math.floor(Math.random() * (30000 - 20000 + 1)) + 20000;
        // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, hasSubscription ? 3000 : timeoutSec));
      }
      // add the remaining images
      chrome.runtime.sendMessage({
        addGalleryImages: true,
        detail: {
          images: allSyncImages,
        },
      });
      chrome.storage.local.set({ syncImagesCompletedAgainAgain: true });
    });
  });
}
function loadImageList(pageNumber = 1, byUserId = '', showAll = false) {
  if (pageNumber === 1) {
    selectedImageGalleryImageIds = [];
    selectedGalleryImage = null;
  }

  if (!byUserId) {
    const existingFilters = document.querySelectorAll('#gallery-filter');
    existingFilters.forEach((filter) => filter.remove());
  }
  chrome.runtime.sendMessage({
    getGalleryImages: true,
    detail: {
      showAll,
      pageNumber,
      byUserId,
      category: imageGalleryCurrentTab === 'public' ? 'dalle' : imageGalleryCurrentTab,
      searchTerm: document.getElementById('gallery-search').value.toLowerCase(),
      isPublic: imageGalleryCurrentTab === 'public',
    },
  }, (galleryImages) => {
    // console.warn('galleryImages', galleryImages);
    if (pageNumber === 1) allImageNodes.length = 0;
    allImageNodes.push(...galleryImages?.results || []);
    if (pageNumber === 1 && galleryImages?.results?.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      selectedGalleryImage = galleryImages?.results?.[0];
    }
    const galleryImageList = document.getElementById('gallery-image-list');
    if (!galleryImageList) return;

    if (imageGalleryCurrentTab === 'public') {
      const existingPublicImagesTip = document.getElementById('public-images-tip');
      if (!existingPublicImagesTip) {
        galleryImageList.insertAdjacentHTML('beforebegin', '<div id="public-images-tip" class="flex flex-col w-full justify-start items-start"><div class="relative flex flex-col w-full h-full justify-center items-center gap-2 p-4 text-token-text-primary text-md font-bold cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 hover:shadow-xl rounded-xl text-center">To see public images, first you need to share some of your images. The more images you share, the more public images you will see.<br/>To share, go to the Dall-E tab, select the images you would like to share, then select Make Public from the menu.</div></div>');
      }
    } else {
      const existingPublicImagesTip = document.getElementById('public-images-tip');
      existingPublicImagesTip?.remove();
      if (allImageNodes.length === 0) {
        galleryImageList.innerHTML = '<div class="flex flex-col w-full justify-start items-start"><div class="relative flex flex-col w-full h-full justify-center items-center gap-2 p-4 text-token-text-primary text-2xl font-bold cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 hover:shadow-xl rounded-xl text-center">No images found!</div></div>';
        return;
      }
    }
    const imageListHtml = `${galleryImages?.results?.map((imageNode) => `<div class="group/dalle-image relative flex flex-col w-full justify-start items-start gap-2 p-2 cursor-pointer" style="font-size:12px;min-width:20%;max-width: 20%;" draggable="false" data-projection-id="38"><img id="gallery-image-card-${imageNode.image_id}" src="${imageNode.image}" alt="${imageNode.prompt?.replace(/[^a-zA-Z0-9 ]/gi, '') || 'Generated by DALL·E'}" style="aspect-ratio:1;background-color:#333;" class="w-full row-span-4 mx-auto h-full rounded-md object-scale-down ${selectedGalleryImage?.image_id === imageNode?.image_id ? 'ring-2 ring-white ring-offset-4 ring-offset-black' : ''}" data-projection-id="39"><div class="invisible absolute left-3 top-3 group-hover/dalle-image:visible"><button id="image-download-button-${imageNode.image_id}" class="flex h-6 w-6 items-center justify-center rounded bg-black/50"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm text-token-text-primary"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.70711 10.2929C7.31658 9.90237 6.68342 9.90237 6.29289 10.2929C5.90237 10.6834 5.90237 11.3166 6.29289 11.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L17.7071 11.7071C18.0976 11.3166 18.0976 10.6834 17.7071 10.2929C17.3166 9.90237 16.6834 9.90237 16.2929 10.2929L13 13.5858L13 4C13 3.44771 12.5523 3 12 3C11.4477 3 11 3.44771 11 4L11 13.5858L7.70711 10.2929ZM5 19C4.44772 19 4 19.4477 4 20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19L5 19Z" fill="currentColor"></path></svg></button></div>  
    <input type="checkbox" id="image-gallery-checkbox-${imageNode.image_id}" class="invisible absolute right-3 top-3 ${imageGalleryCurrentTab !== 'public' ? 'group-hover/dalle-image:visible' : ''}" style="z-index: 11; cursor: pointer; border-radius: 2px;">
    
    </div>`).join('')}${galleryImages?.next ? '<div class="flex flex-col w-full justify-start items-start gap-2 p-2" style="min-width:20%;max-width:20%;aspect-ration:1;"><div id="load-more-images-button" class="relative flex flex-col w-full h-full justify-center items-center gap-2 p-4 text-token-text-primary text-2xl font-bold cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 hover:shadow-xl rounded-xl">Load more...</div></div>' : ''}`;
    if (pageNumber === 1) {
      galleryImageList.innerHTML = imageListHtml;
    } else {
      // remove the load more button
      const loadMoreImagesButton = document.getElementById('load-more-images-button');
      loadMoreImagesButton?.parentElement?.remove();
      galleryImageList.insertAdjacentHTML('beforeend', imageListHtml);
    }
    addGalleryImageCardEventListeners(galleryImages?.results);
    addLoadMoreImagesEventListener(pageNumber);
    if (pageNumber === 1) {
      // click on first image
      const firstImage = document.getElementById(`gallery-image-card-${allImageNodes[0]?.image_id}`);
      firstImage?.click();
    }
  });
}

function addLoadMoreImagesEventListener(pageNumber) {
  const loadMoreImagesButton = document.getElementById('load-more-images-button');
  loadMoreImagesButton?.addEventListener('click', () => {
    loadMoreImagesButton.innerHTML = `<img style="object-fit:none;aspect-ratio:1;background-color: #333;" src="${chrome.runtime.getURL('images/loading.gif')}" class="row-span-4 mx-auto h-full rounded-md object-scale-down" data-projection-id="39">`;
    loadImageList(pageNumber + 1);
  });
  // add an observer to click the load more button when it is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadMoreImagesButton?.click();
      }
    });
  }, { threshold: 0 });
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
  gallerySearch?.addEventListener('input', debounce(() => {
    loadImageList();
  }));
  // tab switch
  const dalleTab = document.getElementById('gallery-tab-dalle');
  const chartsTab = document.getElementById('gallery-tab-chart');
  const publicTab = document.getElementById('gallery-tab-public');

  dalleTab?.addEventListener('click', () => {
    if (imageGalleryCurrentTab === 'dalle') return;
    dalleTab.dataset.state = 'checked';
    chartsTab.dataset.state = 'unchecked';
    publicTab.dataset.state = 'unchecked';
    imageGalleryCurrentTab = 'dalle';
    document.getElementById('gallery-search').value = '';
    resetSidebar();
    loadImageList();
  });
  chartsTab?.addEventListener('click', () => {
    if (imageGalleryCurrentTab === 'chart') return;
    dalleTab.dataset.state = 'unchecked';
    chartsTab.dataset.state = 'checked';
    publicTab.dataset.state = 'unchecked';
    imageGalleryCurrentTab = 'chart';
    document.getElementById('gallery-search').value = '';
    resetSidebar();
    loadImageList();
  });
  publicTab?.addEventListener('click', (e) => {
    // check if shift clicked
    let showAll = false;
    if (e.shiftKey) {
      showAll = true;
    }
    if (imageGalleryCurrentTab === 'public') return;
    dalleTab.dataset.state = 'unchecked';
    chartsTab.dataset.state = 'unchecked';
    publicTab.dataset.state = 'checked';
    imageGalleryCurrentTab = 'public';
    document.getElementById('gallery-search').value = '';
    resetSidebar();
    loadImageList(1, '', showAll);
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
  // more by
  const moreBy = document.getElementById('more-by');
  moreBy.addEventListener('click', () => {
    if (!selectedGalleryImage?.created_by?.id) return;
    addUserFilter(selectedGalleryImage?.created_by);
    loadImageList(1, selectedGalleryImage?.created_by?.id);
  });
  // menu button
  const menu = document.querySelector('#image-gallery-menu');
  const menuButton = document.querySelector('#image-gallery-menu-button');
  menuButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const optionListDropdown = document.querySelector('#image-gallery-menu-options');
    if (optionListDropdown) {
      optionListDropdown.remove();
    } else {
      const newOptionListDropdown = imageGalleryMenuOptions();
      menu.insertAdjacentHTML('beforeend', newOptionListDropdown);
      addImageGalleryMenuEventListener();
    }
  });
}
function addGalleryImageCardEventListeners(imageNodes) {
  // download center image
  // get last 24 image-download-button-*
  const imageDownloadButtons = [...document.querySelectorAll('[id^="image-download-button-"]')].slice(-24);

  const newImageNodeIds = imageNodes?.map((imageNode) => imageNode.image_id);
  imageDownloadButtons.forEach((imageDownloadButton) => {
    const imageId = imageDownloadButton.id.split('image-download-button-')[1];
    if (!imageId) return;
    if (!newImageNodeIds?.includes(imageId)) return;
    imageDownloadButton?.addEventListener('click', () => {
      const imageElement = document.getElementById(`gallery-image-card-${imageId}`);
      const url = decodeURIComponent(imageElement.src);
      const format = url.split('.').pop() || 'png';
      const filename = `${imageId}.${format}`;

      if (imageElement.src) {
        downloadFileFrmoUrl(imageElement.src, filename);
      }
    });
  });

  // image-gallery-checkbox
  const imageGalleryCheckboxes = document.querySelectorAll('[id^="image-gallery-checkbox"]');
  imageGalleryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const imageId = checkbox.id.split('image-gallery-checkbox-')[1];
      if (!newImageNodeIds.includes(imageId)) return;

      if (checkbox.checked && !selectedImageGalleryImageIds.includes(imageId)) {
        selectedImageGalleryImageIds.push(imageId);
        // remove invisible class from all checkboxes
        const curImageGalleryCheckboxes = document.querySelectorAll('[id^="image-gallery-checkbox"]');

        curImageGalleryCheckboxes.forEach((cb) => {
          cb.classList.remove('invisible');
        });
      } else {
        selectedImageGalleryImageIds = selectedImageGalleryImageIds.filter((id) => id !== imageId);
        // if no selected checkbox, add invisible class to all checkboxes
        if (selectedImageGalleryImageIds.length === 0) {
          const curImageGalleryCheckboxes = document.querySelectorAll('[id^="image-gallery-checkbox"]');
          curImageGalleryCheckboxes.forEach((cb) => {
            cb.classList.add('invisible');
          });
        }
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
      selectedGalleryImage = imageNodes.find((imageNode) => imageNode.image_id === image.id.split('gallery-image-card-')[1]);
      document.querySelectorAll('[id^="gallery-image-card-"]').forEach((galleryImage) => {
        galleryImage.classList.remove('ring-2', 'ring-white', 'ring-offset-4', 'ring-offset-black');
      });
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
      selectedImageTime.textContent = formatDate(new Date(selectedGalleryImage.created_at));
      const selectedImagePromptTitle = document.getElementById('gallery-selected-image-prompt-title');
      selectedImagePromptTitle.textContent = selectedGalleryImage.category === 'chart' ? 'Code' : 'Prompt';
      const prompt = document.getElementById('gallery-selected-image-prompt');
      prompt.innerHTML = imageGalleryCurrentTab === 'chart' ? codeWrapper(selectedGalleryImage.prompt) : selectedGalleryImage.prompt;
      const searchValue = document.getElementById('gallery-search').value;
      if (searchValue) {
        highlightSearch([prompt], searchValue);
      }
      const genId = document.getElementById('gallery-selected-image-gen-id');
      const seed = document.getElementById('gallery-selected-image-seed');
      const goToConversationButton = document.getElementById('go-to-conversation');
      goToConversationButton.href = selectedGalleryImage?.conversation_id ? `https://chat.openai.com/c/${selectedGalleryImage?.conversation_id}` : 'https://chat.openai.com';
      const moreBy = document.getElementById('more-by');
      if (imageGalleryCurrentTab === 'public') {
        genId.parentElement.parentElement.classList.add('invisible');
        seed.parentElement.parentElement.classList.add('invisible');
        goToConversationButton.classList.add('invisible');
        // moreBy.classList.remove('invisible');
      } else {
        genId.textContent = selectedGalleryImage.gen_id;
        genId.parentElement.parentElement.classList = `flex my-1 ${selectedGalleryImage.gen_id ? 'visible' : 'invisible'}`;
        seed.textContent = selectedGalleryImage.seed;
        seed.parentElement.parentElement.classList = `flex my-1 ${selectedGalleryImage.seed ? 'visible' : 'invisible'}`;
        goToConversationButton.classList.remove('invisible');
        moreBy.classList.add('invisible');
      }
    });
  });
}
function addUserFilter(user) {
  const existingFilters = document.querySelectorAll('#gallery-filter');
  existingFilters.forEach((filter) => filter.remove());
  const galleryHeader = document.getElementById('gallery-header');
  const galleryFilter = document.createElement('div');
  galleryFilter.id = 'gallery-filter';
  galleryFilter.classList = 'flex items-center justify-between py-2 text-token-text-primary';
  galleryFilter.innerHTML = `<div class="flex items-center gap-2 py-1 px-3 border border-token-border-heavy rounded-full"><div class="text-xs">Images by user id: ${user?.id}</div><button id="remove-filter-button" class="transition text-token-text-secondary hover:text-token-text-primary" aria-label="remove filter" type="button"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-md" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div><div class="flex"><button id="toggle-gallery-sidebar" class="btn relative btn-small md:inline-flex" aria-label="Toggle Sidebar"><div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-md" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg></div></button></div>`;
  // add filter after header
  galleryHeader.insertAdjacentElement('afterend', galleryFilter);
  // add filter event listener
  const removeFilterButton = document.getElementById('remove-filter-button');
  removeFilterButton?.addEventListener('click', () => {
    loadImageList();
  });
}
function resetSidebar() {
  const selectedImage = document.getElementById('gallery-selected-image');
  selectedImage.src = chrome.runtime.getURL('images/loading.gif');
  selectedImage.style.aspectRatio = 1;
  const selectedImageTime = document.getElementById('gallery-selected-image-timestamp');
  selectedImageTime.textContent = '...';
  const selectedImagePromptTitle = document.getElementById('gallery-selected-image-prompt-title');
  selectedImagePromptTitle.textContent = imageGalleryCurrentTab === 'chart' ? 'Code' : 'Prompt';
  const prompt = document.getElementById('gallery-selected-image-prompt');
  prompt.innerHTML = '...';
  const genId = document.getElementById('gallery-selected-image-gen-id');
  const seed = document.getElementById('gallery-selected-image-seed');
  const goToConversationButton = document.getElementById('go-to-conversation');
  const moreBy = document.getElementById('more-by');
  const menuButton = document.querySelector('#image-gallery-menu-button');
  if (imageGalleryCurrentTab === 'public') {
    menuButton?.classList?.add('invisible');
    genId.parentElement.parentElement.classList.add('invisible');
    seed.parentElement.parentElement.classList.add('invisible');
    goToConversationButton.classList.add('invisible');
    // moreBy.classList.remove('invisible');
  } else {
    menuButton?.classList?.remove('invisible');
    genId.parentElement.parentElement.classList.remove('invisible');
    genId.textContent = '';
    seed.parentElement.parentElement.classList.remove('invisible');
    seed.textContent = '';
    goToConversationButton.classList.remove('invisible');
    moreBy.classList.add('invisible');
  }
}
function codeWrapper(code) {
  if (!code) return '';
  const { language } = hljs.highlightAuto(code);
  return `<div class="overflow-y-auto" style="background: #333; padding: 8px; border-radius: 8px;"><code hljs language-${language} id="message-plugin-request-html-36053455-5209-4236-901d-a179d861f092" class="!whitespace-pre-wrap" style="font-size:12px;">${code}</code></div>`;
}
function openSubscriptionModal() {
  const gallery = `<div id="image-gallery" data-state="open" style="z-index:20;" class="dark fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-xl radix-state-open:animate-show" style="pointer-events: auto;"><div class="w-full absolute inset-0 flex items-center flex-wrap justify-center text-token-text-primary m-auto p-4 bg-black rounded-md" style="max-width:400px; max-height:240px;"><div>Image gallery requires a Superpower ChatGPT Pro subscription. Upgrade to Pro to see the full list of all of your images. You can search, see the prompts, and download all images! <a href="https://www.youtube.com/watch?v=oU6_wgJLYEM&ab_channel=Superpower" target="_blank" class="underline text-gold" rel="noreferrer">Learn more</a> about Image Gallery!</div><button id="cancel-button" class="btn p-3 relative btn-neutral" as="button"><div class="flex w-full gap-2 items-center justify-center">Cancel</div></button><button id="upgrade-to-pro-button-gallery" class="flex flex-wrap px-3 py-1 items-center rounded-md bg-gold hover:bg-gold-dark transition-colors duration-200 text-black cursor-pointer text-sm m-4 font-bold" style="width: 230px;"><div class="flex w-full"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width:20px; height:20px; margin-right:6px;position:relative; top:10px;" stroke="purple" fill="purple"><path d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z"></path></svg> Upgrade to Pro</div><div style="font-size:10px;font-weight:400;margin-left:28px;" class="flex w-full">GPT Store, Image Gallery, Voice & more</div></button></div><img src="${chrome.runtime.getURL('images/gallery.png')}"></div>`;
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
  galleryButton.classList = 'flex py-3 px-3 items-center gap-3 rounded-md hover:bg-token-main-surface-tertiary transition-colors duration-200 text-token-text-primary cursor-pointer text-sm';
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
