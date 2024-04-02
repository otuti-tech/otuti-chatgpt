/* eslint-disable no-restricted-globals */
/* global isDescendant, selectedImageGalleryImageIds:true, imageGalleryCurrentTab, JSZip, saveAs, showConfirmDialog, toast */
/* eslint-disable no-unused-vars */
function imageGalleryMenu() {
  return `<div id="image-gallery-menu" class="mr-4" style="min-width:48px;max-width:48px;z-index:100;margin-left:56px;"><button id="image-gallery-menu-button" class="${imageGalleryCurrentTab === 'public' ? 'invisible' : ''} relative w-full flex items-center cursor-pointer rounded-md border bg-token-main-surface-primary border-token-border-light p-2 text-center focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 sm:text-sm" type="button">
  <span class="flex items-center justify-center w-full truncate font-semibold text-token-text-primary">
<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" viewBox="0 0 448 512"><path d="M0 88C0 74.75 10.75 64 24 64H424C437.3 64 448 74.75 448 88C448 101.3 437.3 112 424 112H24C10.75 112 0 101.3 0 88zM0 248C0 234.7 10.75 224 24 224H424C437.3 224 448 234.7 448 248C448 261.3 437.3 272 424 272H24C10.75 272 0 261.3 0 248zM424 432H24C10.75 432 0 421.3 0 408C0 394.7 10.75 384 24 384H424C437.3 384 448 394.7 448 408C448 421.3 437.3 432 424 432z"/></svg></span>
</button>
  </div>`;
}
function imageGalleryMenuOptions() {
  return `<ul id="image-gallery-menu-options" style="max-height:400px;width:280px;" class="block transition-all absolute z-10 right-4 mt-1 overflow-auto rounded-md p-1 text-base ring-1 ring-opacity-5 focus:outline-none bg-token-main-surface-primary dark:ring-white/20 dark:last:border-0 sm:text-sm -translate-x-1/4" role="menu" aria-orientation="vertical" tabindex="-1">
  ${imageGalleryCurrentTab !== 'public' ? `

  <li class="relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="image-gallery-menu-option-download" role="option" tabindex="-1">
  <div class="flex items-center text-token-text-primary" style="margin-bottom:6px;">
  <svg stroke="currentColor" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.70711 10.2929C7.31658 9.90237 6.68342 9.90237 6.29289 10.2929C5.90237 10.6834 5.90237 11.3166 6.29289 11.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L17.7071 11.7071C18.0976 11.3166 18.0976 10.6834 17.7071 10.2929C17.3166 9.90237 16.6834 9.90237 16.2929 10.2929L13 13.5858L13 4C13 3.44771 12.5523 3 12 3C11.4477 3 11 3.44771 11 4L11 13.5858L7.70711 10.2929ZM5 19C4.44772 19 4 19.4477 4 20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19L5 19Z" fill="currentColor"></path></svg>
    <span class="font-semibold flex h-6 items-center gap-1 truncate text-token-text-primary">Download ${selectedImageGalleryImageIds.length > 0 ? 'selected' : 'all'} images</span>
  </div>
  </li>

  ${imageGalleryCurrentTab === 'dalle' ? `
  <li class="relative cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="image-gallery-menu-option-public" role="option" tabindex="-1">
  <div class="flex items-center text-token-text-primary" style="margin-bottom:6px;">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2" height="1em" width="1em"><path d="M319.9 320c57.41 0 103.1-46.56 103.1-104c0-57.44-46.54-104-103.1-104c-57.41 0-103.1 46.56-103.1 104C215.9 273.4 262.5 320 319.9 320zM369.9 352H270.1C191.6 352 128 411.7 128 485.3C128 500.1 140.7 512 156.4 512h327.2C499.3 512 512 500.1 512 485.3C512 411.7 448.4 352 369.9 352zM512 160c44.18 0 80-35.82 80-80S556.2 0 512 0c-44.18 0-80 35.82-80 80S467.8 160 512 160zM183.9 216c0-5.449 .9824-10.63 1.609-15.91C174.6 194.1 162.6 192 149.9 192H88.08C39.44 192 0 233.8 0 285.3C0 295.6 7.887 304 17.62 304h199.5C196.7 280.2 183.9 249.7 183.9 216zM128 160c44.18 0 80-35.82 80-80S172.2 0 128 0C83.82 0 48 35.82 48 80S83.82 160 128 160zM551.9 192h-61.84c-12.8 0-24.88 3.037-35.86 8.24C454.8 205.5 455.8 210.6 455.8 216c0 33.71-12.78 64.21-33.16 88h199.7C632.1 304 640 295.6 640 285.3C640 233.8 600.6 192 551.9 192z"/></svg>
    <span class="font-semibold flex h-6 items-center gap-1 truncate text-token-text-primary">Make ${selectedImageGalleryImageIds.length > 0 ? 'selected' : 'all'} images public</span>
  </div>
  </li>
  ` : ''}

  <li class="relative text-red-500 cursor-pointer select-none border-b py-1 pl-3 pr-9 last:border-0 border-token-border-light hover:bg-token-main-surface-secondary" id="image-gallery-menu-option-delete" role="option" tabindex="-1">
  <div class="flex items-center" style="margin-bottom:6px;">
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
    <span class="font-semibold flex h-6 items-center gap-1 truncate text-red-500">Delete ${selectedImageGalleryImageIds.length > 0 ? 'selected' : 'all'} images</span>
    </div>
  </li>
    ` : ''}
  </ul>`;
}
function addImageGalleryMenuEventListener(callback = null) {
  const menuButton = document.querySelector('#image-gallery-menu-button');

  // close optionListDropdown when clicked outside
  document.addEventListener('click', (e) => {
    const optionListDropdown = document.querySelector('#image-gallery-menu-options');

    if (optionListDropdown && !isDescendant(optionListDropdown, e.target)) {
      optionListDropdown.remove();
    }
  });
  const optionSelectorOptions = document.querySelectorAll('[id^=image-gallery-menu-option-]');
  optionSelectorOptions.forEach((option) => {
    option.addEventListener('click', async (e) => {
      // close menu
      const optionListDropdown = document.querySelector('#image-gallery-menu-options');
      optionListDropdown.classList.replace('block', 'hidden');

      const optionId = option.id.split('image-gallery-menu-option-')[1];
      if (optionId === 'download') {
        menuButton.innerHTML = '<svg x="0" y="0" viewbox="0 0 40 40" class="spinner" style="height:24px;"><circle fill="transparent" stroke="#ffffff50" stroke-width="4" stroke-linecap="round" stroke-dasharray="125.6" cx="20" cy="20" r="18"></circle></svg>';
        menuButton.disabled = true;
        await downloadAllImages();
      }
      if (optionId === 'public') {
        showConfirmDialog('Share Images', `Are you sure you want to make ${selectedImageGalleryImageIds.length > 0 ? 'selected' : 'all'} images public?`, 'Confirm', null, async () => {
          await chrome.runtime.sendMessage({
            shareGalleryImages: true,
            detail: {
              imageIds: selectedImageGalleryImageIds,
              category: imageGalleryCurrentTab,
            },
          }, async (res) => {
            if (res?.success) {
              if (selectedImageGalleryImageIds.length === 0) {
                toast('All images are now public');
                return;
              }
              toast('Selected images are now public');
              // remove all selected images
              selectedImageGalleryImageIds.forEach((imageId) => {
                const checkbox = document.querySelector(`#image-gallery-checkbox-${imageId}`);
                if (checkbox) {
                  checkbox.checked = false;
                }
              });
              const curImageGalleryCheckboxes = document.querySelectorAll('[id^="image-gallery-checkbox"]');
              curImageGalleryCheckboxes.forEach((cb) => {
                cb.classList.add('invisible');
              });
              selectedImageGalleryImageIds = [];
            }
          });
        }, 'green');
      }
      if (optionId === 'delete') {
        showConfirmDialog('Delete Images', `Are you sure you want to delete ${selectedImageGalleryImageIds.length > 0 ? 'selected' : 'all'} images?`, 'Confirm', null, async () => {
          await chrome.runtime.sendMessage({
            deleteGalleryImages: true,
            detail: {
              imageIds: selectedImageGalleryImageIds,
              category: imageGalleryCurrentTab,
            },
          }, async (res) => {
            if (res?.success) {
              if (selectedImageGalleryImageIds.length === 0) {
                const galleryImageList = document.querySelector('#gallery-image-list');
                if (galleryImageList) {
                  galleryImageList.innerHTML = '';
                }
                toast('All images are deleted');
                return;
              }
              // remove all selected images
              selectedImageGalleryImageIds.forEach((imageId) => {
                const imageNode = document.querySelector(`#gallery-image-card-${imageId}`);
                if (imageNode) {
                  imageNode.parentElement?.remove();
                }
              });
              const curImageGalleryCheckboxes = document.querySelectorAll('[id^="image-gallery-checkbox"]');
              curImageGalleryCheckboxes.forEach((cb) => {
                cb.classList.add('invisible');
              });
              selectedImageGalleryImageIds = [];
            }
          });
        }, 'red');
      }
    });
  });
}

