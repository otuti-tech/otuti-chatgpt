// eslint-disable-next-line no-unused-vars
function addSyncBanner() {
  const existingSyncBanner = document.querySelector('#sync-nav-wrapper');
  if (existingSyncBanner) existingSyncBanner.remove();
  const navWrapper = document.createElement('div');
  navWrapper.id = 'sync-nav-wrapper';
  navWrapper.classList = 'w-full z-10 bg-transparent transition-all relative top-0';
  navWrapper.style = 'height: 56px;';
  const navbar = document.createElement('div');
  navbar.id = 'sync-navbar';
  navbar.classList = 'w-full flex items-center justify-center border-b h-14 border-black/10 bg-gray-50 p-4 text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-white shadow-md text-sm';
  navbar.style.backgroundColor = '#ffd70085';
  const syncProgressLabel = document.querySelector('#sync-progresslabel');
  const syncPageRefreshButton = navbar.querySelector('#sync-page-refresh-button');
  if (!syncPageRefreshButton) {
    navbar.innerHTML = `Syncing conversations to your computer. Some features like &nbsp;<b>Search</b>&nbsp; and &nbsp;<b>Folders</b>&nbsp; will be unavailable until sync is complete.${syncProgressLabel.textContent.split('Syncing')[1] || ''}`;
  }
  navWrapper.appendChild(navbar);
  const main = document.querySelector('main');
  main.parentNode.insertBefore(navWrapper, main);

  // add mutation observer to syncProgressLabel
  const observer = new MutationObserver(() => {
    const curSyncPageRefreshButton = navWrapper.querySelector('#sync-page-refresh-button');
    if (!curSyncPageRefreshButton) {
      navbar.innerHTML = `Syncing conversations to your computer. Some features like &nbsp;<b>Search</b>&nbsp; and &nbsp;<b>Folders</b>&nbsp; will be unavailable until sync is complete.${syncProgressLabel.textContent.split('Syncing')[1] || ''}`;
    }
  });
  observer.observe(syncProgressLabel, { childList: true, subtree: true });
}
