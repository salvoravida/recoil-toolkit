export const backgroundPage: {
   connection?: chrome.runtime.Port;
} = {};

if (chrome.runtime) {
   console.log('Recoil Toolkit DevTools - Mounted!');
   backgroundPage.connection = chrome.runtime.connect({
      name: 'devtools-page',
   });

   backgroundPage.connection.postMessage({
      name: 'init',
      tabId: chrome.devtools.inspectedWindow.tabId,
   });
}
