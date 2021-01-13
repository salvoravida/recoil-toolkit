import { atom, selector, selectorFamily, useRecoilValue, useResetRecoilState } from 'recoil';
import { ErrorAtom } from '../types';

export const ERRORS_STACK_SIZE = 100;

export const errorStack = atom<ErrorAtom[]>({
   key: 'recoil-toolkit/errorStack',
   default: [],
});

export const lastError = selector<ErrorAtom | undefined>({
   key: 'recoil-toolkit/lastError',
   get: ({ get }) => {
      const e = get(errorStack);
      return e.length > 0 ? e[e.length - 1] : undefined;
   },
});

export const lastErrorType = selectorFamily<ErrorAtom | undefined, string>({
   key: 'recoil-toolkit/lastErrorType',
   get: (key: string) => ({ get }) => {
      return get(errorStack)
         .filter(e => e.key === key)
         .pop();
   },
});

export const useLastError = (key?: string) => useRecoilValue(key ? lastErrorType(key) : lastError);

export const useResetErrors = () => useResetRecoilState(errorStack);
