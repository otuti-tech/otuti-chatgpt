/* eslint-disable no-restricted-globals */
/* global markdown, katex, texmath, markdownitSup, hljs, getDownloadUrlFromFileId, addMessagePluginToggleButtonsEventListeners, formatTime, openDalleCarousel, addCopyCodeButtonsEventListeners, addDalleCarouselEventListeners, toast, downloadFileFrmoUrl, formatDateDalle */
// const diffdom = new diffDOM.DiffDOM({ valueDiffing: false, diffcap: 1 });

// eslint-disable-next-line no-unused-vars
function rowAssistant(conversation, nodes, childIndex, childCount, models, settings, gizmoData, isLoading = false) {
  const {
    customConversationWidth, conversationWidth, autoHideThreadCount, showMessageTimestamp, showWordCount, pluginDefaultOpen, showCopyButton,
  } = settings;

  // overall info
  const { pinned, message: lastMessage } = nodes[nodes.length - 1];
  const {
    id, create_time: createTime, metadata,
  } = lastMessage;

  const shouldShowContinueButton = lastMessage?.status && (lastMessage?.status === 'finished_partial_completion' || metadata?.finish_details?.type === 'max_tokens');
  const modelSlug = metadata.model_slug;
  const messageTimestamp = new Date(formatTime(createTime)).toLocaleString();
  const modelTitle = models.find((m) => m.slug === modelSlug)?.title;
  const avatarColor = (modelSlug?.includes('plugins') || modelSlug?.includes('gpt-4')) ? 'rgb(171, 104, 255)' : 'rgb(25, 195, 125)';
  const avatar = (gizmoData && gizmoData?.resource?.gizmo?.id === nodes[0]?.message?.metadata?.gizmo_id) ? gizmoData?.resource?.gizmo?.display?.profile_picture_url : 'https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png';
  let renderedNodes = '';
  let nodeWordCounts = 0;
  let nodeCharCounts = 0;
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    const role = node.message?.role || node.message?.author?.role;
    const recipient = node.message?.recipient;
    if (role === 'assistant') {
      if (recipient === 'all') { // assistant to all (user)
        const { renderedNode, wordCount, charCount } = assistantRenderer(node);
        renderedNodes += renderedNode;
        nodeWordCounts += wordCount;
        nodeCharCounts += charCount;
      } else { // assistant to plugin
        renderedNodes += pluginDropdownRenderer(node, isLoading, pluginDefaultOpen);
      }
    } else { // role == 'tool'
      // tool to all
      if (recipient === 'all') {
        // check if metadata has a key = invoked_plugin. if key jit_plugin_data it's action response and will be skipped since it's already rendered in actionConfirmationRenderer
        const isPluginResponse = 'invoked_plugin' in node.message.metadata || node.message.author.name === 'python';
        const imageDisplayed = node?.message?.content?.text?.includes('<<ImageDisplayed>>');
        if (isPluginResponse) {
          if (imageDisplayed) {
            renderedNodes += pythonImageSkeleton(node);
          } else {
            // create an html element from rendered nodes
            const el = document.createElement('div');
            el.innerHTML = renderedNodes;
            const lastMessagePluginContent = [...el.querySelectorAll('[id^=message-plugin-content-]')].pop();
            lastMessagePluginContent?.insertAdjacentHTML('beforeend', pluginContentRenderer(node));
            renderedNodes = el.innerHTML;
          }
        }
        // tool to assistant (Action Request)
      } else if (recipient === 'assistant') {
        const requestNode = node;
        const responseNode = conversation.mapping[requestNode.children[childIndex - 1]];
        renderedNodes += actionConfirmationRenderer(requestNode, responseNode);
      }
    }
  }

  return `<div id="message-wrapper-${id}" data-role="assistant"
  class="group w-full text-token-text-primary border-b border-black/10 dark:border-gray-900/50 ${pinned ? 'border-l-pinned bg-pinned dark:bg-pinned' : 'bg-token-main-surface-tertiary'}">
  <div class="relative text-base gap-4 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 p-4 md:py-6 lg:px-0" style="${customConversationWidth ? `max-width:${conversationWidth}%` : ''}">
  ${showMessageTimestamp ? `<div style="position: absolute; bottom: 4px; left: 0px; font-size: 10px; color: rgb(153, 153, 153); opacity: 0.8;">${messageTimestamp}</div>` : ''}
  <button id="message-pin-button-${id}" title="pin/unpin message" class="${pinned ? 'visible' : 'invisible group-hover:visible'}" style="background-color: transparent; border: none; cursor: pointer;width: 18px; position: absolute; top: -8px; right: 6px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="${pinned ? 'gold' : '#aaa'}" d="M48 0H336C362.5 0 384 21.49 384 48V487.7C384 501.1 373.1 512 359.7 512C354.7 512 349.8 510.5 345.7 507.6L192 400L38.28 507.6C34.19 510.5 29.32 512 24.33 512C10.89 512 0 501.1 0 487.7V48C0 21.49 21.49 0 48 0z"/></svg></button>
    <div class="flex-shrink-0 flex flex-col relative items-end">
    ${(gizmoData || nodes[0]?.message?.metadata?.gizmo_id) ? `<div class="relative flex h-9 w-9"><img id="gizmo-avatar" data-gizmoid="${nodes[0]?.message?.metadata?.gizmo_id || gizmoData?.resource?.gizmo?.id}" src="${avatar}" class="h-full w-full bg-token-main-surface-tertiary rounded-full" alt="GPT" width="80" height="80">
        </div>` : `<div style="background-color:${avatarColor};width:36px;height:36px;" title="${modelTitle}"
        class="relative p-1 rounded-full h-9 w-9 text-white flex items-center justify-center"><svg
          width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg"
          stroke-width="1.5" class="h-6 w-6">
          <path
            d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
            fill="currentColor"></path>
        </svg></div>`}
      <div id="thread-buttons-wrapper-${id}" class="text-xs flex items-center justify-center gap-1 ${autoHideThreadCount || (childCount === 1) ? 'invisible' : ''} absolute left-0 top-2 -ml-4 -translate-x-full ${childCount > 1 ? 'group-hover:visible' : ''}"><button id="thread-prev-button-${id}" class="dark:text-white disabled:text-gray-300 dark:disabled:text-gray-400" ${childIndex === 1 ? 'disabled' : ''}><svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="15 18 9 12 15 6"></polyline></svg></button><span id="thread-count-wrapper-${id}" class="flex-grow flex-shrink-0">${childIndex} / ${childCount}</span><button id="thread-next-button-${id}" class="dark:text-white disabled:text-gray-300 dark:disabled:text-gray-400" ${childIndex === childCount ? 'disabled' : ''}><svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="9 18 15 12 9 6"></polyline></svg></button></div>
    </div>
    <div class="relative flex flex-col gap-1 md:gap-3 agent-turn" style="width:calc(100% - 80px);">
      <div class="flex flex-grow flex-col gap-3 max-w-full">
        ${renderedNodes}
        
        <div id="message-feedback-wrapper-${id}" class="flex justify-between empty:hidden gizmo:mt-1 gizmo:justify-start gizmo:gap-3 lg:block gizmo:lg:flex"><div class="text-gray-400 flex self-end lg:self-center justify-center gizmo:lg:justify-start mt-2 gizmo:mt-0 visible gap-1"><div class="flex gap-1"><button id="thumbs-up-button-${id}" class="p-1 gizmo:pl-0 rounded-md text-token-text-tertiary hover:text-token-text-primary md:invisible md:group-hover:visible md:group-[.final-completion]:visible"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.1318 2.50389C12.3321 2.15338 12.7235 1.95768 13.124 2.00775L13.5778 2.06447C16.0449 2.37286 17.636 4.83353 16.9048 7.20993L16.354 8.99999H17.0722C19.7097 8.99999 21.6253 11.5079 20.9313 14.0525L19.5677 19.0525C19.0931 20.7927 17.5124 22 15.7086 22H6C4.34315 22 3 20.6568 3 19V12C3 10.3431 4.34315 8.99999 6 8.99999H8C8.25952 8.99999 8.49914 8.86094 8.6279 8.63561L12.1318 2.50389ZM10 20H15.7086C16.6105 20 17.4008 19.3964 17.6381 18.5262L19.0018 13.5262C19.3488 12.2539 18.391 11 17.0722 11H15C14.6827 11 14.3841 10.8494 14.1956 10.5941C14.0071 10.3388 13.9509 10.0092 14.0442 9.70591L14.9932 6.62175C15.3384 5.49984 14.6484 4.34036 13.5319 4.08468L10.3644 9.62789C10.0522 10.1742 9.56691 10.5859 9 10.8098V19C9 19.5523 9.44772 20 10 20ZM7 11V19C7 19.3506 7.06015 19.6872 7.17071 20H6C5.44772 20 5 19.5523 5 19V12C5 11.4477 5.44772 11 6 11H7Z" fill="currentColor"></path></svg></button><button id="thumbs-down-button-${id}" class="p-1 gizmo:pl-0 rounded-md text-token-text-tertiary hover:text-token-text-primary md:invisible md:group-hover:visible md:group-[.final-completion]:visible"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.8727 21.4961C11.6725 21.8466 11.2811 22.0423 10.8805 21.9922L10.4267 21.9355C7.95958 21.6271 6.36855 19.1665 7.09975 16.7901L7.65054 15H6.93226C4.29476 15 2.37923 12.4921 3.0732 9.94753L4.43684 4.94753C4.91145 3.20728 6.49209 2 8.29589 2H18.0045C19.6614 2 21.0045 3.34315 21.0045 5V12C21.0045 13.6569 19.6614 15 18.0045 15H16.0045C15.745 15 15.5054 15.1391 15.3766 15.3644L11.8727 21.4961ZM14.0045 4H8.29589C7.39399 4 6.60367 4.60364 6.36637 5.47376L5.00273 10.4738C4.65574 11.746 5.61351 13 6.93226 13H9.00451C9.32185 13 9.62036 13.1506 9.8089 13.4059C9.99743 13.6612 10.0536 13.9908 9.96028 14.2941L9.01131 17.3782C8.6661 18.5002 9.35608 19.6596 10.4726 19.9153L13.6401 14.3721C13.9523 13.8258 14.4376 13.4141 15.0045 13.1902V5C15.0045 4.44772 14.5568 4 14.0045 4ZM17.0045 13V5C17.0045 4.64937 16.9444 4.31278 16.8338 4H18.0045C18.5568 4 19.0045 4.44772 19.0045 5V12C19.0045 12.5523 18.5568 13 18.0045 13H17.0045Z" fill="currentColor"></path></svg></button><button id="text-to-speech-button-${id}" class="p-1 gizmo:pl-0 rounded-md text-token-text-tertiary hover:text-token-text-primary md:invisible md:group-hover:visible md:group-[.final-completion]:visible"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="none" class="icon-md"><path fill="currentColor" d="M301.2 34.98c-4.201-1.893-8.727-2.902-13.16-2.902c-7.697 0-15.29 2.884-21.27 8.192L131.8 160.1H48c-26.51 0-48 21.48-48 47.96v95.92c0 26.48 21.49 47.96 48 47.96h83.84l134.9 119.8C272.7 477 280.3 479.8 288 479.8c4.438 0 8.959-.9311 13.16-2.835C312.7 471.8 320 460.4 320 447.9V64.12C320 51.54 312.7 40.13 301.2 34.98zM272 412.1L150.1 303.9L48 303.9v-95.83h102.1L272 99.84V412.1zM412.6 182c-4.469-3.623-9.855-5.394-15.2-5.394c-6.951 0-13.83 2.992-18.55 8.797c-8.406 10.24-6.906 25.35 3.375 33.74C393.5 228.4 400 241.8 400 255.1c0 14.17-6.5 27.59-17.81 36.83c-10.28 8.396-11.78 23.5-3.375 33.74c4.719 5.805 11.62 8.802 18.56 8.802c5.344 0 10.75-1.78 15.19-5.399C435.1 311.5 448 284.6 448 255.1S435.1 200.4 412.6 182zM473.1 108.2c-4.455-3.633-9.842-5.41-15.2-5.41c-6.934 0-13.82 2.975-18.58 8.75c-8.406 10.24-6.906 25.35 3.344 33.74C476.6 172.1 496 213.3 496 255.1c0 42.64-19.44 82.1-53.31 110.7c-10.25 8.396-11.75 23.5-3.344 33.74c4.75 5.773 11.62 8.771 18.56 8.771c5.375 0 10.75-1.78 15.22-5.431C518.2 366.9 544 313 544 255.1S518.2 145 473.1 108.2zM534.4 33.4C529.9 29.77 524.5 28 519.2 28c-6.941 0-13.84 2.977-18.6 8.739c-8.406 10.24-6.906 25.35 3.344 33.74C559.9 116.3 592 183.9 592 255.1s-32.09 139.7-88.06 185.5c-10.25 8.396-11.75 23.5-3.344 33.74C505.3 481 512.2 484 519.2 484c5.375 0 10.75-1.779 15.22-5.431C601.5 423.6 640 342.5 640 255.1C640 169.5 601.5 88.34 534.4 33.4z"/></svg></button></div><button id="message-regenerate-button-${id}" title="Regenerate" class="p-1 gizmo:pl-0 rounded-md text-token-text-tertiary hover:text-token-text-primary md:invisible md:group-[.final-completion]:visible"><div class="flex items-center gap-1.5 text-xs"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 2.5C5.05228 2.5 5.5 2.94772 5.5 3.5V5.07196C7.19872 3.47759 9.48483 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C7.1307 21.5 3.11828 17.8375 2.565 13.1164C2.50071 12.5679 2.89327 12.0711 3.4418 12.0068C3.99033 11.9425 4.48712 12.3351 4.5514 12.8836C4.98798 16.6089 8.15708 19.5 12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C9.7796 4.5 7.7836 5.46469 6.40954 7H9C9.55228 7 10 7.44772 10 8C10 8.55228 9.55228 9 9 9H4.5C3.96064 9 3.52101 8.57299 3.50073 8.03859C3.49983 8.01771 3.49958 7.99677 3.5 7.9758V3.5C3.5 2.94772 3.94771 2.5 4.5 2.5Z" fill="currentColor"></path></svg></div></button><button id="message-continue-button-${id}" title="Continue" class="p-1 gizmo:pl-0 rounded-md text-token-text-tertiary hover:text-token-text-primary md:invisible ${shouldShowContinueButton ? 'md:group-[.final-completion]:visible' : ''}"><div class="flex items-center gap-1.5 text-xs"><svg stroke="currentColor" fill="none" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 -rotate-180" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></svg></div></button></div></div>

        <div id="result-action-wrapper-${id}"
          style="display: flex; justify-content: space-between; align-items: center; font-size: 0.7em; width: 100%; height: 40px;">
          ${showWordCount ? `<div id="result-counter-${id}" class="text-token-text-tertiary">${nodeCharCounts} chars / ${nodeWordCounts} words</div>` : ''}
          <button id="result-copy-button-${id}"
            class="btn ${showCopyButton || typeof showCopyButton === 'undefined' ? 'flex' : 'hidden'} justify-center gap-2 btn-neutral border-0 md:border " style="position: absolute; right: 0px; width: 64px; font-size:11px;padding:6px 12px;">Copy</button><div id="copy-result-menu-${id}" style="font-size: 10px; position: absolute; right: 0px; bottom: 37px;display:none;"><button id="result-markdown-copy-button-${id}"
            class="btn flex justify-center gap-2 btn-neutral border-0 md:border " style="width: 64px; font-size:11px;padding:6px 12px;">Markdown</button><button id="result-html-copy-button-${id}"
            class="btn flex justify-center gap-2 btn-neutral border-0 md:border " style="width: 64px; font-size:11px;padding:6px 12px;">HTML</button><div style="position:absolute;top: 37px; left: -120px; font-size: 11px;">Copy with formatting ➜ </div></div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}
function pythonImageSkeleton(node) {
  const messageId = node?.message?.id;
  const resultImages = node?.message?.metadata?.aggregate_result?.messages?.filter((m) => m?.message_type === 'image');
  return `${resultImages.map((image) => `<img style="border-radius:8px; aspect-ratio: ${image.width}/${image.height};" id="python-image-displayed-${messageId}" data-file-id="${image.image_url.split('file-service://').pop()}" src="https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png" class="my-1" alt="Output image">`).join('')}`;
}
// eslint-disable-next-line no-unused-vars
function renderAllPythonImages() {
  const allPythonImages = document.querySelectorAll('[id^="python-image-displayed-"]');
  allPythonImages.forEach((image) => {
    const { fileId } = image.dataset;
    getDownloadUrlFromFileId(fileId).then((response) => {
      image.src = response.download_url;
    });
  });
}
function pythonImageRenderer(node) {
  const messageId = node?.message?.id;
  const resultImages = node?.message?.metadata?.aggregate_result?.messages?.filter((m) => m?.message_type === 'image');
  resultImages.forEach((image) => {
    const { image_url: imageUrl, width, height } = image;
    const imageId = imageUrl.split('file-service://').pop();
    getDownloadUrlFromFileId(imageId).then((response) => {
      if (response.status === 'retry') {
        setTimeout(() => {
          pythonImageRenderer(node);
        }, 1000);
        return;
      }
      const existingImage = document.querySelector(`#python-image-displayed-${messageId}[data-file-id="${imageId}"]`);
      if (existingImage) {
        existingImage.src = response.download_url;
        return;
      }
      const renderedNode = `<img style="border-radius:8px; aspect-ratio: ${width}/${height};" id="python-image-displayed-${messageId}" data-file-id="${imageId}" src="${response.download_url}" class="my-1" alt="Output image">`;
      const lastMessageFeedbackWrapper = [...document.querySelectorAll('[id^=message-feedback-wrapper-]')].pop();
      lastMessageFeedbackWrapper.insertAdjacentHTML('beforebegin', renderedNode);
    });
  });
}
// eslint-disable-next-line no-unused-vars
function addFinalCompletionClassToLastMessageWrapper() {
  // remove all final-completion classes first
  const allMessageWrappers = document.querySelectorAll('[id^="message-wrapper-"]');
  allMessageWrappers.forEach((messageWrapper) => {
    messageWrapper.classList.remove('final-completion');
  });
  // add final-completion class to last message wrapper
  const lastMessageWrapper = [...document.querySelectorAll('[id^="message-wrapper-"]')].pop();
  lastMessageWrapper?.classList.add('final-completion');
}
function updateLastMessagePluginDropdown() {
  const lastMessagePluginDropdown = [...document.querySelectorAll('[id^="message-plugin-dropdown-"]')].pop();
  if (lastMessagePluginDropdown) {
    lastMessagePluginDropdown.classList.replace('bg-green-100', 'bg-gray-100');
    lastMessagePluginDropdown.querySelector('[id^="message-plugin-name-"]').innerHTML = lastMessagePluginDropdown.querySelector('[id^="message-plugin-name-"]').innerHTML.replace('...', '');
    lastMessagePluginDropdown.querySelector('[id^="message-plugin-loading-"]')?.remove();
  }
}
// eslint-disable-next-line no-unused-vars
function addNodeToRowAssistant(conversationId, node, gizmoId, continueGenerating = false, existingInnerHTML = '', isLoading = true, pluginDefaultOpen = false) {
  const role = node.message?.role || node.message?.author?.role;
  const name = node.message?.author?.name;
  const recipient = node.message?.recipient;
  if (role === 'assistant') {
    if (recipient === 'all') { // assistant to all (user)
      addAssistantNode(node, continueGenerating, existingInnerHTML);
      // remove loading state from last plugin
      if (node?.message?.content?.parts?.[0]?.length < 10) {
        updateLastMessagePluginDropdown();
      }
    } else { // assistant to plugin
      const existingPluginDropdown = recipient === 'dalle.text2im'
        ? document.querySelector(`#hidden-plugin-${node.message.id}`)
        : document.querySelector(`#message-plugin-dropdown-${node.message.id}`);

      if (existingPluginDropdown) {
        addPluginContentNode(node);
      } else {
        updateLastMessagePluginDropdown();
        const renderedNode = pluginDropdownRenderer(node, isLoading, pluginDefaultOpen);

        const lastMessageFeedbackWrapper = [...document.querySelectorAll('[id^=message-feedback-wrapper-]')].pop();
        lastMessageFeedbackWrapper?.insertAdjacentHTML('beforebegin', renderedNode);
        // add event listener to toggle plugin dropdown
        setTimeout(() => {
          const lastMessagePluginToggleButton = [...document.querySelectorAll('[id^="message-plugin-toggle-"]')].pop();
          if (lastMessagePluginToggleButton) {
            addMessagePluginToggleButtonsEventListeners([lastMessagePluginToggleButton]);
          }
        }, 300);
        // add event listener to toggle plugin dropdown
      }
    }
  } else { // tool to all
    if (recipient === 'all') {
      const isPluginResponse = 'invoked_plugin' in node.message.metadata || node.message.author.name === 'python';
      const isActionResponse = 'jit_plugin_data' in node.message.metadata;
      const imageDisplayed = node?.message?.content?.text?.includes('<<ImageDisplayed>>');

      if (name === 'dalle.text2im') {
        dalleImageRenderer(node);
      } else if (imageDisplayed) {
        pythonImageRenderer(node);
      } else if (isPluginResponse) {
        addPluginContentNode(node);
      } else if (isActionResponse) {
        addActionResponseRenderer(node);
      }
    } else if (recipient === 'assistant') {
      addActionConfirmationRenderer(node);
    }
  }
}

