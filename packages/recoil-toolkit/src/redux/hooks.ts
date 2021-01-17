import { useRecoilValue } from 'recoil';
import { useContext } from 'react';
import { reduxSelector } from './atoms';
import { ReduxSelectorFunc } from './types';
import { RecoilReduxContext } from './context';

export function useReduxSelector(selector: ReduxSelectorFunc) {
   return useRecoilValue(reduxSelector(selector));
}

export function useReduxDispatch() {
   const reduxContext = useContext(RecoilReduxContext);
   if (!reduxContext) throw 'ReduxTunnel not found!';
   const { store } = reduxContext;
   if (!store) throw 'reduxStore not found!';
   return store.dispatch;
}
