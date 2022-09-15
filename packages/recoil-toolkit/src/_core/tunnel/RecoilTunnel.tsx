import React, { useEffect, useRef, useState } from 'react';
import { useGotoRecoilSnapshot } from 'recoil';
import {
   useRecoilCurrentGetLoadable,
   useRecoilCurrentGetPromise,
   useRecoilCurrentRefresh,
   useRecoilCurrentReset,
   useRecoilCurrentSet,
   useRecoilCurrentSnapshot,
} from '../hooks';
import { DEFAULT_STORE, flushGetStorePending, recoilStores } from './getStore';

export const RecoilTunnel: React.FC<{ name?: string; services?: unknown[] }> = ({
   name = DEFAULT_STORE,
   children,
}) => {
   const storeName = useRef(name);

   const getPromise = useRecoilCurrentGetPromise();
   const getLoadable = useRecoilCurrentGetLoadable();
   const set = useRecoilCurrentSet();
   const reset = useRecoilCurrentReset();
   const refresh = useRecoilCurrentRefresh();
   const getSnapshot = useRecoilCurrentSnapshot();
   const gotoSnapshot = useGotoRecoilSnapshot();

   const [ready, setReady] = useState(false);

   useEffect(() => {
      recoilStores[storeName.current] = {
         getPromise,
         getLoadable,
         set,
         reset,
         refresh,
         getSnapshot,
         gotoSnapshot,
         //TODO add runTask
      };
      flushGetStorePending(storeName.current);
      setReady(true);
      return () => {
         recoilStores[storeName.current] = undefined;
         flushGetStorePending(storeName.current);
      };
   }, []);

   return ready ? <>{children}</> : null;
};
