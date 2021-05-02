import { RecoilStore } from '../../types';

interface RecoilStores {
   [name: string]: RecoilStore | undefined;
}

export const recoilStores: RecoilStores = {};
export const DEFAULT_STORE = '$defaultStore$';

const pendigGetStorePromises: {
   resolve: (value: RecoilStore) => void;
   reject: (reason?: any) => void;
   name: string;
   pending: boolean;
}[] = [];

export const flushGetStorePending = (name: string) => {
   pendigGetStorePromises.forEach(p => {
      if (p.pending && p.name === name) {
         // @ts-ignore
         if (recoilStores[name]) {
            // @ts-ignore
            p.resolve(recoilStores[name]);
         } else p.reject(new Error('no store found'));
         p.pending = false;
      }
   });
};

export function getRecoilStore(name: string = DEFAULT_STORE): Promise<RecoilStore> {
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
