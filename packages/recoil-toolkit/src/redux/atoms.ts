import { atom, selectorFamily } from 'recoil';
import { uniqueId } from '../_core';
import { ReduxSelectorFunc } from './types';

const reduxSelectorsMap = new Map<number, ReduxSelectorFunc>();
const reduxSelectorsMapInv = new Map<ReduxSelectorFunc, number>();

function getSelectorId(selectorFunc: ReduxSelectorFunc): number {
   let cachedSelectorId = reduxSelectorsMapInv.get(selectorFunc);
   if (!cachedSelectorId) {
      const id = uniqueId();
      reduxSelectorsMapInv.set(selectorFunc, id);
      reduxSelectorsMap.set(id, selectorFunc);
      cachedSelectorId = id;
   }
   return cachedSelectorId;
}

export const reduxState = atom<unknown>({
   key: 'recoil-toolkit/reduxState',
   default: undefined,
});

const reduxSelectorFamily = selectorFamily<unknown, number>({
   key: 'recoil-toolkit/reduxSelectors',
   get: (selectorId: number) => ({ get }) => {
      const currentReduxState = get(reduxState);
      const selectorFunc = reduxSelectorsMap.get(selectorId);
      return currentReduxState && selectorFunc ? selectorFunc(currentReduxState) : undefined;
   },
});

export function reduxSelector(selector: ReduxSelectorFunc) {
   return reduxSelectorFamily(getSelectorId(selector));
}
