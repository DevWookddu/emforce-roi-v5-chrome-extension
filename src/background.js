global.browser = require('webextension-polyfill');

function initTabById(tabId) {
  tabs[tabId] = [];
  setBadgeText(0);
}

function setBadgeText(val) {
  chrome.browserAction.setBadgeText({
    text: (val || 0).toString(),
  });
}

function setListToStorage(list) {
  chrome.storage.sync.set({
    list,
  });
}

chrome.storage.sync.clear();
chrome.storage.local.clear();

const tabs = {};

chrome.tabs.onCreated.addListener(tab => {
  initTabById(tab.id);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    initTabById(tabId);
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  const trackList = tabs[activeInfo.tabId];
  setBadgeText(trackList.length);
  setListToStorage(trackList);
});

chrome.webRequest.onBeforeRequest.addListener(
  ({ tabId, url, requestBody, method }) => {
    if (!['GET', 'POST'].includes(method)) {
      return;
    }
    const pushData = { url };
    if (requestBody) {
      const decodedBody = new TextDecoder().decode(new Uint8Array(requestBody.raw[0].bytes));
      pushData.params = JSON.parse(decodedBody);
    }
    const list = tabs[tabId];
    list.unshift(pushData);
    setBadgeText(list.length);
    setListToStorage(list);
  },
  {
    urls: ['*://*.emforce.co.kr/collector/*'],
  },
  ['requestBody']
);

chrome.webRequest.onCompleted.addListener(
  detail => {
    console.log(detail);
  },
  {
    urls: ['*://*.emforce.co.kr/conversion/**/analytics.js'],
  },
  []
);
