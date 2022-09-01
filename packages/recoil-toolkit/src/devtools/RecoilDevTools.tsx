import React, { useEffect } from 'react';
import { useRecoilSnapshot } from 'recoil';
import { RecoilToolkitDevTools } from './consts';
import { getSnapshotState } from './getSnapshotState';

const stringifyCircularJSON = obj => {
   const seen = new WeakSet();
   return JSON.stringify(obj, (k, v) => {
      if (v !== null && typeof v === 'object') {
         if (seen.has(v)) return '[Circular]';
         seen.add(v);
      }
      return v;
   });
};

export const RecoilDevTools: React.FC<{ enableConsole?: boolean; forceSerialize?: boolean }> = ({
   enableConsole,
   forceSerialize,
}) => {
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
         {
            type: RecoilToolkitDevTools.eventMessageFromPage,
            data: forceSerialize ? JSON.parse(stringifyCircularJSON(snapState)) : snapState,
         },
         '*',
      );
   }, [snapshot]); //eslint-disable-line

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
