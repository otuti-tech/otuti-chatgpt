// eslint-disable-next-line no-unused-vars
/* global isFirefox, isOpera, isGenerating, toast, playingAudios:true, speakingMessageId:true */
/* eslint-disable func-names */
let isAltKeyDown = false;
// eslint-disable-next-line no-unused-vars
function startSpeechToText() {
  if (isFirefox) return;
  if (isOpera) return;
  let altKeyPressTimer;
  let speechTextAreaValue = '';
  let isListening = false;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechRecognition = new SpeechRecognition();
  speechRecognition.continuous = false;
  speechRecognition.maxAlternatives = 1;
  speechRecognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    const textAreaElement = document.querySelector('#prompt-textarea');
    textAreaElement.value = `${speechTextAreaValue ? `${speechTextAreaValue} ` : ''}${text}`;
    textAreaElement.focus();
    textAreaElement.selectionStart = textAreaElement.value.length;
    textAreaElement.dispatchEvent(new Event('input', { bubbles: true }));
    textAreaElement.dispatchEvent(new Event('change', { bubbles: true }));
  };
  speechRecognition.onspeechend = function () {
    // if altkey is pressed, keep listening
    speechRecognition.stop();
    setTimeout(() => {
      if (isAltKeyDown) {
        speechTextAreaValue = document.querySelector('#prompt-textarea').value;
        speechRecognition.start();
      }
    }, 200);
  };
  speechRecognition.onerror = function (event) {
    setTimeout(() => {
      if (isAltKeyDown && event.error === 'no-speech') {
        speechTextAreaValue = document.querySelector('#prompt-textarea').value;
        speechRecognition.start();
      }
    }, 200);
  };

  document.addEventListener('keyup', (e) => {
    isAltKeyDown = false;
    // Clear the timer and mark Alt key as up
    clearTimeout(altKeyPressTimer);
    // Implement logic to stop listening here
    speechRecognition.abort();
    // update send button icon to send
    const submitButton = document.querySelector('[data-testid="send-button"]');
    if (!submitButton) return;
    if (!isGenerating) {
      submitButton.classList.replace('rounded-full', 'rounded-lg');
      submitButton.querySelector('span').innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    }
    if (isListening) {
      isListening = false;
      toast('Stopped listening. ⏸️');
    }
    if (e.key === 'Alt' || e.keyCode === 18) {
      chrome.storage.local.get(['settings'], (result) => {
        if (result.settings.autoSubmitWhenReleaseAlt) {
          submitButton.click();
        }
      });
    }
  });
  document.addEventListener('keydown', (e) => {
    // hold down alt for longer than 2 seconds
    if (e.altKey && !(e.ctrlKey || e.shiftKey || e.metaKey || e.key === 'Tab' || e.keyCode === 9)) {
      if (isAltKeyDown) return;
      // check if any other key is also down or not
      // Mark Alt key as down and start a timer
      isAltKeyDown = true;
      altKeyPressTimer = setTimeout(() => {
        // ctrlKey, shiftKey, metaKey or tab key is down
        if (e.ctrlKey || e.shiftKey || e.metaKey || e.key === 'Tab' || e.keyCode === 9) return;
        if (isAltKeyDown) { // Check if Alt key is still down after 2 seconds
          chrome.runtime.sendMessage({
            checkHasSubscription: true,
            detail: {
              forceRefresh: false,
            },
          }, (hasSubscription) => {
            if (hasSubscription) {
              // if speaking, stop it
              stopAllAudios();

              const submitButton = document.querySelector('[data-testid="send-button"]');
              if (submitButton && !isGenerating) {
                // update send button icon to listening
                submitButton.querySelector('span').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="none" class="icon-lg text-token-text-primary dark:text-black"><path fill="currentColor" d="M301.2 34.98c-4.201-1.893-8.727-2.902-13.16-2.902c-7.697 0-15.29 2.884-21.27 8.192L131.8 160.1H48c-26.51 0-48 21.48-48 47.96v95.92c0 26.48 21.49 47.96 48 47.96h83.84l134.9 119.8C272.7 477 280.3 479.8 288 479.8c4.438 0 8.959-.9311 13.16-2.835C312.7 471.8 320 460.4 320 447.9V64.12C320 51.54 312.7 40.13 301.2 34.98zM272 412.1L150.1 303.9L48 303.9v-95.83h102.1L272 99.84V412.1zM412.6 182c-4.469-3.623-9.855-5.394-15.2-5.394c-6.951 0-13.83 2.992-18.55 8.797c-8.406 10.24-6.906 25.35 3.375 33.74C393.5 228.4 400 241.8 400 255.1c0 14.17-6.5 27.59-17.81 36.83c-10.28 8.396-11.78 23.5-3.375 33.74c4.719 5.805 11.62 8.802 18.56 8.802c5.344 0 10.75-1.78 15.19-5.399C435.1 311.5 448 284.6 448 255.1S435.1 200.4 412.6 182zM473.1 108.2c-4.455-3.633-9.842-5.41-15.2-5.41c-6.934 0-13.82 2.975-18.58 8.75c-8.406 10.24-6.906 25.35 3.344 33.74C476.6 172.1 496 213.3 496 255.1c0 42.64-19.44 82.1-53.31 110.7c-10.25 8.396-11.75 23.5-3.344 33.74c4.75 5.773 11.62 8.771 18.56 8.771c5.375 0 10.75-1.78 15.22-5.431C518.2 366.9 544 313 544 255.1S518.2 145 473.1 108.2zM534.4 33.4C529.9 29.77 524.5 28 519.2 28c-6.941 0-13.84 2.977-18.6 8.739c-8.406 10.24-6.906 25.35 3.344 33.74C559.9 116.3 592 183.9 592 255.1s-32.09 139.7-88.06 185.5c-10.25 8.396-11.75 23.5-3.344 33.74C505.3 481 512.2 484 519.2 484c5.375 0 10.75-1.779 15.22-5.431C601.5 423.6 640 342.5 640 255.1C640 169.5 601.5 88.34 534.4 33.4z"/></svg>';
              }
              // Implement your listening logic here
              speechTextAreaValue = document.querySelector('#prompt-textarea').value;
              chrome.storage.local.get(['settings'], (result) => {
                speechRecognition.lang = result.settings.speechToTextLanguage.code;
                speechRecognition.interimResults = result.settings.speechToTextInterimResults;
                if (!isListening) {
                  // if focus is inside the window, start listening
                  isListening = true;
                  speechRecognition.start();
                  toast('Started listening... 🔴');
                }
              });
            } else {
              toast('⚡️ Speech to text requires the Pro Subscription.', 'success', 6000);
            }
          });
        }
      }, 1500); // 2000 milliseconds = 2 seconds
    } else {
      // Clear the timer and mark Alt key as up
      clearTimeout(altKeyPressTimer);
      // Implement logic to stop listening here
      speechRecognition.abort();
      // update send button icon to send
      const submitButton = document.querySelector('[data-testid="send-button"]');
      if (!submitButton) return;
      if (!isGenerating) {
        submitButton.classList.replace('rounded-full', 'rounded-lg');
        submitButton.querySelector('span').innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
      }
      if (isListening) {
        isListening = false;
        toast('Stopped listening. ⏸️');
      }
    }
  });

  window.addEventListener('blur', () => {
    // Clear the timer and mark Alt key as up
    clearTimeout(altKeyPressTimer);
    // Implement logic to stop listening here
    speechRecognition.abort();
    // update send button icon to send
    const submitButton = document.querySelector('[data-testid="send-button"]');
    if (!submitButton) return;
    if (!isGenerating) {
      submitButton.classList.replace('rounded-full', 'rounded-lg');
      submitButton.querySelector('span').innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    }
    if (isListening) {
      isListening = false;
      toast('Stopped listening. ⏸️');
    }
  });
}
function stopAllAudios(resetSpeakingMessageId = true) {
  if (resetSpeakingMessageId) {
    speakingMessageId = '';
  }
  Object.values(playingAudios).forEach((audio) => {
    audio.pause();
  });
  playingAudios = {};
  const allTextToSpeechButtons = document.querySelectorAll('[id^="text-to-speech-button-"]');
  allTextToSpeechButtons.forEach((b) => {
    // set style to empty string to remove inline style
    b.style = '';
    b.disabled = false;
    b.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 4.9099C11 4.47485 10.4828 4.24734 10.1621 4.54132L6.67572 7.7372C6.49129 7.90626 6.25019 8.00005 6 8.00005H4C3.44772 8.00005 3 8.44776 3 9.00005V15C3 15.5523 3.44772 16 4 16H6C6.25019 16 6.49129 16.0938 6.67572 16.2629L10.1621 19.4588C10.4828 19.7527 11 19.5252 11 19.0902V4.9099ZM8.81069 3.06701C10.4142 1.59714 13 2.73463 13 4.9099V19.0902C13 21.2655 10.4142 22.403 8.81069 20.9331L5.61102 18H4C2.34315 18 1 16.6569 1 15V9.00005C1 7.34319 2.34315 6.00005 4 6.00005H5.61102L8.81069 3.06701ZM20.3166 6.35665C20.8019 6.09313 21.409 6.27296 21.6725 6.75833C22.5191 8.3176 22.9996 10.1042 22.9996 12.0001C22.9996 13.8507 22.5418 15.5974 21.7323 17.1302C21.4744 17.6185 20.8695 17.8054 20.3811 17.5475C19.8927 17.2896 19.7059 16.6846 19.9638 16.1962C20.6249 14.9444 20.9996 13.5175 20.9996 12.0001C20.9996 10.4458 20.6064 8.98627 19.9149 7.71262C19.6514 7.22726 19.8312 6.62017 20.3166 6.35665ZM15.7994 7.90049C16.241 7.5688 16.8679 7.65789 17.1995 8.09947C18.0156 9.18593 18.4996 10.5379 18.4996 12.0001C18.4996 13.3127 18.1094 14.5372 17.4385 15.5604C17.1357 16.0222 16.5158 16.1511 16.0539 15.8483C15.5921 15.5455 15.4632 14.9255 15.766 14.4637C16.2298 13.7564 16.4996 12.9113 16.4996 12.0001C16.4996 10.9859 16.1653 10.0526 15.6004 9.30063C15.2687 8.85905 15.3578 8.23218 15.7994 7.90049Z" fill="currentColor"></path></svg>';
  });
}