async function downloadAllImages(conversationId = null) {
  await chrome.runtime.sendMessage({
    getAllGalleryImages: true,
    detail: {
      category: imageGalleryCurrentTab,
      conversationId,
    },
  }, async (allGalleryImages) => {
    if (allGalleryImages.length === 0) {
      toast('No images to download');
      resetMenuButton();
      return;
    }
    const zip = new JSZip();
    const folder = zip.folder('Superpower-ChatGPT-Gallery');
    for (let i = 0; i < allGalleryImages.length; i += 1) {
      const imageNode = allGalleryImages[i];
      const url = decodeURIComponent(imageNode.image);
      const format = url.split('.').pop() || 'png';
      // const filename = imageGalleryCurrentTab === 'dalle' ? `DALL·E ${formatDateDalle()} - ${imageNode?.prompt.replaceAll('.', '_')}.${format}` : `Data Analytic Image ${formatDateDalle()}.${format}`;
      const filename = `${imageNode.conversation_id}/${imageNode.image_id}.${format}`;
      // save the image to zip
      // eslint-disable-next-line no-await-in-loop
      const blob = await fetch(url).then((response) => response.blob());
      folder.file(filename, blob, { binary: true });
    }

    zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }).then((content) => {
      saveAs(content, `${new Date().toISOString().slice(0, 10)}-superpower-chatgpt-gallery.zip`);
      resetMenuButton();
    });
  });
}
function resetMenuButton() {
  const menuButton = document.querySelector('#image-gallery-menu-button');
  if (!menuButton) return;
  menuButton.innerHTML = '<span class="flex items-center justify-center w-full truncate font-semibold text-token-text-primary"><svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" viewBox="0 0 448 512"><path d="M0 88C0 74.75 10.75 64 24 64H424C437.3 64 448 74.75 448 88C448 101.3 437.3 112 424 112H24C10.75 112 0 101.3 0 88zM0 248C0 234.7 10.75 224 24 224H424C437.3 224 448 234.7 448 248C448 261.3 437.3 272 424 272H24C10.75 272 0 261.3 0 248zM424 432H24C10.75 432 0 421.3 0 408C0 394.7 10.75 384 24 384H424C437.3 384 448 394.7 448 408C448 421.3 437.3 432 424 432z"/></svg></span>';
  menuButton.disabled = false;
}
