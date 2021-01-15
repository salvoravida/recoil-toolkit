import { atom, selectorFamily, useRecoilValue } from 'recoil';
import { uniqueId } from '../_core';

type SelectorFunc = (s: any) => unknown;

const reduxSelectorsMap = new Map<number, (s: unknown) => unknown>();
const reduxSelectorsMapInv = new Map<(s: unknown) => unknown, number>();

const getSelectorId = (selectorFunc: SelectorFunc): number => {
   let cachedSelectorId = reduxSelectorsMapInv.get(selectorFunc);
   if (!cachedSelectorId) {
      const id = uniqueId();
      reduxSelectorsMapInv.set(selectorFunc, id);
      reduxSelectorsMap.set(id, selectorFunc);
      cachedSelectorId = id;
   }
   return cachedSelectorId;
};

export const reduxState = atom<unknown>({
   key: 'recoil-toolkit/reduxState',
   default: undefined,
});

const reduxSelectorFamily = selectorFamily<any, number>({
   key: 'recoil-toolkit/reduxSelectors',
   get: (selectorId: number) => ({ get }) => {
      const currentReduxState = get(reduxState);
      const selectorFunc = reduxSelectorsMap.get(selectorId);
      return currentReduxState && selectorFunc ? selectorFunc(currentReduxState) : undefined;
   },
});

export const reduxSelector = (selector: SelectorFunc) =>
   reduxSelectorFamily(getSelectorId(selector));

export function useReduxSelector<T>(selector: SelectorFunc) {
   return useRecoilValue<T>(reduxSelector(selector));
}
