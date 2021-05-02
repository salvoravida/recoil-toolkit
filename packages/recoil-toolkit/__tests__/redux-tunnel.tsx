import * as React from 'react';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { atom, RecoilRoot, selector, useRecoilState, useRecoilValue } from 'recoil';
import { createStore } from 'redux';
import { inc, reduxSelector, ReduxTunnel, useReduxDispatch, useReduxSelector } from '../src';

const getStore = () =>
   createStore((state: { count: number } = { count: 0 }, action) => {
      switch (action.type) {
         case 'INCREMENT':
            return {
               count: state.count + 1,
            };
         case 'DECREMENT':
            return {
               count: state.count - 1,
            };
         default:
            return state;
      } // @ts-ignore
   });

const getReduxCount = (s: { count: number }) => s.count;

const counterAtom = atom({ key: 'counter', default: 0 });

const maxCounterType = selector<string>({
   key: 'maxCounter',
   get: ({ get }) => {
      const re = get(counterAtom);
      //reduxSelector allow recoil to reactive on redux selector change (memoized)
      const rx = get(reduxSelector(getReduxCount)) as number;
      return re === rx ? '' : re > rx ? 'recoil' : 'redux';
   },
});

function useReduxCounter() {
   const reduxCount = useReduxSelector(getReduxCount);
   const dispatch = useReduxDispatch();
   const [recoilCounter, setCounter] = useRecoilState(counterAtom);
   const maxType = useRecoilValue(maxCounterType);
   const incrementRedux = () => dispatch({ type: 'INCREMENT' });
   const incrementRecoil = () => setCounter(inc);
   return {
      reduxCount,
      recoilCounter,
      incrementRedux,
      incrementRecoil,
      maxType,
   };
}

describe('Redux tunnel tests ', () => {
   test('ReduxTunnel not found error', () => {
      const wrapper = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;
      const { result } = renderHook(() => useReduxCounter(), { wrapper });
      expect(result.error).toEqual(Error('ReduxTunnel with reduxStore not found!'));
   });

   test('Recoil selector can access redux store', () => {
      const wrapper = ({ children }) => (
         <RecoilRoot>
            <ReduxTunnel reduxStore={getStore()}>{children}</ReduxTunnel>
        </RecoilRoot>
      );
      const { result } = renderHook(() => useReduxCounter(), { wrapper });
      expect(result.current.reduxCount).toEqual(0);
      expect(result.current.recoilCounter).toEqual(0);
      expect(result.current.maxType).toEqual('');
      act(() => {
         result.current.incrementRedux();
      });
      expect(result.current.reduxCount).toEqual(1);
      expect(result.current.recoilCounter).toEqual(0);
      expect(result.current.maxType).toEqual('redux');
      act(() => {
         result.current.incrementRecoil();
      });
      expect(result.current.reduxCount).toEqual(1);
      expect(result.current.recoilCounter).toEqual(1);
      expect(result.current.maxType).toEqual('');
      act(() => {
         result.current.incrementRecoil();
      });
      expect(result.current.reduxCount).toEqual(1);
      expect(result.current.recoilCounter).toEqual(2);
      expect(result.current.maxType).toEqual('recoil');
   });
});
