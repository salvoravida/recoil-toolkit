import { useEffect, useRef, memo } from 'react';
import { useGotoRecoilSnapshot } from 'recoil';
import { RecoilStore } from '../../types';
import {
   useRecoilCurrentGetLoadable,
   useRecoilCurrentGetPromise,
   useRecoilCurrentReset,
   useRecoilCurrentSet,
   useRecoilCurrentSnap,
} from '../hooks';

interface RecoilStores {
   [name: string]: RecoilStore | undefined;
}

const recoilStores: RecoilStores = {};

const DEFAULT_STORE = '$defaultStore$';

const pendigGetStorePromises: {
   resolve: (value: RecoilStore) => void;
   reject: (reason?: any) => void;
   name: string;
   pending: boolean;
}[] = [];

const flushGetStorePending = (name: string) => {
   pendigGetStorePromises.forEach(p => {
      if (p.pending && p.name === name) {
         // @ts-ignore
         if (recoilStores[name]) {
            // @ts-ignore
            p.resolve(recoilStores[name]);
         } else p.reject('no store found');
         p.pending = false;
      }
   });
};

export function getRecoilStore(name: string = DEFAULT_STORE) {
   return new Promise<RecoilStore>((resolve, reject) => {
      if (recoilStores[name]) {
         // @ts-ignore
         resolve(recoilStores[name]);
      } else {
         pendigGetStorePromises.push({
            resolve,
            reject,
            name,
            pending: true,
         });
      }
   });
}

export const RecoilTunnel = memo(({ name = DEFAULT_STORE }: { name?: string }) => {
   const storeName = useRef(name || DEFAULT_STORE);

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
