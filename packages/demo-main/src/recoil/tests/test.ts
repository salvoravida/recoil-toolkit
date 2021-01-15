import { atom, selector } from 'recoil';
import {
   inc,
   RecoilGetPromise,
   RecoilTaskInterface,
   useRecoilCurrentGet,
   useRecoilTask,
} from 'recoil-toolkit';

const counter = atom({
   key: 'counter',
   default: 0,
});

const counterSelector = selector({
   key: 'counterSelector',
   get: async ({ get }) => get(counter),
});

const testTask = (getCurrent: RecoilGetPromise) => ({
   snapshot,
   set,
}: RecoilTaskInterface) => async () => {
   for (let i = 0; i < 20; i++) {
      let current = await getCurrent(counterSelector);
      let old = await snapshot.getPromise(counterSelector);
      console.log('current, old ', current, old);
      set(counter, inc);
   }
};
export const useTestTask = () => {
   const getCurrent = useRecoilCurrentGet();
   return useRecoilTask(testTask(getCurrent), [getCurrent]);
};