function addPluginContentNode(node) {
  const lastMessagePluginContent = [...document.querySelectorAll('[id^=message-plugin-content-]')].pop();

  const existingPluginContentHTML = lastMessagePluginContent?.querySelector(`[id^="message-plugin-"][id$="-html-${node.message.id}"]`);
  const renderedNode = pluginContentRenderer(node);
  if (existingPluginContentHTML) {
    // find last child of lastMessagePluginContent
    const lastChild = lastMessagePluginContent?.lastChild;
    // remove last child of lastMessagePluginContent
    lastMessagePluginContent?.removeChild(lastChild);
    // add renderedNode to lastMessagePluginContent
    lastMessagePluginContent?.insertAdjacentHTML('beforeend', renderedNode);
  } else {
    lastMessagePluginContent?.insertAdjacentHTML('beforeend', renderedNode);
  }
}
function hiddenPluginDropdownRenderer(pluginRequestNode, isLoading) {
  const recipient = pluginRequestNode?.message?.recipient;
  const title = recipient === 'dalle.text2im' ? 'DALL·E 3' : `Browsing${isLoading ? '...' : ''}`;
  const subtitle = recipient === 'dalle.text2im' ? 'Creating Images' : 'Starting up';
  const messageId = pluginRequestNode?.message?.id;

  return `<div class="flex flex-col items-start gap-2" id="hidden-plugin-${messageId}"><div class="bg-white dark:bg-gray-600 rounded-xl max-w-full overflow-hidden border-black/10 border-[0.5px] shadow-xxs ${isLoading ? 'conic' : ''}"><div class="flex items-center justify-between"><div class="min-w-0"><div class="flex h-14 items-center gap-2.5 px-3 py-2"><div class="flex h-[34px] w-[34px] shrink-0 items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34" fill="none" class="h-[34px] w-[34px]" width="34" height="34"><rect width="34" height="34" rx="6" fill="#ECECF1"></rect><rect x="29" y="19.4004" width="4.8" height="4.8" transform="rotate(180 29 19.4004)" fill="#3C46FF"></rect><rect x="24.1992" y="19.4004" width="4.8" height="4.8" transform="rotate(180 24.1992 19.4004)" fill="#FF6E3C"></rect><rect x="19.3984" y="19.4004" width="4.8" height="4.8" transform="rotate(180 19.3984 19.4004)" fill="#51DA4C"></rect><rect x="14.6016" y="19.4004" width="4.8" height="4.8" transform="rotate(180 14.6016 19.4004)" fill="#42FFFF"></rect><rect x="9.80078" y="19.4004" width="4.8" height="4.8" transform="rotate(180 9.80078 19.4004)" fill="#FFFF66"></rect></svg></div><div class="flex min-w-0 flex-1 flex-col items-start text-sm leading-[18px]"><div class="truncate font-medium" id="hidden-plugin-title-${messageId}">${title}</div><div class="max-w-full truncate opacity-70" id="hidden-plugin-subtitle-${messageId}">${subtitle}</div></div></div></div></div></div></div>${recipient === 'dalle.text2im' ? `<div id="message-dalle-content-${messageId}" class="grid gap-4 grid-cols-2 transition-opacity duration-300 opacity-100"></div>` : ''}`;
}
function dalleImageSkeleton(messageId, images) {
  const { width, height } = images[0];
  return `${images.map((p, index) => `<div class="flex"><div type="button" class="w-full cursor-pointer" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r1t:" data-state="closed" aria-label="Show Image"><div class="relative overflow-hidden rounded group/dalle-image" style="aspect-ratio: ${width}/${height};"><div style="width:${width}px; height:${height}px;" class="pointer-events-none absolute inset-0 bg-gray-100 animate-pulse w-full" style="animation-delay: 0ms;"></div><div class="relative h-full"><img id="dalle-image-${messageId}-${index}" alt="Generated by DALL·E" loading="lazy" width="${width}" height="${height}" decoding="async" data-nimg="1" class="w-full transition-opacity duration-300 opacity-100" src="https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png" style="color: transparent;"><div class="pointer-events-none absolute inset-0 rounded shadow-[inset_0_0_0.5px_rgba(0,0,0,0.5)]"></div><div id="dalle-image-info-${messageId}-${index}" title="Click to copy Gen ID, Shift+Click to copy Seed" class="invisible absolute left-1 bottom-1 bg-gray-600 px-2 py-1 rounded text-xs group-hover/dalle-image:visible"><div class="flex">Gen ID:&nbsp;<div class="font-bold" id="dalle-image-gen-id-${messageId}-${index}"></div></div><div class="flex">Seed:&nbsp;<div class="font-bold" id="dalle-image-seed-${messageId}-${index}"></div></div></div><div class="invisible absolute left-1 top-1 group-hover/dalle-image:visible"><button id="dalle-image-download-button-${messageId}-${index}" class="flex h-6 w-6 items-center justify-center rounded bg-black/50"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm text-white"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.70711 10.2929C7.31658 9.90237 6.68342 9.90237 6.29289 10.2929C5.90237 10.6834 5.90237 11.3166 6.29289 11.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L17.7071 11.7071C18.0976 11.3166 18.0976 10.6834 17.7071 10.2929C17.3166 9.90237 16.6834 9.90237 16.2929 10.2929L13 13.5858L13 4C13 3.44771 12.5523 3 12 3C11.4477 3 11 3.44771 11 4L11 13.5858L7.70711 10.2929ZM5 19C4.44772 19 4 19.4477 4 20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19L5 19Z" fill="currentColor"></path></svg></button></div></div></div></div></div>`).join('')}`;
}
// rende all images after conversation is loaded
// eslint-disable-next-line no-unused-vars
function renderAllDalleImages(conversation) {
  // get all dalle content where innerHTML is empty
  const allMessageDalleContent = [...document.querySelectorAll('[id^="message-dalle-content-"]')].filter((dalleContent) => dalleContent.innerHTML === '');
  // get all message ids
  const allDalleMessageIds = allMessageDalleContent.map((dalleContent) => dalleContent.id.split('message-dalle-content-')[1]);
  // for each message id, run dalleImageRenderer
  allDalleMessageIds.forEach((messageId) => {
    const node = Object.values(conversation.mapping).find((n) => n?.parent === messageId);
    if (node) {
      dalleImageRenderer(node);
    }
  });
}
// render images for each node
function dalleImageRenderer(node) {
  const { content } = node.message;
  if (content.content_type !== 'multimodal_text') return;

  let parentId = node?.parent;

  if (!parentId) {
    const lastMessageDalleContent = [...document.querySelectorAll('[id^="message-dalle-content-"]')].pop();
    parentId = lastMessageDalleContent?.id.split('message-dalle-content-')[1];
  }

  const images = content.parts;

  const hiddenPluginSubtitle = document.querySelector(`#hidden-plugin-subtitle-${parentId}`);
  if (hiddenPluginSubtitle) {
    hiddenPluginSubtitle.innerText = `Created ${images?.length > 1 ? `${images?.length} images` : 'image'}`;
  }

  const messageDalleContent = document.querySelector(`#message-dalle-content-${parentId}`);
  if (messageDalleContent) {
    if (images?.length <= 1) {
      messageDalleContent.classList?.replace('grid-cols-2', 'grid-cols-1');
    }
    if (messageDalleContent.innerHTML === '') {
      messageDalleContent.innerHTML = dalleImageSkeleton(parentId, images);
    }
  }
  images.forEach((image, index) => {
    const imageId = image.asset_pointer?.split('file-service://')[1];
    const { width, height } = image;
    getDownloadUrlFromFileId(imageId).then((response) => {
      // remove conic class from all hidden-plugin first childs
      const allHiddenPluginFirstChilds = [...document.querySelectorAll('[id^="hidden-plugin-"]')].map((hiddenPlugin) => hiddenPlugin.firstChild);
      allHiddenPluginFirstChilds.forEach((hiddenPluginFirstChild) => {
        hiddenPluginFirstChild.classList?.remove('conic');
      });
      const dalleElementImage = document.querySelector(`img#dalle-image-${parentId}-${index}`);
      if (dalleElementImage) {
        dalleElementImage.setAttribute('width', width);
        dalleElementImage.setAttribute('height', height);
        // set alt
        // remove anything other than  alpha numeric and space from prompt
        dalleElementImage.alt = image?.metadata?.dalle?.prompt?.replace(/[^a-zA-Z0-9 ]/gi, '') || 'Generated by DALL·E';
        dalleElementImage.src = response.download_url;
        const genIdElement = dalleElementImage.parentElement.querySelector(`#dalle-image-gen-id-${parentId}-${index}`);
        const seedElement = dalleElementImage.parentElement.querySelector(`#dalle-image-seed-${parentId}-${index}`);
        if (genIdElement) {
          genIdElement.innerText = image?.metadata?.dalle?.gen_id;
        }
        if (seedElement) {
          seedElement.innerText = image?.metadata?.dalle?.seed;
        }
        // add download event listener
        dalleImageEventListener(images, dalleElementImage, parentId, index);
      }
    });
  });
}
function addActionConfirmationRenderer(actionRequestNode) {
  // const { metadata } = actionRequestNode.message;
  // const domain = metadata?.jit_plugin_data?.from_server?.body?.domain;
  // const operation = metadata?.jit_plugin_data?.from_server?.body?.operation.replace(/___/g, ' ');
  // const actionType = metadata?.jit_plugin_data?.from_server?.type;

  // getGizmoUserActionSettings(gizmoId).then((gizmoUserActionSettings) => {
  //   // find the settings where operations[object.keys(operations)[0]].id === operation
  //   const gizmoUserActionSetting = gizmoUserActionSettings.settings.find((setting) => setting.operations[Object.keys(setting.operations)[0]].id === operation);
  //   const actionSettings = gizmoUserActionSetting?.action_settings;
  //   const firstActionSettingKey = actionSettings ? Object.keys(actionSettings)[0] : '';
  //   const actionSetting = firstActionSettingKey ? actionSettings[firstActionSettingKey] : '';

  //   if (actionType === 'confirm_action' && actionSetting === 'always_allow') {
  //     submitActionResponse(conversationId, actionRequestNode.id, domain, 'allow', actionRequestNode);
  //   } else {
  const renderedNode = actionConfirmationRenderer(actionRequestNode);
  const lastMessageFeedbackWrapper = [...document.querySelectorAll('[id^=message-feedback-wrapper-]')].pop();
  lastMessageFeedbackWrapper.insertAdjacentHTML('beforebegin', renderedNode);
  //   }
  // });
}
function addActionResponseRenderer(actionResponseNode) {
  const toolActionRequestWrapper = document.querySelector(`#tool-action-request-wrapper-${actionResponseNode.message.id}`);
  if (toolActionRequestWrapper) {
    const { domain } = toolActionRequestWrapper.dataset;
    const renderedNode = actionResponseRenderer(actionResponseNode, domain);
    toolActionRequestWrapper.outerHTML = renderedNode;
  }
}
function actionConfirmationRenderer(actionRequestNode, actionResponseNode) {
  const { id: messageId, recipient, metadata } = actionRequestNode.message;
  const domain = metadata?.jit_plugin_data?.from_server?.body?.domain;

  if (actionResponseNode) {
    // dont render request, jusr render response
    return actionResponseRenderer(actionResponseNode, domain);
  }
  const role = actionRequestNode.message?.role || actionRequestNode.message?.author?.role;
  if (role !== 'tool') return '';
  if (recipient !== 'assistant') return '';
  const actionType = metadata?.jit_plugin_data?.from_server?.type;

  if (actionType === 'confirm_action') {
    return `<div id="tool-action-request-wrapper-${messageId}" data-domain=${domain}>${actionDisclaimerRenderer(domain)}<div class="mb-2 flex gap-2"><button id="tool-action-request-allow-${messageId}" class="btn relative btn-dark h-8"><div class="flex w-full gap-2 items-center justify-center">Allow</div></button><button id="tool-action-request-deny-${messageId}" class="btn relative btn-neutral h-8"><div class="flex w-full gap-2 items-center justify-center">Decline</div></button></div></div>`;
  }
  if (actionType === 'oauth_required') {
    return `<div id="tool-action-request-wrapper-${messageId}" data-domain=${domain}>${actionDisclaimerRenderer(domain)}<div class="mb-2 flex gap-2"><button id="tool-action-request-oauth-${messageId}" class="btn relative btn-dark h-8"><div class="flex w-full gap-2 items-center justify-center">Sign in with ${domain}</div></button></div></div>`;
  }
  return '';
}
function actionResponseRenderer(actionNode, domain) {
  const { recipient, metadata } = actionNode.message;

  const role = actionNode.message?.role || actionNode.message?.author?.role;
  if (role === 'user') return '';
  if (role !== 'tool') return actionStoppedRenderer(domain);
  if (recipient !== 'all') return actionStoppedRenderer(domain);

  const actionType = metadata?.jit_plugin_data?.from_client?.user_action?.data?.type;
  if (actionType === 'allow') {
    return actionAllowedRenderer(domain);
  }
  if (actionType === 'deny') {
    return actionDeniedRenderer();
  }
  return '';
}
// eslint-disable-next-line no-unused-vars
function replaceAllConfimationWrappersWithActionStopped() { // used when submit user message without responding to action confirmation
  const allActionConfirmationWrappers = document.querySelectorAll('[id^="tool-action-request-wrapper-"]');
  allActionConfirmationWrappers.forEach((actionConfirmationWrapper) => {
    const { domain } = actionConfirmationWrapper.dataset;
    actionConfirmationWrapper.outerHTML = actionStoppedRenderer(domain);
  });
}
function actionDisclaimerRenderer(domain) {
  return `<div class="my-2.5 flex items-center gap-2.5"><div class="relative h-5 w-5 shrink-0"><div class="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-full text-token-text-primary bg-transparent" data-projection-id="159" style="opacity: 1; transform: none;"><div><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20" width="20" height="20" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px); content-visibility: visible;"><defs><clipPath id="__lottie_element_242"><rect width="20" height="20" x="0" y="0"></rect></clipPath><clipPath id="__lottie_element_252"><path d="M0,0 L20000,0 L20000,20000 L0,20000z"></path></clipPath><g id="__lottie_element_255"><g clip-path="url(#__lottie_element_256)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g transform="matrix(1,0,0,1,10006,10006)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,255,255)" fill-opacity="1" d=" M4.5,1 C4.5,1 4.5,3.5 4.5,3.5 C4.5,4.05 4.05,4.5 3.5,4.5 C3.5,4.5 1,4.5 1,4.5 C0.45,4.5 0,4.05 0,3.5 C0,3.5 0,1 0,1 C0,0.45 0.45,0 1,0 C1,0 3.5,0 3.5,0 C4.05,0 4.5,0.45 4.5,1z"></path><g opacity="1" transform="matrix(1,0,0,1,2.25,2.25)"></g></g></g></g></g><clipPath id="__lottie_element_256"><path d="M0,0 L20000,0 L20000,20000 L0,20000z"></path></clipPath><clipPath id="__lottie_element_266"><path d="M0,0 L20000,0 L20000,20000 L0,20000z"></path></clipPath><mask id="__lottie_element_255_1" mask-type="alpha"><use xlink:href="#__lottie_element_255"></use></mask><clipPath id="__lottie_element_279"><path d="M0,0 L20000,0 L20000,20000 L0,20000z"></path></clipPath><g id="__lottie_element_282"><g clip-path="url(#__lottie_element_283)" transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g transform="matrix(1,0,0,1,10006,10006)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,255,255)" fill-opacity="1" d=" M4.5,1 C4.5,1 4.5,3.5 4.5,3.5 C4.5,4.05 4.05,4.5 3.5,4.5 C3.5,4.5 1,4.5 1,4.5 C0.45,4.5 0,4.05 0,3.5 C0,3.5 0,1 0,1 C0,0.45 0.45,0 1,0 C1,0 3.5,0 3.5,0 C4.05,0 4.5,0.45 4.5,1z"></path><g opacity="1" transform="matrix(1,0,0,1,2.25,2.25)"></g></g></g></g></g><clipPath id="__lottie_element_283"><path d="M0,0 L20000,0 L20000,20000 L0,20000z"></path></clipPath><clipPath id="__lottie_element_293"><path d="M0,0 L20000,0 L20000,20000 L0,20000z"></path></clipPath><mask id="__lottie_element_282_1" mask-type="alpha"><use xlink:href="#__lottie_element_282"></use></mask></defs><g clip-path="url(#__lottie_element_242)"><g clip-path="url(#__lottie_element_279)" transform="matrix(-1,0,0,-1,10014,10018.5)" opacity="1" style="display: block;"><g mask="url(#__lottie_element_282_1)" style="display: block;"><g clip-path="url(#__lottie_element_293)" transform="matrix(1,0,0,1,0,0)" opacity="1"><g transform="matrix(1,0,0,1,10006,10006)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(177,98,253)" fill-opacity="1" d=" M4.5,1 C4.5,1 4.5,3.5 4.5,3.5 C4.5,4.05 4.05,4.5 3.5,4.5 C3.5,4.5 1,4.5 1,4.5 C0.45,4.5 0,4.05 0,3.5 C0,3.5 0,1 0,1 C0,0.45 0.45,0 1,0 C1,0 3.5,0 3.5,0 C4.05,0 4.5,0.45 4.5,1z"></path><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" stroke="rgb(177,98,253)" stroke-opacity="1" stroke-width="3" d=" M4.5,1 C4.5,1 4.5,3.5 4.5,3.5 C4.5,4.05 4.05,4.5 3.5,4.5 C3.5,4.5 1,4.5 1,4.5 C0.45,4.5 0,4.05 0,3.5 C0,3.5 0,1 0,1 C0,0.45 0.45,0 1,0 C1,0 3.5,0 3.5,0 C4.05,0 4.5,0.45 4.5,1z"></path><g opacity="1" transform="matrix(1,0,0,1,2.25,2.25)"></g></g></g></g></g></g><g transform="matrix(-1,0,0,-1,5.75,10.25)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,-2.25,-0.75)"><path fill="rgb(247,247,248)" fill-opacity="1" d=" M0,0 C0.75,0 1.5,0 2.25,0 C2.6642000675201416,0 3,0.3357999920845032 3,0.75 C3,0.75 3,0.75 3,0.75 C3,1.164199948310852 2.6642000675201416,1.5 2.25,1.5 C1.5,1.5 0.75,1.5 0,1.5 C0,1 0,0.5 0,0 C0,0 0,0 0,0 C0,0 0,0 0,0"></path></g></g><g clip-path="url(#__lottie_element_252)" transform="matrix(-1,0,0,-1,10022.5,10018.5)" opacity="1" style="display: block;"><g mask="url(#__lottie_element_255_1)" style="display: block;"><g clip-path="url(#__lottie_element_266)" transform="matrix(1,0,0,1,0,0)" opacity="1"><g transform="matrix(1,0,0,1,10006,10006)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,0,0)"><path fill="rgb(177,98,253)" fill-opacity="1" d=" M4.5,1 C4.5,1 4.5,3.5 4.5,3.5 C4.5,4.05 4.05,4.5 3.5,4.5 C3.5,4.5 1,4.5 1,4.5 C0.45,4.5 0,4.05 0,3.5 C0,3.5 0,1 0,1 C0,0.45 0.45,0 1,0 C1,0 3.5,0 3.5,0 C4.05,0 4.5,0.45 4.5,1z"></path><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" stroke="rgb(177,98,253)" stroke-opacity="1" stroke-width="3" d=" M4.5,1 C4.5,1 4.5,3.5 4.5,3.5 C4.5,4.05 4.05,4.5 3.5,4.5 C3.5,4.5 1,4.5 1,4.5 C0.45,4.5 0,4.05 0,3.5 C0,3.5 0,1 0,1 C0,0.45 0.45,0 1,0 C1,0 3.5,0 3.5,0 C4.05,0 4.5,0.45 4.5,1z"></path><g opacity="1" transform="matrix(1,0,0,1,2.25,2.25)"></g></g></g></g></g></g><g transform="matrix(-1,0,0,-1,14.25,10.25)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,-0.75,-0.75)"><path fill="rgb(247,247,248)" fill-opacity="1" d=" M0,0.75 C0,0.3357999920845032 0.3357900083065033,0 0.75,0 C1.5,0 2.25,0 3,0 C3,0.5 3,1 3,1.5 C2.25,1.5 1.5,1.5 0.75,1.5 C0.3357900083065033,1.5 0,1.164199948310852 0,0.75 C0,0.75 0,0.75 0,0.75 C0,0.75 0,0.75 0,0.75 C0,0.75 0,0.75 0,0.75"></path></g></g><g transform="matrix(1,0,0,1,0,0)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,10,10.25)"><path fill="rgb(177,98,253)" fill-opacity="1" d=" M2,-0.75 C2,-0.75 2,0.75 2,0.75 C2,0.75 2,0.75 2,0.75 C2,0.75 -2,0.75 -2,0.75 C-2,0.75 -2,0.75 -2,0.75 C-2,0.75 -2,-0.75 -2,-0.75 C-2,-0.75 -2,-0.75 -2,-0.75 C-2,-0.75 2,-0.75 2,-0.75 C2,-0.75 2,-0.75 2,-0.75z"></path></g></g></g></svg></div><svg width="120" height="120" viewBox="0 0 120 120" class="absolute left-1/2 top-1/2 h-[23px] w-[23px] -translate-x-1/2 -translate-y-1/2 text-brand-purple"><circle class="origin-[50%_50%] -rotate-90 stroke-brand-purple/25 dark:stroke-brand-purple/50" stroke-width="7.826086956521739" fill="transparent" r="56.08695652173913" cx="60" cy="60"></circle><circle class="origin-[50%_50%] -rotate-90 transition-[stroke-dashoffset]" stroke="currentColor" stroke-width="7.826086956521739" stroke-dashoffset="352.4047411418116" stroke-dasharray="352.4047411418116 352.4047411418116" fill="transparent" r="56.08695652173913" cx="60" cy="60"></circle></svg></div></div><div class="relative h-5 w-full leading-5 -mt-[0.75px] text-token-text-secondary"><div class="absolute left-0 top-0 line-clamp-1" data-projection-id="158" style="opacity: 1; transform: none;"><button type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:rij:" data-state="closed"><div class="inline-flex items-center gap-1">Some info will be sent to ${domain}, only do this for sites you trust</div></button></div></div></div>`;
}
function actionAllowedRenderer(domain) {
  return `<div class="my-2.5 flex items-center gap-2.5"><div class="relative h-5 w-5 shrink-0"><div class="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-full text-token-text-primary bg-brand-purple" data-projection-id="163" style="opacity: 1; transform: none;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 9" fill="none" width="8" height="9"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.66607 0.376042C8.01072 0.605806 8.10385 1.07146 7.87408 1.4161L3.54075 7.9161C3.40573 8.11863 3.18083 8.24304 2.93752 8.24979C2.69421 8.25654 2.46275 8.1448 2.31671 7.95008L0.150044 5.06119C-0.098484 4.72982 -0.0313267 4.25972 0.300044 4.01119C0.631415 3.76266 1.10152 3.82982 1.35004 4.16119L2.88068 6.20204L6.62601 0.584055C6.85577 0.239408 7.32142 0.146278 7.66607 0.376042Z" fill="currentColor"></path></svg></div></div><div class="relative h-5 w-full leading-5 -mt-[0.75px] text-token-text-secondary"><div class="absolute left-0 top-0 line-clamp-1" data-projection-id="162" style="opacity: 1; transform: none;"><button type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:rkd:" data-state="closed"><div class="inline-flex items-center gap-1">Talked to ${domain}</div></button></div></div></div>`;
}
function actionDeniedRenderer() {
  return '<div class="my-2.5 flex items-center gap-2.5"><div class="relative h-5 w-5 shrink-0"><div class="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-full text-token-text-primary bg-gray-300" data-projection-id="164" style="opacity: 1; transform: none;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 9" fill="none" width="8" height="9"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.32256 1.48447C7.59011 1.16827 7.55068 0.695034 7.23447 0.427476C6.91827 0.159918 6.44503 0.199354 6.17748 0.515559L4.00002 3.08892L1.82256 0.515559C1.555 0.199354 1.08176 0.159918 0.765559 0.427476C0.449355 0.695034 0.409918 1.16827 0.677476 1.48447L3.01755 4.25002L0.677476 7.01556C0.409918 7.33176 0.449354 7.805 0.765559 8.07256C1.08176 8.34011 1.555 8.30068 1.82256 7.98447L4.00002 5.41111L6.17748 7.98447C6.44503 8.30068 6.91827 8.34011 7.23447 8.07256C7.55068 7.805 7.59011 7.33176 7.32256 7.01556L4.98248 4.25002L7.32256 1.48447Z" fill="currentColor"></path></svg></div></div><div class="relative h-5 w-full leading-5 -mt-[0.75px] text-token-text-tertiary"><div class="absolute left-0 top-0 line-clamp-1" data-projection-id="165" style="opacity: 1; transform: none;">You declined this action</div></div></div>';
}
function actionStoppedRenderer(domain) {
  return `<div class="my-2.5 flex items-center gap-2.5"><div class="relative h-5 w-5 shrink-0"><div class="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-full text-token-text-primary bg-gray-300" data-projection-id="164" style="opacity: 1; transform: none;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 9" fill="none" width="8" height="9"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.32256 1.48447C7.59011 1.16827 7.55068 0.695034 7.23447 0.427476C6.91827 0.159918 6.44503 0.199354 6.17748 0.515559L4.00002 3.08892L1.82256 0.515559C1.555 0.199354 1.08176 0.159918 0.765559 0.427476C0.449355 0.695034 0.409918 1.16827 0.677476 1.48447L3.01755 4.25002L0.677476 7.01556C0.409918 7.33176 0.449354 7.805 0.765559 8.07256C1.08176 8.34011 1.555 8.30068 1.82256 7.98447L4.00002 5.41111L6.17748 7.98447C6.44503 8.30068 6.91827 8.34011 7.23447 8.07256C7.55068 7.805 7.59011 7.33176 7.32256 7.01556L4.98248 4.25002L7.32256 1.48447Z" fill="currentColor"></path></svg></div></div><div class="relative h-5 w-full leading-5 -mt-[0.75px] text-token-text-tertiary"><div class="absolute left-0 top-0 line-clamp-1" data-projection-id="165" style="opacity: 1; transform: none;">Stopped talking to ${domain}</div></div></div>`;
}

