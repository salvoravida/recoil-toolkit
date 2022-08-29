/*global chrome*/
const RecoilToolkitDevTools = {
   consolePrefix: 'recoil-toolkit: ',
   eventMessageFromPage: '@recoil-toolkit/msg-from-web-page',
   eventMessageToPage: '@recoil-toolkit/msg-to-web-page',
};

chrome.runtime.onInstalled.addListener(() => {
   console.log(RecoilToolkitDevTools.consolePrefix + 'DevTools installed successfully!', chrome.runtime.id);
});

var connections = {};

var portsToIds = {};

//on tab DevTools panel connect
chrome.runtime.onConnect.addListener(function (port) {
   console.log(RecoilToolkitDevTools.consolePrefix + 'backgroundScript ---- chrome.runtime.onConnect --- raw', port);

   var extensionListener = function (message, sender, sendResponse) {
      // The original connection event doesn't include the tab ID of the
      // DevTools page, so we need to send it explicitly.
      if (message.name === 'init') {
         connections[message.tabId] = port;
         portsToIds[port] = message.tabId;
         console.log(RecoilToolkitDevTools.consolePrefix + 'backgroundScript ---- Received a DevTools init: ', message);
         return;
      }
      console.log(
         RecoilToolkitDevTools.consolePrefix +
            'backgroundScript ---- Received a DevTools message --- relay to content script: ',
         message,
      );
      if (portsToIds[port]) {
         chrome.tabs.sendMessage(portsToIds[port], message);
      }

      /*      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         console.log(
            RecoilToolkitDevTools.consolePrefix +
               'backgroundScript ---- Received a DevTools message --- relay to content script tab 0',
            tabs[0],
            tabs,
         );
         chrome.tabs.sendMessage(tabs[0].id, message);
      });*/
   };

   // Listen to messages sent from the DevTools page
   port.onMessage.addListener(extensionListener);

   port.onDisconnect.addListener(function (port) {
      delete portsToIds[port];
      port.onMessage.removeListener(extensionListener);
      var tabs = Object.keys(connections);
      for (var i = 0, len = tabs.length; i < len; i++) {
         if (connections[tabs[i]] === port) {
            delete connections[tabs[i]];
            break;
         }
      }
   });
});

// Receive message from content script and relay to the devTools page for the current tab
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
   console.log(
      RecoilToolkitDevTools.consolePrefix + 'backgroundScript --- chrome.runtime.onMessage --- raw',
      message,
      sender,
   );
   // Messages from content scripts should have sender.tab set
   if (sender.tab) {
      var tabId = sender.tab.id;
      if (tabId in connections) {
         console.log(
            RecoilToolkitDevTools.consolePrefix +
               'backgroundScript --- chrome.runtime.onMessage --- Message From ContentScript To devTools Panel: ',
            tabId,
            message,
         );
         connections[tabId].postMessage(message);
      } else {
         console.log(
            RecoilToolkitDevTools.consolePrefix +
               'backgroundScript --- chrome.runtime.onMessage --- Tab not found in connection list.',
         );
      }
   } else {
      console.log(
         RecoilToolkitDevTools.consolePrefix +
            'backgroundScript --- chrome.runtime.onMessage --- sender.tab not defined.',
      );
   }
});
