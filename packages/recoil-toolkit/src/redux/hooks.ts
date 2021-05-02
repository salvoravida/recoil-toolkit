import { useRecoilValue } from 'recoil';
import { useContext } from 'react';
import { reduxSelector } from './atoms';
import { ReduxSelectorFunc } from './types';
import { RecoilReduxContext } from './context';

export function useReduxSelector(selector: ReduxSelectorFunc) {
   return useRecoilValue(reduxSelector(selector));
}

export function useReduxDispatch() {
   const { store } = useContext(RecoilReduxContext);
   if (!store) throw new Error('ReduxTunnel with reduxStore not found!');
   return store.dispatch;
}
