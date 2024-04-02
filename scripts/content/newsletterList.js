/* global createModal, settingsModalActions, createAnnouncementModal */

// eslint-disable-next-line no-unused-vars
function createNewsletterListModal(version) {
  const bodyContent = newsletterListModalContent(version);
  const actionsBarContent = newsletterListModalActions();
  createModal('Newsletter Archive', 'You can find all of our previous newsletters here (<a href="https://superpowerdaily.com" target="_blank" rel="noopener noreferrer" style="color:gold;">Read Online</a>)', bodyContent, actionsBarContent);
}
function loadNewsletterList(page, newsletterListText) {
  chrome.runtime.sendMessage({
    getNewsletters: true,
    detail: {
      page,
    },
  }, (newsletterList) => {
    chrome.storage.local.get(['readNewsletterIds'], (result) => {
      const readNewsletterIds = result.readNewsletterIds || [];
      for (let i = 0; i < newsletterList.results.length; i += 1) {
        const newsletter = newsletterList.results[i];
        const releaseDate = new Date(newsletter.release_date);
        const releaseDateWithOffset = new Date(releaseDate.getTime() + (releaseDate.getTimezoneOffset() * 60000));
        const newsletterLine = document.createElement('div');
        newsletterLine.style = `color:white;font-size:1em;display:flex;margin:8px 0;align-items:flex-start; ${readNewsletterIds.includes(newsletter.id) ? 'opacity:0.5;' : ''}`;
        const newsletterDate = document.createElement('div');
        newsletterDate.style = 'position:relative;border: solid 1px gold;border-radius:4px;padding:4px;color:gold;cursor:pointer;margin-right:8px;min-width:144px; text-align:center;';
        newsletterDate.textContent = releaseDateWithOffset.toDateString();
        // red dot
        const newsletterNotification = document.createElement('div');
        newsletterNotification.id = 'newsletter-notification';
        newsletterNotification.style = 'position:absolute; top:-4px; right:-4px; width: 8px; height: 8px; background-color: red; border-radius: 50%;';
        newsletterDate.addEventListener('click', () => {
          chrome.runtime.sendMessage({
            getNewsletter: true,
            detail: {
              id: newsletter.id,
            },
          }, (newsletterData) => {
            createAnnouncementModal(newsletterData);
            chrome.storage.local.get(['readNewsletterIds'], (res) => {
              const oldReadNewsletterIds = res.readNewsletterIds || [];
              if (!oldReadNewsletterIds.includes(newsletter.id)) {
                chrome.runtime.sendMessage({
                  incrementOpenRate: true,
                  detail: {
                    announcementId: newsletter.id,
                  },
                });
              }
              chrome.storage.local.set({ readNewsletterIds: [newsletter.id, ...oldReadNewsletterIds.slice(0, 100)] }, () => {
                newsletterLine.style = 'font-size:1em;display:flex;margin:8px 0;align-items:flex-start; opacity:0.5;';
                document.querySelectorAll('#newsletter-notification').forEach((notification) => {
                  notification.remove();
                });
              });
            });
          });
        });
        const newsletterTitle = document.createElement('div');
        newsletterTitle.style = 'align-self:center;';
        newsletterTitle.textContent = newsletter.title;
        if (!readNewsletterIds.includes(newsletter.id) && i === 0 && page === 1) {
          newsletterDate.appendChild(newsletterNotification);
        }
        newsletterLine.appendChild(newsletterDate);
        newsletterLine.appendChild(newsletterTitle);
        newsletterListText.appendChild(newsletterLine);
      }
    });
    if (newsletterList.next) newsletterListText.insertAdjacentHTML('beforeend', '<div id="newsletter-list-loading" style="font-size:1em;">Loading...</div>');
    const newsletterListLoading = document.querySelector('#newsletter-list-loading');
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const curNewsletterListText = document.querySelector('#newsletter-list-text');
        newsletterListLoading.remove();
        loadNewsletterList(page + 1, curNewsletterListText);
      }
    }, { threshold: 0.5 });
    if (newsletterListLoading) observer.observe(newsletterListLoading);
  });
}
function newsletterListModalContent() {
  // create newsletterList modal content
  const content = document.createElement('div');
  content.id = 'modal-content-newsletter-list';
  content.style = 'overflow-y: hidden;position: relative;height:100%; width:100%';
  content.classList = 'markdown prose-invert';
  const logoWatermark = document.createElement('img');
  logoWatermark.src = chrome.runtime.getURL('icons/logo.png');
  logoWatermark.style = 'position: fixed; top: 50%; right: 50%; width: 400px; height: 400px; opacity: 0.07; transform: translate(50%, -50%);box-shadow:none !important;';
  content.appendChild(logoWatermark);
  const newsletterListText = document.createElement('article');
  newsletterListText.id = 'newsletter-list-text';
  newsletterListText.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: scroll; height: 100%; width: 100%; white-space: break-spaces; overflow-wrap: break-word;padding: 16px;position: relative;z-index:10;color: #fff;';
  content.appendChild(newsletterListText);
  return content;
}

function newsletterListModalActions() {
  return settingsModalActions();
}
function addNewsletterButton() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  // check if the setting button is already added
  if (document.querySelector('#newsletter-button')) return;
  // create the setting button by copying the nav button
  const newsletterButton = document.createElement('a');
  newsletterButton.classList = 'flex relative py-3 px-3 items-center gap-3 rounded-md hover:bg-token-main-surface-tertiary transition-colors duration-200 text-token-text-primary cursor-pointer text-sm';
  newsletterButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4 text-token-text-primary" fill="currentColor"><path d="M456 32h-304C121.1 32 96 57.13 96 88v320c0 13.22-10.77 24-24 24S48 421.2 48 408V112c0-13.25-10.75-24-24-24S0 98.75 0 112v296C0 447.7 32.3 480 72 480h352c48.53 0 88-39.47 88-88v-304C512 57.13 486.9 32 456 32zM464 392c0 22.06-17.94 40-40 40H139.9C142.5 424.5 144 416.4 144 408v-320c0-4.406 3.594-8 8-8h304c4.406 0 8 3.594 8 8V392zM264 272h-64C186.8 272 176 282.8 176 296S186.8 320 200 320h64C277.3 320 288 309.3 288 296S277.3 272 264 272zM408 272h-64C330.8 272 320 282.8 320 296S330.8 320 344 320h64c13.25 0 24-10.75 24-24S421.3 272 408 272zM264 352h-64c-13.25 0-24 10.75-24 24s10.75 24 24 24h64c13.25 0 24-10.75 24-24S277.3 352 264 352zM408 352h-64C330.8 352 320 362.8 320 376s10.75 24 24 24h64c13.25 0 24-10.75 24-24S421.3 352 408 352zM400 112h-192c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32v-64C432 126.3 417.7 112 400 112z"/></svg> Newsletter Archive';
  newsletterButton.title = 'CMD/CTRL + SHIFT + L';

  newsletterButton.id = 'newsletter-button';
  newsletterButton.style = `${newsletterButton.style.cssText}; width: 100%;`;
  // Add click event listener to setting button
  newsletterButton.addEventListener('click', () => {
    // open the setting modal
    createNewsletterListModal();
    const newsletterListText = document.querySelector('#newsletter-list-text');
    loadNewsletterList(1, newsletterListText);
  });
  const userMenu = nav.querySelector('#user-menu');
  userMenu.prepend(newsletterButton);
}
// eslint-disable-next-line no-unused-vars
function initializeNewsletter() {
  addNewsletterButton();
}