function dalleImageEventListener(images, dalleElementImage, messageId, index) {
  dalleElementImage.addEventListener('click', (e) => {
    e.stopPropagation();
    const dalleCarousel = openDalleCarousel(images, dalleElementImage, messageId, index);
    // add dalle carousel html to body
    document.body.insertAdjacentHTML('beforeend', dalleCarousel);
    setTimeout(() => {
      addDalleCarouselEventListeners(images);
    }, 200);
  });
  const downloadButton = dalleElementImage.parentElement.querySelector(`#dalle-image-download-button-${messageId}-${index}`);
  if (downloadButton) {
    downloadButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const image = dalleElementImage.src;
      // use local date and time
      const filename = `DALL·E ${formatDateDalle()} - ${dalleElementImage.alt}.png`;
      downloadFileFrmoUrl(image, filename);
    });
  }
  const imageInfo = dalleElementImage.parentElement.querySelector(`#dalle-image-info-${messageId}-${index}`);
  if (imageInfo) {
    // copy gen id to clipboard
    dalleElementImage.parentElement.addEventListener('click', (e) => {
      e.stopPropagation();
      // if shift key is pressed, copy seed to clipboard
      if (e.shiftKey) {
        const seed = dalleElementImage.parentElement.querySelector(`#dalle-image-seed-${messageId}-${index}`);
        if (seed) {
          navigator.clipboard.writeText(seed.innerText);
          toast('Copied Seed to clipboard');
        }
      } else {
        const genId = dalleElementImage.parentElement.querySelector(`#dalle-image-gen-id-${messageId}-${index}`);
        if (genId) {
          navigator.clipboard.writeText(genId.innerText);
          toast('Copied Gen ID to clipboard');
        }
      }
    });
  }
}

