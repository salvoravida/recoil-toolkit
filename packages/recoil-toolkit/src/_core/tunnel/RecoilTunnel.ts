import { useEffect, useRef, memo } from 'react';
import { useGotoRecoilSnapshot } from 'recoil';
import {
   useRecoilCurrentGetLoadable,
   useRecoilCurrentGetPromise,
   useRecoilCurrentReset,
   useRecoilCurrentSet,
   useRecoilCurrentSnap,
} from '../hooks';
import { DEFAULT_STORE, flushGetStorePending, recoilStores } from './getStore';

export const RecoilTunnel = memo(({ name = DEFAULT_STORE }: { name?: string }) => {
   const storeName = useRef(name);

   const getPromise = useRecoilCurrentGetPromise();
   const getLoadable = useRecoilCurrentGetLoadable();
   const set = useRecoilCurrentSet();
   const reset = useRecoilCurrentReset();
   const getSnapshot = useRecoilCurrentSnap();
   const gotoSnapshot = useGotoRecoilSnapshot();

   useEffect(() => {
      recoilStores[storeName.current] = {
         getPromise,
         getLoadable,
         set,
         reset,
         getSnapshot,
         gotoSnapshot,
         //TODO add runTask
      };
      flushGetStorePending(storeName.current);
      return () => {
         recoilStores[storeName.current] = undefined;
         flushGetStorePending(storeName.current);
      };
   }, []);

   return null;
});
