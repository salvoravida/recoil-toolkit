import React, { useEffect } from 'react';
import { useRecoilSnapshot } from 'recoil';
import { RecoilToolkitDevTools } from './consts';
import { getSnapshotState } from './getSnapshotState';

export const RecoilDevTools: React.FC<{ enableConsole?: boolean }> = ({ enableConsole }) => {
   const snapshot = useRecoilSnapshot();

   useEffect(() => {
      window.postMessage(
         { type: RecoilToolkitDevTools.enableConsole, enable: !!enableConsole },
         '*',
      );
   }, [enableConsole]);

   /** Send Snapshot to DevTools **/
   useEffect(() => {
      const snapState = getSnapshotState(snapshot);
      window.postMessage(
         { type: RecoilToolkitDevTools.eventMessageFromPage, data: snapState },
         '*',
      );
   }, [snapshot]);

   /** Listen messages from DevTools **/
   useEffect(() => {
      const onMessage = function (event: WindowEventMap['message']) {
         // We only accept messages from ourselves
         if (event.source !== window) return;
         if (event.data.type && event.data.type === RecoilToolkitDevTools.eventMessageToPage) {
            console.log('DebugObserver Message Received: ', event.data);
         }
      };
      window.addEventListener('message', onMessage, false);
      return () => {
         window.removeEventListener('message', onMessage, false);
      };
   }, []);

   return null;
};
