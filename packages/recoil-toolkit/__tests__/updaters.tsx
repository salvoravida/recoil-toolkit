import * as React from 'react';
import { atom, RecoilRoot, useRecoilState } from 'recoil';
import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import {
   dec,
   decAbs,
   or,
   not,
   and,
   toggle,
   hide,
   inc,
   show,
   reverse,
   unshift,
   push,
   pushTop,
   filter,
   updateObj,
   removeObj,
} from '../src';

const counterAtom = atom({
   key: 'counterAtom',
   default: 0,
});

const useCounterAtom = () => {
   const [counter, setCounter] = useRecoilState(counterAtom);
   return { counter, setCounter };
};

const boolAtom = atom({
   key: 'boolAtom',
   default: false,
});

const useBoolAtom = () => {
   const [check, setCheck] = useRecoilState(boolAtom);
   return { check, setCheck };
};

const arrayAtom = atom<number[]>({
   key: 'arrayAtom',
   default: [],
});

const useArrayAtom = () => {
   const [value, set] = useRecoilState(arrayAtom);
   return { value, set };
};
type ObjAtom = { id: number; name: string };
const arrayObjAtom = atom<ObjAtom[]>({
   key: 'arrayObjAtom',
   default: [],
});

const useArrayObjAtom = () => {
   const [value, set] = useRecoilState(arrayObjAtom);
   return { value, set };
};

describe('updaters tests ', () => {
   test('numbers', async () => {
      const wrapper = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;
      const { result } = renderHook(() => useCounterAtom(), { wrapper });
      expect(result.current.counter).toEqual(0);
      act(() => {
         result.current.setCounter(dec);
      });
      expect(result.current.counter).toEqual(-1);
      act(() => {
         result.current.setCounter(decAbs);
      });
      expect(result.current.counter).toEqual(0);
      act(() => {
         result.current.setCounter(inc);
      });
      expect(result.current.counter).toEqual(1);
      act(() => {
         result.current.setCounter(show);
      });
      expect(result.current.counter).toEqual(2);
      act(() => {
         result.current.setCounter(hide);
      });
      expect(result.current.counter).toEqual(1);
      act(() => {
         result.current.setCounter(dec);
      });
      expect(result.current.counter).toEqual(0);
      act(() => {
         result.current.setCounter(decAbs);
      });
      expect(result.current.counter).toEqual(0);
   });
   test('boolean', async () => {
      const wrapper = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;
      const { result } = renderHook(() => useBoolAtom(), { wrapper });
      expect(result.current.check).toBe(false);
      act(() => {
         result.current.setCheck(toggle);
      });
      expect(result.current.check).toBe(true);
      act(() => {
         result.current.setCheck(not);
      });
      expect(result.current.check).toBe(false);
      act(() => {
         result.current.setCheck(or(null));
      });
      expect(result.current.check).toBe(false);
      act(() => {
         result.current.setCheck(toggle);
      });
      expect(result.current.check).toBe(true);
      act(() => {
         result.current.setCheck(and(false));
      });
      expect(result.current.check).toBe(false);
   });
   test('array', async () => {
      const wrapper = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;
      const { result } = renderHook(() => useArrayAtom(), { wrapper });
      expect(result.current.value).toEqual([]);
      act(() => {
         result.current.set([1, 2]);
      });
      expect(result.current.value).toEqual([1, 2]);
      act(() => {
         result.current.set(reverse);
      });
      expect(result.current.value).toEqual([2, 1]);
      act(() => {
         result.current.set(unshift(0));
      });
      expect(result.current.value).toEqual([0, 2, 1]);
      act(() => {
         result.current.set(push(0));
      });
      expect(result.current.value).toEqual([0, 2, 1, 0]);
      act(() => {
         result.current.set(pushTop(3));
      });
      expect(result.current.value).toEqual([3, 0, 2, 1, 0]);
      act(() => {
         result.current.set(filter(n => !!n));
      });
      expect(result.current.value).toEqual([3, 2, 1]);
      act(() => {
         result.current.set(unshift(0, 2));
      });
      expect(result.current.value).toEqual([0, 3]);
      act(() => {
         result.current.set(push(2));
      });
      expect(result.current.value).toEqual([0, 3, 2]);
      act(() => {
         result.current.set(push(9, 2));
      });
      expect(result.current.value).toEqual([2, 9]);
   });
   test('array obj', async () => {
      const wrapper = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;
      const { result } = renderHook(() => useArrayObjAtom(), { wrapper });
      expect(result.current.value).toEqual([]);
      act(() => {
         result.current.set([
            { id: 1, name: 'name1' },
            { id: 2, name: 'name2' },
         ]);
      });
      expect(result.current.value).toEqual([
         { id: 1, name: 'name1' },
         { id: 2, name: 'name2' },
      ]);
      act(() => {
         result.current.set(updateObj<ObjAtom>({ name: 'newName' }, { id: 1 }));
      });
      expect(result.current.value).toEqual([
         { id: 1, name: 'newName' },
         { id: 2, name: 'name2' },
      ]);
      act(() => {
         result.current.set(
            removeObj<ObjAtom>({ id: 2 }),
         );
      });
      expect(result.current.value).toEqual([{ id: 1, name: 'newName' }]);
   });
});
