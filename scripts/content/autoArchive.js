/* global confirmArchiveSelectedConversations */
// eslint-disable-next-line no-unused-vars
function initializeAutoArchive() {
  chrome.storage.local.get(['settings', 'conversations', 'conversationsAreSynced', 'conversationsOrder'], ({
    settings, conversations, conversationsAreSynced, conversationsOrder,
  }) => {
    const {
      autoSync, autoArchiveOldChats, skipAutoArchiveFolder, autoArchiveMode, autoArchiveThreshold,
    } = settings;
    if (!autoSync) return;
    if (!conversationsAreSynced) return;
    if (!autoArchiveOldChats) return;

    chrome.runtime.sendMessage({
      checkHasSubscription: true,
      detail: {
        forceRefresh: false,
      },
    }, (hasSubscription) => {
      if (!hasSubscription) return;
      if (autoArchiveMode.code === 'days') {
        archiveByDate(conversationsOrder, conversations, autoArchiveThreshold, skipAutoArchiveFolder);
      } else if (autoArchiveMode.code === 'number') {
        archiveByCount(conversationsOrder, conversations, autoArchiveThreshold, skipAutoArchiveFolder);
      }
    });
  });
}

function archiveByDate(conversationsOrder, conversations, autoArchiveThreshold, skipAutoArchiveFolder) {
  const now = new Date();
  const threshold = autoArchiveThreshold;
  const thresholdDate = new Date(now.getTime() - threshold * 24 * 60 * 60 * 1000);
  const thresholdTimestamp = thresholdDate.getTime();
  const conversationsToArchive = Object.values(conversations).filter((c) => c.update_time < thresholdTimestamp);
  if (conversationsToArchive.length === 0) return;
  const conversationsToArchiveIds = conversationsToArchive.map((c) => c?.id);

  if (skipAutoArchiveFolder) {
    conversationsToArchiveIds.forEach((cid) => {
      if (!conversationsOrder.includes(cid)) {
        conversationsToArchiveIds.splice(conversationsToArchiveIds.indexOf(cid), 1);
      }
    });
  }
  confirmArchiveSelectedConversations(conversationsToArchiveIds);
}

function archiveByCount(conversationsOrder, conversations, autoArchiveThreshold, skipAutoArchiveFolder) {
  if (Object.values(conversations).length <= autoArchiveThreshold) return;
  const conversationsToArchive = Object.values(conversations).sort(
    (a, b) => b.update_time - a.update_time,
  ).slice(autoArchiveThreshold);

  const conversationsToArchiveIds = conversationsToArchive.map((c) => c?.id);

  if (skipAutoArchiveFolder) {
    conversationsToArchiveIds.forEach((cid) => {
      if (!conversationsOrder.includes(cid)) {
        conversationsToArchiveIds.splice(conversationsToArchiveIds.indexOf(cid), 1);
      }
    });
  }
  confirmArchiveSelectedConversations(conversationsToArchiveIds);
}
