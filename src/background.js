global.browser = require('webextension-polyfill');

function initTabById(tabId) {
  tabs[tabId] = [];
  setBadgeText(0);
  setListToStorage([]);
}

function setBadgeText(val) {
  chrome.browserAction.setBadgeText({
    text: (val || 0).toString(),
  });
}

function setListToStorage(list) {
  chrome.storage.local.set({
    list,
  });
}

chrome.storage.local.clear();

const tabs = {};

// 탭 선택시
chrome.tabs.onActivated.addListener(activeInfo => {
  const trackList = tabs[activeInfo.tabId] || [];
  setBadgeText(trackList.length);
  setListToStorage(trackList);
});

// 신규 탭 생성시 초기화
chrome.tabs.onCreated.addListener(tab => {
  initTabById(tab.id);
});

// 탭이 새로 로딩되거나 페이지 변경됐거나 했을 때
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    initTabById(tabId);
  }
});

// API 호출시 후킹
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

// analytics.js 로드 완료시. 나중에 처리할 일 있으면 처리.
chrome.webRequest.onCompleted.addListener(
  detail => {
    console.log(detail);
  },
  {
    urls: ['*://*.emforce.co.kr/conversion/**/analytics.js'],
  },
  []
);
