/* global languageList,toneList, writingStyleList, escapeHtml, getDownloadUrlFromFileId, getFileType */
// eslint-disable-next-line no-unused-vars
function rowUser(conversation, node, childIndex, childCount, name, avatar, settings) {
  const { customConversationWidth, conversationWidth, autoHideThreadCount } = settings;
  const { pinned, message } = node;
  const { id, content, metadata } = message;

  const messageText = content.parts.filter((p) => typeof p === 'string').join('\n');
  const assets = metadata?.attachments || [];
  const replyToText = metadata?.targeted_reply;
  const imageAssets = assets.filter((asset) => getFileType(asset.name) === 'Image');
  // download all assets
  assets?.forEach((asset) => {
    const assetId = asset.id;
    getDownloadUrlFromFileId(assetId).then((response) => {
      const assetElementImage = document.getElementById(`asset-${assetId}`);
      if (assetElementImage) {
        if (getFileType(asset.name) === 'Image') {
          assetElementImage.src = response.download_url;
        } else {
          assetElementImage.style.backgroundImage = `url(${response.download_url})`;
        }
      }
    });
  });

  // remove any text between ## Instructions and ## End Instructions\n\n including the instructions
  const messageContent = messageText.replace(/## Instructions[\s\S]*## End Instructions\n\n/, '');
  const highlightedMessageContent = escapeHtml(messageContent);
  const languageCode = messageText.match(/\(languageCode: (.*)\)/)?.[1];
  const toneCode = messageText.match(/\(toneCode: (.*)\)/)?.[1];
  const writingStyleCode = messageText.match(/\(writingStyleCode: (.*)\)/)?.[1];
  const languageName = languageList.find((lang) => lang.code === languageCode)?.name;
  const toneName = toneList.find((tone) => tone.code === toneCode)?.name;
  const writingStyleName = writingStyleList.find((writingStyle) => writingStyle.code === writingStyleCode)?.name;
  return `<div id="message-wrapper-${id}" data-role="user"
  class="group w-full text-token-text-primary ${pinned ? 'border-l-pinned bg-pinned dark:bg-pinned' : 'bg-token-main-surface-primary'}">
  <div class="relative text-base gap-4 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 flex" style="${customConversationWidth ? `max-width:${conversationWidth}%` : ''}">
    <div class="flex-shrink-0 flex flex-col relative items-end">
      <div class="relative flex gizmo-shadow-stroke"><img alt="User" loading="lazy" width="24" height="24" decoding="async" data-nimg="1"
          class="rounded-full"
          src="${avatar}"
          style="color: transparent;">
      </div>
      
      <div id="thread-buttons-wrapper-${id}" class="text-xs flex items-center justify-center gap-1 ${autoHideThreadCount || (childCount === 1) ? 'invisible' : ''} absolute left-0 top-2 -ml-4 -translate-x-full ${childCount > 1 ? 'group-hover:visible' : ''}"><button id="thread-prev-button-${id}" class="dark:text-white disabled:text-gray-300 dark:disabled:text-gray-400" ${childIndex === 1 ? 'disabled' : ''}><svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="15 18 9 12 15 6"></polyline></svg></button><span id="thread-count-wrapper-${id}" class="flex-grow flex-shrink-0">${childIndex} / ${childCount}</span><button id="thread-next-button-${id}" ${childIndex === childCount ? 'disabled' : ''} class="dark:text-white disabled:text-gray-300 dark:disabled:text-gray-400"><svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="9 18 15 12 9 6"></polyline></svg></button></div>
    </div>
    <div class="relative flex flex-col" style="width: calc(100% - 80px);">
    <div class="font-semibold select-none">You</div>
      <div class="flex flex-grow flex-col gap-1">
        ${replyToText ? `<div id="message-reply-to-preview-${id}" class="mt-2 flex flex-col text-token-text-primary"><div class="text-sm text-token-text-tertiary">Replying to:</div><div class="mt-2 overflow-y-auto whitespace-pre-wrap break-words border-l-2 border-token-border-heavy px-3">${replyToText}</div></div>` : ''}
        <div id="message-text-${id}" dir="auto" class="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap" style="overflow-wrap:anywhere;">${assetElements(assets)}${highlightedMessageContent}</div>
        
        <div id="message-edit-wrapper-${id}" class="flex empty:hidden mt-1 justify-start gap-3 lg:flex"><div class="text-token-text-secondary flex self-end lg:self-center lg:justify-start mt-2 mt-0 visible gap-1">
        
        <button id="message-pin-button-${id}" title="pin/unpin message" class="pl-0 rounded-md text-token-text-tertiary hover:text-token-text-primary md:invisible md:group-hover:visible md:group-[.final-completion]:visible"><div class="flex items-center gap-1.5 text-xs"><svg stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="none" class="icon-sm"><path fill="${pinned ? 'gold' : 'currentColor'}" d="M336 0h-288C21.49 0 0 21.49 0 48v431.9c0 24.7 26.79 40.08 48.12 27.64L192 423.6l143.9 83.93C357.2 519.1 384 504.6 384 479.9V48C384 21.49 362.5 0 336 0zM336 452L192 368l-144 84V54C48 50.63 50.63 48 53.1 48h276C333.4 48 336 50.63 336 54V452z"/></svg></div></button>

        <button id="message-add-to-library-button-${id}" title="Share in cummunity prompts" class="pl-0 rounded-md text-token-text-tertiary hover:text-token-text-primary md:invisible md:group-hover:visible md:group-[.final-completion]:visible"><div class="flex items-center gap-1.5 text-xs"><svg stroke="currentColor" fill="currentColor" stroke-width="2" viewBox="0 0 448 512" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"> <path d="M432 256C432 269.3 421.3 280 408 280h-160v160c0 13.25-10.75 24.01-24 24.01S200 453.3 200 440v-160h-160c-13.25 0-24-10.74-24-23.99C16 242.8 26.75 232 40 232h160v-160c0-13.25 10.75-23.99 24-23.99S248 58.75 248 72v160h160C421.3 232 432 242.8 432 256z"> </path> </svg></div></button>
        
        ${imageAssets?.length > 0 ? '' : `<button id="message-edit-button-${id}" title="Edit" class="pl-0 rounded-md text-token-text-tertiary hover:text-token-text-primary md:invisible md:group-hover:visible md:group-[.final-completion]:visible"><div class="flex items-center gap-1.5 text-xs"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.2929 4.29291C15.0641 2.52167 17.9359 2.52167 19.7071 4.2929C21.4783 6.06414 21.4783 8.93588 19.7071 10.7071L18.7073 11.7069L11.1603 19.2539C10.7182 19.696 10.1489 19.989 9.53219 20.0918L4.1644 20.9864C3.84584 21.0395 3.52125 20.9355 3.29289 20.7071C3.06453 20.4788 2.96051 20.1542 3.0136 19.8356L3.90824 14.4678C4.01103 13.8511 4.30396 13.2818 4.7461 12.8397L13.2929 4.29291ZM13 7.41422L6.16031 14.2539C6.01293 14.4013 5.91529 14.591 5.88102 14.7966L5.21655 18.7835L9.20339 18.119C9.40898 18.0847 9.59872 17.9871 9.7461 17.8397L16.5858 11L13 7.41422ZM18 9.5858L14.4142 6.00001L14.7071 5.70712C15.6973 4.71693 17.3027 4.71693 18.2929 5.70712C19.2831 6.69731 19.2831 8.30272 18.2929 9.29291L18 9.5858Z" fill="currentColor"></path></svg></div></button>`}
        
        </div></div>
      </div>
    </div>
    <div class="absolute left-0 flex" style="bottom:-12px;left:16px;">
      ${languageName ? `<div id="language-code-${id}" title="You changed the response language here. This prompt includes a hidden language instructions" class="h-6 p-2 mr-1 flex items-center justify-center rounded-md border text-xs text-token-text-tertiary border-token-border-light bg-token-main-surface-secondary">Language: &nbsp<b>${languageName}</b></div>` : ''}
      ${toneName ? `<div id="tone-code-${id}" title="You changed the response tone here. This prompt includes a hidden tone instructions" class="h-6 p-2 mr-1 flex items-center justify-center rounded-md border text-xs text-token-text-tertiary border-token-border-light bg-token-main-surface-secondary">Tone: &nbsp<b>${toneName}</b></div>` : ''}
      ${writingStyleName ? `<div id="writing-style-code-${id}" title="You changed the response writing style here. This prompt includes a hidden writing style instructions" class="h-6 p-2 mr-1 flex items-center justify-center rounded-md border text-xs text-token-text-tertiary border-token-border-light bg-token-main-surface-secondary">Writing Style: &nbsp<b>${writingStyleName}</b></div>` : ''}
    </div>
  </div>
</div>
`;
}
function assetElements(assets) {
  if (assets?.length === 0) return '';
  const nonImageAssets = assets.filter((asset) => getFileType(asset.name) !== 'Image');
  const imageAssets = assets.filter((asset) => getFileType(asset.name) === 'Image');
  // eslint-disable-next-line no-nested-ternary
  return `${nonImageAssets.length > 0 ? `<div class="flex gap-2 flex-wrap">
  ${nonImageAssets.map((asset) => assetElement(nonImageAssets, imageAssets, asset)).join('')}
  </div>` : ''}${imageAssets.length > 0 ? `<div class="${imageAssets.length === 1 ? 'grid' : 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'}">
  ${imageAssets.map((asset) => assetElement(nonImageAssets, imageAssets, asset)).join('')}
  </div>` : ''}`;
}
function assetElement(nonImageAssets, imageAssets, asset) {
  const isImage = getFileType(asset.name) === 'Image';
  return isImage
    ? `<div class="relative mt-1 flex h-auto w-full max-w-lg items-center justify-center overflow-hidden bg-token-main-surface-tertiary text-token-text-primary ${imageAssets.length === 1 ? '' : 'aspect-square'}"><button type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r7p:" data-state="closed"><img id="asset-${asset.id}" alt="Uploaded image" loading="lazy" width="${asset.width}" height="${asset.height}" decoding="async" data-nimg="1" class="max-w-full transition-opacity duration-300 opacity-100" src="" style="color: transparent;"></button></div>`
    : `<div class="group relative inline-block text-sm text-token-text-primary"><div class="relative overflow-hidden bg-token-main-surface-tertiary rounded-xl"><div class="p-2 w-80"><div class="flex flex-row items-center gap-2"><div class="relative h-10 w-10 overflow-hidden rounded-md">${getThumbnail(getFileType(asset.name), asset.id)}</div><div class="overflow-hidden"><div class="truncate font-medium">${asset.name}</div><div class="truncate text-token-text-tertiary">${getFileType(asset.name)}</div></div></div></div></div></div>`;
}
function getThumbnail(fileType, assetId = '') {
  switch (fileType) {
    case 'Image':
      return `<button type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r58:" data-state="closed" class="h-full w-full"><span  id="asset-${assetId}" class="flex items-center h-full w-full justify-center bg-gray-500 dark:bg-gray-700 bg-cover bg-center text-white" style="background-image: url(&quot;&quot;);"></span></button>`;
    case 'Spreadsheet':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" class="h-10 w-10 flex-shrink-0" width="36" height="36"><rect width="36" height="36" rx="6" fill="#10A37F"></rect><path d="M15.5 10.5H12.1667C11.2462 10.5 10.5 11.2462 10.5 12.1667V13.5V18M15.5 10.5H23.8333C24.7538 10.5 25.5 11.2462 25.5 12.1667V13.5V18M15.5 10.5V25.5M15.5 25.5H18H23.8333C24.7538 25.5 25.5 24.7538 25.5 23.8333V18M15.5 25.5H12.1667C11.2462 25.5 10.5 24.7538 10.5 23.8333V18M10.5 18H25.5" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    case 'PDF':
    case 'Document':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" class="h-10 w-10 flex-shrink-0" width="36" height="36"><rect width="36" height="36" rx="6" fill="#FF5588"></rect><path d="M19.6663 9.66663H12.9997C12.5576 9.66663 12.1337 9.84222 11.8212 10.1548C11.5086 10.4673 11.333 10.8913 11.333 11.3333V24.6666C11.333 25.1087 11.5086 25.5326 11.8212 25.8451C12.1337 26.1577 12.5576 26.3333 12.9997 26.3333H22.9997C23.4417 26.3333 23.8656 26.1577 24.1782 25.8451C24.4907 25.5326 24.6663 25.1087 24.6663 24.6666V14.6666L19.6663 9.66663Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.667 9.66663V14.6666H24.667" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21.3337 18.8334H14.667" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21.3337 22.1666H14.667" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.3337 15.5H15.5003H14.667" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    case 'File':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" class="h-10 w-10 flex-shrink-0" width="36" height="36"><rect width="36" height="36" rx="6" fill="#0000FF"></rect><path d="M18.833 9.66663H12.9997C12.5576 9.66663 12.1337 9.84222 11.8212 10.1548C11.5086 10.4673 11.333 10.8913 11.333 11.3333V24.6666C11.333 25.1087 11.5086 25.5326 11.8212 25.8451C12.1337 26.1577 12.5576 26.3333 12.9997 26.3333H22.9997C23.4417 26.3333 23.8656 26.1577 24.1782 25.8451C24.4907 25.5326 24.6663 25.1087 24.6663 24.6666V15.5L18.833 9.66663Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.833 9.66663V15.5H24.6663" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    case 'JavaScript':
    case 'Python':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" class="h-10 w-10 flex-shrink-0" width="36" height="36"><rect width="36" height="36" rx="6" fill="#FF6E3C"></rect><path d="M21.333 23L26.333 18L21.333 13" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.667 13L9.66699 18L14.667 23" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    default:
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" class="h-10 w-10 flex-shrink-0" width="36" height="36"><rect width="36" height="36" rx="6" fill="#0000FF"></rect><path d="M18.833 9.66663H12.9997C12.5576 9.66663 12.1337 9.84222 11.8212 10.1548C11.5086 10.4673 11.333 10.8913 11.333 11.3333V24.6666C11.333 25.1087 11.5086 25.5326 11.8212 25.8451C12.1337 26.1577 12.5576 26.3333 12.9997 26.3333H22.9997C23.4417 26.3333 23.8656 26.1577 24.1782 25.8451C24.4907 25.5326 24.6663 25.1087 24.6663 24.6666V15.5L18.833 9.66663Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.833 9.66663V15.5H24.6663" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
  }
}