function pluginDropdownRenderer(pluginRequestNode, isLoading, isOpen = false) {
  const recipient = pluginRequestNode?.message?.recipient;
  if (recipient === 'dalle.text2im') return hiddenPluginDropdownRenderer(pluginRequestNode, isLoading);
  // if (recipient === 'browser') return hiddenPluginDropdownRenderer(pluginRequestNode, isLoading);

  const pluginName = pluginRequestNode?.message?.recipient?.split('.')[0]?.replace(/([A-Z])/g, ' $1')?.replace(/^./, (str) => str.toUpperCase());
  const messageId = pluginRequestNode?.message?.id;

  return `<div class="flex flex-col items-start"><div id="message-plugin-dropdown-${messageId}" class="flex items-center text-xs rounded p-3 text-gray-900 ${isLoading ? 'bg-green-100' : 'bg-gray-100'}"><div><div class="flex items-center gap-3"><div id="message-plugin-name-${messageId}">Used <b>${pluginName}</b>${isLoading ? '...' : ''}</div></div></div>${isLoading ? `<svg id="message-plugin-loading-${messageId}" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="animate-spin text-center shrink-0 ml-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>` : ''}<div id="message-plugin-toggle-${messageId}" class="ml-12 flex items-center gap-2" role="button"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="${isOpen ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"></polyline></svg></div></div><div id="message-plugin-content-${messageId}" class="${isOpen ? '' : 'hidden'} my-3 flex w-full flex-col gap-3">${pluginContentRenderer(pluginRequestNode)}</div></div>`;
}

function pluginContentRenderer(pluginNode) {
  const messageId = pluginNode.message?.id;
  const {
    content, recipient, author, metadata,
  } = pluginNode.message;
  const toolName = author?.name;
  if (toolName === 'dalle.text2im') return '';
  // if (toolName === 'browser') return '';

  const role = pluginNode.message?.role || pluginNode.message?.author?.role;
  const { content_type: contentType } = content;
  const pluginName = role === 'assistant'
    ? recipient?.split('.')[0]?.replace(/([A-Z])/g, ' $1')?.replace(/^./, (str) => str.toUpperCase())
    : author?.name?.split('.')[0]?.replace(/([A-Z])/g, ' $1')?.replace(/^./, (str) => str.toUpperCase());

  const pluginMessage = contentType === 'text'
    ? content?.parts?.filter((p) => typeof p === 'string')?.join('\n')
    : content?.text;
  if (!pluginMessage) return '';
  const { language, value } = hljs.highlightAuto(pluginMessage);
  let pluginHTML = value || '';
  try {
    pluginHTML = JSON.stringify(JSON.parse(pluginMessage), 0, 2);
  } catch (e) {
    pluginHTML = value || pluginMessage || '';
  }

  let resultLanguage = '';
  let resultHTML = '';
  if (contentType === 'execution_output' && role === 'tool' && metadata?.aggregate_result?.final_expression_output) {
    const { language: resLanguage, value: resValue } = hljs.highlightAuto(metadata?.aggregate_result?.final_expression_output);
    resultLanguage = resLanguage;
    resultHTML = resValue;
  }
  // eslint-disable-next-line no-nested-ternary
  const codeHeader = contentType === 'text'
    ? role === 'assistant' ? `Request to ${pluginName}` : `Response from ${pluginName}`
    : role === 'assistant' ? recipient : 'STDOUT/STDERR';
  return `<div class="dark bg-black rounded-md w-full text-xs text-white/80"><pre><div class="flex items-center relative text-gray-200 bg-token-main-surface-primary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span><span class="uppercase">${codeHeader}</span></span>${contentType === 'code' ? '<button id="copy-code" data-initialized="false" class="flex ml-auto gap-2"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>Copy code</button>' : ''}</div><div class="p-4 overflow-y-auto"><code hljs language-${language}" id="message-plugin-${role === 'assistant' ? 'request' : 'response'}-html-${messageId}" class="!whitespace-pre-wrap">${pluginHTML}</code></div>${resultHTML && resultHTML !== pluginHTML ? `<div class="w-full px-4 py-2 text-gray-200 border border-gray-800">Execution Results</div><div class="p-4 overflow-y-auto"><code hljs language-${resultLanguage}" id="message-plugin-result-html-${messageId}" class="!whitespace-pre-wrap">${resultHTML}</code></div>` : ''}</pre></div>`;
}
// eslint-disable-next-line no-unused-vars
function updateCounter() {
  const lastRowAssistant = [...document.querySelectorAll('[id^="message-wrapper-"][data-role="assistant"]')].pop();
  const lastResultActionWrapper = [...document.querySelectorAll('[id^=result-action-wrapper-]')].pop();
  if (!lastRowAssistant || !lastResultActionWrapper) return;

  const resultCounter = lastResultActionWrapper.querySelector('[id^=result-counter-]');
  if (!resultCounter) return;

  // get all message-text- nodes
  const messageTextNodes = [...lastRowAssistant.querySelectorAll('[id^=message-text-]')];
  // get the innerText of all message-text- nodes
  const messageContentParts = messageTextNodes.map((node) => node.innerText).join('\n');
  // get the number of chars/words in all message-text- nodes
  const charCount = messageContentParts.replace(/\n/g, '').length;
  const wordCount = messageContentParts.split(/\s+/).filter((word) => word !== '').length;

  if (wordCount > Number(resultCounter.innerText.split(' ')[3])) {
    resultCounter.innerHTML = `${charCount} chars / ${wordCount} words`;
  }
}
function addAssistantNode(node, continueGenerating = false, existingInnerHTML = '') {
  const lastRowAssistant = [...document.querySelectorAll('[id^="message-wrapper-"][data-role="assistant"]')].pop();

  const existingMessageText = continueGenerating
    ? [...lastRowAssistant.querySelectorAll('[id^=message-text-]')].pop()
    : document.querySelector(`#message-text-${node.message.id}`);
  if (existingMessageText) {
    const { assistantMessageHTML } = assistantContentGenerator(node, false);
    const tempDiv = existingMessageText.cloneNode(true);
    if (continueGenerating) {
      // tempDiv.innerHTML = existingInnerHTML + assistantMessageHTML;
      existingMessageText.innerHTML = existingInnerHTML + assistantMessageHTML;
    } else {
      // existingMessageText.innerHTML = assistantMessageHTML;
      const existingChildren = [...existingMessageText.children];
      tempDiv.innerHTML = assistantMessageHTML;
      const tempChildren = [...tempDiv.children];
      if (!existingChildren || existingChildren.length === 0 || tempChildren.length > existingChildren.length) {
        if (existingChildren?.length > 0) {
          if (existingChildren[existingChildren.length - 1].innerHTML.length !== tempChildren[existingChildren.length - 1].innerHTML.length) {
            existingChildren[existingChildren.length - 1].innerHTML = tempChildren[existingChildren.length - 1].innerHTML;
          }
        }
        existingMessageText.insertAdjacentElement('beforeend', [...tempChildren].pop());
        if ([...tempChildren]?.pop()?.innerText?.includes('Copy code')) {
          addCopyCodeButtonsEventListeners();
        }
      } else {
        if (existingChildren.length > tempChildren.length) {
          // remove extra children
          for (let i = tempChildren.length; i < existingChildren.length; i += 1) {
            existingChildren[i].remove();
          }
        }
        const lastExistingChild = existingChildren[tempChildren.length - 1];
        const lastTempChild = tempChildren[tempChildren.length - 1];
        if (lastExistingChild.tagName === lastTempChild.tagName) {
          lastExistingChild.innerHTML = lastTempChild.innerHTML;
        } else {
          lastExistingChild.outerHTML = lastTempChild.outerHTML;
        }
      }
    }
    // eslint-disable-next-line new-cap
    // const elementA = new diffDOM.nodeToObj(existingMessageText);
    // // eslint-disable-next-line new-cap
    // const elementB = new diffDOM.nodeToObj(tempDiv);
    // const diff = diffdom.diff(elementA, elementB);
    // diffdom.apply(existingMessageText, diff);
  } else {
    const { renderedNode } = assistantRenderer(node);
    const lastMessageFeedbackWrapper = [...document.querySelectorAll('[id^=message-feedback-wrapper-]')].pop();
    lastMessageFeedbackWrapper.insertAdjacentHTML('beforebegin', renderedNode);
  }
}
function assistantRenderer(assistantNode) {
  const { id } = assistantNode.message;

  const { assistantMessageHTML, wordCount, charCount } = assistantContentGenerator(assistantNode, true);

  return {
    renderedNode: `<div dir="auto" class="min-h-[20px] flex flex-col items-start whitespace-pre-wrap gap-4 break-words">
  <div id="message-text-${id}" class="markdown prose w-full flex flex-col break-words dark:prose-invert">
    ${assistantMessageHTML}
    </div>
  </div>`,
    wordCount,
    charCount,
  };
}
function assistantContentGenerator(assistantNode, returnCounters = false) {
  const { message: assistantMessage } = assistantNode;
  const { citations } = assistantMessage.metadata;
  const shouldShowContinueButton = assistantMessage?.status && (assistantMessage?.status === 'finished_partial_completion' || assistantMessage?.metadata?.finish_details?.type === 'max_tokens');

  if (shouldShowContinueButton) {
    const lastContinueButton = [...document.querySelectorAll('[id^="message-continue-button-"]')].pop();
    if (lastContinueButton) lastContinueButton.classList.add('md:group-[.final-completion]:visible');
  }
  let messageContentParts = assistantMessage.content.parts.filter((p) => typeof p === 'string').join('\n');
  // if citations array is not mpty, replace text from start_ix to end_ix position with citation
  if (citations?.length > 0) {
    const reversedCitations = [...citations].reverse();
    for (let i = 0; i < reversedCitations.length; i += 1) {
      const citation = reversedCitations[i];
      const citationMetadata = citation.metadata;
      const citedMessageIndex = citationMetadata?.extra?.cited_message_idx;
      const evidenceText = citationMetadata?.extra?.evidence_text;
      if (citationMetadata) {
        const { url, title } = citationMetadata;
        const citationText = `[<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 15" fill="none" class="-mt-0.5 ml-0.5 inline-block text-link-base hover:text-link-hover" width="19" height="15"><path d="M4.42 0.75H2.8625H2.75C1.64543 0.75 0.75 1.64543 0.75 2.75V11.65C0.75 12.7546 1.64543 13.65 2.75 13.65H2.8625C2.8625 13.65 2.8625 13.65 2.8625 13.65C2.8625 13.65 4.00751 13.65 4.42 13.65M13.98 13.65H15.5375H15.65C16.7546 13.65 17.65 12.7546 17.65 11.65V2.75C17.65 1.64543 16.7546 0.75 15.65 0.75H15.5375H13.98" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M6.16045 7.41534C5.32257 7.228 4.69638 6.47988 4.69638 5.58551C4.69638 4.54998 5.53584 3.71051 6.57136 3.71051C7.60689 3.71051 8.44635 4.54998 8.44635 5.58551C8.44635 5.8965 8.37064 6.1898 8.23664 6.448C8.22998 6.48984 8.21889 6.53136 8.20311 6.57208L6.77017 10.2702C6.63182 10.6272 6.18568 10.7873 5.7737 10.6276C5.36172 10.468 5.13991 10.0491 5.27826 9.69206L6.16045 7.41534ZM11.4177 7.41534C10.5798 7.228 9.95362 6.47988 9.95362 5.58551C9.95362 4.54998 10.7931 3.71051 11.8286 3.71051C12.8641 3.71051 13.7036 4.54998 13.7036 5.58551C13.7036 5.8965 13.6279 6.1898 13.4939 6.448C13.4872 6.48984 13.4761 6.53136 13.4604 6.57208L12.0274 10.2702C11.8891 10.6272 11.4429 10.7873 11.0309 10.6276C10.619 10.468 10.3971 10.0491 10.5355 9.69206L11.4177 7.41534Z" fill="currentColor"></path></svg>](${url} "${title}")`;
        // replace all any start with [citedMessageIndex and end with evidenceText] with citationText
        messageContentParts = messageContentParts.replace(new RegExp(`【${citedMessageIndex}.*?${evidenceText}】`, 'g'), citationText);
      }
    }
  }
  // replace single \n\\ with \n\n\\
  messageContentParts = messageContentParts.replace(/[^n}]\n\\/g, '\n\n\\');
  // add newline before and afte brackets
  messageContentParts = messageContentParts.replace(/\\\[/g, '\n\\[');
  messageContentParts = messageContentParts.replace(/\\\]/g, '\\]\n');

  const assistantMessageHTML = markdown('assistant')
    .use(markdownitSup)
    .use(texmath, {
      engine: katex,
      delimiters: ['dollars', 'brackets'],
      katexOptions: { macros: { '\\RR': '\\mathbb{R}' } },
    }).render(messageContentParts);

  if (returnCounters) {
    // create fake element
    const el = document.createElement('div');
    // set innerHTML of fake element to assistantMessageHTML
    el.innerHTML = assistantMessageHTML;
    const wordCount = el.innerText.split(/\s+/).filter((word) => word !== '').length;
    const charCount = el.innerText.replace(/\n/g, '').length;
    return { assistantMessageHTML, wordCount, charCount };
  }
  return { assistantMessageHTML };
}
