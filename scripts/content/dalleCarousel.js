/* global downloadFileFrmoUrl, formatDateDalle, toast */
let selectedCarouselImage = null;
// eslint-disable-next-line no-unused-vars
function openDalleCarousel(images, imageElement, messageId, index) {
  selectedCarouselImage = images[index];
  return `<div id="dalle-carousel" data-state="open" style="z-index:20;" class="dark fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-xl radix-state-open:animate-show" style="pointer-events: auto;"><div role="dialog" id="radix-:rl:" aria-describedby="radix-:rn:" aria-labelledby="radix-:rm:" data-state="open" class="relative flex h-screen w-screen justify-stretch divide-x divide-white/10 focus:outline-none radix-state-open:animate-contentShow" tabindex="-1" style="pointer-events: auto;"><div id="dalle-carousel-image-wrapper" class="flex flex-1 transition-[flex-basis]"><div class="flex flex-1 flex-col md:p-6"><div class="flex justify-between px-6 py-2 pt-6 text-token-text-primary sm:mb-4 md:mt-2 md:px-0 md:py-2"><button id="carousel-close-button" class="transition text-token-text-secondary hover:text-token-text-primary" aria-label="Close Modal" type="button"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-md" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button><div><button id="download-carousel-image-button" class="btn relative btn-small" aria-label="Download Image"><div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-md" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></div></button><button id="toggle-carousel-sidebar" class="btn relative btn-small md:inline-flex" aria-label="Toggle Sidebar"><div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-md" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg></div></button></div></div><div class="relative flex flex-1 flex-col items-center justify-center overflow-hidden"><div class="absolute grid h-full w-full grid-rows-2" draggable="false" data-projection-id="38" style="z-index: 1; opacity: 1; transform: none; user-select: none; touch-action: pan-y;"><img id="carousel-center-image" src="${imageElement.src}" alt="${selectedCarouselImage?.metadata?.dalle?.prompt?.replace(/[^a-zA-Z0-9 ]/gi, '') || 'Generated by DALL·E'}" class="row-span-4 mx-auto h-full rounded object-scale-down" data-projection-id="39"></div></div><div class="flex items-center justify-center gap-4 p-8 text-token-text-primary"><button id="carousel-thumbnail-previous-button" class="btn relative btn-small" aria-label="Previous Image"><div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-md" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></div></button>${images.map((image, i) => `<img id="carousel-thumbnail-image-${i}" src="${document.querySelector(`img#dalle-image-${messageId}-${i}`)?.src}" alt="${image?.metadata?.dalle?.prompt?.replace(/[^a-zA-Z0-9 ]/gi, '') || 'Generated by DALL·E'}" class="h-12 w-12 cursor-pointer rounded object-cover transition duration-300 hover:opacity-100 ${selectedCarouselImage.asset_pointer === image.asset_pointer ? 'ring-2 ring-white ring-offset-4 ring-offset-black' : 'opacity-25'}" aria-label="Show Image" role="button">`).join('')}<button id="carousel-thumbnail-next" class="btn relative btn-small" aria-label="Next Image"><div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-md" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div></button></div></div></div><div id="dalle-carousel-sidebar" class="flex hidden items-center justify-start overflow-hidden bg-gray-900 text-token-text-primary transition-[flex-basis] duration-500 md:flex md:basis-[25vw]"><div class="w-[25vw]"><div class="flex flex-col items-start gap-3 p-6"><div class="text-sm text-token-text-primary sm:text-base">Prompt</div><div id="carousel-center-image-prompt" class="text-sm line-clamp-6 sm:text-lg">${selectedCarouselImage?.metadata?.dalle?.prompt}</div><button id="carousel-center-image-prompt-copy-button" class="btn relative btn-dark hidden sm:block"><div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Copy</div></button><div id="dalle-image-info-${messageId}-${index}" class=""><div class="flex my-1">Gen ID:&nbsp;<div class="font-bold flex cursor-pointer" id="carousel-center-image-gen-id-copy-button">${selectedCarouselImage?.metadata?.dalle?.gen_id}<button class="flex ml-1 gap-2 items-center rounded-md p-1 text-xs text-token-text-secondary hover:text-token-text-primary"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg></button></div></div><div class="flex my-1">Seed:&nbsp;<div class="font-bold flex cursor-pointer" id="carousel-center-image-seed-copy-button">${selectedCarouselImage?.metadata?.dalle?.seed}<button class="flex ml-1 gap-2 items-center rounded-md p-1 text-xs text-token-text-secondary hover:text-token-text-primary"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg></button></div></div></div></div></div></div></div></div>`;
}
// eslint-disable-next-line no-unused-vars
function addDalleCarouselEventListeners(images) {
  // close carousel
  const closeCarouselButton = document.getElementById('carousel-close-button');
  closeCarouselButton.addEventListener('click', () => {
    const carouselElement = document.getElementById('dalle-carousel');
    carouselElement.remove();
  });
  // sidebar hide/close
  const toggleCarouselSidebarButton = document.getElementById('toggle-carousel-sidebar');
  toggleCarouselSidebarButton.addEventListener('click', () => {
    const ImageWrapper = document.getElementById('dalle-carousel-image-wrapper');
    const sidebar = document.getElementById('dalle-carousel-sidebar');
    const sidebarIsOpen = sidebar.classList.contains('md:basis-[25vw]');
    if (sidebarIsOpen) {
      sidebar.classList.replace('md:basis-[25vw]', 'md:basis-0');
      ImageWrapper.classList.add('md:basis-[75vw]');
    } else {
      sidebar.classList.replace('md:basis-0', 'md:basis-[25vw]');
      ImageWrapper.classList.remove('md:basis-[75vw]');
    }
  });
  // copy prompt
  const copyPromptButton = document.getElementById('carousel-center-image-prompt-copy-button');
  copyPromptButton.addEventListener('click', () => {
    copyPromptButton.innerHTML = '<div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Copied!</div>';
    copyPromptButton.classList = 'opacity-50 hover:bg-inherit cursor-not-allowed btn relative btn-dark hidden sm:block';
    setTimeout(() => {
      copyPromptButton.innerHTML = '<div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Copy</div>';
      copyPromptButton.classList = 'btn relative btn-dark hidden sm:block';
    }, 2000);
    const prompt = document.getElementById('carousel-center-image-prompt');
    navigator.clipboard.writeText(prompt.textContent);
  });
  // copy gen id
  const copyGenIdButton = document.getElementById('carousel-center-image-gen-id-copy-button');
  copyGenIdButton.addEventListener('click', () => {
    navigator.clipboard.writeText(copyGenIdButton.innerText);
    toast('Copied Gen ID to clipboard');
  });
  // copy seed
  const copySeedButton = document.getElementById('carousel-center-image-seed-copy-button');
  copySeedButton.addEventListener('click', () => {
    navigator.clipboard.writeText(copySeedButton.innerText);
    toast('Copied Seed to clipboard');
  });
  // download center image
  const downloadImageButton = document.getElementById('download-carousel-image-button');
  downloadImageButton.addEventListener('click', () => {
    const centerImage = document.getElementById('carousel-center-image');
    // https://files.oaiusercontent.com/file-MAcPd1cwpgOEKaHunto1s83I?se=2024-02-20T20%3A58%3A19Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D8e990274-b6ba-4f1b-85c1-de679c9dc7b7.webp&sig=azzu0KrecTGhXBhtBDIPfIDUsO9ohL6vvVAqx6hcJEs%3D
    // get formet from centerImage.src (webp)
    const url = decodeURIComponent(centerImage.src);
    const fileName = url?.split('filename=')?.[1]?.split('&')?.[0];
    const format = fileName?.split('.')?.pop() || 'png';
    const filename = `DALL·E ${formatDateDalle()} - ${centerImage.alt}.${format}`;
    downloadFileFrmoUrl(centerImage.src, filename);
  });

  // thumbnail image click
  const thumbnailImages = document.querySelectorAll('[id^="carousel-thumbnail-image-"]');
  thumbnailImages.forEach((image, i) => {
    image.addEventListener('click', () => {
      const centerImage = document.getElementById('carousel-center-image');
      const centerImagePrompt = document.getElementById('carousel-center-image-prompt');
      centerImage.src = image.src;
      centerImage.alt = image.alt;
      centerImagePrompt.textContent = image.alt;
      selectedCarouselImage = images[i];
      thumbnailImages.forEach((thumbnailImage) => {
        thumbnailImage.classList.remove('ring-2', 'ring-white', 'ring-offset-4', 'ring-offset-black');
        thumbnailImage.classList.add('opacity-25');
      });
      image.classList.remove('opacity-25');
      image.classList.add('ring-2', 'ring-white', 'ring-offset-4', 'ring-offset-black');
    });
  });

  // thumbnail previous
  const thumbnailPreviousButton = document.getElementById('carousel-thumbnail-previous-button');
  thumbnailPreviousButton.addEventListener('click', () => {
    const centerImage = document.getElementById('carousel-center-image');
    const centerImagePrompt = document.getElementById('carousel-center-image-prompt');
    const currentImageIndex = images.findIndex((image) => image.asset_pointer === selectedCarouselImage.asset_pointer);
    const previousImageIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    const previousImage = document.getElementById(`carousel-thumbnail-image-${previousImageIndex}`);
    centerImage.src = previousImage.src;
    centerImage.alt = previousImage.alt;
    centerImagePrompt.textContent = previousImage.alt;
    selectedCarouselImage = images[previousImageIndex];
    thumbnailImages.forEach((thumbnailImage) => {
      thumbnailImage.classList.remove('ring-2', 'ring-white', 'ring-offset-4', 'ring-offset-black');
      thumbnailImage.classList.add('opacity-25');
    });
    previousImage.classList.remove('opacity-25');
    previousImage.classList.add('ring-2', 'ring-white', 'ring-offset-4', 'ring-offset-black');
  });

  // thumbnail next
  const thumbnailNextButton = document.getElementById('carousel-thumbnail-next');
  thumbnailNextButton.addEventListener('click', () => {
    const centerImage = document.getElementById('carousel-center-image');
    const centerImagePrompt = document.getElementById('carousel-center-image-prompt');
    const currentImageIndex = images.findIndex((image) => image.asset_pointer === selectedCarouselImage.asset_pointer);
    const nextImageIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    const nextImage = document.getElementById(`carousel-thumbnail-image-${nextImageIndex}`);
    centerImage.src = nextImage.src;
    centerImage.alt = nextImage.alt;
    centerImagePrompt.textContent = nextImage.alt;
    selectedCarouselImage = images[nextImageIndex];
    thumbnailImages.forEach((thumbnailImage) => {
      thumbnailImage.classList.remove('ring-2', 'ring-white', 'ring-offset-4', 'ring-offset-black');
      thumbnailImage.classList.add('opacity-25');
    });
    nextImage.classList.remove('opacity-25');
    nextImage.classList.add('ring-2', 'ring-white', 'ring-offset-4', 'ring-offset-black');
  });
}
