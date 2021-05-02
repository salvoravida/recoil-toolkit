import * as React from 'react';
import { atom, RecoilRoot, useRecoilValue } from 'recoil';
import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import { getRecoilStore, inc, RecoilTunnel } from '../src';

const counterAtom = atom({
   key: 'counterAtom',
   default: 0,
});

const useCounterAtom = () => {
   return useRecoilValue(counterAtom);
};

describe('Recoil tunnel tests ', () => {
   test('Can set recoil atom outside react ', async () => {
      const wrapper = ({ children }) => (
         <RecoilRoot>
            <RecoilTunnel />
            {children}
        </RecoilRoot>
      );
      const { result } = renderHook(() => useCounterAtom(), { wrapper });
      expect(result.current).toEqual(0);
      const recoilStore = await getRecoilStore();
      act(() => {
         recoilStore.set(counterAtom, inc);
      });
      expect(result.current).toEqual(1);
   });

   test('Can set recoil atom outside react with name ', () => {
      const wrapper = ({ children }) => (
         <RecoilRoot>
            <RecoilTunnel name="RecoilStoreTest1" />
            {children}
        </RecoilRoot>
      );
      const promise = getRecoilStore('RecoilStoreTest1');
      const { result } = renderHook(() => useCounterAtom(), { wrapper });

      return promise.then(recoilStore => {
         act(() => {
            recoilStore.set(counterAtom, inc);
         });
         expect(result.current).toEqual(1);
      });
   });
});
