/*global chrome*/
const RecoilToolkitDevTools = {
   consolePrefix: 'recoil-toolkit: ',
   eventMessageFromPage: '@recoil-toolkit/msg-from-web-page',
   eventMessageToPage: '@recoil-toolkit/msg-to-web-page',
   enableConsole: '@recoil-toolkit/enable-content-script-console',
};

console.log(RecoilToolkitDevTools.consolePrefix + 'contentScript injected successfully!');

let enableConsole = false;
/*************** listen from web-page for recoil-toolkit messages ***************/

window.addEventListener(
   'message',
   function (event) {
      if (event.source !== window) return; // We only accept messages from ourselves

      if (event.data.type && event.data.type === RecoilToolkitDevTools.enableConsole) {
         enableConsole = !!event.data.enable;
         console.log(RecoilToolkitDevTools.consolePrefix + 'enableConsole', enableConsole);
      }

      if (event.data.type && event.data.type === RecoilToolkitDevTools.eventMessageFromPage) {
         if (enableConsole)
            console.log(RecoilToolkitDevTools.consolePrefix + 'contentScript eventMessageFromPage', event.data);

         chrome.runtime.sendMessage(event.data);
      }
   },
   false,
);

/*************** listen from backgroundScript for recoil-toolkit devtools messages ***************/

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
   if (sender.tab) return; // ignore messages from content scripts
   if (enableConsole)
      console.log(RecoilToolkitDevTools.consolePrefix + 'contentScript eventMessageToPage', message, sender);

   window.postMessage({ type: RecoilToolkitDevTools.eventMessageToPage, payload: message, sender }, '*');
});
