import { atomFamily, selectorFamily, useRecoilValue } from 'recoil';

export const DEFAULT_LOADER = 'recoil-toolkit/loader/global';

export const loader = atomFamily<number, string>({
   key: 'recoil-toolkit/loader',
   default: 0,
});

export const isLoading = selectorFamily<boolean, string>({
   key: 'recoil-toolkit/loader/isLoading',
   get: (key: string) => ({ get }) => get(loader(key)) > 0,
});

export const useIsLoading = (key?: string) => useRecoilValue(isLoading(key || DEFAULT_LOADER));
